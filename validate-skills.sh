#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SKILLS_DIR="skills"
ISSUES=0
WARNINGS=0
PASSED=0

echo "🔍 Auditing Skills Against Agent Skills Specification"
echo "======================================================"
echo ""
echo "Reference: https://agentskills.io/specification.md"
echo ""

# Validation rules from CLAUDE.md
# REQUIRED: name, description
# OPTIONAL: license, metadata
# name: 1-64 chars, lowercase a-z, numbers, hyphens only, must match directory
# description: 1-1024 chars with trigger phrases
# SKILL.md: under 500 lines
# Optional dirs: references/, scripts/, assets/

for skill_dir in "$SKILLS_DIR"/*/; do
    skill_name=$(basename "$skill_dir")
    skill_file="$skill_dir/SKILL.md"
    skill_errors=()
    skill_warnings=()

    # Check if SKILL.md exists
    if [[ ! -f "$skill_file" ]]; then
        echo -e "${RED}❌ $skill_name${NC}"
        echo "   Missing SKILL.md"
        ((ISSUES++))
        continue
    fi

    # Extract frontmatter
    frontmatter=$(sed -n '/^---$/,/^---$/p' "$skill_file" | head -n -1 | tail -n +2)

    # Validate frontmatter exists
    if [[ -z "$frontmatter" ]]; then
        echo -e "${RED}❌ $skill_name${NC}"
        echo "   Missing YAML frontmatter (---)"
        ((ISSUES++))
        continue
    fi

    # ===== NAME VALIDATION =====
    name_in_file=$(echo "$frontmatter" | grep "^name:" | sed 's/^name: //' | tr -d ' ')

    if [[ -z "$name_in_file" ]]; then
        skill_errors+=("Missing 'name' field in frontmatter")
    elif [[ "$name_in_file" != "$skill_name" ]]; then
        skill_errors+=("Name mismatch: directory='$skill_name' but frontmatter='$name_in_file'")
    elif ! [[ "$name_in_file" =~ ^[a-z0-9]([a-z0-9-]{0,62}[a-z0-9])?$ ]]; then
        skill_errors+=("Invalid name format: '$name_in_file' (must be lowercase, alphanumeric + hyphens only)")
    elif [[ ${#name_in_file} -lt 1 || ${#name_in_file} -gt 64 ]]; then
        skill_errors+=("Name length invalid: ${#name_in_file} chars (must be 1-64)")
    fi

    # ===== DESCRIPTION VALIDATION =====
    # Handle both quoted and unquoted descriptions
    description=$(echo "$frontmatter" | grep "^description:" | head -1)
    if [[ $description == *'description: "'* ]]; then
        # Quoted description - extract between quotes
        description=$(echo "$description" | sed 's/^description: "//' | sed 's/"$//')
    else
        # Unquoted description
        description=$(echo "$description" | sed 's/^description: //')
    fi

    if [[ -z "$description" ]]; then
        skill_errors+=("Missing 'description' field in frontmatter")
    else
        desc_len=${#description}
        if [[ $desc_len -lt 1 || $desc_len -gt 1024 ]]; then
            skill_errors+=("Description length invalid: $desc_len chars (must be 1-1024)")
        fi

        # Check for trigger phrases (When, when to use, mentions, etc.)
        if ! echo "$description" | grep -qi "when\|mention\|use"; then
            skill_warnings+=("Description lacks clear trigger phrases ('when', 'mention', 'use')")
        fi

        # Check for related skills reference (scope boundaries)
        if ! echo "$description" | grep -qi "see\|for\|ref"; then
            skill_warnings+=("Description lacks related skills reference (e.g., 'For X, see Y')")
        fi
    fi

    # ===== OPTIONAL FIELDS VALIDATION =====
    license=$(echo "$frontmatter" | grep "^license:" | sed 's/^license: //' | tr -d ' ')
    if [[ -n "$license" && "$license" != "MIT" && "$license" != "Apache-2.0" && "$license" != "ISC" ]]; then
        skill_warnings+=("License '$license' is non-standard (default: MIT)")
    fi

    # Check metadata structure
    metadata=$(echo "$frontmatter" | grep -A 10 "^metadata:")
    if [[ -n "$metadata" ]]; then
        # If metadata exists, check for version placement
        if echo "$frontmatter" | grep -q "^version:"; then
            skill_errors+=("'version' is top-level (should be under 'metadata:')")
        fi
        # Could add more metadata validation here
    fi

    # ===== FILE STRUCTURE VALIDATION =====
    line_count=$(wc -l < "$skill_file")
    if [[ $line_count -gt 500 ]]; then
        skill_warnings+=("SKILL.md is $line_count lines (should be <500, move details to references/)")
    fi

    # Check for optional directories
    for optdir in references scripts assets; do
        if [[ -d "$skill_dir/$optdir" ]]; then
            # Just note its presence - no validation required
            :
        fi
    done

    # ===== REPORT RESULTS =====
    if [[ ${#skill_errors[@]} -gt 0 ]]; then
        echo -e "${RED}❌ $skill_name${NC}"
        for error in "${skill_errors[@]}"; do
            echo -e "   ${RED}Error:${NC} $error"
        done
        if [[ ${#skill_warnings[@]} -gt 0 ]]; then
            for warning in "${skill_warnings[@]}"; do
                echo -e "   ${YELLOW}Warning:${NC} $warning"
            done
        fi
        ((ISSUES++))
    elif [[ ${#skill_warnings[@]} -gt 0 ]]; then
        echo -e "${YELLOW}⚠️  $skill_name${NC}"
        for warning in "${skill_warnings[@]}"; do
            echo -e "   ${YELLOW}Warning:${NC} $warning"
        done
        ((WARNINGS++))
    else
        echo -e "${GREEN}✓ $skill_name${NC}"
        ((PASSED++))
    fi
done

echo ""
echo "======================================================"
echo "Summary:"
echo -e "  ${GREEN}✓ Passed: $PASSED${NC}"
if [[ $WARNINGS -gt 0 ]]; then
    echo -e "  ${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
fi
if [[ $ISSUES -gt 0 ]]; then
    echo -e "  ${RED}❌ Issues: $ISSUES${NC}"
fi
echo ""

if [[ $ISSUES -eq 0 ]]; then
    echo -e "${GREEN}All skills are valid! ✓${NC}"
    exit 0
else
    echo -e "${RED}Found $ISSUES issue(s) that need fixing.${NC}"
    exit 1
fi
