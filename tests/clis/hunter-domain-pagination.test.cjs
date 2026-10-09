const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/hunter.js')
function run(args, network = true) {
  const source = `global.fetch = async (url, options) => {
    if (!${network}) throw new Error('Unexpected network request');
    return { status: 200, text: async () => JSON.stringify({url, method: options.method}) };
  }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', source], {encoding: 'utf8', timeout: 5000,
    env: {PATH: process.env.PATH, HUNTER_API_KEY: 'fixture-key'}})
}
function output(result) { assert.equal(result.status, 0, result.stderr); return JSON.parse(result.stdout) }
for (const args of [['domain', 'search', '--domain', 'example.com'], ['leads-lists', 'get', '--id', '123']]) {
  test(`${args.join(' ')} can retrieve later pages rather than repeat page one`, () => {
    const result = output(run([...args, '--offset', '100', '--limit', '25']))
    const url = new URL(result.url)
    assert.equal(url.searchParams.get('offset'), '100')
    assert.equal(url.searchParams.get('limit'), '25')
  })
  test(`${args.join(' ')} preserves omitted pagination and explicit zero`, () => {
    assert.equal(new URL(output(run(args)).url).searchParams.has('offset'), false)
    assert.equal(new URL(output(run([...args, '--offset', '0'])).url).searchParams.get('offset'), '0')
  })
  test(`${args.join(' ')} rejects malformed pages before fetching`, () => {
    for (const bad of [['--offset', '-1'], ['--offset', '1.5'], ['--offset', 'Infinity'], ['--offset'], ['--limit', '0'], ['--limit', '101'], ['--limit', 'no']]) {
      const result = run([...args, ...bad], false)
      assert.equal(result.status, 1)
      assert.match(result.stderr, /--(?:offset|limit) must be/)
      assert.doesNotMatch(result.stderr, /Unexpected network/)
    }
  })
}
