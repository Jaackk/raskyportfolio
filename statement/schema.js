/*
 * Staff statement schema.
 *
 * Shared by the page (statement/schema.js) and the Google Apps Script backend
 * (paste this file unchanged into the Apps Script project as "Schema.gs").
 * Question wording here is exactly what respondents see and what is quoted
 * back in the evidence email, so edit it in one place only.
 */
var STATEMENT_SCHEMA = (function () {
  var YES_NO_PREFER = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "prefer_not", label: "Prefer not to say" }
  ];

  // Privacy model 2 (schema version 2). `identity` says who may be given the
  // respondent's identity: Jack always may (if they supply it).
  var privacyModes = {
    named: {
      label: "Named Statement",
      description: "I'm comfortable with my name and statement being provided to The HR Team / Rockwater.",
      summary: "The HR Team and Rockwater may know your identity.",
      status: "NAMED",
      identity: { jack: true, hr: true, rockwater: true },
      subject: "Rockwater Appeal Evidence — Named Statement"
    },
    confidential: {
      label: "Confidential Statement",
      description: "Jack may know who I am, and The HR Team may know my name, but I do not want my identity provided to Rockwater without Jack asking me first.",
      summary: "Jack and The HR Team may know your identity, but it must not be disclosed to Rockwater without further permission.",
      status: "CONFIDENTIAL — HR MAY KNOW IDENTITY; NOT ROCKWATER WITHOUT PERMISSION",
      identity: { jack: true, hr: true, rockwater: false },
      subject: "Rockwater Appeal Evidence — Confidential Statement"
    },
    anonymous: {
      label: "Anonymous Submission",
      description: "Only Jack will see my name. The HR Team can view my statement, but my identity will remain anonymous.",
      summary: "Jack may know your identity, but it is withheld from The HR Team and Rockwater.",
      status: "ANONYMOUS — IDENTITY WITHHELD FROM HR AND ROCKWATER",
      identity: { jack: true, hr: false, rockwater: false },
      subject: "Rockwater Appeal Evidence — Anonymous Submission"
    }
  };

  // Statements submitted under privacy model 1 (schema version 1, before 18 Oct
  // 2026). Their meaning is kept exactly; nothing is reinterpreted.
  // Model-1 "named" and "anonymous" meant the same as model 2 (an anonymous
  // model-1 statement collected no name). Model-1 "confidential" meant identity
  // withheld from BOTH The HR Team and Rockwater unless Jack asked first.
  var legacyModes = {
    legacy_confidential: {
      label: "Confidential until I give permission (original option)",
      description: "Jack may know who I am, but I do not want my identity provided to Rockwater / The HR Team without Jack asking me first.",
      summary: "Jack may know the respondent's identity. It must not be provided to The HR Team or Rockwater without asking the respondent first.",
      status: "CONFIDENTIAL (ORIGINAL TERMS) — NOT HR OR ROCKWATER WITHOUT PERMISSION",
      identity: { jack: true, hr: false, rockwater: false },
      subject: "Rockwater Appeal Evidence — Confidential Statement (original terms)"
    }
  };
  var v1Wording = {
    named: { label: "Named statement", description: "I'm comfortable with my name and statement being provided to The HR Team / Rockwater." },
    confidential: { label: "Confidential until I give permission", description: legacyModes.legacy_confidential.description },
    anonymous: { label: "Anonymous submission", description: "I don't want to provide my name." }
  };

  // Maps a stored privacy choice to its meaning, using the model it was made under.
  function privacyKey(schemaVersion, mode) {
    if (schemaVersion === 1 && mode === "confidential") return "legacy_confidential";
    return mode;
  }
  function privacyInfo(key) {
    return privacyModes[key] || legacyModes[key] || null;
  }

  // Each field belongs to a form step (what the respondent sees) and an
  // email section (how Jack receives it). `when` makes a field conditional.
  var fields = [
    // About you
    // Anonymous Submission only: may Jack know who submitted it? Never shown to
    // The HR Team or Rockwater either way.
    { id: "anon_identity", step: "about", section: "respondent", type: "radio",
      label: "Your identity", onlyPrivacy: ["anonymous"],
      options: [
        { value: "jack", label: "Only Jack can know my identity", description: "Rockwater / The HR Team may not know my identity unless I later change these settings." },
        { value: "none", label: "Fully anonymous", description: "I do not want to provide my identity." }
      ] },
    { id: "name", step: "about", section: "respondent", type: "text", max: 120,
      label: "Name", autocomplete: "name", anonymousWhen: { field: "anon_identity", in: ["jack"] } },
    { id: "role", step: "about", section: "respondent", type: "text", max: 120,
      label: "Role at Rockwater", placeholder: "e.g. Bartender, Floor staff, Supervisor",
      autocomplete: "organization-title" },
    { id: "duration", step: "about", section: "respondent", type: "select",
      label: "How long have you worked, or did you work, with Jack?",
      options: [
        { value: "under_1m", label: "Less than a month" },
        { value: "1_3m", label: "1–3 months" },
        { value: "3_6m", label: "3–6 months" },
        { value: "6m_plus", label: "6 months or more" },
        { value: "unsure", label: "Not sure" }
      ] },
    { id: "closeness", step: "about", section: "respondent", type: "radio",
      label: "How closely have you worked with Jack?",
      options: [
        { value: "frequently", label: "Frequently" },
        { value: "occasionally", label: "Occasionally" },
        { value: "limited", label: "Limited interaction" }
      ] },

    // Working with Jack
    { id: "j1", step: "jack", section: "jack", type: "textarea", max: 10000,
      label: "Based on your own experience, how would you describe Jack's work ethic, teamwork and contribution to Rockwater?",
      hint: "Specific examples are particularly helpful." },
    { id: "j2", step: "jack", section: "jack", type: "textarea", max: 10000,
      label: "Have you personally seen Jack provide strong guest service, support colleagues, lead a shift or go beyond what was expected? If so, please describe what happened." },
    { id: "j3", step: "jack", section: "jack", type: "textarea", max: 10000,
      label: "Are there particular examples of Jack making a positive contribution to the team, guest experience or day-to-day running of Rockwater?" },
    { id: "j4", step: "jack", section: "jack", type: "textarea", max: 10000,
      label: "Based on your experience working with Jack, is there anything you believe HR should take into account when considering whether dismissal was a proportionate outcome?",
      hint: "You don't need to know the details of the disciplinary case to answer this. Please only include what you know from your own experience." },

    // Working with Luis
    { id: "a", step: "luis", section: "luis", type: "radio", options: YES_NO_PREFER,
      label: "Have you personally experienced or witnessed conduct by Luis towards you or another member of staff that you considered disrespectful, inappropriate, unfair or unnecessarily upsetting?" },
    { id: "a_detail", step: "luis", section: "luis", type: "textarea", max: 10000,
      when: { field: "a", in: ["yes"] },
      label: "What happened?",
      hint: "Include the approximate date, what was said or done, who was present, and what you personally saw or heard." },
    { id: "b", step: "luis", section: "luis", type: "radio", options: YES_NO_PREFER,
      label: "Have you personally experienced occasions where Luis's conduct or approach as General Manager negatively affected staff morale, teamwork or the working environment?" },
    { id: "b_detail", step: "luis", section: "luis", type: "textarea", max: 10000,
      when: { field: "b", in: ["yes"] },
      label: "If yes, please give specific examples." },
    { id: "c", step: "luis", section: "luis", type: "radio", options: YES_NO_PREFER,
      label: "Based on your direct experience, have there been occasions where you felt Luis did not adequately support the team during service or in his role as General Manager?" },
    { id: "c_detail", step: "luis", section: "luis", type: "textarea", max: 10000,
      when: { field: "c", in: ["yes"] },
      label: "Please explain what happened." },

    // Rules and staff drinks
    { id: "d", step: "rules", section: "consistency", type: "radio", options: YES_NO_PREFER,
      label: "Have you personally witnessed Luis enforcing a workplace rule or standard against another employee while appearing not to follow the same rule or standard himself?" },
    { id: "d_detail", step: "rules", section: "consistency", type: "textarea", max: 10000,
      when: { field: "d", in: ["yes"] },
      label: "If yes, please describe the circumstances.",
      hint: "Which rule or standard, approximately when, who was present, and what you personally saw." },
    { id: "e", step: "rules", section: "consistency", type: "radio",
      label: "Have you personally witnessed Luis requesting or consuming alcohol outside the stated staff-drink rules?",
      hint: "“Stated staff-drink rules” means the staff-drink rules as they were communicated to you by Rockwater.",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "unsure", label: "Unsure" },
        { value: "prefer_not", label: "Prefer not to say" }
      ] },
    { id: "e_what", step: "rules", section: "consistency", type: "textarea", max: 10000,
      when: { field: "e", in: ["yes"] },
      label: "What did you personally witness?",
      hint: "If you saw this on more than one occasion, please describe each occasion separately." },
    { id: "e_when", step: "rules", section: "consistency", type: "text", max: 300,
      when: { field: "e", in: ["yes"] },
      label: "Approximately when did this happen?",
      hint: "The date or approximate period, and the time if you know it." },
    { id: "e_drink", step: "rules", section: "consistency", type: "text", max: 300,
      when: { field: "e", in: ["yes"] },
      label: "What drink was involved, if known?" },
    { id: "e_status", step: "rules", section: "consistency", type: "radio",
      when: { field: "e", in: ["yes"] },
      label: "Was Luis working at the time, finished working, or are you unsure?",
      options: [
        { value: "working", label: "Working" },
        { value: "finished", label: "Finished working" },
        { value: "unsure", label: "Unsure" }
      ] },
    { id: "e_paid", step: "rules", section: "consistency", type: "radio",
      when: { field: "e", in: ["yes"] },
      label: "Do you personally know whether the drink was paid for or recorded?",
      hint: "Seeing somebody have a drink doesn't by itself show whether it was paid for or recorded. Please only choose “Yes” if you actually know.",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "unsure", label: "Unsure" }
      ] },
    { id: "e_paid_how", step: "rules", section: "consistency", type: "textarea", max: 5000,
      when: { field: "e_paid", in: ["yes"] },
      label: "Please explain how you know.",
      hint: "Please say whether you saw this yourself or were told by somebody else." },

    // Anything else
    { id: "f", step: "other", section: "luis", type: "textarea", max: 10000,
      label: "Is there any other specific conduct by Luis that you believe The HR Team should reasonably be aware of when considering my appeal or reviewing his conduct as General Manager?",
      hint: "Specific facts — what happened, approximately when, and who was present — are more useful than general opinions." },
    { id: "other", step: "other", section: "additional", type: "textarea", max: 15000, large: true,
      label: "Is there anything else from your own experience that you believe The HR Team should reasonably consider regarding Jack's contribution, the consistency of workplace standards, or the concerns about Luis described above?" },

    // Evidence and verification
    { id: "basis", step: "evidence", section: "basis", type: "checkbox",
      label: "How do you know the information you've provided?",
      hint: "You can select more than one option.",
      options: [
        { value: "witnessed", label: "I personally witnessed or experienced it." },
        { value: "documents", label: "I have messages, documents or other evidence." },
        { value: "told", label: "Somebody else told me." },
        { value: "mixture", label: "My answer contains a mixture of the above." },
        { value: "other", label: "Other" }
      ] },
    { id: "basis_detail", step: "evidence", section: "basis", type: "textarea", max: 5000,
      label: "Anything you'd like to explain about how you know?",
      hint: "For example, which parts you saw yourself and which you were told, and by whom if you're comfortable saying." },
    { id: "hr", step: "evidence", section: "respondent", type: "radio",
      label: "If The HR Team wanted to verify your statement independently, would you be willing to speak to them?",
      options: [
        { value: "yes", label: "Yes", description: "I'm comfortable being contacted.", notWhenPrivacy: ["anonymous"] },
        { value: "maybe", label: "Maybe", description: "Please ask me first.", notWhenPrivacy: ["anonymous"] },
        { value: "no", label: "No", description: "I don't want to be contacted." },
        { value: "anon", label: "Prefer to remain anonymous" }
      ] },
    { id: "hr_contact", step: "evidence", section: "respondent", type: "text", max: 200,
      when: { field: "hr", in: ["yes", "maybe"] }, notWhenPrivacy: ["anonymous"],
      label: "Preferred contact details (optional)",
      hint: "A phone number or email address. Only needed if Jack doesn't already have a way to reach you.",
      autocomplete: "email" }
  ];

  var amendmentFields = [
    { id: "ref", type: "text", max: 20, label: "Statement reference", prefix: "RW-", placeholder: "XXXXX", required: true,
      hint: "The five characters after RW-." },
    // The private link also carries a secret that confirms the request comes
    // from the respondent. It is never shown or asked for as a field.
    { id: "action", type: "radio", label: "What would you like to do?", required: true,
      options: [
        { value: "correct", label: "Correct or add to my statement" },
        { value: "privacy", label: "Change my privacy preference" },
        { value: "withdraw", label: "Withdraw my statement" }
      ] },
    { id: "new_privacy", type: "radio", label: "Your privacy preference from now on", required: true,
      when: { field: "action", in: ["privacy"] },
      options: [
        { value: "named", label: "Named Statement", description: "The HR Team and Rockwater may know your identity." },
        { value: "confidential", label: "Confidential Statement", description: "Jack and The HR Team may know your identity, but it must not be disclosed to Rockwater without further permission." },
        { value: "anonymous", label: "Anonymous Submission", description: "Jack may know your identity, but it is withheld from The HR Team and Rockwater." }
      ] },
    { id: "name", type: "text", max: 120, label: "Your name", autocomplete: "name",
      when: { field: "new_privacy", in: ["named", "confidential"] },
      hint: "Only needed if you didn't give your name with your statement." },
    { id: "detail", type: "textarea", max: 10000,
      label: "Details",
      hint: "What should be corrected or added? For a privacy change or withdrawal you can leave this blank, or add anything Jack should know." }
  ];

  var emailSections = [
    { id: "jack", title: "WORKING WITH JACK" },
    { id: "luis", title: "EXPERIENCE WORKING WITH LUIS" },
    { id: "consistency", title: "STAFF DRINK / CONSISTENCY EVIDENCE" },
    { id: "basis", title: "EVIDENCE BASIS" },
    { id: "additional", title: "ADDITIONAL INFORMATION" }
  ];

  // Convenience categories for Jack's private record. These only say which
  // questions were answered; they never summarise or interpret testimony.
  var categories = [
    { id: "CONTRIBUTION (JACK)", fields: ["j1", "j2", "j3", "j4"] },
    { id: "CONDUCT BY LUIS", fields: ["a_detail", "f"] },
    { id: "WORKPLACE ENVIRONMENT", fields: ["b_detail", "c_detail"] },
    { id: "POLICY CONSISTENCY", fields: ["d_detail"] },
    { id: "STAFF DRINKS", fields: ["e_what", "e_when", "e_drink", "e_paid_how"] }
  ];

  var declarations = [
    { id: "honest", label: "The information I've provided is an honest account to the best of my recollection. I've tried to distinguish what I personally witnessed from anything I was told by somebody else." },
    // Wording depends on the privacy choice, so respondents confirm exactly what they chose.
    { id: "use", byPrivacy: {
      named: "I'm comfortable with my name and this statement being provided to The HR Team / Rockwater, and with Jack using it as evidence in his employment appeal and/or related HR concerns.",
      confidential: "I understand Jack may use this statement as evidence in his employment appeal and/or related HR concerns, and that The HR Team may know my name, but my identity won't be provided to Rockwater unless Jack asks me first and I agree.",
      anonymous: "I understand Jack may use this statement as evidence in his employment appeal and/or related HR concerns without my identity being provided to The HR Team or Rockwater, and that details in my statement or attachments could still identify me."
    } }
  ];
  // Declaration wording shown by the model-1 form (kept for statements sent from it).
  v1Wording.named.declaration = "I'm comfortable with my name and this statement being provided to The HR Team / Rockwater, and with Jack using it as evidence in his employment appeal and/or related HR concerns.";
  v1Wording.confidential.declaration = "I understand Jack may use this statement as evidence in his employment appeal and/or related HR concerns, but my name and identity won't be provided to Rockwater / The HR Team unless he asks me first and I agree.";
  v1Wording.anonymous.declaration = "I understand Jack may use this statement, without my name, as evidence in his employment appeal and/or related HR concerns, and that details in my statement or attachments could still identify me.";

  function declarationLabel(declaration, privacy) {
    return declaration.byPrivacy ? declaration.byPrivacy[privacy] : declaration.label;
  }

  var attachmentRules = {
    maxFiles: 4,
    maxFileBytes: 10 * 1024 * 1024,
    maxTotalBytes: 20 * 1024 * 1024,
    types: {
      "image/jpeg": "JPEG image",
      "image/png": "PNG image",
      "image/webp": "WebP image",
      "image/heic": "HEIC image",
      "image/heif": "HEIF image",
      "application/pdf": "PDF document"
    }
  };

  function fieldById(id) {
    for (var i = 0; i < fields.length; i++) if (fields[i].id === id) return fields[i];
    return null;
  }

  function optionAllowed(option, privacy) {
    return !(option.notWhenPrivacy && option.notWhenPrivacy.indexOf(privacy) !== -1);
  }

  // Whether a field applies, given the privacy choice and earlier answers.
  function isActive(field, answers, privacy) {
    if (field.notWhenPrivacy && field.notWhenPrivacy.indexOf(privacy) !== -1) return false;
    if (field.onlyPrivacy && field.onlyPrivacy.indexOf(privacy) === -1) return false;
    if (field.anonymousWhen && privacy === "anonymous" && field.anonymousWhen.in.indexOf(answers[field.anonymousWhen.field]) === -1) return false;
    if (field.when) {
      var parent = fieldById(field.when.field);
      if (parent && !isActive(parent, answers, privacy)) return false;
      if (field.when.in.indexOf(answers[field.when.field]) === -1) return false;
    }
    return true;
  }

  function isRequired(field, privacy, answers) {
    // Named: the name is the statement's attribution. Confidential: Jack needs
    // to know who to ask before sharing their identity. Anonymous: the
    // respondent says whether Jack may know who they are, and if so, who.
    if (field.id === "anon_identity") return privacy === "anonymous";
    if (field.id !== "name") return false;
    if (privacy === "named" || privacy === "confidential") return true;
    return privacy === "anonymous" && !!answers && answers.anon_identity === "jack";
  }

  function hasText(value) {
    return typeof value === "string" && /\S/.test(value);
  }

  function optionLabel(field, value) {
    if (!field.options) return value;
    for (var i = 0; i < field.options.length; i++) {
      if (field.options[i].value === value) {
        var o = field.options[i];
        return o.description ? o.label + " — " + o.description : o.label;
      }
    }
    return value;
  }

  // The characters after "RW-", however a reference was typed or pasted:
  // "3w arf", "rw-3warf" and "RW 3WARF" all give "3WARF". A leading "RW" is
  // only dropped when more than five characters remain, because a reference
  // can itself begin with R and W (RW-RW3AB).
  function referenceSuffix(value) {
    var c = String(value == null ? "" : value).toUpperCase().replace(/[^0-9A-Z]/g, "");
    while (c.length > 5 && c.slice(0, 2) === "RW") c = c.slice(2);
    return c;
  }
  // Canonical "RW-XXXXX", or "" if it can't be one.
  function normaliseReference(value) {
    var ref = "RW-" + referenceSuffix(value);
    return /^RW-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{5}$/.test(ref) ? ref : "";
  }

  return {
    version: 2,
    privacyModes: privacyModes,
    legacyModes: legacyModes,
    v1Wording: v1Wording,
    privacyKey: privacyKey,
    privacyInfo: privacyInfo,
    codePattern: /^[23456789ABCDEFGHJKMNPQRSTVWXYZ]{4}(-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{4}){4}$/,
    fields: fields,
    amendmentFields: amendmentFields,
    emailSections: emailSections,
    categories: categories,
    declarations: declarations,
    declarationLabel: declarationLabel,
    attachmentRules: attachmentRules,
    referencePattern: /^RW-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{5}$/,
    referenceSuffix: referenceSuffix,
    normaliseReference: normaliseReference,
    fieldById: fieldById,
    optionAllowed: optionAllowed,
    isActive: isActive,
    isRequired: isRequired,
    hasText: hasText,
    optionLabel: optionLabel
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = STATEMENT_SCHEMA;
