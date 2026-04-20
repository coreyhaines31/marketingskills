# TikTok Base Code Template

Use this template when TikTok Base Code is missing, broken, incomplete, or unsuitable for reuse.

## Rules
- `{{PIXEL_CODE}}` is a required runtime value.
- Do not leave `{{PIXEL_CODE}}` unresolved in the final output.
- If the user's TikTok Pixel code is not already known from the repository, prior context, or the current request, ask the user for it before generating the final installable Base Code.
- Prefer installing this Base Code in a globally effective location such as the root layout, app shell, or shared head integration.
- Do not place this template only inside a single page component unless the implementation is intentionally page-scoped.

## Template

```html
<!-- TikTok Pixel Code Start -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject = t;
  var ttq = w[t] = w[t] || [];
  ttq.methods = ["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
  ttq.setAndDefer = function (target, method) {
    target[method] = function () {
      target.push([method].concat(Array.prototype.slice.call(arguments, 0)));
    };
  };
  for (var i = 0; i < ttq.methods.length; i++) {
    ttq.setAndDefer(ttq, ttq.methods[i]);
  }
  ttq.instance = function (e) {
    var instance = ttq._i[e] || [];
    for (var n = 0; n < ttq.methods.length; n++) {
      ttq.setAndDefer(instance, ttq.methods[n]);
    }
    return instance;
  };
  ttq.load = function (e, n) {
    var r = "https://analytics.tiktok.com/i18n/pixel/events.js",
        o = n && n.partner;
    ttq._i = ttq._i || {};
    ttq._i[e] = [];
    ttq._i[e]._u = r;
    ttq._i[e]._v = "v/0.0.1";
    ttq._t = ttq._t || {};
    ttq._t[e] = +new Date;
    ttq._o = ttq._o || {};
    ttq._o[e] = n || {};
    n = document.createElement("script");
    n.type = "text/javascript";
    n.async = !0;
    n.src = r + "?sdkid=" + e + "&lib=" + t;
    e = document.getElementsByTagName("script")[0];
    e.parentNode.insertBefore(n, e);
  };

  ttq.load('{{PIXEL_CODE}}');
  ttq.page();
}(window, document, 'ttq');
</script>
<!-- TikTok Pixel Code End -->