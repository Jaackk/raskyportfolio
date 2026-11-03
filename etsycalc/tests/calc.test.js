"use strict";
// Run with: node --test etsycalc/tests
const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../calc.js");

const near = (actual, expected, eps = 1e-9) =>
  assert.ok(Math.abs(actual - expected) < eps, `expected ${expected}, got ${actual}`);

test("defaults: hand-calculated UK sale, non-VAT-registered", () => {
  // total 25.00; transaction 1.625; processing 1.00 + 0.20; regulatory 0.12; listing 0.20 USD * 0.75 = 0.15
  // VAT 20% on (1.625 + 1.20 + 0.12 + 0.15) = 0.619; costs 8.00 + 2.50
  const r = C.compute({});
  near(r.total, 25);
  near(r.fee.transaction, 1.625);
  near(r.fee.processing, 1.2);
  near(r.fee.regulatory, 0.12);
  near(r.fee.listing, 0.15);
  near(r.etsyVat, 0.619);
  near(r.totalFees, 3.714);
  near(r.profit, 10.786);
  near(r.marginPct, (10.786 / 25) * 100);
  near(r.monthlyProfit, 10.786 * 30);
});

test("VAT-registered seller does not bear VAT on fees", () => {
  const r = C.compute({ vatRegistered: true });
  near(r.vatOnFeesCost, 0);
  near(r.profit, 10.786 + 0.619);
  assert.equal(r.salesVat, 0);
});

test("VAT-registered with VAT-inclusive prices owes a sixth of the sale to HMRC", () => {
  const r = C.compute({ vatRegistered: true, pricesIncludeVat: true });
  near(r.salesVat, 25 / 6);
  near(r.profit, 10.786 + 0.619 - 25 / 6);
});

test("pricesIncludeVat is ignored for non-registered sellers", () => {
  const a = C.compute({ pricesIncludeVat: true });
  const b = C.compute({});
  near(a.profit, b.profit);
  assert.equal(a.salesVat, 0);
});

test("Offsite Ads at 15% below the cap", () => {
  const r = C.compute({ offsiteEnabled: true });
  near(r.fee.offsite, 3.75);
  // VAT base grows by 3.75
  near(r.etsyVat, (1.625 + 1.2 + 0.12 + 0.15 + 3.75) * 0.2);
});

test("Offsite Ads at the reduced 12% rate", () => {
  const r = C.compute({ offsiteEnabled: true, offsitePct: 12 });
  near(r.fee.offsite, 3);
});

test("Offsite Ads fee is capped at 100 USD per order", () => {
  const r = C.compute({ itemPrice: 1000, shippingCharged: 0, offsiteEnabled: true });
  // 15% of 1000 = 150 > cap of 100 * 0.75 = 75
  near(r.fee.offsite, 75);
  const fx = C.compute({ itemPrice: 1000, shippingCharged: 0, offsiteEnabled: true, usdToGbp: 0.8 });
  near(fx.fee.offsite, 80);
});

test("currency conversion fee is 2.5% of the sale and not charged VAT", () => {
  const r = C.compute({ currencyEnabled: true });
  near(r.fee.currency, 0.625);
  near(r.etsyVat, 0.619);
  near(r.profit, 10.786 - 0.625);
});

test("Etsy Ads spend counts as a fee and attracts VAT", () => {
  const r = C.compute({ adsCostPerSale: 2 });
  near(r.fee.ads, 2);
  near(r.etsyVat, (1.625 + 1.2 + 0.12 + 0.15 + 2) * 0.2);
});

test("listing fee can be switched off", () => {
  const r = C.compute({ listingEnabled: false });
  near(r.fee.listing, 0);
});

test("packaging and other costs reduce profit", () => {
  const base = C.compute({});
  const r = C.compute({ packagingCost: 0.5, otherCost: 0.25 });
  near(base.profit - r.profit, 0.75);
});

test("zero sale and bad input do not produce NaN", () => {
  const r = C.compute({ itemPrice: 0, shippingCharged: 0, materialsCost: "abc", shippingCost: -5 });
  for (const v of [r.profit, r.marginPct, r.totalFees, r.total]) assert.ok(Number.isFinite(v));
  assert.equal(r.marginPct, 0);
  near(r.inputs.shippingCost, 0);
});

