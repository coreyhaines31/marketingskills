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
| Acuity Scheduling | `acuity-scheduling.js` on the site, plus `acuity-scheduling-field.html` in Acuity | Meeting booked | `acuity_appointment_scheduled` |
| Cal.com | `cal-com.js` | Meeting booked | `calcom_booking_successful` |
| Calendly | `calendly.js` | Meeting booked | `calendly_event_scheduled` |
| Contact Form 7 | `contact-form-7.js` | Form submission | `contact_form_7_submitted` |
| Divi Forms | `divi-forms.js` | Form submission | `divi_form_submitted` |
| Elementor Forms | `elementor-forms.js` | Form submission | `elementor_form_submitted` |
| Fluent Forms | `fluent-forms.js` | Form submission | `fluent_forms_submitted` |
| Formidable Forms | `formidable-forms.js` | Form submission | `formidable_forms_submitted` |
| Forminator | `forminator.js` | Form submission | `forminator_form_submitted` |
| Framer Forms | `framer-forms.js` | Form submission | `framer_form_submitted` |
| Gravity Forms | `gravity-forms.js` | Form submission | `gravity_form_submitted` |
| HubSpot Forms | `hubspot-forms.js` | Form submission | `hubspot_form_submitted` |
| Jotform | `jotform.js` | Form submission | `jotform_form_submitted` |
| Ninja Forms | `ninja-forms.js` | Form submission | `ninja_forms_submitted` |
| Squarespace Forms | `squarespace-forms.js` | Form submission | `squarespace_form_submitted` |
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
| `acuity-scheduling.js` | Native success event | a message from `acuity-scheduling-field.html`, which Acuity runs after each booking in its Custom Conversion Tracking sandbox frame on `conversion-tracking-sandbox.acuityinnovation.com` and which posts `%id%`, `%type%`, `%appointmentType%` and `%price%` to the site's own address; accepted only from an HTTPS `acuityinnovation.com` frame inside the page, carrying the field snippet's own `source` name and version; once per appointment ID. Reschedules never count. Package and gift certificate purchases fire too, so filter on `acuity_type` equals `appointment` |
| `cal-com.js` | Native success event | `bookingSuccessfulV2` postMessage with `originator` `CAL`, accepted only from a Cal.com iframe on the page and only from the origin its address starts with (`https://app.cal.com` for Cal.com's inline, popup and floating button embeds, `https://cal.com` for a booking page in a plain iframe); once per booking UID. Reschedules and the deprecated `bookingSuccessful`, which carries the attendee's name and email, never count. A booking that needs the host to confirm fires straight away with `booking_status` `PENDING`. Self-hosted Cal.com is not covered |
| `calendly.js` | Native success event | `calendly.event_scheduled` postMessage with origin `https://calendly.com`, accepted only from a connected `iframe[src^="https://calendly.com/"]` and only when its event and invitee `scheduled_events` URIs name the same event; once per event and invitee pair |
| `contact-form-7.js` | Native success event | `wpcf7mailsent` DOM event on a CF7 form with a numeric form ID; overlapping requests from one attempt (a repeat `wpcf7beforesubmit` while the form is still `submitting`) count once |
| `divi-forms.js` | DOM-inferred after submit | an `.et_pb_contact_form_container` shows `.et-pb-contact-message.et_pb_success_message` after Divi's response has removed `form.et_pb_contact_form`, with no `.et_pb_contact_error_meesage` (Divi's spelling) or `.et_contact_error`; once per message node |
| `elementor-forms.js` | Native success event | jQuery `submit_success` on `document` from a `form.elementor-form` that has an ID, a name other than `New Form`, or a widget `data-id`; each event counted once |
| `fluent-forms.js` | Native success event | jQuery `fluentform_submission_success` carrying a Fluent form and a `response` object; once per response object and form, since Fluent sends one success through three events |
| `formidable-forms.js` | Native success event (AJAX); DOM-inferred after submit (non-AJAX) | jQuery `frmFormComplete` / `frmBeforeFormRedirect`, once per response object; non-AJAX: a submit leaves a sessionStorage marker on page exit, then within 60s the next page shows `.frm_message` in `#frm_form_<id>_container`, or a same-site path change with the form gone, with no `.frm_error` / `.frm_blank_field` markers |
| `forminator.js` | Native success event (AJAX); DOM-inferred after submit (non-AJAX) | jQuery `forminator:form:submit:success` from a `form.forminator-custom-form`, each event counted once; non-AJAX: a visible `.forminator-response-message.forminator-success` inside a form without `forminator_ajax` on the returned page, once per form |
| `framer-forms.js` | DOM-inferred after submit | Framer's own form request: each OK response to a `fetch` POST to `api.framer.com/forms/v1/forms/<id>/submit` fires once (the snippet wraps `window.fetch`, so it must load before the submit); a capture-phase `submit`, or Enter in a valid Framer form, in the previous 60s only supplies `form_name`, left empty when several forms are pending |
| `gravity-forms.js` | Native success event; DOM-inferred after submit (builds without `gform.utils`) | `gform/ajax/post_ajax_submission` result with `success`, `is_valid`, `submission_type` `submit`, `is_spam` false and a positive `entry_id`, once per form and entry ID (the snippet switches non-AJAX and iframe submits to Gravity's AJAX); older builds: submit or `gform_submit_button_` click, then jQuery `gform_confirmation_loaded`, the AJAX iframe's postback or a visible `gform_confirmation_message_<id>`, or after a reload that form's confirmation within 60s with no validation errors; once per attempt |
| `hubspot-forms.js` | Native success event | for current-editor forms, HubSpot's `hs-form-event:on-submission:success` DOM event, counted only when `HubSpotFormsV4.getFormFromEvent` returns the form and instance the event names, once per HubSpot conversion ID; for legacy-editor forms (v2.js `hbspt.forms.create`), an `hsFormCallback` message with `onFormSubmitted` posted from the page's own window, never `onFormSubmit`, which also fires for submissions that then fail. Pushes `form_id` only. Legacy forms in a cross-origin iframe aren't counted. Submissions HubSpot's bot filter files under Spam still fire HubSpot's success event, so they count |
| `jotform.js` | Native success event | `{action: 'submission-completed', formID}` postMessage from `https://form.jotform.com` or `https://submit.jotform.com`, accepted only from an iframe on the page whose `form.jotform.com/<id>` address matches the form ID; once per iframe until the page reloads. Covers the iframe and script embeds, not the full source-code embed |
| `ninja-forms.js` | Native success event | Radio `forms` channel `submit:response` with empty `errors`, no `halt`, a `form_id` matching the callback's and a saved entry ID (`actions.save.sub_id`, so the form needs its Record Submission action); once per entry ID, with no DOM fallback |
| `squarespace-forms.js` | DOM-inferred after submit | submit on a Squarespace 7.1 Form block (`form.react-form-contents`), then the first of a success marker that wasn't showing when the attempt began (`react-form-contents--submitted`, a `.form-submission-text` message or the button's `success` class), or a 2xx answer to Squarespace's own `/api/form/SaveFormSubmission` request, read from resource timing (Chromium and Firefox expose its status, Safari doesn't) and credited only when no other form was submitted around it, or either of those as a redirect form leaves the page; never on a 400 or 401, a filled anti-spam field, or a save it can't tie to one form; once per form per page view. Lightbox forms, 7.0 forms, and commerce and member forms are not covered |
| `tally.js` | Native success event | `Tally.FormSubmitted` postMessage from `https://tally.so`, accepted only from a loaded `tally.so/embed`, `/r` or `/popup` iframe for the same form ID, with a submission `id` and a `fields` array; once per form and submission ID |
| `typeform.js` | Native success event | `form-submit` postMessage from an https `typeform.com` origin carrying `formId` and `responseId`, accepted only from a Typeform iframe on the page whose `/to/<formId>` address matches; once per form and response ID |
| `webflow-forms.js` | DOM-inferred after submit | submit on a form in `.w-form`, then within 30s `.w-form-done` becomes visible, or Webflow's own form state shows a redirect with `success === true` (checked on jQuery `ajaxComplete`); a newly shown `.w-form-fail` or the timeout cancels, and a resubmit replaces the pending watch |
| `wix-forms.js` | DOM-inferred after submit | click on a current Wix form's `[data-hook="submit-button"]`, then within 60s Wix's own thank-you message (`[data-hook="submit-form-success-message"]`) is added inside that form; a second click refreshes the same watch. Older Wix contact forms and forms set to redirect after submit are not covered |
| `wix-scheduling.js` | Native success event | `Purchase` from Wix's site analytics stream (`window.wixDevelopersAnalytics.register`) on the Thank You page, counted only when a line item's `catalogReference.appId` is Wix Bookings (`13d21c63-b5ec-5912-8397-c3a5ddb27a97`), so Wix Stores orders on the same page don't count; once per order ID, pushed as `booking_id`. Wix doesn't replay the event to a late listener, so load the snippet on every page. Wix sends it a few seconds after the Thank You page loads (3 to 13.5 seconds in testing), so a visitor who leaves sooner isn't counted |
| `wpforms.js` | Native success event (AJAX); DOM-inferred after submit (non-AJAX) | jQuery `wpformsAjaxSubmitSuccess` followed by a new `#wpforms-confirmation-<id>` node (once per node), or `wpformsAjaxSubmitBeforeRedirect`; non-AJAX: leaving the page within 10s of submit with no client validation errors stores a sessionStorage marker, then within 120s the next page shows `#wpforms-confirmation-<id>` or a different path, with no `.wpforms-error` / `[aria-invalid]` markers |
| `ws-form.js` | Native success event | jQuery `wsf-submit-success` on a `form.wsf-form` with a numeric form ID; repeats for the same form and instance within 2s count once |
| `phone-click.js` | Submit/click-based best effort | click on an `a[href^="tel:"]` (call intent, not a completed call) |
| `file-download.js` | Submit/click-based best effort | click on a link to a downloadable file extension |
| `thank-you-page.js` | DOM-inferred after submit | page path starts with a configured confirmation path |
| `generic-ajax-form.js` | DOM-inferred after submit | a success message appears within 7s of submit with no visible validation error |

