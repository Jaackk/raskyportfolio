# RWDEF disciplinary defence

Open https://raskyjack.com/rwdef/ . Five screens: Defend me, My case, If they say, Notes and Sources. The private interface supports the employee’s strongest truthful position; only Source view is intended for management.

## Fast meeting flow

Tap What do I say, then a claim. Seven common claims are immediate buttons; 55 scenarios are searchable offline. The response shows SAY and ASK. WHY expands the source and a private warning. Show source replaces private content; Return to defence restores the response. Ctrl+K opens response search; Ctrl+Shift+S opens neutral sources; Escape closes a dialog.

My case keeps accepted facts, disputed points, missing explanations and mitigation together. Expand Update what is established to record the identified incident and factual assessments. An employer allegation alone does not establish a fact. Evidence-supported states need a reference. These entries drive a deterministic five-stage position guide, not an automated legal finding or winning percentage. Stronger evidence changes the recommended emphasis. A denial of intoxication appears only if the incident is identified and the user disputes intoxication; accepted facts are not contradicted by suggestions.

Procedure problem gives a sentence, source and timestamp action. Notes has an autosaving field and eight event categories. Before they come back collects the current risk, argument, unanswered questions and unsaid mitigation. Help me close produces a short statement from the recorded position. Outcome and appeal remain contextual. A written appeal is due within five working days of the decision under the handbook; record and confirm the actual deadline, including bank holidays. This is not a tribunal deadline.

## iPhone

Use the bottom five-tab navigation. Large touch targets and 16px form text avoid involuntary input zoom. The top ellipsis opens backups and more. Source view removes private navigation, strategy, notes and warnings. The layout was checked using the iPhone 13 WebKit profile, not a physical iPhone.

Open once online before relying on offline use. Wait for offline readiness in Backup & more. Browser storage can be removed by private browsing, storage clearing or device policies; keep a JSON backup and original files separately.

## Local data and preservation

The existing rwdef.case.v1 storage key is preserved. New defence fields are additive. Earlier evidence, facts, mitigation, notes, events, attachments and other fields are retained in backups. The earlier case record is readable underneath My case. Old fields are not silently converted into new admissions or assessments.

Backup & more exports and restores JSON with a deliberate replacement action. Original attachments remain in the existing IndexedDB store, never uploaded. They are excluded from JSON backup. TXT export and private printing include the meeting record. Neutral printing contains only sources. Clear case requires typed confirmation and clears this app’s case and original-file storage.

No runtime AI, analytics, telemetry, microphone, recording or cloud note storage. The website and policy corpus are public. Entered records are browser-local and not encrypted; this is not authenticated confidential hosting. Other code on the same origin, extensions or access to the device are outside this privacy boundary. Use a localhost copy for a separate origin if preferred.

## Sources

All four originals were freshly extracted again on 8 October 2026. All 55 curated quotations match their source after whitespace normalisation. Page locators apply to PDFs; the handbook uses paragraph anchors. Personal contact, pay, signatures and e-sign audit records remain excluded from public data.

The current ACAS Code, hearing/outcome/appeal guidance and statutory accompaniment provisions used by the new responses were rechecked on 8 October. Other retained background cards preserve their earlier verification dates. Source wording and summaries are distinguished. Both alcohol gross-misconduct clauses, non-contractual drink-benefit wording, non-exhaustive examples, broader safety rules and remaining security duties are retained. Refer to SOURCE-AUDIT.md and ASSUMPTIONS-AUDIT.md.

## Local launch and maintenance

Run START-DEFENCE-TOOL.cmd with Python 3 available, then open http://localhost:4298/ . There is no compilation: these files are the production build. BUILD.cmd checks the JavaScript with Node. The standalone disciplinary-quick-reference.html is a printable source fallback with no private case data.

The active interface is cockpit.js/cockpit.css. defence.js contains original scenario prompts, documents.js the redacted employment sources, and legal.js official reference cards. Preserve state compatibility and increment the service-worker cache version when changing assets. Only /rwdef is changed by this redesign.
