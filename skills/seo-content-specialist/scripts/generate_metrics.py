#!/usr/bin/env python3
"""
Content Metrics Generator for SEO Content

Analyzes content and generates useful metrics including word count, 
read time, readability scores, and SEO-relevant statistics.

Usage:
    python generate_metrics.py content.md
    python generate_metrics.py content.md --keyword "SEO optimization"
    python generate_metrics.py content.md --json
    cat content.md | python generate_metrics.py --stdin

Output includes:
    - Word count and character count
    - Estimated read time
    - Sentence and paragraph statistics
    - Heading structure analysis
    - Readability scores (Flesch-Kincaid)
    - Keyword density (if keyword provided)
    - Link counts
    - SEO recommendations
"""

import argparse
import re
import sys
import json
import math
from pathlib import Path
from typing import Dict, Any, List, Optional
from collections import Counter


# Average reading speeds (words per minute)
READING_SPEED_SLOW = 150
READING_SPEED_AVERAGE = 200
READING_SPEED_FAST = 250


def count_syllables(word: str) -> int:
    """Estimate syllable count for a word."""
    word = word.lower().strip()
    if len(word) <= 3:
        return 1
    
    # Remove silent e at end
    word = re.sub(r'e$', '', word)
    
    # Count vowel groups
    vowel_groups = re.findall(r'[aeiouy]+', word)
    count = len(vowel_groups)
    
    # Minimum 1 syllable
    return max(1, count)


def extract_text_from_markdown(content: str) -> str:
    """Remove Markdown formatting to get plain text."""
    text = content
    
    # Remove code blocks
    text = re.sub(r'```[\s\S]*?```', '', text)
    text = re.sub(r'`[^`]+`', '', text)
    
    # Remove links but keep text
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    
    # Remove images
    text = re.sub(r'!\[[^\]]*\]\([^)]+\)', '', text)
    
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    
    # Remove headings markers
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    
    # Remove bold/italic markers
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    text = re.sub(r'\*([^*]+)\*', r'\1', text)
    text = re.sub(r'__([^_]+)__', r'\1', text)
    text = re.sub(r'_([^_]+)_', r'\1', text)
    
    # Remove horizontal rules
    text = re.sub(r'^[-*_]{3,}\s*$', '', text, flags=re.MULTILINE)
    
    # Remove list markers
    text = re.sub(r'^\s*[-*+]\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*\d+\.\s+', '', text, flags=re.MULTILINE)
    
    # Remove blockquotes
    text = re.sub(r'^>\s*', '', text, flags=re.MULTILINE)
    
    return text


def get_words(text: str) -> List[str]:
    """Extract words from text."""
    # Remove punctuation and split
    words = re.findall(r'\b[a-zA-Z\']+\b', text.lower())
    return words


def get_sentences(text: str) -> List[str]:
    """Split text into sentences."""
    # Split on sentence-ending punctuation
    sentences = re.split(r'[.!?]+', text)
    # Filter empty sentences
    sentences = [s.strip() for s in sentences if s.strip()]
    return sentences


def get_paragraphs(text: str) -> List[str]:
    """Split text into paragraphs."""
    paragraphs = re.split(r'\n\s*\n', text)
    paragraphs = [p.strip() for p in paragraphs if p.strip()]
    return paragraphs


def calculate_flesch_reading_ease(words: List[str], sentences: List[str]) -> float:
    """
    Calculate Flesch Reading Ease score.
    
    Score interpretation:
    90-100: Very easy (5th grade)
    80-89: Easy (6th grade)
    70-79: Fairly easy (7th grade)
    60-69: Standard (8th-9th grade)
    50-59: Fairly difficult (10th-12th grade)
    30-49: Difficult (College)
    0-29: Very difficult (College graduate)
    """
    if not words or not sentences:
        return 0
    
    total_words = len(words)
    total_sentences = len(sentences)
    total_syllables = sum(count_syllables(word) for word in words)
    
    # Flesch Reading Ease formula
    score = 206.835 - (1.015 * (total_words / total_sentences)) - (84.6 * (total_syllables / total_words))
    
    return round(max(0, min(100, score)), 1)


def calculate_flesch_kincaid_grade(words: List[str], sentences: List[str]) -> float:
    """
    Calculate Flesch-Kincaid Grade Level.
    Returns the US school grade level needed to understand the text.
    """
    if not words or not sentences:
        return 0
    
    total_words = len(words)
    total_sentences = len(sentences)
    total_syllables = sum(count_syllables(word) for word in words)
    
    # Flesch-Kincaid Grade Level formula
    grade = (0.39 * (total_words / total_sentences)) + (11.8 * (total_syllables / total_words)) - 15.59
    
    return round(max(0, grade), 1)


