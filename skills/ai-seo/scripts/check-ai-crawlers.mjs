#!/usr/bin/env node
// Audit robots.txt rules and optional CDN/WAF responses for AI search, retrieval,
// and training user agents (aligned with skills/ai-seo/SKILL.md Step 4).
// Zero external dependencies; requires Node.js 18+.

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const AI_BOTS = [
  // Search discovery
  { token: 'OAI-SearchBot', purpose: 'search-discovery', owner: 'OpenAI (ChatGPT Search)', httpCrawler: true, userAgent: 'OAI-SearchBot/1.0 (+https://openai.com/searchbot)' },
  { token: 'PerplexityBot', purpose: 'search-discovery', owner: 'Perplexity', httpCrawler: true, userAgent: 'PerplexityBot/1.0 (+https://perplexity.ai/perplexitybot)' },
  { token: 'Claude-SearchBot', purpose: 'search-discovery', owner: 'Anthropic (Claude)', httpCrawler: true, userAgent: 'Claude-SearchBot/1.0 (+https://support.anthropic.com)' },
  { token: 'meta-webindexer', purpose: 'search-discovery', owner: 'Meta AI', httpCrawler: true, userAgent: 'meta-webindexer/1.0 (+https://developers.facebook.com/docs/sharing/webmasters/web-crawlers)' },
  { token: 'Googlebot', purpose: 'search-discovery', owner: 'Google Search / AI Overviews / AI Mode', httpCrawler: true, userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
  { token: 'Bingbot', purpose: 'search-discovery', owner: 'Bing / Copilot / ChatGPT index', httpCrawler: true, userAgent: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)' },

  // User-triggered retrieval
  { token: 'ChatGPT-User', purpose: 'user-retrieval', owner: 'OpenAI (ChatGPT user fetch)', httpCrawler: true, userAgent: 'ChatGPT-User/1.0 (+https://openai.com/bot)', note: 'OpenAI states robots.txt rules may not apply to user-triggered fetches.' },
  { token: 'Claude-User', purpose: 'user-retrieval', owner: 'Anthropic (Claude user fetch)', httpCrawler: true, userAgent: 'Claude-User/1.0 (+https://support.anthropic.com)' },
  { token: 'Perplexity-User', purpose: 'user-retrieval', owner: 'Perplexity (user fetch)', httpCrawler: true, userAgent: 'Perplexity-User/1.0 (+https://perplexity.ai/perplexity-user)', note: 'Perplexity states Perplexity-User generally ignores robots.txt for user-requested fetches.' },
  { token: 'meta-externalfetcher', purpose: 'user-retrieval', owner: 'Meta AI (user fetch)', httpCrawler: true, userAgent: 'meta-externalfetcher/1.0 (+https://developers.facebook.com/docs/sharing/webmasters/web-crawlers)', note: 'Meta states meta-externalfetcher may bypass robots.txt.' },

  // Potential model training
  { token: 'GPTBot', purpose: 'training', owner: 'OpenAI (model training)', httpCrawler: true, userAgent: 'GPTBot/1.0 (+https://openai.com/gptbot)' },
  { token: 'ClaudeBot', purpose: 'training', owner: 'Anthropic (model training)', httpCrawler: true, userAgent: 'ClaudeBot/1.0 (+https://support.anthropic.com)' },
  { token: 'meta-externalagent', purpose: 'training', owner: 'Meta (model training)', httpCrawler: true, userAgent: 'meta-externalagent/1.0 (+https://developers.facebook.com/docs/sharing/webmasters/web-crawlers)' },

  // Google product control
  { token: 'Google-Extended', purpose: 'product-control', owner: 'Google (Gemini training and grounding)', httpCrawler: false, note: 'Standalone robots.txt product token, not a separate HTTP crawler; does not affect Google Search.' },
];

const DEFAULT_TIMEOUT_MS = 8000;

export const USAGE = `Usage: node check-ai-crawlers.mjs <url-or-domain> [options]

Checks robots.txt rules per AI user agent (aligned with ai-seo Step 4) and
optionally probes a sample URL with each crawler User-Agent to catch CDN/WAF
blocks that robots.txt does not show.

Options:
  --url <url>           Target URL or domain (alternative to positional arg)
  --path <path>         Path to test in robots.txt (default: target URL path or /)
  --probe               Fetch the target URL with each HTTP crawler User-Agent
  --probe-url <url>     Specific sample URL to probe (implies --probe)
  --robots-file <file>  Read robots.txt from a local file instead of fetching it
  --bots <a,b,...>      Comma-separated subset of bot tokens to check
  --timeout <ms>        HTTP request timeout in ms (default: ${DEFAULT_TIMEOUT_MS})
  --json                Emit machine-readable JSON output
  -h, --help            Show this help message

A failed fetch or a WAF/CDN block is reported as a finding, never bypassed.`;

export function normalizeTarget(rawTarget) {
  const trimmed = (rawTarget || '').trim();
  if (!trimmed) throw new Error('Missing target URL or domain');
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const parsed = new URL(withScheme);
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Unsupported URL protocol: ${parsed.protocol}`);
  }
  const pathWithQuery = `${parsed.pathname || '/'}${parsed.search || ''}`;
  return {
    origin: parsed.origin,
    robotsUrl: `${parsed.origin}/robots.txt`,
    sampleUrl: parsed.href,
    defaultPath: pathWithQuery || '/',
  };
}

export function parseArgs(argv) {
  const opts = {
    url: '',
    path: '',
    probe: false,
    probeUrl: '',
    robotsFile: '',
    bots: [],
    timeoutMs: DEFAULT_TIMEOUT_MS,
    json: false,
    help: false,
  };
  const pos = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '-h' || arg === '--help') {
      opts.help = true;
    } else if (arg === '--json') {
      opts.json = true;
    } else if (arg === '--probe') {
      opts.probe = true;
    } else if (arg === '--url' || arg === '--path' || arg === '--probe-url' || arg === '--robots-file' || arg === '--bots' || arg === '--timeout') {
      const val = argv[++i];
      if (val === undefined) throw new Error(`Missing value for ${arg}`);
      if (arg === '--url') opts.url = val;
      else if (arg === '--path') opts.path = val;
      else if (arg === '--probe-url') {
        opts.probeUrl = val;
        opts.probe = true;
      } else if (arg === '--robots-file') opts.robotsFile = val;
      else if (arg === '--bots') {
        opts.bots = val.split(',').map((s) => s.trim()).filter(Boolean);
      } else if (arg === '--timeout') {
        const ms = Number(val);
        if (!Number.isFinite(ms) || ms <= 0) throw new Error(`Invalid --timeout value: ${val}`);
        opts.timeoutMs = ms;
      }
    } else if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      pos.push(arg);
    }
  }

  if (!opts.url && pos.length > 0) opts.url = pos[0];
  return opts;
}

export function parseRobotsTxt(text) {
  const cleaned = String(text || '').replace(/^\uFEFF/, '');
  const lines = cleaned.split(/\r?\n/);
  const groups = [];
  let current = null;
  let seenRuleInGroup = false;

  for (const rawLine of lines) {
    const noComment = rawLine.split('#')[0].trim();
    if (!noComment) {
      if (current && seenRuleInGroup) {
        groups.push(current);
        current = null;
        seenRuleInGroup = false;
      }
      continue;
    }

    const colonIdx = noComment.indexOf(':');
    if (colonIdx === -1) continue;

    const field = noComment.slice(0, colonIdx).trim().toLowerCase();
    const value = noComment.slice(colonIdx + 1).trim();

    if (field === 'user-agent') {
      if (!value) continue;
      if (!current || seenRuleInGroup) {
        if (current) groups.push(current);
        current = { agents: [], rules: [] };
        seenRuleInGroup = false;
      }
      current.agents.push(value.toLowerCase());
    } else if ((field === 'allow' || field === 'disallow') && current) {
      seenRuleInGroup = true;
      current.rules.push({ directive: field, pattern: value });
    } else if (current && seenRuleInGroup) {
      // Other group directives (e.g. crawl-delay) stay in group without starting a new one.
    }
  }

  if (current) groups.push(current);
  return groups;
}

function robotsPatternToRegex(pattern) {
  let anchoredEnd = false;
  let pat = pattern;
  if (pat.endsWith('$')) {
    anchoredEnd = true;
    pat = pat.slice(0, -1);
  }
  const escaped = pat
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${escaped}${anchoredEnd ? '$' : ''}`);
}

