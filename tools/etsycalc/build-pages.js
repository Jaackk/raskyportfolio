"use strict";
/*
 * Generates the guide and privacy pages under etsycalc/. Every number in the guides is computed
 * from calc.js, so the guides cannot drift away from the calculator.
 * Run from the repo root:  node tools/etsycalc/build-pages.js
 */
const fs = require("fs");
const path = require("path");
const C = require("../../etsycalc/calc.js");

const OUT = path.join(__dirname, "..", "..", "etsycalc");
const SITE = "https://raskyjack.com";
const MODIFIED = "2026-11-03";
const f2 = (x) => "£" + C.round2(x).toFixed(2);
const p1 = (x) => (Math.round(x * 10) / 10).toFixed(1).replace(/\.0$/, "") + "%";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const NAV = [
  ["/etsycalc/", "Calculator"],
  ["/etsycalc/etsy-fees-uk/", "Etsy fees UK"],
  ["/etsycalc/etsy-offsite-ads-fee/", "Offsite Ads"],
  ["/etsycalc/etsy-vat-on-seller-fees/", "VAT on fees"],
  ["/etsycalc/how-to-price-handmade-products/", "Pricing guide"]
];

function row(cells, cls) {
  return "<tr>" + cells.map((c, i) => `<${i === 0 && cls === "h" ? "th" : "td"}${typeof c === "object" ? ' class="num"' : ""}>${typeof c === "object" ? c.n : c}</${i === 0 && cls === "h" ? "th" : "td"}>`).join("") + "</tr>";
}
const num = (n) => ({ n });
function table(head, rows) {
  return `<div class="data"><table><thead><tr>${head.map((h, i) => `<th${i > 0 ? ' class="num"' : ""}>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => "<tr>" + r.map((c, i) => (i === 0 ? `<td>${c}</td>` : `<td class="num">${c}</td>`)).join("") + "</tr>")
    .join("")}</tbody></table></div>`;
}

function page(o) {
  const url = `${SITE}/etsycalc/${o.slug}/`;
  const crumbs = `<nav class="crumbs wrap" aria-label="Breadcrumb"><a href="/etsycalc/">Etsy calculator</a> / ${esc(o.crumb)}</nav>`;
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: o.h1,
      description: o.desc,
      inLanguage: "en-GB",
      dateModified: MODIFIED,
      datePublished: MODIFIED,
      mainEntityOfPage: url,
      author: { "@type": "Person", name: "Jack Ormondroyd", url: SITE + "/" },
      publisher: { "@type": "Person", name: "Jack Ormondroyd", url: SITE + "/" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Etsy calculator", item: SITE + "/etsycalc/" },
        { "@type": "ListItem", position: 2, name: o.crumb, item: url }
      ]
    }
  ];
  const sources = (o.sources || [])
    .map((s) => `<li><a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a></li>`)
    .join("");
  const related = NAV.slice(1)
    .filter((n) => n[0] !== `/etsycalc/${o.slug}/`)
    .map((n) => `<a href="${n[0]}"><b>${n[1]}</b><span>${esc(o.relatedText[n[0]] || "Read the guide")}</span></a>`)
    .join("");
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#faf7f4">
<meta property="og:type" content="article">
<meta property="og:locale" content="en_GB">
<meta property="og:site_name" content="Rasky Jack">
<meta property="og:title" content="${esc(o.h1)}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/etsycalc/site.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap bar">
    <a class="brand" href="/etsycalc/"><span class="brand-mark" aria-hidden="true">£</span>Etsy Profit Calculator</a>
    <nav class="nav" aria-label="Main">${NAV.map((n) => `<a href="${n[0]}"${n[0] === `/etsycalc/${o.slug}/` ? ' aria-current="page"' : ""}>${n[1]}</a>`).join("")}</nav>
  </div>
</header>
${crumbs}
<main id="main" class="wrap content article">
<h1 style="font-size:clamp(1.7rem,4vw,2.4rem);line-height:1.15;letter-spacing:-0.03em;margin:14px 0 8px">${esc(o.h1)}</h1>
<p class="sources" style="margin:0 0 14px">Updated ${C.FEES.verifiedLabel}. Figures checked against Etsy's own pages.</p>
${o.body}
${o.noCta ? "" : `<a class="cta" href="/etsycalc/#calculator"><b>Try it with your own numbers</b><span>Free Etsy fee and profit calculator for UK sellers</span></a>`}
${o.noRelated ? "" : `<h2>More guides</h2><div class="cards3">${related}</div>`}
${sources ? `<h2>Sources</h2><ul class="sources">${sources}</ul>` : ""}
<p class="sources">Estimates only, not tax, legal or financial advice. Etsy can change its fees at any time.</p>
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="links"><a href="/">raskyjack.com</a><a href="/etsycalc/privacy/">Privacy and cookies</a><button type="button" class="linkish" id="adChoices" hidden>Ad choices</button></div>
    <p>Not affiliated with Etsy, Inc. Etsy is a trademark of Etsy, Inc.</p>
  </div>
</footer>
<script src="/etsycalc/config.js"></script>
<script src="/etsycalc/site.js"></script>
</body>
</html>
`;
}

