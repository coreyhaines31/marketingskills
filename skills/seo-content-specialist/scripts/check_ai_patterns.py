#!/usr/bin/env python3
"""
AI Pattern Checker for SEO Content

Scans content for words, phrases, and patterns commonly associated with 
AI-generated text. Generates a detailed report with flagged items,
suggested replacements, and an overall "human-like" score.

Usage:
    python check_ai_patterns.py content.md
    python check_ai_patterns.py content.md --strict
    python check_ai_patterns.py content.md --json
    cat content.md | python check_ai_patterns.py --stdin

The script uses patterns from references/ai-phrases-to-avoid.md when available,
or falls back to built-in patterns.
"""

import argparse
import re
import sys
import json
from pathlib import Path
from typing import Dict, List, Tuple, Any, Optional
from dataclasses import dataclass, field, asdict
from collections import defaultdict


@dataclass
class PatternMatch:
    """Represents a matched AI pattern in content."""
    pattern: str
    category: str
    line_number: int
    line_text: str
    suggestion: str = ""
    severity: str = "medium"  # low, medium, high


@dataclass
class AnalysisResult:
    """Complete analysis result."""
    score: int  # 0-100, higher = more human-like
    total_matches: int
    em_dash_count: int
    matches_by_category: Dict[str, int] = field(default_factory=dict)
    flagged_items: List[PatternMatch] = field(default_factory=list)
    summary: str = ""
    recommendations: List[str] = field(default_factory=list)


