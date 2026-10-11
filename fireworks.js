/**
 * 3D Particle Fireworks Engine with Perspective Projection & Interactive Sparks
 */
import { sound } from './audio.js';

export class FireworksEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.rockets = [];
    this.isRunning = false;
    this.animId = null;
    this.autoLaunchTimer = null;
    this.fov = 400; // 3D Perspective field of view

    this.colors = [
      ['#FFD700', '#FFA500', '#FFE4B5'], // Gold luxury
      ['#FF1493', '#FF69B4', '#FFB6C1'], // Rose celebration
      ['#00FFFF', '#00BFFF', '#E0FFFF'], // Radiant Cyan
      ['#7B68EE', '#9370DB', '#E6E6FA'], // Royal Purple
      ['#00FA9A', '#3CB371', '#98FB98'], // Emerald Grace
      ['#FF4500', '#FF6347', '#FFE4E1']  // Vibrant Coral
    ];

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);
  }

  init() {
    this.resize();
    window.addEventListener('resize', this.resize);
    this.canvas.addEventListener('pointerdown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - this.canvas.width / 2;
      const y = e.clientY - rect.top - this.canvas.height / 2;
      this.explodeAt(x, y, (Math.random() - 0.5) * 150);
      sound.playFireworkSound(false);
    });
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();

    // Auto-launch rockets at varied rhythmic intervals
    const launch = () => {
      if (!this.isRunning) return;
      this.launchRocket();
      const nextDelay = 700 + Math.random() * 900;
      this.autoLaunchTimer = setTimeout(launch, nextDelay);
    };
    launch();

    // Quick initial burst for immediate wow factor
    setTimeout(() => this.launchRocket(), 150);
    setTimeout(() => this.launchRocket(), 450);
  }

  stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.autoLaunchTimer) clearTimeout(this.autoLaunchTimer);
    this.particles = [];
    this.rockets = [];
  }

  launchRocket() {
    const startX = (Math.random() - 0.5) * (this.width * 0.7);
    const startY = this.height * 0.5;
    const targetX = (Math.random() - 0.5) * (this.width * 0.6);
    const targetY = -this.height * 0.2 - Math.random() * (this.height * 0.25);
    const targetZ = (Math.random() - 0.5) * 200;

    const angle = Math.atan2(targetY - startY, targetX - startX);
    const speed = 12 + Math.random() * 4;

    this.rockets.push({
      x: startX,
      y: startY,
      z: 0,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      vz: (targetZ) / 40,
      targetY: targetY,
      palette: this.colors[Math.floor(Math.random() * this.colors.length)],
      trail: []
    });

    sound.playFireworkSound(true);
  }

  explodeAt(x, y, z, customPalette) {
    const palette = customPalette || this.colors[Math.floor(Math.random() * this.colors.length)];
    const count = 90 + Math.floor(Math.random() * 40);

    // Create 3D spherical burst particles
    for (let i = 0; i < count; i++) {
      // Fibonacci sphere distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const speed = 2.5 + Math.random() * 5.5;

      const vx = Math.sin(phi) * Math.cos(theta) * speed;
      const vy = Math.sin(phi) * Math.sin(theta) * speed;
      const vz = Math.cos(phi) * speed;

      this.particles.push({
        x: x,
        y: y,
        z: z,
        vx: vx,
        vy: vy,
        vz: vz,
        alpha: 1.0,
        decay: 0.012 + Math.random() * 0.015,
        color: palette[Math.floor(Math.random() * palette.length)],
        size: 1.8 + Math.random() * 2.2,
        twinkle: Math.random() > 0.5,
        hasSecondary: Math.random() > 0.8
      });
    }
  }

  animate() {
    if (!this.isRunning) return;

    // Soft trail motion blur
    this.ctx.fillStyle = 'rgba(7, 10, 20, 0.25)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // Update and draw rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.x += r.vx;
      r.y += r.vy;
      r.z += r.vz;
      r.vy += 0.08; // Slight gravity

      // Rocket trail
      r.trail.push({ x: r.x, y: r.y, z: r.z, alpha: 1.0 });
      if (r.trail.length > 8) r.trail.shift();

      // Render trail with 3D projection
      this.ctx.save();
      this.ctx.strokeStyle = r.palette[0];
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      for (let j = 0; j < r.trail.length; j++) {
        const p = r.trail[j];
        const scale = this.fov / (this.fov + p.z);
        const px = centerX + p.x * scale;
        const py = centerY + p.y * scale;
        if (j === 0) this.ctx.moveTo(px, py);
        else this.ctx.lineTo(px, py);
      }
      this.ctx.stroke();
      this.ctx.restore();

      // Check detonation
      if (r.y <= r.targetY || r.vy >= 0) {
        this.explodeAt(r.x, r.y, r.z, r.palette);
        this.rockets.splice(i, 1);
      }
    }

    // Update and draw explosion particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;

      // Air resistance and gravity
      p.vx *= 0.96;
      p.vy = p.vy * 0.96 + 0.09;
      p.vz *= 0.96;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        // Occasional secondary sparkles
        if (p.hasSecondary && Math.random() > 0.5) {
          this.explodeAt(p.x, p.y, p.z, ['#FFFFFF', '#FFD700']);
        }
        this.particles.splice(i, 1);
        continue;
      }

      // 3D Perspective Projection
      const scale = Math.max(0.2, this.fov / (this.fov + p.z));
      const projX = centerX + p.x * scale;
      const projY = centerY + p.y * scale;
      const projSize = Math.max(0.6, p.size * scale);

      let currentAlpha = p.alpha;
      if (p.twinkle && Math.random() > 0.4) {
        currentAlpha *= 0.4;
      }

      this.ctx.save();
      this.ctx.globalAlpha = currentAlpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8 * scale;
      this.ctx.shadowColor = p.color;

      this.ctx.beginPath();
      this.ctx.arc(projX, projY, projSize, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    this.animId = requestAnimationFrame(this.animate);
  }
}
