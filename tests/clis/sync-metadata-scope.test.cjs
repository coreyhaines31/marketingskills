const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } = require('node:fs')
const { tmpdir } = require('node:os')
const path = require('node:path')
const script = path.resolve(__dirname, '../../.github/scripts/sync-skills.js')

function sync(metadata) {
  const root = mkdtempSync(path.join(tmpdir(), 'marketing-sync-metadata-'))
  try {
    mkdirSync(path.join(root, 'skills/example'), { recursive: true })
    mkdirSync(path.join(root, '.claude-plugin'))
    writeFileSync(path.join(root, 'skills/example/SKILL.md'), `---\nname: example\ndescription: Use when reviewing conversion evidence.\nmetadata:\n${metadata}---\n# Example\n`)
    writeFileSync(path.join(root, '.claude-plugin/marketplace.json'), JSON.stringify({ metadata: { version: '1.0.0' }, plugins: [{ description: '1 marketing skills' }] }))
    writeFileSync(path.join(root, '.claude-plugin/plugin.json'), JSON.stringify({ version: '1.0.0' }))
    writeFileSync(path.join(root, 'README.md'), '<!-- SKILLS:START -->\nold table\n<!-- SKILLS:END -->\n')
    const result = spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8', timeout: 10000 })
    assert.equal(result.status, 0, result.stderr)
    return readFileSync(path.join(root, 'README.md'), 'utf8')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

test('metadata name does not override the skill name in the generated table', () => {
  assert.match(sync('  name: Publisher Name\n  version: "1.0.0"\n'), /\| \[example\]\(skills\/example\/\)/)
})

test('metadata description does not override the skill activation description', () => {
  const output = sync('  description: Internal release note\n  version: "1.0.0"\n')
  assert.match(output, /Use when reviewing conversion evidence\./)
  assert.doesNotMatch(output, /Internal release note/)
})

test('ordinary version metadata leaves the top-level name and description intact', () => {
  assert.match(sync('  version: "1.0.0"\n'), /\| \[example\]\(skills\/example\/\) \| Use when reviewing conversion evidence\. \|/)
})
