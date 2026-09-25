/*! Fluent Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: fluent_forms_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectFluentForms) return;
  window.__ctDetectFluentForms = true;
  window.dataLayer = window.dataLayer || [];

  function isFluentForm(formEl) {
    if (!formEl) return false;
    if (formEl.className && formEl.className.indexOf('frm-fluent-form') !== -1) return true;
    try {
      if (formEl.closest && formEl.closest('.fluentform')) return true;
    } catch (e) {
      // .closest not available — fall back to ID check
    }
    var id = formEl.id || '';
    return /^fluentform_\d+$/.test(id);
  }

  // Accepts a jQuery object or a DOM element; returns the underlying DOM
  // element if it is a Fluent Forms <form>, else null.
  function asFluentForm(candidate) {
    if (!candidate) return null;
    var el = candidate;
    if (el.jquery && el.length) el = el[0]; // unwrap jQuery objects only —
    // never plain elements: form[0] on a raw <form> is its first control.
    if ((el.tagName || '').toLowerCase() === 'form' && isFluentForm(el)) return el;
    return null;
  }

  // Click-tracking fallback for form attribution: remember the Fluent form
  // whose submit button was most recently clicked, in case an old Fluent
  // Forms version fires the success event without a form reference.
  var lastActiveForm = null;

  function trackSubmitClick(event) {
    try {
      var target = event.target;
      if (!target || !target.closest) return;
      var btn = target.closest('.ff-btn-submit');
      if (!btn) return;
      var form = btn.closest('form');
      if (form && isFluentForm(form)) lastActiveForm = form;
    } catch (e) {
      // non-fatal
    }
  }

  // Resolution order (first valid Fluent form wins) — live-verified against
  // Fluent Forms 6.2.5, 2026-07-05:
  //   1. data.form from the handler's data argument — the <body> dispatch
  //      passes { form, config, response } where form is the jQuery-wrapped
  //      form (also accept data itself being the form, defensively)
  //   2. event.originalEvent.detail.form — the native CustomEvent dispatch
  //      carries the raw form element in detail
  //   3. event.target, if it IS a Fluent form (direct-on-form re-trigger)
  //   4. the form whose submit button was most recently clicked
  //   5. the only .frm-fluent-form on the page, if exactly one exists
  function resolveSuccessForm(event, data) {
    var el = asFluentForm(data && data.form) || asFluentForm(data);
    if (el) return el;

    try {
      var oe = event && event.originalEvent;
      if (oe && oe.detail) {
        el = asFluentForm(oe.detail.form);
        if (el) return el;
      }
    } catch (e) {
      // originalEvent/detail unreadable — keep falling back
    }

    el = asFluentForm(event && event.target);
    if (el) return el;

    if (lastActiveForm && document.contains(lastActiveForm) && isFluentForm(lastActiveForm)) {
      return lastActiveForm;
    }

    try {
      var forms = document.querySelectorAll('.frm-fluent-form');
      if (forms.length === 1) return forms[0];
    } catch (e) {
      // querySelectorAll unavailable — give up
    }

    return null;
  }

  // Dedup: one successful submission reaches a document-level jQuery
  // listener TWICE on current Fluent Forms (the jQuery <body> trigger and
  // the native CustomEvent) — verified live. Both duplicates resolve to the
  // same form within the same tick, so fire once per form per 2s window
  // (matches production listener behaviour). Rapid legitimate
  // re-submissions of the same form take well over 2s (server round trip +
  // success render), so none are lost.
  var lastFiredForm = null;
  var lastFiredAt = 0;

  function fireConversion(formEl) {
    var now = new Date().getTime();
    if (lastFiredForm === formEl && now - lastFiredAt < 2000) return;
    lastFiredForm = formEl;
    lastFiredAt = now;
    window.dataLayer.push({
      event: 'fluent_forms_submitted',
      form_id: (formEl && formEl.id) || ''
    });
  }

  // Fire path — Fluent Forms' success signal, fired once an AJAX submission
  // passes server-side validation. This is the ONLY path this recipe
  // tracks; Fluent Forms always submits via AJAX (there is no non-AJAX
  // mode to miss). Client-side validation failures, native HTML5 blocks,
  // and server-side rejections never fire it. Hooked via jQuery because
  // the <body> dispatch is jQuery-only AND jQuery is guaranteed on any
  // working Fluent Forms page (Fluent Forms' own submission handler
  // requires it — without jQuery the form cannot submit at all).
  var successHooked = false;

  function hookFluentSuccess() {
    if (successHooked) return true;
    if (typeof window.jQuery === 'undefined') return false;

    window.jQuery(document).on('fluentform_submission_success', function (event, data) {
      fireConversion(resolveSuccessForm(event, data));
    });
    successHooked = true;
    return true;
  }

  document.addEventListener('click', trackSubmitClick, true);

  if (!hookFluentSuccess()) {
    document.addEventListener('DOMContentLoaded', function () {
      hookFluentSuccess();
    });
    window.addEventListener('load', function () {
      hookFluentSuccess();
    });
  }
})();
