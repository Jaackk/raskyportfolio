/* Original defence prompts. Not policy quotations. Assertions adapt to recorded facts in app.js. */
(() => {
const rows = [
['working','Working time','You were still working','Please identify the time and duties you say remained before I answer that. Working status and gross misconduct need separate consideration.','What time does the Company say my shift ended, and what establishes that?','Service ending does not necessarily mean work ended.','hours,staff-drink,security,alcohol-hours','still working shift ended service duties'],
['clocked','Working time','You were clocked in','I accept an accurate clocking record and will not dispute reliable evidence. Please consider the actual duties and circumstances when assessing seriousness.','Are you relying on the clock record alone, or specific duties I was performing?','Clocking records matter; do not dismiss or deny an accurate record.','sign-in,hours','clocked in clocking clock records paid'],
['lockup','Working time','You still had to lock the building','Please establish what responsibility I retained at that time. If I was still responsible for work, that matters, but the gross-misconduct classification remains a separate question.','What specific risk or impact makes this gross misconduct rather than a lesser disciplinary matter?','Do not deny an established lock-up duty or assume service ending removed it.','security,hours,alcohol-gross-disciplinary','lock building lock up lockup securing premises keys'],
['staff','Working time','You were responsible for staff','I understand why any continuing responsibility for staff matters. Please identify that responsibility and how the alleged conduct affected it or could have affected it.','Which staff member, task and specific potential effect are you relying on?','Do not claim all duties ended if supervision remained.','security,alcohol-gross','responsible staff supervision employees'],
['safety','Risk & safety','You were responsible for safety','I accept that safety responsibilities matter. Please identify the particular responsibility and risk in the circumstances alleged.','What evidence connects the alleged drinking to that specific risk?','Risk can matter without an accident; do not minimise a real responsibility.','serious-safety,safety-breach','responsible safety staff risk'],
['pint','Evidence','You had a pint','Please establish what I consumed and when; I will distinguish what I remember from what the evidence shows.','What supports the drink type, quantity and timing you allege?','Do not volunteer an invented amount or deny clear evidence.','staff-drink,acas-hearing','pint beer glass alcohol consumed drinking'],
['more','Evidence','You had more than one drink','I will give my accurate recollection and accept what reliable evidence establishes.','What evidence establishes the quantity and timing of each drink?','A glass on CCTV does not necessarily establish its contents or total consumption.','staff-drink,acas-hearing','more than one two drinks amount quantity'],
['intox','Risk & safety','You were intoxicated','Please identify the specific observations said to establish intoxication so I can respond accurately.','What behaviour was actually observed, by whom and when?','Use a denial only if it is true; consumption and intoxication are different factual questions.','alcohol-influence,alcohol-gross','intoxicated drunk intoxication'],
['potential','Risk & safety','You could have been impaired','I understand that potential effects matter. Please assess the actual circumstances, including the amount established and the duties remaining.','What specific potential effect or risk do you say existed?','The wording is “could affect”; actual harm is not required.','alcohol-gross-disciplinary,alcohol-gross','could impaired impairment affect performance potential'],
['something','Risk & safety','Something could have happened','I understand that an incident need not actually occur for a risk to matter. I ask you to identify the particular risk in these circumstances.','What specific event was reasonably foreseeable, and what supports that assessment?','Do not argue that no incident means no risk.','alcohol-gross,serious-safety','something could happened accident hypothetical'],
['emergency','Risk & safety','You could not respond to an emergency','I understand the concern about emergency readiness. Please identify the response duty I retained and the evidence that my ability could have been affected.','Which emergency responsibility and potential impairment are you relying on?','Emergency duties may remain after service ends.','security,serious-safety,alcohol-gross','emergency respond properly fire emergency readiness'],
['manager','Responsibility','You are a manager','I accept the responsibility of my role. I ask that the established conduct and circumstances determine the classification and sanction.','Which specific management duty makes these circumstances gross misconduct?','Do not be defensive about responsibility; do not admit an unestablished error.','security,alcohol-gross-disciplinary','manager management higher responsibility'],
['better','Responsibility','You should know better','I understand the standard expected of me. I will address any mistake established, while asking you to assess its seriousness and the appropriate sanction separately.','What would you consider a proportionate response to the circumstances established?','Acknowledging the standard is not admitting every allegation.','sanctions,mitigation','should know better judgement judgment manager'],
['rule','Classification','The handbook says no drinking','I accept the Handbook prohibits alcohol during working hours. Whether that rule was breached, whether it amounts to gross misconduct and the sanction each need consideration.','Which established facts do you say bring this incident within gross misconduct?','Accept the wording; do not concede unestablished incident facts.','alcohol-hours,alcohol-gross-disciplinary','handbook no drinking prohibits rule'],
['gross','Classification','This is gross misconduct','I do not accept that classification merely because it has been asserted. Please apply the complete policy wording to the circumstances established.','Which specific facts and policy wording support gross misconduct?','Reassess this position if reliable risk or performance evidence materially changes the case.','alcohol-hours,alcohol-gross-disciplinary,alcohol-gross','gross misconduct classification serious disciplinary'],
['any','Classification','Any alcohol is gross misconduct','I accept the rule against alcohol during working hours. The quoted alcohol example does not say that every instance automatically amounts to gross misconduct.','Which exact gross-misconduct provision and circumstances are you relying on?','Other gross-misconduct provisions and the non-exhaustive list may also be relevant.','alcohol-hours,alcohol-gross-disciplinary,alcohol-gross,gross-nonexhaustive','any alcohol automatically every drink automatic gross misconduct'],
['list','Classification','The gross misconduct list is not exhaustive','I accept that the examples are not exhaustive. I still ask you to explain why the established circumstances are sufficiently serious.','What specific conduct or risk justifies gross misconduct in this case?','Do not argue that conduct must appear word-for-word in the list.','gross-nonexhaustive,serious-safety','list not exhaustive other gross misconduct examples'],
['serious','Risk & safety','This is a serious safety breach','Please identify the safety rule, the alleged breach and why you regard it as serious. I will address the actual evidence.','What specific risk, remaining duty and supporting evidence establish the seriousness?','A serious safety breach may support gross misconduct independently of the alcohol example.','serious-safety,safety-breach,alcohol-gross','serious safety breach danger negligent negligence'],
['benefit','Staff drinks','The staff-drink rule does not apply','The written terms contemplate a discretionary beer or wine directly after a working shift. I accept that this is not permission to drink while still working.','Which condition of that provision do you say was not met here?','The benefit is non-contractual and discretionary; it is not an unconditional right.','staff-drink,benefits-noncontractual,alcohol-hours','staff drink rule does not apply benefit entitlement'],
['weekend','Staff drinks','Staff drinks are only Friday–Sunday','Please identify that restriction and how it was communicated so I can address whether it applied to this incident.','Where is the restriction documented, or when and how was it communicated?','Its absence from the supplied documents does not disprove a separate rule.','staff-drink,benefits-noncontractual','friday sunday saturday weekend only staff drinks'],
['everyone','Staff drinks','Everyone knows the Friday–Sunday rule','I would like the actual instruction and its communication clarified. If you produce it, I will address its application to the incident.','When, by whom and how was that rule communicated to me?','Do not keep arguing that a rule does not exist after reliable evidence is produced.','staff-drink,acas-consistency','everyone knows friday sunday rule communicated'],
['authority','Staff drinks','You were not authorised','Please establish who had authority and what permission was or was not given.','What evidence of authorisation or its absence has been considered?','Being a manager does not establish that you could authorise your own drink.','staff-drink,complimentary-drinks','not authorised unauthorized permission authorised authorized'],
['self','Staff drinks','You authorised yourself','Please identify the authorisation rules and what you say I did. I will not assume that my role allowed self-authorisation.','What evidence establishes the decision and who was entitled to authorise it?','Do not invent permission or rely on self-authorisation without support.','staff-drink,complimentary-drinks','self authorised yourself self authorization authorisation'],
['cctv','Evidence','We have CCTV','I will not dispute what the footage clearly establishes. Please show the relevant sequence with its full context.','Can we establish the time, contents or amount consumed, and duties remaining?','Do not fight clear footage; a visible glass alone may not establish its contents.','acas-hearing,hours','cctv camera video footage'],
['witness','Evidence','We have a witness','Please provide the account and distinguish what the witness observed from their interpretation.','What did the witness see or hear directly, and at what time?','A witness account can be evidence; do not dismiss it simply because it is disputed.','acas-notice,acas-hearing','witness statement saw observed'],
['witnessdrunk','Evidence','The witness says you were drunk','Please identify the behaviour behind that description so I can respond to the observation rather than a label.','What specific behaviour did the witness actually observe?','Do not say intoxication is impossible just because no test was taken.','alcohol-influence,acas-hearing','witness drunk intoxicated says'],
['records','Evidence','We have clock records','Please show the record; I will accept it if accurate. I ask that the actual duties and circumstances are also considered.','What does the record establish beyond the clock-in and clock-out times?','Do not claim that recorded time is irrelevant.','sign-in,hours,hours-record','clock records timesheet rota'],
['before','Previous matters','You have done this before','Please specify each earlier incident and whether it is part of the allegation or being considered for sanction.','What dates, findings and records are you relying on?','Do not claim this was isolated unless that is true and supported.','investigation,acas-notice','done this before happened previous incident repeat'],
['warnings','Previous matters','You have previous warnings','Please identify the warning documents, their level and whether they remain active.','How are those warnings being relied upon for this allegation or sanction?','Do not claim a clean record or declare lateness warnings automatically irrelevant.','warnings-first,warnings-final,acas-warning','previous warnings disciplinary record prior'],
['lateness','Previous matters','You have had two lateness warnings','I acknowledge the reported lateness matters, but their formal status and current effect need clarifying.','What were their dates and level, are they active, and how are they being relied upon?','The brief reports two matters; do not assume their level, expiry or formality.','warnings-first,warnings-final','two lateness warnings late punctuality'],
['advance','Procedure','We do not need to show you evidence beforehand','I need a reasonable opportunity to understand and answer the evidence relied upon.','What is the reason for withholding it, and how will I be given time to respond?','Do not claim every disclosure issue automatically invalidates the hearing.','acas-notice,acas-late-evidence','evidence beforehand advance do not need show disclosure withheld'],
['new-evidence','Procedure','We are showing you the evidence now','I have only just received this and would like reasonable time to review it before giving a definitive response.','May we adjourn while I check this material?','Do not say you requested it in advance unless you actually did; keep cooperating.','acas-late-evidence,acas-notice','new evidence now late evidence produced showing'],
['refused','Procedure','We will not adjourn','Please record my request for time to consider the evidence and the decision and reasons for refusing it.','How can I give a considered response to material first provided now?','Do not walk out or automatically refuse the entire meeting.','acas-late-evidence','will not adjourn wont no adjourn refused refusal'],
['time','Procedure','You have had enough time','Please allow me to explain what I still need to check and why it matters to an accurate response.','What reasonable opportunity will I have to address those outstanding points?','Identify a concrete preparation need; do not suggest unlimited delay is a right.','acas-notice','enough time prepare preparation no time'],
['investigated','Procedure','We have investigated it','Please show the material and findings relevant to this allegation so I can respond to the investigation.','Which evidence supports the disputed finding, and was my explanation checked?','Do not assume an investigation was inadequate merely because you dislike its conclusion.','investigation,investigation-proper','investigated investigation thorough'],
['disagree','Classification','We do not agree with your explanation','Please identify the specific part you reject and the evidence supporting that conclusion.','How have you weighed my explanation against that evidence?','A disagreement is not proof of bias or predetermination.','rights-consideration,fairness','disagree explanation reject not agree'],
['excuses','Classification','You are just making excuses','I am distinguishing the facts I accept from the classification and sanction I dispute. My context and mitigation still need consideration.','Which part of my explanation do you consider unsupported?','Context should not become a denial of an established mistake.','mitigation,rights-reply','excuses excuse explanation'],
['trust','Responsibility','You have breached trust','Please identify the conduct said to have damaged trust and consider whether the concern can be addressed through a lesser sanction.','What makes the loss of trust irreparable in the established circumstances?','Dishonesty or serious risk evidence would materially weaken this response; address it honestly.','sanctions,mitigation','breached trust confidence dishonesty'],
['confidence','Responsibility','We have lost confidence in you','Please explain the basis for that conclusion and consider my response and any concrete steps I can offer to restore confidence.','Why would a warning or other lesser action be insufficient?','Offer only commitments you can honestly make and keep.','sanctions,mitigation','lost confidence trust keep employment'],
['keep','Outcome','Why should we keep you?','I ask you to weigh the mitigation I can substantiate and whether a warning would address the concern while allowing me to remain employed.','What would a lesser sanction fail to address?','Do not invent past performance, an isolated record or a promise you cannot make.','mitigation,sanctions','keep you retain employment why keep'],
['dismiss','Outcome','Why should we not dismiss you?','I ask you to consider my explanation, the mitigation I can support and whether a warning is sufficient rather than ending my employment.','Why is dismissal necessary rather than a lesser sanction?','A first gross-misconduct offence can lead to dismissal; argue proportionality, not impossibility.','sanctions,mitigation,acas-proportionality','dismissal considering dismiss sack why shouldnt dismiss'],
['accept','Classification','Do you accept misconduct?','I accept the facts I have acknowledged. Please identify the policy classification you say follows from those facts.','Which established facts and rule form the basis of that classification?','An admission of a fact is not automatically an admission of gross misconduct.','alcohol-hours,alcohol-gross-disciplinary','accept misconduct admit breach'],
['accept-gross','Classification','Do you accept gross misconduct?','On the circumstances currently established, I do not accept that classification. I ask that the full wording, specific risk, mitigation and proportionality are considered.','Which established facts do you say make the conduct gross misconduct?','Reassess if further reliable evidence supports a serious risk; do not repeat a contradicted defence.','alcohol-gross-disciplinary,alcohol-gross,sanctions','accept gross misconduct admit gross guilty'],
['sorry','Responsibility','Are you sorry?','I am prepared to acknowledge any mistake I have accepted and explain what I would change. I do not want to give an inaccurate apology for facts still disputed.','Can we distinguish the acknowledged conduct from the disputed classification?','Do not force an admission or apology for an incident that has not been established.','mitigation','sorry apology apologise remorse regret'],
['close','Outcome','Anything else you want to say?','Please consider my explanation, the evidence, the mitigation I have raised and whether a lesser sanction is sufficient before deciding.','Have all my outstanding points been considered?','A closing statement should not introduce invented facts or new admissions.','mitigation,sanctions','anything else closing finish final say'],
['dismissed','Outcome','We have decided to dismiss you','Please provide the findings, reasons, evidence relied upon and appeal instructions in writing. I am not resigning.','What is the effective termination date and the deadline and recipient for my appeal?','Preserve notes and act promptly; the internal appeal deadline is separate from tribunal time limits.','appeal,acas-outcome','decided dismissed dismissal outcome terminate employment'],
['resign','Outcome','Do you want to resign?','I am not resigning. Please complete the disciplinary process and provide any decision and reasons in writing.','', 'Do not sign or agree to a resignation you do not intend.','acas-outcome','resign resignation leave quit pressure'],
['new-allegation','Procedure','There is a new allegation','Please identify this separate allegation and its evidence clearly so I can respond accurately. I may need reasonable time to prepare.','What time will I have to consider this additional allegation?','Do not assume that a request for time means you can refuse the whole hearing.','acas-notice,acas-late-evidence','new allegation different incident another allegation'],
['interrupted','Procedure','You are being interrupted','Please let me finish my response and have it recorded.','Will I be given the opportunity to complete it before a decision?','Keep calm; avoid talking over others in return.','rights-reply,acas-hearing','interrupted interrupt finish response'],
['no-response','Procedure','You are not allowed to respond','I would like an opportunity to answer the allegation before a decision is made.','Please confirm when I can give my full response.','Record what happened without automatically labelling it unlawful.','rights-reply,acas-hearing','not allowed respond cannot answer'],
['companion','Procedure','Your companion is refused','I am requesting an eligible companion and would like the reason for refusal explained and recorded.','Is the issue eligibility, availability or the role they may take?','There is no general automatic right to a solicitor; check the statutory categories.','law-companion,law-companion-role,companion','companion refused union colleague accompany'],
['ignored','Procedure','Your mitigation is being ignored','Please consider my explanation and the mitigation I have raised before deciding the classification and sanction.','How will those mitigating circumstances be weighed?','Do not claim mitigation guarantees a lesser sanction.','mitigation,acas-proportionality','mitigation ignored not considered'],
['predecided','Procedure','The outcome appears predecided','Please clarify whether the decision remains open to my response and evidence.','Will my explanation and mitigation be considered before the final decision?','State the concrete concern; do not invent bias or accuse someone of bad faith.','rights-consideration,acas-deliberation','already decided predetermined predecided decision'],
['rule-produced','Staff drinks','Here is the separate staff-drink rule','I will consider that instruction and its relevance to the incident. Please clarify its effective date and how it was communicated.','What establishes that this version applied to me at the relevant time?','Stop relying solely on its absence from the four supplied documents.','staff-drink,acas-consistency','separate policy rule produced instruction written communicated'],
['other','Procedure','I need a moment to answer','I would like a moment to check the question and give an accurate answer.','Could you identify the specific point you want me to address?','Do not guess, fill silence with unrelated incidents or deny something you cannot remember.','acas-hearing','other pause moment unknown unclear question']
];
window.RW_DEFENCE=rows.map(([id,category,claim,say,ask,trap,source,tags])=>({id,category,claim,say,ask,trap,sources:source.split(','),tags,why:'Separate the established facts, policy classification and sanction. Use the linked wording in its full context.'}));
window.RW_BACKUP=[
['Fair & consistent treatment',['fairness']],['Know the case · reply',['rights','rights-reply','rights-consideration']],['Thorough investigation',['investigation','investigation-proper']],['Mitigation',['mitigation']],['Sanctions & alternatives',['sanctions','warnings-first','warnings-final']],['Alcohol during work',['alcohol-hours','alcohol-influence']],['Alcohol · gross misconduct',['alcohol-gross-disciplinary','alcohol-gross','gross-nonexhaustive']],['Post-shift staff drink',['staff-drink','benefits-noncontractual','staff-drink-offer']],['Evidence & preparation',['acas-notice','acas-late-evidence']],['Companion & appeal',['law-companion','companion','appeal']]
];
})();
// Additional tap-board responses. Opening a response never accepts its premise.
window.RW_DEFENCE.push(
 {id:'staff-impact',category:'Risk & safety',claim:'Your conduct affected other staff',say:'Please identify the impact on staff and its connection to the alleged conduct. I will address the specific evidence and actual circumstances.',ask:'Which employee, impact and evidence are you relying upon?',trap:'The alcohol gross-misconduct wording includes impact on other employees; do not focus only on your own performance.',sources:['alcohol-gross','alcohol-gross-disciplinary'],tags:'staff affected impact employee colleagues',why:'Both alcohol examples address impact on other employees.'},
 {id:'inconsistent',category:'Previous matters',claim:'I am being treated inconsistently',say:'I ask that genuinely comparable circumstances are treated consistently. Please consider any comparable evidence I can identify before deciding sanction.',ask:'What relevant differences explain the proposed treatment?',trap:'Do not assert unequal treatment without a reliable comparator. Different roles, duties, warnings or risk may justify different outcomes.',sources:['fairness','acas-consistency'],tags:'inconsistent treatment consistency comparator unfair',why:'Consistency matters, but comparable circumstances must be established.'},
 {id:'others',category:'Previous matters',claim:'Other staff do it',say:'I am not suggesting that another person’s conduct excuses an established breach. I ask that any comparable practice and how the rules were communicated are considered fairly.',ask:'How have comparable circumstances and communication of the rule been considered?',trap:'Do not invent examples or name people speculatively. Others drinking does not itself establish permission or comparable risk.',sources:['fairness','acas-consistency','staff-drink'],tags:'other staff do it everyone practice',why:'This is a consistency and context point, not an automatic defence.'},
 {id:'panic',category:'Procedure',claim:'I don’t know what to say',say:'I want to answer accurately. Could you clarify exactly what you’re asking me to respond to and what evidence you’re relying upon?',ask:'',trap:'Pause rather than guess. A request for clarity does not require conceding an allegation.',sources:['rights-reply','acas-hearing'],tags:'panic dont know what say unclear',why:'An accurate answer can require a clear allegation and evidence.'},
 {id:'dont-remember',category:'Procedure',claim:'I don’t remember',say:'I do not remember that clearly enough to give a definite answer. Please show me the relevant evidence so I can respond accurately.',ask:'What record or observation can help establish that point?',trap:'Say this only if true. Not remembering is not the same as denying, and reliable evidence may establish the fact.',sources:['acas-hearing'],tags:'cannot remember dont remember memory recollection',why:'Separate recollection from what reliable evidence establishes.'}
);

