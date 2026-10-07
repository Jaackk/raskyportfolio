/* Private, deterministic case workspaces. User entries remain in the main app's local state. */
(function () {
  'use strict';
  const factors = [
    ['service', 'Active service had finished'], ['amount', 'Limited amount consumed'],
    ['intoxication', 'No evidence of intoxication identified'], ['incident', 'No actual incident identified'],
    ['customers', 'No customer impact identified'], ['employees', 'No employee impact identified'],
    ['loss', 'No financial loss identified'], ['damage', 'No damage identified'],
    ['security', 'Remained to secure the premises'], ['judgement', 'Acknowledges an error of judgement'],
    ['understanding', 'Understands the relevant policy'], ['commitment', 'Commits not to repeat the conduct'],
    ['performance', 'Previous contribution or performance'], ['practice', 'Relevant workplace practice'],
    ['other', 'Other mitigation']
  ];
  const grounds = [
    ['findings', 'Factual finding disputed'], ['insufficient', 'Evidence insufficient'],
    ['omitted', 'Evidence not considered'], ['new', 'New evidence'], ['procedure', 'Procedural concern'],
    ['policy', 'Policy interpretation'], ['mitigation', 'Mitigation'], ['consistency', 'Consistency'],
    ['sanction', 'Proportionality of sanction'], ['other', 'Other ground']
  ];
  const warningBlank = { label: '', type: 'Unknown', date: '', reason: '', expiry: '', document: '', active: 'Unknown', reliedUpon: 'Unknown', notes: '' };
  const comparatorBlank = { person: '', date: '', conduct: '', management: '', outcome: '', evidence: '', similarities: '', differences: '', missing: '' };
  const policyBlank = { rule: '', source: '', form: 'Unknown', communicator: '', date: '', display: '', acknowledgement: '', version: '', evidence: '', notes: '' };
  const eventBlank = { event: '', date: '', time: '', source: '', confidence: 'Unknown', employer: '', employee: '' };
  const isOn = value => value === true || value === 'true';
  const asText = value => typeof value === 'string' ? value.trim() : '';
  let renderedState = null;
  const deadlineNote = 'Calculated from the decision date you enter; the tool does not substitute the date the letter was received. Saturdays and Sundays are excluded. England and Wales bank holidays are not excluded: check their effect and confirm the deadline and counting basis with the employer. This is not a tribunal deadline.';
  function defaults(state) {
    ['mitigation', 'outcome', 'appeal', 'grievance', 'shift', 'caseStructure', 'challenge', 'closing'].forEach(k => { if (!state[k] || typeof state[k] !== 'object' || Array.isArray(state[k])) state[k] = {}; });
    factors.forEach(([id, label]) => { if (!state.mitigation[id] || typeof state.mitigation[id] !== 'object') state.mitigation[id] = { confirmed: false, evidence: '', raised: false }; state.mitigation[id].label = label; });
    if (!state.appeal.grounds || typeof state.appeal.grounds !== 'object') state.appeal.grounds = {};
    grounds.forEach(([id]) => { if (!state.appeal.grounds[id] || typeof state.appeal.grounds[id] !== 'object') state.appeal.grounds[id] = { selected: false, claim: '', fact: '', evidence: '' }; });
    if (!Array.isArray(state.warnings)) state.warnings = [Object.assign({}, warningBlank, {label: 'Reported lateness matter 1'}), Object.assign({}, warningBlank, {label: 'Reported lateness matter 2'})];
    if (!Array.isArray(state.comparators)) state.comparators = [];
    if (!Array.isArray(state.policies)) state.policies = [Object.assign({}, policyBlank, {rule: 'Employee reports that staff drinks are restricted to Friday–Sunday.', notes: 'Employee-supplied information. Separate rule or workplace practice to verify.'})];
    if (!Array.isArray(state.timeline)) state.timeline = [];
  }
  function mitigationSummary(state) {
    return factors.filter(([id]) => isOn(state.mitigation[id].confirmed)).map(([id, title]) => {
      const m = state.mitigation[id];
      return title + (asText(m.evidence) ? ' — ' + asText(m.evidence) : ' — supporting source not entered.');
    });
  }
  function deadline(input) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(asText(input))) return '';
    const d = new Date(input + 'T12:00:00Z');
    if (!Number.isFinite(d.getTime()) || d.toISOString().slice(0, 10) !== input) return '';
    let count = 0;
    while (count < 5) { d.setUTCDate(d.getUTCDate() + 1); if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) count++; }
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  }
  function appealDraft(state) {
    const a = state.appeal;
    const selected = grounds.filter(([id]) => isOn(a.grounds[id].selected));
    const complete = selected.filter(([id]) => ['claim', 'fact', 'evidence'].every(k => asText(a.grounds[id][k])));
    if (!complete.length) return 'Select a ground and enter its claim, supporting fact and evidence or source to build a draft.';
    const parts = [];
    if (asText(a.decision)) parts.push('I wish to appeal the following decision: ' + asText(a.decision));
    else parts.push('I wish to appeal the disciplinary decision.');
    if (asText(state.outcome.decisionDate)) parts.push('Decision date entered: ' + asText(state.outcome.decisionDate) + '.');
    complete.forEach(([id, label], index) => { const g = a.grounds[id]; parts.push((index + 1) + '. ' + label + '\n' + asText(g.claim) + '\nSupporting fact: ' + asText(g.fact) + '\nEvidence/source: ' + asText(g.evidence)); });
    if (asText(a.requestedOutcome)) parts.push('Requested outcome: ' + asText(a.requestedOutcome));
    parts.push('Please confirm receipt and the arrangements for considering this appeal.');
    return parts.join('\n\n');
  }
  function closingDraft(state, long) {
    const c = state.closing;
    const parts = ['position', 'acknowledgement', 'classification'].map(k => asText(c[k])).filter(Boolean);
    const selected = mitigationSummary(state);
    if (selected.length) parts.push('I ask that the following confirmed mitigation be considered: ' + (long ? selected : selected.slice(0, 3)).join('; ') + '.');
    if (asText(c.request)) parts.push(asText(c.request));
    if (!parts.length) return 'Enter your factual position, any acknowledgement you choose to make, and the outcome you request. Only your entered position and confirmed mitigation will appear here.';
    return parts.join(' ');
  }
  function incompleteAppeal(state) {
    return grounds.filter(([id]) => isOn(state.appeal.grounds[id].selected) && !['claim', 'fact', 'evidence'].every(k => asText(state.appeal.grounds[id][k])));
  }
  function caseSummary(state) {
    return ['allegation', 'employer', 'supported', 'disputed', 'unknown', 'rules', 'response', 'proportionality'].filter(k => asText(state.caseStructure[k])).map(k => k.toUpperCase() + '\n' + asText(state.caseStructure[k])).join('\n\n') || 'No case structure has been entered.';
  }
  function grievanceSummary(state) {
    return ['event', 'date', 'people', 'evidence', 'relevance', 'request'].filter(k => asText(state.grievance[k])).map(k => k.toUpperCase() + ': ' + asText(state.grievance[k])).join('\n\n') || 'No specific concern has been recorded.';
  }
  function refreshOutputs(state) {
    if (!state || !window.document) return;
    defaults(state);
    const put = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
    const summary = mitigationSummary(state);
    put('mitigation-summary', summary.length ? summary.join('\n\n') : 'No mitigation has been confirmed.');
    put('appeal-draft', appealDraft(state));
    put('case-summary', caseSummary(state));
    put('grievance-record', grievanceSummary(state));
    put('closing-short', closingDraft(state, false));
    put('closing-full', closingDraft(state, true));
    put('closing-word-count', String(closingDraft(state, false).split(/\s+/).length));
    const date = deadline(state.outcome.decisionDate);
    put('appeal-deadline', date ? 'Indicative five-working-day date: ' + date : 'Enter a valid YYYY-MM-DD decision date to calculate an indicative date.');
    put('outcome-deadline', date ? 'Indicative five-working-day date: ' + date : 'Enter a valid YYYY-MM-DD decision date to calculate an indicative date.');
    const incomplete = incompleteAppeal(state), notice = document.getElementById('appeal-incomplete');
    if (notice) { notice.hidden = incomplete.length === 0; notice.textContent = incomplete.length ? 'Selected grounds excluded until completed: ' + incomplete.map(([, label]) => label).join(', ') + '.' : ''; }
  }
  function render(route, state, helpers) {
    if (!['mitigation', 'outcome', 'appeal', 'grievance', 'warnings', 'comparators', 'policy', 'shift', 'case', 'challenge', 'adjournment', 'closing', 'timeline'].includes(route)) return null;
    defaults(state);
    renderedState = state;
    const { esc, field, area, select, check } = helpers;
    const f = (path, label, placeholder) => field(path, label, placeholder || 'To establish');
    const a = (path, label, placeholder) => area(path, label, placeholder || 'Enter only information you can accurately record.');
    const s = (path, label, options) => select(path, label, options);
    const c = (path, label) => check(path, label);
    const text = v => esc(String(v == null ? '' : v));
    const source = (topic, label) => helpers.sourceButton ? helpers.sourceButton(topic, 'Source: ' + (label || topic)) : '<button class="button" type="button" data-action="topic" data-topic="' + text(topic) + '">Source: ' + text(label || topic) + '</button>';
    const title = (over, main, detail) => '<div class="workspace-heading"><div class="eyebrow">' + text(over) + '</div>' + (detail ? '<p class="muted">' + text(detail) + '</p>' : '') + '</div>';
    const dynamicIds = ['mitigation-summary', 'appeal-draft', 'case-summary', 'grievance-record', 'closing-short', 'closing-full'];
    const copy = id => (dynamicIds.includes(id) ? '<button class="button" type="button" data-action="refresh">Update text</button>' : '') + '<button class="button" type="button" data-action="copy" data-copyid="' + id + '">Copy text</button>';
    const output = (id, value) => '<div id="' + id + '" class="notice generated-text" style="white-space:pre-wrap">' + text(value) + '</div>';
    const add = (collection, template, label) => '<button class="button" type="button" data-action="add-row" data-collection="' + collection + '" data-template="' + text(JSON.stringify(template)) + '">' + text(label) + '</button>';
    const log = (event, label) => '<button class="button" type="button" data-action="log" data-event="' + text(event) + '">' + text(label || event) + '</button>';
    const card = (heading, html) => '<section class="card"><h2>' + text(heading) + '</h2>' + html + '</section>';
    const empty = msg => '<p class="muted">' + text(msg) + '</p>';
    const statuses = ['Unknown', 'Employer alleges', 'Employee accepts', 'Employee disputes', 'Supported by evidence'];

    if (route === 'mitigation') {
      const summary = mitigationSummary(state);
      return title('Private preparation', 'Mitigation', 'Confirm each factor individually. Absence of an entry does not establish absence of harm or risk.') +
        '<div class="grid two">' + factors.map(([id, label]) => card(label, c('mitigation.' + id + '.confirmed', 'Confirmed by employee') + a('mitigation.' + id + '.evidence', 'Supporting fact, source or evidence', 'What supports this factor, and why is it relevant?') + c('mitigation.' + id + '.raised', 'Raised during the meeting'))).join('') + '</div>' +
        card('Confirmed mitigation summary', output('mitigation-summary', summary.length ? summary.join('\n\n') : 'No mitigation has been confirmed.') + copy('mitigation-summary') + source('mitigating circumstances', 'Handbook mitigation') + log('Mitigation raised'));
    }
    if (route === 'outcome') {
      const d = deadline(state.outcome.decisionDate);
      const warning = ['First written warning', 'Final written warning', 'Other warning'].includes(state.outcome.sanction);
      const dismissed = state.outcome.sanction === 'Dismissal';
      return title('Meeting record', 'Outcome', 'Record the decision and reasons as communicated. A finding is the employer’s recorded decision, not a conclusion produced by this tool.') +
        card('Decision and sanction', '<div class="grid two">' + s('outcome.status', 'Outcome status', ['Not yet given', 'Pending', 'Given verbally', 'Written outcome received']) + s('outcome.finding', 'Finding stated', ['Unknown', 'No action', 'Misconduct', 'Gross misconduct', 'Other']) + s('outcome.sanction', 'Sanction stated', ['Unknown', 'No action', 'Informal action', 'First written warning', 'Final written warning', 'Other warning', 'Action short of dismissal', 'Dismissal', 'Other']) + f('outcome.decisionDate', 'Date of decision', 'YYYY-MM-DD') + f('outcome.effectiveDate', 'Effective date', 'YYYY-MM-DD or exact wording') + f('outcome.chair', 'Person giving the decision') + '</div>' + a('outcome.reasons', 'Reasons stated') + a('outcome.evidence', 'Evidence relied upon') + a('outcome.policy', 'Policy provisions relied upon') + a('outcome.mitigation', 'Mitigation acknowledged or response given') + a('outcome.comparators', 'Consistency or comparator reasoning stated')) +
        card('Written record and next steps', a('outcome.writtenText', 'Written outcome — preserve original wording', 'Paste the outcome as supplied. Keep the original document separately.') + '<div class="grid two">' + f('outcome.document', 'Original document / source reference') + f('outcome.appealInfo', 'Appeal process and deadline communicated') + f('outcome.notice', 'Notice and pay position stated') + f('outcome.holiday', 'Accrued holiday position stated') + f('outcome.expectedDate', 'If pending: expected response date') + f('outcome.contact', 'If pending: method / contact person') + '</div>' + output('written-outcome-request', 'Please provide the findings, reasons, sanction and appeal information in writing.') + copy('written-outcome-request') + log('Written outcome requested') + source('appeal', 'Appeal procedure')) +
        card('Indicative internal appeal date', '<strong id="outcome-deadline">' + text(d ? 'Indicative five-working-day date: ' + d : 'Enter a valid YYYY-MM-DD decision date to calculate an indicative date.') + '</strong><p class="muted">' + text(deadlineNote) + '</p>' + f('outcome.receivedDate', 'Date written outcome received — recorded separately', 'YYYY-MM-DD') + f('outcome.deadlineBasis', 'Employer’s stated appeal deadline and counting basis', 'Record the exact instruction; do not assume it runs from receipt.')) +
        (warning ? card('Warning details', '<div class="grid two">' + f('outcome.warningDuration', 'Duration stated') + f('outcome.improvement', 'Improvement expected') + '</div>' + a('outcome.repetition', 'Consequences of repetition stated') + source('written warning', 'Warning stages and durations')) : '') +
        (dismissed ? card('After dismissal', '<ol><li>Ask for written findings, reasons and appeal information.</li><li>Record the effective termination date, notice/pay and accrued holiday position.</li><li>Preserve original evidence and export your meeting record.</li><li>Check the internal appeal deadline and consider independent employment advice or ACAS.</li></ol><p class="muted">The dismissal itself does not establish that it is lawful or unlawful.</p>' + source('summary dismissal', 'Summary dismissal wording')) : '') +
        card('After-meeting checklist', ['Export notes and backup', 'Retain evidence and original documents', 'Record unanswered questions', 'Request or retain written outcome', 'Review official minutes', 'Check appeal information'].map((label, i) => c('outcome.check' + i, label)).join('') + log('Outcome given'));
    }
    if (route === 'appeal') {
      const d = deadline(state.outcome.decisionDate);
      const incomplete = incompleteAppeal(state);
      return title('Private preparation', 'Appeal workspace', 'Select only grounds you wish to raise. The draft includes only selected grounds with a claim, supporting fact and source.') +
        card('Decision being appealed', a('appeal.decision', 'Identify the decision / sanction') + f('outcome.decisionDate', 'Decision date used for calculation — confirm with employer', 'YYYY-MM-DD') + f('outcome.receivedDate', 'Date written outcome received — recorded separately', 'YYYY-MM-DD') + f('outcome.deadlineBasis', 'Employer’s stated appeal deadline and counting basis') + '<div class="notice"><strong id="appeal-deadline">' + text(d ? 'Indicative five-working-day date: ' + d : 'Enter a valid YYYY-MM-DD decision date to calculate an indicative date.') + '</strong><p>' + text(deadlineNote) + '</p></div>' + source('appeal', 'Rockwater appeal procedure')) +
        '<div class="grid two">' + grounds.map(([id, label]) => card(label, c('appeal.grounds.' + id + '.selected', 'Include this ground') + a('appeal.grounds.' + id + '.claim', 'Point you wish to raise') + a('appeal.grounds.' + id + '.fact', 'Supporting fact') + f('appeal.grounds.' + id + '.evidence', 'Evidence or source reference'))).join('') + '</div>' +
        card('Requested outcome', a('appeal.requestedOutcome', 'What do you ask the appeal decision maker to do?')) +
        card('Draft for your review', '<p id="appeal-incomplete" class="notice"' + (incomplete.length ? '' : ' hidden') + '>' + (incomplete.length ? 'Selected grounds excluded until completed: ' + text(incomplete.map(([, label]) => label).join(', ')) + '.' : '') + '</p>' + output('appeal-draft', appealDraft(state)) + copy('appeal-draft') + '<p class="muted">Review the draft against your evidence before using it. Text updates when you leave a field or select Update text. Copying does not send or submit an appeal.</p>');
    }
    if (route === 'warnings') {
      return title('Employee-supplied information', 'Previous lateness matters', 'Two lateness warnings have been reported. Their type, dates and active status are not established.') +
        '<div class="grid two">' + state.warnings.map((w, i) => { const p = 'warnings.' + i + '.'; return card(w.label || 'Warning record ' + (i + 1), f(p + 'label', 'Record label') + s(p + 'type', 'Formal / informal and stage', ['Unknown', 'Informal discussion', 'Informal warning', 'First written warning', 'Final written warning', 'Other']) + '<div class="grid two">' + f(p + 'date', 'Date issued') + f(p + 'expiry', 'Expiry / duration stated') + '</div>' + f(p + 'reason', 'Reason stated') + f(p + 'document', 'Written document or source') + s(p + 'active', 'Currently active?', ['Unknown', 'Employer says active', 'Employer says expired', 'Disputed', 'Confirmed from document']) + s(p + 'reliedUpon', 'Being relied upon now?', ['Unknown', 'Yes', 'No', 'Disputed']) + a(p + 'notes', 'Employer explanation / employee response')); }).join('') + '</div>' + add('warnings', warningBlank, 'Add warning record') +
        card('Question to establish', output('warnings-question', 'Are these matters being relied upon, what disciplinary level were they, when were they issued, and are they still active?') + copy('warnings-question') + source('written warning', 'Handbook warning stages'));
    }
    if (route === 'comparators') {
      return title('Private employee-supplied information', 'Consistency and comparators', 'Potential comparator — factual similarity requires assessment. Similarities do not automatically require an identical sanction.') +
        (state.comparators.length ? state.comparators.map((row, i) => { const p = 'comparators.' + i + '.'; return card('Potential comparator ' + (i + 1), '<div class="grid two">' + f(p + 'person', 'Person / role') + f(p + 'date', 'Approximate date') + '</div>' + a(p + 'conduct', 'Conduct and circumstances reported') + f(p + 'management', 'Management awareness and source') + f(p + 'outcome', 'Outcome reported') + f(p + 'evidence', 'Supporting source / evidence') + '<div class="grid two">' + a(p + 'similarities', 'Similarities: role, conduct, amount, shift, responsibilities') + a(p + 'differences', 'Differences: role, circumstances, warnings, evidence') + '</div>' + a(p + 'missing', 'Information missing')); }).join('') : card('No comparators entered', empty('Record a specific incident and its supporting source before raising a consistency point.'))) + add('comparators', comparatorBlank, 'Add potential comparator') + source('consistently and fairly', 'Consistency and fairness');
    }
    if (route === 'policy') {
      return title('Policy and workplace practice', 'Rules and instructions', 'A rule reported by either party is not automatically a verified written policy. A separately communicated or verbal instruction may exist.') +
        state.policies.map((row, i) => { const p = 'policies.' + i + '.'; return card('Rule / instruction ' + (i + 1), a(p + 'rule', 'Rule claimed') + '<div class="grid two">' + f(p + 'source', 'Source / document') + s(p + 'form', 'How recorded?', ['Unknown', 'Written policy', 'Verbal instruction', 'Reported workplace practice', 'Other']) + f(p + 'communicator', 'Who communicated it?') + f(p + 'date', 'When introduced or communicated?') + f(p + 'display', 'Where displayed / supplied?') + f(p + 'acknowledgement', 'Employee acknowledgement / evidence') + f(p + 'version', 'Version and applicability to incident') + f(p + 'evidence', 'Supporting evidence') + '</div>' + a(p + 'notes', 'What remains disputed or unknown?')); }).join('') + add('policies', policyBlank, 'Add rule or practice') +
        card('Questions to establish', '<ul><li>Where is this rule recorded, or how was it communicated?</li><li>When was it introduced and did it apply to this incident?</li><li>Who had authority to permit an exception?</li></ul>' + source('staff drink', 'Staff-drink wording') + source('Friday', 'Supplied-document search'));
    }
    if (route === 'shift') {
      const items = [['scheduled', 'Scheduled finish'], ['clockOut', 'Actual clock-out'], ['paid', 'Paid working time'], ['service', 'Service finished'], ['active', 'Active duties completed'], ['remaining', 'Duties remaining'], ['security', 'Lock-up responsibility'], ['leave', 'Ability to leave'], ['lastStaff', 'Last employee departure'], ['secured', 'Premises secured'], ['manager', 'Duty manager / instructions'], ['drink', 'Drink timing and type'], ['authorised', 'Drink authorisation'], ['practice', 'Relevant workplace practice']];
      items.forEach(([id]) => { if (!state.shift[id] || typeof state.shift[id] !== 'object') state.shift[id] = {}; });
      return title('Factual assessment', 'When did the shift end?', 'Clocking, duties, pay and authorisation can all be relevant. This workspace does not make a legal determination.') +
        '<div class="grid two">' + items.map(([id, label]) => card(label, f('shift.' + id + '.value', 'Record / account') + s('shift.' + id + '.status', 'Status', statuses) + f('shift.' + id + '.source', 'Source or evidence'))).join('') + '</div>' +
        card('The parties’ positions', a('shift.employerPosition', 'Employer position') + a('shift.employeePosition', 'Employee position') + a('shift.unresolved', 'What remains unresolved?') + source('working hours', 'Working hours') + source('securing', 'Remaining security duties') + source('staff drink', 'Duty-manager discretion'));
    }
    if (route === 'case') {
      return title('Private preparation', 'Case structure', 'Keep the underlying conduct, policy classification and proposed sanction separate. Enter both parties’ positions accurately.') +
        [
          ['1. What is actually alleged?', a('caseStructure.allegation', 'Exact allegation / source') + a('caseStructure.employer', 'Employer’s case: claims, evidence, policy and reasoning')],
          ['2. What is supported?', a('caseStructure.supported', 'Supported or accepted factual conduct', 'Name the evidence and identify exactly what is accepted. Do not infer missing facts.')],
          ['3. What is disputed?', a('caseStructure.disputed', 'Disputed facts or conclusions') + a('caseStructure.unknown', 'Information still needed')],
          ['4. How do the rules apply?', a('caseStructure.rules', 'Relevant policy and each party’s interpretation') + a('caseStructure.response', 'Employee response and context') + source('alcohol', 'Alcohol provisions') + source('gross misconduct', 'Classification wording')],
          ['5. What outcome is requested?', a('caseStructure.proportionality', 'Mitigation, alternatives and requested outcome') + source('action short', 'Sanction options')]
        ].map(([heading, html]) => card(heading, html)).join('') +
        card('Current structure — entered information only', output('case-summary', caseSummary(state)) + copy('case-summary'));
    }
    if (route === 'challenge') {
      return title('Private preparation', 'Test my position', 'Use the strongest fair version of the employer’s case. These are review questions, not findings or predictions.') +
        card('Point to test', a('challenge.position', 'Your proposed point') + a('challenge.support', 'What evidence supports it?') + a('challenge.dispute', 'How could the employer reasonably dispute it?') + a('challenge.adverse', 'What other policy or evidence may weigh against it?') + a('challenge.assumptions', 'What am I treating as fact that remains an assumption?') + a('challenge.revision', 'A more precise, supported response')) +
        '<div class="grid two">' + card('If your point is that active duties had ended', '<ul><li>What do clocking and payment records show?</li><li>What responsibilities remained, including securing the premises?</li><li>Could you leave, and what instructions applied?</li><li>Who decided that the working shift had ended?</li></ul>' + source('working hours', 'Working hours') + source('securing', 'Security duties')) +
        card('Before using a response', '<ul><li>Is it true and supported?</li><li>Does it distinguish recollection from evidence?</li><li>Does it acknowledge reliable evidence and relevant adverse wording?</li><li>Does it confuse actual harm with a potential effect or risk?</li><li>Does it accept more than you actually intend to accept?</li></ul>') + '</div>' +
        card('Keep these separate', '<div class="grid two"><div><strong>Factual acceptance</strong><p>What happened, when and what was observed.</p></div><div><strong>Policy / classification</strong><p>What rule applies and why that classification is alleged.</p></div><div><strong>Context and mitigation</strong><p>What established circumstances should be considered.</p></div><div><strong>Sanction</strong><p>What response is appropriate and what alternatives are considered.</p></div></div>');
    }
    if (route === 'adjournment') {
      const unraised = factors.filter(([id]) => isOn(state.mitigation[id].confirmed) && !isOn(state.mitigation[id].raised)).map(([, label]) => label);
      const qs = Array.isArray(state.questions) ? state.questions.filter(q => !isOn(q.answered) && !/^(answered|complete)$/i.test(asText(q.status))) : [];
      return title('Private review', 'Before the meeting resumes', 'Check gaps in the record, mitigation not yet raised and the final points you want considered.') +
        '<div class="grid two">' + card('Questions to follow up', qs.length ? '<ul>' + qs.map(q => '<li>' + text(q.question || q.text || q.title || 'Question without text') + (q.status ? ' — ' + text(q.status) : '') + '</li>').join('') + '</ul>' : empty('No tracked unanswered questions are available. Check your meeting log for anything not captured.')) +
        card('Confirmed mitigation not marked raised', unraised.length ? '<ul>' + unraised.map(v => '<li>' + text(v) + '</li>').join('') + '</ul>' : empty('No confirmed mitigation remains unmarked. This reflects your entries only.')) + '</div>' +
        card('Three final points', a('closing.final1', '1. Most important unresolved point') + a('closing.final2', '2. Evidence or clarification still needed') + a('closing.final3', '3. Mitigation or outcome request')) +
        card('Requests and meeting record', output('adjournment-response', 'I would like reasonable time to review this information before responding. Please record my request and the decision made.') + copy('adjournment-response') + log('Adjournment requested') + log('Adjournment granted') + log('Adjournment refused') + log('Meeting resumed') + source('acas-late-evidence', 'Reasonable preparation and response'));
    }
    if (route === 'closing') {
      const shortDraft = closingDraft(state, false);
      const longDraft = closingDraft(state, true);
      return title('Private preparation', 'Closing statement', 'This combines your entered wording with confirmed mitigation. Review length and accuracy before speaking; no admission is prefilled.') +
        card('Your position', a('closing.position', 'Factual position') + a('closing.acknowledgement', 'Acknowledgement, only if you choose to make one') + a('closing.classification', 'What classification or conclusion remains disputed?') + a('closing.request', 'Your request about evidence, mitigation or sanction')) +
        card('Short version', output('closing-short', shortDraft) + copy('closing-short') + '<p class="muted">Includes up to three confirmed mitigation items. <span id="closing-word-count">' + text(shortDraft.split(/\s+/).length) + '</span> words; aim for a length you can deliver comfortably.</p>') +
        card('Full version', output('closing-full', longDraft) + copy('closing-full') + '<p class="muted">Includes all confirmed mitigation. Shorten your inputs if necessary; the tool does not silently cut your factual position.</p>') +
        card('Neutral fallback', output('closing-fallback', 'I ask that the evidence, my explanation, the full circumstances and any mitigation I have raised be considered before a decision is made on the classification and any sanction.') + copy('closing-fallback'));
    }
    if (route === 'timeline') {
      return title('Incident reconstruction', 'Incident timeline', 'Record source-based times separately from the meeting log. Competing times remain separate; no gap is filled automatically.') +
        (state.timeline.length ? state.timeline.map((row, i) => { const p = 'timeline.' + i + '.'; return card('Incident event ' + (i + 1), '<div class="grid two">' + f(p + 'event', 'Event', 'Shift start, service end, drink obtained, lock-up…') + f(p + 'date', 'Incident date', 'YYYY-MM-DD') + f(p + 'time', 'Time', 'HH:MM or approximate time') + s(p + 'confidence', 'Time status', ['Unknown', 'Exact', 'Approximate', 'Disputed']) + '</div>' + f(p + 'source', 'Source / evidence') + '<div class="grid two">' + a(p + 'employer', 'Employer account / interpretation') + a(p + 'employee', 'Employee account / interpretation') + '</div>'); }).join('') : card('No incident events entered', empty('Add an event when a date, time or sequence is provided. You may record multiple accounts of the same event.'))) + add('timeline', eventBlank, 'Add incident event') +
        card('Recorded sequence', state.timeline.length ? '<ol>' + state.timeline.map(row => '<li><strong>' + text(row.time || 'Time unknown') + ' · ' + text(row.event || 'Event unnamed') + '</strong><p class="muted">' + text(row.date || 'Date unknown') + ' · ' + text(row.confidence || 'Unknown') + ' · ' + text(row.source || 'Source not entered') + '</p></li>').join('') + '</ol><p class="muted">Shown in entry order to preserve competing accounts; no chronological conclusion is inferred.</p>' : empty('Your entries will appear here.'));
    }
    if (route === 'grievance') {
      const options = ['Impartiality concern', 'Inconsistent treatment concern', 'Line-manager conduct concern', 'Procedural concern', 'Bullying or harassment concern', 'Other workplace concern'];
      return title('Separate workplace process', 'Grievance relevance', 'A grievance addresses a specific workplace concern. Disagreement with a disciplinary allegation or outcome does not by itself establish wrongdoing.') +
        card('Concern you wish to record', options.map((v, i) => c('grievance.reason' + i, v)).join('') + a('grievance.event', 'Specific conduct / event') + '<div class="grid two">' + f('grievance.date', 'Date or dates') + f('grievance.people', 'People involved') + '</div>' + a('grievance.evidence', 'Supporting evidence or source') + a('grievance.relevance', 'Why the conduct raises a concern') + a('grievance.request', 'Resolution or process requested')) +
        card('Read the actual procedure', '<p>Consult the grievance procedure for the appropriate recipient, investigation, accompaniment and handling of matters that overlap with disciplinary proceedings.</p>' + source('grievance', 'Rockwater grievance procedure') + source('line manager', 'Concern involving the line manager')) +
        card('Factual concern record', output('grievance-record', grievanceSummary(state)) + copy('grievance-record'));
    }
    return null;
  }
  window.RW_WORKSPACES = { render: render, defaults: defaults, appealDeadline: deadline, refreshOutputs: refreshOutputs };
  if (window.document) document.addEventListener('focusout', function (event) {
    if (!event.target || !event.target.dataset || !event.target.dataset.field || !renderedState) return;
    // Main input handler saves synchronously. Updating text nodes on blur preserves cursor position and avoids a page-wide rerender.
    refreshOutputs(renderedState);
  });
})();
