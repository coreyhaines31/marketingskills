#!/usr/bin/env python3
"""
Main pipeline entry point.

Usage:
    python pipeline.py                        # Crawl all venues and write data/venues.json
    python pipeline.py --slug o2-academy-brixton  # Single venue
    python pipeline.py --dry-run              # Show venue list without crawling
"""

import argparse
import json
import logging
import os
import sys
from pathlib import Path

from crawler import VENUES, run_crawl
from scoring import generate_all_reports

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("pipeline")

OUTPUT_FILE = Path(__file__).parent / "data" / "venues.json"


def main() -> None:
    parser = argparse.ArgumentParser(description="AEO/GEO crawl and score pipeline")
    parser.add_argument("--slug", help="Run only the venue with this slug")
    parser.add_argument("--dry-run", action="store_true", help="List venues without crawling")
    parser.add_argument("--output", default=str(OUTPUT_FILE), help="Output JSON path")
    args = parser.parse_args()

    venues = VENUES
    if args.slug:
        venues = [v for v in VENUES if v["slug"] == args.slug]
        if not venues:
            logger.error("No venue found with slug '%s'", args.slug)
            sys.exit(1)

    if args.dry_run:
        print(f"{'Slug':<45} {'Name':<40} {'Region'}")
        print("-" * 100)
        for v in venues:
            print(f"{v['slug']:<45} {v['name']:<40} {v['region']}")
        return

    logger.info("Crawling %d venue(s)...", len(venues))
    crawl_results = run_crawl(venues)
    logger.info("Crawl complete. Generating scores and reports...")

    reports = generate_all_reports(crawl_results)

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(reports, indent=2, ensure_ascii=False))

    logger.info("Reports written to %s", output_path)

    # Persist to Postgres if DATABASE_URL is configured
    if os.environ.get("DATABASE_URL"):
        try:
            from db.store import store_all_reports
            run_id = store_all_reports(reports, note=f"pipeline run — {len(reports)} venues")
            logger.info("Scores persisted to Postgres (run_id=%d)", run_id)
        except Exception as exc:
            logger.warning("Postgres persistence failed (non-fatal): %s", exc)
    else:
        logger.info("DATABASE_URL not set — skipping Postgres persistence")

    # Print summary table
    print(f"\n{'Venue':<40} {'AEO':>5} {'GEO':>5} {'AEO Band':<12} {'GEO Band'}")
    print("-" * 80)
    for r in sorted(reports, key=lambda x: x["aeo_score"], reverse=True):
        print(
            f"{r['venue_name']:<40} {r['aeo_score']:>5.1f} {r['geo_score']:>5.1f} "
            f"{r['aeo_band']:<12} {r['geo_band']}"
        )


if __name__ == "__main__":
    main()
