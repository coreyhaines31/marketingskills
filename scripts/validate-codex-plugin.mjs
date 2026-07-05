#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const MANIFEST_PATH = ".codex-plugin/plugin.json";
const MARKETPLACE_PATH = ".agents/plugins/marketplace.json";
const PLATFORMS_PATH = "distribution/platforms.json";
const CLAUDE_PLUGIN_PATH = ".claude-plugin/plugin.json";

const errors = [];

function readJson(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolutePath)) {
    errors.push(`${relativePath} is missing`);
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  } catch (error) {
    errors.push(`${relativePath} contains invalid JSON: ${error.message}`);
    return null;
  }
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireString(object, field, label = field) {
  if (typeof object?.[field] !== "string" || object[field].trim() === "") {
    errors.push(`${label} must be a non-empty string`);
    return null;
  }

  return object[field];
}

function requireHttpsUrl(object, field, label = field) {
  const value = object?.[field];
  if (value === undefined) return;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      errors.push(`${label} must use https`);
    }
  } catch {
    errors.push(`${label} must be an absolute URL`);
  }
}

function normalizeRelativePath(value) {
  if (typeof value !== "string") return null;
  if (path.isAbsolute(value)) return null;
  return value.replace(/\\/g, "/").replace(/\/+$/, "");
}

function countSkills() {
  const skillsRoot = path.join(ROOT, "skills");
  if (!fs.existsSync(skillsRoot)) return 0;

  return fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => {
      if (!entry.isDirectory()) return false;
      return fs.existsSync(path.join(skillsRoot, entry.name, "SKILL.md"));
    })
    .length;
}

function validateManifest(manifest, skillCount) {
  if (!isObject(manifest)) return;

  const allowedTopLevelFields = new Set([
    "id",
    "name",
    "version",
    "description",
    "author",
    "homepage",
    "repository",
    "license",
    "keywords",
    "skills",
    "apps",
    "mcpServers",
    "interface",
  ]);

  for (const field of Object.keys(manifest)) {
    if (!allowedTopLevelFields.has(field)) {
      errors.push(`${MANIFEST_PATH} field ${field} is unsupported`);
    }
  }

  const name = requireString(manifest, "name", "plugin name");
  if (name && !/^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/.test(name)) {
    errors.push("plugin name must be kebab-case and 1-64 characters");
  }

  const version = requireString(manifest, "version", "plugin version");
  if (version && !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)) {
    errors.push("plugin version must be semver");
  }

  requireString(manifest, "description", "plugin description");
  requireString(manifest.author, "name", "author.name");
  requireHttpsUrl(manifest.author, "url", "author.url");
  requireHttpsUrl(manifest, "homepage", "homepage");
  requireHttpsUrl(manifest, "repository", "repository");

  if (normalizeRelativePath(manifest.skills) !== "./skills") {
    errors.push("skills must point to ./skills/");
  }

  if (!fs.existsSync(path.join(ROOT, "skills"))) {
    errors.push("skills directory is missing");
  }

  if (skillCount < 1) {
    errors.push("skills directory must contain at least one skill");
  }

  const ui = manifest.interface;
  if (!isObject(ui)) {
    errors.push("interface must be an object");
    return;
  }

  for (const field of [
    "displayName",
    "shortDescription",
    "longDescription",
    "developerName",
    "category",
  ]) {
    requireString(ui, field, `interface.${field}`);
  }

  if (!Array.isArray(ui.capabilities) || ui.capabilities.length === 0) {
    errors.push("interface.capabilities must be a non-empty array");
  }

  if (!Array.isArray(ui.defaultPrompt) || ui.defaultPrompt.length < 1 || ui.defaultPrompt.length > 3) {
    errors.push("interface.defaultPrompt must contain 1-3 prompts");
  }

  if (ui.defaultPrompt?.some((prompt) => typeof prompt !== "string" || prompt.length > 128)) {
    errors.push("interface.defaultPrompt entries must be strings of 128 characters or fewer");
  }

  requireHttpsUrl(ui, "websiteURL", "interface.websiteURL");

  if (typeof ui.brandColor !== "string" || !/^#[0-9A-Fa-f]{6}$/.test(ui.brandColor)) {
    errors.push("interface.brandColor must use #RRGGBB");
  }

  for (const field of ["composerIcon", "logo"]) {
    if (ui[field] === undefined) continue;
    const relativeAssetPath = normalizeRelativePath(ui[field]);
    if (!relativeAssetPath || !fs.existsSync(path.join(ROOT, relativeAssetPath))) {
      errors.push(`interface.${field} must point to an existing relative asset`);
    }
  }

  if (!Array.isArray(ui.screenshots)) {
    errors.push("interface.screenshots must be an array");
  }
}

