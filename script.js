const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

const contentBase = "/content/";

function normalizeAssetPath(path) {
  if (!path) return "";
  if (/^(https?:|mailto:|#|\/)/.test(path)) return path;
  return `/${path.replace(/^\.?\//, "")}`;
}

function setText(selector, value, root = document) {
  const element = root.querySelector(selector);
  if (element && value !== undefined) {
    element.textContent = value;
  }
}

function setHtmlText(selector, value, root = document) {
  const element = root.querySelector(selector);
  if (element && value !== undefined) {
    element.textContent = value;
  }
}

function setLink(selector, link, root = document) {
  const element = root.querySelector(selector);
  if (!element || !link) return;
  if (link.label !== undefined) element.textContent = link.label;
  if (link.href) element.setAttribute("href", normalizeAssetPath(link.href));
  if (link.external) {
    element.setAttribute("target", "_blank");
    element.setAttribute("rel", "noreferrer");
  }
}

function setImage(selector, image, root = document) {
  const element = root.querySelector(selector);
  if (!element || !image) return;
  const src = typeof image === "string" ? image : image.src;
  const alt = typeof image === "string" ? "" : image.alt;
  if (src) element.setAttribute("src", normalizeAssetPath(src));
  if (alt !== undefined) element.setAttribute("alt", alt);
}

function renderButton(link, className = "button button-light") {
  if (!link) return "";
  const target = link.external ? ' target="_blank" rel="noreferrer"' : "";
  return `<a class="${className}" href="${normalizeAssetPath(link.href || "#")}"${target}>${link.label || "Open"}</a>`;
}

function renderHighlights(items = []) {
  return items.map((item) => `<li>${item}</li>`).join("");
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealSections = document.querySelectorAll(".reveal-section");

function revealVisibleSections() {
  const trigger = window.innerHeight * 0.88;

  revealSections.forEach((section) => {
    if (section.classList.contains("is-visible")) return;
    const rect = section.getBoundingClientRect();

    if (rect.top < trigger && rect.bottom > 0) {
      section.classList.add("is-visible");
    }
  });
}

revealVisibleSections();
window.addEventListener("scroll", revealVisibleSections, { passive: true });
window.addEventListener("resize", revealVisibleSections);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const blueprintStages = document.querySelectorAll("[data-parallax]");
let blueprintFrame = null;

function updateBlueprintParallax() {
  blueprintFrame = null;

  blueprintStages.forEach((stage) => {
    const rect = stage.getBoundingClientRect();
    const progress = (rect.top - window.innerHeight / 2) / window.innerHeight;
    stage.style.setProperty("--parallax-y", `${Math.max(-10, Math.min(10, progress * -18))}px`);
  });

  updateBlueprintProgress();
}

function requestBlueprintUpdate() {
  if (blueprintFrame || reduceMotion) return;
  blueprintFrame = window.requestAnimationFrame(updateBlueprintParallax);
}

if (blueprintStages.length && !reduceMotion) {
  window.addEventListener("scroll", requestBlueprintUpdate, { passive: true });
  window.addEventListener("resize", requestBlueprintUpdate);
}

const blueprintDrawStages = document.querySelectorAll("[data-blueprint]");

function updateBlueprintProgress() {
  blueprintDrawStages.forEach((stage) => {
    const paths = stage.querySelectorAll("[data-blueprint-line]");
    if (!paths.length) return;

    const rect = stage.getBoundingClientRect();
    const start = window.innerHeight * 0.58;
    const end = -rect.height * 0.28;
    const rawProgress = (start - rect.top) / (start - end);
    const progress = Math.max(0, Math.min(1, rawProgress));

    paths.forEach((path) => {
      const length = Number(path.dataset.blueprintLength || 0);
      path.style.strokeDashoffset = String(length * (1 - progress));
    });
  });
}

function prepareBlueprintStage(stage) {
  const src = stage.dataset.blueprintSrc;
  if (!src || reduceMotion) return;

  fetch(src)
    .then((response) => (response.ok ? response.text() : Promise.reject()))
    .then((svgText) => {
      const parser = new DOMParser();
      const svg = parser.parseFromString(svgText, "image/svg+xml").querySelector("svg");
      if (!svg) return;

      svg.classList.add("blueprint-svg");
      svg.setAttribute("aria-hidden", "true");
      stage.append(svg);
      stage.classList.add("is-blueprint-ready");

      const drawable = svg.querySelectorAll("path, line, polyline, polygon, rect, circle, ellipse");
      drawable.forEach((shape) => {
        if (typeof shape.getTotalLength !== "function") return;
        const length = Math.ceil(shape.getTotalLength());
        shape.dataset.blueprintLine = "true";
        shape.dataset.blueprintLength = String(length);
        shape.style.strokeDasharray = String(length);
        shape.style.strokeDashoffset = String(length);
      });

      updateBlueprintProgress();
    })
    .catch(() => {});
}

blueprintDrawStages.forEach(prepareBlueprintStage);
requestBlueprintUpdate();

let projectModalData = {
  motiondesk: {
    kicker: "Motion Desk",
    title: "Creator workspace for organised output.",
    image: "assets/optimized/motiondesk-screenshot.jpg",
    alt: "Motion Desk interface screenshot",
    description:
      "Motion Desk explores how creators can manage assets, campaign ideas, planning, analytics and release activity in one calmer workspace.",
    highlights: [
      "Asset management and project organisation",
      "Planning views for campaigns, ideas and releases",
      "Analytics-led thinking for creative workflow"
    ],
    links: [{ label: "Visit Website", href: "/motiondesk/" }]
  },
  sportspredict: {
    kicker: "SportsPredict / TennisPredict",
    title: "Prediction thinking, built into a product shape.",
    image: "assets/optimized/tennispredict-mockup.jpg",
    alt: "SportsPredict tennis analytics mockup",
    description:
      "A sports prediction prototype focused on tennis and data-driven decision making. It shows model thinking, interface structure and practical product problem solving.",
    highlights: [
      "Prediction and analysis workflows",
      "Sports data and model-led thinking",
      "Clear product framing for a complex category"
    ],
    links: [{ label: "Open Project Page", href: "/sportspredict/" }]
  },
  "creative-studio": {
    kicker: "Creative Studio",
    title: "Brands, websites, hospitality tools and creative products.",
    image: "assets/optimized/brand-restaurant-set.jpg",
    alt: "Premium restaurant branding and website work",
    description:
      "Creative Studio brings together brand identity, website design, hospitality software concepts, client-style projects and visual experiments. Perfect Host and Rockwater Preorders live here as practical hospitality tools, while EtsyCalc remains its own product.",
    highlights: [
      "Brand identity, menus and visual presentation",
      "Perfect Host floor-planning and service workflow concept",
      "Rockwater Preorders working hospitality preorder website"
    ],
    links: [
      { label: "Open Project Page", href: "/design/" },
      { label: "Open Perfect Host Page", href: "/perfecthost/" },
      { label: "Open Mobile Prototype", href: "/perfecthost-demo/" },
      { label: "Visit Website", href: "/rockwaterpreorders/" }
    ],
    note: "Perfect Host prototype is best experienced on mobile."
  },
  etsycalc: {
    kicker: "EtsyCalc",
    title: "Useful tools for real business decisions.",
    image: "assets/optimized/etsycalc-screenshot.jpg",
    alt: "EtsyCalc interface screenshot",
    description:
      "EtsyCalc is a practical web tool for sellers who need clearer pricing, fee awareness and confidence before listing products.",
    highlights: [
      "Clear utility for a real seller problem",
      "Pricing, fees and business thinking",
      "Simple interface designed for repeat use"
    ],
    links: [{ label: "Visit Website", href: "/etsycalc/" }]
  },
  shnork: {
    kicker: "In the Shadow of a Shnork",
    title: "Novel, worldbuilding and creative IP.",
    image: "assets/optimized/shnork-cover.jpg",
    alt: "In the Shadow of a Shnork cover artwork",
    description:
      "Shnork began as a fantasy novel and has expanded into artwork, worldbuilding, visual systems and Unity prototype material. It is a serious long-term creative world rather than a finished game claim.",
    highlights: [
      "Novel and long-term creative universe",
      "Worldbuilding, characters and atmosphere",
      "Artwork and early Unity prototype thinking"
    ],
    links: [
      { label: "Open Project Page", href: "/shnork/" },
      { label: "Read Preview", href: "/assets/docs/in-the-shadow-of-a-shnork-preview.pdf", external: true }
    ]
  },
  raskode: {
    kicker: "Raskode",
    title: "Personal AI development, kept grounded.",
    image: "",
    alt: "",
    description:
      "Raskode is an in-progress personal AI development project exploring automation, memory systems, faster learning and productivity. It is a practical research lane, not a finished commercial product.",
    highlights: [
      "AI-assisted development and automation experiments",
      "Memory and context systems for personal workflow",
      "Learning faster by turning ideas into prototypes"
    ],
    links: [{ label: "Open Project Page", href: "/raskode/" }]
  }
};

const transparentPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const modalShell = document.querySelector("[data-project-modal-shell]");
const modalPanel = document.querySelector(".project-modal__panel");
const modalCloseTriggers = document.querySelectorAll("[data-project-modal-close]");
let lastFocusedElement = null;

function setModalContent(project) {
  const image = modalShell.querySelector("[data-project-modal-image]");
  const media = modalShell.querySelector(".project-modal__media");
  modalShell.querySelector("[data-project-modal-kicker]").textContent = project.kicker;
  modalShell.querySelector("[data-project-modal-title]").textContent = project.title;
  modalShell.querySelector("[data-project-modal-description]").textContent = project.description;
  image.alt = project.alt || "";
  if (project.image) {
    const imageSrc = normalizeAssetPath(project.image);
    image.src = imageSrc;
    media.style.setProperty("--modal-image", `url("${imageSrc}")`);
    image.parentElement.style.display = "";
  } else {
    image.src = transparentPixel;
    media.style.removeProperty("--modal-image");
    image.parentElement.style.display = "none";
  }

  const highlights = modalShell.querySelector("[data-project-modal-highlights]");
  highlights.innerHTML = project.highlights.map((item) => `<li>${item}</li>`).join("");

  const links = modalShell.querySelector("[data-project-modal-links]");
  links.innerHTML = project.links
    .map((link, index) => {
      const externalAttrs = link.external ? ' target="_blank" rel="noreferrer"' : "";
      const className = index === 0 ? "button button-dark" : "button button-light";
      return `<a class="${className}" href="${normalizeAssetPath(link.href)}"${externalAttrs}>${link.label}</a>`;
    })
    .join("");

  const note = modalShell.querySelector("[data-project-modal-note]");
  note.textContent = project.note || "";
  note.hidden = !project.note;
}

function openProjectModal(projectKey) {
  const project = projectModalData[projectKey];
  if (!project || !modalShell) return;

  lastFocusedElement = document.activeElement;
  setModalContent(project);
  modalShell.hidden = false;
  document.body.classList.add("modal-open");
  modalPanel.focus();
}

function closeProjectModal() {
  if (!modalShell || modalShell.hidden) return;

  modalShell.hidden = true;
  document.body.classList.remove("modal-open");

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

function bindProjectModalTriggers() {
  document.querySelectorAll("[data-project-modal]").forEach((trigger) => {
    if (trigger.dataset.modalBound === "true") return;
    trigger.dataset.modalBound = "true";
    trigger.addEventListener("click", () => openProjectModal(trigger.dataset.projectModal));
  });
}

bindProjectModalTriggers();

modalCloseTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeProjectModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProjectModal();
  }
});

const viewCounter = document.querySelector("[data-view-counter]");
let viewCounterLabel = "Site views";

if (viewCounter) {
  fetch("https://api.countapi.xyz/hit/raskyjack.com/site", {
    cache: "no-store",
    mode: "cors"
  })
    .then((response) => (response.ok ? response.json() : Promise.reject()))
    .then((data) => {
      if (typeof data.value === "number") {
        viewCounter.textContent = `${viewCounterLabel} ${data.value.toLocaleString()}`;
      }
    })
    .catch(() => {
      viewCounter.textContent = `${viewCounterLabel} --`;
    });
}

function applySiteSettings(site) {
  if (!site) return;
  if (site.title) document.title = site.title;
  if (site.description) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", site.description);
  }
  document.querySelectorAll(".site-footer .wordmark").forEach((el) => {
    if (site.brand) el.textContent = site.brand;
  });
  document.querySelectorAll(".site-footer a[href^='mailto:']").forEach((el) => {
    if (site.contactEmail) {
      el.textContent = site.contactEmail;
      el.setAttribute("href", `mailto:${site.contactEmail}`);
    }
  });
  document.querySelectorAll(".contact-form").forEach((form) => {
    if (site.contactEmail) form.setAttribute("action", `mailto:${site.contactEmail}`);
  });
  if (site.footerLinks?.length) {
    const footerLinks = [...document.querySelectorAll(".site-footer a:not([href^='mailto:'])")];
    site.footerLinks.forEach((link, index) => {
      if (!footerLinks[index]) return;
      footerLinks[index].textContent = link.label;
      footerLinks[index].setAttribute("href", normalizeAssetPath(link.href));
    });
  }
  if (site.viewCounterLabel) {
    viewCounterLabel = site.viewCounterLabel;
    if (viewCounter && viewCounter.textContent.includes("--")) {
      viewCounter.textContent = `${viewCounterLabel} --`;
    }
  }
}

