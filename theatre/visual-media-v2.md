# Theatre v2: real skating and gameplay media

Reviewed and exported 9 October 2026. Photographic, skating and game material comes from the actual sources identified below; no invented action or optical-flow interpolation is used. Four user-supplied skate illustrations now have explicitly authorized image_gen lettering edits from ESCAPISM to RASKY, documented below. Existing venue and novel concept artwork retain their stated source qualifications. The current practice and live-performance picture are retimed to the supplied song; see `audio-README.md`, `assets/v2/practice-sync.json` and `assets/v2/sync.json`. Current game exports include documented crop/resize operations. Source originals remain unchanged.

## Current expanded curation

The current chapter selection is recorded by `chapters.js` and `media-manifest.json`. Retained originals and earlier derivatives are not automatically current presentation assets.

### Current three-trick edit: continuous motion

`assets/v2/skate-montage.mp4` and its `-mobile` alternative are **9.600 seconds / 288 frames at 30 fps**. They supersede the earlier held-pane compositions at those filenames. Exact hashes, source windows and transitions are in `assets/v2/skate-edit.json`. The third shot is the requested yellow-cone/night-bank kickflip; the rejected red-shirt flatground `Ch7LiTGtJCt` shot is unused.

| Real source | Source interval | Montage interval | Action retained |
| --- | --- | --- | --- |
| `originals/skate-CsBRDhFsM9g.mp4` | 1.500–5.400s | 0.000–3.900s | Moving setup, flip, catch/landing and actual roll-away. |
| `originals/CguBNaQNX15-1.mp4` | 3.800–6.400s | 3.700–6.300s | Moving setup, daylight bank jump, landing and actual roll-away. |
| `originals/CmsDLCdteNF-1.mp4` | 3.033333–6.533333s | 6.100–9.600s | Moving setup, requested cone kickflip, landing and actual roll-away. |

All three play continuously at native speed. Crossfades at3.7–3.9s and6.1–6.3s show two moving sources. There are **no frozen pre-action panes, cloned end holds, speed ramps or optical-flow frames**. The roughly1.0–1.3s setups replace the long pushing sections, while the complete action and landing remain. The yellow cone is clearly visible beside the bank in the final source. The user names the kickflip; visual review establishes the matching obstacle, board flip and successful landing. Its original camera briefly clips the upper head during airtime; the whole available frame, board and landing are preserved.

Desktop is1280×720; mobile720×1280. Each complete source frame is contained, centered over a dim blurred **moving duplicate of that same shot**. Only the background duplicate is dimmed/desaturated/blurred; the encoded primary action has no crop or grading. The final presentation separately applies a CSS print treatment: contrast1.14, saturation0.76, sepia0.16 and grain. This fills the canvas without inventing continuity between different sessions. Current posters are actual montage1.2s. Silent H.264 CRF20, faststart; video sizes3,785,729 /3,671,954bytes.

Public sources: <https://www.instagram.com/reel/CsBRDhFsM9g/>, <https://www.instagram.com/p/CguBNaQNX15/> and <https://www.instagram.com/p/CmsDLCdteNF/>. Full originals remain unchanged under `originals/`. Separate native silent `skate-trick.mp4`, `skate-daylight.mp4` and `skate-night.mp4` are full-source intermediates, not current chapter assets. The dedicated **quarterpipe `treflip.jpg`** remains unchanged and separate; it is the explicitly requested photograph, not a frozen skate-video pane.

Other reviewed carousel sources: `Cb90i4tNrhI-1.mp4` has a complete nighttime flip with baked slow motion. `Ch7LiTGtJCt-1.mp4` has a full action but was rejected by the user for this edit. `CcFnplRt7M2-1.mp4` has a successful first action followed by a failed attempt; never present its full clip as two successful tricks. `CcLAB3CtTsq-1.mp4` obscures the actual landing outside frame and was not selected.

### User artwork: four RASKY derivatives

Connected Google Drive access to the user’s **ESCAPISM SKATEBOARDS** folder succeeded after public links remained sign-in gated. All28 originals were downloaded unchanged to `C:/Users/Jacko/Documents/Codex/theatre-qa/graphics-originals/`; `source-inventory.json` records stable Drive IDs/links, dimensions, provider byte counts and SHA256. All are3508×4961 PNGs, with14 opaque numbered versions and14 descriptively named transparent versions. There are no SVG/AI/PSD or editable text sources.

