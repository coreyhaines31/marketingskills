const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

test('Resend API rejection causes a failing CLI exit status', () => {
  const cli = path.resolve(__dirname, '../../tools/clis/resend.js')
  const source = `
    global.fetch = async () => ({
      status: 400,
      text: async () => JSON.stringify({ name: 'validation_error', message: 'API key is invalid' }),
    })
    process.argv = ['node', ${JSON.stringify(cli)}, 'domains', 'list']
    require(${JSON.stringify(cli)})
  `
  const result = spawnSync(process.execPath, ['-e', source], {
    encoding: 'utf8',
    timeout: 5000,
    env: { ...process.env, RESEND_API_KEY: 'invalid-test-key' },
  })

  assert.equal(result.status, 1, result.stderr || result.stdout)
  assert.match(result.stdout, /API key is invalid/)
})
