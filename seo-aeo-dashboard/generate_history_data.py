#!/usr/bin/env python3
"""
Generate data/score_history.json — four weekly snapshots for all 20 venues.

The current week uses live scores from venues_sample.json.
Prior weeks apply small random deltas to simulate score progression
(venues generally improving as optimisation work was applied).

Output format per venue:
    {
        "slug": [
            { "date": "YYYY-MM-DD", "week": 1, "aeo_score": N, "geo_score": N },
            ...
        ]
    }
"""

import json
import random
from datetime import date, timedelta
from pathlib import Path

random.seed(42)

ROOT = Path(__file__).parent
SAMPLE_FILE = ROOT / "data" / "venues_sample.json"
OUTPUT_FILE = ROOT / "data" / "score_history.json"

# Reference date (most recent Monday)
TODAY = date(2026, 4, 28)
MONDAYS = [TODAY - timedelta(weeks=i) for i in range(3, -1, -1)]  # oldest → newest


def jitter(score: float, max_delta: float, direction: float) -> float:
    """Return score adjusted by a random amount biased in `direction` (+1 = improve, -1 = worsen)."""
    delta = random.uniform(0, max_delta) * direction
    return round(max(0.0, min(100.0, score + delta)), 1)


def build_history(venues: list[dict]) -> dict:
    history: dict[str, list] = {}

    for v in venues:
        slug = v["slug"]
        current_aeo = v["aeo_score"]
        current_geo = v["geo_score"]

        # Work backwards: week 4 = current, week 1 = 3 weeks ago (slightly lower)
        snapshots = []
        aeo = current_aeo
        geo = current_geo

        for i, monday in enumerate(reversed(MONDAYS)):
            week_num = 4 - i
            snapshots.insert(0, {
                "date": monday.isoformat(),
                "week": week_num,
                "aeo_score": round(aeo, 1),
                "geo_score": round(geo, 1),
            })
            # Each step back applies a small negative jitter (scores were lower before)
            aeo = jitter(aeo, max_delta=4.5, direction=-1)
            geo = jitter(geo, max_delta=4.0, direction=-1)

        history[slug] = snapshots

    return history


def main() -> None:
    venues = json.loads(SAMPLE_FILE.read_text())
    history = build_history(venues)
    OUTPUT_FILE.write_text(json.dumps(history, indent=2))
    total_points = sum(len(v) for v in history.values())
    print(f"Written {OUTPUT_FILE} — {len(history)} venues × 4 weeks = {total_points} data points")


if __name__ == "__main__":
    main()
