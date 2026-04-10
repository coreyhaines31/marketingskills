# NotebookLM Skill Troubleshooting Guide

## Quick Fix Table

| Error | Solution |
|-------|----------|
| ModuleNotFoundError | Use `python scripts/run.py [script].py` |
| Authentication failed | Browser must be visible for setup |
| Browser crash | `python scripts/run.py cleanup_manager.py --preserve-library` |
| Rate limit hit | Wait 1 hour or switch accounts |
| Notebook not found | `python scripts/run.py notebook_manager.py list` |
| Script not working | Always use run.py wrapper |

## Critical: Always Use run.py

Most issues are solved by using the run.py wrapper:

```bash
# ✅ CORRECT - Always:
python scripts/run.py auth_manager.py status
python scripts/run.py ask_question.py --question "..."

# ❌ WRONG - Never:
python scripts/auth_manager.py status  # ModuleNotFoundError!
```

## Common Issues and Solutions

### Authentication Issues

#### Not authenticated error
```
Error: Not authenticated. Please run auth setup first.
```

**Solution:**
```bash
# Check status
python scripts/run.py auth_manager.py status

# Setup authentication (browser MUST be visible!)
python scripts/run.py auth_manager.py setup
# User must manually log in to Google

# If setup fails, try re-authentication
python scripts/run.py auth_manager.py reauth
```

#### Authentication expires frequently
**Solution:**
```bash
# Clear old authentication
python scripts/run.py cleanup_manager.py --preserve-library

# Fresh authentication setup
python scripts/run.py auth_manager.py setup --timeout 15

# Use persistent browser profile
export PERSIST_AUTH=true
```

#### Google blocks automated login
**Solution:**
1. Use dedicated Google account for automation
2. Enable "Less secure app access" if available
3. ALWAYS use visible browser:
```bash
python scripts/run.py auth_manager.py setup
# Browser MUST be visible - user logs in manually
# NO headless parameter exists - use --show-browser for debugging
```

### Browser Issues

#### Browser crashes or hangs
```
TimeoutError: Waiting for selector failed
```

**Solution:**
```bash
# Kill hanging processes
pkill -f chromium
pkill -f chrome

# Clean browser state
python scripts/run.py cleanup_manager.py --confirm --preserve-library

# Re-authenticate
python scripts/run.py auth_manager.py reauth
```

#### Browser not found error
**Solution:**
```bash
# Install Chromium via run.py (automatic)
python scripts/run.py auth_manager.py status
# run.py will install Chromium automatically

# Or manual install if needed
cd ~/.claude/skills/notebooklm
source .venv/bin/activate
python -m patchright install chromium
```

### Rate Limiting

#### Rate limit exceeded (50 queries/day)
**Solutions:**

**Option 1: Wait**
```bash
# Check when limit resets (usually midnight PST)
date -d "tomorrow 00:00 PST"
```

**Option 2: Switch accounts**
```bash
# Clear current auth
python scripts/run.py auth_manager.py clear

# Login with different account
python scripts/run.py auth_manager.py setup
```

**Option 3: Rotate accounts**
```python
# Use multiple accounts
accounts = ["account1", "account2"]
for account in accounts:
    # Switch account on rate limit
    subprocess.run(["python", "scripts/run.py", "auth_manager.py", "reauth"])
```

### Notebook Access Issues

#### Notebook not found
**Solution:**
```bash
# List all notebooks
python scripts/run.py notebook_manager.py list

# Search for notebook
python scripts/run.py notebook_manager.py search --query "keyword"

# Add notebook if missing
python scripts/run.py notebook_manager.py add \
  --url "https://notebooklm.google.com/..." \
  --name "Name" \
  --topics "topics"
```

#### Access denied to notebook
**Solution:**
1. Check if notebook is still shared publicly
2. Re-add notebook with updated URL
3. Verify correct Google account is used

#### Wrong notebook being used
**Solution:**
```bash
# Check active notebook
python scripts/run.py notebook_manager.py list | grep "active"

# Activate correct notebook
python scripts/run.py notebook_manager.py activate --id correct-id
```

### Virtual Environment Issues

#### ModuleNotFoundError
```
ModuleNotFoundError: No module named 'patchright'
```

**Solution:**
```bash
# ALWAYS use run.py - it handles venv automatically!
python scripts/run.py [any_script].py

# run.py will:
# 1. Create .venv if missing
# 2. Install dependencies
# 3. Run the script
```

#### Wrong Python version
**Solution:**
```bash
# Check Python version (needs 3.8+)
python --version

# If wrong version, specify correct Python
python3.8 scripts/run.py auth_manager.py status
```

### Network Issues

