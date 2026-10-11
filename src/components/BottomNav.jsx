import React from 'react';

export default function BottomNav({ activeScreen, onSelectScreen }) {
  const tabs = [
    { id: 'screen-3', label: 'Wishes', icon: '💌' },
    { id: 'screen-5', label: 'Certificate', icon: '📜' },
    { id: 'screen-2', label: 'Fireworks', icon: '🎆' },
    { id: 'screen-1', label: 'Candle', icon: '🎂' }
  ];

  return (
    <nav className="bottom-nav-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`tab-btn ${activeScreen === tab.id ? 'active' : ''}`}
          onClick={() => onSelectScreen(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
