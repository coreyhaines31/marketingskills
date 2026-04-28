"""
Scoring weights and component definitions.
All weights within a category must sum to 1.0.
"""

AEO_WEIGHTS = {
    "structured_data":    0.20,
    "faq_qa_content":     0.15,
    "heading_semantic":   0.15,
    "internal_linking":   0.10,
    "page_speed_proxy":   0.10,
    "content_clarity":    0.30,
}

GEO_WEIGHTS = {
    "entity_clarity":         0.20,
    "content_chunking":       0.15,
    "topical_completeness":   0.20,
    "external_corroboration": 0.10,
    "structured_data_richness": 0.15,
    "prompt_relevance":       0.20,
}

# Descriptive labels for dashboard display
AEO_COMPONENT_LABELS = {
    "structured_data":  "Structured Data",
    "faq_qa_content":   "FAQ / Q&A Content",
    "heading_semantic": "Headings & Semantic Structure",
    "internal_linking": "Internal Linking",
    "page_speed_proxy": "Page Speed (Proxy)",
    "content_clarity":  "Content Clarity",
}

GEO_COMPONENT_LABELS = {
    "entity_clarity":           "Entity Clarity",
    "content_chunking":         "Content Chunking",
    "topical_completeness":     "Topical Completeness",
    "external_corroboration":   "External Corroboration",
    "structured_data_richness": "Structured Data Richness",
    "prompt_relevance":         "Prompt Relevance",
}

# Score thresholds for colour-coding
SCORE_BANDS = {
    "critical": (0, 30),
    "weak":     (30, 50),
    "moderate": (50, 70),
    "good":     (70, 85),
    "strong":   (85, 100),
}


def band_label(score: float) -> str:
    for label, (lo, hi) in SCORE_BANDS.items():
        if lo <= score < hi:
            return label
    return "strong"