# Built-in patterns (used if reference file not found)
BUILTIN_PATTERNS = {
    "overused_verbs": {
        "patterns": {
            "delve": "explore, examine, investigate, look at",
            "delving": "exploring, examining, investigating",
            "leverage": "use, apply, draw on",
            "leveraging": "using, applying",
            "utilize": "use",
            "utilizing": "using",
            "utilise": "use",
            "utilising": "using",
            "facilitate": "help, enable, support",
            "facilitating": "helping, enabling",
            "foster": "encourage, support, develop",
            "fostering": "encouraging, supporting",
            "bolster": "strengthen, support, reinforce",
            "underscore": "emphasise, highlight, stress",
            "underscores": "emphasises, highlights",
            "unveil": "reveal, show, introduce",
            "unveiling": "revealing, showing",
            "navigate": "manage, handle, work through",
            "navigating": "managing, handling",
            "streamline": "simplify, make efficient",
            "enhance": "improve, strengthen",
            "enhancing": "improving, strengthening",
            "endeavour": "try, attempt",
            "endeavor": "try, attempt",
            "ascertain": "find out, determine",
            "elucidate": "explain, clarify",
        },
        "severity": "medium"
    },
    "overused_adjectives": {
        "patterns": {
            "robust": "strong, reliable, solid",
            "comprehensive": "complete, thorough, full",
            "pivotal": "key, critical, important",
            "crucial": "important, key, essential",
            "vital": "important, essential",
            "transformative": "significant, important",
            "cutting-edge": "new, advanced, modern",
            "groundbreaking": "new, original, significant",
            "innovative": "new, original, creative",
            "seamless": "smooth, easy, effortless",
            "intricate": "complex, detailed",
            "nuanced": "subtle, complex",
            "multifaceted": "complex, varied",
            "holistic": "complete, whole",
        },
        "severity": "medium"
    },
    "overused_transitions": {
        "patterns": {
            "furthermore": "also, in addition, and",
            "moreover": "also, and, besides",
            "notwithstanding": "despite, even so, still",
            "that being said": "however, but, still",
            "at its core": "essentially, basically",
            "to put it simply": "in short, simply",
            "it is worth noting that": "note that, importantly",
            "in the realm of": "in, within, regarding",
            "in the landscape of": "in, within",
            "in today's": "currently, now, today",
        },
        "severity": "medium"
    },
    "opening_phrases": {
        "patterns": {
            "in today's fast-paced world": "[remove or be specific]",
            "in today's digital age": "[remove or be specific]",
            "in an era of": "[remove or be specific]",
            "in the ever-evolving landscape": "[remove or be specific]",
            "in the ever-changing landscape": "[remove or be specific]",
            "it's important to note that": "[remove - just state the point]",
            "let's delve into": "let's look at, let's explore",
            "imagine a world where": "[remove or be specific]",
        },
        "severity": "high"
    },
    "transitional_phrases": {
        "patterns": {
            "with that in mind": "so, therefore",
            "it's worth mentioning that": "[remove - just mention it]",
            "in essence": "essentially, basically",
            "this begs the question": "this raises the question",
        },
        "severity": "medium"
    },
    "concluding_phrases": {
        "patterns": {
            "in conclusion": "[remove or rephrase]",
            "to sum up": "overall, in short",
            "in the final analysis": "[remove]",
            "all things considered": "overall",
            "at the end of the day": "ultimately, in the end",
        },
        "severity": "medium"
    },
    "filler_intensifiers": {
        "patterns": {
            "absolutely": "[often removable]",
            "basically": "[often removable]",
            "certainly": "[often removable]",
            "clearly": "[often removable]",
            "definitely": "[often removable]",
            "essentially": "[often removable]",
            "extremely": "[often removable]",
            "fundamentally": "[often removable]",
            "incredibly": "[often removable]",
            "interestingly": "[often removable]",
            "naturally": "[often removable]",
            "obviously": "[often removable]",
            "significantly": "[often removable]",
            "truly": "[often removable]",
            "undoubtedly": "[often removable]",
            "very": "[often removable]",
        },
        "severity": "low"
    },
    "academic_ai_tells": {
        "patterns": {
            "shed light on": "clarify, explain, reveal",
            "sheds light on": "clarifies, explains, reveals",
            "pave the way for": "enable, allow, make possible",
            "paves the way for": "enables, allows",
            "a myriad of": "many, numerous, various",
            "a plethora of": "many, numerous, several",
            "paramount": "very important, essential",
            "pertaining to": "about, regarding",
            "prior to": "before",
            "subsequent to": "after",
            "in light of": "because of, given",
            "with respect to": "about, regarding",
            "in terms of": "regarding, for, about",
            "the fact that": "that [or rewrite]",
        },
        "severity": "medium"
    },
    "structural_patterns": {
        "patterns": {
            "whether you're a": "[avoid listing three examples after]",
            "it's not just": "[often followed by formulaic structure]",
            "by understanding": "[often starts formulaic sentence]",
            "by leveraging": "by using",
            "by utilizing": "by using",
        },
        "severity": "low"
    }
}


def load_patterns_from_file(file_path: Path) -> Optional[Dict]:
    """
    Attempt to load patterns from the ai-phrases-to-avoid.md reference file.
    Returns None if file not found or parsing fails.
    """
    if not file_path.exists():
        return None
    
    try:
        content = file_path.read_text(encoding='utf-8')
        # For now, we'll use built-in patterns but could parse the MD file
        # This is a placeholder for future enhancement
        return None
    except Exception:
        return None


def count_em_dashes(content: str) -> int:
    """Count em dashes in content."""
    # Match actual em dash character and double-hyphen representation
    em_dash_char = content.count('—')
    # Also count -- which some systems use for em dash
    double_hyphen = len(re.findall(r'(?<!\-)--(?!\-)', content))
    return em_dash_char + double_hyphen


def get_em_dash_positions(content: str) -> List[Tuple[int, str]]:
    """Get line numbers and context for em dashes."""
    positions = []
    lines = content.split('\n')
    
    for i, line in enumerate(lines, 1):
        if '—' in line or re.search(r'(?<!\-)--(?!\-)', line):
            positions.append((i, line.strip()))
    
    return positions


