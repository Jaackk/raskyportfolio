# Theatre Mode V2 verification — 9 October 2026

Local preview: http://127.0.0.1:4293/. Current browser revision: **20261009i**. This is a static website; no root build step or production deployment was performed.

## Latest focused refinement

Revision i fixes the recorded Perfect Host note sequence: the genuine editor opens Note once at 4.9473s, finishes typing at 6.1627s, leaves the completed text readable, saves once at 8.3489s and stays closed to the movie's end. The previous reopen was encoded in the source recording; a runtime probe found no player seeks/restarts. “Note saved” now appears at 8.4s. The separate persisted-note verification still is used only for manual/reduced-motion presentation. Fresh real UI captures, original backups, timestamps, source containers, hashes and full decode/visual checks are recorded in `assets/v2/product-timing-revision.json` and `product-v2.md`. The product source was not modified.

Both EtsyCalc movies now hold the actual homepage for **1.8 seconds**, twice the previous 0.9s, before the entire original 5.6-second calculation workflow. Exports are 7.4s / 222 frames; the chapter is 7.4248s. Nothing in the calculation workflow was accelerated or removed.

The bar chapter is now **5.4 seconds**, with genuine recipe, 25-serve batch and prep screens at 0 / 1.8 / 3.6s. A larger foreground image moves between quieter adjacent captures; all motion uses show time and pauses with Theatre. Mobile and short-landscape crops prioritize the recipe/image, 25-serves and 1.1L prep quantity. These remain real Simulator stills, with no invented taps or typing. The 0.9-second saving goes to EtsyCalc: practice remains 49.0406s, live remains 60.1742s and the soundtrack bytes remain unchanged.

The ordinary Design gallery now **scrolls automatically** through the same fourteen unique items at 32 CSS px/s, easing into a short endpoint dwell before reversing without a reset. Pause/Play, hover/focus, lightbox, offscreen/hidden pauses, 7-second manual-interaction cooldown and reduced-motion handling were checked on desktop and phone. Swipe, drag, arrows, Home/End and lightbox focus restoration remain functional; no overflow at 320px. Evidence: `theatre-qa/design-collection/auto-results.json`, `auto-edge-touch.json` and `interactions.json`.

Revision-i focused playback and Edge/WebKit smoke checks passed. The bar's foreground motion froze exactly on Pause; title, step and caption glyph bounds passed at desktop, 390px, 320px and 844px landscape. Real playback showed the single note opening/save without mid-clip seeks or restarts; Etsy's homepage was still visible at 1.5s before both desktop and mobile workflows. Natural Perfect Host → EtsyCalc → practice → live playback retained both guitar entry cues, readyState 4 and at most one active soundtrack source. Exit closed the context and removed the stage/media, leaving zero handoff widgets and one original launcher. Independent gallery checks confirmed automatic movement and pausing on desktop and phone. Evidence: `theatre-qa/revision-qa/final-i/summary.json`, `focused.json`, screenshots and the four-size captures in `bar-i/`. The known Windows WebKit native-route fixture skip and lack of ear-audition remain as documented below; no new full-tour replay is claimed.

## Preceding revision-h refinement and verification

Revision h removes the expanding rectangular/rounded whole-scene masks, the nested game inset, and the duplicate skate/venue opacity entrances. An opaque outgoing canvas stays beneath feathered directional reveals. Picture movement follows the skate travel, phone columns, venue pan and illustrated-page-to-forest transition. The 0.65-second shared-clock bridge now eases both ends; the final quiet handoff retains its dissolve.

The native bar-app sequence is **6.3 seconds**, down from 7.5, with screen cues at **0, 2.1 and 4.2 seconds** and shorter screen emphasis transitions. The saved 1.2 seconds extends the quarterpipe photograph to 5.15 seconds. Raskys and every subsequent edit point remain identical; practice is still 49.0406s and the principal solo 60.1742s. The soundtrack SHA-256 remains `1bc4b8ccc6824e16a8416b5d42e35c29e041bc3e2298b40f056dadabcd61cec7`.

The ordinary Design page now includes **all 14 distinct designs** in a horizontal gallery, while Theatre keeps its existing curated four. Thirteen graphics have authorized RASKY lettering edits; the unlettered Bandit is an unchanged original. Desktop 1440px and portrait 390px gallery checks passed for all fourteen decoded images, all fourteen lightboxes, close/focus restoration, arrows, Home/End, touch swipe, trackpad and mouse drag without accidental lightbox opening. No page overflow, JavaScript error, failed request or visible former-brand wording was found. The four brand-inspired studies retain their context labels. The original 28 downloaded files remain unchanged. Evidence: `theatre-qa/design-collection/`; exact prompts, source/output hashes and review: `assets/design/skate/collection.json`.

