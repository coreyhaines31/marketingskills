/*! Wix Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: wix_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectWixForms) return;
  window.__ctDetectWixForms = true;
  window.dataLayer = window.dataLayer || [];

  // How long, after a New-form Submit click, we wait for a success signal
  // before giving up (treating it as a validation failure / no-op).
  var SUCCESS_WINDOW_MS = 7000;

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

  // Old Wix Forms render inputs as Wix components: id="input_comp-...".
  function isOldWixForm(formEl) {
    if (!formEl || !formEl.querySelector) return false;
    try {
      if (formEl.querySelector('input[id^="input_comp-"]')) return true;
    } catch (e) {
      // fall through
    }
    return false;
  }

  // ---- OLD Wix forms: native submit (Pattern A) ----
  // Capture phase so this runs before Wix's own handler can clear/detach
  // the form. New forms are explicitly excluded — they have no native
  // submit and are handled by the click path below.
  function handleSubmit(event) {
    try {
      var formEl = event.target;
      if (!formEl || (formEl.tagName || '').toLowerCase() !== 'form') return;
      if (isNewWixForm(formEl)) return;   // click path owns new forms
      if (!isOldWixForm(formEl)) return;

      // A submission another handler already cancelled never happened.
      if (event.defaultPrevented) return;

      // Constraint validation gate: an invalid form cannot have submitted.
      try {
        if (typeof formEl.checkValidity === 'function' && formEl.checkValidity() === false) return;
      } catch (e) {
        // constraint validation unavailable — fall through
      }

      fireConversion(formEl.id);
    } catch (e) {
      // Never throw back into Wix's own form handling.
    }
  }

  // ---- NEW Wix forms: submit-button click + confirmed success ----

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

  // Sorts a candidate node into one of two evidence tiers:
  //   'structural' — a marker Wix's own runtime stamps on success (a
  //     data-hook or class name containing "success") — sufficient alone.
  //   'status'     — readable confirmation-ish text (ARIA live region or
  //     English thank-you wording) — corroboration only, never sufficient
  //     alone (live regions also announce in-progress states).
  //   null         — not evidence.
  function classifySuccessNode(node) {
    if (!node || node.nodeType !== 1) return null;
    try {
      var hook = node.getAttribute ? node.getAttribute('data-hook') : null;
      if (hook && /error/i.test(hook)) return null;
      if (node.getAttribute && node.getAttribute('aria-busy') === 'true') return null;
      var cls = (typeof node.className === 'string' ? node.className : '') || '';
      if (/error/i.test(cls)) return null;
      if ((hook && /success/i.test(hook)) || /success/i.test(cls)) return 'structural';
      var text = (node.textContent || '').trim();
      if (!text) return null;
      if (/error|required|invalid|try again|please enter|please fill/i.test(text)) return null;
      var isSuccessText =
        /thank|success|received|in touch|submitted|message sent|got it|appreciate|subscrib/i.test(text);
      if (!isSuccessText &&
          /^(submitting|sending|loading|processing|please wait|one moment)\b/i.test(text)) {
        return null;
      }
      if (node.getAttribute && node.getAttribute('role') === 'status') return 'status';
      if (isSuccessText) return 'status';
    } catch (e) {
      // fall through
    }
    return null;
  }

  // Wix marks failed fields with an "error" data-hook slot and/or
  // aria-invalid="true" on the input — visible ones mean the submit was
  // rejected.
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

  function hasVisibleValidationErrors(root) {
    if (!root || !root.querySelectorAll) return false;
    try {
      var nodes = root.querySelectorAll('[data-hook*="error"], [aria-invalid="true"]');
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

  function watchForSuccess(root, formId, pagehideTrusted) {
    var entry = { root: root, refresh: refresh };
    activeWatchers.push(entry);

    var fired = false;
    var timer = null;
    var observer = null;
    var pagehideArmed = false;
    // Corroboration state: a status/text confirmation was seen this
    // attempt. Text alone never fires — it only lets the weak structural
    // signals (form concealed / removed) confirm.
    var statusSeen = false;

    // Snapshot the controls that currently hold a value, so we can detect
    // Wix clearing the form on success. Values themselves are never read
    // for content — only used to test "was non-empty, now empty".
    var tracked = [];
    function snapshotTracked() {
      tracked = [];
      try {
        var inputs = root.querySelectorAll('input, textarea, select');
        for (var i = 0; i < inputs.length; i++) {
          var el = inputs[i];
          if ((el.type || '') === 'hidden') continue;
          if ((el.value || '') !== '') tracked.push(el);
        }
      } catch (e) {
        // fall through
      }
    }
    snapshotTracked();

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
      timer = setTimeout(function() {
        if (!fired) cleanup(); // no success signal within window — not firing
      }, SUCCESS_WINDOW_MS);
    }

    // A later click on the same root — Wix's duplicate click event for one
    // press, or a real re-submit after the visitor corrected a failed
    // field. Everything reflects the LATEST attempt.
    function refresh(nextFormId, nextPagehideTrusted) {
      if (fired) return;
      formId = nextFormId;
      statusSeen = false;
      snapshotTracked();
      if (nextPagehideTrusted) armPagehide();
      else disarmPagehide();
      startTimer();
    }

    function cleanup() {
      if (timer) { clearTimeout(timer); timer = null; }
      if (observer) { try { observer.disconnect(); } catch (e) {} observer = null; }
      disarmPagehide();
      var idx = activeWatchers.indexOf(entry);
      if (idx !== -1) activeWatchers.splice(idx, 1);
    }

    function fire() {
      if (fired) return;
      fired = true;
      fireConversion(formId);
      cleanup();
    }

    function inputsCleared() {
      if (!tracked.length) return false;
      for (var i = 0; i < tracked.length; i++) {
        var el = tracked[i];
        if (el && el.isConnected && (el.value || '') !== '') return false;
      }
      return true; // every previously-filled control is now empty or gone
    }

    function noteEvidence(node, structuralOnly) {
      if (!node || node === scope) return false;
      var tier = classifySuccessNode(node);
      if (tier === 'structural' && !isConcealed(node, scope)) {
        fire();
        return true;
      }
      if (!structuralOnly && tier === 'status') statusSeen = true;
      return false;
    }

    function onMutations(muts) {
      if (fired) return;
      var removed = !root.isConnected;
      if (!removed && inputsCleared()) { fire(); return; } // Wix reset the form
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes || [];
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (noteEvidence(node, false)) return;
          if (node && node.nodeType === 3 && noteEvidence(muts[i].target, false)) return;
        }
        if (muts[i].type === 'attributes' && noteEvidence(muts[i].target, true)) return;
      }
      // Removal/concealment alone are too weak to fire — closing a modal or
      // an SPA page swap looks the same with no submit behind it. A
      // status/text message seen in the same attempt corroborates.
      if (statusSeen && (removed || isConcealed(root, scope))) {
        fire();
      }
    }

    function onPageHide() {
      // A visitor who failed Wix's validation and then left the page also
      // produces a pagehide — visible error indicators mean no submit
      // happened.
      if (hasVisibleValidationErrors(root)) return;
      fire();
    }

    // Scope the observer to the form's container — success messages appear
    // here and form removal shows up as a childList change on the parent.
    var scope = root.parentNode || document.body;
    try {
      observer = new MutationObserver(onMutations);
      observer.observe(scope, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'hidden', 'aria-hidden'],
      });
    } catch (e) {
      // MutationObserver unavailable — rely on pagehide + timeout only
    }

    if (pagehideTrusted) armPagehide();

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

      // A form invalid under native constraint validation at click time
      // cannot have submitted, so a later pagehide must not confirm it.
      // Structural success signals stay armed regardless — they only ever
      // come from Wix itself, after an actual successful submit.
      var pagehideTrusted = true;
      try {
        if (typeof root.checkValidity === 'function' && !root.checkValidity()) {
          pagehideTrusted = false;
        }
      } catch (e) {
        // constraint validation unavailable
      }

      var existing = findWatcher(root);
      if (existing) {
        existing.refresh(formId, pagehideTrusted);
        return;
      }

      watchForSuccess(root, formId, pagehideTrusted);
    } catch (e) {
      // Never throw back into Wix's own click handling.
    }
  }

  if (typeof document !== 'undefined' && document.addEventListener) {
    // Bubble phase for submit: a capture-phase listener runs before Wix's own
    // handlers and would count submissions its validation goes on to cancel.
    document.addEventListener('submit', handleSubmit, false);  // OLD forms
    document.addEventListener('click', handleClick, true);     // NEW forms
  }
})();
