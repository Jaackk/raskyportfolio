# Theatre v2: recordings of the actual products

Captured on 9 October 2026 from this checkout at `http://127.0.0.1:4293/` in isolated Microsoft Edge contexts. No product source was modified. No external forms, accounts, payments, or real guest records were used. All visible values were entered through the existing controls.

The delivery clips are silent H.264 MP4 with fast-start metadata. Original takes use 25 fps; the combined Perfect Host and revised EtsyCalc edits use 30 fps. They were encoded directly from timed browser screenshots (roughly 11–16 captures per second) without changing playback speed. Holding a UI state between captures does not imply an extra interaction. This is appropriate for these discrete interface changes; these clips are not presented as performance or skating footage.

| Asset in `assets/v2/` | Duration | Native capture / delivery size | Bytes | Role |
| --- | ---: | --- | ---: | --- |
| `perfecthost-select.mp4` | 2.0 s | 1024 × 768 | 264,161 | Optional floor-plan context: select Table 12. |
| `perfecthost-combined.mp4` | 9.5 s | 1024 × 768 | 361,729 | Current table selection and one continuous note-entry workflow. |
| `perfecthost-workflow.mp4` | 7.5 s | 840 × 532 | 94,336 | Historical unselected take; contains the superseded save/reopen sequence. |
| `etsycalc-workflow.mp4` | 7.4 s | 1092 × 800 | 983,286 | 1.8-second homepage arrival, then desktop input and result together. |
| `etsycalc-mobile.mp4` | 7.4 s | 780 × 1520 | 743,027 | 1.8-second homepage arrival, then narrow inputs and result. |
| `motiondesk-concept.mp4` | 4.0 s | 1280 × 820 | 473,672 | Optional existing website/interface concept, not a working analytics app. |

Each has a matching `-poster.jpg`. The current `perfecthost-combined-end.jpg` is a separate genuine saved-note verification still for manual/reduced-motion mode. All delivery crops were inspected. There is no Rockwater text or logo in these exports. The close Perfect Host workflow contains only the original table editor; it excludes the floor plan entirely.

## Perfect Host

Source and destination: `/perfecthost-demo/`. Status: **interactive local prototype**, using localStorage. Do not imply a deployed shared guest-management system.

The current `perfecthost-combined.mp4` is exactly **9.500 seconds / 285 frames at 30 fps**, 1024 × 768, 361,729 bytes. It retains the original complete 2-second table-selection take, followed by a newly recorded 7.5-second editor take. The actual 420 × 266 CSS-pixel editor was captured at device scale factor 3 (1260 × 798) and downsampled uniformly into the original 1024 × 768 paper canvas. The complete editor and overlaid note form are retained. No application files, controls or UI contents were modified, and no interaction is sped up.

The old script deliberately reopened the note after saving, which caused the reported close/reopen jump. An independent runtime probe found no mid-clip seek, restart or pause. The new recording has exactly one note opening, one typing sequence and one Save click:

| Combined movie time | Genuine interaction/state |
| --- | --- |
| 0–2.0 s | Existing floor plan and Table 12 selection. |
| 2.5311 s | Click guest increment; the app sets its default four guests. |
| 3.2832 s | Mark Water complete. |
| 4.1406 s | Mark first Drinks complete; actual status is “Drinks ordered”. |
| 4.9473 s | Open Note once. |
| 5.2–6.1627 s | Type `Sample: anniversary.` through the real text field. |
| 6.1627–8.3489 s | Leave the complete note visible for reading. |
| 8.3489 s | Save once. The form closes normally. |
| 8.3489–9.5 s | Hold the real saved, closed editor state; no reopen in the film. |

Captured DOM state transitions were exactly **closed → open → closed**. After the recording ended, Note was reopened solely to verify persistence and capture the separate `perfecthost-combined-end.jpg` manual-mode still. That reopened state is not inserted into the movie. `perfecthost-combined-poster.jpg` remains the real opening plan. The earlier workflow take and its stills are retained as unselected historical assets.

Recommended label: “Perfect Host · interactive prototype · AI-assisted development”. All guest and note values are fictional demo inputs; the interface, state changes and persistence are genuine. The narration's “Note saved” cue belongs at approximately **8.4 seconds** within this chapter.

## EtsyCalc

Source and destination: `/etsycalc/`. Status: **working browser calculator**. The recordings demonstrate reactive inputs and results, not an independent audit of tax rules or current marketplace fees. Do not repeat the existing UI's “latest fees automatically” statement in the tour's narration.

Both current edits begin with **1.8 seconds of the actual homepage**, reached by clicking the ordinary portfolio's `/etsycalc/` project link in a fresh browser context. This doubles the previous 0.9-second opening dwell. A direct cut then moves into the unchanged **5.6 seconds of the original calculator workflow**. Both exports are exactly **7.400 seconds / 222 frames at 30 fps**; the chapter budget is 7.4248 seconds. No additional calculation interaction was trimmed, sped up or fabricated. Posters show the fresh homepage arrival; no fake address bar or cursor was added.

Desktop starts with price £20, customer shipping £5, making cost £8, own shipping cost £2.50 and 30 monthly sales. The app shows £10.92 profit per sale and 43.7% margin. In the revised edit, price changes to £30 at about 2.7 s; making cost changes to £12 at 4.6 s; price changes to £34 at 6.3 s. The final actual UI displays £19.15 and 49.1%. The workflow crop contains the original input/results columns and excludes the separate insights column. The original retained workflow interval remains **0.4–6.0 seconds**.