The current presentation uses four transparent1055×1491 PNG derivatives under `assets/design/skate/`: `rasky-padlock.png`, `rasky-heart.png`, `rasky-road.png` and `rasky-arch.png`. Their originals are `SkeletonWithPadlock.png`, `SkateboardsHeart.png`, `SkeletonSkatingOnRoad.png` and `SkeletonComingFromArch.png`. The user expressly authorized the ESCAPISM→RASKY lettering change. The built-in image_gen edit prompts are preserved in `assets/design/skate/edits.json` and the manifest. Final derivatives were visually inspected: RASKY is readable, the heart retains SKATEBOARDS, and the respective source illustrations remain recognisable. They are raster image-generation edits, not byte/pixel-identical or editable-vector conversions. Original artwork creation methods were not independently audited.

The skating chapter references padlock/road; the quarterpipe photograph chapter references heart/arch. No timeline or audio extension was introduced. The remaining original designs stay preserved and unselected rather than being incorrectly listed as current Theatre media.

### Full portrait performance inserts

The selected `guitar-portrait-blue`, `guitar-portrait-warm` and `guitar-portrait-violet` videos supersede the earlier tight `guitar-broll-*` crops. Each retains the complete original1300×2304 frame, downsampled to720×1276 with2px padding above and below. The whole face remains visible; the violet original briefly places the far neck/fretting hand at its right edge. There is no added crop, upscale or speed change. Exact source intervals,124/249/185 output-frame counts, main-scene cues, final holds below35ms and hashes are in `assets/v2/guitar-portraits.json`. “Other moments / live” identifies these as different recording moments, not synchronized alternate views of the audible solo.

### Existing Raskys venue concept

The current Raskys scene reuses `/assets/optimized/raskys-hero-venue.webp`, the same1400×933,76,440-byte image already used by the homepage and `raskys/index.html`. It shows the red Raskys facade/sign and warmly lit concept venue. It is an **existing concept visualization of an aspirational venue**, not a photograph of a built or operating site. No new image was generated or reconstructed. The cocktail menu/lineup candidates are not selected in this chapter.

### Current environment-only Shnork edit

`assets/v2/shnork-environment.mp4` is **1280×720**, and `shnork-environment-mobile.mp4` is **576×720**. Both are **7.000s /210 frames at30fps**, silent H.264 CRF20 with faststart. The current6.9951s scene uses almost the entire export. This replaces the earlier `shnork-montage` character shot at the user's request; no walking-character shot remains in the selected sequence.

- First3.0s: real repository `shnorkgame/media/vid/gp-glade-1080.mp4`, source **0.600–3.600s**, the same moving river/glade view the user selected.
- Following4.0s: `shnorkgame/media/vid/gp-upstream-1080.mp4`, source **0.400–4.400s**, an upstream river winding into forest.
- Desktop downscales each full1920×1080 source to1280×720. Mobile uses864×1080 river-focused crops atx850 andx500 respectively, then downscales to576×720. No generated scenery, colour grade, speed change or interpolation.
- Matching posters are actual montage4.5s, upstream source1.9s. Current source recordings and all earlier character derivatives remain unchanged. This is an environment showcase from the real engine, not proof of a character interaction.

### Actual novel PDF scroll, before the environment

Source is unchanged `assets/docs/in-the-shadow-of-a-shnork-preview.pdf`, a42-page illustrated preview. The PDF skill was read; Poppler rendered all42pages for visual inspection because they have no extractable text layer. **No buffs/debuffs board appears in thisPDF**. The status-effects board belongs to a separate `/shnork/` website section and is not part of the selected assets.