def extract_headings(content: str) -> Dict[str, List[str]]:
    """Extract headings by level from Markdown content."""
    headings = {
        'h1': [],
        'h2': [],
        'h3': [],
        'h4': [],
        'h5': [],
        'h6': []
    }
    
    for line in content.split('\n'):
        line = line.strip()
        if line.startswith('#'):
            match = re.match(r'^(#{1,6})\s+(.+)$', line)
            if match:
                level = len(match.group(1))
                text = match.group(2).strip()
                headings[f'h{level}'].append(text)
    
    return headings


def count_links(content: str) -> Dict[str, int]:
    """Count internal and external links in Markdown content."""
    # Match Markdown links [text](url)
    links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', content)
    
    internal = 0
    external = 0
    
    for text, url in links:
        if url.startswith('http://') or url.startswith('https://'):
            external += 1
        elif url.startswith('#') or url.startswith('/') or not '://' in url:
            internal += 1
    
    return {
        'internal': internal,
        'external': external,
        'total': internal + external
    }


def count_images(content: str) -> int:
    """Count images in Markdown content."""
    images = re.findall(r'!\[[^\]]*\]\([^)]+\)', content)
    return len(images)


def count_code_blocks(content: str) -> int:
    """Count code blocks in Markdown content."""
    blocks = re.findall(r'```[\s\S]*?```', content)
    return len(blocks)


def count_lists(content: str) -> Dict[str, int]:
    """Count list items in Markdown content."""
    bullet_items = len(re.findall(r'^\s*[-*+]\s+', content, flags=re.MULTILINE))
    numbered_items = len(re.findall(r'^\s*\d+\.\s+', content, flags=re.MULTILINE))
    
    return {
        'bullet_items': bullet_items,
        'numbered_items': numbered_items,
        'total_items': bullet_items + numbered_items
    }


def calculate_keyword_density(words: List[str], keyword: str) -> Dict[str, Any]:
    """Calculate keyword density and related metrics."""
    keyword_words = keyword.lower().split()
    total_words = len(words)
    
    if len(keyword_words) == 1:
        # Single word keyword
        keyword_count = words.count(keyword_words[0])
    else:
        # Multi-word phrase - look for consecutive occurrences
        keyword_count = 0
        text = ' '.join(words)
        keyword_count = len(re.findall(re.escape(keyword.lower()), text))
    
    density = (keyword_count / total_words * 100) if total_words > 0 else 0
    
    return {
        'keyword': keyword,
        'occurrences': keyword_count,
        'density_percent': round(density, 2),
        'recommendation': get_density_recommendation(density)
    }


def get_density_recommendation(density: float) -> str:
    """Get recommendation based on keyword density."""
    if density < 0.5:
        return "Low - Consider adding more keyword mentions naturally"
    elif density < 1.0:
        return "Good - Keyword presence is balanced"
    elif density < 2.5:
        return "Optimal - Keyword density is in ideal range"
    elif density < 4.0:
        return "High - May appear over-optimized, consider reducing"
    else:
        return "Too high - Risk of keyword stuffing, reduce significantly"


def estimate_read_time(word_count: int) -> Dict[str, str]:
    """Estimate reading time at different speeds."""
    slow = math.ceil(word_count / READING_SPEED_SLOW)
    average = math.ceil(word_count / READING_SPEED_AVERAGE)
    fast = math.ceil(word_count / READING_SPEED_FAST)
    
    def format_time(minutes: int) -> str:
        if minutes < 1:
            return "< 1 min"
        elif minutes == 1:
            return "1 min"
        else:
            return f"{minutes} mins"
    
    return {
        'slow_reader': format_time(slow),
        'average_reader': format_time(average),
        'fast_reader': format_time(fast),
        'display': format_time(average)  # Default display value
    }


def get_reading_ease_label(score: float) -> str:
    """Get human-readable label for Flesch Reading Ease score."""
    if score >= 90:
        return "Very Easy (5th grade)"
    elif score >= 80:
        return "Easy (6th grade)"
    elif score >= 70:
        return "Fairly Easy (7th grade)"
    elif score >= 60:
        return "Standard (8th-9th grade)"
    elif score >= 50:
        return "Fairly Difficult (10th-12th grade)"
    elif score >= 30:
        return "Difficult (College level)"
    else:
        return "Very Difficult (College graduate)"


