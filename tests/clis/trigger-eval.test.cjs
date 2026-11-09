const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const load = () => import(pathToFileURL(path.join(__dirname, '..', '..', 'scripts', 'trigger-eval.mjs')).href);

test('skillsInvoked reads Skill tool calls and cost from stream-json', async () => {
  const { skillsInvoked } = await load();
  const stream = [
    JSON.stringify({ type: 'system', subtype: 'init' }),
    JSON.stringify({ type: 'assistant', message: { content: [{ type: 'text', text: 'hi' }, { type: 'tool_use', name: 'Skill', input: { skill: 'marketing-skills:cro' } }] } }),
    'not json',
    JSON.stringify({ type: 'result', total_cost_usd: 0.05 }),
  ].join('\n');
  assert.deepEqual(skillsInvoked(stream), { skills: ['marketing-skills:cro'], cost: 0.05 });
});

test('score separates pass, wrong skill, no trigger, other skill, and false triggers', async () => {
  const { score } = await load();
  const item = { expect: ['cro'] };
  assert.equal(score(item, ['marketing-skills:cro']).outcome, 'pass');
  assert.equal(score(item, ['marketing-skills:copywriting']).outcome, 'wrong-skill');
  assert.equal(score(item, []).outcome, 'no-trigger');
  assert.equal(score(item, ['run']).outcome, 'other-skill');
  assert.equal(score(item, ['run', 'marketing-skills:cro']).outcome, 'pass');
  assert.equal(score({ expect: [] }, ['run']).outcome, 'pass');
  assert.equal(score({ expect: [] }, ['marketing-skills:social']).outcome, 'false-trigger');
});

test('summarize counts outcomes and confusion pairs', async () => {
  const { summarize } = await load();
  const rows = [
    { kind: 'direct', expect: ['cro'], outcome: 'pass', pick: 'cro' },
    { kind: 'indirect', expect: ['cro'], outcome: 'wrong-skill', pick: 'copywriting' },
    { kind: 'none', expect: [], outcome: 'pass', pick: null },
  ];
  const s = summarize(rows);
  assert.equal(s.positives.pass, 50);
  assert.deepEqual(s.confusions, [{ pair: 'cro -> copywriting', n: 1 }]);
  assert.deepEqual(s.weakest, [{ skill: 'cro', pass: '1/2' }]);
});

test('every trigger prompt expects real skills', async () => {
  const fs = require('node:fs');
  const root = path.join(__dirname, '..', '..');
  const skills = new Set(fs.readdirSync(path.join(root, 'skills')));
  for (const file of ['prompts.json', 'heldout.json']) {
    const { prompts } = JSON.parse(fs.readFileSync(path.join(root, 'evals', 'triggers', file), 'utf8'));
    const ids = new Set();
    for (const p of prompts) {
      assert.ok(!ids.has(p.id), `${file}: duplicate id ${p.id}`);
      ids.add(p.id);
      for (const s of p.expect) assert.ok(skills.has(s), `${file}: ${p.id} expects unknown skill ${s}`);
    }
    for (const s of skills) assert.ok(prompts.some(p => p.expect.includes(s)), `${file}: no trigger prompt for ${s}`);
  }
});
