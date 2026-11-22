const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');

const SCRIPT = path.join(__dirname, '..', '..', 'skills', 'ai-seo', 'scripts', 'check-ai-crawlers.mjs');
const load = () => import(pathToFileURL(SCRIPT).href);

test('AI_BOTS matches Step 4 search discovery, user retrieval, training, and Google-Extended', async () => {
  const { AI_BOTS } = await load();
  const tokens = new Set(AI_BOTS.map((b) => b.token));
  for (const expected of [
    'OAI-SearchBot',
    'PerplexityBot',
    'Claude-SearchBot',
    'meta-webindexer',
    'Googlebot',
    'Bingbot',
    'ChatGPT-User',
    'Claude-User',
    'Perplexity-User',
    'meta-externalfetcher',
    'GPTBot',
    'ClaudeBot',
    'meta-externalagent',
    'Google-Extended',
  ]) {
    assert.ok(tokens.has(expected), `missing bot ${expected}`);
  }
  const ge = AI_BOTS.find((b) => b.token === 'Google-Extended');
  assert.equal(ge.httpCrawler, false);
});

test('parseRobotsTxt and evaluateBotAccess follow named-group override and specificity', async () => {
  const { parseRobotsTxt, evaluateBotAccess } = await load();
  const robots = `
# Allow discovery, block training
User-agent: *
Allow: /
Disallow: /private/

User-agent: GPTBot
User-agent: ClaudeBot
Disallow: /

User-agent: OAI-SearchBot
Disallow: /blog/
Allow: /blog/public-post$
`;
  const groups = parseRobotsTxt(robots);

  // Named group replaces wildcard rather than inheriting Allow: /
  assert.equal(evaluateBotAccess(groups, 'GPTBot', '/').status, 'disallowed');
  assert.equal(evaluateBotAccess(groups, 'ClaudeBot', '/pricing').status, 'disallowed');

  // Specificity: Allow: /blog/public-post$ beats Disallow: /blog/
  assert.equal(evaluateBotAccess(groups, 'OAI-SearchBot', '/blog/draft').status, 'disallowed');
  assert.equal(evaluateBotAccess(groups, 'OAI-SearchBot', '/blog/public-post').status, 'allowed');
  assert.equal(evaluateBotAccess(groups, 'OAI-SearchBot', '/pricing').status, 'allowed');

  // Wildcard applies to bots without a named group
  assert.equal(evaluateBotAccess(groups, 'PerplexityBot', '/').status, 'allowed');
  assert.equal(evaluateBotAccess(groups, 'PerplexityBot', '/private/doc').status, 'disallowed');
});

test('classifyHttpResponse detects WAF blocks, challenges, and rate limits', async () => {
  const { classifyHttpResponse } = await load();
  assert.equal(classifyHttpResponse({ status: 200, headers: {}, bodySnippet: '<html>ok</html>' }).outcome, 'ok');
  assert.equal(classifyHttpResponse({ status: 403, headers: { server: 'cloudflare' }, bodySnippet: 'Access Denied' }).blocked, true);
  assert.equal(classifyHttpResponse({ status: 403, headers: { 'cf-mitigated': 'challenge' }, bodySnippet: 'Just a moment...' }).outcome, 'challenged');
  assert.equal(classifyHttpResponse({ status: 200, headers: {}, bodySnippet: '<html><title>Just a moment...</title><div class="cf-chl-widget"></div></html>' }).outcome, 'challenged');
  assert.equal(classifyHttpResponse({ status: 429, headers: {}, bodySnippet: 'Too Many Requests' }).outcome, 'rate-limited');
});

test('runAudit fetches robots.txt and flags CDN/WAF blocks on sample URL', async () => {
  const { runAudit, parseArgs, formatReport } = await load();

  const server = http.createServer((req, res) => {
    if (req.url === '/robots.txt') {
      res.writeHead(200, { 'content-type': 'text/plain' });
      res.end([
        'User-agent: *',
        'Allow: /',
        '',
        'User-agent: GPTBot',
        'Disallow: /',
      ].join('\n'));
      return;
    }
    if (req.url === '/pricing') {
      const ua = req.headers['user-agent'] || '';
      if (ua.includes('OAI-SearchBot')) {
        res.writeHead(403, { 'content-type': 'text/html', server: 'cloudflare', 'cf-mitigated': 'challenge' });
        res.end('<html><title>Just a moment...</title></html>');
        return;
      }
      if (ua.includes('PerplexityBot')) {
        res.writeHead(429, { 'content-type': 'text/plain' });
        res.end('Rate limited');
        return;
      }
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end('<html><body>Pricing</body></html>');
      return;
    }
    res.writeHead(404);
    res.end('Not found');
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const opts = parseArgs([`${baseUrl}/pricing`, '--probe']);
    const report = await runAudit(opts);

    const gpt = report.results.find((r) => r.token === 'GPTBot');
    assert.equal(gpt.robots.status, 'disallowed');
    assert.equal(gpt.discrepancy, false);

    const oai = report.results.find((r) => r.token === 'OAI-SearchBot');
    assert.equal(oai.robots.status, 'allowed');
    assert.equal(oai.probe.outcome, 'challenged');
    assert.equal(oai.discrepancy, true);

    const pplx = report.results.find((r) => r.token === 'PerplexityBot');
    assert.equal(pplx.robots.status, 'allowed');
    assert.equal(pplx.probe.outcome, 'rate-limited');
    assert.equal(pplx.discrepancy, true);

    const claude = report.results.find((r) => r.token === 'Claude-SearchBot');
    assert.equal(claude.robots.status, 'allowed');
    assert.equal(claude.probe.outcome, 'ok');
    assert.equal(claude.discrepancy, false);

    const ge = report.results.find((r) => r.token === 'Google-Extended');
    assert.equal(ge.probe.skipped, true);

    const text = formatReport(report);
    assert.match(text, /FINDING: allowed in robots\.txt but blocked\/challenged at HTTP layer/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('runAudit reports blocked robots.txt as a finding instead of bypassing', async () => {
  const { runAudit, parseArgs } = await load();

  const server = http.createServer((req, res) => {
    res.writeHead(403, { 'content-type': 'text/plain', server: 'cloudflare' });
    res.end('Forbidden');
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    const report = await runAudit(parseArgs([`http://127.0.0.1:${port}`]));
    assert.equal(report.robots.status, 403);
    assert.equal(report.robots.outcome, 'blocked');
    assert.match(report.robots.error, /HTTP 403/);
    assert.ok(report.results.every((r) => r.robots.status === 'unknown'));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('CLI supports --help and --robots-file --json end-to-end', () => {
  const helpOut = execFileSync(process.execPath, [SCRIPT, '--help'], { encoding: 'utf8' });
  assert.match(helpOut, /Usage: node check-ai-crawlers\.mjs/);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-seo-crawlers-'));
  const robotsPath = path.join(tmpDir, 'robots.txt');
  fs.writeFileSync(robotsPath, 'User-agent: *\nAllow: /\nUser-agent: Google-Extended\nDisallow: /\n', 'utf8');

  try {
    const jsonOut = execFileSync(process.execPath, [SCRIPT, '--robots-file', robotsPath, '--json'], { encoding: 'utf8' });
    const parsed = JSON.parse(jsonOut);
    const ge = parsed.results.find((r) => r.token === 'Google-Extended');
    const oai = parsed.results.find((r) => r.token === 'OAI-SearchBot');
    assert.equal(ge.robots.status, 'disallowed');
    assert.equal(oai.robots.status, 'allowed');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
