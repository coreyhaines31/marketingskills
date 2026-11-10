# Multilingual AEO and AI Shopping Surfaces

Two extensions of the core workflow that fail in predictable ways: translating an English AEO plan into other markets, and investing in AI shopping surfaces for products those surfaces rarely show.

## Multilingual and multi-market AEO

The language of the query changes which sources get cited. Profound's analysis of 3.25 billion citations across seven models and 14 countries, using native-language prompts, found citation mix and social-source rates shifted materially with query language (Profound, April 2026). Spanish-language markets looked alike across countries, so language sometimes mattered more than geography. Platforms diverged too: Google AI Overviews drew on a varied set of local social sources, while ChatGPT's social citations stayed concentrated on Reddit. Profound sells AI visibility tracking; treat these as vendor research and validate in your own category.

### Checklist

1. **Treat language and country as separate dimensions.** Spanish in Mexico, Spanish in Spain, and English in Mexico are three configurations.
2. **Build prompts from native-language demand.** Use local customer research, local search terms, and native speakers. Don't translate the English prompt list word for word; category names, units, and decision criteria differ.
3. **Run each prompt on each target engine** and classify cited sources: owned, competitor, earned editorial, institutional, social, marketplace or directory (taxonomy in [citations-vs-recommendations.md](citations-vs-recommendations.md)).
4. **Find the local source market.** Note which local publishers, directories, review sites, communities, and authorities recur per engine. Don't assume Reddit, YouTube, LinkedIn, or a global publisher matters equally everywhere.
5. **Audit local facts.** Prices and currency, availability, policies, legal claims, support hours, and local entities. A wrong local price is a critical error (see [answer-accuracy.md](answer-accuracy.md)).
6. **Separate three gap types.** A translation gap means the page exists but not in this language. An information gap means the fact doesn't exist anywhere locally. An entity gap means local profiles describe you inconsistently.
7. **Recommend local channels only where the local citation mix supports them.**
8. **Assign native-language review and a freshness owner** for every localized page.
9. **Report each language, country, and engine separately** before rolling anything up.

## AI shopping surfaces

AI shopping features (ChatGPT Shopping, product results in Google AI Mode, Meta's Muse agent, and similar) are worth investing in only for categories they actually show. In Profound's tests, product category was a stronger trigger for ChatGPT Shopping than purchase-intent wording: physical consumer products activated it far more often than software, services, travel, or financial products (Profound, March 2026; observational, and OpenAI hasn't published the trigger rules). Verify current merchant and feed requirements in each platform's documentation.

### Fit check first

Classify the offering before auditing anything:

| Offering | Typical fit |
|---|---|
| Shippable consumer product, consumables | Strong; audit in full |
| Large equipment or vehicles | Test narrowly |
| Software, digital products, services, travel, financial products | Usually weak; put the effort into ordinary AI recommendations instead |
| Local-only offerings | Focus on local surfaces and Business Profile |

Then test with repeated representative prompts. Cards and offers vary between runs, so one carousel is not a ranking.

### Data audit (when the fit is real)

- Canonical title and description, brand, and identifiers (GTIN, MPN)
- Category, attributes, variants, sizes, colors, and compatibility
- Images
- Price, currency, sale status, and availability, with how fast changes propagate
- Shipping, returns, and merchant policies
- Reviews and ratings from real customers

Agents that buy can also draw on commerce catalogs directly. Muse, for example, searches the Shopify product catalog, so a Shopify merchant's catalog data is part of the audit.

Compare the feed, product page, structured data, merchant records, and marketplace listings for conflicts. Fix wrong data before any editorial work. Track three outcomes separately: whether the product is included, whether you are the headline merchant or offer, and whether you appear among all offers.

Never fabricate reviews, ratings, availability, or discounts. For the agent-side protocols (Merchant Center, UCP), see the Agentic Experiences section in SKILL.md.

---

*Framework lineage: the market checklist and commerce fit check adapted (re-expressed and restructured) from Profound's MIT-licensed international-aeo-strategist and ai-commerce-readiness-auditor skills and their studies (March and April 2026), credited.*
