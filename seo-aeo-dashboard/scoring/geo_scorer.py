"""
GEO (Generative Engine Optimisation) scorer.
Takes a PageSignals object and returns a score breakdown (0–100).
"""

from ..crawler.extractor import PageSignals
from .weights import GEO_WEIGHTS


def score_geo(signals: PageSignals) -> dict:
    """
    Returns:
        {
            "total": float,
            "components": {
                "<component>": {
                    "raw": float,
                    "weighted": float,
                    "findings": [str],
                }
            }
        }
    """
    components = {}

    components["entity_clarity"] = _score_entity_clarity(signals)
    components["content_chunking"] = _score_content_chunking(signals)
    components["topical_completeness"] = _score_topical_completeness(signals)
    components["external_corroboration"] = _score_external_corroboration(signals)
    components["structured_data_richness"] = _score_structured_data_richness(signals)
    components["prompt_relevance"] = _score_prompt_relevance(signals)

    for key, data in components.items():
        data["weighted"] = round(data["raw"] * GEO_WEIGHTS[key], 2)

    total = round(sum(d["weighted"] for d in components.values()), 1)

    return {"total": total, "components": components}


# ---------------------------------------------------------------------------

def _score_entity_clarity(signals: PageSignals) -> dict:
    raw = 0
    findings = []

    if signals.entity_name:
        raw += 30
        findings.append(f"Venue entity name clearly identified: '{signals.entity_name}'.")
    else:
        findings.append("Venue name not clearly extractable as a standalone entity — ensure H1 matches the canonical venue name.")

    if signals.entity_address or signals.entity_city:
        raw += 25
        location = f"{signals.entity_address}, {signals.entity_city}".strip(", ")
        findings.append(f"Location data present: {location}.")
    else:
        findings.append("No structured location data — LLMs rely on explicit address/city mentions to disambiguate venues.")

    if signals.entity_phone:
        raw += 15
        findings.append("Phone number present — supports NAP consistency signals.")
    else:
        findings.append("No phone number found — add for NAP consistency across citations.")

    # Brand signal: O2 venues benefit from brand corroboration
    title_lower = signals.title.lower()
    name_lower = signals.entity_name.lower()
    if "o2" in title_lower or "academy" in title_lower or "o2" in name_lower:
        raw += 20
        findings.append("O2/Academy brand clearly present in title — strong brand entity signal for LLMs.")
    else:
        findings.append("Brand name not prominent in title tag — ensure canonical brand name appears in title.")

    if signals.meta_description and len(signals.meta_description) > 50:
        raw += 10
        findings.append("Meta description provides entity context for LLM crawlers.")
    else:
        findings.append("Missing or thin meta description — add a 130–160 character description naming the venue, city, and key attribute (e.g. capacity).")

    raw = min(raw, 100)
    return {"raw": raw, "findings": findings}


def _score_content_chunking(signals: PageSignals) -> dict:
    raw = 0
    findings = []

    chunks = signals.content_chunk_count  # H2-delimited sections

    if chunks >= 6:
        raw += 60
        findings.append(f"{chunks} H2-delimited content sections — well-chunked for LLM extraction.")
    elif chunks >= 3:
        raw += 35
        findings.append(f"{chunks} H2 sections — moderate chunking. Add sections for: Capacity, Getting Here, History, FAQs, Accessibility.")
    elif chunks >= 1:
        raw += 15
        findings.append(f"Only {chunks} H2 section(s) — content is not chunked into discrete topics that LLMs can isolate.")
    else:
        findings.append("No H2 sections detected — entire page text appears as a single blob, making LLM extraction unreliable.")

    # Short, scannable paragraphs aid extraction
    if signals.paragraph_count > 0 and signals.word_count > 0:
        avg_para_len = signals.word_count / signals.paragraph_count
        if avg_para_len <= 60:
            raw += 30
            findings.append(f"Average paragraph length ~{avg_para_len:.0f} words — concise, LLM-friendly.")
        elif avg_para_len <= 120:
            raw += 15
            findings.append(f"Average paragraph length ~{avg_para_len:.0f} words — slightly long, consider breaking into shorter chunks.")
        else:
            findings.append(f"Average paragraph length ~{avg_para_len:.0f} words — too long for efficient LLM extraction; aim for ≤60 words per paragraph.")

    if signals.has_faq:
        raw += 10
        findings.append("FAQ section contributes to chunked, extractable content.")

    raw = min(raw, 100)
    return {"raw": raw, "findings": findings}


def _score_topical_completeness(signals: PageSignals) -> dict:
    raw = 0
    findings = []
    topics_covered = 0
    topics_total = 6

    # 1. Identity (name + city)
    if signals.entity_name and (signals.entity_city or signals.entity_address):
        raw += 20
        topics_covered += 1
        findings.append("Identity: venue name and location covered.")
    else:
        findings.append("Identity gap: venue name or city/address missing from extractable content.")

    # 2. Capacity
    if signals.has_capacity_mention or signals.entity_capacity:
        raw += 20
        topics_covered += 1
        findings.append(f"Capacity: mentioned on page ({signals.entity_capacity or 'found in text'}).")
    else:
        findings.append("Capacity: not mentioned — 'capacity of [venue]' is a common LLM query; answer it explicitly.")

    # 3. History / heritage
    if signals.has_history_mention:
        raw += 15
        topics_covered += 1
        findings.append("History/heritage: mentioned — supports LLM contextualisation.")
    else:
        findings.append("History: no heritage or founding date mentioned — LLMs prize provenance for citation confidence.")

    # 4. Accessibility
    if signals.has_accessibility_info:
        raw += 15
        topics_covered += 1
        findings.append("Accessibility: information present.")
    else:
        findings.append("Accessibility: no information found — add a dedicated section for voice/assistant queries.")

    # 5. Transport / getting there
    if signals.has_transport_info:
        raw += 15
        topics_covered += 1
        findings.append("Transport/directions: information present.")
    else:
        findings.append("Getting here: no transport info — 'how to get to [venue]' is a top voice search query.")

    # 6. Events / programming
    # Proxy: page has enough content to suggest events are listed
    if signals.word_count >= 200:
        raw += 15
        topics_covered += 1
        findings.append("Events/programming: content volume suggests events are covered.")
    else:
        findings.append("Events/programming: thin content suggests event information is absent or dynamically loaded.")

    findings.append(f"Topical coverage: {topics_covered}/{topics_total} key topics present.")
    raw = min(raw, 100)
    return {"raw": raw, "findings": findings}


