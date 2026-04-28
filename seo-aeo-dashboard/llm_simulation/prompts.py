"""
Test prompt suite for LLM citation simulation.

Each prompt simulates a real user query to an AI assistant (ChatGPT, Claude,
Gemini, Perplexity). We measure whether each venue appears in the response.

Prompts are tagged with:
  - intent: what the user is trying to find
  - region_filter: if set, only venues in this region are eligible candidates
  - capacity_hint: "small" | "mid" | "large" — venues outside this range get a
    lower base citation probability during simulation
"""

from typing import Optional
from dataclasses import dataclass


@dataclass
class Prompt:
    id: str
    text: str
    intent: str
    region_filter: Optional[str] = None   # matches venue["region"]
    capacity_hint: Optional[str] = None   # "small" | "mid" | "large"


PROMPTS: list[Prompt] = [
    Prompt(
        id="p01",
        text="What are the best music venues in London for mid-size concerts?",
        intent="regional_recommendation",
        region_filter="London",
        capacity_hint="mid",
    ),
    Prompt(
        id="p02",
        text="Where can I see live music in Manchester? Looking for a great atmosphere.",
        intent="regional_discovery",
        region_filter="North West",
    ),
    Prompt(
        id="p03",
        text="Which UK music venues are best known for indie and alternative gigs?",
        intent="genre_recommendation",
    ),
    Prompt(
        id="p04",
        text="I'm planning a UK tour. Which cities and venues should I consider for 3,000–5,000 capacity shows?",
        intent="touring_planning",
        capacity_hint="mid",
    ),
    Prompt(
        id="p05",
        text="What are the top live music venues in Scotland?",
        intent="regional_recommendation",
        region_filter="Scotland",
    ),
    Prompt(
        id="p06",
        text="Best music venues in Birmingham for a night out?",
        intent="regional_discovery",
        region_filter="Midlands",
    ),
    Prompt(
        id="p07",
        text="Where do major UK tours usually play in London?",
        intent="touring_planning",
        region_filter="London",
        capacity_hint="large",
    ),
    Prompt(
        id="p08",
        text="What are the most iconic live music venues in the UK?",
        intent="iconic_list",
    ),
    Prompt(
        id="p09",
        text="I'm visiting Bristol — where should I go to see live music?",
        intent="regional_discovery",
        region_filter="South",
    ),
    Prompt(
        id="p10",
        text="Which venues in Leeds and Sheffield have the best live music scenes?",
        intent="regional_discovery",
        region_filter="Yorkshire",
    ),
    Prompt(
        id="p11",
        text="What are the best standing-only music venues in the UK for an intimate gig experience?",
        intent="format_preference",
        capacity_hint="small",
    ),
    Prompt(
        id="p12",
        text="I want to see a big-name artist live in the UK without going to a stadium. What venues should I consider?",
        intent="capacity_preference",
        capacity_hint="large",
    ),
]
