const data = window.RASKY_SITE_DATA;

const projectGrid = document.querySelector("#project-grid");
const cocktailGrid = document.querySelector("#cocktail-grid");
const whyGrid = document.querySelector("#why-grid");
const capabilityGrid = document.querySelector("#capability-grid");
const timeline = document.querySelector("#timeline");
const musicLinks = document.querySelector("#music-links");

function externalHref(value) {
  if (!value) return "";
  if (value.startsWith("#")) return value;
  return `https://${value}`;
}

function projectVisual(project) {
  if (project.image) {
    return `<img src="${project.image}" alt="${project.alt}" loading="lazy" />`;
  }

  const label = project.visual === "motion" ? "Motion Desk" : project.visual === "calculator" ? "EtsyCalc" : "Raskode";
  const rows =
    project.visual === "calculator"
      ? ["Sale price", "Fees", "Costs", "Net profit"]
      : project.visual === "raskode"
        ? ["Idea capture", "Prompt stack", "Build notes", "Next action"]
        : ["Assets", "Campaigns", "Planning", "Insights"];

  return `
    <div class="mock-window ${project.visual || "default"}" aria-label="${label} interface placeholder">
      <div class="mock-bar"><span></span><span></span><span></span></div>
      <strong>${label}</strong>
      <div class="mock-lines">
        ${rows.map((row) => `<span>${row}</span>`).join("")}
      </div>
    </div>
  `;
}

projectGrid.innerHTML = data.projects
  .map((project) => {
    const href = externalHref(project.link);
    const link = href
      ? `<a class="project-link" href="${href}" ${href.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>Open / view</a>`
      : `<span class="project-link muted">Asset-led concept</span>`;

    return `
      <article class="project-card reveal">
        <div class="project-media">${projectVisual(project)}</div>
        <div class="project-body">
          <div class="project-meta">
            <span>${project.category}</span>
            <span>${project.status}</span>
          </div>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="tag-row">
            ${project.strengths.map((item) => `<span>${item}</span>`).join("")}
          </div>
          ${link}
        </div>
      </article>
    `;
  })
  .join("");

cocktailGrid.innerHTML = data.cocktails
  .map(
    (name, index) => `
      <article class="cocktail-card reveal">
        <span>0${index + 1}</span>
        <h4>${name}</h4>
        <p>Signature-name direction for a coastal menu with personality, quality and a clear Raskys tone.</p>
      </article>
    `
  )
  .join("");

whyGrid.innerHTML = data.why
  .map(
    (item) => `
      <article class="why-card reveal">
        <span></span>
        <p>${item}</p>
      </article>
    `
  )
  .join("");

capabilityGrid.innerHTML = data.capabilities
  .map(
    ([abbr, label]) => `
      <article class="capability-card reveal">
        <span>${abbr}</span>
        <p>${label}</p>
      </article>
    `
  )
  .join("");

timeline.innerHTML = data.timeline
  .map(
    ([title, text]) => `
      <article class="timeline-item reveal">
        <h3>${title}</h3>
        <p>${text}</p>
      </article>
    `
  )
  .join("");

musicLinks.innerHTML = data.musicLinks
  .map(([label, href]) => `<a href="${href}" aria-label="${label} placeholder link">${label}</a>`)
  .join("");

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
