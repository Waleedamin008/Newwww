import React from 'react';
import { sound } from '../utils/sound';

export default function Header({ isMuted, setIsMuted }) {
  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="top-nav">
      <div className="brand-badge">
        <span className="brand-dot"></span>
        <span className="brand-text">Reeba Aamir <span className="brand-subtitle">(Madam President)</span></span>
      </div>
      <div className="top-actions">
        <button 
          onClick={toggleSound} 
          className="icon-btn" 
          aria-label="Toggle Sound"
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
          style={{ opacity: isMuted ? 0.6 : 1 }}
        >
          <span>{isMuted ? '🔇' : '🎵'}</span>
        </button>
      </div>
    </header>
  );
}
