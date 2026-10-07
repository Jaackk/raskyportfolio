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