const SRC_POLICY = ["Etsy Fees & Payments Policy", "https://www.etsy.com/uk/legal/fees"];
const SRC_ROF_HELP = ["Etsy: What is a Regulatory Operating Fee?", "https://help.etsy.com/hc/en-us/articles/1500011073202-What-is-a-Regulatory-Operating-Fee"];
const SRC_ROF_NEWS = ["Etsy Community: Regulatory Operating Fee updates for some markets", "https://community.etsy.com/forum/announcements-290/topic/regulatory-operating-fee-updates-for-some-markets-181930/"];
const SRC_PAY = ["Etsy: Payment processing fees", "https://help.etsy.com/hc/articles/115015628847"];
const SRC_PAYPOL = ["Etsy Payments Policy", "https://www.etsy.com/uk/legal/etsy-payments/"];
const SRC_ADS = ["Etsy Help: Etsy Ads budgets", "https://help.etsy.com/hc/articles/360033701174"];

const AD_MID = '<aside class="ad-slot" data-slot="guide-mid" aria-label="Advertisement"><small>Advertisement</small></aside>';
const AD_END = '<aside class="ad-slot" data-slot="guide-end" aria-label="Advertisement"><small>Advertisement</small></aside>';

// ---------- shared worked examples ----------
const base = { materialsCost: 0, shippingCost: 0 };
const ex = C.compute(Object.assign({}, base));
const exVatReg = C.compute(Object.assign({}, base, { vatRegistered: true }));
const sizes = [
  { item: 10, post: 3 },
  { item: 20, post: 4 },
  { item: 50, post: 5 }
].map((s) => ({ s, r: C.compute({ itemPrice: s.item, shippingCharged: s.post, materialsCost: 0, shippingCost: 0 }) }));

const pages = [];

