/*! Wix Bookings conversion detection (MIT)
 *  Detects: booking made. Pushes dataLayer event: wix_appointment_scheduled
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectWixScheduling) return;
  window.__ctDetectWixScheduling = true;
  window.dataLayer = window.dataLayer || [];

  // Wix Bookings checks out through Wix eCommerce. Once the order exists,
  // the shared Thank You page reports a Purchase through Wix's own site
  // analytics stream (window.wixDevelopersAnalytics). Its line items name
  // the Wix app that sold them, so a booking is an item from Wix Bookings
  // and a Wix Stores order is not. Only the event name, the line items'
  // app IDs and the order ID are read, never the buyer's details.
  var BOOKINGS_APP_ID = '13d21c63-b5ec-5912-8397-c3a5ddb27a97';
  var LISTENER_ID = 'ctRecipeWixScheduling';
  var seen = {};
  var registered = false;

  function isBookingsItem(item) {
    try {
      return !!item && typeof item === 'object' && !!item.catalogReference &&
        item.catalogReference.appId === BOOKINGS_APP_ID;
    } catch (e) {
      return false;
    }
  }

  function orderIdOf(params) {
    var id = params.orderId;
    if (typeof id !== 'string' || !id) id = params.id;
    return typeof id === 'string' && /^[A-Za-z0-9-]{1,64}$/.test(id) ? id : '';
  }

  function onWixEvent(name, params) {
    try {
      if (name !== 'Purchase' || !params || typeof params !== 'object') return;
      var items = params.contents;
      if (!items || typeof items.length !== 'number') return;
      var booking = false;
      for (var i = 0; i < items.length; i++) {
        if (isBookingsItem(items[i])) { booking = true; break; }
      }
      if (!booking) return;
      var orderId = orderIdOf(params);
      if (!orderId || seen[orderId]) return;
      seen[orderId] = true;
      window.dataLayer.push({
        event: 'wix_appointment_scheduled',
        booking_id: orderId
      });
    } catch (e) {
      // Never throw back into Wix's analytics.
    }
  }

  // Wix doesn't replay earlier events to a late listener, so register as
  // soon as the stream exists.
  function register() {
    if (registered) return true;
    var wda = window.wixDevelopersAnalytics;
    if (!wda || typeof wda.register !== 'function') return false;
    try {
      wda.register(LISTENER_ID, onWixEvent);
      registered = true;
    } catch (e) {}
    return registered;
  }

  if (!register()) {
    try { window.addEventListener('wixDevelopersAnalyticsReady', register); } catch (e) {}
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      if (register() || tries > 300) clearInterval(timer);
    }, 100);
  }
})();
