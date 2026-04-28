"""
LLM citation runner — sends each prompt to the Claude API and detects
which venues are mentioned in each response.

Requirements:
    pip install anthropic
    export ANTHROPIC_API_KEY=sk-ant-...

Usage:
    from llm_simulation.runner import run_simulation
    results = run_simulation(venues, prompts, model="claude-opus-4-5")
"""

import os
import re
import logging
from dataclasses import dataclass

from .prompts import Prompt

logger = logging.getLogger(__name__)

DEFAULT_MODEL = "claude-opus-4-5"

# System prompt that keeps responses grounded and citable
SYSTEM_PROMPT = (
    "You are a knowledgeable music industry assistant. Answer questions about "
    "UK live music venues accurately and concisely. Name specific venues where "
    "relevant. Do not invent venues that do not exist."
)


@dataclass
class PromptResult:
    prompt_id: str
    prompt_text: str
    response_text: str
    venues_cited: list[str]   # slugs


def _detect_citations(response: str, venues: list[dict]) -> list[str]:
    """Return slugs of venues whose name appears in the response."""
    cited = []
    lower = response.lower()
    for v in venues:
        # Try full name and common short forms
        name = v["name"].lower()
        slug_words = v["slug"].replace("-", " ")
        if name in lower or slug_words in lower:
            cited.append(v["slug"])
            continue
        # Also match bare venue name without brand prefix (e.g. "Brixton Academy")
        bare = re.sub(r"^o2\s+", "", name).strip()
        if bare and bare in lower:
            cited.append(v["slug"])
    return list(set(cited))


def run_simulation(
    venues: list[dict],
    prompts: list[Prompt],
    model: str = DEFAULT_MODEL,
) -> list[PromptResult]:
    """
    Run every prompt against the Claude API and return citation results.
    Raises EnvironmentError if ANTHROPIC_API_KEY is not set.
    """
    try:
        import anthropic
    except ImportError:
        raise ImportError("anthropic package required: pip install anthropic")

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise EnvironmentError(
            "ANTHROPIC_API_KEY environment variable is not set. "
            "Run generate_citation_sample.py to produce sample data without an API key."
        )

    client = anthropic.Anthropic(api_key=api_key)
    results: list[PromptResult] = []

    for prompt in prompts:
        logger.info("Running prompt %s: %s", prompt.id, prompt.text[:60])
        try:
            message = client.messages.create(
                model=model,
                max_tokens=800,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": prompt.text}],
            )
            response_text = message.content[0].text
        except Exception as exc:
            logger.warning("Prompt %s failed: %s", prompt.id, exc)
            response_text = ""

        cited = _detect_citations(response_text, venues)
        logger.info(
            "  → %d venue(s) cited: %s",
            len(cited),
            ", ".join(cited) if cited else "none",
        )
        results.append(PromptResult(
            prompt_id=prompt.id,
            prompt_text=prompt.text,
            response_text=response_text,
            venues_cited=cited,
        ))

    return results
