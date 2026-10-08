# Case assumption audit

Reviewed 8 October 2026. This audit describes the initial case state and the rules used by the private workspaces. It does not establish facts about an incident.

## What is initially populated

| Item | Initial state | Classification and basis |
| --- | --- | --- |
| Allegation | “Drinking during working hours” | **Employee-supplied account of an employer allegation.** This wording comes from the supplied project brief. No disciplinary invitation was among the four employment reference documents. The allegation is not evidence or an admission. |
| Incident particulars | Empty values, marked `UNKNOWN` | **Unknown.** No date, time, place, amount, drink, authorisation, impairment, impact, loss, duty status or incident circumstances are inferred. |
| Gross-misconduct classification | Empty value, marked `UNKNOWN` | **Unknown until entered.** The tool does not classify the incident itself. |
| Evidence matrix | Fifteen named issue prompts; substantive fields empty and status `NOT PRODUCED` | **Questions to establish.** Rows are organisational prompts, not evidence records establishing that conduct happened. “Not produced” describes the local record, not a finding that evidence does not exist. |
| Employee account | Empty recollection, uncertainty and correction fields | **Not entered.** The anticipated scenario described in the brief is not hardcoded as the employee’s account or an admission. |
| Previous warnings | Two empty records | **Employee-supplied background.** The brief reports two lateness matters. Their type, formality, dates, disciplinary stage, documents, expiry, active status and current relevance remain unknown. |
| Friday–Sunday rule / practice | No seeded policy row in the main application | **Not established as a case fact.** The brief reports this practice; the public initial state leaves the policy collection empty for deliberate entry with provenance. Source commentary distinguishes the supplied-document search result from the possible existence of a separate policy or verbal instruction. |
| Comparators and incident timeline | Empty collections | **Not entered.** No other employee, comparable incident, sequence or time is invented. |
| Procedure, questions, requests and meeting log | Empty records | **Not confirmed.** Empty or unchecked items do not establish a procedural breach. |
| Mitigation | All factor confirmations false | **Unconfirmed.** Suggested factors are prompts only. A factor enters a generated summary only after the user confirms it; missing supporting evidence is labelled. |
| Outcome and appeal | Empty fields; no selected grounds | **Not entered.** No sanction, decision, effective date, finding, legal claim or ground of appeal is assumed. |
| Grievance | Empty fields; no selected concern | **Not entered.** No bias, hostility, bullying, unlawful conduct or other wrongdoing is preloaded. |
| Private notes and attachments | Empty | **Not entered.** Original employment files and new evidence are not automatically uploaded into the case record. |

The module can create fallback empty records if it is used without the main application's initial collections. Its fallback policy row labels the Friday–Sunday statement as employee-supplied and to verify. In the integrated application, the existing empty `policies` array is preserved and that fallback is not applied.

## Source facts versus incident facts

Verified employment provisions and official legal references are source material. A provision’s presence does not establish that its conditions apply to the incident. Policy text, employee entry, employer allegation, evidence produced and analysis remain different categories.

The source corpus may record relevant employment terms such as working hours and document versions, but does not establish the incident’s working status. A clock record, retained lock-up responsibility, receipt, staff-drink practice or reported authorisation requires factual assessment alongside other information.

The public application does not preload a personal name, address, contact details, salary, bank details, signature or private recollection into its initial case state. No claim is made that a publicly accessible site or ordinary browser storage provides confidential hosting or encryption.

## Generated text safeguards

- Mitigation summaries use only factors explicitly confirmed by the user. They do not infer that no harm occurred from the absence of a harm entry.
- Appeal drafts use only selected grounds with a populated claim, supporting fact and evidence/source. Incomplete selected grounds are identified and excluded.
- Case, grievance and closing text uses entered content. It does not invent evidence, admissions, accusations, certainty or a disciplinary outcome.
- The user reviews all generated text before using it. Copying a draft does not send or submit it.
- An answered question is omitted from the adjournment follow-up list only when the recorded answer flag/status supports doing so.
- A recorded employer finding remains a recorded decision; the software does not determine whether the finding is correct or lawful.

## Internal appeal calculation

The calculator uses only the date explicitly entered as the decision date. The separate date of receipt of a written outcome is not substituted automatically. It counts the next five Mondays–Fridays, starting after the entered date, and labels the result indicative.

England and Wales bank holidays are **not** excluded. The user is told to check their effect, the employer’s stated deadline and the applicable counting basis. The calculator does not determine a statutory tribunal deadline and does not resolve ambiguity about when the employer’s internal appeal period begins.

## Remaining limitations

User entries can be incomplete or inaccurate; a confirmation flag is the user’s classification, not independent verification. Manual source and evidence review remains necessary. No probability of dismissal or success, legal liability determination, automatic credibility finding, or automatic equivalence between comparator cases is produced.

## Redesign state and migration — 8 October 2026