def analyze_content(content: str, keyword: Optional[str] = None) -> Dict[str, Any]:
    """Perform complete content analysis."""
    
    # Extract plain text for word analysis
    plain_text = extract_text_from_markdown(content)
    
    # Basic counts
    words = get_words(plain_text)
    sentences = get_sentences(plain_text)
    paragraphs = get_paragraphs(plain_text)
    
    word_count = len(words)
    sentence_count = len(sentences)
    paragraph_count = len(paragraphs)
    character_count = len(plain_text)
    character_count_no_spaces = len(plain_text.replace(' ', '').replace('\n', ''))
    
    # Averages
    avg_sentence_length = round(word_count / sentence_count, 1) if sentence_count > 0 else 0
    avg_word_length = round(sum(len(w) for w in words) / word_count, 1) if word_count > 0 else 0
    avg_paragraph_length = round(word_count / paragraph_count, 1) if paragraph_count > 0 else 0
    
    # Readability
    flesch_reading_ease = calculate_flesch_reading_ease(words, sentences)
    flesch_kincaid_grade = calculate_flesch_kincaid_grade(words, sentences)
    
    # Structure analysis
    headings = extract_headings(content)
    links = count_links(content)
    images = count_images(content)
    code_blocks = count_code_blocks(content)
    lists = count_lists(content)
    
    # Read time
    read_time = estimate_read_time(word_count)
    
    # Build results
    results = {
        'basic_metrics': {
            'word_count': word_count,
            'character_count': character_count,
            'character_count_no_spaces': character_count_no_spaces,
            'sentence_count': sentence_count,
            'paragraph_count': paragraph_count
        },
        'averages': {
            'avg_sentence_length': avg_sentence_length,
            'avg_word_length': avg_word_length,
            'avg_paragraph_length': avg_paragraph_length
        },
        'read_time': read_time,
        'readability': {
            'flesch_reading_ease': flesch_reading_ease,
            'flesch_reading_ease_label': get_reading_ease_label(flesch_reading_ease),
            'flesch_kincaid_grade': flesch_kincaid_grade
        },
        'structure': {
            'headings': {
                'h1_count': len(headings['h1']),
                'h2_count': len(headings['h2']),
                'h3_count': len(headings['h3']),
                'h4_count': len(headings['h4']),
                'total_headings': sum(len(h) for h in headings.values()),
                'h1_texts': headings['h1'],
                'h2_texts': headings['h2']
            },
            'links': links,
            'images': images,
            'code_blocks': code_blocks,
            'lists': lists
        }
    }
    
    # Keyword analysis if provided
    if keyword:
        results['keyword_analysis'] = calculate_keyword_density(words, keyword)
    
    # SEO recommendations
    results['seo_recommendations'] = generate_seo_recommendations(results, keyword)
    
    return results


def generate_seo_recommendations(metrics: Dict[str, Any], keyword: Optional[str] = None) -> List[str]:
    """Generate SEO recommendations based on metrics."""
    recommendations = []
    
    word_count = metrics['basic_metrics']['word_count']
    headings = metrics['structure']['headings']
    links = metrics['structure']['links']
    reading_ease = metrics['readability']['flesch_reading_ease']
    avg_sentence = metrics['averages']['avg_sentence_length']
    
    # Word count recommendations
    if word_count < 300:
        recommendations.append("⚠️ Content is very short (<300 words). Consider expanding for better SEO.")
    elif word_count < 1000:
        recommendations.append("📝 Content length is moderate. For competitive topics, aim for 1,500+ words.")
    elif word_count >= 2500:
        recommendations.append("✅ Long-form content - good for comprehensive coverage and SEO.")
    
    # Heading structure
    if headings['h1_count'] == 0:
        recommendations.append("⚠️ No H1 heading found. Add a main title.")
    elif headings['h1_count'] > 1:
        recommendations.append("⚠️ Multiple H1 headings found. Use only one H1 per page.")
    
    if headings['h2_count'] == 0:
        recommendations.append("⚠️ No H2 headings. Add section headings to improve structure.")
    elif headings['h2_count'] < 3 and word_count > 1000:
        recommendations.append("📝 Consider adding more H2 headings for better content structure.")
    
    # Readability
    if reading_ease < 50:
        recommendations.append("⚠️ Content is difficult to read. Simplify language for broader audience.")
    elif reading_ease >= 60 and reading_ease <= 70:
        recommendations.append("✅ Readability is at a standard level - good for most audiences.")
    
    # Sentence length
    if avg_sentence > 25:
        recommendations.append("⚠️ Average sentence length is high. Break up long sentences.")
    elif avg_sentence < 10:
        recommendations.append("📝 Sentences are very short. Vary length for better flow.")
    
    # Links
    if links['external'] == 0:
        recommendations.append("📝 No external links. Consider linking to authoritative sources.")
    if links['internal'] == 0:
        recommendations.append("📝 No internal links. Add links to related content on your site.")
    
    # Images
    if metrics['structure']['images'] == 0 and word_count > 500:
        recommendations.append("📝 No images detected. Consider adding visuals to improve engagement.")
    
    # Keyword (if provided)
    if keyword and 'keyword_analysis' in metrics:
        density = metrics['keyword_analysis']['density_percent']
        if density < 0.5:
            recommendations.append(f"📝 Keyword '{keyword}' density is low ({density}%). Add more natural mentions.")
        elif density > 3.0:
            recommendations.append(f"⚠️ Keyword '{keyword}' density is high ({density}%). Reduce to avoid over-optimization.")
    
    if not recommendations:
        recommendations.append("✅ Content metrics look good! Review other SEO factors.")
    
    return recommendations