Mobile uses the original 390 × 760 CSS-pixel responsive layout at device scale factor 2. Price changes from £20 to £30 at about 2.15 s. At 2.8 s the existing Calculate My Profit button is clicked and the page scrolls. The result settles in view around 4.8 s: £19.66 and 56.2%. This is a separate real take, not a rearrangement of the desktop UI. The original retained workflow interval remains **0.3–5.9 seconds**.

Exact source intervals, timed interaction marks, capture state evidence, old-file backups and current byte counts/SHA-256 values for all seven delivery files are recorded in **`assets/v2/product-timing-revision.json`**. The revised capture/export script and raw timestamped screenshots are retained outside the served repository in `C:/Users/Jacko/Documents/Codex/theatre-qa/product-revision-i/`. All three revised movies passed a full FFmpeg decode; encoded frames were visually checked at note entry/save/end, the longer homepage opening and final calculator results. Existing product fee/upgrade claims in the captured UI were not independently audited.

Recommended label: “EtsyCalc · working calculator · AI-assisted development”. Practice still begins at **49.0406 s** and live guitar at **60.1742 s**; this product revision changes no audio file or musical cue.

## Additional candidates

`/sportspredict/` is a static project page containing an existing dashboard mock-up, and `/tennispredict/` redirects there. There are no functioning prediction controls in this checkout to record. `/raskode/` is explanatory text and a stylized code panel, not an application interface. Neither was given fabricated interactions.

`/motiondesk/` is an existing “Coming Soon” website with a static dashboard concept. The optional 4-second clip follows its actual Watch Preview anchor link at 0.7 s. No fake app actions were added. Its dashboard contains sample follower/stream figures; if selected, keep **“Website / interface concept · sample data”** visible throughout. These are not Jack's audience metrics or evidence that the proposed analytics system works. Omit the take if that qualification cannot be legible. The Perfect Host/EtsyCalc pair is the strongest genuine workflow material.

Raw screenshot streams, timestamps and recording scripts are retained for local review in `C:/Users/Jacko/Documents/Codex/theatre-qa/v2-recordings/` and `theatre-qa/v2-products.cjs`; exports alone belong to the served site.

## Bar tools: native app evidence added on 9 October

Source: the public `Jaackk/bar-app` repository, commit `57331f0a9b53830f85667936ff6c0deb83af9855`. This is a native SwiftUI iOS 17+ app, separate from the preorders project. The Windows review environment cannot run Xcode or the iOS Simulator. These assets are genuine existing Simulator stills from `docs/screenshots/iphone-15-pro/`, whose capture date is recorded by the repository as 11 September 2026. No live interaction recording or newly executed native app test is claimed. No video recording was present in that repository.

Three unaltered full-screen captures were resized from 1178 × 2556 to 780 × 1692 and encoded as quality-85 WebP. They were visually checked: none contains Rockwater wording, a venue logo, or guest records. No branding was replaced and no UI was rebuilt. The batch screen's cocktail photograph is a bundled AI-generated concept image, as documented in the source repository. The sample-data labels remain visible.

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `assets/v2/bar-batch.webp` | 54,698 | `2ade8572a31f6f5d3d095e2398939d54966d4911af52a2d4e0c840dac60eea93` |
| `assets/v2/bar-prep.webp` | 52,668 | `0ff3ee783532337067a8df963083d41cdc280093d858a593392176329cf4c7bd` |
| `assets/v2/bar-wine.webp` | 55,224 | `9086b75ead9b112309e4ba1d5f319a535948cacd92f676d826619b124f1935a0` |

Source review confirms actual implementations of batch serving/wastage calculations, saved batches and creation of prep tasks (`BatchCalculatorView.swift`); yield scaling and prep progress (`PrepViews.swift`); and taste/colour/query-based wine recommendations (`WineViews.swift`, `WineRecommender.swift`). The repository also implements local stock/order lists, recipe search and training tools. Its historical validation record reports 47 core tests and five UI flows passing across two Simulator sizes; those historical results were not rerun here. Screenshots predate some later menu and catalogue changes.

Use the product status **“Working iOS app · development build”** and tour caption **“Bar / service tools · iOS app · Simulator screens”**. Animate only the editorial arrangement of the real stills. Do not imply interactive footage, production accounts/cloud sync, EPOS integration, an App Store release, or current operational venue use. The screenshot content is illustrative sample data.

Further source screenshots were inspected and exported with the same full-frame resize and encoding:

| File | Actual captured state | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| `assets/v2/bar-search.webp` | Universal search with `negroni` entered, a visible Negroni “Classic reference” result, and the native keyboard. | 36,340 | `3d08d4c23652ad3e11c6f00d41ae36f719962274f73ce6efe89a5980b803c199` |
| `assets/v2/bar-library.webp` | Sample venue cocktail collection, with spirit filters visible. This is not the Classics collection. | 63,958 | `5f22c5807c4a14ee2487d67283827f696da36abb9ca84eccd3ea43f4f3f1c3e9` |
| `assets/v2/bar-recipe.webp` | Sea Glass sample recipe with ingredient quantities; its cocktail photograph is a source-documented AI concept image. | 71,974 | `f929ce49b87bdfb0d14d148a222cdf3b839c9c1b62b47ab72f4ca246420e6970` |

These are separate actual screen states. Do not animate invented typing, filter changes or taps, and do not present the Negroni result followed by Sea Glass as a connected selection flow. There is no ingredient-query screenshot, classic-detail screenshot or native interaction video in the inspected repository.