The new `defence` object is additive under the existing version-1 storage key. All earlier case data is preserved; earlier evidence is not silently recast as accepted facts. Initially the incident is unconfirmed; each factual assessment is Not established; all accepted/disputed/mitigation text is empty; promises and acknowledgement-of-error flags are false; no outcome or appeal ground is selected.

Level 1 means the incident or core facts remain unestablished. Level 2 requires consumption accepted or evidence-supported in the identified incident. Level 3 also requires working time/responsibility accepted or supported. Level 4 requires the user’s strong-risk assessment and source. Level 5 follows a dismissal outcome explicitly entered by the user. The guide can move backwards when facts are corrected. It never gives a success percentage or determines that dismissal is lawful or unlawful.

Support by evidence requires an entered reference; acceptance is the employee’s own admission, not independent proof. An entered serious-risk reference is not assessed for quality by an AI model. Notes are not semantically interpreted into admissions. Meeting-memory event types and unanswered-question flags are explicit and editable. Original event creation times are retained on edits.

No new personal case statement is preloaded beyond the allegation supplied by the user. Previous reported lateness matters remain background in the existing record and scenario library; there is no assumed clean record. Closing statements refer only to the recorded defence stage and explicitly confirmed commitments or raised mitigation. Appeal drafts require a selected ground, explanatory text and supporting source. Uncompleted grounds are excluded.

## 8 October 2026 — tap-board supersession

The live tap controls supersede the v2 requirement for an identified-incident flag and typed evidence reference before a deliberate new fact acceptance takes effect. Legacy assessments keep their original gating. No old record is silently promoted. New explicit choices apply to the incident under discussion; UNKNOWN, dispute and negative answers are distinct from positive acceptance. Opening a claim, following an argument, viewing an outcome or logging a generic “I accepted” marker is not an admission.

A strong-risk/gross-misconduct-evidence assessment can move the emphasis to sanction without admitting every disputed fact. Accepted drinking, working time and intoxication also trigger a more cautious strategy. No automatic legal conclusion is made. Closing speech does not invent a clean record, isolated incident, apology or commitment.

The employee has now directly confirmed a prior written request for incident date/time, relied-on evidence, statements and CCTV. This is employee-supplied information. Evidence receipt remains Unknown until selected. Late receipt can justify proportionate preparation time; disagreement alone does not. Request/refusal buttons record what the user says happened. The app cannot verify whether the words were spoken or evidence was actually received. Starting a new late-evidence review resets its assessment; further-time wording requires reviewed-what-I-can plus a qualifying outstanding issue.

The additional WhatsApp account is employee account / mitigation. It is not independent evidence of unread messages, unclear communication or continued practice. It stays dormant unless the incident is confirmed as Monday–Thursday AND management reliance on the Friday–Sunday restriction is confirmed. Message-sent and heard-about-it responses preserve those concessions. An explicit finding of reading, acknowledgement or clear understanding disables lack-of-knowledge wording and triggers the requested mitigation pivot. This does not validate a rule merely because it was sent, invalidate it because it is absent from the four documents, establish authorisation, or resolve gross misconduct.

The neutral source display never includes the employee account, private warnings, notes, evidence-review assessment or argument strategy.

## 8 October 2026 — five-control fact distinctions and job-preservation wording

The v4 `liveFacts` object is additive. Existing accepted/disputed tap values retain their meaning; legacy evidence-supported entries require their original source and incident flag. New stance choices do not become findings: Employer alleges never establishes a fact, and the separate documentary-support flag does not turn an employee dispute into an admission. Such a conflict is privately flagged. Gross-misconduct classification is a legal/policy assessment; Strong case or support flags guide strategy without declaring the employer's conclusion legally correct.

An accepted ordinary risk is not automatically a strong gross-misconduct case. Explicit classification assessment, accepted classification, or supported intoxication with established drinking/working can move emphasis to sanction. Earlier v3 strong-risk assessments retain their original effect until changed.

Save My Job's acknowledgement is limited to employee acceptance. Specific mitigation requires its own confirmation (cleared on edits), or supported context already recorded. Recurrence assurances require an existing explicit commitment or a checked preventive step. No clean record, isolated mistake, positive performance history or entitlement to a lesser sanction is inferred. Initial live speech is manually condensed, not blindly truncated; expanded material retains the relevant limitations.


### Retention layer — 8 October 2026
The employee expressly supplied the personal account of commitment, justified past criticism, lateness, non-deliberate mistakes and perceived positive team relationships. This is labelled employee account, not colleague testimony. No clean record, unanimous team support, invalid disciplinary process or guaranteed lesser sanction is inferred. Recurrence answers remain conditional until an error is acknowledged. Strong gross-misconduct evidence changes the proportionality assertion to a request for retention; explicit acceptance of contrary intent evidence removes lack-of-deliberate-disregard wording. This is deterministic logic driven by the employee's updates, not automatic evidence interpretation.
