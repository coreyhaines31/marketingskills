/*! Generic AJAX form conversion detection (MIT)
 *  Detects: inline success after an AJAX form submit. Pushes dataLayer event: form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectGenericAjaxForm) return;
  window.__ctDetectGenericAjaxForm = true;
  window.dataLayer = window.dataLayer || [];

  /* Last-resort fallback for form tools this repo has no specific snippet
     for. It infers success from the page changing after a submit, which is
     weaker than a tool's own success event. Always prefer a named snippet
     from snippets/ when one exists for the tool.

     The design deliberately refuses to fire on submit alone. A submit is an
     attempt; only a success signal appearing afterwards, with no visible
     validation error, is treated as a conversion. */

  var SUCCESS_WINDOW_MS = 7000;   // how long to wait for a success signal
  var watchers = [];

  function fire(formEl) {
    window.dataLayer.push({
      event: 'form_submitted',
      form_id: (formEl && formEl.id) || '',
      form_name: (formEl && formEl.getAttribute && formEl.getAttribute('name')) || '',
      page_path: window.location.pathname,
      detection: 'generic-ajax'
    });
  }

  function isHidden(el) {
    try {
      if (el.hidden) return true;
      if (el.getAttribute && el.getAttribute('aria-hidden') === 'true') return true;
      var view = el.ownerDocument && el.ownerDocument.defaultView;
      if (view && view.getComputedStyle) {
        var cs = view.getComputedStyle(el);
        if (cs && (cs.display === 'none' || cs.visibility === 'hidden')) return true;
      }
    } catch (e) { /* fall through */ }
    return false;
  }

  // A visible validation error means the submit was rejected. This is the
  // guard that stops a failed submission being counted.
  function hasVisibleError(root) {
    try {
      var nodes = root.querySelectorAll(
        '[aria-invalid="true"], .error, .is-invalid, [class*="error"], [role="alert"]'
      );
      for (var i = 0; i < nodes.length; i++) {
        if (isHidden(nodes[i])) continue;
        if (nodes[i].getAttribute &&
            nodes[i].getAttribute('aria-invalid') === 'true') return true;
        if ((nodes[i].textContent || '').trim()) return true;
      }
    } catch (e) { /* fall through */ }
    return false;
  }

  function looksLikeSuccess(node) {
    if (!node || node.nodeType !== 1) return false;
    try {
      var cls = (typeof node.className === 'string' ? node.className : '') || '';
      var hook = (node.getAttribute && node.getAttribute('data-hook')) || '';
      if (/error|invalid/i.test(cls + ' ' + hook)) return false;

      // Structural marker the tool itself stamped. Strongest signal here.
      if (/success|confirmation|thank/i.test(cls + ' ' + hook)) return true;

      var text = (node.textContent || '').trim();
      if (!text || text.length > 300) return false;
      if (/error|required|invalid|try again|please enter|please fill/i.test(text)) return false;
      // Still in flight, not done.
      if (/^(submitting|sending|loading|processing|please wait|one moment)\b/i.test(text)) return false;
      return /thank you|thanks|success|received|we'?ll be in touch|message sent|submitted/i.test(text);
    } catch (e) {
      return false;
    }
  }

  function watch(formEl) {
    for (var i = 0; i < watchers.length; i++) {
      if (watchers[i].form === formEl) return;   // already watching this form
    }

    var entry = { form: formEl };
    watchers.push(entry);

    var done = false;
    var observer = null;
    var timer = null;

    function stop() {
      done = true;
      if (observer) { try { observer.disconnect(); } catch (e) {} }
      if (timer) { clearTimeout(timer); }
      for (var j = 0; j < watchers.length; j++) {
        if (watchers[j] === entry) { watchers.splice(j, 1); break; }
      }
    }

    function evaluate(nodes) {
      if (done) return;
      // A visible error anywhere in the form means rejection. Give up.
      if (hasVisibleError(formEl)) { stop(); return; }
      for (var k = 0; k < nodes.length; k++) {
        if (looksLikeSuccess(nodes[k])) {
          fire(formEl);
          stop();
          return;
        }
      }
    }

    try {
      observer = new MutationObserver(function (mutations) {
        var added = [];
        for (var a = 0; a < mutations.length; a++) {
          var m = mutations[a];
          for (var b = 0; b < m.addedNodes.length; b++) added.push(m.addedNodes[b]);
          if (m.type === 'attributes' && m.target) added.push(m.target);
        }
        if (added.length) evaluate(added);
      });
      // Watch the form's container, so a success panel that REPLACES the form
      // is still seen. Falls back to the form itself.
      var scope = formEl.parentNode || formEl;
      observer.observe(scope, {
        childList: true, subtree: true,
        attributes: true, attributeFilter: ['class', 'style', 'hidden', 'aria-hidden']
      });
    } catch (e) {
      stop();
      return;
    }

    timer = setTimeout(stop, SUCCESS_WINDOW_MS);
  }

  function handleSubmit(event) {
    try {
      var formEl = event.target;
      if (!formEl || (formEl.tagName || '').toLowerCase() !== 'form') return;

      // Another handler already cancelled this submission.
      if (event.defaultPrevented) return;

      // Constraint validation gate: an invalid form cannot have submitted.
      try {
        if (typeof formEl.checkValidity === 'function' &&
            formEl.checkValidity() === false) return;
      } catch (e) { /* validation unavailable — fall through */ }

      watch(formEl);
    } catch (e) {
      // Never throw back into the page's own form handling.
    }
  }

  // Bubble phase so the tool's own handlers run first.
  document.addEventListener('submit', handleSubmit, false);
})();
