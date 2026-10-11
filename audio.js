/**
 * Procedural Web Audio API Engine
 * Generates realistic celebration sound effects & gentle birthday music box tunes
 * Zero external audio assets required - runs instantly & offline on mobile.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.musicPlaying = false;
    this.musicTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBirthdayMusic();
    }
    return this.isMuted;
  }

  vibrate(ms = 30) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch (e) {
        // ignore on unsupported devices
      }
    }
  }

  // Soft blowing wind sound for candle
  playBlowSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    this.vibrate([40, 30, 80]);

    const duration = 1.2;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.6, this.ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + duration);
  }

  // Realistic firework launch whistle & explosion
  playFireworkSound(hasWhistle = true) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    this.vibrate(50);

    const t = this.ctx.currentTime;

    if (hasWhistle) {
      // Launch whistle
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.exponentialRampToValueAtTime(850, t + 0.35);

      oscGain.gain.setValueAtTime(0.08, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.35);
    }

    // Explosion boom + crackle
    const boomDelay = hasWhistle ? 0.3 : 0;
    const expTime = t + boomDelay;

    // Sub-bass thump
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(120, expTime);
    subOsc.frequency.exponentialRampToValueAtTime(30, expTime + 0.6);

    subGain.gain.setValueAtTime(0.3, expTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, expTime + 0.6);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(expTime);
    subOsc.stop(expTime + 0.6);

    // Crackle noise burst
    const dur = 0.8;
    const bufSize = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.15));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, expTime);
    filter.Q.setValueAtTime(1.5, expTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, expTime);
    gain.gain.exponentialRampToValueAtTime(0.001, expTime + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(expTime);
    noise.stop(expTime + dur);
  }

  // Balloon pop sound
  playPopSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    this.vibrate(25);

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Sparkling celestial bell chime
  playTwinkleSound(freq = 880) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.3);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.6);
  }

  // Play charming music box notes for "Happy Birthday"
  playNote(frequency, startTime, duration = 0.4, volume = 0.12) {
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Warm bell timbre: Sine + harmonic
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Gentle music-box melody for Happy Birthday
  startBirthdayMusic() {
    if (this.musicPlaying || this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    this.musicPlaying = true;

    // Happy Birthday notes (Key of F / C)
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25;

    const melody = [
      { note: C4, d: 0.3 }, { note: C4, d: 0.2 }, { note: D4, d: 0.5 }, { note: C4, d: 0.5 }, { note: F4, d: 0.5 }, { note: E4, d: 0.9 },
      { note: C4, d: 0.3 }, { note: C4, d: 0.2 }, { note: D4, d: 0.5 }, { note: C4, d: 0.5 }, { note: G4, d: 0.5 }, { note: F4, d: 0.9 },
      { note: C4, d: 0.3 }, { note: C4, d: 0.2 }, { note: C5, d: 0.5 }, { note: A4, d: 0.5 }, { note: F4, d: 0.5 }, { note: E4, d: 0.5 }, { note: D4, d: 0.8 },
      { note: B4 * 0.95, d: 0.3 }, { note: B4 * 0.95, d: 0.2 }, { note: A4, d: 0.5 }, { note: F4, d: 0.5 }, { note: G4, d: 0.5 }, { note: F4, d: 1.2 }
    ];

    const playSequence = () => {
      if (!this.musicPlaying || this.isMuted) return;
      let currentTime = this.ctx.currentTime + 0.1;

      melody.forEach(item => {
        this.playNote(item.note, currentTime, item.d * 1.3, 0.1);
        currentTime += item.d * 0.75;
      });

      const totalDuration = (currentTime - this.ctx.currentTime) * 1000;
      this.musicTimer = setTimeout(() => {
        if (this.musicPlaying) {
          playSequence();
        }
      }, totalDuration + 2000);
    };

    playSequence();
  }

  stopBirthdayMusic() {
    this.musicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

export const sound = new SoundEngine();