def find_pattern_matches(
    content: str, 
    patterns: Dict, 
    strict_mode: bool = False
) -> List[PatternMatch]:
    """Find all pattern matches in content."""
    matches = []
    lines = content.split('\n')
    
    for category, category_data in patterns.items():
        pattern_dict = category_data["patterns"]
        severity = category_data.get("severity", "medium")
        
        for pattern, suggestion in pattern_dict.items():
            # Create regex for whole word matching (case insensitive)
            # Handle multi-word phrases
            if ' ' in pattern:
                regex = re.compile(
                    r'\b' + re.escape(pattern) + r'\b',
                    re.IGNORECASE
                )
            else:
                regex = re.compile(
                    r'\b' + re.escape(pattern) + r'\b',
                    re.IGNORECASE
                )
            
            for line_num, line in enumerate(lines, 1):
                if regex.search(line):
                    # Skip if in code block (basic detection)
                    stripped = line.strip()
                    if stripped.startswith('```') or stripped.startswith('`'):
                        continue
                    if stripped.startswith('#') and not strict_mode:
                        # Less strict about headings
                        continue
                    
                    matches.append(PatternMatch(
                        pattern=pattern,
                        category=category,
                        line_number=line_num,
                        line_text=line.strip()[:100],  # Truncate long lines
                        suggestion=suggestion,
                        severity=severity
                    ))
    
    return matches


def calculate_score(
    content: str,
    matches: List[PatternMatch],
    em_dash_count: int
) -> int:
    """
    Calculate human-likeness score (0-100).
    Higher score = more human-like, fewer AI patterns detected.
    """
    word_count = len(re.findall(r'\b\w+\b', content))
    
    if word_count == 0:
        return 100
    
    # Base score starts at 100
    score = 100.0
    
    # Deduct for pattern matches based on severity
    severity_weights = {
        "high": 5,
        "medium": 3,
        "low": 1
    }
    
    for match in matches:
        weight = severity_weights.get(match.severity, 3)
        score -= weight
    
    # Deduct for em dash overuse (more than 1 per 500 words is suspicious)
    expected_em_dashes = word_count / 500
    excess_em_dashes = max(0, em_dash_count - expected_em_dashes)
    score -= excess_em_dashes * 2
    
    # Normalize based on content length (longer content may naturally have more matches)
    # But don't over-compensate
    if word_count > 1000:
        length_factor = min(1.2, word_count / 1000)
        matches_per_1000_words = (len(matches) / word_count) * 1000
        if matches_per_1000_words < 5:
            score = min(100, score + 5)  # Bonus for low density in long content
    
    return max(0, min(100, int(score)))


def get_score_label(score: int) -> str:
    """Get human-readable label for score."""
    if score >= 90:
        return "Excellent - Content appears very natural"
    elif score >= 75:
        return "Good - Minor AI patterns detected"
    elif score >= 60:
        return "Fair - Several AI patterns present"
    elif score >= 40:
        return "Poor - Many AI patterns detected"
    else:
        return "Very Poor - Content shows strong AI characteristics"