export function evaluateBotAccess(groups, botToken, targetPath = '/') {
  const normalizedToken = botToken.toLowerCase();
  const normalizedPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;

  // Per RFC 9309, named groups replace the wildcard group for that bot.
  const namedGroups = groups.filter((g) => g.agents.includes(normalizedToken));
  const wildcardGroups = groups.filter((g) => g.agents.includes('*'));

  let matchedGroups = [];
  let matchedBy = 'none';
  if (namedGroups.length > 0) {
    matchedGroups = namedGroups;
    matchedBy = `named (${botToken})`;
  } else if (wildcardGroups.length > 0) {
    matchedGroups = wildcardGroups;
    matchedBy = 'wildcard (*)';
  }

  const rules = matchedGroups.flatMap((g) => g.rules);
  let bestMatch = null;

  for (const rule of rules) {
    // An empty Disallow directive means allow everything; it matches nothing to block.
    if (rule.pattern === '') continue;
    const regex = robotsPatternToRegex(rule.pattern);
    if (!regex.test(normalizedPath)) continue;

    const specificity = rule.pattern.length;
    if (
      !bestMatch ||
      specificity > bestMatch.specificity ||
      (specificity === bestMatch.specificity && rule.directive === 'allow' && bestMatch.directive === 'disallow')
    ) {
      bestMatch = {
        directive: rule.directive,
        pattern: rule.pattern,
        specificity,
      };
    }
  }

  if (!bestMatch) {
    return {
      status: 'allowed',
      matchedBy,
      winningRule: rules.length === 0 ? 'implicit allow (no rules)' : 'implicit allow (no matching Disallow)',
    };
  }

  return {
    status: bestMatch.directive === 'allow' ? 'allowed' : 'disallowed',
    matchedBy,
    winningRule: `${bestMatch.directive === 'allow' ? 'Allow' : 'Disallow'}: ${bestMatch.pattern}`,
  };
}