// ---------- 1. Etsy fees UK ----------
pages.push({
  slug: "etsy-fees-uk",
  crumb: "Etsy fees UK",
  title: "Etsy Fees UK 2026: Every Seller Fee Explained",
  h1: "Etsy fees UK: every seller fee explained (2026)",
  desc: "What Etsy charges UK sellers in 2026: 6.5% transaction fee, 4% + 20p processing, 0.48% regulatory fee, listing fees, Offsite Ads and VAT, with worked examples.",
  sources: [SRC_POLICY, SRC_PAY, SRC_PAYPOL, SRC_ROF_HELP, SRC_ROF_NEWS],
  relatedText: {
    "/etsycalc/etsy-offsite-ads-fee/": "The 15% and 12% fee, the $100 cap and how to opt out",
    "/etsycalc/etsy-vat-on-seller-fees/": "Who pays the 20% VAT Etsy adds to its fees",
    "/etsycalc/how-to-price-handmade-products/": "Turn fees and costs into a price that earns you money"
  },
  body: `
<p>Etsy takes several fees from every UK sale. Some are percentages, some are flat amounts, and a few only apply in particular situations. This guide lists each one, what it is charged on and what it costs on a typical order.</p>
<div class="note info"><b>Quick answer.</b> On a normal UK sale with no Offsite Ads, Etsy's fees come to about ${p1(ex.feePctOfSale)} of the order for a seller who is not VAT registered, or ${p1(exVatReg.feePctOfSale)} for a VAT-registered seller who reclaims VAT on fees. That is on a ${f2(ex.total)} order (${f2(20)} item plus ${f2(5)} postage).</div>

<h2>The fees at a glance</h2>
<div class="data"><table>
<thead><tr><th>Fee</th><th class="num">Rate</th><th>Charged on</th><th>When</th></tr></thead>
<tbody>
<tr><td>Transaction fee</td><td class="num">6.5%</td><td>Item price plus postage, gift wrap and personalisation</td><td>Every sale</td></tr>
<tr><td>Payment processing</td><td class="num">4% + £0.20</td><td>Total sale including postage</td><td>Every sale through Etsy Payments</td></tr>
<tr><td>Regulatory operating fee</td><td class="num">0.48%</td><td>Item price plus postage</td><td>Every UK sale</td></tr>
<tr><td>Listing fee</td><td class="num">0.20 USD</td><td>Each listing and each renewal</td><td>When you list or renew</td></tr>
<tr><td>Offsite Ads</td><td class="num">15% or 12%</td><td>Total order, capped at 100 USD</td><td>Only for sales from Etsy's offsite ads</td></tr>
<tr><td>Currency conversion</td><td class="num">2.5%</td><td>Sale amount</td><td>Only if your listing currency differs from your payment account</td></tr>
<tr><td>Etsy Ads</td><td class="num">Your daily budget</td><td>Clicks on promoted listings</td><td>Only if you use them</td></tr>
<tr><td>VAT</td><td class="num">20%</td><td>Etsy's fees</td><td>Depends on your business status</td></tr>
</tbody></table></div>

<h2>Transaction fee: 6.5%</h2>
<p>Etsy charges 6.5% of the price you display plus what you charge for postage and gift wrapping. If you charge for personalisation, that amount is added to the price first. For sellers outside the US the fee also applies to any tax included in your listing price. Because postage is included, offering "free postage" and building the cost into the item price does not avoid the fee on that money.</p>

<h2>Payment processing: 4% + £0.20</h2>
<p>For a UK bank account, Etsy Payments charges 4% of the total sale plus £0.20 per order. The percentage applies to the whole amount the buyer pays for goods and postage. The flat 20p means small orders lose a bigger share than large ones.</p>

<h2>Regulatory operating fee: 0.48%</h2>
<p>Sellers in certain countries pay a regulatory operating fee on each sale. Etsy announced that the UK rate increased from 0.32% to 0.48% from 22 June 2026. It is charged on the item price plus postage, in addition to the other fees. Many online calculators were last updated before that change and still use the older figure.</p>

<h2>Listing fee: 0.20 USD</h2>
<p>Each listing costs 0.20 USD to publish and lasts four months. If it is still listed after four months, automatic renewal charges another 0.20 USD unless you switch renewal to manual. A listing with several items in stock is renewed at 0.20 USD each time one sells. Etsy bills in dollars and converts to pounds at the market rate, so the pound amount changes slightly with the exchange rate. This site's calculator uses a rate you can edit. Etsy does not publish a fixed pound figure, so treat any such figure as an estimate.</p>

${AD_MID}

<h2>Offsite Ads: 15% or 12%, only when they bring the sale</h2>
<p>If a buyer clicks an advert Etsy bought on another site and orders from your shop within 30 days, Etsy charges an advertising fee on that order. The rate is 15%, or 12% for shops that have passed 10,000 USD of sales in a 365-day period. The fee is capped at 100 USD per order. Smaller shops can opt out. See the <a href="/etsycalc/etsy-offsite-ads-fee/">full Offsite Ads guide</a>.</p>

<h2>Etsy Ads</h2>
<p>Etsy Ads are optional and work on a daily budget. Etsy's help pages give a minimum daily budget of 1 USD. Spend is charged as clicks happen, so the cost per sale varies. In the calculator you can enter your average ad spend per sale to see its effect on profit.</p>

<h2>Currency conversion: 2.5%</h2>
<p>If you list in a currency other than the one in your Etsy Payments account, Etsy charges 2.5% on the sale amount to send the funds to your account. Listing in the same currency as your payment account avoids it.</p>

<h2>VAT on Etsy's fees</h2>
<p>Etsy's published fees exclude VAT. Depending on your business status and location, Etsy may add VAT to the fees it charges you. If you are not VAT registered you cannot reclaim it, so it is a real cost. If you are VAT registered you can normally reclaim it. <a href="/etsycalc/etsy-vat-on-seller-fees/">VAT on Etsy fees explained</a>.</p>

<h2>What the fees cost on a real order</h2>
<p>Here are the fees on a ${f2(ex.total)} order (${f2(20)} item plus ${f2(5)} postage) for a seller who is not VAT registered, with no Offsite Ads. Each line is rounded to the penny, so the lines can differ from the total by a penny.</p>
${table(["Fee", "Amount"], [
  ["Transaction fee (6.5%)", f2(ex.fee.transaction)],
  ["Payment processing (4% + £0.20)", f2(ex.fee.processing)],
  ["Regulatory operating fee (0.48%)", f2(ex.fee.regulatory)],
  ["Listing fee (0.20 USD at 0.75)", f2(ex.fee.listing)],
  ["VAT on those fees (20%)", f2(ex.etsyVat)],
  ["<b>Total fees</b>", `<b>${f2(ex.totalFees)}</b> (${p1(ex.feePctOfSale)} of the order)`]
])}
<p>The share Etsy takes is lower on bigger orders because the flat amounts spread over more money:</p>
${table(["Order (item + postage)", "Total fees", "Share of order"], sizes.map((z) => [`${f2(z.s.item)} + ${f2(z.s.post)}`, f2(z.r.totalFees), p1(z.r.feePctOfSale)]))}
<p>All of these include VAT on fees and the listing fee, and assume no Offsite Ads. A VAT-registered seller who reclaims VAT on fees pays ${f2(exVatReg.totalFees)} on the ${f2(ex.total)} order.</p>

<h2>A quick rule of thumb</h2>
<p>With the default rates and a seller who is not VAT registered, Etsy keeps roughly 13.2% of the order plus about 42p. For a VAT-registered seller it is about 11% plus 35p. This ignores Offsite Ads, Etsy Ads and currency conversion. Use the calculator for a precise figure.</p>
${AD_END}
`
});

