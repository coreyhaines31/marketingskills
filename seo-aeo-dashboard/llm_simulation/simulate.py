#!/usr/bin/env python3
"""
CLI entry point for the LLM citation simulation.

Usage:
    cd seo-aeo-dashboard
    export ANTHROPIC_API_KEY=sk-ant-...
    python -m llm_simulation.simulate

    # Single prompt (by id)
    python -m llm_simulation.simulate --prompt p01

    # Custom output path
    python -m llm_simulation.simulate --output data/citation_results.json
"""

import argparse
import json
import logging
import sys
from dataclasses import asdict
from datetime import date
from pathlib import Path

from crawler.venues import VENUES
from llm_simulation.prompts import PROMPTS
from llm_simulation.runner import run_simulation
from llm_simulation.citation_scorer import score_citations

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("simulate")

OUTPUT_FILE = Path(__file__).parent.parent / "data" / "citation_results.json"


def main() -> None:
    parser = argparse.ArgumentParser(description="LLM citation simulation")
    parser.add_argument("--prompt", help="Run only this prompt id (e.g. p01)")
    parser.add_argument("--model", default="claude-opus-4-5", help="Claude model to use")
    parser.add_argument("--output", default=str(OUTPUT_FILE))
    args = parser.parse_args()

    prompts = PROMPTS
    if args.prompt:
        prompts = [p for p in PROMPTS if p.id == args.prompt]
        if not prompts:
            logger.error("No prompt with id '%s'", args.prompt)
            sys.exit(1)

    try:
        prompt_results = run_simulation(VENUES, prompts, model=args.model)
    except (EnvironmentError, ImportError) as exc:
        logger.error("%s", exc)
        sys.exit(1)

    slugs = [v["slug"] for v in VENUES]
    citation_scores = score_citations(slugs, [asdict(r) for r in prompt_results])

    output = {
        "run_date": date.today().isoformat(),
        "model": args.model,
        "total_prompts": len(prompts),
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
                "id": r.prompt_id,
                "text": r.prompt_text,
                "venues_cited": r.venues_cited,
            }
            for r in prompt_results
        ],
    }

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(output, indent=2))
    logger.info("Results written to %s", out_path)

    # Summary
    ranked = sorted(
        citation_scores.items(),
        key=lambda x: x[1].citation_rate,
        reverse=True,
    )
    print(f"\n{'Venue':<45} {'Citations':>10} {'Rate':>8} {'Band'}")
    print("-" * 80)
    for slug, r in ranked:
        venue_name = next((v.get("name", slug) for v in VENUES if v["slug"] == slug), slug)
        print(
            f"{venue_name:<45} {r.citation_count:>4}/{r.total_prompts:<5} "
            f"{r.citation_rate:>6.1f}%  {r.citation_band}"
        )


if __name__ == "__main__":
    main()
