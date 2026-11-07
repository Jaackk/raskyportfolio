/* Forum page. The same file runs on the private and the public development pages. It talks to the forum API named in forum-config.json.
   No accounts: a random code is made once in this browser (kept in local storage) and only a one-way hash of it is stored by the API.
   All text is shown with textContent or escaped; nothing from the API is ever inserted as markup. */
(function () {
'use strict';
var TOKEN_KEY = 'shnork-forum-token', NAME_KEY = 'shnork-forum-name';
var TS_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
var REASONS = [['spam', 'Spam or advertising'], ['abuse', 'Rude or hateful'], ['personal', 'Personal information'], ['offtopic', 'Off topic'], ['other', 'Something else']];
var LIM = { name: [2, 24], title: [4, 100], thread: [10, 2000], reply: [2, 1200] };

var cfg = null, meta = null, root = null, memToken = '', tsId = null, tsToken = '', tsBox = null, loadingCfg = null;
var S = { cat: '', sort: 'new', q: '', page: 1 };

var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
var $ = function (s, r) { return (r || root).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || root).querySelectorAll(s)); };
var reduced = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches; };

/* ---------------------------------------------------------------- storage */
function store(k, v) {
  try { if (v === undefined) return localStorage.getItem(k) || ''; localStorage.setItem(k, v); return v; } catch (e) { return v === undefined ? '' : v; }
}
function token() {
  var t = store(TOKEN_KEY) || memToken;
  if (/^[a-f0-9]{64}$/.test(t)) return t;
  var b = new Uint8Array(32); (window.crypto || window.msCrypto).getRandomValues(b);
  t = Array.prototype.map.call(b, function (x) { return (x < 16 ? '0' : '') + x.toString(16); }).join('');
  memToken = t; store(TOKEN_KEY, t);
  return t;
}

/* -------------------------------------------------------------------- api */
function api(method, path, body) {
  var h = { 'X-Forum-Token': token() };
  var init = { method: method, headers: h, cache: 'no-store', credentials: 'omit' };
  if (body !== undefined) { h['Content-Type'] = 'application/json'; init.body = JSON.stringify(body); }
  return fetch(cfg.apiBase + path, init).then(function (r) {
    return r.json().catch(function () { return null; }).then(function (j) {
      if (r.ok && j) return j;
      var e = new Error((j && j.error && j.error.message) || 'The forum could not be reached. Please try again.');
      e.code = (j && j.error && j.error.code) || 'network'; e.status = r.status; e.retryAfter = (j && j.error && j.error.retryAfter) || 0;
      throw e;
    });
  }, function () { var e = new Error('The forum could not be reached. Please check your connection and try again.'); e.code = 'network'; throw e; });
}
function loadConfig() {
  if (cfg) return Promise.resolve(cfg);
  if (!loadingCfg) loadingCfg = fetch('forum-config.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).catch(function () { return {}; }).then(function (c) {
    cfg = { apiBase: typeof c.apiBase === 'string' ? c.apiBase.replace(/\/+$/, '') : '', turnstileSiteKey: typeof c.turnstileSiteKey === 'string' ? c.turnstileSiteKey : '' };
    return cfg;
  });
  return loadingCfg;
}

/* ---------------------------------------------------------------- helpers */
var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function ago(ms) {
  var s = Math.max(0, Math.round((Date.now() - ms) / 1000));
  if (s < 45) return 'just now';
  if (s < 3600) return Math.round(s / 60) + ' min ago';
  if (s < 86400) return Math.round(s / 3600) + ' h ago';
  if (s < 86400 * 14) return Math.round(s / 86400) + ' days ago';
  var d = new Date(ms); return d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear();
}
function catLabel(id) {
  var c = ((meta && meta.categories) || []).filter(function (x) { return x.id === id; })[0];
  return c ? c.label : id;
}
function say(msg, kind) {
  var el = $('.fm-say'); if (!el) return;
  el.className = 'fm-say' + (msg ? ' ' + (kind || 'info') : ''); el.textContent = msg || '';
}
function fail(e) { say(e.message + (e.retryAfter ? ' (try again in ' + e.retryAfter + ' s)' : ''), 'bad'); }
function looksBad(t) {
  /* quick friendly check; the API repeats it with the full rules */
  if (/[a-z][a-z0-9+.-]*:[/][/]/i.test(t) || /\bwww\s*\./i.test(t)) return 'Links are not allowed here. Please leave out web addresses.';
  if (/[^\s@]+@[^\s@]+\.[a-z]{2,}/i.test(t)) return 'Please do not share email addresses.';
  if (/\d(?:[\s().-]{0,2}\d){8,}/.test(t)) return 'Please do not share phone numbers.';
  return '';
}
function postingOpen() { return !!(cfg && cfg.turnstileSiteKey && meta && meta.ready !== false && !meta.readOnly); }