def _score_external_corroboration(signals: PageSignals) -> dict:
    """
    Proxy scoring — real corroboration requires external link analysis.
    Uses brand signals and schema markup as proxies for citation-worthiness.
    """
    raw = 40  # baseline: O2 venues benefit from strong brand recognition
    findings = []

    findings.append(
        "External corroboration scored via proxy (brand signals). "
        "Full scoring requires external link analysis (Wikipedia, Wikidata, Google Knowledge Panel, press coverage)."
    )

    if signals.schema_types:
        raw += 20
        findings.append("Structured data increases machine-readable credibility signals.")

    # O2 brand heuristic
    combined = (signals.title + signals.entity_name + signals.meta_description).lower()
    if "o2" in combined:
        raw += 20
        findings.append("O2 brand association provides strong corroboration via telecom brand's digital footprint.")
    elif "academy" in combined:
        raw += 10

    if signals.entity_address:
        raw += 10
        findings.append("Explicit address enables cross-referencing with Google Maps / Knowledge Graph.")

    raw = min(raw, 100)
    return {"raw": raw, "findings": findings}


def _score_structured_data_richness(signals: PageSignals) -> dict:
    raw = 0
    findings = []

    if not signals.json_ld_blocks:
        findings.append("No JSON-LD found — this is the primary machine-readable format for LLMs and knowledge graphs.")
        return {"raw": 0, "findings": findings}

    total_properties = 0
    for block in signals.json_ld_blocks:
        total_properties += len([k for k in block.keys() if not k.startswith("@")])

    findings.append(f"{len(signals.json_ld_blocks)} JSON-LD block(s) with ~{total_properties} total properties.")

    # Schema type quality
    rich_types = {"MusicVenue", "EventVenue", "FAQPage", "Event"}
    generic_types = {"Organization", "LocalBusiness", "WebPage", "WebSite"}
    has_rich = bool(set(signals.schema_types) & rich_types)
    has_generic = bool(set(signals.schema_types) & generic_types)

    if has_rich:
        raw += 50
        findings.append("Rich schema types (MusicVenue/Event/FAQPage) present — high GEO value.")
    elif has_generic:
        raw += 20
        findings.append("Only generic schema types — upgrade to MusicVenue with full property set.")

    # Property density
    if total_properties >= 15:
        raw += 30
        findings.append("High property density — good for knowledge graph population.")
    elif total_properties >= 8:
        raw += 15
        findings.append("Moderate property density — add: capacity, description, image, openingHours, sameAs links.")
    else:
        findings.append("Low property count — schema exists but is largely empty; add all recommended MusicVenue properties.")

    # sameAs links (Wikidata, Wikipedia, social)
    all_same_as = []
    for block in signals.json_ld_blocks:
        sa = block.get("sameAs", [])
        if isinstance(sa, list):
            all_same_as.extend(sa)
        elif sa:
            all_same_as.append(sa)

    if all_same_as:
        raw += 20
        findings.append(f"sameAs links found ({len(all_same_as)}) — excellent for LLM entity disambiguation.")
    else:
        findings.append("No sameAs links — add Wikipedia, Wikidata, and social profile URLs to anchor entity identity.")

    raw = min(raw, 100)
    return {"raw": raw, "findings": findings}


def _score_prompt_relevance(signals: PageSignals) -> dict:
    """
    Scores how well the content answers natural language queries an LLM would receive.
    Proxy: checks whether page content covers the most common venue query intents.
    """
    raw = 0
    findings = []

    query_intents = {
        "venue_identity": bool(signals.entity_name and signals.entity_city),
        "capacity_query": bool(signals.has_capacity_mention or signals.entity_capacity),
        "location_directions": signals.has_transport_info,
        "event_discovery": signals.word_count >= 300,
        "accessibility": signals.has_accessibility_info,
        "history_context": signals.has_history_mention,
    }

    covered = sum(query_intents.values())
    total = len(query_intents)

    raw = int((covered / total) * 80)

    findings.append(f"Prompt intent coverage: {covered}/{total} natural language query types addressed.")

    uncovered = [k for k, v in query_intents.items() if not v]
    if uncovered:
        for intent in uncovered:
            label = intent.replace("_", " ").title()
            findings.append(f"Missing intent: '{label}' — LLMs cannot answer queries about this topic from the current page content.")

    # Bonus: explicit Q&A content
    if signals.has_faq:
        raw += 20
        findings.append("FAQ/Q&A content present — directly maps to conversational query formats used by LLMs.")

    raw = min(raw, 100)
    return {"raw": raw, "findings": findings}