test("price for target margin round-trips", () => {
  for (const extra of [{}, { vatRegistered: true }, { offsiteEnabled: true }, { currencyEnabled: true, adsCostPerSale: 1 }]) {
    const base = Object.assign({}, extra);
    const res = C.priceForMargin(base, 30);
    assert.ok(res.ok);
    const r = C.compute(Object.assign({}, base, { itemPrice: res.price }));
    assert.ok(r.marginPct >= 30 - 1e-9, `margin ${r.marginPct}`);
    // one penny cheaper must miss the target
    const below = C.compute(Object.assign({}, base, { itemPrice: res.price - 0.01 }));
    assert.ok(below.marginPct < 30, `below ${below.marginPct}`);
  }
});

test("price for target margin is unreachable when fees plus margin exceed 100%", () => {
  const res = C.priceForMargin({ transactionPct: 60, processingPct: 30 }, 30);
  assert.equal(res.ok, false);
  assert.equal(res.price, null);
});

test("break-even price makes profit zero to the penny", () => {
  const res = C.breakEvenPrice({});
  assert.ok(res.ok);
  const at = C.compute({ itemPrice: res.price });
  assert.ok(at.profit >= 0 && at.profit < 0.02, `profit ${at.profit}`);
  const below = C.compute({ itemPrice: res.price - 0.01 });
  assert.ok(below.profit < 0);
});

test("break-even is zero when there are no costs and no fixed fees", () => {
  const res = C.breakEvenPrice({
    materialsCost: 0,
    shippingCost: 0,
    shippingCharged: 0,
    processingFixed: 0,
    listingEnabled: false
  });
  assert.equal(res.price, 0);
});

test("price for target profit round-trips", () => {
  const res = C.priceForProfit({}, 10);
  const r = C.compute({ itemPrice: res.price });
  assert.ok(r.profit >= 10 - 1e-9 && r.profit < 10.05, `profit ${r.profit}`);
});

test("target price copes with the Offsite Ads cap bending the fee curve", () => {
  const base = { offsiteEnabled: true, materialsCost: 400, shippingCost: 10 };
  const res = C.priceForMargin(base, 30);
  assert.ok(res.ok);
  const r = C.compute(Object.assign({}, base, { itemPrice: res.price }));
  assert.ok(r.marginPct >= 30 - 1e-9);
  assert.ok(r.fee.offsite <= 75 + 1e-9);
});

test("maximum materials for a margin", () => {
  const res = C.maxMaterialsForMargin({ itemPrice: 20 }, 30);
  assert.ok(res.ok);
  const r = C.compute({ itemPrice: 20, materialsCost: res.max });
  near(r.marginPct, 30, 1e-6);
});

test("maximum materials reports when the margin cannot be reached", () => {
  const res = C.maxMaterialsForMargin({ itemPrice: 2, shippingCost: 5 }, 30);
  assert.equal(res.ok, false);
  assert.equal(res.max, 0);
});

test("lines() ends with profit and hides zero optional fees", () => {
  const rows = C.lines(C.compute({}));
  assert.equal(rows[rows.length - 1][0], "Profit per sale");
  assert.ok(!rows.some((r) => r[0] === "Offsite Ads fee"));
  const withOff = C.lines(C.compute({ offsiteEnabled: true }));
  assert.ok(withOff.some((r) => r[0] === "Offsite Ads fee"));
});

test("published fee constants match Etsy's documented UK rates", () => {
  assert.equal(C.FEES.transactionPct, 6.5);
  assert.equal(C.FEES.processingPct, 4);
  assert.equal(C.FEES.processingFixed, 0.2);
  assert.equal(C.FEES.regulatoryPct, 0.48);
  assert.equal(C.FEES.listingUsd, 0.2);
  assert.equal(C.FEES.offsiteStandardPct, 15);
  assert.equal(C.FEES.offsiteReducedPct, 12);
  assert.equal(C.FEES.offsiteCapUsd, 100);
  assert.equal(C.FEES.currencyPct, 2.5);
});
