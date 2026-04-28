#!/usr/bin/env python3
"""
Generate data/citation_results.json without a live API call.

Citation probabilities are modelled from:
  - Venue GEO score (primary driver — higher GEO → more citable content)
  - Region match against each prompt's region_filter
  - Capacity hint alignment
  - Fame boost for flagship venues (Brixton, Apollo Manchester, Corn Exchange)

Output mirrors the schema produced by llm_simulation/simulate.py so the
dashboard is agnostic about whether the data is live or sampled.
"""

import json
import random
from pathlib import Path

from llm_simulation.prompts import PROMPTS
from llm_simulation.citation_scorer import score_citations

random.seed(99)

ROOT = Path(__file__).parent
SAMPLE_FILE  = ROOT / "data" / "venues_sample.json"
OUTPUT_FILE  = ROOT / "data" / "citation_results.json"

MODEL = "claude-opus-4-5 (simulated)"

# ── Regional mappings ────────────────────────────────────────────────────────
REGION_ALIASES: dict[str, list[str]] = {
    "London":      ["london"],
    "North West":  ["north west", "manchester"],
    "Scotland":    ["scotland", "edinburgh"],
    "Midlands":    ["midlands", "birmingham"],
    "South":       ["south", "bristol", "southampton", "bournemouth"],
    "Yorkshire":   ["yorkshire", "leeds", "sheffield"],
    "North East":  ["north east", "newcastle"],
}

# Venues with strong brand recognition — get a flat probability boost
FAME_BOOST: dict[str, float] = {
    "o2-academy-brixton":        0.25,
    "o2-apollo-manchester":      0.20,
    "edinburgh-corn-exchange":   0.18,
    "o2-shepherds-bush-empire":  0.12,
    "o2-academy-birmingham":     0.10,
    "o2-academy-glasgow":        0.08,
    "o2-academy-bristol":        0.08,
    "o2-academy-leeds":          0.06,
}

# Rough capacity tier per venue
CAPACITY_TIER: dict[str, str] = {
    "o2-academy-brixton":                "large",
    "o2-apollo-manchester":              "large",
    "edinburgh-corn-exchange":           "large",
    "o2-shepherds-bush-empire":          "large",
    "o2-academy-birmingham":             "large",
    "o2-academy-glasgow":                "large",
    "o2-academy-bristol":                "large",
    "o2-academy-leeds":                  "large",
    "o2-forum-kentish-town":             "mid",
    "o2-academy-islington":              "mid",
    "o2-victoria-warehouse-manchester":  "mid",
    "o2-ritz-manchester":                "mid",
    "o2-guildhall-southampton":          "mid",
    "o2-academy-liverpool":              "mid",
    "o2-academy-oxford":                 "mid",
    "o2-academy-leicester":              "small",
    "o2-academy-bournemouth":            "small",
    "o2-academy-sheffield":              "small",
    "o2-city-hall-newcastle":            "small",
    "o2-institute-birmingham":           "small",
}


def region_matches(venue_region: str, prompt_filter: str | None) -> bool:
    if not prompt_filter:
        return True
    aliases = REGION_ALIASES.get(prompt_filter, [prompt_filter.lower()])
    return any(a in venue_region.lower() for a in aliases)


def capacity_matches(slug: str, capacity_hint: str | None) -> bool:
    if not capacity_hint:
        return True
    return CAPACITY_TIER.get(slug, "mid") == capacity_hint


def cite_probability(venue: dict, prompt) -> float:
    slug = venue["slug"]
    geo = venue["geo_score"]

    # Base: GEO score scaled to ~0.05–0.55 range
    base = (geo / 100) * 0.55

    # Regional relevance gate — if prompt targets a region and venue is out, almost zero
    if not region_matches(venue["region"], prompt.region_filter):
        base *= 0.05

    # Capacity mismatch penalty
    if prompt.capacity_hint and not capacity_matches(slug, prompt.capacity_hint):
        base *= 0.4

    # Fame boost
    base += FAME_BOOST.get(slug, 0.0)

    return min(base, 0.95)


def run_simulation(venues: list[dict]) -> tuple[list[dict], list[dict]]:
    prompt_results = []
    for prompt in PROMPTS:
        venues_cited = []
        for v in venues:
            p = cite_probability(v, prompt)
            if random.random() < p:
                venues_cited.append(v["slug"])
        prompt_results.append({
            "prompt_id": prompt.id,
            "text": prompt.text,
            "venues_cited": venues_cited,
        })
    return prompt_results


def main() -> None:
    venues = json.loads(SAMPLE_FILE.read_text())
    prompt_results = run_simulation(venues)

    slugs = [v["slug"] for v in venues]
    citation_scores = score_citations(slugs, prompt_results)

    output = {
        "run_date": "2026-04-28",
        "model": MODEL,
        "total_prompts": len(PROMPTS),
        "venues": {
            slug: {
                "citation_count": r.citation_count,
                "citation_rate": r.citation_rate,
                "citation_band": r.citation_band,
                "cited_by_prompts": r.cited_by_prompts,
                "missed_by_prompts": r.missed_by_prompts,
            }
            for slug, r in citation_scores.items()
        },
        "prompts": [
            {
                "id": p["prompt_id"],
                "text": p["text"],
                "venues_cited": p["venues_cited"],
            }
            for p in prompt_results
        ],
    }

    OUTPUT_FILE.write_text(json.dumps(output, indent=2))

    # Print summary
    ranked = sorted(
        citation_scores.items(),
        key=lambda x: x[1].citation_rate,
        reverse=True,
    )
    print(f"\n{'Venue slug':<45} {'Citations':>10} {'Rate':>8} {'Band'}")
    print("-" * 80)
    for slug, r in ranked:
        name = next((v["venue_name"] for v in venues if v["slug"] == slug), slug)
        print(f"{name:<45} {r.citation_count:>4}/{r.total_prompts:<5} {r.citation_rate:>6.1f}%  {r.citation_band}")
    print(f"\nWritten → {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
