# AEO + GEO Dashboard for UK Music Venues

Prototype scoring system and dashboard for measuring **Answer Engine Optimisation (AEO)** and **Generative Engine Optimisation (GEO)** readiness across a portfolio of 20 UK music venues.

## Project structure

```
seo-aeo-dashboard/
├── crawler/              # Python: async fetcher + HTML signal extractor
│   ├── venues.py         # Normalised venue list (URLs, regions, sub-pages)
│   ├── crawler.py        # httpx-based async crawler
│   ├── extractor.py      # BeautifulSoup signal extraction → PageSignals
│   └── requirements.txt
├── scoring/              # Python: weighted scoring engine
│   ├── weights.py        # AEO/GEO component weights
│   ├── aeo_scorer.py     # 6 AEO components → 0–100
│   ├── geo_scorer.py     # 6 GEO components → 0–100
│   └── report_generator.py
├── pipeline.py           # CLI: crawl → score → write data/venues.json
├── generate_sample_data.py  # Generates sample data without live crawl
├── data/
│   └── venues_sample.json   # Pre-generated reports (3 representative venues)
└── dashboard/            # Next.js 14 + Tailwind + Recharts
    └── src/app/          # /, /venue/[slug]
```

## Scoring model

### AEO (Answer Engine Optimisation) — 0–100

| Component | Weight |
|-----------|--------|
| Structured Data (schema.org) | 20% |
| FAQ / Q&A content | 15% |
| Headings & semantic structure | 15% |
| Internal linking | 10% |
| Page speed (proxy) | 10% |
| Content clarity | 30% |

### GEO (Generative Engine Optimisation) — 0–100

| Component | Weight |
|-----------|--------|
| Entity clarity | 20% |
| Content chunking | 15% |
| Topical completeness | 20% |
| External corroboration | 10% |
| Structured data richness | 15% |
| Prompt relevance | 20% |

## Running it

### Live crawl + score (full pipeline)

```bash
cd seo-aeo-dashboard
python -m venv .venv && source .venv/bin/activate
pip install -r crawler/requirements.txt

python pipeline.py                    # All 20 venues
python pipeline.py --slug o2-academy-brixton   # Single venue
python pipeline.py --dry-run          # List venues without crawling
```

Output: `data/venues.json`

### Sample data (no network)

```bash
python generate_sample_data.py
```

Generates `data/venues_sample.json` from hardcoded profiles run through the live scoring engine.

### Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Implementation chunks

- [x] **Chunk 1** — Scaffold + crawler + scoring engine + sample JSON
- [x] **Chunk 1** — Next.js dashboard (overview + venue detail)
- [ ] **Chunk 2** — Live crawl run against all 20 venues, replace `venues_sample.json`
- [ ] **Chunk 3** — Score history persistence (Postgres) + trend charts
- [ ] **Chunk 4** — LLM simulation: feed venue content + prompts to GPT/Claude/Gemini, measure citation rate
- [ ] **Chunk 5** — Competitor benchmarking against non-O2 UK venues

## Output JSON schema

Each venue report:

```ts
{
  venue_name: string;
  slug: string;
  url: string;
  region: string;
  geo_score: number;       // 0–100
  aeo_score: number;       // 0–100
  geo_band: "critical" | "weak" | "moderate" | "good" | "strong";
  aeo_band: ...;
  geo_components: { [k]: { score, weighted, findings: string[] } };
  aeo_components: { ... };
  summary: string;
  strengths: string[];
  weaknesses: string[];
  quick_wins: string[];
  priority_fixes: string[];
  schema_recommendations: string[];
  content_recommendations: string[];
  internal_linking_recommendations: string[];
  crawl_errors: string[];
}
```
