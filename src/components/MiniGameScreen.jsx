import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BALLOON_COMPLIMENTS } from '../data/wishes';
import { sound } from '../utils/sound';
import { downloadPresidentialCertificate } from '../utils/certificate';

export default function MiniGameScreen({ onBack }) {
  const [balloons, setBalloons] = useState([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [lastRevealed, setLastRevealed] = useState(null);
  const [showVictory, setShowVictory] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const totalBalloons = BALLOON_COMPLIMENTS.length;

  const pastelColors = [
    { bg: 'linear-gradient(135deg, #FDE2E4, #FAD2E1)' },
    { bg: 'linear-gradient(135deg, #E2ECE9, #BEE1E6)' },
    { bg: 'linear-gradient(135deg, #DFE7FD, #CDDAFD)' },
    { bg: 'linear-gradient(135deg, #FFF1E6, #FDE2E4)' },
    { bg: 'linear-gradient(135deg, #E2F0CB, #C5E1A5)' },
    { bg: 'linear-gradient(135deg, #F3C4FB, #E7C6FF)' }
  ];

  // Spawn loop for the prayer balloons
  useEffect(() => {
    let timer;
    const spawnBalloon = () => {
      if (poppedCount < totalBalloons) {
        setBalloons((prev) => {
          if (prev.length >= 5) return prev;
          const id = Date.now() + Math.random();
          const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
          const size = 62 + Math.floor(Math.random() * 24);
          const left = 10 + Math.floor(Math.random() * 75);
          const duration = 6.5 + Math.random() * 3.5;
          const delay = Math.random() * 1.5;

          return [
            ...prev,
            { id, color, size, left, duration, delay }
          ];
        });
      }
      timer = setTimeout(spawnBalloon, 900 + Math.random() * 1100);
    };

    spawnBalloon();
    return () => clearTimeout(timer);
  }, [poppedCount, totalBalloons]);

  const handlePop = (id, e) => {
    e.stopPropagation();
    sound.playPopSound();
    sound.playTwinkleSound(650 + Math.random() * 350);

    // Confetti burst from click coordinates
    const x = e.clientX ? e.clientX / window.innerWidth : 0.5;
    const y = e.clientY ? e.clientY / window.innerHeight : 0.5;
    try {
      confetti({
        particleCount: 22,
        spread: 60,
        origin: { x, y },
        colors: ['#E68A94', '#D4AF37', '#A7F3D0', '#C4B5FD', '#FDE2E4']
      });
    } catch (err) {}

    // Remove popped balloon
    setBalloons((prev) => prev.filter((b) => b.id !== id));

    // Reveal prayer
    if (poppedCount < totalBalloons) {
      const nextComp = BALLOON_COMPLIMENTS[poppedCount];
      setLastRevealed(nextComp);
      const nextCount = poppedCount + 1;
      setPoppedCount(nextCount);

      if (nextCount === totalBalloons) {
        sound.startBirthdayMusic();
        try {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.6 }
          });
        } catch (err) {}
        setTimeout(() => setShowVictory(true), 700);
      }
    }
  };

  const handleReplay = () => {
    setShowVictory(false);
    setPoppedCount(0);
    setLastRevealed(null);
    setBalloons([]);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    sound.playTwinkleSound(880);
    downloadPresidentialCertificate();
    setTimeout(() => {
      setIsDownloading(false);
    }, 1500);
  };

  return (
    <section className="screen-wrapper game-screen">
      <div className="game-top-nav">
        <button onClick={onBack} className="btn-back-nav">
          <span>←</span> Back to Wishes
        </button>
        <span className="soft-pill-tag">Sacred Honor & Prayers</span>
      </div>

      <div className="game-arena-wrapper">
        <div className="game-text-center">
          <h2 className="game-heading">Treasury of Sacred Prayers</h2>
          <p className="game-subheading">
            Gather all 10 sacred prayers to unveil and earn the Presidential Certificate of Honor for (Madam President)
          </p>
          <div className="progress-track">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${(poppedCount / totalBalloons) * 100}%` }}
            />
          </div>
          <span className="score-badge">
            {poppedCount} / {totalBalloons} Sacred Prayers Gathered
          </span>
        </div>

        {/* Floating Prayer Balloons Sky */}
        <div className="balloons-sky">
          {balloons.map((b) => (
            <div
              key={b.id}
              className="balloon-entity"
              onPointerDown={(e) => handlePop(b.id, e)}
              style={{
                width: `${b.size}px`,
                height: `${b.size * 1.25}px`,
                left: `${b.left}%`,
                background: b.color.bg,
                animation: `floatUpward ${b.duration}s linear forwards, balloonSway 2.5s ease-in-out ${b.delay}s infinite alternate`
              }}
            >
              <div className="balloon-thread" />
              <div className="balloon-reflection" />
            </div>
          ))}

          {lastRevealed && (
            <div className="revealed-compliment-pill">
              <span className="compliment-icon">🤲</span>
              <span className="compliment-text">{lastRevealed}</span>
            </div>
          )}
        </div>
      </div>

      {/* Victory Certificate Modal */}
      {showVictory && (
        <div className="modal-overlay">
          <div className="certificate-card">
            <div className="crown-badge-lg">👑</div>
            <div className="cert-tag">Certificate of Sacred Prayers</div>
            <div className="cert-honorific">Bestowed upon</div>
            <h2 className="cert-name">Reeba Aamir</h2>
            <div className="cert-role">(Madam President)</div>
            <p className="cert-desc">
              With deepest reverence and endless duas for your graceful leadership, 
              dignified wisdom, and compassionate heart that continues to illuminate our lives.
            </p>
            <div className="cert-quote">
              "A leader who turns compassion into action, inspiring hearts with poise & purpose."
            </div>
            <div className="modal-buttons">
              <button 
                onClick={handleDownload} 
                className="btn-primary"
                disabled={isDownloading}
              >
                <span>{isDownloading ? '⏳ Generating...' : '📥 Download Certificate'}</span>
              </button>
              <button onClick={handleReplay} className="btn-secondary-outline">
                <span>🔄 Gather Prayers Again</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
