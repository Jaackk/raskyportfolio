/* Public development page. Renders the pre-built, allow-listed model embedded in index.html. All URLs are relative.
   The Overview mirrors the cinematic, image-led renderer of the main site (same markup and class names, so the shared stylesheet applies). */
(function () {
'use strict';
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
var D;
try { D = JSON.parse($('#pub-data').textContent); } catch (e) { D = null; }
if (!D) { document.getElementById('app').innerHTML = '<p class="wrap empty">This page could not be loaded.</p>'; return; }

var BCLASS = { 'ALREADY IN GAME': 'b-already', 'PARTIALLY IMPLEMENTED': 'b-partial', 'IN DEVELOPMENT': 'b-dev', PLANNED: 'b-planned' };
var BLABEL = { 'ALREADY IN GAME': 'In the game', 'PARTIALLY IMPLEMENTED': 'Partly in the game', 'IN DEVELOPMENT': 'In development', PLANNED: 'Planned' };
var BSHORT = { 'ALREADY IN GAME': 'In the game', 'PARTIALLY IMPLEMENTED': 'Partly in', 'IN DEVELOPMENT': 'In development', PLANNED: 'Planned' };
var BORDER = ['ALREADY IN GAME', 'PARTIALLY IMPLEMENTED', 'IN DEVELOPMENT', 'PLANNED'];
var STAGE_VAR = { 'Planned': 'var(--s-planned)', 'In development': 'var(--s-inprogress)', 'Being tested': 'var(--s-testing)', 'In the game': 'var(--s-verified)' };
var STAGES = ['In the game', 'Being tested', 'In development', 'Planned'];
var HUES = ['#2f6b43,#12302a', '#7a5a2a,#25392a', '#3c4f9a,#1c2a46', '#6b5a1f,#20332c', '#1f6f86,#0f2f4a', '#4a6b2a,#1d3a30', '#7a2f3a,#2d1f3f', '#2e7a74,#233f5a'];
var ICONS = {
  sword: 'M14.5 3H21v6.5L9 21.5l-3.5-3.5zM4 20l-1.5 1.5M6 14l4 4', house: 'M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6', leaf: 'M5 19C5 9 11 4 20 4c0 9-5 15-15 15zM5 19l8-8',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z', anchor: 'M12 3a2 2 0 100 4 2 2 0 000-4zM12 7v14M5 13c0 4 3 8 7 8s7-4 7-8M8 11h8',
  paw: 'M12 12c-3 0-5.5 2.5-5.5 5 0 2 2 3 5.500 3s5.500-1 5.500-3c0-2.500-2.500-5-5.500-5zM5.500 8a1.500 2 0 100 .01M9.500 4.500a1.500 2 0 100 .01M14.500 4.500a1.500 2 0 100 .01M18.500 8a1.500 2 0 100 .01',
  dragon: 'M2 19c4-1 7-5 7-10l3 3 3-3c0 5 3 9 7 10M9 9L7 4M15 9l2-5M10 15h4', hammer: 'M14 3l7 7-3 3-7-7zM12 8L3 17l4 4 9-9', mist: 'M3 8c3-2.500 6 2.500 9 0s6-2.500 9 0M3 13c3-2.500 6 2.500 9 0s6-2.500 9 0M3 18c3-2.500 6 2.500 9 0s6-2.500 9 0',
  cave: 'M3 21C3 10 7 4 12 4s9 6 9 17M8 21c0-5 2-8 4-8s4 3 4 8', crown: 'M3 19l2-11 5 5 2-8 2 8 5-5 2 11z'
};
/* page order, by excitement. Sections not named here are appended at the end. */
var BANDS = [
  { id: 'bosses', nav: 'Bosses', kind: 'bosses', sections: ['bosses'], title: 'Fight the bosses', lead: 'Big fights that reward you with rare gear.' },
  { id: 'items', nav: 'Weapons', kind: 'items', title: 'Weapons, runes and arrows', lead: '' },
  { id: 'places', nav: 'Places', kind: 'places', sections: ['worlds'], title: 'Beautiful places', lead: 'A sheltered forest, and a wide wild country around it.' },
  { id: 'creatures', nav: 'Creatures & combat', sections: ['creatures', 'combat'], title: 'Creatures and combat', lead: 'A living country to fight in, with melee, ranged and magic.' },
  { id: 'build', nav: 'Build & create', sections: ['crafting', 'creative'], title: 'Build, craft and create', lead: 'Make it, mine it, grow it, build it, and shape the world yourself.' },
  { id: 'story', nav: 'Story & quests', kind: 'story', sections: ['story', 'quests'], title: 'The story and its quests', lead: '' },
  { id: 'progress', nav: 'Skills', sections: ['skills'], title: 'Skills and progression', lead: 'Twelve skills to grow into.' },
  { id: 'multi', nav: 'Multiplayer', sections: ['multiplayer'], title: 'Play together', lead: 'Play alone, or bring a friend.' }
];
var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var FEATS = {}, lbSet = [], lbI = 0, timer = null, drawerF = null, drawerK = 0, lastFocus = null, BANDS_USED = [];
D.sections.forEach(function (s) { s.features.forEach(function (f) { FEATS[f.id] = f; }); });
var reduced = function () { return matchMedia('(prefers-reduced-motion:reduce)').matches; };
function fd(d) { var p = String(d).split('-'); return p.length === 3 ? (+p[2]) + ' ' + MON[+p[1] - 1] + ' ' + p[0] : d; }
function M(k) { return D.media[k]; }
function img(k, cls, eager) { var m = M(k); return '<img class="' + (cls || '') + '" ' + (eager ? '' : 'loading="lazy" ') + 'decoding="async" src="' + esc(m.file) + '" width="' + m.w + '" height="' + m.h + '" alt="' + esc(m.caption) + '">'; }
function pill(b) { return '<span class="bdg sm ' + BCLASS[b] + '"><i></i>' + esc(BSHORT[b]) + '</span>'; }
function badge(b) { return '<span class="bdg ' + BCLASS[b] + '"><i></i>' + esc(BLABEL[b]) + '</span>'; }
function shotsOf(f) { return f.shots.filter(M); }
function hook(f) {
  var t = String(f.blurb || '').replace(/\s+/g, ' ').trim(), m = /^(.{40,150}?[.!?])(\s|$)/.exec(t);
  return m ? m[1] : (t.length > 140 ? t.slice(0, 137).replace(/\s+\S*$/, '') + '...' : t);
}

var PAGES = [['overview', 'Overview', 'overview'], ['roadmap', 'Roadmap', 'roadmap'], ['dashboard', 'Dashboard', 'dashboard'], ['fixes', 'Bugs & Fixes', 'fixes'], ['history', 'History', 'history'], ['overview/items', 'Items', 'items'], ['overview/places', 'Places', 'places']].filter(function (p) { return D.pages[p[2]] !== false; });

/* ---------------------------------------------------------------- overview */
function hero() {
  var ids = (D.hero || []).filter(M), i0 = D.intro;
  var h = '<header class="ov-hero"><div class="ov-bg" aria-hidden="true">' + ids.map(function (id, k) { return '<div class="ov-slide' + (k === 0 ? ' on' : '') + '" data-bg="' + esc(M(id).file) + '"' + (k === 0 ? ' style="background-image:url(\'' + esc(M(id).file) + '\')"' : '') + '></div>'; }).join('') + '</div><div class="ov-veil" aria-hidden="true"></div>';
  h += '<div class="ov-hero-in"><div class="ov-kicker">' + esc(i0.kicker) + '</div><h1 class="ov-title">' + esc(i0.title) + '</h1>' + (i0.tagline ? '<p class="ov-tag">' + esc(i0.tagline) + '</p>' : '');
  h += '<div class="ov-cta"><button class="ov-btn" data-scroll="ov-first">Explore the game</button>' + (D.pages.roadmap !== false ? '<a class="ov-btn ghost" href="#roadmap">What is coming</a>' : '') + (D.pages.dashboard !== false ? '<a class="ov-btn ghost" href="#dashboard">What is new</a>' : '') + '</div></div>';
  if (ids.length > 1) h += '<div class="ov-cap" id="ovCap">' + esc(M(ids[0]).caption) + '</div>';
  h += '<button class="ov-down" data-scroll="ov-first" aria-label="Scroll down"><span></span></button>';
  return h + '</header>';
}
function bandHead(b, lead) { var l = lead !== undefined ? lead : b.lead; return '<div class="ov-bh"><h2 class="sec">' + esc(b.title) + '</h2>' + (l ? '<p class="lead">' + esc(l) + '</p>' : '') + '</div>'; }
function featuresOf(b) {
  var out = [];
  (b.sections || []).forEach(function (sid) { var s = D.sections.filter(function (x) { return x.id === sid; })[0]; if (s) out = out.concat(s.features); });
  return out;
}
function card(f) {
  var s = shotsOf(f)[0];
  return '<button class="ov-c" data-card="' + esc(f.id) + '" aria-label="Details: ' + esc(f.title) + '"><span class="ov-cimg">' + img(s) + (shotsOf(f).length > 1 ? '<em>' + shotsOf(f).length + ' pictures</em>' : '') + '</span><span class="ov-cbody"><span class="ov-crow"><b>' + esc(f.title) + '</b>' + pill(f.badge) + '</span><span class="ov-cline">' + esc(hook(f)) + '</span></span></button>';
}
function cardGrid(feats) { var w = feats.filter(function (f) { return shotsOf(f).length; }); return w.length ? '<div class="ov-cgrid">' + w.map(card).join('') + '</div>' : ''; }
function bossesBand(b) {
  var feats = featuresOf(b).filter(function (f) { return shotsOf(f).length; });
  if (!feats.length) return '';
  var h = '<section class="ov-band ov-bosses" id="ov-bosses"><div class="ov-bgfx" style="background-image:url(\'' + esc(M(shotsOf(feats[0])[0]).file) + '\')" aria-hidden="true"></div><div class="wrap">' + bandHead(b) + '</div><div class="ov-rail-wrap"><div class="ov-rail" data-rail>';
  h += feats.map(function (f) { var k = shotsOf(f)[0]; return '<button class="ov-boss" data-card="' + esc(f.id) + '" aria-label="Details: ' + esc(f.title) + '">' + img(k) + '<span class="ov-bover"></span><span class="ov-btext">' + pill(f.badge) + '<b>' + esc(f.title) + '</b><span>' + esc(hook(f)) + '</span></span></button>'; }).join('');
  return h + '</div><button class="rail-prev" data-rail-go="-1" aria-label="Previous">&#8249;</button><button class="rail-next" data-rail-go="1" aria-label="Next">&#8250;</button></div></section>';
}
function itemsBand(b) {
  var G = D.pages.items === false ? [] : D.itemGroups; if (!G.length) return '';
  var h = '<section class="ov-band ov-itemsband" id="ov-items"><div class="wrap">' + bandHead(b, D.itemsNote || b.lead);
  h += '<div class="ov-tabs" role="tablist">' + G.map(function (g, k) { return '<button role="tab" class="' + (k === 0 ? 'on' : '') + '" data-tab="' + k + '" aria-selected="' + (k === 0) + '">' + esc(g.title) + '<small>' + g.items.length + '</small></button>'; }).join('') + '</div></div>';
  h += G.map(function (g, k) {
    return '<div class="ov-rail-wrap ov-tabpanel" data-panel="' + k + '"' + (k === 0 ? '' : ' hidden') + '><div class="wrap">' + (g.lead ? '<p class="muted small ov-ilead">' + esc(g.lead) + '</p>' : '') + '</div><div class="ov-rail ov-irail" data-rail>' + g.items.map(function (i) {
      return '<figure class="ov-ic"><div class="ov-ii">' + img(i.img) + '</div><figcaption><b>' + esc(i.name) + '</b>' + (i.tag ? '<span class="ov-itag">' + esc(i.tag) + '</span>' : '') + (i.desc ? '<em>' + esc(i.desc) + '</em>' : '') + '</figcaption></figure>';
    }).join('') + '</div><button class="rail-prev" data-rail-go="-1" aria-label="Previous">&#8249;</button><button class="rail-next" data-rail-go="1" aria-label="Next">&#8250;</button></div>';
  }).join('');
  return h + '</section>';
}
function placesBand(b) {
  var ids = D.pages.places === false ? [] : (D.places || []).filter(M);
  var grid = cardGrid(featuresOf(b));
  if (!ids.length && !grid) return '';
  var h = '<section class="ov-band ov-placesband" id="ov-places"><div class="wrap">' + bandHead(b, b.lead || D.placesNote);
  if (ids.length) h += '<div class="ov-mosaic">' + ids.map(function (id, k) { return '<button class="ov-place p' + k + '" data-place="' + k + '" aria-label="Enlarge: ' + esc(M(id).caption) + '">' + img(id) + '<span>' + esc(M(id).caption) + '</span></button>'; }).join('') + '</div>';
  return h + grid + '</div></section>';
}
function storyBand(b) {
  var i0 = D.intro, sideId = (D.places || [])[2] || (D.hero || [])[0], side = sideId && M(sideId);
  var h = '<section class="ov-band" id="ov-story"><div class="wrap">' + bandHead(b);
  h += '<div class="ov-story"><div>' + (i0.story || []).map(function (p) { return '<p class="prose">' + esc(p) + '</p>'; }).join('') + '</div>';
  if (side) h += '<figure class="ov-fig">' + img(sideId) + '<figcaption>' + esc(side.caption) + '</figcaption></figure>';
  return h + '</div>' + cardGrid(featuresOf(b)) + '</div></section>';
}
function plainBand(b) { var g = cardGrid(featuresOf(b)); return g ? '<section class="ov-band" id="ov-' + esc(b.id) + '"><div class="wrap">' + bandHead(b) + g + '</div></section>' : ''; }
function bands() {
  var used = {}; BANDS.forEach(function (b) { (b.sections || []).forEach(function (s) { used[s] = 1; }); });
  var rest = D.sections.filter(function (s) { return !used[s.id]; }).map(function (s) { return { id: s.id, nav: s.nav || s.title, title: s.title, lead: s.lead, sections: [s.id] }; });
  BANDS_USED = [];
  return BANDS.concat(rest).map(function (b) {
    var html = b.kind === 'bosses' ? bossesBand(b) : b.kind === 'items' ? itemsBand(b) : b.kind === 'places' ? placesBand(b) : b.kind === 'story' ? storyBand(b) : plainBand(b);
    if (html) BANDS_USED.push(b);
    return html;
  }).join('');
}
function comingSoon() {
  var feats = []; D.sections.forEach(function (s) { s.features.forEach(function (f) { if (!shotsOf(f).length) feats.push(f); }); });
  if (!feats.length) return '';
  return '<section class="ov-band ov-soon" id="ov-soon"><div class="wrap"><h2 class="sec">Coming soon and in the works</h2><p class="lead">No picture yet. Click one for the details.</p><div class="ov-soonrow">' + feats.map(function (f) { return '<button class="ov-sp" data-card="' + esc(f.id) + '"><i class="' + BCLASS[f.badge] + '"></i>' + esc(f.title) + '<span>' + esc(BSHORT[f.badge]) + '</span></button>'; }).join('') + '</div></div></section>';
}
function glance() {
  var c = D.counts, items = [[c['ALREADY IN GAME'], 'in the game', 'b-already'], [c['PARTIALLY IMPLEMENTED'], 'partly in', 'b-partial'], [c['IN DEVELOPMENT'], 'in development', 'b-dev'], [c.PLANNED, 'planned', 'b-planned']];
  var h = '<section class="ov-sec wrap ov-glance" id="ov-about" aria-label="At a glance"><div class="gl-badges">' + items.map(function (x) { return '<div class="gl ' + x[2] + '"><b>' + x[0] + '</b><span>' + x[1] + '</span></div>'; }).join('') + '</div>';
  h += '<p class="gl-note">Each badge reflects how far the work has really got. ' + esc(D.imagesNote) + '</p>';
  return h + '<div class="ov-legend"><h3>How to read the badges</h3><div class="lg-row">' + BORDER.map(badge).join('') + '</div><p>' + esc(D.intro.badgeNote) + '</p></div></section>';
}
function secNav() {
  return '<nav class="ov-secnav" aria-label="Overview sections"><div class="wrap">' + BANDS_USED.map(function (x) { return '<button data-scroll="ov-' + esc(x.id) + '">' + esc(x.nav || x.title) + '</button>'; }).join('') + '</div></nav>';
}
function overview() {
  var body = bands();
  var first = BANDS_USED.length ? 'ov-' + BANDS_USED[0].id : 'ov-about';
  return hero().replace(/ov-first/g, first) + secNav() + body + comingSoon() + glance();
}

/* ------------------------------------------------------------------ drawer */
function openDrawer(id) {
  var f = FEATS[id]; if (!f) return; drawerF = f; drawerK = 0; lastFocus = document.activeElement;
  var dr = $('#dr'); dr.hidden = false; document.body.classList.add('noscroll'); drawerRender(); $('.dr-x', dr).focus();
}
function drawerRender() {
  var f = drawerF, shots = shotsOf(f), h = '';
  if (shots.length) {
    var m = M(shots[drawerK]);
    h += '<div class="dr-gal"><img src="' + esc(m.file) + '" width="' + m.w + '" height="' + m.h + '" alt="' + esc(m.caption) + '">' + (shots.length > 1 ? '<button class="gl-prev" data-dr-step="-1" aria-label="Previous picture">&#8249;</button><button class="gl-next" data-dr-step="1" aria-label="Next picture">&#8250;</button>' : '') + '<div class="gl-cap">' + esc(m.caption) + '</div></div>';
    if (shots.length > 1) h += '<div class="dr-thumbs">' + shots.map(function (s, k) { return '<button class="' + (k === drawerK ? 'on' : '') + '" data-dr-k="' + k + '" aria-label="Picture ' + (k + 1) + '"><img loading="lazy" src="' + esc(M(s).file) + '" alt=""></button>'; }).join('') + '</div>';
  }
  h += '<div class="dr-text"><div class="ov-ct">' + badge(f.badge) + (f.tag ? '<span class="ov-tagc">' + esc(f.tag) + '</span>' : '') + '</div><h3>' + esc(f.title) + '</h3>' + (f.blurb ? '<p>' + esc(f.blurb) + '</p>' : '');
  if (f.note) h += '<p class="ov-note">' + esc(f.note) + '</p>';
  if (f.newWork === 'tested') h += '<p class="ov-sub"><b>New additions</b> to this are in the game build and being tested.</p>';
  else if (f.newWork === 'dev') h += '<p class="ov-sub"><b>More</b> is in development.</p>';
  $('#drBody').innerHTML = h + '</div>';
}
function closeDrawer() { var dr = $('#dr'); if (dr.hidden) return; dr.hidden = true; document.body.classList.remove('noscroll'); if (lastFocus && lastFocus.focus) lastFocus.focus(); }

/* ----------------------------------------------------------------- roadmap */
function roadmap() {
  var h = '<section class="wrap"><h2 class="sec">Roadmap<span class="n">' + D.roadmap.length + '</span></h2><p class="lead">What is coming to the game, in plain words. Each bar shows how far the work has got: planned, in development, being tested and in the game.</p><div class="themes">';
  D.roadmap.forEach(function (t, k) {
    var hue = HUES[k % HUES.length].split(',');
    h += '<article class="theme"><div class="banner" style="--h1:' + hue[0] + ';--h2:' + hue[1] + '"><span class="era">' + esc(t.era) + '</span><svg viewBox="0 0 24 24" fill="none" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="' + (ICONS[t.icon] || ICONS.leaf) + '"/></svg><h3>' + esc(t.title) + '</h3></div><div class="tbody">';
    h += '<p class="pitch">' + esc(t.pitch) + '</p>';
    if (t.experience.length) h += '<ul class="exp">' + t.experience.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    if (t.soon) h += '<div class="soon">' + esc(t.soon) + '</div>';
    h += '<div><div class="bar" title="' + t.progress + '% along the road">';
    STAGES.forEach(function (s) { t.segments.forEach(function (g) { if (g.s === s) h += '<i style="--c:' + STAGE_VAR[s] + ';width:' + g.pct + '%" title="' + esc(s) + '"></i>'; }); });
    h += '</div><div class="pstat"><span><b>' + t.progress + '%</b> along the road</span></div></div>';
    h += '<div class="legend">' + STAGES.filter(function (s) { return t.segments.some(function (g) { return g.s === s; }); }).map(function (s) { return '<span style="--c:' + STAGE_VAR[s] + '">' + esc(s) + '</span>'; }).join('') + '</div>';
    h += '</div></article>';
  });
  return h + '</div></section>';
}

/* ------------------------------------------------- dashboard, bugs and fixes, history */
var FSTAGE_VAR = { 'Open': 'var(--s-planned)', 'Being fixed': 'var(--s-inprogress)', 'Fix being tested': 'var(--s-testing)', 'Fixed': 'var(--s-verified)', 'Came back': 'var(--s-inprogress)', 'Waiting': 'var(--s-planned)' };
var FSTAGES = ['Came back', 'Open', 'Being fixed', 'Fix being tested', 'Fixed', 'Waiting'];
var F = { dash: { q: '', stage: '', area: '' }, fixes: { q: '', stage: '', area: '' }, hist: { q: '', area: '' } };
function hay(w) { return (w.title + ' ' + w.summary + ' ' + w.area + ' ' + w.stage + ' ' + w.story.map(function (s) { return s.label + ' ' + s.text; }).join(' ')).toLowerCase(); }
function matches(w, f) {
  if (f.stage && w.stage !== f.stage) return false;
  if (f.area && w.area !== f.area) return false;
  return !f.q || f.q.toLowerCase().split(/\s+/).every(function (t) { return hay(w).indexOf(t) >= 0; });
}
function itemCard(w, vars) {
  var h = '<details class="item" style="--c:' + (vars[w.stage] || 'var(--gold)') + '" id="' + esc(w.id) + '"><summary><span class="ti">' + esc(w.title) + '</span><span class="meta"><span class="area">' + esc(w.area) + '</span>' + (w.cameBack ? '<span class="tag warn">came back</span>' : '') + '<span class="pill" style="--c:' + (vars[w.stage] || 'var(--gold)') + '">' + esc(w.stage) + '</span></span>' + (w.summary ? '<span class="sub">' + esc(w.summary) + '</span>' : '') + '</summary><div class="det">';
  if (w.summary) h += '<div><h4>What it is</h4><p>' + esc(w.summary) + '</p></div>';
  h += '<div class="kv"><span>' + esc(w.area) + '</span>' + (w.reported ? '<span>first recorded ' + esc(fd(w.reported)) + '</span>' : '') + (w.updated ? '<span>updated ' + esc(fd(w.updated)) + '</span>' : '') + (w.tries ? '<span>' + w.tries + ' fix attempt' + (w.tries > 1 ? 's' : '') + '</span>' : '') + '</div>';
  if (w.story.length) h += '<div><h4>The story so far</h4><ul class="tl">' + w.story.map(function (s) { return '<li><time>' + esc(fd(s.date)) + '</time><b>' + esc(s.label) + '</b>' + (s.text ? '<div>' + esc(s.text) + '</div>' : '') + '</li>'; }).join('') + '</ul></div>';
  return h + '</div></details>';
}
function chipRow(stages, counts, vars, key) {
  return '<div class="chips">' + stages.map(function (s) { return '<button class="chip' + (F[key].stage === s ? ' on' : '') + '" data-chip="' + esc(s) + '" data-key="' + key + '" style="--c:' + vars[s] + '"><b>' + (counts[s] || 0) + '</b><span>' + esc(s) + '</span></button>'; }).join('') + '</div>';
}
function filterBar(key, stages, areas, ph) {
  var f = F[key];
  return '<section class="filters" aria-label="Search and filters"><input data-f="q" data-key="' + key + '" type="search" placeholder="' + esc(ph) + '" value="' + esc(f.q) + '" autocomplete="off">' + (stages ? '<select data-f="stage" data-key="' + key + '" aria-label="Status"><option value="">All statuses</option>' + stages.map(function (s) { return '<option' + (f.stage === s ? ' selected' : '') + '>' + esc(s) + '</option>'; }).join('') + '</select>' : '') + '<select data-f="area" data-key="' + key + '" aria-label="Area"><option value="">All areas</option>' + areas.map(function (s) { return '<option' + (f.area === s ? ' selected' : '') + '>' + esc(s) + '</option>'; }).join('') + '</select><button class="ghost" data-clear="' + key + '">Clear</button><span class="muted" id="fc-' + key + '"></span></section>';
}
function groups(list, stages, vars, f, empty) {
  var any = false, h = '';
  stages.forEach(function (s) {
    var rows = list.filter(function (w) { return w.stage === s && matches(w, f); });
    if (!rows.length) return; any = true;
    h += '<h2 class="sec">' + esc(s) + '<span class="n">' + rows.length + '</span></h2><div class="items">' + rows.map(function (w) { return itemCard(w, vars); }).join('') + '</div>';
  });
  return any ? h : '<div class="empty">' + empty + '</div>';
}
function dashboard() {
  var DB = D.dashboard;
  var h = '<section class="wrap"><div class="hero"><h1>Where the game stands</h1><p>The development of the game in plain words: what is being built right now, what is new, what is being tested and what is already in the game. Open any card for its story so far.</p>' + chipRow(STAGES, DB.counts, STAGE_VAR, 'dash');
  h += '<div class="now"><div class="box"><h3><span class="pulse"></span>Currently in progress</h3><ul class="nowlist">' + (DB.active.length ? DB.active.map(function (a) { return '<li><b>' + esc(a.title) + '</b>' + (a.summary ? '<small>' + esc(a.summary) + '</small>' : '') + '</li>'; }).join('') : '<li class="muted">Nothing is marked as in progress right now.</li>') + '</ul></div>';
  h += '<div class="box"><h3>Latest updates</h3><ul class="nowlist">' + DB.updates.slice(0, 7).map(function (u) { return '<li><b>' + esc(u.title) + '</b> <span class="area">' + esc(u.label) + '</span><small>' + esc(fd(u.date)) + (u.text ? ' &middot; ' + esc(u.text) : '') + '</small></li>'; }).join('') + '</ul></div></div></div></section>';
  h += filterBar('dash', STAGES, DB.areas, 'Search what is being built...');
  h += '<section class="wrap" id="dlist">' + groups(D.work, STAGES, STAGE_VAR, F.dash, 'Nothing matches these filters.') + '</section>';
  return h;
}
function fixes() {
  var DB = D.dashboard;
  var h = '<section class="wrap"><div class="hero"><h1>Bugs and fixes</h1><p>Problems found while building the game, and what was tried. Some fixes work first time; some come back and need another go. Nothing is hidden: if a fix did not hold, the story says so.</p>' + chipRow(FSTAGES, DB.fixCounts, FSTAGE_VAR, 'fixes') + '</div></section>';
  h += filterBar('fixes', FSTAGES, DB.areas, 'Search problems and fixes...');
  h += '<section class="wrap" id="dlist">' + groups(D.fixes, FSTAGES, FSTAGE_VAR, F.fixes, 'Nothing matches these filters.') + '</section>';
  return h;
}
function historyRows() {
  var f = F.hist, H = D.history, q = f.q.toLowerCase().split(/\s+/).filter(Boolean), out = '', lastMonth = '', n = 0;
  H.entries.forEach(function (e) {
    if (f.area && e.area !== f.area) return;
    var text = (e.text + ' ' + e.bullets.join(' ') + ' ' + e.area).toLowerCase();
    if (!q.every(function (t) { return text.indexOf(t) >= 0; })) return;
    n++;
    var mon = e.date.slice(0, 7);
    if (mon !== lastMonth) { var p = mon.split('-'); out += '<h2 class="sec">' + MON[+p[1] - 1] + ' ' + p[0] + '</h2>'; lastMonth = mon; }
    var head = '<span class="ti">' + esc(e.text) + '</span><span class="meta"><span class="area">' + esc(e.area) + '</span><span class="tag">' + esc(fd(e.date)) + '</span></span>';
    out += e.bullets.length ? '<details class="item" style="--c:var(--gold)"><summary>' + head + '<span class="sub">' + e.bullets.length + ' more change' + (e.bullets.length > 1 ? 's' : '') + ' that day</span></summary><div class="det"><ul class="exp">' + e.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul></div></details>' : '<div class="item" style="--c:var(--gold)"><div class="det" style="border:0;padding:11px 14px;display:flex;gap:12px;justify-content:space-between;flex-wrap:wrap"><span class="ti">' + esc(e.text) + '</span><span class="meta"><span class="area">' + esc(e.area) + '</span><span class="tag">' + esc(fd(e.date)) + '</span></span></div></div>';
  });
  return [n, n ? out : '<div class="empty">Nothing matches these filters.</div>'];
}
function history() {
  var H = D.history, M2 = D.progress.milestones;
  var h = '<section class="wrap"><div class="hero"><h1>How it came together</h1><p>A plain-language timeline of the work, day by day. Open a day to see what else changed.</p></div>';
  if (M2.length) h += '<h2 class="sec">Milestones<span class="n">' + M2.length + '</span></h2><ol class="pub-tl pub-tl-wide">' + M2.map(function (m) { return '<li><time>' + esc(fd(m.date)) + '</time><b>' + esc(m.title) + '</b>' + (m.text ? '<p>' + esc(m.text) + '</p>' : '') + '</li>'; }).join('') + '</ol>';
  h += '</section>' + filterBar('hist', null, H.areas, 'Search the timeline...');
  return h + '<section class="wrap items" id="hlist">' + historyRows()[1] + '</section>';
}
function refreshList(key) {
  var c = $('#dlist') || $('#hlist'); if (!c) return;
  if (key === 'hist') { var r = historyRows(); c.innerHTML = r[1]; var fc = $('#fc-hist'); if (fc) fc.textContent = r[0] + ' days'; return; }
  var list = key === 'fixes' ? D.fixes : D.work, st = key === 'fixes' ? FSTAGES : STAGES, vars = key === 'fixes' ? FSTAGE_VAR : STAGE_VAR;
  c.innerHTML = groups(list, st, vars, F[key], 'Nothing matches these filters.');
  $$('.chip').forEach(function (b) { if (b.dataset.key === key) b.classList.toggle('on', F[key].stage === b.dataset.chip); });
}

/* ---------------------------------------------------------------- lightbox */
function showLb() {
  var m = M(lbSet[lbI]); if (!m) return;
  var lb = $('#lb'); lb.hidden = false; $('img', lb).src = m.file; $('img', lb).alt = m.caption;
  $('figcaption', lb).textContent = m.caption;
  lb.classList.toggle('single', lbSet.length < 2);
}
function closeLb() { $('#lb').hidden = true; }
function startHero() {
  clearInterval(timer);
  var slides = $$('.ov-slide'); if (!slides.length) return;
  var load = function () { slides.forEach(function (s) { if (!s.style.backgroundImage) s.style.backgroundImage = 'url(\'' + s.dataset.bg + '\')'; }); };
  if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 4000 }); else setTimeout(load, 2500);
  if (slides.length < 2 || reduced()) return;
  var ids = (D.hero || []).filter(M), k = 0;
  timer = setInterval(function () { slides[k].classList.remove('on'); k = (k + 1) % slides.length; slides[k].classList.add('on'); var c = $('#ovCap'); if (c) c.textContent = M(ids[k]).caption; }, 7000);
}
function reveal() {
  if (reduced() || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
  $$('.ov-band').forEach(function (b) { b.classList.add('rv'); io.observe(b); });
}

/* ------------------------------------------------------------------ router */
var VIEWS = { overview: overview, roadmap: roadmap, dashboard: dashboard, fixes: fixes, history: history };
function route() {
  var parts = (location.hash || '').replace('#', '').split('/'), v = parts[0];
  if (!VIEWS[v] || D.pages[v] === false) v = PAGES.length ? PAGES[0][0] : 'overview';
  closeDrawer(); closeLb();
  $('#app').innerHTML = VIEWS[v]();
  $$('#nav a').forEach(function (a) { a.classList.toggle('on', a.dataset.p === (v === 'overview' && parts[1] ? 'overview/' + parts[1] : v)); });
  document.body.dataset.view = v;
  window.scrollTo(0, 0);
  if (v === 'overview') { startHero(); reveal(); if (parts[1]) { var tgt = document.getElementById('ov-' + parts[1]); if (tgt) { tgt.classList.add('in'); tgt.scrollIntoView(); } } } else clearInterval(timer);
  if (v === 'history') refreshList('hist');
}
$('#nav').innerHTML = PAGES.map(function (n) { return '<a href="#' + n[0] + '" data-p="' + n[0] + '">' + esc(n[1]) + '</a>'; }).join('');
$('#gen').textContent = D.updated ? 'Updated ' + fd(D.updated) : '';
$('#themeBtn').onclick = function () { var t = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'; document.documentElement.dataset.theme = t; try { localStorage.setItem('pub-theme', t); } catch (e) { /* storage unavailable */ } };
document.addEventListener('click', function (e) {
  var t = e.target.closest('button,a'); if (!t || !$('#app').contains(t)) return;
  if (t.dataset.scroll) { var el = document.getElementById(t.dataset.scroll); if (el) el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' }); return; }
  if (t.dataset.railGo) { var r = t.closest('.ov-rail-wrap').querySelector('[data-rail]'); r.scrollBy({ left: +t.dataset.railGo * Math.max(260, r.clientWidth * 0.8), behavior: reduced() ? 'auto' : 'smooth' }); return; }
  if (t.dataset.tab != null) {
    $$('.ov-tabs button').forEach(function (b) { var on = b === t; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
    $$('.ov-tabpanel').forEach(function (p) { p.hidden = p.dataset.panel !== t.dataset.tab; });
    return;
  }
  if (t.dataset.chip != null) { var kk = t.dataset.key; F[kk].stage = F[kk].stage === t.dataset.chip ? '' : t.dataset.chip; var sel = $('select[data-f=stage][data-key=' + kk + ']'); if (sel) sel.value = F[kk].stage; refreshList(kk); return; }
  if (t.dataset.clear) { var ck = t.dataset.clear; F[ck] = ck === 'hist' ? { q: '', area: '' } : { q: '', stage: '', area: '' }; $$('.filters input, .filters select').forEach(function (e) { if (e.dataset.key === ck) e.value = ''; }); refreshList(ck); return; }
  if (t.dataset.card) { openDrawer(t.dataset.card); return; }
  if (t.dataset.place) { lbSet = (D.places || []).filter(M); lbI = +t.dataset.place; showLb(); }
});
var dr = $('#dr'), lb = $('#lb');
dr.addEventListener('click', function (e) {
  var t = e.target.closest('[data-dr-close],[data-dr-step],[data-dr-k]'); if (!t) return;
  if (t.hasAttribute('data-dr-close')) closeDrawer();
  else if (t.dataset.drStep) { var n = shotsOf(drawerF).length; drawerK = (drawerK + +t.dataset.drStep + n) % n; drawerRender(); }
  else if (t.dataset.drK) { drawerK = +t.dataset.drK; drawerRender(); }
});
lb.addEventListener('click', function (e) {
  if (e.target.closest('.lb-x') || e.target === lb) closeLb();
  else if (e.target.closest('.lb-n')) { lbI = (lbI + 1) % lbSet.length; showLb(); }
  else if (e.target.closest('.lb-p')) { lbI = (lbI - 1 + lbSet.length) % lbSet.length; showLb(); }
});
document.addEventListener('keydown', function (e) {
  if (!lb.hidden) {
    if (e.key === 'Escape') closeLb(); else if (e.key === 'ArrowRight' && lbSet.length > 1) { lbI = (lbI + 1) % lbSet.length; showLb(); } else if (e.key === 'ArrowLeft' && lbSet.length > 1) { lbI = (lbI - 1 + lbSet.length) % lbSet.length; showLb(); }
  } else if (!dr.hidden) {
    if (e.key === 'Escape') closeDrawer();
    else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && shotsOf(drawerF).length > 1) { var n = shotsOf(drawerF).length; drawerK = (drawerK + (e.key === 'ArrowRight' ? 1 : -1) + n) % n; drawerRender(); }
  }
});
document.addEventListener('input', function (e) { var t = e.target; if (!t.dataset || !t.dataset.f) return; F[t.dataset.key][t.dataset.f] = t.value; refreshList(t.dataset.key); });
window.addEventListener('hashchange', route);
route();
})();
