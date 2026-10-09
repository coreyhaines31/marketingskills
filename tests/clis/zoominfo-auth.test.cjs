const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const { generateKeyPairSync } = require('node:crypto')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/zoominfo.js')
const keys = generateKeyPairSync('rsa', { modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } })
function run(args, env = {}, mode = 'pki') {
  const source = `
    const assert = require('node:assert/strict'); const crypto = require('node:crypto');
    const calls = [];
    global.fetch = async (url, options) => {
      calls.push({url, ...options});
      if (${JSON.stringify(mode)} === 'none') throw new Error('Unexpected network request');
      if (url.endsWith('/authenticate')) {
        if (${JSON.stringify(mode)} === 'pki') {
          assert.equal(options.body, undefined, 'PKI must not send the private key as a password');
          const assertion = options.headers.Authorization.slice('Bearer '.length);
          const [header, payload, signature] = assertion.split('.');
          assert.equal(JSON.parse(Buffer.from(header, 'base64url')).alg, 'RS256');
          const claims = JSON.parse(Buffer.from(payload, 'base64url'));
          assert.equal(claims.aud, 'enterprise_api'); assert.equal(claims.iss, 'api-client@zoominfo.com');
          assert.equal(claims.username, 'fixture@example.com'); assert.equal(claims.client_id, 'fixture-client');
          assert.ok(Math.abs(claims.iat - Math.floor(Date.now()/1000)) < 10); assert.equal(claims.exp - claims.iat, 300);
          assert.ok(crypto.verify('RSA-SHA256', Buffer.from(header+'.'+payload), ${JSON.stringify(keys.publicKey)}, Buffer.from(signature, 'base64url')));
        } else {
          assert.deepEqual(JSON.parse(options.body), {username:'fixture@example.com', password:'fixture-password'});
        }
        return {ok:true,status:200,text:async()=>JSON.stringify({jwt:'fixture-server-token'})};
      }
      return {ok:true,status:200,text:async()=>JSON.stringify({calls})};
    };
    process.argv=['node',${JSON.stringify(cli)},...${JSON.stringify(args)}];require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', source], { encoding: 'utf8', timeout: 5000,
    env: { ...process.env, ZOOMINFO_ACCESS_TOKEN: '', ZOOMINFO_USERNAME: '', ZOOMINFO_PASSWORD: '',
      ZOOMINFO_PRIVATE_KEY: '', ZOOMINFO_CLIENT_ID: '', ...env } })
}
function output(result) { assert.equal(result.status, 0, result.stderr); return JSON.parse(result.stdout) }
const pki = { ZOOMINFO_USERNAME: 'fixture@example.com', ZOOMINFO_CLIENT_ID: 'fixture-client', ZOOMINFO_PRIVATE_KEY: keys.privateKey }
test('PKI signs the documented assertion locally, then uses the returned server JWT', () => {
  const result = output(run(['companies','search','--name','Acme'], pki))
  assert.equal(result.calls.length, 2)
  assert.equal(result.calls[0].url, 'https://api.zoominfo.com/authenticate')
  assert.equal(result.calls[1].headers.Authorization, 'Bearer fixture-server-token')
  assert.equal(result.calls[1].url, 'https://api.zoominfo.com/search/company')
  assert.equal(JSON.stringify(result).includes(keys.privateKey), false)
})
test('explicit password authentication remains available independently of private keys', () => {
  const result = output(run(['companies','search'], {ZOOMINFO_USERNAME:'fixture@example.com',ZOOMINFO_PASSWORD:'fixture-password'}, 'password'))
  assert.equal(result.calls.length, 2)
  assert.equal(result.calls[1].headers.Authorization, 'Bearer fixture-server-token')
})
test('an existing access token bypasses authentication', () => {
  const result = output(run(['companies','search'], {ZOOMINFO_ACCESS_TOKEN:'existing-token'}))
  assert.equal(result.calls.length, 1)
  assert.equal(result.calls[0].headers.Authorization, 'Bearer existing-token')
})
test('missing client ID cannot downgrade a private key to password authentication', () => {
  const result = run(['companies','search'], {...pki,ZOOMINFO_CLIENT_ID:'',ZOOMINFO_PASSWORD:'fixture-password'}, 'none')
  assert.equal(result.status, 1)
  assert.match(result.stderr, /ZOOMINFO_CLIENT_ID/)
  assert.equal(result.stderr.includes(keys.privateKey), false)
})
test('invalid signing key fails before any network request', () => {
  const result = run(['companies','search'], {...pki,ZOOMINFO_PRIVATE_KEY:'not-a-key'}, 'none')
  assert.equal(result.status, 1)
  assert.match(result.stderr, /private key|signing key/i)
})
test('PKI dry run never transmits or prints signing credentials', () => {
  const result = output(run(['companies','search','--dry-run'], pki, 'none'))
  assert.equal(result.headers.Authorization, 'Bearer ***')
  assert.equal(JSON.stringify(result).includes(keys.privateKey), false)
})
test('no-credential help remains usable', () => { assert.ok(output(run([], {}, 'none')).usage) })