def generate_recommendations(
    matches: List[PatternMatch],
    em_dash_count: int,
    word_count: int
) -> List[str]:
    """Generate actionable recommendations."""
    recommendations = []
    
    # Count matches by category
    category_counts = defaultdict(int)
    for match in matches:
        category_counts[match.category] += 1
    
    # Em dash recommendation
    if em_dash_count > 0:
        ratio = word_count / em_dash_count if em_dash_count > 0 else float('inf')
        if ratio < 200:
            recommendations.append(
                f"🔴 High em dash usage ({em_dash_count} found). "
                "Em dashes are the #1 AI writing tell. Replace most with commas, "
                "colons, or parentheses."
            )
        elif ratio < 500:
            recommendations.append(
                f"🟡 Moderate em dash usage ({em_dash_count} found). "
                "Consider reducing - use commas for most parenthetical information."
            )
    
    # Category-specific recommendations
    if category_counts.get("opening_phrases", 0) > 0:
        recommendations.append(
            "🔴 Detected formulaic opening phrases. Start with your main point directly."
        )
    
    if category_counts.get("overused_verbs", 0) >= 3:
        recommendations.append(
            "🟡 Multiple AI-flagged verbs detected (delve, leverage, utilize, etc.). "
            "Replace with simpler alternatives."
        )
    
    if category_counts.get("overused_adjectives", 0) >= 3:
        recommendations.append(
            "🟡 Multiple AI-flagged adjectives detected (robust, comprehensive, pivotal, etc.). "
            "Use more specific, concrete descriptions."
        )
    
    if category_counts.get("filler_intensifiers", 0) >= 5:
        recommendations.append(
            "🟡 Many filler words detected (very, extremely, incredibly, etc.). "
            "Remove or replace with specific details."
        )
    
    if category_counts.get("overused_transitions", 0) >= 2:
        recommendations.append(
            "🟡 Overused transition phrases detected. Vary your transitions or simplify."
        )
    
    if category_counts.get("academic_ai_tells", 0) >= 2:
        recommendations.append(
            "🟡 Academic AI patterns detected. Use plain English alternatives."
        )
    
    if not recommendations:
        recommendations.append(
            "✅ No major AI patterns detected. Content appears natural!"
        )
    
    return recommendations


def analyze_content(
    content: str,
    patterns: Dict = None,
    strict_mode: bool = False
) -> AnalysisResult:
    """Perform complete AI pattern analysis."""
    
    if patterns is None:
        patterns = BUILTIN_PATTERNS
    
    # Find matches
    matches = find_pattern_matches(content, patterns, strict_mode)
    
    # Count em dashes
    em_dash_count = count_em_dashes(content)
    em_dash_positions = get_em_dash_positions(content)
    
    # Add em dash matches to flagged items
    for line_num, line_text in em_dash_positions:
        matches.append(PatternMatch(
            pattern="— (em dash)",
            category="em_dashes",
            line_number=line_num,
            line_text=line_text[:100],
            suggestion="Use comma, colon, or parentheses instead",
            severity="high"
        ))
    
    # Calculate score
    score = calculate_score(content, matches, em_dash_count)
    
    # Count by category
    category_counts = defaultdict(int)
    for match in matches:
        category_counts[match.category] += 1
    
    # Word count for recommendations
    word_count = len(re.findall(r'\b\w+\b', content))
    
    # Generate recommendations
    recommendations = generate_recommendations(
        [m for m in matches if m.category != "em_dashes"],
        em_dash_count,
        word_count
    )
    
    return AnalysisResult(
        score=score,
        total_matches=len(matches),
        em_dash_count=em_dash_count,
        matches_by_category=dict(category_counts),
        flagged_items=matches,
        summary=get_score_label(score),
        recommendations=recommendations
    )


