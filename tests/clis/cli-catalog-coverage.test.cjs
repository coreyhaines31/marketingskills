const { test } = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync, readdirSync } = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '../..')
const cliDir = path.join(root, 'tools/clis')
const readme = readFileSync(path.join(cliDir, 'README.md'), 'utf8').replace(/\r\n/g, '\n')

function tableRows(heading) {
  const lines = readme.split('\n')
  const start = lines.indexOf(`## ${heading}`)
  assert.notEqual(start, -1, `missing "## ${heading}" section`)
  const rows = []
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith('## ')) break
    const match = line.match(/^\| `([a-z0-9-]+)(?:\.js)?` \|/)
    if (match) rows.push(match[1])
  }
  return rows
}

const tracked = readdirSync(cliDir).filter((name) => name.endsWith('.js')).map((name) => name.replace(/\.js$/, '')).sort()

test('the credential table covers every CLI file', () => {
  assert.deepEqual([...tableRows('Authentication')].sort(), tracked)
})

test('the available-CLIs table covers every CLI file', () => {
  assert.deepEqual([...tableRows('Available CLIs')].sort(), tracked)
})

test('the available-CLIs table lists no CLI that is not in the directory', () => {
  assert.deepEqual(tableRows('Available CLIs').filter((name) => !tracked.includes(name)), [])
})
