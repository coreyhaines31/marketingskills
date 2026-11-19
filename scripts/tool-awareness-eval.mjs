#!/usr/bin/env node
// Tool awareness eval: when a skill names a tool, does the answer bring it up where it
// fits, next to alternatives and with the risk stated, and leave it out where it doesn't?
// Runs each prompt through headless Claude Code with one copy of the pack loaded, keeps
// the full reply, and scores it with plain text matching. Run it once per variant of a
// skill (current, proposed, a vendor's wording) and compare the summaries.
//
//   node scripts/tool-awareness-eval.mjs --prompts evals/tool-awareness/link-building.json
//     [--plugin-dir .] [--model sonnet] [--concurrency 4] [--repeat 3] [--label baseline]
//     [--out evals/tool-awareness/results/<label>.json]
//
// Uses your logged-in Claude Code (it runs `claude -p`), so each prompt costs a request.

import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function parseArgs(argv) {
  const opts = { 'plugin-dir': ROOT, model: 'sonnet', concurrency: 4, repeat: 3, label: 'run' };
  for (let i = 0; i < argv.length; i += 2) opts[argv[i].replace(/^--/, '')] = argv[i + 1];
  opts['plugin-dir'] = path.resolve(opts['plugin-dir']);
  opts.concurrency = Number(opts.concurrency);
  opts.repeat = Number(opts.repeat);
  return opts;
}

// Reads Claude Code's stream-json output: the final reply, the skills invoked, and the cost.
export function parseRun(streamText) {
  const skills = [];
  let reply = null;
  let cost = 0;
  for (const line of streamText.split('\n')) {
    let event;
    try { event = JSON.parse(line); } catch { continue; }
    if (event.type === 'assistant') {
      for (const part of event.message?.content || []) {
        if (part.type === 'tool_use' && part.name === 'Skill' && part.input?.skill) skills.push(part.input.skill);
      }
    }
    if (event.type === 'result') {
      reply = typeof event.result === 'string' ? event.result : '';
      cost = event.total_cost_usd || 0;
    }
  }
  return { skills, reply, cost };
}

const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Scores one reply. `alternatives` and `risk` are regex sources from the prompts file.
export function scoreReply(reply, config) {
  const subjectAt = reply.search(new RegExp(escape(config.subject), 'i'));
  const named = config.alternatives.filter(a => new RegExp(a, 'i').test(reply));
  const firstAlt = Math.min(...config.alternatives.map(a => reply.search(new RegExp(a, 'i'))).filter(i => i >= 0));
  return {
    subject: subjectAt >= 0,
    alternatives: named.length,
    subjectFirst: subjectAt >= 0 && subjectAt < firstAlt,
    subjectOnly: subjectAt >= 0 && named.length === 0,
    risk: new RegExp(config.risk, 'i').test(reply),
  };
}

export function summarize(rows) {
  const out = {};
  for (const kind of [...new Set(rows.map(r => r.kind))]) {
    const ok = rows.filter(r => r.kind === kind && !r.error);
    const rate = key => (ok.length ? Math.round((100 * ok.filter(r => r[key]).length) / ok.length) : null);
    out[kind] = {
      runs: ok.length,
      skillLoadedPct: rate('skillLoaded'),
      subjectNamedPct: rate('subject'),
      subjectFirstPct: rate('subjectFirst'),
      subjectOnlyPct: rate('subjectOnly'),
      meanAlternatives: ok.length ? Number((ok.reduce((n, r) => n + r.alternatives, 0) / ok.length).toFixed(2)) : null,
      riskStatedPct: rate('risk'),
    };
  }
  return out;
}

function runOne(prompt, opts, cwd) {
  const args = ['-p', prompt, '--plugin-dir', opts['plugin-dir'], '--setting-sources', 'project', '--strict-mcp-config',
    '--tools', 'Skill,Read', '--max-turns', '8', '--no-session-persistence', '--model', opts.model,
    '--output-format', 'stream-json', '--verbose'];
  return new Promise(resolve => {
    const child = spawn('claude', args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', d => { stdout += d; });
    child.stderr.on('data', d => { stderr += d; });
    const timer = setTimeout(() => child.kill('SIGKILL'), 300000);
    child.on('close', (code, signal) => {
      clearTimeout(timer);
      const run = parseRun(stdout);
      let error = null;
      if (signal) error = `killed by ${signal} (timeout)`;
      else if (run.reply === null) error = stderr.trim().split('\n').pop() || `exit ${code} with no result`;
      resolve({ ...run, error });
    });
  });
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const config = JSON.parse(readFileSync(path.resolve(ROOT, opts.prompts), 'utf8'));
  // `skill` is one skill name or a regex alternation of several ("ads|analytics").
  const skillPattern = new RegExp(`(^|:)(${config.skill})$`);
  const jobs = [];
  for (let r = 0; r < opts.repeat; r++) for (const item of config.prompts) jobs.push({ item, run: r + 1 });

  const cwd = mkdtempSync(path.join(tmpdir(), 'tool-awareness-eval-'));
  const rows = [];
  let next = 0;
  let cost = 0;
  const worker = async () => {
    while (next < jobs.length) {
      const { item, run } = jobs[next++];
      const res = await runOne(item.prompt, opts, cwd);
      cost += res.cost;
      const s = res.error ? {} : scoreReply(res.reply, config);
      rows.push({ id: item.id, run, kind: item.kind, skillLoaded: res.skills.some(k => skillPattern.test(k)), ...s, error: res.error, reply: res.reply });
      process.stderr.write(`[${rows.length}/${jobs.length}] ${item.id} ${res.error ? `error: ${res.error}` : `subject=${s.subject} alts=${s.alternatives} risk=${s.risk}`}\n`);
    }
  };
  await Promise.all(Array.from({ length: opts.concurrency }, worker));

  rows.sort((a, b) => a.id.localeCompare(b.id) || a.run - b.run);
  const report = { label: opts.label, ran: new Date().toISOString(), model: opts.model, pluginDir: opts['plugin-dir'], costUsd: Number(cost.toFixed(2)), errors: rows.filter(r => r.error).length, summary: summarize(rows), rows };
  const out = path.resolve(ROOT, opts.out || `evals/tool-awareness/results/${opts.label}.json`);
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ label: report.label, costUsd: report.costUsd, errors: report.errors, summary: report.summary }, null, 2));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
