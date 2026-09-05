#!/usr/bin/env node
// Regenerate every partner surface from the canonical partners.json.
//
//   node scripts/sync-partners.mjs           # write the generated blocks
//   node scripts/sync-partners.mjs --check   # fail if anything is out of date (CI)
//
// Owns the marked blocks in:
//   - README.md                → the Partners section list
//   - tools/REGISTRY.md        → the Verified Partners table
// Everything outside the <!-- PARTNERS:START --> / <!-- PARTNERS:END --> markers
// is left untouched. The marketing-skills.com site reads partners.json directly.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const REPO = "https://github.com/coreyhaines31/marketingskills/blob/main";
const REF = "?ref=marketingskills";

const START = "<!-- PARTNERS:START -->";
const END = "<!-- PARTNERS:END -->";
const check = process.argv.includes("--check");

const { partners } = JSON.parse(readFileSync(resolve(ROOT, "partners.json"), "utf8"));
const active = partners.filter((p) => p.active);

const readmeBlock = active.length
  ? active
      .map(
        (p) =>
          `> ◆ **[${p.name}](${p.url}${REF})** — *${p.categoryShort || p.category}.* ${p.blurb} → [Integration guide](${p.integration})`
      )
      .join("\n\n")
  : "_No active partners yet. [Become a partner →](https://marketing-skills.com/sponsorship)_";

const registryBlock = [
  "| Partner | Category | Guide |",
  "|---------|----------|-------|",
  ...active.map(
    (p) =>
      `| ◆ ${p.name} | ${p.categoryShort || p.category} | [${p.integration.split("/").pop()}](${p.integration.replace(/^tools\//, "")}) |`
  ),
].join("\n");

const targets = [
  { file: "README.md", block: readmeBlock },
  { file: "tools/REGISTRY.md", block: registryBlock },
];

let stale = false;
for (const { file, block } of targets) {
  const path = resolve(ROOT, file);
  const src = readFileSync(path, "utf8");
  const i = src.indexOf(START);
  const j = src.indexOf(END);
  if (i === -1 || j === -1 || j < i) {
    console.error(`✗ ${file}: missing ${START} / ${END} markers`);
    process.exitCode = 1;
    continue;
  }
  const next = src.slice(0, i + START.length) + "\n" + block + "\n" + src.slice(j);
  if (next === src) {
    console.log(`✓ ${file} up to date`);
    continue;
  }
  if (check) {
    console.error(`✗ ${file} is out of date — run: node scripts/sync-partners.mjs`);
    stale = true;
    continue;
  }
  writeFileSync(path, next);
  console.log(`↻ ${file} updated (${active.length} partner${active.length === 1 ? "" : "s"})`);
}

if (check && stale) process.exitCode = 1;
