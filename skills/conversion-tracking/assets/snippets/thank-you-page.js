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

  // The browser already knows whether this page load is a refresh or a
  // back/forward return rather than a fresh arrival. Navigation Timing
  // reports it; older WebKit only has the Level 1 field.
  function isRepeatPageLoad() {
    try {
      var perf = window.performance;
      if (!perf) return false;
      var entries = typeof perf.getEntriesByType === 'function' ?
        perf.getEntriesByType('navigation') : null;
      if (entries && entries.length && entries[0].type) {
        return entries[0].type === 'reload' || entries[0].type === 'back_forward';
      }
      if (perf.navigation) {
        return perf.navigation.type === 1 || perf.navigation.type === 2;
      }
    } catch (e) { /* fall through */ }
    return false;
  }

  function matches(path) {
    var p = String(path || '').toLowerCase();
    for (var i = 0; i < THANK_YOU_PATHS.length; i++) {
      var want = String(THANK_YOU_PATHS[i] || '').toLowerCase();
      if (want && p.indexOf(want) === 0) return want;
    }
    return null;
  }

  function check(pageLoad) {
    try {
      var path = window.location.pathname;
      var matched = matches(path);
      if (!matched) return;

      // Keyed on the full path so two different confirmations still both
      // count. Within one page lifetime (a single-page app changing routes)
      // this object is the guard. It starts over on every page load, so a
      // refresh or a back-button return to the confirmation page would count
      // a second conversion for the same lead; the browser's navigation type
      // tells those apart from a new arrival.
      if (!COUNT_EVERY_VIEW && fired[path]) return;
      fired[path] = true;
      if (!COUNT_EVERY_VIEW && pageLoad === true && isRepeatPageLoad()) return;

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
    document.addEventListener('DOMContentLoaded', function () { check(true); });
  } else {
    check(true);
  }
})();
