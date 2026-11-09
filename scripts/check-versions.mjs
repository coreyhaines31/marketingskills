#!/usr/bin/env node
// Enforce the versioning rules in AGENTS.md.
//
//   node scripts/check-versions.mjs                  # consistency checks only
//   node scripts/check-versions.mjs --base origin/main  # also require bumps vs base (CI)
//
// Consistency:
//   - every skill's metadata.version matches its VERSIONS.md row, and every skill has a row
//   - plugin.json, marketplace.json, and .codex-plugin/plugin.json share one repo version, matching the newest `### x.y.z` block in VERSIONS.md
//   - every file in skills/<name>/references/ is linked from that skill's SKILL.md
//     or from another of its reference files (no orphans)
//   - every description is at most 500 characters, and all of them together at most 24,000
//     (Claude Code drops descriptions past a ~30,000-character skill listing; see evals/triggers/README.md)
// With --base:
//   - a skill whose files changed must bump metadata.version (evals/ is exempt: it doesn't ship behavior)
//   - if any skill changed, was added, or was removed, the repo version must bump

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const baseIdx = process.argv.indexOf("--base");
const base = baseIdx > -1 ? process.argv[baseIdx + 1] : null;

const errors = [];
const read = (p) => readFileSync(resolve(ROOT, p), "utf8");
const git = (...args) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8" });

const frontmatter = (text) => text.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
const skillVersion = (text) => frontmatter(text).match(/^metadata:\s*\n(?:[ \t]+.*\n)*?[ \t]+version:\s*["']?([\d.]+)/m)?.[1];
const repoVersion = (json) => JSON.parse(json).version;
const marketVersion = (json) => JSON.parse(json).metadata?.version;
const newer = (a, b) => {
  const [x, y] = [a, b].map((v) => v.split(".").map(Number));
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i];
  return false;
};

const skills = readdirSync(resolve(ROOT, "skills"), { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(resolve(ROOT, "skills", d.name, "SKILL.md")))
  .map((d) => d.name);

// VERSIONS.md table <-> SKILL.md metadata
const versionsMd = read("VERSIONS.md").replace(/\r\n/g, "\n");
const table = Object.fromEntries(
  [...versionsMd.matchAll(/^\|\s*([a-z0-9-]+)\s*\|\s*(\d+\.\d+\.\d+)\s*\|/gm)].map((m) => [m[1], m[2]])
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

// Description budget
// Same parser as descriptionOf in trigger-eval.mjs; this script stays standalone so tests can copy it alone.
const descriptionOf = (text) => {
  const lines = frontmatter(text).split("\n");
  const i = lines.findIndex((l) => /^description:/.test(l));
  if (i < 0) return "";
  const raw = lines[i].replace(/^description:[ \t]*/, "");
  if (/^[>|]/.test(raw)) {
    const body = [];
    for (const l of lines.slice(i + 1)) {
      if (l.trim() && !/^[ \t]/.test(l)) break;
      body.push(l.trim());
    }
    return raw.startsWith("|") ? body.join("\n").trim() : body.filter(Boolean).join(" ");
  }
  const dq = raw.match(/^"((?:[^"\\]|\\.)*)"/);
  if (dq) return JSON.parse(`"${dq[1]}"`);
  const sq = raw.match(/^'((?:[^']|'')*)'/);
  if (sq) return sq[1].replace(/''/g, "'");
  return raw.replace(/\s+#.*$/, "").trim();
};
const DESC_MAX = 500;
const DESC_TOTAL_MAX = 24000;
let descTotal = 0;
for (const name of skills) {
  const len = descriptionOf(read(`skills/${name}/SKILL.md`)).length;
  descTotal += len;
  if (len > DESC_MAX) errors.push(`skills/${name}/SKILL.md: description is ${len} chars; keep it at ${DESC_MAX} or fewer`);
}
if (descTotal > DESC_TOTAL_MAX) errors.push(`descriptions total ${descTotal} chars across ${skills.length} skills; keep the pack at ${DESC_TOTAL_MAX} or fewer`);

// Repo version
const plugin = repoVersion(read(".claude-plugin/plugin.json"));
const market = marketVersion(read(".claude-plugin/marketplace.json"));
if (plugin !== market) errors.push(`plugin.json is ${plugin} but marketplace.json metadata.version is ${market}`);
const codexPath = resolve(ROOT, ".codex-plugin/plugin.json");
if (existsSync(codexPath)) {
  const codex = repoVersion(readFileSync(codexPath, "utf8"));
  if (codex !== plugin) errors.push(`.codex-plugin/plugin.json is ${codex} but plugin.json is ${plugin}`);
}
const latestHeading = versionsMd.match(/^### (\d+\.\d+\.\d+)(\s|$)/m)?.[1];
if (latestHeading !== plugin) errors.push(`VERSIONS.md: newest changelog block is ${latestHeading ?? "missing"}, but repo version is ${plugin}`);

// Preserve relative paths when walking bundled reference subdirectories.
const referenceFiles = (directory, prefix = "") => readdirSync(directory, { withFileTypes: true })
  .flatMap((entry) => {
    const name = prefix + entry.name;
    return entry.isDirectory() ? referenceFiles(resolve(directory, entry.name), name + "/") : [name];
  });

// Orphan references
for (const name of skills) {
  const dir = resolve(ROOT, "skills", name, "references");
  if (!existsSync(dir)) continue;
  const files = referenceFiles(dir);
  const skillMd = read(`skills/${name}/SKILL.md`);
  for (const file of files) {
    if (skillMd.includes(file)) continue;
    const linkedFromSibling = files.some((other) => {
      if (other === file) return false;
      const link = relative(dirname(resolve(dir, other)), resolve(dir, file)).replaceAll("\\", "/");
      return read(`skills/${name}/references/${other}`).includes(link);
    });
    if (!linkedFromSibling) errors.push(`skills/${name}/references/${file}: not linked from SKILL.md or any sibling reference`);
  }
}

// Bumps vs base
if (base) {
  const atBase = (path) => {
    try {
      // A path missing at base (a new skill) is expected; keep git's "fatal:" off stderr.
      return execFileSync("git", ["show", `${base}:${path}`], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    } catch {
      return null;
    }
  };
  const changed = git("diff", "--name-only", `${base}...HEAD`).split("\n").filter(Boolean);
  const touched = (paths) => [...new Set(paths.map((p) => p.match(/^skills\/([^/]+)\//)?.[1]).filter(Boolean))];
  const changedSkills = touched(changed.filter((p) => !/^skills\/[^/]+\/evals\//.test(p)));

  for (const name of changedSkills.filter((n) => skills.includes(n))) {
    const before = atBase(`skills/${name}/SKILL.md`);
    if (!before) continue;
    const was = skillVersion(before);
    const now = skillVersion(read(`skills/${name}/SKILL.md`));
    if (was && now && !newer(now, was)) errors.push(`${name}: files changed but metadata.version went ${was} → ${now}; it must increase`);
  }

  const basePlugin = atBase(".claude-plugin/plugin.json");
  if (changedSkills.length && basePlugin && !newer(plugin, repoVersion(basePlugin))) {
    errors.push(`skills changed (${changedSkills.join(", ")}) but repo version went ${repoVersion(basePlugin)} → ${plugin}; it must increase`);
  }
}

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log(`✓ versions consistent across ${skills.length} skills (repo ${plugin})${base ? `, bumps checked against ${base}` : ""}; descriptions ${descTotal} chars`);
