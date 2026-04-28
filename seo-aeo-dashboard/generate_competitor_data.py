#!/usr/bin/env python3
"""
Generate data/competitors_sample.json from hardcoded competitor profiles.

Competitor profiles are modelled on publicly available knowledge of each
venue's web presence — schema adoption, content depth, FAQ usage, etc.
Run through the same live scoring engine as the O2 portfolio so scores
are directly comparable.
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from crawler.extractor import PageSignals
from crawler.competitors import COMPETITORS
from scoring.report_generator import generate_report

PROFILES = {
    # ── London ────────────────────────────────────────────────────────────────
    "roundhouse": dict(
        title="Roundhouse | Live Music & Arts, Camden London",
        meta_description="The Roundhouse is a legendary live music and arts venue in Camden, London. Capacity 3,300. Tickets, events, accessibility and visit info.",
        h1_tags=["Roundhouse"],
        h2_tags=["Upcoming Events", "About the Roundhouse", "Getting Here",
                 "Accessibility", "FAQ", "History"],
        h3_tags=["By Tube", "By Bus", "By Train", "Parking", "Wheelchair Access"],
        json_ld_blocks=[{
            "@type": "MusicVenue",
            "@context": "https://schema.org",
            "name": "Roundhouse",
            "address": {"@type": "PostalAddress",
                        "streetAddress": "Chalk Farm Road",
                        "addressLocality": "London", "postalCode": "NW1 8EH"},
            "maximumAttendeeCapacity": 3300,
            "geo": {"@type": "GeoCoordinates", "latitude": 51.543, "longitude": -0.152},
            "telephone": "+44 20 7424 9991",
            "sameAs": ["https://en.wikipedia.org/wiki/Roundhouse_(music_venue)",
                       "https://www.wikidata.org/wiki/Q1777397"],
            "openingHoursSpecification": [],
        }],
        schema_types=["MusicVenue"],
        entity_name="Roundhouse", entity_address="Chalk Farm Road",
        entity_city="London", entity_capacity="3,300",
        entity_phone="+44 20 7424 9991",
        word_count=680, paragraph_count=30,
        has_faq=True, faq_item_count=8, has_about_section=True,
        has_capacity_mention=True, has_history_mention=True,
        has_accessibility_info=True, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=28,
        internal_links_to_venue_info=True, content_chunk_count=6,
    ),
    "koko-london": dict(
        title="KOKO | London Music Venue",
        meta_description="KOKO is an iconic 1,500-capacity music venue in Camden, London. Originally the Camden Theatre, now fully restored.",
        h1_tags=["KOKO"],
        h2_tags=["Events", "About KOKO", "Getting Here", "Accessibility"],
        h3_tags=["By Tube", "By Bus", "Disabled Access"],
        json_ld_blocks=[{
            "@type": "MusicVenue",
            "@context": "https://schema.org",
            "name": "KOKO",
            "address": {"@type": "PostalAddress",
                        "streetAddress": "1A Camden High Street",
                        "addressLocality": "London", "postalCode": "NW1 7JE"},
            "maximumAttendeeCapacity": 1500,
            "sameAs": ["https://en.wikipedia.org/wiki/Koko_(music_venue)"],
        }],
        schema_types=["MusicVenue"],
        entity_name="KOKO", entity_address="1A Camden High Street",
        entity_city="London", entity_capacity="1,500",
        word_count=540, paragraph_count=24,
        has_faq=False, faq_item_count=0, has_about_section=True,
        has_capacity_mention=True, has_history_mention=True,
        has_accessibility_info=True, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=22,
        internal_links_to_venue_info=True, content_chunk_count=5,
    ),
    "electric-ballroom": dict(
        title="Electric Ballroom | Camden Live Music Venue",
        meta_description="Electric Ballroom — Camden's iconic 1,500-capacity live music and club venue since 1938.",
        h1_tags=["Electric Ballroom"],
        h2_tags=["Events", "About", "Getting Here"],
        h3_tags=["Location", "Transport"],
        json_ld_blocks=[{
            "@type": "MusicVenue",
            "@context": "https://schema.org",
            "name": "Electric Ballroom",
            "address": {"@type": "PostalAddress",
                        "streetAddress": "184 Camden High Street",
                        "addressLocality": "London", "postalCode": "NW1 8QP"},
        }],
        schema_types=["MusicVenue"],
        entity_name="Electric Ballroom", entity_address="184 Camden High Street",
        entity_city="London", entity_capacity="1,500",
        word_count=320, paragraph_count=14,
        has_faq=False, faq_item_count=0, has_about_section=True,
        has_capacity_mention=True, has_history_mention=True,
        has_accessibility_info=False, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=16,
        internal_links_to_venue_info=True, content_chunk_count=3,
    ),
    "fabric-london": dict(
        title="fabric | London Nightclub",
        meta_description="fabric is a world-renowned London nightclub in Farringdon. Capacity 1,500.",
        h1_tags=["fabric"],
        h2_tags=["Events", "About", "Getting Here"],
        h3_tags=["Address"],
        json_ld_blocks=[{
            "@type": "NightClub",
            "@context": "https://schema.org",
            "name": "fabric",
            "address": {"@type": "PostalAddress",
                        "streetAddress": "77A Charterhouse Street",
                        "addressLocality": "London"},
        }],
        schema_types=["NightClub"],
        entity_name="fabric", entity_address="77A Charterhouse Street",
        entity_city="London", entity_capacity="1,500",
        word_count=220, paragraph_count=10,
        has_faq=False, faq_item_count=0, has_about_section=True,
        has_capacity_mention=False, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=14,
        internal_links_to_venue_info=False, content_chunk_count=2,
    ),
    # ── North West ────────────────────────────────────────────────────────────
    "manchester-academy": dict(
        title="Manchester Academy | Live Music Venue",
        meta_description="Manchester Academy — 2,600-capacity live music venue at the University of Manchester. Multiple rooms.",
        h1_tags=["Manchester Academy"],
        h2_tags=["Upcoming Events", "Venue Info", "Getting Here", "Accessibility"],
        h3_tags=["By Tram", "By Bus", "Parking"],
        json_ld_blocks=[{
            "@type": "MusicVenue",
            "@context": "https://schema.org",
            "name": "Manchester Academy",
            "address": {"@type": "PostalAddress",
                        "streetAddress": "Oxford Road",
                        "addressLocality": "Manchester", "postalCode": "M13 9PR"},
            "maximumAttendeeCapacity": 2600,
        }],
        schema_types=["MusicVenue"],
        entity_name="Manchester Academy", entity_address="Oxford Road",
        entity_city="Manchester", entity_capacity="2,600",
        word_count=430, paragraph_count=18,
        has_faq=False, faq_item_count=0, has_about_section=True,
        has_capacity_mention=True, has_history_mention=False,
        has_accessibility_info=True, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=20,
        internal_links_to_venue_info=True, content_chunk_count=4,
    ),
    "band-on-the-wall": dict(
        title="Band on the Wall | Manchester Music Venue",
        meta_description="Band on the Wall — a world-class music venue and arts charity in Manchester since 1947. Capacity 500.",
        h1_tags=["Band on the Wall"],
        h2_tags=["What's On", "About Us", "Visit", "FAQ", "Accessibility"],
        h3_tags=["Getting Here", "Parking", "Disabled Access", "Age Policy"],
        json_ld_blocks=[{
            "@type": "MusicVenue",
            "@context": "https://schema.org",
            "name": "Band on the Wall",
            "address": {"@type": "PostalAddress",
                        "streetAddress": "25 Swan Street",
                        "addressLocality": "Manchester", "postalCode": "M4 5JZ"},
            "maximumAttendeeCapacity": 500,
            "foundingDate": "1947",
            "sameAs": ["https://en.wikipedia.org/wiki/Band_on_the_Wall"],
        }],
        schema_types=["MusicVenue"],
        entity_name="Band on the Wall", entity_address="25 Swan Street",
        entity_city="Manchester", entity_capacity="500",
        word_count=510, paragraph_count=22,
        has_faq=True, faq_item_count=6, has_about_section=True,
        has_capacity_mention=True, has_history_mention=True,
        has_accessibility_info=True, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=20,
        internal_links_to_venue_info=True, content_chunk_count=5,
    ),
    # ── Yorkshire ─────────────────────────────────────────────────────────────
    "leadmill-sheffield": dict(
        title="The Leadmill | Sheffield's Independent Music Venue",
        meta_description="The Leadmill — Sheffield's legendary independent music and club venue since 1980. Capacity 900.",
        h1_tags=["The Leadmill"],
        h2_tags=["Gigs", "Club Nights", "About", "Visit"],
        h3_tags=["Getting Here", "Accessibility"],
        json_ld_blocks=[{
            "@type": "MusicVenue",
            "@context": "https://schema.org",
            "name": "The Leadmill",
            "address": {"@type": "PostalAddress",
                        "streetAddress": "6 Leadmill Road",
                        "addressLocality": "Sheffield", "postalCode": "S1 4SE"},
            "maximumAttendeeCapacity": 900,
        }],
        schema_types=["MusicVenue"],
        entity_name="The Leadmill", entity_address="6 Leadmill Road",
        entity_city="Sheffield", entity_capacity="900",
        word_count=310, paragraph_count=14,
        has_faq=False, faq_item_count=0, has_about_section=True,
        has_capacity_mention=True, has_history_mention=True,
        has_accessibility_info=True, has_transport_info=False,
        heading_hierarchy_valid=True, internal_link_count=14,
        internal_links_to_venue_info=False, content_chunk_count=3,
    ),
    "brudenell-social-club": dict(
        title="Brudenell Social Club | Leeds",
        meta_description="Brudenell Social Club — cult independent music venue in Hyde Park, Leeds.",
        h1_tags=["Brudenell Social Club"],
        h2_tags=["What's On", "About"],
        h3_tags=[],
        json_ld_blocks=[],
        schema_types=[],
        entity_name="Brudenell Social Club", entity_address="33 Queen's Road",
        entity_city="Leeds", entity_capacity="",
        word_count=160, paragraph_count=8,
        has_faq=False, faq_item_count=0, has_about_section=False,
        has_capacity_mention=False, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=False,
        heading_hierarchy_valid=True, internal_link_count=8,
        internal_links_to_venue_info=False, content_chunk_count=2,
    ),
    # ── South ─────────────────────────────────────────────────────────────────
    "swx-bristol": dict(
        title="SWX Bristol | Live Music Venue",
        meta_description="SWX is Bristol's premiere live music venue. Capacity 1,500.",
        h1_tags=["SWX"],
        h2_tags=["Events", "About SWX", "Getting Here"],
        h3_tags=["By Train", "Parking"],
        json_ld_blocks=[{
            "@type": "MusicVenue",
            "@context": "https://schema.org",
            "name": "SWX Bristol",
            "address": {"@type": "PostalAddress",
                        "streetAddress": "15 Nelson Street",
                        "addressLocality": "Bristol", "postalCode": "BS1 2JY"},
            "maximumAttendeeCapacity": 1500,
        }],
        schema_types=["MusicVenue"],
        entity_name="SWX Bristol", entity_address="15 Nelson Street",
        entity_city="Bristol", entity_capacity="1,500",
        word_count=270, paragraph_count=12,
        has_faq=False, faq_item_count=0, has_about_section=True,
        has_capacity_mention=True, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=13,
        internal_links_to_venue_info=True, content_chunk_count=3,
    ),
    # ── Scotland ──────────────────────────────────────────────────────────────
    "usher-hall-edinburgh": dict(
        title="Usher Hall | Edinburgh Concert Hall",
        meta_description="Usher Hall — Edinburgh's premier concert hall, capacity 2,900. Classical music, rock, pop and more since 1914.",
        h1_tags=["Usher Hall"],
        h2_tags=["What's On", "Visit", "About Usher Hall", "Getting Here",
                 "Accessibility", "FAQ"],
        h3_tags=["By Bus", "By Train", "Parking", "Wheelchair Access",
                 "Hearing Loop"],
        json_ld_blocks=[{
            "@type": "MusicVenue",
            "@context": "https://schema.org",
            "name": "Usher Hall",
            "address": {"@type": "PostalAddress",
                        "streetAddress": "Lothian Road",
                        "addressLocality": "Edinburgh", "postalCode": "EH1 2EA"},
            "maximumAttendeeCapacity": 2900,
            "foundingDate": "1914",
            "telephone": "+44 131 228 1155",
            "sameAs": ["https://en.wikipedia.org/wiki/Usher_Hall",
                       "https://www.wikidata.org/wiki/Q1622501"],
            "geo": {"@type": "GeoCoordinates", "latitude": 55.946, "longitude": -3.203},
        }],
        schema_types=["MusicVenue"],
        entity_name="Usher Hall", entity_address="Lothian Road",
        entity_city="Edinburgh", entity_capacity="2,900",
        entity_phone="+44 131 228 1155",
        word_count=620, paragraph_count=27,
        has_faq=True, faq_item_count=7, has_about_section=True,
        has_capacity_mention=True, has_history_mention=True,
        has_accessibility_info=True, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=26,
        internal_links_to_venue_info=True, content_chunk_count=6,
    ),
}


def build_signals(slug: str) -> "PageSignals":
    from crawler.extractor import PageSignals
    profile = PROFILES[slug]
    s = PageSignals()
    for k, v in profile.items():
        setattr(s, k, v)
    competitor = next(c for c in COMPETITORS if c["slug"] == slug)
    s.url = competitor["url"]
    return s


def main():
    from crawler.extractor import PageSignals  # noqa: F401
    reports = []
    for venue in COMPETITORS:
        slug = venue["slug"]
        signals = build_signals(slug)
        report = generate_report(venue, signals)
        reports.append(report)
        print(f"  {venue['name']:<40} AEO={report['aeo_score']:5.1f}  GEO={report['geo_score']:5.1f}")

    out = Path(__file__).parent / "data" / "competitors_sample.json"
    out.parent.mkdir(exist_ok=True)
    out.write_text(json.dumps(reports, indent=2, ensure_ascii=False))
    print(f"\nWrote {len(reports)} competitor reports → {out}")


if __name__ == "__main__":
    main()
