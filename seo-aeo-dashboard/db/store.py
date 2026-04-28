"""
Postgres persistence layer for AEO/GEO scores.

Requires DATABASE_URL env var, e.g.:
    export DATABASE_URL="postgresql://user:pass@localhost:5432/aeo_dashboard"

Install: pip install psycopg2-binary
"""

import os
import json
from datetime import datetime, timezone
from typing import Optional

try:
    import psycopg2
    import psycopg2.extras
    _PSYCOPG2_AVAILABLE = True
except ImportError:
    _PSYCOPG2_AVAILABLE = False


def _get_connection():
    url = os.environ.get("DATABASE_URL")
    if not url:
        raise EnvironmentError("DATABASE_URL environment variable is not set")
    if not _PSYCOPG2_AVAILABLE:
        raise ImportError("psycopg2-binary is required: pip install psycopg2-binary")
    return psycopg2.connect(url)


def create_run(note: Optional[str] = None) -> int:
    """Insert a new crawl_run row and return its id."""
    conn = _get_connection()
    try:
        with conn, conn.cursor() as cur:
            cur.execute(
                "INSERT INTO crawl_runs (note) VALUES (%s) RETURNING id",
                (note,)
            )
            return cur.fetchone()[0]
    finally:
        conn.close()


def store_report(report: dict, run_id: int) -> None:
    """Persist a single venue report into venue_scores."""
    def _comp(report, engine, key):
        comps = report.get(f"{engine}_components", {})
        c = comps.get(key, {})
        return c.get("score")

    conn = _get_connection()
    try:
        with conn, conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO venue_scores (
                    crawl_run_id, slug, venue_name, region, url,
                    aeo_score, geo_score, aeo_band, geo_band,
                    aeo_structured_data, aeo_faq_qa_content, aeo_heading_semantic,
                    aeo_internal_linking, aeo_page_speed_proxy, aeo_content_clarity,
                    geo_entity_clarity, geo_content_chunking, geo_topical_completeness,
                    geo_external_corroboration, geo_structured_data_richness, geo_prompt_relevance,
                    crawl_errors
                ) VALUES (
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s,
                    %s, %s, %s, %s, %s, %s,
                    %s
                )
                ON CONFLICT (crawl_run_id, slug) DO UPDATE SET
                    aeo_score = EXCLUDED.aeo_score,
                    geo_score = EXCLUDED.geo_score,
                    aeo_band  = EXCLUDED.aeo_band,
                    geo_band  = EXCLUDED.geo_band
                """,
                (
                    run_id,
                    report["slug"], report["venue_name"],
                    report.get("region"), report.get("url"),
                    report["aeo_score"], report["geo_score"],
                    report.get("aeo_band"), report.get("geo_band"),
                    _comp(report, "aeo", "structured_data"),
                    _comp(report, "aeo", "faq_qa_content"),
                    _comp(report, "aeo", "heading_semantic"),
                    _comp(report, "aeo", "internal_linking"),
                    _comp(report, "aeo", "page_speed_proxy"),
                    _comp(report, "aeo", "content_clarity"),
                    _comp(report, "geo", "entity_clarity"),
                    _comp(report, "geo", "content_chunking"),
                    _comp(report, "geo", "topical_completeness"),
                    _comp(report, "geo", "external_corroboration"),
                    _comp(report, "geo", "structured_data_richness"),
                    _comp(report, "geo", "prompt_relevance"),
                    report.get("crawl_errors", []),
                )
            )
    finally:
        conn.close()


def store_all_reports(reports: list[dict], note: Optional[str] = None) -> int:
    """Create a run and persist all reports. Returns run_id."""
    run_id = create_run(note)
    for report in reports:
        store_report(report, run_id)
    return run_id


def fetch_history(slug: str, limit: int = 12) -> list[dict]:
    """Return up to `limit` historical score rows for a venue, newest first."""
    conn = _get_connection()
    try:
        with conn, conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                """
                SELECT vs.aeo_score, vs.geo_score,
                       vs.aeo_band, vs.geo_band,
                       cr.run_at AS date
                FROM venue_scores vs
                JOIN crawl_runs cr ON cr.id = vs.crawl_run_id
                WHERE vs.slug = %s
                ORDER BY cr.run_at DESC
                LIMIT %s
                """,
                (slug, limit)
            )
            rows = cur.fetchall()
            return [dict(r) for r in rows]
    finally:
        conn.close()


def fetch_latest_all() -> list[dict]:
    """Return the most recent score for every venue."""
    conn = _get_connection()
    try:
        with conn, conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM latest_venue_scores ORDER BY slug")
            return [dict(r) for r in cur.fetchall()]
    finally:
        conn.close()
