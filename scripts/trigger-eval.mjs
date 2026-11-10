#!/usr/bin/env node
// Skill trigger eval: does Claude Code pick the right skill for a prompt when the
// whole pack is installed? Runs each prompt in evals/triggers/prompts.json through
// headless Claude Code with the pack loaded as a plugin, records the first skill it
// invokes, and scores it against the expected skills.
//
//   node scripts/trigger-eval.mjs [--plugin-dir .] [--extra-plugin-dir dir ...]
//     [--model sonnet] [--concurrency 4] [--repeat 1] [--only id,id] [--kind direct]
//     [--prompts evals/triggers/heldout.json] [--label baseline] [--out evals/triggers/results/<label>.json]
//
// Uses your logged-in Claude Code (it runs `claude -p`), so each prompt costs a
// request. User and local settings are not loaded, so only this pack (plus any
// --extra-plugin-dir) and Claude Code's built-in skills are installed.

import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function parseArgs(argv) {
  const opts = { 'plugin-dir': ROOT, 'extra-plugin-dir': [], model: 'sonnet', concurrency: 4, repeat: 1, label: 'run' };
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i].replace(/^--/, '');
    const val = argv[i + 1];
    if (key === 'extra-plugin-dir') opts[key].push(val);
    else opts[key] = val;
    i++;
  }
  opts['plugin-dir'] = path.resolve(opts['plugin-dir']);
  opts['extra-plugin-dir'] = opts['extra-plugin-dir'].map(d => path.resolve(d));
  opts.concurrency = Number(opts.concurrency);
  opts.repeat = Number(opts.repeat);
  return opts;
}

// Reads Claude Code's stream-json output and returns every skill the model invoked, in order.
export function skillsInvoked(streamText) {
  const out = [];
  let cost = 0;
  let finished = false;
  let text = '';
  for (const line of streamText.split('\n')) {
    let event;
    try { event = JSON.parse(line); } catch { continue; }
    if (event.type === 'assistant') {
      for (const part of event.message?.content || []) {
        if (part.type === 'tool_use' && part.name === 'Skill' && part.input?.skill) out.push(part.input.skill);
        if (part.type === 'text' && !text) text = part.text.slice(0, 300);
      }
    }
    if (event.type === 'result') {
      finished = true;
      cost = event.total_cost_usd || 0;
    }
  }
  return { skills: out, cost, finished, text };
}

// Scores the first skill invoked. A skill from outside this pack (built in or another plugin) is "other-skill".
// A run that failed (no result event, timeout, auth error) is "error" and left out of the routing metrics.
export function score(item, invoked, packName = 'marketing-skills', failed = false) {
  const first = invoked[0] || null;
  const pick = first && first.startsWith(`${packName}:`) ? first.slice(packName.length + 1) : null;
  let outcome;
  if (failed) outcome = 'error';
  else if (!item.expect.length) outcome = invoked.some(s => s.startsWith(`${packName}:`)) ? 'false-trigger' : 'pass';
  else if (!pick) outcome = first ? 'other-skill' : 'no-trigger';
  else outcome = item.expect.includes(pick) ? 'pass' : 'wrong-skill';
  return { outcome, pick, first };
}

export function summarize(rows) {
  const errors = rows.filter(r => r.outcome === 'error').length;
  rows = rows.filter(r => r.outcome !== 'error');
  const count = (list, o) => list.filter(r => r.outcome === o).length;
  const pct = (n, d) => (d ? Math.round((1000 * n) / d) / 10 : 0);
  const kinds = [...new Set(rows.map(r => r.kind))];
  const byKind = Object.fromEntries(kinds.map(k => {
    const list = rows.filter(r => r.kind === k);
    return [k, { n: list.length, pass: pct(count(list, 'pass'), list.length) }];
  }));
  const positives = rows.filter(r => r.kind !== 'none');
  const confusions = {};
  for (const r of rows.filter(r => r.outcome === 'wrong-skill')) {
    const key = `${r.expect[0]} -> ${r.pick}`;
    confusions[key] = (confusions[key] || 0) + 1;
  }
  const perSkill = {};
  for (const r of positives) {
    const s = (perSkill[r.expect[0]] ??= { n: 0, pass: 0 });
    s.n++;
    if (r.outcome === 'pass') s.pass++;
  }
  return {
    n: rows.length,
    pass: pct(count(rows, 'pass'), rows.length),
    positives: {
      n: positives.length,
      pass: pct(count(positives, 'pass'), positives.length),
      wrong_skill: count(positives, 'wrong-skill'),
      no_trigger: count(positives, 'no-trigger'),
      other_skill: count(positives, 'other-skill'),
    },
    false_triggers: count(rows, 'false-trigger'),
    errors,
    by_kind: byKind,
    confusions: Object.entries(confusions).sort((a, b) => b[1] - a[1]).map(([pair, n]) => ({ pair, n })),
    weakest: Object.entries(perSkill).filter(([, s]) => s.pass < s.n).sort((a, b) => a[1].pass / a[1].n - b[1].pass / b[1].n)
      .map(([skill, s]) => ({ skill, pass: `${s.pass}/${s.n}` })),
  };
}

