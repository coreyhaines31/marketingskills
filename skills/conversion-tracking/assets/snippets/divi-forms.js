/*! Divi Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: divi_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectDiviForms) return;
  window.__ctDetectDiviForms = true;
  window.dataLayer = window.dataLayer || [];

  // Real id if the container has one, else a synthetic per-page-load key
  // stamped onto it — ported directly from the production module's
  // getFormKey helper, so multiple Divi forms on one page stay distinct.
  var keyCounter = 0;

  function getFormKey(container) {
    if (!container) return '';
    if (container.id) return container.id;
    var key = container.getAttribute('data-ct-key');
    if (!key) {
      keyCounter++;
      key = 'divi-' + keyCounter;
      container.setAttribute('data-ct-key', key);
    }
    return key;
  }

  function fireConversion(formId) {
    window.dataLayer.push({
      event: 'divi_form_submitted',
      form_id: formId || ''
    });
  }

  // Divi renders BOTH validation errors and the success notice into
  // .et-pb-contact-message — the element itself carries no success/error
  // marker. Errors mark the offending inputs with .et_contact_error and
  // wrap the message text in .et_pb_contact_error_text. Only fire when
  // the message has text and no error markers are present.
  function maybeReportSuccess(container) {
    if (!container || !container.querySelector) return;

    var msg = container.querySelector('.et-pb-contact-message');
    if (!msg) return;

    var text = (msg.textContent || '').trim();
    if (!text) return;

    try {
      if (msg.querySelector('.et_pb_contact_error_text')) return;
      if (container.querySelector('.et_contact_error')) return;
    } catch (e) {
      // Can't tell success from error — do not fire
      return;
    }

    // Permanent stamp: long-tail mutations of the container (other
    // plugins, widgets) must not re-report a message that already fired
    if (msg.getAttribute('data-ct-reported') === 'true') return;
    msg.setAttribute('data-ct-reported', 'true');

    fireConversion(getFormKey(container));
  }

  function observeContainer(container) {
    if (typeof MutationObserver === 'undefined') return;
    if (!container || !container.getAttribute) return;
    if (container.getAttribute('data-ct-observed') === 'true') return;
    container.setAttribute('data-ct-observed', 'true');

    var observer = new MutationObserver(function () {
      maybeReportSuccess(container);
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  function startMutationObserver() {
    if (typeof MutationObserver === 'undefined') return;

    var containers = document.querySelectorAll('.et_pb_contact_form_container');
    for (var c = 0; c < containers.length; c++) {
      observeContainer(containers[c]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      startMutationObserver();
    });
  } else {
    startMutationObserver();
  }

  // Also rescan after window load in case Divi loads forms late
  // (observeContainer is idempotent per container)
  window.addEventListener('load', function () {
    startMutationObserver();
  });
})();
