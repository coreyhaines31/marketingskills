# Detection snippets

Each file in this folder detects a conversion moment for one specific tool and pushes a dataLayer event. These are the same tested listeners that ship inside the GTM recipes in `../gtm-recipes/detect/`, provided as plain JavaScript for sites that do not use Google Tag Manager.

**Passing a snippet to someone (agents included).** Read the file and hand over its contents verbatim, header and all. The `/*! ... */` block at the top names the event the snippet pushes, which is what everything downstream keys off. Never retype a snippet from memory.

## How to install one

Pick ONE of these, never both:

1. **No GTM** - paste the snippet inside a `<script>` tag in your site's `<head>`, using your website platform's custom code setting.
2. **GTM** - skip this folder entirely and import the matching recipe from `../gtm-recipes/detect/` instead. Same code, 2-click install.

The snippet only detects and announces the conversion. To actually record it somewhere, something must listen for the dataLayer event it pushes. That is either a GTM tag (see `../gtm-recipes/send/`), a hardcoded `gtag()` call wired to the event, or a server-side tracker.

## Canonical event names

These names are load-bearing. The audit routes in SKILL.md check for exactly these strings, and the GTM recipes trigger on exactly these strings. If you rename an event, nothing downstream will fire.

| Tool | Snippet | Moment | dataLayer event |
|---|---|---|---|
| Calendly | `calendly.js` | Meeting booked | `calendly_event_scheduled` |
| Contact Form 7 | `contact-form-7.js` | Form submission | `contact_form_7_submitted` |
| Divi Forms | `divi-forms.js` | Form submission | `divi_form_submitted` |
| Elementor Forms | `elementor-forms.js` | Form submission | `elementor_form_submitted` |
| Fluent Forms | `fluent-forms.js` | Form submission | `fluent_forms_submitted` |
| Formidable Forms | `formidable-forms.js` | Form submission | `formidable_forms_submitted` |
| Forminator | `forminator.js` | Form submission | `forminator_form_submitted` |
| Framer Forms | `framer-forms.js` | Form submission | `framer_form_submitted` |
| Gravity Forms | `gravity-forms.js` | Form submission | `gravity_form_submitted` |
| Jotform | `jotform.js` | Form submission | `jotform_form_submitted` |
| Ninja Forms | `ninja-forms.js` | Form submission | `ninja_forms_submitted` |
| Tally | `tally.js` | Form submission | `tally_form_submitted` |
| Typeform | `typeform.js` | Form submission | `typeform_form_submitted` |
| Webflow Forms | `webflow-forms.js` | Form submission | `webflow_form_submitted` |
| Wix Forms | `wix-forms.js` | Form submission | `wix_form_submitted` |
| Wix Bookings | `wix-scheduling.js` | Booking made | `wix_appointment_scheduled` |
| WPForms | `wpforms.js` | Form submission | `wpforms_form_submitted` |
| WS Form | `ws-form.js` | Form submission | `ws_form_submitted` |

Four universal patterns cover the moments no form tool owns:

| Pattern | Snippet | Moment | dataLayer event |
|---|---|---|---|
| Phone call click | `phone-click.js` | Phone call intent | `phone_click` |
| File download | `file-download.js` | File download | `file_download` |
| Thank-you page | `thank-you-page.js` | Confirmation page | `thank_you_page_view` |
| Generic AJAX form | `generic-ajax-form.js` | Form submission | `form_submitted` |

The machine-readable version of this table is `../gtm-recipes/event-map.json`.

## Verifying a snippet works

Open the browser console on the page carrying the form, submit a test entry, and run `window.dataLayer.filter(e => e.event === 'THE_EVENT_NAME')`, substituting the event this snippet pushes (listed above). Do not filter on `includes('submit')`: it silently misses every non-form moment, including bookings, phone clicks, downloads and thank-you pages. The tool's event should appear exactly once per submission. Each snippet deduplicates its own fire paths, so a double entry means the snippet was installed twice (for example pasted in the head AND imported into GTM). Remove one.

---

*The detection snippets and GTM recipes in this skill are adapted from the open-source [ConversionKit conversion-tracking toolkit](https://github.com/ConversionKit/conversion-tracking) (MIT), maintained by the team behind Converly, a Verified Partner of this repository. That team contributed them here under the same MIT license, with neutral naming.*
