/*! Gravity Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: gravity_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectGravityForms) return;
  window.__ctDetectGravityForms = true;
  window.dataLayer = window.dataLayer || [];

  // Dedup between the two fire paths. On a normal setup BOTH paths see the
  // same submission (the jQuery event fires first, the MutationObserver a few
  // milliseconds later — live-verified), and the two report the form id with
  // different types (number vs string), so we dedup on time, not on id: any
  // fire within 3s of the last one is the same submission. A genuine second
  // submission can't complete inside 3s (it needs a refill plus a server
  // round trip).
  var lastFiredAt = 0;
  var DEDUP_WINDOW_MS = 3000;

  function fireConversion(formId) {
    var now = Date.now();
    if (now - lastFiredAt < DEDUP_WINDOW_MS) return;
    lastFiredAt = now;
    window.dataLayer.push({
      event: 'gravity_form_submitted',
      form_id: String(formId || '')
    });
  }

  // Fire path 1 — GF's own jQuery event, fired on `document` after an AJAX
  // submission's confirmation renders. Covers every GF version that ships
  // jQuery on window.
  function hookConfirmationEvent() {
    if (typeof window.jQuery === 'undefined') return false;
    window.jQuery(document).on('gform_confirmation_loaded', function (event, formId) {
      fireConversion(formId);
    });
    return true;
  }

  // Fire path 2 — MutationObserver fallback for setups where window.jQuery
  // isn't reachable. GF replaces the form wrapper with a
  // .gform_confirmation_message element on AJAX success; the form id is
  // encoded in its id attribute (gform_confirmation_message_5).
  function checkNode(node) {
    if (!node || node.nodeType !== 1) return;
    var conf = null;
    if (node.classList && node.classList.contains('gform_confirmation_message')) {
      conf = node;
    } else if (node.querySelector) {
      conf = node.querySelector('.gform_confirmation_message, [id^="gform_confirmation_message_"]');
    }
    if (!conf) return;
    var m = /gform_confirmation_message_(\d+)/.exec(conf.id || '');
    fireConversion(m ? m[1] : '');
  }

  function observeConfirmations() {
    if (typeof MutationObserver === 'undefined') return;
    var observer = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        if (!added) continue;
        for (var j = 0; j < added.length; j++) checkNode(added[j]);
      }
    });
    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  if (!hookConfirmationEvent()) {
    window.addEventListener('load', hookConfirmationEvent);
  }
  observeConfirmations();
})();
