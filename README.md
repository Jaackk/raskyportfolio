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
- About Jack
- Contact

## Decap CMS Admin

Decap CMS files:

```text
admin/index.html
admin/config.yml
```

Go to:

```text
https://raskyjack.com/admin/
```

The Netlify Identity / Git Gateway editor is a legacy setup. The current editing workflow is Codex/GitHub: commit changes to `main` and GitHub Pages publishes them. The legacy CMS files remain for reference; its sign-in is not part of the current publishing workflow.

Current CMS collections:

- Site Settings: browser title, contact email, footer links, music URLs and view counter label
- Homepage: hero text, hero buttons, floating hero cards, Core Ventures and contact CTA
- Raskys: homepage copy, blueprint image, concept cards, Raskys page copy and business plan link
- Music: section copy, artist links, featured release, releases/discography, artwork and streaming links
- Products & Projects: six homepage cards, order/show controls, card images, project links and modal content
- Creative Studio: hero, wide showcase sections, Perfect Host, Rockwater Preorders and design gallery items
- Documents & PDFs: CV, Raskys business plan, Shnork preview and other downloadable files

Media uploads:

```text
assets/uploads/
```

Document/PDF uploads from the Documents collection:

```text
assets/docs/
```

When replacing images, use optimized web images where possible. Very large uncompressed uploads will slow the site down.

### Editing Workflow

1. Open `/admin/` and log in.
2. Pick the section you want, for example `Homepage` or `Products & Projects`.
3. Edit the clearly labelled fields.
4. For images, use the Media picker or upload a new optimized JPG/PNG/WebP.
5. For PDFs, use `Documents & PDFs`; those uploads are stored in `assets/docs/`.
6. Click Save, then publish the entry.
7. Wait for the Netlify deploy to finish, then check the live page.

Useful rules:

- Internal links should look like `/music/`, `/raskys/` or `/design/`.
- External links should include `https://`.
- General image uploads go to `assets/uploads/`.
- PDF/document uploads go to `assets/docs/`.
- Use the `Show this card/release` toggles to hide content without deleting it.
- Use `Display order` fields to reorder project cards or music releases.
- Avoid editing migrated website files manually unless you are intentionally changing those standalone sites.

### Authentication Setup

The admin route uses Netlify Identity and Git Gateway:

```yml
backend:
  name: git-gateway
  branch: main
```

Netlify must have Identity and Git Gateway enabled for the deployed site. The Git Gateway service is authorised through GitHub and commits CMS edits back to this repository.

Do not add a public username/password to this repo. Do not put OAuth secrets in `admin/config.yml`, JavaScript, or any public file.

Manual setup checklist:

1. Deploy this repository through Netlify.
2. Enable Netlify Identity.
3. Enable Git Gateway and connect it to GitHub.
4. Invite the editor email address as an Identity user.
5. Confirm the invite and log in at `https://raskyjack.com/admin/`.

Publishing model:

- Decap edits the JSON files and media files in this repository.
- Saved changes become Git commits through Netlify Git Gateway.
- The public site redeploys from `main`.

Current limitation:

- `/admin/` requires a valid Netlify Identity user. If login fails, check Netlify Identity invitations, Git Gateway status, and the deployed Netlify site URL/domain settings.
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

The public website is hosted on GitHub Pages. Push changes to `main` to publish; a Netlify production deployment is not required.

Netlify still hosts the DNS zone for `raskyjack.com`. Keep that zone and its nameservers: email forwarding is handled separately by ImprovMX. The website records are an apex `ALIAS` to `jaackk.github.io` and a `www` `CNAME` to `jaackk.github.io`. Preserve the existing ImprovMX MX records (priorities 10 and 20) and SPF TXT record when changing website hosting. Do not delete the DNS zone when retiring Netlify website hosting.

Recommended Pages settings:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

Keep `.nojekyll` in the repo root.

Live URL:

```text
https://raskyjack.com/
```
