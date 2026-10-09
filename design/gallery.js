/* Gentle automatic browsing; every artwork remains a single accessible item. */
(() => {
  const rail = document.querySelector('#skate-series-track');
  if (!rail) return;
  const heading = document.querySelector('.skate-series-heading');
  const items = [...rail.querySelectorAll('.skate-series-item')];
  const previous = document.querySelector('[data-gallery-prev]');
  const next = document.querySelector('[data-gallery-next]');
  const toggle = document.querySelector('[data-gallery-toggle]');
  const position = document.querySelector('[data-gallery-position]');
  const status = document.querySelector('[data-gallery-status]');
  const hint = document.querySelector('#skate-scroll-hint');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hovered = new Set();
  const pointers = new Set();
  const pixelsPerSecond = 32;
  const interactionPause = 7000;
  let updateFrame = 0;
  let motionFrame = 0;
  let resumeTimer = 0;
  let previousTime = null;
  let precisePosition = 0;
  let direction = 1;
  let visible = false;
  let userPaused = false;
  let playFromControl = false;
  let lightboxOpen = !!document.querySelector('.image-lightbox');
  let resumeAfter = 0;
  let edgePauseUntil = 0;
  let drag = null;
  let suppressClickUntil = 0;

  const maximum = () => Math.max(0, rail.scrollWidth - rail.clientWidth);
  const itemLeft = (item) => item.getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft - 2;
  const focusWithin = () => rail.contains(document.activeElement) || heading.contains(document.activeElement);
  const blocked = () => userPaused || reduced.matches || document.hidden || !visible ||
    (hovered.size > 0 && !(playFromControl && hovered.size === 1 && hovered.has(heading))) ||
    pointers.size > 0 || (focusWithin() && !(playFromControl && document.activeElement === toggle)) ||
    lightboxOpen || maximum() <= 0;
  const currentIndex = () => {
    const left = rail.scrollLeft;
    if (left >= maximum() - 3) return items.length - 1;
    return items.reduce((closest, item, i) =>
      Math.abs(itemLeft(item) - left) < Math.abs(itemLeft(items[closest]) - left) ? i : closest, 0);
  };

  function update() {
    updateFrame = 0;
    previous.disabled = rail.scrollLeft <= 3;
    next.disabled = rail.scrollLeft >= maximum() - 3;
    position.textContent = `${String(currentIndex() + 1).padStart(2, '0')} / ${items.length}`;
  }

  function updateToggle() {
    toggle.hidden = false;
    toggle.disabled = reduced.matches;
    const paused = userPaused || reduced.matches;
    toggle.querySelector('[data-gallery-toggle-label]').textContent = reduced.matches ? 'Motion off' : paused ? 'Play' : 'Pause';
    toggle.querySelector('[data-gallery-toggle-icon]').textContent = paused ? '\u25b6' : '\u275a\u275a';
    toggle.setAttribute('aria-label', reduced.matches ? 'Automatic scrolling is off for your reduced-motion preference' : paused ? 'Play automatic scrolling' : 'Pause automatic scrolling');
    hint.textContent = reduced.matches ? '14 graphics. Swipe, drag or use the arrows.' : '14 graphics, gently on the move. Browse at your own pace.';
  }

  function stopMotion() {
    cancelAnimationFrame(motionFrame);
    clearTimeout(resumeTimer);
    motionFrame = 0;
    resumeTimer = 0;
    previousTime = null;
  }

  function refreshMotion() {
    stopMotion();
    if (blocked()) return;
    const wait = Math.max(resumeAfter, edgePauseUntil) - performance.now();
    if (wait > 0) {
      resumeTimer = window.setTimeout(refreshMotion, wait + 20);
      return;
    }
    precisePosition = rail.scrollLeft;
    motionFrame = requestAnimationFrame(move);
  }

  function move(time) {
    motionFrame = 0;
    if (blocked()) { stopMotion(); return; }
    const elapsed = previousTime === null ? 0 : Math.min(50, time - previousTime) / 1000;
    previousTime = time;
    const limit = maximum();
    const distanceToEnd = direction > 0 ? limit - precisePosition : precisePosition;
    // Ease into the ends, pause briefly, then travel back without a reset jump.
    const speed = pixelsPerSecond * Math.min(1, .2 + Math.min(precisePosition, limit - precisePosition) / 120);
    const travel = speed * elapsed;
    if (travel >= distanceToEnd && elapsed > 0) {
      rail.scrollLeft = direction > 0 ? limit : 0;
      direction *= -1;
      edgePauseUntil = time + 1100;
      refreshMotion();
      return;
    }
    precisePosition += direction * travel;
    rail.scrollLeft = precisePosition;
    motionFrame = requestAnimationFrame(move);
  }

  function manualInteraction() {
    playFromControl = false;
    resumeAfter = performance.now() + interactionPause;
    edgePauseUntil = 0;
    refreshMotion();
  }

  function goTo(index, announce = true) {
    manualInteraction();
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    const target = Math.min(maximum(), itemLeft(items[clamped]));
    direction = target < rail.scrollLeft ? -1 : 1;
    rail.scrollTo({left: target, behavior: reduced.matches ? 'instant' : 'smooth'});
    if (announce) {
      const title = items[clamped].querySelector('figcaption').innerText.replace(/\s+/g, ' ').trim();
      status.textContent = `${title}. Artwork ${clamped + 1} of ${items.length}.`;
    }
  }

  previous.addEventListener('click', () => {
    const candidates = items.map((item, i) => ({left: itemLeft(item), i})).filter(x => x.left < rail.scrollLeft - 3);
    goTo(candidates.length ? candidates[candidates.length - 1].i : 0);
  });
  next.addEventListener('click', () => {
    const target = items.findIndex(item => itemLeft(item) > rail.scrollLeft + 3);
    goTo(target < 0 ? items.length - 1 : target);
  });
  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    playFromControl = !userPaused;
    if (!userPaused) resumeAfter = 0;
    updateToggle();
    status.textContent = userPaused ? 'Automatic scrolling paused.' : 'Automatic scrolling on. It pauses while you browse.';
    refreshMotion();
  });

  rail.addEventListener('scroll', () => {
    if (!updateFrame) updateFrame = requestAnimationFrame(update);
  }, {passive: true});
  rail.addEventListener('wheel', manualInteraction, {passive: true});
  rail.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); next.click(); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); previous.click(); }
    else if (event.key === 'Home') { event.preventDefault(); goTo(0); }
    else if (event.key === 'End') { event.preventDefault(); goTo(items.length - 1); }
  });

  for (const zone of [rail, heading]) {
    zone.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      hovered.add(zone);
      refreshMotion();
    });
    zone.addEventListener('pointerleave', (event) => {
      if (event.pointerType !== 'mouse') return;
      hovered.delete(zone);
      refreshMotion();
    });
    zone.addEventListener('focusin', refreshMotion);
    zone.addEventListener('focusout', () => queueMicrotask(refreshMotion));
    zone.addEventListener('pointerdown', (event) => {
      pointers.add(event.pointerId);
      manualInteraction();
    });
  }
  function releasePointer(event) {
    if (pointers.delete(event.pointerId)) manualInteraction();
  }
  window.addEventListener('pointerup', releasePointer);
  window.addEventListener('pointercancel', releasePointer);

  rail.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = {id: event.pointerId, x: event.clientX, y: event.clientY, left: rail.scrollLeft, moved: false};
  });
  rail.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(event.clientY - drag.y)) {
      drag.moved = true;
      rail.classList.add('is-dragging');
      rail.setPointerCapture(event.pointerId);
    }
    if (drag.moved) {
      event.preventDefault();
      direction = dx > 0 ? -1 : 1;
      rail.scrollLeft = drag.left - dx;
    }
  });
  function finishDrag() {
    if (!drag) return;
    if (drag.moved) suppressClickUntil = performance.now() + 300;
    if (rail.hasPointerCapture(drag.id)) rail.releasePointerCapture(drag.id);
    drag = null;
    rail.classList.remove('is-dragging');
  }
  window.addEventListener('pointerup', finishDrag);
  window.addEventListener('pointercancel', finishDrag);
  rail.addEventListener('click', (event) => {
    if (performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= .35;
    refreshMotion();
  }, {threshold: [0, .35]}).observe(rail);
  new MutationObserver(() => {
    const open = !!document.querySelector('.image-lightbox');
    if (open === lightboxOpen) return;
    lightboxOpen = open;
    if (!open) resumeAfter = performance.now() + interactionPause;
    refreshMotion();
  }).observe(document.body, {childList: true});
  document.addEventListener('visibilitychange', refreshMotion);
  window.addEventListener('pagehide', stopMotion);
  window.addEventListener('pageshow', refreshMotion);
  reduced.addEventListener('change', () => { updateToggle(); refreshMotion(); });
  new ResizeObserver(() => { update(); refreshMotion(); }).observe(rail);
  // Keeping snapping off even while paused prevents an artwork jumping on hover.
  rail.classList.add('has-auto-scroll');
  updateToggle();
  update();
})();
