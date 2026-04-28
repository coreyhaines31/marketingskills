"""
AEO (Answer Engine Optimisation) scorer.
Takes a PageSignals object and returns a score breakdown (0–100).
"""

from crawler.extractor import PageSignals
from .weights import AEO_WEIGHTS


def score_aeo(signals: PageSignals) -> dict:
    """
    Returns:
        {
            "total": float,           # 0-100
            "components": {
                "<component>": {
                    "raw": float,     # 0-100 for this component
                    "weighted": float,
                    "findings": [str],
                }
            }
        }
    """
    components = {}

    components["structured_data"] = _score_structured_data(signals)
    components["faq_qa_content"] = _score_faq(signals)
    components["heading_semantic"] = _score_headings(signals)
    components["internal_linking"] = _score_internal_linking(signals)
    components["page_speed_proxy"] = _score_page_speed_proxy(signals)
    components["content_clarity"] = _score_content_clarity(signals)

    for key, data in components.items():
        data["weighted"] = round(data["raw"] * AEO_WEIGHTS[key], 2)

    total = round(sum(d["weighted"] for d in components.values()), 1)

    return {"total": total, "components": components}


# ---------------------------------------------------------------------------

def _score_structured_data(signals: PageSignals) -> dict:
    raw = 0
    findings = []

    desired_types = {"MusicVenue", "EventVenue", "Organization", "LocalBusiness",
                     "Event", "FAQPage", "BreadcrumbList", "WebPage"}
    present = set(signals.schema_types)
    found = present & desired_types

    if not present:
        findings.append("No JSON-LD structured data detected — critical gap for AEO.")
    else:
        findings.append(f"Schema types found: {', '.join(sorted(present))}")

    if "MusicVenue" in present or "EventVenue" in present:
        raw += 40
        findings.append("MusicVenue/EventVenue schema present — strong AEO signal.")
    elif "LocalBusiness" in present or "Organization" in present:
        raw += 20
        findings.append("Generic business schema found — should be upgraded to MusicVenue.")

    if "Event" in present:
        raw += 20
        findings.append("Event schema present — good for individual event discovery.")

    if "FAQPage" in present:
        raw += 20
        findings.append("FAQPage schema present — directly boosts answer engine extraction.")

    if "BreadcrumbList" in present:
        raw += 10
    if "WebPage" in present or "WebSite" in present:
        raw += 10

    raw = min(raw, 100)
    return {"raw": raw, "findings": findings}


def _score_faq(signals: PageSignals) -> dict:
    raw = 0
    findings = []

    if not signals.has_faq:
        findings.append("No FAQ or Q&A content detected — significant AEO gap.")
    else:
        raw += 50
        findings.append(f"FAQ/Q&A content found with ~{signals.faq_item_count} items.")
        if signals.faq_item_count >= 5:
            raw += 30
            findings.append("Good FAQ depth (5+ items) — strong for featured snippet extraction.")
        elif signals.faq_item_count >= 2:
            raw += 15
        if "FAQPage" in signals.schema_types:
            raw += 20
            findings.append("FAQ structured with FAQPage schema — optimal for AEO.")

    raw = min(raw, 100)
    return {"raw": raw, "findings": findings}


def _score_headings(signals: PageSignals) -> dict:
    raw = 0
    findings = []

    h1_count = len(signals.h1_tags)
    h2_count = len(signals.h2_tags)
    h3_count = len(signals.h3_tags)

    if h1_count == 1:
        raw += 30
        findings.append(f"Single H1 present: '{signals.h1_tags[0][:60]}'")
    elif h1_count == 0:
        findings.append("Missing H1 tag — critical for semantic structure.")
    else:
        raw += 10
        findings.append(f"Multiple H1 tags ({h1_count}) — should be reduced to one.")

    if h2_count >= 4:
        raw += 40
        findings.append(f"{h2_count} H2 tags provide good semantic sectioning.")
    elif h2_count >= 2:
        raw += 25
        findings.append(f"Only {h2_count} H2 tags — more sectioning would improve answer extraction.")
    elif h2_count == 1:
        raw += 10
    else:
        findings.append("No H2 tags — content lacks semantic structure for AEO.")

    if h3_count >= 2:
        raw += 20
    elif h3_count == 1:
        raw += 10

    if signals.heading_hierarchy_valid:
        raw += 10
        findings.append("Heading hierarchy is valid (H1 → H2 → H3).")
    else:
        findings.append("Heading hierarchy is invalid or incomplete.")

    raw = min(raw, 100)
    return {"raw": raw, "findings": findings}


