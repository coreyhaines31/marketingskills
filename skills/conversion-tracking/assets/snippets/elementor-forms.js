/*! Elementor Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: elementor_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectElementorForms) return;
  window.__ctDetectElementorForms = true;
  window.dataLayer = window.dataLayer || [];

  // Best-effort, non-PII identifier: the form's own id/name, or the
  // nearest ancestor carrying Elementor's standard data-id widget-instance
  // attribute. Never reads field values.
  function bestEffortFormId(formEl) {
    if (!formEl) return '';
    if (formEl.id) return formEl.id;
    var name = formEl.getAttribute && formEl.getAttribute('name');
    if (name) return name;
    try {
      var withId = formEl.closest && formEl.closest('[data-id]');
      if (withId) return withId.getAttribute('data-id') || '';
    } catch (e) {
      // .closest not available — non-fatal
    }
    return '';
  }

  function fireConversion(formId) {
    window.dataLayer.push({
      event: 'elementor_form_submitted',
      form_id: formId || ''
    });
  }

  // Same form-resolution chain the production module uses (event.target
  // -> most recently clicked Elementor submit button's form -> the sole
  // .elementor-form on the page) — ported here so the recipe can attach a
  // real form_id instead of firing event-only.
  var lastClickedForm = null;

  function trackClick(event) {
    try {
      var target = event.target;
      if (!target || !target.closest) return;
      var form = target.closest('form.elementor-form');
      if (form) lastClickedForm = form;
    } catch (e) {
      // non-fatal
    }
  }

  function resolveFormFromTarget(target) {
    if (!target || target === document || target === window) return null;
    try {
      if ((target.tagName || '').toLowerCase() === 'form' &&
          target.classList && target.classList.contains('elementor-form')) {
        return target;
      }
      if (target.closest) {
        var parentForm = target.closest('form.elementor-form');
        if (parentForm) return parentForm;
      }
    } catch (e) {
      // non-fatal
    }
    return null;
  }

  // Fire path — Elementor Pro's own jQuery event, triggered on `document`
  // once an AJAX submission passes server-side validation. This is the ONLY
  // path this recipe tracks; Elementor Pro forms submit exclusively via
  // Elementor's own AJAX pipeline, so there is no non-AJAX mode to miss.
  var successHooked = false;

  function hookElementorSuccess() {
    if (successHooked) return true;
    // A bare $ is only trusted when it looks like jQuery ($.fn exists), so
    // another library that claims $ cannot break the hook.
    var jQ = null;
    if (typeof jQuery !== 'undefined') jQ = jQuery;
    else if (typeof $ !== 'undefined' && typeof $.fn !== 'undefined') jQ = $;
    if (!jQ) return false;
    jQ(document).on('submit_success', function (event) {
      var formEl = resolveFormFromTarget(event && event.target);
      if (!formEl && lastClickedForm) formEl = lastClickedForm;
      lastClickedForm = null;

      if (!formEl) {
        try {
          var forms = document.querySelectorAll('.elementor-form');
          if (forms.length === 1) formEl = forms[0];
        } catch (e) {
          // non-fatal
        }
      }

      fireConversion(bestEffortFormId(formEl));
    });
    successHooked = true;
    return true;
  }

  document.addEventListener('click', trackClick, true);

  if (!hookElementorSuccess()) {
    document.addEventListener('DOMContentLoaded', function () {
      hookElementorSuccess();
    });
    window.addEventListener('load', function () {
      hookElementorSuccess();
    });
  }
})();
