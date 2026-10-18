/* Staff statement — multi-step form. No dependencies, no tracking. */
(function () {
  "use strict";

  var S = window.STATEMENT_SCHEMA;
  var ENDPOINT = (window.STATEMENT_ENDPOINT || "").trim();
  var STORAGE_KEY = "rw-statement-v1";
  var TIMEOUT_MS = 90000;

  var STEPS = [
    { id: "privacy", name: "Privacy",
      title: "How would you like your statement handled?",
      intro: "Choose the option you're most comfortable with." },
    { id: "about", name: "About you",
      title: "About you",
      intro: "This information is optional and helps give context to your statement. Please don't include anything you'd rather not share." },
    { id: "jack", name: "Working with Jack",
      eyebrow: "Working with Jack",
      title: "My contribution to Rockwater",
      intro: "Please describe your own experience. Specific examples are particularly helpful, and you can skip any question.",
      note: "This form isn't asking about the incident that led to the disciplinary process. Please focus on your own experience of working with Jack." },
    { id: "luis", name: "Working with Luis",
      title: "Your experience working with Luis",
      intro: "These questions relate specifically to your own experience of working with Luis. Please provide factual examples wherever possible. Only include things you personally experienced or witnessed, and distinguish those from anything you were told by somebody else.",
      note: "Please don't include information about anyone's health or medical matters." },
    { id: "rules", name: "Rules & staff drinks",
      title: "Workplace rules and staff drinks",
      intro: "These questions are about what you personally saw. If you're unsure about something, it's fine to say so — please don't fill gaps with assumptions." },
    { id: "other", name: "Anything else",
      title: "Anything else",
      intro: "Only if there's something you haven't already covered. It's fine to leave these blank." },
    { id: "evidence", name: "Evidence",
      title: "How do you know the information you've provided?",
      intro: "This helps show which parts of your statement are first-hand. Information you were told by somebody else is still welcome — it just helps to say so." }
  ];
  var TOTAL_STEPS = STEPS.length + 1; // + review

  var REVIEW_SECTIONS = [
    { title: "Your details", step: "about", fields: ["name", "role", "duration", "closeness"] },
    { title: "Working with Jack", step: "jack", fields: ["j1", "j2", "j3", "j4"] },
    { title: "Working with Luis", step: "luis", fields: ["a", "a_detail", "b", "b_detail", "c", "c_detail"] },
    { title: "Workplace rules and staff drinks", step: "rules",
      fields: ["d", "d_detail", "e", "e_what", "e_when", "e_drink", "e_status", "e_paid", "e_paid_how"] },
    { title: "Anything else", step: "other", fields: ["f", "other"] },
    { title: "Evidence and verification", step: "evidence", fields: ["basis", "basis_detail", "hr", "hr_contact"], attachments: true }
  ];

  var ICONS = {
    person: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5c.8-3.9 3.8-6 7.5-6s6.7 2.1 7.5 6"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/>',
    eyeOff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c5 0 8.5 4.5 9.5 7-.4 1-1.2 2.4-2.4 3.7M6.6 6.6C4.5 8 3.1 10.1 2.5 12c1 2.5 4.5 7 9.5 7 1.7 0 3.2-.5 4.5-1.3"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.2"/>',
    upload: '<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5"/><path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15"/>'
  };
  var PRIVACY_ICONS = { named: "person", confidential: "lock", anonymous: "eyeOff" };

  // ---------- State ----------

  var state = load() || freshState();
  var files = []; // { id, file } — kept in memory only
  var lastResult = null;
  var submitting = false;

  function freshState() {
    return { model: 2, privacy: null, answers: {}, declarations: {}, step: 0, key: null, amend: {} };
  }

  function load() {
    try {
      var raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || typeof data !== "object" || typeof data.answers !== "object") return null;
      data.declarations = data.declarations || {};
      data.amend = data.amend || {};
      if (data.model !== 2) {
        // Answers saved under the original privacy options. "Confidential" has a
        // different meaning now, so that choice must be made again; answers are kept.
        if (data.privacy === "confidential") { data.privacy = null; data.privacyReset = true; }
        data.declarations = {};
        data.model = 2;
      }
      return data;
    } catch (e) { return null; }
  }

  function save() {
    try { window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable: answers stay in memory */ }
  }

  function clearAll() {
    state = freshState();
    files = [];
    try { window.sessionStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  }

  function hasProgress() {
    if (state.privacy) return true;
    for (var k in state.answers) if (Object.prototype.hasOwnProperty.call(state.answers, k)) return true;
    return false;
  }

  function newKey() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    var b = new Uint8Array(16);
    window.crypto.getRandomValues(b);
    return Array.prototype.map.call(b, function (x) { return ("0" + x.toString(16)).slice(-2); }).join("");
  }

  // ---------- DOM helpers ----------

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k) || attrs[k] == null || attrs[k] === false) continue;
        if (k === "text") el.textContent = attrs[k];
        else if (k === "className") el.className = attrs[k];
        else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), attrs[k]);
        else if (attrs[k] === true) el.setAttribute(k, "");
        else el.setAttribute(k, attrs[k]);
      }
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, child) {
    if (child == null || child === false) return;
    if (Array.isArray(child)) { child.forEach(function (c) { append(el, c); }); return; }
    el.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }

  function icon(name, cls) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", "icon" + (cls ? " " + cls : ""));
    svg.innerHTML = ICONS[name]; // static markup from ICONS only
    return svg;
  }

  function formatBytes(n) {
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return Math.round(n / 1024) + " KB";
    return (n / (1024 * 1024)).toFixed(1) + " MB";
  }

  // ---------- Field rendering ----------

  function fieldLabelText(field) { return field.label; }

  function renderField(field, values, onChange, opts) {
    opts = opts || {};
    var id = (opts.prefix || "f-") + field.id;
    var required = opts.required || false;
    var value = values[field.id];
    var wrap;

    var labelExtras = required ? null : h("span", { className: "opt", text: " (optional)" });
    var hint = field.hint ? h("p", { className: "hint", id: id + "-hint", text: field.hint }) : null;
    var describedBy = field.hint ? id + "-hint" : null;

    if (field.type === "text" || field.type === "textarea" || field.type === "select") {
      wrap = h("div", { className: "field", "data-field": field.id });
      var labelText = field.label;
      wrap.appendChild(h("label", { className: "label", "for": id }, labelText, opts.hideOptional ? null : labelExtras));
      if (hint) wrap.appendChild(hint);

      var control;
      if (field.type === "select") {
        control = h("select", { className: "select", id: id, name: field.id, "aria-describedby": describedBy });
        control.appendChild(h("option", { value: "", text: "Select an option" }));
        field.options.forEach(function (o) {
          var opt = h("option", { value: o.value, text: o.label });
          if (value === o.value) opt.selected = true;
          control.appendChild(opt);
        });
        control.addEventListener("change", function () { onChange(field.id, control.value || undefined); });
      } else if (field.type === "textarea") {
        control = h("textarea", {
          className: "textarea" + (field.large ? " textarea--large" : ""), id: id, name: field.id,
          maxlength: field.max, rows: field.large ? 8 : 5, "aria-describedby": describedBy,
          placeholder: field.placeholder || null, spellcheck: "true", autocapitalize: "sentences"
        });
        control.value = typeof value === "string" ? value : "";
        var counter = h("p", { className: "counter", "aria-live": "polite", hidden: true });
        var update = function () {
          autoGrow(control);
          var len = control.value.length;
          var show = len > field.max * 0.8;
          counter.hidden = !show;
          if (show) {
            counter.textContent = len.toLocaleString("en-GB") + " / " + field.max.toLocaleString("en-GB") + " characters";
            counter.className = "counter" + (len >= field.max ? " counter--warn" : "");
          }
        };
        control.addEventListener("input", function () { update(); onChange(field.id, control.value); });
        wrap.appendChild(control);
        wrap.appendChild(counter);
        requestAnimationFrame(update);
        return wrap;
      } else {
        control = h("input", {
          className: "input", id: id, name: field.id, type: "text", maxlength: field.max,
          autocomplete: field.autocomplete || "off", placeholder: field.placeholder || null,
          "aria-describedby": describedBy, enterkeyhint: "next", autocapitalize: (field.id === "ref" || field.id === "code") ? "characters" : (field.id === "name" ? "words" : "sentences"),
          spellcheck: (field.id === "ref" || field.id === "code") ? "false" : null, required: required
        });
        control.value = typeof value === "string" ? value : "";
        if (field.prefix) {
          // Reference: "RW-" is shown as a fixed prefix; the box holds only what
          // follows it, in capitals, whatever was typed or pasted.
          control.value = S.referenceSuffix(control.value);
          control.addEventListener("input", function () {
            var caret = control.selectionStart == null ? control.value.length : control.selectionStart;
            var tidy = S.referenceSuffix(control.value);
            if (tidy !== control.value) {
              var atEnd = caret >= control.value.length;
              var kept = function (t) { return t.replace(/[^0-9a-z]/gi, "").length; };
              var before = kept(control.value.slice(0, caret)) - (kept(control.value) - tidy.length); // less any "RW" dropped from the front
              control.value = tidy;
              var pos = atEnd ? tidy.length : Math.max(0, Math.min(tidy.length, before));
              try { control.setSelectionRange(pos, pos); } catch (e) {}
            }
            onChange(field.id, control.value);
          });
          wrap.appendChild(h("div", { className: "input-prefixed" },
            h("span", { className: "input-prefixed__prefix", "aria-hidden": "true", text: field.prefix }), control));
          control.setAttribute("aria-label", field.label + ", the characters after " + field.prefix);
          return wrap;
        }
        control.addEventListener("input", function () {
          if (field.id === "code" && control.value !== control.value.toUpperCase()) {
            var p = control.selectionStart;
            control.value = control.value.toUpperCase();
            try { control.setSelectionRange(p, p); } catch (e) {}
          }
          onChange(field.id, control.value);
        });
      }
      wrap.appendChild(control);
      return wrap;
    }

    // radio / checkbox groups
    var isCheck = field.type === "checkbox";
    wrap = h("fieldset", { className: "field", "data-field": field.id, "aria-describedby": describedBy });
    wrap.appendChild(h("legend", null, field.label, opts.hideOptional ? null : labelExtras));
    if (hint) wrap.appendChild(hint);
    var list = h("div", { className: "choices" + (!isCheck && field.options.length <= 3 && !field.options.some(function (o) { return o.description; }) && field.options.every(function (o) { return o.label.length < 14; }) ? " choices--inline" : "") });
    var privacy = opts.privacy;
    var blocked = [];
    field.options.forEach(function (o, i) {
      var allowed = S.optionAllowed(o, privacy);
      if (!allowed) blocked.push(o);
      var inputId = id + "-" + i;
      var checked = isCheck ? (Array.isArray(value) && value.indexOf(o.value) !== -1) : value === o.value;
      var input = h("input", {
        type: isCheck ? "checkbox" : "radio", id: inputId, name: id, value: o.value,
        disabled: !allowed
      });
      input.checked = checked && allowed;
      input.addEventListener("change", function () {
        if (isCheck) {
          var vals = $all("input:checked", list).map(function (x) { return x.value; });
          onChange(field.id, vals.length ? vals : undefined);
        } else {
          onChange(field.id, input.value);
        }
        if (!isCheck) syncClear();
      });
      list.appendChild(h("label", { className: "choice" + (isCheck ? " choice--check" : ""), "for": inputId },
        input,
        h("span", { className: "choice__box" },
          h("span", { className: "choice__dot", "aria-hidden": "true" }),
          h("span", { className: "choice__text" }, o.label,
            o.description ? h("span", { className: "choice__desc", text: o.description }) : null))));
    });
    wrap.appendChild(list);

    if (blocked.length && privacy === "anonymous") {
      wrap.appendChild(h("p", { className: "hint", text: "Being contacted would mean sharing contact details, so those options aren't available for anonymous statements. If you'd like to be contactable, choose “Named Statement” or “Confidential Statement” on the privacy step." }));
    }

    if (!isCheck && !required) {
      var clear = h("button", { type: "button", className: "btn btn--ghost btn--small btn--clear", text: "Clear answer" });
      clear.addEventListener("click", function () {
        $all("input", list).forEach(function (x) { x.checked = false; });
        onChange(field.id, undefined);
        syncClear();
      });
      var syncClear = function () { clear.hidden = !$("input:checked", list); };
      syncClear();
      wrap.appendChild(h("div", null, clear));
    } else {
      var syncClear = function () {};
    }
    return wrap;
  }

  function autoGrow(ta) {
    ta.style.height = "auto";
    var max = Math.max(260, Math.round(window.innerHeight * 0.6));
    ta.style.height = Math.min(ta.scrollHeight + 2, max) + "px";
    ta.style.overflowY = ta.scrollHeight + 2 > max ? "auto" : "hidden";
  }

  // ---------- Steps ----------

  var stepBody = $("[data-step-body]");
  var stepForm = $("[data-step-form]");
  var formError = $("[data-form-error]");

  function renderStep(index) {
    var step = STEPS[index];
    stepBody.innerHTML = "";
    formError.hidden = true;

    var head = [];
    if (step.eyebrow) head.push(h("p", { className: "eyebrow", text: step.eyebrow }));
    head.push(h("h1", { className: "step__title", tabindex: "-1", "data-step-title": true, text: step.title }));
    var intro = step.intro;
    if (step.id === "about" && (state.privacy === "named" || state.privacy === "confidential")) {
      intro = "Your name is needed for this type of statement. The other details are optional and help give context to your statement. Please don't include anything you'd rather not share.";
    } else if (step.id === "about" && state.privacy === "anonymous") {
      intro = "Please say whether Jack may know who you are. The other details are optional and help give context to your statement. Please don't include anything you'd rather not share.";
    }
    if (intro) head.push(h("p", { className: "step__intro", text: intro }));
    if (step.note) head.push(h("div", { className: "note note--plain" }, icon("info"), h("span", { text: step.note })));
    append(stepBody, head);

    if (step.id === "privacy") renderPrivacy();
    else {
      var container = h("div", { className: "fields" });
      S.fields.filter(function (f) { return f.step === step.id; }).forEach(function (f) {
        // An anonymous respondent's name field only appears once they've said Jack may know who they are.
        var reqAnswers = f.id === "name" && state.privacy === "anonymous" ? { anon_identity: "jack" } : state.answers;
        var el = renderField(f, state.answers, onAnswer, { privacy: state.privacy, required: S.isRequired(f, state.privacy, reqAnswers) });
        if (f.when || (f.anonymousWhen && state.privacy === "anonymous")) el.classList.add("field--sub");
        if (f.id === "name") decorateName(el);
        container.appendChild(el);
      });
      stepBody.appendChild(container);
      if (step.id === "evidence") insertUploads(container);
      syncVisibility();
    }

    $("[data-continue-label]").textContent = index === STEPS.length - 1 ? "Review statement" : "Continue";
    $("[data-return-review]").hidden = !state.returnToReview || index === STEPS.length - 1;
    var pct = ((index + 1) / TOTAL_STEPS) * 100;
    $("[data-progress-fill]").style.width = pct + "%";
    $("[data-progress-bar]").setAttribute("aria-valuenow", String(index + 1));
    $("[data-progress-count]").textContent = "Step " + (index + 1) + " of " + TOTAL_STEPS;
    $("[data-progress-name]").textContent = step.name;
    stepForm.classList.remove("step-enter");
    void stepForm.offsetWidth;
    stepForm.classList.add("step-enter");
  }

  function decorateName(el) {
    var hint = {
      named: "Needed for a named statement.",
      confidential: "Needed so Jack knows who to ask for permission. The HR Team may know your name, but it won't be provided to Rockwater without your permission.",
      anonymous: "Only Jack will see your name. It won't be included in anything provided to The HR Team or Rockwater unless you later change your privacy preference."
    }[state.privacy] || "";
    var p = h("p", { className: "hint", id: "f-name-hint", text: hint });
    el.insertBefore(p, el.querySelector("input"));
    el.querySelector("input").setAttribute("aria-describedby", "f-name-hint");
  }

  function renderPrivacy() {
    var group = h("fieldset", { className: "field", "data-field": "privacy" });
    group.appendChild(h("legend", { className: "sr-only", text: "Privacy preference" }));
    var cards = h("div", { className: "privacy-cards" });
    Object.keys(S.privacyModes).forEach(function (mode) {
      var m = S.privacyModes[mode];
      var input = h("input", { type: "radio", name: "privacy", id: "privacy-" + mode, value: mode });
      input.checked = state.privacy === mode;
      input.addEventListener("change", function () { setPrivacy(mode); });
      cards.appendChild(h("label", { className: "choice privacy-card", "for": "privacy-" + mode },
        input,
        h("span", { className: "choice__box" },
          icon(PRIVACY_ICONS[mode]),
          h("span", { className: "choice__text" }, h("strong", { text: m.label }), h("span", { className: "choice__desc", text: m.description })),
          h("span", { className: "choice__dot", "aria-hidden": "true" }))));
    });
    group.appendChild(cards);
    stepBody.appendChild(group);
    if (state.privacyReset) {
      stepBody.insertBefore(h("div", { className: "note" }, icon("info"),
        h("span", { text: "The privacy options have been updated since you started. Please choose your preference again — your answers have been kept." })), group);
    }
    stepBody.appendChild(h("div", { className: "note" }, icon("info"),
      h("span", { text: "Details within a statement or its attachments may make somebody identifiable even where their name isn't given." })));
    stepBody.appendChild(h("p", { className: "hint", text: "There is no pressure to complete this form. Only provide information you're comfortable sharing. Your selected preference will determine how Jack is permitted to use identifying information from this submission. You can change it later using your reference or the private link you'll be given." }));
  }

  function setPrivacy(mode) {
    // The "use" declaration is worded for the privacy choice, so a new choice needs a fresh confirmation.
    if (state.privacy !== mode) delete state.declarations.use;
    state.privacy = mode;
    state.privacyReset = false;
    if (mode === "anonymous") {
      // Contact details and HR-contact consent don't fit an anonymous statement.
      // A name, if given, is kept for Jack only.
      delete state.answers.hr_contact;
      if (state.answers.hr === "yes" || state.answers.hr === "maybe") delete state.answers.hr;
    }
    formError.hidden = true;
    save();
  }

  function onAnswer(id, value) {
    if (value === undefined || value === "" || (Array.isArray(value) && !value.length)) delete state.answers[id];
    else state.answers[id] = value;
    var errField = $('[data-field="' + id + '"].field--invalid');
    if (errField) clearFieldError(errField);
    save();
    syncVisibility();
  }

  function syncVisibility() {
    S.fields.forEach(function (f) {
      var el = $('[data-field="' + f.id + '"]', stepBody);
      if (!el) return;
      var active = S.isActive(f, state.answers, state.privacy);
      if (el.hidden === active) {
        el.hidden = !active;
        if (active && el.classList.contains("field--sub")) {
          el.style.animation = "none"; void el.offsetWidth; el.style.animation = "";
          $all("textarea", el).forEach(autoGrow);
        }
      }
    });
  }

  function setFieldError(el, message) {
    el.classList.add("field--invalid");
    var err = h("p", { className: "field__error", id: (el.getAttribute("data-field") || "x") + "-error", text: message });
    el.appendChild(err);
    var control = el.querySelector("input, textarea, select");
    if (control) control.setAttribute("aria-invalid", "true");
  }
  function clearFieldError(el) {
    el.classList.remove("field--invalid");
    $all(".field__error", el).forEach(function (e) { e.remove(); });
    $all("[aria-invalid]", el).forEach(function (c) { c.removeAttribute("aria-invalid"); });
  }

  function validateStep(index) {
    $all(".field--invalid", stepBody).forEach(clearFieldError);
    var step = STEPS[index];
    var first = null;
    if (step.id === "privacy" && !state.privacy) {
      showFormError("Please choose how you'd like your statement handled.");
      return $("#privacy-named");
    }
    if (step.id === "about" && S.isRequired(S.fieldById("anon_identity"), state.privacy, state.answers) && !state.answers.anon_identity) {
      var idEl = $('[data-field="anon_identity"]', stepBody);
      setFieldError(idEl, "Please choose whether Jack may know who you are.");
      first = idEl.querySelector("input");
    } else if (step.id === "about" && S.isRequired(S.fieldById("name"), state.privacy, state.answers) && !S.hasText(state.answers.name)) {
      var el = $('[data-field="name"]', stepBody);
      setFieldError(el, {
        named: "Please enter your name, or go back and choose a different privacy option.",
        confidential: "Please enter your name so Jack knows who to ask for permission, or go back and choose a different privacy option.",
        anonymous: "Please enter your name so Jack knows who submitted this, or choose “Fully anonymous”."
      }[state.privacy]);
      first = el.querySelector("input");
    }
    return first;
  }

  function showFormError(msg) {
    formError.textContent = msg;
    formError.hidden = false;
  }

  stepForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = validateStep(state.step);
    if (bad) { bad.focus(); return; }
    if (state.step < STEPS.length - 1) go("step-" + (state.step + 2));
    else go("review");
  });

  // Enter in a single-line field moves on rather than submitting the step.
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" || !e.target.matches || !e.target.matches("input.input")) return;
    e.preventDefault();
    var controls = $all("input.input, textarea, select", e.target.form || document).filter(function (c) { return !c.closest("[hidden]"); });
    var next = controls[controls.indexOf(e.target) + 1];
    if (next) next.focus(); else e.target.blur();
  });

  // ---------- Uploads ----------

  function insertUploads(container) {
    var rules = S.attachmentRules;
    var wrap = h("div", { className: "field", "data-field": "attachments" });
    wrap.appendChild(h("p", { className: "label", id: "files-label" }, "Supporting evidence", h("span", { className: "opt", text: " (optional)" })));
    wrap.appendChild(h("p", { className: "hint", text: "Screenshots, messages, photos or documents. Only upload material you are entitled to share. Please do not access, obtain or disclose confidential company material improperly — for example, please don't retrieve CCTV or use internal systems you aren't authorised to access." }));
    if (state.privacy === "anonymous") {
      wrap.appendChild(h("p", { className: "hint", text: "Files can identify you — for example names in screenshots, or location details stored in photos." }));
    }
    var input = h("input", {
      type: "file", multiple: true, id: "files-input", "aria-labelledby": "files-label",
      accept: Object.keys(rules.types).join(",") + ",.heic,.heif,.pdf"
    });
    var zone = h("label", { className: "dropzone", "for": "files-input" },
      input,
      icon("upload"),
      h("span", { className: "dropzone__title", text: "Choose files" }),
      h("span", { className: "dropzone__meta", text: "Images or PDF · up to " + rules.maxFiles + " files · " + formatBytes(rules.maxFileBytes) + " each" }));
    var list = h("ul", { className: "files", "aria-live": "polite" });
    var err = h("p", { className: "field__error", role: "alert", hidden: true });

    function addFiles(fileList) {
      err.hidden = true;
      var problems = [];
      Array.prototype.forEach.call(fileList, function (file) {
        var type = normaliseType(file);
        var total = files.reduce(function (n, f) { return n + f.file.size; }, 0);
        if (files.length >= rules.maxFiles) problems.push(file.name + ": you can attach up to " + rules.maxFiles + " files.");
        else if (!rules.types[type]) problems.push(file.name + ": only images (JPEG, PNG, WebP, HEIC) and PDFs can be attached.");
        else if (file.size === 0) problems.push(file.name + ": this file is empty.");
        else if (file.size > rules.maxFileBytes) problems.push(file.name + ": files must be " + formatBytes(rules.maxFileBytes) + " or smaller.");
        else if (total + file.size > rules.maxTotalBytes) problems.push(file.name + ": attachments must total " + formatBytes(rules.maxTotalBytes) + " or less.");
        else files.push({ id: newKey(), file: file, type: type });
      });
      if (problems.length) { err.textContent = problems.join(" "); err.hidden = false; }
      input.value = "";
      drawList();
    }
    function drawList() {
      list.innerHTML = "";
      files.forEach(function (f) {
        var remove = h("button", { type: "button", className: "btn btn--ghost btn--small", "aria-label": "Remove " + f.file.name, text: "Remove" });
        remove.addEventListener("click", function () {
          files = files.filter(function (x) { return x.id !== f.id; });
          drawList();
          input.focus();
        });
        list.appendChild(h("li", { className: "file" },
          h("span", { className: "file__name" }, f.file.name, h("span", { className: "file__meta", text: (S.attachmentRules.types[f.type] || f.type) + " · " + formatBytes(f.file.size) })),
          remove));
      });
    }
    input.addEventListener("change", function () { addFiles(input.files); });
    ["dragenter", "dragover"].forEach(function (t) { zone.addEventListener(t, function (e) { e.preventDefault(); zone.classList.add("dropzone--over"); }); });
    ["dragleave", "drop"].forEach(function (t) { zone.addEventListener(t, function () { zone.classList.remove("dropzone--over"); }); });
    zone.addEventListener("drop", function (e) { e.preventDefault(); if (e.dataTransfer) addFiles(e.dataTransfer.files); });

    append(wrap, [zone, err, list]);
    drawList();
    // Uploads sit between the evidence-basis questions and the HR question.
    var hrField = $('[data-field="hr"]', container);
    container.insertBefore(wrap, hrField);
  }

  function normaliseType(file) {
    var t = (file.type || "").toLowerCase();
    if (t === "image/jpg") t = "image/jpeg";
    if (!t) {
      var ext = (file.name.split(".").pop() || "").toLowerCase();
      t = { heic: "image/heic", heif: "image/heif", pdf: "application/pdf", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" }[ext] || "";
    }
    return t;
  }

  // ---------- Review ----------

  function displayValue(field, value) {
    if (value == null || value === "" || (Array.isArray(value) && !value.length)) return null;
    if (field.type === "checkbox") return value.map(function (v) { return "• " + S.optionLabel(field, v); }).join("\n");
    if (field.type === "radio" || field.type === "select") return S.optionLabel(field, value);
    return value;
  }

  function renderReview() {
    var body = $("[data-review-body]");
    body.innerHTML = "";

    var mode = S.privacyModes[state.privacy];
    var privacyCard = h("section", { className: "card review__section" },
      reviewHead("Privacy preference", "privacy"),
      h("div", { className: "review__privacy" }, icon(PRIVACY_ICONS[state.privacy]),
        h("div", null, h("strong", { text: mode.label }), h("span", { text: mode.description }))));
    body.appendChild(privacyCard);

    var anyAnswer = false;
    REVIEW_SECTIONS.forEach(function (sec) {
      var card = h("section", { className: "card review__section" }, reviewHead(sec.title, sec.step));
      sec.fields.forEach(function (id) {
        var f = S.fieldById(id);
        if (!S.isActive(f, state.answers, state.privacy)) return;
        var v = displayValue(f, state.answers[id]);
        if (v && sec.step !== "about" && id !== "hr" && id !== "hr_contact") anyAnswer = true;
        card.appendChild(h("div", { className: "qa" },
          h("p", { className: "qa__q", text: f.label }),
          h("p", { className: "qa__a" + (v ? "" : " qa__a--empty"), text: v || "Not answered" })));
      });
      if (sec.attachments) {
        var names = files.map(function (f) { return f.file.name + " (" + formatBytes(f.file.size) + ")"; }).join("\n");
        card.appendChild(h("div", { className: "qa" },
          h("p", { className: "qa__q", text: "Attachments" }),
          h("p", { className: "qa__a" + (names ? "" : " qa__a--empty"), text: names || "None" })));
      }
      body.appendChild(card);
    });

    if (!anyAnswer) {
      body.insertBefore(h("div", { className: "note" }, icon("info"),
        h("span", { text: "You haven't answered any of the statement questions yet. That's fine if you have nothing to add — but if you meant to, use Edit to go back." })), body.firstChild);
    }

    var decl = $("[data-declarations]");
    decl.innerHTML = "";
    var list = h("div", { className: "choices" });
    S.declarations.forEach(function (d) {
      var input = h("input", { type: "checkbox", id: "decl-" + d.id, required: true });
      input.checked = !!state.declarations[d.id];
      input.addEventListener("change", function () {
        state.declarations[d.id] = input.checked;
        save();
        $("[data-submit-error]").hidden = true;
      });
      list.appendChild(h("label", { className: "choice choice--check", "for": "decl-" + d.id }, input,
        h("span", { className: "choice__box" }, h("span", { className: "choice__dot", "aria-hidden": "true" }), h("span", { className: "choice__text", text: S.declarationLabel(d, state.privacy) }))));
    });
    decl.appendChild(list);
  }

  function reviewHead(title, stepId) {
    var btn = h("button", { type: "button", className: "btn btn--ghost", "aria-label": "Edit " + title.toLowerCase() }, "Edit");
    btn.addEventListener("click", function () {
      state.returnToReview = true; save();
      go("step-" + (stepIndex(stepId) + 1));
    });
    return h("div", { className: "review__head" }, h("h2", { className: "card__title", text: title }), btn);
  }

  function stepIndex(id) {
    for (var i = 0; i < STEPS.length; i++) if (STEPS[i].id === id) return i;
    return 0;
  }

  // ---------- Submission ----------

  function buildAnswers() {
    var out = {};
    S.fields.forEach(function (f) {
      if (!S.isActive(f, state.answers, state.privacy)) return;
      var v = state.answers[f.id];
      if (v == null) return;
      if (typeof v === "string" && !S.hasText(v)) return;
      if (f.options) {
        var allowed = f.options.filter(function (o) { return S.optionAllowed(o, state.privacy); }).map(function (o) { return o.value; });
        if (Array.isArray(v)) { v = v.filter(function (x) { return allowed.indexOf(x) !== -1; }); if (!v.length) return; }
        else if (allowed.indexOf(v) === -1) return;
      }
      out[f.id] = v; // text is sent exactly as typed
    });
    return out;
  }

  function readFile(f) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () {
        var s = String(r.result);
        resolve({ name: f.file.name, type: f.type, size: f.file.size, data: s.slice(s.indexOf(",") + 1) });
      };
      r.onerror = function () { reject(new Error("file_read")); };
      r.readAsDataURL(f.file);
    });
  }

  // Google occasionally turns a POST into a GET on its redirect, so the receiver
  // answers with its GET reply and nothing is processed. Every request carries a
  // unique key the receiver de-duplicates on, so sending it again is safe.
  function post(payload, attempt) {
    attempt = attempt || 0;
    return postOnce(payload).then(function (data) {
      if (data && data.service === "staff-statement" && !("reference" in data) && attempt < 3) {
        return new Promise(function (r) { setTimeout(r, 1200 * (attempt + 1)); }).then(function () { return post(payload, attempt + 1); });
      }
      if (data && data.service === "staff-statement") throw { kind: "bad_response" };
      return data;
    });
  }

  function postOnce(payload) {
    var controller = window.AbortController ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, TIMEOUT_MS) : null;
    return fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
      credentials: "omit",
      cache: "no-store",
      referrerPolicy: "no-referrer",
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      return res.text().then(function (text) {
        var data = null;
        try { data = JSON.parse(text); } catch (e) { /* not JSON */ }
        if (!data) throw { kind: res.ok ? "bad_response" : "http", status: res.status };
        return data;
      });
    }, function (err) {
      throw { kind: err && err.name === "AbortError" ? "timeout" : "network" };
    }).finally(function () { if (timer) clearTimeout(timer); });
  }

  var SERVER_MESSAGES = {
    invalid: "Some of the information couldn't be accepted. Please check your answers and try again.",
    too_large: "Your attachments are too large to send. Please remove one and try again.",
    bad_attachment: "One of the attachments couldn't be accepted. Please check it's an image or PDF and try again.",
    busy: "The form is receiving a lot of submissions right now. Please wait a few minutes and try again.",
    unknown_ref: "That reference wasn't recognised. Please check it and try again.",
    bad_code: "Your private link couldn't be confirmed for this statement, so this will be sent with your reference instead. Please check the reference and press Send again.",
    name_needed: "Please add your name. It's needed for a named or confidential statement.",
    integrity: "Your statement couldn't be updated automatically. Please press Send again to send this to Jack as a request.",
    rejected: "Your submission couldn't be accepted. Please try again.",
    server: "Something went wrong while saving your statement. Please try again."
  };

  function failureMessage(err) {
    if (err && err.kind === "timeout") {
      return { title: "We couldn't confirm your statement was received.", text: "It may still have arrived. Please try again — if it did arrive, you'll be given the same reference rather than creating a duplicate." };
    }
    if (err && err.kind === "network") {
      return { title: "Your statement wasn't sent.", text: "We couldn't connect to the submission service. Please check your connection and try again. Your answers are still here." };
    }
    if (err && err.kind === "not_configured") {
      return { title: "Submissions aren't switched on yet.", text: "Your answers are still here. Please let Jack know, or try again later." };
    }
    if (err && err.kind === "file_read") {
      return { title: "An attachment couldn't be read.", text: "Please remove it and add it again, then try once more." };
    }
    if (err && err.kind === "server") {
      return { title: "Your statement wasn't accepted.", text: SERVER_MESSAGES[err.code] || SERVER_MESSAGES.server };
    }
    return { title: "Your statement wasn't sent.", text: "Something went wrong. Your answers are still here — please try again." };
  }

  function showSubmitError(box, err) {
    var m = failureMessage(err);
    box.innerHTML = "";
    box.appendChild(h("strong", { text: m.title }));
    box.appendChild(document.createTextNode(m.text));
    box.hidden = false;
  }

  function setBusy(btn, labelEl, busy, busyText, idleText) {
    btn.disabled = busy;
    btn.classList.toggle("is-busy", busy);
    btn.setAttribute("aria-busy", busy ? "true" : "false");
    labelEl.textContent = busy ? busyText : idleText;
  }

  $("[data-declaration-form]").addEventListener("submit", function (e) {
    e.preventDefault();
    if (submitting) return;
    var errBox = $("[data-submit-error]");
    errBox.hidden = true;
    var missing = S.declarations.filter(function (d) { return !state.declarations[d.id]; });
    if (missing.length) {
      errBox.textContent = "Please confirm both declarations before submitting.";
      errBox.hidden = false;
      $("#decl-" + missing[0].id).focus();
      return;
    }
    if (!state.privacy) { go("step-1"); return; }

    submitting = true;
    var btn = $("[data-submit]");
    setBusy(btn, $("[data-submit-label]"), true, "Submitting…", "Submit statement");
    $("[data-action='edit-statement']").disabled = true;

    if (!state.key) { state.key = newKey(); save(); }

    Promise.resolve().then(function () {
      if (!ENDPOINT) throw { kind: "not_configured" };
      return Promise.all(files.map(readFile)).catch(function () { throw { kind: "file_read" }; });
    }).then(function (attachments) {
      return post({
        schema: S.version,
        kind: "statement",
        key: state.key,
        privacy: state.privacy,
        answers: buildAnswers(),
        declarations: { honest: true, use: true },
        attachments: attachments,
        hp: $("#hp-field").value
      });
    }).then(function (data) {
      if (!data.ok || !S.referencePattern.test(data.reference || "")) throw { kind: "server", code: data.error };
      lastResult = { reference: data.reference, receivedAt: data.receivedAt, duplicate: !!data.duplicate,
        changeCode: S.codePattern.test(data.changeCode || "") ? data.changeCode : "" };
      clearAll();
      submitting = false;
      setBusy(btn, $("[data-submit-label]"), false, "", "Submit statement");
      $("[data-action='edit-statement']").disabled = false;
      history.replaceState({ v: "done" }, "", "#done");
      render();
    }).catch(function (err) {
      submitting = false;
      setBusy(btn, $("[data-submit-label]"), false, "", "Submit statement");
      $("[data-action='edit-statement']").disabled = false;
      showSubmitError(errBox, err);
      errBox.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  });

  function renderDone() {
    if (!lastResult) return false;
    $("[data-done-ref]").textContent = lastResult.reference;
    var when = "";
    try {
      when = "Received " + new Date(lastResult.receivedAt).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/London" });
    } catch (e) { /* leave blank */ }
    $("[data-done-time]").textContent = when;
    $("[data-done-title]").textContent = lastResult.duplicate
      ? "Your statement had already been received."
      : "Your statement has been submitted successfully.";
    $("[data-link-card]").hidden = !lastResult.changeCode;
    var intro = $("[data-done-title]").nextElementSibling;
    intro.textContent = lastResult.duplicate
      ? "This is the reference for the statement we received earlier. If you changed anything since then, please use “Change or withdraw an existing statement” with this reference."
      : "Thank you for taking the time to share your experience.";
    // Load the PDF straight away so "View statement" opens it with one tap.
    prepareView($("[data-view-statement]"), $("[data-view-status]"), lastResult.reference, "View statement");
    return true;
  }

  // ---------- Correct / withdraw ----------

  // The private link carries the statement's secret code. Respondents only ever
  // see "a private link"; the code travels in the #fragment, which browsers
  // never send to the website, and is never displayed or asked for.
  function manageLink(ref, code) {
    if (!ref || !code) return "";
    return location.origin + location.pathname + "#amend?ref=" + encodeURIComponent(ref) + "&code=" + encodeURIComponent(code);
  }

  // ---------- View statement ----------
  // Fetches the statement's current readable copy (the PDF Jack would give The
  // HR Team) and points a "View statement" link at it. Opening a new tab needs
  // a direct tap, so the link only gets its address once the PDF has arrived:
  // on the completion page that happens before the first tap.

  var viewUrls = {};

  function prepareView(link, status, ref, label) {
    var cached = viewUrls[ref];
    if (cached) { setViewReady(link, status, cached, label, ref); return Promise.resolve(); }
    link.removeAttribute("href");
    link.setAttribute("aria-disabled", "true");
    link.textContent = "Preparing your statement…";
    status.textContent = "";
    status.classList.remove("view-status--error");
    return Promise.resolve().then(function () {
      if (!ENDPOINT) throw { kind: "not_configured" };
      return post({ schema: S.version, kind: "view", key: newKey(), answers: { ref: ref }, hp: "" });
    }).then(function (data) {
      if (!data.ok || typeof data.pdf !== "string") throw { kind: "server", code: data.error };
      var bin = atob(data.pdf);
      var bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      viewUrls[ref] = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      setViewReady(link, status, viewUrls[ref], label, ref);
    }).catch(function (err) {
      link.removeAttribute("aria-disabled");
      link.textContent = "View statement";
      link.setAttribute("href", "#");
      link.removeAttribute("data-ready");
      status.classList.add("view-status--error");
      status.textContent = err && err.code === "unknown_ref" ? "That reference wasn't recognised. Please check it."
        : err && err.code === "not_ready" ? "Your statement isn't ready to view yet. Please try again in a minute."
        : "Your statement couldn't be loaded just now. Please try again.";
    });
  }

  function setViewReady(link, status, url, label, ref) {
    link.setAttribute("href", url);
    link.setAttribute("data-for", ref);
    link.setAttribute("data-ready", "");
    link.removeAttribute("aria-disabled");
    link.textContent = label;
    status.classList.remove("view-status--error");
    status.textContent = "Opens the PDF of your statement, exactly as it would be shared.";
  }

  // A tap before the PDF is ready (or after an error) starts or retries loading.
  function onViewTap(e, getRef, label) {
    var link = e.currentTarget;
    if (link.hasAttribute("data-ready")) return;
    e.preventDefault();
    if (link.getAttribute("aria-disabled") === "true") return;
    var ref = getRef();
    var status = link.parentNode.querySelector("[data-view-status]");
    if (!S.referencePattern.test(ref)) {
      status.classList.add("view-status--error");
      status.textContent = "Please enter your reference first.";
      return;
    }
    prepareView(link, status, ref, label);
  }

  $("[data-view-statement]").addEventListener("click", function (e) {
    onViewTap(e, function () { return lastResult && lastResult.reference; }, "View statement");
  });

  // "y8x5q", "rw y8x5q" and "RW-Y8X5Q" all give "RW-Y8X5Q" (see S.referenceSuffix).
  function normaliseRef(v) {
    return S.normaliseReference(v);
  }

  // The secret from a private link, but only while the reference still matches it.
  function linkCode() {
    var a = state.amend;
    return a.linkCode && a.linkRef && normaliseRef(a.ref) === a.linkRef ? a.linkCode : "";
  }

  function renderAmend(params) {
    if (params && params.ref) {
      // Opened from a private link: keep its secret out of sight and out of the address bar.
      state.amend = { ref: params.ref, linkRef: params.ref, action: "privacy" };
      if (params.code) state.amend.linkCode = params.code;
      save();
      history.replaceState({ v: "amend" }, "", "#amend");
    }
    var body = $("[data-amend-body]");
    body.innerHTML = "";
    $("[data-amend-error]").hidden = true;
    body.appendChild(h("div", { className: "note note--plain", "data-link-note": true, hidden: true }, icon("info"),
      h("span", { text: "You opened this from your private link, so your request will be confirmed automatically." })));
    S.amendmentFields.forEach(function (f) {
      var el = renderField(f, state.amend, function (id, v) {
        if (v === undefined || v === "") delete state.amend[id]; else state.amend[id] = v;
        save();
        syncAmendVisibility();
      }, { prefix: "a-", required: !!f.required });
      if (f.when) el.classList.add("field--sub");
      body.appendChild(el);
      if (f.id === "ref") {
        var view = h("a", { className: "btn btn--quiet view-link", href: "#", target: "_blank", rel: "noopener", "data-amend-view": true, text: "View statement" });
        view.addEventListener("click", function (e) {
          onViewTap(e, function () { return normaliseRef(state.amend.ref); }, "Open statement (PDF)");
        });
        body.appendChild(h("div", { className: "amend-view" }, view, h("p", { className: "view-status", "data-view-status": true, "aria-live": "polite" })));
      }
    });
    syncAmendVisibility();
  }

  function syncAmendVisibility() {
    S.amendmentFields.forEach(function (f) {
      var el = $('[data-field="' + f.id + '"]', $("[data-amend-body]"));
      if (el) el.hidden = !S.isActive(f, state.amend, null);
    });
    var note = $("[data-link-note]");
    if (note) note.hidden = !linkCode();
    // A different reference needs its own statement loading.
    var view = $("[data-amend-view]");
    if (view && view.hasAttribute("data-ready") && view.getAttribute("data-for") !== normaliseRef(state.amend.ref)) {
      view.removeAttribute("data-ready");
      view.setAttribute("href", "#");
      view.textContent = "View statement";
      view.parentNode.querySelector("[data-view-status]").textContent = "";
    }
    var labels = { correct: "Send correction", privacy: "Send privacy change", withdraw: "Send withdrawal request" };
    $("[data-amend-label]").textContent = labels[state.amend.action] || "Send";
  }

  function amendError(msg, sel) {
    var errBox = $("[data-amend-error]");
    errBox.textContent = msg;
    errBox.hidden = false;
    var el = $(sel);
    if (el) el.focus();
  }

  $("[data-amend-form]").addEventListener("submit", function (e) {
    e.preventDefault();
    if (submitting) return;
    var errBox = $("[data-amend-error]");
    errBox.hidden = true;
    var a = state.amend;
    var ref = normaliseRef(a.ref);
    var code = S.codePattern.test(linkCode()) ? linkCode() : "";
    if (!S.referencePattern.test(ref)) return amendError("Please check your reference. It's the five characters after RW-, for example RW-3WARF.", "#a-ref");
    if (!a.action) return amendError("Please choose what you'd like to do.", "#a-action-0");
    if (a.action === "correct" && !S.hasText(a.detail)) return amendError("Please describe what should be corrected or added.", "#a-detail");
    if (a.action === "privacy" && !a.new_privacy) return amendError("Please choose your privacy preference from now on.", "#a-new_privacy-0");

    submitting = true;
    var btn = $("[data-amend-submit]");
    var idle = $("[data-amend-label]").textContent;
    setBusy(btn, $("[data-amend-label]"), true, "Sending…", idle);
    if (!a.key) { a.key = newKey(); save(); }
    var action = a.action;

    Promise.resolve().then(function () {
      if (!ENDPOINT) throw { kind: "not_configured" };
      var answers = { ref: ref, action: action };
      if (code) answers.code = code;
      if (action === "privacy") {
        answers.new_privacy = a.new_privacy;
        if ((a.new_privacy === "named" || a.new_privacy === "confidential") && S.hasText(a.name)) answers.name = a.name;
      }
      if (S.hasText(a.detail)) answers.detail = a.detail;
      return post({ schema: S.version, kind: "amendment", key: a.key, answers: answers, hp: $("#hp-field-2").value });
    }).then(function (data) {
      if (!data.ok) throw { kind: "server", code: data.error };
      submitting = false;
      setBusy(btn, $("[data-amend-label]"), false, "", idle);
      state.amend = {};
      save();
      // Any change may have produced a new readable copy: load it afresh next time.
      if (viewUrls[ref]) { URL.revokeObjectURL(viewUrls[ref]); delete viewUrls[ref]; }
      lastResult = { amendRef: ref, action: action, verified: !!data.verified, applied: !!data.applied, unchanged: !!data.unchanged, privacy: data.privacy || "" };
      history.replaceState({ v: "amend-done" }, "", "#amend-done");
      render();
    }).catch(function (err) {
      submitting = false;
      setBusy(btn, $("[data-amend-label]"), false, "", idle);
      if (err && err.kind === "server" && (err.code === "bad_code" || err.code === "integrity")) {
        // Fall back to sending with the reference alone on the next press.
        delete state.amend.linkCode;
        save();
        syncAmendVisibility();
      }
      showSubmitError(errBox, err);
    });
  });

  function amendDoneText(r) {
    if (r.action === "privacy") {
      if (r.unchanged) return "Your privacy preference for statement " + r.amendRef + " was already " + r.privacy + ". Nothing has changed.";
      if (r.applied) return "Your privacy preference for statement " + r.amendRef + " is now " + r.privacy + "." +
        (r.verified ? "" : " Because this only restricts who may know your identity, it has been applied straight away.") +
        " Your original statement is unchanged, and the change has been recorded alongside it.";
      return "Your request has been sent to Jack. This change would allow more people to know your identity, and it was sent with your reference rather than your private link, so nothing will change until Jack has checked with you.";
    }
    var note = r.verified ? "" : " Because it was sent with your reference rather than your private link, Jack may check with you first.";
    return r.action === "withdraw"
      ? "Your request to withdraw statement " + r.amendRef + " has been sent to Jack." + note
      : "Your correction to statement " + r.amendRef + " has been recorded alongside your original statement." + note;
  }

  // ---------- Routing ----------

  var views = $all("[data-view]");

  function show(name) {
    views.forEach(function (v) { v.hidden = v.getAttribute("data-view") !== name; });
  }

  function go(route) {
    if (!route) {
      if (location.hash) history.pushState({ v: "welcome" }, "", location.pathname + location.search);
    } else if (("#" + route) !== location.hash) {
      history.pushState({ v: route }, "", "#" + route);
    }
    render();
  }

  function render() {
    closeMenu();
    var route = (location.hash || "").replace(/^#/, "");
    var focusSel = null;

    var m = /^step-(\d+)$/.exec(route);
    if (m) {
      var idx = Math.min(Math.max(parseInt(m[1], 10) - 1, 0), STEPS.length - 1);
      if (idx > 0 && !state.privacy) { history.replaceState(null, "", "#step-1"); idx = 0; }
      state.step = idx; save();
      show("form"); renderStep(idx); focusSel = "[data-step-title]";
    } else if (route === "review") {
      if (!state.privacy) { history.replaceState(null, "", "#step-1"); return render(); }
      $("[data-submit-error]").hidden = true;
      state.returnToReview = false; save();
      show("review"); renderReview(); focusSel = "[data-review-title]";
    } else if (route === "done") {
      if (!renderDone()) { history.replaceState(null, "", location.pathname); return render(); }
      show("done"); focusSel = "[data-done-title]";
    } else if (/^amend(\?|$)/.test(route)) {
      var params = {};
      (route.split("?")[1] || "").split("&").forEach(function (kv) {
        var i = kv.indexOf("=");
        if (i > 0) params[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1));
      });
      show("amend");
      renderAmend({ ref: S.referencePattern.test(params.ref || "") ? params.ref : "", code: S.codePattern.test(params.code || "") ? params.code : "" });
      focusSel = "[data-view='amend'] .step__title";
    } else if (route === "amend-done") {
      if (!lastResult || !lastResult.amendRef) { history.replaceState(null, "", location.pathname); return render(); }
      $("[data-amend-done-title]").textContent = lastResult.action === "privacy" && !lastResult.applied && !lastResult.unchanged
        ? "Your request has been received." : (lastResult.action === "privacy" ? "Your privacy preference has been updated." : "Your request has been received.");
      if (lastResult.unchanged) $("[data-amend-done-title]").textContent = "No change was needed.";
      $("[data-amend-done-text]").textContent = amendDoneText(lastResult);
      show("amend-done"); focusSel = "[data-amend-done-title]";
    } else {
      show("welcome");
      var resume = hasProgress();
      $("[data-start-label]").textContent = resume ? "Continue your statement" : "Start statement";
      syncStartAgain(resume);
      if (route === "handling") {
        var d = $("#handling");
        d.open = true;
        requestAnimationFrame(function () { d.scrollIntoView({ block: "start" }); });
        return;
      }
    }

    window.scrollTo(0, 0);
    if (focusSel) {
      var el = $(focusSel);
      if (el) el.focus({ preventScroll: true });
    }
  }

  function syncStartAgain(resume) {
    var existing = $("[data-start-again]");
    if (existing) existing.remove();
    if (!resume) return;
    var btn = h("button", { type: "button", className: "btn btn--ghost btn--block", "data-start-again": true, text: "Start again with a blank form" });
    btn.addEventListener("click", function () {
      if (!window.confirm("Clear your answers and start again?")) return;
      clearAll();
      render();
    });
    $(".cta").insertBefore(btn, $(".cta__meta"));
  }

  window.addEventListener("popstate", render);

  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-action], [data-nav]");
    if (!t) return;
    var action = t.getAttribute("data-action");
    var nav = t.getAttribute("data-nav");
    if (nav) {
      e.preventDefault();
      go(nav === "welcome" ? "" : nav);
      return;
    }
    if (action === "start") go("step-" + (hasProgress() ? state.step + 1 : 1));
    else if (action === "back") {
      if (state.step === 0) go("");
      else go("step-" + state.step);
    } else if (action === "edit-statement") { state.returnToReview = true; save(); go("step-1"); }
    else if (action === "return-review") {
      var bad = validateStep(state.step);
      if (bad) { bad.focus(); return; }
      go("review");
    }
    else if (action === "copy-ref" || action === "copy-link") {
      var text = action === "copy-ref" ? $("[data-done-ref]").textContent
        : manageLink(lastResult && lastResult.reference, lastResult && lastResult.changeCode);
      if (navigator.clipboard && text) navigator.clipboard.writeText(text).then(function () { t.textContent = "Copied"; }, function () {});
    }
  });

  // ---------- Menu ----------

  var menuBtn = $("[data-menu-toggle]");
  var menu = $("#menu");
  function closeMenu() { menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); }
  menuBtn.addEventListener("click", function () {
    var open = menu.hidden;
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { closeMenu(); menuBtn.focus(); } });

  // Files can't be kept across a reload, so warn only when some are attached.
  window.addEventListener("beforeunload", function (e) {
    if (files.length && !submitting) { e.preventDefault(); e.returnValue = ""; }
  });

  render();
})();