/* -------------------------------------------------------------- turnstile */
function loadTs(cb) {
  if (window.turnstile) { cb(); return; }
  var s = document.createElement('script'); s.src = TS_URL + '?render=explicit'; s.async = true;
  s.onload = function () { cb(); }; s.onerror = function () { cb(new Error('x')); };
  document.head.appendChild(s);
}
function mountTs(box) {
  tsToken = ''; tsId = null; tsBox = box;
  box.textContent = 'Loading the human check...';
  loadTs(function (err) {
    if (err || !window.turnstile) { box.textContent = 'The human check could not load. Please reload the page.'; return; }
    box.textContent = '';
    try {
      tsId = window.turnstile.render(box, { sitekey: cfg.turnstileSiteKey, theme: 'auto', callback: function (t) { tsToken = t; }, 'expired-callback': function () { tsToken = ''; }, 'error-callback': function () { tsToken = ''; } });
    } catch (e) { box.textContent = 'The human check could not load. Please reload the page.'; }
  });
}
function resetTs() { tsToken = ''; try { if (window.turnstile && tsId !== null) window.turnstile.reset(tsId); } catch (e) { /* widget gone */ } }

/* ------------------------------------------------------------------ views */
var RULES = '<ul class="fm-rules">' +
  '<li><b>Be kind.</b> No insults, hate or harassment. Disagree with ideas, not with people.</li>' +
  '<li><b>Plain text only.</b> No links, email addresses or phone numbers, and no personal details about you or anyone else.</li>' +
  '<li><b>Stay on topic.</b> Feedback, bugs and ideas about the game. No adverts or spam.</li>' +
  '<li><b>Moderation.</b> Posts that break these rules can be hidden or removed. If several people report a post it is hidden until the developer has looked at it.</li>' +
  '<li><b>Replies from the developer</b> carry a Developer badge. Nobody else can use it.</li></ul>';
var PRIVACY = '<p class="fm-priv"><b>What is stored.</b> The display name you type, your post, and a one-way scramble (hash) of a random code kept in this browser, which lets you edit, delete and vote once. ' +
  'No accounts, no email addresses, no phone numbers, and your IP address is never saved (only a scrambled form that is useless after a day or two). Clearing this site&rsquo;s data in your browser means you can no longer edit or delete your old posts.</p>';

function head() {
  return '<header class="fm-head"><h2 class="sec">Forum</h2><p class="lead">Tell us what you think about the game: feedback, bugs and ideas. Everyone is welcome, no account needed.</p>' +
    '<details class="fm-notice"><summary>Be kind: the short rules, and what we store</summary><div>' + RULES + PRIVACY + '</div></details></header>';
}
function soon(msg) {
  return '<section class="wrap fm">' + head() + '<div class="fm-soon" role="status"><svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15zM5 19l8-8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    '<h3>' + esc(msg || 'The forum opens soon') + '</h3><p>We are still setting it up. Come back in a little while to share your thoughts about the game.</p></div></section>';
}

function listShell() {
  var cats = (meta.categories || []).map(function (c) { return '<button type="button" class="fm-chip' + (S.cat === c.id ? ' on' : '') + '" data-cat="' + esc(c.id) + '" aria-pressed="' + (S.cat === c.id) + '">' + esc(c.label) + '</button>'; }).join('');
  var h = '<section class="wrap fm">' + head() + '<div class="fm-say" role="status" aria-live="polite"></div>';
  if (meta.readOnly) h += '<p class="fm-banner">The forum is read-only for a moment. You can still read everything.</p>';
  else if (!postingOpen()) h += '<p class="fm-banner">Posting opens soon. You can already read what is here.</p>';
  h += '<div class="fm-bar"><div class="fm-chips" role="group" aria-label="Category"><button type="button" class="fm-chip' + (S.cat === '' ? ' on' : '') + '" data-cat="" aria-pressed="' + (S.cat === '') + '">All</button>' + cats + '</div>';
  h += '<form class="fm-search" role="search"><label class="fm-sr" for="fmq">Search the forum</label><input id="fmq" type="search" maxlength="60" placeholder="Search" value="' + esc(S.q) + '" autocomplete="off"></form>';
  h += '<label class="fm-sr" for="fmsort">Sort</label><select id="fmsort"><option value="new">Newest</option><option value="top">Top</option><option value="active">Recently active</option></select>';
  h += '<button type="button" class="fm-btn primary" data-act="new"' + (postingOpen() ? '' : ' disabled') + '>New thread</button></div>';
  h += '<div class="fm-newslot"></div><div class="fm-list" aria-live="polite"><p class="fm-load">Loading...</p></div><nav class="fm-pager" aria-label="Pages"></nav></section>';
  return h;
}

