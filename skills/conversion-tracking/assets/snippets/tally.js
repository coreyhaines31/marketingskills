/*! Tally conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: tally_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
/* Tally Submission Listener. Reads only the envelope of Tally's
 * own submission message; it does not decode or read answer values and never
 * pushes answers. */
(function () {
  'use strict';
  if (window.__ctDetectTally || window.__ctTallyMethod2Installed) return;
  window.__ctDetectTally = true;
  // Keep the historical Method 2 marker as a one-way compatibility alias.
  // The separate Method 2 adapter has its own marker and can still register
  // after this core is already installed.
  window.__ctTallyMethod2Installed = true;
  window.dataLayer = window.dataLayer || [];

  function isWs(c) { return c === ' ' || c === '\n' || c === '\r' || c === '\t'; }
  function skipWs(s, p) { while (p.i < s.length && isWs(s.charAt(p.i))) p.i++; }
  function stringEnd(s, p, decode) {
    if (s.charAt(p.i) !== '"') throw new Error('string');
    var start = p.i++;
    while (p.i < s.length) {
      var c = s.charAt(p.i++);
      if (c === '"') {
        if (!decode) return null;
        // Decode only object keys and allowlisted envelope metadata strings.
        return JSON.parse(s.slice(start, p.i));
      }
      if (c.charCodeAt(0) < 0x20) throw new Error('control');
      if (c === '\\') {
        if (p.i >= s.length) throw new Error('escape end');
        var esc = s.charAt(p.i++);
        if ('"\\/bfnrt'.indexOf(esc) !== -1) continue;
        if (esc !== 'u' || !/^[0-9a-fA-F]{4}$/.test(s.slice(p.i, p.i + 4))) throw new Error('escape');
        p.i += 4;
      }
    }
    throw new Error('unterminated');
  }
  function skipValue(s, p, depth) {
    if (depth > 32) throw new Error('depth');
    skipWs(s, p);
    var c = s.charAt(p.i);
    if (c === '"') { stringEnd(s, p, false); return; }
    if (c === '{') {
      p.i++; skipWs(s, p); if (s.charAt(p.i) === '}') { p.i++; return; }
      while (p.i < s.length) {
        skipWs(s, p); stringEnd(s, p, false); skipWs(s, p);
        if (s.charAt(p.i++) !== ':') throw new Error('colon');
        skipValue(s, p, depth + 1); skipWs(s, p);
        var sep = s.charAt(p.i++); if (sep === '}') return; if (sep !== ',') throw new Error('object');
      }
      throw new Error('object end');
    }
    if (c === '[') {
      p.i++; skipWs(s, p); if (s.charAt(p.i) === ']') { p.i++; return; }
      while (p.i < s.length) {
        skipValue(s, p, depth + 1); skipWs(s, p);
        var a = s.charAt(p.i++); if (a === ']') return; if (a !== ',') throw new Error('array');
      }
      throw new Error('array end');
    }
    var begin = p.i;
    while (p.i < s.length && !isWs(s.charAt(p.i)) && ',}]'.indexOf(s.charAt(p.i)) === -1) p.i++;
    if (p.i === begin) throw new Error('value');
    var token = s.slice(begin, p.i);
    if (token !== 'true' && token !== 'false' && token !== 'null' &&
        !/^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?$/.test(token)) throw new Error('primitive');
  }
  function readStringValue(s, p) { skipWs(s, p); return stringEnd(s, p, true); }
  function readMetadataObject(s, p, wanted, out) {
    skipWs(s, p); if (s.charAt(p.i++) !== '{') throw new Error('metadata object');
    skipWs(s, p); if (s.charAt(p.i) === '}') { p.i++; return; }
    while (p.i < s.length) {
      skipWs(s, p); var key = stringEnd(s, p, true); skipWs(s, p);
      if (s.charAt(p.i++) !== ':') throw new Error('metadata colon');
      if (wanted[key]) { out[key] = readStringValue(s, p); }
      else if (key === 'fields') { skipWs(s, p); if (s.charAt(p.i) !== '[') throw new Error('fields shape'); skipValue(s, p, 0); out.fieldsArray = true; }
      else skipValue(s, p, 0);
      skipWs(s, p); var sep = s.charAt(p.i++); if (sep === '}') return; if (sep !== ',') throw new Error('metadata separator');
    }
    throw new Error('metadata end');
  }
  function readEnvelope(s) {
    if (typeof s !== 'string' || s.length > 1048576) return null;
    var p = { i: 0 }, out = {}, payload = {};
    try {
      skipWs(s, p); if (s.charAt(p.i++) !== '{') return null;
      skipWs(s, p); if (s.charAt(p.i) === '}') return null;
      while (p.i < s.length) {
        skipWs(s, p); var key = stringEnd(s, p, true); skipWs(s, p);
        if (s.charAt(p.i++) !== ':') return null;
        if (key === 'event') out.event = readStringValue(s, p);
        else if (key === 'payload') readMetadataObject(s, p, { id: true, formId: true }, payload);
        else skipValue(s, p, 0);
        skipWs(s, p); var sep = s.charAt(p.i++); if (sep === '}') break; if (sep !== ',') return null;
      }
      skipWs(s, p); if (p.i !== s.length) return null;
      if (out.event !== 'Tally.FormSubmitted') return null;
      if (!payload.id || !payload.formId || !payload.fieldsArray || !/^[-A-Za-z0-9_]{1,128}$/.test(payload.id) || !/^[-A-Za-z0-9_]{1,128}$/.test(payload.formId)) return null;
      return { id: payload.id, formId: payload.formId };
    } catch (e) { return null; }
  }
  function isTallyOrigin(origin) {
    return typeof origin === 'string' && /^https:\/\/tally\.so(?::443)?$/i.test(origin);
  }
  // Bind only fixed-host iframe paths using CSS attribute selectors. Do not
  // retrieve src or data-tally-src: either may contain prefilled respondent
  // data in its query. Only a materialized iframe src is supported here; a
  // deferred attribute without a loaded src fails closed.
  function frameFormId(frame, expectedFormId) {
    if (!/^[-A-Za-z0-9_]{1,128}$/.test(expectedFormId || '') ||
        !frame || typeof frame.matches !== 'function') return '';
    var found = false;
    var modes = ['embed', 'r', 'popup'];
    for (var i = 0; i < modes.length; i++) {
      var base = 'https://tally.so/' + modes[i] + '/' + expectedFormId;
      var selectors = [
        'iframe[src="' + base + '"]',
        'iframe[src^="' + base + '?"]',
        'iframe[src^="' + base + '#"]'
      ];
      for (var j = 0; j < selectors.length; j++) {
        try { if (frame.matches(selectors[j])) { found = true; break; } }
        catch (e) { return ''; }
      }
      if (found) return expectedFormId;
    }
    return '';
  }
  function renderedFrameFormId(source, expectedFormId) {
    if (!source || source === window) return '';
    var frames;
    try { frames = document.getElementsByTagName('iframe'); } catch (e) { return ''; }
    for (var i = 0; frames && i < frames.length; i++) {
      try {
        if (frames[i].contentWindow === source) {
          // The event carries only a bounded public form ID. The selector tests
          // the fixed-host path and exact delimiter without exposing the URL.
          return frameFormId(frames[i], expectedFormId);
        }
      } catch (e) {}
    }
    return '';
  }
  var seen = Object.create(null);
  window.addEventListener('message', function (event) {
    try {
      if (!event || !isTallyOrigin(event.origin)) return;
      var verdict = readEnvelope(event.data);
      if (!verdict) return;
      var configuredFormId = renderedFrameFormId(event.source, verdict.formId);
      if (!configuredFormId || verdict.formId !== configuredFormId) return;
      var key = verdict.formId + ':' + verdict.id;
      if (seen[key]) return;
      seen[key] = true;
      var handled = false;
      var adapter = window.__ctTallyMethod2Handler;
      if (typeof adapter === 'function') {
        try { handled = adapter(event, verdict) === true; } catch (e) { handled = false; }
      }
      if (!handled) window.dataLayer.push({ event: 'tally_form_submitted', form_id: verdict.formId, submission_id: verdict.id });
    } catch (e) {}
  }, false);
})();
