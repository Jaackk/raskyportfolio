# Rasky Portfolio

Static GitHub Pages site for Rasky: Jack Ormondroyd's personal brand across hospitality, Raskyjack music, product prototypes, visual ideas and creative technology.

## Run Locally

From this folder:

```powershell
python -m http.server 4293
```

Then open:

```text
http://localhost:4293
```

The site is plain HTML, CSS and JavaScript. There is no build step.

## Edit Content

The page structure and copy live in:

```text
index.html
```

Visual styling lives in:

```text
styles.css
```

The small mobile navigation script lives in:

```text
script.js
```

Main sections:

- Hero
- Core Ventures: Raskys and Raskyjack
- Raskys hospitality vision
- Raskyjack music and discography
- Products & Projects
- Dedicated project sections
- About Jack
- Contact

## Internal Pages

Clean GitHub Pages routes are implemented as folders with `index.html` files:

- `/music/`
- `/raskys/`
- `/motiondesk/`
- `/sportspredict/`
- `/tennispredict/`
- `/etsycalc/`
- `/shnork/`
- `/raskode/`
- `/design/`
- `/rockwaterpreorders/`
- `/perfecthost-demo/`

Architecture:

- Existing live sites migrated as independent websites: `/music/`, `/motiondesk/`, `/etsycalc/`, `/rockwaterpreorders/`
- Portfolio-style project pages: `/raskys/`, `/sportspredict/`, `/tennispredict/`, `/shnork/`, `/raskode/`, `/design/`
- Perfect Host is included inside the Graphic Design & Websites section and linked as a mobile prototype at `/perfecthost-demo/`
- Rockwater Preorders is also included inside Graphic Design & Websites and linked to the preserved working site at `/rockwaterpreorders/`

Later, `music.raskyjack.com` can point to `/music/` using DNS/subdomain configuration or a redirect. This repo does not make DNS changes.

## Assets

Optimized web images are in:

```text
assets/optimized/
```

The lightweight Raskys venue drawing is:

```text
assets/raskys-blueprint.svg
```

Current visual assets include Perfect Host, Motion Desk, EtsyCalc, TennisPredict, Raskyjack Illusions/Suffolk/Sunburst/Brick by Brick artwork, Shnork artwork, live Raskyjack photography and hospitality/brand visuals.

PDF downloads live in:

```text
assets/docs/jack-ormondroyd-cv.pdf
assets/docs/in-the-shadow-of-a-shnork-preview.pdf
```

## View Counter

The footer includes a subtle `Site views` label. The current implementation tries to read from CountAPI and gracefully falls back to `Site views --` if the service is unavailable.

For a production-grade public counter, connect a reliable privacy-friendly analytics service such as GoatCounter, Plausible, Cloudflare Web Analytics or another hosted counter service.

## Deploy

The repository is GitHub Pages compatible.

Recommended Pages settings:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

Keep `.nojekyll` in the repo root.

Live URL:

```text
https://raskyjack.com/
```
