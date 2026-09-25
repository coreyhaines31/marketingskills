/*! Jotform conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: jotform_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectJotform) return;
  window.__ctDetectJotform = true;
  window.dataLayer = window.dataLayer || [];

  var JOTFORM_FORM_ID_RE = /^\d{10,}$/;
  var JOTFORM_SUBMIT_ACTION_RE = /^https?:\/\/submit\.jotform\.com\//i;

  function isJotformInlineForm(formEl) {
    if (!formEl || (formEl.tagName || '').toLowerCase() !== 'form') return false;
    var hasClass = formEl.classList && formEl.classList.contains('jotform-form');
    var action = formEl.getAttribute && formEl.getAttribute('action');
    var hasAction = action && JOTFORM_SUBMIT_ACTION_RE.test(action);
    if (!hasClass && !hasAction) return false;
    var id = formEl.id || '';
    if (!JOTFORM_FORM_ID_RE.test(id)) return false;
    return true;
  }

  function fireConversion(formId) {
    window.dataLayer.push({
      event: 'jotform_form_submitted',
      form_id: formId || ''
    });
  }

  // Bubble phase deliberately. A capture-phase listener runs BEFORE the form's
  // own handlers, so it would count submissions Jotform's validation cancels.
  document.addEventListener('submit', function (event) {
    var formEl = event.target;
    if (!isJotformInlineForm(formEl)) return;

    // A submission another handler already cancelled never happened.
    if (event.defaultPrevented) return;

    // Constraint validation gate: an invalid form cannot have submitted.
    try {
      if (typeof formEl.checkValidity === 'function' && formEl.checkValidity() === false) return;
    } catch (e) {
      // constraint validation unavailable — fall through
    }

    fireConversion(formEl.id);
  }, false);
})();