export function classifyHttpResponse({ status, headers = {}, bodySnippet = '' }) {
  const lowerHeaders = {};
  for (const [k, v] of Object.entries(headers)) {
    lowerHeaders[k.toLowerCase()] = String(v).toLowerCase();
  }

  const server = lowerHeaders['server'] || '';
  const cfMitigated = lowerHeaders['cf-mitigated'] || '';
  const hasWafHeader = Boolean(
    cfMitigated.includes('challenge') ||
    lowerHeaders['x-datadome'] ||
    lowerHeaders['x-sucuri-id'] ||
    lowerHeaders['x-cdn'] === 'imperva'
  );

  const challengeBody = /just a moment\.\.\.|attention required!\s*\|\s*cloudflare|cf-chl-|verify you are human|please enable cookies|access denied|request unsuccessful\.?\s*incapsula|bot detection|captcha/i.test(bodySnippet);

  const signals = [];
  if (server.includes('cloudflare')) signals.push('server: cloudflare');
  if (cfMitigated) signals.push(`cf-mitigated: ${cfMitigated}`);
  if (lowerHeaders['x-datadome']) signals.push('x-datadome header');
  if (lowerHeaders['x-sucuri-id']) signals.push('x-sucuri-id header');
  if (challengeBody) signals.push('challenge or block page text');

  if (status === 429) {
    return { outcome: 'rate-limited', blocked: true, status, signals };
  }
  if (cfMitigated.includes('challenge') || (challengeBody && [200, 403, 503].includes(status))) {
    return { outcome: 'challenged', blocked: true, status, signals };
  }
  if ([401, 403, 406, 451].includes(status) || (hasWafHeader && status >= 400)) {
    return { outcome: 'blocked', blocked: true, status, signals };
  }
  if (status >= 500) {
    return { outcome: 'server-error', blocked: true, status, signals };
  }
  if (status >= 400) {
    return { outcome: 'http-error', blocked: false, status, signals };
  }
  if (status >= 200 && status < 400) {
    return { outcome: 'ok', blocked: false, status, signals };
  }
  return { outcome: 'other', blocked: false, status, signals };
}

