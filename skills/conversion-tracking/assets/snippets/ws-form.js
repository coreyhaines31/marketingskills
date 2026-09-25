/*! WS Form conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: ws_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectWsForm) return;
  window.__ctDetectWsForm = true;
  window.dataLayer = window.dataLayer || [];

  function fireConversion(formId) {
    window.dataLayer.push({
      event: 'ws_form_submitted',
      form_id: formId || ''
    });
  }

  // Same form-resolution chain the production module uses to find the
  // form element (it just never used it for anything but PII — here we
  // read a generic, non-PII form_id off whatever it resolves to).
  function resolveForm(event, formObject) {
    var formEl = null;
    try {
      if (formObject && formObject.form_canvas_obj && formObject.form_canvas_obj[0]) {
        formEl = formObject.form_canvas_obj[0].querySelector('form.wsf-form');
      }
      if (!formEl && event && event.target) {
        var target = event.target;
        if ((target.tagName || '').toLowerCase() === 'form') {
          formEl = target;
        } else if (target.querySelector) {
          formEl = target.querySelector('form.wsf-form');
        }
      }
      if (!formEl) {
        formEl = document.querySelector('form.wsf-form');
      }
    } catch (e) {
      // non-fatal — fall through with whatever we have (possibly null)
    }
    return formEl;
  }

  // Fire path — WS Form's own jQuery event, fired on `document` once an
  // AJAX submission passes server-side validation. This is the ONLY path
  // that ever fires a conversion.
  var successHooked = false;

  function hookWsFormSuccess() {
    if (successHooked) return true;
    if (typeof jQuery === 'undefined' && typeof $ === 'undefined') return false;

    var jQ = typeof jQuery !== 'undefined' ? jQuery : $;
    jQ(document).on('wsf-success', function (event, formObject) {
      var formEl = resolveForm(event, formObject);
      fireConversion(formEl ? (formEl.id || '') : '');
    });
    successHooked = true;
    return true;
  }

  // Retry hooking on DOMContentLoaded and window load — some sites load
  // jQuery very late.
  if (!hookWsFormSuccess()) {
    document.addEventListener('DOMContentLoaded', function () {
      hookWsFormSuccess();
    });
    window.addEventListener('load', function () {
      hookWsFormSuccess();
    });
  }
})();
