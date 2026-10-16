/*! Cal.com conversion detection (MIT)
 *  Detects: meeting booked. Pushes dataLayer event: calcom_booking_successful
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  'use strict';
  if (window.__ctDetectCalcom) return;
  window.__ctDetectCalcom = true;
  window.dataLayer = window.dataLayer || [];

  // Cal.com's embed code (inline, popup and floating button) renders an iframe
  // from https://app.cal.com; a booking page pasted in as a plain iframe loads
  // from https://cal.com. Each posts from its own origin, so a frame is only
  // trusted for the origin its address starts with. The CSS selectors do that
  // prefix match so this listener never reads an iframe's address, because
  // Cal.com prefill parameters can carry a name or email.
  var CAL_FRAMES = [
    { selector: 'iframe[src^="https://app.cal.com/"]', origin: 'https://app.cal.com' },
    { selector: 'iframe[src^="https://cal.com/"]', origin: 'https://cal.com' }
  ];
  var UID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;
  var STATUS_PATTERN = /^[A-Z_]{1,32}$/;
  var trackedFrames = [];
  var seenUids = [];

  function trackFrame(frame, origin) {
    if (!frame || !frame.contentWindow) return;
    for (var i = 0; i < trackedFrames.length; i++) {
      if (trackedFrames[i].frame === frame) {
        trackedFrames[i].origin = origin;
        return;
      }
    }
    trackedFrames.push({ frame: frame, origin: origin });
  }

  function scan(root) {
    if (!root || typeof root.querySelectorAll !== 'function') return;
    for (var k = 0; k < CAL_FRAMES.length; k++) {
      var frames;
      try { frames = root.querySelectorAll(CAL_FRAMES[k].selector); } catch (e) { continue; }
      for (var i = 0; i < frames.length; i++) trackFrame(frames[i], CAL_FRAMES[k].origin);
    }
  }

  // The message must come from a Cal.com frame that is on this page right now,
  // and from the origin that frame was loaded from. Cal.com re-creates popup
  // frames, so a frame seen earlier is re-checked live.
  function sourceIsTracked(message) {
    for (var i = 0; i < trackedFrames.length; i++) {
      var item = trackedFrames[i];
      try {
        if (item.frame.isConnected === true && item.frame.contentWindow === message.source && item.origin === message.origin) return true;
      } catch (e) { /* replaced or inaccessible frames fail closed */ }
    }
    return false;
  }

  function isCalOrigin(origin) {
    for (var k = 0; k < CAL_FRAMES.length; k++) if (CAL_FRAMES[k].origin === origin) return true;
    return false;
  }

  function isPlainObject(value) {
    return !!value && typeof value === 'object' && Object.prototype.toString.call(value) === '[object Object]';
  }

  function uidSeen(uid) {
    for (var i = 0; i < seenUids.length; i++) if (seenUids[i] === uid) return true;
    return false;
  }

  function onMessage(message) {
    if (!message || !message.source || message.source === window) return;
    if (!isCalOrigin(message.origin)) return;
    // A frame added since the last scan (a popup that just opened) is picked up here.
    if (!sourceIsTracked(message)) {
      scan(document);
      if (!sourceIsTracked(message)) return;
    }
    var data = message.data;
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch (e) { return; }
    }
    // Only a completed new booking. Reschedules (rescheduleBookingSuccessfulV2)
    // and the deprecated V1 events, which carry the attendee's details, never match.
    if (!isPlainObject(data) || data.originator !== 'CAL' || data.type !== 'bookingSuccessfulV2') return;
    var booking = data.data;
    if (!isPlainObject(booking) || typeof booking.uid !== 'string' || !UID_PATTERN.test(booking.uid)) return;
    if (uidSeen(booking.uid)) return;
    // Only these three values are copied. The booking title names the attendee,
    // so it and every other field are left behind.
    var push = { event: 'calcom_booking_successful', booking_uid: booking.uid };
    if (typeof booking.eventTypeId === 'number' && isFinite(booking.eventTypeId)) push.event_type_id = String(booking.eventTypeId);
    if (typeof booking.status === 'string' && STATUS_PATTERN.test(booking.status)) push.booking_status = booking.status;
    // The ID is remembered only once the push went through, so a dataLayer
    // that throws (a broken wrapper) never escapes into the page, and a
    // repeat of the same message can still be counted.
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(push);
    } catch (e) {
      return;
    }
    seenUids.push(booking.uid);
  }

  function start() {
    if (typeof document === 'undefined') return;
    scan(document);
    if (typeof MutationObserver === 'undefined' || !document.documentElement) return;
    try {
      var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var added = mutations[i].addedNodes || [];
          for (var j = 0; j < added.length; j++) {
            var node = added[j];
            if (node && node.tagName === 'IFRAME') scan(document);
            else scan(node);
          }
          if (mutations[i].type === 'attributes' && mutations[i].attributeName === 'src') scan(document);
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
    } catch (e) {}
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, false);
    else start();
  }
  window.addEventListener('message', onMessage, false);
})();
