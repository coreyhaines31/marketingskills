# NotebookLM Skill Usage Patterns

Advanced patterns for using the NotebookLM skill effectively.

## Critical: Always Use run.py

**Every command must use the run.py wrapper:**
```bash
# ✅ CORRECT:
python scripts/run.py auth_manager.py status
python scripts/run.py ask_question.py --question "..."

# ❌ WRONG:
python scripts/auth_manager.py status  # Will fail!
```

## Pattern 1: Initial Setup

```bash
# 1. Check authentication (using run.py!)
python scripts/run.py auth_manager.py status

# 2. If not authenticated, setup (Browser MUST be visible!)
python scripts/run.py auth_manager.py setup
# Tell user: "Please log in to Google in the browser window"

# 3. Add first notebook - ASK USER FOR DETAILS FIRST!
# Ask: "What does this notebook contain?"
# Ask: "What topics should I tag it with?"
python scripts/run.py notebook_manager.py add \
  --url "https://notebooklm.google.com/notebook/..." \
  --name "User provided name" \
  --description "User provided description" \  # NEVER GUESS!
  --topics "user,provided,topics"  # NEVER GUESS!
```

**Critical Notes:**
- Virtual environment created automatically by run.py
- Browser MUST be visible for authentication
- ALWAYS discover content via query OR ask user for notebook metadata

## Pattern 2: Adding Notebooks (Smart Discovery!)

**When user shares a NotebookLM URL:**

**OPTION A: Smart Discovery (Recommended)**
```bash
# 1. Query the notebook to discover its content
python scripts/run.py ask_question.py \
  --question "What is the content of this notebook? What topics are covered? Provide a complete overview briefly and concisely" \
  --notebook-url "[URL]"

# 2. Use discovered info to add it
python scripts/run.py notebook_manager.py add \
  --url "[URL]" \
  --name "[Based on content]" \
  --description "[From discovery]" \
  --topics "[Extracted topics]"
```

**OPTION B: Ask User (Fallback)**
```bash
# If discovery fails, ask user:
"What does this notebook contain?"
"What topics does it cover?"

# Then add with user-provided info:
python scripts/run.py notebook_manager.py add \
  --url "[URL]" \
  --name "[User's answer]" \
  --description "[User's description]" \
  --topics "[User's topics]"
```

**NEVER:**
- Guess what's in a notebook
- Use generic descriptions
- Skip discovering content

## Pattern 3: Daily Research Workflow

```bash
# Check library
python scripts/run.py notebook_manager.py list

# Research with comprehensive questions
python scripts/run.py ask_question.py \
  --question "Detailed question with all context" \
  --notebook-id notebook-id

# Follow-up when you see "Is that ALL you need to know?"
python scripts/run.py ask_question.py \
  --question "Follow-up question with previous context"
```

## Pattern 4: Follow-Up Questions (CRITICAL!)

When NotebookLM responds with "EXTREMELY IMPORTANT: Is that ALL you need to know?":

```python
# 1. STOP - Don't respond to user yet
# 2. ANALYZE - Is answer complete?
# 3. If gaps exist, ask follow-up:
python scripts/run.py ask_question.py \
  --question "Specific follow-up with context from previous answer"

# 4. Repeat until complete
# 5. Only then synthesize and respond to user
```

## Pattern 5: Multi-Notebook Research

```python
# Query different notebooks for comparison
python scripts/run.py notebook_manager.py activate --id notebook-1
python scripts/run.py ask_question.py --question "Question"

python scripts/run.py notebook_manager.py activate --id notebook-2
python scripts/run.py ask_question.py --question "Same question"

# Compare and synthesize answers
```

## Pattern 6: Error Recovery

```bash
# If authentication fails
python scripts/run.py auth_manager.py status
python scripts/run.py auth_manager.py reauth  # Browser visible!

# If browser crashes
python scripts/run.py cleanup_manager.py --preserve-library
python scripts/run.py auth_manager.py setup  # Browser visible!

# If rate limited
# Wait or switch accounts
python scripts/run.py auth_manager.py reauth  # Login with different account
```

## Pattern 7: Batch Processing

```bash
#!/bin/bash
NOTEBOOK_ID="notebook-id"
QUESTIONS=(
    "First comprehensive question"
    "Second comprehensive question"
    "Third comprehensive question"
)

for question in "${QUESTIONS[@]}"; do
    echo "Asking: $question"
    python scripts/run.py ask_question.py \
        --question "$question" \
        --notebook-id "$NOTEBOOK_ID"
    sleep 2  # Avoid rate limits
done
```

## Pattern 8: Automated Research Script