**Acuity note.** Acuity Scheduling needs both of its files, because half the code goes inside Acuity. Acuity tells the page nothing about a booking. What it offers is a Custom Conversion Tracking field, and it runs whatever is pasted there after each booking, inside a sandbox frame on `conversion-tracking-sandbox.acuityinnovation.com`.

1. Paste `acuity-scheduling-field.html` into that field in Acuity (Integrations, then Custom Conversion Tracking), and put your own website address in `SITES`, or nothing counts. Acuity keeps about 2 KB in the field, and this file is about 1.3 KB.
2. Install `acuity-scheduling.js` on the site, or import its GTM recipe.

The field snippet posts `%id%`, `%type%`, `%appointmentType%` and `%price%` to the site's own address, and never reads the visitor's name, email or phone. The listener accepts only HTTPS `acuityinnovation.com` frames inside the page, once per appointment ID. Reschedules never count. Package and gift certificate purchases fire too, so add `acuity_type` equals `appointment` to the trigger to count only bookings. `appointment_type` is the business's own name for the service, so if it names a health service, don't forward it to ad platforms. It passed a live check on 15 Oct 2026 with two real bookings made by hand, because Acuity's booking form has reCAPTCHA, and a refused email counted nothing.

**Jotform note.** Use one method per form, either the thank-you redirect with `thank-you-page.js` or this snippet, never both. This snippet covers Jotform's iframe and script embeds, where Jotform sends the page a completion message, and passed live checks on both, including a submission Jotform's validation rejected. It doesn't cover the full source-code embed, which sends no such message, so use the redirect there. Payment, multi-page, save-and-continue and captcha forms are untested, so prefer the redirect for those too.

