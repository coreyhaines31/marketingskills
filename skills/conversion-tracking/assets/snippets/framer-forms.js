/*! Framer Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: framer_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectFramerForms) return;
  window.__ctDetectFramerForms = true;
  window.dataLayer = window.dataLayer || [];

  function fireConversion(formName) {
    window.dataLayer.push({
      event: 'framer_form_submitted',
      form_name: formName || ''
    });
  }

  function isFramerForm(formEl) {
    if (!formEl) return false;
    if (formEl.hasAttribute && formEl.hasAttribute('data-framer-name')) return true;
    var cls = typeof formEl.className === 'string' ? formEl.className : '';
    if (/(^|\s)framer-[A-Za-z0-9_-]+/.test(cls)) return true;
    try {
      if (formEl.closest && formEl.closest('[data-framer-component-type]')) return true;
      if (formEl.closest && formEl.closest('[data-framer-name]')) return true;
    } catch (e) {
      // .closest not available — fall through
    }
    return false;
  }

  function handleSubmit(event) {
    try {
      var formEl = event.target;
      if (!formEl || (formEl.tagName || '').toLowerCase() !== 'form') return;
      if (!isFramerForm(formEl)) return;

      // A submission another handler already cancelled never happened.
      if (event.defaultPrevented) return;

      // Constraint validation gate: an invalid form cannot have submitted.
      try {
        if (typeof formEl.checkValidity === 'function' && formEl.checkValidity() === false) return;
      } catch (e) {
        // constraint validation unavailable — fall through
      }

      var formName = formEl.getAttribute('data-framer-name') || formEl.id || '';

      fireConversion(formName);
    } catch (e) {
      // Never throw back into Framer's own form handling.
    }
  }

  if (typeof document !== 'undefined' && document.addEventListener) {
    // Bubble phase deliberately. A capture-phase listener runs BEFORE the
    // form's own handlers, so it would count submissions that Framer's
    // validation goes on to cancel.
    document.addEventListener('submit', handleSubmit, false);
  }
})();
