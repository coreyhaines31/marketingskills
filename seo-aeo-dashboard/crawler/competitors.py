"""
Competitor venue configuration — 10 independent UK music venues used for
benchmarking against the O2/AMG portfolio.
"""

COMPETITORS = [
    # London
    {
        "slug": "roundhouse",
        "name": "Roundhouse",
        "region": "London",
        "url": "https://www.roundhouse.org.uk",
        "additional_pages": [
            "https://www.roundhouse.org.uk/visit/getting-here",
            "https://www.roundhouse.org.uk/about-us",
        ],
    },
    {
        "slug": "koko-london",
        "name": "KOKO",
        "region": "London",
        "url": "https://koko.uk.com",
        "additional_pages": [],
    },
    {
        "slug": "electric-ballroom",
        "name": "Electric Ballroom",
        "region": "London",
        "url": "https://electricballroom.co.uk",
        "additional_pages": [],
    },
    {
        "slug": "fabric-london",
        "name": "Fabric",
        "region": "London",
        "url": "https://www.fabriclondon.com",
        "additional_pages": [],
    },
    # North West
    {
        "slug": "manchester-academy",
        "name": "Manchester Academy",
        "region": "North West",
        "url": "https://www.manchesteracademy.net",
        "additional_pages": [],
    },
    {
        "slug": "band-on-the-wall",
        "name": "Band on the Wall",
        "region": "North West",
        "url": "https://bandonthewall.org",
        "additional_pages": [],
    },
    # Yorkshire
    {
        "slug": "leadmill-sheffield",
        "name": "The Leadmill",
        "region": "Yorkshire",
        "url": "https://www.leadmill.co.uk",
        "additional_pages": [],
    },
    {
        "slug": "brudenell-social-club",
        "name": "Brudenell Social Club",
        "region": "Yorkshire",
        "url": "https://brudenellsocialclub.co.uk",
        "additional_pages": [],
    },
    # South
    {
        "slug": "swx-bristol",
        "name": "SWX Bristol",
        "region": "South",
        "url": "https://www.swxbristol.com",
        "additional_pages": [],
    },
    # Scotland
    {
        "slug": "usher-hall-edinburgh",
        "name": "Usher Hall",
        "region": "Scotland",
        "url": "https://www.usherhall.co.uk",
        "additional_pages": [
            "https://www.usherhall.co.uk/visit/getting-here",
        ],
    },
]
