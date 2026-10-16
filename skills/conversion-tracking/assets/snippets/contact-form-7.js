/*! Contact Form 7 conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: contact_form_7_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  'use strict';

  // One shared runtime owns eligibility, accepted event identity, and the ID-only fallback.
  // A legacy recipe guard without this runtime is unknown code, so do not stack a new listener.
  var runtime = window.__ctCf7Runtime;
  if (runtime && runtime.installed) return;
  if (!runtime && window.__ctDetectContactForm7) return;
  runtime = runtime || { installed: false };
  window.__ctCf7Runtime = runtime;
  window.__ctDetectContactForm7 = true;
  window.dataLayer = window.dataLayer || [];
  var seenEvents = typeof WeakSet === 'function' ? new WeakSet() : null;
  var seenEventFallback = [];

  function isContactForm7Form(formEl) {
    if (!formEl || (formEl.tagName || '').toLowerCase() !== 'form') return false;
    try {
      if (formEl.classList && formEl.classList.contains('wpcf7-form')) return true;
      return !!(formEl.closest && formEl.closest('.wpcf7'));
    } catch (e) {
      return false;
    }
  }

  function validFormId(value) {
    if (typeof value === 'number' && Number.isFinite(value) && Math.floor(value) === value && value > 0 && value <= 9007199254740991) return String(value);
    if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return '';
    var number = Number(value);
    return Number.isFinite(number) && number <= 9007199254740991 && String(number) === value ? value : '';
  }

  function readFormId(formEl, event) {
    // CF7 6.1.6's event detail has contactFormId; read no other detail keys.
    var detailId = '';
    try {
      detailId = validFormId(event && event.detail && event.detail.contactFormId);
    } catch (e) {}
    if (detailId) return detailId;

    // Compatibility fallback for markup where the event detail omits the ID.
    try {
      var directId = validFormId(formEl.getAttribute && formEl.getAttribute('data-wpcf7-id'));
      if (directId) return directId;
      var wrap = formEl.closest && formEl.closest('.wpcf7');
      return validFormId(wrap && wrap.getAttribute && wrap.getAttribute('data-wpcf7-id'));
    } catch (e) {
      return '';
    }
  }

  // CF7 can send both clicks while the first request is still pending.
  // Group those requests without blocking or changing the form submission.
  document.addEventListener('wpcf7beforesubmit', function (event) {
    var formEl = event && event.target;
    if (!isContactForm7Form(formEl)) return;
    if (!formEl.__ctCf7Attempt || formEl.getAttribute('data-status') !== 'submitting') {
      formEl.__ctCf7Attempt = { emitted: false };
    }
  }, false);

  document.addEventListener('wpcf7mailsent', function (event) {
    var formEl = event && event.target;
    if (!isContactForm7Form(formEl)) return;
    if (seenEvents) {
      if (seenEvents.has(event)) return;
      seenEvents.add(event);
    } else {
      if (seenEventFallback.indexOf(event) !== -1) return;
      seenEventFallback.push(event);
      if (seenEventFallback.length > 50) seenEventFallback.shift();
    }

    var formId = readFormId(formEl, event);
    if (!formId) return;
    var attempt = formEl.__ctCf7Attempt;
    if (attempt && attempt.emitted) return;
    if (attempt) attempt.emitted = true;

    // The optional Method 2 adapter may enrich this accepted event. It must
    // return literal true only after pushing; otherwise the shared core emits
    // the same event with IDs only. Neither path inspects event.detail values.
    var enriched = false;
    try {
      if (typeof window.__ctCf7Method2Emit === 'function') {
        enriched = window.__ctCf7Method2Emit(formEl, event, formId) === true;
      }
    } catch (e) {
      enriched = false;
    }
    if (!enriched) {
      window.dataLayer.push({ event: 'contact_form_7_submitted', form_id: formId });
    }
  }, false);
  runtime.installed = true;
})();
