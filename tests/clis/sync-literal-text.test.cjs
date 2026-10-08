const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } = require('node:fs')
const { tmpdir } = require('node:os')
const path = require('node:path')
const script = path.resolve(__dirname, '../../.github/scripts/sync-skills.js')

function sync(description) {
  const root = mkdtempSync(path.join(tmpdir(), 'marketing-sync-literal-'))
  try {
    mkdirSync(path.join(root, 'skills/example'), { recursive: true })
    mkdirSync(path.join(root, '.claude-plugin'))
    writeFileSync(path.join(root, 'skills/example/SKILL.md'), `---\nname: example\ndescription: ${description}\nmetadata:\n  version: "1.0.0"\n---\n`)
    writeFileSync(path.join(root, '.claude-plugin/marketplace.json'), JSON.stringify({ metadata: { version: '1.0.0' }, plugins: [{ description: '1 marketing skills' }] }))
    writeFileSync(path.join(root, '.claude-plugin/plugin.json'), JSON.stringify({ version: '1.0.0' }))
    writeFileSync(path.join(root, 'README.md'), 'Before table\n<!-- SKILLS:START -->\nold table\n<!-- SKILLS:END -->\nAfter table\n')
    const result = spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8', timeout: 10000 })
    assert.equal(result.status, 0, result.stderr)
    return readFileSync(path.join(root, 'README.md'), 'utf8')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

for (const description of ['Use when testing $1 and $2 offers.', 'Use when explaining the literal $& replacement token.', "Use when comparing $` and $' JavaScript tokens.", 'Use when testing ordinary offers.']) {
  test(`sync preserves literal description: ${description}`, () => {
    assert.equal(sync(description), `Before table\n<!-- SKILLS:START -->\n| Skill | Description |\n|-------|-------------|\n| [example](skills/example/) | ${description} |\n<!-- SKILLS:END -->\nAfter table\n`)
  })
}
