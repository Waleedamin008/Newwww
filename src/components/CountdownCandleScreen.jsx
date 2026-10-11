import React, { useState, useEffect } from 'react';
import { sound } from '../utils/sound';

export default function CountdownCandleScreen({ onComplete }) {
  const [countdown, setCountdown] = useState(3);
  const [counting, setCounting] = useState(true);
  const [isBlown, setIsBlown] = useState(false);
  const [smokePuffs, setSmokePuffs] = useState([]);

  // Countdown timer logic
  useEffect(() => {
    if (countdown > 0) {
      sound.playTwinkleSound(440 + (3 - countdown) * 120);
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCounting(false);
      sound.playTwinkleSound(880);
    }
  }, [countdown]);

  const handleBlow = () => {
    if (isBlown) return;
    setIsBlown(true);
    sound.playBlowSound();

    // Spawn smoke puffs
    const puffs = [];
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        setSmokePuffs(prev => [
          ...prev,
          { id: Date.now() + i, offset: (Math.random() - 0.5) * 14 }
        ]);
      }, i * 160);
    }

    // Transition to Screen 2
    setTimeout(() => {
      onComplete();
    }, 1300);
  };

  return (
    <section className="screen-wrapper candle-stage">
      {counting ? (
        <div className="countdown-box">
          <span className="countdown-sub">A Very Special Celebration</span>
          <h2 className="countdown-title">For (Madam President)</h2>
          <div className="countdown-circle">
            <span className="countdown-num">{countdown}</span>
          </div>
          <p className="countdown-hint">Get ready for your birthday surprise...</p>
        </div>
      ) : (
        <div className="candle-scene">
          <div className="scene-top-text">
            <span className="soft-pill-tag">Make A Wish ✨</span>
            <h1 className="scene-title">Blow the Candle, Reeba!</h1>
            <p className="scene-desc">
              Close your eyes, make your deepest wish, and blow the flame.
            </p>
          </div>

          <div className="cake-graphic">
            <div className="candle-wrapper">
              {/* Flame */}
              <div className={`flame ${isBlown ? 'blown' : ''}`}>
                <div className="flame-halo"></div>
              </div>

              {/* Smoke puffs */}
              <div className="smoke-cloud">
                {smokePuffs.map(puff => (
                  <div 
                    key={puff.id} 
                    className="smoke-particle" 
                    style={{ left: `${puff.offset}px` }}
                  />
                ))}
              </div>

              <div className="candle-wick"></div>
              <div className="candle-stick">
                <div className="candle-stripes"></div>
              </div>
            </div>

            {/* Cake Tiers */}
            <div className="cake-top-tier">
              <div className="drip-drop"></div>
              <div className="drip-drop"></div>
              <div className="drip-drop"></div>
            </div>
            <div className="cake-bottom-tier">
              <div className="rose-band"></div>
            </div>
            <div className="cake-base"></div>
          </div>

          <div className="action-box">
            <button 
              onClick={handleBlow} 
              disabled={isBlown}
              className="btn-primary btn-pulse-glow"
              style={{ opacity: isBlown ? 0.6 : 1 }}
            >
              <span>💨</span>
              <span>Blow the Candle</span>
            </button>
            <p className="action-subtext">Tap the button to extinguish the flame</p>
          </div>
        </div>
      )}
    </section>
  );
}
