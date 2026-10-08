const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')
const cli = path.resolve(__dirname, '../../tools/clis/typeform.js')
function run(args, fetchSource = "throw new Error('Unexpected network request')") {
  const source = `global.fetch = async (url, options) => { ${fetchSource} }; process.argv = ['node', ${JSON.stringify(cli)}, ...${JSON.stringify(args)}]; require(${JSON.stringify(cli)});`
  return spawnSync(process.execPath, ['-e', source], {
    encoding: 'utf8', env: { ...process.env, TYPEFORM_API_KEY: 'test-only-key' }
  })
}
test('renaming uses a title-only JSON patch, preserving fields and responses', () => {
  const result = run(['forms', 'update', '--id', 'form123', '--title', '新しい title'], `
    const form = { title: 'Old', fields: [{ id: 'field1', type: 'email' }], responses: ['existing'] };
    if (options.method === 'PUT') { form.fields = []; form.responses = []; }
    else if (options.method === 'PATCH') {
      const patches = JSON.parse(options.body);
      if (JSON.stringify(patches) !== JSON.stringify([{op: 'replace', path: '/title', value: '新しい title'}])) throw new Error('Invalid patch');
      form.title = patches[0].value;
    } else throw new Error('Unexpected method');
    return { ok: true, status: 204, text: async () => JSON.stringify(form) };
  `)
  assert.equal(result.status, 0, result.stderr)
  const form = JSON.parse(result.stdout)
  assert.deepEqual(form.fields, [{ id: 'field1', type: 'email' }])
  assert.deepEqual(form.responses, ['existing'])
  assert.equal(form.title, '新しい title')
})
test('dry run shows exact patch with masked authorization and never fetches', () => {
  const result = run(['forms', 'update', '--id', 'form123', '--title', 'New', '--dry-run'])
  assert.equal(result.status, 0, result.stderr)
  const preview = JSON.parse(result.stdout)
  assert.equal(preview.method, 'PATCH')
  assert.deepEqual(preview.body, [{ op: 'replace', path: '/title', value: 'New' }])
  assert.equal(preview.headers.Authorization, '***')
})
test('missing title cannot send an empty replacement', () => {
  const result = run(['forms', 'update', '--id', 'form123'])
  assert.equal(JSON.parse(result.stdout).error, '--title required')
})
