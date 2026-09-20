#!/usr/bin/env python3
"""Runnable subset of this skill's evals (see evals.json).

`evals.json` records what a good answer *should* contain, in prose. This script turns the
machine-checkable part of that into a program, so a answer can be checked without a human
reading it. It is deliberately narrow: every check below is stated somewhere in `SKILL.md`
or in eval id 1 of `evals.json`, and anything that needs judgement is left to the prose
assertions rather than guessed at here.

Usage:
    python3 check.py <reply.md|reply.json|workspace-dir> [--expect-name TaskFlow] [--json]
    python3 check.py --selftest

Exit codes: 0 = pass, 1 = fail, 2 = usage error.

The subject may be the reply on its own, or the directory the agent worked in: some agents
answer inline, some write `index.html` or `schema.json` and describe it in the reply. Both are
normal, so both channels are read.

Accepted output shapes (all are legal, and all are accepted on purpose):
  * <script type="application/ld+json"> ... </script>
  * a fenced ```json / ```jsonld block
  * a bare .json file
Two writers can pick different shapes, key order, or vocabulary and still be correct; the
checker must not turn one writer's style into the definition of "right".
"""

import argparse
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
FIXTURES = HERE / "fixtures"

SKIP_DIRS = {".git", ".opencode", "node_modules", "__pycache__", ".venv", "venv"}
# Harness bookkeeping, not the answer. A run log replays the prompt (and therefore the skill's
# own reference examples) into the workspace; counting that as the agent's output would let an
# agent pass by doing nothing.
SKIP_NAMES = {"events.jsonl", "opencode.json", "package-lock.json", "package.json"}
SKIP_SUFFIXES = (".jsonl", ".log")
MAX_FILE_BYTES = 2_000_000

SCRIPT_RE = re.compile(
    r"<script[^>]*type\s*=\s*[\"']application/ld\+json[\"'][^>]*>(.*?)</script>",
    re.DOTALL | re.IGNORECASE,
)
FENCE_RE = re.compile(r"^```(?:json|jsonld)\s*\n(.*?)^```", re.DOTALL | re.MULTILINE)

ORGANIZATION_REQUIRED = ("name", "url")
ORGANIZATION_RECOMMENDED = ("logo", "description", "sameAs")
ADDITIONAL_TYPES = ("WebSite", "SoftwareApplication", "Product")

PLACEHOLDER_PATTERNS = (
    r"example\.com",
    r"your\s*company",
    r"yourdomain",
    r"\bacme\s+corp\b",
    r"\btodo\b",
    r"\bxxx+\b",
    r"lorem ipsum",
    r"<\s*your[\s-]",
)

VALIDATION_TOOL_RE = re.compile(
    r"rich results test|search console|schema\.org validator|validator\.schema\.org",
    re.IGNORECASE,
)


def collect_sources(subject: Path):
    """Return [(label, text), ...] for a reply file or a whole workspace directory."""
    if subject.is_file():
        return [(subject.name, subject.read_text(errors="replace"))]

    sources = []
    for path in sorted(subject.rglob("*")):
        if not path.is_file():
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.name in SKIP_NAMES or path.name.endswith(SKIP_SUFFIXES):
            continue
        if path.stat().st_size > MAX_FILE_BYTES:
            continue
        try:
            text = path.read_text()
        except (UnicodeDecodeError, OSError):
            continue  # binary or unreadable: not part of the answer
        sources.append((str(path.relative_to(subject)), text))
    return sources


def extract_documents(sources):
    """Pull every JSON-LD candidate out of every source. Returns [(label, raw_json), ...]."""
    docs = []
    for label, text in sources:
        for i, block in enumerate(SCRIPT_RE.findall(text), 1):
            docs.append(("%s script-tag #%d" % (label, i), block))
        for i, block in enumerate(FENCE_RE.findall(text), 1):
            docs.append(("%s fenced-block #%d" % (label, i), block))
        if label.lower().endswith(".json"):
            docs.append(("%s (whole file)" % label, text))
    return docs


def walk_nodes(node):
    """Yield every dict node, descending into @graph and nested objects."""
    if isinstance(node, dict):
        yield node
        for value in node.values():
            for child in walk_nodes(value):
                yield child
    elif isinstance(node, list):
        for item in node:
            for child in walk_nodes(item):
                yield child


def type_names(node):
    value = node.get("@type")
    if isinstance(value, str):
        return (value,)
    if isinstance(value, list):
        return tuple(v for v in value if isinstance(v, str))
    return ()


def is_present(node, key):
    value = node.get(key)
    if value is None:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, (list, dict)):
        return len(value) > 0
    return True