Revision-h smoke checks passed in Edge and Windows WebKit: opt-in/repeated entry, pause, focus, deliberate takeover, reduced motion, retained outgoing frames, transition pause/cleanup, ambient windows and exit disposal. Edge also passed delayed-media readiness. WebKit's unsupported native-route delay fixture remains skipped; it is not reported as a pass.

Thirty focused transition cases cover Edge desktop 1440px, portrait 390px, compact 320px, landscape 844×390 and WebKit portrait 390px. Real playing transitions were paused around 260ms, visually inspected and resumed: masks computed as valid gradients, outgoing canvases stayed opaque, and the two scene roots returned to one after completion. No expanding rectangular or nested game-box reveal remained. Root review included venue, phone, novel/forest and compact skate compositions. Captures and reports are in `theatre-qa/revision-qa/final-h/`.

Natural bar playback confirmed the 2.1/4.2-second screen changes and 6.3-second exit with 40ms sampling. Phone, compact and landscape states had no title/caption glyph-bound failures. A natural practice-to-live handoff retained both authored entry cues and at most one active audio source, with readyState 4 at both entrances. Across 498 early-live samples, video time minus the render clock had a median −7.4ms and maximum absolute difference 14.4ms; this is transport measurement, not auditory verification. No revision-h full-tour replay or listening pass is claimed. Exit removed stage/media and closed the audio context, leaving the sole original launcher and no handoff widget. `final-h/summary.json` records these checks.

## Current edit and visual review

The current edit has **14 scenes / 116.7199 seconds**, with one **113.219896-second** soundtrack and a quiet 3.5-second release to the ordinary hero. It uses a separate viewport composition, without automatic document scrolling. Every playing scene change retains the outgoing composition for a 0.65-second transition driven by the same master clock. Reduced-motion/manual navigation swaps static compositions immediately.

A complete natural revision-g Edge run at **390×844** traversed every scene in **116.804 seconds**. It reported no page JavaScript errors or HTTP failures. All visual players were muted; at most one soundtrack source was active. Completion removed the stage, closed its audio context, released players, returned to scroll position zero and focused `hero-title`. Exactly one original Theatre Mode launcher remained, with no handoff/replay/dismiss widget. This is the preceding full-run baseline, not a claimed full revision-h replay.

Final selected-media review includes:

- Three continuously moving skate tricks, with short approaches, complete actions/landings and the yellow-cone kickflip last. The separate quarterpipe mid-spin photograph remains. Print-inspired grading, a moving colour wash and directional cut accents use the actual footage. RASKY artwork stays clear of the body, board and landing in inspected desktop/phone frames.
- Three full portrait HD performance inserts, alongside the complete principal solo. Heads/faces remain visible using `object-fit:contain`; these are labelled other live moments, not alternate synchronized camera angles. Compact phones prioritize the principal solo.
- Four user-supplied skate illustrations, with authorized ESCAPISM-to-RASKY lettering edits, remain in Theatre. The Design page now shows the complete fourteen-design collection described above. Source downloads remain preserved. All final labels were inspected on light backgrounds; artwork lightboxes were exercised.
- Genuine Perfect Host and EtsyCalc interaction footage. EtsyCalc starts with an actual homepage arrival. Native bar-app material remains genuine Simulator stills; SportsPredict uses complete, accurately labelled repository concepts without zoom/crop. Raskode has editorial type animation, not a fabricated application recording.
- Raskys uses the existing main-site venue concept. The actual novel PDF scroll begins slowly, accelerates through all 42 pages and settles on the final illustrated page. The buffs/debuffs board is absent. Game footage contains only the two selected environment shots; no unfinished walking character.

Targeted Edge desktop (1440×1000), portrait (390×844), compact (320×568) and landscape (844×390) captures supplement the full run. All 14 compact scenes passed. The first full-run layout scan flagged caption *boxes* temporarily displaced a few pixels during mobile bar/SportsPredict entrance motion. Mobile entrance translation was removed/reduced while retaining the dissolves/masks; subsequent 390px/320px checks passed for both caption boxes and actual glyph bounds. In short landscape, small skate graphic labels and the overlapping decorative photo marker are hidden; content and 44px controls remain. Earlier full desktop and WebKit runs apply to the preceding edit and are retained as historical evidence, not relabelled as complete revision-g runs.

## Lifecycle and timing

The reusable `theatre/tests/smoke.cjs` covers optional/lazy launch, repeated entry/exit, pause/resume, Next/Back, Escape, deliberate scroll/touch/navigation-key takeover, hidden-page pause, reduced motion, missing media/modules, focus handling and music ownership. New checks cover the outgoing frame retained during transitions, blend progress frozen while paused, rapid navigation, three portrait inserts, and decoder/source cleanup. Final revision-g smoke runs passed in Edge and Windows WebKit, including the next-artwork warmup. Final results are recorded beside the scripts.

