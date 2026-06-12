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

Small public-site edits are now managed through Decap CMS content files.

Admin route:

```text
https://raskyjack.com/admin/
```

Editable content files live in:

```text
content/site.json
content/homepage.json
content/raskys.json
content/music.json
content/projects.json
content/creative-studio.json
content/documents.json
```

The public site loads those JSON files with `script.js`. If a content file is unavailable, the static HTML remains as the fallback so the live site still renders.

The original page structure still lives in:

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

## Decap CMS Admin

Decap CMS files:

```text
admin/index.html
admin/config.yml
```

Current CMS collections:

- Site Settings: title, contact email, footer links, music URLs, view counter label
- Homepage: hero text, buttons, hero cards, Core Ventures, contact copy
- Raskys: homepage section, concept cards, blueprint image, Raskys page copy, business plan link
- Music: music section copy, Spotify/music links, featured release, discography items and album artwork
- Products & Projects: project cards and modal content for live-site previews
- Creative Studio: hero, Graphic & Web Design, Perfect Host, Restaurant Pre-Order System, gallery items
- Documents: CV, Raskys business plan and Shnork preview PDF paths

Media uploads:

```text
assets/uploads/
```

Document/PDF uploads from the Documents collection:

```text
assets/docs/
```

When replacing images, use optimized web images where possible. GitHub Pages will serve whatever is committed, so very large uncompressed uploads will slow the site down.

### Authentication Setup

The admin route is present, but secure login is not automatic on GitHub Pages alone.

Decap CMS with the `github` backend requires a real GitHub OAuth flow. A static GitHub Pages site cannot safely store the OAuth client secret, so you must connect one of these before using `/admin/` securely:

- a small OAuth proxy such as the official Decap/Netlify CMS GitHub OAuth server
- Netlify Identity + Git Gateway, if the site is later hosted on Netlify
- another trusted serverless OAuth gateway that stores the GitHub OAuth secret server-side

Do not add a public username/password to this repo. Do not put OAuth secrets in `admin/config.yml`, JavaScript, or any public file.

Typical GitHub OAuth setup:

1. Create a GitHub OAuth App.
2. Set the callback URL to the callback route required by your chosen OAuth gateway.
3. Store the OAuth client secret only in that gateway's private environment variables.
4. Configure `admin/config.yml` with the gateway `base_url` if your gateway requires it.
5. Visit `https://raskyjack.com/admin/` and log in with a GitHub account that has write access to `Jaackk/raskyportfolio`.

Publishing model:

- Decap edits the JSON files and media files in this repository.
- Saved changes become Git commits or editorial-workflow pull requests depending on the configured backend support.
- GitHub Pages redeploys from `main`.

Current limitation:

- `/admin/` loads the CMS interface, but editing will not be secure or usable until GitHub OAuth/auth gateway setup is completed.
- The existing migrated websites (`/music/`, `/motiondesk/`, `/etsycalc/`, `/rockwaterpreorders/`) are intentionally not converted into CMS-managed pages.

## Internal Pages

Clean GitHub Pages routes are implemented as folders with `index.html` files:

- `/music/`
- `/raskys/`
- `/motiondesk/`
- `/sportspredict/`
- `/tennispredict/`
- `/etsycalc/`
- `/perfecthost/`
- `/shnork/`
- `/raskode/`
- `/design/`
- `/rockwaterpreorders/`
- `/perfecthost-demo/`

Architecture:

- Existing live sites migrated as independent websites: `/music/`, `/motiondesk/`, `/etsycalc/`, `/rockwaterpreorders/`
- Portfolio-style project pages: `/raskys/`, `/sportspredict/`, `/tennispredict/`, `/perfecthost/`, `/shnork/`, `/raskode/`, `/design/`
- Perfect Host is included inside the Creative Studio section and has a project page at `/perfecthost/`, plus the mobile prototype at `/perfecthost-demo/`
- Rockwater Preorders is also included inside Creative Studio and linked to the preserved working site at `/rockwaterpreorders/`

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
assets/docs/raskys-business-plan.pdf
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
