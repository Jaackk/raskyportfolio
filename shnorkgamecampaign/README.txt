IN THE SHADOW OF A SHNORK — CAMPAIGN WEBSITE
Free GitHub publication: https://jaackk.github.io/shnorkgamecampaign/
Requested custom-domain address: https://raskyjack.com/shnorkgamecampaign/
Custom-domain publication awaits safe hosting capacity; do not change live DNS without validated HTTPS.
Steam and App Store previews are the first choices on the home page.

Update workflow:
1. Edit the offline marketing studio and replace approved imagery there.
2. Run prepare_publication.py from that studio to refresh this scoped public bundle.
3. Review links, desktop/mobile layout, source records and status labels.
4. Commit only shnorkgamecampaign/ in Jaackk/raskyportfolio and push main.
5. Publish the same subdirectory to Jaackk/shnorkgamecampaign main using
   git subtree split --prefix=shnorkgamecampaign and push that commit to the
   campaign repository main. Its GitHub Pages source is main at repository root.
6. Verify the secure GitHub campaign URL. The existing raskyjack.com domain
   remains on Netlify; a GitHub push alone does not update its paused deployment.

This folder contains public presentation files only. Discovery inventories,
machine paths, raw recording excerpts and development scripts stay offline.
Binary assets may be hard-linked locally to avoid duplicate disk use. Replace
exports through the offline design workflow; do not edit these linked binaries.
