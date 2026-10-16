/*! Divi Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: divi_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectDiviForms) return;
  window.__ctDetectDiviForms = true;
  window.dataLayer = window.dataLayer || [];
  var reported = typeof WeakSet === 'function' ? new WeakSet() : null;
  function inspect(container) {
    if (!container || !container.querySelector) return;
    var notice;
    try {
      notice = container.querySelector('.et-pb-contact-message.et_pb_success_message');
      if (!notice || container.querySelector('form.et_pb_contact_form') ||
          container.querySelector('.et_pb_contact_error_meesage') ||
          container.querySelector('.et_contact_error')) return;
    } catch (e) { return; }
    if (reported && reported.has(notice)) return;
    if (reported) reported.add(notice);
    var id = container.id || (container.getAttribute && container.getAttribute('data-id')) || '';
    if (!id) return;
    var adapter = window.__ctDiviMethod2Emit;
    if (typeof adapter === 'function' && adapter(container, String(id)) === true) return;
    window.dataLayer.push({ event: 'divi_form_submitted', form_id: String(id) });
  }
  function observe(container) {
    if (!container || container.__ctDiviObserved || typeof MutationObserver === 'undefined') return;
    container.__ctDiviObserved = true;
    new MutationObserver(function () { inspect(container); }).observe(container,
      { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    inspect(container);
  }
  function start() {
    var existing = document.querySelectorAll('.et_pb_contact_form_container');
    for (var i = 0; i < existing.length; i++) observe(existing[i]);
    if (typeof MutationObserver !== 'undefined' && document.documentElement) {
      new MutationObserver(function (records) {
        for (var r = 0; r < records.length; r++) {
          for (var n = 0; n < records[r].addedNodes.length; n++) {
            var node = records[r].addedNodes[n];
            if (node.nodeType !== 1) continue;
            if (node.matches && node.matches('.et_pb_contact_form_container')) observe(node);
            var nested = node.querySelectorAll ? node.querySelectorAll('.et_pb_contact_form_container') : [];
            for (var j = 0; j < nested.length; j++) observe(nested[j]);
          }
        }
      }).observe(document.documentElement, { childList: true, subtree: true });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
