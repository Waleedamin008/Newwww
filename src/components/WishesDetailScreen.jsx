import React, { useState, useRef } from 'react';
import { WISH_CATEGORIES } from '../data/wishes';
import { sound } from '../utils/sound';

export default function WishesDetailScreen({ categoryIndex, onBack, onNextCategory }) {
  const [wishIndex, setWishIndex] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [slideDirection, setSlideDirection] = useState('');

  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  const category = WISH_CATEGORIES[categoryIndex] || WISH_CATEGORIES[0];
  const currentWish = category.wishes[wishIndex] || category.wishes[0];

  const handlePrev = () => {
    sound.playTwinkleSound(520);
    setSlideDirection('slide-right');
    setWishIndex((prev) => (prev - 1 + category.wishes.length) % category.wishes.length);
    setTimeout(() => setSlideDirection(''), 300);
  };

  const handleNext = () => {
    sound.playTwinkleSound(660);
    setSlideDirection('slide-left');
    setWishIndex((prev) => (prev + 1) % category.wishes.length);
    setTimeout(() => setSlideDirection(''), 300);
  };

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    
    // Ensure horizontal swipe is dominant and exceeds 40px threshold
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handleHeartClick = (e) => {
    sound.playTwinkleSound(880);
    const rect = e.currentTarget.getBoundingClientRect();
    const newHeart = {
      id: Date.now() + Math.random(),
      x: rect.left + rect.width / 2,
      y: rect.top,
      emoji: ['💖', '❤️', '🌸', '✨', '👑'][Math.floor(Math.random() * 5)]
    };

    setFloatingHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1400);
  };

  return (
    <section className="screen-wrapper wishes-detail-screen">
      {/* Flying Hearts Layer */}
      {floatingHearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart-el"
          style={{ left: `${h.x}px`, top: `${h.y}px` }}
        >
          {h.emoji}
        </span>
      ))}

      {/* Top Nav Header */}
      <div className="detail-header-wrapper">
        <div className="detail-nav-header">
          <button onClick={onBack} className="btn-back-nav" aria-label="Back to Categories">
            <span className="back-arrow">←</span>
            <span className="back-text-full">Back to Categories</span>
            <span className="back-text-short">Categories</span>
          </button>
          <span className="cat-pill-indicator" title={category.title}>{category.title}</span>
        </div>

        <div className="detail-title-group">
          <h2>{category.icon} {category.title}</h2>
          <p>{category.tagline}</p>
        </div>
      </div>

      {/* Wish Card with Touch-Swipe Enabled */}
      <div className="wish-card-container">
        <div 
          className={`delicate-wish-card ${slideDirection}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="wish-card-top">
            <span className="wish-index-pill">
              Wish {wishIndex + 1} of {category.wishes.length}
            </span>
            <button 
              onClick={handleHeartClick} 
              className="heart-reaction-btn" 
              title="Send Love"
              aria-label="Send Love Reaction"
            >
              💖
            </button>
          </div>

          <div className="quote-mark">“</div>
          <p className="quote-passage">{currentWish.quote}</p>

          <div className="wish-card-bottom">
            <div className="author-block">
              <span className="author-label">Tribute From:</span>
              <span className="author-name">{currentWish.author}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Next Category */}
      <div className="detail-bottom-controls">
        <div className="slider-controls">
          <button onClick={handlePrev} className="nav-arrow-btn" aria-label="Previous Wish">
            ‹
          </button>
          <div className="dots-row">
            {category.wishes.map((_, idx) => (
              <span
                key={idx}
                className={`slider-dot ${idx === wishIndex ? 'active' : ''}`}
                onClick={() => setWishIndex(idx)}
                aria-label={`Go to wish ${idx + 1}`}
              />
            ))}
          </div>
          <button onClick={handleNext} className="nav-arrow-btn" aria-label="Next Wish">
            ›
          </button>
        </div>

        <div className="swipe-hint-pill">
          <span>👈</span>
          <span>Swipe card or tap arrows</span>
          <span>👉</span>
        </div>

        <button onClick={onNextCategory} className="btn-secondary-outline">
          Next Category →
        </button>
      </div>
    </section>
  );
}
