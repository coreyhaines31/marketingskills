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
  assert.deepEqual(skillsInvoked(stream), { skills: ['marketing-skills:cro'], cost: 0.05, finished: true, failure: null, text: 'hi' });
  assert.equal(skillsInvoked('').finished, false);
});

test('score separates pass, wrong skill, no trigger, other skill, and false triggers', async () => {
  const { score } = await load();
  const item = { expect: ['cro'] };
  assert.equal(score(item, ['marketing-skills:cro']).outcome, 'pass');
  assert.equal(score(item, ['marketing-skills:copywriting']).outcome, 'wrong-skill');
  assert.equal(score(item, []).outcome, 'no-trigger');
  assert.equal(score(item, ['run']).outcome, 'other-skill');
  assert.equal(score(item, ['other:copywriting', 'marketing-skills:cro']).outcome, 'other-skill');
  assert.equal(score(item, [], 'marketing-skills', true).outcome, 'error');
  assert.equal(score({ expect: [] }, [], 'marketing-skills', true).outcome, 'error');
  assert.equal(score({ expect: [] }, ['run']).outcome, 'pass');
  assert.equal(score({ expect: [] }, ['marketing-skills:social']).outcome, 'false-trigger');
});

test('descriptionOf reads plain, quoted, commented, and block descriptions', async () => {
  const { descriptionOf } = await load();
  const fm = body => `---\nname: x\n${body}\nmetadata:\n  version: 1.0.0\n---\n# X`;
  assert.equal(descriptionOf(fm('description: "Say \\"hi\\": now" # note')), 'Say "hi": now');
  assert.equal(descriptionOf(fm("description: 'It''s short' # note")), "It's short");
  assert.equal(descriptionOf(fm('description: plain text # note')), 'plain text');
  assert.equal(descriptionOf(fm('description: >\n  folded line one\n  and two')), 'folded line one and two');
  assert.equal(descriptionOf(fm('description: |\n  line one\n  line two')), 'line one\nline two');
  assert.equal(descriptionOf(fm('description: >-\n  ' + 'a'.repeat(501))).length, 501);
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
  assert.equal(summarize([...rows, { kind: 'direct', expect: ['cro'], outcome: 'error', pick: null }]).errors, 1);
  assert.equal(summarize([...rows, { kind: 'direct', expect: ['cro'], outcome: 'error', pick: null }]).positives.pass, 50);
});

test('every trigger prompt expects real skills', async () => {
  const fs = require('node:fs');
  const root = path.join(__dirname, '..', '..');
  const skills = new Set(fs.readdirSync(path.join(root, 'skills')));
  for (const file of ['prompts.json', 'heldout.json', 'heldout2.json', 'heldout3.json', 'heldout4.json']) {
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

test('runs that end in an error result are scored as errors, not as answers', () => {
  const fs = require('node:fs');
  const os = require('node:os');
  const { spawnSync } = require('node:child_process');
  const root = path.join(__dirname, '..', '..');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'trigger-eval-test-'));
  try {
    // Stub `claude -p` that replays the stream-json result shapes Claude Code emits:
    // a Skill call cut off by --max-turns 1 (error_max_turns), a plain answer, and a
    // failed run (not logged in / API error: is_error with subtype "success").
    const bin = path.join(tmp, 'bin');
    fs.mkdirSync(bin);
    fs.writeFileSync(path.join(bin, 'claude'), `#!${process.execPath}
const prompt = process.argv[process.argv.indexOf('-p') + 1];
const out = e => process.stdout.write(JSON.stringify(e) + '\\n');
out({ type: 'system', subtype: 'init' });
if (prompt.startsWith('trigger')) {
  out({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Skill', input: { skill: 'marketing-skills:cro' } }] } });
  out({ type: 'result', subtype: 'error_max_turns', is_error: true, total_cost_usd: 0.01 });
  process.exit(1);
} else if (prompt.startsWith('answer')) {
  out({ type: 'assistant', message: { content: [{ type: 'text', text: '4' }] } });
  out({ type: 'result', subtype: 'success', is_error: false, result: '4', total_cost_usd: 0.01 });
} else {
  out({ type: 'assistant', message: { content: [{ type: 'text', text: 'Not logged in · Please run /login' }] } });
  out({ type: 'result', subtype: 'success', is_error: true, result: 'Not logged in · Please run /login', total_cost_usd: 0 });
  process.exit(1);
}
`, { mode: 0o755 });
    const prompts = path.join(tmp, 'prompts.json');
    fs.writeFileSync(prompts, JSON.stringify({ prompts: [
      { id: 'a-trigger', kind: 'direct', prompt: 'trigger: why is my page not converting', expect: ['cro'] },
      { id: 'b-answer', kind: 'none', prompt: 'answer: what is 2+2', expect: [] },
      { id: 'c-failed-positive', kind: 'direct', prompt: 'failed: why is my page not converting', expect: ['cro'] },
      { id: 'd-failed-negative', kind: 'none', prompt: 'failed: what is 2+2', expect: [] },
    ] }));
    const out = path.join(tmp, 'report.json');
    const r = spawnSync(process.execPath, [path.join(root, 'scripts', 'trigger-eval.mjs'), '--prompts', prompts, '--out', out, '--concurrency', '1'], {
      encoding: 'utf8',
      env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}` },
    });
    assert.equal(r.status, 0, r.stderr);
    const report = JSON.parse(fs.readFileSync(out, 'utf8'));
    const outcome = Object.fromEntries(report.rows.map(row => [row.id, row.outcome]));
    assert.deepEqual(outcome, { 'a-trigger': 'pass', 'b-answer': 'pass', 'c-failed-positive': 'error', 'd-failed-negative': 'error' });
    assert.equal(report.summary.errors, 2);
    assert.match(report.rows.find(row => row.id === 'c-failed-positive').error, /Not logged in/);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