`assets/v2/shnork-novel-scroll.mp4` is a **3.200s /96-frame** smooth vertical scroll of all **42 actual PDF pages**, from the existing cover to the final illustrated chapter-title page. Poppler renders at720px width; each full page is contained in720×1024 with12px page gaps. The scroll holds the cover0–0.2s, moves gently through the first page0.2–1.1s, accelerates through the remaining page stack and smoothly settles1.1–2.8s, then holds page42 through3.2s. Page42 shows the spider/roots illustration with “Venom in Veins / The Path of Poison”; page41 is the final narrative forest illustration. No text, page artwork or reader controls were rebuilt. Silent H.264 CRF19, faststart,720×1024.

`shnork-novel-poster.jpg` is the actual cover at the first video frame. `shnork-novel-end.jpg` is actual page42 for manual/reduced-motion use. `novel-source.json` records the source PDF hash, exact pages and export hashes. It is a quick preview rather than enough time to read every word. Existing illustration creation methods were not independently re-audited. The earlier separate cover-only treatment is superseded by this real-page scroll.

### Four distinct existing guitar photographs

All four are real repository MUSIC gallery photographs, native **853 × 1280**, exported without cropping to WebP quality90/method6. Camera originals remain unchanged. All show the same live setting, but the selected viewpoints, gestures and colours are materially different.

| Current asset under `assets/v2/` | Exact source under `music/media/` | Composition |
| --- | --- | --- |
| `photo-mic.webp` | `DSC01880 Large.jpeg` | Warm singing/microphone pose with visible guitar. |
| `photo-blue-profile.webp` | `DSC01930 Large.jpeg` | Blue side profile, angled neck and fretting hand. |
| `photo-green-stage.webp` | `DSC02047 2 Large.jpeg` | Wider green stage/body view with drummer behind. |
| `photo-guitar-hands.webp` | `DSC02093 2 Large.jpeg` | Close orange view of guitar, hands and face from another angle. |

The earlier standalone cover `assets/optimized/shnork-cover.webp` (1024 × 1536), derived from `assets/shnork-cover.png`, remains preserved but is not selected. Current novel imagery comes from the actual PDF pages described above.

## Earlier V2 delivery files — retained provenance

All paths below are relative to `theatre/assets/v2/`.

| File | Native/export dimensions | Duration | Use |
| --- | --- | --- | --- |
| `skate-trick.mp4` | 720 × 1280, 30 fps | **5.40 s** | Complete real trick, including approach, setup, flip, catch, landing and roll-away. |
| `skate-poster.jpg` | 720 × 1280 | Still at source 3.12 s | Poster from the selected real video. |
| `treflip.jpg` | **1080 × 1080** | Photograph | Correct quarterpipe photograph: airborne skater, board visibly separated and mid-spin. |
| `shnork-gameplay.mp4` | 1280 × 592, 30 fps | **6.80 s** | Genuine game capture: character moving through the forest, warm light, foliage and glimpses of the river. |
| `shnork-poster.jpg` | 1280 × 592 | Still at source 70.0 s | Exact gameplay poster. |
| `shnork-gameplay-portrait.mp4` | 472 × 590, 30 fps | **6.80 s** | Optional 4:5 centre crop. Full character remains in view. |
| `shnork-poster-portrait.jpg` | 472 × 590 | Same instant | Poster with the same portrait crop. |

The skate export contains the complete original video stream, copied without re-encoding, at native speed. Its source container reports 5.52 seconds because the audio extends beyond the 162 video frames. The actual video is 5.40 seconds; do not slow it down or invent an extra roll-away. The delivery MP4 removes audio and moves its index to the front for playback. Its visual frames are unchanged.

All delivery videos are silent to avoid conflict with the tour's separate music audio. Downloaded social originals retain their original audio for provenance; do not automatically play them alongside the music.

## Skating ownership, access and selection

The portfolio links to `@raskyjack`; the public `@raskyskate` biography links back to `@raskyjack`. This confirms the account relationship. The user separately confirmed that these are their clips and authorized their use from public Instagram.

Public profile: <https://www.instagram.com/raskyskate/>. The profile grid rendered normally after declining optional cookies and closing Instagram's dismissible sign-up invitation. Clicking a post directly presented a login requirement, so that route was not used. The ordinary **public embed** pages rendered their own visible media players without login. Files were downloaded only from those rendered players' standard `currentSrc` URLs. No login wall, private account, hidden API, signed-URL modification or download restriction was bypassed. CDN URLs expire and are deliberately absent from the presentation data; stable post URLs are recorded here instead.

