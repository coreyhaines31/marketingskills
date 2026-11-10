/*! Acuity Scheduling conversion detection (MIT)
 *  Detects: meeting booked. Pushes dataLayer event: acuity_appointment_scheduled
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  'use strict';
  if (window.__ctDetectAcuity) return;
  window.__ctDetectAcuity = true;
  window.dataLayer = window.dataLayer || [];

  // Acuity's booking form gives the page no booking event of its own. This
  // listener pairs with a short snippet the site owner pastes into Acuity's
  // custom conversion tracking field (the field snippet that comes with this
  // listener). Acuity runs that snippet after each booking inside its
  // conversion tracking frame, on
  // https://conversion-tracking-sandbox.acuityinnovation.com, two frames below
  // this page, and it posts the booking's ID to this page only (it names the
  // page's own address as the target). The frame is a grandchild, so it can't
  // be matched to an iframe on the page; it must come from Acuity's origin and
  // sit inside this page's own frame tree.
  var ORIGIN_PATTERN = /^https:\/\/([a-z0-9-]+\.)+acuityinnovation\.com$/;
  var ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
  var KIND_PATTERN = /^[A-Za-z_-]{1,32}$/;
  var PRICE_PATTERN = /^[0-9]{1,9}(\.[0-9]{1,4})?$/;
  var seenIds = [];

  function isPlainObject(value) {
    return !!value && typeof value === 'object' && Object.prototype.toString.call(value) === '[object Object]';
  }

  // A frame inside this page has this page as its top window. A popup or a
  // window this page opened does not.
  function insideThisPage(source) {
    try { return source.top === window; } catch (e) { return false; }
  }

  function idSeen(id) {
    for (var i = 0; i < seenIds.length; i++) if (seenIds[i] === id) return true;
    return false;
  }

  function cleanText(value, max) {
    if (typeof value !== 'string') return '';
    value = value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/^\s+|\s+$/g, '');
    return value.length > max ? value.slice(0, max) : value;
  }

  function onMessage(message) {
    if (!message || !message.source || message.source === window) return;
    if (typeof message.origin !== 'string' || !ORIGIN_PATTERN.test(message.origin)) return;
    if (!insideThisPage(message.source)) return;
    var data = message.data;
    if (!isPlainObject(data) || data.source !== 'gtm-acuity-booking' || data.version !== 1) return;
    if (typeof data.appointment_id !== 'string' || !ID_PATTERN.test(data.appointment_id)) return;
    if (idSeen(data.appointment_id)) return;
    var push = { event: 'acuity_appointment_scheduled', appointment_id: data.appointment_id };
    if (typeof data.kind === 'string' && KIND_PATTERN.test(data.kind)) push.acuity_type = data.kind;
    var type = cleanText(data.appointment_type, 200);
    if (type) push.appointment_type = type;
    if (typeof data.price === 'string' && PRICE_PATTERN.test(data.price)) push.price = data.price;
    // The ID is remembered only once the push went through, so a dataLayer
    // that throws (a broken wrapper) never escapes into the page, and a
    // repeat of the same message can still be counted.
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(push);
    } catch (e) {
      return;
    }
    seenIds.push(data.appointment_id);
  }

  window.addEventListener('message', onMessage, false);
})();
