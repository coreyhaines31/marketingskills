/*! Formidable Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: formidable_forms_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectFormidableForms) return;
  window.__ctDetectFormidableForms = true;
  window.dataLayer = window.dataLayer || [];

  var SUCCESS_WINDOW_MS = 10000;
  var DEFERRED_MARKER_KEY = '__ctDetectFormidableNativePending';
  var DEFERRED_MARKER_TTL_MS = 60000;

  function isFormidableForm(formEl) {
    if (!formEl) return false;
    try {
      if (formEl.closest && formEl.closest('.frm_forms')) return true;
    } catch (e) {
      // .closest not available — fall back to class check
    }
    var cls = ' ' + (formEl.className || '') + ' ';
    return cls.indexOf(' frm-show-form ') !== -1;
  }

  function fireConversion(formId, formEl) {
    // Both AJAX events (and the native path) can resolve to the same
    // submission — dedupe with a short-lived flag on the form when it's
    // resolvable. If it isn't resolvable we still fire (favors counting a
    // real submission over silently dropping it).
    if (!formEl && formId) formEl = document.getElementById('form_' + formId);
    if (formEl) {
      if (formEl.getAttribute('data-ct-processing') === 'true') return;
      formEl.setAttribute('data-ct-processing', 'true');
      setTimeout(function () { formEl.removeAttribute('data-ct-processing'); }, 2000);
      disarmWatcher(formEl);
    }
    window.dataLayer.push({
      event: 'formidable_forms_submitted',
      form_id: formId || ''
    });
  }

  // ---- Shared validation-marker check (used by both fire paths) ----

  function isNodeHidden(el) {
    try {
      if (el.hidden) return true;
      if (el.getAttribute && el.getAttribute('aria-hidden') === 'true') return true;
      var view = el.ownerDocument && el.ownerDocument.defaultView;
      if (view && view.getComputedStyle) {
        var cs = view.getComputedStyle(el);
        if (cs && (cs.display === 'none' || cs.visibility === 'hidden')) return true;
      }
    } catch (e) {
      // fall through
    }
    return false;
  }

  // Formidable's standard error markers: .frm_error (per-field message),
  // .frm_error_style (form-level rejection box), .frm_blank_field (state
  // class on a required-but-blank field), [aria-invalid="true"].
  function hasVisibleValidationErrors(scopeEl) {
    if (!scopeEl || !scopeEl.querySelectorAll) return false;
    try {
      var nodes = scopeEl.querySelectorAll(
        '.frm_error, .frm_error_style, .frm_blank_field, [aria-invalid="true"]'
      );
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (isNodeHidden(node)) continue;
        if (node.getAttribute && node.getAttribute('aria-invalid') === 'true') return true;
        var cls = ' ' + (typeof node.className === 'string' ? node.className : '') + ' ';
        if (cls.indexOf(' frm_blank_field ') !== -1) return true;
        if ((node.textContent || '').trim()) return true;
      }
    } catch (e) {
      // fall through
    }
    return false;
  }

  function hasServerRejectionMarkers() {
    try {
      var wrappers = document.querySelectorAll('.frm_forms');
      for (var i = 0; i < wrappers.length; i++) {
        if (hasVisibleValidationErrors(wrappers[i])) return true;
      }
    } catch (e) {
      // fall through
    }
    return false;
  }

  function hasSuccessMessage() {
    try {
      var nodes = document.querySelectorAll('.frm_message');
      for (var i = 0; i < nodes.length; i++) {
        if (isNodeHidden(nodes[i])) continue;
        if ((nodes[i].textContent || '').trim()) return true;
      }
    } catch (e) {
      // fall through
    }
    return false;
  }

  // ---- Fire path 1: AJAX success events ----

  var activeWatchers = [];

  function findWatcher(formEl) {
    for (var w = 0; w < activeWatchers.length; w++) {
      if (activeWatchers[w].form === formEl) return activeWatchers[w];
    }
    return null;
  }

  function disarmWatcher(formEl) {
    var existing = findWatcher(formEl);
    if (existing && typeof existing.cleanup === 'function') existing.cleanup();
  }

  function handleAjaxSuccessEvent(event) {
    var formId = '';
    try {
      if (event.detail && event.detail.frmVars && event.detail.frmVars.formID) {
        formId = event.detail.frmVars.formID;
      }
    } catch (e) {
      // detail not available
    }

    var formEl = formId ? document.getElementById('form_' + formId) : null;
    if (!formEl) {
      // Fallback: the first form inside the first .frm_forms wrapper.
      try {
        var wrappers = document.querySelectorAll('.frm_forms');
        for (var i = 0; i < wrappers.length; i++) {
          var f = wrappers[i].querySelector('form');
          if (f) { formEl = f; break; }
        }
      } catch (e) {
        // querySelectorAll unavailable — give up
      }
    }

    fireConversion(formId, formEl);
  }

  // ---- Fire path 2: native (non-AJAX) pagehide watcher + deferred verdict ----

  function writeDeferredMarker(formId) {
    try {
      window.sessionStorage.setItem(DEFERRED_MARKER_KEY, JSON.stringify({
        t: Date.now(),
        path: window.location.pathname,
        formId: formId
      }));
      return true;
    } catch (e) {
      return false;
    }
  }

  function takeDeferredMarker() {
    try {
      var raw = window.sessionStorage.getItem(DEFERRED_MARKER_KEY);
      if (!raw) return null;
      window.sessionStorage.removeItem(DEFERRED_MARKER_KEY);
      var data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return null;
      if (!data.t || Date.now() - data.t > DEFERRED_MARKER_TTL_MS) return null;
      return data;
    } catch (e) {
      try { window.sessionStorage.removeItem(DEFERRED_MARKER_KEY); } catch (e2) {}
      return null;
    }
  }

  // Runs once at module init on every page load. Consumes the marker the
  // previous page wrote at pagehide (if any) and reads the verdict from the
  // markup Formidable rendered into THIS page. Rejection is checked first:
  // the rejected-POST re-render always carries error markers, so a missed
  // fire here degrades to under-counting, never fabricating.
  function processDeferredVerdict() {
    var marker = takeDeferredMarker();
    if (!marker) return;

    if (hasServerRejectionMarkers()) return;

    if (hasSuccessMessage()) {
      fireConversion(marker.formId, null);
      return;
    }
    // No Formidable markup either way. A success configured to redirect
    // lands on a different path with no .frm_message — treat a changed
    // pathname as that redirect. A rejection can't look like this: the
    // rejected POST always re-renders the form WITH error markers.
    if (marker.path && window.location.pathname !== marker.path) {
      fireConversion(marker.formId, null);
    }
    // Same page, no markers either way — ambiguous, do not fire.
  }

  function armNativeWatcher(formEl, formId, pagehideTrusted) {
    var existing = findWatcher(formEl);
    if (existing) {
      existing.refresh(formId, pagehideTrusted);
      return;
    }

    var entry = { form: formEl, refresh: refresh, cleanup: cleanup };
    activeWatchers.push(entry);

    var fired = false;
    var timer = null;
    var pagehideArmed = false;

    function onPageHide() {
      if (fired) return;
      // Click-then-leave guard: a visitor blocked by Formidable's own
      // validation who then navigates away must not count.
      if (hasVisibleValidationErrors(formEl)) return;
      fired = true;
      if (formEl.getAttribute('data-ct-processing') !== 'true') {
        writeDeferredMarker(formId);
      }
      cleanup();
    }

    function armPagehide() {
      if (pagehideArmed) return;
      try {
        window.addEventListener('pagehide', onPageHide, true);
        pagehideArmed = true;
      } catch (e) {
        // fall through
      }
    }

    function disarmPagehide() {
      if (!pagehideArmed) return;
      try { window.removeEventListener('pagehide', onPageHide, true); } catch (e) {}
      pagehideArmed = false;
    }

    function startTimer() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        if (!fired) cleanup();
      }, SUCCESS_WINDOW_MS);
    }

    function cleanup() {
      if (timer) { clearTimeout(timer); timer = null; }
      disarmPagehide();
      var idx = activeWatchers.indexOf(entry);
      if (idx !== -1) activeWatchers.splice(idx, 1);
    }

    // A later submit on the same form: the visitor corrected a failed
    // field and re-submitted. Refresh everything to the latest attempt.
    function refresh(nextFormId, nextPagehideTrusted) {
      if (fired) return;
      formId = nextFormId;
      if (nextPagehideTrusted) armPagehide();
      else disarmPagehide();
      startTimer();
    }

    if (pagehideTrusted) armPagehide();
    startTimer();
  }

  // Bubble-phase submit listener — arms the native watcher on every
  // Formidable submit attempt. This fires even when Formidable
  // preventDefaults it (the event still dispatches) — this is the moment
  // we snapshot, NOT the moment we fire.
  function handleNativeSubmit(event) {
    var formEl = event.target;
    if (!formEl || (formEl.tagName || '').toLowerCase() !== 'form') return;
    if (!isFormidableForm(formEl)) return;

    var formId = '';
    var m = /^form_(\d+)$/.exec(formEl.id || '');
    if (m) formId = m[1];

    // Client-validity gate: trust the pagehide path when the form is valid
    // (or checkValidity is unavailable). NOTE per the source module:
    // Formidable's required-ness is often enforced only server-side, so a
    // form can pass checkValidity() while still blank — the pagehide-time
    // visible-error check is the real safety net here, not this gate alone.
    var pagehideTrusted = true;
    try {
      if (typeof formEl.checkValidity === 'function' && formEl.checkValidity() === false) {
        pagehideTrusted = false;
      }
    } catch (e) {
      // constraint validation unavailable — pagehide's visible-error check
      // still guards this path
    }

    armNativeWatcher(formEl, formId, pagehideTrusted);
  }

  document.addEventListener('frmFormComplete', handleAjaxSuccessEvent, true);
  document.addEventListener('frmBeforeFormRedirect', handleAjaxSuccessEvent, true);
  document.addEventListener('submit', handleNativeSubmit, false);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      processDeferredVerdict();
    });
  } else {
    processDeferredVerdict();
  }
})();
