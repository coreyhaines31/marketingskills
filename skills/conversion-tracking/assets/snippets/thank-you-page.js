/*! Thank-you page conversion detection (MIT)
 *  Detects: arrival on a confirmation page. Pushes dataLayer event: thank_you_page_view
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectThankYouPage) return;
  window.__ctDetectThankYouPage = true;
  window.dataLayer = window.dataLayer || [];

  /* ---------------------------------------------------------------
     EDIT THIS. Paths that mean "the conversion happened".
     Matched against location.pathname, case-insensitively, as a
     prefix. '/thank-you' matches '/thank-you' and '/thank-you/order/9'.
     --------------------------------------------------------------- */
  var THANK_YOU_PATHS = [
    '/thank-you',
    '/thanks',
    '/confirmation',
    '/success'
  ];

  // Set true only if your confirmation page is genuinely reachable more than
  // once per conversion and you want every view counted. Leave false.
  var COUNT_EVERY_VIEW = false;

  var fired = {};

  function matches(path) {
    var p = String(path || '').toLowerCase();
    for (var i = 0; i < THANK_YOU_PATHS.length; i++) {
      var want = String(THANK_YOU_PATHS[i] || '').toLowerCase();
      if (want && p.indexOf(want) === 0) return want;
    }
    return null;
  }

  function check() {
    try {
      var path = window.location.pathname;
      var matched = matches(path);
      if (!matched) return;

      // A refresh or a back-button return to the confirmation page would
      // otherwise count a second conversion for the same lead. Keyed on the
      // full path so two different confirmations still both count.
      if (!COUNT_EVERY_VIEW && fired[path]) return;
      fired[path] = true;

      window.dataLayer.push({
        event: 'thank_you_page_view',
        page_path: path,
        matched_rule: matched
      });
    } catch (e) {
      // Never throw back into the page.
    }
  }

  // Single-page apps are the reason this is not just a one-shot call. A
  // React, Vue or Next site changes the URL without a page load, so no
  // pageview ever fires and a thank-you page TRIGGER silently counts zero.
  // Wrapping history means we see those route changes too.
  function wrapHistory(method) {
    var original = window.history[method];
    if (typeof original !== 'function') return;
    window.history[method] = function () {
      var result = original.apply(this, arguments);
      try { setTimeout(check, 0); } catch (e) { /* ignore */ }
      return result;
    };
  }

  try {
    wrapHistory('pushState');
    wrapHistory('replaceState');
    window.addEventListener('popstate', function () { setTimeout(check, 0); });
  } catch (e) {
    // History API unavailable — the initial check below still runs.
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', check);
  } else {
    check();
  }
})();
