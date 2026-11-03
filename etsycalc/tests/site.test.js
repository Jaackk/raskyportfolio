"use strict";
// Run with: node --test etsycalc/tests/site.test.js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const C = require("../calc.js");

const ROOT = path.join(__dirname, "..", "..");
const PAGES = [
  "etsycalc/index.html",
  "etsycalc/etsy-fees-uk/index.html",
  "etsycalc/etsy-offsite-ads-fee/index.html",
  "etsycalc/etsy-vat-on-seller-fees/index.html",
  "etsycalc/how-to-price-handmade-products/index.html",
  "etsycalc/privacy/index.html"
];
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const urlFor = (rel) => "https://raskyjack.com/" + rel.replace(/index\.html$/, "");

function exists(href) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean || /^(https?:|mailto:|tel:)/.test(clean)) return true;
  const rel = clean.replace(/^\//, "");
  const p = path.join(ROOT, rel);
  return fs.existsSync(p) && fs.statSync(p).isFile() ? true : fs.existsSync(path.join(p, "index.html"));
}

for (const rel of PAGES) {
  test(`${rel}: SEO metadata`, () => {
    const h = read(rel);
    const title = /<title>([^<]+)<\/title>/.exec(h);
    assert.ok(title, "title");
    assert.ok(title[1].length <= 70, `title length ${title[1].length}`);
    const desc = /<meta name="description" content="([^"]+)"/.exec(h);
    assert.ok(desc, "description");
    assert.ok(desc[1].length >= 70 && desc[1].length <= 165, `description length ${desc[1].length}`);
    assert.ok(h.includes(`<link rel="canonical" href="${urlFor(rel)}">`), "canonical");
    assert.ok(h.includes('<html lang="en-GB">'), "lang");
    assert.equal((h.match(/<h1[\s>]/g) || []).length, 1, "exactly one h1");
    assert.ok(h.includes('property="og:title"') && h.includes('property="og:url"'), "open graph");
    for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(m[1]);
  });

  test(`${rel}: internal links and assets resolve`, () => {
    const h = read(rel);
    for (const m of h.matchAll(/(?:href|src)="([^"]+)"/g)) assert.ok(exists(m[1]), `missing ${m[1]} in ${rel}`);
  });
}

test("sitemap lists every calculator page and every entry exists", () => {
  const xml = read("sitemap.xml");
  for (const rel of PAGES) assert.ok(xml.includes(`<loc>${urlFor(rel)}</loc>`), `sitemap missing ${rel}`);
  for (const m of xml.matchAll(/<loc>https:\/\/raskyjack\.com([^<]*)<\/loc>/g)) assert.ok(exists(m[1]), `sitemap url missing: ${m[1]}`);
});

test("robots.txt does not block the calculator and points at the sitemap", () => {
  const r = read("robots.txt");
  assert.ok(!/Disallow:\s*\/etsycalc/.test(r));
  assert.ok(/Sitemap:\s*https:\/\/raskyjack\.com\/sitemap\.xml/.test(r));
});