def _score_internal_linking(signals: PageSignals) -> dict:
    raw = 0
    findings = []

    count = signals.internal_link_count
    if count >= 20:
        raw += 60
        findings.append(f"{count} internal links — good navigation coverage.")
    elif count >= 10:
        raw += 40
        findings.append(f"{count} internal links — moderate. Add contextual links to venue info.")
    elif count >= 5:
        raw += 20
        findings.append(f"Only {count} internal links detected — sparse linking structure.")
    else:
        findings.append(f"Very few internal links ({count}) — poor discovery architecture.")

    if signals.internal_links_to_venue_info:
        raw += 30
        findings.append("Links to venue info / accessibility pages detected.")
    else:
        raw += 0
        findings.append("No links to venue-specific info pages — add links to accessibility, directions, and FAQ pages.")

    if signals.has_about_section:
        raw += 10

    raw = min(raw, 100)
    return {"raw": raw, "findings": findings}


def _score_page_speed_proxy(signals: PageSignals) -> dict:
    """
    Without live Lighthouse data this uses structural proxies:
    heavy DOM (many paragraphs/headings) is penalised slightly;
    presence of meta description signals basic hygiene.
    When real CrUX / Lighthouse data is fed in, replace this function.
    """
    raw = 50  # neutral baseline until real data
    findings = []

    if signals.meta_description:
        raw += 20
        findings.append("Meta description present — basic technical hygiene satisfied.")
    else:
        raw -= 10
        findings.append("Missing meta description — hurts CTR and answer engine previews.")

    if signals.paragraph_count > 100:
        raw -= 10
        findings.append("High paragraph count may indicate heavy DOM — verify Core Web Vitals.")
    elif signals.paragraph_count > 0:
        raw += 10

    findings.append("Note: page speed scored via structural proxy — run real Lighthouse audit for accuracy.")
    raw = max(0, min(raw, 100))
    return {"raw": raw, "findings": findings}


def _score_content_clarity(signals: PageSignals) -> dict:
    raw = 0
    findings = []

    # Word count — venues should have substantive venue descriptions
    if signals.word_count >= 500:
        raw += 30
        findings.append(f"Good content volume ({signals.word_count} words).")
    elif signals.word_count >= 200:
        raw += 15
        findings.append(f"Moderate content ({signals.word_count} words) — expand venue description to 500+ words for better AEO.")
    else:
        findings.append(f"Thin content ({signals.word_count} words) — LLMs and answer engines need substantive text to extract answers.")

    # Entity completeness as clarity proxy
    if signals.entity_capacity:
        raw += 15
        findings.append(f"Capacity information present: {signals.entity_capacity}.")
    else:
        findings.append("Capacity not explicitly stated — add this as a clearly labelled field (e.g. 'Capacity: 4,921').")

    if signals.has_transport_info:
        raw += 15
        findings.append("Transport / directions information present — supports 'how to get there' queries.")
    else:
        findings.append("No transport or directions content — add a dedicated Getting Here section.")

    if signals.has_accessibility_info:
        raw += 15
        findings.append("Accessibility information present.")
    else:
        findings.append("No accessibility information — add accessible venue details for voice and assistant queries.")

    if signals.has_about_section:
        raw += 10
    if signals.entity_address:
        raw += 15
        findings.append(f"Address present: {signals.entity_address}.")
    else:
        findings.append("Structured address not found on page — add NAP (Name, Address, Phone) markup.")

    raw = min(raw, 100)
    return {"raw": raw, "findings": findings}
