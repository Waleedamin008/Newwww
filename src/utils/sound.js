/**
 * Procedural Web Audio API Engine
 * Generates delicate celebration sound effects & soothing birthday music-box melody
 * 100% offline, zero external audio assets required.
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

  vibrate(ms = 25) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch (e) {}
    }
  }

  // Soft breath/wind puff when blowing the candle
  playBlowSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    this.vibrate([40, 30, 70]);

    const duration = 1.1;
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
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.45, this.ctx.currentTime + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + duration);
  }

  // Soft sparkle & subtle pastel fireworks burst
  playFireworkSound(hasWhistle = true) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    this.vibrate(40);

    const t = this.ctx.currentTime;

    if (hasWhistle) {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.28);

      oscGain.gain.setValueAtTime(0.05, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.28);
    }

    const expTime = t + (hasWhistle ? 0.25 : 0);

    // Warm soft thump
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(110, expTime);
    subOsc.frequency.exponentialRampToValueAtTime(35, expTime + 0.5);

    subGain.gain.setValueAtTime(0.2, expTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, expTime + 0.5);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(expTime);
    subOsc.stop(expTime + 0.5);

    // Light sparkling chime
    this.playTwinkleSound(720 + Math.random() * 300);
  }

  // Crisp balloon pop
  playPopSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    this.vibrate(25);

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(85, t + 0.08);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Delicate celestial bell chime
  playTwinkleSound(freq = 880) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.3, t + 0.25);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.55);
  }

  // Individual acoustic note for music box
  playNote(frequency, startTime, duration = 0.45, volume = 0.1) {
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

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

  // Soothing acoustic music-box melody for Happy Birthday
  startBirthdayMusic() {
    if (this.musicPlaying || this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    this.musicPlaying = true;

    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25;

    const melody = [
      { note: C4, d: 0.35 }, { note: C4, d: 0.25 }, { note: D4, d: 0.55 }, { note: C4, d: 0.55 }, { note: F4, d: 0.55 }, { note: E4, d: 0.95 },
      { note: C4, d: 0.35 }, { note: C4, d: 0.25 }, { note: D4, d: 0.55 }, { note: C4, d: 0.55 }, { note: G4, d: 0.55 }, { note: F4, d: 0.95 },
      { note: C4, d: 0.35 }, { note: C4, d: 0.25 }, { note: C5, d: 0.55 }, { note: A4, d: 0.55 }, { note: F4, d: 0.55 }, { note: E4, d: 0.55 }, { note: D4, d: 0.85 },
      { note: B4 * 0.95, d: 0.35 }, { note: B4 * 0.95, d: 0.25 }, { note: A4, d: 0.55 }, { note: F4, d: 0.55 }, { note: G4, d: 0.55 }, { note: F4, d: 1.25 }
    ];

    const playSequence = () => {
      if (!this.musicPlaying || this.isMuted) return;
      let currentTime = this.ctx.currentTime + 0.1;

      melody.forEach(item => {
        this.playNote(item.note, currentTime, item.d * 1.3, 0.08);
        currentTime += item.d * 0.8;
      });

      const totalDuration = (currentTime - this.ctx.currentTime) * 1000;
      this.musicTimer = setTimeout(() => {
        if (this.musicPlaying) {
          playSequence();
        }
      }, totalDuration + 2500);
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
