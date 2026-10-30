#!/usr/bin/env node
// Free-source collection and analysis for a growth teardown. Node 18+, no dependencies.
// Run with no arguments for usage.

import { gunzipSync } from 'node:zlib';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const UA = 'Mozilla/5.0 (compatible; marketingskills-teardown/1.0)';
const WAYBACK_DELAY_MS = 1500;

export const SIGNATURES = [
  { tool: 'Meta Pixel', group: 'ads', patterns: [/connect\.facebook\.net\/[^"']*fbevents\.js/, /\bfbq\(\s*['"]init/] },
  { tool: 'Google Ads', group: 'ads', patterns: [/googleadservices\.com\/pagead\/conversion/, /['"]AW-\d{6,}/] },
  { tool: 'Microsoft Ads (UET)', group: 'ads', patterns: [/bat\.bing\.com\/bat\.js/] },
  { tool: 'X Ads', group: 'ads', patterns: [/static\.ads-twitter\.com\/uwt\.js/, /\btwq\(\s*['"]/] },
  { tool: 'Reddit Ads', group: 'ads', patterns: [/redditstatic\.com\/ads\/pixel\.js/, /\brdt\(\s*['"]init/] },
  { tool: 'TikTok Pixel', group: 'ads', patterns: [/analytics\.tiktok\.com\/i18n\/pixel/, /\bttq\.load\(/] },
  { tool: 'LinkedIn Insight', group: 'ads', patterns: [/snap\.licdn\.com\/li\.lms-analytics/, /_linkedin_partner_id/] },
  { tool: 'Quora Pixel', group: 'ads', patterns: [/a\.quora\.com\/qevents\.js/] },
  { tool: 'Google Analytics', group: 'analytics', patterns: [/googletagmanager\.com\/gtag\/js\?id=G-/, /google-analytics\.com\/analytics\.js/] },
  { tool: 'Google Tag Manager', group: 'analytics', patterns: [/googletagmanager\.com\/gtm\.js/, /['"]GTM-[A-Z0-9]{4,}/] },
  { tool: 'Segment', group: 'analytics', patterns: [/cdn\.segment\.com\/analytics\.js/] },
  { tool: 'PostHog', group: 'analytics', patterns: [/i\.posthog\.com/, /app\.posthog\.com/, /posthog\.init\(/] },
  { tool: 'Mixpanel', group: 'analytics', patterns: [/cdn\.mxpnl\.com/, /mixpanel\.init\(/] },
  { tool: 'Amplitude', group: 'analytics', patterns: [/cdn\.amplitude\.com/] },
  { tool: 'Hotjar', group: 'analytics', patterns: [/static\.hotjar\.com/] },
  { tool: 'Microsoft Clarity', group: 'analytics', patterns: [/clarity\.ms\/tag/] },
  { tool: 'Optimizely', group: 'testing', patterns: [/cdn\.optimizely\.com/] },
  { tool: 'VWO', group: 'testing', patterns: [/visualwebsiteoptimizer\.com/] },
  { tool: 'Rewardful', group: 'referral', patterns: [/r\.wdfl\.co/] },
  { tool: 'PartnerStack', group: 'referral', patterns: [/partnerstack\.com\/[^"']*\.js/] },
  { tool: 'Tolt', group: 'referral', patterns: [/cdn\.tolt\.io/] },
  { tool: 'FirstPromoter', group: 'referral', patterns: [/cdn\.firstpromoter\.com/] },
  { tool: 'Dub', group: 'referral', patterns: [/dubcdn\.com\/analytics/] },
  { tool: 'Intercom', group: 'lifecycle', patterns: [/widget\.intercom\.io/, /js\.intercomcdn\.com/] },
  { tool: 'HubSpot', group: 'lifecycle', patterns: [/js\.hs-scripts\.com/, /js\.hsforms\.net/] },
  { tool: 'Customer.io', group: 'lifecycle', patterns: [/assets\.customer\.io/] },
  { tool: 'GrowthBook', group: 'testing', patterns: [/cdn\.growthbook\.io/, /growthbook/i] },
  { tool: 'Statsig', group: 'testing', patterns: [/statsig/i] },
  { tool: 'LaunchDarkly', group: 'testing', patterns: [/launchdarkly/i] },
  { tool: 'AB Tasty', group: 'testing', patterns: [/abtasty/i] },
  { tool: 'Convert', group: 'testing', patterns: [/convertexperiments\.com/] },
  { tool: 'Kameleoon', group: 'testing', patterns: [/kameleoon/i] },
  { tool: 'Shopify', group: 'ecommerce', patterns: [/cdn\.shopify\.com/, /Shopify\.theme/] },
  { tool: 'WooCommerce', group: 'ecommerce', patterns: [/woocommerce/i] },
  { tool: 'BigCommerce', group: 'ecommerce', patterns: [/bigcommerce\.com/] },
  { tool: 'Klaviyo', group: 'ecommerce', patterns: [/klaviyo\.com/] },
  { tool: 'Attentive', group: 'ecommerce', patterns: [/cdn\.attn\.tv/, /attentivemobile/i] },
  { tool: 'Postscript', group: 'ecommerce', patterns: [/postscript\.io/] },
  { tool: 'Yotpo', group: 'ecommerce', patterns: [/yotpo/i] },
  { tool: 'Okendo', group: 'ecommerce', patterns: [/okendo/i] },
  { tool: 'Judge.me', group: 'ecommerce', patterns: [/judge\.me/] },
  { tool: 'Loox', group: 'ecommerce', patterns: [/loox\.io/] },
  { tool: 'Rebuy', group: 'ecommerce', patterns: [/rebuyengine/i] },
  { tool: 'Recharge', group: 'ecommerce', patterns: [/rechargeapps|rechargepayments|rechargecdn/i] },
  { tool: 'Gorgias', group: 'ecommerce', patterns: [/gorgias/i] },
  { tool: 'Smile.io', group: 'ecommerce', patterns: [/smile\.io/] },
  { tool: 'Triple Whale', group: 'ecommerce', patterns: [/triplewhale|triple-whale/i] },
  { tool: 'Northbeam', group: 'ecommerce', patterns: [/northbeam/i] },
  { tool: 'Shop Pay', group: 'payments', patterns: [/shop\.app/] },
  { tool: 'Klarna', group: 'payments', patterns: [/klarna/i] },
  { tool: 'Afterpay', group: 'payments', patterns: [/afterpay/i] },
  { tool: 'Affirm', group: 'payments', patterns: [/affirm\.com\/js|cdn1\.affirm\.com/] },
  { tool: 'PriceSpider', group: 'retail', patterns: [/pricespider/i] },
  { tool: 'Destini', group: 'retail', patterns: [/destini\.co/] },
  { tool: 'CallRail', group: 'call-tracking', patterns: [/cdn\.callrail\.com/] },
  { tool: 'CallTrackingMetrics', group: 'call-tracking', patterns: [/tctm\.co/] },
  { tool: 'Invoca', group: 'call-tracking', patterns: [/invocacdn/i] },
  { tool: 'WhatConverts', group: 'call-tracking', patterns: [/whatconverts/i] },
  { tool: 'ServiceTitan', group: 'local', patterns: [/servicetitan/i] },
  { tool: 'Housecall Pro', group: 'local', patterns: [/housecallpro/i] },
  { tool: 'Jobber', group: 'local', patterns: [/getjobber\.com/] },
  { tool: 'Podium', group: 'local', patterns: [/podium\.com/] },
  { tool: 'Birdeye', group: 'local', patterns: [/birdeye/i] },
  { tool: 'Zocdoc', group: 'healthcare', patterns: [/zocdoc/i] },
  { tool: 'NexHealth', group: 'healthcare', patterns: [/nexhealth/i] },
  { tool: 'Lawmatics', group: 'legal', patterns: [/lawmatics/i] },
  { tool: 'Clio', group: 'legal', patterns: [/clio\.com|goclio/i] },
  { tool: 'IDX Broker', group: 'real-estate', patterns: [/idxbroker/i] },
  { tool: 'kvCORE', group: 'real-estate', patterns: [/kvcore/i] },
  { tool: 'Follow Up Boss', group: 'real-estate', patterns: [/followupboss/i] },
  { tool: 'Dealer.com', group: 'automotive', patterns: [/dealer\.com/] },
  { tool: 'DealerInspire', group: 'automotive', patterns: [/dealerinspire/i] },
  { tool: 'OpenTable', group: 'hospitality', patterns: [/opentable/i] },
  { tool: 'Resy', group: 'hospitality', patterns: [/resy\.com/] },
  { tool: 'SevenRooms', group: 'hospitality', patterns: [/sevenrooms/i] },
  { tool: 'Toast', group: 'hospitality', patterns: [/toasttab/i] },
  { tool: 'SynXis', group: 'hospitality', patterns: [/synxis/i] },
  { tool: 'Classy', group: 'nonprofit', patterns: [/classy\.org/] },
  { tool: 'Givebutter', group: 'nonprofit', patterns: [/givebutter/i] },
  { tool: 'Donorbox', group: 'nonprofit', patterns: [/donorbox/i] },
  { tool: 'Fundraise Up', group: 'nonprofit', patterns: [/fundraiseup/i] },
  { tool: 'Piano', group: 'media', patterns: [/piano\.io|tinypass/i] },
  { tool: 'Memberful', group: 'media', patterns: [/memberful/i] },
  { tool: 'WalletConnect', group: 'crypto', patterns: [/walletconnect/i] },
  { tool: 'Mindbody', group: 'fitness', patterns: [/mindbodyonline|healcode/i] },
  { tool: 'ClassPass', group: 'fitness', patterns: [/classpass/i] },
  { tool: 'Glofox', group: 'fitness', patterns: [/glofox/i] },
  { tool: 'Mariana Tek', group: 'fitness', patterns: [/marianatek/i] },
  { tool: 'Zen Planner', group: 'fitness', patterns: [/zenplanner/i] },
  { tool: 'BackerKit', group: 'hardware', patterns: [/backerkit\.com/i] },
  { tool: 'Eventbrite', group: 'events', patterns: [/eventbrite/i] },
  { tool: 'Ticketmaster', group: 'events', patterns: [/ticketmaster/i] },
  { tool: 'AXS', group: 'events', patterns: [/\baxs\.com/i] },
  { tool: 'DICE', group: 'events', patterns: [/dice\.fm/i] },
  { tool: 'Tixr', group: 'events', patterns: [/tixr\.com/i] },
  { tool: 'Steam', group: 'games', patterns: [/store\.steampowered\.com/i] },
  { tool: 'Kickstarter', group: 'hardware', patterns: [/kickstarter\.com/i] },
  { tool: 'Indiegogo', group: 'hardware', patterns: [/indiegogo\.com/i] },
];

// Only executable scripts and resource URLs are scanned, so a tool named in page copy, JSON-LD, or a plain link
// isn't mistaken for an installed one.
export function scriptSurface(html) {
  const scripts = [...html.matchAll(/<script\b([^>]*)>[\s\S]*?<\/script>/gi)]
    .filter(m => !/\btype=["']?(?:application\/(?:ld\+)?json|text\/(?:template|html|x-template))/i.test(m[1]))
    .map(m => m[0]);
  const urls = [...html.matchAll(/<(?!a\b)[a-z][\w-]*\b[^>]*?\b(?:src|href|data-src|action)=["']([^"']+)["']/gi)].map(m => m[1]);
  return [...scripts, ...urls].join('\n');
}

export function linkSurface(html) {
  return [...html.matchAll(/<a\b[^>]*?\bhref=["']([^"']+)["']/gi)].map(m => m[1]).join('\n');
}

export function detectTools(html) {
  const surface = scriptSurface(html);
  return SIGNATURES.filter(s => s.patterns.some(p => p.test(surface))).map(s => s.tool);
}

// Tools reached only through ordinary links, such as a reservation or ticket button. A link is not an installation.
export function detectLinkedTools(html) {
  const installed = new Set(detectTools(html));
  const surface = linkSurface(html);
  return SIGNATURES.filter(s => !installed.has(s.tool) && s.patterns.some(p => p.test(surface))).map(s => s.tool);
}

// SPF includes and MX hosts name the services allowed to send or receive mail for the domain.
export const MAIL_SIGNATURES = [
  { tool: 'Google Workspace', pattern: /_spf\.google\.com|aspmx\.l\.google\.com|googlemail\.com/i },
  { tool: 'Microsoft 365', pattern: /spf\.protection\.outlook\.com|mail\.protection\.outlook\.com/i },
  { tool: 'SendGrid', pattern: /sendgrid\.net/i },
  { tool: 'Mailgun', pattern: /mailgun\.org/i },
  { tool: 'Amazon SES', pattern: /amazonses\.com/i },
  { tool: 'Postmark', pattern: /spf\.mtasv\.net/i },
  { tool: 'Mailchimp', pattern: /servers\.mcsv\.net|mandrillapp\.com/i },
  { tool: 'HubSpot', pattern: /hubspotemail\.net/i },
  { tool: 'Salesforce', pattern: /_spf\.salesforce\.com/i },
  { tool: 'Marketo', pattern: /mktomail\.com/i },
  { tool: 'Pardot', pattern: /pardot\.com/i },
  { tool: 'Customer.io', pattern: /customer\.io/i },
  { tool: 'Intercom', pattern: /intercom\.io/i },
  { tool: 'Zendesk', pattern: /zendesk\.com/i },
  { tool: 'Help Scout', pattern: /helpscoutemail\.com/i },
  { tool: 'Freshdesk', pattern: /freshdesk\.com|freshemail\.io/i },
  { tool: 'Brevo', pattern: /sendinblue\.com|brevo\.com/i },
  { tool: 'Klaviyo', pattern: /klaviyo/i },
];

// Domain-verification TXT records left by tools the company has connected.
export const VERIFICATION_SIGNATURES = [
  { tool: 'Google (Search Console or Workspace)', pattern: /^google-site-verification=/i },
  { tool: 'Meta Business (ads, commerce)', pattern: /^facebook-domain-verification=/i },
  { tool: 'Microsoft 365', pattern: /^MS=/ },
  { tool: 'Atlassian', pattern: /^atlassian-domain-verification=/i },
  { tool: 'Stripe', pattern: /^stripe-verification=/i },
  { tool: 'Apple', pattern: /^apple-domain-verification=/i },
  { tool: 'DocuSign', pattern: /^docusign=/i },
  { tool: 'Zoom', pattern: /^ZOOM_verify_/i },
  { tool: 'Adobe', pattern: /^adobe-(idp-site|sign)-verification=/i },
  { tool: 'OpenAI', pattern: /^openai-domain-verification=/i },
  { tool: 'HubSpot', pattern: /^hubspot-developer-verification=/i },
  { tool: 'Miro', pattern: /^miro-verification=/i },
  { tool: 'Anthropic', pattern: /^anthropic-domain-verification/i },
  { tool: 'TikTok (developer or ads)', pattern: /^tiktok-(developers-site-)?verification/i },
  { tool: 'Slack', pattern: /^slack-domain-verification/i },
  { tool: 'Notion', pattern: /^notion-domain-verification/i },
  { tool: 'Cursor', pattern: /^cursor-domain-verification/i },
  { tool: 'Postman', pattern: /^postman-domain-verification/i },
  { tool: 'HackerOne', pattern: /^h1-domain-verification/i },
  { tool: 'Pinterest', pattern: /^pinterest-site-verification/i },
  { tool: 'LinkedIn', pattern: /^linkedin-domain-verification/i },
];

// CNAME targets on common marketing subdomains reveal the platform behind them.
export const CNAME_SIGNATURES = [
  { tool: 'HubSpot', pattern: /hubspot|hs-sites/i },
  { tool: 'Marketo', pattern: /mktoweb|mktossl|marketo/i },
  { tool: 'Pardot', pattern: /pardot/i },
  { tool: 'Zendesk', pattern: /zendesk/i },
  { tool: 'Intercom', pattern: /intercom/i },
  { tool: 'Help Scout', pattern: /helpscout/i },
  { tool: 'incident.io', pattern: /incident\.io/i },
  { tool: 'Statuspage', pattern: /statuspage\.io/i },
  { tool: 'GitBook', pattern: /gitbook/i },
  { tool: 'Mintlify', pattern: /mintlify/i },
  { tool: 'ReadMe', pattern: /readme\.io|readmessl/i },
  { tool: 'Discourse', pattern: /discourse/i },
  { tool: 'Circle', pattern: /circle\.so/i },
  { tool: 'Webflow', pattern: /webflow/i },
  { tool: 'Framer', pattern: /framer/i },
  { tool: 'Ghost', pattern: /ghost\.io/i },
  { tool: 'Substack', pattern: /substack/i },
  { tool: 'beehiiv', pattern: /beehiiv/i },
  { tool: 'Unbounce', pattern: /unbounce/i },
  { tool: 'Instapage', pattern: /pageserve|instapage/i },
  { tool: 'Leadpages', pattern: /leadpages/i },
  { tool: 'Dub', pattern: /dub\.co/i },
  { tool: 'Vercel', pattern: /vercel/i },
  { tool: 'Netlify', pattern: /netlify/i },
  { tool: 'Shopify', pattern: /myshopify|shops\.myshopify/i },
  { tool: 'Teachable', pattern: /teachable/i },
  { tool: 'Thinkific', pattern: /thinkific/i },
  { tool: 'Kajabi', pattern: /kajabi/i },
  { tool: 'Podia', pattern: /podia/i },
  { tool: 'LearnWorlds', pattern: /learnworlds/i },
  { tool: 'Eventbrite', pattern: /eventbrite/i },
];

export const MARKETING_SUBDOMAINS = [
  'www', 'blog', 'go', 'info', 'learn', 'get', 'try', 'lp', 'pages', 'email', 'news', 'newsletter',
  'help', 'support', 'docs', 'developers', 'community', 'forum', 'status', 'academy', 'partners',
  'affiliates', 'events', 'app', 'link', 'links', 'shop', 'store', 'careers', 'jobs',
  'courses', 'apply', 'admissions', 'franchise', 'ownafranchise', 'donate', 'give', 'tickets', 'book', 'order',
];

export function detectDns({ txt = [], mx = [], cnames = {} }) {
  const spf = txt.filter(r => /^v=spf1/i.test(r)).join(' ');
  const mail = MAIL_SIGNATURES.filter(s => s.pattern.test(spf) || mx.some(m => s.pattern.test(m))).map(s => s.tool);
  const verifications = [];
  const otherVerifications = [];
  for (const r of txt) {
    const known = VERIFICATION_SIGNATURES.find(s => s.pattern.test(r));
    if (known) verifications.push(known.tool);
    else if (/verification|verify/i.test(r)) otherVerifications.push(r.split('=')[0]);
  }
  const subdomains = Object.entries(cnames).map(([sub, target]) => ({
    subdomain: sub,
    cname: target,
    tool: CNAME_SIGNATURES.find(s => s.pattern.test(target))?.tool || null,
  }));
  return {
    mail: [...new Set(mail)],
    verifications: [...new Set(verifications)],
    other_verifications: [...new Set(otherVerifications)],
    subdomains,
  };
}

// crt.sh rows: name_value holds one or more names separated by newlines.
export function parseCertificates(rows, domain) {
  const firstSeen = {};
  for (const row of rows) {
    const date = String(row.not_before || row.entry_timestamp || '').slice(0, 10);
    for (const raw of String(row.name_value || '').split('\n')) {
      // A wildcard certificate doesn't show that any one host under it exists.
      if (raw.trim().startsWith('*')) continue;
      const name = raw.trim().toLowerCase();
      if (!name.endsWith(`.${domain}`) || name === domain) continue;
      if (!firstSeen[name] || date < firstSeen[name]) firstSeen[name] = date;
    }
  }
  return Object.entries(firstSeen)
    .map(([subdomain, first_seen]) => ({ subdomain, first_seen }))
    .sort((a, b) => a.first_seen.localeCompare(b.first_seen));
}

// Whole labels or label prefixes followed by a digit or hyphen, so dev-2 is noise but developers is not.
const NOISE_LABEL = /^(pr-?\d+|preview|staging|stage|stg|dev|test|qa|uat|sandbox|internal|canary|deploy-preview)(?:$|[-\d])/i;

// Drops preview, staging, and other machine-generated names, and groups the rest by the label under the domain.
export function filterSubdomains(subs, domain) {
  const kept = [];
  const groups = {};
  let dropped = 0;
  for (const s of subs) {
    const labels = s.subdomain.slice(0, -(domain.length + 1)).split('.');
    if (labels.some(l => NOISE_LABEL.test(l)) || labels.length >= 3) { dropped++; continue; }
    const top = labels[labels.length - 1];
    groups[top] ??= { label: top, names: 0, first_seen: s.first_seen };
    groups[top].names++;
    if (labels.length === 1) kept.push(s);
  }
  const multi = Object.values(groups).filter(g => g.names > 1).sort((a, b) => b.names - a.names);
  return { subdomains: kept, groups: multi, dropped };
}

const decodeEntities = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const stripTags = s => decodeEntities(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

export function extractHero(html) {
  const title = stripTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
  const description = decodeEntities(
    html.match(/<meta[^>]+name=["']description["'][^>]*content=(["'])([\s\S]*?)\1/i)?.[2] ||
    html.match(/<meta[^>]+content=(["'])([\s\S]*?)\1[^>]*name=["']description["']/i)?.[2] || ''
  ).trim();
  const h1 = stripTags(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
  return { title, description, h1 };
}

export function countLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&'));
}

const LOCALE = /^[a-z]{2}(-[a-z]{2,4})?$/i;

export function localeOf(url) {
  try {
    const seg = new URL(url).pathname.split('/').filter(Boolean)[0];
    return seg && LOCALE.test(seg) ? seg.toLowerCase() : null;
  } catch {
    return null;
  }
}

// Locale prefixes (/de/, /pt-br/) are skipped so translated copies group with their family.
export function pathFamily(url) {
  try {
    const segs = new URL(url).pathname.split('/').filter(Boolean);
    if (segs.length && LOCALE.test(segs[0])) segs.shift();
    return segs.length ? `/${segs[0].toLowerCase()}` : '/';
  } catch {
    return '(invalid)';
  }
}

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(v => v !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  if (quoted) throw new Error(`CSV has an unclosed quote in row ${rows.length + 1}`);
  row.push(field);
  if (row.some(v => v !== '')) rows.push(row);
  if (!rows.length) return [];
  const [header, ...body] = rows;
  return body.map(r => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}

export function toCsv(rows) {
  if (!rows.length) return '';
  const cols = Object.keys(rows[0]);
  const esc = v => {
    let s = v == null ? '' : String(v);
    // Scraped text that starts like a formula is prefixed so spreadsheets show it as text.
    if (/^[=+\-@\t\r]/.test(s) && !/^[-+]?\d[\d.,]*$/.test(s)) s = `'${s}`;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\n') + '\n';
}

const monthKey = d => d.slice(0, 7);
const mean = xs => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const round1 = x => (x == null ? null : Math.round(x * 10) / 10 + 0);

// Blank cells are missing data, not zero.
const cell = v => (v == null || String(v).trim() === '' ? NaN : Number(v));

// One row per calendar month from first to last, so a missing month is a gap rather than two months glued together.
export function fillMonths(traffic) {
  const byMonth = new Map();
  for (const t of traffic) {
    const m = monthKey(t.month);
    if (byMonth.has(m)) throw new Error(`traffic.csv has month ${m} more than once`);
    byMonth.set(m, t);
  }
  const keys = [...byMonth.keys()].sort();
  if (!keys.length) return [];
  const out = [];
  let [y, mo] = keys[0].split('-').map(Number);
  const last = keys[keys.length - 1];
  for (;;) {
    const key = `${y}-${String(mo).padStart(2, '0')}`;
    out.push(byMonth.get(key) || { month: key, visits: '', brand_searches: '' });
    if (key >= last) break;
    if (++mo > 12) { mo = 1; y++; }
  }
  return out;
}

function growthSeries(traffic, col) {
  return traffic.map((t, i) => {
    const prev = i > 0 ? cell(traffic[i - 1][col]) : NaN;
    const cur = cell(t[col]);
    return i > 0 && prev > 0 && Number.isFinite(cur) ? ((cur - prev) / prev) * 100 : null;
  });
}

// Needs all three months on both sides; a partial window returns null instead of a misleading number.
function windowLift(growth, i) {
  if (i < 3 || i + 3 > growth.length) return null;
  const before = growth.slice(i - 3, i);
  const after = growth.slice(i, i + 3);
  if (before.includes(null) || after.includes(null)) return null;
  return round1(mean(after) - mean(before));
}

function ranks(xs) {
  const order = xs.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);
  const r = new Array(xs.length);
  for (let i = 0; i < order.length;) {
    let j = i;
    while (j + 1 < order.length && order[j + 1][0] === order[i][0]) j++;
    for (let k = i; k <= j; k++) r[order[k][1]] = (i + j) / 2 + 1;
    i = j + 1;
  }
  return r;
}

export function spearman(xs, ys) {
  const pairs = xs.map((x, i) => [x, ys[i]]).filter(([x, y]) => x != null && y != null);
  if (pairs.length < 3) return null;
  const rx = ranks(pairs.map(p => p[0]));
  const ry = ranks(pairs.map(p => p[1]));
  const mx = mean(rx), my = mean(ry);
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < rx.length; i++) {
    num += (rx[i] - mx) * (ry[i] - my);
    dx += (rx[i] - mx) ** 2;
    dy += (ry[i] - my) ** 2;
  }
  return dx && dy ? Math.round((num / Math.sqrt(dx * dy)) * 100) / 100 : null;
}

// Moves within CLUSTER_DAYS of the previous move join its cluster.
export const CLUSTER_DAYS = 42;
export const MIN_MONTHS = 18;
export const MIN_MOVES = 6;

export function analyzeMoves(moves, traffic) {
  traffic = fillMonths(traffic);
  const months = traffic.map(t => monthKey(t.month));
  const growth = growthSeries(traffic, 'visits');
  const brandGrowth = traffic.some(t => Number.isFinite(cell(t.brand_searches))) ? growthSeries(traffic, 'brand_searches') : null;

  const sorted = [...moves].sort((a, b) => a.date.localeCompare(b.date));
  const clusters = [];
  let last = null;
  for (const m of sorted) {
    const t = Date.parse(m.date);
    if (last == null || (t - last) / 86400000 >= CLUSTER_DAYS) clusters.push({ start: m.date, moves: [] });
    clusters[clusters.length - 1].moves.push(m);
    last = t;
  }

  const clusterRows = clusters.map((c, n) => {
    const i = months.indexOf(monthKey(c.start));
    return {
      cluster: n + 1,
      start: c.start,
      channels: [...new Set(c.moves.map(m => m.channel))].sort().join(' '),
      moves: c.moves.map(m => m.move).join(' | '),
      visit_lift_pts: i < 0 ? null : windowLift(growth, i),
      brand_lift_pts: i < 0 || !brandGrowth ? null : windowLift(brandGrowth, i),
    };
  });

  const channels = [...new Set(moves.map(m => m.channel))].sort();
  const leading = channels.map(channel => {
    const counts = months.map(mo => moves.filter(m => m.channel === channel && monthKey(m.date) === mo).length);
    const total = counts.reduce((a, b) => a + b, 0);
    if (months.length < MIN_MONTHS || total < MIN_MOVES) {
      return { channel, moves: total, months: months.length, note: 'too few to call' };
    }
    const row = { channel, moves: total, months: months.length };
    for (const k of [0, 1, 2]) row[`rho_lag${k}`] = spearman(counts.slice(0, counts.length - k), growth.slice(k));
    return row;
  });

  const top = clusterRows
    .filter(c => c.visit_lift_pts != null)
    .sort((a, b) => b.visit_lift_pts - a.visit_lift_pts)
    .slice(0, 3);
  return { clusters: clusterRows, top, leading };
}

// The date is part of the key, so a second price change at the same /pricing URL is a new move.
export function moveKey(m) {
  return [m.date, m.channel, m.kind, (m.link || m.move || '').toLowerCase().replace(/\/+$/, '')].join('|');
}

export function diffMoves(oldMoves, newMoves) {
  const seen = new Set(oldMoves.map(moveKey));
  return newMoves.filter(m => !seen.has(moveKey(m)));
}

export function adLibraryLinks(name, domain) {
  const q = encodeURIComponent(name);
  return {
    meta: `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&q=${q}&search_type=keyword_unordered`,
    google: `https://adstransparency.google.com/?domain=${encodeURIComponent(domain || name)}`,
    linkedin: `https://www.linkedin.com/ad-library/search?companyName=${q}`,
    tiktok: `https://library.tiktok.com/ads?adv_name=${q}`,
  };
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

export function posInt(value, fallback, name) {
  if (value == null) return fallback;
  const n = typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isInteger(n) || n < 1) throw new Error(`--${name} needs a whole number of 1 or more`);
  return n;
}

async function get(url, { binary = false } = {}) {
  const res = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return binary ? Buffer.from(await res.arrayBuffer()) : res.text();
}

async function sitemapUrls(domain, limit) {
  const base = `https://${domain}`;
  let roots = [];
  try {
    const robots = await get(`${base}/robots.txt`);
    roots = [...robots.matchAll(/^sitemap:\s*(\S+)/gim)].map(m => m[1]);
  } catch {}
  if (!roots.length) roots = [`${base}/sitemap.xml`];
  const queue = [...roots];
  const urls = new Set();
  const visited = new Set();
  while (queue.length && visited.size < 50 && urls.size < limit) {
    const sm = queue.shift();
    if (visited.has(sm)) continue;
    visited.add(sm);
    let xml;
    try {
      const buf = await get(sm, { binary: true });
      xml = (sm.endsWith('.gz') ? gunzipSync(buf) : buf).toString('utf8');
    } catch {
      continue;
    }
    const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&'));
    if (/<sitemapindex/i.test(xml)) queue.push(...locs);
    else for (const l of locs) urls.add(l);
  }
  return [...urls].slice(0, limit);
}

async function waybackMonthly(url, months) {
  const from = new Date();
  from.setMonth(from.getMonth() - months);
  const cdx = `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url)}&output=json&from=${from.toISOString().slice(0, 7).replace('-', '')}&filter=statuscode:200&collapse=timestamp:6&fl=timestamp,original`;
  const rows = JSON.parse((await get(cdx)) || '[]');
  return rows.slice(1).map(([timestamp, original]) => ({ timestamp, original }));
}

async function cmdSite(domain, opts) {
  const urls = await sitemapUrls(domain, posInt(opts.limit, 20000, 'limit'));
  const families = {};
  for (const u of urls) families[pathFamily(u)] = (families[pathFamily(u)] || 0) + 1;
  const locales = [...new Set(urls.map(localeOf).filter(Boolean))].sort();
  const rows = Object.entries(families).sort((a, b) => b[1] - a[1]).map(([family, pages]) => ({ family, pages }));
  if (opts.out) writeFileSync(opts.out, toCsv(urls.map(url => ({ url, family: pathFamily(url), locale: localeOf(url) || '' }))));
  return { domain, pulled: new Date().toISOString().slice(0, 10), urls: urls.length, locales, families: rows };
}

async function cmdStack(domain, opts) {
  const months = posInt(opts.months, 24, 'months');
  const snaps = await waybackMonthly(`${domain}/`, months);
  const firstSeen = {};
  const lastSeen = {};
  const failed = [];
  for (const s of snaps) {
    try {
      const html = await get(`https://web.archive.org/web/${s.timestamp}id_/${s.original}`);
      const month = `${s.timestamp.slice(0, 4)}-${s.timestamp.slice(4, 6)}`;
      for (const tool of detectTools(html)) {
        firstSeen[tool] ??= month;
        lastSeen[tool] = month;
      }
    } catch {
      failed.push(s.timestamp);
    }
    await sleep(WAYBACK_DELAY_MS);
  }
  const firstMonth = snaps.length ? `${snaps[0].timestamp.slice(0, 4)}-${snaps[0].timestamp.slice(4, 6)}` : null;
  let live = [];
  try { live = detectTools(await get(`https://${domain}/`)); } catch {}
  const tools = SIGNATURES.map(s => s.tool)
    .filter(t => firstSeen[t] || live.includes(t))
    .map(tool => ({
      tool,
      group: SIGNATURES.find(s => s.tool === tool).group,
      first_seen: firstSeen[tool] || null,
      present_at_start: Boolean(firstSeen[tool]) && firstSeen[tool] === firstMonth,
      last_seen_archive: lastSeen[tool] || null,
      live_now: live.includes(tool),
    }));
  return {
    domain,
    pulled: new Date().toISOString().slice(0, 10),
    snapshots: snaps.length,
    failed_snapshots: failed,
    note: 'first_seen is the first monthly archive capture containing the script; the tool may predate it. present_at_start means it was already there at the start of the window. Scripts loaded only through a tag manager, or after consent, will not show, so live_now false is not proof of absence.',
    tools,
  };
}

async function cmdHistory(url, opts) {
  const months = posInt(opts.months, 24, 'months');
  const snaps = await waybackMonthly(url, months);
  const changes = [];
  const noPrices = [];
  let prev = null;
  for (const s of snaps) {
    try {
      const html = await get(`https://web.archive.org/web/${s.timestamp}id_/${s.original}`);
      const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const prices = [...new Set(text.match(/[$€£]\s?\d[\d,.]*(?:\s?\/\s?(?:mo|month|yr|year|user|seat))?/gi) || [])];
      const month = `${s.timestamp.slice(0, 4)}-${s.timestamp.slice(4, 6)}`;
      const sig = prices.join(' ');
      if (!prices.length) noPrices.push(month);
      else if (sig !== prev) {
        changes.push({ month, capture: `https://web.archive.org/web/${s.timestamp}/${s.original}`, prices: prices.slice(0, 20) });
        prev = sig;
      }
    } catch {}
    await sleep(WAYBACK_DELAY_MS);
  }
  return { url, pulled: new Date().toISOString().slice(0, 10), snapshots: snaps.length, note: 'Rows are months where the set of prices on the page changed. Open each capture to read what changed. Months in no_prices had no readable prices, often because the page renders prices with JavaScript.', changes, no_prices: noPrices };
}

async function cmdHero(url, opts) {
  const months = posInt(opts.months, 24, 'months');
  const snaps = await waybackMonthly(url, months);
  const changes = [];
  let prev = null;
  for (const s of snaps) {
    try {
      const hero = extractHero(await get(`https://web.archive.org/web/${s.timestamp}id_/${s.original}`));
      const sig = `${hero.h1}|${hero.title}|${hero.description}`;
      if (hero.h1 || hero.title) {
        if (sig !== prev) {
          changes.push({ month: `${s.timestamp.slice(0, 4)}-${s.timestamp.slice(4, 6)}`, capture: `https://web.archive.org/web/${s.timestamp}/${s.original}`, ...hero });
          prev = sig;
        }
      }
    } catch {}
    await sleep(WAYBACK_DELAY_MS);
  }
  return { url, pulled: new Date().toISOString().slice(0, 10), snapshots: snaps.length, note: 'Rows are months where the headline, title, or meta description changed. Open the capture to read the full hero and the logo wall.', changes };
}

async function cmdDns(domain, { resolver } = {}) {
  const dns = resolver || (await import('node:dns')).promises;
  const safe = async fn => { try { return await fn(); } catch { return []; } };
  const txt = (await safe(() => dns.resolveTxt(domain))).map(parts => parts.join(''));
  const dmarc = (await safe(() => dns.resolveTxt(`_dmarc.${domain}`))).map(parts => parts.join(''));
  const mx = (await safe(() => dns.resolveMx(domain))).map(r => r.exchange);
  const cnames = {};
  await Promise.all(MARKETING_SUBDOMAINS.map(async sub => {
    const target = (await safe(() => dns.resolveCname(`${sub}.${domain}`)))[0];
    if (target) cnames[`${sub}.${domain}`] = target;
  }));
  return {
    domain,
    pulled: new Date().toISOString().slice(0, 10),
    ...detectDns({ txt, mx, cnames }),
    dmarc: dmarc[0] || null,
    note: 'Mail tools come from SPF and MX records, verifications from TXT records, platforms from CNAMEs on common marketing subdomains. A record shows a tool was connected, not how it is used.',
  };
}

async function cmdSubdomains(domain, opts = {}) {
  const res = await fetch(`https://crt.sh/?q=${encodeURIComponent(`%.${domain}`)}&output=json`, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(90000) });
  if (!res.ok) throw new Error(`crt.sh returned ${res.status}; it is often slow, so retry later`);
  const all = parseCertificates(await res.json(), domain);
  if (opts.all) return { domain, pulled: new Date().toISOString().slice(0, 10), count: all.length, subdomains: all };
  const { subdomains, groups, dropped } = filterSubdomains(all, domain);
  return {
    domain,
    pulled: new Date().toISOString().slice(0, 10),
    count: subdomains.length,
    filtered_out: dropped,
    note: 'first_seen is the earliest certificate issued for the name, usually days before launch. Preview, staging, and deeply nested names are filtered out (use --all to keep them). groups lists labels with many names under them, such as per-customer or programmatic subdomains.',
    groups,
    subdomains,
  };
}

async function cmdSitemapGrowth(domain, opts) {
  const months = posInt(opts.months, 24, 'months');
  const sitemapUrl = opts.sitemap || `${domain}/sitemap.xml`;
  const snaps = await waybackMonthly(sitemapUrl.replace(/^https?:\/\//, ''), months);
  const rows = [];
  for (const s of snaps) {
    const month = `${s.timestamp.slice(0, 4)}-${s.timestamp.slice(4, 6)}`;
    try {
      const xml = await get(`https://web.archive.org/web/${s.timestamp}id_/${s.original}`);
      let urls = countLocs(xml);
      let children = 0;
      let failed = 0;
      if (/<sitemapindex/i.test(xml)) {
        const childUrls = urls.slice(0, 25);
        children = childUrls.length;
        urls = [];
        for (const child of childUrls) {
          try { urls.push(...countLocs(await get(`https://web.archive.org/web/${s.timestamp}id_/${child}`))); } catch { failed++; }
          await sleep(WAYBACK_DELAY_MS);
        }
      }
      if (children && failed === children) {
        rows.push({ month, urls: null, child_sitemaps: children, error: 'no child sitemap readable' });
      } else {
        const families = {};
        for (const u of urls) families[pathFamily(u)] = (families[pathFamily(u)] || 0) + 1;
        // A partial count is a floor, not a drop in pages.
        rows.push({ month, urls: urls.length, child_sitemaps: children, ...(failed ? { failed_children: failed, incomplete: true } : {}), families });
      }
    } catch {
      rows.push({ month, urls: null, error: 'capture unreadable' });
    }
    await sleep(WAYBACK_DELAY_MS);
  }
  const firstSeen = {};
  for (const r of rows) for (const f of Object.keys(r.families || {})) firstSeen[f] ??= r.month;
  return {
    domain,
    pulled: new Date().toISOString().slice(0, 10),
    note: 'URL counts per monthly capture of the sitemap. family_first_seen dates when each page family first appeared in an archived sitemap; families seen in the first month were already there. Large sitemap indexes are capped at 25 child sitemaps per month.',
    family_first_seen: firstSeen,
    months: rows.map(({ families, ...r }) => r),
  };
}

const SC_BASE = 'https://api.scrapecreators.com';

export function scAdsRequests(name, { domain, pageId, country } = {}) {
  const q = new URLSearchParams();
  const reqs = {};
  if (pageId) {
    q.set('pageId', pageId);
    q.set('status', 'ACTIVE');
    q.set('trim', 'true');
    if (country) q.set('country', country);
    reqs.meta_ads = `${SC_BASE}/v1/facebook/adLibrary/company/ads?${q}`;
  } else {
    reqs.meta_companies = `${SC_BASE}/v1/facebook/adLibrary/search/companies?${new URLSearchParams({ query: name })}`;
  }
  if (domain) reqs.google_ads = `${SC_BASE}/v1/google/company/ads?${new URLSearchParams({ domain })}`;
  reqs.tiktok_ads = `${SC_BASE}/v1/tiktok/ad-library/search?${new URLSearchParams({ advertiser_name: name })}`;
  return reqs;
}

export async function cmdScAds(name, opts, fetchImpl = fetch) {
  const reqs = scAdsRequests(name, { domain: opts.domain, pageId: opts['page-id'], country: opts.country });
  if (opts['dry-run']) return { dry_run: true, requests: reqs };
  const key = process.env.SCRAPECREATORS_API_KEY;
  if (!key) throw new Error('Set SCRAPECREATORS_API_KEY, or use the ads command for free library links');
  const out = { name, pulled: new Date().toISOString().slice(0, 10) };
  for (const [label, url] of Object.entries(reqs)) {
    try {
      const res = await fetchImpl(url, { headers: { 'x-api-key': key } });
      out[label] = res.ok ? await res.json() : { error: `${res.status}` };
    } catch (err) {
      out[label] = { error: err.message };
    }
  }
  if (out.meta_companies) out.next_step = 'Pick the matching Meta page from meta_companies and rerun with --page-id <id> for its active ads.';
  return out;
}

export function schemaTypes(html) {
  const types = new Set();
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    for (const t of m[1].matchAll(/"@type"\s*:\s*(\[[^\]]*\]|"[^"]+")/g)) {
      for (const v of t[1].matchAll(/"([^"]+)"/g)) types.add(v[1]);
    }
  }
  return [...types];
}

// Each rule adds weight to an industry pack when its pattern appears in the page, its scripts, or its schema types.
export const INDUSTRY_RULES = [
  { pack: 'ecommerce-dtc', tools: ['Shopify', 'WooCommerce', 'BigCommerce', 'Klaviyo', 'Recharge', 'Yotpo', 'Okendo', 'Rebuy'], text: [/add to cart/i, /\/products\//, /free shipping/i], schema: [], weakSchema: ['Product', 'Offer'] },
  { pack: 'saas', tools: ['Segment', 'Intercom', 'PostHog', 'Mixpanel', 'Amplitude'], text: [/start (your )?free trial/i, /book a demo/i, /sign up free/i, /per (user|seat)/i], weakText: [/integrations/i], schema: ['SoftwareApplication', 'WebApplication'] },
  { pack: 'cpg-food-beverage', tools: ['PriceSpider', 'Destini'], text: [/where to buy/i, /find (us )?in stores/i, /nutrition facts/i, /ingredients/i], schema: [] },
  { pack: 'retail', tools: [], text: [/store locator/i, /find a store/i, /store hours/i, /pick ?up in store/i], schema: ['Store', 'ClothingStore', 'DepartmentStore'] },
  { pack: 'local-services', tools: ['CallRail', 'CallTrackingMetrics', 'ServiceTitan', 'Housecall Pro', 'Jobber', 'Podium', 'Birdeye'], text: [/free estimate/i, /service area/i, /licensed (and|&) insured/i, /24\/7 emergency/i, /financing available/i], schema: ['HomeAndConstructionBusiness', 'Plumber', 'HVACBusiness', 'RoofingContractor', 'Electrician', 'LocalBusiness'] },
  { pack: 'healthcare', tools: ['Zocdoc', 'NexHealth'], text: [/book an appointment/i, /insurance (we )?accept/i, /new patients/i, /telehealth/i], schema: ['MedicalClinic', 'Dentist', 'Physician', 'MedicalBusiness', 'MedicalOrganization'] },
  { pack: 'legal-professional-services', tools: ['Lawmatics', 'Clio'], text: [/free consultation/i, /attorney advertising/i, /practice areas/i, /\bCPA\b/], schema: ['LegalService', 'Attorney', 'AccountingService'] },
  { pack: 'real-estate', tools: ['IDX Broker', 'kvCORE', 'Follow Up Boss'], text: [/\bMLS\b/, /homes for sale/i, /what'?s my home worth/i, /listings/i], schema: ['RealEstateAgent', 'RealEstateListing'] },
  { pack: 'finance', tools: [], text: [/member FDIC/i, /\bNMLS\b/, /\bAPY\b/, /\bSIPC\b/, /credit score/i], schema: ['FinancialService', 'BankOrCreditUnion', 'InsuranceAgency'] },
  { pack: 'crypto-web3', tools: ['WalletConnect'], text: [/connect wallet/i, /tokenomics/i, /governance token/i, /on-?chain/i, /\bstaking\b/i], schema: [] },
  { pack: 'manufacturing-industrial', tools: [], text: [/request a quote/i, /\bRFQ\b/, /spec sheet/i, /\bCAD\b/, /ISO 9001/i, /find a distributor/i], schema: [] },
  { pack: 'automotive', tools: ['Dealer.com', 'DealerInspire'], text: [/new inventory/i, /used inventory/i, /\bVIN\b/, /schedule service/i, /trade-?in/i], schema: ['AutoDealer', 'AutoRepair', 'Car'] },
  { pack: 'agencies-b2b-services', tools: [], text: [/our work/i, /solutions partner/i, /get a proposal/i], weakText: [/case studies/i, /\bclients\b/i], schema: ['ProfessionalService'] },
  { pack: 'nonprofit', tools: ['Classy', 'Givebutter', 'Donorbox', 'Fundraise Up'], text: [/donate/i, /501\(c\)\(3\)/i, /tax-deductible/i], schema: ['NGO', 'NonprofitOrganization'] },
  { pack: 'marketplaces', tools: [], text: [/become a (seller|host|tasker|provider|driver)/i, /list your/i, /for (providers|sellers|hosts)/i], schema: [] },
  { pack: 'mobile-apps-games', tools: [], text: [], weakText: [/apps\.apple\.com/, /play\.google\.com\/store/, /download (on|the) (the )?app/i], schema: ['MobileApplication'] },
  { pack: 'education', tools: [], text: [/\benroll\b/i, /admissions/i, /\bcohort\b/i, /bootcamp/i, /tuition/i], schema: ['EducationalOrganization', 'CollegeOrUniversity', 'Course'] },
  { pack: 'hospitality-travel', tools: ['OpenTable', 'Resy', 'SevenRooms', 'Toast', 'SynXis'], text: [/book (a table|your stay)/i, /make a reservation/i, /check-?in date/i, /order online/i, /view (our )?menu/i], schema: ['Hotel', 'LodgingBusiness', 'Restaurant', 'TouristTrip'] },
  { pack: 'insurance', tools: [], text: [/underwritten by/i, /policyholders?/i, /file a claim/i, /find an agent/i, /compare (quotes|rates)/i, /Medicare Advantage/i], weakText: [/get a (free )?quote/i, /\bpremiums?\b/i], schema: ['InsuranceAgency'] },
  { pack: 'fitness-wellness', tools: ['Mindbody', 'ClassPass', 'Glofox', 'Mariana Tek', 'Zen Planner'], text: [/unlimited (classes|membership)/i, /first class free/i, /free (first )?class/i, /class schedule/i, /personal training/i, /intro offer/i, /find a studio/i, /book a class/i], weakText: [/\bworkouts?\b/i], schema: ['ExerciseGym', 'HealthClub', 'SportsActivityLocation'] },
  { pack: 'consumer-hardware', tools: ['Kickstarter', 'Indiegogo', 'BackerKit'], text: [/tech specs/i, /what'?s in the box/i, /backed on kickstarter/i, /warranty registration/i], weakText: [/pre-?order/i, /ships in/i], schema: [] },
  { pack: 'solar-home-energy', tools: [], text: [/solar (panels?|energy|installation|installer)/i, /\$0 down/i, /net metering/i, /battery (storage|backup)/i, /heat pumps?/i, /\bPPA\b/], weakText: [/tax credit/i, /\bkWh\b/], schema: [], weakSchema: ['HomeAndConstructionBusiness'] },
  { pack: 'care-services', tools: [], text: [/assisted living/i, /memory care/i, /home care/i, /in-home (care|assessment)/i, /senior living/i, /child ?care|daycare|preschool/i, /medicare-certified/i], weakText: [/schedule a tour/i], schema: ['ChildCare'], weakSchema: ['MedicalBusiness'] },
  { pack: 'franchising', tools: [], text: [/own a franchise/i, /franchise opportunit/i, /franchise fee/i, /\bFDD\b/, /territories available/i, /discovery day/i, /initial investment/i], weakText: [/independently owned and operated/i], schema: [] },
  { pack: 'logistics-transportation', tools: [], text: [/\bLTL\b/, /\bFTL\b/, /\b3PL\b/, /\bUSDOT\b/i, /\bMC[ #-]?\d{5,}/, /haul with us|drive for us|become a carrier/i, /track (a|your) shipment/i, /fulfillment center/i], weakText: [/freight/i, /\bCDL\b/], schema: [], weakSchema: ['MovingCompany'] },
  { pack: 'govtech-public-sector', tools: [], text: [/\bFedRAMP\b/, /\b(StateRAMP|GovRAMP|CJIS)\b/, /cooperative (purchasing|contract)/i, /\bGSA (schedule|MAS)\b/i, /Sourcewell|OMNIA Partners|NASPO|BuyBoard/i, /state and local government/i], weakText: [/public sector/i, /for government/i, /\bVPAT\b|Section 508/i, /school districts/i], schema: [], weakSchema: ['GovernmentOrganization'] },
  { pack: 'regulated-goods', tools: [], text: [/are you (21|18)( years of age)? or older/i, /contains nicotine/i, /\bdispensar(y|ies)\b/i, /dutchie|iheartjane|weedmaps|leafly/i, /\bFFL\b/, /ShipCompliant|Vinoshipper|Commerce7|WineDirect/i, /AgeChecker/i], weakText: [/must be 21/i, /age verification/i, /\bTHC\b/, /\bCBD\b/], schema: ['LiquorStore', 'Winery', 'Brewery', 'Distillery'] },
  { pack: 'gambling-betting', tools: [], text: [/sportsbook/i, /deposit match/i, /1-800-GAMBLER/i, /gambling problem/i, /no purchase necessary/i, /odds boost/i], weakText: [/promo code/i, /\bsweepstakes\b/i, /\b21\+/], schema: [] },
  { pack: 'games-pc-console', tools: ['Steam'], text: [/wishlist (it )?(on steam|now)/i, /store\.steampowered\.com\/app/, /\bplaytest\b/i], weakText: [/playstation|xbox|nintendo switch|eshop/i, /press kit/i, /discord\.gg/], schema: ['VideoGame', 'VideoGameSeries'] },
  { pack: 'events-entertainment', tools: ['Eventbrite', 'Ticketmaster', 'AXS', 'DICE', 'Tixr'], text: [/(buy|get) tickets/i, /buy passes/i, /\blineup\b/i, /presale/i, /on sale (now|date)/i, /early bird/i], weakText: [/\bspeakers\b/i], schema: ['MusicEvent', 'Festival', 'SportsEvent', 'TheaterEvent'], weakSchema: ['Event'] },
  { pack: 'media-creators', tools: ['Piano', 'Memberful'], text: [/become a (member|subscriber)/i, /\bepisodes?\b/i], weakText: [/subscribe to (our|the) newsletter/i, /\bpodcast\b/i], schema: ['NewsMediaOrganization', 'PodcastSeries'], weakSchema: ['NewsArticle'] },
];

export function detectIndustry({ html = '', tools = [], linked = [], cnames = [] }) {
  const types = schemaTypes(html);
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ');
  const scores = INDUSTRY_RULES.map(rule => {
    const reasons = [];
    for (const t of rule.tools) {
      if (tools.includes(t)) reasons.push(`script: ${t}`);
      else if (linked.includes(t)) reasons.push(`link: ${t}`);
    }
    const label = re => re.source.replace(/\\b|\\/g, '');
    for (const re of rule.text) if (re.test(text) || re.test(html)) reasons.push(`page: ${label(re)}`);
    for (const re of rule.weakText || []) if (re.test(text) || re.test(html)) reasons.push(`weak page: ${label(re)}`);
    for (const s of rule.schema) if (types.includes(s)) reasons.push(`schema: ${s}`);
    for (const s of rule.weakSchema || []) if (types.includes(s)) reasons.push(`weak schema: ${s}`);
    // Scripts and specific schema types count double; generic words and types count half.
    const weight = r => (r.startsWith('weak') ? 0.5 : r.startsWith('page') || r.startsWith('link') ? 1 : 2);
    const score = reasons.reduce((n, r) => n + weight(r), 0);
    return { pack: rule.pack, score, reasons };
  });
  if (cnames.some(c => /substack|beehiiv|ghost\.io/i.test(c))) {
    const media = scores.find(s => s.pack === 'media-creators');
    media.score += 2;
    media.reasons.push('dns: newsletter platform');
  }
  return scores.filter(s => s.score >= 1).sort((a, b) => b.score - a.score).slice(0, 3);
}

export function extractPhones(html) {
  const decode = s => { try { return decodeURIComponent(s); } catch { return s; } };
  const tel = [...html.matchAll(/href=["']tel:([^"']+)["']/gi)].map(m => decode(m[1]).replace(/[^\d+]/g, ''));
  const text = stripTags(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' '));
  const shown = [...text.matchAll(/(?:\+?1[\s.-]?)?\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g)].map(m => m[0].replace(/[^\d+]/g, ''));
  return [...new Set([...tel, ...shown])];
}

export function utmTestUrls(url) {
  const variants = [
    ['(none)', {}],
    ['google-ads', { utm_source: 'google', utm_medium: 'cpc', gclid: 'test' }],
    ['google-organic', { utm_source: 'google', utm_medium: 'organic' }],
    ['meta-ads', { utm_source: 'facebook', utm_medium: 'paid', fbclid: 'test' }],
    ['bing-ads', { utm_source: 'bing', utm_medium: 'cpc', msclkid: 'test' }],
    ['gbp', { utm_source: 'gbp', utm_medium: 'organic' }],
  ];
  return variants.map(([label, params]) => {
    const u = new URL(url);
    for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
    return { label, url: u.toString() };
  });
}

export function optimizelyNames(js) {
  return [...new Set([...js.matchAll(/"name"\s*:\s*"([^"]{3,120})"/g)].map(m => m[1]))].slice(0, 150);
}

export function growthbookKeys(html) {
  const key = html.match(/["'](sdk-[A-Za-z0-9]{8,})["']/)?.[1] || null;
  const host = html.match(/apiHost["']?\s*[:=]\s*["'](https:\/\/[^"']+)["']/)?.[1] || 'https://cdn.growthbook.io';
  return { key, host };
}

export function summarizeGrowthbook(json) {
  if (json.encryptedFeatures) return { encrypted: true, features: [] };
  const features = Object.entries(json.features || {}).map(([key, f]) => ({
    feature: key,
    experiments: (f.rules || []).filter(r => r.variations).map(r => r.key || r.name || '(unnamed)'),
  }));
  return { encrypted: false, features };
}

export function edgarDocUrl(cik, accession, doc) {
  return `https://www.sec.gov/Archives/edgar/data/${Number(cik)}/${accession.replace(/-/g, '')}/${doc}`;
}

export function monthRanges(months, now = new Date()) {
  const out = [];
  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    // CFPB's date_received_max is inclusive, so the range ends on the month's last day.
    const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0));
    out.push({ month: start.toISOString().slice(0, 7), min: start.toISOString().slice(0, 10), max: end.toISOString().slice(0, 10) });
  }
  return out;
}

// Sites that block scripted fetches are read from their latest Wayback capture instead.
async function getPageOrArchive(url) {
  try {
    return { html: await get(url), source: 'live' };
  } catch (err) {
    const snap = await getJson(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`);
    const closest = snap.archived_snapshots?.closest;
    if (!closest?.available) throw err;
    const ts = closest.timestamp;
    return { html: await get(`https://web.archive.org/web/${ts}id_/${url}`), source: `archive ${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)} (live fetch: ${err.message.split(' ')[0]})` };
  }
}

async function getJson(url, headers = {}) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'application/json', ...headers }, redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function cmdDetect(domain) {
  const { html, source } = await getPageOrArchive(`https://${domain}/`);
  const tools = detectTools(html);
  const linked = detectLinkedTools(html);
  const dnsInfo = await cmdDns(domain);
  const packs = detectIndustry({ html, tools, linked, cnames: dnsInfo.subdomains.map(s => s.cname) });
  return {
    domain,
    pulled: new Date().toISOString().slice(0, 10),
    source,
    note: 'Heuristic. Confirm the industry with the user, then load references/industries/<pack>.md. A company can fit two packs (a marketplace for local services).',
    packs,
    tools,
    linked_tools: linked,
    schema_types: schemaTypes(html),
  };
}

async function cmdShopify(domain, opts) {
  const maxPages = posInt(opts.pages, 20, 'pages');
  const products = [];
  let complete = false;
  let stoppedAt = null;
  for (let page = 1; page <= maxPages; page++) {
    let json;
    try { json = await getJson(`https://${domain}/products.json?limit=250&page=${page}`); } catch (err) {
      if (page === 1) throw new Error(`products.json not available (${err.message}). The store may not be on Shopify or may block it.`);
      stoppedAt = { page, error: err.message };
      break;
    }
    if (!json.products?.length) { complete = true; break; }
    products.push(...json.products);
    await sleep(500);
  }
  const rows = products.map(p => {
    const prices = (p.variants || []).map(v => Number(v.price)).filter(Number.isFinite);
    return {
      handle: p.handle,
      title: p.title,
      type: p.product_type || '',
      vendor: p.vendor || '',
      created: (p.created_at || '').slice(0, 10),
      published: (p.published_at || '').slice(0, 10),
      min_price: prices.length ? Math.min(...prices) : '',
      max_price: prices.length ? Math.max(...prices) : '',
      on_sale: (p.variants || []).some(v => Number(v.compare_at_price) > Number(v.price)),
      variants: (p.variants || []).length,
      tags: (Array.isArray(p.tags) ? p.tags : String(p.tags || '').split(',')).join('|'),
    };
  });
  if (opts.out) writeFileSync(opts.out, toCsv(rows));
  const byMonth = {};
  for (const r of rows) if (r.created) byMonth[r.created.slice(0, 7)] = (byMonth[r.created.slice(0, 7)] || 0) + 1;
  const types = {};
  for (const r of rows) types[r.type || '(none)'] = (types[r.type || '(none)'] || 0) + 1;
  let bestsellers = [];
  try {
    const html = await get(`https://${domain}/collections/all?sort_by=best-selling`);
    bestsellers = [...new Set([...html.matchAll(/\/products\/([a-z0-9][a-z0-9-]*)/gi)].map(m => m[1].toLowerCase()))].slice(0, 30);
  } catch {}
  let apps = [];
  try { apps = detectTools(await get(`https://${domain}/`)).filter(t => SIGNATURES.find(s => s.tool === t && ['ecommerce', 'payments', 'testing', 'lifecycle'].includes(s.group))); } catch {}
  return {
    domain,
    pulled: new Date().toISOString().slice(0, 10),
    products: rows.length,
    complete,
    ...(stoppedAt ? { stopped_at: stoppedAt } : {}),
    ...(!complete && !stoppedAt ? { truncated_at_pages: maxPages } : {}),
    on_sale: rows.filter(r => r.on_sale).length,
    created_by_month: Object.fromEntries(Object.entries(byMonth).sort()),
    product_types: Object.fromEntries(Object.entries(types).sort((a, b) => b[1] - a[1]).slice(0, 20)),
    bestsellers_in_order: bestsellers,
    apps,
    note: 'created is when the product was added to the store; published can be reset by relaunches. Bestseller order comes from the store\'s own best-selling sort, which some themes override. Hidden and unlisted products are not included.',
  };
}

async function cmdExperiments(domain) {
  const { html, source } = await getPageOrArchive(`https://${domain}/`);
  const tools = detectTools(html).filter(t => SIGNATURES.find(s => s.tool === t && s.group === 'testing'));
  const out = { domain, pulled: new Date().toISOString().slice(0, 10), source, tools };
  const opt = html.match(/cdn\.optimizely\.com\/js\/(\d+)\.js/);
  if (opt) {
    try {
      out.optimizely = { snippet: `https://cdn.optimizely.com/js/${opt[1]}.js`, names: optimizelyNames(await get(`https://cdn.optimizely.com/js/${opt[1]}.js`)) };
    } catch (err) { out.optimizely = { error: err.message }; }
  }
  const gb = growthbookKeys(html);
  if (gb.key) {
    try { out.growthbook = { client_key: gb.key, ...summarizeGrowthbook(await getJson(`${gb.host}/api/features/${gb.key}`)) }; } catch (err) { out.growthbook = { error: err.message }; }
  }
  out.note = 'Optimizely names include experiments, pages, audiences, and events; read them for test themes. Other tools keep configs server-side or need a user context, so only their presence is reported. Many sites load these tools through a tag manager, so check in a browser too.';
  return out;
}

async function cmdPhones(url) {
  const { html, source } = await getPageOrArchive(url);
  return {
    url,
    source,
    pulled: new Date().toISOString().slice(0, 10),
    numbers_in_html: extractPhones(html),
    call_tracking: detectTools(html).filter(t => SIGNATURES.find(s => s.tool === t && s.group === 'call-tracking')),
    browser_check: utmTestUrls(url),
    note: 'Call tracking swaps numbers in the browser after the page loads, so the HTML shows only the default. Open each browser_check URL in a fresh session and record the number shown. A different number per source means that channel is tracked separately.',
  };
}

const SEC_FORMS = new Set(['10-K', '10-Q', '8-K', 'S-1', 'S-1/A', 'F-1', '424B4', 'DEF 14A', '20-F', '6-K', 'D']);

async function cmdFilings(name, opts) {
  const ua = opts.ua || process.env.SEC_USER_AGENT;
  if (!ua) throw new Error('SEC requires a contact in the User-Agent. Pass --ua "Your Name you@company.com" or set SEC_USER_AGENT.');
  const headers = { 'user-agent': ua };
  const out = { query: name, pulled: new Date().toISOString().slice(0, 10) };
  const tickers = Object.values(await getJson('https://www.sec.gov/files/company_tickers.json', headers));
  const q = name.toLowerCase();
  const rank = t => (t.ticker.toLowerCase() === q ? 0 : t.title.toLowerCase().startsWith(q) ? 1 : 2);
  const matches = tickers.filter(t => t.ticker.toLowerCase() === q || t.title.toLowerCase().includes(q))
    .sort((a, b) => rank(a) - rank(b)).slice(0, 5);
  out.public_matches = matches.map(m => ({ cik: m.cik_str, ticker: m.ticker, name: m.title }));
  const cik = opts.cik || matches[0]?.cik_str;
  if (cik) {
    const sub = await getJson(`https://data.sec.gov/submissions/CIK${String(cik).padStart(10, '0')}.json`, headers);
    const r = sub.filings.recent;
    out.company = sub.name;
    out.filings = r.form.map((form, i) => ({ form, date: r.filingDate[i], url: edgarDocUrl(cik, r.accessionNumber[i], r.primaryDocument[i]) }))
      .filter(f => SEC_FORMS.has(f.form)).slice(0, posInt(opts.limit, 40, 'limit'));
  }
  try {
    const fts = await getJson(`https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(`"${name}"`)}&forms=D`, headers);
    out.form_d = (fts.hits?.hits || []).slice(0, 20).map(h => {
      const [adsh, file] = h._id.split(':');
      return { filer: h._source.display_names?.[0], date: h._source.file_date, url: edgarDocUrl(h._source.ciks[0], adsh, file) };
    });
  } catch (err) { out.form_d = { error: err.message }; }
  out.note = 'Public companies: 10-K and 10-Q for customers, revenue, and sales and marketing spend; S-1 for the growth story; 8-K for events. Form D filings record private fundraises (often filed by the company or an SPV), with amounts and dates. Name matches can be wrong; check the filer.';
  return out;
}

const CFPB = 'https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/';

async function cmdCfpb(name, opts) {
  const months = posInt(opts.months, 24, 'months');
  let company = opts.exact;
  const candidates = (await getJson(`${CFPB}?${new URLSearchParams({ search_term: name, field: 'company', size: '0' })}`))
    .aggregations?.company?.company?.buckets?.map(b => ({ company: b.key, complaints: b.doc_count })) || [];
  company ||= candidates[0]?.company;
  if (!company) return { query: name, candidates, note: 'No company found in the CFPB database. Try another spelling, or --exact "Company Name".' };
  const ranges = monthRanges(months);
  const monthly = [];
  for (const r of ranges) {
    const json = await getJson(`${CFPB}?${new URLSearchParams({ company, size: '0', date_received_min: r.min, date_received_max: r.max })}`);
    monthly.push({ month: r.month, complaints: json.hits?.total?.value ?? null });
    await sleep(250);
  }
  const window = await getJson(`${CFPB}?${new URLSearchParams({ company, size: '0', date_received_min: ranges[0].min, date_received_max: ranges[ranges.length - 1].max })}`);
  const top = key => (window.aggregations?.[key]?.[key]?.buckets || []).slice(0, 10).map(b => ({ [key]: b.key, complaints: b.doc_count }));
  return {
    query: name,
    company,
    candidates,
    pulled: new Date().toISOString().slice(0, 10),
    monthly,
    top_products: top('product'),
    top_issues: top('issue'),
    note: 'Complaint volume tracks customer volume and problems together; read it next to growth, not as growth. The latest month is partial.',
  };
}

async function cmdFdic(name, opts) {
  const base = 'https://api.fdic.gov/banks';
  const inst = await getJson(`${base}/institutions?${new URLSearchParams({ search: `NAME:${name}`, fields: 'NAME,CERT,ASSET,DEP,ACTIVE,CITY,STALP,ESTYMD', limit: '25', sort_by: 'ASSET', sort_order: 'DESC' })}`);
  const banks = (inst.data || []).map(d => d.data);
  // FDIC search also matches former names, so only an active bank whose current name starts with the query is picked.
  const norm = s => String(s).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const named = banks.filter(b => b.ACTIVE === 1 && norm(b.NAME).startsWith(norm(name)));
  const cert = opts.cert || (named.find(b => norm(b.NAME) === norm(name)) || (named.length === 1 ? named[0] : null))?.CERT;
  const out = { query: name, pulled: new Date().toISOString().slice(0, 10), matches: banks };
  if (!cert) out.needs_cert = 'No single active bank matched the name. Pick a CERT from matches and rerun with --cert.';
  if (cert) {
    const fin = await getJson(`${base}/financials?${new URLSearchParams({ filters: `CERT:${cert}`, fields: 'REPDTE,ASSET,DEP,NUMEMP', sort_by: 'REPDTE', sort_order: 'DESC', limit: String(posInt(opts.quarters, 12, 'quarters')) })}`);
    out.cert = cert;
    out.quarterly = (fin.data || []).map(d => d.data).map(q => ({ quarter: q.REPDTE, assets_thousands: q.ASSET, deposits_thousands: q.DEP, employees: q.NUMEMP })).reverse();
  }
  out.note = 'Dollar figures are in thousands. Fintechs that are not banks hold deposits at partner banks; look up the partner bank named in their disclosures. Credit unions report to the NCUA, not the FDIC.';
  return out;
}

export const ATS_PATTERNS = [
  { ats: 'greenhouse', pattern: /(?:job-)?boards(?:\.eu)?\.greenhouse\.io\/(?:embed\/job_board(?:\/js)?\?for=)?([a-z0-9_-]+)/gi },
  { ats: 'greenhouse', pattern: /boards-api\.greenhouse\.io\/v1\/boards\/([a-z0-9_-]+)/gi },
  { ats: 'lever', pattern: /jobs\.(?:eu\.)?lever\.co\/([a-z0-9_.-]+)/gi },
  { ats: 'ashby', pattern: /jobs\.ashbyhq\.com\/([a-z0-9_.-]+)/gi },
];

export function atsFromHtml(html) {
  const found = new Map();
  for (const { ats, pattern } of ATS_PATTERNS) {
    for (const m of html.matchAll(pattern)) {
      const slug = m[1].toLowerCase();
      if (['embed', 'api', 'v0', 'v1'].includes(slug)) continue;
      found.set(`${ats}:${slug}`, { ats, slug });
    }
  }
  return [...found.values()];
}

export function atsUrl(ats, slug) {
  if (ats === 'greenhouse') return `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`;
  if (ats === 'lever') return `https://api.lever.co/v0/postings/${slug}?mode=json`;
  if (ats === 'ashby') return `https://api.ashbyhq.com/posting-api/job-board/${slug}?includeCompensation=true`;
  throw new Error(`Unknown ATS ${ats}; use greenhouse, lever, or ashby`);
}

export function normalizeJobs(ats, json) {
  if (ats === 'greenhouse') {
    return (json.jobs || []).map(j => ({
      id: String(j.id),
      title: j.title || '',
      department: j.departments?.[0]?.name || '',
      location: j.location?.name || '',
      posted: String(j.first_published || j.updated_at || '').slice(0, 10),
      url: j.absolute_url || '',
      text: stripTags(decodeEntities(j.content || '')),
    }));
  }
  if (ats === 'lever') {
    return (Array.isArray(json) ? json : []).map(j => ({
      id: j.id,
      title: j.text || '',
      department: j.categories?.department || j.categories?.team || '',
      location: j.categories?.location || '',
      posted: j.createdAt ? new Date(Number(j.createdAt)).toISOString().slice(0, 10) : '',
      url: j.hostedUrl || '',
      text: [j.descriptionPlain, ...(j.lists || []).map(l => `${l.text} ${stripTags(l.content || '')}`), j.additionalPlain].filter(Boolean).join(' '),
    }));
  }
  return (json.jobs || []).filter(j => j.isListed !== false).map(j => ({
    id: j.id,
    title: j.title || '',
    department: j.department || j.team || '',
    location: j.location || '',
    posted: String(j.publishedAt || '').slice(0, 10),
    url: j.jobUrl || '',
    text: j.descriptionPlain || stripTags(j.descriptionHtml || ''),
  }));
}

// Checked in order against the title, then the department, so "Sales Engineer" is sales and "Developer Advocate" is marketing.
const FUNCTIONS = [
  ['marketing', /marketing|marketer|growth|campaign|\bseo\b|content (?:market|strateg|writ|lead|manag|creat|design)|copywrit|brand|demand gen|lifecycle|community|social media|communications|\bpr\b|devrel|developer relations|developer advocate|creator|influencer/i],
  ['sales', /sales|account executive|\bae\b|\bsdr\b|\bbdr\b|business development|account manager|partnerships|alliances|revenue operations|revops/i],
  ['customer', /support|customer success|professional services|customer experience|implementation|onboarding|technical account/i],
  ['product', /product manager|product lead|head of product|product owner|\bpm\b/i],
  ['design', /design/i],
  ['data', /\bdata\b|analytics|machine learning|\bml\b|research scientist/i],
  ['engineering', /engineer|developer|\bsre\b|infrastructure|security|devops|architect/i],
  ['operations', /recruit|talent|people|\bhr\b|finance|accountant|accounting|controller|deal desk|strategy|planning|legal|counsel|operations|office|assistant|admin/i],
];

export function jobFunction(title, department = '') {
  for (const source of [title, department]) {
    const hit = FUNCTIONS.find(([, re]) => re.test(source));
    if (hit) return hit[0];
  }
  return 'other';
}

export const CHANNEL_TERMS = [
  ['seo', /\bseo\b|search engine optim|organic search/i],
  ['ai-search', /\baeo\b|\bgeo\b|ai search|answer engine|llm visibility/i],
  ['paid', /paid (?:social|search|media|acquisition)|performance marketing|\bppc\b|media buy|user acquisition/i],
  ['lifecycle', /lifecycle|retention|email marketing|\bcrm\b/i],
  ['content', /content|editorial|copywrit|writer/i],
  ['community', /community/i],
  ['devrel', /developer relations|devrel|developer advocate|developer experience|developer marketing/i],
  ['partnerships', /partner|alliances|affiliate|channel/i],
  ['creators', /influencer|creator|\bugc\b/i],
  ['events', /field marketing|experiential|\bevents?\b/i],
  ['campaigns', /campaign/i],
  ['abm', /\babm\b|account[- ]based/i],
  ['product-marketing', /product marketing|\bpmm\b/i],
  ['brand-pr', /\bbrand\b|public relations|\bpr\b|communications/i],
  ['video', /video|youtube/i],
  ['growth', /growth|activation|experimentation|product[- ]led|\bplg\b/i],
  ['social', /social media|\bsocial\b/i],
];

export const JOB_TOOLS = ['HubSpot', 'Salesforce', 'Marketo', 'Pardot', 'Braze', 'Iterable', 'Customer.io', 'Klaviyo', 'Attentive',
  'Segment', 'Amplitude', 'Mixpanel', 'Heap', 'PostHog', 'Looker', 'Tableau', 'dbt', 'Snowflake', 'BigQuery', 'Hightouch', 'Census',
  'Clay', 'Apollo', 'Outreach', 'Salesloft', 'Gong', '6sense', 'Demandbase', 'ZoomInfo', 'Webflow', 'WordPress', 'Contentful', 'Sanity',
  'Figma', 'Canva', 'Semrush', 'Ahrefs', 'Google Ads', 'Meta Ads', 'LinkedIn Ads', 'TikTok Ads', 'Optimizely', 'VWO', 'LaunchDarkly',
  'Statsig', 'Intercom', 'Zendesk', 'Gainsight', 'PartnerStack', 'Rewardful', 'Shopify', 'Postscript', 'AppsFlyer', 'Adjust', 'Branch'];

const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Names that are also common words only count within 60 characters of an unambiguous tool name, as in "Salesforce, Outreach, and Gong".
const AMBIGUOUS_TOOLS = new Set(['Segment', 'Outreach', 'Adjust', 'Branch', 'Apollo', 'Clay', 'Census', 'Heap', 'Sanity', 'Gong', 'Looker', 'Canva']);
const JOB_TOOL_RES = JOB_TOOLS.map(t => [t, new RegExp(`(?<![\\w.])${escapeRe(t)}(?![\\w])`, AMBIGUOUS_TOOLS.has(t) || t.length <= 4 ? 'g' : 'gi')]);
const CLEAR_TOOL_RES = JOB_TOOL_RES.filter(([t]) => !AMBIGUOUS_TOOLS.has(t)).map(([, re]) => new RegExp(re.source, re.flags.replace('g', '')));

export function toolsInText(text) {
  const found = [];
  for (const [tool, re] of JOB_TOOL_RES) {
    for (const m of text.matchAll(re)) {
      if (!AMBIGUOUS_TOOLS.has(tool)) { found.push(tool); break; }
      const window = text.slice(Math.max(0, m.index - 60), m.index + tool.length + 60).replace(tool, '');
      if (CLEAR_TOOL_RES.some(r => r.test(window))) { found.push(tool); break; }
    }
  }
  return found;
}
const LANGS = 'german|french|spanish|portuguese|italian|dutch|japanese|korean|mandarin|chinese|cantonese|arabic|hindi|polish|swedish|danish|norwegian|finnish|turkish|hebrew|indonesian|vietnamese|thai';
const LANG_RES = [
  new RegExp(`\\b(?:fluent|fluency|native|proficient|proficiency)\\b[^.]{0,40}?\\b(${LANGS})\\b`, 'gi'),
  new RegExp(`\\b(${LANGS})[- ](?:speaking|speaker)`, 'gi'),
];
const FIRST_HIRE = /\b(?:first|founding)\b[^.]{0,30}\b(?:marketer|marketing|growth|demand gen|content|seo|brand|devrel|community)\b/i;

export function summarizeJobs(jobs, now = new Date()) {
  const count = (obj, key) => { obj[key] = (obj[key] || 0) + 1; };
  const sortDesc = obj => Object.fromEntries(Object.entries(obj).sort((a, b) => b[1] - a[1]));
  const byFunction = {};
  const channels = {};
  const tools = {};
  const locations = {};
  const languages = {};
  const postedByMonth = {};
  const marketing = [];
  const firstHire = [];
  const cutoff = new Date(now.getTime() - 30 * 86400000).toISOString().slice(0, 10);
  for (const j of jobs) {
    const fn = jobFunction(j.title, j.department);
    count(byFunction, fn);
    if (j.location) count(locations, j.location);
    if (j.posted) count(postedByMonth, j.posted.slice(0, 7));
    for (const tool of toolsInText(j.text)) count(tools, tool);
    const langs = new Set();
    for (const re of LANG_RES) for (const m of j.text.matchAll(re)) langs.add(m[1].toLowerCase());
    for (const l of langs) count(languages, l);
    if (fn === 'marketing') {
      const ch = CHANNEL_TERMS.filter(([, re]) => re.test(j.title)).map(([c]) => c);
      for (const c of ch) count(channels, c);
      marketing.push({ title: j.title, channels: ch, location: j.location, posted: j.posted, url: j.url });
      if (FIRST_HIRE.test(j.text) || FIRST_HIRE.test(j.title)) firstHire.push(j.title);
    }
  }
  return {
    total: jobs.length,
    new_last_30_days: jobs.filter(j => j.posted && j.posted >= cutoff).length,
    by_function: sortDesc(byFunction),
    marketing_channels: sortDesc(channels),
    marketing_roles: marketing.sort((a, b) => String(b.posted).localeCompare(String(a.posted))),
    first_hire_signals: firstHire,
    tools_mentioned: Object.entries(tools).sort((a, b) => b[1] - a[1]).map(([tool, n]) => ({ tool, jobs: n })),
    languages: sortDesc(languages),
    top_locations: Object.fromEntries(Object.entries(locations).sort((a, b) => b[1] - a[1]).slice(0, 15)),
    posted_by_month: Object.fromEntries(Object.entries(postedByMonth).sort()),
  };
}

async function findJobBoard(target, opts) {
  if (opts.ats || opts.board) {
    if (!opts.ats || !opts.board) throw new Error('Pass --ats and --board together, for example --ats greenhouse --board vercel');
    return [{ ats: opts.ats, slug: opts.board, found: 'given' }];
  }
  const isDomain = target.includes('.');
  const candidates = [];
  if (isDomain) {
    for (const path of ['/careers', '/jobs', '/company/careers', '/about/careers', '/']) {
      try { candidates.push(...atsFromHtml(await get(`https://${target}${path}`)).map(c => ({ ...c, found: `linked from ${path}` }))); } catch {}
      if (candidates.length) break;
    }
  }
  const guess = (isDomain ? target.replace(/^www\./, '').split('.')[0] : target).toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const ats of ['greenhouse', 'lever', 'ashby']) candidates.push({ ats, slug: guess, found: 'guessed from the name' });
  return candidates;
}

async function cmdJobs(target, opts) {
  const tried = [];
  for (const c of await findJobBoard(target, opts)) {
    let json;
    try { json = await getJson(atsUrl(c.ats, c.slug)); } catch (err) { tried.push(`${c.ats}/${c.slug}: ${err.message.split(' ')[0]}`); continue; }
    const jobs = normalizeJobs(c.ats, json);
    if (!jobs.length && c.found === 'guessed from the name') { tried.push(`${c.ats}/${c.slug}: no jobs`); continue; }
    if (opts.out) {
      writeFileSync(opts.out, toCsv(jobs.map(j => ({ id: j.id, title: j.title, function: jobFunction(j.title, j.department), department: j.department, location: j.location, posted: j.posted, url: j.url }))));
    }
    return {
      query: target,
      pulled: new Date().toISOString().slice(0, 10),
      board: { ats: c.ats, slug: c.slug, found: c.found, company_name: json.jobs?.[0]?.company_name || null },
      ...summarizeJobs(jobs),
      note: 'Open roles show where the company is investing next, not what it has done. A guessed board can belong to another company with the same name, so check company_name and a few job URLs. posted is first published (Greenhouse), created (Lever), or published (Ashby); a reposted role gets a new date. Boards on Workday, SmartRecruiters, or a custom site are not covered: read them in a browser. For history, open Wayback captures of the careers page. Record job titles, never the names of recruiters or staff.',
    };
  }
  return { query: target, board: null, tried, note: 'No public Greenhouse, Lever, or Ashby board found. Find the careers page link and rerun with --ats and --board, or read the board in a browser.' };
}

// Apple's review feed: entries with a rating are reviews. Reviewer names are dropped.
export function parseAppleReviews(json) {
  const entries = json.feed?.entry ? [].concat(json.feed.entry) : [];
  return entries.filter(e => e['im:rating']).map(e => ({
    id: e.id?.label || '',
    date: String(e.updated?.label || '').slice(0, 10),
    rating: Number(e['im:rating'].label),
    version: e['im:version']?.label || '',
    title: e.title?.label || '',
    text: e.content?.label || '',
  }));
}

const STOPWORDS = new Set(('a about after again all also am an and any app are as at be because been before being but by can cant could did do does dont even every for from get got had has have how i if im in into is it its ive just like make me more most my no not now of on once one only or other our out over really so some still than that the their them then there they this to too up use used using very was we were what when which while will with would you your yours its id youre thats doesnt didnt isnt wont ever much many way thing things time app apps').split(' '));

function reviewTerms(text) {
  const words = text.toLowerCase().replace(/[’']/g, '').match(/[a-z][a-z0-9]+/g) || [];
  const terms = new Set();
  for (let i = 0; i < words.length; i++) {
    if (STOPWORDS.has(words[i]) || words[i].length < 3) continue;
    terms.add(words[i]);
    if (words[i + 1] && !STOPWORDS.has(words[i + 1]) && words[i + 1].length >= 3) terms.add(`${words[i]} ${words[i + 1]}`);
  }
  return terms;
}

// Terms counted once per review. low_share and high_share compare 1-2 star reviews with 4-5 star ones.
export function reviewStats(reviews, { minLow = 3 } = {}) {
  const byMonth = {};
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const low = reviews.filter(r => r.rating <= 2);
  const high = reviews.filter(r => r.rating >= 4);
  for (const r of reviews) {
    if (distribution[r.rating] != null) distribution[r.rating]++;
    if (!r.date) continue;
    const m = r.date.slice(0, 7);
    byMonth[m] ??= { month: m, reviews: 0, sum: 0, low: 0 };
    byMonth[m].reviews++;
    byMonth[m].sum += r.rating;
    if (r.rating <= 2) byMonth[m].low++;
  }
  const docFreq = list => {
    const counts = {};
    for (const r of list) for (const t of reviewTerms(`${r.title} ${r.text}`)) counts[t] = (counts[t] || 0) + 1;
    return counts;
  };
  const lowCounts = docFreq(low);
  const highCounts = docFreq(high);
  const share = (n, d) => (d ? round1((100 * n) / d) : null);
  const complaints = Object.entries(lowCounts).filter(([, n]) => n >= minLow)
    .map(([term, n]) => ({ term, low_reviews: n, low_share: share(n, low.length), high_share: share(highCounts[term] || 0, high.length) }))
    .filter(t => t.high_share == null || t.low_share > t.high_share)
    .sort((a, b) => b.low_reviews - a.low_reviews || a.term.localeCompare(b.term));
  // A two-word term usually says more than its single words, so drop words that only appear inside a listed pair.
  const pairs = complaints.filter(t => t.term.includes(' '));
  const terms = complaints.filter(t => t.term.includes(' ') || !pairs.some(p => p.term.split(' ').includes(t.term) && p.low_reviews === t.low_reviews));
  return {
    reviews: reviews.length,
    average: reviews.length ? round1(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) : null,
    distribution,
    by_month: Object.values(byMonth).sort((a, b) => a.month.localeCompare(b.month))
      .map(({ month, reviews: n, sum, low: l }) => ({ month, reviews: n, average: round1(sum / n), low_share: share(l, n) })),
    complaint_terms: terms.slice(0, 25),
    recent_low: low.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 15)
      .map(r => ({ date: r.date, rating: r.rating, title: r.title, text: r.text.length > 300 ? `${r.text.slice(0, 300)}...` : r.text })),
  };
}

async function cmdReviews(name, opts) {
  if (!name && !opts.from) throw new Error('reviews needs an app name, --app-id, or --from reviews.csv');
  if (opts.from) {
    const rows = parseCsv(readFileSync(opts.from, 'utf8')).map(r => ({ date: String(r.date || '').slice(0, 10), rating: Number(r.rating), title: r.title || '', text: r.text || '' }))
      .filter(r => r.rating >= 1 && r.rating <= 5);
    return { source: opts.from, pulled: new Date().toISOString().slice(0, 10), ...reviewStats(rows), note: 'Stats from your CSV (date,rating,title,text). Say where it came from and when in the write-up.' };
  }
  const country = String(opts.country || 'us').toLowerCase();
  const out = { query: name, country, pulled: new Date().toISOString().slice(0, 10) };
  const fields = a => ({ app_id: a.trackId, name: a.trackName, seller: a.sellerName, seller_url: a.sellerUrl || null, rating: a.averageUserRating, ratings: a.userRatingCount, released: String(a.releaseDate || '').slice(0, 10), last_update: String(a.currentVersionReleaseDate || '').slice(0, 10) });
  let app;
  if (opts['app-id']) {
    app = (await getJson(`https://itunes.apple.com/lookup?id=${encodeURIComponent(opts['app-id'])}&country=${country}`)).results?.[0];
    if (!app) throw new Error(`No App Store app with id ${opts['app-id']} in ${country}`);
  } else {
    const results = (await getJson(`https://itunes.apple.com/search?${new URLSearchParams({ term: name, entity: 'software', country, limit: '5' })}`)).results || [];
    out.candidates = results.map(fields);
    const host = u => String(u || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '');
    app = opts.domain ? results.find(r => host(r.sellerUrl) === host(opts.domain)) : results[0];
    if (!app) return { ...out, note: opts.domain ? `No result's seller site matches ${opts.domain}. Pick an app_id from candidates and rerun with --app-id.` : 'No App Store app found. Try another name or --app-id.' };
  }
  out.app = fields(app);
  const reviews = [];
  let pages = 0;
  for (let page = 1; page <= 10; page++) {
    let json;
    try { json = await getJson(`https://itunes.apple.com/${country}/rss/customerreviews/page=${page}/id=${app.trackId}/sortby=mostrecent/json`); } catch { break; }
    const batch = parseAppleReviews(json);
    if (!batch.length) break;
    reviews.push(...batch);
    pages = page;
    await sleep(300);
  }
  if (opts.out) writeFileSync(opts.out, toCsv(reviews.map(({ date, rating, version, title, text }) => ({ date, rating, version, title, text }))));
  Object.assign(out, reviewStats(reviews));
  out.feed_capped = pages === 10;
  out.note = 'App Store reviews with text, newest first, for one country. The feed stops at 500, so when feed_capped is true the oldest month is partial and a busy app may cover only days. ratings in app is the lifetime count for this country, including ratings without text. If no seller domain was given, the first search result was used: check app.seller. For Google Play, Trustpilot, or G2, export reviews with a scraping tool or the platform\'s API to date,rating,title,text and run reviews --from file.csv.';
  if (!opts['app-id'] && !opts.domain) out.check = 'Matched by name only. Confirm app.seller is the target, or rerun with --domain target.com.';
  return out;
}

// npm caps one range request at 18 months, so the window is split into chunks of at most 365 days.
export function npmRanges(months, now = new Date()) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - months, 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
  const out = [];
  for (let from = start; from <= end;) {
    const to = new Date(Math.min(end.getTime(), from.getTime() + 364 * 86400000));
    out.push({ from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) });
    from = new Date(to.getTime() + 86400000);
  }
  return out;
}

export function monthlyFromDaily(days) {
  const byMonth = {};
  for (const d of days) {
    const m = d.day.slice(0, 7);
    byMonth[m] ??= { month: m, downloads: 0, days: 0 };
    byMonth[m].downloads += d.downloads;
    byMonth[m].days++;
  }
  return Object.values(byMonth).sort((a, b) => a.month.localeCompare(b.month)).map(r => {
    const [y, m] = r.month.split('-').map(Number);
    return { ...r, partial: r.days < new Date(Date.UTC(y, m, 0)).getUTCDate() };
  });
}

// samples: the date of the Nth star. Stars at each month end are interpolated between samples.
export function starCurve(samples, months, now = new Date()) {
  const pts = [...samples].sort((a, b) => a.index - b.index).map(s => ({ index: s.index, t: Date.parse(s.date), final: Boolean(s.final) }));
  const out = [];
  for (let i = months - 1; i >= 0; i--) {
    const monthEnd = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i + 1, 0, 23, 59, 59);
    const t = Math.min(monthEnd, now.getTime());
    const month = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1)).toISOString().slice(0, 7);
    let stars;
    if (!pts.length || t < pts[0].t) stars = pts.length ? 0 : null;
    else if (t >= pts[pts.length - 1].t) stars = pts[pts.length - 1].final ? pts[pts.length - 1].index : null;
    else {
      const j = pts.findIndex(p => p.t > t);
      const a = pts[j - 1];
      const b = pts[j];
      stars = Math.round(a.index + ((b.index - a.index) * (t - a.t)) / (b.t - a.t));
    }
    out.push({ month, stars });
  }
  return out;
}

async function githubStars(repo, months) {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const headers = token ? { authorization: `Bearer ${token}` } : {};
  const info = await getJson(`https://api.github.com/repos/${repo}`, headers);
  const out = { repo: info.full_name, stars: info.stargazers_count, forks: info.forks_count, created: String(info.created_at).slice(0, 10), last_push: String(info.pushed_at).slice(0, 10) };
  if (!token) return { ...out, history: null, history_note: 'Star history needs GITHUB_TOKEN (GitHub requires sign-in to list stargazers).' };
  const lastPage = Math.min(Math.ceil(info.stargazers_count / 100), 400);
  const pages = [...new Set(Array.from({ length: Math.min(30, lastPage) }, (_, i) => 1 + Math.round((i * (lastPage - 1)) / Math.max(1, Math.min(30, lastPage) - 1))))];
  const samples = [];
  const starHeaders = { ...headers, accept: 'application/vnd.github.star+json' };
  try {
    for (const p of pages) {
      const rows = await getJson(`https://api.github.com/repos/${repo}/stargazers?per_page=100&page=${p}`, starHeaders);
      if (!rows.length) continue;
      samples.push({ index: (p - 1) * 100 + 1, date: rows[0].starred_at });
      if (p === lastPage) samples.push({ index: (p - 1) * 100 + rows.length, date: rows[rows.length - 1].starred_at });
    }
  } catch (err) {
    return { ...out, history: null, history_note: `Could not list stargazers (${err.message.split(' ')[0]}). The token needs read access to public repositories.` };
  }
  const capped = info.stargazers_count > 40000;
  if (!capped) samples.push({ index: info.stargazers_count, date: new Date().toISOString(), final: true });
  return {
    ...out,
    history: starCurve(samples, months),
    history_note: capped ? 'GitHub lists only the first 40,000 stargazers, so months after that point are null.' : 'Stars at each month end, interpolated between sampled stargazer pages. Unstarred repos drop out of the count.',
  };
}

async function cmdAdoption(opts) {
  if (!opts.npm && !opts.pypi && !opts.github) throw new Error('adoption needs at least one of --npm package, --pypi package, --github owner/repo');
  const months = posInt(opts.months, 24, 'months');
  const out = { pulled: new Date().toISOString().slice(0, 10), months };
  if (opts.npm) {
    const days = [];
    for (const r of npmRanges(months)) {
      const json = await getJson(`https://api.npmjs.org/downloads/range/${r.from}:${r.to}/${encodeURIComponent(opts.npm).replace('%40', '@')}`);
      days.push(...(json.downloads || []));
    }
    // Days before the package's first download are zeros, not a real flat start.
    const first = days.findIndex(d => d.downloads > 0);
    out.npm = { package: opts.npm, monthly: first < 0 ? [] : monthlyFromDaily(days.slice(first)) };
  }
  if (opts.pypi) {
    const json = await getJson(`https://pypistats.org/api/packages/${encodeURIComponent(opts.pypi.toLowerCase())}/overall?mirrors=false`);
    const days = (json.data || []).filter(d => d.category === 'without_mirrors').map(d => ({ day: d.date, downloads: d.downloads }));
    out.pypi = { package: opts.pypi, monthly: monthlyFromDaily(days), note: 'PyPI Stats keeps only the last 180 days. For longer history, query the public PyPI downloads dataset in BigQuery.' };
  }
  if (opts.github) out.github = await githubStars(opts.github, months);
  if (opts.out) {
    const rows = {};
    for (const r of out.npm?.monthly || []) (rows[r.month] ??= { month: r.month }).npm_downloads = r.partial ? '' : r.downloads;
    for (const r of out.pypi?.monthly || []) (rows[r.month] ??= { month: r.month }).pypi_downloads = r.partial ? '' : r.downloads;
    for (const r of out.github?.history || []) (rows[r.month] ??= { month: r.month }).github_stars = r.stars ?? '';
    writeFileSync(opts.out, toCsv(Object.values(rows).sort((a, b) => a.month.localeCompare(b.month)).map(r => ({ month: r.month, npm_downloads: r.npm_downloads ?? '', pypi_downloads: r.pypi_downloads ?? '', github_stars: r.github_stars ?? '' }))));
  }
  out.note = 'Downloads count installs, including CI and bots, so read the trend, not the level. Partial months are flagged and left blank in --out. Monthly downloads from one registry can stand in for visits in traffic.csv for developer tools: keep to one source for the whole series.';
  return out;
}

function cmdMoves(opts) {
  if (!opts.moves || !opts.traffic) throw new Error('moves needs --moves moves.csv --traffic traffic.csv');
  const result = analyzeMoves(parseCsv(readFileSync(opts.moves, 'utf8')), parseCsv(readFileSync(opts.traffic, 'utf8')));
  if (opts.out) writeFileSync(opts.out, toCsv(result.clusters));
  return result;
}

function cmdDiff(opts) {
  if (!opts.old || !opts.new) throw new Error('diff needs --old moves-previous.csv --new moves.csv');
  const added = diffMoves(parseCsv(readFileSync(opts.old, 'utf8')), parseCsv(readFileSync(opts.new, 'utf8')));
  if (opts.out) writeFileSync(opts.out, toCsv(added));
  return { new_moves: added.length, moves: added };
}

function parseArgs(argv) {
  const pos = [];
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) opts[key] = true;
      else { opts[key] = next; i++; }
    } else pos.push(argv[i]);
  }
  return { pos, opts };
}

const USAGE = `teardown.mjs: free-source collection and analysis for reverse-engineer-marketing

Commands:
  site <domain> [--limit 20000] [--out urls.csv]   Sitemap URLs grouped by path family
  stack <domain> [--months 24]                    Ad, analytics, testing, referral, and lifecycle
                                                  scripts by first month seen in Wayback captures
  history <url> [--months 24]                     Months a page's prices changed (pricing history)
  hero <url> [--months 24]                        Months the headline, title, or meta description changed
  sitemap-growth <domain> [--months 24] [--sitemap url]
                                                  Sitemap size and page families by month from Wayback
  dns <domain>                                    Mail tools, domain verifications, and platforms behind
                                                  common marketing subdomains, from DNS records
  subdomains <domain> [--all]                     Subdomains in certificate logs with first-seen dates,
                                                  preview and staging names filtered out unless --all
  detect <domain>                                 Likely industry packs, with the reasons
  shopify <domain> [--pages 20] [--out products.csv]
                                                  Public Shopify catalog with dates, bestseller order, apps
  experiments <domain>                            Client-side A/B testing tools and readable test configs
  phones <url>                                    Phone numbers, call-tracking tools, and UTM URLs to check
  filings <company> [--ua "Name email"] [--cik n] SEC filings for public companies and Form D raises
  cfpb <company> [--months 24] [--exact "Name"]   CFPB consumer complaints by month, top products and issues
  fdic <bank> [--cert n] [--quarters 12]          FDIC quarterly assets, deposits, and employees
  jobs <domain|name> [--ats greenhouse|lever|ashby --board slug] [--out jobs.csv]
                                                  Open roles from public job boards: functions, marketing
                                                  channels being hired for, tools named, languages, locations
  adoption [--npm pkg] [--pypi pkg] [--github owner/repo] [--months 24] [--out adoption.csv]
                                                  Monthly npm and PyPI downloads and GitHub stars over time
                                                  (star history needs GITHUB_TOKEN)
  reviews <app name> [--domain example.com] [--app-id id] [--country us] [--out reviews.csv]
  reviews --from reviews.csv                      App Store reviews (or any date,rating,title,text CSV):
                                                  volume and rating by month, complaint terms, recent low ones
  ads <name> [--domain example.com]               Public ad library links for each network
  sc-ads <name> [--domain example.com] [--page-id id] [--country US] [--dry-run]
                                                  Active Meta, Google, and TikTok ads via ScrapeCreators
                                                  (needs SCRAPECREATORS_API_KEY)
  moves --moves moves.csv --traffic traffic.csv [--out moves-vs-growth.csv]
                                                  Lift per cluster of moves and leading channels
  diff --old previous.csv --new moves.csv [--out new-moves.csv]
                                                  Moves in the new log that were not in the old one

CSV columns:
  moves.csv    date,channel,kind,move,reach,link,evidence
  traffic.csv  month,visits,brand_searches   (one source for the whole series)

Output is JSON on stdout.`;

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const { pos, opts } = parseArgs(rest);
  const domain = (pos[0] || '').replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  if (['site', 'stack', 'history', 'hero', 'sitemap-growth', 'dns', 'subdomains', 'ads', 'sc-ads', 'detect', 'shopify', 'experiments', 'phones', 'filings', 'cfpb', 'fdic', 'jobs'].includes(cmd) && !pos[0]) {
    console.log(USAGE);
    process.exitCode = 1;
    return;
  }
  let result;
  switch (cmd) {
    case 'site': result = await cmdSite(domain, opts); break;
    case 'stack': result = await cmdStack(domain, opts); break;
    case 'history': result = await cmdHistory(pos[0], opts); break;
    case 'hero': result = await cmdHero(pos[0], opts); break;
    case 'sitemap-growth': result = await cmdSitemapGrowth(domain, opts); break;
    case 'dns': result = await cmdDns(domain); break;
    case 'subdomains': result = await cmdSubdomains(domain, opts); break;
    case 'ads': result = adLibraryLinks(pos[0], opts.domain); break;
    case 'sc-ads': result = await cmdScAds(pos[0], opts); break;
    case 'detect': result = await cmdDetect(domain); break;
    case 'shopify': result = await cmdShopify(domain, opts); break;
    case 'experiments': result = await cmdExperiments(domain); break;
    case 'phones': result = await cmdPhones(pos[0].startsWith('http') ? pos[0] : `https://${pos[0]}`); break;
    case 'filings': result = await cmdFilings(pos[0], opts); break;
    case 'cfpb': result = await cmdCfpb(pos[0], opts); break;
    case 'fdic': result = await cmdFdic(pos[0], opts); break;
    case 'adoption': result = await cmdAdoption(opts); break;
    case 'reviews': result = await cmdReviews(pos[0], opts); break;
    case 'jobs': result = await cmdJobs(pos[0].includes('.') ? domain : pos[0], opts); break;
    case 'moves': result = cmdMoves(opts); break;
    case 'diff': result = cmdDiff(opts); break;
    default:
      console.log(USAGE);
      if (cmd) process.exitCode = 1;
      return;
  }
  console.log(JSON.stringify(result, null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch(err => {
    console.log(JSON.stringify({ error: err.message }));
    process.exitCode = 1;
  });
}
