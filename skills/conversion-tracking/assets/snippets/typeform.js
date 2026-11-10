/*! Typeform conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: typeform_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  'use strict';

  // Shared recipe/template install guard. Keep this exact name so both
  // installation paths attach one message listener.
  if (window.__ctDetectTypeform) return;
  window.__ctDetectTypeform = true;
  window.dataLayer = window.dataLayer || [];

  var ORIGIN_PATTERN = /(^|\.)typeform\.com$/;
  var TYPEFORM_IFRAME_SELECTOR = 'iframe[src^="https://"][src*=".typeform.com/to/"],iframe[src^="https://typeform.com/to/"]';
  var accepted = Object.create(null);
  var trackedFrames = [];

  function isSafeId(value) {
    return typeof value === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(value);
  }

  // Match a public form ID against the URL path using CSS selectors. Do not
  // fetch, parse, retain, or serialize the iframe src; its query can contain
  // prefilled respondent data.
  function hasFormPath(iframe, formId, host) {
    if (!isSafeId(formId) || !host || !iframe || typeof iframe.matches !== 'function') return false;
    var prefix = 'iframe[src^="https://' + host + '/to/' + formId;
    var selectors = [
      'iframe[src="https://' + host + '/to/' + formId + '"]',
      prefix + '?"]',
      prefix + '#"]',
      prefix + '/"]'
    ];
    for (var i = 0; i < selectors.length; i++) {
      try {
        if (iframe.matches(selectors[i])) return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  function isTypeformFrame(iframe) {
    if (!iframe || typeof iframe.matches !== 'function') return false;
    try { return iframe.matches(TYPEFORM_IFRAME_SELECTOR); } catch (e) { return false; }
  }

  function track(iframe) {
    if (!isTypeformFrame(iframe)) return;
    for (var i = 0; i < trackedFrames.length; i++) {
      if (trackedFrames[i].iframe === iframe) return;
    }
    try {
      trackedFrames.push({ iframe: iframe, source: iframe.contentWindow });
    } catch (e) {
      // If a browser denies the WindowProxy reference, fail closed for this frame.
    }
  }

  function scan(root) {
    if (!root || typeof root.querySelectorAll !== 'function') return;
    var frames;
    try { frames = root.querySelectorAll(TYPEFORM_IFRAME_SELECTOR); } catch (e) { return; }
    for (var i = 0; i < frames.length; i++) track(frames[i]);
  }

  function trackedSourceForForm(source, formId, host) {
    scan(document);
    for (var i = 0; i < trackedFrames.length; i++) {
      var tracked = trackedFrames[i];
      try {
        if (tracked.source === source && hasFormPath(tracked.iframe, formId, host)) return true;
      } catch (e) {
        // A browser may deny access to a detached frame; ignore that frame.
      }
    }
    return false;
  }

  function ownDataValue(object, key) {
    if (!object || typeof object !== 'object') return undefined;
    var descriptor;
    try { descriptor = Object.getOwnPropertyDescriptor(object, key); } catch (e) { return undefined; }
    return descriptor && Object.prototype.hasOwnProperty.call(descriptor, 'value')
      ? descriptor.value
      : undefined;
  }

  function onMessage(event) {
    if (!event || !event.source || event.source === window) return;
    var origin = event.origin;
    if (typeof origin !== 'string') return;
    var match = /^https:\/\/([^/:?#]+)$/.exec(origin);
    if (!match || !ORIGIN_PATTERN.test(match[1])) return;

    var data = event.data;
    if (!data || typeof data !== 'object') return;

    // Only the historically captured canonical success message is accepted.
    // Public Typeform docs document onSubmit, not raw postMessage aliases.
    if (ownDataValue(data, 'type') !== 'form-submit') return;
    var formId = ownDataValue(data, 'formId');
    var responseId = ownDataValue(data, 'responseId');
    if (!isSafeId(formId) || !isSafeId(responseId)) return;
    if (!trackedSourceForForm(event.source, formId, match[1])) return;

    var key = formId + '\u0000' + responseId;
    if (accepted[key]) return;
    accepted[key] = true;
    window.dataLayer.push({
      event: 'typeform_form_submitted',
      form_id: formId,
      response_id: responseId
    });
  }

  scan(document);
  if (typeof MutationObserver !== 'undefined' && document.documentElement) {
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];
        if (mutation.type === 'attributes') {
          track(mutation.target);
          continue;
        }
        var nodes = mutation.addedNodes || [];
        for (var j = 0; j < nodes.length; j++) {
          var node = nodes[j];
          if (!node) continue;
          if (node.tagName === 'IFRAME') track(node);
          else scan(node);
        }
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src']
    });
  }

  window.addEventListener('message', onMessage, false);
})();
