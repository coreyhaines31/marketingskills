#!/usr/bin/env node
// Grade your own inputs against any judge: verdict + the reason.
//
//   node grade.mjs judges/ad-hooks "Your dad's wallet is the reason your back hurts."
//   node grade.mjs judges/ad-hooks --file my-hooks.txt      # one per line
//   echo "a hook" | node grade.mjs judges/ad-hooks          # from stdin
//
// Needs ANTHROPIC_API_KEY or OPENAI_API_KEY in the environment.

import { readFileSync } from "node:fs";
import { grade, activeModel } from "./lib.mjs";

const args = process.argv.slice(2);
const judgeDir = args[0];
if (!judgeDir || judgeDir.startsWith("-")) {
  console.error('Usage: node grade.mjs judges/<name> "your input"   |   --file inputs.txt');
  process.exit(1);
}

const rest = args.slice(1);
let inputs = [];
const fileFlag = rest.indexOf("--file");
if (fileFlag !== -1) {
  const fname = rest[fileFlag + 1];
  const extras = rest.filter((_, i) => i !== fileFlag && i !== fileFlag + 1);
  if (!fname || fname.startsWith("-")) {
    console.error("--file requires a filename: node grade.mjs judges/<name> --file inputs.txt");
    process.exit(1);
  }
  if (extras.length) {
    console.error("--file takes exactly one filename; remove the extra arguments.");
    process.exit(1);
  }
  inputs = readFileSync(fname, "utf8").split("\n").map((l) => l.trim()).filter(Boolean);
} else if (rest.length) {
  inputs = rest;
} else {
  let stdin = "";
  try { stdin = readFileSync(0, "utf8"); } catch {}
  inputs = stdin.split("\n").map((l) => l.trim()).filter(Boolean);
}

if (!inputs.length) {
  console.error('Usage: node grade.mjs judges/<name> "your input"   |   --file inputs.txt');
  process.exit(1);
}

const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const gray = (s) => `\x1b[90m${s}\x1b[0m`;

console.error(dim(`grading ${inputs.length} input${inputs.length > 1 ? "s" : ""} against ${judgeDir} with ${activeModel()}…\n`));

const { results, usage, ms } = await grade(judgeDir, inputs);
for (const r of results) {
  const input = inputs[r.index - 1] ?? "";
  const badge = r.verdict === "PASS" ? green("PASS") : gray("FAIL");
  console.log(`${badge}  "${input}"`);
  if (r.trigger || r.reasoning) console.log(dim(`      ${r.trigger ? r.trigger + " — " : ""}${r.reasoning || ""}`));
  if (r.verdict === "FAIL" && r.improvement) console.log(dim(`      fix: ${r.improvement}`));
  console.log();
}

const passed = results.filter((r) => r.verdict === "PASS").length;
console.error(dim(`${passed}/${results.length} cleared the bar · ${usage.input + usage.output} tokens · ${(ms / 1000).toFixed(1)}s`));
