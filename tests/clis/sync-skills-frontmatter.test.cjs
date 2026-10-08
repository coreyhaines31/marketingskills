const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } = require('node:fs')
const { tmpdir } = require('node:os')
const path = require('node:path')
const script = path.resolve(__dirname, '../../.github/scripts/sync-skills.js')
function sync(content) {
  const root = mkdtempSync(path.join(tmpdir(), 'marketing-sync-frontmatter-'))
  try {
    mkdirSync(path.join(root, 'skills/example'), { recursive: true })
    mkdirSync(path.join(root, '.claude-plugin'))
    writeFileSync(path.join(root, 'skills/example/SKILL.md'), content)
    writeFileSync(path.join(root, '.claude-plugin/marketplace.json'), JSON.stringify({metadata: {version: '1.0.0'}, plugins: [{description: '1 marketing skills'}]}))
    writeFileSync(path.join(root, '.claude-plugin/plugin.json'), JSON.stringify({version: '1.0.0'}))
    writeFileSync(path.join(root, 'README.md'), '<!-- SKILLS:START -->\nold table\n<!-- SKILLS:END -->\n')
    const result = spawnSync(process.execPath, [script], {cwd: root, encoding: 'utf8', timeout: 10000})
    assert.equal(result.status, 0, result.stderr)
    return readFileSync(path.join(root, 'README.md'), 'utf8')
  } finally {
    rmSync(root, {recursive: true, force: true})
  }
}
const frontmatter = '---\nname: example\ndescription: Explain conversion evidence\nmetadata:\n  version: 1.0.0\n---\n# Example\n'
test('Windows CRLF frontmatter keeps the description in generated README', () => {
  assert.match(sync(frontmatter.replace(/\n/g, '\r\n')), /\| \[example\]\(skills\/example\/\) \| Explain conversion evidence \|/)
})
test('CRLF and LF source files generate the same skill table', () => {
  assert.equal(sync(frontmatter.replace(/\n/g, '\r\n')), sync(frontmatter))
})
test('LF frontmatter still keeps the description', () => {
  assert.match(sync(frontmatter), /Explain conversion evidence/)
})
test('quoted descriptions are still unquoted after CRLF normalization', () => {
  assert.match(sync(frontmatter.replace('description: Explain conversion evidence', 'description: "Explain conversion evidence"').replace(/\n/g, '\r\n')), /\| Explain conversion evidence \|/)
})
test('body fields outside frontmatter do not become skill descriptions', () => {
  assert.doesNotMatch(sync('No frontmatter\r\ndescription: Body-only value\r\n'), /Body-only value/)
})

for (const ending of ['\n', '\r\n']) {
  test(`the skill validator accepts valid ${ending === '\n' ? 'LF' : 'CRLF'} frontmatter`, () => {
    const root = mkdtempSync(path.join(tmpdir(), 'marketing-validate-frontmatter-'))
    try {
      mkdirSync(path.join(root, 'example'))
      writeFileSync(path.join(root, 'example/SKILL.md'), frontmatter.replace(/\n/g, ending))
      const result = spawnSync('bash', [path.resolve(__dirname, '../../validate-skills.sh')], {
        encoding: 'utf8', timeout: 10000, env: { ...process.env, SKILLS_DIR: root },
      })
      assert.equal(result.status, 0, result.stdout + result.stderr)
      assert.match(result.stdout, /All skills are valid/)
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
}
