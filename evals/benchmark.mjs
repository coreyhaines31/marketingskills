#!/usr/bin/env node
// Marketing model benchmark (issue #480): rank models on a marketing task by
// QUALITY x COST x TIME. Each contestant model GENERATES outputs for a task set;
// a fixed, blind JUDGE grades them (optionally by 2-model consensus). Aggregates
// into a leaderboard: pass-rate, avg gen tokens, avg latency, cost, and the
// metric that decides routing — cost per ACCEPTED output.
//
//   node benchmark.mjs                         # uses benchmark/config.json
//   node benchmark.mjs my-config.json
//   node benchmark.mjs --dry-run               # validate + print the plan, no API calls
//
// The generator/judge split is load-bearing: a contestant model must never be
// the judge of its own outputs (self-preference bias). The judge sees only the
// text, so grading is blind by construction. Prices/models live in pricing.json.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadPricing, modelInfo, callModelWith, gradeWith, costUSD } from "./lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const cfgArg = args.find((a) => !a.startsWith("-"));
// Explicit config path is cwd-relative; the default lives next to this script.
const cfgPath = cfgArg ? resolve(cfgArg) : resolve(HERE, "benchmark/config.json");
const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));

// All config paths resolve relative to evals/, so a run works from any cwd.
const judgeLabel = cfg.judge;                        // e.g. "judges/ad-hooks"
const judgeDir = resolve(HERE, cfg.judge);
const judgeModels = cfg.judgeModels || [];
const contestants = cfg.contestants || [];
const samples = cfg.samplesPerTask || 1;
const taskSpec = JSON.parse(readFileSync(resolve(HERE, cfg.tasks), "utf8"));
const briefs = taskSpec.briefs;
const genInstruction = taskSpec.generate;

// Integrity gates (fail before any API call, incl. dry-run):
if (!judgeModels.length) { console.error("config.judgeModels must list at least one model (a judge)."); process.exit(1); }
if (!contestants.length) { console.error("config.contestants must list at least one model."); process.exit(1); }
const selfJudge = contestants.filter((c) => judgeModels.includes(c));
if (selfJudge.length) {
  console.error(`A model must not judge its own outputs (self-preference bias): ${selfJudge.join(", ")} appears in BOTH contestants and judgeModels. Use a judge from a different lab.`);
  process.exit(1);
}

// ---- validation / dry-run -------------------------------------------------
function keyPresent(modelId) {
  try { return !!process.env[modelInfo(modelId).keyEnv]; } catch { return false; }
}

console.error(bold(`\nMarketing Model Benchmark`));
console.error(dim(`judge:        ${judgeLabel}  (grader: ${judgeModels.join(" + ")}${judgeModels.length > 1 ? " · consensus" : ""})`));
console.error(dim(`task set:     ${cfg.tasks}  (${briefs.length} briefs x ${samples} sample${samples > 1 ? "s" : ""})`));
console.error(dim(`contestants:  ${contestants.length}`));
console.error(dim(`pricing asOf: ${loadPricing().asOf}\n`));

const allModels = [...new Set([...contestants, ...judgeModels])];
let missing = false;
for (const m of allModels) {
  const ok = keyPresent(m);
  if (!ok) missing = true;
  console.error(dim(`  ${ok ? "✓" : "✗"} ${m}  (key ${modelInfo(m).keyEnv}${ok ? " set" : " MISSING"})`));
}
console.error("");

if (dryRun) {
  const genCalls = contestants.length * briefs.length * samples;
  const judgeCalls = judgeModels.length * contestants.length; // batched per contestant
  console.error(bold("DRY RUN — no API calls."));
  console.error(dim(`plan: ${genCalls} generation calls + ~${judgeCalls} judge batches`));
  process.exit(missing ? 1 : 0);
}
if (missing) {
  console.error("Missing API keys above — set them or trim contestants/judgeModels. Aborting.");
  process.exit(1);
}

// ---- run ------------------------------------------------------------------
// Judge a batch of outputs with 1..N judge models; PASS only if ALL judges PASS.
async function judgeConsensus(outputs) {
  const perModel = [];
  for (const jm of judgeModels) {
    const { results } = await gradeWith(judgeDir, outputs, jm);
    const byIdx = new Map(results.map((r) => [r.index, r]));
    perModel.push(byIdx);
  }
  return outputs.map((_, i) => {
    const idx = i + 1;
    const verdicts = perModel.map((m) => m.get(idx)?.verdict);
    return verdicts.every((v) => v === "PASS") ? "PASS" : "FAIL";
  });
}

const rows = [];
for (const model of contestants) {
  const outputs = [];
  let genTokIn = 0, genTokOut = 0, genMs = 0, genCost = 0;

  for (const brief of briefs) {
    for (let s = 0; s < samples; s++) {
      const { text, usage, ms } = await callModelWith(model, genInstruction, brief);
      outputs.push(text.trim().replace(/^["']|["']$/g, ""));
      genTokIn += usage.input; genTokOut += usage.output; genMs += ms;
      genCost += costUSD(model, usage);
    }
  }

  const verdicts = await judgeConsensus(outputs);
  const passes = verdicts.filter((v) => v === "PASS").length;
  const n = outputs.length;
  rows.push({
    model,
    passRate: passes / n,
    passes, n,
    avgTokens: Math.round((genTokIn + genTokOut) / n),
    avgLatencyMs: Math.round(genMs / n),
    genCost,
    costPerAccepted: passes ? genCost / passes : Infinity,
  });
  console.error(dim(`  ${model}: ${passes}/${n} pass`));
}

// ---- leaderboard ----------------------------------------------------------
rows.sort((a, b) => b.passRate - a.passRate);
const pct = (x) => (x * 100).toFixed(1) + "%";
const usd = (x) => (x === Infinity ? "—" : "$" + x.toFixed(4));

console.log("\n" + bold("LEADERBOARD") + dim(`  — ${judgeLabel}, graded by ${judgeModels.join("+")}\n`));
console.log(["#", "model".padEnd(20), "quality", "avg tok", "lat p~", "gen cost", "cost/accepted"].join("  "));
rows.forEach((r, i) => {
  console.log([
    String(i + 1).padEnd(1),
    r.model.padEnd(20),
    pct(r.passRate).padStart(7),
    String(r.avgTokens).padStart(7),
    (`${(r.avgLatencyMs / 1000).toFixed(1)}s`).padStart(6),
    usd(r.genCost).padStart(9),
    usd(r.costPerAccepted).padStart(13),
  ].join("  "));
});
console.log(dim(`\nQuality = judge pass-rate (blind${judgeModels.length > 1 ? ", 2-model consensus" : ""}). cost/accepted = gen cost ÷ passes — the routing metric. Prices asOf ${loadPricing().asOf} (illustrative — verify).`));