// ---------- 2. Offsite Ads ----------
const o15 = C.compute({ materialsCost: 0, shippingCost: 0, offsiteEnabled: true });
const o12 = C.compute({ materialsCost: 0, shippingCost: 0, offsiteEnabled: true, offsitePct: 12 });
const full15 = C.compute({ offsiteEnabled: true });
const fullNo = C.compute({});
const big = C.compute({ itemPrice: 600, shippingCharged: 0, materialsCost: 0, shippingCost: 0, offsiteEnabled: true });
const candle = { itemPrice: 0, shippingCharged: 3.95, materialsCost: 4.2, packagingCost: 0.8, shippingCost: 3.1, otherCost: 5 };
const candleOff = Object.assign({}, candle, { offsiteEnabled: true });
pages.push({
  slug: "etsy-offsite-ads-fee",
  crumb: "Etsy Offsite Ads fee",
  title: "Etsy Offsite Ads Fee: 15% vs 12%, the Cap and Opt-Out",
  h1: "Etsy Offsite Ads fee: 15% or 12%, the $100 cap and how it hits profit",
  desc: "How Etsy's Offsite Ads fee works: when 15% or 12% applies, the 100 USD cap, who can opt out, and what it does to your profit, with worked UK examples.",
  sources: [SRC_POLICY],
  relatedText: {
    "/etsycalc/etsy-fees-uk/": "Every Etsy fee for UK sellers in one place",
    "/etsycalc/etsy-vat-on-seller-fees/": "VAT is added to this fee too",
    "/etsycalc/how-to-price-handmade-products/": "Price so an advert sale still earns you money"
  },
  body: `
<p>Offsite Ads is the Etsy fee that can change a good sale into a thin one. It is not charged on every order. It is charged only when Etsy's own advertising brings the buyer to your shop.</p>
<div class="note info"><b>Quick answer.</b> Etsy charges 15% of the order total on sales it attributes to Offsite Ads, or 12% once your shop has passed 10,000 USD of sales in the previous 365 days. The fee on one order never exceeds 100 USD. Shops under 10,000 USD can opt out.</div>

<h2>When the fee applies</h2>
<p>Etsy buys advertising on other sites and platforms. If your listing appears in one of those adverts, a buyer clicks it, and the buyer then places any order from your shop within 30 days, that order is an attributed order and the fee applies. If the buyer's last click before ordering was on an Etsy Ad, only the Etsy Ads fee applies instead. Orders that did not come from an Etsy-placed advert are not charged this fee.</p>

<h2>15% or 12%</h2>
<p>Which rate you pay depends on your shop's sales over the previous 365 days, calculated on the first day of each month. Under 10,000 USD you pay 15%. Once you reach 10,000 USD or more, Etsy says you pay 12% on attributed orders for the lifetime of your shop, even if sales later fall below the threshold. The threshold counts item price multiplied by quantity, minus discounts and cancelled orders, and excludes postage and taxes.</p>

<h2>What it is charged on</h2>
<p>The fee is a percentage of the total order amount: the price you display plus postage and gift wrapping, and personalisation if you offer it. Outside the US it also applies to any tax included in your listing prices.</p>

<h2>The 100 USD cap</h2>
<p>The total Offsite Ads fee on a single attributed order is capped at 100 USD. At 15% the cap starts to bite on orders above roughly 667 USD. In pounds the cap moves with the exchange rate. With the calculator's default rate of 0.75 it is ${f2(75)}. A ${f2(600)} order therefore pays the capped ${f2(big.fee.offsite)} at 15%.</p>

${AD_MID}

<h2>Opting out</h2>
<p>Etsy says shops under 10,000 USD of sales in the last 365 days can opt out of Offsite Ads for as long as they stay under that threshold. Once you cross it, participation is required. Whether to opt out is a business decision: the ads can bring buyers you would not otherwise reach, but every attributed sale costs 15%. The calculator lets you compare both.</p>

<h2>What it does to your profit</h2>
<p>Take the calculator's default example: a ${f2(20)} item with ${f2(5)} postage, ${f2(8)} to make and ${f2(2.5)} to post. For a seller who is not VAT registered:</p>
${table(["", "No Offsite Ads", "With 15% Offsite Ads"], [
  ["Offsite Ads fee", f2(fullNo.fee.offsite), f2(full15.fee.offsite)],
  ["VAT on Etsy's fees", f2(fullNo.etsyVat), f2(full15.etsyVat)],
  ["Total fees", f2(fullNo.totalFees), f2(full15.totalFees)],
  ["Profit per sale", f2(fullNo.profit), f2(full15.profit)],
  ["Margin", p1(fullNo.marginPct), p1(full15.marginPct)]
])}
<p>VAT is added to the Offsite Ads fee as well, so the real cost is a little higher than 15% for sellers who cannot reclaim VAT. Here the advert sale earns ${f2(fullNo.profit - full15.profit)} less. On the 12% rate the fee on a ${f2(25)} order is ${f2(o12.fee.offsite)} instead of ${f2(o15.fee.offsite)}.</p>

<h2>Pricing for it</h2>
<p>If you do not opt out, it is safest to check that you still make money on an advert sale. Using the pricing guide's candle example (materials, packaging, postage and ${f2(5)} of your time), the break-even item price rises from ${f2(C.breakEvenPrice(candle).price)} to ${f2(C.breakEvenPrice(candleOff).price)} with a 15% Offsite Ads fee, and the price for a 30% margin rises from ${f2(C.priceForMargin(candle, 30).price)} to ${f2(C.priceForMargin(candleOff, 30).price)}. See <a href="/etsycalc/how-to-price-handmade-products/">how to price handmade products</a>.</p>
${AD_END}
`
});

