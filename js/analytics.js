/* Nora Beauty Lounge: Google Analytics 4 (sitewide)
   - Loads GA4 and records page views (production domain only, so local testing never pollutes data).
   - Sends `cta_click` for every link to Vagaro (booking) and `phone_click` for every tel: link.
     Links may set data-cta="name"; otherwise the id is derived from where the link sits on the page.
   - Campaign details come from the link's UTM parameters when present. */
(function () {
  "use strict";

  var GA_MEASUREMENT_ID = "G-H6S3XJR2PM";
  var PROD_HOSTS = ["norabeautylounge.com", "www.norabeautylounge.com"];

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  var live = PROD_HOSTS.indexOf(location.hostname) !== -1;
  if (live) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
    document.head.appendChild(s);
  }
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);

  function where(el) {
    if (el.closest("header")) return "header";
    if (el.closest("footer")) return "footer";
    return "body";
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    var isBook = /(^|\/\/)(www\.)?vagaro\.com/i.test(href);
    var isPhone = /^tel:/i.test(href);
    if (!isBook && !isPhone) return;

    var params = {
      cta_id: a.getAttribute("data-cta") || (where(a) + (isBook ? "_book" : "_phone")),
      page_path: location.pathname
    };
    if (isBook) {
      params.link_url = a.href;
      try {
        var q = new URL(a.href, location.href).searchParams;
        params.promo_campaign = q.get("utm_campaign") || "";
        params.cta_source = q.get("utm_source") || "";
        params.cta_medium = q.get("utm_medium") || "";
        params.cta_content = q.get("utm_content") || "";
      } catch (err) { /* ignore malformed URLs */ }
    }
    params.transport_type = "beacon"; /* survives navigation away from the page */
    window.gtag("event", isBook ? "cta_click" : "phone_click", params);
  });
})();
