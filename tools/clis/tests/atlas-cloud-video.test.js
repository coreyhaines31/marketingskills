const assert = require('node:assert/strict')
const test = require('node:test')

const {
  assertSafeOutputUrl,
  buildRequest,
  isPrivateAddress,
  isSyntheticProxyAddress,
  parseArgs,
  positiveNumber,
  requestJson,
} = require('../atlas-cloud-video')

test('parseArgs separates commands, values, and flags', () => {
  assert.deepEqual(parseArgs(['generate', '--model', 'vendor/model', '--wait']), {
    _: ['generate'],
    model: 'vendor/model',
    wait: true,
  })
})

test('buildRequest rejects fields absent from the live schema', () => {
  const schema = {
    required: ['model', 'prompt'],
    properties: {
      model: { type: 'string' },
      prompt: { type: 'string' },
      duration: { type: 'integer', enum: [4, 5] },
    },
  }
  assert.deepEqual(
    buildRequest('vendor/model', 'A product reveal', { duration: 4 }, schema),
    { model: 'vendor/model', prompt: 'A product reveal', duration: 4 },
  )
  assert.throws(
    () => buildRequest('vendor/model', 'A product reveal', { ratio: '16:9' }, schema),
    /not present in the live model schema/,
  )
})

test('buildRequest enforces schema enum values', () => {
  const schema = {
    required: ['model', 'prompt'],
    properties: {
      model: { type: 'string' },
      prompt: { type: 'string' },
      duration: { type: 'integer', enum: [4, 5] },
    },
  }
  assert.throws(
    () => buildRequest('vendor/model', 'A product reveal', { duration: 6 }, schema),
    /must be one of/,
  )
})

test('positiveNumber rejects invalid numeric options', () => {
  assert.equal(positiveNumber(undefined, 50, '--limit', true), 50)
  assert.throws(() => positiveNumber('NaN', 50, '--limit', true), /positive integer/)
  assert.throws(() => positiveNumber('2.5', 50, '--limit', true), /positive integer/)
})

test('POST failures are not retried', async t => {
  const originalFetch = global.fetch
  let calls = 0
  global.fetch = async () => {
    calls++
    throw new Error('network failure')
  }
  t.after(() => { global.fetch = originalFetch })

  await assert.rejects(
    requestJson('https://example.com/generate', { method: 'POST' }),
    /network failure/,
  )
  assert.equal(calls, 1)
})

test('private output targets are rejected before download', async () => {
  assert.equal(isPrivateAddress('127.0.0.1'), true)
  assert.equal(isPrivateAddress('10.0.0.4'), true)
  assert.equal(isPrivateAddress('100.64.0.1'), true)
  assert.equal(isPrivateAddress('203.0.113.8'), true)
  assert.equal(isPrivateAddress('::ffff:192.168.1.5'), true)
  assert.equal(isPrivateAddress('8.8.8.8'), false)
  await assert.rejects(
    assertSafeOutputUrl('https://127.0.0.1/output.mp4'),
    /private or non-routable/,
  )
})

test('synthetic proxy DNS addresses are distinct from literal private targets', () => {
  assert.equal(isSyntheticProxyAddress('198.18.2.3'), true)
  assert.equal(isSyntheticProxyAddress('198.19.255.254'), true)
  assert.equal(isSyntheticProxyAddress('198.20.0.1'), false)
})
