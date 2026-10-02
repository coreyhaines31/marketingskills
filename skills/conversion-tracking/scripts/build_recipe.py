#!/usr/bin/env python3
"""Build a single importable GTM container from a detection recipe plus a
send template, with the user's own IDs injected.

Part of the conversion-tracking skill in Marketing Skills.

Examples:
  python3 scripts/build_recipe.py --tool gravity-forms --send google-ads \
      --conversion-id 123456789 --conversion-label AbCdEfGhIj -o import-me.json

  python3 scripts/build_recipe.py --tool typeform --send ga4 \
      --measurement-id G-ABC123XYZ --event-name generate_lead -o import-me.json

The output file is imported in GTM via Admin > Import Container, choosing an
existing workspace and MERGE (not overwrite). Uses only the Python standard
library (3.8+). Run from anywhere; paths resolve relative to this file.

Every ID is checked against its platform's format before use, and values are
substituted into the parsed container (never into serialized JSON), with
JavaScript escaping inside Custom HTML tags.
"""
import argparse, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DETECT_DIR = ROOT / "assets" / "gtm-recipes" / "detect"
SEND_DIR = ROOT / "assets" / "gtm-recipes" / "send"
EVENT_MAP = ROOT / "assets" / "gtm-recipes" / "event-map.json"

# (pattern, human description) per kind of ID. Kept strict on purpose: every
# accepted value is also safe inside a quoted or unquoted JavaScript literal.
FORMATS = {
    "google_ads_id": (r"[0-9]{6,15}", "digits, e.g. 123456789 (AW- prefix optional)"),
    "google_ads_label": (r"[A-Za-z0-9_-]{1,64}", "letters, digits, _ and -, e.g. AbCdEfGhIj"),
    "ga4_id": (r"G-[A-Z0-9]{4,20}", "G- followed by letters and digits, e.g. G-ABC123XYZ"),
    "meta_pixel": (r"[0-9]{6,20}", "digits, e.g. 1234567890123456"),
    "tiktok_pixel": (r"[A-Z0-9]{10,30}", "uppercase letters and digits, e.g. C4ABCDEFGH1234567890"),
    "linkedin_partner": (r"[0-9]{1,15}", "digits, e.g. 1234567"),
    "linkedin_conversion": (r"[0-9]{1,15}", "digits, e.g. 12345678"),
    "uet_tag": (r"[0-9]{4,15}", "digits, e.g. 187000000"),
    "event_name": (r"[A-Za-z][A-Za-z0-9_]{0,49}", "a letter then letters, digits or _, max 50 chars"),
    "ga4_event_name": (r"[A-Za-z][A-Za-z0-9_]{0,39}", "a letter then letters, digits or _, max 40 chars"),
}
TOKEN_RE = re.compile(r"__[A-Z0-9]+(?:_[A-Z0-9]+)*__")


def fail(msg):
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(1)


def validated(value, kind, flag):
    pattern, desc = FORMATS[kind]
    if not re.fullmatch(pattern, value):
        fail(f"{flag} {value!r} is not valid: expected {desc}")
    return value


def js_escape(value):
    # For Custom HTML: safe inside a '...' or "..." JS string and cannot
    # close the surrounding <script> element.
    out = value.replace("\\", "\\\\").replace("'", "\\'").replace('"', '\\"')
    out = out.replace("\n", "\\n").replace("\r", "\\r")
    return out.replace("<", "\\x3c").replace(">", "\\x3e")


def substitute(node, tokens, in_html=False):
    """Replace tokens in every string value of a parsed GTM container."""
    if isinstance(node, dict):
        is_html = node.get("key") == "html"
        return {k: substitute(v, tokens, in_html or (is_html and k == "value"))
                for k, v in node.items()}
    if isinstance(node, list):
        return [substitute(v, tokens, in_html) for v in node]
    if isinstance(node, str):
        for token, value in tokens.items():
            if token in node:
                node = node.replace(token, js_escape(value) if in_html else value)
        return node
    return node


def leftover_tokens(node):
    found = set()
    if isinstance(node, dict):
        for v in node.values():
            found |= leftover_tokens(v)
    elif isinstance(node, list):
        for v in node:
            found |= leftover_tokens(v)
    elif isinstance(node, str):
        found |= set(TOKEN_RE.findall(node))
    return found


