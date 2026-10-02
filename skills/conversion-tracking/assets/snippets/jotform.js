/*! Jotform conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: jotform_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectJotform) return;
  window.__ctDetectJotform = true;
  window.dataLayer = window.dataLayer || [];

  // Two embed styles, two signals of different strength:
  //
  // 1. IFRAME embed (the default Jotform embed code). The form iframe posts
  //    { action: 'submission-completed', formID: '<id>' } to the parent page
  //    once Jotform has accepted the submission. This is a real success
  //    signal: spam blocks and server-side rejections never send it. Jotform
  //    support has confirmed the message exists but says it is not a public
  //    API and may change, so re-verify it when Jotform ships embed changes.
  //
  // 2. SOURCE-CODE embed (the form's raw HTML pasted into the page, a
  //    <form class="jotform-form"> posting to submit.jotform.com). The page
  //    navigates away to Jotform on submit, so there is no success signal
  //    this page can observe. This path is SUBMIT-BASED BEST EFFORT: it fires
  //    on a submit that passed the browser's own validation and that no other
  //    handler cancelled, so a server-side rejection, CAPTCHA failure or spam
  //    block still counts. Prefer the iframe embed, or a thank-you page
  //    redirect plus thank-you-page.js, when accuracy matters.

  var JOTFORM_FORM_ID_RE = /^\d{10,}$/;
  var JOTFORM_SUBMIT_ACTION_RE = /^https?:\/\/submit\.jotform\.com\//i;
  var JOTFORM_ORIGIN_RE = /(^|\.)jotform(eu)?\.com$/;

  function fireConversion(formId) {
    window.dataLayer.push({
      event: 'jotform_form_submitted',
      form_id: formId || ''
    });
  }

  // ---- Path 1: iframe embed, native success message ----

  function handleMessage(event) {
    try {
      if (!event || !event.source || event.source === window) return;
      if (!event.origin || typeof event.origin !== 'string') return;
      var hostMatch = /^https:\/\/([^/]+)$/.exec(event.origin);
      if (!hostMatch || !JOTFORM_ORIGIN_RE.test(hostMatch[1])) return;

      var data = event.data;
      if (typeof data === 'string') {
        if (data.indexOf('submission-completed') === -1) return;
        try { data = JSON.parse(data); } catch (e) { return; }
      }
      if (!data || typeof data !== 'object') return;
      if (data.action !== 'submission-completed') return;

      var formId = String(data.formID || data.formId || '');
      if (!JOTFORM_FORM_ID_RE.test(formId)) return;

      fireConversion(formId);
    } catch (e) {
      // Never throw back into the page's own message handling.
    }
  }

  window.addEventListener('message', handleMessage, false);

  // ---- Path 2: source-code embed, submit-based best effort ----

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
