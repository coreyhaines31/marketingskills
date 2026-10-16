/*! Elementor Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: elementor_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectElementorForms) return;
  window.__ctDetectElementorForms = true;
  window.dataLayer = window.dataLayer || [];
  var seenEvents = typeof WeakSet === 'function' ? new WeakSet() : null;
  function formFrom(target) {
    try {
      if (!target || target === document || target === window) return null;
      if (target.matches && target.matches('form.elementor-form')) return target;
      return target.closest ? target.closest('form.elementor-form') : null;
    } catch (e) { return null; }
  }
  function formId(form) {
    if (!form) return '';
    if (form.id) return form.id;
    var name = form.getAttribute && form.getAttribute('name');
    if (name && name !== 'New Form') return name;
    var widget = form.closest && form.closest('[data-id]');
    return widget && widget.getAttribute('data-id') || '';
  }
  function onSuccess(event) {
    if (event && seenEvents) {
      if (seenEvents.has(event)) return;
      seenEvents.add(event);
    }
    var form = formFrom(event && event.target);
    var id = formId(form);
    if (!form || !id) return;
    var adapter = window.__ctElementorMethod2Emit;
    if (typeof adapter === 'function') {
      try { if (adapter(form, id) === true) return; }
      catch (e) { return; }
    }
    window.dataLayer.push({ event: 'elementor_form_submitted', form_id: String(id) });
  }
  var handlerBound = false;
  function hook() {
    if (handlerBound) return true;
    var jq = typeof jQuery !== 'undefined' ? jQuery : (typeof $ !== 'undefined' ? $ : null);
    if (!jq) return false;
    jq(document).on('submit_success', onSuccess);
    handlerBound = true;
    return true;
  }
  if (!hook()) {
    document.addEventListener('DOMContentLoaded', hook, { once: true });
    window.addEventListener('load', hook, { once: true });
  }
})();
