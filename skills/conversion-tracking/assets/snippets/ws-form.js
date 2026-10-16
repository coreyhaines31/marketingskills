/*! WS Form conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: ws_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectWsForm) return;
  window.__ctDetectWsForm = true;
  window.dataLayer = window.dataLayer || [];
  var seenEvents = typeof WeakSet === 'function' ? new WeakSet() : null;
  var lastSuccessByInstance = {};
  function unwrap(value) { return value && value.jquery ? value[0] : (value && value[0] && value[0].nodeType ? value[0] : value); }
  function onAcceptedSubmit(event, formObject, formId, instanceId, formEl) {
    if (event && seenEvents) {
      if (seenEvents.has(event)) return;
      seenEvents.add(event);
    }
    var form = unwrap(formEl);
    if (!form || !form.matches || !form.matches('form.wsf-form')) return;
    var id;
    if (typeof formId === 'string') {
      if (!/^\d+$/.test(formId) || Number(formId) < 1) return;
      id = formId;
    } else if (typeof formId === 'number') {
      if (!isFinite(formId) || Math.floor(formId) !== formId || formId < 1) return;
      id = String(formId);
    } else {
      return;
    }
    // WS Form can finish both requests from a double-click. Count the rapid
    // success callbacks once, without changing the form or reading answers.
    var instance = typeof instanceId === 'string' || typeof instanceId === 'number' ? instanceId : '';
    var key = id + ':' + instance;
    var now = Date.now();
    if (lastSuccessByInstance[key] !== undefined && now - lastSuccessByInstance[key] < 2000) return;
    lastSuccessByInstance[key] = now;
    var adapter = window.__ctWsFormMethod2Emit;
    if (typeof adapter === 'function') {
      try { if (adapter(form, id, instanceId) === true) return; }
      catch (e) { return; }
    }
    window.dataLayer.push({ event: 'ws_form_submitted', form_id: id });
  }
  var handlerBound = false;
  function hook() {
    if (handlerBound) return true;
    var jq = typeof jQuery !== 'undefined' ? jQuery : (typeof $ !== 'undefined' ? $ : null);
    if (!jq) return false;
    jq(document).on('wsf-submit-success', onAcceptedSubmit);
    handlerBound = true;
    return true;
  }
  if (!hook()) {
    document.addEventListener('DOMContentLoaded', hook, { once: true });
    window.addEventListener('load', hook, { once: true });
  }
})();