// ---------- 3. VAT ----------
const vInc = C.compute({ vatRegistered: true, pricesIncludeVat: true });
const vNo = C.compute({});
const vReg = C.compute({ vatRegistered: true });
pages.push({
  slug: "etsy-vat-on-seller-fees",
  crumb: "VAT on Etsy fees",
  title: "VAT on Etsy Seller Fees UK: Who Pays and What It Costs",
  h1: "VAT on Etsy seller fees in the UK: who pays, and what it costs you",
  desc: "Etsy can add 20% VAT to its seller fees. See who pays it, what VAT-registered sellers can reclaim, and how VAT changes your Etsy profit, with worked examples.",
  sources: [SRC_POLICY, ["Etsy Help: What information does Etsy report for UK sellers?", "https://help.etsy.com/hc/articles/25255653500951"], ["GOV.UK: VAT, how to register", "https://www.gov.uk/register-for-vat"]],
  relatedText: {
    "/etsycalc/etsy-fees-uk/": "The full list of Etsy fees",
    "/etsycalc/etsy-offsite-ads-fee/": "VAT applies to the Offsite Ads fee too",
    "/etsycalc/how-to-price-handmade-products/": "Build VAT into your pricing"
  },
  body: `
<p>There are two different VATs in play for an Etsy seller, and mixing them up is the commonest mistake. One is the VAT Etsy adds to its own fees. The other is the VAT you charge your customers if you are VAT registered.</p>
<div class="note info"><b>Quick answer.</b> Etsy says it may apply VAT to its seller fees depending on your business status and location. For UK sellers that is 20% on top of Etsy's fees. If you are not VAT registered it is a cost you cannot reclaim. If you are VAT registered you can normally reclaim it. Separately, if you are VAT registered and your prices include VAT, a sixth of each sale goes to HMRC.</div>

<h2>1. VAT on Etsy's fees</h2>
<p>Etsy's fee policy says its published fees exclude VAT and that VAT is collected on all Etsy fees for sellers in countries where VAT applies. That includes the transaction fee, payment processing, the regulatory operating fee, listing fees, Offsite Ads and Etsy Ads. This calculator leaves the currency conversion fee out of the VAT base because Etsy does not say it is VATable.</p>
<p>On a ${f2(vNo.total)} order with the default fees, the fees before VAT come to ${f2(vNo.etsyFees)} and VAT adds ${f2(vNo.etsyVat)}.</p>
${table(["Seller", "Fees on the order", "VAT on fees you bear"], [
  ["Not VAT registered", f2(vNo.totalFees), f2(vNo.vatOnFeesCost)],
  ["VAT registered (reclaims VAT)", f2(vReg.totalFees), f2(vReg.vatOnFeesCost)]
])}

<h2>2. VAT on your own sales (VAT-registered sellers)</h2>
<p>If you are VAT registered, you must account for VAT on your sales. How it affects you depends on how you price:</p>
<ul>
<li><b>Your listed prices include VAT.</b> A sixth of each sale (20/120) is VAT you owe HMRC. On the ${f2(vNo.total)} example order that is ${f2(vInc.salesVat)}. This comes out of your profit.</li>
<li><b>You add VAT on top.</b> Then the buyer pays the VAT separately and your take is unchanged. This calculator does not model that case.</li>
</ul>
<p>If you are not VAT registered you do not charge or pay VAT on your sales, so only the first kind of VAT matters.</p>

${AD_MID}

<h2>Effect on profit: the same sale three ways</h2>
<p>The ${f2(20)} item with ${f2(5)} postage, ${f2(8)} to make and ${f2(2.5)} to post:</p>
${table(["Situation", "Profit per sale", "Margin"], [
  ["Not VAT registered", f2(C.compute({}).profit), p1(C.compute({}).marginPct)],
  ["VAT registered, VAT charged on top", f2(vReg.profit + 0), p1(C.compute({ vatRegistered: true }).marginPct)],
  ["VAT registered, prices include VAT", f2(C.compute({ vatRegistered: true, pricesIncludeVat: true }).profit), p1(C.compute({ vatRegistered: true, pricesIncludeVat: true }).marginPct)]
])}
<p>The first row is the calculator's default. The second drops the VAT on Etsy's fees because you reclaim it. The third also takes the sixth owed to HMRC out of the sale, which is why VAT-inclusive pricing needs a higher price to keep the same profit.</p>

<h2>Do I need to register for VAT?</h2>
<p>That depends on your taxable turnover and the current threshold, which HMRC sets and can change. Check <a href="https://www.gov.uk/register-for-vat" target="_blank" rel="noopener">GOV.UK</a> for the current figure and talk to an accountant if you are close to it. Etsy also reports UK seller information to HMRC, which is worth knowing when you think about your tax position.</p>
<p>This page explains how VAT changes the maths in the calculator. It is not tax advice, and VAT rules have exceptions the calculator does not cover.</p>
${AD_END}
`
});

