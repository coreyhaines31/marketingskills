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
import { resolve } from "node:path";

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

function provider() {
  if (process.env.ANTHROPIC_API_KEY) {
    return { name: "anthropic", model: process.env.EVAL_MODEL || "claude-sonnet-4-6" };
  }
  if (process.env.OPENAI_API_KEY) {
    return { name: "openai", model: process.env.EVAL_MODEL || "gpt-4.1" };
  }
  throw new Error("Set ANTHROPIC_API_KEY or OPENAI_API_KEY in your environment first.");
}

export function activeModel() {
  return provider().model;
}

// Returns { text, usage: { input, output }, ms }.
async function callModel(system, user) {
  const p = provider();
  const start = Date.now();

  if (p.name === "anthropic") {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: p.model,
        max_tokens: 4096,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!r.ok) throw new Error(`Anthropic ${r.status}: ${await r.text()}`);
    const j = await r.json();
    return {
      text: j.content[0].text,
      usage: { input: j.usage?.input_tokens ?? 0, output: j.usage?.output_tokens ?? 0 },
      ms: Date.now() - start,
    };
  }

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: p.model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!r.ok) throw new Error(`OpenAI ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return {
    text: j.choices[0].message.content,
    usage: { input: j.usage?.prompt_tokens ?? 0, output: j.usage?.completion_tokens ?? 0 },
    ms: Date.now() - start,
  };
}

// Grade an array of input strings against a judge.
// Returns { results: [{ index, verdict, ... }], usage: { input, output }, ms }.
export async function grade(judgeDir, inputs) {
  const judge = loadJudge(judgeDir);
  const numbered = inputs.map((h, i) => `${i + 1}. ${h}`).join("\n");
  const { text, usage, ms } = await callModel(judge, `Grade these:\n\n${numbered}`);
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`Could not parse a JSON array from the model:\n${text}`);
  return { results: JSON.parse(match[0]), usage, ms };
}