#### Connection timeouts
**Solution:**
```bash
# Increase timeout
export TIMEOUT_SECONDS=60

# Check connectivity
ping notebooklm.google.com

# Use proxy if needed
export HTTP_PROXY=http://proxy:port
export HTTPS_PROXY=http://proxy:port
```

### Data Issues

#### Corrupted notebook library
```
JSON decode error when listing notebooks
```

**Solution:**
```bash
# Backup current library
cp ~/.claude/skills/notebooklm/data/library.json library.backup.json

# Reset library
rm ~/.claude/skills/notebooklm/data/library.json

# Re-add notebooks
python scripts/run.py notebook_manager.py add --url ... --name ...
```

#### Disk space full
**Solution:**
```bash
# Check disk usage
df -h ~/.claude/skills/notebooklm/data/

# Clean up
python scripts/run.py cleanup_manager.py --confirm --preserve-library
```

## Debugging Techniques

### Enable verbose logging
```bash
export DEBUG=true
export LOG_LEVEL=DEBUG
python scripts/run.py ask_question.py --question "Test" --show-browser
```

### Test individual components
```bash
# Test authentication
python scripts/run.py auth_manager.py status

# Test notebook access
python scripts/run.py notebook_manager.py list

# Test browser launch
python scripts/run.py ask_question.py --question "test" --show-browser
```

### Save screenshots on error
Add to scripts for debugging:
```python
try:
    # Your code
except Exception as e:
    page.screenshot(path=f"error_{timestamp}.png")
    raise e
```

## Recovery Procedures

### Complete reset
```bash
#!/bin/bash
# Kill processes
pkill -f chromium

# Backup library if exists
if [ -f ~/.claude/skills/notebooklm/data/library.json ]; then
    cp ~/.claude/skills/notebooklm/data/library.json ~/library.backup.json
fi

# Clean everything
cd ~/.claude/skills/notebooklm
python scripts/run.py cleanup_manager.py --confirm --force

# Remove venv
rm -rf .venv

# Reinstall (run.py will handle this)
python scripts/run.py auth_manager.py setup

# Restore library if backup exists
if [ -f ~/library.backup.json ]; then
    mkdir -p ~/.claude/skills/notebooklm/data/
    cp ~/library.backup.json ~/.claude/skills/notebooklm/data/library.json
fi
```

### Partial recovery (keep data)
```bash
# Keep auth and library, fix execution
cd ~/.claude/skills/notebooklm
rm -rf .venv

# run.py will recreate venv automatically
python scripts/run.py auth_manager.py status
```

## Error Messages Reference

### Authentication Errors
| Error | Cause | Solution |
|-------|-------|----------|
| Not authenticated | No valid auth | `run.py auth_manager.py setup` |
| Authentication expired | Session old | `run.py auth_manager.py reauth` |
| Invalid credentials | Wrong account | Check Google account |
| 2FA required | Security challenge | Complete in visible browser |

### Browser Errors
| Error | Cause | Solution |
|-------|-------|----------|
| Browser not found | Chromium missing | Use run.py (auto-installs) |
| Connection refused | Browser crashed | Kill processes, restart |
| Timeout waiting | Page slow | Increase timeout |
| Context closed | Browser terminated | Check logs for crashes |

### Notebook Errors
| Error | Cause | Solution |
|-------|-------|----------|
| Notebook not found | Invalid ID | `run.py notebook_manager.py list` |
| Access denied | Not shared | Re-share in NotebookLM |
| Invalid URL | Wrong format | Use full NotebookLM URL |
| No active notebook | None selected | `run.py notebook_manager.py activate` |

## Prevention Tips

1. **Always use run.py** - Prevents 90% of issues
2. **Regular maintenance** - Clear browser state weekly
3. **Monitor queries** - Track daily count to avoid limits
4. **Backup library** - Export notebook list regularly
5. **Use dedicated account** - Separate Google account for automation

## Getting Help

### Diagnostic information to collect
```bash
# System info
python --version
cd ~/.claude/skills/notebooklm
ls -la

# Skill status
python scripts/run.py auth_manager.py status
python scripts/run.py notebook_manager.py list | head -5

# Check data directory
ls -la ~/.claude/skills/notebooklm/data/
```

### Common questions

**Q: Why doesn't this work in Claude web UI?**
A: Web UI has no network access. Use local Claude Code.

**Q: Can I use multiple Google accounts?**
A: Yes, use `run.py auth_manager.py reauth` to switch.

**Q: How to increase rate limit?**
A: Use multiple accounts or upgrade to Google Workspace.

**Q: Is this safe for my Google account?**
A: Use dedicated account for automation. Only accesses NotebookLM.