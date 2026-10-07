# Rockwater disciplinary meeting reference

A static, local-first meeting workspace at https://raskyjack.com/rwdef/ .

## Open

Visit the URL once online, wait for “Offline reference ready”, and export a JSON backup before the meeting. All entered case information stays in this browser profile. The app has no account, AI service, analytics, telemetry, microphone or recording.

For a separate local copy, download this repository, open this directory and run `START-DEFENCE-TOOL.cmd` (Python 3 required). Open http://localhost:4298/ . `BUILD.cmd` validates the JavaScript using Node; there is no compilation or package installation. These files are the production build. The standalone `disciplinary-quick-reference.html` also opens directly without a server or JavaScript.

## During the hearing

Use the dashboard for the allegation, key provisions, quick responses and a timestamped event. Ctrl+K searches the complete public source corpus. Ctrl+Shift+S immediately switches to the neutral view. Escape closes a drawer. Source cards can open directly in neutral share view.

“Share screen” replaces the private interface and persists through a refresh in the same tab. Only source wording, official guidance and meeting facts you explicitly selected appear there. Selected facts retain their status and source. Private notes, evidence notes, comparators, draft appeals and preparation do not render in share mode. Return to the private workspace deliberately. The neutral view is a presentation aid, not an access password or encryption.

Record sources and positions separately. Employee acceptance is not treated as agreement by both. Produced evidence is distinct from an allegation about evidence. Checklists default to not confirmed, not a finding of breach. Drafts use selected or entered information and never submit anything. Click Update draft/summary after editing generated workspaces.

## Saving, backup and printing

Fields autosave in localStorage. Original files attached in Backup & sources stay in IndexedDB; no file is uploaded. JSON backup contains the case and event audit, but not attached original binary files. Keep originals separately. Import validates the data and requires a deliberate restore action before replacing the case. Browser storage and JSON backups are not encrypted. Protect your device and backup files.

Private summary and notes can export to text. Print the current view or choose Save as PDF in the browser. Neutral printing only includes what is permitted in the neutral view. The quick-reference HTML is a separate clean source pack. Clear data removes this app’s case and original-file storage after a typed confirmation.

## Sources and limits

All four supplied employment documents were read. The public corpus excludes personal contact details, pay, signatures and e-sign audit records. PDF page locators reflect source pages; DOCX uses stable paragraph locations rather than fabricated pages. Some handbook template placeholders are unresolved in the supplied document and remain visible. The handbook’s statements about legislation are historical documentary wording, not independent verification of current law; use ACAS & law for checked official references.

Official Great Britain legal references were checked on 7 October 2026. These are dated information, not automated legal advice. Northern Ireland has a separate regime. Check linked official sources for later changes, individual eligibility and deadlines. The appeal date helper excludes weekends only: verify the handbook’s trigger date, bank holidays and the communicated deadline. It is not a tribunal deadline.

The website and extracted policy library are public. Search indexing is discouraged, which does not provide access control. Entered notes are local to the browser, not pushed to GitHub. Browser extensions, other scripts with the same origin, device access and device/browser backups are outside this app’s protection. Use a localhost copy for a separate origin if preferred. The offline service worker caches this app’s public assets, never the case or attached originals. External legal links require internet access.

## Maintenance

Review `SOURCE-AUDIT.md` and `ASSUMPTIONS-AUDIT.md`. Amend source quotes only after checking exact underlying wording. Update the verification date when official material is rechecked. Bump the cache name in `sw.js` for every deployment changing assets. Preserve the localStorage key and migration support when changing the state schema.

Only `/rwdef/` and the corresponding robots exclusion are part of this change; the rest of the portfolio is independent.
