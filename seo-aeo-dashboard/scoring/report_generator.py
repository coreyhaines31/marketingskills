"""
Report generator.
Combines AEO + GEO scores into the structured JSON output format.
"""

from ..crawler.extractor import PageSignals
from .aeo_scorer import score_aeo
from .geo_scorer import score_geo
from .weights import band_label


def generate_report(venue: dict, signals: PageSignals) -> dict:
    aeo = score_aeo(signals)
    geo = score_geo(signals)

    strengths, weaknesses = _extract_strengths_weaknesses(aeo, geo)
    quick_wins = _quick_wins(signals, aeo, geo)
    priority_fixes = _priority_fixes(signals, aeo, geo)
    schema_recs = _schema_recommendations(signals)
    content_recs = _content_recommendations(signals)
    linking_recs = _linking_recommendations(signals)

    return {
        "venue_name": venue["name"],
        "slug": venue["slug"],
        "url": venue["url"],
        "region": venue["region"],
        "geo_score": geo["total"],
        "aeo_score": aeo["total"],
        "geo_band": band_label(geo["total"]),
        "aeo_band": band_label(aeo["total"]),
        "geo_components": {
            k: {"score": round(v["raw"]), "weighted": v["weighted"], "findings": v["findings"]}
            for k, v in geo["components"].items()
        },
        "aeo_components": {
            k: {"score": round(v["raw"]), "weighted": v["weighted"], "findings": v["findings"]}
            for k, v in aeo["components"].items()
        },
        "summary": _build_summary(venue["name"], aeo["total"], geo["total"], signals),
        "strengths": strengths,
        "weaknesses": weaknesses,
        "quick_wins": quick_wins,
        "priority_fixes": priority_fixes,
        "schema_recommendations": schema_recs,
        "content_recommendations": content_recs,
        "internal_linking_recommendations": linking_recs,
        "crawl_errors": signals.crawl_errors,
    }


def generate_all_reports(crawl_results: list[dict]) -> list[dict]:
    return [generate_report(r["venue"], r["signals"]) for r in crawl_results]


# ---------------------------------------------------------------------------

def _build_summary(name: str, aeo: float, geo: float, signals: PageSignals) -> str:
    aeo_band = band_label(aeo)
    geo_band = band_label(geo)
    parts = [
        f"{name} scores {aeo:.0f}/100 for AEO ({aeo_band}) and {geo:.0f}/100 for GEO ({geo_band}).",
    ]
    if not signals.json_ld_blocks:
        parts.append("The page lacks all structured data — the single highest-impact fix available.")
    if not signals.has_faq:
        parts.append("No FAQ content was found, leaving the page unable to surface in featured snippets or voice answers.")
    if not signals.has_capacity_mention:
        parts.append("Capacity is not stated, missing one of the most queried facts about a live music venue.")
    return " ".join(parts)


def _extract_strengths_weaknesses(aeo: dict, geo: dict) -> tuple[list[str], list[str]]:
    strengths = []
    weaknesses = []

    threshold_strong = 60
    threshold_weak = 40

    for key, data in {**aeo["components"], **geo["components"]}.items():
        raw = data["raw"]
        label = key.replace("_", " ").title()
        if raw >= threshold_strong:
            strengths.append(f"{label}: {raw:.0f}/100")
        elif raw <= threshold_weak:
            weaknesses.append(f"{label}: {raw:.0f}/100")

    if not strengths:
        strengths.append("No components score above 60 — significant optimisation opportunity across the board.")

    return strengths, weaknesses


def _quick_wins(signals: PageSignals, aeo: dict, geo: dict) -> list[str]:
    wins = []

    if not signals.meta_description:
        wins.append(
            "Add a meta description (130–160 chars) naming the venue, city, and a key differentiator "
            "(e.g. 'O2 Academy Brixton — iconic 4,921-capacity South London music venue'). "
            "Zero-cost, high-impact for both AEO and GEO."
        )

    if not signals.entity_address and not signals.entity_city:
        wins.append(
            "Add visible NAP (Name, Address, Phone) text to the page. "
            "This costs nothing and immediately improves entity clarity for LLMs."
        )

    if not signals.has_capacity_mention:
        wins.append(
            "Add capacity to the page as a clearly labelled field "
            "(e.g. a <dl> or a dedicated 'Venue Facts' section with Capacity: X). "
            "This answers one of the highest-volume venue queries instantly."
        )

    if not signals.has_transport_info:
        wins.append(
            "Add a 'Getting Here' section with nearest tube/bus/train. "
            "Directly answers 'how to get to [venue]' queries in voice search and LLM responses."
        )

    if not signals.json_ld_blocks:
        wins.append(
            "Add basic Organization + MusicVenue JSON-LD. "
            "A minimal 10-property block can be added in under 30 minutes and yields immediate structured data scoring."
        )

    return wins[:5]  # cap at top 5


