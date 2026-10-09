# Product screenshot provenance

This records the V1 still captures. V2's actual interaction recordings and current product status are documented in [product-v2.md](product-v2.md); the overview still remains a V2 fallback.

Captured 9 October 2026 from this checkout through `http://127.0.0.1:4293/` with Playwright and Microsoft Edge. These are screenshots of the running interfaces, not reconstructed or generated UI. All interactions took place in disposable, isolated browser contexts. No accounts, real guests, external orders or payments were involved. The project source and existing product assets are unchanged.

Lossless screenshot originals are retained under `theatre/assets/originals/`. The delivery images are WebP encoded directly from those originals with Sharp, without compositing, repainting, sharpening or upscaling. Element screenshots are direct browser crops of the rendered interface.

## Perfect Host — interactive local prototype

Source: `/perfecthost-demo/` (`perfecthost-demo/index.html`). Public destination: `https://raskyjack.com/perfecthost-demo/`.

The app's default sample floor plan includes tables at different service stages. It is an interactive prototype with localStorage persistence, not evidence of a shared production backend. The older `assets/optimized/perfecthost-map.webp` is a different, stylized view; these new captures show the current running prototype.

| Delivery asset | Dimensions | Captured state |
| --- | --- | --- |
| `assets/perfecthost-overview.webp` | 1440 × 840 | Fresh browser context, default sample floor plan, Fit selected. |
| `assets/perfecthost-detail.webp` | 1440 × 840 | Table 12 selected; four guests; Water and first Drinks marked complete; table editor open. A sample note was saved before capture, but is not visible in this image. |
| `assets/perfecthost-editor.webp` | 840 × 550 | Direct element screenshot of the same Table 12 workflow at device scale factor 2; actual 420 × 275 CSS-pixel editor. Readable close detail. |
| `assets/perfecthost-note.webp` | 840 × 128 | Direct element screenshot of the saved sample note reopened at device scale factor 2. Note explicitly begins “Sample guest note”. |

To reproduce:

1. Open `/perfecthost-demo/` in a fresh browser context at a 1440 × 840 CSS-pixel viewport. Wait for fonts and the floor-plan image.
2. Click Fit for the overview.
3. Select Table 12 (`.table[data-id="12"]`). Click its `+` guest button once; the app chooses the table's default four guests.
4. Click Water, then Drinks ordered. The app labels the completed drinks step “1st Drinks” and shows “Drinks ordered” as the current table status.
5. Open Note, enter `Sample guest note: anniversary; window table requested.`, and Save. Open Note again to inspect the persisted text.
6. Capture the page for the detail image; capture `#editor` and `#noteForm` for the close details. The timestamps naturally change on a later capture.

Verified through the UI and stored state: guest count updates, service steps update, and note text persists in the current browser context. Useful tour copy: “Perfect Host · interactive prototype” and “Tables, timings and the small things you don't want to miss.”

## EtsyCalc — working browser calculator

Source: `/etsycalc/` (`etsycalc/index.html`). Public destination: `https://raskyjack.com/etsycalc/`.

| Delivery asset | Dimensions | Captured state |
| --- | --- | --- |
| `assets/etsycalc-workflow.webp` | 1412 × 928 | Direct screenshot of `.calculator-grid`: entered product costs, computed result and the existing insights panel. |
| `assets/etsycalc-result.webp` | 587 × 928 | Direct screenshot of `.results-card`, suitable for a narrow composition. |

To reproduce: open the calculator at a 1440 × 1100 viewport with device scale factor 1. In Simple mode enter selling price `20`, shipping charged `5`, cost to make `8`, and shipping cost `2.50`. Keep the page's default 30 sales per month. Click Calculate My Profit. The current code displays profit per sale **£10.92**, margin **43.7%**, and monthly estimate **£327.54**. Capture `.calculator-grid` or `.results-card` after scrolling settles.

A second UI check changed only selling price to `30`; the result updated to **£19.66** and **56.2%**, demonstrating that the result responds to inputs. These figures record the app's actual output under its current assumptions; they are not independent verification of tax treatment or current Etsy fees. Do not repeat the existing interface's “latest fees” claim in Theatre narration. No premium purchase or external form was submitted.

Useful tour copy: “EtsyCalc · working calculator” and “A browser-based profit estimator for UK Etsy sellers.”

## Editorial choice

Perfect Host provides a clear prototype workflow and a readable interaction detail. EtsyCalc provides a different, observable input-to-result example. Rockwater is intentionally omitted from the tour in accordance with the requested emphasis on Jack's own work.
