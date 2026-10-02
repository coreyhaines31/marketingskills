/*! File download conversion detection (MIT)
 *  Detects: click on a downloadable file link. Pushes dataLayer event: file_download
 *  From the conversion-tracking skill in Marketing Skills */
(function () {
  if (window.__ctDetectFileDownload) return;
  window.__ctDetectFileDownload = true;
  window.dataLayer = window.dataLayer || [];

  /* For gated content that is NOT gated: price lists, brochures, spec
     sheets, lead magnets served as a direct link. If the download sits
     behind a form, track the form instead — that is where the lead is.

     GA4 already collects file_download as an enhanced measurement event.
     Use this when you need the same signal in Google Ads or Meta, which
     do not. */

  // EDIT if you serve other formats.
  var EXTENSIONS = [
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'csv', 'zip', 'rar', '7z', 'dmg', 'exe', 'pkg',
    'mp3', 'mp4', 'mov', 'wav', 'txt', 'rtf'
  ];

  var DEDUPE_MS = 2000;
  var lastUrl = null;
  var lastAt = 0;

  function extensionOf(url) {
    try {
      // Strip query and hash before reading the extension, so
      // /brochure.pdf?utm_source=x still resolves to "pdf".
      var path = String(url || '').split('#')[0].split('?')[0];
      var name = path.substring(path.lastIndexOf('/') + 1);
      var dot = name.lastIndexOf('.');
      if (dot < 0) return null;
      var ext = name.substring(dot + 1).toLowerCase();
      for (var i = 0; i < EXTENSIONS.length; i++) {
        if (EXTENSIONS[i] === ext) return ext;
      }
    } catch (e) { /* fall through */ }
    return null;
  }

  function fileNameOf(url) {
    try {
      var path = String(url || '').split('#')[0].split('?')[0];
      return decodeURIComponent(path.substring(path.lastIndexOf('/') + 1));
    } catch (e) {
      return '';
    }
  }

  function handleClick(event) {
    try {
      if (event.button !== undefined && event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var target = event.target;
      if (!target || !target.closest) return;

      var link = target.closest('a[href]');
      if (!link) return;

      // Resolve relative hrefs against the current page. .href does this for
      // us where available; getAttribute would leave "/files/x.pdf" relative.
      var url = link.href || link.getAttribute('href');
      if (!url) return;

      // An anchor carrying the download attribute is a download regardless
      // of extension, so honour that too.
      var ext = extensionOf(url);
      var forced = link.hasAttribute && link.hasAttribute('download');
      if (!ext && !forced) return;

      var now = new Date().getTime();
      if (url === lastUrl && (now - lastAt) < DEDUPE_MS) return;
      lastUrl = url;
      lastAt = now;

      window.dataLayer.push({
        event: 'file_download',
        file_name: fileNameOf(url),
        file_extension: ext || '',
        file_url: url,
        link_text: (link.textContent || '').trim().slice(0, 100),
        page_path: window.location.pathname
      });
    } catch (e) {
      // Never throw back into the page's own click handling.
    }
  }

  document.addEventListener('click', handleClick, false);
})();
