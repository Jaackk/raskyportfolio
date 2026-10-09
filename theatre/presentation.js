// Full-canvas edit compositions. This renderer has no clocks or global listeners.
const clamp = value => Math.max(0, Math.min(1, value));
const ease = value => 1 - (1 - clamp(value)) ** 3;
function el(tag, className, text) {
  const node = document.createElement(tag); node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function compose(chapter, manual, preparedVideo) {
  const root = el('div', `tm-shot tm-shot--${chapter.kind}`);
  root.dataset.kind = chapter.kind; root.dataset.manual = String(manual);
  const backdrop = el('div', 'tm-backdrop');
  const art = el('div', 'tm-art');
  const media = el('div', 'tm-media');
  const fallback = el('div', 'tm-fallback', chapter.caption || chapter.title.replaceAll('\n', ' '));
  media.append(fallback);
  let image;
  if (chapter.image) {
    image = el('img', 'tm-image'); image.src = manual && chapter.manualImage ? chapter.manualImage : chapter.image; image.alt = chapter.alt;
    image.decoding = 'async'; image.width = 1200; image.height = 1200;
    image.addEventListener('load', () => { fallback.hidden = true; }, { once: true });
    image.addEventListener('error', () => { image.hidden = true; fallback.hidden = false; }, { once: true });
    if (image.complete && image.naturalWidth) fallback.hidden = true;
    if (chapter.mobileImage) {
      const picture = document.createElement('picture');
      const source = document.createElement('source'); source.media = '(max-width: 760px)'; source.srcset = chapter.mobileImage;
      picture.append(source, image); media.append(picture);
    } else media.append(image);
  }
  let video;
  if (chapter.video && !manual) {
    video = preparedVideo || el('video', 'tm-video'); video.className = 'tm-video'; video.muted = true; video.defaultMuted = true; video.playsInline = true;
    video.setAttribute('muted', ''); video.setAttribute('playsinline', '');
    video.preload = 'auto'; video.poster = chapter.image; video.setAttribute('aria-label', chapter.alt);
    media.append(video);
  }
  art.append(media);
  if (chapter.secondImage) {
    const detail = el('img', 'tm-detail-image'); detail.dataset.detail = '0'; detail.src = chapter.secondImage; detail.alt = ''; detail.setAttribute('aria-hidden', 'true');
    detail.addEventListener('error', () => detail.remove(), { once: true }); art.append(detail);
  }
  if (chapter.thirdImage) {
    const detail = el('img', 'tm-detail-image'); detail.dataset.detail = '1'; detail.src = chapter.thirdImage; detail.alt = ''; detail.setAttribute('aria-hidden', 'true');
    detail.addEventListener('error', () => detail.remove(), { once: true }); art.append(detail);
  }
  const screens = [];
  if (chapter.screens) {
    art.replaceChildren();
    chapter.screens.forEach((screen, index) => {
      const figure = el('figure', chapter.kind === 'dashboard' ? 'tm-dashboard-screen' : 'tm-app-screen'); figure.dataset.screen = String(index);
      const img = el('img', '', ''); img.src = screen.src; img.alt = screen.alt; img.decoding = 'async';
      img.addEventListener('error', () => { img.hidden = true; figure.prepend(el('p', 'tm-screen-fallback', 'Screen unavailable')); }, { once: true });
      figure.append(img, el('figcaption', '', screen.label)); art.append(figure); screens.push(figure);
    });
  }
  const typography = el('div', 'tm-typography');
  typography.append(el('h2', 'tm-title', chapter.title));
  if (chapter.text) typography.append(el('p', 'tm-description', chapter.text));
  const marker = el('span', 'tm-marker', chapter.kind === 'skate-photo' ? 'TRY / AGAIN' : chapter.kind === 'game' ? 'AND THIS, TOO.' : '');
  marker.setAttribute('aria-hidden', 'true');
  const caption = el('p', 'tm-caption', chapter.caption || '');
  if (chapter.kind === 'opening') {
    const index = el('div', 'tm-opening-index');
    ['Songs.', 'Movement.', 'Useful things.', 'Other worlds.'].forEach((word, i) => { const item = el('span', '', word); item.style.setProperty('--i', i); index.append(item); });
    typography.append(index);
  }
  if (chapter.kind === 'performance') {
    const strings = el('div', 'tm-strings'); strings.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 6; i++) strings.append(el('i', '')); backdrop.append(strings);
  }
  const stepNodes = [];
  const graphicNodes = [];
  if (chapter.graphics) {
    const graphics = el('div', 'tm-skate-graphics');
    for (const graphic of chapter.graphics) {
      const img = el('img', 'tm-skate-graphic'); img.src = graphic.src; img.alt = graphic.alt;
      img.decoding = 'async'; img.addEventListener('error', () => img.remove(), { once: true });
      graphics.append(img); graphicNodes.push(img);
    }
    graphics.append(el('span', 'tm-graphic-label', 'RASKY / skate graphics')); root.append(graphics);
  }
  if (chapter.words) {
    const steps = el('div', 'tm-steps'); chapter.words.forEach(word => steps.append(el('span', '', word))); typography.append(steps);
    stepNodes.push(...steps.children);
  }
  if (chapter.kind === 'code') {
    const note = el('div', 'tm-code-note');
    note.append(el('span', 'tm-code-label', 'Raskode / personal tooling'));
    for (const [verb, detail] of [['automate', 'the repetitive bits'], ['remember', 'context between sessions'], ['learn', 'by making things']]) {
      const row = el('p', ''); row.append(el('strong', '', verb), el('span', '', detail)); note.append(row);
    }
    note.append(el('small', '', 'In progress. Used by one person: me.'));
    art.replaceChildren(note);
  }
  let motionCanvas, motionContext, lastMotionFrame = -1, skateIndex;
  if (chapter.kind === 'skate-film') {
    const treatment = el('div', 'tm-skate-treatment'); treatment.setAttribute('aria-hidden', 'true');
    media.append(treatment);
    const edit = el('div', 'tm-skate-edit'); edit.setAttribute('aria-hidden', 'true'); art.append(edit);
    skateIndex = el('span', 'tm-skate-index', '01 / 03'); skateIndex.setAttribute('aria-hidden', 'true'); root.append(skateIndex);
  }
  if (chapter.kind === 'skate-film' && !manual) {
    motionCanvas = el('canvas', 'tm-motion-bed'); motionCanvas.width = 384; motionCanvas.height = 216;
    motionCanvas.hidden = true;
    motionCanvas.setAttribute('aria-hidden', 'true'); motionContext = motionCanvas.getContext('2d', { alpha: false });
    backdrop.append(motionCanvas);
  }
  if (chapter.kind === 'website') art.prepend(el('div', 'tm-browser-line', 'motiondesk / a website study'));
  const ambientVideos = [];
  if (!manual && (innerWidth > 760 || innerHeight >= 700)) {
    for (const [index, clip] of (chapter.ambientVideos || []).entries()) {
      const figure = el('figure', 'tm-ambient'); figure.dataset.insert = String(index);
      const insert = el('video', 'tm-ambient-video'); insert.muted = true; insert.defaultMuted = true; insert.playsInline = true;
      insert.setAttribute('muted', ''); insert.setAttribute('playsinline', ''); insert.preload = 'none'; insert.poster = clip.poster; insert.setAttribute('aria-label', clip.alt);
      figure.append(insert, el('figcaption', '', 'Other moments / live')); root.append(figure);
      ambientVideos.push({ ...clip, video: insert, figure });
    }
  }
  root.classList.toggle('tm-has-ambient', ambientVideos.length > 0);
  root.append(backdrop, art, marker, typography, caption, ...ambientVideos.map(clip => clip.figure));
  let lastBeat = -1;
  return {
    root, video, image, media, ambientVideos,
    draw(local) {
      let insertVisible = false;
      for (const clip of ambientVideos) {
        const visible = local >= clip.start && local < clip.end;
        clip.figure.classList.toggle('is-visible', visible); insertVisible ||= visible;
      }
      root.dataset.ambient = String(insertVisible);
      // One decoded video supplies the whole composition; no second player or clock.
      if (motionContext && Math.floor(local * 12) !== lastMotionFrame) {
        const source = video?.readyState >= 2 ? video : image?.naturalWidth ? image : null;
        if (source) {
          const w = source.videoWidth || source.naturalWidth, h = source.videoHeight || source.naturalHeight;
          const scale = Math.max(384 / w, 216 / h), dw = w * scale, dh = h * scale;
          motionContext.drawImage(source, (384 - dw) / 2, (216 - dh) / 2, dw, dh);
          motionCanvas.hidden = false;
        }
        lastMotionFrame = Math.floor(local * 12);
      }
      const progress = clamp(local / chapter.seconds);
      const entry = manual ? 1 : ease(local / .7);
      const end = manual ? 0 : ease((local - chapter.seconds + .55) / .55);
      root.style.setProperty('--p', progress.toFixed(4));
      root.style.setProperty('--entry', entry.toFixed(4));
      root.style.setProperty('--out', end.toFixed(4));
      const cues = chapter.cues || [0, chapter.seconds * .5];
      let beat = 0;
      for (let i = 0; i < cues.length; i++) if (local >= cues[i]) beat = i;
      if (manual) beat = Math.max(0, cues.length - 1);
      if (chapter.kind === 'bar-tools') {
        // Editorial movement of genuine captures, never a simulated tap or UI state.
        // Use the show clock so pausing also freezes the screen handover.
        const position = manual || beat === 0 ? 0 : beat - 1 + ease((local - cues[beat]) / .48);
        screens.forEach((screen, index) => {
          const offset = index - position, distance = Math.abs(offset);
          screen.style.setProperty('--screen-offset', offset.toFixed(4));
          screen.style.setProperty('--screen-scale', Math.max(.76, 1 - distance * .2).toFixed(4));
          screen.style.setProperty('--screen-alpha', clamp(1 - distance * .78).toFixed(4));
          screen.style.zIndex = String(4 - Math.min(3, Math.round(distance)));
        });
      }
      if (lastBeat !== beat) {
        root.dataset.beat = String(beat); lastBeat = beat;
        if (skateIndex) skateIndex.textContent = `${String(beat + 1).padStart(2, '0')} / 03`;
        graphicNodes.forEach((graphic, index) => graphic.classList.toggle('is-current', index === (manual ? 0 : chapter.kind === 'skate-film' ? Number(beat >= 2) : beat % graphicNodes.length)));
        stepNodes.forEach((step, index) => { step.classList.toggle('is-shown', manual || index <= beat); step.classList.toggle('is-current', index === (manual && screens.length ? 0 : beat)); });
        screens.forEach((screen, index) => screen.classList.toggle('is-current', index === (manual ? 0 : beat % screens.length)));
        root.querySelectorAll('.tm-code-note p').forEach((row, index) => { row.classList.toggle('is-shown', manual || index < beat); row.classList.toggle('is-current', index === beat - 1); });
      }
      if (!manual) {
        if (chapter.kind === 'skate-film') {
          // Moving ink edge bridges the encoded crossfades; the complete trick stays visible.
          const cutStart = [...cues].reverse().find(cue => cue > 0 && local >= cue - .08);
          const cut = cutStart === undefined ? 1 : clamp((local - cutStart + .08) / .55);
          root.style.setProperty('--cut-x', `${-20 + cut * 140}%`);
          root.style.setProperty('--cut-strength', (Math.sin(cut * Math.PI) * .32).toFixed(4));
        }
        if (chapter.kind === 'opening') art.style.transform = `translate3d(${(1 - entry) * 22}%,0,0) rotate(${(1 - entry) * 5}deg)`;
        if (chapter.kind === 'skate-photo') art.style.transform = `scale(${1.02 + progress * .035})`;
        if (chapter.kind === 'print') art.style.transform = `rotate(${-8 + progress * 3}deg) translateY(${(1 - entry) * 12}%)`;
      }
    }
  };
}
