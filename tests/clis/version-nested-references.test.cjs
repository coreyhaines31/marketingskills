const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync } = require('node:fs')
const { tmpdir } = require('node:os')
const path = require('node:path')
const original = path.resolve(__dirname, '../../scripts/check-versions.mjs')
function check(body, files) {
  const root = mkdtempSync(path.join(tmpdir(), 'marketing-versions-'))
  const write = (name, data) => { const p = path.join(root, name); mkdirSync(path.dirname(p), {recursive:true}); writeFileSync(p,data) }
  try {
    write('skills/example/SKILL.md', `---\nname: example\ndescription: Use when testing reference packaging.\nmetadata:\n  version: 1.0.0\n---\n${body}\n`)
    for (const [name, content] of Object.entries(files)) write(`skills/example/references/${name}`,content)
    write('VERSIONS.md', '| example | 1.0.0 |\n\n### 1.0.0 (2026-10-10)\n')
    write('.claude-plugin/plugin.json', JSON.stringify({version:'1.0.0'}))
    write('.claude-plugin/marketplace.json', JSON.stringify({metadata:{version:'1.0.0'}}))
    mkdirSync(path.join(root,'scripts'))
    copyFileSync(original,path.join(root,'scripts/check-versions.mjs'))
    return spawnSync(process.execPath,[path.join(root,'scripts/check-versions.mjs')],{cwd:root,encoding:'utf8',timeout:10000})
  } finally { rmSync(root,{recursive:true,force:true}) }
}
test('nested orphan files are rejected even when their directory is mentioned', () => {
  const result = check('Read [guide](references/nested/guide.md).', {'nested/guide.md':'Guide', 'nested/orphan.md':'Unreachable'})
  assert.equal(result.status,1,result.stdout + result.stderr)
  assert.match(result.stderr,/references\/nested\/orphan.md: not linked/)
})
test('linked nested references and relative sibling links pass', () => {
  const result = check('Read [guide](references/nested/guide.md).', {'nested/guide.md':'Read [other](../other.md).','other.md':'Reference'})
  assert.equal(result.status,0,result.stdout + result.stderr)
})
test('flat linked references keep passing', () => {
  const result = check('Read [guide](references/guide.md).', {'guide.md':'Read [other](other.md).','other.md':'Reference'})
  assert.equal(result.status,0,result.stdout + result.stderr)
})
