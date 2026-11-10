#!/usr/bin/env python3
"""Check that every GTM detect recipe embeds its snippet verbatim.

Part of the conversion-tracking skill in Marketing Skills.

Each assets/gtm-recipes/detect/detect-<tool>.json carries one Custom HTML
listener tag. Its "html" parameter must equal the matching
assets/snippets/<tool>.js wrapped like this:

    "<script>\\n" + <snippet body> + "\\n</script>"

where <snippet body> is the .js file with its leading /*! ... */ license
header removed and trailing newlines stripped. The header is dropped because
the GTM tag name already identifies the recipe.

Usage:
  python3 scripts/check_recipes.py          # exit 1 and list any drift
  python3 scripts/check_recipes.py --write  # regenerate the embedded HTML

Uses only the Python standard library (3.8+).
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DETECT_DIR = ROOT / "assets" / "gtm-recipes" / "detect"
SNIPPET_DIR = ROOT / "assets" / "snippets"
HEADER_RE = re.compile(r"\A/\*!.*?\*/\n", re.S)


def expected_html(snippet_path):
    body = HEADER_RE.sub("", snippet_path.read_text(encoding="utf-8"), count=1)
    return "<script>\n" + body.rstrip("\n") + "\n</script>"


def html_param(recipe):
    tags = [t for t in recipe["containerVersion"]["tag"] if t.get("type") == "html"]
    if len(tags) != 1:
        raise ValueError(f"expected exactly 1 Custom HTML tag, found {len(tags)}")
    params = [p for p in tags[0]["parameter"] if p.get("key") == "html"]
    if len(params) != 1:
        raise ValueError("Custom HTML tag has no html parameter")
    return params[0]


def main():
    write = "--write" in sys.argv[1:]
    recipes = sorted(DETECT_DIR.glob("detect-*.json"))
    problems = []
    for recipe_path in recipes:
        tool = recipe_path.stem[len("detect-"):]
        snippet_path = SNIPPET_DIR / f"{tool}.js"
        if not snippet_path.exists():
            problems.append(f"{recipe_path.name}: no snippet {snippet_path.name}")
            continue
        try:
            recipe = json.loads(recipe_path.read_text(encoding="utf-8"))
            param = html_param(recipe)
        except (ValueError, KeyError) as e:
            problems.append(f"{recipe_path.name}: {e}")
            continue
        want = expected_html(snippet_path)
        if param["value"] == want:
            continue
        if write:
            param["value"] = want
            recipe_path.write_text(json.dumps(recipe, indent=2, ensure_ascii=False) + "\n",
                                   encoding="utf-8")
            print(f"rewrote {recipe_path.name}")
        else:
            problems.append(f"{recipe_path.name}: embedded HTML differs from {snippet_path.name}")

    orphans = {p.stem for p in SNIPPET_DIR.glob("*.js")} - {
        p.stem[len("detect-"):] for p in recipes}
    for name in sorted(orphans):
        problems.append(f"{name}.js: no detect recipe detect-{name}.json")

    if problems:
        print("\n".join(problems), file=sys.stderr)
        if not write:
            print("run with --write to regenerate the embedded HTML", file=sys.stderr)
        sys.exit(1)
    print(f"ok: {len(recipes)} detect recipes match their snippets")


if __name__ == "__main__":
    main()