// Initial live speech. Full scenario reasoning remains available on expansion.
window.RW_SHORT={
  "working": {
    "say": "Please establish my remaining duties. Working status does not automatically establish gross misconduct.",
    "ask": "What duty and evidence establish that I was still working?"
  },
  "clocked": {
    "say": "I will accept an accurate clocking record. Please consider the actual duties and circumstances when assessing seriousness.",
    "ask": "Which duties remained beyond the recorded clocking time?"
  },
  "lockup": {
    "say": "Lock-up may mean work continued. Please assess gross misconduct separately.",
    "ask": "What specific risk makes this gross misconduct?"
  },
  "staff": {
    "say": "Continuing staff responsibility matters. Please identify the duty and how the alleged conduct could affect it.",
    "ask": "Which staff member, duty and potential effect are you relying on?"
  },
  "safety": {
    "say": "I understand the safety concern. Please connect the alleged conduct to a specific responsibility and risk.",
    "ask": "What evidence establishes that particular risk?"
  },
  "pint": {
    "say": "Please establish what I consumed and when. I will not deny reliable evidence.",
    "ask": "What establishes the contents, quantity and timing?"
  },
  "more": {
    "say": "I will give my accurate recollection and accept what reliable evidence establishes.",
    "ask": "What establishes the quantity and timing of each drink?"
  },
  "intox": {
    "say": "Please identify the specific observations said to establish intoxication.",
    "ask": "What behaviour was observed, by whom and when?"
  },
  "potential": {
    "say": "Potential effects matter. Please identify the specific risk from the amount and remaining duties.",
    "ask": "What specific potential effect are you relying on?"
  },
  "something": {
    "say": "An incident need not occur for risk to matter. Please identify the particular risk here.",
    "ask": "What specific event was foreseeable, and what supports that assessment?"
  },
  "emergency": {
    "say": "I understand emergency readiness matters. Please identify my remaining duty and how the alleged drinking could affect it.",
    "ask": "Which emergency responsibility and potential impairment are you relying on?"
  },
  "manager": {
    "say": "I accept my management responsibilities. Please assess the established conduct and circumstances before deciding classification and sanction.",
    "ask": "Which management duty makes these circumstances gross misconduct?"
  },
  "better": {
    "say": "I understand the standard expected. Please assess any established mistake and a proportionate sanction separately.",
    "ask": "What would a proportionate response be in these circumstances?"
  },
  "rule": {
    "say": "I accept the alcohol rule. A breach, gross misconduct and the appropriate sanction still need separate consideration.",
    "ask": "Which established circumstances make this gross misconduct?"
  },
  "gross": {
    "say": "Please explain how the established circumstances meet the complete gross-misconduct wording.",
    "ask": "Which facts and policy wording support that classification?"
  },
  "any": {
    "say": "The rule prohibits drinking during work. The alcohol example does not make every instance automatically gross misconduct.",
    "ask": "Which provision and specific circumstances are you relying on?"
  },
  "list": {
    "say": "I accept the examples are not exhaustive. Please explain why the actual circumstances are sufficiently serious.",
    "ask": "What specific conduct or risk justifies gross misconduct?"
  },
  "serious": {
    "say": "Please identify the safety rule, alleged breach and evidence of seriousness. I will address the actual risk.",
    "ask": "What specific risk and remaining duty establish the seriousness?"
  },
  "benefit": {
    "say": "The terms contemplate a discretionary post-shift drink. That is not permission to drink while still working.",
    "ask": "Which condition of the staff-drink provision was not met?"
  },
  "weekend": {
    "say": "Please identify the Friday–Sunday restriction and how it was communicated so I can address its application.",
    "ask": "Where was the restriction documented, or how was it communicated?"
  },
  "everyone": {
    "say": "Please clarify the actual instruction and its communication. I will address reliable evidence that it applied.",
    "ask": "When and how was the rule communicated to me?"
  },
  "authority": {
    "say": "Please establish who could authorise the drink and what permission was or was not given.",
    "ask": "What evidence of permission or its absence has been considered?"
  },
  "self": {
    "say": "Please establish the authorisation rules and my actual decision. I will not assume my role allowed self-authorisation.",
    "ask": "Who was entitled to authorise it, and what establishes my decision?"
  },
  "cctv": {
    "say": "I will not dispute what clear footage establishes. Please show the relevant sequence and its context.",
    "ask": "What does the footage establish about contents, timing, quantity and remaining duties?"
  },
  "witness": {
    "say": "Please distinguish what the witness directly observed from their interpretation.",
    "ask": "What did the witness see or hear, and when?"
  },
  "witnessdrunk": {
    "say": "Please identify the behaviour behind that description so I can answer the observation rather than a label.",
    "ask": "What specific behaviour did the witness observe?"
  },
  "records": {
    "say": "Please show the record; I will accept it if accurate. Actual duties and context also matter.",
    "ask": "What does the record establish beyond clock-in and clock-out times?"
  },
  "before": {
    "say": "Please identify each earlier incident and whether it concerns this allegation or the proposed sanction.",
    "ask": "What dates, findings and records are you relying on?"
  },
  "warnings": {
    "say": "Please identify the warning documents and whether they remain active.",
    "ask": "How do their dates, level and status affect this allegation or sanction?"
  },
  "lateness": {
    "say": "I acknowledge the reported lateness matters. Their formal status and current effect need clarifying.",
    "ask": "Were these formal warnings, when were they issued, and are they still active?"
  },
  "advance": {
    "say": "I requested the evidence beforehand. I need a reasonable opportunity to understand and answer it.",
    "ask": "How will I be given sufficient time to respond?"
  },
  "new-evidence": {
    "say": "I requested this evidence beforehand. I need reasonable time to review it before responding.",
    "ask": "Can we take the time needed to review this properly?"
  },
  "refused": {
    "say": "Please record my request for review time, its refusal and the reasons given.",
    "ask": "How can I give a considered response to material first provided now?"
  },
  "time": {
    "say": "Please let me explain the specific checks I still need to make before answering accurately.",
    "ask": "What time will I have to address those outstanding points?"
  },
  "investigated": {
    "say": "Please show the relevant material and findings so I can respond to the investigation.",
    "ask": "What supports the disputed finding, and was my explanation checked?"
  },
  "disagree": {
    "say": "Please identify what you reject and the evidence supporting that conclusion.",
    "ask": "How have you weighed my explanation against that evidence?"
  },
  "excuses": {
    "say": "I am separating the facts from classification and sanction. Please consider the context and mitigation.",
    "ask": "Which part of my explanation do you consider unsupported?"
  },
  "trust": {
    "say": "Please explain the loss of trust and whether a lesser sanction could address it.",
    "ask": "What makes the loss of trust irreparable here?"
  },
  "confidence": {
    "say": "Please explain your concern and consider any concrete steps I can honestly offer to restore confidence.",
    "ask": "Why would a warning or other lesser action be insufficient?"
  },
  "keep": {
    "say": "Please weigh the mitigation I can support and whether a warning would allow me to remain employed.",
    "ask": "What would a lesser sanction fail to address?"
  },
  "dismiss": {
    "say": "Please consider my explanation and supported mitigation before ending my employment.",
    "ask": "Why would a warning or final warning be insufficient?"
  },
  "accept": {
    "say": "I accept only the facts I have acknowledged. Please explain the policy classification said to follow.",
    "ask": "Which accepted facts and rule support that classification?"
  },
  "accept-gross": {
    "say": "On the circumstances established, I dispute gross misconduct. Please assess the complete wording, actual risk and mitigation.",
    "ask": "Which established facts make this gross misconduct?"
  },
  "sorry": {
    "say": "I will acknowledge any mistake I accept. I do not want to apologise inaccurately for facts still disputed.",
    "ask": "Can we distinguish acknowledged conduct from disputed classification?"
  },
  "close": {
    "say": "Please consider my explanation, the evidence and supported mitigation before deciding. Please consider whether a lesser sanction is sufficient.",
    "ask": "Have all my outstanding points been considered?"
  },
  "dismissed": {
    "say": "Please provide the findings, reasons and appeal instructions in writing. I am not resigning.",
    "ask": "What is the effective date and the deadline and recipient for my appeal?"
  },
  "resign": {
    "say": "I am not resigning. Please complete the process and provide the decision and reasons in writing.",
    "ask": ""
  },
  "new-allegation": {
    "say": "Please clarify this different or additional allegation before expecting a substantive response.",
    "ask": "What preparation time will I have for this allegation?"
  },
  "interrupted": {
    "say": "Please let me finish my response and have it recorded.",
    "ask": "Will I be allowed to finish before a decision is made?"
  },
  "no-response": {
    "say": "I would like to answer the allegation before a decision is made.",
    "ask": "When can I give my full response?"
  },
  "companion": {
    "say": "I am requesting an eligible companion. Please explain and record the reason for refusal.",
    "ask": "Is the issue eligibility, availability or their role?"
  },
  "ignored": {
    "say": "Please consider my explanation and the mitigation I have raised before deciding.",
    "ask": "How will those mitigating circumstances be weighed?"
  },
  "predecided": {
    "say": "Please clarify whether the decision remains open to my response and evidence.",
    "ask": "Will my explanation and mitigation be considered before the final decision?"
  },
  "rule-produced": {
    "say": "I will consider that instruction. Please establish which version applied and how it was communicated.",
    "ask": "What establishes that this version applied to me at the relevant time?"
  },
  "other": {
    "say": "I need a moment to understand the question and answer accurately.",
    "ask": "Which specific point would you like me to address?"
  },
  "staff-impact": {
    "say": "Please identify the impact on staff and its connection to the alleged conduct.",
    "ask": "Which employee, impact and evidence are you relying on?"
  },
  "inconsistent": {
    "say": "Please consider reliable examples of genuinely comparable treatment before deciding sanction.",
    "ask": "What relevant differences explain the proposed treatment?"
  },
  "others": {
    "say": "Other conduct does not excuse a breach. Please consider comparable practice and how the rule was communicated.",
    "ask": "How have comparable circumstances and communication of the rule been considered?"
  },
  "panic": {
    "say": "I want to answer accurately. Please clarify the question and the evidence you are relying on.",
    "ask": "What specific point do you want me to address?"
  },
  "dont-remember": {
    "say": "I do not remember clearly enough to answer definitively. Please show the evidence.",
    "ask": "What record or observation can help establish that point?"
  }
};
