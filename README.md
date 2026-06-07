# Rasky Portfolio

Premium personal brand / portfolio website for `raskydesign.com`.

## Run locally

This is a static site. From this folder:

```powershell
python -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

You can also open `index.html` directly in a browser, but a local server is closer to deployment.

## Edit content

Most portfolio content is in:

```text
data.js
```

Edit project titles, statuses, copy, strengths, links, cocktail names, timeline items, capabilities and music links there.

The contact form email is in:

```text
index.html
```

Replace `hello@raskydesign.com` with the real contact email before publishing.

## Assets used

Curated local assets were copied into `assets/` and optimized JPEG versions were generated in `assets/optimized/`.

Included assets:

- TennisPredict mockup from `Documents/SportsPredictions/MockupsImages`
- Perfect Host floor map from `Documents/Codex/PerfectHost`
- Shnork cover and character art from `Desktop/SHNORK CONTENT`
- Raskyjack artwork from `Desktop/raskymusic/Artwork`
- Rasky branding / restaurant visual from `Documents/raskydesign`
- Rasky logo from `Documents/raskydesign`

## Current TODOs

- Add real Motion Desk exported screenshot when available.
- Add real Raskode screenshots/docs when the concept has a dedicated local prototype.
- Replace placeholder music/social links in `data.js`.
- Replace contact email in `index.html`.
- Add GitHub/portfolio links once the exact public URLs are chosen.

## Deployment suggestion

For `raskydesign.com`, deploy the folder as static files through Netlify, Vercel, Cloudflare Pages or your existing domain host. The site has no build step, so the deployment root can be this folder.
