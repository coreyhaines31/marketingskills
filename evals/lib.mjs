// Shared judge-calling logic for the marketing eval framework.
// Zero dependencies — native fetch (Node 18+). Bring your own API key.
//
// A "judge" is a folder under evals/judges/<name>/ containing:
//   JUDGE.md        — the rubric (everything after the first `---` is the prompt)
//   answer-key.json — [{ input, verdict }, ...] hand-labeled by a human
//
// Provider is auto-detected from the environment:
//   ANTHROPIC_API_KEY  -> Anthropic  (default model: claude-sonnet-4-6)
//   OPENAI_API_KEY     -> OpenAI     (default model: gpt-4.1)
// Override the model with EVAL_MODEL.
//
// Every model call also captures tokens + latency, so the framework can be
// triaxial (quality x cost x time), not quality-only.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

// Versioned model registry + pricing (provider, key env, $/1M tokens). Doubles
// as the benchmark's contestant/judge registry. Edit evals/pricing.json to add
// models or update prices; it carries an "asOf" date.
export function loadPricing() {
  return JSON.parse(readFileSync(resolve(HERE, "pricing.json"), "utf8"));
}
export function modelInfo(modelId) {
  const reg = loadPricing().models;
  const info = reg[modelId];
  if (!info) throw new Error(`Unknown model "${modelId}" — add it to evals/pricing.json`);
  return info;
}

// Load a judge's rubric. Strips the human-facing header (everything before the
// first `---` line); sends only the calibrated rubric to the model.
export function loadJudge(judgeDir) {
  const raw = readFileSync(resolve(judgeDir, "JUDGE.md"), "utf8");
  const parts = raw.split(/\n---\n/);
  return (parts.length > 1 ? parts.slice(1).join("\n---\n") : raw).trim();
}

export function loadAnswerKey(judgeDir) {
  return JSON.parse(readFileSync(resolve(judgeDir, "answer-key.json"), "utf8"));
}

// Auto-detect a judge model from the environment (used by harness/grade when no
// model is named).
function autoProvider() {
  if (process.env.ANTHROPIC_API_KEY) return { provider: "anthropic", model: process.env.EVAL_MODEL || "claude-sonnet-4-6" };
  if (process.env.OPENAI_API_KEY) return { provider: "openai", model: process.env.EVAL_MODEL || "gpt-4.1" };
  throw new Error("Set ANTHROPIC_API_KEY or OPENAI_API_KEY in your environment first.");
}

export function activeModel() {
  return autoProvider().model;
}

// One HTTP call to a provider. Returns { text, usage: { input, output }, ms }.
// `baseURL` lets any OpenAI-compatible provider (Moonshot/Kimi, Gemini's compat
// endpoint, Together, etc.) be a contestant without new code.
async function callProvider(provider, model, apiKey, system, user, baseURL) {
  if (!apiKey) throw new Error(`Missing API key for ${provider} model ${model}`);
  const start = Date.now();

  if (provider === "anthropic") {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      // Generous ceiling: a full batch returns one verbose JSON object per input;
      // 4096 can truncate a 20-item batch mid-array and break JSON parsing.
      body: JSON.stringify({ model, max_tokens: 8192, system, messages: [{ role: "user", content: user }] }),
    });
    if (!r.ok) throw new Error(`Anthropic ${r.status}: ${await r.text()}`);
    const j = await r.json();
    return { text: j.content[0].text, usage: { input: j.usage?.input_tokens ?? 0, output: j.usage?.output_tokens ?? 0 }, ms: Date.now() - start };
  }

  if (provider === "openai" || provider === "openai-compatible") {
    const url = (baseURL || "https://api.openai.com/v1").replace(/\/$/, "") + "/chat/completions";
    const r = await fetch(url, {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ model, messages: [{ role: "system", content: system }, { role: "user", content: user }] }),
    });
    if (!r.ok) throw new Error(`${provider} ${r.status}: ${await r.text()}`);
    const j = await r.json();
    return { text: j.choices[0].message.content, usage: { input: j.usage?.prompt_tokens ?? 0, output: j.usage?.completion_tokens ?? 0 }, ms: Date.now() - start };
  }

  throw new Error(`Unknown provider "${provider}"`);
}