function voteBtn(p) {
  return '<button type="button" class="fm-vote' + (p.voted ? ' on' : '') + '" data-vote="' + esc(p.id) + '" aria-pressed="' + !!p.voted + '" aria-label="Upvote. ' + p.votes + ' votes"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 5l7 9H5z" fill="currentColor"/></svg><b>' + p.votes + '</b></button>';
}
function badges(p) {
  var h = '';
  if (p.pinned) h += '<span class="fm-badge pin">Pinned</span>';
  if (p.official) h += '<span class="fm-badge dev">Developer</span>';
  if (p.mine) h += '<span class="fm-badge you">You</span>';
  if (p.status === 'pending') h += '<span class="fm-badge wait">Waiting for review</span>';
  return h;
}
function meta1(p) {
  return '<span class="fm-by">' + esc(p.name) + '</span> <span class="fm-dot" aria-hidden="true">&middot;</span> <time>' + esc(ago(p.createdAt)) + '</time>' + (p.editedAt ? ' <span class="fm-ed">(edited)</span>' : '');
}
function threadCard(p) {
  return '<article class="fm-card' + (p.official ? ' dev' : '') + (p.pinned ? ' pin' : '') + '">' + voteBtn(p) +
    '<div class="fm-main"><div class="fm-row"><span class="fm-cat" data-c="' + esc(p.category) + '">' + esc(catLabel(p.category)) + '</span>' + badges(p) + '</div>' +
    '<h3 class="fm-ttl"><a href="#forum/t/' + esc(p.id) + '">' + esc(p.title) + '</a></h3><p class="fm-ex">' + esc(p.body) + '</p>' +
    '<div class="fm-foot">' + meta1(p) + '<span class="fm-rc">' + p.replies + (p.replies === 1 ? ' reply' : ' replies') + '</span></div></div></article>';
}

function loadList() {
  var qs = '?sort=' + encodeURIComponent(S.sort) + '&page=' + S.page + (S.cat ? '&category=' + encodeURIComponent(S.cat) : '') + (S.q ? '&q=' + encodeURIComponent(S.q) : '');
  return api('GET', '/api/threads' + qs).then(function (r) {
    var L = $('.fm-list'); if (!L) return;
    if (!r.threads.length) {
      L.innerHTML = '<div class="fm-empty">' + (S.q || S.cat ? 'Nothing matches that yet.' : 'No threads yet. Be the first to start one.') + '</div>';
    } else L.innerHTML = r.threads.map(threadCard).join('');
    var pages = Math.max(1, Math.ceil(r.total / r.size));
    var pg = $('.fm-pager');
    pg.innerHTML = pages > 1 ? '<button type="button" class="fm-btn" data-page="' + (S.page - 1) + '"' + (S.page <= 1 ? ' disabled' : '') + '>Previous</button><span>Page ' + S.page + ' of ' + pages + '</span><button type="button" class="fm-btn" data-page="' + (S.page + 1) + '"' + (r.hasMore ? '' : ' disabled') + '>Next</button>' : '';
  }).catch(function (e) { var L = $('.fm-list'); if (L) L.innerHTML = '<div class="fm-empty">' + esc(e.message) + '</div>'; });
}

