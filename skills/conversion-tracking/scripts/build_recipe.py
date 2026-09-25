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
library. Run from anywhere; paths resolve relative to this file.
"""
import argparse, json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DETECT_DIR = ROOT / "assets" / "gtm-recipes" / "detect"
SEND_DIR = ROOT / "assets" / "gtm-recipes" / "send"
EVENT_MAP = ROOT / "assets" / "gtm-recipes" / "event-map.json"


def fail(msg):
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(1)


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

    tokens = {}
    if args.send == "google-ads":
        if not (args.conversion_id and args.conversion_label):
            fail("--send google-ads requires --conversion-id and --conversion-label")
        tokens["__GOOGLE_ADS_CONVERSION_ID__"] = args.conversion_id.upper().removeprefix("AW-")
        tokens["__GOOGLE_ADS_CONVERSION_LABEL__"] = args.conversion_label
    elif args.send == "ga4":
        require(args.measurement_id, "--measurement-id")
        if not args.measurement_id.upper().startswith("G-"):
            fail(f"measurement ID should start with G- (got {args.measurement_id!r})")
        tokens["__GA4_MEASUREMENT_ID__"] = args.measurement_id.upper()
        tokens["__GA4_EVENT_NAME__"] = args.event_name or "generate_lead"
    elif args.send == "meta":
        require(args.pixel_id, "--pixel-id")
        tokens["__META_PIXEL_ID__"] = args.pixel_id
        tokens["__META_EVENT_NAME__"] = args.event_name or "Lead"
    elif args.send == "tiktok":
        require(args.pixel_id, "--pixel-id")
        tokens["__TIKTOK_PIXEL_ID__"] = args.pixel_id
        tokens["__TIKTOK_EVENT_NAME__"] = args.event_name or "SubmitForm"
    elif args.send == "linkedin":
        require(args.partner_id, "--partner-id")
        require(args.conversion_id, "--conversion-id")
        # This one is interpolated into JavaScript unquoted, so a non-numeric
        # value would produce a container that throws on every page.
        if not args.conversion_id.isdigit():
            fail(f"LinkedIn --conversion-id must be digits only (got {args.conversion_id!r})")
        tokens["__LINKEDIN_PARTNER_ID__"] = args.partner_id
        tokens["__LINKEDIN_CONVERSION_ID__"] = args.conversion_id
    elif args.send == "microsoft":
        require(args.uet_tag_id, "--uet-tag-id")
        tokens["__MICROSOFT_UET_TAG_ID__"] = args.uet_tag_id
        tokens["__MICROSOFT_EVENT_ACTION__"] = args.event_name or "submit_lead_form"

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

    out = json.dumps(detect, indent=2)
    for token, value in tokens.items():
        out = out.replace(token, value)
    leftover = [t for t in ("__GOOGLE_ADS", "__GA4_", "__META_", "__TIKTOK_",
                            "__LINKEDIN_", "__MICROSOFT_", "__RECIPE", "__DETECTION") if t in out]
    if leftover:
        fail(f"unreplaced placeholder tokens remain: {leftover}")

    Path(args.out).write_text(out + "\n")
    print(f"wrote {args.out}")
    print(f"  detects : {tool['label']} ({tool['moment']}) via dataLayer event '{tool['event']}'")
    print(f"  sends to: {args.send}")
    print("  import  : GTM > Admin > Import Container > choose this file > existing workspace > MERGE")
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
