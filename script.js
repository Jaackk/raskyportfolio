const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

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

const projectModalData = {
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
const modalTriggers = document.querySelectorAll("[data-project-modal]");
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
    image.src = project.image;
    media.style.setProperty("--modal-image", `url("${project.image}")`);
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
      return `<a class="${className}" href="${link.href}"${externalAttrs}>${link.label}</a>`;
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

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openProjectModal(trigger.dataset.projectModal));
});

modalCloseTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeProjectModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProjectModal();
  }
});

const viewCounter = document.querySelector("[data-view-counter]");

if (viewCounter) {
  fetch("https://api.countapi.xyz/hit/raskyjack.com/site", {
    cache: "no-store",
    mode: "cors"
  })
    .then((response) => (response.ok ? response.json() : Promise.reject()))
    .then((data) => {
      if (typeof data.value === "number") {
        viewCounter.textContent = `Site views ${data.value.toLocaleString()}`;
      }
    })
    .catch(() => {
      viewCounter.textContent = "Site views --";
    });
}