function applyHomepageContent(homepage) {
  if (!homepage || !document.querySelector(".hero")) return;
  setText(".hero-copy .eyebrow", homepage.hero?.label);
  setText(".hero-copy h1", homepage.hero?.headline);
  setText(".hero-copy .lead", homepage.hero?.body);
  setLink(".hero-copy .button-row a:nth-child(1)", homepage.hero?.primaryButton);
  setLink(".hero-copy .button-row a:nth-child(2)", homepage.hero?.secondaryButton);

  (homepage.hero?.cards || []).forEach((card, index) => {
    const element = document.querySelectorAll(".hero-collage .float-card")[index];
    if (!element) return;
    if (card.link) element.setAttribute("href", normalizeAssetPath(card.link));
    setImage("img", card.image, element);
    setText("span", card.title, element);
    setText("small", card.label, element);
  });

  (homepage.coreVentures || []).forEach((venture, index) => {
    const element = document.querySelectorAll(".venture-card")[index];
    if (!element) return;
    if (venture.link) element.setAttribute("href", normalizeAssetPath(venture.link));
    setImage("img", venture.image, element);
    setText("h2", venture.title, element);
    setHtmlText("p", venture.description, element);
    setText(".venture-link", venture.buttonLabel, element);
  });

  setText("#contact h2", homepage.contact?.headline);
  setText("#contact p", homepage.contact?.body);
  setText(".contact-form button", homepage.contact?.buttonLabel);
}

