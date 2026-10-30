const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const SCRIPT = path.join(__dirname, '..', '..', 'skills', 'reverse-engineer-marketing', 'scripts', 'teardown.mjs');
const load = () => import(pathToFileURL(SCRIPT).href);

test('detectTools finds pixels and affiliate scripts', async () => {
  const { detectTools } = await load();
  const html = `
    <script src="https://connect.facebook.net/en_US/fbevents.js"></script><script>fbq('init','123')</script>
    <script src="https://www.googletagmanager.com/gtag/js?id=AW-123456789"></script><script>gtag('config','AW-123456789')</script>
    <script src="https://r.wdfl.co/rw.js"></script>
  `;
  const tools = detectTools(html);
  assert.ok(tools.includes('Meta Pixel'));
  assert.ok(tools.includes('Google Ads'));
  assert.ok(tools.includes('Rewardful'));
  assert.ok(!tools.includes('TikTok Pixel'));
});

test('pathFamily skips locale prefixes', async () => {
  const { pathFamily, localeOf } = await load();
  assert.equal(pathFamily('https://x.com/templates/crm'), '/templates');
  assert.equal(pathFamily('https://x.com/pt-br/templates/crm'), '/templates');
  assert.equal(pathFamily('https://x.com/'), '/');
  assert.equal(localeOf('https://x.com/de/blog/a'), 'de');
  assert.equal(localeOf('https://x.com/blog/a'), null);
});

test('parseCsv handles quotes, commas, and newlines', async () => {
  const { parseCsv, toCsv } = await load();
  const rows = parseCsv('a,b\n"x, y","say ""hi"""\n1,2\n');
  assert.deepEqual(rows, [{ a: 'x, y', b: 'say "hi"' }, { a: '1', b: '2' }]);
  assert.deepEqual(parseCsv(toCsv(rows)), rows);
});

