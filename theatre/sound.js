/* A single, pre-edited soundtrack. Visual media is always muted. */
export function otherAudioPlaying() {
  return Boolean(document.querySelector('.release-card.is-playing')) || [...document.querySelectorAll('audio, video')]
    .some(media => !media.closest('#theatre-stage') && !media.paused && !media.muted && media.volume > 0);
}

export class Soundtrack {
  constructor(session, url, signal, notify) {
    this.context = session?.context;
    this.wanted = Boolean(session?.wanted);
    this.notify = notify;
    this.source = null;
    this.buffer = null;
    this.closed = false;
    this.running = false;
    this.position = 0;
    if (session) session.claimed = true;
    if (!this.context) return;
    this.gain = this.context.createGain();
    this.gain.gain.value = this.wanted ? 1 : 0;
    this.gain.connect(this.context.destination);
    this.ready = fetch(url, { signal }).then(response => {
      if (!response.ok) throw new Error('Soundtrack unavailable');
      return response.arrayBuffer();
    }).then(bytes => this.context.decodeAudioData(bytes)).then(buffer => {
      if (this.closed) return;
      this.buffer = buffer;
      this.notify('ready');
    }).catch(error => { if (error.name !== 'AbortError' && !this.closed) this.notify('unavailable'); });
  }

  play(position) {
    this.stop();
    this.running = true;
    this.position = position;
    if (!this.buffer || !this.context || this.context.state !== 'running' || this.closed) return;
    const source = this.context.createBufferSource();
    source.buffer = this.buffer;
    source.connect(this.gain);
    source.start(0, Math.min(position, Math.max(0, this.buffer.duration - .01)));
    this.source = source;
    this.gain.gain.setValueAtTime(this.wanted && !otherAudioPlaying() ? 1 : 0, this.context.currentTime);
  }

  stop() {
    this.running = false;
    if (this.source) { try { this.source.stop(); } catch { /* Already stopped. */ } this.source.disconnect(); this.source = null; }
  }

  async toggle() {
    if (!this.context || this.closed) return false;
    if (!this.wanted && otherAudioPlaying()) { this.notify('occupied'); return false; }
    this.wanted = !(this.wanted && this.context.state === 'running');
    if (this.wanted) {
      try { await this.context.resume(); } catch { this.wanted = false; this.notify('blocked'); }
    }
    this.gain.gain.cancelScheduledValues(this.context.currentTime);
    this.gain.gain.setTargetAtTime(this.wanted ? 1 : 0, this.context.currentTime, .025);
    return this.wanted;
  }

  protectOtherAudio() {
    if (!this.wanted || !otherAudioPlaying()) return;
    this.wanted = false;
    this.gain?.gain.setValueAtTime(0, this.context.currentTime);
    this.notify('occupied');
  }

  close() {
    this.closed = true;
    this.stop();
    this.gain?.disconnect();
    this.context?.close().catch(() => {});
    this.buffer = null;
  }
}
