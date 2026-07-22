#!/usr/bin/env node
// Reproduce a judge's calibration number: run it against its hand-labeled
// answer key and report how often it agreed with the human — plus the
// confusion split and (triaxial) tokens + latency.
//
//   node harness.mjs judges/ad-hooks
//
// Needs ANTHROPIC_API_KEY or OPENAI_API_KEY. Grades in batches to keep it cheap.

import { grade, loadAnswerKey, activeModel } from "./lib.mjs";

const judgeDir = process.argv[2];
if (!judgeDir) {
  console.error("Usage: node harness.mjs judges/<name>");
  process.exit(1);
}

const set = loadAnswerKey(judgeDir);
const BATCH = 20;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

console.error(dim(`grading ${set.length} labeled examples from ${judgeDir} with ${activeModel()} in batches of ${BATCH}…\n`));

let agree = 0, falsePass = 0, falseFail = 0, graded = 0;
let inTok = 0, outTok = 0, totalMs = 0, calls = 0;
const disagreements = [];

for (let i = 0; i < set.length; i += BATCH) {
  const batch = set.slice(i, i + BATCH);
  const { results, usage, ms } = await grade(judgeDir, batch.map((r) => r.input));
  inTok += usage.input; outTok += usage.output; totalMs += ms; calls++;
  for (const r of results) {
    const truth = batch[r.index - 1];
    if (!truth) continue;
    graded++;
    if (r.verdict === truth.verdict) {
      agree++;
    } else {
      if (truth.verdict === "FAIL" && r.verdict === "PASS") falsePass++;
      else falseFail++;
      disagreements.push({ input: truth.input, human: truth.verdict, judge: r.verdict });
    }
  }
  console.error(dim(`  ${Math.min(i + BATCH, set.length)}/${set.length}`));
}

const pct = ((agree / graded) * 100).toFixed(1);
console.log(`\nAgreement with human labels: ${agree}/${graded} = ${pct}%`);
console.log(`  false PASS (judge too lenient): ${falsePass}`);
console.log(`  false FAIL (judge too harsh):   ${falseFail}`);
console.log(dim(`\nCost/time (${activeModel()}): ${inTok} in + ${outTok} out tokens over ${calls} calls · ${(totalMs / calls / 1000).toFixed(1)}s avg/call`));

if (disagreements.length) {
  console.log(`\nWhere they disagreed:`);
  for (const d of disagreements) {
    console.log(`  human ${d.human} / judge ${d.judge} — "${d.input}"`);
  }
}
