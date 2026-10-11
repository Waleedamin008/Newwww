import React from 'react';
import { WISH_CATEGORIES } from '../data/wishes';
import { sound } from '../utils/sound';

export default function CategoriesScreen({ onSelectCategory, onOpenGame }) {
  const handleCategoryClick = (index) => {
    sound.playTwinkleSound(660);
    onSelectCategory(index);
  };

  return (
    <section className="screen-wrapper categories-screen">
      <div className="hub-top-header">
        <span className="soft-pill-tag">Treasury of Blessings</span>
        <h2 className="hub-main-title">Special Birthday Wishes</h2>
        <p className="hub-desc">
          Curated tributes & sacred prayers dedicated to <strong>Reeba Aamir (Madam President)</strong>
        </p>
      </div>

      <div className="categories-stack">
        {WISH_CATEGORIES.map((cat, idx) => (
          <div
            key={cat.id}
            className="cat-glass-card"
            onClick={() => handleCategoryClick(idx)}
            style={{ borderLeft: `4px solid ${cat.borderColor}` }}
          >
            <div className="cat-card-left">
              <div 
                className="cat-icon-disc" 
                style={{ backgroundColor: cat.accentColor }}
              >
                {cat.icon}
              </div>
              <div className="cat-info-block">
                <span className="cat-badge-text">{cat.badge}</span>
                <h3 className="cat-title-text">{cat.title}</h3>
                <p className="cat-tagline-text">{cat.tagline}</p>
              </div>
            </div>
            <div className="cat-arrow-disc">→</div>
          </div>
        ))}
      </div>

      {/* Certificate of Prayers Promo Strip */}
      <div className="game-promo-strip" onClick={onOpenGame}>
        <div className="promo-balloon-icon">📜</div>
        <div className="promo-texts">
          <h4>Earn the Certificate of Prayers</h4>
          <p>Gather the sacred prayers of blessings to unveil the Presidential Certificate of Honor</p>
        </div>
        <button 
          type="button" 
          className="btn-pill-action"
          onClick={(e) => {
            e.stopPropagation();
            onOpenGame();
          }}
        >
          Unlock Certificate
        </button>
      </div>
    </section>
  );
}
