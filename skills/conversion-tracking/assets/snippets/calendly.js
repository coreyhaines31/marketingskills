/*! Calendly conversion detection (MIT)
 *  Detects: meeting booked. Pushes dataLayer event: calendly_event_scheduled
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  'use strict';
  if (window.__ctDetectCalendly) return;
  window.__ctDetectCalendly = true;
  window.dataLayer = window.dataLayer || [];

  // The CSS selector matches only Calendly's documented exact embed host.
  // Do not read iframe.src or its `src` attribute: prefill parameters can
  // contain invitee PII. The selector engine performs the prefix match without
  // exposing the URL value to this listener.
  var CALENDLY_FRAME_SELECTOR = 'iframe[src^=\"https://calendly.com/\"]';
  var CALENDLY_ORIGIN = 'https://calendly.com';
  var API_HOSTS = { 'api.calendly.com': true, 'calendly.com': true };
  var trackedFrames = [];
  var seenPairs = [];

  function trackFrame(frame) {
    if (!frame || !frame.contentWindow) return;
    for (var i = 0; i < trackedFrames.length; i++) {
      if (trackedFrames[i].frame === frame) {
        trackedFrames[i].source = frame.contentWindow;
        trackedFrames[i].origin = CALENDLY_ORIGIN;
        return;
      }
    }
    trackedFrames.push({ frame: frame, source: frame.contentWindow, origin: CALENDLY_ORIGIN });
  }

  function scan(root) {
    if (!root || typeof root.querySelectorAll !== 'function') return;
    var frames;
    try { frames = root.querySelectorAll(CALENDLY_FRAME_SELECTOR); } catch (e) { return; }
    for (var i = 0; i < frames.length; i++) trackFrame(frames[i]);
  }

  function sourceIsTracked(event) {
    for (var i = 0; i < trackedFrames.length; i++) {
      var item = trackedFrames[i];
      try {
        if (item.frame.isConnected === true && item.frame.contentWindow === event.source && item.source === event.source && item.origin === event.origin) return true;
      } catch (e) { /* replaced or inaccessible frames fail closed */ }
    }
    return false;
  }

  function resourceIdentity(value, kind) {
    if (typeof value !== 'string' || /[?#]/.test(value)) return null;
    try {
      var url = new URL(value);
      if (url.protocol !== 'https:' || url.port || !API_HOSTS[url.hostname]) return null;
      var eventMatch = /(?:^|\/)scheduled_events\/([A-Za-z0-9_-]{1,128})\/?$/.exec(url.pathname);
      var inviteeMatch = /(?:^|\/)scheduled_events\/([A-Za-z0-9_-]{1,128})\/invitees\/([A-Za-z0-9_-]{1,128})\/?$/.exec(url.pathname);
      if (kind === 'event' && eventMatch) return { eventId: eventMatch[1].toLowerCase() };
      if (kind === 'invitee' && inviteeMatch) return { eventId: inviteeMatch[1].toLowerCase(), inviteeId: inviteeMatch[2].toLowerCase() };
    } catch (e) { return null; }
    return null;
  }

  function pairSeen(eventId, inviteeId) {
    var key = eventId + ':' + inviteeId;
    for (var i = 0; i < seenPairs.length; i++) if (seenPairs[i] === key) return true;
    seenPairs.push(key);
    return false;
  }

  function onMessage(message) {
    if (!message || !message.source || message.source === window || !sourceIsTracked(message)) return;
    var data = message.data;
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch (e) { return; }
    }
    if (!data || typeof data !== 'object' || data.event !== 'calendly.event_scheduled') return;
    var payload = data.payload || {};
    var eventUri = payload.event && payload.event.uri;
    var inviteeUri = payload.invitee && payload.invitee.uri;
    var eventIdentity = resourceIdentity(eventUri, 'event');
    var inviteeIdentity = resourceIdentity(inviteeUri, 'invitee');
    if (!eventIdentity || !inviteeIdentity || eventIdentity.eventId !== inviteeIdentity.eventId) return;
    if (pairSeen(eventIdentity.eventId, inviteeIdentity.inviteeId)) return;
    window.dataLayer.push({ event: 'calendly_event_scheduled', event_uri: eventUri, invitee_uri: inviteeUri });
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
