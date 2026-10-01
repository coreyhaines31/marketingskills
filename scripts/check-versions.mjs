#!/usr/bin/env node
// Enforce the versioning rules in AGENTS.md.
//
//   node scripts/check-versions.mjs                  # consistency checks only
//   node scripts/check-versions.mjs --base origin/main  # also require bumps vs base (CI)
//
// Consistency:
//   - every skill's metadata.version matches its VERSIONS.md row, and every skill has a row
//   - plugin.json and marketplace.json share one repo version with a `### x.y.z` block in VERSIONS.md
//   - every file in skills/<name>/references/ is linked from that skill's SKILL.md
//     or from another of its reference files (no orphans)
// With --base:
//   - a skill whose files changed must bump metadata.version
//   - if any skill changed, the repo version must bump

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const baseIdx = process.argv.indexOf("--base");
const base = baseIdx > -1 ? process.argv[baseIdx + 1] : null;

const errors = [];
const read = (p) => readFileSync(resolve(ROOT, p), "utf8");
const git = (...args) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8" });

const skillVersion = (text) => text.match(/^metadata:\s*\n(?:\s+.*\n)*?\s+version:\s*["']?([\d.]+)/m)?.[1];
const repoVersion = (json) => JSON.parse(json).version;
const marketVersion = (json) => JSON.parse(json).metadata?.version;

const skills = readdirSync(resolve(ROOT, "skills"), { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(resolve(ROOT, "skills", d.name, "SKILL.md")))
  .map((d) => d.name);

// VERSIONS.md table <-> SKILL.md metadata
const versionsMd = read("VERSIONS.md");
const table = Object.fromEntries(
  [...versionsMd.matchAll(/^\| ([a-z0-9-]+) \| (\d+\.\d+\.\d+) \|/gm)].map((m) => [m[1], m[2]])
);

for (const name of skills) {
  const v = skillVersion(read(`skills/${name}/SKILL.md`));
  if (!v) errors.push(`skills/${name}/SKILL.md: missing metadata.version`);
  else if (!table[name]) errors.push(`VERSIONS.md: no row for ${name}`);
  else if (table[name] !== v) errors.push(`${name}: SKILL.md is ${v} but VERSIONS.md says ${table[name]}`);
}
for (const name of Object.keys(table)) {
  if (!skills.includes(name)) errors.push(`VERSIONS.md: row for ${name}, but skills/${name}/SKILL.md doesn't exist`);
}

// Repo version
const plugin = repoVersion(read(".claude-plugin/plugin.json"));
const market = marketVersion(read(".claude-plugin/marketplace.json"));
if (plugin !== market) errors.push(`plugin.json is ${plugin} but marketplace.json metadata.version is ${market}`);
if (!versionsMd.includes(`### ${plugin} `)) errors.push(`VERSIONS.md: no "### ${plugin}" changelog block`);

// Orphan references
for (const name of skills) {
  const dir = resolve(ROOT, "skills", name, "references");
  if (!existsSync(dir)) continue;
  const files = readdirSync(dir);
  const skillMd = read(`skills/${name}/SKILL.md`);
  for (const file of files) {
    if (skillMd.includes(file)) continue;
    const linkedFromSibling = files.some((other) => other !== file && read(`skills/${name}/references/${other}`).includes(file));
    if (!linkedFromSibling) errors.push(`skills/${name}/references/${file}: not linked from SKILL.md or any sibling reference`);
  }
}

// Bumps vs base
if (base) {
  const atBase = (path) => {
    try {
      return git("show", `${base}:${path}`);
    } catch {
      return null;
    }
  };
  const changed = git("diff", "--name-only", `${base}...HEAD`).split("\n").filter(Boolean);
  const changedSkills = [...new Set(changed.map((p) => p.match(/^skills\/([^/]+)\//)?.[1]).filter(Boolean))]
    .filter((name) => skills.includes(name));

  for (const name of changedSkills) {
    const before = atBase(`skills/${name}/SKILL.md`);
    if (!before) continue;
    const was = skillVersion(before);
    const now = skillVersion(read(`skills/${name}/SKILL.md`));
    if (was === now) errors.push(`${name}: files changed but metadata.version is still ${now}`);
  }

  const basePlugin = atBase(".claude-plugin/plugin.json");
  if (changedSkills.length && basePlugin && repoVersion(basePlugin) === plugin) {
    errors.push(`skills changed (${changedSkills.join(", ")}) but repo version is still ${plugin}`);
  }
}

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log(`✓ versions consistent across ${skills.length} skills (repo ${plugin})${base ? `, bumps checked against ${base}` : ""}`);