### Selected complete trick

- Public source: <https://www.instagram.com/reel/CsBRDhFsM9g/>; publicly playable embed: <https://www.instagram.com/reel/CsBRDhFsM9g/embed/>.
- Profile date: 9 May 2023. The embed identifies `raskyskate` and “Original audio”.
- Downloaded original: `originals/skate-CsBRDhFsM9g.mp4` (720 × 1280, H.264, 30 fps).
- Selection: all video frames, 0.00–5.40 s.
- Actual decoded sequence inspected across the full clip: approach and setup 0.0–2.8 s; board flipping approximately 2.8–3.5 s; catch and landing approximately 3.5–3.8 s; clear roll-away until the final frame. The skater passes close to the camera during the approach; do not crop the portrait source further.
- Reason: strongest accessible complete sequence with a successful landing, a clear roll-away, usable framing during the trick and enough lead-in to understand it. No technical trick name is asserted for this video.

### Correct quarterpipe photograph

- Public source: <https://www.instagram.com/p/CreWEl5tko1/>; embed: <https://www.instagram.com/p/CreWEl5tko1/embed/>.
- Profile date: 25 April 2023. **Carousel slide 2**, reached through the embed's visible Next button.
- Downloaded original: `originals/quarterpipe-slide2-0.jpg`. `treflip.jpg` is a byte-identical copy of that full 1080 × 1080 image.
- Visible evidence: skater wearing a red bandana and red shoes, airborne above the quarterpipe; the skateboard is visibly separated from both feet and mid-spin. Face, hands, shoes, board and quarterpipe are all present.
- The user identified the moment as a tre-flip. The selection is based on the actual photograph, not on inferring a trick from the earlier cover image. V1's `skate-ramp.jpg` used **slide 1**, which is a different moment and is not this requested photograph.
- Use the full square as the baseline. If a responsive layout crops it, retain the head at the top, board at approximately x=30–57%, y=35–57%, both feet and the visible quarterpipe. A severe landscape crop loses the story; contain/frame it rather than removing the board or landing context.

### Other inspected reels

| Source | Source size / duration | Decision based on the actual sequence |
| --- | --- | --- |
| <https://www.instagram.com/reel/CoM-cqMDmMy/> | 720 × 900 / 7.64 s container | Rejected: failed landing; loose board and fall are visible after the trick. Do not cut around the failure. |
| <https://www.instagram.com/reel/Ch2ibARDXRJ/> | 672 × 1194 / 2.50 s container | Rejected for this edit: landing/step-off is unstable and roll-away is insufficient. The attractive thumbnail was not treated as proof of a completed trick. |
| <https://www.instagram.com/reel/CfbagNaDdrs/> | 720 × 720 / 2.18 s container | Short successful-looking sequence, but only a very short roll-away. The 5.40-second selected clip reads more clearly. |
| <https://www.instagram.com/reel/CcFoDm4DjG_/> | 720 × 720 / 3.74 s container | Approach and airborne sequence visible, but the source cuts too soon for a convincing longer roll-away. |

Their downloaded MP4 originals are retained under `originals/`. The additional public carousel originals at `Ch7LiTGtJCt`, `CguBNaQNX15`, `CmsDLCdteNF`, `CcLAB3CtTsq`, `CcFnplRt7M2` and `Cb90i4tNrhI` were subsequently reviewed in full as described in the current curation section above.

## Genuine Shnork gameplay

Source recording, unchanged:

`C:/Users/Jacko/Documents/Codex/ShnorkscapeProduction-wt/integration-revolution/QA/CharacterRevolution/B16Motion/b16-locomotion.mp4`

This is a 90-second local game QA capture, 1280 × 592 at 30 fps, from the user's Shnork project. The selected interval is **68.000–74.800 seconds**. It shows the actual character walking through the playable forest with a following gameplay camera. The existing small game prompt and joystick remain in the landscape export, making the state honest. It is not a marketing animation or a still-book-cover treatment.