// Reads the description from SKILL.md frontmatter: plain, single- or double-quoted, or a block scalar (> or |).
export function descriptionOf(text) {
  const fm = text.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const lines = fm.split('\n');
  const i = lines.findIndex(l => /^description:/.test(l));
  if (i < 0) return '';
  const raw = lines[i].replace(/^description:[ \t]*/, '');
  if (/^[>|]/.test(raw)) {
    const body = [];
    for (const l of lines.slice(i + 1)) {
      if (l.trim() && !/^[ \t]/.test(l)) break;
      body.push(l.trim());
    }
    return raw.startsWith('|') ? body.join('\n').trim() : body.filter(Boolean).join(' ');
  }
  const dq = raw.match(/^"((?:[^"\\]|\\.)*)"/);
  if (dq) return JSON.parse(`"${dq[1]}"`);
  const sq = raw.match(/^'((?:[^']|'')*)'/);
  if (sq) return sq[1].replace(/''/g, "'");
  return raw.replace(/\s+#.*$/, '').trim();
}

// Description text that sits in the skill listing on every message.
export function residentChars(pluginDir) {
  const dir = path.join(pluginDir, 'skills');
  let chars = 0;
  for (const name of readdirSync(dir)) {
    let text;
    try { text = readFileSync(path.join(dir, name, 'SKILL.md'), 'utf8'); } catch { continue; }
    chars += descriptionOf(text).length + name.length;
  }
  return chars;
}

function runOne(item, opts, cwd) {
  const args = ['-p', item.prompt, '--plugin-dir', opts['plugin-dir'], ...opts['extra-plugin-dir'].flatMap(d => ['--plugin-dir', d]),
    '--setting-sources', 'project', '--strict-mcp-config', '--tools', 'Skill', '--max-turns', '1',
    '--no-session-persistence', '--model', opts.model, '--output-format', 'stream-json', '--verbose'];
  return new Promise(resolve => {
    const child = spawn('claude', args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', d => { stdout += d; });
    child.stderr.on('data', d => { stderr += d; });
    const timer = setTimeout(() => child.kill('SIGKILL'), 120000);
    child.on('close', (code, signal) => {
      clearTimeout(timer);
      const { skills, cost, finished, text } = skillsInvoked(stdout);
      let error = null;
      if (signal) error = `killed by ${signal} (timeout)`;
      else if (!finished) error = stderr.trim().split('\n').pop() || `exit ${code} with no result`;
      resolve({ skills, cost, error, text });
    });
  });
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const all = JSON.parse(readFileSync(path.resolve(ROOT, opts.prompts || 'evals/triggers/prompts.json'), 'utf8')).prompts;
  let items = all;
  if (opts.only) items = items.filter(p => opts.only.split(',').includes(p.id));
  if (opts.kind) items = items.filter(p => p.kind === opts.kind);
  const jobs = [];
  for (let r = 0; r < opts.repeat; r++) for (const item of items) jobs.push({ item, run: r + 1 });

  const cwd = mkdtempSync(path.join(tmpdir(), 'trigger-eval-'));
  const rows = [];
  let next = 0;
  let cost = 0;
  const worker = async () => {
    while (next < jobs.length) {
      const { item, run } = jobs[next++];
      const res = await runOne(item, opts, cwd);
      const s = score(item, res.skills, 'marketing-skills', Boolean(res.error));
      cost += res.cost;
      rows.push({ id: item.id, run, kind: item.kind, expect: item.expect, invoked: res.skills, ...s, error: res.error, ...(s.outcome === 'pass' ? {} : { reply: res.text }) });
      process.stderr.write(`[${rows.length}/${jobs.length}] ${s.outcome.padEnd(13)} ${item.id}${s.pick && s.outcome !== 'pass' ? ` -> ${s.pick}` : ''}${res.error ? ` (${res.error})` : ''}\n`);
    }
  };
  await Promise.all(Array.from({ length: opts.concurrency }, worker));

  rows.sort((a, b) => a.id.localeCompare(b.id) || a.run - b.run);
  const report = {
    label: opts.label,
    ran: new Date().toISOString(),
    model: opts.model,
    plugin_dir: opts['plugin-dir'],
    extra_plugin_dirs: opts['extra-plugin-dir'],
    resident_description_chars: residentChars(opts['plugin-dir']),
    cost_usd: Math.round(cost * 100) / 100,
    summary: summarize(rows),
    rows,
  };
  const out = opts.out || path.join(ROOT, 'evals/triggers/results', `${opts.label}.json`);
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ out: path.relative(ROOT, out), resident_description_chars: report.resident_description_chars, cost_usd: report.cost_usd, ...report.summary }, null, 2));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
