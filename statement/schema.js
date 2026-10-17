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

  var privacyModes = {
    named: {
      label: "Named statement",
      description: "I'm comfortable with my name and statement being provided to The HR Team / Rockwater.",
      status: "NAMED",
      subject: "Rockwater Appeal Evidence — Named Statement"
    },
    confidential: {
      label: "Confidential until I give permission",
      description: "Jack may know who I am, but I do not want my identity provided to Rockwater / The HR Team without Jack asking me first.",
      status: "CONFIDENTIAL — DO NOT IDENTIFY WITHOUT PERMISSION",
      subject: "Rockwater Appeal Evidence — Confidential Statement"
    },
    anonymous: {
      label: "Anonymous submission",
      description: "I don't want to provide my name.",
      status: "ANONYMOUS",
      subject: "Rockwater Appeal Evidence — Anonymous Statement"
    }
  };

  // Each field belongs to a form step (what the respondent sees) and an
  // email section (how Jack receives it). `when` makes a field conditional.
  var fields = [
    // About you
    { id: "name", step: "about", section: "respondent", type: "text", max: 120,
      label: "Name", autocomplete: "name",
      notWhenPrivacy: ["anonymous"] },
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
    { id: "ref", type: "text", max: 20, label: "Statement reference", placeholder: "RW-XXXXX", required: true },
    { id: "action", type: "radio", label: "What would you like to do?", required: true,
      options: [
        { value: "correct", label: "Correct or add to my statement" },
        { value: "withdraw", label: "Withdraw my statement" }
      ] },
    { id: "detail", type: "textarea", max: 10000,
      label: "Details",
      hint: "What should be corrected or added? If you're withdrawing, you can leave this blank." }
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
    { id: "use", label: "I understand that, subject to the privacy preference I selected above, this statement may be used by Jack as evidence in his employment appeal and/or related HR concerns." }
  ];

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
    if (field.when) {
      var parent = fieldById(field.when.field);
      if (parent && !isActive(parent, answers, privacy)) return false;
      if (field.when.in.indexOf(answers[field.when.field]) === -1) return false;
    }
    return true;
  }

  function isRequired(field, privacy) {
    // Named: the name is the statement's attribution. Confidential: Jack needs
    // to know who to ask before sharing their identity.
    return field.id === "name" && (privacy === "named" || privacy === "confidential");
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

  return {
    version: 1,
    privacyModes: privacyModes,
    fields: fields,
    amendmentFields: amendmentFields,
    emailSections: emailSections,
    categories: categories,
    declarations: declarations,
    attachmentRules: attachmentRules,
    referencePattern: /^RW-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{5}$/,
    fieldById: fieldById,
    optionAllowed: optionAllowed,
    isActive: isActive,
    isRequired: isRequired,
    hasText: hasText,
    optionLabel: optionLabel
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = STATEMENT_SCHEMA;
