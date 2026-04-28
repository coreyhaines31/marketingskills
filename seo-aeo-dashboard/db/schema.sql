-- AEO + GEO Dashboard — score history schema
-- Run once against your Postgres database:
--   psql $DATABASE_URL -f db/schema.sql

CREATE TABLE IF NOT EXISTS crawl_runs (
    id          SERIAL PRIMARY KEY,
    run_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    note        TEXT
);

CREATE TABLE IF NOT EXISTS venue_scores (
    id              SERIAL PRIMARY KEY,
    crawl_run_id    INTEGER NOT NULL REFERENCES crawl_runs(id) ON DELETE CASCADE,
    slug            VARCHAR(120) NOT NULL,
    venue_name      VARCHAR(200) NOT NULL,
    region          VARCHAR(100),
    url             VARCHAR(500),

    aeo_score       NUMERIC(5,2) NOT NULL,
    geo_score       NUMERIC(5,2) NOT NULL,
    aeo_band        VARCHAR(20),
    geo_band        VARCHAR(20),

    -- AEO component scores (0-100 raw, before weighting)
    aeo_structured_data     NUMERIC(5,2),
    aeo_faq_qa_content      NUMERIC(5,2),
    aeo_heading_semantic    NUMERIC(5,2),
    aeo_internal_linking    NUMERIC(5,2),
    aeo_page_speed_proxy    NUMERIC(5,2),
    aeo_content_clarity     NUMERIC(5,2),

    -- GEO component scores
    geo_entity_clarity          NUMERIC(5,2),
    geo_content_chunking        NUMERIC(5,2),
    geo_topical_completeness    NUMERIC(5,2),
    geo_external_corroboration  NUMERIC(5,2),
    geo_structured_data_richness NUMERIC(5,2),
    geo_prompt_relevance        NUMERIC(5,2),

    crawl_errors    TEXT[],
    scored_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (crawl_run_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_venue_scores_slug    ON venue_scores(slug);
CREATE INDEX IF NOT EXISTS idx_venue_scores_run_id  ON venue_scores(crawl_run_id);
CREATE INDEX IF NOT EXISTS idx_crawl_runs_run_at    ON crawl_runs(run_at DESC);

-- Convenience view: latest score per venue
CREATE OR REPLACE VIEW latest_venue_scores AS
SELECT DISTINCT ON (vs.slug)
    vs.*,
    cr.run_at
FROM venue_scores vs
JOIN crawl_runs cr ON cr.id = vs.crawl_run_id
ORDER BY vs.slug, cr.run_at DESC;
