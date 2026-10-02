/* raskyjack.com - shared script for the main site (not used by /music/). */
(() => {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------------
     Header: solid after scrolling, hides on scroll down, light on dark rooms
     ---------------------------------------------------------------------- */
  const header = doc.querySelector("[data-header]");
  const darkRooms = [...doc.querySelectorAll("[data-dark], [data-dark-hero]")];
  let lastY = window.scrollY;
  let headerFrame = null;

  function updateHeader() {
    headerFrame = null;
    if (!header) return;
    const y = window.scrollY;
    header.classList.toggle("is-solid", y > 24);
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (y > 320 && goingDown && !doc.body.classList.contains("menu-open")) header.classList.add("is-hidden");
    if (goingUp || y < 320) header.classList.remove("is-hidden");
    lastY = y;

    const probe = header.offsetHeight / 2;
    const onDark = darkRooms.some((room) => {
      const rect = room.getBoundingClientRect();
      return rect.top <= probe && rect.bottom >= probe;
    });
    header.classList.toggle("on-dark-zone", Boolean(onDark));
  }

  function requestHeader() {
    if (!headerFrame) headerFrame = window.requestAnimationFrame(updateHeader);
  }

  if (header) {
    updateHeader();
    window.addEventListener("scroll", requestHeader, { passive: true });
    window.addEventListener("resize", requestHeader);
  }

  /* ----------------------------------------------------------------------
     Mobile menu sheet
     ---------------------------------------------------------------------- */
  const menu = doc.querySelector("[data-menu]");
  const menuOpen = doc.querySelector("[data-menu-open]");
  const menuClose = doc.querySelector("[data-menu-close]");

  function setMenu(open) {
    if (!menu || !menuOpen) return;
    menu.classList.toggle("is-open", open);
    doc.body.classList.toggle("menu-open", open);
    menuOpen.setAttribute("aria-expanded", String(open));
    if (open) {
      header?.classList.remove("is-hidden");
      (menu.querySelector("ol a") || menuClose)?.focus({ preventScroll: true });
    } else {
      menuOpen.focus({ preventScroll: true });
    }
  }

  if (menu && menuOpen) {
    menu.setAttribute("aria-hidden", "true");
    menuOpen.addEventListener("click", () => {
      menu.removeAttribute("aria-hidden");
      setMenu(true);
    });
    menuClose?.addEventListener("click", () => {
      setMenu(false);
      menu.setAttribute("aria-hidden", "true");
    });
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        doc.body.classList.remove("menu-open");
        menuOpen.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-hidden", "true");
      });
    });
    menu.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenu(false);
        menu.setAttribute("aria-hidden", "true");
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...menu.querySelectorAll("a, button")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    window.matchMedia("(min-width: 861px)").addEventListener("change", (event) => {
      if (event.matches && menu.classList.contains("is-open")) {
        setMenu(false);
        menu.setAttribute("aria-hidden", "true");
      }
    });
  }

  /* ----------------------------------------------------------------------
     Active nav link for the room in view (homepage)
     ---------------------------------------------------------------------- */
  const navLinks = [...doc.querySelectorAll('.nav a[href^="#"]')];
  if (navLinks.length && "IntersectionObserver" in window) {
    const byId = new Map(navLinks.map((link) => [link.getAttribute("href").slice(1), link]));
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = byId.get(entry.target.id);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((other) => other.classList.toggle("is-active", other === link));
          } else if (link.classList.contains("is-active")) {
            link.classList.remove("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    byId.forEach((_, id) => {
      const section = doc.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  /* ----------------------------------------------------------------------
     Gentle reveals (content stays visible without JS / with reduced motion)
     ---------------------------------------------------------------------- */
  const revealItems = doc.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-in"));
  } else {
    const revealer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealItems.forEach((item) => revealer.observe(item));
  }

  /* ----------------------------------------------------------------------
     Release previews (real audio where available, otherwise a short sketch)
     ---------------------------------------------------------------------- */
  let audioContext = null;
  let active = null;

  const sketches = {
    illusions: [196, 247, 294, 370, 330, 247],
    suffolk: [164, 196, 220, 247, 220, 196],
    sunburst: [220, 277, 330, 415, 370, 330],
    "brick-by-brick": [147, 185, 220, 277, 220, 185]
  };

  function stopActive() {
    if (!active) return;
    if (active.audio) {
      active.audio.pause();
      active.audio.removeAttribute("src");
      active.audio.load();
    }
    (active.nodes || []).forEach((node) => {
      try {
        node.stop();
      } catch (error) {
        /* already stopped */
      }
    });
    if (active.frame) window.cancelAnimationFrame(active.frame);
    active.card.classList.remove("is-playing");
    active.card.style.setProperty("--demo-progress", "0");
    const label = active.card.querySelector(".release-play-label");
    if (label) label.textContent = "Preview";
    active = null;
  }

  function markPlaying(card) {
    card.classList.add("is-playing");
    const label = card.querySelector(".release-play-label");
    if (label) label.textContent = "Stop";
  }

  function playSketch(card) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    audioContext = audioContext || new Ctx();
    if (audioContext.state === "suspended") audioContext.resume();
    const now = audioContext.currentTime;
    const duration = 7.2;
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.075, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    const nodes = (sketches[card.dataset.demoRelease] || sketches.illusions).map((frequency, index) => {
      const osc = audioContext.createOscillator();
      osc.type = index % 2 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(frequency, now + index * 0.42);
      osc.connect(filter);
      osc.start(now + index * 0.42);
      osc.stop(now + duration);
      return osc;
    });
    markPlaying(card);
    active = { card, nodes, frame: null };
    const tick = () => {
      if (!active || active.card !== card) return;
      const progress = Math.min(1, (audioContext.currentTime - now) / duration);
      card.style.setProperty("--demo-progress", String(progress));
      if (progress >= 1) return stopActive();
      active.frame = window.requestAnimationFrame(tick);
    };
    active.frame = window.requestAnimationFrame(tick);
  }

  function playAudio(card, src) {
    const audio = new Audio(src);
    markPlaying(card);
    active = { card, audio, frame: null };
    const tick = () => {
      if (!active || active.audio !== audio) return;
      const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 1;
      card.style.setProperty("--demo-progress", String(Math.min(1, audio.currentTime / duration)));
      active.frame = window.requestAnimationFrame(tick);
    };
    audio.addEventListener("ended", stopActive, { once: true });
    audio
      .play()
      .then(() => {
        if (active?.audio === audio) active.frame = window.requestAnimationFrame(tick);
      })
      .catch(() => {
        if (active?.audio !== audio) return;
        stopActive();
        playSketch(card);
      });
  }

  function bindReleases() {
    doc.querySelectorAll("[data-demo-release]").forEach((card) => {
      if (card.dataset.bound) return;
      card.dataset.bound = "1";
      const trigger = card.querySelector("button.release-art");
      if (!trigger) return;
      trigger.addEventListener("click", () => {
        if (active?.card === card) return stopActive();
        stopActive();
        if (card.dataset.audioSrc) playAudio(card, card.dataset.audioSrc);
        else playSketch(card);
      });
    });
  }
  bindReleases();

  /* ----------------------------------------------------------------------
     Image lightbox ([data-lightbox-src])
     ---------------------------------------------------------------------- */
  let lightbox = null;
  let lightboxReturn = null;

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.remove();
    lightbox = null;
    doc.body.classList.remove("menu-open");
    lightboxReturn?.focus({ preventScroll: true });
  }

  function openLightbox(src, alt) {
    closeLightbox();
    lightboxReturn = doc.activeElement;
    lightbox = doc.createElement("div");
    lightbox.className = "image-lightbox";
    lightbox.innerHTML =
      '<button class="image-lightbox__backdrop" type="button" aria-label="Close image"></button>' +
      '<div class="image-lightbox__panel" role="dialog" aria-modal="true" aria-label="Image" tabindex="-1">' +
      '<button class="image-lightbox__close" type="button" aria-label="Close image">&times;</button><img alt="" /></div>';
    const img = lightbox.querySelector("img");
    img.src = src;
    img.alt = alt || "";
    doc.body.appendChild(lightbox);
    doc.body.classList.add("menu-open");
    lightbox.querySelector(".image-lightbox__close").focus();
    lightbox.querySelectorAll("button").forEach((button) => button.addEventListener("click", closeLightbox));
  }

  doc.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-lightbox-src]");
    if (!trigger) return;
    event.preventDefault();
    openLightbox(trigger.dataset.lightboxSrc, trigger.dataset.lightboxAlt || trigger.querySelector("img")?.alt);
  });

  doc.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });

  /* ----------------------------------------------------------------------
     Netlify Identity: only loaded when an invite/recovery link needs it,
     so ordinary visitors don't download the widget.
     ---------------------------------------------------------------------- */
  const identityToken = /(?:invite_token|recovery_token|confirmation_token|email_change_token)=/;
  if (identityToken.test(window.location.hash)) {
    const script = doc.createElement("script");
    script.src = "https://identity.netlify.com/v1/netlify-identity-widget.js";
    script.onload = () => {
      const identity = window.netlifyIdentity;
      if (!identity) return;
      identity.on("login", () => {
        window.location.href = "/admin/";
      });
      identity.init();
      window.setTimeout(() => identity.open(), 250);
    };
    doc.head.appendChild(script);
  }

  /* ----------------------------------------------------------------------
     Decap CMS content (content/*.json). The HTML already carries the same
     copy, so this only matters after an edit in /admin/. Elements opt in:
       data-cms="file.path"        -> text
       data-cms-rich="file.path"   -> text, *word* becomes <em>word</em>
       data-cms-link="file.path"   -> {label, href} on a link
       data-cms-list="raskys.concepts" -> [{title, description}] into <li><h3><p>
     ---------------------------------------------------------------------- */
  const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[c]);

  function assetPath(path) {
    if (!path) return "";
    if (/^(https?:|mailto:|#|\/)/.test(path)) return path;
    return "/" + path.replace(/^\.?\//, "");
  }

  function pick(data, path) {
    return path.split(".").reduce((value, key) => (value == null ? undefined : value[key]), data);
  }

  function applyBindings(data) {
    doc.querySelectorAll("[data-cms]").forEach((el) => {
      const value = pick(data, el.dataset.cms);
      if (typeof value === "string" && value.trim()) el.textContent = value;
    });
    doc.querySelectorAll("[data-cms-rich]").forEach((el) => {
      const value = pick(data, el.dataset.cmsRich);
      if (typeof value === "string" && value.trim()) {
        el.innerHTML = escapeHtml(value).replace(/\*([^*]+)\*/g, "<em>$1</em>");
      }
    });
    doc.querySelectorAll("[data-cms-link]").forEach((el) => {
      const link = pick(data, el.dataset.cmsLink);
      if (!link || typeof link !== "object") return;
      if (link.href) el.setAttribute("href", assetPath(link.href));
      if (link.label) {
        const arrow = el.querySelector(".arrow");
        el.textContent = link.label + (arrow ? " " : "");
        if (arrow) el.appendChild(arrow);
      }
    });
    doc.querySelectorAll("[data-cms-list]").forEach((list) => {
      const items = pick(data, list.dataset.cmsList);
      if (!Array.isArray(items) || !items.length) return;
      list.innerHTML = items
        .filter((item) => item && item.title)
        .map((item) => `<li><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description || "")}</p></li>`)
        .join("");
    });
  }

  function visibleOrdered(items = []) {
    return items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item && item.visible !== false)
      .sort((a, b) => (Number(a.item.order) || a.index + 1) - (Number(b.item.order) || b.index + 1))
      .map(({ item }) => item);
  }

  const statusClass = { live: "status--live", prototype: "status--proto", early: "status--wip", design: "status--design" };

  function renderProjects(projects) {
    const list = doc.querySelector("[data-project-index]");
    if (!list || !Array.isArray(projects?.cards)) return;
    const rows = visibleOrdered(projects.cards).filter((card) => card.link && card.title);
    if (!rows.length) return;
    list.innerHTML = rows
      .map((card) => {
        const peek = card.image?.src ? `<img class="peek" src="${escapeHtml(assetPath(card.image.src))}" alt="" loading="lazy" />` : "";
        const status = card.status
          ? `<span class="tag ${statusClass[card.statusKind] || "status--wip"}">${escapeHtml(card.status)}</span>`
          : "<span></span>";
        return `<li><a class="project-row" href="${escapeHtml(assetPath(card.link))}"><h4>${escapeHtml(card.title)}</h4><p>${escapeHtml(
          card.description || ""
        )}</p>${status}<span class="arrow" aria-hidden="true">&rarr;</span>${peek}</a></li>`;
      })
      .join("");
  }

  function renderReleases(music) {
    const grid = doc.querySelector("[data-release-grid]");
    if (!grid || !Array.isArray(music?.releases)) return;
    const releases = visibleOrdered(music.releases);
    if (!releases.length) return;
    stopActive();
    grid.innerHTML = releases
      .map((release) => {
        const image = escapeHtml(assetPath(release.image?.src || release.image || ""));
        const title = escapeHtml(release.title || "");
        const kind = escapeHtml(release.type || release.subtitle || "");
        const href = release.link || release.spotifyLink;
        if (release.audioSrc) {
          return `<li class="release-card" data-demo-release="${escapeHtml(release.demoKey || "")}" data-audio-src="${escapeHtml(
            assetPath(release.audioSrc)
          )}"><button class="release-art" type="button" aria-label="Play a preview of ${title}"><img src="${image}" loading="lazy" decoding="async" alt="" /><span class="release-play-label">Preview</span></button><div class="release-player" aria-hidden="true"><span class="release-player__bar"></span></div><h4>${title}</h4><p>${kind}</p></li>`;
        }
        return `<li class="release-card"><a class="release-art" href="${escapeHtml(assetPath(href || "/music/"))}" rel="noopener" aria-label="${title} on Spotify"><img src="${image}" loading="lazy" decoding="async" alt="" /><span class="release-play-label">Spotify</span></a><div class="release-player" aria-hidden="true"><span class="release-player__bar"></span></div><h4>${title}</h4><p>${kind}</p></li>`;
      })
      .join("");
    bindReleases();
  }

  function applySite(site) {
    if (!site?.contactEmail) return;
    doc.querySelectorAll("[data-contact-email]").forEach((el) => {
      el.setAttribute("href", `mailto:${site.contactEmail}`);
      el.textContent = site.contactEmail;
    });
  }

  function applyDocuments(documents) {
    if (!documents) return;
    doc.querySelectorAll("[data-doc]").forEach((el) => {
      const path = documents[el.dataset.doc];
      if (path) el.setAttribute("href", assetPath(path));
    });
  }

  const wantsContent = doc.querySelector("[data-cms], [data-cms-rich], [data-cms-link], [data-cms-list], [data-project-index], [data-release-grid], [data-doc], [data-contact-email]");

  async function loadJson(name) {
    const response = await fetch(`/content/${name}.json`, { cache: "no-cache" });
    if (!response.ok) throw new Error(name);
    return response.json();
  }

  if (wantsContent && window.fetch) {
    const homeBindings = doc.querySelector("[data-cms], [data-cms-rich], [data-cms-link], [data-cms-list], [data-project-index], [data-release-grid]");
    const names = homeBindings ? ["site", "homepage", "raskys", "music", "projects", "documents"] : ["site", "documents"];
    Promise.allSettled(names.map(loadJson)).then((results) => {
      const data = {};
      results.forEach((result, index) => {
        if (result.status === "fulfilled") data[names[index]] = result.value;
      });
      try {
        applyBindings(data);
        applySite(data.site);
        applyDocuments(data.documents);
        renderProjects(data.projects);
        renderReleases(data.music);
      } catch (error) {
        /* the static HTML stays as the fallback */
      }
    });
  }
})();
