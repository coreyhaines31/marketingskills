/*! Phone call click detection (MIT)
 *  Detects: click on a tel: link. Pushes dataLayer event: phone_click
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectPhoneClick) return;
  window.__ctDetectPhoneClick = true;
  window.dataLayer = window.dataLayer || [];

  // A click is a call INTENT, not a completed call. On desktop especially,
  // many tel: clicks never become a conversation. Count it as a lead signal,
  // and prefer a call tracking number if you need answered-call accuracy.

  // Ignore a repeat click on the same number inside this window. Impatient
  // double-taps on mobile are common and would otherwise double count.
  var DEDUPE_MS = 2000;
  var lastNumber = null;
  var lastAt = 0;

  function normalise(href) {
    // tel:+61 (2) 1234-5678 -> +61212345678 . Keeps a leading +, drops the
    // punctuation humans put in phone numbers so dedupe compares like for like.
    var raw = String(href || '').replace(/^tel:/i, '');
    try { raw = decodeURIComponent(raw); } catch (e) { /* leave as-is */ }
    var plus = raw.trim().charAt(0) === '+' ? '+' : '';
    return plus + raw.replace(/[^0-9]/g, '');
  }

  function handleClick(event) {
    try {
      // Left click only, and not a modified click that opens elsewhere.
      if (event.button !== undefined && event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var target = event.target;
      if (!target || !target.closest) return;

      // closest() because the click usually lands on an icon or span INSIDE
      // the anchor, not the anchor itself.
      var link = target.closest('a[href^="tel:"], a[href^="TEL:"]');
      if (!link) return;

      var number = normalise(link.getAttribute('href'));
      if (!number) return;

      var now = new Date().getTime();
      if (number === lastNumber && (now - lastAt) < DEDUPE_MS) return;
      lastNumber = number;
      lastAt = now;

      // PII: if the site shows visitor-specific numbers (an account page, a
      // CRM-driven "your rep" number), drop phone_number and link_text here.
      window.dataLayer.push({
        event: 'phone_click',
        phone_number: number,
        // The visible text, useful when a site shows different numbers per
        // location or campaign. Trimmed and capped so a whole button's worth
        // of markup text never lands in the dataLayer.
        link_text: (link.textContent || '').trim().slice(0, 100),
        page_path: window.location.pathname
      });
    } catch (e) {
      // Never throw back into the page's own click handling.
    }
  }

  // Bubble phase: a tel: click has no validation to lose a race with, and
  // bubbling means anything that legitimately cancels the click wins first.
  document.addEventListener('click', handleClick, false);
})();
