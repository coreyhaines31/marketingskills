/*! Tally conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: tally_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectTally) return;
  window.__ctDetectTally = true;
  window.dataLayer = window.dataLayer || [];

  function fireConversion(formId, formName) {
    window.dataLayer.push({
      event: 'tally_form_submitted',
      form_id: formId || '',
      form_name: formName || ''
    });
  }

  function parseMessageData(data) {
    if (!data) return null;
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (e) {
        return null;
      }
    }
    if (typeof data === 'object') return data;
    return null;
  }

  var TALLY_ORIGIN_PATTERN = /(^|\.)tally\.so$/;

  function isTrustedOrigin(event) {
    if (!event) return false;
    if (event.source === window) return false;
    if (!event.source) return false;
    if (!event.origin || typeof event.origin !== 'string') return false;
    var hostMatch = /^https:\/\/([^/]+)/.exec(event.origin);
    if (!hostMatch) return false;
    return TALLY_ORIGIN_PATTERN.test(hostMatch[1]);
  }

  function handleMessage(event) {
    try {
      if (!event || !event.data) return;
      var msg = parseMessageData(event.data);
      if (!msg) return;
      var eventName = msg.event || msg.type;
      if (eventName !== 'Tally.FormSubmitted') return;
      if (!isTrustedOrigin(event)) return;

      var payload = msg.payload || msg.data || msg;
      if (!payload || typeof payload !== 'object' || !Array.isArray(payload.fields)) return;

      fireConversion(payload.formId, payload.formName);
    } catch (e) {
      // Never throw back into the page's own message handling.
    }
  }

  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('message', handleMessage, false);
  }
})();
