/* Nora Beauty Lounge: campaign page analytics (GA4)
   1. Loads GA4 once a real Measurement ID is set below.
   2. Sends a `cta_click` event for every <a data-cta> with the UTM values from its URL,
      so campaign clicks can be reported in GA4 (Reports > Engagement > Events). */
(function () {
  "use strict";

  /* >>> Replace with your GA4 Measurement ID (Admin > Data streams > your stream) <<< */
  var GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

  var validId = /^G-[A-Z0-9]{8,}$/.test(GA_MEASUREMENT_ID) && !/X{4,}/.test(GA_MEASUREMENT_ID);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  if (validId) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
    document.head.appendChild(s);
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID);
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("a[data-cta]") : null;
    if (!a) return;
    var params = {};
    try {
      var q = new URL(a.href, location.href).searchParams;
      params.campaign = q.get("utm_campaign") || "";
      params.cta_source = q.get("utm_source") || "";
      params.cta_medium = q.get("utm_medium") || "";
      params.cta_content = q.get("utm_content") || "";
    } catch (err) { /* ignore malformed URLs */ }
    params.cta_id = a.getAttribute("data-cta");
    params.link_url = a.href;
    params.page_path = location.pathname;
    params.transport_type = "beacon"; /* survives the navigation to Vagaro */
    window.gtag("event", "cta_click", params);
  });
})();
