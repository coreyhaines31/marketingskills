/*! Ninja Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: ninja_forms_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectNinjaForms) return;
  window.__ctDetectNinjaForms = true;
  window.dataLayer = window.dataLayer || [];

  function fireConversion(formId) {
    window.dataLayer.push({
      event: 'ninja_forms_submitted',
      form_id: formId || ''
    });
  }

  function responseHasErrors(response) {
    if (!response || !response.errors) return false;
    var errors = response.errors;
    if (typeof errors.length === 'number') return errors.length > 0;
    if (typeof errors !== 'object') return !!errors;
    for (var key in errors) {
      if (!Object.prototype.hasOwnProperty.call(errors, key)) continue;
      var group = errors[key];
      if (!group) continue;
      if (typeof group.length === 'number') {
        if (group.length > 0) return true;
      } else if (typeof group === 'object') {
        for (var sub in group) {
          if (Object.prototype.hasOwnProperty.call(group, sub)) return true;
        }
      } else {
        return true;
      }
    }
    return false;
  }

  function handleSubmitResponse(response) {
    if (responseHasErrors(response)) return;
    var formId = (response && response.data && response.data.form_id) ? response.data.form_id : '';
    fireConversion(formId);
  }

  var radioHooked = false;

  function hookNfRadio() {
    if (radioHooked) return true;

    if (typeof nfRadio !== 'undefined' && nfRadio.channel) {
      try {
        nfRadio.channel('forms').on('submit:response', handleSubmitResponse);
        radioHooked = true;
        return true;
      } catch (e) {
      }
    }

    if (typeof Backbone !== 'undefined' && Backbone.Radio) {
      try {
        Backbone.Radio.channel('forms').on('submit:response', handleSubmitResponse);
        radioHooked = true;
        return true;
      } catch (e) {
      }
    }

    return false;
  }

  var observerStarted = false;

  function startMutationObserver() {
    if (observerStarted) return;
    if (typeof MutationObserver === 'undefined') return;

    var containers = document.querySelectorAll('.nf-form-cont');
    if (containers.length === 0) return;

    observerStarted = true;

    for (var c = 0; c < containers.length; c++) {
      (function (container) {
        var observer = new MutationObserver(function (mutations) {
          for (var m = 0; m < mutations.length; m++) {
            var addedNodes = mutations[m].addedNodes;
            for (var n = 0; n < addedNodes.length; n++) {
              var node = addedNodes[n];
              if (!node || node.nodeType !== 1) continue;

              var isResponseMsg = false;
              if (node.classList && node.classList.contains('nf-response-msg')) {
                isResponseMsg = true;
              } else if (node.querySelector) {
                isResponseMsg = !!node.querySelector('.nf-response-msg');
              }

              if (isResponseMsg) fireConversion('');
            }
          }
        });

        observer.observe(container, { childList: true, subtree: true });
      })(containers[c]);
    }
  }

  var hooked = hookNfRadio();
  if (!hooked) {
    document.addEventListener('DOMContentLoaded', function () {
      var retryHooked = hookNfRadio();
      if (!retryHooked) startMutationObserver();
    });
    window.addEventListener('load', function () {
      if (!radioHooked) hookNfRadio();
      if (!observerStarted && !radioHooked) startMutationObserver();
    });
  }
})();