Landscape export uses H.264, yuv420p, CRF 21, native 30 fps and `+faststart`. No visual crop, colour grading or speed change. The optional portrait export uses the same exact interval with `crop=472:590:404:0`; this keeps the complete character centrally framed throughout the reviewed interval, while sacrificing peripheral river/context. It is an alternative source for narrow layouts, not extra footage to play concurrently.

Other genuine sources inspected included repository `shnorkgame/media/vid/gp-glade-1080.mp4`, `gp-north-1080.mp4`, `gp-upstream-1080.mp4`, other `gp-*`/`eye-*` clips, the local `Shnorkscape-first-arc.mp4`, `forest-stream-walkthrough.mp4`, and newer companion/dodge captures. The website clips have attractive river/forest views but a much smaller character; the selected B16 capture makes actual character gameplay readable. The 8-fps walkthrough was not stretched or interpolated into a smooth performance.

## Local inventory and future replacements

A targeted filename inventory covered the Codex workspace and media in Desktop, Downloads, Pictures and Videos, excluding dependency/build caches. This identified the genuine game recordings. The user then confirmed that the skate originals are not on this PC, so the local skate search stopped and the accessible public Instagram sources above were used.

The skate clip and exact requested photograph are now available and verified; there is no missing-video fallback in this selection. Higher-quality camera originals could later replace `skate-trick.mp4` and `treflip.jpg` while keeping the same interval/composition and the controller data separate. Do not label the current 720 × 1280 clip as original-camera 1080p or upscale it to manufacture resolution.

## Additional guitar-playing process footage

The user subsequently requested actual Instagram playing/practising footage before the live performance. The ordinary public **Reels** tab at <https://www.instagram.com/raskyjack/reels/> exposed additional seated guitar performances beyond the public profile's first twelve mixed posts. Their normal public embed players rendered without authentication. As with the skating footage, only the visible players' standard media URLs were used to preserve originals. The public `embed/captioned/` pages also displayed the owners' captions; those captions inform the qualifications below. No protected API or login bypass was used.

### Current landscape playing excerpt

- Delivery: `assets/v2/practice-guitar.mp4` and `assets/v2/practice-guitar-poster.jpg`.
- Source: <https://www.instagram.com/reel/DUD_MWUDRK9/>; original retained as `assets/v2/originals/practice-DUD_MWUDRK9.mp4` (1276 × 718, 30 fps, original AAC audio).
- Current exact source interval: **1.886484568–14.027814994 seconds**, retimed with duration ratio **0.917**, giving **334 frames / 11.133333 seconds**. This supersedes the earlier unsynchronised 12.0–23.2-second export at the same filename.
- Full native landscape frame is retained. Poster is the actual source frame at **5.5 seconds**. A square responsive viewport at `object-position: 30.5% 50%` was checked across the excerpt and retains head and both playing hands; a tighter 4:5 crop was rejected. No new portrait video was generated for this take.
- The caption (“Gorilla tape for the finger”) does not name the song. Subsequent audio analysis found strong same-song correspondence to *Smoke and Glass*. This is signal evidence, not a claim that every hand gesture was independently matched or that the studio track is the camera audio. Exact evidence and limits are in `assets/v2/practice-sync.json`.
- Video has no audio stream. The current single soundtrack **does include this actual practice recording**, quietly under the supplied studio material, before the louder actual live recording. Do not describe the current bridge as soundtrack-only or claim the studio guitar was removed; `audio-README.md` records the final blend.
- Current SHA-256: video `2dfb09eb48fa057d34d78e1b71afe57b960be2a9830793c08e9de49f55695e49`; poster `8eaa60dec0f6d15007697b13d8a25c4909fa5b9be255bc0a87048c585883b717`.

### Earlier portrait alternative — unused, different song

