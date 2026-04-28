"""
HTML signal extractor.
Parses a crawled page and returns a normalised PageSignals dict consumed by the scorers.
"""

import json
import re
from dataclasses import dataclass, field
from typing import Any
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup


@dataclass
class PageSignals:
    url: str = ""
    title: str = ""
    meta_description: str = ""
    h1_tags: list[str] = field(default_factory=list)
    h2_tags: list[str] = field(default_factory=list)
    h3_tags: list[str] = field(default_factory=list)
    # Structured data
    json_ld_blocks: list[dict] = field(default_factory=list)
    schema_types: list[str] = field(default_factory=list)
    # Entity signals
    entity_name: str = ""
    entity_address: str = ""
    entity_city: str = ""
    entity_capacity: str = ""
    entity_description: str = ""
    entity_phone: str = ""
    # Content signals
    word_count: int = 0
    paragraph_count: int = 0
    has_faq: bool = False
    faq_item_count: int = 0
    has_about_section: bool = False
    has_capacity_mention: bool = False
    has_history_mention: bool = False
    has_accessibility_info: bool = False
    has_transport_info: bool = False
    # Heading hierarchy
    heading_hierarchy_valid: bool = False
    # Internal links
    internal_link_count: int = 0
    internal_links_to_venue_info: bool = False
    # Content chunks (H2-separated sections)
    content_chunk_count: int = 0
    # Errors / warnings
    crawl_errors: list[str] = field(default_factory=list)


def extract_signals(html: str, url: str) -> PageSignals:
    signals = PageSignals(url=url)
    soup = BeautifulSoup(html, "html.parser")
    domain = urlparse(url).netloc

    signals.title = _text(soup.find("title"))
    meta = soup.find("meta", attrs={"name": "description"})
    signals.meta_description = meta.get("content", "") if meta else ""

    signals.h1_tags = [_text(t) for t in soup.find_all("h1")]
    signals.h2_tags = [_text(t) for t in soup.find_all("h2")]
    signals.h3_tags = [_text(t) for t in soup.find_all("h3")]

    _extract_json_ld(soup, signals)
    _extract_entity_signals(soup, signals)
    _extract_content_signals(soup, signals)
    _extract_internal_links(soup, url, domain, signals)
    _validate_heading_hierarchy(signals)

    return signals


# ---------------------------------------------------------------------------
# Private helpers
# ---------------------------------------------------------------------------

def _text(tag) -> str:
    return tag.get_text(separator=" ", strip=True) if tag else ""


def _extract_json_ld(soup: BeautifulSoup, signals: PageSignals) -> None:
    for script in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(script.string or "")
            if isinstance(data, list):
                signals.json_ld_blocks.extend(data)
            else:
                signals.json_ld_blocks.append(data)
        except (json.JSONDecodeError, TypeError):
            signals.crawl_errors.append("Malformed JSON-LD block found")

    for block in signals.json_ld_blocks:
        schema_type = block.get("@type", "")
        if isinstance(schema_type, list):
            signals.schema_types.extend(schema_type)
        elif schema_type:
            signals.schema_types.append(schema_type)
        # Pull entity data from schema if present
        if schema_type in ("MusicVenue", "EventVenue", "Organization", "LocalBusiness"):
            signals.entity_name = signals.entity_name or block.get("name", "")
            signals.entity_description = signals.entity_description or block.get("description", "")
            addr = block.get("address", {})
            if isinstance(addr, dict):
                signals.entity_address = addr.get("streetAddress", "")
                signals.entity_city = addr.get("addressLocality", "")
            signals.entity_capacity = signals.entity_capacity or str(block.get("maximumAttendeeCapacity", ""))
            signals.entity_phone = signals.entity_phone or block.get("telephone", "")


def _extract_entity_signals(soup: BeautifulSoup, signals: PageSignals) -> None:
    full_text = soup.get_text(separator=" ", strip=True).lower()

    capacity_patterns = [
        r"capacity[:\s]+[\d,]+",
        r"[\d,]+\s*(?:standing|seated|capacity)",
        r"holds?\s+(?:up\s+to\s+)?[\d,]+",
    ]
    for pattern in capacity_patterns:
        m = re.search(pattern, full_text)
        if m:
            signals.has_capacity_mention = True
            if not signals.entity_capacity:
                signals.entity_capacity = m.group(0)
            break

    signals.has_history_mention = bool(
        re.search(r"\b(opened|founded|established|since\s+\d{4}|history|heritage|original)\b", full_text)
    )
    signals.has_accessibility_info = bool(
        re.search(r"\b(accessib|wheelchair|disabled|hearing\s+loop|bsl|step.free)\b", full_text)
    )
    signals.has_transport_info = bool(
        re.search(r"\b(tube|underground|bus|train|parking|directions|how\s+to\s+get)\b", full_text)
    )

    if not signals.entity_name:
        if signals.h1_tags:
            signals.entity_name = signals.h1_tags[0]
        elif signals.title:
            signals.entity_name = signals.title.split("|")[0].strip()


def _extract_content_signals(soup: BeautifulSoup, signals: PageSignals) -> None:
    paragraphs = soup.find_all("p")
    signals.paragraph_count = len(paragraphs)
    signals.word_count = sum(len(_text(p).split()) for p in paragraphs)

    # FAQ detection — schema FAQPage or markup patterns
    faq_schemas = [b for b in signals.json_ld_blocks if b.get("@type") == "FAQPage"]
    if faq_schemas:
        signals.has_faq = True
        for block in faq_schemas:
            signals.faq_item_count += len(block.get("mainEntity", []))

    # Also detect HTML-pattern FAQs (dt/dd, details/summary, or question-answer heading pairs)
    if not signals.has_faq:
        faq_hints = soup.find_all(
            lambda tag: tag.name in ("details", "dt")
            or (tag.name in ("h2", "h3") and re.search(r"\?", _text(tag)))
        )
        if len(faq_hints) >= 2:
            signals.has_faq = True
            signals.faq_item_count = len(faq_hints)

    about_keywords = ["about", "venue info", "venue information", "the venue", "our venue"]
    combined_headings = " ".join(signals.h2_tags + signals.h3_tags).lower()
    signals.has_about_section = any(kw in combined_headings for kw in about_keywords)

    # Count H2-delimited content chunks as a proxy for LLM-readable structure
    signals.content_chunk_count = len(signals.h2_tags)


def _extract_internal_links(
    soup: BeautifulSoup, base_url: str, domain: str, signals: PageSignals
) -> None:
    venue_info_patterns = ["venue", "about", "info", "accessibility", "directions", "parking"]
    for anchor in soup.find_all("a", href=True):
        href = urljoin(base_url, anchor["href"])
        if urlparse(href).netloc == domain:
            signals.internal_link_count += 1
            path = urlparse(href).path.lower()
            if any(p in path for p in venue_info_patterns):
                signals.internal_links_to_venue_info = True


def _validate_heading_hierarchy(signals: PageSignals) -> None:
    signals.heading_hierarchy_valid = (
        len(signals.h1_tags) == 1 and len(signals.h2_tags) >= 2
    )