function applyRaskysContent(raskys) {
  if (!raskys) return;
  setText("#hospitality .split-copy .eyebrow", raskys.label);
  setText("#hospitality .split-copy h2", raskys.headline);
  setText("#hospitality .split-copy p", raskys.description);
  setLink("#hospitality .split-copy .button", raskys.button);
  const stage = document.querySelector("#hospitality [data-blueprint]");
  if (stage && raskys.blueprintImage?.src) {
    const src = normalizeAssetPath(raskys.blueprintImage.src);
    stage.dataset.blueprintSrc = src;
    setImage("img", raskys.blueprintImage, stage);
  }
  (raskys.concepts || []).forEach((concept, index) => {
    const card = document.querySelectorAll("#hospitality .concept-grid article")[index];
    if (!card) return;
    setText("h3", concept.title, card);
    setText("p", concept.description, card);
  });
  setText("#vision h3", raskys.vision?.title);
  setText("#vision p", raskys.vision?.description);
  setText("#vision blockquote", raskys.vision?.quote);
  (raskys.vision?.images || []).forEach((image, index) => {
    const img = document.querySelectorAll("#vision .vision-gallery img")[index];
    if (!img) return;
    setImage("", image, { querySelector: () => img });
  });

  if (document.body.contains(document.querySelector(".page-hero")) && location.pathname.includes("/raskys")) {
    setText(".page-hero .eyebrow", raskys.label);
    setText(".page-hero h1", raskys.pageHeadline || raskys.headline);
    setText(".page-hero .lead", raskys.pageDescription || raskys.description);
    setLink(".page-hero .button-row a:nth-child(1)", raskys.pagePrimaryButton);
    setLink(".page-hero .button-row a:nth-child(2)", raskys.businessPlanButton);
  }
}

