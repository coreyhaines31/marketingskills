/*! WPForms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: wpforms_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectWpforms) return;
  window.__ctDetectWpforms = true;
  // Only run in real http(s) documents. about:blank / srcdoc iframes inherit
  // the parent's origin, so they SHARE sessionStorage — a copy of this script
  // running in one would consume the deferred native-mode marker and, because
  // its pathname can never equal the form page's path, fabricate a fire via
  // the redirect heuristic. Observed live on parkhousesoftware.com (an
  // about:blank iframe stole the marker during verification, 2026-07-05).
  if (!/^https?:$/.test(window.location.protocol)) return;
  window.dataLayer = window.dataLayer || [];

  var NATIVE_WINDOW_MS = 10000;
  var DEFERRED_MARKER_KEY = '__ctDetectWpformsNativePending';
  var DEFERRED_MARKER_TTL_MS = 60000;

  function isWPForm(formEl) {
    if (!formEl) return false;
    try {
      if (formEl.closest && formEl.closest('.wpforms-container')) return true;
    } catch (e) {
      // .closest not available — fall back to ID check
    }
    var id = formEl.id || '';
    return /^wpforms-form-\d+$/.test(id);
  }

  function parseFormId(formEl) {
    var id = (formEl && formEl.id) || '';
    var m = /^wpforms-form-(\d+)$/.exec(id);
    return m ? m[1] : '';
  }

  function fireConversion(formId) {
    window.dataLayer.push({
      event: 'wpforms_form_submitted',
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

  function hasVisibleValidationErrors(scopeEl) {
    if (!scopeEl || !scopeEl.querySelectorAll) return false;
    try {
      var nodes = scopeEl.querySelectorAll(
        '.wpforms-error, .wpforms-error-container, [aria-invalid="true"]'
      );
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (isNodeHidden(node)) continue;
        if (node.getAttribute && node.getAttribute('aria-invalid') === 'true') return true;
        if ((node.textContent || '').trim()) return true;
      }
    } catch (e) {
      // fall through
    }
    return false;
  }

  function hasServerRejectionMarkers() {
    try {
      var wrappers = document.querySelectorAll('.wpforms-container');
      for (var i = 0; i < wrappers.length; i++) {
        if (hasVisibleValidationErrors(wrappers[i])) return true;
      }
    } catch (e) {
      // fall through
    }
    return false;
  }

  function hasConfirmationMessage() {
    try {
      var nodes = document.querySelectorAll(
        '.wpforms-confirmation-container-full, .wpforms-confirmation-container, div[id^="wpforms-confirmation-"]'
      );
      for (var i = 0; i < nodes.length; i++) {
        if (isNodeHidden(nodes[i])) continue;
        if ((nodes[i].textContent || '').trim()) return true;
      }
    } catch (e) {
      // fall through
    }
    return false;
  }

  // ---- Fire path 1: AJAX success event ----

  var activeWatchers = [];

  function findWatcher(formEl) {
    for (var w = 0; w < activeWatchers.length; w++) {
      if (activeWatchers[w].form === formEl) return activeWatchers[w];
    }
    return null;
  }

  // An AJAX success disarms any pagehide watcher armed for this form — the
  // 2s dedup flag self-clears but the native watcher would otherwise stay
  // armed for the full 10s window and could re-fire on a later navigation.
  function disarmWatcher(formEl) {
    var existing = findWatcher(formEl);
    if (existing && typeof existing.cleanup === 'function') existing.cleanup();
  }

  var successHooked = false;

  function hookWpformsSuccess() {
    if (successHooked) return true;
    if (typeof jQuery === 'undefined' && typeof $ === 'undefined') return false;

    var jQ = typeof jQuery !== 'undefined' ? jQuery : $;
    jQ(document).on('wpformsAjaxSubmitSuccess', function (event) {
      var formEl = event.target;
      if (!formEl) return;

      if (formEl.getAttribute('data-ct-processing') === 'true') return;
      formEl.setAttribute('data-ct-processing', 'true');
      setTimeout(function () { formEl.removeAttribute('data-ct-processing'); }, 2000);

      disarmWatcher(formEl);
      fireConversion(parseFormId(formEl));
    });
    successHooked = true;
    return true;
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
  // markup WPForms rendered into THIS page. Rejection is checked first: the
  // rejected-POST re-render always carries error markers, so a missed fire
  // here degrades to under-counting, never fabricating.
  function processDeferredVerdict() {
    var marker = takeDeferredMarker();
    if (!marker) return;

    if (hasServerRejectionMarkers()) return;

    if (hasConfirmationMessage()) {
      fireConversion(marker.formId);
      return;
    }
    // No WPForms markup either way. A success configured to redirect lands
    // on a different path with no confirmation container — treat a changed
    // pathname as that redirect. A rejection can't look like this: the
    // rejected POST always re-renders the form WITH error markers.
    if (marker.path && window.location.pathname !== marker.path) {
      fireConversion(marker.formId);
    }
    // Same page, no markers either way — ambiguous, do not fire.
  }

  function watchForSuccess(formEl, formId, pagehideTrusted) {
    var entry = { form: formEl, refresh: refresh, cleanup: cleanup };
    activeWatchers.push(entry);

    var fired = false;
    var timer = null;
    var pagehideArmed = false;

    function onPageHide() {
      if (fired) return;
      // Click-then-leave guard: a visitor who submitted an invalid form,
      // got blocked, then navigated away produces a pagehide too. Visible
      // error markers mean the submit never went through — do not fire.
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
      // No navigation within the window → either AJAX already fired (page
      // stayed) or the submit was abandoned/rejected. Either way: clean up,
      // do not fire.
      timer = setTimeout(function () {
        if (!fired) cleanup();
      }, NATIVE_WINDOW_MS);
    }

    function cleanup() {
      if (timer) { clearTimeout(timer); timer = null; }
      disarmPagehide();
      var idx = activeWatchers.indexOf(entry);
      if (idx !== -1) activeWatchers.splice(idx, 1);
    }

    // A later submit on the same form refreshes the snapshot + verdict +
    // timer — a visitor who failed validation, fixed it, and re-submitted
    // inside the window is a fresh attempt.
    function refresh(nextFormId, nextPagehideTrusted) {
      if (fired) return;
      formId = nextFormId;
      if (nextPagehideTrusted) armPagehide();
      else disarmPagehide();
      startTimer();
    }

    // Only arm pagehide when the form was client-valid at submit time. An
    // invalid form cannot have submitted, so its pagehide must not confirm.
    if (pagehideTrusted) armPagehide();
    startTimer();
  }

  // Bubble-through-capture submit handler: arms the native watcher on every
  // WPForms submit attempt. This fires even when WPForms preventDefaults the
  // submit (the event still dispatches) — this is the moment we snapshot,
  // NOT the moment we fire. Capture phase is required: WPForms' own submit
  // handler stops the event's propagation before it reaches a bubble-phase
  // document listener (verified on a live form in the production module).
  function armNativeWatcher(event) {
    var formEl = event.target;
    if (!formEl || (formEl.tagName || '').toLowerCase() !== 'form') return;
    if (!isWPForm(formEl)) return;

    var formId = parseFormId(formEl);

    // Client-validity gate: only trust the pagehide path when the form is
    // valid (or checkValidity is unavailable). An invalid form cannot have
    // submitted, so its navigation must not be read as a success.
    var pagehideTrusted = true;
    try {
      if (typeof formEl.checkValidity === 'function' && formEl.checkValidity() === false) {
        pagehideTrusted = false;
      }
    } catch (e) {
      // constraint validation unavailable — the visible-error check at
      // pagehide time still guards this path
    }

    var existing = findWatcher(formEl);
    if (existing) {
      existing.refresh(formId, pagehideTrusted);
      return;
    }

    watchForSuccess(formEl, formId, pagehideTrusted);
  }

  document.addEventListener('submit', armNativeWatcher, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      processDeferredVerdict();
    });
  } else {
    processDeferredVerdict();
  }

  hookWpformsSuccess();
  if (!successHooked) {
    document.addEventListener('DOMContentLoaded', function () {
      hookWpformsSuccess();
    });
    window.addEventListener('load', function () {
      hookWpformsSuccess();
    });
  }
})();
