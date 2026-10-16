/*! Formidable Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: formidable_forms_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  'use strict';

  // Shared with the recipe snippet so template + recipe installation is one listener.
  if (window.__ctDetectFormidableForms) return;
  window.__ctDetectFormidableForms = true;
  if (!/^https?:$/.test(window.location.protocol)) return;
  window.dataLayer = window.dataLayer || [];

  var MARKER_KEY = '__ctDetectFormidableNativePendingV2';
  var MARKER_TTL_MS = 60000;
  var handledResponses = typeof WeakSet === 'function' ? new WeakSet() : [];
  var activeAttempts = [];
  var jqueryHooked = false;

  function safeId(value) {
    var id = String(value || '');
    return /^[1-9][0-9]*$/.test(id) ? id : '';
  }

  // Formidable's hidden form_id is non-sensitive structural metadata. No other
  // field value, response property, label, HTML, or rendered text is inspected.
  function formId(form) {
    if (!form || typeof form.querySelector !== 'function') return '';
    try {
      var input = form.querySelector('input[name="form_id"]');
      return input && input.getAttribute ? safeId(input.getAttribute('value')) : '';
    } catch (e) {
      return '';
    }
  }

  function wrapperFor(id) {
    if (!id) return null;
    try { return document.getElementById('frm_form_' + id + '_container'); } catch (e) { return null; }
  }

  function hasNode(scope, selector) {
    if (!scope || typeof scope.querySelector !== 'function') return false;
    try { return !!scope.querySelector(selector); } catch (e) { return false; }
  }

  function hasRejectionMarker(id) {
    return hasNode(wrapperFor(id), '.frm_error, .frm_error_style, .frm_blank_field, [aria-invalid="true"]');
  }

  function hasSuccessMarker(id) {
    return hasNode(wrapperFor(id), '.frm_message');
  }

  function responseWasHandled(response) {
    if (!response || (typeof response !== 'object' && typeof response !== 'function')) return true;
    if (typeof WeakSet === 'function' && handledResponses instanceof WeakSet) {
      if (handledResponses.has(response)) return true;
      handledResponses.add(response);
      return false;
    }
    for (var i = 0; i < handledResponses.length; i++) {
      if (handledResponses[i] === response) return true;
    }
    handledResponses.push(response);
    if (handledResponses.length > 100) handledResponses.shift();
    return false;
  }

  function push(id) {
    if (!id) return;
    window.dataLayer.push({ event: 'formidable_forms_submitted', form_id: id });
  }

  // Optional Method 2 adapter owns any enriched push. The detector passes only
  // structural metadata and accepts only a literal true handled verdict; it
  // never receives or inspects an adapter payload.
  function emitAccepted(id, form, source) {
    var handled = false;
    try {
      if (typeof window.__ctFormidableMethod2Emit === 'function') {
        handled = window.__ctFormidableMethod2Emit(id, form, source) === true;
      }
    } catch (e) {}
    if (!handled) push(id);
  }

  // In 6.32.1 these are jQuery events: formidable.js calls
  // jQuery(document).trigger(name, [form, response]). addEventListener does not
  // receive these success events. The response is used only by object identity
  // so the redirect and completion callbacks for one response count once.
  function onAjaxSuccess(event, form, response) {
    var id = formId(form);
    if (!id || !response || responseWasHandled(response)) return;
    emitAccepted(id, form, 'ajax');
    disarmAttempt(form);
  }

  function hookJquery() {
    if (jqueryHooked) return true;
    var jq = window.jQuery || window.$;
    if (typeof jq !== 'function') return false;
    jq(document).on(
      'frmFormComplete.ctRecipe frmBeforeFormRedirect.ctRecipe',
      onAjaxSuccess
    );
    jqueryHooked = true;
    return true;
  }

  function readMarker() {
    try {
      var raw = window.sessionStorage.getItem(MARKER_KEY);
      if (!raw) return null;
      window.sessionStorage.removeItem(MARKER_KEY);
      var marker = JSON.parse(raw);
      if (!marker || typeof marker !== 'object') return null;
      if (typeof marker.t !== 'number' || Date.now() < marker.t || Date.now() - marker.t > MARKER_TTL_MS) return null;
      if (marker.hadSuccessAtSubmit === true) return null;
      return { id: safeId(marker.id), origin: marker.origin, path: marker.path };
    } catch (e) {
      try { window.sessionStorage.removeItem(MARKER_KEY); } catch (e2) {}
      return null;
    }
  }

  // Native success either renders a form-specific message or redirects away
  // from the submitted form. Rejection stays on the form page with errors.
  // Only origin and pathname are retained, never query strings or form answers.
  function processNativeMessage() {
    var marker = readMarker();
    if (!marker || !marker.id || hasRejectionMarker(marker.id)) return;
    var redirected = marker.origin === window.location.origin &&
      typeof marker.path === 'string' && marker.path !== window.location.pathname &&
      !wrapperFor(marker.id) && !hasNode(document, '.frm_error, .frm_error_style');
    if (hasSuccessMarker(marker.id) || redirected) {
      var wrapper = wrapperFor(marker.id);
      var form = null;
      try { form = wrapper && wrapper.querySelector ? wrapper.querySelector('form') : null; } catch (e) {}
      emitAccepted(marker.id, form, 'native');
    }
  }

  function getAttempt(form) {
    for (var i = 0; i < activeAttempts.length; i++) {
      if (activeAttempts[i].form === form) return activeAttempts[i];
    }
    return null;
  }

  function disarmAttempt(form) {
    var attempt = getAttempt(form);
    if (!attempt) return;
    try { window.removeEventListener('pagehide', attempt.onPageHide, true); } catch (e) {}
    var index = activeAttempts.indexOf(attempt);
    if (index !== -1) activeAttempts.splice(index, 1);
  }

  function armNativeMessageAttempt(event) {
    var form = event && event.target;
    if (!form || String(form.tagName || '').toLowerCase() !== 'form') return;
    var isFormidable = false;
    try { isFormidable = !!(form.closest && form.closest('.frm_forms')); } catch (e) {}
    if (!isFormidable) return;
    var id = formId(form);
    if (!id) return;
    var wrapper = wrapperFor(id);
    var hadSuccessAtSubmit = hasNode(wrapper, '.frm_message');
    var prior = getAttempt(form);
    if (prior) disarmAttempt(form);
    var attempt = { form: form, id: id, hadSuccessAtSubmit: hadSuccessAtSubmit, onPageHide: null };
    attempt.onPageHide = function () {
      disarmAttempt(form);
      // Old server errors remain visible while a corrected native POST leaves.
      // Decide acceptance from the response page, not the departing page.
      if (attempt.hadSuccessAtSubmit) return;
      try {
        window.sessionStorage.setItem(MARKER_KEY, JSON.stringify({
          t: Date.now(),
          id: attempt.id,
          hadSuccessAtSubmit: false,
          origin: window.location.origin,
          path: window.location.pathname
        }));
      } catch (e) {}
    };
    activeAttempts.push(attempt);
    try { window.addEventListener('pagehide', attempt.onPageHide, true); } catch (e) {}
  }

  hookJquery();
  if (!jqueryHooked) {
    document.addEventListener('DOMContentLoaded', hookJquery, { once: true });
    window.addEventListener('load', hookJquery, { once: true });
  }
  document.addEventListener('submit', armNativeMessageAttempt, true);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processNativeMessage, { once: true });
  } else {
    processNativeMessage();
  }
})();
