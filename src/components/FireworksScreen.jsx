import React, { useEffect, useRef, useState } from 'react';
import { sound } from '../utils/sound';

export default function FireworksScreen({ onNext }) {
  const canvasRef = useRef(null);
  const [showTribute, setShowTribute] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let isRunning = true;
    let autoLaunchTimer;

    // Soft pastel & light luxury colors
    const palettes = [
      ['#E68A94', '#F472B6', '#FFFFFF'], // Rose gold & soft pink
      ['#D4AF37', '#FDE047', '#FFFBEB'], // Champagne gold & pearl
      ['#A7F3D0', '#6EE7B7', '#ECFDF5'], // Soft mint & sage
      ['#C4B5FD', '#A78BFA', '#F5F3FF'], // Delicate lavender
      ['#FDBA74', '#FB923C', '#FFF7ED']  // Peach glow
    ];

    const fov = 420;
    const rockets = [];
    const particles = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const explodeAt = (x, y, z, customPalette) => {
      const palette = customPalette || palettes[Math.floor(Math.random() * palettes.length)];
      const count = 85 + Math.floor(Math.random() * 35);

      for (let i = 0; i < count; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const speed = 2.4 + Math.random() * 5.2;

        const vx = Math.sin(phi) * Math.cos(theta) * speed;
        const vy = Math.sin(phi) * Math.sin(theta) * speed;
        const vz = Math.cos(phi) * speed;

        particles.push({
          x, y, z,
          vx, vy, vz,
          alpha: 1.0,
          decay: 0.012 + Math.random() * 0.015,
          color: palette[Math.floor(Math.random() * palette.length)],
          size: 1.8 + Math.random() * 2.2,
          twinkle: Math.random() > 0.4
        });
      }
    };

    const launchRocket = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const startX = (Math.random() - 0.5) * (w * 0.65);
      const startY = h * 0.5;
      const targetX = (Math.random() - 0.5) * (w * 0.55);
      const targetY = -h * 0.18 - Math.random() * (h * 0.28);
      const targetZ = (Math.random() - 0.5) * 180;

      const angle = Math.atan2(targetY - startY, targetX - startX);
      const speed = 12 + Math.random() * 4;

      rockets.push({
        x: startX,
        y: startY,
        z: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        vz: targetZ / 40,
        targetY,
        palette: palettes[Math.floor(Math.random() * palettes.length)],
        trail: []
      });

      sound.playFireworkSound(true);
    };

    const animate = () => {
      if (!isRunning) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const centerX = w / 2;
      const centerY = h / 2;

      // Soft trail wash on twilight background
      ctx.fillStyle = 'rgba(21, 19, 34, 0.28)';
      ctx.fillRect(0, 0, w, h);

      // Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;
        r.z += r.vz;
        r.vy += 0.08;

        r.trail.push({ x: r.x, y: r.y, z: r.z });
        if (r.trail.length > 8) r.trail.shift();

        ctx.save();
        ctx.strokeStyle = r.palette[0];
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let j = 0; j < r.trail.length; j++) {
          const p = r.trail[j];
          const scale = fov / (fov + p.z);
          const px = centerX + p.x * scale;
          const py = centerY + p.y * scale;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();

        if (r.y <= r.targetY || r.vy >= 0) {
          explodeAt(r.x, r.y, r.z, r.palette);
          rockets.splice(i, 1);
        }
      }

      // Explosion Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.vx *= 0.96;
        p.vy = p.vy * 0.96 + 0.085;
        p.vz *= 0.96;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const scale = Math.max(0.2, fov / (fov + p.z));
        const projX = centerX + p.x * scale;
        const projY = centerY + p.y * scale;
        const projSize = Math.max(0.6, p.size * scale);

        let currentAlpha = p.alpha;
        if (p.twinkle && Math.random() > 0.4) currentAlpha *= 0.45;

        ctx.save();
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8 * scale;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(projX, projY, projSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(animate);
    };

    // Auto launch schedule
    const scheduleLaunch = () => {
      if (!isRunning) return;
      launchRocket();
      autoLaunchTimer = setTimeout(scheduleLaunch, 750 + Math.random() * 850);
    };

    animate();
    scheduleLaunch();
    setTimeout(launchRocket, 200);

    // Canvas click to explode
    const handlePointerDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - window.innerWidth / 2;
      const y = e.clientY - rect.top - window.innerHeight / 2;
      explodeAt(x, y, (Math.random() - 0.5) * 120);
      sound.playFireworkSound(false);
    };
    canvas.addEventListener('pointerdown', handlePointerDown);

    // Reveal Tribute card after 2.4s
    const tributeTimer = setTimeout(() => {
      setShowTribute(true);
      sound.playTwinkleSound(1046.5);
    }, 2400);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      clearTimeout(autoLaunchTimer);
      clearTimeout(tributeTimer);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return (
    <section className="screen-wrapper fireworks-screen">
      <canvas ref={canvasRef} className="fireworks-canvas" />

      <div className="fireworks-center">
        {showTribute && (
          <div className="tribute-glass-card">
            <div className="crown-badge">👑</div>
            <div className="tribute-subheading">A Special Celebration</div>
            <h1 className="tribute-main-title">
              Happy Birthday<br />
              <span className="hero-highlight">Reeba Aamir</span>
              <span className="hero-president-tag">(Madam President)</span>
            </h1>
            <p className="tribute-body-quote">
              "May your life be as radiant, boundless, and inspiring as the fireworks illuminating the heavens."
            </p>

            <div className="interactive-sky-tip">
              ✨ Tap anywhere on the sky to launch fireworks!
            </div>

            <div className="action-box">
              <button onClick={onNext} className="btn-primary">
                <span>Explore Birthday Wishes</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