function applyMusicContent(music) {
  if (!music || !document.querySelector("#music")) return;
  setText("#music .split-copy .eyebrow", music.label);
  setText("#music .split-copy h2", music.headline);
  setText("#music .split-copy p", music.description);
  setLink("#music .split-copy .button-row a:nth-child(1)", music.primaryButton);
  setLink("#music .split-copy .button-row a:nth-child(2)", music.secondaryButton);
  if (music.featuredRelease) {
    setImage(".featured-release img", music.featuredRelease.image);
    setText(".featured-release h3", music.featuredRelease.title);
    setText(".featured-release p", music.featuredRelease.subtitle);
  }
  setText(".releases .section-label", music.discographyLabel);
  setText(".releases h3", music.discographyTitle);
  setLink(".releases .section-heading-row a", music.allMusicLink);
  const grid = document.querySelector(".release-grid");
  if (grid && Array.isArray(music.releases)) {
    grid.innerHTML = music.releases
      .map((release) => `
        <a href="${normalizeAssetPath(release.link || "#")}"${release.external ? ' target="_blank" rel="noreferrer"' : ""}>
          <img src="${normalizeAssetPath(release.image?.src || release.image || "")}" alt="${release.image?.alt || `${release.title} album artwork`}" />
          <h4>${release.title}</h4>
          <p>${release.subtitle || "Raskyjack"}</p>
        </a>
      `)
      .join("");
  }
}

