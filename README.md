# Rasky Portfolio

Static GitHub Pages site for Rasky: Jack's personal brand across hospitality leadership, Raskyjack music, creative products, business concepts and AI-assisted building.

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

Most homepage content lives in:

```text
data.js
```

Edit these sections there:

- hero visual strip panels
- identity strip
- About pillar cards
- Raskys concept pillars
- Raskyjack music links and track list
- project cards
- What I Bring cards

Structural page copy is in:

```text
index.html
```

Visual styling is in:

```text
styles.css
```

## Assets

Optimized web images are in:

```text
assets/optimized/
```

Source/original images are kept in:

```text
assets/
```

Current optimized assets include:

- Perfect Host interface
- Motion Desk screenshot
- EtsyCalc screenshot
- TennisPredict mockup
- Illusions artwork
- Shnork artwork
- hospitality / brand visuals

## Deploy

The repository is GitHub Pages compatible.

Recommended Pages settings:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

The `.nojekyll` file should stay in the repo root.

## Domain Notes

The current footer/contact direction uses:

```text
raskyjack.com
hello@raskyjack.com
```

If a custom domain is connected later, add a `CNAME` file at the repo root containing the final domain, for example:

```text
raskyjack.com
```

Also configure the DNS records in the domain provider to point to GitHub Pages.
