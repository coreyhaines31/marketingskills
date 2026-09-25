/*! Wix Bookings conversion detection (MIT)
 *  Detects: booking made. Pushes dataLayer event: wix_appointment_scheduled
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectWixScheduling) return;
  window.__ctDetectWixScheduling = true;
  window.dataLayer = window.dataLayer || [];

  // The booking CTA's Wix-controlled data-hook (app-level, theme-stable).
  var BOOK_NOW_HOOK = 'booking-details-book-now-cta';
  // The order-confirmation page's Wix-controlled marker (slug-independent).
  var THANKYOU_HOOK = 'ThankYouPageAppDataHook.root';

  // localStorage key for the cross-page marker. Deliberately distinct from
  // the production loader's key so this recipe never collides with it.
  var STASH_KEY = '__cvlyRecipeWixSchedStash';
  // How long a click-marker stays valid. The form→confirmation navigation
  // is immediate for free services; generous to absorb slow networks and
  // (best-effort) a paid service's checkout step.
  var STASH_TTL_MS = 10 * 60 * 1000; // 10 minutes
  // How long, on a given page load, we wait for the confirmation marker to
  // render (Wix boots its widgets asynchronously) before giving up.
  var THANKYOU_WAIT_MS = 12000;

  function now() {
    return Date.now();
  }

  function writeStash(obj) {
    try {
      window.localStorage.setItem(STASH_KEY, JSON.stringify(obj));
    } catch (e) {
      // Private mode / storage disabled — can't bridge the navigation, so
      // the booking simply won't be tracked. Fail quietly.
    }
  }

  function readStash() {
    try {
      var raw = window.localStorage.getItem(STASH_KEY);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      return (obj && typeof obj === 'object') ? obj : null;
    } catch (e) {
      return null;
    }
  }

  function clearStash() {
    try { window.localStorage.removeItem(STASH_KEY); } catch (e) {}
  }

  function isFreshStash(stash) {
    return !!(stash && typeof stash.ts === 'number' && (now() - stash.ts) <= STASH_TTL_MS);
  }

  function fireConversion(bookingId, pageUrl) {
    var payload = {
      event: 'wix_appointment_scheduled',
      booking_page_url: pageUrl || ''
    };
    if (bookingId) payload.booking_id = bookingId;
    window.dataLayer.push(payload);
  }

  // ---- Booking form page: mark the Book Now click ----
  //
  // Simplification vs. the production module: because this recipe never
  // reads or reports form field values, it doesn't need to locate the
  // specific booking-form widget on the page (the source module climbs the
  // DOM to scope a field walk to the correct form) — matching on the
  // Wix-controlled CTA hook alone is enough to know a booking attempt was
  // made.
  function handleClick(event) {
    try {
      var target = event.target;
      if (!target || !target.closest) return;

      var btn = target.closest('[data-hook="' + BOOK_NOW_HOOK + '"]');
      if (!btn) return;

      writeStash({
        // The page where the booking was submitted — the meaningful
        // pageUrl for the conversion (the confirmation page's URL carries
        // only a random booking UUID).
        pageUrl: window.location.pathname,
        ts: now()
      });
    } catch (e) {
      // Never throw back into Wix's own click handling.
    }
  }

  // ---- Confirmation page: fire on the success marker ----

  function isThankYouPage() {
    try {
      return !!document.querySelector('[data-hook="' + THANKYOU_HOOK + '"]');
    } catch (e) {
      return false;
    }
  }

  function extractBookingId() {
    try {
      var m = window.location.pathname.match(
        /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
      );
      return m ? m[0] : null;
    } catch (e) {
      return null;
    }
  }

  function fireFromThankYou() {
    // Consume-first idempotency: the stash is the single source of truth.
    // Clearing it before firing means a second call (observer + immediate
    // check racing) is a no-op.
    var stash = readStash();
    if (!stash) return;
    if (!isFreshStash(stash)) { clearStash(); return; }

    clearStash(); // consume before firing so re-entry can't double-fire

    fireConversion(extractBookingId(), stash.pageUrl);
  }

  // Runs at load on EVERY page. If a fresh booking marker exists and this
  // page is the confirmation page, fire. If the page hasn't rendered the
  // marker yet (Wix boots widgets async), watch for it within a bounded
  // window. On non-confirmation pages the watcher simply times out and
  // disconnects — harmless.
  function maybeFireOnThankYou() {
    var stash = readStash();
    if (!stash) return;
    if (!isFreshStash(stash)) { clearStash(); return; }

    if (isThankYouPage()) { fireFromThankYou(); return; }

    var done = false;
    var observer = null;
    var timer = null;

    function cleanup() {
      done = true;
      if (observer) { try { observer.disconnect(); } catch (e) {} observer = null; }
      if (timer) { clearTimeout(timer); timer = null; }
    }

    function check() {
      if (done) return;
      if (isThankYouPage()) {
        cleanup();
        fireFromThankYou();
      }
    }

    try {
      observer = new MutationObserver(check);
      observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true
      });
    } catch (e) {
      // MutationObserver unavailable — the immediate check above already ran.
    }
    timer = setTimeout(cleanup, THANKYOU_WAIT_MS);
  }

  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('click', handleClick, true); // booking form
    maybeFireOnThankYou();                                  // confirmation page
  }
})();
