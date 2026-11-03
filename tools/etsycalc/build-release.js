"use strict";
/*
 * Builds a deploy folder that equals the currently live Netlify deploy, plus the calculator changes only.
 *
 *   node tools/etsycalc/build-release.js --out <dir> --manifest <live-manifest.json> [--base <git ref>]
 *
 * The live manifest comes from `netlify api listSiteFiles` (path + sha per file). The script:
 *   1. extracts the live-equivalent git tree (the base ref),
 *   2. removes everything that is not part of the live deploy (unpublished work in the repo),
 *   3. swaps in etsycalc/ (without tests), adds the new sitemap entries and the /etsycalc/* headers,
 *   4. compares every file to the live manifest and fails if anything outside the calculator changed.
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const args = process.argv.slice(2);
const arg = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const OUT = path.resolve(arg("--out"));
const MANIFEST = arg("--manifest");
const BASE = arg("--base", "rollback/live-2026-11-03-base");
const REPO = path.resolve(__dirname, "..", "..");
if (!arg("--out") || !MANIFEST) {
  console.error("usage: build-release.js --out <dir> --manifest <file> [--base <ref>]");
  process.exit(2);
}

// Files whose live content matches an older commit than the base.
const PINS = { CNAME: "3195662", "README.md": "d9604be" };

const norm = (p) => p.replace(/\\/g, "/").replace(/^\//, "").normalize("NFC").toLowerCase();
const sha1 = (buf) => crypto.createHash("sha1").update(buf).digest("hex");
function walk(dir, base = dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, base, acc);
    else acc.push(path.relative(base, full).replace(/\\/g, "/"));
  }
  return acc;
}
function git(argv, opts) {
  const r = spawnSync("git", argv, Object.assign({ cwd: REPO, maxBuffer: 1 << 28 }, opts));
  if (r.status !== 0) throw new Error("git " + argv.join(" ") + ": " + r.stderr);
  return r.stdout;
}

const live = new Map(JSON.parse(fs.readFileSync(MANIFEST, "utf8")).map((f) => [norm(f.path), f.sha]));

// 1. extract the base tree
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const tarPath = path.join(path.dirname(OUT), "release-base.tar");
git(["-c", "core.autocrlf=false", "-c", "core.eol=lf", "archive", "--format=tar", "-o", tarPath, BASE]);
const fwd = (p) => p.split(path.sep).join("/");
const t = spawnSync("tar", ["--force-local", "-xf", fwd(tarPath), "-C", fwd(OUT)]);
if (t.status !== 0) throw new Error("tar failed: " + t.stderr);
fs.rmSync(tarPath);

// 2. drop anything that is not in the live deploy
const dropped = [];
for (const rel of walk(OUT)) {
  if (!live.has(norm(rel))) {
    fs.rmSync(path.join(OUT, rel));
    dropped.push(rel);
  }
}
for (const [f, c] of Object.entries(PINS)) fs.writeFileSync(path.join(OUT, f), git(["show", `${c}:${f}`]));

// 3. calculator overlay
fs.rmSync(path.join(OUT, "etsycalc"), { recursive: true, force: true });
const SRC = path.join(REPO, "etsycalc");
for (const rel of walk(SRC)) {
  if (rel.startsWith("tests/")) continue;
  const dest = path.join(OUT, "etsycalc", rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(SRC, rel), dest);
}

// sitemap: keep the live file, add the calculator entries from the working copy
let sm = fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8");
const eol = sm.includes("\r\n") ? "\r\n" : "\n";
const repoSm = fs.readFileSync(path.join(REPO, "sitemap.xml"), "utf8");
const urls = repoSm.split(/\r?\n/).filter((l) => /<loc>https:\/\/raskyjack\.com\/etsycalc\//.test(l));
sm = sm.split(/\r?\n/).filter((l) => !/<loc>https:\/\/raskyjack\.com\/etsycalc\//.test(l)).join(eol);
sm = sm.replace("</urlset>", urls.join(eol) + eol + "</urlset>");
fs.writeFileSync(path.join(OUT, "sitemap.xml"), sm);

// headers: keep the live file, append the /etsycalc/* block
let hd = fs.readFileSync(path.join(OUT, "_headers"), "utf8");
const repoHd = fs.readFileSync(path.join(REPO, "_headers"), "utf8");
const at = repoHd.indexOf("# Etsy calculator pages only");
if (at < 0) throw new Error("headers block missing in repo _headers");
if (!hd.includes("# Etsy calculator pages only")) {
  hd = hd.replace(/\s*$/, "") + eol + eol + repoHd.slice(at).replace(/\r?\n/g, eol);
  fs.writeFileSync(path.join(OUT, "_headers"), hd);
}

// 4. verify against the live manifest
const ALLOWED_CHANGED = (rel) => rel.startsWith("etsycalc/") || rel === "sitemap.xml" || rel === "_headers";
const result = { unchanged: 0, changed: [], added: [], missing: [], unexpected: [] };
const seen = new Set();
for (const rel of walk(OUT)) {
  const key = norm(rel);
  seen.add(key);
  const buf = fs.readFileSync(path.join(OUT, rel));
  if (!live.has(key)) {
    (rel.startsWith("etsycalc/") ? result.added : result.unexpected).push(rel);
  } else if (live.get(key) === sha1(buf)) {
    result.unchanged++;
  } else {
    (ALLOWED_CHANGED(rel) ? result.changed : result.unexpected).push(rel);
  }
}
for (const key of live.keys()) if (!seen.has(key)) result.missing.push(key);

console.log("deploy folder:", OUT);
console.log("dropped (in repo but not live):", dropped.length, dropped.slice(0, 3).join(", "), dropped.length > 3 ? "..." : "");
console.log("unchanged vs live:", result.unchanged);
console.log("changed (allowed):", result.changed.join(", "));
console.log("added under etsycalc/:", result.added.length);
console.log("missing from deploy (live files that would be deleted):", result.missing.length ? result.missing.join(", ") : "none (apart from the old etsycalc files)");
const missingOutside = result.missing.filter((m) => !m.startsWith("etsycalc/"));
console.log("UNEXPECTED:", result.unexpected.length ? result.unexpected.join(", ") : "none");
const removedEtsy = result.missing.filter((m) => m.startsWith("etsycalc/"));
console.log("old etsycalc files replaced/removed:", removedEtsy.join(", ") || "none");
fs.writeFileSync(path.join(path.dirname(OUT), "release-report.json"), JSON.stringify({ ...result, dropped }, null, 1));
if (result.unexpected.length || missingOutside.length) {
  console.error("FAIL: release differs from live outside the calculator");
  process.exit(1);
}
console.log("OK");