function field(id, label, input, hint) {
  return '<div class="fm-f"><label for="' + id + '">' + label + '</label>' + input + (hint ? '<small>' + hint + '</small>' : '') + '</div>';
}
function formHtml(kind, extra) {
  var nm = store(NAME_KEY);
  var h = '<form class="fm-form" data-kind="' + kind + '" novalidate>';
  if (kind === 'thread') {
    h += field('fmcat', 'Category', '<select id="fmcat">' + (meta.categories || []).map(function (c) { return '<option value="' + esc(c.id) + '"' + (S.cat === c.id ? ' selected' : '') + '>' + esc(c.label) + '</option>'; }).join('') + '</select>');
  }
  h += field('fmname', 'Display name', '<input id="fmname" type="text" maxlength="' + LIM.name[1] + '" value="' + esc(nm) + '" autocomplete="off" required>', 'Any name you like (not your real one if you prefer). ' + LIM.name[0] + ' to ' + LIM.name[1] + ' letters or numbers.');
  if (kind === 'thread') h += field('fmtitle', 'Title', '<input id="fmtitle" type="text" maxlength="' + LIM.title[1] + '" required>');
  var lim = kind === 'thread' ? LIM.thread : LIM.reply;
  h += field('fmbody', kind === 'thread' ? 'Your post' : 'Your reply', '<textarea id="fmbody" rows="' + (kind === 'thread' ? 6 : 4) + '" maxlength="' + lim[1] + '" required></textarea>', '<span class="fm-count">0</span> / ' + lim[1] + '. Plain text. No links, emails or phone numbers.');
  h += '<div class="fm-hp" aria-hidden="true"><label>Leave this empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>';
  h += '<div class="fm-ts" aria-label="Human check"></div>';
  h += '<div class="fm-actions"><button type="submit" class="fm-btn primary">' + (kind === 'thread' ? 'Post thread' : 'Post reply') + '</button><button type="button" class="fm-btn" data-act="cancel-form">Cancel</button></div>';
  return h + (extra || '') + '</form>';
}
function wireForm(form) {
  var body = $('#fmbody', form), cnt = $('.fm-count', form);
  if (body && cnt) body.addEventListener('input', function () { cnt.textContent = body.value.length; });
  mountTs($('.fm-ts', form));
}

function openNewThread() {
  if (!postingOpen()) return;
  var slot = $('.fm-newslot'); if (!slot) return;
  slot.innerHTML = '<div class="fm-panel"><h3>Start a thread</h3>' + formHtml('thread') + '</div>';
  wireForm($('form', slot)); $('#fmtitle', slot).focus();
}

function submitForm(form) {
  var kind = form.dataset.kind, name = $('#fmname', form).value.trim(), body = $('#fmbody', form).value.trim();
  var title = kind === 'thread' ? $('#fmtitle', form).value.trim() : '';
  var lim = kind === 'thread' ? LIM.thread : LIM.reply;
  var err = '';
  if (name.length < LIM.name[0] || name.length > LIM.name[1]) err = 'Please enter a display name (' + LIM.name[0] + ' to ' + LIM.name[1] + ' characters).';
  else if (kind === 'thread' && (title.length < LIM.title[0] || title.length > LIM.title[1])) err = 'The title needs ' + LIM.title[0] + ' to ' + LIM.title[1] + ' characters.';
  else if (body.length < lim[0] || body.length > lim[1]) err = 'Your ' + (kind === 'thread' ? 'post' : 'reply') + ' needs ' + lim[0] + ' to ' + lim[1] + ' characters.';
  else err = looksBad(name) || looksBad(title) || looksBad(body);
  if (err) { say(err, 'bad'); return; }
  if (!tsToken) { say('Please complete the human check first.', 'bad'); return; }
  var btn = $('button[type=submit]', form); btn.disabled = true;
  say('Sending...', 'info');
  var payload = { name: name, body: body, turnstileToken: tsToken, website: $('input[name=website]', form).value };
  var path = '/api/threads';
  if (kind === 'thread') { payload.title = title; payload.category = $('#fmcat', form).value; } else path = '/api/threads/' + currentThread + '/replies';
  api('POST', path, payload).then(function (r) {
    store(NAME_KEY, name);
    btn.disabled = false; resetTs();
    if (r.status === 'pending') { say(r.message, 'ok'); form.reset(); if (kind === 'thread') { $('.fm-newslot').innerHTML = ''; } return; }
    say('', '');
    if (kind === 'thread') location.hash = '#forum/t/' + r.id; else openThread(currentThread);
  }).catch(function (e) { btn.disabled = false; resetTs(); fail(e); });
}