def main():
    events = json.loads(EVENT_MAP.read_text())
    sends = sorted(p.stem for p in SEND_DIR.glob("*.json"))

    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--tool", required=True, choices=sorted(events), help="form/booking tool")
    ap.add_argument("--send", required=True, choices=sends, help="destination template")
    ap.add_argument("--conversion-id", help="Google Ads conversion ID (AW- prefix is stripped), or LinkedIn conversion ID")
    ap.add_argument("--conversion-label", help="Google Ads conversion label")
    ap.add_argument("--measurement-id", help="GA4 measurement ID, e.g. G-ABC123XYZ")
    ap.add_argument("--pixel-id", help="Meta pixel ID or TikTok pixel ID")
    ap.add_argument("--partner-id", help="LinkedIn partner ID (from the Insight Tag)")
    ap.add_argument("--uet-tag-id", help="Microsoft UET tag ID")
    ap.add_argument("--event-name", help="event name; defaults per destination "
                                         "(ga4 generate_lead, meta Lead, tiktok SubmitForm, "
                                         "microsoft submit_lead_form)")
    ap.add_argument("-o", "--out", default="conversion-tracking-import.json")
    args = ap.parse_args()

    def require(value, flag):
        if not value:
            fail(f"--send {args.send} requires {flag}")
        return value

    def event_name(default, kind="event_name"):
        return validated(args.event_name or default, kind, "--event-name")

    tokens = {}
    if args.send == "google-ads":
        if not (args.conversion_id and args.conversion_label):
            fail("--send google-ads requires --conversion-id and --conversion-label")
        conversion_id = re.sub(r"^AW-", "", args.conversion_id.strip(), flags=re.I)
        tokens["__GOOGLE_ADS_CONVERSION_ID__"] = validated(conversion_id, "google_ads_id", "--conversion-id")
        tokens["__GOOGLE_ADS_CONVERSION_LABEL__"] = validated(
            args.conversion_label.strip(), "google_ads_label", "--conversion-label")
    elif args.send == "ga4":
        require(args.measurement_id, "--measurement-id")
        tokens["__GA4_MEASUREMENT_ID__"] = validated(
            args.measurement_id.strip().upper(), "ga4_id", "--measurement-id")
        tokens["__GA4_EVENT_NAME__"] = event_name("generate_lead", "ga4_event_name")
    elif args.send == "meta":
        require(args.pixel_id, "--pixel-id")
        tokens["__META_PIXEL_ID__"] = validated(args.pixel_id.strip(), "meta_pixel", "--pixel-id")
        tokens["__META_EVENT_NAME__"] = event_name("Lead")
    elif args.send == "tiktok":
        require(args.pixel_id, "--pixel-id")
        tokens["__TIKTOK_PIXEL_ID__"] = validated(args.pixel_id.strip(), "tiktok_pixel", "--pixel-id")
        tokens["__TIKTOK_EVENT_NAME__"] = event_name("SubmitForm")
    elif args.send == "linkedin":
        require(args.partner_id, "--partner-id")
        require(args.conversion_id, "--conversion-id")
        tokens["__LINKEDIN_PARTNER_ID__"] = validated(
            args.partner_id.strip(), "linkedin_partner", "--partner-id")
        # Interpolated into JavaScript unquoted, so it must be digits.
        tokens["__LINKEDIN_CONVERSION_ID__"] = validated(
            args.conversion_id.strip(), "linkedin_conversion", "--conversion-id")
    elif args.send == "microsoft":
        require(args.uet_tag_id, "--uet-tag-id")
        tokens["__MICROSOFT_UET_TAG_ID__"] = validated(args.uet_tag_id.strip(), "uet_tag", "--uet-tag-id")
        tokens["__MICROSOFT_EVENT_ACTION__"] = event_name("submit_lead_form")

    tool = events[args.tool]
    tokens["__RECIPE_LABEL__"] = tool["label"]
    tokens["__DETECTION_EVENT__"] = tool["event"]

    detect = json.loads((DETECT_DIR / f"detect-{args.tool}.json").read_text())
    send = json.loads((SEND_DIR / f"{args.send}.json").read_text())
    dcv, scv = detect["containerVersion"], send["containerVersion"]

    # The detect recipe already has a custom-event trigger on the tool's
    # event; rewire the send tags to it and drop the template's duplicate.
    detect_trigger = next(t for t in dcv["trigger"] if t["type"] == "customEvent")
    send_trigger_ids = {t["triggerId"] for t in scv.get("trigger", [])}

    next_id = 1000
    for tag in scv.get("tag", []):
        tag["tagId"] = str(next_id)
        next_id += 1
        tag["firingTriggerId"] = [
            detect_trigger["triggerId"] if tid in send_trigger_ids else tid
            for tid in tag.get("firingTriggerId", [])
        ]
        dcv["tag"].append(tag)
    for var in scv.get("variable", []):
        var["variableId"] = str(next_id)
        next_id += 1
        dcv.setdefault("variable", []).append(var)

    dcv["container"]["name"] = f"Conversion Tracking - {tool['label']} to {args.send}"

    detect = substitute(detect, tokens)
    leftover = sorted(leftover_tokens(detect))
    if leftover:
        fail(f"unreplaced placeholder tokens remain: {leftover}")

    Path(args.out).write_text(json.dumps(detect, indent=2) + "\n")
    print(f"wrote {args.out}")
    print(f"  detects : {tool['label']} ({tool['moment']}) via dataLayer event '{tool['event']}'")
    print(f"  sends to: {args.send}")
    print("  import  : GTM > Admin > Import Container > choose this file > existing workspace > MERGE")
    print("  consent : send tags require consent (see Consent and privacy in "
          "assets/gtm-recipes/README.md); the site needs Consent Mode or a CMP, or they never fire")
    if args.send == "google-ads":
        print("  note    : if the container already has a Conversion Linker tag, delete the duplicate after import")
    if args.send in ("meta", "tiktok", "linkedin", "microsoft"):
        print(f"  note    : this bundles a base pixel tag on All Pages. If the site already has a "
              f"{args.send} pixel, DELETE the base tag after import. Two base pixels on one page "
              f"is a top cause of doubled conversions.")
    if args.send == "microsoft":
        print("  note    : Microsoft counts nothing until a UET conversion goal exists. Create an "
              "event goal whose Action exactly matches the event name above; it is case sensitive.")


if __name__ == "__main__":
    main()
