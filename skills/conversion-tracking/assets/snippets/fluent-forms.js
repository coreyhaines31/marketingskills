/*! Fluent Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: fluent_forms_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctFluentForms) return;
  window.__ctFluentForms = true;
  window.dataLayer = window.dataLayer || [];
  var listeners = [], lastEvent = null;
  // Fluent Forms 6.2.5 reports one success response through three different
  // event objects. Deduplicate by response-object identity and original form
  // node; never inspect or retain a response's fields.
  var seenResponses = typeof WeakMap === 'function' ? new WeakMap() : null;
  window.__ctFluentSubscribe = function (listener) {
    if (listener && typeof listener === 'object') listeners.push(listener);
  };
  function isForm(form) {
    try {
      if (!form || String(form.tagName || '').toLowerCase() !== 'form') return false;
      if (String(form.className || '').indexOf('frm-fluent-form') !== -1) return true;
      if (form.closest && form.closest('.fluentform')) return true;
      return /^fluentform_\d+$/.test(form.id || '');
    } catch (e) { return false; }
  }
  function asForm(candidate) {
    try {
      var el = candidate;
      if (el && el.jquery && el.length) el = el[0];
      return isForm(el) ? el : null;
    } catch (e) { return null; }
  }
  function notify(phase, form, candidate, event, arg2, arg3) {
    var handled = false;
    for (var i=0;i<listeners.length;i++) {
      try { var fn=listeners[i] && listeners[i][phase]; if(typeof fn==='function' && fn(form,candidate,event,arg2,arg3)===true)handled=true; } catch(e) {}
    }
    return handled;
  }
  function submit(event) {
    try { var form=event.target; if(isForm(form)) notify('beforeAttempt',form,false,event); } catch(e) {}
  }
  function resolve(event,arg2,arg3) {
    try {
      var form=asForm(arg2 && arg2.form) || asForm(arg3) || asForm(arg2);
      if(form)return form;
      var oe=event && event.originalEvent;
      if(oe && oe.detail) return asForm(oe.detail.form);
      return asForm(event && event.target);
    } catch(e) { return null; }
  }
  function responseFor(event, arg2) {
    try {
      var descriptor = arg2 && Object.getOwnPropertyDescriptor(arg2, 'response');
      var response = descriptor && Object.prototype.hasOwnProperty.call(descriptor, 'value') ? descriptor.value : null;
      if (response && typeof response === 'object') return response;
      var originalEvent = event && event.originalEvent;
      var detail = originalEvent && originalEvent.detail;
      descriptor = detail && Object.getOwnPropertyDescriptor(detail, 'response');
      response = descriptor && Object.prototype.hasOwnProperty.call(descriptor, 'value') ? descriptor.value : null;
      return response && typeof response === 'object' ? response : null;
    } catch(e) { return null; }
  }
  function alreadySeen(response, form) {
    try {
      if (!seenResponses || !response || !form || typeof response !== 'object' || typeof form !== 'object') return true;
      var forms = seenResponses.get(response);
      if (!forms) {
        forms = typeof WeakSet === 'function' ? new WeakSet() : null;
        if (!forms) return true;
        seenResponses.set(response, forms);
      }
      if (forms.has(form)) return true;
      forms.add(form);
      return false;
    } catch(e) { return true; }
  }
  function success(event,arg2,arg3) {
    try {
      if (event && typeof event === 'object' && event === lastEvent) return;
      lastEvent=event;
      if (event && typeof event === 'object') setTimeout(function(){if(lastEvent===event)lastEvent=null;},0);
      var form=resolve(event,arg2,arg3);
      if(!form)return;
      var response=responseFor(event,arg2);
      if(!response || alreadySeen(response,form))return;
      if(!notify('onCandidate',form,true,event,arg2,arg3)) window.dataLayer.push({event:'fluent_forms_submitted',form_id:form.id || ''});
    } catch(e) {}
  }
  document.addEventListener('submit',submit,true);
  function hook() {
    try {
      if (window.__ctFluentSuccessHooked || !window.jQuery) return false;
      window.__ctFluentSuccessHooked=true;
      window.jQuery(document).on('fluentform_submission_success',success);
      return true;
    } catch(e) { return false; }
  }
  if(!hook()) {
    document.addEventListener('DOMContentLoaded',hook);
    window.addEventListener('load',hook);
  }
})();
