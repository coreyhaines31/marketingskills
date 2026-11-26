const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// screen-counts.mjs backs the before/after counts in
// skills/cro/references/screen-simplification.md. These tests run the shipped
// script the way the reference tells an agent to run it.
const script = path.resolve(__dirname, '../../skills/cro/scripts/screen-counts.mjs');

const dirs = [];
after(() => { for (const dir of dirs) fs.rmSync(dir, { recursive: true, force: true }); });

function write(text) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'screen-counts-'));
  dirs.push(dir);
  const file = path.join(dir, 'screen.txt');
  fs.writeFileSync(file, text);
  return file;
}

function run(...args) {
  const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
  return { code: result.status, out: result.stdout, err: result.stderr };
}

test('counts tokens that hold a letter or digit as words', () => {
  const file = write('Plans from $24/month → cancel anytime\n\u2014 ① ✓\nNo card needed.\n');
  const { code, out } = run(file);
  assert.equal(code, 0);
  assert.match(out, /^screen: 8 words, 0 flagged words, 0 weak button labels$/m);
});

test('reads CRLF, lone CR and a byte order mark, and counts non-ASCII letters', () => {
  const file = write('\uFEFFCafé 東京 ٣\r\nSubmit\rLearn more\n');
  const { code, out } = run(file);
  assert.equal(code, 1);
  assert.match(out, /^screen: 6 words, 0 flagged words, 2 weak button labels$/m);
  assert.match(out, /line 2: "Submit" \(weak button label\)/);
  assert.match(out, /line 3: "Learn more" \(weak button label\)/);
});

test('flags jargon and self-praise with the line they are on', () => {
  const file = write('The world-class platform for teams\nSeamless setup in minutes\nworld\u2011class support\n');
  const { code, out } = run(file);
  assert.equal(code, 1);
  assert.match(out, /4 flagged words/);
  assert.match(out, /line 3: "world\u2011class" \(self-praise\)/);
  assert.match(out, /line 1: "world-class" \(self-praise\)/);
  assert.match(out, /line 1: "platform" \(jargon\)/);
  assert.match(out, /line 2: "Seamless" \(jargon\)/);
});

test('matches whole words and their plurals only', () => {
  const file = write('Platforms that unlocks it\nseamlessness, unlocked doors, non-robust, robust\u2011ness and platformer\n');
  const { code, out } = run(file);
  assert.equal(code, 1);
  assert.match(out, /2 flagged words/);
  assert.match(out, /line 1: "Platforms" \(jargon\)/);
  assert.match(out, /line 1: "unlocks" \(jargon\)/);
  assert.doesNotMatch(out, /line 2:/);
});

test('flags a line that is only a weak button label, not the phrase inside a sentence', () => {
  const file = write('Learn more\n  get started →\nLearn more about our pricing\nSee pricing\nSign-up!\n');
  const { code, out } = run(file);
  assert.equal(code, 1);
  assert.match(out, /3 weak button labels/);
  assert.match(out, /line 5: "Sign-up" \(weak button label\)/);
  assert.match(out, /line 1: "Learn more" \(weak button label\)/);
  assert.match(out, /line 2: "get started" \(weak button label\)/);
  assert.doesNotMatch(out, /line 3:/);
});

test('passes an after screen that is shorter and has nothing flagged', () => {
  const before = write('The seamless platform that teams love\nLearn more\n');
  const after = write('Invoices in one click\nSend my invoice\n');
  const { code, out } = run(before, after);
  assert.equal(code, 0);
  assert.match(out, /^before: 8 words, 2 flagged words, 1 weak button label$/m);
  assert.match(out, /^after: 7 words, 0 flagged words, 0 weak button labels$/m);
  assert.match(out, /^PASS: after has 1 fewer word than before and nothing flagged$/m);
});

test('passes an after screen with the same word count once nothing is flagged', () => {
  const before = write('A seamless way to send invoices\n');
  const after = write('Send an invoice in one click\n');
  const { code, out } = run(before, after);
  assert.equal(code, 0);
  assert.match(out, /^PASS: after has as many words as before and nothing flagged$/m);
});

test('reports a longer after screen without failing it', () => {
  const before = write('Send invoices fast\n');
  const after = write('Send invoices fast, from $9 a month\n');
  const { code, out } = run(before, after);
  assert.equal(code, 0);
  assert.match(out, /^PASS: after has 4 more words than before and nothing flagged$/m);
  assert.match(out, /^NOTE: /m);
});

test('fails an after screen that still has a flagged word or weak label', () => {
  const before = write('A powerful platform for sending every invoice\nSubmit\n');
  const after = write('A powerful way to send invoices\nSubmit\n');
  const { code, out } = run(before, after);
  assert.equal(code, 1);
  assert.match(out, /^FAIL: after has 1 fewer word than before and 1 flagged word and 1 weak button label$/m);
});

test('reads an empty file and a long line of punctuation quickly', () => {
  assert.match(run(write('')).out, /^screen: 0 words, 0 flagged words, 0 weak button labels$/m);
  const started = Date.now();
  const { code, out } = run(write('a' + '! '.repeat(200000) + 'a\n'));
  assert.equal(code, 0);
  assert.match(out, /^screen: 2 words/m);
  assert.ok(Date.now() - started < 5000, 'a 400,000-character line must not take seconds');
});

test('rejects bad usage with exit 2', () => {
  assert.equal(run().code, 2);
  const file = write('x\n');
  assert.equal(run(file, file, file).code, 2);
  const missing = run(path.join(os.tmpdir(), 'screen-counts-missing', 'nope.txt'));
  assert.equal(missing.code, 2);
  assert.match(missing.err, /screen-counts:/);
});
