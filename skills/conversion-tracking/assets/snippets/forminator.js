/*! Forminator conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: forminator_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectForminator) return;
  window.__ctDetectForminator = true;
  window.dataLayer = window.dataLayer || [];

  function fireConversion(formId) {
    window.dataLayer.push({
      event: 'forminator_form_submitted',
      form_id: formId || ''
    });
  }

  // Fire path — Forminator's own jQuery event, fired on `document` once an
  // AJAX submission passes server-side validation. This is the ONLY path
  // that ever fires a conversion; Forminator clears form fields before this
  // event, but we don't need field values, so that doesn't affect us.
  //
  // Form ID resolution: live-verified against a real Forminator install
  // (2026-07-02) that the `response` argument Forminator hands to this
  // event is an EMPTY object ({}) — response.form_id does not exist in
  // practice, despite being documented elsewhere. The reliable source is
  // `event.target`, which jQuery sets to the <form> element itself (the
  // event bubbles from the form to document), carrying a `data-form-id`
  // attribute Forminator always renders.
  var successHooked = false;

  function hookForminatorSuccess() {
    if (successHooked) return true;
    if (typeof jQuery === 'undefined' && typeof $ === 'undefined') return false;

    var jQ = typeof jQuery !== 'undefined' ? jQuery : $;
    jQ(document).on('forminator:form:submit:success', function (event) {
      var formEl = event && event.target;
      var formId = (formEl && formEl.getAttribute && formEl.getAttribute('data-form-id')) || '';
      fireConversion(formId);
    });
    successHooked = true;
    return true;
  }

  // Retry hooking on DOMContentLoaded and window load — some sites load
  // jQuery/Forminator very late.
  if (!hookForminatorSuccess()) {
    document.addEventListener('DOMContentLoaded', function () {
      hookForminatorSuccess();
    });
    window.addEventListener('load', function () {
      hookForminatorSuccess();
    });
  }
})();
