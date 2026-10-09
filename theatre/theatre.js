import { chapters, duration, soundtrack } from './chapters.js?v=20261009i';
import { compose } from './presentation.js?v=20261009i';
import { Soundtrack } from './sound.js?v=20261009i';

const revision = '20261009i';
let active = null;
let stylesheet;
const starts = chapters.map((_, index) => chapters.slice(0, index).reduce((sum, chapter) => sum + chapter.seconds, 0));
const formatTime = value => { const seconds = Math.floor(value); return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`; };
function loadStyles() {
  if (stylesheet) return stylesheet;
  stylesheet = new Promise((resolve, reject) => {
    const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = `/theatre/theatre.css?v=${revision}`;
    const fail = () => { clearTimeout(timeout); link.remove(); stylesheet = null; reject(new Error('Styles unavailable')); };
    const timeout = setTimeout(fail, 10000);
    link.onload = () => { clearTimeout(timeout); resolve(); }; link.onerror = fail;
    document.head.append(link);
  });
  return stylesheet;
}

export async function start(launcher, { signal, audioSession } = {}) {
  await loadStyles();
  if (signal?.aborted || document.hidden) return;
  active?.exit('restart');
  active = new Tour(launcher, audioSession); active.open();
}

class Tour {
  constructor(launcher, audioSession) {
    this.launcher = launcher; this.audioSession = audioSession;
    this.abort = new AbortController(); this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.manual = this.motion.matches; this.elapsed = 0; this.index = -1;
    this.frame = null; this.state = 'preparing'; this.video = null; this.sequence = 0;
    this.preloaded = new Set(); this.warmedVideo = null; this.lastMediaCheck = -1; this.ambientVideos = [];
  }
  on(target, type, callback, options = {}) { target.addEventListener(type, callback, { ...options, signal: this.abort.signal }); }
  open() {
    this.stage = document.createElement('section'); this.stage.id = 'theatre-stage'; this.stage.className = 'theatre-stage';
    this.stage.dataset.revision = revision;
    this.stage.setAttribute('role', 'region'); this.stage.setAttribute('aria-label', 'Theatre Mode audiovisual portfolio');
    this.stage.innerHTML = `
      <div class="theatre-scene" data-theatre-scene></div>
      <div class="theatre-top"><span class="theatre-wordmark">RASKY<span> / selected things</span></span><a class="theatre-link" data-theatre-link href="#about">Jack Ormondroyd ↗</a></div>
      <div class="theatre-controls" role="group" aria-label="Showreel controls">
        <div class="theatre-progress" data-theatre-progress role="progressbar" aria-label="Showreel progress" aria-valuemin="0" aria-valuemax="${duration}" aria-valuenow="0"><span></span></div>
        <div class="theatre-control-row">
          <button type="button" data-action="pause">Pause</button>
          <button type="button" data-action="back" aria-label="Previous sequence">←</button>
          <span class="theatre-current" data-theatre-current></span>
          <button type="button" data-action="next" aria-label="Next sequence">→</button>
          <span class="theatre-time" data-theatre-time></span>
          <button type="button" data-action="sound" aria-pressed="false">Sound on</button>
          <button type="button" data-action="exit">Exit <span aria-hidden="true">×</span></button>
        </div>
        <div class="theatre-foot"><span data-theatre-audio-note>Smoke & Glass / Raskyjack</span><span data-theatre-hint>Scroll or Escape to take control.</span></div>
        <span class="visually-hidden" role="status" data-theatre-status></span>
      </div>`;
    document.body.append(this.stage); document.documentElement.dataset.theatre = 'active';
    this.scene = this.stage.querySelector('[data-theatre-scene]'); this.progress = this.stage.querySelector('[data-theatre-progress]');
    this.progressFill = this.progress.firstElementChild; this.time = this.stage.querySelector('[data-theatre-time]');
    this.status = this.stage.querySelector('[data-theatre-status]'); this.pauseButton = this.stage.querySelector('[data-action="pause"]');
    this.soundButton = this.stage.querySelector('[data-action="sound"]');
    this.sound = new Soundtrack(this.audioSession, soundtrack, this.abort.signal, state => this.audioStatus(state));
    this.updateSound();
    fetch(`/theatre/assets/v2/waveform.json?v=${revision}`, { signal: this.abort.signal }).then(r => r.ok ? r.json() : null).then(data => { this.waveform = data; }).catch(() => {});
    this.on(this.stage, 'click', event => {
      const action = event.target.closest('[data-action]')?.dataset.action;
      if (action === 'pause') this.state === 'playing' ? this.pause() : this.resume();
      if (action === 'back') this.seek(Math.max(0, this.index - 1));
      if (action === 'next') this.index === chapters.length - 1 ? this.exit('finish') : this.seek(this.index + 1);
      if (action === 'exit') this.exit('explicit');
      if (action === 'sound') this.toggleSound();
    });
    this.on(document, 'click', event => { if (event.target.closest('a, [data-menu-open]')) this.exit('link'); }, { capture: true });
    this.on(window, 'keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); this.exit('explicit'); return; }
      const control = event.target.closest('button, input, select, textarea, a');
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key) || (event.key === ' ' && !control)) this.exit('takeover');
    });
    this.on(window, 'wheel', event => { if (!event.ctrlKey && Math.abs(event.deltaY) + Math.abs(event.deltaX) > 2) this.exit('takeover'); }, { passive: true });
    this.on(window, 'touchstart', event => { const p = event.touches[0]; this.touch = event.touches.length === 1 ? { x: p.clientX, y: p.clientY } : null; }, { passive: true });
    this.on(window, 'touchmove', event => {
      if (!this.touch || event.touches.length !== 1) return;
      const p = event.touches[0]; if (Math.hypot(p.clientX - this.touch.x, p.clientY - this.touch.y) > 18) this.exit('takeover');
    }, { passive: true });
    this.on(window, 'touchend', () => { this.touch = null; }, { passive: true });
    this.on(document, 'visibilitychange', () => { if (document.hidden) this.pause('Paused while you were away. Resume when you’re ready.'); });
    this.on(window, 'pagehide', () => this.exit('navigation'));
    this.on(document, 'focusin', event => { if (!this.stage.contains(event.target)) this.exit('focus'); });
    this.on(document, 'play', () => { this.sound.protectOtherAudio(); this.updateSound(); }, { capture: true });
    if (this.sound.context) this.on(this.sound.context, 'statechange', () => {
      if (this.state === 'playing' && this.clockAudio && this.sound.context.state !== 'running') this.pause('Audio was interrupted. Resume when you’re ready.');
      this.updateSound();
    });
    this.on(window, 'resize', () => this.measure());
    if (window.visualViewport) this.on(window.visualViewport, 'resize', () => this.measure());
    this.on(this.motion, 'change', event => {
      this.manual = event.matches; this.pause('Use the arrows to explore at your own pace.');
      this.configureMotion(); this.setChapter(this.index); this.draw();
    });
    this.observer = new ResizeObserver(() => this.measure()); this.observer.observe(document.querySelector('main'));
    document.fonts?.ready.then(() => { if (!this.abort.signal.aborted) this.measure(); });
    this.configureMotion(); this.setChapter(0); this.setState(this.manual ? 'paused' : 'playing'); this.draw();
    (this.manual ? this.stage.querySelector('[data-action="next"]') : this.pauseButton).focus({ preventScroll: true });
    if (!this.manual) { this.sound.play(0); this.run(); }
  }
  configureMotion() {
    if (this.manual && document.activeElement === this.pauseButton) this.stage.querySelector('[data-action="next"]').focus({ preventScroll: true });
    this.stage.dataset.manual = String(this.manual); this.pauseButton.hidden = this.manual;
    this.stage.querySelector('[data-theatre-hint]').textContent = this.manual ? 'At your pace. Arrows to explore; Escape to leave.' : 'Scroll or Escape to take control.';
  }
  audioStatus(state) {
    if (this.abort.signal.aborted) return;
    const note = this.stage.querySelector('[data-theatre-audio-note]');
    const messages = { ready: 'Smoke & Glass / Raskyjack', unavailable: 'Sound unavailable · visuals continue', occupied: 'Your other music is still playing', blocked: 'Tap Sound to enable audio' };
    note.textContent = messages[state] || messages.ready;
    if (state === 'ready' && !this.buffering && (this.state === 'playing' || (this.manual && this.sound.wanted))) this.sound.play(this.elapsed);
    if (state === 'unavailable') { this.sound.wanted = false; this.audioUnavailable = true; }
    this.updateSound();
  }
  updateSound() {
    const audible = Boolean(this.sound?.wanted && this.sound.context?.state === 'running');
    if (!this.sound.context || this.audioUnavailable) {
      if (document.activeElement === this.soundButton) (this.manual ? this.stage.querySelector('[data-action="next"]') : this.pauseButton).focus({ preventScroll: true });
      this.soundButton.textContent = 'No audio'; this.soundButton.disabled = true;
      this.soundButton.setAttribute('aria-pressed', 'false');
      this.soundButton.setAttribute('aria-label', this.audioUnavailable ? 'The soundtrack could not load' : 'Audio is unavailable in this browser');
      this.stage.querySelector('[data-theatre-audio-note]').textContent = this.audioUnavailable ? 'Soundtrack unavailable · visuals continue' : 'Audio unavailable in this browser';
      return;
    }
    this.soundButton.textContent = audible ? 'Sound off' : 'Sound on';
    this.soundButton.setAttribute('aria-pressed', String(audible));
    this.soundButton.setAttribute('aria-label', audible ? 'Mute soundtrack' : 'Enable soundtrack');
    this.soundButton.disabled = !this.sound.context;
  }
  async toggleSound() {
    if (this.manual) {
      await this.sound.toggle();
      if (this.abort.signal.aborted) return;
      this.sound.wanted ? this.sound.play(this.elapsed) : this.sound.stop();
      this.updateSound(); return;
    }
    const wasPlaying = this.state === 'playing';
    if (wasPlaying) this.pause();
    await this.sound.toggle();
    if (this.abort.signal.aborted) return;
    this.updateSound(); if (wasPlaying) this.resume();
  }
  setState(state) {
    this.state = state; this.stage.dataset.state = state;
    this.pauseButton.textContent = state === 'playing' ? 'Pause' : 'Resume';
    this.pauseButton.setAttribute('aria-label', state === 'playing' ? 'Pause showreel' : 'Resume showreel');
  }
  measure() {
    if (this.index < 0 || this.abort.signal.aborted) return;
    const anchor = chapters[this.index].anchor;
    this.destination = 0;
    // A broad project heading does not identify the work currently on screen.
    if (!anchor || anchor === '.hero' || anchor === '#building' || anchor === '#building-title') return;
    const target = document.querySelector(anchor);
    if (!target) return;
    const header = document.querySelector('[data-header]')?.offsetHeight || 0;
    this.destination = Math.max(0, Math.min(target.getBoundingClientRect().top + scrollY - header - 24, document.documentElement.scrollHeight - innerHeight));
  }
  setChapter(index) {
    this.clearTransition();
    const outgoing = this.shot?.root;
    const previousKind = outgoing?.dataset.kind || '';
    const transition = outgoing && !this.manual && this.state === 'playing';
    let outgoingVideos;
    if (transition) {
      // Preserve the last presented frame and its palette during the dissolve.
      const theme = getComputedStyle(outgoing);
      for (const name of ['--tm-bg', '--tm-fg', '--tm-muted', '--tm-accent']) outgoing.style.setProperty(name, theme.getPropertyValue(name));
      outgoingVideos = [...outgoing.querySelectorAll('video')];
      outgoingVideos.forEach(video => video.pause());
      clearTimeout(this.bufferTimeout); this.buffering = false; this.stage.removeAttribute('data-buffering');
      this.video = null; this.ambientVideos = []; this.readyVideo = false;
    } else this.disposeVideo();
    this.index = index; this.sequence++;
    const chapter = chapters[index];
    if (this.scene.contains(document.activeElement)) (this.manual ? this.stage.querySelector('[data-action="next"]') : this.pauseButton).focus({ preventScroll: true });
    this.stage.dataset.chapter = chapter.id; this.stage.dataset.theme = chapter.theme;
    const source = matchMedia('(max-width: 760px)').matches && chapter.mobileVideo ? chapter.mobileVideo : chapter.video;
    const preparedVideo = !this.manual && source && this.warmedVideo?.src === new URL(source, location.href).href ? this.warmedVideo : null;
    if (preparedVideo) this.warmedVideo = null;
    this.shot = compose(chapter, this.manual, preparedVideo);
    this.shot.root.dataset.theme = chapter.theme;
    this.scene.dataset.from = previousKind; this.scene.dataset.to = chapter.kind;
    if (transition) {
      outgoing.classList.add('tm-outgoing'); outgoing.setAttribute('aria-hidden', 'true'); outgoing.inert = true;
      this.shot.root.classList.add('tm-incoming'); this.scene.append(this.shot.root);
      this.transition = { outgoing, incoming: this.shot.root, videos: outgoingVideos, start: this.elapsed };
      this.scene.dataset.transitioning = 'true'; this.scene.style.setProperty('--scene-progress', '0');
    } else this.scene.replaceChildren(this.shot.root);
    this.video = this.shot.video || null; this.readyVideo = false;
    if (this.video) this.attachVideo(chapter);
    this.attachAmbientVideos();
    const link = this.stage.querySelector('[data-theatre-link]');
    if (!chapter.href && document.activeElement === link) (this.manual ? this.stage.querySelector('[data-action="next"]') : this.pauseButton).focus({ preventScroll: true });
    link.hidden = !chapter.href;
    if (chapter.href) { link.href = chapter.href; link.textContent = chapter.link + ' ↗'; }
    this.stage.querySelector('[data-theatre-current]').textContent = chapter.group;
    this.stage.querySelector('[data-action="back"]').disabled = index === 0;
    this.stage.querySelector('[data-action="next"]').setAttribute('aria-label', index === chapters.length - 1 ? 'Finish showreel' : 'Next sequence');
    this.status.textContent = chapter.group;
    this.measure();
    // Keep the ordinary page still; choose a destination only when the viewer exits.
    // Prepare the hero beneath the opaque final card before that card dissolves.
    if (chapter.kind === 'finish') window.scrollTo({ top: 0, behavior: 'instant' });
    this.preloadNext(index);
  }
  preloadNext(index) {
    const next = chapters[index + 1];
    const narrow = matchMedia('(max-width: 760px)').matches;
    const image = narrow && next?.mobileImage ? next.mobileImage : next?.image || next?.screens?.[0]?.src;
    const graphics = next?.graphics?.map(graphic => graphic.src) || [];
    const images = [image, ...(navigator.connection?.saveData ? graphics.slice(0, 1) : graphics)];
    for (const source of images) {
      if (source && !this.preloaded.has(source)) { const poster = new Image(); poster.src = source; this.preloaded.add(source); }
    }
    this.clearWarmVideo();
    if (!this.manual && next?.video && !navigator.connection?.saveData) {
      const warmer = document.createElement('video'); warmer.muted = true; warmer.preload = 'auto';
      warmer.src = narrow && next.mobileVideo ? next.mobileVideo : next.video; warmer.load(); this.warmedVideo = warmer;
    }
  }
  clearWarmVideo() {
    if (!this.warmedVideo) return;
    this.warmedVideo.removeAttribute('src'); this.warmedVideo.load(); this.warmedVideo = null;
  }
  attachVideo(chapter) {
    const video = this.video; const sequence = this.sequence;
    this.failedVideo = false;
    const alive = () => !this.abort.signal.aborted && this.sequence === sequence && this.video === video;
    const ready = () => {
      if (!alive() || this.failedVideo) return;
      this.readyVideo = true; this.syncVideo(true);
      if (this.buffering) this.finishBuffering();
      if (this.state === 'playing') this.playVideo();
    };
    this.on(video, 'loadeddata', ready);
    this.on(video, 'playing', () => { if (alive() && !this.failedVideo) video.classList.add('is-ready'); });
    // A seek itself fires canplay. Seeking again here can trap partial downloads at zero.
    this.on(video, 'canplay', () => { if (alive() && this.state === 'playing' && !this.buffering) this.playVideo(); });
    const unavailable = () => {
      if (!alive()) return;
      this.readyVideo = false; this.failedVideo = true; video.classList.remove('is-ready');
      this.status.textContent = 'The clip is unavailable. The photograph stays in view.';
      if (this.buffering) this.finishBuffering();
    };
    this.on(video, 'error', unavailable);
    // A stalled video retains its last frame/poster, while the master edit advances.
    // Ended clips hold their final frame instead of jumping back to their poster.
    const source = matchMedia('(max-width: 760px)').matches && chapter.mobileVideo ? chapter.mobileVideo : chapter.video;
    if (video.src !== new URL(source, location.href).href) video.src = source;
    if (video.error) unavailable();
    else if (video.readyState >= 2) ready();
  }
  syncVideo(force = false) {
    if (!this.video || !this.readyVideo || this.video.seeking) return;
    const local = Math.max(0, this.elapsed - starts[this.index]);
    const end = Number.isFinite(this.video.duration) ? Math.max(0, this.video.duration - .04) : local;
    const target = Math.min(local, end);
    if (Math.abs(this.video.currentTime - target) < (force ? .025 : .18)) return;
    // Some static hosts cannot seek until the requested byte range has downloaded.
    const seekable = this.video.seekable;
    if (!Array.from({ length: seekable.length }, (_, i) => target >= seekable.start(i) && target <= seekable.end(i)).some(Boolean)) return;
    try { this.video.currentTime = target; } catch { /* A poster remains until seekable. */ }
  }
  playVideo() {
    const video = this.video;
    if (!video || !this.readyVideo || this.buffering || this.failedVideo || this.manual || video.ended || !video.paused) return;
    video.play().then(() => { if (this.video !== video || this.state !== 'playing') video.pause(); }).catch(() => { video.classList.remove('is-ready'); });
  }
  attachAmbientVideos() {
    if (this.manual) return;
    const sequence = this.sequence;
    this.ambientVideos = (this.shot.ambientVideos || []).map(item => ({ ...item, loaded: false, failed: false, lastSync: -Infinity }));
    for (const item of this.ambientVideos) {
      const video = item.video;
      video.muted = true; video.defaultMuted = true; video.playsInline = true; video.loop = false; video.preload = 'auto';
      video.setAttribute('muted', ''); video.setAttribute('playsinline', '');
      const alive = () => !this.abort.signal.aborted && this.sequence === sequence && this.ambientVideos.includes(item);
      this.on(video, 'loadeddata', () => { if (alive()) this.syncAmbientVideos(true); });
      this.on(video, 'playing', () => {
        if (!alive() || !item.active || this.state !== 'playing' || this.buffering) { video.pause(); return; }
        video.classList.add('is-ready');
      });
      this.on(video, 'error', () => {
        if (!alive()) return;
        item.failed = true; video.pause(); video.classList.remove('is-ready');
      });
    }
  }
  syncAmbientVideos(force = false) {
    const local = this.elapsed - starts[this.index];
    for (const item of this.ambientVideos) {
      const video = item.video;
      const start = Math.max(0, item.start || 0), end = item.end ?? chapters[this.index].seconds;
      item.active = local >= start && local < end;
      // Load only the next approaching insert, rather than all B-roll on entrance.
      if (!item.loaded && local >= start - 1 && local < end) {
        item.loaded = true; video.src = item.src; video.load();
      }
      if (!item.active || this.state !== 'playing' || this.buffering || item.failed) video.pause();
      if (!item.active || item.failed || video.readyState < 2) continue;
      const clipEnd = Number.isFinite(video.duration) ? Math.max(0, video.duration - .04) : local - start;
      const target = Math.min(Math.max(0, local - start), clipEnd);
      let aligned = Math.abs(video.currentTime - target) < .18;
      if (!video.seeking && (force || local - item.lastSync >= .5)) {
        item.lastSync = local;
        const seekable = video.seekable;
        if (Math.abs(video.currentTime - target) >= (force ? .025 : .18) &&
          Array.from({ length: seekable.length }, (_, i) => target >= seekable.start(i) && target <= seekable.end(i)).some(Boolean)) {
          try { video.currentTime = target; aligned = true; } catch { /* Keep the poster while the range is unavailable. */ }
        }
      }
      if (!aligned || video.seeking || this.state !== 'playing' || this.buffering || video.ended || !video.paused || item.playPending) continue;
      item.playPending = true;
      video.play().then(() => {
        if (!this.ambientVideos.includes(item) || !item.active || this.state !== 'playing' || this.buffering) video.pause();
      }).catch(() => video.classList.remove('is-ready')).finally(() => { item.playPending = false; });
    }
  }
  disposeAmbientVideos() {
    for (const { video } of this.ambientVideos) { video.pause(); video.removeAttribute('src'); video.load(); video.remove(); }
    this.ambientVideos = [];
  }
  clearTransition() {
    if (!this.transition) return;
    const { outgoing, incoming, videos } = this.transition;
    this.transition = null;
    for (const video of videos) { video.pause(); video.removeAttribute('src'); video.load(); video.remove(); }
    outgoing.remove(); incoming.classList.remove('tm-incoming');
    this.scene.removeAttribute('data-transitioning'); this.scene.style.setProperty('--scene-progress', '1');
  }
  updateTransition() {
    if (!this.transition) return;
    const progress = Math.min(1, Math.max(0, (this.elapsed - this.transition.start) / .65));
    // Smooth both ends without creating another clock or changing the edit points.
    const eased = progress * progress * (3 - 2 * progress);
    this.scene.style.setProperty('--scene-progress', eased.toFixed(4));
    if (progress >= 1) this.clearTransition();
  }
  disposeVideo() {
    this.clearTransition();
    clearTimeout(this.bufferTimeout); this.buffering = false;
    this.stage?.removeAttribute('data-buffering');
    this.disposeAmbientVideos();
    if (!this.video) return;
    this.video.pause(); this.video.removeAttribute('src'); this.video.load(); this.video.remove(); this.video = null; this.readyVideo = false;
  }
  draw() {
    this.progressFill.style.transform = `scaleX(${this.elapsed / duration})`;
    const second = Math.floor(this.elapsed);
    if (this.displayedSecond !== second) {
      this.displayedSecond = second; this.progress.setAttribute('aria-valuenow', String(second));
      this.progress.setAttribute('aria-valuetext', `${second} of ${Math.round(duration)} seconds. ${chapters[this.index].group}`);
      this.time.textContent = `${formatTime(second)} / ${formatTime(duration)}`;
      this.sound.protectOtherAudio(); this.updateSound();
    }
    this.shot.draw(this.elapsed - starts[this.index]);
    this.updateTransition();
    this.syncAmbientVideos();
    const samples = this.waveform?.samples || this.waveform?.rms;
    if (!this.manual && samples?.length) {
      const sample = samples[Math.min(samples.length - 1, Math.floor(this.elapsed * 20))];
      const level = typeof sample === 'number' ? sample : sample?.rms || 0;
      this.shot.root.style.setProperty('--signal', Math.min(1, level * 3).toFixed(3));
    }
    if (this.elapsed - this.lastMediaCheck > .5) { this.lastMediaCheck = this.elapsed; this.syncVideo(); }
  }
  clockNow() { return this.clockAudio ? this.sound.context.currentTime : performance.now() / 1000; }
  waitForPerformance() {
    if (this.buffering) return true;
    if (!['performance', 'practice'].includes(chapters[this.index].kind) || !this.video || this.failedVideo || this.video.readyState >= 2 || this.manual) return false;
    this.buffering = true; this.stage.dataset.buffering = 'true';
    this.stage.querySelector('[data-theatre-current]').textContent = 'Loading clip…';
    this.elapsed = starts[this.index]; this.sound.stop();
    this.status.textContent = 'Loading the guitar clip. Playback will continue when it is ready.';
    this.draw();
    this.bufferTimeout = setTimeout(() => {
      if (!this.buffering || this.abort.signal.aborted) return;
      this.failedVideo = true; this.readyVideo = false;
      this.video?.classList.remove('is-ready');
      this.status.textContent = 'The guitar clip could not load in time. Continuing with the photograph.';
      this.finishBuffering();
    }, 8000);
    return true;
  }
  finishBuffering() {
    clearTimeout(this.bufferTimeout); this.buffering = false; this.stage.removeAttribute('data-buffering');
    this.stage.querySelector('[data-theatre-current]').textContent = chapters[this.index].group;
    if (!this.failedVideo) this.status.textContent = chapters[this.index].group;
    if (this.state !== 'playing' || this.abort.signal.aborted) return;
    this.sound.play(this.elapsed); this.playVideo(); this.run();
  }
  run() {
    if (this.frame !== null || this.state !== 'playing') return;
    if (this.waitForPerformance()) return;
    this.clockAudio = this.sound.context?.state === 'running'; this.origin = this.clockNow(); this.base = this.elapsed;
    const tick = () => {
      this.frame = null; if (this.state !== 'playing') return;
      this.elapsed = this.base + Math.max(0, this.clockNow() - this.origin);
      if (this.elapsed >= duration) { this.exit('finish'); return; }
      let next = chapters.length - 1; while (next > 0 && starts[next] > this.elapsed) next--;
      if (next !== this.index) { this.setChapter(next); if (this.waitForPerformance()) return; }
      this.draw(); this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }
  pause(message = '') {
    if (this.state === 'exiting') return;
    cancelAnimationFrame(this.frame); this.frame = null; this.video?.pause(); this.ambientVideos.forEach(({ video }) => video.pause()); this.sound.stop(); this.setState('paused');
    if (this.manual) { this.sound.wanted = false; this.updateSound(); }
    if (message) this.status.textContent = message;
  }
  resume() {
    if (this.manual || document.hidden) return;
    if (this.sound.context?.state !== 'running') this.sound.context?.resume().then(() => {
      if (this.state !== 'playing' || this.buffering || this.abort.signal.aborted) return;
      this.sound.play(this.elapsed); this.updateSound();
    }).catch(() => this.audioStatus('blocked'));
    this.setState('playing'); if (this.waitForPerformance()) return;
    this.syncVideo(true); this.playVideo(); this.sound.play(this.elapsed); this.run();
  }
  seek(index) {
    const playing = this.state === 'playing'; cancelAnimationFrame(this.frame); this.frame = null;
    this.elapsed = starts[index]; this.lastMediaCheck = -1; this.setChapter(index); this.draw();
    if (playing && !this.waitForPerformance()) { this.sound.play(this.elapsed); this.run(); }
    else if (this.manual && this.sound.wanted) this.sound.play(this.elapsed);
  }
  exit(reason) {
    if (this.state === 'exiting') return;
    if (reason === 'takeover') this.measure();
    this.setState('exiting'); this.abort.abort(); this.observer.disconnect();
    cancelAnimationFrame(this.frame); this.frame = null; this.disposeVideo(); this.clearWarmVideo(); this.sound.close();
    this.stage.remove(); delete document.documentElement.dataset.theatre; if (active === this) active = null;
    if (reason === 'takeover') window.scrollTo({ top: this.destination ?? 0, behavior: 'instant' });
    if (reason === 'explicit') {
      window.scrollTo({ top: 0, behavior: 'instant' });
      this.launcher.focus({ preventScroll: true });
    }
    if (reason === 'finish') this.finish();
  }
  finish() {
    const heading = document.querySelector('#hero-title');
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (!heading) { this.launcher.focus({ preventScroll: true }); return; }
    const previousTabindex = heading.getAttribute('tabindex');
    heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true });
    heading.addEventListener('blur', () => {
      if (previousTabindex === null) heading.removeAttribute('tabindex');
      else heading.setAttribute('tabindex', previousTabindex);
    }, { once: true });
  }
}
