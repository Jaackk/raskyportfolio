/* Calculator page behaviour. The fee maths lives in calc.js. */
(function () {
  "use strict";
  var C = window.EtsyCalc;
  var $ = function (id) { return document.getElementById(id); };

  var NUM = ["itemPrice", "shippingCharged", "materialsCost", "packagingCost", "shippingCost", "otherCost", "salesPerMonth",
    "adsCostPerSale", "transactionPct", "processingPct", "processingFixed", "regulatoryPct", "vatPct", "usdToGbp"];
  var BOOL = ["listingEnabled", "offsiteEnabled", "currencyEnabled", "vatRegistered", "pricesIncludeVat"];
  var EXTRA = ["offsitePct", "targetMargin", "targetProfit"];
  // Fee settings are remembered on this device; product numbers are not.
  var PREFS = ["transactionPct", "processingPct", "processingFixed", "regulatoryPct", "vatPct", "usdToGbp",
    "currencyEnabled", "vatRegistered", "pricesIncludeVat", "offsitePct", "listingEnabled"];
  var PREF_KEY = "etsycalc.prefs.v1";
  var RATE_IDS = ["transactionPct", "processingPct", "processingFixed", "regulatoryPct", "vatPct", "usdToGbp"];

  var money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
  function gbp(x) { return money.format(C.round2(x) === 0 ? 0 : x); }
  function pct(x) { return (Math.round(x * 10) / 10).toFixed(1).replace(/\.0$/, "") + "%"; }
  function el(tag, text, cls) {
    var n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  }

  var defaults = {};
  NUM.concat(EXTRA).forEach(function (id) { defaults[id] = $(id).value; });
  BOOL.forEach(function (id) { defaults[id] = $(id).checked; });

  function read() {
    var s = {};
    NUM.forEach(function (id) { s[id] = $(id).value === "" ? 0 : parseFloat($(id).value); });
    BOOL.forEach(function (id) { s[id] = $(id).checked; });
    s.offsitePct = parseFloat($("offsitePct").value);
    return s;
  }

  // ----- preferences and shared links -----
  function loadPrefs() {
    try {
      var saved = JSON.parse(localStorage.getItem(PREF_KEY) || "{}");
      PREFS.forEach(function (id) {
        if (saved[id] === undefined) return;
        if (typeof saved[id] === "boolean") $(id).checked = saved[id];
        else $(id).value = saved[id];
      });
    } catch (e) {}
  }
  function savePrefs() {
    try {
      var o = {};
      PREFS.forEach(function (id) {
        o[id] = typeof defaults[id] === "boolean" ? $(id).checked : $(id).value;
      });
      localStorage.setItem(PREF_KEY, JSON.stringify(o));
    } catch (e) {}
  }
  function loadHash() {
    if (location.hash.length < 2) return false;
    var p = new URLSearchParams(location.hash.slice(1));
    var any = false;
    NUM.concat(EXTRA).forEach(function (id) {
      if (p.has(id) && isFinite(parseFloat(p.get(id)))) { $(id).value = p.get(id); any = true; }
    });
    BOOL.forEach(function (id) {
      if (p.has(id)) { $(id).checked = p.get(id) === "1"; any = true; }
    });
    return any;
  }
  function shareUrl() {
    var p = new URLSearchParams();
    NUM.concat(EXTRA).forEach(function (id) { if ($(id).value !== String(defaults[id])) p.set(id, $(id).value); });
    BOOL.forEach(function (id) { if ($(id).checked !== defaults[id]) p.set(id, $(id).checked ? "1" : "0"); });
    var h = p.toString();
    return location.origin + location.pathname + (h ? "#" + h : "");
  }

  // ----- rendering -----
  function renderResults(s) {
    var r = C.compute(s);
    $("profit").textContent = gbp(r.profit);
    $("profitStat").className = "stat" + (r.profit < 0 ? " loss" : "");
    $("profitSub").textContent = r.total > 0 ? pct(r.feePctOfSale) + " of the sale goes in Etsy fees and VAT" : "";
    $("margin").textContent = pct(r.marginPct);
    $("mbarProfit").textContent = gbp(r.profit);
    $("mbarMargin").textContent = pct(r.marginPct) + " margin";

    var warn = $("warn");
    if (r.profit < 0) {
      warn.hidden = false;
      warn.textContent = "At these numbers you lose " + gbp(-r.profit) + " on every sale. Try the price helper below.";
    } else {
      warn.hidden = true;
    }

    var tbody = $("breakdown").tBodies[0];
    tbody.textContent = "";
    C.lines(r).forEach(function (row) {
      var tr = el("tr");
      var label = row[0];
      if (label === "Total sale") tr.className = "total";
      if (label === "Profit per sale") tr.className = "final";
      tr.appendChild(el("th", label));
      tr.appendChild(el("td", gbp(row[1]), row[1] < 0 && label !== "Profit per sale" ? "neg" : ""));
      tbody.appendChild(tr);
    });

    $("monthly").textContent = s.salesPerMonth > 0
      ? "At " + Math.round(s.salesPerMonth) + " sales a month that is about " + gbp(r.monthlyProfit) + " profit a month."
      : "";
    return r;
  }

  function renderHelper(s) {
    var m = parseFloat($("targetMargin").value);
    var tp = parseFloat($("targetProfit").value);
    var a = isFinite(m) && m >= 0 && m < 100 ? C.priceForMargin(s, m) : { ok: false };
    $("pMargin").textContent = a.ok ? gbp(a.price) : "Not reachable";
    var b = isFinite(tp) && tp >= 0 ? C.priceForProfit(s, tp) : { ok: false };
    $("pProfit").textContent = b.ok ? gbp(b.price) : "Not reachable";
    var c = C.breakEvenPrice(s);
    $("pBreak").textContent = c.ok ? gbp(c.price) : "Not reachable";
    var d = isFinite(m) ? C.maxMaterialsForMargin(s, m) : { ok: false };
    $("pMax").textContent = d.ok ? gbp(d.max) : "Not reachable";
  }

  // ----- compare table -----
  var CMP_FIELDS = [
    ["itemPrice", "Item price"], ["shippingCharged", "Postage charged"], ["materialsCost", "Materials"],
    ["packagingCost", "Packaging"], ["shippingCost", "Your postage cost"]
  ];
  var CMP_OUT = [["total", "Total sale"], ["fees", "Etsy fees and VAT"], ["profit", "Profit per sale"], ["margin", "Margin"], ["target", "Price for target margin"]];
  var cmpBody = $("cmpBody");
  var cmpOut = {};
  CMP_FIELDS.forEach(function (f) {
    var tr = el("tr");
    tr.appendChild(el("th", f[1]));
    for (var i = 0; i < 4; i++) {
      var td = el("td");
      var inp = el("input");
      inp.type = "number"; inp.step = "any"; inp.min = "0"; inp.inputMode = "decimal";
      inp.id = "c" + i + "_" + f[0];
      inp.setAttribute("aria-label", f[1] + ", product " + (i + 1));
      td.appendChild(inp); tr.appendChild(td);
    }
    cmpBody.appendChild(tr);
  });
  CMP_OUT.forEach(function (o) {
    var tr = el("tr");
    tr.appendChild(el("th", o[1]));
    cmpOut[o[0]] = [];
    for (var i = 0; i < 4; i++) { var td = el("td", "–"); cmpOut[o[0]].push(td); tr.appendChild(td); }
    cmpBody.appendChild(tr);
  });

  function cmpState(i, base) {
    var s = {};
    for (var k in base) s[k] = base[k];
    CMP_FIELDS.forEach(function (f) {
      var v = $("c" + i + "_" + f[0]).value;
      s[f[0]] = v === "" ? 0 : parseFloat(v);
    });
    return s;
  }
  var cmpData = [];
  function renderCompare(base) {
    var m = parseFloat($("targetMargin").value);
    var best = -Infinity, bestIdx = -1;
    cmpData = [];
    for (var i = 0; i < 4; i++) {
      var used = $("c" + i + "_itemPrice").value !== "";
      if (!used) { cmpData.push(null); continue; }
      var s = cmpState(i, base);
      var r = C.compute(s);
      var t = isFinite(m) && m >= 0 && m < 100 ? C.priceForMargin(s, m) : { ok: false };
      cmpData.push({ s: s, r: r, t: t });
      if (r.profit > best) { best = r.profit; bestIdx = i; }
    }
    for (var j = 0; j < 4; j++) {
      var d = cmpData[j];
      cmpOut.total[j].textContent = d ? gbp(d.r.total) : "–";
      cmpOut.fees[j].textContent = d ? gbp(d.r.totalFees) : "–";
      cmpOut.profit[j].textContent = d ? gbp(d.r.profit) : "–";
      cmpOut.margin[j].textContent = d ? pct(d.r.marginPct) : "–";
      cmpOut.target[j].textContent = d ? (d.t.ok ? gbp(d.t.price) : "Not reachable") : "–";
      cmpOut.profit[j].className = d && j === bestIdx && cmpData.filter(Boolean).length > 1 ? "win" : "";
    }
  }

  // ----- exports -----
  var tracked = {};
  function track(name) { if (!tracked[name] && window.etsyTrack) { tracked[name] = true; window.etsyTrack(name); } }
  function status(msg) {
    var s = $("status");
    s.textContent = msg;
    clearTimeout(status.t);
    status.t = setTimeout(function () { s.textContent = ""; }, 2500);
  }
  function copyText(text, okMsg) {
    function fallback() {
      var ta = el("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand("copy"); } catch (e) {}
      ta.remove(); status(ok ? okMsg : "Copy failed. Select and copy manually.");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { status(okMsg); }, fallback);
    } else fallback();
  }
  function csvCell(v) {
    var t = String(v);
    if (/^[=+\-@\t\r]/.test(t) && isNaN(Number(t))) t = "'" + t;
    return /[",\n\r]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
  }
  function download(name, rows) {
    var text = "﻿" + rows.map(function (r) { return r.map(csvCell).join(","); }).join("\r\n") + "\r\n";
    var url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
    var a = el("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { a.remove(); URL.revokeObjectURL(url); }, 0);
  }
  function summary(s) {
    var r = C.compute(s);
    var out = ["Etsy profit estimate (UK)", ""];
    C.lines(r).forEach(function (row) { out.push(row[0] + ": " + gbp(row[1])); });
    out.push("", "Margin: " + pct(r.marginPct) + " of the total sale",
      "Calculated at https://raskyjack.com/etsycalc/ using Etsy UK fees checked " + C.FEES.verifiedLabel + ".");
    return out.join("\n");
  }

  $("copySummary").addEventListener("click", function () { track("copy_summary"); copyText(summary(read()), "Summary copied"); });
  $("copyLink").addEventListener("click", function () { track("copy_link"); copyText(shareUrl(), "Link copied"); });
  $("exportCsv").addEventListener("click", function () {
    track("export_csv");
    var s = read(), r = C.compute(s);
    var rows = [["Item", "Amount (GBP)"]];
    C.lines(r).forEach(function (row) { rows.push([row[0], C.round2(row[1]).toFixed(2)]); });
    rows.push(["Margin (% of total sale)", r.marginPct.toFixed(1)], [],
      ["Fee settings used", ""], ["Transaction %", s.transactionPct], ["Processing %", s.processingPct],
      ["Processing fixed (GBP)", s.processingFixed], ["Regulatory operating fee %", s.regulatoryPct],
      ["VAT %", s.vatPct], ["USD to GBP", s.usdToGbp], ["Fees checked", C.FEES.verified]);
    download("etsy-profit-estimate.csv", rows);
  });
  $("cmpCsv").addEventListener("click", function () {
    track("export_compare_csv");
    var rows = [["Measure"]];
    for (var i = 0; i < 4; i++) rows[0].push($("cn" + i).value || "Product " + (i + 1));
    CMP_FIELDS.forEach(function (f) {
      var row = [f[1]];
      for (var i = 0; i < 4; i++) row.push($("c" + i + "_" + f[0]).value);
      rows.push(row);
    });
    var map = { total: function (d) { return d.r.total.toFixed(2); }, fees: function (d) { return d.r.totalFees.toFixed(2); },
      profit: function (d) { return d.r.profit.toFixed(2); }, margin: function (d) { return d.r.marginPct.toFixed(1); },
      target: function (d) { return d.t.ok ? d.t.price.toFixed(2) : "n/a"; } };
    CMP_OUT.forEach(function (o) {
      var row = [o[1]];
      for (var i = 0; i < 4; i++) row.push(cmpData[i] ? map[o[0]](cmpData[i]) : "");
      rows.push(row);
    });
    download("etsy-product-comparison.csv", rows);
  });

  // ----- wiring -----
  function update() {
    $("offsiteRateRow").hidden = !$("offsiteEnabled").checked;
    $("inclVatRow").hidden = !$("vatRegistered").checked;
    if (!$("vatRegistered").checked) $("pricesIncludeVat").checked = false;
    var s = read();
    renderResults(s);
    renderHelper(s);
    renderCompare(s);
  }
  var form = $("calcForm");
  form.addEventListener("input", function () { track("calculator_used"); savePrefs(); update(); });
  form.addEventListener("change", function () { savePrefs(); update(); });
  form.addEventListener("submit", function (e) { e.preventDefault(); });
  ["targetMargin", "targetProfit"].forEach(function (id) { $(id).addEventListener("input", function () { track("price_helper_used"); update(); }); });
  $("cmpTable").addEventListener("input", function () { track("compare_used"); update(); });

  $("resetRates").addEventListener("click", function () {
    RATE_IDS.forEach(function (id) { $(id).value = defaults[id]; });
    savePrefs(); update();
  });
  $("resetAll").addEventListener("click", function () {
    NUM.concat(EXTRA).forEach(function (id) { $(id).value = defaults[id]; });
    BOOL.forEach(function (id) { $(id).checked = defaults[id]; });
    try { localStorage.removeItem(PREF_KEY); } catch (e) {}
    history.replaceState(null, "", location.pathname);
    update();
  });

  var list = $("sourceList");
  C.FEES.sources.forEach(function (src) {
    var li = el("li"), a = el("a", src.label);
    a.href = src.url; a.rel = "noopener"; a.target = "_blank";
    li.appendChild(a); list.appendChild(li);
  });

  loadPrefs();
  loadHash();
  update();
})();
