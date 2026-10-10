const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } = require('node:fs')
const { tmpdir } = require('node:os')
const path = require('node:path')
const script = path.resolve(__dirname, '../../.github/scripts/sync-skills.js')

function sync(newline) {
  const root = mkdtempSync(path.join(tmpdir(), 'marketing-sync-metadata-'))
  try {
    mkdirSync(path.join(root, 'skills/example'), { recursive: true })
    mkdirSync(path.join(root, '.claude-plugin'))
    writeFileSync(path.join(root, 'skills/example/SKILL.md'), `---\nname: example\ndescription: Use when reviewing conversion evidence.\nmetadata:\n  version: 1.0.0\n---\n# Example\n`)
    writeFileSync(path.join(root, '.claude-plugin/marketplace.json'), JSON.stringify({ metadata: { version: '1.0.0' }, plugins: [{ description: '1 marketing skills' }] }))
    writeFileSync(path.join(root, '.claude-plugin/plugin.json'), JSON.stringify({ version: '1.0.0' }))
    writeFileSync(path.join(root, 'README.md'), ['Before', '<!-- SKILLS:START -->', 'old table', '<!-- SKILLS:END -->', 'After', ''].join(newline))
    const result = spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8', timeout: 10000 })
    assert.equal(result.status, 0, result.stderr)
    return readFileSync(path.join(root, 'README.md'), 'utf8')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

for (const newline of ['\n', '\r\n']) {
  test(`README synchronization preserves ${JSON.stringify(newline)} line endings`, () => {
    const output = sync(newline)
    assert.match(output, /Use when reviewing conversion evidence/)
    assert.equal(output.includes('old table'), false)
    assert.equal(output.startsWith('Before' + newline), true)
    assert.equal(output.endsWith('After' + newline), true)
    if (newline === '\r\n') assert.equal(/(?<!\r)\n/.test(output), false)
    else assert.equal(output.includes('\r'), false)
  })
}
