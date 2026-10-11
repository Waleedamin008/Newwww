/**
 * Procedural Web Audio API Engine
 * Generates realistic pyrotechnic fireworks, delicate candle breath puff,
 * and a rich acoustic music-box Happy Birthday background melody.
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
      this.ctx.resume().catch(() => {});
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBirthdayMusic();
    } else {
      this.startBirthdayMusic();
    }
    return this.isMuted;
  }

  vibrate(pattern = 25) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
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
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
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

  // Helper: Textured noise burst generator for realistic explosions and roars
  playNoiseBurst(startTime, duration, startCutoff, endCutoff, volume, filterType = 'lowpass') {
    if (!this.ctx) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5 + white * 0.3;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(startCutoff, startTime);
    filter.frequency.exponentialRampToValueAtTime(Math.max(25, endCutoff), startTime + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(startTime);
    noise.stop(startTime + duration);
  }

  // Helper: Sizzling golden spark / willow crackle micro-snap
  playMicroCrackle(startTime, frequency) {
    if (!this.ctx) return;
    const duration = 0.015 + Math.random() * 0.018;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(frequency, startTime);
    filter.Q.setValueAtTime(3.5, startTime);

    const gain = this.ctx.createGain();
    const vol = 0.12 + Math.random() * 0.18;
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(startTime);
    noise.stop(startTime + duration);
  }

  // Realistic Firework Mortar Launch (thud + ascending whistle/hiss)
  playFireworkLaunch() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Mortar launch thump
    const mortarOsc = this.ctx.createOscillator();
    const mortarGain = this.ctx.createGain();
    mortarOsc.type = 'triangle';
    mortarOsc.frequency.setValueAtTime(95, t);
    mortarOsc.frequency.exponentialRampToValueAtTime(25, t + 0.14);

    mortarGain.gain.setValueAtTime(0.35, t);
    mortarGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    mortarOsc.connect(mortarGain);
    mortarGain.connect(this.ctx.destination);
    mortarOsc.start(t);
    mortarOsc.stop(t + 0.15);

    // Rising whistle hiss
    const whistleOsc = this.ctx.createOscillator();
    const whistleGain = this.ctx.createGain();
    whistleOsc.type = 'sine';
    const startFreq = 480 + Math.random() * 80;
    whistleOsc.frequency.setValueAtTime(startFreq, t);
    whistleOsc.frequency.exponentialRampToValueAtTime(startFreq * 2.3, t + 0.45);

    whistleGain.gain.setValueAtTime(0.001, t);
    whistleGain.gain.linearRampToValueAtTime(0.12, t + 0.08);
    whistleGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    whistleOsc.connect(whistleGain);
    whistleGain.connect(this.ctx.destination);
    whistleOsc.start(t);
    whistleOsc.stop(t + 0.46);

    // Air rush noise
    this.playNoiseBurst(t, 0.45, 1200, 300, 0.08, 'bandpass');
  }

  // Realistic Firework Aerial Explosion (deep concussive boom + blast wave roar + echo + crackling spark tail)
  playFireworkExplosion() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    this.vibrate([45, 25, 45]);

    const t = this.ctx.currentTime;

    // 1. Heavy concussive sub-bass thump (punchy shockwave boom)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140 + Math.random() * 20, t);
    subOsc.frequency.exponentialRampToValueAtTime(32, t + 0.6);

    subGain.gain.setValueAtTime(0.75, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(t);
    subOsc.stop(t + 0.61);

    // 2. Detonation blast wave roar (dense low-pass explosion rumble)
    this.playNoiseBurst(t, 0.85, 650, 80, 0.65, 'lowpass');

    // 3. Rolling reverberation echo
    this.playNoiseBurst(t + 0.08, 1.35, 240, 60, 0.35, 'lowpass');

    // 4. Sizzling golden spark / crackle trail
    const crackleCount = 10 + Math.floor(Math.random() * 8);
    for (let i = 0; i < crackleCount; i++) {
      const crackleTime = t + 0.16 + Math.random() * 0.95;
      const crackleFreq = 2200 + Math.random() * 2200;
      this.playMicroCrackle(crackleTime, crackleFreq);
    }
  }

  // Backward compatible wrapper
  playFireworkSound(hasWhistle = true) {
    if (hasWhistle) {
      this.playFireworkLaunch();
    } else {
      this.playFireworkExplosion();
    }
  }

  // Crisp balloon pop for mini game
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

  // Tap sound removed per user request: "remove the sound on tap"
  playTwinkleSound() {
    // Intentionally silent
  }

  // Individual acoustic note for music box with rich harmonics & increased volume (0.32)
  playNote(frequency, startTime, duration = 0.55, volume = 0.32) {
    if (!this.ctx || this.isMuted) return;

    // Master note envelope
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    noteGain.connect(this.ctx.destination);

    // 1. Fundamental warm sine tone
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(frequency, startTime);
    gain1.gain.setValueAtTime(0.75, startTime);
    osc1.connect(gain1);
    gain1.connect(noteGain);
    osc1.start(startTime);
    osc1.stop(startTime + duration);

    // 2. Second harmonic (octave chime overtone)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(frequency * 2, startTime);
    gain2.gain.setValueAtTime(0.28, startTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.75);
    osc2.connect(gain2);
    gain2.connect(noteGain);
    osc2.start(startTime);
    osc2.stop(startTime + duration);

    // 3. Third harmonic (crystal sparkle)
    const osc3 = this.ctx.createOscillator();
    const gain3 = this.ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(frequency * 3, startTime);
    gain3.gain.setValueAtTime(0.12, startTime);
    gain3.gain.exponentialRampToValueAtTime(0.005, startTime + duration * 0.5);
    osc3.connect(gain3);
    gain3.connect(noteGain);
    osc3.start(startTime);
    osc3.stop(startTime + duration);
  }

  // Rich, soothing acoustic music-box melody for Happy Birthday
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
        this.playNote(item.note, currentTime, item.d * 1.4, 0.32);
        currentTime += item.d * 0.85;
      });

      const totalDuration = (currentTime - this.ctx.currentTime) * 1000;
      this.musicTimer = setTimeout(() => {
        if (this.musicPlaying) {
          playSequence();
        }
      }, totalDuration + 2200);
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
