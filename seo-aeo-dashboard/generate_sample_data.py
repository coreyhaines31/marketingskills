#!/usr/bin/env python3
"""
Generates venues_sample.json from hardcoded known facts without live crawls.

Usage: python generate_sample_data.py
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from crawler.extractor import PageSignals
from crawler.venues import VENUES
from scoring.report_generator import generate_report

# Known facts per venue slug — based on site analysis of AMG template pages.
# AMG venues share a CMS; content depth varies by profile tier.
PROFILES = {
    "o2-academy-brixton": dict(
        title="O2 Academy Brixton | Live Music in London",
        meta_description="O2 Academy Brixton — iconic South London music venue, capacity 4,921. Tickets, events and venue info.",
        h1_tags=["O2 Academy Brixton"],
        h2_tags=["Upcoming Events", "Venue Information", "Getting Here", "Accessibility"],
        h3_tags=["By Tube", "By Bus", "Parking"],
        json_ld_blocks=[{"@type": "LocalBusiness", "@context": "https://schema.org",
                         "name": "O2 Academy Brixton",
                         "address": {"@type": "PostalAddress", "streetAddress": "211 Stockwell Road",
                                     "addressLocality": "London", "postalCode": "SW9 9SL"}}],
        schema_types=["LocalBusiness"],
        entity_name="O2 Academy Brixton", entity_address="211 Stockwell Road",
        entity_city="London", entity_capacity="4,921",
        word_count=520, paragraph_count=24,
        has_faq=False, faq_item_count=0, has_about_section=True,
        has_capacity_mention=True, has_history_mention=True,
        has_accessibility_info=True, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=22,
        internal_links_to_venue_info=True, content_chunk_count=4,
    ),
    "o2-academy-islington": dict(
        title="O2 Academy Islington | London",
        meta_description="O2 Academy Islington — intimate 800-capacity music venue in North London.",
        h1_tags=["O2 Academy Islington"], h2_tags=["Upcoming Events", "Venue Info"],
        h3_tags=["Location"], json_ld_blocks=[], schema_types=[],
        entity_name="O2 Academy Islington", entity_address="", entity_city="London",
        entity_capacity="", word_count=180, paragraph_count=10,
        has_faq=False, faq_item_count=0, has_about_section=False,
        has_capacity_mention=False, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=False,
        heading_hierarchy_valid=True, internal_link_count=12,
        internal_links_to_venue_info=False, content_chunk_count=2,
    ),
    "o2-forum-kentish-town": dict(
        title="O2 Forum Kentish Town | London",
        meta_description="O2 Forum Kentish Town — live music venue in North London.",
        h1_tags=["O2 Forum Kentish Town"], h2_tags=["Events", "Venue Info"],
        h3_tags=["Directions"], json_ld_blocks=[], schema_types=[],
        entity_name="O2 Forum Kentish Town", entity_address="", entity_city="London",
        entity_capacity="", word_count=170, paragraph_count=9,
        has_faq=False, faq_item_count=0, has_about_section=False,
        has_capacity_mention=False, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=False,
        heading_hierarchy_valid=True, internal_link_count=12,
        internal_links_to_venue_info=False, content_chunk_count=2,
    ),
    "o2-shepherds-bush-empire": dict(
        title="O2 Shepherd's Bush Empire | London",
        meta_description="O2 Shepherd's Bush Empire — historic 2,000-capacity venue in West London.",
        h1_tags=["O2 Shepherd's Bush Empire"],
        h2_tags=["Upcoming Events", "About the Venue", "Getting Here"],
        h3_tags=["By Tube", "By Bus"], json_ld_blocks=[], schema_types=[],
        entity_name="O2 Shepherd's Bush Empire", entity_address="", entity_city="London",
        entity_capacity="2,000", word_count=380, paragraph_count=18,
        has_faq=False, faq_item_count=0, has_about_section=True,
        has_capacity_mention=True, has_history_mention=True,
        has_accessibility_info=False, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=18,
        internal_links_to_venue_info=True, content_chunk_count=3,
    ),
    "o2-academy-birmingham": dict(
        title="O2 Academy Birmingham | Live Music",
        meta_description="O2 Academy Birmingham — 3,100-capacity live music venue in Birmingham city centre.",
        h1_tags=["O2 Academy Birmingham"],
        h2_tags=["Events", "About the Venue", "Getting Here"],
        h3_tags=["Transport Links", "Parking"], json_ld_blocks=[], schema_types=[],
        entity_name="O2 Academy Birmingham", entity_address="", entity_city="Birmingham",
        entity_capacity="3,100", word_count=350, paragraph_count=16,
        has_faq=False, faq_item_count=0, has_about_section=True,
        has_capacity_mention=True, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=16,
        internal_links_to_venue_info=True, content_chunk_count=3,
    ),
    "o2-institute-birmingham": dict(
        title="O2 Institute Birmingham | Live Music",
        meta_description="O2 Institute Birmingham — multi-room live music venue.",
        h1_tags=["O2 Institute Birmingham"], h2_tags=["Events", "Venue Info"],
        h3_tags=["Location"], json_ld_blocks=[], schema_types=[],
        entity_name="O2 Institute Birmingham", entity_address="", entity_city="Birmingham",
        entity_capacity="", word_count=150, paragraph_count=8,
        has_faq=False, faq_item_count=0, has_about_section=False,
        has_capacity_mention=False, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=False,
        heading_hierarchy_valid=True, internal_link_count=10,
        internal_links_to_venue_info=False, content_chunk_count=2,
    ),
    "o2-academy-leicester": dict(
        title="O2 Academy Leicester | Live Music",
        meta_description="O2 Academy Leicester — live music venue in Leicester city centre.",
        h1_tags=["O2 Academy Leicester"], h2_tags=["Events", "Venue Info"],
        h3_tags=["Directions"], json_ld_blocks=[], schema_types=[],
        entity_name="O2 Academy Leicester", entity_address="", entity_city="Leicester",
        entity_capacity="", word_count=160, paragraph_count=9,
        has_faq=False, faq_item_count=0, has_about_section=False,
        has_capacity_mention=False, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=False,
        heading_hierarchy_valid=True, internal_link_count=10,
        internal_links_to_venue_info=False, content_chunk_count=2,
    ),
    "o2-academy-oxford": dict(
        title="O2 Academy Oxford | Live Music",
        meta_description="O2 Academy Oxford — live music venue in central Oxford.",
        h1_tags=["O2 Academy Oxford"], h2_tags=["Events", "Getting Here"],
        h3_tags=["Directions"], json_ld_blocks=[], schema_types=[],
        entity_name="O2 Academy Oxford", entity_address="", entity_city="Oxford",
        entity_capacity="", word_count=200, paragraph_count=11,
        has_faq=False, faq_item_count=0, has_about_section=False,
        has_capacity_mention=False, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=12,
        internal_links_to_venue_info=False, content_chunk_count=2,
    ),
    "o2-academy-bournemouth": dict(
        title="O2 Academy Bournemouth | Live Music",
        meta_description="",
        h1_tags=["O2 Academy Bournemouth"], h2_tags=["Events", "Venue Info"],
        h3_tags=["Directions"], json_ld_blocks=[], schema_types=[],
        entity_name="O2 Academy Bournemouth", entity_address="", entity_city="Bournemouth",
        entity_capacity="", word_count=140, paragraph_count=8,
        has_faq=False, faq_item_count=0, has_about_section=False,
        has_capacity_mention=False, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=False,
        heading_hierarchy_valid=True, internal_link_count=8,
        internal_links_to_venue_info=False, content_chunk_count=2,
    ),
    "o2-academy-bristol": dict(
        title="O2 Academy Bristol | Live Music",
        meta_description="O2 Academy Bristol — 2,400-capacity music venue in Bristol.",
        h1_tags=["O2 Academy Bristol"],
        h2_tags=["Upcoming Events", "About the Venue", "Getting Here"],
        h3_tags=["By Train", "Parking"], json_ld_blocks=[], schema_types=[],
        entity_name="O2 Academy Bristol", entity_address="", entity_city="Bristol",
        entity_capacity="2,400", word_count=320, paragraph_count=14,
        has_faq=False, faq_item_count=0, has_about_section=True,
        has_capacity_mention=True, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=15,
        internal_links_to_venue_info=True, content_chunk_count=3,
    ),
    "o2-guildhall-southampton": dict(
        title="O2 Guildhall Southampton | Live Music",
        meta_description="O2 Guildhall Southampton — live music and events venue.",
        h1_tags=["O2 Guildhall Southampton"], h2_tags=["Events", "Venue Info"],
        h3_tags=["Directions"], json_ld_blocks=[], schema_types=[],
        entity_name="O2 Guildhall Southampton", entity_address="", entity_city="Southampton",
        entity_capacity="", word_count=170, paragraph_count=9,
        has_faq=False, faq_item_count=0, has_about_section=False,
        has_capacity_mention=False, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=False,
        heading_hierarchy_valid=True, internal_link_count=10,
        internal_links_to_venue_info=False, content_chunk_count=2,
    ),
    "o2-academy-liverpool": dict(
        title="O2 Academy Liverpool | Live Music",
        meta_description="O2 Academy Liverpool — 1,550-capacity music venue in Liverpool city centre.",
        h1_tags=["O2 Academy Liverpool"],
        h2_tags=["Events", "About the Venue", "Getting Here"],
        h3_tags=["By Train", "By Bus"], json_ld_blocks=[], schema_types=[],
        entity_name="O2 Academy Liverpool", entity_address="", entity_city="Liverpool",
        entity_capacity="1,550", word_count=310, paragraph_count=13,
        has_faq=False, faq_item_count=0, has_about_section=True,
        has_capacity_mention=True, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=15,
        internal_links_to_venue_info=True, content_chunk_count=3,
    ),
    "o2-ritz-manchester": dict(
        title="O2 Ritz Manchester | Live Music",
        meta_description="O2 Ritz Manchester — live music venue in Manchester.",
        h1_tags=["O2 Ritz Manchester"], h2_tags=["Events", "Venue Info"],
        h3_tags=["Directions"], json_ld_blocks=[], schema_types=[],
        entity_name="O2 Ritz Manchester", entity_address="", entity_city="Manchester",
        entity_capacity="", word_count=160, paragraph_count=9,
        has_faq=False, faq_item_count=0, has_about_section=False,
        has_capacity_mention=False, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=False,
        heading_hierarchy_valid=True, internal_link_count=10,
        internal_links_to_venue_info=False, content_chunk_count=2,
    ),
    "o2-victoria-warehouse-manchester": dict(
        title="O2 Victoria Warehouse Manchester | Live Music",
        meta_description="O2 Victoria Warehouse Manchester — 3,000-capacity warehouse venue.",
        h1_tags=["O2 Victoria Warehouse Manchester"],
        h2_tags=["Events", "About the Venue", "Getting Here"],
        h3_tags=["Transport"], json_ld_blocks=[], schema_types=[],
        entity_name="O2 Victoria Warehouse Manchester", entity_address="", entity_city="Manchester",
        entity_capacity="3,000", word_count=305, paragraph_count=13,
        has_faq=False, faq_item_count=0, has_about_section=True,
        has_capacity_mention=True, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=14,
        internal_links_to_venue_info=True, content_chunk_count=3,
    ),
    "o2-apollo-manchester": dict(
        title="O2 Apollo Manchester | Live Music",
        meta_description="O2 Apollo Manchester — historic 3,500-capacity Apollo Theatre, one of the UK's most iconic music venues.",
        h1_tags=["O2 Apollo Manchester"],
        h2_tags=["Upcoming Events", "About the Apollo", "Getting Here", "Accessibility"],
        h3_tags=["By Tram", "By Bus"], json_ld_blocks=[], schema_types=[],
        entity_name="O2 Apollo Manchester", entity_address="", entity_city="Manchester",
        entity_capacity="3,500", word_count=480, paragraph_count=20,
        has_faq=False, faq_item_count=0, has_about_section=True,
        has_capacity_mention=True, has_history_mention=True,
        has_accessibility_info=True, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=18,
        internal_links_to_venue_info=True, content_chunk_count=4,
    ),
    "o2-academy-leeds": dict(
        title="O2 Academy Leeds | Live Music",
        meta_description="O2 Academy Leeds — 2,300-capacity music venue in Leeds city centre.",
        h1_tags=["O2 Academy Leeds"],
        h2_tags=["Events", "About the Venue", "Getting Here"],
        h3_tags=["Transport"], json_ld_blocks=[], schema_types=[],
        entity_name="O2 Academy Leeds", entity_address="", entity_city="Leeds",
        entity_capacity="2,300", word_count=305, paragraph_count=13,
        has_faq=False, faq_item_count=0, has_about_section=True,
        has_capacity_mention=True, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=14,
        internal_links_to_venue_info=True, content_chunk_count=3,
    ),
    "o2-academy-sheffield": dict(
        title="O2 Academy Sheffield | Live Music",
        meta_description="",
        h1_tags=["O2 Academy Sheffield"], h2_tags=["Events", "Venue Info"],
        h3_tags=["Directions"], json_ld_blocks=[], schema_types=[],
        entity_name="O2 Academy Sheffield", entity_address="", entity_city="Sheffield",
        entity_capacity="", word_count=150, paragraph_count=8,
        has_faq=False, faq_item_count=0, has_about_section=False,
        has_capacity_mention=False, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=False,
        heading_hierarchy_valid=True, internal_link_count=9,
        internal_links_to_venue_info=False, content_chunk_count=2,
    ),
    "o2-city-hall-newcastle": dict(
        title="O2 City Hall Newcastle | Live Music",
        meta_description="O2 City Hall Newcastle — live music venue in Newcastle upon Tyne.",
        h1_tags=["O2 City Hall Newcastle"], h2_tags=["Events", "Venue Info"],
        h3_tags=["Directions"], json_ld_blocks=[], schema_types=[],
        entity_name="O2 City Hall Newcastle", entity_address="", entity_city="Newcastle",
        entity_capacity="", word_count=190, paragraph_count=10,
        has_faq=False, faq_item_count=0, has_about_section=False,
        has_capacity_mention=False, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=False,
        heading_hierarchy_valid=True, internal_link_count=11,
        internal_links_to_venue_info=False, content_chunk_count=2,
    ),
    "o2-academy-glasgow": dict(
        title="O2 Academy Glasgow | Live Music",
        meta_description="O2 Academy Glasgow — 2,500-capacity live music venue in Glasgow city centre.",
        h1_tags=["O2 Academy Glasgow"],
        h2_tags=["Upcoming Events", "About the Venue", "Getting Here"],
        h3_tags=["By Train", "Parking"], json_ld_blocks=[], schema_types=[],
        entity_name="O2 Academy Glasgow", entity_address="", entity_city="Glasgow",
        entity_capacity="2,500", word_count=300, paragraph_count=13,
        has_faq=False, faq_item_count=0, has_about_section=True,
        has_capacity_mention=True, has_history_mention=False,
        has_accessibility_info=False, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=15,
        internal_links_to_venue_info=True, content_chunk_count=3,
    ),
    "edinburgh-corn-exchange": dict(
        title="Edinburgh Corn Exchange | Live Music & Events Edinburgh",
        meta_description="Edinburgh Corn Exchange — stunning 3,500-capacity venue in Edinburgh. Live music, events and private hire since 1999.",
        h1_tags=["Edinburgh Corn Exchange"],
        h2_tags=["Upcoming Events", "About the Venue", "Getting Here", "Accessibility"],
        h3_tags=["By Train", "By Bus", "Parking"],
        json_ld_blocks=[{"@type": "Organization", "@context": "https://schema.org",
                         "name": "Edinburgh Corn Exchange",
                         "address": {"@type": "PostalAddress", "streetAddress": "10 New Market Road",
                                     "addressLocality": "Edinburgh", "postalCode": "EH14 1RJ"},
                         "telephone": "+44 131 477 3500"}],
        schema_types=["Organization"],
        entity_name="Edinburgh Corn Exchange", entity_address="10 New Market Road",
        entity_city="Edinburgh", entity_capacity="3,500", entity_phone="+44 131 477 3500",
        word_count=420, paragraph_count=19,
        has_faq=False, faq_item_count=0, has_about_section=True,
        has_capacity_mention=True, has_history_mention=True,
        has_accessibility_info=True, has_transport_info=True,
        heading_hierarchy_valid=True, internal_link_count=18,
        internal_links_to_venue_info=True, content_chunk_count=4,
    ),
}


def build_signals(slug: str) -> PageSignals:
    profile = PROFILES[slug]
    s = PageSignals()
    for k, v in profile.items():
        setattr(s, k, v)
    # url from venue list
    venue = next(v for v in VENUES if v["slug"] == slug)
    s.url = venue["url"]
    return s


def main():
    reports = []
    for venue in VENUES:
        slug = venue["slug"]
        signals = build_signals(slug)
        report = generate_report(venue, signals)
        reports.append(report)
        print(f"  {venue['name']:<45} AEO={report['aeo_score']:5.1f}  GEO={report['geo_score']:5.1f}")

    out = Path(__file__).parent / "data" / "venues_sample.json"
    out.parent.mkdir(exist_ok=True)
    out.write_text(json.dumps(reports, indent=2, ensure_ascii=False))
    print(f"\nWrote {len(reports)} venue reports → {out}")


if __name__ == "__main__":
    main()
