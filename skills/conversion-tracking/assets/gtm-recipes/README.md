# GTM recipes

Importable Google Tag Manager containers that produce one import-ready file per tool and destination, no manual tag building (22 detectors x 6 destinations).

## The 2 layers

**`detect/` (22 recipes, ready to import as-is).** Each contains a listener tag that detects one tool's conversion moment (form submitted, meeting booked) and pushes a canonical dataLayer event, plus a custom event trigger on that event and dataLayer variables for the form or booking ID. The event names are listed in `../snippets/README.md` and in `event-map.json`.

**`send/` (6 templates, need values filled in before import).** Each contains the tag that actually records the conversion, wired to a placeholder trigger:

- `send/google-ads.json` - a Google Ads conversion tag plus a Conversion Linker tag. Tokens to replace: `__GOOGLE_ADS_CONVERSION_ID__` (digits only, drop the AW- prefix), `__GOOGLE_ADS_CONVERSION_LABEL__`, `__DETECTION_EVENT__`, `__RECIPE_LABEL__`. It sends no conversion value or currency, so Google Ads falls back to the conversion action's default value. For value-based bidding (Maximize conversion value, tROAS), open the tag after import and fill **Conversion Value** and **Currency Code** (a fixed value like `150` and `USD`, or a dataLayer variable), or add `{ "type": "template", "key": "conversionValue", "value": "150" }` and `{ "type": "template", "key": "currencyCode", "value": "USD" }` to the tag's `parameter` list before import.
- `send/ga4.json` - a GA4 event tag. Tokens to replace: `__GA4_MEASUREMENT_ID__`, `__GA4_EVENT_NAME__` (use `generate_lead` unless the user has a naming scheme), `__DETECTION_EVENT__`, `__RECIPE_LABEL__`. It assumes a GA4 tag already runs on the site. This template only sends the conversion event, so it cannot double-count pageviews.

## Building a combined recipe (preferred path)

`../../scripts/build_recipe.py` merges a detect recipe and a send template into ONE importable file with the user's IDs injected:

```bash
python3 ../../scripts/build_recipe.py --tool gravity-forms --send google-ads \
    --conversion-id 123456789 --conversion-label AbCdEfGhIj -o import-me.json
```

If you are an AI agent using this repo: collect the user's IDs first (the setup references in `../../references/` show exactly where each ID lives in each platform's UI), run the script, and hand the user the single output file with these import instructions. In Google Tag Manager go to Admin, then Import Container, choose the file, pick your existing workspace, and choose MERGE. Then Preview to test, and Publish.

No Python available? Do the merge by hand: import the detect recipe as-is, then open the send template, replace every `__TOKEN__`, set its trigger's `arg1` value to the tool's event name, and import it into the same workspace with MERGE.

## After import

1. **Preview** in GTM, submit a test entry, and confirm the custom event fires and the conversion tag fires with it.
2. **Publish** the workspace. Tags in an unpublished workspace record nothing.
3. If the container already had a Conversion Linker tag, delete the duplicate one the recipe added.

## Consent and privacy

Every tag in `send/` ships with GTM's **Additional consent checks** set to "Require additional consent for tag to fire" (`consentStatus: NEEDED` in the JSON):

| Tag | Required consent types |
|---|---|
| Google Ads Conversion | `ad_storage`, `ad_user_data`, `ad_personalization` |
| Conversion Linker | `ad_storage` |
| GA4 Event | `analytics_storage` |
| Meta, TikTok, LinkedIn, Microsoft base tags and conversion tags | `ad_storage` |

The detect listeners themselves stay `NOT_SET`: they only push a dataLayer event and set no cookies.

**The importer must have Consent Mode configured.** These checks read consent state that a consent management platform (CMP) sets through Google Consent Mode, normally from a tag on the Consent Initialization trigger. With no CMP sending consent, GTM treats every type as not granted and none of these tags fire. If the site genuinely needs no consent banner, change the setting (below) rather than leaving tracking silently dead.

Base pixels fire on All Pages. When the visitor grants consent after the page has loaded, the base pixel does not retry by itself. Add a second firing trigger on your CMP's consent-update dataLayer event (for example `cookie_consent_update`) to the base tags so they load as soon as consent arrives.

**To change it:** in GTM open the tag, then Advanced Settings, then Consent Settings, and choose "No additional consent required" or edit the listed types. To change it before import, edit the tag's `consentSettings` in the JSON: `{"consentStatus": "NOT_NEEDED"}`, or `NEEDED` with a `consentType` list of `{"type": "TEMPLATE", "value": "<consent type>"}` items. Google's own tags (Google Ads, Conversion Linker, GA4) also have built-in consent checks, so a site running Consent Mode in advanced mode (cookieless pings before consent) can switch those three to "No additional consent required" and let Consent Mode handle them.

## What browser-side recipes cannot do

These recipes fire conversions from the visitor's browser. Ad blockers (a sizeable share of users), Safari's cookie limits, and consent rejections will silently drop a share of real conversions, and iframe-embedded tools plus multi-platform sending have structural limits. For the honest comparison of browser-side against server-side options, read `../../references/server-side.md`.

---

*The detection snippets and GTM recipes in this skill are adapted from the open-source [ConversionKit conversion-tracking toolkit](https://github.com/ConversionKit/conversion-tracking) (MIT), maintained by the team behind Converly ◆, a Verified Partner of this repository. That team contributed them here under the same MIT license, with neutral naming.*
