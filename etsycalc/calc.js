/*
 * Etsy UK fee engine. Pure functions, no DOM, so the same code runs in the page and in the tests.
 * All money values are GBP unless a name says Usd.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.EtsyCalc = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Published Etsy figures, last checked against Etsy's own pages on VERIFIED.
  var FEES = {
    verified: "2026-11-03",
    verifiedLabel: "3 November 2026",
    transactionPct: 6.5,
    processingPct: 4,
    processingFixed: 0.2,
    regulatoryPct: 0.48,
    listingUsd: 0.2,
    offsiteStandardPct: 15,
    offsiteReducedPct: 12,
    offsiteCapUsd: 100,
    offsiteThresholdUsd: 10000,
    currencyPct: 2.5,
    vatPct: 20,
    usdToGbp: 0.75,
    sources: [
      { label: "Etsy Fees & Payments Policy", url: "https://www.etsy.com/uk/legal/fees" },
      { label: "Etsy: What is a Regulatory Operating Fee?", url: "https://help.etsy.com/hc/en-us/articles/1500011073202-What-is-a-Regulatory-Operating-Fee" },
      { label: "Etsy: Payment processing fees", url: "https://help.etsy.com/hc/en-us/articles/115015628847-What-are-Payment-Processing-Fees-for-Selling-on-Etsy" },
      { label: "Etsy Payments Policy", url: "https://www.etsy.com/uk/legal/etsy-payments/" }
    ]
  };

  var DEFAULTS = {
    itemPrice: 20,
    shippingCharged: 5,
    materialsCost: 8,
    packagingCost: 0,
    shippingCost: 2.5,
    otherCost: 0,
    transactionPct: FEES.transactionPct,
    processingPct: FEES.processingPct,
    processingFixed: FEES.processingFixed,
    regulatoryPct: FEES.regulatoryPct,
    usdToGbp: FEES.usdToGbp,
    listingEnabled: true,
    offsiteEnabled: false,
    offsitePct: FEES.offsiteStandardPct,
    currencyEnabled: false,
    currencyPct: FEES.currencyPct,
    adsCostPerSale: 0,
    vatRegistered: false,
    pricesIncludeVat: false,
    vatPct: FEES.vatPct,
    salesPerMonth: 30
  };

  function num(value, fallback) {
    var n = typeof value === "number" ? value : parseFloat(value);
    return isFinite(n) ? n : fallback === undefined ? 0 : fallback;
  }

  function clean(input) {
    var s = {};
    for (var key in DEFAULTS) {
      var def = DEFAULTS[key];
      var v = input && input[key] !== undefined ? input[key] : def;
      s[key] = typeof def === "boolean" ? !!v : Math.max(0, num(v, def));
    }
    return s;
  }

  function round2(x) {
    return Math.round((x + 1e-9) * 100) / 100;
  }

  function compute(input) {
    var s = clean(input);
    var total = s.itemPrice + s.shippingCharged;
    var fee = {
      transaction: (total * s.transactionPct) / 100,
      processing: (total * s.processingPct) / 100 + s.processingFixed,
      regulatory: (total * s.regulatoryPct) / 100,
      listing: s.listingEnabled ? FEES.listingUsd * s.usdToGbp : 0,
      offsite: 0,
      currency: s.currencyEnabled ? (total * s.currencyPct) / 100 : 0,
      ads: s.adsCostPerSale
    };
    if (s.offsiteEnabled) {
      fee.offsite = Math.min((total * s.offsitePct) / 100, FEES.offsiteCapUsd * s.usdToGbp);
    }
    // Etsy adds VAT to its own fees. The conversion fee is left out of the VAT base because
    // Etsy does not say it is VATable.
    var vatBase = fee.transaction + fee.processing + fee.regulatory + fee.listing + fee.offsite + fee.ads;
    var etsyVat = (vatBase * s.vatPct) / 100;
    // VAT-registered sellers reclaim VAT on fees. If their prices include VAT they owe HMRC a slice of the sale.
    var salesVat = s.vatRegistered && s.pricesIncludeVat ? (total * s.vatPct) / (100 + s.vatPct) : 0;
    var vatOnFeesCost = s.vatRegistered ? 0 : etsyVat;
    var etsyFees =
      fee.transaction + fee.processing + fee.regulatory + fee.listing + fee.offsite + fee.currency + fee.ads;
    var totalFees = etsyFees + vatOnFeesCost;
    var costs = s.materialsCost + s.packagingCost + s.shippingCost + s.otherCost;
    var profit = total - totalFees - salesVat - costs;
    return {
      inputs: s,
      total: total,
      fee: fee,
      etsyVat: etsyVat,
      vatOnFeesCost: vatOnFeesCost,
      salesVat: salesVat,
      etsyFees: etsyFees,
      totalFees: totalFees,
      costs: costs,
      profit: profit,
      marginPct: total > 0 ? (profit / total) * 100 : 0,
      monthlyProfit: profit * s.salesPerMonth,
      feePctOfSale: total > 0 ? (totalFees / total) * 100 : 0
    };
  }

  function withPrice(input, price) {
    var copy = {};
    for (var k in input) copy[k] = input[k];
    copy.itemPrice = price;
    return copy;
  }

  // Finds the lowest item price where gap(price) >= 0. Fees are piecewise linear in price
  // (the Offsite Ads cap bends the line), so scan coarsely and then bisect.
  function solvePrice(input, gap) {
    var lo = 0;
    if (gap(0) >= 0) return { ok: true, price: 0 };
    var step = 0.01;
    var hi = null;
    var prev = 0;
    for (var p = step; p <= 1000000; p = p * 1.05 + 0.01) {
      if (gap(p) >= 0) {
        hi = p;
        lo = prev;
        break;
      }
      prev = p;
    }
    if (hi === null) return { ok: false, price: null };
    for (var i = 0; i < 60; i++) {
      var mid = (lo + hi) / 2;
      if (gap(mid) >= 0) hi = mid;
      else lo = mid;
    }
    return { ok: true, price: Math.ceil(hi * 100 - 1e-7) / 100 };
  }

  function priceForMargin(input, marginPct) {
    var m = num(marginPct) / 100;
    return solvePrice(input, function (p) {
      var r = compute(withPrice(input, p));
      return r.profit - m * r.total;
    });
  }

  function priceForProfit(input, profit) {
    var want = num(profit);
    return solvePrice(input, function (p) {
      return compute(withPrice(input, p)).profit - want;
    });
  }

  function breakEvenPrice(input) {
    return priceForProfit(input, 0);
  }

  // Reverse calculation: the most you can spend on materials and still hit the margin at this price.
  function maxMaterialsForMargin(input, marginPct) {
    var zero = {};
    for (var k in input) zero[k] = input[k];
    zero.materialsCost = 0;
    var r = compute(zero);
    var max = r.profit - (num(marginPct) / 100) * r.total;
    return { ok: max >= 0, max: Math.max(0, max), raw: max };
  }

  function lines(result) {
    var r = result;
    var rows = [
      ["Item price", r.inputs.itemPrice],
      ["Postage charged to buyer", r.inputs.shippingCharged],
      ["Total sale", r.total],
      ["Transaction fee", -r.fee.transaction],
      ["Payment processing", -r.fee.processing],
      ["Regulatory operating fee", -r.fee.regulatory]
    ];
    if (r.fee.listing) rows.push(["Listing fee", -r.fee.listing]);
    if (r.fee.offsite) rows.push(["Offsite Ads fee", -r.fee.offsite]);
    if (r.fee.currency) rows.push(["Currency conversion fee", -r.fee.currency]);
    if (r.fee.ads) rows.push(["Etsy Ads spend", -r.fee.ads]);
    if (r.vatOnFeesCost) rows.push(["VAT on Etsy fees", -r.vatOnFeesCost]);
    if (r.salesVat) rows.push(["VAT on your sale (to HMRC)", -r.salesVat]);
    rows.push(["Materials / cost to make", -r.inputs.materialsCost]);
    if (r.inputs.packagingCost) rows.push(["Packaging", -r.inputs.packagingCost]);
    rows.push(["Your postage cost", -r.inputs.shippingCost]);
    if (r.inputs.otherCost) rows.push(["Other costs", -r.inputs.otherCost]);
    rows.push(["Profit per sale", r.profit]);
    return rows;
  }

  return {
    FEES: FEES,
    DEFAULTS: DEFAULTS,
    compute: compute,
    priceForMargin: priceForMargin,
    priceForProfit: priceForProfit,
    breakEvenPrice: breakEvenPrice,
    maxMaterialsForMargin: maxMaterialsForMargin,
    lines: lines,
    round2: round2
  };
});
