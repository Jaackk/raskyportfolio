/*
 * Site configuration. Leave the values below empty until the matching account exists.
 * With empty values the site loads no analytics, no ad scripts and shows no consent banner.
 */
window.ETSYCALC_CONFIG = {
  analytics: {
    // Umami Cloud website ID (https://cloud.umami.is). Looks like a UUID.
    umamiWebsiteId: "6fa1bb13-4856-4816-bcf2-5fe2dc506c1d",
    umamiSrc: "https://cloud.umami.is/script.js"
  },
  adsense: {
    // AdSense publisher ID, for example "ca-pub-XXXXXXXXXXXXXXXX". Only fill in once Google has approved the site.
    client: "",
    // "" = the built-in accept/reject banner gates every ad script (limited eligibility: it is not a Google-certified CMP).
    // "google" = Google's certified consent message handles consent; enable it in AdSense > Privacy & messaging first.
    cmp: "",
    // Ad unit IDs created in AdSense for the placements marked data-slot in the pages.
    slots: {
      "calc-below": "",
      "guide-mid": "",
      "guide-end": ""
    }
  }
};