// ---------- 4. Pricing handmade ----------
const cd = Object.assign({}, candle);
const at = (price, extra) => C.compute(Object.assign({}, cd, extra || {}, { itemPrice: price }));
const p20 = C.priceForMargin(cd, 20).price;
const p30 = C.priceForMargin(cd, 30).price;
const p40 = C.priceForMargin(cd, 40).price;
const brk = C.breakEvenPrice(cd).price;
const prof5 = C.priceForProfit(cd, 5).price;
const r30 = at(p30);
const rLow = at(15);
const vat30 = C.priceForMargin(Object.assign({}, cd, { vatRegistered: true }), 30).price;
pages.push({
  slug: "how-to-price-handmade-products",
  crumb: "Price handmade products",
  title: "How to Price Handmade Products on Etsy UK (With Fees)",
  h1: "How to price handmade products on Etsy UK so you actually make a profit",
  desc: "A step-by-step way to price handmade products on Etsy UK: list your costs, include Etsy's fees and VAT, then work out break-even, margin and target prices.",
  sources: [SRC_POLICY, SRC_PAY, SRC_ROF_NEWS],
  relatedText: {
    "/etsycalc/etsy-fees-uk/": "Every Etsy fee you need to include",
    "/etsycalc/etsy-offsite-ads-fee/": "Make sure an advert sale still pays",
    "/etsycalc/etsy-vat-on-seller-fees/": "How VAT changes the price you need"
  },
  body: `
<p>Most pricing mistakes on Etsy come from forgetting something: the 20p per order, postage you give away, VAT on Etsy's fees, or your own time. This guide builds a price from the bottom up so nothing is missed, then shows how to check it.</p>
<div class="note info"><b>Quick answer.</b> Add up every cost of one sale. Decide what profit you want, as a margin or an amount in pounds. Then solve for the item price that leaves that profit after Etsy's fees and VAT. The calculator's "Find the right price" panel does the last step for you.</div>

<h2>Step 1: list every cost per sale</h2>
<ul>
<li><b>Materials</b> for one item, including waste.</li>
<li><b>Packaging</b>: box or mailer, tissue, labels, thank-you card.</li>
<li><b>Postage you pay</b> to send it. Enter what you charge the buyer separately, because Etsy takes fees on that money.</li>
<li><b>Your time.</b> Pay yourself something per hour. If you skip it the shop looks profitable but earns nothing for your work.</li>
<li><b>Anything else per item</b>: gift extras, tools or equipment wear, if you count them.</li>
</ul>

<h2>Step 2: include Etsy's fees</h2>
<p>For a seller who is not VAT registered, Etsy's fees on a standard sale come to about 13.2% of the order (item plus postage) plus roughly 42p, with no Offsite Ads. That is 6.5% transaction, 4% processing and 0.48% regulatory, with 20% VAT added, plus the 20p processing charge and the listing fee, also with VAT. A VAT-registered seller reclaiming VAT on fees pays about 11% plus 35p. <a href="/etsycalc/etsy-fees-uk/">See each fee explained</a>.</p>

<h2>Step 3: choose a target</h2>
<ul>
<li><b>Break-even</b> is the lowest price that avoids a loss. Never go below it.</li>
<li><b>Profit in pounds</b> is simple to reason about: "I want £5 left from each sale".</li>
<li><b>Profit margin</b> is profit as a share of what the buyer pays. This calculator uses the total sale, item plus postage charged, which is the money Etsy handles.</li>
</ul>
<p>Margin and markup are not the same. A 30% margin means profit is 30% of the sale price. A markup of 30% on cost gives a much lower margin.</p>

${AD_MID}

<h2>Worked example: a hand-poured candle</h2>
<p>Costs per candle: ${f2(4.2)} materials, ${f2(0.8)} packaging, ${f2(3.1)} to post, and ${f2(5)} for half an hour of your time at £10 an hour. The buyer pays ${f2(3.95)} postage. No Offsite Ads, not VAT registered.</p>
${table(["Target", "Item price needed"], [
  ["Break-even (profit £0)", f2(brk)],
  ["£5 profit per candle", f2(prof5)],
  ["20% margin", f2(p20)],
  ["30% margin", f2(p30)],
  ["40% margin", f2(p40)]
])}
<p>At ${f2(p30)} the candle sells for ${f2(r30.total)} including postage. Etsy's fees and VAT are ${f2(r30.totalFees)}, costs are ${f2(r30.costs)}, and ${f2(r30.profit)} is left, which is ${p1(r30.marginPct)} of the sale. Priced at £15 the same candle leaves ${f2(rLow.profit)} (${p1(rLow.marginPct)}). That is easy to do if you price by feel.</p>

<h2>Check the awkward cases</h2>
<ul>
<li><b>Offsite Ads.</b> If a sale comes from an Etsy-placed advert the fee is 15% or 12% of the whole order. For this candle the break-even price rises to ${f2(C.breakEvenPrice(candleOff).price)} and the 30% margin price to ${f2(C.priceForMargin(candleOff, 30).price)}. See the <a href="/etsycalc/etsy-offsite-ads-fee/">Offsite Ads guide</a>.</li>
<li><b>VAT registration.</b> If you reclaim VAT on Etsy's fees, the 30% margin price falls to ${f2(vat30)}. If you are registered and your prices include VAT, a sixth of every sale goes to HMRC and you need a higher price. See <a href="/etsycalc/etsy-vat-on-seller-fees/">VAT on Etsy fees</a>.</li>
<li><b>Free postage.</b> You can fold postage into the price, but Etsy still takes its percentage fees on it, so the item price needs to cover that.</li>
<li><b>Discounts and sales.</b> Run the numbers at the sale price, not the list price. A 20% off sale takes much more than 20% off your profit.</li>
</ul>

<h2>What margin should I aim for?</h2>
<p>There is no universal answer. It depends on how much time the item takes, how much you want to reinvest, what buyers will pay, and whether you plan to use Etsy Ads. A sensible approach is to pick a margin that still leaves you paid for your time on a bad day, such as an Offsite Ads sale, and to check it with the calculator. Treat any general "ideal margin" figure as a starting point, not a rule.</p>

<h2>Keep it up to date</h2>
<p>Review prices when your material or postage costs change, when Etsy changes its fees, and when your sales cross a VAT or Offsite Ads threshold. The calculator can store your fee settings on your device so a re-check takes a minute.</p>
${AD_END}
`
});

