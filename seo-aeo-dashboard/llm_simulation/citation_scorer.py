"""
Aggregate raw citation hits into per-venue scores and bands.

Input:  list of {prompt_id, response_text, venues_cited: [slug, ...]}
Output: {slug: CitationResult}
"""

from dataclasses import dataclass, field

CITATION_BANDS = {
    "strong":   (67, 100),
    "good":     (45,  66),
    "moderate": (25,  44),
    "weak":     (10,  24),
    "critical": (0,    9),
}


def citation_band(rate: float) -> str:
    for band, (lo, hi) in CITATION_BANDS.items():
        if lo <= rate <= hi:
            return band
    return "critical"


@dataclass
class CitationResult:
    slug: str
    citation_count: int
    total_prompts: int
    citation_rate: float          # 0–100
    citation_band: str
    cited_by_prompts: list[str] = field(default_factory=list)
    missed_by_prompts: list[str] = field(default_factory=list)


def score_citations(
    slugs: list[str],
    prompt_results: list[dict],
) -> dict[str, CitationResult]:
    """
    prompt_results: list of dicts with keys:
        prompt_id: str
        venues_cited: list[str]   # slugs found in LLM response
    """
    total = len(prompt_results)
    all_prompt_ids = [p["prompt_id"] for p in prompt_results]

    counts: dict[str, int] = {s: 0 for s in slugs}
    cited_by: dict[str, list[str]] = {s: [] for s in slugs}

    for result in prompt_results:
        for slug in result.get("venues_cited", []):
            if slug in counts:
                counts[slug] += 1
                cited_by[slug].append(result["prompt_id"])

    out: dict[str, CitationResult] = {}
    for slug in slugs:
        count = counts[slug]
        rate = round((count / total) * 100, 1) if total else 0.0
        missed = [p for p in all_prompt_ids if p not in cited_by[slug]]
        out[slug] = CitationResult(
            slug=slug,
            citation_count=count,
            total_prompts=total,
            citation_rate=rate,
            citation_band=citation_band(rate),
            cited_by_prompts=cited_by[slug],
            missed_by_prompts=missed,
        )

    return out
