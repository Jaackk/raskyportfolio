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

if (blueprintStages.length && !reduceMotion) {
  window.addEventListener(
    "scroll",
    () => {
      blueprintStages.forEach((stage) => {
        const rect = stage.getBoundingClientRect();
        const progress = (rect.top - window.innerHeight / 2) / window.innerHeight;
        stage.style.setProperty("--parallax-y", `${Math.max(-10, Math.min(10, progress * -18))}px`);
      });
    },
    { passive: true }
  );
}

const blueprintDrawStages = document.querySelectorAll("[data-blueprint]");

function updateBlueprintProgress() {
  blueprintDrawStages.forEach((stage) => {
    const paths = stage.querySelectorAll("[data-blueprint-line]");
    if (!paths.length) return;

    const rect = stage.getBoundingClientRect();
    const rawProgress = 1 - rect.top / (window.innerHeight * 0.86);
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
window.addEventListener("scroll", updateBlueprintProgress, { passive: true });
window.addEventListener("resize", updateBlueprintProgress);

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