function renderProductsProjects(projects) {
  if (!projects?.cards || !document.querySelector(".ordered-work")) return;
  const grid = document.querySelector(".ordered-work");
  grid.innerHTML = projects.cards
    .map((project) => {
      const media = project.image?.src
        ? `<img src="${normalizeAssetPath(project.image.src)}" alt="${project.image.alt || `${project.title} preview`}" />`
        : '<div class="raskode-visual" aria-hidden="true"></div>';
      const body = `
        ${media}
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <span class="work-card-link">${project.buttonLabel || "View Project"}</span>
      `;
      if (project.modalKey) {
        return `<button class="work-card" type="button" data-project-modal="${project.modalKey}">${body}</button>`;
      }
      return `<a class="work-card" href="${normalizeAssetPath(project.link || "#")}">${body}</a>`;
    })
    .join("");

  if (projects.modals) {
    projectModalData = { ...projectModalData, ...projects.modals };
  }
  bindProjectModalTriggers();
}

function applyDocumentsContent(documents) {
  if (!documents) return;
  const cv = documents.cvPdf;
  if (cv) document.querySelectorAll(".about-cv-button").forEach((link) => link.setAttribute("href", normalizeAssetPath(cv)));
  if (documents.raskysBusinessPlanPdf) {
    document.querySelectorAll('a[href$="raskys-business-plan.pdf"]').forEach((link) => {
      link.setAttribute("href", normalizeAssetPath(documents.raskysBusinessPlanPdf));
    });
  }
  if (documents.shnorkPreviewPdf) {
    document.querySelectorAll('a[href$="in-the-shadow-of-a-shnork-preview.pdf"]').forEach((link) => {
      link.setAttribute("href", normalizeAssetPath(documents.shnorkPreviewPdf));
    });
  }
}

function applyCreativeStudioContent(content) {
  if (!content || !location.pathname.includes("/design")) return;
  setText(".page-hero .eyebrow", content.hero?.label);
  setText(".page-hero h1", content.hero?.headline);
  setText(".page-hero .lead", content.hero?.body);
  setLink(".page-hero .button-row a:nth-child(1)", content.hero?.primaryButton);
  setLink(".page-hero .button-row a:nth-child(2)", content.hero?.secondaryButton);
  setImage(".page-visual img", content.hero?.image);

  (content.sections || []).forEach((section, index) => {
    const card = document.querySelectorAll(".studio-showcase")[index];
    if (!card) return;
    setText(".eyebrow", section.label, card);
    setText("h2", section.title, card);
    const paragraph = [...card.querySelectorAll("p")].find((p) => !p.classList.contains("eyebrow") && !p.classList.contains("future-link"));
    if (paragraph && section.description) paragraph.textContent = section.description;
    const note = card.querySelector(".future-link");
    if (note && section.note !== undefined) note.textContent = section.note;
    const highlights = card.querySelector(".highlight-list");
    if (highlights && section.highlights) highlights.innerHTML = renderHighlights(section.highlights);
    (section.images || []).forEach((image, imageIndex) => {
      const img = card.querySelectorAll("img")[imageIndex];
      if (img) setImage("", image, { querySelector: () => img });
    });
    const row = card.querySelector(".button-row");
    if (row && section.buttons) {
      row.innerHTML = section.buttons.map((button, buttonIndex) => renderButton(button, buttonIndex === 0 ? "button button-dark" : "button button-light")).join("");
    }
  });
}

async function loadJson(path) {
  const response = await fetch(`${contentBase}${path}`, { cache: "no-store" });
  if (!response.ok) throw new Error(path);
  return response.json();
}

async function loadEditableContent() {
  try {
    const [site, homepage, raskys, music, projects, creativeStudio, documents] = await Promise.all([
      loadJson("site.json"),
      loadJson("homepage.json"),
      loadJson("raskys.json"),
      loadJson("music.json"),
      loadJson("projects.json"),
      loadJson("creative-studio.json"),
      loadJson("documents.json")
    ]);
    applySiteSettings(site);
    applyHomepageContent(homepage);
    applyRaskysContent(raskys);
    applyMusicContent(music);
    renderProductsProjects(projects);
    applyCreativeStudioContent(creativeStudio);
    applyDocumentsContent(documents);
  } catch (error) {
    // Keep the static HTML fallback if editable content is unavailable.
  }
}

loadEditableContent();
