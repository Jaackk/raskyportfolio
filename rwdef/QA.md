# Verification record

Completed 8 October 2026, Europe/London. Official law and ACAS verification date: 7 October 2026.

## Source checks

- All four supplied employment reference files extracted and inspected.
- 55 curated Rockwater provisions verified as source substrings after whitespace normalisation. Relevant PDF pages visually reviewed; handbook locators are paragraph anchors, not invented page numbers.
- 27 official legal reference cards and 30 deterministic response scenarios; source IDs resolved.
- Both differing alcohol gross-misconduct examples retained. Discretionary/non-contractual benefit wording, source placeholders, grievance context and possible separate staff-drink instructions retained.
- Public source dataset scanned for personal contact, pay, signature and e-sign audit identifiers. Original private documents and raw extraction were not committed.

## Browser checks

Automated in Microsoft Edge using Playwright, plus visual screenshot review.

- All 29 private workspaces rendered without JavaScript page errors or horizontal page overflow.
- Laptop layouts checked at 1440 × 1000 and 1366 × 768; mobile at 390 × 844.
- Home, source library, response search, legal references, procedure, mitigation, outcome, appeal, shift, neutral share and print layouts inspected.
- Notes persisted after refresh. Meeting events saved, mitigation summaries and appeal drafts used entered/selected content.
- JSON export downloaded and restored; clear-data confirmation removed notes and local files.
- Original source attached to IndexedDB without upload.
- Private sentinel text absent from neutral DOM, neutral search, neutral print and neutral reload. Share mode persisted through reload. Panic keyboard shortcut worked.
- Long private notes printed through complete text rather than a clipped textarea; HTML-looking user text remained escaped.
- App and references cached; offline reload and response search passed.
- Standalone quick-reference screen and print layouts inspected.
- JavaScript syntax checks and Git whitespace checks passed.

## Operational limits

Browser tests use synthetic records, not a real hearing. No legal outcome is predicted. Case data and originals are local to one browser profile; back up the JSON and keep original files separately. Search-index exclusion is not access control. Browser storage is not encrypted. The indicative internal appeal calculation excludes weekends only and must be checked for bank holidays and the employer’s counting basis. External official sources require a connection; offline reference is a dated snapshot.

## Version 2 redesign QA — 8 October 2026

The five-screen defence-first interface supersedes the original screen inventory above. Automated Edge tests covered all primary routes, source privacy including refresh, old-case migration, notes, timestamped event editing, JSON backup/restore, clear data, conditional intoxication wording, evidence-referenced appeal drafts and dismissal mode. Seven specified hearing scenarios were each reached by two automated taps in 61–123 ms on the local loaded app; this is interface response timing, not a measurement of human reading or mobile-network loading. The seven full spoken phrases selected the intended response. No JavaScript page errors occurred.

Visual review included the phone home, live response, source view and laptop home/response. SAY and ASK fitted in the iPhone 13 WebKit viewport. WebKit tests confirmed touch controls, source-only display and notes persistence. This was an emulated device, not a physical iPhone. Playwright’s Windows WebKit backend returned an internal navigation error under forced offline mode and intercepted navigation before cache handling under network routing; a successful WebKit offline reload is therefore not claimed. Offline reload and response lookup passed in Chromium/Edge. The standard scoped service worker and complete asset cache are retained.

Private-note printing and neutral-source printing were inspected separately. Private sentinel text did not appear in Source view or its DOM after refresh. Existing local records and the IndexedDB store remain compatible. All 55 scenario references resolve; all 55 curated quotes were reverified against freshly extracted originals. Only files under /rwdef changed in this redesign.

Upgrade check: recreated the original v1 service worker and cached application, saved a private note, then replaced the server with v2. A global CacheStorage lookup could select an old cache recreated by an in-flight v1 request. The v2 fetch handler now reads only its own versioned cache and keeps cache writes within the event lifetime. The actual v1-to-v2 upgrade test then passed, preserving the saved note. Public HTTP 200, response selection, source-only view and zero page errors were confirmed in Chromium and WebKit; public Chromium offline reload passed.