function validateMarketplace(marketplace, manifest) {
  if (!isObject(marketplace) || !isObject(manifest)) return;

  requireString(marketplace, "name", "marketplace name");
  requireString(marketplace.interface, "displayName", "marketplace interface.displayName");

  if (!Array.isArray(marketplace.plugins)) {
    errors.push("marketplace plugins must be an array");
    return;
  }

  const entry = marketplace.plugins.find((plugin) => plugin.name === manifest.name);
  if (!entry) {
    errors.push("marketplace must include the Codex plugin name");
    return;
  }

  if (entry.source?.source !== "local") {
    errors.push("marketplace plugin source.source must be local");
  }

  if (entry.source?.path !== "./") {
    errors.push("marketplace plugin source.path must point to ./");
  }

  if (entry.policy?.installation !== "AVAILABLE") {
    errors.push("marketplace policy.installation must be AVAILABLE");
  }

  if (entry.policy?.authentication !== "ON_INSTALL") {
    errors.push("marketplace policy.authentication must be ON_INSTALL");
  }

  requireString(entry, "category", "marketplace plugin category");
}

function validatePlatforms(platforms, manifest) {
  if (!isObject(platforms) || !isObject(manifest)) return;

  if (platforms.name !== manifest.name) {
    errors.push("distribution name must match plugin name");
  }

  if (platforms.version !== manifest.version) {
    errors.push("distribution version must match plugin version");
  }

  requireHttpsUrl(platforms, "repository", "distribution repository");

  if (!Array.isArray(platforms.platforms)) {
    errors.push("distribution platforms must be an array");
    return;
  }

  const requiredPlatformIds = [
    "codex",
    "claude-code",
    "skills-npx",
    "generic-agent-importers",
  ];

  for (const platform of platforms.platforms) {
    if (!isObject(platform)) {
      errors.push("distribution platform entries must be objects");
      continue;
    }

    const label = platform.id || "unknown";
    for (const field of ["id", "name", "claim", "runtime", "install", "commands", "evidence", "lastVerified"]) {
      requireString(platform, field, `distribution platform ${label}.${field}`);
    }
  }

  for (const platformId of requiredPlatformIds) {
    if (!platforms.platforms.some((platform) => platform.id === platformId)) {
      errors.push(`distribution platforms must include ${platformId}`);
    }
  }

  const codex = platforms.platforms.find((platform) => platform.id === "codex");
  if (!codex) {
    return;
  }

  if (codex.runtime !== "plugin") {
    errors.push("codex platform runtime must be plugin");
  }

  if (!codex.install?.includes("--target codex")) {
    errors.push("codex install command must include --target codex");
  }

  if (!codex.evidence?.includes(".codex-plugin/plugin.json")) {
    errors.push("codex evidence must mention .codex-plugin/plugin.json");
  }
}

function validateClaudeParity(claudePlugin, manifest) {
  if (!isObject(claudePlugin) || !isObject(manifest)) return;

  if (claudePlugin.name !== manifest.name) {
    errors.push("Claude plugin name must match Codex plugin name");
  }

  if (claudePlugin.version !== manifest.version) {
    errors.push("Claude plugin version must match Codex plugin version");
  }
}

const manifest = readJson(MANIFEST_PATH);
const marketplace = readJson(MARKETPLACE_PATH);
const platforms = readJson(PLATFORMS_PATH);
const claudePlugin = readJson(CLAUDE_PLUGIN_PATH);
const skillCount = countSkills();

validateManifest(manifest, skillCount);
validateMarketplace(marketplace, manifest);
validatePlatforms(platforms, manifest);
validateClaudeParity(claudePlugin, manifest);

if (errors.length > 0) {
  console.error("Codex plugin validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Codex plugin validation passed: ${manifest.name} (${skillCount} skills)`);
