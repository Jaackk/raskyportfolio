const data = window.RASKY_SITE_DATA;

const heroStrip = document.querySelector("#hero-strip");
const identityStrip = document.querySelector("#identity-strip");
const pillarList = document.querySelector("#pillar-list");
const venuePillars = document.querySelector("#venue-pillars");
const trackList = document.querySelector("#track-list");
const musicLinks = document.querySelector("#music-links");
const projectGrid = document.querySelector("#project-grid");
const strengthGrid = document.querySelector("#strength-grid");

function linkAttrs(link) {
  if (!link) return "";
  if (link.startsWith("#")) return `href="${link}"`;
  return `href="${link}" target="_blank" rel="noreferrer"`;
}

heroStrip.innerHTML = data.heroPanels
  .map(
    (panel, index) => `
      <article class="hero-panel ${index === 0 ? "active" : ""}">
        <img src="${panel.image}" alt="${panel.alt}" loading="${index < 2 ? "eager" : "lazy"}" />
        <span>${panel.title}</span>
      </article>
    `
  )
  .join("");

identityStrip.innerHTML = data.identity.map((item) => `<span>${item}</span>`).join("");

pillarList.innerHTML = data.pillars
  .map(
    (pillar) => `
      <article class="small-pillar reveal">
        <h3>${pillar.title}</h3>
        <p>${pillar.text}</p>
      </article>
    `
  )
  .join("");

venuePillars.innerHTML = data.venuePillars.map((item) => `<li>${item}</li>`).join("");

trackList.innerHTML = data.musicTracks
  .map(([num, title, duration]) => `<div><span>${num}</span><strong>${title}</strong><em>${duration}</em></div>`)
  .join("");

musicLinks.innerHTML = data.musicLinks
  .map(([label, link]) => `<a ${linkAttrs(link)}>${label}</a>`)
  .join("");

function projectImage(project) {
  if (project.image) {
    return `<img src="${project.image}" alt="${project.alt}" loading="lazy" />`;
  }

  return `
    <div class="code-card" aria-label="${project.title} concept visual">
      <span>Raskode</span>
      <code>idea.capture()</code>
      <code>context.map()</code>
      <code>prototype.next()</code>
    </div>
  `;
}

projectGrid.innerHTML = data.projects
  .map((project) => {
    const linked = Boolean(project.link);
    const tag = linked ? "a" : "article";
    const attrs = linked ? `class="project-card reveal" ${linkAttrs(project.link)}` : `class="project-card reveal"`;
    return `
      <${tag} ${attrs}>
        <div class="project-thumb">${projectImage(project)}</div>
        <div class="project-copy">
          <div class="project-meta"><span>${project.category}</span><span>${project.status}</span></div>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
        </div>
      </${tag}>
    `;
  })
  .join("");

strengthGrid.innerHTML = data.strengths
  .map(
    (strength) => `
      <article class="strength-card reveal">
        <h3>${strength.title}</h3>
        <p>${strength.text}</p>
      </article>
    `
  )
  .join("");

let activePanel = 0;
const panels = [...document.querySelectorAll(".hero-panel")];

function setPanel(nextIndex) {
  activePanel = (nextIndex + panels.length) % panels.length;
  panels.forEach((panel, index) => panel.classList.toggle("active", index === activePanel));
  const panel = panels[activePanel];
  const target =
    panel.offsetLeft - heroStrip.clientWidth / 2 + panel.clientWidth / 2;
  heroStrip.scrollTo({ left: target, behavior: "smooth" });
}

document.querySelector(".strip-prev").addEventListener("click", () => setPanel(activePanel - 1));
document.querySelector(".strip-next").addEventListener("click", () => setPanel(activePanel + 1));

let autoAdvance = window.setInterval(() => setPanel(activePanel + 1), 4500);
heroStrip.addEventListener("pointerenter", () => window.clearInterval(autoAdvance));
heroStrip.addEventListener("pointerleave", () => {
  autoAdvance = window.setInterval(() => setPanel(activePanel + 1), 4500);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