def format_results(results: Dict[str, Any]) -> str:
    """Format results for human-readable output."""
    output = []
    output.append("=" * 60)
    output.append("CONTENT METRICS REPORT")
    output.append("=" * 60)
    
    # Basic metrics
    output.append("\n📊 BASIC METRICS")
    output.append("-" * 40)
    basic = results['basic_metrics']
    output.append(f"  Word Count:        {basic['word_count']:,}")
    output.append(f"  Character Count:   {basic['character_count']:,}")
    output.append(f"  Sentences:         {basic['sentence_count']:,}")
    output.append(f"  Paragraphs:        {basic['paragraph_count']:,}")
    
    # Read time
    output.append("\n⏱️  READ TIME")
    output.append("-" * 40)
    read_time = results['read_time']
    output.append(f"  Average Reader:    {read_time['average_reader']}")
    output.append(f"  Slow Reader:       {read_time['slow_reader']}")
    output.append(f"  Fast Reader:       {read_time['fast_reader']}")
    
    # Averages
    output.append("\n📏 AVERAGES")
    output.append("-" * 40)
    avgs = results['averages']
    output.append(f"  Avg Sentence Length:   {avgs['avg_sentence_length']} words")
    output.append(f"  Avg Word Length:       {avgs['avg_word_length']} characters")
    output.append(f"  Avg Paragraph Length:  {avgs['avg_paragraph_length']} words")
    
    # Readability
    output.append("\n📖 READABILITY")
    output.append("-" * 40)
    read = results['readability']
    output.append(f"  Flesch Reading Ease:   {read['flesch_reading_ease']}/100")
    output.append(f"  Level:                 {read['flesch_reading_ease_label']}")
    output.append(f"  Flesch-Kincaid Grade:  {read['flesch_kincaid_grade']}")
    
    # Structure
    output.append("\n🏗️  STRUCTURE")
    output.append("-" * 40)
    struct = results['structure']
    h = struct['headings']
    output.append(f"  H1 Headings:       {h['h1_count']}")
    output.append(f"  H2 Headings:       {h['h2_count']}")
    output.append(f"  H3 Headings:       {h['h3_count']}")
    output.append(f"  Total Headings:    {h['total_headings']}")
    output.append(f"  Internal Links:    {struct['links']['internal']}")
    output.append(f"  External Links:    {struct['links']['external']}")
    output.append(f"  Images:            {struct['images']}")
    output.append(f"  Code Blocks:       {struct['code_blocks']}")
    output.append(f"  List Items:        {struct['lists']['total_items']}")
    
    # Keyword analysis
    if 'keyword_analysis' in results:
        output.append("\n🔑 KEYWORD ANALYSIS")
        output.append("-" * 40)
        kw = results['keyword_analysis']
        output.append(f"  Keyword:           \"{kw['keyword']}\"")
        output.append(f"  Occurrences:       {kw['occurrences']}")
        output.append(f"  Density:           {kw['density_percent']}%")
        output.append(f"  Assessment:        {kw['recommendation']}")
    
    # Recommendations
    output.append("\n💡 SEO RECOMMENDATIONS")
    output.append("-" * 40)
    for rec in results['seo_recommendations']:
        output.append(f"  {rec}")
    
    output.append("\n" + "=" * 60)
    
    return "\n".join(output)


def main():
    parser = argparse.ArgumentParser(
        description="Generate content metrics for SEO analysis"
    )
    parser.add_argument(
        "file",
        nargs="?",
        help="Path to content file (Markdown or text)"
    )
    parser.add_argument(
        "--stdin",
        action="store_true",
        help="Read content from stdin"
    )
    parser.add_argument(
        "--keyword", "-k",
        help="Target keyword for density analysis"
    )
    parser.add_argument(
        "--json", "-j",
        action="store_true",
        help="Output as JSON"
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
    
    # Analyze
    results = analyze_content(content, args.keyword)
    
    # Output
    if args.json:
        print(json.dumps(results, indent=2))
    else:
        print(format_results(results))


if __name__ == "__main__":
    main()
