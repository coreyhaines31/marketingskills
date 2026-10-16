/*! Framer Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: framer_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctFramerForms) return;
  window.__ctFramerForms = true;
  window.dataLayer = window.dataLayer || [];
  var listeners = [];
  var pending = [];
  window.__ctFramerSubscribe = function (listener) {
    if (listener && typeof listener === 'object') listeners.push(listener);
  };
  function isFramerForm(form) {
    try {
      if (!form || String(form.tagName || '').toLowerCase() !== 'form') return false;
      if (form.hasAttribute && form.hasAttribute('data-framer-name')) return true;
      if (typeof form.className === 'string' && /(^|\s)framer-[A-Za-z0-9_-]+/.test(form.className)) return true;
      return !!(form.closest && (form.closest('[data-framer-component-type]') || form.closest('[data-framer-name]')));
    } catch (e) { return false; }
  }
  function notify(phase, form, candidate) {
    var handled = false;
    for (var i = 0; i < listeners.length; i++) {
      try {
        var fn = listeners[i] && listeners[i][phase];
        if (typeof fn === 'function' && fn(form, candidate) === true) handled = true;
      } catch (e) {}
    }
    return handled;
  }
  function remember(form) {
    try {
      if (!isFramerForm(form)) return;
      for (var i = 0; i < pending.length; i++) {
        if (pending[i].form === form) return;
      }
      pending.push({ form: form, time: Date.now(), claimed: false });
      notify('beforeAttempt', form, false);
    } catch (e) {}
  }
  function finish(attempts, accepted) {
    for (var i = 0; i < attempts.length; i++) {
      var index = pending.indexOf(attempts[i]);
      if (index !== -1) pending.splice(index, 1);
    }
    if (!accepted) return;
    // Concurrent forms cannot be attributed without inspecting answers.
    // Keep those submissions event-only, with no guessed form name.
    var form = attempts.length === 1 ? attempts[0].form : null;
    var name = form ? form.getAttribute('data-framer-name') || form.id || '' : '';
    if (!form || !notify('onCandidate', form, true)) {
      window.dataLayer.push({ event: 'framer_form_submitted', form_name: name });
    }
  }
  if (typeof window.fetch === 'function') {
    var originalFetch = window.fetch;
    window.fetch = function (input, options) {
      var attempts = null;
      try {
        var url = typeof input === 'string' ? input : input && input.url;
        var method = options && options.method || input && input.method || 'GET';
        if (String(method).toUpperCase() === 'POST' && /^https:\/\/api\.framer\.com\/forms\/v1\/forms\/[a-f0-9-]+\/submit(?:\?.*)?$/.test(url || '')) {
          attempts = [];
          var now = Date.now();
          pending = pending.filter(function (attempt) { return now - attempt.time < 60000; });
          for (var i = 0; i < pending.length; i++) {
            if (!pending[i].claimed) {
              pending[i].claimed = true;
              attempts.push(pending[i]);
            }
          }
        }
      } catch (e) {}
      var result = originalFetch.apply(this, arguments);
      if (attempts) result.then(function (response) {
        try { finish(attempts, response.ok === true); } catch (e) {}
      }, function () {
        try { finish(attempts, false); } catch (e) {}
      });
      return result;
    };
  }
  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('submit', function (event) { remember(event.target); }, true);
    // Framer handles Enter directly instead of dispatching native submit.
    document.addEventListener('keydown', function (event) {
      var target = event.target;
      if (event.key === 'Enter' && target && String(target.tagName).toLowerCase() !== 'textarea') {
        var form = target.form;
        if (isFramerForm(form) && form.matches(':valid')) remember(form);
      }
    }, true);
  }
})();
