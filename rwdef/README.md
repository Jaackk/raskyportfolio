# RWDEF — live disciplinary defence

Open https://raskyjack.com/rwdef/ . Defend me is the default tap board. The website is public; entered case data stays in this browser. Only the neutral Source view is intended to be shown to management.

## Meeting flow

Tap the category, then the claim on iPhone; desktop shows all six groups. The overlay gives SAY, ASK, a collapsed private warning, source and log actions, and likely follow-up arguments. Close returns to the same board and category. Search is an optional fallback in More (or Ctrl+K).

The four persistent controls give the current response for facts, context, classification and a lesser sanction. The panic button asks for clarification. “They’re right on that point” separates factual concessions from classification. Opening a claim never accepts it. A dismissal response is not an outcome until deliberately recorded.

Update facts uses tap choices, with no mandatory typing or evidence-reference field. Choices describe your assessment of the incident under discussion. They are not independent verification. Drinking accepted moves attention to working status; both accepted move it to classification. An explicit strong-evidence assessment, or accepted intoxication alongside drinking and work, moves emphasis to mitigation and sanction. The tool never calculates a winning percentage.

My case retains optional detail and mitigation. Notes offers eight immediate timestamp markers and optional typing. “I accepted” without detail records a marker, not a specific admission. They’ve left the room summarises concessions, current risk, outstanding questions and the next three points. Final comments provides a short version and a dismissal alternative without invented achievements or promises. Appeal remains in More and after dismissal; selected grounds require an explanation and supporting source.

## Evidence given late

The employee confirmed requesting incident particulars, evidence, statements and CCTV in writing before the meeting. My case / Update facts includes the pre-meeting receipt status; Unknown remains the default until the user chooses Yes, Partial or No.

Evidence given late opens the preparation response, Quick review and Request adjournment. The request and refusal controls immediately timestamp what the user records. Review checks what the item establishes, what remains inference, whether the account or defence changes and the next question. CCTV checks cover time, context, contents, quantity, behaviour and duties.

Further-time wording appears only after the user confirms reviewing what they can and selects an outstanding complexity, significance, context or changed-allegation issue. A simple item or disagreement alone does not trigger it. Starting a new late-evidence review resets the previous review assessment. The flow advises continued cooperation and accurate answers; it does not promise an adjournment or automatic invalidity.

## Conditional staff-drink communication

The WhatsApp account is dormant until BOTH Monday–Thursday timing and management reliance on the Friday–Sunday restriction are explicitly confirmed in the contextual controls. It is labelled employee account / mitigation, not independently established fact. Separate responses acknowledge that the message was sent and that the employee subsequently heard the restriction mentioned.

If the user confirms evidence of reading, acknowledgement or clear understanding, the misunderstanding wording stops, including in follow-ups, and the response pivots to the instruction, mitigation and sanction. Changing either trigger disables the account again. WhatsApp can communicate instructions, and managers may be expected to read them. No lack-of-knowledge argument is silently added to the main defence or closing statement.

## Sources and privacy

The persistent source bar opens a private quote preview. Show them replaces the private interface with only the selected source(s). Return restores the prior response. Neutral mode survives refresh without exposing notes. Ctrl+Shift+S opens neutral source selection; Escape closes a dialog.

All four original documents were freshly extracted on 8 October 2026; all 55 quotations matched their source after whitespace normalisation. PDF page locators and DOCX paragraph anchors are distinguished. Both alcohol gross-misconduct clauses, non-contractual discretionary staff-drink wording, non-exhaustive examples, broader safety duties and remaining security responsibilities are preserved. ACAS preparation/hearing guidance was checked again for the late-evidence flow on 8 October. Source quotations and proposed speech are different. See SOURCE-AUDIT.md and ASSUMPTIONS-AUDIT.md.

## Local storage and offline use

The existing rwdef.case.v1 key and original-file IndexedDB store are retained. Earlier fields remain in backups and My case. New fields are additive. JSON export/import preserves them; original attachments stay in IndexedDB and must be backed up separately. Notes can be copied, printed or exported. No runtime AI, analytics, microphone, recording or cloud note storage is used.

Open online once and wait for Offline ready before relying on offline access. If upgrading a previously cached version, reload after the update installs. Chromium offline reload was tested; iPhone WebKit touch, layout and persistence were tested in emulation, not on a physical device. Windows WebKit forced-offline navigation is a known test limitation; a successful physical-iPhone offline reload is not claimed.

Local browser storage is not encryption or authenticated hosting. Anyone with access to the browser profile may see saved records; other code on the same origin is outside this boundary. Keep an exported backup. Clear case requires typed confirmation and affects this tool’s local case and originals.

## Maintenance

There is no compilation. BUILD.cmd checks JavaScript syntax. START-DEFENCE-TOOL.cmd serves a local copy. cockpit.js/cockpit.css implement the interface, defence.js contains the response library, documents.js the redacted source corpus, and legal.js official summaries. Increment the service-worker cache when deploying changed assets. Only /rwdef is changed.
