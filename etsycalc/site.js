/*
 * Shared behaviour for every page: privacy-friendly analytics and consent-gated ads.
 * Nothing is loaded unless an ID is set in config.js. Ads load only after the visitor accepts.
 */
(function () {
  "use strict";
  var cfg = window.ETSYCALC_CONFIG || {};
  var analytics = cfg.analytics || {};
  var ads = cfg.adsense || {};
  var CONSENT_KEY = "etsycalc.adsConsent.v1";

  function store(method, key, value) {
    try {
      return method === "get" ? window.localStorage.getItem(key) : window.localStorage.setItem(key, value);
    } catch (e) {
      return null;
    }
  }

  // ----- Analytics (Umami, cookieless). Honours Do Not Track. -----
  var dnt = navigator.doNotTrack === "1" || window.doNotTrack === "1";
  if (analytics.umamiWebsiteId && !dnt) {
    var u = document.createElement("script");
    u.defer = true;
    u.src = analytics.umamiSrc || "https://cloud.umami.is/script.js";
    u.setAttribute("data-website-id", analytics.umamiWebsiteId);
    u.setAttribute("data-domains", location.hostname);
    document.head.appendChild(u);
  }
  window.etsyTrack = function (name, data) {
    try {
      if (window.umami && typeof window.umami.track === "function") window.umami.track(name, data);
    } catch (e) {}
  };

  // ----- Ads -----
  if (!ads.client) return;

  var loaded = false;
  function loadAds() {
    if (loaded) return;
    loaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(ads.client);
    document.head.appendChild(s);
    var slots = document.querySelectorAll(".ad-slot[data-slot]");
    Array.prototype.forEach.call(slots, function (el) {
      var id = (ads.slots || {})[el.getAttribute("data-slot")];
      if (!id) return;
      el.classList.add("on");
      var ins = document.createElement("ins");
      ins.className = "adsbygoogle";
      ins.style.display = "block";
      ins.setAttribute("data-ad-client", ads.client);
      ins.setAttribute("data-ad-slot", id);
      ins.setAttribute("data-ad-format", "auto");
      ins.setAttribute("data-full-width-responsive", "true");
      el.appendChild(ins);
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
  }

  function hideBanner() {
    var b = document.getElementById("consentBanner");
    if (b) b.remove();
  }

  function showBanner() {
    if (document.getElementById("consentBanner")) return;
    var b = document.createElement("div");
    b.id = "consentBanner";
    b.className = "consent";
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-label", "Advertising choices");
    b.innerHTML =
      "<p><b>Ads on this site</b><br>This calculator is free and paid for by adverts. Google and its partners may use cookies and similar technologies to show and measure ads. Nothing from them loads unless you accept. " +
      '<a href="/etsycalc/privacy/">Read more</a>.</p>' +
      '<div class="btn-row"><button type="button" class="btn primary" id="consentAccept">Accept ads</button>' +
      '<button type="button" class="btn" id="consentReject">Reject</button></div>';
    document.body.appendChild(b);
    document.getElementById("consentAccept").addEventListener("click", function () {
      store("set", CONSENT_KEY, "granted");
      hideBanner();
      loadAds();
    });
    document.getElementById("consentReject").addEventListener("click", function () {
      store("set", CONSENT_KEY, "denied");
      hideBanner();
    });
  }

  var choice = store("get", CONSENT_KEY);
  var link = document.getElementById("adChoices");
  if (link) {
    link.hidden = false;
    link.addEventListener("click", showBanner);
  }
  if (choice === "granted") loadAds();
  else if (choice !== "denied") showBanner();
})();