**PII note for `phone-click.js`.** It pushes the clicked number (`phone_number`) and the link text (`link_text`) to the dataLayer, and any tag can forward those. That is fine for a business's own published numbers. If a page shows visitor-specific numbers (an account page, a "your rep" number pulled from a CRM), remove those two fields from the push before installing.

## Verifying a snippet works

Open the browser console on the page carrying the form, submit a test entry, and run `window.dataLayer.filter(e => e.event === 'THE_EVENT_NAME')`, substituting the event this snippet pushes (listed above). Do not filter on `includes('submit')`: it silently misses every non-form moment, including bookings, phone clicks, downloads and thank-you pages. The tool's event should appear exactly once per submission. Two installs of the same snippet (pasted in the head AND imported into GTM, for example) share one guard, so they don't double fire. A double entry has a few possible causes, such as two detectors under different names, the tool sending the same success message twice, or a separate listener for the same form. If two detectors are listening, remove one.

The same detectors also ship, under different names, in the ConversionKit toolkit this skill adapts. Install them from one source only, or a site running both can count conversions twice.

---

*The detection snippets and GTM recipes in this skill are adapted from the open-source [ConversionKit conversion-tracking toolkit](https://github.com/ConversionKit/conversion-tracking) (MIT), maintained by the team behind Converly ◆, a Verified Partner of this repository. That team contributed them here under the same MIT license, with neutral naming.*
