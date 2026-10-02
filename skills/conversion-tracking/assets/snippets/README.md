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

## How sure each snippet is

Not every snippet fires on a confirmed success. Some tools expose no success signal, so the snippet arms on a submit or click and either infers success from what the page does next or counts the attempt. Three tiers:

- **Native success event** - the tool itself announces a successful submission (a JS event, callback or postMessage). Validation failures and server-side rejections never fire it.
- **DOM-inferred after submit** - the snippet arms on submit or click, then fires only when the tool's success UI appears (or a confirmation page loads) with no visible error. Strong, but breaks if the tool changes its markup.
- **Submit/click-based best effort** - the snippet fires on the submit or click itself. Server-side rejections, spam blocks and CAPTCHA failures still count. Pair with a thank-you page redirect plus `thank-you-page.js` when accuracy matters.

| Snippet | Signal type | Exact signal |
|---|---|---|
| `calendly.js` | Native success event | `calendly.event_scheduled` postMessage from calendly.com |
| `contact-form-7.js` | Native success event | `wpcf7mailsent` DOM event |
| `divi-forms.js` | DOM-inferred after submit | `.et-pb-contact-message` gains text with no `.et_contact_error` / error-text markers |
| `elementor-forms.js` | Native success event | jQuery `submit_success` on `document` |
| `fluent-forms.js` | Native success event | jQuery `fluentform_submission_success` |
| `formidable-forms.js` | Native success event (AJAX); DOM-inferred after submit (non-AJAX) | `frmFormComplete` / `frmBeforeFormRedirect`; non-AJAX: next page shows `.frm_message` or a redirect, with no error markers |
| `forminator.js` | Native success event | jQuery `forminator:form:submit:success` |
| `framer-forms.js` | Submit/click-based best effort | `submit` on a Framer form, not `defaultPrevented`, passing `checkValidity()` |
| `gravity-forms.js` | Native success event | jQuery `gform_confirmation_loaded`, with a MutationObserver fallback on the confirmation message |
| `jotform.js` | Native success event (iframe embed); submit/click-based best effort (source-code embed) | iframe: `{action: 'submission-completed', formID}` postMessage from jotform.com (works, but Jotform calls it unofficial); source embed: `submit` passing `checkValidity()` |
| `ninja-forms.js` | Native success event | Radio `forms` channel `submit:response` with no errors, with a MutationObserver fallback |
| `tally.js` | Native success event | `Tally.FormSubmitted` postMessage from tally.so |
| `typeform.js` | Native success event | `form-submit` postMessage from typeform.com carrying `formId` and `responseId` |
| `webflow-forms.js` | DOM-inferred after submit | `.w-form-done` becomes visible within 30s of submit (`.w-form-fail` or timeout cancels) |
| `wix-forms.js` | DOM-inferred after submit (new forms); submit/click-based best effort (old forms) | new: Submit click, then a success status/cleared form with no visible errors within 7s, or a page unload after a valid click; old: `submit` passing `checkValidity()` |
| `wix-scheduling.js` | DOM-inferred after submit | Book Now click stored in localStorage, then the `ThankYouPageAppDataHook.root` confirmation page renders within 10 minutes |
| `wpforms.js` | Native success event (AJAX); DOM-inferred after submit (non-AJAX) | jQuery `wpformsAjaxSubmitSuccess`; non-AJAX: next page shows the confirmation container or a redirect, with no error markers |
| `ws-form.js` | Native success event | jQuery `wsf-success` |
| `phone-click.js` | Submit/click-based best effort | click on an `a[href^="tel:"]` (call intent, not a completed call) |
| `file-download.js` | Submit/click-based best effort | click on a link to a downloadable file extension |
| `thank-you-page.js` | DOM-inferred after submit | page path starts with a configured confirmation path |
| `generic-ajax-form.js` | DOM-inferred after submit | a success message appears within 7s of submit with no visible validation error |

**PII note for `phone-click.js`.** It pushes the clicked number (`phone_number`) and the link text (`link_text`) to the dataLayer, and any tag can forward those. That is fine for a business's own published numbers. If a page shows visitor-specific numbers (an account page, a "your rep" number pulled from a CRM), remove those two fields from the push before installing.

## Verifying a snippet works

Open the browser console on the page carrying the form, submit a test entry, and run `window.dataLayer.filter(e => e.event === 'THE_EVENT_NAME')`, substituting the event this snippet pushes (listed above). Do not filter on `includes('submit')`: it silently misses every non-form moment, including bookings, phone clicks, downloads and thank-you pages. The tool's event should appear exactly once per submission. Each snippet deduplicates its own fire paths, so a double entry means the snippet was installed twice (for example pasted in the head AND imported into GTM). Remove one.

---

*The detection snippets and GTM recipes in this skill are adapted from the open-source [ConversionKit conversion-tracking toolkit](https://github.com/ConversionKit/conversion-tracking) (MIT), maintained by the team behind Converly ◆, a Verified Partner of this repository. That team contributed them here under the same MIT license, with neutral naming.*