test('analyzeMoves clusters nearby moves and scores lift', async () => {
  const { analyzeMoves } = await load();
  const traffic = ['2024-11', '2024-12', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08']
    .map((month, i) => ({ month, visits: String([90, 95, 100, 105, 110, 115, 200, 300, 330, 340][i]), brand_searches: '' }));
  const moves = [
    { date: '2025-04-20', channel: 'x', kind: 'founder-post', move: 'ARR post' },
    { date: '2025-05-10', channel: 'product-loop', kind: 'loop-first-seen', move: 'Badge' },
    { date: '2025-08-01', channel: 'ads', kind: 'ad-start', move: 'Meta ads' },
  ];
  const { clusters, top, leading } = analyzeMoves(moves, traffic);
  assert.equal(clusters.length, 2);
  assert.equal(clusters[0].moves, 'ARR post | Badge');
  assert.equal(clusters[0].visit_lift_pts, 37.8);
  assert.equal(clusters[0].brand_lift_pts, null);
  assert.equal(clusters[1].visit_lift_pts, null);
  assert.equal(top[0].cluster, 1);
  assert.ok(leading.every(l => l.note === 'too few to call'));
});

test('spearman returns 1 for monotonic series', async () => {
  const { spearman } = await load();
  assert.equal(spearman([1, 2, 3, 4], [10, 20, 30, 40]), 1);
  assert.equal(spearman([1, 2, 3, 4], [40, 30, 20, 10]), -1);
});

test('diffMoves returns only moves missing from the previous log', async () => {
  const { diffMoves } = await load();
  const old = [{ channel: 'ads', kind: 'ad-start', link: 'https://a.com/x/', move: 'Meta' }];
  const fresh = [
    { channel: 'ads', kind: 'ad-start', link: 'https://a.com/x', move: 'Meta (renamed)' },
    { channel: 'search', kind: 'page-family', link: 'https://a.com/templates', move: 'Templates' },
  ];
  assert.deepEqual(diffMoves(old, fresh).map(m => m.move), ['Templates']);
});

test('adLibraryLinks builds one link per network', async () => {
  const { adLibraryLinks } = await load();
  const links = adLibraryLinks('Acme Co', 'acme.com');
  assert.deepEqual(Object.keys(links), ['meta', 'google', 'linkedin', 'tiktok']);
  assert.match(links.meta, /q=Acme%20Co/);
  assert.match(links.google, /domain=acme\.com/);
});

test('detectDns reads mail tools, verifications, and subdomain platforms', async () => {
  const { detectDns } = await load();
  const result = detectDns({
    txt: [
      'v=spf1 include:_spf.google.com include:12345.spf04.hubspotemail.net ~all',
      'facebook-domain-verification=abc',
      'anthropic-domain-verification-x1=yes',
      'acme-tool-verification=zzz',
    ],
    mx: ['aspmx.l.google.com'],
    cnames: { 'go.acme.com': 'acme.mktoweb.com', 'docs.acme.com': 'hosting.gitbook.io', 'x.acme.com': 'unknown.example' },
  });
  assert.deepEqual(result.mail.sort(), ['Google Workspace', 'HubSpot']);
  assert.ok(result.verifications.includes('Meta Business (ads, commerce)'));
  assert.ok(result.verifications.includes('Anthropic'));
  assert.deepEqual(result.other_verifications, ['acme-tool-verification']);
  assert.equal(result.subdomains.find(s => s.subdomain === 'go.acme.com').tool, 'Marketo');
  assert.equal(result.subdomains.find(s => s.subdomain === 'x.acme.com').tool, null);
});

test('parseCertificates keeps the earliest date per subdomain and drops wildcards', async () => {
  const { parseCertificates, filterSubdomains } = await load();
  const subs = parseCertificates([
    { name_value: 'templates.acme.com\n*.acme.com', not_before: '2025-05-01T00:00:00' },
    { name_value: 'templates.acme.com', not_before: '2025-03-01T00:00:00' },
    { name_value: 'pr-123.preview.acme.com', not_before: '2025-04-01T00:00:00' },
    { name_value: 'acme.com', not_before: '2025-01-01T00:00:00' },
    { name_value: 'other.com', not_before: '2025-01-01T00:00:00' },
  ], 'acme.com');
  assert.deepEqual(subs.find(s => s.subdomain === 'templates.acme.com'), { subdomain: 'templates.acme.com', first_seen: '2025-03-01' });
  assert.ok(!subs.some(s => s.subdomain === 'acme.com' || s.subdomain === 'other.com'));
  const { subdomains, dropped } = filterSubdomains(subs, 'acme.com');
  assert.deepEqual(subdomains.map(s => s.subdomain), ['templates.acme.com']);
  assert.equal(dropped, 1);
});

test('extractHero pulls the title, meta description, and first h1', async () => {
  const { extractHero, countLocs } = await load();
  const hero = extractHero('<title>Acme &amp; Co</title><meta name="description" content="Invoices, fast"><h1 class="x">Get <b>paid</b> faster</h1><h1>Second</h1>');
  assert.deepEqual(hero, { title: 'Acme & Co', description: 'Invoices, fast', h1: 'Get paid faster' });
  assert.deepEqual(countLocs('<url><loc>https://a.com/x?a=1&amp;b=2</loc></url><url><loc> https://a.com/y </loc></url>'), ['https://a.com/x?a=1&b=2', 'https://a.com/y']);
});

test('sc-ads builds ScrapeCreators requests and sends the API key', async () => {
  const { scAdsRequests, cmdScAds } = await load();
  const reqs = scAdsRequests('Acme Co', { domain: 'acme.com' });
  assert.match(reqs.meta_companies, /search\/companies\?query=Acme\+Co/);
  assert.match(reqs.google_ads, /google\/company\/ads\?domain=acme\.com/);
  assert.match(reqs.tiktok_ads, /advertiser_name=Acme\+Co/);
  assert.match(scAdsRequests('Acme', { pageId: '42' }).meta_ads, /pageId=42&status=ACTIVE/);

  const dry = await cmdScAds('Acme', { 'dry-run': true });
  assert.equal(dry.dry_run, true);

  const calls = [];
  process.env.SCRAPECREATORS_API_KEY = 'test-key';
  const out = await cmdScAds('Acme', { domain: 'acme.com' }, async (url, init) => {
    calls.push({ url, key: init.headers['x-api-key'] });
    return { ok: !url.includes('tiktok'), status: 500, json: async () => ({ results: [] }) };
  });
  delete process.env.SCRAPECREATORS_API_KEY;
  assert.equal(calls.length, 3);
  assert.ok(calls.every(c => c.key === 'test-key'));
  assert.deepEqual(out.tiktok_ads, { error: '500' });
  assert.ok(out.next_step);
});

test('detectIndustry scores packs from scripts, page text, and schema', async () => {
  const { detectIndustry, schemaTypes } = await load();
  const html = `<script type="application/ld+json">{"@type":["Plumber","LocalBusiness"]}</script>
    <p>Free estimate. Licensed and insured. Financing available.</p><a href="tel:5551234567">Call</a>`;
  assert.deepEqual(schemaTypes(html), ['Plumber', 'LocalBusiness']);
  const packs = detectIndustry({ html, tools: ['CallRail'] });
  assert.equal(packs[0].pack, 'local-services');
  assert.ok(packs[0].reasons.includes('script: CallRail'));
  assert.ok(packs[0].reasons.includes('schema: Plumber'));
});

test('extractPhones and utmTestUrls support the call-tracking check', async () => {
  const { extractPhones, utmTestUrls } = await load();
  const phones = extractPhones('<a href="tel:+1-555-123-4567">Call</a><p>Or (555) 765-4321</p><script>var x="555-000-0000"</script>');
  assert.deepEqual(phones, ['+15551234567', '5557654321']);
  const urls = utmTestUrls('https://acme.com/hvac?x=1');
  assert.equal(urls[0].url, 'https://acme.com/hvac?x=1');
  assert.ok(urls.find(u => u.label === 'google-ads').url.includes('gclid=test'));
  assert.ok(urls.find(u => u.label === 'meta-ads').url.includes('utm_source=facebook'));
});

test('experiment config helpers read Optimizely names and GrowthBook features', async () => {
  const { optimizelyNames, growthbookKeys, summarizeGrowthbook } = await load();
  assert.deepEqual(optimizelyNames('{"experiments":[{"name":"pricing_annual_default"},{"name":"pricing_annual_default"},{"name":"hero_v2"}]}'), ['pricing_annual_default', 'hero_v2']);
  assert.deepEqual(growthbookKeys('new GrowthBook({ apiHost: "https://gb.acme.com", clientKey: "sdk-abc123XYZ" })'), { key: 'sdk-abc123XYZ', host: 'https://gb.acme.com' });
  const summary = summarizeGrowthbook({ features: { 'new-onboarding': { rules: [{ key: 'onboarding-test', variations: [true, false] }, { force: true }] }, banner: { rules: [] } } });
  assert.deepEqual(summary.features, [{ feature: 'new-onboarding', experiments: ['onboarding-test'] }, { feature: 'banner', experiments: [] }]);
  assert.equal(summarizeGrowthbook({ encryptedFeatures: 'x' }).encrypted, true);
});

test('edgarDocUrl and monthRanges build filing links and month windows', async () => {
  const { edgarDocUrl, monthRanges } = await load();
  assert.equal(edgarDocUrl('0001795586', '0001193125-26-385383', 'd948605d8k.htm'), 'https://www.sec.gov/Archives/edgar/data/1795586/000119312526385383/d948605d8k.htm');
  const ranges = monthRanges(3, new Date(Date.UTC(2026, 0, 15)));
  assert.deepEqual(ranges.map(r => r.month), ['2025-11', '2025-12', '2026-01']);
  assert.deepEqual(ranges[2], { month: '2026-01', min: '2026-01-01', max: '2026-01-31' });
});

test('detectTools ignores tools named only in page copy', async () => {
  const { detectTools, parseCsv } = await load();
  assert.deepEqual(detectTools('<p>We moved off Klarna and Toast last year. See dealer.com for more.</p>'), []);
  assert.deepEqual(detectTools('<script src="https://js.klarna.com/web-sdk/v1/klarna.js"></script>'), ['Klarna']);
  assert.deepEqual(parseCsv(''), []);
});

test('analyzeMoves treats blank cells and missing months as gaps, not zeros', async () => {
  const { analyzeMoves, fillMonths } = await load();
  const steady = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08']
    .map((month, i) => ({ month, visits: String(100 * 1.1 ** i), brand_searches: i === 3 ? '' : '50' }));
  const move = [{ date: '2025-05-01', channel: 'x', kind: 'launch', move: 'Launch' }];
  const { clusters } = analyzeMoves(move, steady);
  assert.equal(clusters[0].brand_lift_pts, null);
  assert.equal(clusters[0].visit_lift_pts, 0);
  const gappy = steady.filter(t => t.month !== '2025-04');
  assert.equal(fillMonths(gappy).length, 8);
  assert.equal(analyzeMoves(move, gappy).clusters[0].visit_lift_pts, null);
  assert.throws(() => fillMonths([{ month: '2025-01' }, { month: '2025-01' }]), /more than once/);
});

test('diffMoves keeps a second change at the same URL', async () => {
  const { diffMoves } = await load();
  const old = [{ date: '2025-08-01', channel: 'pricing', kind: 'pricing-change', link: 'https://a.com/pricing', move: '$10' }];
  const fresh = [...old, { date: '2025-10-01', channel: 'pricing', kind: 'pricing-change', link: 'https://a.com/pricing', move: '$20' }];
  assert.deepEqual(diffMoves(old, fresh).map(m => m.move), ['$20']);
});

test('CSV helpers guard formulas, carriage returns, and unclosed quotes', async () => {
  const { toCsv, parseCsv } = await load();
  assert.equal(toCsv([{ title: '=1+1', n: '-5' }]), "title,n\n'=1+1,-5\n");
  assert.deepEqual(parseCsv(toCsv([{ a: 'one\rtwo', b: 'x' }])), [{ a: 'one\rtwo', b: 'x' }]);
  assert.throws(() => parseCsv('a,b\n"open,1\n'), /unclosed quote/);
});

test('detectTools ignores JSON-LD and plain links, which detectLinkedTools reports', async () => {
  const { detectTools, detectLinkedTools } = await load();
  const html = '<script type="application/ld+json">{"description":"We moved off Klarna"}</script><a href="https://www.opentable.com/r/acme">Book</a>';
  assert.deepEqual(detectTools(html), []);
  assert.deepEqual(detectLinkedTools(html), ['OpenTable']);
});

test('subdomain helpers keep real labels and skip nested wildcards', async () => {
  const { parseCertificates, filterSubdomains } = await load();
  const subs = parseCertificates([{ name_value: '*.shop.acme.com\ndevelopers.acme.com\ntestimonials.acme.com\ndev-2.acme.com', not_before: '2025-01-01' }], 'acme.com');
  assert.ok(!subs.some(s => s.subdomain === 'shop.acme.com'));
  const { subdomains, dropped } = filterSubdomains(subs, 'acme.com');
  assert.deepEqual(subdomains.map(s => s.subdomain).sort(), ['developers.acme.com', 'testimonials.acme.com']);
  assert.equal(dropped, 1);
});

test('extractHero keeps apostrophes, extractPhones survives bad escapes, posInt rejects bad values', async () => {
  const { extractHero, extractPhones, posInt } = await load();
  assert.equal(extractHero(`<meta name="description" content="We're fast">`).description, "We're fast");
  assert.deepEqual(extractPhones('<a href="tel:555%">x</a>'), ['555']);
  assert.equal(posInt(undefined, 24, 'months'), 24);
  assert.equal(posInt('6', 24, 'months'), 6);
  for (const bad of ['0', '-1', 'abc', true]) assert.throws(() => posInt(bad, 24, 'months'), /whole number/);
});

test('atsFromHtml finds Greenhouse, Lever, and Ashby boards', async () => {
  const { atsFromHtml } = await load();
  const html = `
    <a href="https://boards.greenhouse.io/acme">Jobs</a>
    <script src="https://boards.greenhouse.io/embed/job_board/js?for=acmeco"></script>
    <a href="https://jobs.lever.co/acme-inc/123">Role</a>
    <a href="https://jobs.ashbyhq.com/acme">Careers</a>
  `;
  assert.deepEqual(atsFromHtml(html).map(b => `${b.ats}/${b.slug}`).sort(), ['ashby/acme', 'greenhouse/acme', 'greenhouse/acmeco', 'lever/acme-inc']);
});

test('normalizeJobs reads each ATS shape', async () => {
  const { normalizeJobs } = await load();
  const gh = normalizeJobs('greenhouse', { jobs: [{ id: 1, title: 'SEO Lead', departments: [{ name: 'Marketing' }], location: { name: 'Remote' }, first_published: '2026-10-01T10:00:00-04:00', absolute_url: 'u', content: '&lt;p&gt;Own &amp;amp; grow&lt;/p&gt;' }] });
  assert.equal(gh[0].posted, '2026-10-01');
  assert.equal(gh[0].text, 'Own & grow');
  const lever = normalizeJobs('lever', [{ id: 'a', text: 'AE', categories: { team: 'Sales', location: 'NYC' }, createdAt: Date.UTC(2026, 8, 5), hostedUrl: 'u', descriptionPlain: 'Sell', lists: [{ text: 'You', content: '<li>Close</li>' }] }]);
  assert.equal(lever[0].posted, '2026-09-05');
  assert.equal(lever[0].department, 'Sales');
  assert.match(lever[0].text, /Close/);
  const ashby = normalizeJobs('ashby', { jobs: [{ id: 'x', title: 'Hidden', isListed: false }, { id: 'y', title: 'PMM', team: 'Marketing', publishedAt: '2026-07-01T00:00:00Z', descriptionPlain: 'Launch' }] });
  assert.equal(ashby.length, 1);
  assert.equal(ashby[0].department, 'Marketing');
});

test('jobFunction separates look-alike titles', async () => {
  const { jobFunction } = await load();
  assert.equal(jobFunction('Sales Engineer'), 'sales');
  assert.equal(jobFunction('Developer Advocate'), 'marketing');
  assert.equal(jobFunction('Product Designer, Marketplace'), 'design');
  assert.equal(jobFunction('Software Engineer, CDN Content'), 'engineering');
  assert.equal(jobFunction('Content Marketing Manager'), 'marketing');
  assert.equal(jobFunction('Deal Desk Analyst'), 'operations');
  assert.equal(jobFunction('Specialist', 'Customer Success'), 'customer');
});

test('summarizeJobs counts channels, tools in context, languages, and first hires', async () => {
  const { summarizeJobs, toolsInText } = await load();
  assert.deepEqual(toolsInText('Use Salesforce, Outreach, and Gong daily'), ['Salesforce', 'Outreach', 'Gong']);
  assert.deepEqual(toolsInText('Outreach to customers and segment them. Adjust plans.'), []);
  const jobs = [
    { title: 'Head of SEO', department: 'Marketing', location: 'Remote', posted: '2026-10-20', url: 'a', text: 'Our first marketing hire for search. Fluent in German. Semrush and Ahrefs.' },
    { title: 'Lifecycle Marketing Manager', department: 'Marketing', location: 'Berlin', posted: '2026-08-01', url: 'b', text: 'Braze and Segment, HubSpot.' },
    { title: 'Backend Engineer', department: 'Engineering', location: 'Remote', posted: '2026-10-25', url: 'c', text: 'Go and Postgres' },
  ];
  const s = summarizeJobs(jobs, new Date('2026-10-30T00:00:00Z'));
  assert.equal(s.total, 3);
  assert.equal(s.new_last_30_days, 2);
  assert.deepEqual(s.by_function, { marketing: 2, engineering: 1 });
  assert.deepEqual(s.marketing_channels, { seo: 1, lifecycle: 1 });
  assert.deepEqual(s.first_hire_signals, ['Head of SEO']);
  assert.deepEqual(s.languages, { german: 1 });
  assert.deepEqual(s.tools_mentioned.map(t => t.tool).sort(), ['Ahrefs', 'Braze', 'HubSpot', 'Segment', 'Semrush']);
  assert.deepEqual(s.posted_by_month, { '2026-08': 1, '2026-10': 2 });
});
