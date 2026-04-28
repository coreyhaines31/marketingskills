"""
Async venue crawler.
Fetches HTML for each venue's homepage and optional sub-pages, then calls the extractor.
"""

import asyncio
import logging
from typing import Any

import httpx

from .extractor import PageSignals, extract_signals
from .venues import VENUES

logger = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; AEOGEOBot/1.0; +https://github.com/lmhgn/marketing)"
    ),
    "Accept-Language": "en-GB,en;q=0.9",
}
TIMEOUT = 20
MAX_CONCURRENT = 4


async def _fetch(client: httpx.AsyncClient, url: str) -> tuple[str, str | None]:
    try:
        response = await client.get(url, follow_redirects=True, timeout=TIMEOUT)
        response.raise_for_status()
        return url, response.text
    except httpx.HTTPStatusError as exc:
        logger.warning("HTTP %s for %s", exc.response.status_code, url)
        return url, None
    except Exception as exc:
        logger.warning("Failed to fetch %s: %s", url, exc)
        return url, None


async def crawl_venue(
    client: httpx.AsyncClient,
    venue: dict,
    semaphore: asyncio.Semaphore,
) -> dict[str, Any]:
    async with semaphore:
        urls_to_crawl = [venue["url"]] + venue.get("additional_pages", [])
        tasks = [_fetch(client, u) for u in urls_to_crawl]
        results = await asyncio.gather(*tasks)

    combined_signals: PageSignals | None = None
    for url, html in results:
        if html is None:
            continue
        page_signals = extract_signals(html, url)
        if combined_signals is None:
            combined_signals = page_signals
        else:
            # Merge: take the richer value for key entity fields
            combined_signals.entity_capacity = (
                combined_signals.entity_capacity or page_signals.entity_capacity
            )
            combined_signals.entity_address = (
                combined_signals.entity_address or page_signals.entity_address
            )
            combined_signals.entity_description = (
                combined_signals.entity_description or page_signals.entity_description
            )
            combined_signals.has_faq = combined_signals.has_faq or page_signals.has_faq
            combined_signals.faq_item_count += page_signals.faq_item_count
            combined_signals.has_about_section = (
                combined_signals.has_about_section or page_signals.has_about_section
            )
            combined_signals.has_capacity_mention = (
                combined_signals.has_capacity_mention or page_signals.has_capacity_mention
            )
            combined_signals.has_history_mention = (
                combined_signals.has_history_mention or page_signals.has_history_mention
            )
            combined_signals.has_accessibility_info = (
                combined_signals.has_accessibility_info or page_signals.has_accessibility_info
            )
            combined_signals.has_transport_info = (
                combined_signals.has_transport_info or page_signals.has_transport_info
            )
            combined_signals.internal_link_count += page_signals.internal_link_count
            combined_signals.word_count += page_signals.word_count
            combined_signals.json_ld_blocks.extend(page_signals.json_ld_blocks)
            combined_signals.schema_types.extend(page_signals.schema_types)

    if combined_signals is None:
        combined_signals = PageSignals(url=venue["url"])
        combined_signals.crawl_errors.append("All pages failed to fetch")

    return {
        "venue": venue,
        "signals": combined_signals,
    }


async def crawl_all(venues: list[dict] | None = None) -> list[dict[str, Any]]:
    if venues is None:
        venues = VENUES

    semaphore = asyncio.Semaphore(MAX_CONCURRENT)
    async with httpx.AsyncClient(headers=HEADERS) as client:
        tasks = [crawl_venue(client, v, semaphore) for v in venues]
        return await asyncio.gather(*tasks)


def run_crawl(venues: list[dict] | None = None) -> list[dict[str, Any]]:
    return asyncio.run(crawl_all(venues))