def evaluate(sources, expect_name=None):
    """Run every check over one or more sources. Returns (checks, parsed_documents)."""
    text = "\n".join(t for _, t in sources)
    candidates = extract_documents(sources)
    parsed, parse_errors = [], []
    for label, raw in candidates:
        try:
            parsed.append((label, json.loads(raw)))
        except json.JSONDecodeError as exc:
            parse_errors.append("%s: %s" % (label, exc.msg))

    checks = []

    def add(name, ok, detail):
        checks.append({"check": name, "ok": bool(ok), "detail": detail})

    add(
        "json_ld_parses",
        bool(parsed),
        "parsed %d JSON-LD block(s)" % len(parsed)
        if parsed
        else "no parseable JSON-LD block found (%s)"
        % ("; ".join(parse_errors) if parse_errors else "none present"),
    )

    nodes = [node for _, doc in parsed for node in walk_nodes(doc)]
    orgs = [n for n in nodes if "Organization" in type_names(n)]
    add("organization_present", bool(orgs), "Organization node(s): %d" % len(orgs))

    org = orgs[0] if orgs else {}
    missing_required = [k for k in ORGANIZATION_REQUIRED if not is_present(org, k)]
    add(
        "organization_required_properties",
        bool(orgs) and not missing_required,
        "missing: %s" % ", ".join(missing_required) if missing_required else "name, url present",
    )

    missing_recommended = [k for k in ORGANIZATION_RECOMMENDED if not is_present(org, k)]
    add(
        "organization_recommended_properties",
        bool(orgs) and not missing_recommended,
        "missing: %s" % ", ".join(missing_recommended)
        if missing_recommended
        else "logo, description, sameAs present",
    )

    if expect_name:
        names = [str(org.get("name", "")) for org in orgs]
        matched = any(expect_name.lower() in n.lower() for n in names)
        add(
            "business_name_matches_prompt",
            matched,
            "expected %r, found %s" % (expect_name, names or "no Organization name"),
        )

    found_types = sorted({t for n in nodes for t in type_names(n)})
    additional = [t for t in ADDITIONAL_TYPES if t in found_types]
    add(
        "additional_relevant_types",
        bool(additional),
        "found: %s" % (", ".join(additional) if additional else "none of %s" % ", ".join(ADDITIONAL_TYPES)),
    )

    uses_graph = any(isinstance(doc, dict) and "@graph" in doc for _, doc in parsed)
    add(
        "graph_used_for_multiple_types",
        uses_graph,
        "@graph present"
        if uses_graph
        else "@graph not used (eval id 1 asks for it; separate <script> blocks are also legal)"
    )

    hits = []
    for pattern in PLACEHOLDER_PATTERNS:
        for match in re.finditer(pattern, text, re.IGNORECASE):
            hits.append(match.group(0))
    add(
        "no_placeholder_values",
        not hits,
        "placeholders: %s" % ", ".join(sorted(set(hits))) if hits else "none found",
    )

    tool_match = VALIDATION_TOOL_RE.search(text)
    add(
        "validation_tools_recommended",
        bool(tool_match),
        "mentioned %r" % tool_match.group(0) if tool_match else "no validator mentioned",
    )

    return checks, parsed


def evaluate_subject(subject: Path, expect_name=None):
    return evaluate(collect_sources(subject), expect_name=expect_name)


def report(checks, as_json, label):
    ok = all(c["ok"] for c in checks)
    if as_json:
        print(json.dumps({"subject": label, "pass": ok, "checks": checks}, indent=2))
        return ok
    print("%s: %s" % (label, "PASS" if ok else "FAIL"))
    for c in checks:
        print("  [%s] %-34s %s" % ("pass" if c["ok"] else "FAIL", c["check"], c["detail"]))
    return ok


def selftest(as_json):
    """The checker is only trustworthy if it accepts the good forms and rejects the bad ones."""
    expectations = (
        ("good-1.md", True),
        ("good-2.md", True),
        ("bad-1.md", False),
        ("bad-2.md", False),
    )
    suite = []
    for name, expected in expectations:
        path = FIXTURES / name
        if not path.exists():
            print("missing fixture: %s" % path, file=sys.stderr)
            return False
        checks, _ = evaluate_subject(path, expect_name="TaskFlow")
        actual = all(c["ok"] for c in checks)
        suite.append({"fixture": name, "expected_pass": expected, "actual_pass": actual, "checks": checks})
    ok = all(s["expected_pass"] == s["actual_pass"] for s in suite)
    if as_json:
        print(json.dumps({"selftest_pass": ok, "cases": suite}, indent=2))
    else:
        print("selftest: %s" % ("PASS" if ok else "FAIL"))
        for s in suite:
            verdict = "as expected" if s["expected_pass"] == s["actual_pass"] else "UNEXPECTED"
            print(
                "  %-12s expected=%-5s actual=%-5s %s"
                % (s["fixture"], "pass" if s["expected_pass"] else "fail", "pass" if s["actual_pass"] else "fail", verdict)
            )
    return ok


def main(argv=None):
    parser = argparse.ArgumentParser(description="Check a `schema` answer against the machine-checkable part of its evals.")
    parser.add_argument("subject", nargs="?", help="reply file, .json artifact, or the workspace directory")
    parser.add_argument("--expect-name", default="TaskFlow", help="business name the prompt names (default: TaskFlow)")
    parser.add_argument("--no-name-check", action="store_true", help="skip the business-name check")
    parser.add_argument("--json", action="store_true", help="emit machine-readable output")
    parser.add_argument("--selftest", action="store_true", help="run the fixtures and confirm the checker accepts/rejects them")
    args = parser.parse_args(argv)

    if args.selftest:
        return 0 if selftest(args.json) else 1

    if not args.subject:
        parser.print_usage(sys.stderr)
        print("error: give a reply file, or --selftest", file=sys.stderr)
        return 2

    path = Path(args.subject)
    if not path.exists():
        print("error: no such file: %s" % path, file=sys.stderr)
        return 2

    checks, _ = evaluate_subject(
        path, expect_name=None if args.no_name_check else args.expect_name
    )
    return 0 if report(checks, args.json, path.name) else 1


if __name__ == "__main__":
    sys.exit(main())
