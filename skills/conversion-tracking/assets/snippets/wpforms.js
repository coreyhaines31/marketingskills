/*! WPForms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: wpforms_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
/* WPForms listener. Records message and redirect confirmations.
 * Native redirects use a short-lived submission marker and changed pathname.
 * Does not read form values, labels, rendered text/HTML, response bodies,
 * redirect URLs, or URL query strings. */
(function () {
  'use strict';
  if (window.__ctDetectWpforms) return;
  window.__ctDetectWpforms = true;
  if (!/^https?:$/.test(window.location.protocol)) return;
  window.dataLayer = window.dataLayer || [];

  var PENDING_KEY = '__ctWpformsNativePendingV1';
  var PENDING_TTL_MS = 120000;

  function formId(form) {
    var match = /^wpforms-form-(\d+)$/.exec((form && form.id) || '');
    return match ? match[1] : null;
  }
  function confirmationNode(id) {
    if (!id || !/^\d+$/.test(id)) return null;
    try { return document.querySelector('#wpforms-confirmation-' + id); } catch (e) { return null; }
  }
  // A delayed callback can run after another callback has already observed
  // the same inserted node. Deduplicate by node identity, not by form ID, so
  // a later accepted response with a distinct confirmation node still counts.
  var supportsWeakSet = typeof WeakSet === 'function';
  var handledConfirmationNodes = supportsWeakSet ? new WeakSet() : [];
  function markConfirmationSeen(node) {
    if (supportsWeakSet) {
      if (handledConfirmationNodes.has(node)) return false;
      handledConfirmationNodes.add(node);
      return true;
    }
    if (handledConfirmationNodes.indexOf(node) !== -1) return false;
    handledConfirmationNodes.push(node);
    return true;
  }
  function push(id) {
    if (!id || !/^\d+$/.test(id)) return;
    window.dataLayer.push({ event: 'wpforms_form_submitted', form_id: id });
  }
  // Method 2 owns and pushes its enriched payload. The detector sees only a
  // literal handled marker; arbitrary objects or PII are never read/forwarded.
  function emitConfirmed(id, form, mode) {
    var adapter = window.__ctWpformsMethod2Emit;
    try { if (typeof adapter === 'function' && adapter(id, form || null, mode) === true) return; } catch (e) {}
    push(id);
  }
  function discardAdapterSnapshot(id, form, mode) {
    var discard = window.__ctWpformsMethod2Discard;
    try { if (typeof discard === 'function') discard(id, form || null, mode); } catch (e) {}
  }
  function storePending(id) {
    if (!id) return;
    try {
      window.sessionStorage.setItem(PENDING_KEY, JSON.stringify({ id: id, time: Date.now(), path: window.location.pathname }));
    } catch (e) {}
  }
  function takePending() {
    try {
      var raw = window.sessionStorage.getItem(PENDING_KEY);
      if (!raw) return null;
      window.sessionStorage.removeItem(PENDING_KEY);
      var value = JSON.parse(raw);
      if (!value || !/^\d+$/.test(String(value.id || '')) ||
          typeof value.time !== 'number' || Date.now() - value.time > PENDING_TTL_MS ||
          Date.now() < value.time) return null;
      return { id: String(value.id), path: typeof value.path === 'string' ? value.path : null };
    } catch (e) { return null; }
  }
  function hasVisibleErrors(root) {
    var errors = root.querySelectorAll('.wpforms-error, .wpforms-error-container, [aria-invalid="true"]');
    for (var i = 0; i < errors.length; i++) {
      if (errors[i].getClientRects().length) return true;
    }
    return false;
  }
  function processNativeVerdict() {
    var marker = takePending();
    if (!marker) return;
    if (hasVisibleErrors(document)) discardAdapterSnapshot(marker.id, null, 'native-no-confirmation');
    else if (confirmationNode(marker.id)) emitConfirmed(marker.id, null, 'native-message');
    else if (marker.path && marker.path !== window.location.pathname) {
      // A clean submit followed by a new page is the redirect confirmation.
      // An optional Method 2 adapter may attach what it saved on the form page.
      emitConfirmed(marker.id, null, 'native-redirect');
    }
    else discardAdapterSnapshot(marker.id, null, 'native-no-confirmation');
  }

  // Keep one short-lived navigation watcher per form. Client validation can
  // cancel submission, so a submit attempt alone must not leave a marker.
  var nativeWatchers = new WeakMap();
  document.addEventListener('submit', function (event) {
    var form = event && event.target;
    if (!form || (form.tagName || '').toLowerCase() !== 'form') return;
    var id = formId(form);
    if (!id) return;
    var classes = typeof form.className === 'string' ? form.className : '';
    if (/(^|\s)wpforms-ajax-form(\s|$)/.test(classes)) return;
    var previous = nativeWatchers.get(form);
    if (previous) previous();
    var timer;
    function cleanup() {
      window.removeEventListener('pagehide', onPageHide, true);
      clearTimeout(timer);
      nativeWatchers.delete(form);
    }
    function onPageHide() {
      cleanup();
      // A corrected retry can still display the previous server error box.
      // Use the current client-validation result, without reading answers.
      var jq = window.jQuery;
      var validator = typeof jq === 'function' ? jq(form).data('validator') : null;
      if (validator && validator.errorList) {
        if (validator.errorList.length) return;
      } else if (hasVisibleErrors(form)) return;
      storePending(id);
    }
    nativeWatchers.set(form, cleanup);
    window.addEventListener('pagehide', onPageHide, true);
    timer = setTimeout(cleanup, 10000);
  }, true);

  // AJAX message confirmation: the callback alone is ambiguous. Wait until
  // WPForms has inserted a new, form-attributed confirmation node.
  var jqueryHooked = false;
  var redirectEpochByForm = typeof WeakMap === 'function' ? new WeakMap() : null;
  var seenRedirectEvents = typeof WeakSet === 'function' ? new WeakSet() : [];
  var seenSuccessEvents = typeof WeakSet === 'function' ? new WeakSet() : [];
  function markEventSeen(set, event) {
    if (!event || (typeof event !== 'object' && typeof event !== 'function')) return false;
    if (typeof WeakSet === 'function' && set instanceof WeakSet) {
      if (set.has(event)) return false;
      set.add(event);
      return true;
    }
    if (set.indexOf(event) !== -1) return false;
    set.push(event);
    return true;
  }
  function markRedirectEvent(event) {
    return markEventSeen(seenRedirectEvents, event);
  }
  function hookWpformsEvents() {
    if (jqueryHooked) return;
    var jq = window.jQuery || window.$;
    if (typeof jq !== 'function') return;
    jqueryHooked = true;
    jq(document).on('wpformsAjaxSubmitSuccess.ctWpforms', function (event) {
      if (!markEventSeen(seenSuccessEvents, event)) return;
      var form = event && event.target;
      var id = formId(form);
      if (!id) return;
      var redirectEpoch = redirectEpochByForm ? (redirectEpochByForm.get(form) || 0) : 0;
      var before = confirmationNode(id);
      setTimeout(function () {
        var after = confirmationNode(id);
        if (after && after !== before && markConfirmationSeen(after)) {
          emitConfirmed(id, form, 'ajax-message');
        } else if (!redirectEpochByForm || (redirectEpochByForm.get(form) || 0) === redirectEpoch) {
          discardAdapterSnapshot(id, form, 'ajax-no-confirmation');
        }
      }, 0);
    });
    jq(document).on('wpformsAjaxSubmitFailed.ctWpforms wpformsAjaxSubmitError.ctWpforms wpformsAjaxSubmitActionRequired.ctWpforms', function (event) {
      var form = event && event.target;
      var id = formId(form);
      if (id) discardAdapterSnapshot(id, form, 'ajax-rejected');
    });
    // WPForms 1.6.7 triggers this only after ajax_process_redirect has
    // produced a nonempty redirect_url from accepted processing. The URL and
    // response object are intentionally not inspected.
    jq(document).on('wpformsAjaxSubmitBeforeRedirect.ctWpforms', function (event) {
      if (!markRedirectEvent(event)) return;
      var form = event && event.target;
      var id = formId(form);
      if (!id) return;
      if (redirectEpochByForm) redirectEpochByForm.set(form, (redirectEpochByForm.get(form) || 0) + 1);
      emitConfirmed(id, form, 'ajax-redirect');
    });
  }
  function ready() {
    processNativeVerdict();
    hookWpformsEvents();
  }
  // Let sibling Method 2 tags in the same page task install their enrichment
  // delegate before a native confirmation verdict is dispatched.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else setTimeout(ready, 0);
  document.addEventListener('DOMContentLoaded', hookWpformsEvents, { once: true });
  window.addEventListener('load', hookWpformsEvents, { once: true });
})();
