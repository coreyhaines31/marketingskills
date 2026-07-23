# Attribution by Business Type

Attribution defaults differ sharply by business model. The same "which channel drives revenue?" question wants a different source of truth, model, and paradigm depending on how long your cycle is, how many people are involved, and where your budget goes. Two playbooks: B2B SaaS and Ecommerce/DTC. Match the user's product to one (or blend, for PLG-with-sales).

---

## B2B SaaS (long cycle, sales-assisted)

**Shape of the problem:** journeys run weeks to months, span multiple people (champion, economic buyer, users), and include touches that never appear in web analytics — a conference conversation, a sales call, a Slack-community mention, a peer recommendation. Deal values are high and volume is low, so every deal matters and averages are noisy.

**Why single-touch models mislead badly here:** with 15 touches over 3 months across 4 people, "last-touch = direct" and "first-touch = one LinkedIn ad" are both almost useless. The middle — and the offline — is where the deal was actually won.

### The B2B playbook

1. **Source of truth = the CRM**, not any analytics tool. Revenue is real in the CRM (closed-won, ARR); everything else explains where those deals came from. Pipeline and revenue attribution live in **revops** — attribution feeds it the "source" dimension.
2. **Models: first-touch + position-based, shown together.** First-touch values demand creation (which channel *started* the accounts that became pipeline). Position-based credits the created-and-closed bookends, the two decisions you actually make. Last-touch alone will defund your top of funnel — don't lead with it.
3. **Self-reported attribution is your strongest signal, not a nice-to-have.** Ask "How did you first hear about us?" on the **demo request / signup form** and again qualitatively on sales calls. For high word-of-mouth and dark-social-heavy B2B, this catches what tracking structurally can't (podcasts, communities, "my old coworker used you"). Weight it heavily.
4. **Attribute to pipeline stages, not just the conversion.** The useful B2B question isn't "what drove the form fill" — it's "what drove *qualified pipeline* and *closed revenue*." Break down MQL→SQL→closed-won by first-touch channel; a channel that fills forms but never closes is a trap. (Stage mechanics → revops.)
5. **MTA is weakest here; incrementality is awkward but valuable.** Low volume makes data-driven attribution unreliable and geo-tests hard. Use **on/off tests** for big-ticket programs (turn off a channel for a quarter, watch pipeline) and lean on self-reported + first-touch for the rest.
6. **Account-level, not just lead-level.** Attribution should roll touches up to the *account* (all the people at the buying company), or you'll credit whichever individual happened to fill the form. In practice one org is several people signing up with **mixed work *and* personal emails**, so person-level attribution scatters the story across records — match contacts to the account (email domain, enrichment, or your CRM's contact→account link) and attribute at the **account** level. That's where the signal has to land to be useful to a rep working the whole buying committee. Exclude free-mail domains (gmail/yahoo/outlook) from domain matching — they can't identify a company; fall back to enrichment or manual matching for personal-email signups. *(Production emphasis from Tessa Kriesel; the CRM-sync mechanics live in `first-party-tracking.md` Step 5.)*

**Tooling:** CRM (HubSpot/Salesforce) as truth; a product-analytics tool identifying by user/account UUID for first-party first-touch (see `first-party-tracking.md`); self-reported fields written to the CRM; RB2B-style de-anonymization to catch un-formed account visits.

**The B2B trap to name for the user:** branded search and direct will look like your best "channels" because that's where researched buyers convert. They're not channels — they're where demand *created elsewhere* cashes out. Segment branded vs. non-branded search and treat a big direct share as evidence your top-of-funnel is working, not as a channel to invest in.

---

## Ecommerce / DTC (short cycle, self-serve)

**Shape of the problem:** journeys are fast (minutes to a few days), high-volume, and almost entirely digital and self-serve. Budget concentrates in paid social + paid search + email/SMS. The conversion is a purchase you fully control (your checkout or a hosted one). The dominant lie is **platform over-attribution** — Meta and Google each claiming the same sales.

### The DTC playbook

1. **Source of truth = your store/backend** (Shopify, your payments system) — the count of actual orders. Platform-reported conversions get de-duped *against* that total; they never define it and are never summed.
2. **Distrust platform ROAS by default.** Post-iOS ATT, platforms model and estimate conversions, count view-through, and use generous windows — reported ROAS runs well above incremental ROAS. Use it for in-platform optimization (it's fine for the algorithm) but not for cross-channel budget truth.
3. **Last-touch is defensible for quick-turn, impulse SKUs** — the closing click really is most of the story for a $30 impulse buy. It gets dangerous as consideration lengthens (higher AOV, considered purchases), where it over-credits retargeting and branded search.
4. **MMM once spend is material.** When you're spending real money across paid social, search, and offline (podcasts, TV, influencers, OOH), MMM is how you allocate — it's the only paradigm that sees the untrackable channels and the saturation curves. Below ~six figures/month of blended spend, MMM is overkill; good UTMs + a survey do more.
5. **Incrementality on your biggest channels — especially the "always credited" ones.** Geo-holdouts and on/off tests earn their keep on retargeting, branded search, and Meta prospecting, which platform reporting flatters most. Incremental CPA (spend ÷ *incremental* orders) is the number that should move budget. (See `measurement-paradigms.md`.)
6. **Post-purchase survey to catch the dark-social + brand demand.** A one-question "How did you hear about us?" on the order-confirmation page consistently reveals that podcasts, TikTok organic, and word-of-mouth drive far more than pixels credit — because those touches convert later as "direct" or branded search. Kickstarter-era DTC brands run this as standard for exactly this reason.

**Tooling:** store/backend as truth; platform pixels + CAPI for optimization (setup → ads `conversion-tracking.md`); Supermetrics/Coupler to pull platform numbers into one place for de-duping; a post-purchase survey app; MMM tooling (Robyn/Meridian or a vendor) once spend justifies it.

**The DTC trap to name for the user:** summing platform-reported conversions. If Meta claims 100 and Google claims 80 but you had 120 orders, you do **not** have 180 conversions — you have 120 with overlapping claims. Anchor on the 120 and allocate the overlap with incrementality, not by trusting whichever platform shouts loudest.

---

## Blended / PLG-with-sales

Many modern SaaS businesses are both: self-serve signups *and* a sales-assisted motion for larger accounts. Blend the playbooks:

- Use the **DTC approach for the self-serve funnel** (fast, high-volume, first-party first-touch → conversion, defensible last-non-direct + survey).
- Use the **B2B approach for the sales-assisted funnel** (CRM as truth, position-based, pipeline-stage attribution, self-reported at demo).
- **Alias identities across the two** so a self-serve signup who later becomes a sales-assisted expansion keeps one journey (email↔UUID alias at signup — see `first-party-tracking.md`).
- Report them **separately.** Blending a $50 self-serve signup and a $50k enterprise deal into one "attribution" number hides both stories.