// Auto-detected judge call (harness/grade path). Returns { text, usage, ms }.
async function callModel(system, user) {
  const p = autoProvider();
  const key = p.provider === "anthropic" ? process.env.ANTHROPIC_API_KEY : process.env.OPENAI_API_KEY;
  return callProvider(p.provider, p.model, key, system, user);
}

// Explicit-model call (benchmark path). Resolves provider + key from the
// pricing registry. Returns { text, usage, ms }.
export async function callModelWith(modelId, system, user) {
  const info = modelInfo(modelId);
  return callProvider(info.provider, info.apiModel || modelId, process.env[info.keyEnv], system, user, info.baseURL);
}

// Cost in USD for a usage object, from the versioned pricing table.
export function costUSD(modelId, usage) {
  const info = modelInfo(modelId);
  return (usage.input / 1e6) * (info.priceIn ?? 0) + (usage.output / 1e6) * (info.priceOut ?? 0);
}

// Extract the results array from a model response. Robust to prose wrappers,
// code fences, and stray brackets: it collects every top-level, string-aware
// balanced `[...]`, JSON-parses each, and prefers the one that's an array of
// objects (the results shape) — so `Note [x]` or a stray `[1,2]` in prose
// before the real array can't win, and there's no greedy first-[-to-last-]
// trap or fence-regex ambiguity.
export function parseJsonArray(text) {
  const body = text.trim();

  // Fast path: the whole response is the array.
  try {
    const v = JSON.parse(body);
    if (Array.isArray(v)) return v;
  } catch {}

  // Fallback: find the results array by its shape — a `[` whose first non-space
  // char is `{` (an array of objects). Starting only at `[{` means stray or
  // unbalanced brackets in prose (`Note [x]`, `[1,2,3]`, `log [not closed`)
  // can't derail the scan. Balance string-aware from there; return the first
  // that parses.
  for (let i = 0; i < body.length; i++) {
    if (body[i] !== "[") continue;
    let j = i + 1;
    while (j < body.length && /\s/.test(body[j])) j++;
    if (body[j] !== "{") continue;

    let depth = 0, inStr = false, esc = false;
    for (let k = i; k < body.length; k++) {
      const c = body[k];
      if (inStr) {
        if (esc) esc = false;
        else if (c === "\\") esc = true;
        else if (c === '"') inStr = false;
      } else if (c === '"') inStr = true;
      else if (c === "[") depth++;
      else if (c === "]" && --depth === 0) {
        try {
          const v = JSON.parse(body.slice(i, k + 1));
          if (Array.isArray(v)) return v;
        } catch {}
        break; // this candidate didn't parse; move to the next `[{`
      }
    }
  }
  throw new Error(`No JSON array of objects in model output:\n${text}`);
}

// Every input must get exactly one verdict, or agreement counts are corrupt —
// fail loud rather than silently miscount.
export function validateResults(results, n) {
  if (!Array.isArray(results) || results.length !== n) {
    throw new Error(`Expected ${n} results, got ${Array.isArray(results) ? results.length : typeof results}`);
  }
  const seen = new Set();
  for (const r of results) {
    const idx = r && r.index;
    if (!Number.isInteger(idx) || idx < 1 || idx > n) throw new Error(`Result index out of range: ${idx} (expected 1..${n})`);
    if (seen.has(idx)) throw new Error(`Duplicate result index: ${idx}`);
    if (r.verdict !== "PASS" && r.verdict !== "FAIL") throw new Error(`Invalid verdict "${r.verdict}" at index ${idx}`);
    seen.add(idx);
  }
  return results;
}

function buildPrompt(inputs) {
  return `Grade these:\n\n${inputs.map((h, i) => `${i + 1}. ${h}`).join("\n")}`;
}

// Grade an array of input strings against a judge, using the auto-detected model.
// Returns { results: [{ index, verdict, ... }], usage: { input, output }, ms }.
export async function grade(judgeDir, inputs) {
  const { text, usage, ms } = await callModel(loadJudge(judgeDir), buildPrompt(inputs));
  return { results: validateResults(parseJsonArray(text), inputs.length), usage, ms };
}

// Grade against a specific judge model (benchmark path — pins the grader).
export async function gradeWith(judgeDir, inputs, modelId) {
  const { text, usage, ms } = await callModelWith(modelId, loadJudge(judgeDir), buildPrompt(inputs));
  return { results: validateResults(parseJsonArray(text), inputs.length), usage, ms };
}
