#!/usr/bin/env python3
"""
Schema Markup Generator for SEO Content

Generates valid JSON-LD schema markup for common content types.
Outputs can be directly embedded in HTML <script type="application/ld+json"> tags.

Usage:
    python generate_schema.py article --title "My Article" --author "John Doe" --date "2024-01-15"
    python generate_schema.py faq --questions "Q1?|A1" "Q2?|A2"
    python generate_schema.py howto --title "How to Do X" --steps "Step 1|Do this" "Step 2|Do that"
"""

import json
import argparse
from datetime import datetime
from typing import List, Dict, Any, Optional


def generate_article_schema(
    headline: str,
    author_name: str,
    date_published: str,
    description: str = "",
    image_url: str = "",
    date_modified: str = "",
    publisher_name: str = "",
    publisher_logo: str = "",
    canonical_url: str = ""
) -> Dict[str, Any]:
    """Generate Article schema markup."""
    
    schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": headline[:110],  # Max 110 characters
        "author": {
            "@type": "Person",
            "name": author_name
        },
        "datePublished": date_published
    }
    
    if description:
        schema["description"] = description[:160]
    
    if image_url:
        schema["image"] = image_url
    
    if date_modified:
        schema["dateModified"] = date_modified
    else:
        schema["dateModified"] = date_published
    
    if publisher_name:
        schema["publisher"] = {
            "@type": "Organization",
            "name": publisher_name
        }
        if publisher_logo:
            schema["publisher"]["logo"] = {
                "@type": "ImageObject",
                "url": publisher_logo
            }
    
    if canonical_url:
        schema["mainEntityOfPage"] = {
            "@type": "WebPage",
            "@id": canonical_url
        }
    
    return schema


def generate_faq_schema(questions_answers: List[tuple]) -> Dict[str, Any]:
    """
    Generate FAQPage schema markup.
    
    Args:
        questions_answers: List of (question, answer) tuples
    """
    
    schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": []
    }
    
    for question, answer in questions_answers:
        schema["mainEntity"].append({
            "@type": "Question",
            "name": question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": answer
            }
        })
    
    return schema


def generate_howto_schema(
    name: str,
    steps: List[tuple],
    description: str = "",
    total_time_minutes: int = 0,
    image_url: str = "",
    supplies: List[str] = None,
    tools: List[str] = None
) -> Dict[str, Any]:
    """
    Generate HowTo schema markup.
    
    Args:
        name: Title of the how-to
        steps: List of (step_name, step_text) tuples
        description: Brief description
        total_time_minutes: Estimated completion time
        image_url: Featured image URL
        supplies: List of required supplies
        tools: List of required tools
    """
    
    schema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": name,
        "step": []
    }
    
    if description:
        schema["description"] = description
    
    if total_time_minutes > 0:
        schema["totalTime"] = f"PT{total_time_minutes}M"
    
    if image_url:
        schema["image"] = image_url
    
    if supplies:
        schema["supply"] = [
            {"@type": "HowToSupply", "name": supply}
            for supply in supplies
        ]
    
    if tools:
        schema["tool"] = [
            {"@type": "HowToTool", "name": tool}
            for tool in tools
        ]
    
    for i, (step_name, step_text) in enumerate(steps, 1):
        schema["step"].append({
            "@type": "HowToStep",
            "position": i,
            "name": step_name,
            "text": step_text
        })
    
    return schema


def generate_product_schema(
    name: str,
    description: str,
    price: float,
    currency: str = "USD",
    image_url: str = "",
    brand: str = "",
    sku: str = "",
    availability: str = "InStock",
    rating_value: float = 0,
    review_count: int = 0,
    url: str = ""
) -> Dict[str, Any]:
    """Generate Product schema markup."""
    
    schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": name,
        "description": description,
        "offers": {
            "@type": "Offer",
            "priceCurrency": currency,
            "price": price,
            "availability": f"https://schema.org/{availability}"
        }
    }
    
    if image_url:
        schema["image"] = image_url
    
    if brand:
        schema["brand"] = {
            "@type": "Brand",
            "name": brand
        }
    
    if sku:
        schema["sku"] = sku
    
    if url:
        schema["offers"]["url"] = url
    
    if rating_value > 0 and review_count > 0:
        schema["aggregateRating"] = {
            "@type": "AggregateRating",
            "ratingValue": rating_value,
            "reviewCount": review_count
        }
    
    return schema


def generate_local_business_schema(
    name: str,
    street_address: str,
    city: str,
    state: str,
    postal_code: str,
    country: str = "US",
    phone: str = "",
    url: str = "",
    description: str = "",
    price_range: str = "",
    latitude: float = 0,
    longitude: float = 0,
    image_url: str = ""
) -> Dict[str, Any]:
    """Generate LocalBusiness schema markup."""
    
    schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": name,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": street_address,
            "addressLocality": city,
            "addressRegion": state,
            "postalCode": postal_code,
            "addressCountry": country
        }
    }
    
    if phone:
        schema["telephone"] = phone
    
    if url:
        schema["url"] = url
    
    if description:
        schema["description"] = description
    
    if price_range:
        schema["priceRange"] = price_range
    
    if latitude and longitude:
        schema["geo"] = {
            "@type": "GeoCoordinates",
            "latitude": latitude,
            "longitude": longitude
        }
    
    if image_url:
        schema["image"] = image_url
    
    return schema


