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

## Deploy

The repository is GitHub Pages compatible.

Recommended Pages settings:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

Keep `.nojekyll` in the repo root.

Live URL:

```text
https://jaackk.github.io/raskyportfolio/
```
