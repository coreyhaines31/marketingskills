/*! Typeform conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: typeform_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectTypeform) return;
  window.__ctDetectTypeform = true;
  window.dataLayer = window.dataLayer || [];

  var ORIGIN_PATTERN = /(^|\.)typeform\.com$/;

  function fireConversion(formId, responseId) {
    window.dataLayer.push({
      event: 'typeform_form_submitted',
      form_id: formId || '',
      response_id: responseId || ''
    });
  }

  // 'form-submit' is the confirmed message the Typeform embed SDK sends on a
  // completed submission (it carries formId and responseId). The other two
  // names are best-guess aliases kept for older or third-party embed wrappers.
  // 'embed-auto-close-popup' is deliberately NOT accepted: it is a UI close
  // signal, not a submission, and carries no responseId.
  function looksLikeTypeformSubmit(data) {
    if (!data || typeof data !== 'object') return false;
    var t = data.type;
    if (typeof t !== 'string') return false;
    return (
      t === 'form-submit' ||
      t === 'typeform.formSubmit' ||
      t === 'typeform-form-submit'
    );
  }

  function pickFormId(data) {
    return data.formId || data.form_id || data.formID ||
      (data.payload && (data.payload.formId || data.payload.form_id)) || '';
  }

  function pickResponseId(data) {
    return data.responseId || data.response_id || data.responseID ||
      (data.payload && (data.payload.responseId || data.payload.response_id)) || '';
  }

  function onMessage(event) {
    if (!event || !event.source) return;
    if (event.source === window) return;
    if (!event.origin || typeof event.origin !== 'string') return;

    var hostMatch = /^https:\/\/([^/]+)$/.exec(event.origin);
    if (!hostMatch) return;
    if (!ORIGIN_PATTERN.test(hostMatch[1])) return;

    var data = event.data;
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch (e) { return; }
    }
    if (!data || typeof data !== 'object') return;
    if (!looksLikeTypeformSubmit(data)) return;

    var formId = pickFormId(data);
    var responseId = pickResponseId(data);
    if (!formId || !responseId) return;

    fireConversion(formId, responseId);
  }

  window.addEventListener('message', onMessage, false);
})();
