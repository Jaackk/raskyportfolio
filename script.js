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

const blueprintStage = document.querySelector("[data-parallax]");

if (blueprintStage && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.addEventListener(
    "scroll",
    () => {
      const rect = blueprintStage.getBoundingClientRect();
      const progress = (rect.top - window.innerHeight / 2) / window.innerHeight;
      blueprintStage.style.setProperty("--parallax-y", `${Math.max(-10, Math.min(10, progress * -18))}px`);
    },
    { passive: true }
  );
}