- Files: `assets/v2/practice-guitar-portrait.mp4` and `assets/v2/practice-guitar-portrait-poster.jpg`.
- Source: <https://www.instagram.com/reel/DQkMBVCjc3A/>; captioned embed: <https://www.instagram.com/reel/DQkMBVCjc3A/embed/captioned/>.
- Original: `assets/v2/originals/practice-DQkMBVCjc3A.mp4`, 103.30-second container, **720 × 1280**, 30 fps with original audio.
- Selected interval: **25.000–36.200 seconds**, **11.20 seconds / 336 native frames**. Poster is source **26.000 seconds**. H.264 CRF 21, silent, faststart, original framing and speed. Export size **2,280,599 bytes**; SHA-256 `20cb9a1dfcd5a172872a65cec05d191b7007931211129035afdb5e06ae6158c2`. This extends the initial six-second derivative to cover the same requested 11.1336-second bridge without looping.
- The caption explicitly names **Heavy Woodbridge Nights**. This is a different piece, and must never be labelled *Smoke and Glass*. It is a separate guitar-playing montage shot for the narrow layout, **not a portrait crop of the red-shirt take**. Its native frame includes both playing hands; part of the instrument's neck extends outside the original camera frame.

### Other public performances reviewed, not selected

- <https://www.instagram.com/reel/DQ7MW8GDVkD/>: 168.06-second, 720 × 1280 seated electric-guitar take. The public caption asks followers to name the track; it provides no established *Smoke and Glass* title. Full downloaded original retained as `assets/v2/originals/practice-DQ7MW8GDVkD.mp4`; no delivery excerpt selected.
- <https://www.instagram.com/reel/DL-ST5DNkKq/>: 94.99-second, 484 × 358 monochrome electric-guitar take. Its caption identifies a **Hotel California** solo. Not selected for this original-music sequence; original preserved as `assets/v2/originals/practice-DL-ST5DNkKq.mp4`.
- The existing portfolio `music/media/` files were also inventoried. They are the already-reviewed live performance and edited band footage, not new seated practice material.

A further public caption check followed the personal account's explicit link to `@raskymusic`; that account's visible biography links back to `@raskyjack`. The red-shirt crosspost <https://www.instagram.com/reel/DUEAGcejFa2/> and hoodie crosspost <https://www.instagram.com/reel/DRS6usGjLzx/> supplied no song-identifying caption. The black-shirt crosspost <https://www.instagram.com/reel/DQkThydjIdE/> again names *Heavy Woodbridge Nights*. This check did not establish a caption-supported *Smoke and Glass* practice match, and no extra derivative was substituted on that assumption.

The source caption record, chronological review sheets and local acquisition/export scripts are retained for local audit under `C:/Users/Jacko/Documents/Codex/theatre-qa/` with the `practice-` prefix. Only the selected derivative and poster should be referenced by the presentation; optional candidates remain separate until selected. The media manifest is updated after the final chapter selection, not inferred from every exported file in this folder.

## SportsPredict repository review and current concepts

The user's authorized GitHub access located `Jaackk/SportsPredictions`, commit `2473fdeecde1ebd3f32cf09bee5e3790c5a8667c`. Its only branch is `main`. The complete current tree contains no video and no separately identified real application screenshots. `Package.swift` requires macOS 14; the actual app imports SwiftUI and AppKit, so it cannot run on this Windows host. The source was read, not reconstructed as an imitation website.

Two existing `MockupsImages/` references are selected, with their original full frames preserved as quality-92 WebP:

| Export | Original repository path | Dimensions | Qualification |
| --- | --- | --- | --- |
| `assets/v2/sports-predictions-concept.webp` | `MockupsImages/7ae1288a-ac79-44e6-98a6-0461bfd79100.png` | 1601 × 983 | Predictions design with sample match rows and confidence values. |
| `assets/v2/sports-overview-concept.webp` | `MockupsImages/d62299c2-fd28-4fc7-8e71-d6d1cfbc839f.png` | 1536 × 1024 | Overview design with illustrative chart, statistics and table. |

These are **repository interface concepts with sample figures**, not verified captures of the running app. No zoom, crop, invented typing or fabricated controls were added. Original PNGs are preserved under `assets/v2/originals/`. A 320-pixel full-frame rendering was inspected: large headings/chart structure remain visible, but individual small table labels are not readable at that scale. A real app capture from macOS would be a useful replacement.

No repository named Raskode or related app media appeared in the GitHub name search or the fourteen accessible Jaackk repositories. The ambiguous `Client` repository contains only a Shnork distribution archive. The existing `/raskode/` explanatory page is the established source for the editorial tooling animation; no working app demonstration is claimed.