test("config has a valid Umami ID and no advertising IDs", () => {
  const cfg = {};
  new Function("window", read("etsycalc/config.js"))(cfg);
  const c = cfg.ETSYCALC_CONFIG;
  assert.match(c.analytics.umamiWebsiteId, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  assert.equal(c.analytics.umamiSrc, "https://cloud.umami.is/script.js");
  assert.equal(c.adsense.client, "");
  for (const v of Object.values(c.adsense.slots)) assert.equal(v, "");
});

test("analytics never sends the URL hash or query, and honours Do Not Track", () => {
  const js = read("etsycalc/site.js");
  for (const a of ["data-exclude-hash", "data-exclude-search", "data-do-not-track"]) assert.ok(js.includes(`"${a}", "true"`), a);
  assert.ok(/doNotTrack/.test(js));
});

test("AdSense is prepared but not active", () => {
  const cfg = {};
  new Function("window", read("etsycalc/config.js"))(cfg);
  assert.equal(cfg.ETSYCALC_CONFIG.adsense.client, "", "ads must stay off until approved");
  assert.ok(["", "google"].includes(cfg.ETSYCALC_CONFIG.adsense.cmp));
  const ads = read("tools/etsycalc/ads.txt").trim();
  assert.match(ads, /^google\.com, pub-\d{16}, DIRECT, f08c47fec0942fa0$/);
  const tag = read("tools/etsycalc/google-adsense-account.html").trim();
  assert.equal(tag, `<meta name="google-adsense-account" content="ca-${ads.split(", ")[1]}">`);
  for (const rel of PAGES) assert.ok(!/adsbygoogle\.js|googlesyndication/.test(read(rel)), `${rel} loads ads directly`);
});

test("privacy policy covers the whole site, not only the calculator", () => {
  const h = read("etsycalc/privacy/index.html");
  for (const term of ["whole of", "hello@raskyjack.com", "Netlify", "Google Fonts", "ImprovMX", "Spotify", "local storage", "Information Commissioner"]) {
    assert.ok(h.includes(term), `privacy page should mention ${term}`);
  }
});

test("privacy page discloses Umami and its events", () => {
  const h = read("etsycalc/privacy/index.html");
  assert.ok(h.includes("Umami"));
  assert.ok(/Do Not Track/.test(h));
  assert.ok(!/no analytics script runs/i.test(h));
});

test("no third-party scripts are referenced in page HTML", () => {
  for (const rel of PAGES) {
    for (const m of read(rel).matchAll(/<script[^>]+src="([^"]+)"/g)) assert.ok(m[1].startsWith("/etsycalc/"), `${rel} loads ${m[1]}`);
  }
});

test("calculator inputs referenced by app.js exist in the page", () => {
  const html = read("etsycalc/index.html");
  const js = read("etsycalc/app.js");
  const ids = new Set();
  for (const m of js.matchAll(/\$\("([A-Za-z0-9_]+)"\)/g)) ids.add(m[1]);
  for (const arr of ["NUM", "BOOL", "EXTRA", "PREFS", "RATE_IDS"]) {
    const m = new RegExp("var " + arr + " = \\[([\\s\\S]*?)\\];").exec(js);
    assert.ok(m, arr);
    for (const s of m[1].matchAll(/"([A-Za-z0-9_]+)"/g)) ids.add(s[1]);
  }
  for (const id of ids) assert.ok(html.includes(`id="${id}"`), `missing #${id}`);
});

test("calculator page fee table matches the engine constants", () => {
  const html = read("etsycalc/index.html");
  assert.ok(html.includes(`${C.FEES.regulatoryPct}%`));
  assert.ok(html.includes(`${C.FEES.transactionPct}%`));
  assert.ok(html.includes("4% + £0.20"));
  assert.ok(html.includes(C.FEES.verifiedLabel));
  assert.ok(html.includes(`value="${C.FEES.regulatoryPct}"`));
  assert.ok(html.includes(`value="${C.FEES.usdToGbp}"`));
});

test("guide rules of thumb match the engine", () => {
  // Not VAT registered: fees = total * 13.176% + 42p. VAT registered: total * 10.98% + 35p.
  for (const total of [10, 25, 60, 200]) {
    const a = C.compute({ itemPrice: total, shippingCharged: 0, materialsCost: 0, shippingCost: 0 });
    assert.ok(Math.abs(a.totalFees - (total * 0.13176 + 0.42)) < 1e-9);
    const b = C.compute({ itemPrice: total, shippingCharged: 0, materialsCost: 0, shippingCost: 0, vatRegistered: true });
    assert.ok(Math.abs(b.totalFees - (total * 0.1098 + 0.35)) < 1e-9);
  }
});

test("guide pages quote engine-derived numbers", () => {
  const f2 = (x) => "£" + C.round2(x).toFixed(2);
  const fees = read("etsycalc/etsy-fees-uk/index.html");
  const r = C.compute({ materialsCost: 0, shippingCost: 0 });
  assert.ok(fees.includes(f2(r.totalFees)));
  const off = read("etsycalc/etsy-offsite-ads-fee/index.html");
  assert.ok(off.includes(f2(C.compute({ offsiteEnabled: true }).profit)));
  const vat = read("etsycalc/etsy-vat-on-seller-fees/index.html");
  assert.ok(vat.includes(f2(C.compute({ vatRegistered: true, pricesIncludeVat: true }).salesVat)));
});

test("the retired GBP 9 upgrade and false claims are gone", () => {
  for (const rel of PAGES) {
    const h = read(rel);
    assert.ok(!/Unlock Full Report|money back|£9\.00|Save unlimited scenarios/i.test(h), rel);
    assert.ok(!/<ins class="adsbygoogle"/.test(h), "no hard-coded ad units");
  }
});