async function fetchSnippet(url, userAgent, timeoutMs, fetchImpl = fetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': userAgent,
        'accept': 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8',
      },
    });
    const rawText = await res.text();
    const headers = Object.fromEntries(res.headers.entries());
    return {
      ok: true,
      status: res.status,
      finalUrl: res.url,
      headers,
      body: rawText,
      bodySnippet: rawText.slice(0, 4096),
    };
  } catch (err) {
    const reason = err?.name === 'AbortError' ? `timeout after ${timeoutMs}ms` : (err?.message || String(err));
    return { ok: false, error: reason };
  } finally {
    clearTimeout(timer);
  }
}

export function selectBots(filterTokens = []) {
  if (!filterTokens.length) return AI_BOTS;
  const wanted = new Set(filterTokens.map((t) => t.toLowerCase()));
  const selected = AI_BOTS.filter((b) => wanted.has(b.token.toLowerCase()));
  const known = new Set(AI_BOTS.map((b) => b.token.toLowerCase()));
  const unknown = filterTokens.filter((t) => !known.has(t.toLowerCase()));
  if (unknown.length > 0) {
    throw new Error(`Unknown bot token(s): ${unknown.join(', ')}. Supported: ${AI_BOTS.map((b) => b.token).join(', ')}`);
  }
  return selected;
}

export async function runAudit(opts, { fetchImpl = fetch, readFileImpl = readFileSync } = {}) {
  const bots = selectBots(opts.bots);
  let target = null;
  if (opts.url) {
    target = normalizeTarget(opts.url);
  } else if (opts.probeUrl) {
    target = normalizeTarget(opts.probeUrl);
  } else if (!opts.robotsFile) {
    throw new Error('Provide a target URL/domain or --robots-file');
  }

  const testPath = opts.path || (target ? target.defaultPath : '/');
  const probeTargetUrl = opts.probeUrl ? normalizeTarget(opts.probeUrl).sampleUrl : target?.sampleUrl;

  let robotsStatus = { source: '', status: null, outcome: 'ok', error: null };
  let groups = [];

  if (opts.robotsFile) {
    robotsStatus.source = opts.robotsFile;
    const text = readFileImpl(opts.robotsFile, 'utf8');
    groups = parseRobotsTxt(text);
  } else {
    robotsStatus.source = target.robotsUrl;
    const res = await fetchSnippet(target.robotsUrl, 'Mozilla/5.0 (compatible; marketingskills-ai-seo-check/1.0)', opts.timeoutMs, fetchImpl);
    if (!res.ok) {
      robotsStatus.outcome = 'fetch-error';
      robotsStatus.error = res.error;
    } else {
      robotsStatus.status = res.status;
      if (res.status === 404 || res.status === 410) {
        robotsStatus.outcome = 'missing';
        groups = [];
      } else {
        const classified = classifyHttpResponse({
          status: res.status,
          headers: res.headers,
          bodySnippet: res.bodySnippet,
        });
        robotsStatus.outcome = classified.outcome;
        if (!classified.blocked && res.status >= 200 && res.status < 300) {
          groups = parseRobotsTxt(res.body);
        } else {
          robotsStatus.error = `robots.txt returned HTTP ${res.status} (${classified.outcome})`;
        }
      }
    }
  }

  const results = [];
  for (const bot of bots) {
    const robots = robotsStatus.error
      ? { status: 'unknown', matchedBy: 'unavailable', winningRule: robotsStatus.error }
      : evaluateBotAccess(groups, bot.token, testPath);

    let probe = null;
    if (opts.probe) {
      if (!probeTargetUrl) {
        throw new Error('--probe requires a target URL or --probe-url');
      }
      if (!bot.httpCrawler) {
        probe = { skipped: true, reason: 'Standalone robots.txt product token, not a separate HTTP crawler' };
      } else {
        const res = await fetchSnippet(probeTargetUrl, bot.userAgent, opts.timeoutMs, fetchImpl);
        if (!res.ok) {
          probe = { skipped: false, outcome: 'fetch-error', blocked: true, error: res.error, signals: [] };
        } else {
          probe = { skipped: false, ...classifyHttpResponse(res) };
        }
      }
    }

    const discrepancy = Boolean(
      probe &&
      !probe.skipped &&
      robots.status === 'allowed' &&
      probe.blocked
    );

    results.push({
      token: bot.token,
      purpose: bot.purpose,
      owner: bot.owner,
      robots,
      probe,
      discrepancy,
      ...(bot.note ? { note: bot.note } : {}),
    });
  }

  return {
    robots: robotsStatus,
    path: testPath,
    probeUrl: opts.probe ? probeTargetUrl : null,
    results,
  };
}