/* ------------------------------------------------------------ thread view */
var currentThread = '';
function postBlock(p, isThread) {
  var h = '<article class="fm-post' + (p.official ? ' dev' : '') + '" id="p-' + esc(p.id) + '">' + voteBtn(p) + '<div class="fm-main"><div class="fm-row">';
  if (isThread) h += '<span class="fm-cat" data-c="' + esc(p.category) + '">' + esc(catLabel(p.category)) + '</span>';
  h += badges(p) + '</div>';
  if (isThread) h += '<h2 class="fm-h" tabindex="-1">' + esc(p.title) + '</h2>';
  h += '<div class="fm-meta">' + meta1(p) + '</div><div class="fm-body">' + esc(p.body) + '</div>';
  h += '<div class="fm-acts">' + (isThread ? '<button type="button" class="fm-link" data-act="reply-focus">Reply</button>' : '') + '<button type="button" class="fm-link" data-act="report" data-id="' + esc(p.id) + '">Report</button>';
  if (p.mine) h += '<button type="button" class="fm-link" data-act="edit" data-id="' + esc(p.id) + '">Edit</button><button type="button" class="fm-link warn" data-act="delete" data-id="' + esc(p.id) + '">Delete</button>';
  return h + '</div><div class="fm-inline" data-for="' + esc(p.id) + '"></div></div></article>';
}
var cache = {};
function openThread(id) {
  currentThread = id;
  root.innerHTML = '<section class="wrap fm">' + head() + '<p><a class="fm-back" href="#forum">&larr; All threads</a></p><div class="fm-say" role="status" aria-live="polite"></div><div class="fm-tview"><p class="fm-load">Loading...</p></div></section>';
  return api('GET', '/api/threads/' + id).then(function (r) {
    cache = {}; cache[r.thread.id] = r.thread; r.replies.forEach(function (x) { cache[x.id] = x; });
    var h = postBlock(r.thread, true);
    h += '<h3 class="fm-rh">' + r.replies.length + (r.replies.length === 1 ? ' reply' : ' replies') + '</h3><div class="fm-replies">' + (r.replies.length ? r.replies.map(function (x) { return postBlock(x, false); }).join('') : '<p class="fm-empty">No replies yet.</p>') + '</div>';
    h += postingOpen() ? '<div class="fm-panel fm-replyform"><h3>Add a reply</h3>' + formHtml('reply') + '</div>' : '<p class="fm-banner">Posting opens soon.</p>';
    var v = $('.fm-tview'); v.innerHTML = h;
    var f = $('.fm-replyform form', v); if (f) wireForm(f);
    var hh = $('.fm-h', v); if (hh) hh.focus({ preventScroll: true });
  }).catch(function (e) { var v = $('.fm-tview'); if (v) v.innerHTML = '<div class="fm-empty">' + esc(e.message) + '</div>'; });
}

function inline(id, html) { var el = $('.fm-inline[data-for="' + id + '"]'); if (el) el.innerHTML = html || ''; return el; }
function openReport(id) {
  var el = inline(id, '<form class="fm-mini" data-for="' + esc(id) + '"><label for="fmr' + esc(id) + '">Why are you reporting this?</label><select id="fmr' + esc(id) + '">' + REASONS.map(function (r) { return '<option value="' + r[0] + '">' + r[1] + '</option>'; }).join('') + '</select>' +
    '<input type="text" maxlength="200" placeholder="Optional note (no personal details)" aria-label="Optional note"><div class="fm-actions"><button type="submit" class="fm-btn primary">Send report</button><button type="button" class="fm-btn" data-act="cancel-inline" data-id="' + esc(id) + '">Cancel</button></div></form>');
  var s = $('select', el); if (s) s.focus();
}
function openEdit(id) {
  var p = cache[id]; if (!p) return;
  var isT = p.kind === 'thread';
  var el = inline(id, '<form class="fm-mini fm-edit" data-for="' + esc(id) + '">' + (isT ? '<label for="fme' + esc(id) + 't">Title</label><input id="fme' + esc(id) + 't" type="text" maxlength="' + LIM.title[1] + '" value="' + esc(p.title) + '">' : '') +
    '<label for="fme' + esc(id) + '">Text</label><textarea id="fme' + esc(id) + '" rows="5" maxlength="' + (isT ? LIM.thread[1] : LIM.reply[1]) + '">' + esc(p.body) + '</textarea><div class="fm-actions"><button type="submit" class="fm-btn primary">Save</button><button type="button" class="fm-btn" data-act="cancel-inline" data-id="' + esc(id) + '">Cancel</button></div></form>');
  var t = $('textarea', el); if (t) t.focus();
}
function openDelete(id) {
  var el = inline(id, '<div class="fm-mini"><p>Delete this ' + (cache[id] && cache[id].kind === 'thread' ? 'thread and hide its replies' : 'reply') + '? This cannot be undone.</p><div class="fm-actions"><button type="button" class="fm-btn danger" data-act="delete-yes" data-id="' + esc(id) + '">Yes, delete</button><button type="button" class="fm-btn" data-act="cancel-inline" data-id="' + esc(id) + '">Keep it</button></div></div>');
  var b = $('button', el); if (b) b.focus();
}