def format_results(result: AnalysisResult, verbose: bool = True) -> str:
    """Format results for human-readable output."""
    output = []
    
    output.append("=" * 60)
    output.append("AI PATTERN ANALYSIS REPORT")
    output.append("=" * 60)
    
    # Score section
    output.append(f"\n🎯 HUMAN-LIKENESS SCORE: {result.score}/100")
    output.append(f"   {result.summary}")
    
    # Summary stats
    output.append(f"\n📊 SUMMARY")
    output.append("-" * 40)
    output.append(f"  Total patterns flagged:  {result.total_matches}")
    output.append(f"  Em dashes found:         {result.em_dash_count}")
    
    # Breakdown by category
    if result.matches_by_category:
        output.append(f"\n📁 MATCHES BY CATEGORY")
        output.append("-" * 40)
        
        category_labels = {
            "em_dashes": "Em Dashes (High Priority)",
            "opening_phrases": "Opening Phrases",
            "overused_verbs": "Overused Verbs",
            "overused_adjectives": "Overused Adjectives",
            "overused_transitions": "Overused Transitions",
            "transitional_phrases": "Transitional Phrases",
            "concluding_phrases": "Concluding Phrases",
            "filler_intensifiers": "Filler/Intensifiers",
            "academic_ai_tells": "Academic AI Tells",
            "structural_patterns": "Structural Patterns"
        }
        
        for category, count in sorted(
            result.matches_by_category.items(),
            key=lambda x: x[1],
            reverse=True
        ):
            label = category_labels.get(category, category)
            output.append(f"  {label}: {count}")
    
    # Recommendations
    output.append(f"\n💡 RECOMMENDATIONS")
    output.append("-" * 40)
    for rec in result.recommendations:
        output.append(f"  {rec}")
    
    # Detailed flagged items (if verbose)
    if verbose and result.flagged_items:
        output.append(f"\n🔍 FLAGGED ITEMS (showing up to 20)")
        output.append("-" * 40)
        
        # Sort by severity then line number
        severity_order = {"high": 0, "medium": 1, "low": 2}
        sorted_items = sorted(
            result.flagged_items,
            key=lambda x: (severity_order.get(x.severity, 1), x.line_number)
        )
        
        for i, item in enumerate(sorted_items[:20]):
            severity_icon = {"high": "🔴", "medium": "🟡", "low": "🟢"}.get(
                item.severity, "⚪"
            )
            output.append(f"\n  {severity_icon} Line {item.line_number}: \"{item.pattern}\"")
            output.append(f"     Category: {item.category}")
            output.append(f"     Suggestion: {item.suggestion}")
            if item.line_text:
                # Truncate and show context
                context = item.line_text
                if len(context) > 70:
                    context = context[:70] + "..."
                output.append(f"     Context: \"{context}\"")
        
        if len(result.flagged_items) > 20:
            output.append(f"\n  ... and {len(result.flagged_items) - 20} more items")
    
    output.append("\n" + "=" * 60)
    
    return "\n".join(output)


def result_to_dict(result: AnalysisResult) -> Dict[str, Any]:
    """Convert result to JSON-serializable dict."""
    return {
        "score": result.score,
        "summary": result.summary,
        "total_matches": result.total_matches,
        "em_dash_count": result.em_dash_count,
        "matches_by_category": result.matches_by_category,
        "recommendations": result.recommendations,
        "flagged_items": [
            {
                "pattern": item.pattern,
                "category": item.category,
                "line_number": item.line_number,
                "line_text": item.line_text,
                "suggestion": item.suggestion,
                "severity": item.severity
            }
            for item in result.flagged_items
        ]
    }


def main():
    parser = argparse.ArgumentParser(
        description="Check content for AI-generated patterns"
    )
    parser.add_argument(
        "file",
        nargs="?",
        help="Path to content file"
    )
    parser.add_argument(
        "--stdin",
        action="store_true",
        help="Read content from stdin"
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Enable strict mode (check headings too)"
    )
    parser.add_argument(
        "--json", "-j",
        action="store_true",
        help="Output as JSON"
    )
    parser.add_argument(
        "--brief", "-b",
        action="store_true",
        help="Brief output (score and recommendations only)"
    )
    parser.add_argument(
        "--patterns-file",
        help="Path to custom patterns file (Markdown format)"
    )
    
    args = parser.parse_args()
    
    # Get content
    if args.stdin:
        content = sys.stdin.read()
    elif args.file:
        file_path = Path(args.file)
        if not file_path.exists():
            print(f"Error: File not found: {args.file}", file=sys.stderr)
            sys.exit(1)
        content = file_path.read_text(encoding='utf-8')
    else:
        parser.print_help()
        sys.exit(1)
    
    # Load patterns
    patterns = BUILTIN_PATTERNS
    if args.patterns_file:
        custom_patterns = load_patterns_from_file(Path(args.patterns_file))
        if custom_patterns:
            patterns = custom_patterns
    
    # Analyze
    result = analyze_content(content, patterns, args.strict)
    
    # Output
    if args.json:
        print(json.dumps(result_to_dict(result), indent=2))
    else:
        print(format_results(result, verbose=not args.brief))


if __name__ == "__main__":
    main()
