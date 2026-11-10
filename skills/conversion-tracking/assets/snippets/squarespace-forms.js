/*! Squarespace Forms conversion detection (MIT)
 *  Detects: form submission. Pushes dataLayer event: squarespace_form_submitted
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  'use strict';
  // Install once, even if GTM injects this tag more than once on the page.
  if (window.__ctDetectSquarespaceForms) return;
  window.__ctDetectSquarespaceForms = true;
  window.dataLayer = window.dataLayer || [];

  // Ported from a production module (cdn/v1/modules/
  // squarespace-forms.js, measured against a live Squarespace 7.1 site in
  // October 2026). Event only: it never reads what the visitor typed.
  //
  // What Squarespace does:
  // - The Form block renders a React form in the page (no iframe):
  //   .sqs-block-form ... form.react-form-contents[novalidate]. It mounts
  //   after DOMContentLoaded, so submits are caught on document.
  // - There is no check in the browser. Every submit posts
  //   /api/form/FormSubmissionKey then /api/form/SaveFormSubmission, and the
  //   server decides: 204 on success, 400 for a field error, 401 for a failed
  //   reCAPTCHA. A submit is never a conversion on its own.
  // - On success it marks the form (react-form-contents--submitted), shows a
  //   .form-submission-text message and gives the button the class
  //   "success". A form set to redirect leaves for its page about 1.3
  //   seconds after the 204, before that message renders in Chromium.
  // - The Newsletter block posts to the same SaveFormSubmission address, and
  //   that request carries no form identity, so a save only counts for a
  //   form that provably owns it.
  //
  // It fires once per form, on the first confirmed success for an attempt:
  //   1. a success marker that was not there when the attempt started, or
  //   2. the SaveFormSubmission request answering 2xx (read from the
  //      browser's resource timing, where it exposes responseStatus), when
  //      no other form's submit could own that save, or
  //   3. as the page leaves (a redirect form), either of the above.
  // It never fires on a 400 or 401, on a filled anti-spam field, or when it
  // cannot tell which form a save belongs to.

  var EVENT_NAME = 'squarespace_form_submitted';
  var BLOCK_SELECTOR = '.sqs-block-form, [data-sqsp-block="form"], [data-definition-name="website.components.form"]';
  var SAVE_PATH = '/api/form/SaveFormSubmission';
  // Long enough for a visitor to solve a reCAPTCHA picture challenge.
  var WATCH_MS = 180000;

  function now() {
    try {
      if (window.performance && typeof window.performance.now === 'function') return window.performance.now();
    } catch (e) {}
    return 0;
  }

  function hasToken(el, token) {
    if (!el || !el.getAttribute) return false;
    var cls = el.getAttribute('class') || '';
    return (' ' + cls + ' ').indexOf(' ' + token + ' ') !== -1;
  }

  function isConnected(el) {
    try {
      if (typeof el.isConnected === 'boolean') return el.isConnected;
      return !!(el.ownerDocument && el.ownerDocument.documentElement.contains(el));
    } catch (e) {
      return false;
    }
  }

  // ---- Which forms are Squarespace forms ----

  function blockFor(formEl) {
    try {
      return (formEl && formEl.closest) ? formEl.closest(BLOCK_SELECTOR) : null;
    } catch (e) {
      return null;
    }
  }

  function isSquarespaceForm(formEl) {
    if (!formEl || (formEl.tagName || '').toLowerCase() !== 'form') return false;
    return !!blockFor(formEl);
  }

  // The block's own form definition (the site owner's settings, not the
  // visitor's answers): { formId, formName, ... }.
  function formIdentity(block) {
    var id = { formId: '', formName: '' };
    try {
      var script = block && block.querySelector('script.sqs-form-block-context');
      if (!script) return id;
      var parsed = JSON.parse(script.textContent || '{}');
      if (parsed && typeof parsed.formId === 'string') id.formId = parsed.formId;
      if (parsed && typeof parsed.formName === 'string') id.formName = parsed.formName;
    } catch (e) {}
    return id;
  }

  // The honeypot is a text input visitors cannot see or reach (measured id
  // "message-field", inside an aria-hidden wrapper). Squarespace answers a
  // filled one with a 204 and its thank-you message, so a filled honeypot
  // means a bot. Only whether it is empty is checked.
  function honeypotFilled(formEl) {
    try {
      var hp = formEl.querySelector('#message-field');
      if (!hp) return false;
      var wrap = hp.closest && hp.closest('[aria-hidden="true"]');
      if (!wrap || !formEl.contains(wrap)) return false;
      return hp.value !== '';
    } catch (e) {
      return false;
    }
  }

  function submitButtonOf(formEl) {
    try { return formEl.querySelector('button[type="submit"]'); } catch (e) { return null; }
  }

  // ---- Which form a save request belongs to ----

  var seenSaves = [];   // SaveFormSubmission resource entries seen so far
  var claimed = [];     // entries already credited to a form
  var submitLog = [];   // every form submit on the page, with its time

  function pageOrigin() {
    try {
      var l = window.location;
      return l.origin || (l.protocol + '//' + l.host);
    } catch (e) {
      return '';
    }
  }

  // The save request's address is checked for its origin and path only.
  function isSaveEntry(e) {
    var n = (e && e.name) || '';
    var origin = pageOrigin();
    if (!origin || n.indexOf(origin + '/') !== 0) return false;
    return n.slice(origin.length).split(/[?#]/)[0] === SAVE_PATH;
  }

  function prune() {
    // An attempt is watched for WATCH_MS, and submits up to WATCH_MS before
    // it still count when deciding who owns a save.
    var cutoff = now() - 2 * WATCH_MS;
    var i;
    for (i = submitLog.length - 1; i >= 0; i--) if (submitLog[i].at < cutoff) submitLog.splice(i, 1);
    for (i = seenSaves.length - 1; i >= 0; i--) if (seenSaves[i].startTime < cutoff) seenSaves.splice(i, 1);
    if (seenSaves.length > 100) seenSaves.splice(0, seenSaves.length - 100);
    if (claimed.length > 100) claimed.splice(0, claimed.length - 100);
  }

  function allSaveEntries() {
    var all = seenSaves.slice();
    try {
      if (window.performance && typeof window.performance.getEntriesByType === 'function') {
        var buffered = window.performance.getEntriesByType('resource');
        for (var b = 0; b < buffered.length; b++) if (all.indexOf(buffered[b]) === -1) all.push(buffered[b]);
      }
    } catch (err) {}
    var out = [];
    for (var i = 0; i < all.length; i++) if (isSaveEntry(all[i])) out.push(all[i]);
    return out;
  }

  function saveEntriesSince(since) {
    var all = allSaveEntries();
    var out = [];
    for (var i = 0; i < all.length; i++) {
      if (all[i].startTime >= since && claimed.indexOf(all[i]) === -1) out.push(all[i]);
    }
    out.sort(function (x, y) { return x.startTime - y.startTime; });
    return out;
  }

  // A save's owner is ambiguous when another form (a Newsletter block
  // included) was submitted during this attempt. It is also ambiguous when
  // another form was submitted earlier in the watch window and may still be
  // waiting for its save, because a slow reCAPTCHA can hold that save back
  // until after this attempt starts. Each submit gets at most one save, so
  // fewer saves than submits before this attempt means one is outstanding.
  function saveOwnershipAmbiguous(formEl, since, until) {
    var other = false;
    var first = null;
    var submits = 0;
    for (var i = 0; i < submitLog.length; i++) {
      var s = submitLog[i];
      if (s.at > until || s.at < since - WATCH_MS) continue;
      if (s.at >= since) {
        if (s.form !== formEl) return true;
        continue;
      }
      if (s.form !== formEl) other = true;
      submits++;
      if (first === null || s.at < first) first = s.at;
    }
    if (!other) return false;
    var saves = allSaveEntries();
    var answered = 0;
    for (var j = 0; j < saves.length; j++) {
      if (saves[j].startTime >= first && saves[j].startTime < since) answered++;
    }
    return answered < submits;
  }

  function statusOf(entry) {
    var s = entry && entry.responseStatus;
    return (typeof s === 'number' && s > 0) ? s : null;
  }

  // ---- One watcher per form ----

  var watchers = [];
  var firedForms = [];

  function findWatcher(formEl) {
    for (var i = 0; i < watchers.length; i++) if (watchers[i].form === formEl) return watchers[i];
    return null;
  }

  function removeWatcher(w) {
    for (var i = 0; i < watchers.length; i++) if (watchers[i] === w) { watchers.splice(i, 1); return; }
  }

  function dropStaleWatchers(formEl, block) {
    for (var i = watchers.length - 1; i >= 0; i--) {
      var w = watchers[i];
      if (w.form === formEl) continue;
      if (!isConnected(w.form) || (block && w.block === block)) w.cleanup();
    }
  }

  function createWatcher(formEl, block) {
    var scope = (formEl.closest && formEl.closest('.form-wrapper')) || block;
    function markers() {
      var text = false;
      try { text = !!(scope && scope.querySelector('.form-submission-text')); } catch (e) {}
      return {
        submitted: hasToken(formEl, 'react-form-contents--submitted'),
        button: hasToken(submitButtonOf(formEl), 'success'),
        text: text
      };
    }
    var w = {
      form: formEl,
      block: block,
      identity: formIdentity(block),
      armed: false,
      submitAt: 0,
      answered: true,
      done: false,
      timer: null,
      observer: null,
      pagehideArmed: false,
      staleError: false,
      had: markers()
    };

    function redirectConfigured() {
      try { return !!(formEl.getAttribute && formEl.getAttribute('data-success-redirect')); } catch (e) { return false; }
    }

    function cleanup() {
      w.done = true;
      if (w.timer) { try { clearTimeout(w.timer); } catch (e) {} w.timer = null; }
      if (w.observer) { try { w.observer.disconnect(); } catch (e) {} w.observer = null; }
      if (w.pagehideArmed) {
        try { window.removeEventListener('pagehide', onPageHide, true); } catch (e) {}
        w.pagehideArmed = false;
      }
      removeWatcher(w);
    }

    // The push comes first. The form is marked done only once the push went
    // through, so a dataLayer that throws (a broken wrapper) loses nothing,
    // and the next confirmation tries again.
    function fire() {
      if (w.done) return false;
      var payload = { event: EVENT_NAME, form_id: w.identity.formId };
      if (w.identity.formName) payload.form_name = w.identity.formName;
      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(payload);
      } catch (e) {
        return false;
      }
      cleanup();
      firedForms.push(formEl);
      return true;
    }

    function domConfirmsSuccess() {
      var m = markers();
      return (m.submitted && !w.had.submitted) || (m.button && !w.had.button) || (m.text && !w.had.text);
    }

    function check() {
      if (w.done || !w.armed) return;
      if (!isConnected(formEl)) { cleanup(); return; }
      if (domConfirmsSuccess()) { fire(); return; }
      if (w.answered) return;
      // A fresh error state on the button is Squarespace refusing this
      // attempt; one left over from an earlier attempt is not.
      var errorShowing = hasToken(submitButtonOf(formEl), 'error');
      if (!errorShowing) w.staleError = false;
      else if (!w.staleError) w.answered = true;
    }

    // A failure in any callback stays inside this listener and never
    // reaches Squarespace's page.
    function onPageHide() {
      try { pageHideCheck(); } catch (e) {}
    }

    function pageHideCheck() {
      if (w.done || !w.armed) return;
      if (!isConnected(formEl)) { cleanup(); return; }
      if (domConfirmsSuccess()) { fire(); return; }
      if (saveOwnershipAmbiguous(formEl, w.submitAt, now())) { cleanup(); return; }
      var entries = saveEntriesSince(w.submitAt);
      var last = entries[entries.length - 1];
      var status = statusOf(last);
      if (status !== null && status >= 200 && status < 300) {
        if (fire()) claimed.push(last);
        else cleanup();
        return;
      }
      cleanup();
    }

    w.refresh = function (submitAt) {
      // A new attempt replaces the old one once the old one was answered
      // (or its save has been seen); a double submit keeps the first.
      if (!w.armed || w.answered || saveEntriesSince(w.submitAt).length > 0) {
        w.submitAt = submitAt;
        w.answered = false;
        w.staleError = hasToken(submitButtonOf(formEl), 'error');
      }
      w.armed = true;
      if (w.timer) { try { clearTimeout(w.timer); } catch (e) {} }
      try { w.timer = setTimeout(cleanup, WATCH_MS); } catch (e) {}
      if (!w.pagehideArmed && redirectConfigured()) {
        try {
          window.addEventListener('pagehide', onPageHide, true);
          w.pagehideArmed = true;
        } catch (e) {}
      }
    };
    w.check = check;
    w.fire = fire;
    w.cleanup = cleanup;
    w.alive = function () { return isConnected(formEl); };
    w.markAnswered = function () { w.answered = true; };

    try {
      if (typeof MutationObserver !== 'undefined' && block) {
        w.observer = new MutationObserver(function () {
          try { check(); } catch (e) {}
        });
        w.observer.observe(block, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
      }
    } catch (e) {}
    watchers.push(w);
    return w;
  }

  // ---- The save request's verdict, from resource timing ----

  function onResourceEntries(list) {
    var entries;
    try { entries = list.getEntries(); } catch (e) { return; }
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      if (!e || !isSaveEntry(e)) continue;
      if (seenSaves.indexOf(e) === -1) { seenSaves.push(e); prune(); }
      var status = statusOf(e);
      if (status === null || claimed.indexOf(e) !== -1) continue;
      var candidates = [];
      for (var j = 0; j < watchers.length; j++) {
        var w = watchers[j];
        if (!w.done && w.armed && !w.answered && w.alive() && e.startTime >= w.submitAt) candidates.push(w);
      }
      if (candidates.length !== 1) continue;
      var c = candidates[0];
      if (saveOwnershipAmbiguous(c.form, c.submitAt, e.startTime)) continue;
      if (status >= 200 && status < 300) {
        if (c.fire()) claimed.push(e);
      } else {
        c.markAnswered();
      }
    }
  }

  // ---- Submits ----

  function handleSubmit(event) {
    try {
      var formEl = event.target;
      if (!formEl || (formEl.tagName || '').toLowerCase() !== 'form') return;
      submitLog.push({ form: formEl, at: now() });
      prune();
      if (!isSquarespaceForm(formEl)) return;
      var block = blockFor(formEl);
      dropStaleWatchers(formEl, block);
      // Squarespace allows one success per page view.
      if (firedForms.indexOf(formEl) !== -1) return;
      if (hasToken(formEl, 'react-form-contents--submitted')) return;
      if (honeypotFilled(formEl)) {
        var old = findWatcher(formEl);
        if (old) old.cleanup();
        return;
      }
      var w = findWatcher(formEl) || createWatcher(formEl, block);
      w.refresh(now());
    } catch (e) {
      // Never throw back into Squarespace's own form handling.
    }
  }

  document.addEventListener('submit', handleSubmit, true);
  try {
    if (typeof PerformanceObserver !== 'undefined') {
      new PerformanceObserver(function (list) {
        try { onResourceEntries(list); } catch (e) {}
      }).observe({ type: 'resource' });
    }
  } catch (e) {}
})();
