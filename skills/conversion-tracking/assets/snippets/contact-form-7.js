/*! Contact Form 7 conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: contact_form_7_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectContactForm7) return;
  window.__ctDetectContactForm7 = true;
  window.dataLayer = window.dataLayer || [];

  function fireConversion(formEl) {
    // Modern Contact Form 7 (verified against 6.1.6 on a live site) puts
    // data-wpcf7-id on the WRAPPING <div class="wpcf7">, not on the <form>
    // element itself. Check the form first (older/other CF7 setups may
    // still stamp it there) and fall back to the wrapper.
    var formId = '';
    try {
      if (formEl && formEl.getAttribute) {
        formId = formEl.getAttribute('data-wpcf7-id') || '';
      }
      if (!formId && formEl && formEl.closest) {
        var wrap = formEl.closest('.wpcf7');
        if (wrap && wrap.getAttribute) {
          formId = wrap.getAttribute('data-wpcf7-id') || '';
        }
      }
    } catch (e) {
      // .closest unsupported in very old browsers — non-fatal, form_id stays ''
    }
    window.dataLayer.push({
      event: 'contact_form_7_submitted',
      form_id: formId
    });
  }

  // Fire path — Contact Form 7's own native DOM CustomEvent, dispatched on
  // the <form> element once an AJAX submission passes CF7's server-side
  // validation and spam checks, then bubbles to document. This is the ONLY
  // path this recipe tracks; a legacy non-AJAX (full page reload) CF7 setup
  // never dispatches this event at all — CF7 itself provides no client-side
  // success signal in that mode either (the real module only logs a
  // warning for it, it never fires a conversion).
  document.addEventListener('wpcf7mailsent', function (event) {
    var formEl = event && event.target;
    if (!formEl || (formEl.tagName || '').toLowerCase() !== 'form') return;
    fireConversion(formEl);
  }, false);
})();