def generate_breadcrumb_schema(breadcrumbs: List[tuple]) -> Dict[str, Any]:
    """
    Generate BreadcrumbList schema markup.
    
    Args:
        breadcrumbs: List of (name, url) tuples in order
    """
    
    schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": []
    }
    
    for position, (name, url) in enumerate(breadcrumbs, 1):
        schema["itemListElement"].append({
            "@type": "ListItem",
            "position": position,
            "name": name,
            "item": url
        })
    
    return schema


def generate_organization_schema(
    name: str,
    url: str,
    logo_url: str = "",
    description: str = "",
    social_urls: List[str] = None,
    founding_date: str = "",
    founder_name: str = "",
    contact_phone: str = "",
    contact_email: str = ""
) -> Dict[str, Any]:
    """Generate Organization schema markup."""
    
    schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": name,
        "url": url
    }
    
    if logo_url:
        schema["logo"] = logo_url
    
    if description:
        schema["description"] = description
    
    if social_urls:
        schema["sameAs"] = social_urls
    
    if founding_date:
        schema["foundingDate"] = founding_date
    
    if founder_name:
        schema["founder"] = {
            "@type": "Person",
            "name": founder_name
        }
    
    if contact_phone or contact_email:
        schema["contactPoint"] = {
            "@type": "ContactPoint",
            "contactType": "customer service"
        }
        if contact_phone:
            schema["contactPoint"]["telephone"] = contact_phone
        if contact_email:
            schema["contactPoint"]["email"] = contact_email
    
    return schema


def output_schema(schema: Dict[str, Any], minify: bool = False) -> str:
    """Output schema as formatted JSON-LD string."""
    if minify:
        return json.dumps(schema, separators=(',', ':'))
    return json.dumps(schema, indent=2)


def wrap_in_script_tag(schema_json: str) -> str:
    """Wrap JSON-LD in HTML script tag."""
    return f'<script type="application/ld+json">\n{schema_json}\n</script>'


def main():
    parser = argparse.ArgumentParser(
        description="Generate JSON-LD schema markup for SEO content"
    )
    
    subparsers = parser.add_subparsers(dest="schema_type", help="Schema type to generate")
    
    # Article parser
    article_parser = subparsers.add_parser("article", help="Generate Article schema")
    article_parser.add_argument("--title", required=True, help="Article headline")
    article_parser.add_argument("--author", required=True, help="Author name")
    article_parser.add_argument("--date", required=True, help="Publication date (YYYY-MM-DD)")
    article_parser.add_argument("--description", default="", help="Meta description")
    article_parser.add_argument("--image", default="", help="Featured image URL")
    article_parser.add_argument("--publisher", default="", help="Publisher name")
    article_parser.add_argument("--url", default="", help="Canonical URL")
    
    # FAQ parser
    faq_parser = subparsers.add_parser("faq", help="Generate FAQPage schema")
    faq_parser.add_argument("--questions", nargs="+", required=True,
                          help="Questions and answers in format 'Question?|Answer'")
    
    # HowTo parser
    howto_parser = subparsers.add_parser("howto", help="Generate HowTo schema")
    howto_parser.add_argument("--title", required=True, help="How-to title")
    howto_parser.add_argument("--steps", nargs="+", required=True,
                            help="Steps in format 'Step Name|Step instructions'")
    howto_parser.add_argument("--description", default="", help="Description")
    howto_parser.add_argument("--time", type=int, default=0, help="Total time in minutes")
    
    # Common arguments
    parser.add_argument("--minify", action="store_true", help="Minify JSON output")
    parser.add_argument("--wrap", action="store_true", help="Wrap in script tag")
    
    args = parser.parse_args()
    
    schema = None
    
    if args.schema_type == "article":
        schema = generate_article_schema(
            headline=args.title,
            author_name=args.author,
            date_published=args.date,
            description=args.description,
            image_url=args.image,
            publisher_name=args.publisher,
            canonical_url=args.url
        )
    
    elif args.schema_type == "faq":
        qa_pairs = []
        for qa in args.questions:
            parts = qa.split("|", 1)
            if len(parts) == 2:
                qa_pairs.append((parts[0], parts[1]))
        schema = generate_faq_schema(qa_pairs)
    
    elif args.schema_type == "howto":
        steps = []
        for step in args.steps:
            parts = step.split("|", 1)
            if len(parts) == 2:
                steps.append((parts[0], parts[1]))
        schema = generate_howto_schema(
            name=args.title,
            steps=steps,
            description=args.description,
            total_time_minutes=args.time
        )
    
    if schema:
        output = output_schema(schema, args.minify)
        if args.wrap:
            output = wrap_in_script_tag(output)
        print(output)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
