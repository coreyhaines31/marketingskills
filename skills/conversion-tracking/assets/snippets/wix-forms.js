/*! Wix Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: wix_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectWixForms) return;
  window.__ctDetectWixForms = true;
  window.dataLayer = window.dataLayer || [];

  // Wait for Wix's inline confirmation without reading form answers.
  var SUCCESS_WINDOW_MS = 60000;

  function fireConversion(formId) {
    window.dataLayer.push({
      event: 'wix_form_submitted',
      form_id: formId || ''
    });
  }

  // ---- Form detection ----

  // New Wix Forms carry data-hook markers: the form itself is
  // data-hook="form-<uuid>", fields are wrapped in
  // data-hook="form-field-...", and the submit control is
  // data-hook="submit-button".
  function isNewWixForm(root) {
    if (!root) return false;
    try {
      var hook = root.getAttribute ? root.getAttribute('data-hook') : null;
      if (hook && hook.indexOf('form-') === 0 && hook.indexOf('form-field-') !== 0) {
        return true;
      }
      if (root.querySelector &&
          (root.querySelector('[data-hook^="form-field-"]') ||
           root.querySelector('[data-hook="submit-button"]'))) {
        return true;
      }
    } catch (e) {
      // fall through
    }
    return false;
  }

  // Legacy Forms have no observed accepted-only browser verdict in this pack.
  // Their native submit event is an attempt, so coverage is deliberately withheld.

  // New Wix Forms arm on a click and confirm with Wix's success marker.

  // Watchers currently in flight, keyed by form root, so duplicate click
  // events Wix emits for a single Submit press don't arm two watchers. A
  // re-click on a watched root REFRESHES the existing watcher instead of
  // being dropped, so a visitor who fails validation, fixes a field, and
  // clicks again inside the window gets a fresh verdict.
  var activeWatchers = [];

  function findWatcher(root) {
    for (var w = 0; w < activeWatchers.length; w++) {
      if (activeWatchers[w].root === root) return activeWatchers[w];
    }
    return null;
  }

  function findNewFormRoot(btn) {
    var root = btn.closest ? btn.closest('form') : null;
    if (root && isNewWixForm(root)) return root;
    if (btn.closest) {
      var alt = btn.closest('[data-hook="form-root"]') || btn.closest('[data-hook^="form-"]');
      if (alt && isNewWixForm(alt)) return alt;
    }
    return null;
  }

  // Wix FormViewerWidget renders this hook after its submission action
  // returns a submission. Generic classes and navigation are not acceptance.
  function classifySuccessNode(node) {
    if (!node || node.nodeType !== 1) return null;
    return node.getAttribute &&
      node.getAttribute('data-hook') === 'submit-form-success-message'
      ? 'structural' : null;
  }

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

  // Ancestor-aware hiding check, capped at the observed container.
  function isConcealed(el, stopAt) {
    var node = el;
    var depth = 0;
    while (node && node.nodeType === 1 && depth < 12) {
      if (isNodeHidden(node)) return true;
      if (node === stopAt) break;
      node = node.parentNode;
      depth++;
    }
    return false;
  }

  function watchForSuccess(root, formId) {
    var entry = { root: root, refresh: refresh, cancel: cleanup };
    activeWatchers.push(entry);

    var fired = false;
    var timer = null;
    var observer = null;
    function startTimer() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function() {
        if (!fired) cleanup(); // No success signal within the window.
      }, SUCCESS_WINDOW_MS);
    }

    // A later click on the same root can be a duplicate click event for one
    // press, or a real re-submit after the visitor corrected a failed
    // field. Everything reflects the LATEST attempt.
    function refresh(nextFormId) {
      if (fired) return;
      formId = nextFormId;
      startTimer();
    }

    function cleanup() {
      if (timer) { clearTimeout(timer); timer = null; }
      if (observer) { try { observer.disconnect(); } catch (e) {} observer = null; }
      var idx = activeWatchers.indexOf(entry);
      if (idx !== -1) activeWatchers.splice(idx, 1);
      discardMethod2(formId, root);
    }

    function fire() {
      if (fired) return;
      fired = true;
      var handled = false;
      try {
        if (typeof window.__ctWixMethod2Emit === 'function') {
          handled = window.__ctWixMethod2Emit(formId, root) === true;
        }
      } catch (e) {}
      if (!handled) fireConversion(formId);
      cleanup();
    }

    function noteEvidence(node) {
      if (!node || node === scope) return false;
      if (classifySuccessNode(node) === 'structural' && !isConcealed(node, scope)) {
        fire();
        return true;
      }
      if (node.querySelectorAll) {
        var markers = node.querySelectorAll('[data-hook="submit-form-success-message"]');
        for (var i = 0; i < markers.length; i++) {
          if (noteEvidence(markers[i])) return true;
        }
      }
      return false;
    }

    function onMutations(muts) {
      if (fired) return;
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes || [];
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (noteEvidence(node)) return;
        }
      }
    }

    // The inline confirmation belongs to this form only.
    var scope = root;
    try {
      observer = new MutationObserver(onMutations);
      observer.observe(scope, {
        childList: true,
        subtree: true
      });
    } catch (e) {
      // Without observation, no conversion is inferred.
    }

    startTimer();
  }

  function handleClick(event) {
    try {
      var target = event.target;
      if (!target || !target.closest) return;

      var btn = target.closest('[data-hook="submit-button"]');
      if (!btn) return;

      var root = findNewFormRoot(btn);
      if (!root) return;

      var formId = root.getAttribute ? (root.getAttribute('data-hook') || root.id || '') : (root.id || '');

      var existing = findWatcher(root);
      if (existing) {
        existing.refresh(formId);
        return;
      }

      watchForSuccess(root, formId);
    } catch (e) {
      // Never throw back into Wix's own click handling.
    }
  }

  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('click', handleClick, true);     // NEW forms
  }

  function discardMethod2(formId, root) {
    try {
      if (typeof window.__ctWixMethod2Discard === 'function') {
        window.__ctWixMethod2Discard(formId, root);
      }
    } catch (e) {}
  }
})();