/* ----------------------------------------------------------------- events */
function onClick(e) {
  var t = e.target.closest('button'); if (!t || !root.contains(t)) return;
  var act = t.dataset.act;
  if (t.dataset.cat !== undefined) { S.cat = t.dataset.cat; S.page = 1; render(); return; }
  if (t.dataset.page) { S.page = Math.max(1, +t.dataset.page); loadList().then(function () { window.scrollTo({ top: Math.max(0, $('.fm-bar').getBoundingClientRect().top + window.scrollY - 70), behavior: reduced() ? 'auto' : 'smooth' }); }); return; }
  if (t.dataset.vote) {
    api('POST', '/api/posts/' + t.dataset.vote + '/vote').then(function (r) {
      t.classList.toggle('on', r.voted); t.setAttribute('aria-pressed', r.voted); t.setAttribute('aria-label', 'Upvote. ' + r.votes + ' votes'); t.querySelector('b').textContent = r.votes;
    }).catch(fail);
    return;
  }
  if (act === 'new') openNewThread();
  else if (act === 'cancel-form') { var slot = $('.fm-newslot'); if (t.closest('.fm-newslot') && slot) slot.innerHTML = ''; else { var f = t.closest('form'); if (f) f.reset(); } say('', ''); }
  else if (act === 'reply-focus') { var b = $('#fmbody'); if (b) { b.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' }); b.focus({ preventScroll: true }); } }
  else if (act === 'report') openReport(t.dataset.id);
  else if (act === 'edit') openEdit(t.dataset.id);
  else if (act === 'delete') openDelete(t.dataset.id);
  else if (act === 'cancel-inline') inline(t.dataset.id, '');
  else if (act === 'delete-yes') {
    var id = t.dataset.id, isT = cache[id] && cache[id].kind === 'thread';
    api('DELETE', '/api/posts/' + id).then(function () { if (isT) location.hash = '#forum'; else openThread(currentThread); }).catch(fail);
  }
}
function onSubmit(e) {
  var f = e.target; e.preventDefault();
  if (f.classList.contains('fm-search')) { S.q = $('input', f).value.trim(); S.page = 1; loadList(); return; }
  if (f.classList.contains('fm-form')) { submitForm(f); return; }
  var id = f.dataset.for; if (!id) return;
  if (f.classList.contains('fm-edit')) {
    var body = { body: $('textarea', f).value.trim() }, ti = $('input', f); if (ti) body.title = ti.value.trim();
    var bad = looksBad(body.body) || looksBad(body.title || '');
    if (bad) { say(bad, 'bad'); return; }
    api('PATCH', '/api/posts/' + id, body).then(function (r) { return openThread(currentThread).then(function () { say(r.post.status === 'pending' ? 'Saved. It is waiting for review again.' : 'Saved.', 'ok'); }); }).catch(fail);
  } else {
    api('POST', '/api/posts/' + id + '/report', { reason: $('select', f).value, note: $('input', f).value }).then(function (r) {
      var done = function () { say(r.message || 'Thank you. The report has been sent.', 'ok'); };
      if (r.hidden) openThread(currentThread).then(done); else { inline(id, ''); done(); }
    }).catch(fail);
  }
}

/* ----------------------------------------------------------------- router */
function render() {
  var m = /^#forum\/t\/([0-9a-z]{4,20})$/.exec(location.hash || '');
  if (m) { openThread(m[1]); return; }
  root.innerHTML = listShell();
  $('#fmsort').value = S.sort;
  $('#fmsort').addEventListener('change', function () { S.sort = this.value; S.page = 1; loadList(); });
  loadList();
}

window.ShnorkForum = {
  mount: function (el) {
    root = el; root.onclick = onClick; root.onsubmit = onSubmit;
    root.innerHTML = '<section class="wrap fm"><p class="fm-load">Loading the forum...</p></section>';
    loadConfig().then(function (c) {
      if (!c.apiBase) { root.innerHTML = soon(); return; }
      return api('GET', '/api/config').then(function (m) { meta = m; render(); }, function () { root.innerHTML = soon('The forum is taking a rest'); });
    });
  },
  /* shared with the moderation inbox (private page only) */
  config: loadConfig
};
})();