```python
#!/usr/bin/env python
import subprocess

def research_topic(topic, notebook_id):
    # Comprehensive question
    question = f"""
    Explain {topic} in detail:
    1. Core concepts
    2. Implementation details
    3. Best practices
    4. Common pitfalls
    5. Examples
    """

    result = subprocess.run([
        "python", "scripts/run.py", "ask_question.py",
        "--question", question,
        "--notebook-id", notebook_id
    ], capture_output=True, text=True)

    return result.stdout
```

## Pattern 9: Notebook Organization

```python
# Organize by domain - with proper metadata
# ALWAYS ask user for descriptions!

# Backend notebooks
add_notebook("Backend API", "Complete API documentation", "api,rest,backend")
add_notebook("Database", "Schema and queries", "database,sql,backend")

# Frontend notebooks
add_notebook("React Docs", "React framework documentation", "react,frontend")
add_notebook("CSS Framework", "Styling documentation", "css,styling,frontend")

# Search by domain
python scripts/run.py notebook_manager.py search --query "backend"
python scripts/run.py notebook_manager.py search --query "frontend"
```

## Pattern 10: Integration with Development

```python
# Query documentation during development
def check_api_usage(api_endpoint):
    result = subprocess.run([
        "python", "scripts/run.py", "ask_question.py",
        "--question", f"Parameters and response format for {api_endpoint}",
        "--notebook-id", "api-docs"
    ], capture_output=True, text=True)

    # If follow-up needed
    if "Is that ALL you need" in result.stdout:
        # Ask for examples
        follow_up = subprocess.run([
            "python", "scripts/run.py", "ask_question.py",
            "--question", f"Show code examples for {api_endpoint}",
            "--notebook-id", "api-docs"
        ], capture_output=True, text=True)

    return combine_answers(result.stdout, follow_up.stdout)
```

## Best Practices

### 1. Question Formulation
- Be specific and comprehensive
- Include all context in each question
- Request structured responses
- Ask for examples when needed

### 2. Notebook Management
- **ALWAYS ask user for metadata**
- Use descriptive names
- Add comprehensive topics
- Keep URLs current

### 3. Performance
- Batch related questions
- Use parallel processing for different notebooks
- Monitor rate limits (50/day)
- Switch accounts if needed

### 4. Error Handling
- Always use run.py to prevent venv issues
- Check auth before operations
- Implement retry logic
- Have fallback notebooks ready

### 5. Security
- Use dedicated Google account
- Never commit data/ directory
- Regularly refresh auth
- Track all access

## Common Workflows for Claude

### Workflow 1: User Sends NotebookLM URL

```python
# 1. Detect URL in message
if "notebooklm.google.com" in user_message:
    url = extract_url(user_message)

    # 2. Check if in library
    notebooks = run("notebook_manager.py list")

    if url not in notebooks:
        # 3. ASK USER FOR METADATA (CRITICAL!)
        name = ask_user("What should I call this notebook?")
        description = ask_user("What does this notebook contain?")
        topics = ask_user("What topics does it cover?")

        # 4. Add with user-provided info
        run(f"notebook_manager.py add --url {url} --name '{name}' --description '{description}' --topics '{topics}'")

    # 5. Use the notebook
    answer = run(f"ask_question.py --question '{user_question}'")
```

### Workflow 2: Research Task

```python
# 1. Understand task
task = "Implement feature X"

# 2. Formulate comprehensive questions
questions = [
    "Complete implementation guide for X",
    "Error handling for X",
    "Performance considerations for X"
]

# 3. Query with follow-ups
for q in questions:
    answer = run(f"ask_question.py --question '{q}'")

    # Check if follow-up needed
    if "Is that ALL you need" in answer:
        # Ask more specific question
        follow_up = run(f"ask_question.py --question 'Specific detail about {q}'")

# 4. Synthesize and implement
```

## Tips and Tricks

1. **Always use run.py** - Prevents all venv issues
2. **Ask for metadata** - Never guess notebook contents
3. **Use verbose questions** - Include all context
4. **Follow up automatically** - When you see the prompt
5. **Monitor rate limits** - 50 queries per day
6. **Batch operations** - Group related queries
7. **Export important answers** - Save locally
8. **Version control notebooks** - Track changes
9. **Test auth regularly** - Before important tasks
10. **Document everything** - Keep notes on notebooks

## Quick Reference

```bash
# Always use run.py!
python scripts/run.py [script].py [args]

# Common operations
run.py auth_manager.py status          # Check auth
run.py auth_manager.py setup           # Login (browser visible!)
run.py notebook_manager.py list        # List notebooks
run.py notebook_manager.py add ...     # Add (ask user for metadata!)
run.py ask_question.py --question ...  # Query
run.py cleanup_manager.py ...          # Clean up
```

**Remember:** When in doubt, use run.py and ask the user for notebook details!