// ---------- 5. Privacy ----------
pages.push({
  slug: "privacy",
  crumb: "Privacy and cookies",
  title: "Privacy and Cookies | Etsy Profit Calculator",
  h1: "Privacy and cookies",
  desc: "How the Etsy Profit Calculator handles your data: calculator inputs stay in your browser, and any analytics or advertising is explained here.",
  noCta: false,
  noRelated: true,
  sources: [["ICO: Cookies and similar technologies", "https://ico.org.uk/for-the-public/online/cookies/"]],
  relatedText: {},
  body: `
<h2>Who runs this site</h2>
<p>This calculator is run by Jack Ormondroyd as part of <a href="/">raskyjack.com</a>. It is a free tool and is not affiliated with Etsy, Inc.</p>

<h2>What you type into the calculator</h2>
<p>Everything you enter in the calculator is processed in your browser. It is not sent to a server and is not stored by this site. If you press "Copy link", the numbers are placed in the link you copy, in the part after the "#", which browsers do not send to the server.</p>

<h2>What is stored on your device</h2>
<p>The calculator saves your fee settings (for example your VAT status and edited rates) in your browser's local storage so you do not have to re-enter them. This stays on your device. "Reset everything" clears it. If advertising is switched on, your accept or reject choice is stored the same way.</p>

<h2>Hosting and logs</h2>
<p>The site is hosted by Netlify. Like any web host, Netlify and its network handle your IP address and standard request information in order to deliver pages and keep the service secure.</p>

<h2>Analytics</h2>
<p>At the time of writing no analytics script runs on this site. If analytics is added, it will be a cookie-free, privacy-focused service used only to count visits, traffic sources and popular pages, and this page will name it. It will respect your browser's "Do Not Track" setting.</p>

<h2>Advertising</h2>
<p>At the time of writing no adverts are shown and no advertising scripts load. If adverts are added, they will be provided by Google AdSense. Google and its partners may use cookies and similar technologies to show and measure ads. Before any of that loads you will be asked to accept or reject, and you can change your choice at any time with the "Ad choices" link in the page footer. Rejecting does not affect the calculator. You can also learn more at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google's advertising technologies page</a>.</p>

<h2>Links to other sites</h2>
<p>Pages here link to Etsy, GOV.UK and other sites. They have their own privacy policies. Any link that earns this site a commission will be clearly labelled.</p>

<h2>Your rights</h2>
<p>Under UK data protection law you can ask what personal data is held about you, ask for it to be corrected or deleted, and complain to the Information Commissioner's Office (ico.org.uk). Because this site does not collect personal data from the calculator, there is usually nothing to access. To raise a request, use the contact details on <a href="/">raskyjack.com</a>.</p>

<h2>Changes</h2>
<p>If this page changes materially, for example when analytics or advertising is switched on, the date at the top will be updated.</p>
`
});

// ---------- write ----------
for (const p of pages) {
  const dir = path.join(OUT, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), page(p), "utf8");
  console.log("wrote", p.slug);
}
