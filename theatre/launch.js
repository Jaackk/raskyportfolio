/* Homepage-only entry. The presentation and its media load only on a click. */
(() => {
  const invitation = document.querySelector('[data-theatre-invitation]');
  const button = invitation?.querySelector('button');
  if (!button) return;
  invitation.hidden = false;
  let preparing = false;
  let ticket = 0;
  button.addEventListener('click', async () => {
    if (preparing) return;
    preparing = true;
    const current = ++ticket;
    const pending = new AbortController();
    // Unlock audio in the actual click, before the lazy module/network work.
    const Context = window.AudioContext || window.webkitAudioContext;
    const occupied = document.querySelector('.release-card.is-playing') || [...document.querySelectorAll('audio,video')].some(media => !media.paused && !media.muted && media.volume > 0);
    const session = { context: null, wanted: !occupied && !matchMedia('(prefers-reduced-motion: reduce)').matches, claimed: false };
    try { if (Context) { session.context = new Context(); session.context.resume().catch(() => {}); } } catch { /* The tour can still run with an explicit Sound control. */ }
    const status = invitation.querySelector('[data-theatre-loading]');
    const cancel = () => { ticket++; preparing = false; button.removeAttribute('aria-busy'); status.textContent = ''; pending.abort(); if (!session.claimed) session.context?.close().catch(() => {}); };
    window.addEventListener('keydown', e => { if (['Escape', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key) || (e.key === ' ' && !e.target.closest('button, a, input, select, textarea'))) cancel(); }, { signal: pending.signal });
    window.addEventListener('wheel', e => { if (!e.ctrlKey && Math.abs(e.deltaX) + Math.abs(e.deltaY) > 2) cancel(); }, { passive: true, signal: pending.signal });
    let touch;
    window.addEventListener('touchstart', e => { touch = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null; }, { passive: true, signal: pending.signal });
    window.addEventListener('touchmove', e => { if (touch && e.touches.length === 1 && Math.hypot(e.touches[0].clientX - touch.x, e.touches[0].clientY - touch.y) > 18) cancel(); }, { passive: true, signal: pending.signal });
    document.addEventListener('visibilitychange', () => { if (document.hidden) cancel(); }, { signal: pending.signal });
    window.addEventListener('pagehide', cancel, { signal: pending.signal });
    document.addEventListener('click', e => { if (e.target.closest('a')) cancel(); }, { signal: pending.signal });
    button.setAttribute('aria-busy', 'true');
    status.textContent = 'Preparing Theatre Mode…';
    try {
      const { start } = await import('./theatre.js?v=20261009i');
      if (current !== ticket || document.hidden) return;
      await start(button, { signal: pending.signal, audioSession: session });
      if (current === ticket) status.textContent = '';
    } catch {
      if (current === ticket) status.textContent = 'The tour could not load. Please try again.';
    } finally {
      pending.abort();
      if (!session.claimed) session.context?.close().catch(() => {});
      if (current === ticket) { preparing = false; button.removeAttribute('aria-busy'); }
    }
  });
})();
