#!/usr/bin/env node
/**
 * Sync marketplace.json and README.md with skills directory.
 *
 * Scans the skills/ directory for valid skills (directories containing SKILL.md)
 * and updates marketplace.json and the README skills table to match.
 */

const fs = require("fs");
const path = require("path");

const SKILLS_DIR = "skills";
const MARKETPLACE_FILE = ".claude-plugin/marketplace.json";
const README_FILE = "README.md";

/**
 * Parse YAML frontmatter from a SKILL.md file
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const frontmatter = {};
  const lines = match[1].split("\n");

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    frontmatter[key] = value;
  }

  return frontmatter;
}

/**
 * Get all skills with their metadata
 */
function getSkillsWithMetadata() {
  if (!fs.existsSync(SKILLS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((entry) => {
      if (!entry.isDirectory()) return false;
      const skillFile = path.join(SKILLS_DIR, entry.name, "SKILL.md");
      return fs.existsSync(skillFile);
    })
    .map((entry) => {
      const skillFile = path.join(SKILLS_DIR, entry.name, "SKILL.md");
      const content = fs.readFileSync(skillFile, "utf8");
      const frontmatter = parseFrontmatter(content);

      return {
        dir: entry.name,
        path: `./${SKILLS_DIR}/${entry.name}`,
        name: frontmatter.name || entry.name,
        description: frontmatter.description || "",
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Update skill count in description
 */
function updateSkillCount(description, count) {
  return description.replace(/\d+ marketing skills/, `${count} marketing skills`);
}

/**
 * Truncate description to a maximum length
 */
function truncateDescription(description, maxLength = 120) {
  if (description.length <= maxLength) return description;

  // Find last space before maxLength to avoid cutting words
  const truncated = description.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return truncated.slice(0, lastSpace) + "...";
}

/**
 * Generate the skills table for README
 */
function generateSkillsTable(skills) {
  const header = "| Skill | Description |\n|-------|-------------|";
  const rows = skills.map((skill) => {
    const link = `[${skill.name}](skills/${skill.dir}/)`;
    const description = truncateDescription(skill.description);
    return `| ${link} | ${description} |`;
  });

  return [header, ...rows].join("\n");
}

/**
 * Update README.md with new skills table
 */
function updateReadme(skills) {
  const content = fs.readFileSync(README_FILE, "utf8");

  // Match content between skill list markers
  const tableRegex = /(<!-- SKILLS:START -->\n)[\s\S]*?(\n<!-- SKILLS:END -->)/;
  const newTable = generateSkillsTable(skills);

  if (!tableRegex.test(content)) {
    console.log("WARNING: Could not find skill markers in README.md");
    return false;
  }

  const newContent = content.replace(tableRegex, `$1${newTable}$2`);

  if (newContent === content) {
    return false;
  }

  fs.writeFileSync(README_FILE, newContent);
  return true;
}

/**
 * Update marketplace.json with skills list
 */
function updateMarketplace(skills) {
  const marketplace = JSON.parse(fs.readFileSync(MARKETPLACE_FILE, "utf8"));
  const plugin = marketplace.plugins[0];
  const existingSkills = plugin.skills || [];
  const currentSkills = skills.map((s) => s.path);

  if (JSON.stringify(currentSkills) === JSON.stringify(existingSkills)) {
    return { updated: false };
  }

  plugin.skills = currentSkills;
  plugin.description = updateSkillCount(plugin.description, currentSkills.length);

  fs.writeFileSync(MARKETPLACE_FILE, JSON.stringify(marketplace, null, 2) + "\n");

  const added = currentSkills.filter((s) => !existingSkills.includes(s));
  const removed = existingSkills.filter((s) => !currentSkills.includes(s));

  return { updated: true, added, removed };
}

function main() {
  const skills = getSkillsWithMetadata();

  const marketplaceResult = updateMarketplace(skills);
  const readmeUpdated = updateReadme(skills);

  if (!marketplaceResult.updated && !readmeUpdated) {
    console.log("Everything is already in sync");
    return;
  }

  if (marketplaceResult.updated) {
    if (marketplaceResult.added.length) {
      console.log(`Added: ${marketplaceResult.added.join(", ")}`);
    }
    if (marketplaceResult.removed.length) {
      console.log(`Removed: ${marketplaceResult.removed.join(", ")}`);
    }
    console.log(`Updated marketplace.json (${skills.length} skills)`);
  }

  if (readmeUpdated) {
    console.log("Updated README.md skills table");
  }
}

main();