def _priority_fixes(signals: PageSignals, aeo: dict, geo: dict) -> list[str]:
    fixes = []

    # Ordered by estimated score impact
    if not signals.json_ld_blocks:
        fixes.append(
            "[CRITICAL] Implement MusicVenue JSON-LD schema with: name, url, address, telephone, "
            "description, maximumAttendeeCapacity, image, sameAs (Wikidata/Wikipedia/social). "
            "Estimated AEO impact: +12–16 points."
        )

    if not signals.has_faq:
        fixes.append(
            "[HIGH] Build a FAQ section answering: 'What is the capacity?', 'How do I get there?', "
            "'Is the venue accessible?', 'What is the age policy?', 'Is there parking nearby?'. "
            "Wrap in FAQPage schema. Estimated AEO impact: +10–14 points."
        )

    if not signals.has_capacity_mention:
        fixes.append(
            "[HIGH] Add explicit capacity as a labelled data point in both visible text and schema "
            "(maximumAttendeeCapacity property). This answers the #1 factual venue query."
        )

    if not signals.has_history_mention:
        fixes.append(
            "[MEDIUM] Add a 100–200 word venue history section: opening year, significant events, "
            "cultural significance. LLMs prize provenance data for citation confidence. "
            "Estimated GEO impact: +5–8 points."
        )

    if not signals.has_accessibility_info:
        fixes.append(
            "[MEDIUM] Add an Accessibility section: step-free access, hearing loops, BSL, "
            "wheelchair spaces. Boosts both AEO (voice search) and GEO (topical completeness)."
        )

    return fixes


def _schema_recommendations(signals: PageSignals) -> list[str]:
    recs = []

    if "MusicVenue" not in signals.schema_types and "EventVenue" not in signals.schema_types:
        recs.append(
            "Implement MusicVenue schema (@type: MusicVenue) with all applicable properties: "
            "name, alternateName, url, address (PostalAddress), telephone, description, "
            "maximumAttendeeCapacity, image, openingHoursSpecification, sameAs, geo (GeoCoordinates)."
        )

    if "Event" not in signals.schema_types:
        recs.append(
            "Add Event schema for each listed event: name, startDate, location (MusicVenue), "
            "performer (MusicGroup), offers (Offer with price and availability), image."
        )

    if "FAQPage" not in signals.schema_types:
        recs.append(
            "Implement FAQPage schema with Question/Answer pairs for the top 5–8 venue queries. "
            "This is directly read by Google's Featured Snippets and People Also Ask."
        )

    if not any("sameAs" in str(b) for b in signals.json_ld_blocks):
        recs.append(
            "Add sameAs array to venue entity linking to: Wikidata item, Wikipedia article (if exists), "
            "official social profiles (Facebook, Instagram, Twitter/X). "
            "This is the primary LLM entity disambiguation mechanism."
        )

    if "BreadcrumbList" not in signals.schema_types:
        recs.append(
            "Add BreadcrumbList schema to reflect navigation hierarchy "
            "(e.g. Home > Venues > London > O2 Academy Brixton)."
        )

    return recs


def _content_recommendations(signals: PageSignals) -> list[str]:
    recs = []

    if signals.word_count < 400:
        recs.append(
            f"Expand venue description to at least 400 words (currently ~{signals.word_count}). "
            "Cover: venue history, atmosphere, programming genres, notable past acts, location advantages."
        )

    if not signals.has_history_mention:
        recs.append(
            "Add a 'About [Venue Name]' section covering: year opened, original purpose (if converted), "
            "significant performances, architectural/cultural heritage. "
            "Provides LLMs with citation-worthy provenance."
        )

    if not signals.has_faq:
        recs.append(
            "Create a FAQ section with: 'What is the capacity?', 'What are the nearest transport links?', "
            "'Is the venue accessible for wheelchair users?', 'Can I bring my own food/drink?', "
            "'What is the bag policy?', 'Is there an age restriction?'."
        )

    if not signals.has_accessibility_info:
        recs.append(
            "Add a dedicated Accessibility page or section. "
            "Include: step-free access routes, accessible toilets, hearing loop, BSL interpretation, "
            "companion ticket policy, viewing platforms."
        )

    if not signals.has_transport_info:
        recs.append(
            "Add a 'Getting Here' section with: nearest tube/rail stations and walking time, "
            "bus routes, parking options, cycling infrastructure. "
            "Format as bullet points for easy LLM extraction."
        )

    if not signals.entity_capacity:
        recs.append(
            "State the venue capacity prominently — ideally in a 'Venue Facts' summary box "
            "or as a labelled stat (Capacity: 4,921 standing / 2,300 seated). "
            "This data point is queried millions of times across voice, LLM, and featured snippet surfaces."
        )

    return recs


def _linking_recommendations(signals: PageSignals) -> list[str]:
    recs = []

    if not signals.internal_links_to_venue_info:
        recs.append(
            "Add contextual internal links from event pages to the venue info page "
            "(e.g. 'Venue information', 'Accessibility', 'Getting Here'). "
            "This builds crawl authority for venue-specific pages."
        )

    if signals.internal_link_count < 10:
        recs.append(
            "Increase internal link density. Add cross-links between: venue homepage, events listing, "
            "venue info, FAQ, accessibility, and directions pages."
        )

    recs.append(
        "Ensure each venue page links to its own canonical URL and uses consistent anchor text "
        "(e.g. always 'O2 Academy Brixton', never 'click here' or 'this venue')."
    )

    recs.append(
        "Add a 'You may also like' or 'Other O2 venues' section linking to sister venues — "
        "this builds topical authority across the portfolio and helps LLMs understand the brand network."
    )

    return recs