export function formatReport(report) {
  const lines = [];
  lines.push(`robots.txt source: ${report.robots.source}${report.robots.status !== null ? ` (HTTP ${report.robots.status}, ${report.robots.outcome})` : ` (${report.robots.outcome})`}`);
  if (report.robots.error) {
    lines.push(`robots.txt finding: ${report.robots.error}`);
  } else if (report.robots.outcome === 'missing') {
    lines.push('robots.txt finding: no robots.txt found (HTTP 404/410 means implicit allow for all crawlers)');
  }
  lines.push(`Evaluated path: ${report.path}`);
  if (report.probeUrl) {
    lines.push(`Probed sample URL: ${report.probeUrl}`);
  }
  lines.push('');

  const sections = [
    ['search-discovery', 'Search Discovery'],
    ['user-retrieval', 'User-Triggered Retrieval'],
    ['training', 'Potential Model Training'],
    ['product-control', 'Google Product Control'],
  ];

  for (const [purpose, label] of sections) {
    const group = report.results.filter((r) => r.purpose === purpose);
    if (!group.length) continue;
    lines.push(`${label}:`);
    for (const r of group) {
      let line = `  - ${r.token} (${r.owner}): robots=${r.robots.status} [${r.robots.matchedBy}: ${r.robots.winningRule}]`;
      if (r.probe) {
        if (r.probe.skipped) {
          line += ` | probe=skipped (${r.probe.reason})`;
        } else if (r.probe.outcome === 'fetch-error') {
          line += ` | probe=fetch-error (${r.probe.error})`;
        } else {
          const sig = r.probe.signals?.length ? ` [${r.probe.signals.join(', ')}]` : '';
          line += ` | probe=HTTP ${r.probe.status} (${r.probe.outcome})${sig}`;
        }
      }
      if (r.discrepancy) {
        line += ' | FINDING: allowed in robots.txt but blocked/challenged at HTTP layer (CDN/WAF)';
      }
      lines.push(line);
      if (r.note) lines.push(`    Note: ${r.note}`);
    }
    lines.push('');
  }

  if (report.probeUrl) {
    lines.push('Reminder: WAFs sometimes block self-identified Googlebot/Bingbot requests that lack Google/Bing reverse DNS. Verify Search Console or Bing Webmaster Tools before treating a spoof-check block as a live Googlebot/Bingbot outage.');
  }

  return lines.join('\n').trimEnd();
}

async function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`Error: ${err.message}\n\n${USAGE}`);
    process.exitCode = 1;
    return;
  }

  if (opts.help || (!opts.url && !opts.probeUrl && !opts.robotsFile)) {
    console.log(USAGE);
    return;
  }

  const report = await runAudit(opts);
  if (opts.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(formatReport(report));
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exitCode = 1;
  });
}
