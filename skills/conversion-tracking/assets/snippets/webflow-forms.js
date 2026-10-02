/*! Webflow Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: webflow_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectWebflowForms) return;
  window.__ctDetectWebflowForms = true;
  window.dataLayer = window.dataLayer || [];

  // How long after a submit we keep watching for Webflow's success box
  // before giving up. Webflow's AJAX round-trip is normally 1–2 seconds.
  var WATCH_TIMEOUT_MS = 30000;

  function fireConversion(formName) {
    window.dataLayer.push({
      event: 'webflow_form_submitted',
      form_name: formName || ''
    });
  }

  // Webflow marks every form component with the `.w-form` wrapper class,
  // regardless of theme or custom classes added on top. This is the same
  // check the production module uses to scope its listener to real Webflow
  // forms (and not e.g. a hand-coded <form> elsewhere on the page).
  function isWebflowForm(formEl) {
    if (!formEl || !formEl.closest) return false;
    return formEl.closest('.w-form') !== null;
  }

  function isVisible(el) {
    if (!el) return false;
    try {
      return window.getComputedStyle(el).display !== 'none';
    } catch (e) {
      return false;
    }
  }

  // Arm a success watcher for one form. Fires only when Webflow's own
  // success box (`.w-form-done`, a sibling of the form inside the `.w-form`
  // wrapper) becomes visible — Webflow sets inline `display: block` on it
  // after its AJAX call succeeds (live-verified). A visible `.w-form-fail`
  // (Webflow's failure box), or the timeout elapsing with neither box shown
  // (Webflow's JS can also reject a submission silently, with no UI change
  // at all), tears the watcher down WITHOUT firing. One watcher per form:
  // a re-submit while armed (e.g. a retry after a failure) resets it.
  function armWatcher(formEl, formName) {
    var wrap = formEl.closest('.w-form');
    if (!wrap) return;
    var doneEl = wrap.querySelector('.w-form-done');
    var failEl = wrap.querySelector('.w-form-fail');
    if (!doneEl) return; // nothing to confirm success against — never fire unconfirmed

    var prev = formEl.__ctDetectWatch;
    if (prev) prev.teardown();

    var state = { fired: false };
    var observer = null;
    var pollTimer = null;
    var killTimer = null;

    function teardown() {
      if (state.fired) return;
      state.fired = true;
      if (observer) { try { observer.disconnect(); } catch (e) {} }
      if (pollTimer) clearInterval(pollTimer);
      if (killTimer) clearTimeout(killTimer);
      formEl.__ctDetectWatch = null;
    }
    state.teardown = teardown;

    function check() {
      if (state.fired) return;
      if (isVisible(doneEl)) {
        teardown();
        fireConversion(formName); // confirmed Webflow success
      } else if (isVisible(failEl)) {
        teardown(); // confirmed Webflow failure — no conversion
      }
    }

    if (typeof MutationObserver === 'function') {
      observer = new MutationObserver(check);
      observer.observe(wrap, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        subtree: true,
        childList: true
      });
    }
    pollTimer = setInterval(check, 300); // belt-and-braces alongside the observer
    killTimer = setTimeout(teardown, WATCH_TIMEOUT_MS);

    formEl.__ctDetectWatch = state;
  }

  // Attached at the document level in CAPTURE phase so it runs before the
  // handler Webflow attaches in bubble phase — the same technique the
  // production module uses to see the submit reliably. The submit itself
  // never fires the conversion; it only snapshots the form name and arms
  // the success watcher above.
  function handleSubmit(event) {
    try {
      var formEl = event.target;
      if (!formEl || (formEl.tagName || '').toLowerCase() !== 'form') return;
      if (!isWebflowForm(formEl)) return;

      // The form's own name/id — set by the site builder in the Webflow
      // Designer, not user-submitted data. Snapshotted at submit time.
      var formName = formEl.getAttribute('data-name') || formEl.id || '';

      armWatcher(formEl, formName);
    } catch (e) {
      // Never throw back into Webflow's own form handling.
    }
  }

  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('submit', handleSubmit, true);
  }
})();