Practice enters at **49.0406s** and the principal solo at **60.1742s**. On the final full Edge run, 333 presented practice frames had a median +4.6ms offset and a 95th-percentile absolute difference of 11.3ms from the audio render clock. For 971 principal-solo frames these were +11.5ms and 27.5ms. These measure browser transport, **not perceived sound or note alignment**, and exclude hardware output latency.

The delivered live recording and picture share one offline nonlinear source-to-target map. No additional browser speed correction is applied. Actual practice audio is mixed quietly; studio accompaniment is stronger than the initial version; the studio guitar gain is **0.18**, 10% below the preceding 0.20 setting. It fades smoothly through the last three seconds of the main video. The full master returns over 0.45s immediately after actual live audio ends, within the final video frame. `audio-README.md`, `sync.json` and `audio-validation.json` contain the signal evidence and exact process. No soundtrack retiming was introduced by the scene-transition or graphics work.

Both guitar entrances have an eight-second bounded readiness gate. After a failed load, the labelled fallback continues. Pause/buffering also freezes scene-transition progress. Outgoing sources are released when a transition finishes, when navigating again, or on exit. Supplemental images for the next scene are warmed after intent; save-data mode limits artwork warming to the first image.

## Ordinary website preservation

The homepage About section, both CV links and the Creative Technology & Games CV section were restored from the existing newer repository content. The actual technology PDF was restored and served successfully. The bar-app addition remains.

The user-requested Raskys business-plan edit is in the PDF itself. Nine text lines on pages 1, 11, 12, 14 and 17 update the destination and related assumptions while preserving every financial figure. The existing 23-page layout and embedded Lexend font remain. Poppler review passed; all pixels outside those edited lines, and the complete text/rendered pixels of the other 18 pages, match the preserved original. Updated links survived CMS hydration and served the revised PDF with HTTP 200. The explanatory Brighton sentence was removed from both site locations. Evidence is in `theatre-qa/raskys-plan/`.

Event pre-orders now uses two **complete, uncropped 1440×1000 screenshots**, slightly overlapping, with working full-size lightboxes. They are actual demo-interface captures with temporary neutral browser-only branding, sample title and background. The screenshot files themselves contain no venue name/logo; original app files and original screenshots were not modified. The Design page and content records use the same safe derivatives. Desktop and phone rendering, both loaded inline images, both lightboxes and Escape-close were checked.

`/rockwaterpreorders/`, the MUSIC page and shared `script.js` have no Git diff. The ordinary shared CSS changes are limited to authorized portfolio additions/framing, rather than claimed unchanged. Original user media remain preserved. No hosting configuration, domain, account, or production deployment was changed.

Preserved SHA-256:

| File | SHA-256 |
| --- | --- |
| `music/index.html` | `0359B31F8E6747324A4AA60DD650CF84561B80AC92A1EFD82762CFC85E685223` |
| `script.js` | `F4BDB02917B7E6C1984FE33413693AD4A37203990862F6F16809C862DD2D3807` |

## Assets and performance

The exact revision-i manifest check passed for **44 selected Theatre assets**, including primary, manual, screen, ambient and graphic roles. The ten additional website-only artwork files and unselected bar search screenshot are recorded separately, with the complete fourteen-design provenance record. All selected, website-only and supporting hashes and the chapter source hash matched. JavaScript syntax, modified JSON parsing and tracked diff whitespace checks passed.

Before launch, the final ordinary visit requested only `invitation.css` (1055 transferred bytes) and `launch.js` (3559 bytes) for Theatre: **4614 bytes** on the local uncompressed server. Presentation code, soundtrack and media remained lazy. These figures are local Resource Timing evidence, not a production performance or battery/thermal guarantee.

Evidence lives in `C:/Users/Jacko/Documents/Codex/theatre-qa/`: `revision-qa/final-g/full-mobile.json`, final scene captures, the compact/landscape focused reports, browser smoke output, `branding-audit/`, `cv-restoration/`, `design-graphics/`, `graphics-originals/`, and `novel-pdf/`. Media provenance and replacement slots are documented in `media-manifest.json`, `MEDIA.md`, `visual-media-v2.md` and `product-v2.md`.

## Remaining acceptance limits

**The agent cannot audition audio.** Signal matching, full decoding, clock/frame measurements and the user's earlier feedback informed the current mix; no final human listening approval or perfect perceptual alignment is claimed. Browser recordings in this environment capture pixels without sound.

Windows Playwright WebKit has no AudioContext here. Its truthful No audio fallback and visual/lifecycle checks do not establish iPhone Safari audio behavior. Physical iPhone testing, screen-reader listening and a final human audiovisual judgment remain unverified.

Real typing/search footage for the native bar app still requires a recording from the user's iPhone or Mac. The repository supplies real stills, not a runnable Windows capture. SportsPredict similarly needs a macOS capture to replace its clearly labelled interface concepts. Neither limitation was filled with fabricated functionality.
