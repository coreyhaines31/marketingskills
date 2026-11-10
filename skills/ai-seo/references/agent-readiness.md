# Agent Readiness — Can an Agent Reach, Navigate, and Parse Your Site?

AI visibility work splits into two layers: what your content says (the rest of this skill) and whether an agent can *get to it at all*. This reference covers the second layer — the access/discovery/parseability audit — plus the emerging shift from agent-*readable* to agent-*actionable* sites.

Two free scoring tools shipped in August 2026 and turned this into a measurable discipline:

| Tool | Run it | Method |
|---|---|---|
| **Is Agentic** (Vercel + Ora) | `npx is-agentic yourdomain.com` or [is-agentic.com](https://is-agentic.com) | 100+ checks; Essential checks carry most of the score; Recommended checks activate only when evidence shows you have that surface (API, MCP server, commerce); not-applicable checks are excluded, not failed; includes an observed agent journey showing where a real agent hit friction |
| **Frase Agent Readiness Checker** | [frase.io/tools/agent-readiness](https://www.frase.io/tools/agent-readiness) | Access / Discovery / Parseability triad; 80+ = agents can reliably use the site, 60–79 = solid with gaps, <60 = real access problems |

For developer documentation specifically, Fern's **Agent Score** grades a docs site for coding agents (run `npx afdocs check <docs-url>` locally first, or score it at buildwithfern.com/agent-score for a public report page).

Run one before and after any agent-readiness work — the score is a shareable artifact and the failed checks are your worklist. (All of these are vendor tools with a product behind them; the *checks* are the value, not the pitch.)

## The AgentReady standard

[AgentReady.org](https://agentready.org) (launched October 21, 2026) is an open spec for what a product should implement to be usable by agents. Ora leads it with a group of collaborators that includes Vercel, Stripe, and Google (current list on the site). It orders practices the way agents meet a site — **find → read → act** — and gives each a stable ID and a strength:

- **MUST** — agents failed without it in the studies. Only three: allow agents through robots.txt and bot protection (AR-FIND-01), put the answer in the initial HTML (AR-READ-01), return real HTTP status codes (AR-READ-02) — plus, *if the product should complete tasks*, an MCP server or CLI (AR-ACT-10).
- **SHOULD** — measurably shaped where agents went (first-party docs, sitemap, homepage links, llms.txt, JSON-LD, fenced code, pricing as text, auth, OpenAPI).
- **MAY** — emerging conventions (Markdown mirrors, AI Catalog).

Cite the IDs in audit findings ("fails AR-READ-01") so fixes map to a public spec rather than your opinion. In October 2026, only about 6% of sites Ora scanned graded B or above, so most sites have real gaps (live figures on the site).

**Why it matters (Ora research, "AX is the New AEO," arXiv:2609.34951, September 2026 — vendor research with a public dataset):**

- When an agent can't read the site, it answers anyway (~99% of dead-end journeys) from web search and other people's pages. Those answers were **3.7× as likely to contain none of the facts asked for**.
- Agent-ready businesses were **clearly recommended 1.9× as often** (20% vs 11%), matched on brand fame and third-party citations.
- **Pricing accuracy was 60% from the site's own pages vs 37% from elsewhere** — the widest gap of any question type. Agents that couldn't read the site punted to "contact sales" more often (22% vs 15%).
- 82% of answers traced to a page the agent fetched; that page was a **docs page 47% of the time** and llms.txt 14%.
- Agents use the same pages people do: docs reached in 83% of runs, homepage 69% (the first fetch 92% of the time), then a cliff — `.well-known/*` 23%, `openapi.json` 21% where shipped, `sitemap.xml` 4%.

Per the skill's evidence order, treat these as observational data from a party with a scanner to sell, not a forecast for any one site.

## The three questions

### 1. Access — can an agent get to the page and see real content?

- **Core content in the initial HTML response.** Most agents never execute JavaScript. If the content only exists after client-side rendering, it doesn't exist. This is the #1 essential check in both tools.
- **No bot challenge or firewall block** on the intended discovery path. Blocking `OAI-SearchBot`, `PerplexityBot`, or `Claude-SearchBot` may reduce search visibility. Blocking model-development crawlers such as `GPTBot` or `ClaudeBot` can be an intentional training opt-out and is not, by itself, a visibility failure. Audit what your CDN/WAF actually does to each user agent — many sites block them by default without anyone deciding to. Bot protection is a **separate gate from robots.txt**: a WAF that answers agents with a 403 or a challenge page blocks them however permissive the file is. Let verified agents through by the providers' published IP ranges or Web Bot Auth signatures. In Ora's studies, a bot block was one of only two changes that broke agents outright (the other was a JS-only answer); not-agent-ready sites blocked agents 2.1× as often.
- **Correct HTTP behavior**: real status codes, stable canonical URLs, recoverable errors. Return a 404 (or a redirect) for missing paths — a single-page app that returns 200 for every path makes dead URLs look live to an agent. When throttling, send a **429 with `Retry-After`** instead of a challenge page; agents treat 429 as "back off and return."
- **Pricing as text on a first-party page** — plans, free tier, and limits in the HTML, not an image, a calculator, or a sales form (the accuracy gap above).

### 2. Discovery — do your files tell agents what's here?

- **robots.txt with a deliberate AI-crawler stance.** AgentReady's default is one wildcard rule (`User-agent: *`) that allows agents, rather than an allowlist of named crawlers — an allowlist silently excludes agent search APIs (Exa, Tavily, Brave, Parallel) that run their own crawlers. Add named groups only for deliberate exceptions, such as blocking training crawlers (`GPTBot`, `ClaudeBot`) while leaving search (`OAI-SearchBot`, `Claude-SearchBot`) and user-triggered fetchers (`ChatGPT-User`, `Claude-User`) on the wildcard. Two catches: a named group like `User-agent: GPTBot` *replaces* your `*` rules for that bot, so audit existing groups; and user-triggered fetchers may not consult robots.txt at all. See the bot-access guidance in SKILL.md.
- **First-party docs that answer.** Docs were the most-read and most-cited page type in Ora's runs. Put setup, quickstart, and pricing answers on canonical, current docs pages and link them from the homepage.
- **A sitemap that loads and parses cleanly.** Standard for crawlers and search engines, even though agents fetch it directly in only ~4% of runs.
- **Link every discovery file from pages agents already read.** 86–100% of visits to llms.txt, `openapi.json`, `.well-known/*`, and AGENTS.md arrived through a link, not a guessed path. Put them in the footer, a resources section, or `<link>` tags in the homepage head. A file nothing points to is a file nothing fetches.
- **llms.txt at the domain root** (see Machine-Readable Files in SKILL.md).
- **`llms-full.txt`** — the newer companion: your entire site content in one file, so an agent gets everything in a single request instead of crawling. Emerging, cheap to generate alongside llms.txt, and scored as bonus signal by both tools.
- **robots.txt content-usage statements** — an emerging convention for declaring what AI may do with your content (train / cite / summarize), so the answer comes from you instead of being assumed.
- **AI Catalog** (MAY, unmeasured) — a JSON manifest at `/.well-known/ai-catalog.json` listing every agent-facing resource you ship (MCP server card, OpenAPI, A2A agent card, docs, llms.txt, skills), linked from the homepage head with `<link rel="ai-catalog" href="/.well-known/ai-catalog.json">`. Registries index published catalogs so agents can search across sites. Cheap to add once you have more than one agent surface.

### 3. Parseability — once there, can the agent tell what the page is?

- **Valid, substantive structured data** (JSON-LD — see the `schema` skill). Most agents read a page's text, not its `<script>` blocks, and Markdown converters may drop them — so **repeat every critical fact as visible text**. A price that exists only in JSON-LD or a hydration payload (e.g. the annual price behind a pricing toggle) goes unseen.
- **Fenced, language-tagged code blocks.** When an agent's answer included code, 61% of the time it lifted lines verbatim from a page on the site.
- **A Markdown representation of the page** (MAY). Agents requested Markdown on ~65% of web fetches, but format did **not** change task success in Ora's controlled experiment — nor did content negotiation or agent detection. Make the HTML work first; add a mirror second. Two implementations:
  - **Content negotiation**: serve compact Markdown at the *same canonical URL* when the request asks for `Accept: text/markdown`, with a `Vary` header keeping the HTML and Markdown cache entries separate. (This is how Is Agentic serves its own reports — agents get Markdown, browsers get HTML, one URL.)
  - **Link header or tag**: an HTTP `Link` header, or `<link rel="alternate" type="text/markdown" href="/page.md">` in the head, pointing to a parallel Markdown version — discoverable without guessing URLs.
- Clear document structure — one H1, headings that answer sub-questions, extractable answer blocks (the content-patterns reference).

## Emerging: agent-actionable, not just agent-readable

Reading is close to solved: in Ora's April 2026 scan, 80% of sites were reachable to every major AI crawler, but only 3% shipped a spec-grade MCP server, and OAuth metadata checks passed on ~1%. AgentReady's act tier applies when the product should *complete* a task, not just be read about:

- **An MCP server or a CLI** (AR-ACT-10, MUST for acting) — the interface an agent acts through. MCP for agents in chat and IDE hosts, a CLI for agents in a shell. Ship the one that fits how the product is used; don't ship an empty surface to tick the box.
- **Auth an agent can finish** (AR-ACT-01) — self-serve API keys with documented scopes; for user-delegated access, OAuth 2.0 with discoverable metadata under `/.well-known` (RFC 8414, RFC 9728).
- **A public API with OpenAPI** (AR-ACT-02) — operation IDs, typed responses and errors, documented rate limits.

The next race is whether an agent can *act* on your site — fill the form, book the meeting, start the trial. **WebMCP** is the emerging standard here: a page declares its forms and CTAs as callable tools with input schemas, so an agent doesn't have to reverse-engineer your UI. Early days (label: emerging, not yet a ranking/citation signal), but the direction is clear — if agents are becoming buyers, the site that exposes "start trial" as a structured action wins the agent-mediated conversion that a pretty button loses.

Practical today: make sure your highest-intent actions (signup, pricing, demo booking, contact) work without JavaScript-only flows, have labeled semantic form fields, and return machine-readable confirmation.

**Ways to add WebMCP** (all early; confirm browser and assistant support before promising anything):
- **Implement it yourself.** Follow the WebMCP draft to declare each action as a tool with an input schema, wired to the form or API the page already uses. Keep the tool list short (the 2–4 highest-intent actions) and reuse existing validation, spam protection, and permissions rather than building a parallel path.
- **Use your platform's support, if it has any.** Some site platforms and agent workflows add WebMCP for you. Ploy ◆, for example, has a Ploybook that inspects the site, defines tool contracts, implements them against existing form logic, and validates them. It's a guided workflow, not a hosted MCP server. ◆ marks a [Verified Partner](https://github.com/coreyhaines31/marketingskills/blob/main/tools/REGISTRY.md#verified-partners) of this repository (disclosure, not endorsement); name an alternative alongside it when you mention it.
- **Have a coding agent do it** in the site's repo, with the same scoping: a few actions, existing logic, a test for each.

Whichever path, test that each tool rejects bad input, that submissions land where the normal form's do (CRM, inbox, conversion tracking), and that nothing bypasses consent or rate limits.

### Ship a skill file for your product

A lighter act surface than MCP or WebMCP: a public `SKILL.md` (linked from llms.txt and your docs) that a user loads into their own Claude Code or Cursor session. `llms.txt` tells an agent what you are; a skill file tells it how to buy or set up your product for this user, and it runs where the user's context already is.

**Case: LinkDR (October 2026).** The backlink marketplace's `linkdr.com/SKILL.md` has the agent inspect the user's site, propose the target page and anchor text, price the order from a published table, and return one checkout link. The founder described it as a sales funnel running inside the buyer's agent. The pattern is the point; the numbers are theirs.

What to put in it:
- **Use the context the agent already has.** Onboarding stalls where the buyer must make a decision they can't make yet (which URL, which plan, which integration). Tell the agent to read the user's repo or site and propose an answer with its reasoning, then let the user confirm.
- **Pricing as text in the file** — the full table and any volume or annual rules, so the agent quotes exact numbers instead of guessing.
- **A prefilled checkout or signup URL.** Once the user agrees, the agent packs the choices into query parameters (`/agent/checkout?plan=pro&seats=5&billing=annual`) and hands back one link. No auth, API keys, or MCP install. Recompute the price on the server and never trust an amount in the URL; validate every parameter; add a source parameter so agent-built orders show up in conversion tracking.
- **An offer for ordering through an agent is fine when it's stated as information** ("code AGENT50 takes $50 off"). The agent shows it; the user decides.
- **Test with the agents your buyers use.** Run the file in a few fresh sessions and check that the agent proposes sensible defaults, quotes the right prices, and builds a valid URL.

**Don't make it coercive.** Instructions that force an upsell on every user, or that are tuned until the agent always pushes your offer regardless of the user's goal, are the manipulation [agent-defaults.md](agent-defaults.md) warns about: agent platforms treat them as prompt injection, and users who notice stop trusting the tool. Recommend the option that fits the user's stated goal and budget, mention one larger option only when it serves that goal, and let the user say no.

For products an agent installs mid-task (developer tools, APIs, infrastructure), the next step past acting on your site is being the vendor the agent picks in the first place. See [agent-defaults.md](agent-defaults.md).

## Citation-source volatility (why you diversify)

Third-party citation mixes are **not stable** — they shift overnight with model and retrieval updates, and August 2026 provided the case study: **ChatGPT's query fan-out changes nearly wiped Reddit as a citation source** within days (practitioner-reported by multiple AEO teams; one had been earning 24-hour citations from Reddit at 1M+ impressions/month before the change). Meanwhile the same practitioners report **business-owned websites dominate Gemini citations (~60%)**.

LinkedIn moved in the same update: ChatGPT's LinkedIn citations fell ~36% in mid-August 2026, and its citations of Pulse articles fell ~86% from May to Oct while citations of feed posts rose. Perplexity and Copilot moved the other way. See [linkedin-ai-citations.md](linkedin-ai-citations.md).

What this means for strategy:

- **Never concentrate AI-visibility work in one third-party surface.** The Presence pillar's list (Wikipedia, Reddit, YouTube, podcasts, review sites, Quora) is a portfolio, not a menu to pick one from. A surface that's 2% of citations today can be 0% after one retrieval update — or vice versa.
- **Owned-site fundamentals hedge the volatility.** Platform deals and retrieval changes reshuffle third-party sources; your own agent-readable site is the one surface no platform can drop you from — and on Gemini it's already the dominant citation class.
- **Treat any citation-share statistic as dated.** The "Reddit = 1.8% of ChatGPT citations" class of stats (including the ones in this skill) are snapshots — check the date, and verify against your own citation monitoring (the DIY monitoring loop in SKILL.md) before betting budget on them.
- **Speed is real**: fresh content on retrieved surfaces can be cited within ~24 hours. AI search rewards freshness faster than classic SEO ever did.

---

*Agent-readiness check taxonomy distilled from Vercel/Ora's Is Agentic (is-agentic.com) and Frase's Agent Readiness Checker (both August 2026, credited); AgentReady practice IDs, strengths, and study figures from agentready.org and Ora's research (October 2026, credited — vendor-run, dataset public at github.com/ora/research); citation-volatility events practitioner-reported (Ashni of Hype Partners (@ashnichrist) and others, August 2026) — labeled accordingly, verify against your own monitoring.*
