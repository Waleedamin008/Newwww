/**
 * Main Application Orchestrator for Reeba Aamir's Birthday Website
 * Foundation: Maqam-e-JOUD
 */
import { WISH_CATEGORIES } from './wishes-data.js';
import { sound } from './audio.js';
import { FireworksEngine } from './fireworks.js';
import { BirthdayGame } from './game.js';

class BirthdayApp {
  constructor() {
    this.currentScreen = 'screen-1';
    this.fireworks = null;
    this.game = null;
    
    // Category viewer state
    this.selectedCategoryIndex = 0;
    this.currentWishIndex = 0;

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    // Screens
    this.screens = {
      'screen-1': document.getElementById('screen-1'),
      'screen-2': document.getElementById('screen-2'),
      'screen-3': document.getElementById('screen-3'),
      'screen-4': document.getElementById('screen-4'),
      'screen-5': document.getElementById('screen-5')
    };

    // Screen 1 elements
    this.countdownOverlay = document.getElementById('countdown-overlay');
    this.countdownNum = document.getElementById('countdown-num');
    this.candleScene = document.getElementById('candle-scene');
    this.flame = document.getElementById('flame');
    this.smokeParticles = document.getElementById('smoke-particles');
    this.btnBlow = document.getElementById('btn-blow');

    // Screen 2 elements
    this.fireworksCanvas = document.getElementById('fireworks-canvas');
    this.fireworksCard = document.getElementById('fireworks-reveal-card');
    this.btnGotoWishes = document.getElementById('btn-goto-wishes');

    // Screen 3 elements
    this.categoriesGrid = document.getElementById('categories-grid');
    this.bannerOpenGame = document.getElementById('banner-open-game');

    // Screen 4 elements
    this.btnBackCategories = document.getElementById('btn-back-categories');
    this.detailCategoryBadge = document.getElementById('detail-category-badge');
    this.detailCategoryTitle = document.getElementById('detail-category-title');
    this.detailCategoryTagline = document.getElementById('detail-category-tagline');
    this.activeWishCard = document.getElementById('active-wish-card');
    this.wishCounter = document.getElementById('wish-counter');
    this.wishQuoteText = document.getElementById('wish-quote-text');
    this.wishAuthorName = document.getElementById('wish-author-name');
    this.btnPrevWish = document.getElementById('btn-prev-wish');
    this.btnNextWish = document.getElementById('btn-next-wish');
    this.wishDotsContainer = document.getElementById('wish-dots-container');
    this.btnLikeWish = document.getElementById('btn-like-wish');
    this.btnCopyWish = document.getElementById('btn-copy-wish');
    this.btnNextCategory = document.getElementById('btn-next-category');

    // Screen 5 elements
    this.gameContainer = document.getElementById('game-container');
    this.btnGameBack = document.getElementById('btn-game-back');

    // Global elements
    this.btnSound = document.getElementById('btn-sound');
    this.soundIcon = document.getElementById('sound-icon');
    this.btnShare = document.getElementById('btn-share');
    this.bottomTabBar = document.getElementById('bottom-tab-bar');
    this.fxLayer = document.getElementById('fx-layer');
  }

  bindEvents() {
    // Sound toggle
    this.btnSound.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      this.soundIcon.textContent = isMuted ? '🔇' : '🎵';
      this.btnSound.style.opacity = isMuted ? '0.6' : '1';
    });

    // Native Share
    this.btnShare.addEventListener('click', () => {
      this.shareWebsite();
    });

    // Screen 1: Blow candle
    this.btnBlow.addEventListener('click', () => {
      this.blowCandle();
    });

    // Screen 2: Go to wishes
    this.btnGotoWishes.addEventListener('click', () => {
      this.switchScreen('screen-3');
      this.bottomTabBar.style.display = 'flex';
      this.updateActiveTab('screen-3');
      sound.startBirthdayMusic();
    });

    // Screen 3: Banner open game
    this.bannerOpenGame.addEventListener('click', () => {
      this.openGame();
    });

    // Screen 4: Navigation
    this.btnBackCategories.addEventListener('click', () => {
      this.switchScreen('screen-3');
      this.updateActiveTab('screen-3');
    });

    this.btnPrevWish.addEventListener('click', () => {
      this.prevWish();
    });

    this.btnNextWish.addEventListener('click', () => {
      this.nextWish();
    });

    this.btnLikeWish.addEventListener('click', (e) => {
      this.spawnFloatingHeart(e.clientX, e.clientY);
      sound.playTwinkleSound(880);
    });

    this.btnCopyWish.addEventListener('click', () => {
      this.copyCurrentWish();
    });

    this.btnNextCategory.addEventListener('click', () => {
      this.selectedCategoryIndex = (this.selectedCategoryIndex + 1) % WISH_CATEGORIES.length;
      this.currentWishIndex = 0;
      this.renderCategoryDetail();
    });

    // Screen 5: Back from game
    this.btnGameBack.addEventListener('click', () => {
      if (this.game) this.game.stop();
      this.switchScreen('screen-3');
      this.updateActiveTab('screen-3');
    });

    // Bottom Tab Bar
    const tabs = this.bottomTabBar.querySelectorAll('.tab-item');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-target');
        if (target === 'screen-5') {
          this.openGame();
        } else {
          if (this.game) this.game.stop();
          this.switchScreen(target);
          if (target === 'screen-2' && this.fireworks) {
            this.fireworks.start();
          }
        }
        this.updateActiveTab(target);
      });
    });

    // Render Categories in Hub
    this.renderCategoriesGrid();

    // Start Screen 1 Countdown Flow
    this.startCountdown();
  }

  // ================= SCREEN 1: COUNTDOWN =================
  startCountdown() {
    let count = 3;
    this.countdownNum.textContent = count;
    sound.playTwinkleSound(440);

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        this.countdownNum.textContent = count;
        sound.playTwinkleSound(440 + (3 - count) * 120);
      } else {
        clearInterval(timer);
        this.countdownOverlay.classList.add('hidden');
        this.candleScene.classList.remove('hidden');
        sound.playTwinkleSound(880);
      }
    }, 1000);
  }

  blowCandle() {
    sound.playBlowSound();

    // Extinguish flame animation
    this.flame.classList.add('extinguished');
    this.btnBlow.disabled = true;
    this.btnBlow.style.opacity = '0.5';

    // Spawn smoke puffs
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const puff = document.createElement('div');
        puff.className = 'smoke-puff';
        puff.style.left = `${(Math.random() - 0.5) * 16}px`;
        this.smokeParticles.appendChild(puff);
        setTimeout(() => puff.remove(), 1600);
      }, i * 180);
    }

    // Transition to Screen 2 (Fireworks) after 1.2s
    setTimeout(() => {
      this.switchScreen('screen-2');
      this.initFireworks();
    }, 1200);
  }

  // ================= SCREEN 2: 3D FIREWORKS =================
  initFireworks() {
    if (!this.fireworks) {
      this.fireworks = new FireworksEngine(this.fireworksCanvas);
      this.fireworks.init();
    }
    this.fireworks.start();

    // Reveal Tribute Card after 2.5s of fireworks grandeur
    setTimeout(() => {
      this.fireworksCard.classList.remove('hidden');
      sound.playTwinkleSound(1046.5); // High C
    }, 2400);
  }

  // ================= SCREEN 3: WISH CATEGORIES HUB =================
  renderCategoriesGrid() {
    this.categoriesGrid.innerHTML = '';
    WISH_CATEGORIES.forEach((cat, index) => {
      const card = document.createElement('div');
      card.className = 'category-card';
      card.innerHTML = `
        <div class="card-left">
          <div class="card-icon-box">${cat.icon}</div>
          <div class="card-content">
            <span class="card-tag">${cat.badge}</span>
            <h3 class="card-title">${cat.title}</h3>
            <p class="card-tagline">${cat.tagline}</p>
          </div>
        </div>
        <div class="card-arrow">→</div>
      `;

      card.addEventListener('click', () => {
        this.openCategory(index);
      });

      this.categoriesGrid.appendChild(card);
    });
  }

  openCategory(index) {
    this.selectedCategoryIndex = index;
    this.currentWishIndex = 0;
    this.renderCategoryDetail();
    this.switchScreen('screen-4');
  }

  // ================= SCREEN 4: CATEGORY WISHES DETAIL =================
  renderCategoryDetail() {
    const category = WISH_CATEGORIES[this.selectedCategoryIndex];
    if (!category) return;

    this.detailCategoryBadge.textContent = category.title;
    this.detailCategoryTitle.textContent = `${category.icon} ${category.title}`;
    this.detailCategoryTagline.textContent = category.tagline;

    this.renderWishCard();
    this.renderWishDots();
  }

  renderWishCard() {
    const category = WISH_CATEGORIES[this.selectedCategoryIndex];
    const wish = category.wishes[this.currentWishIndex];
    if (!wish) return;

    this.wishCounter.textContent = `Wish ${this.currentWishIndex + 1} of ${category.wishes.length}`;
    
    // Smooth card content transition
    this.activeWishCard.style.opacity = '0.3';
    this.activeWishCard.style.transform = 'scale(0.96)';

    setTimeout(() => {
      this.wishQuoteText.textContent = wish.quote;
      this.wishAuthorName.textContent = wish.author;
      this.activeWishCard.style.opacity = '1';
      this.activeWishCard.style.transform = 'scale(1)';
    }, 180);

    // Update dots
    this.updateWishDots();
  }

  renderWishDots() {
    const category = WISH_CATEGORIES[this.selectedCategoryIndex];
    this.wishDotsContainer.innerHTML = '';

    category.wishes.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `dot ${idx === this.currentWishIndex ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        this.currentWishIndex = idx;
        this.renderWishCard();
      });
      this.wishDotsContainer.appendChild(dot);
    });
  }

  updateWishDots() {
    const dots = this.wishDotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.currentWishIndex);
    });
  }

  prevWish() {
    const category = WISH_CATEGORIES[this.selectedCategoryIndex];
    this.currentWishIndex = (this.currentWishIndex - 1 + category.wishes.length) % category.wishes.length;
    this.renderWishCard();
    sound.playTwinkleSound(520);
  }

  nextWish() {
    const category = WISH_CATEGORIES[this.selectedCategoryIndex];
    this.currentWishIndex = (this.currentWishIndex + 1) % category.wishes.length;
    this.renderWishCard();
    sound.playTwinkleSound(660);
  }

  copyCurrentWish() {
    const category = WISH_CATEGORIES[this.selectedCategoryIndex];
    const wish = category.wishes[this.currentWishIndex];
    const textToCopy = `"${wish.quote}"\n— ${wish.author}\n\nHappy Birthday Reeba Aamir! (President, Maqam-e-JOUD Foundation) 👑💖`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.btnCopyWish.textContent = '✓ Copied!';
        setTimeout(() => {
          this.btnCopyWish.textContent = '📋 Copy';
        }, 1800);
      }).catch(() => {
        this.fallbackCopy(textToCopy);
      });
    } else {
      this.fallbackCopy(textToCopy);
    }
  }

  fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      this.btnCopyWish.textContent = '✓ Copied!';
      setTimeout(() => {
        this.btnCopyWish.textContent = '📋 Copy';
      }, 1800);
    } catch (err) {}
    document.body.removeChild(textArea);
  }

  spawnFloatingHeart(clientX, clientY) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = ['💖', '❤️', '✨', '👑', '🌸'][Math.floor(Math.random() * 5)];
    const x = clientX || window.innerWidth / 2;
    const y = clientY || window.innerHeight / 2;
    heart.style.left = `${x - 12}px`;
    heart.style.top = `${y - 12}px`;

    this.fxLayer.appendChild(heart);
    setTimeout(() => heart.remove(), 1400);
  }

  // ================= SCREEN 5: MINI GAME =================
  openGame() {
    this.switchScreen('screen-5');
    this.updateActiveTab('screen-5');
    if (!this.game) {
      this.game = new BirthdayGame(this.gameContainer, () => {});
    }
    this.game.start();
  }

  // ================= GENERAL HELPERS =================
  switchScreen(screenId) {
    // If leaving fireworks screen, stop heavy canvas loop to conserve battery
    if (this.currentScreen === 'screen-2' && screenId !== 'screen-2' && this.fireworks) {
      this.fireworks.stop();
    }

    Object.values(this.screens).forEach(screen => {
      screen.classList.remove('screen-active');
    });

    if (this.screens[screenId]) {
      this.screens[screenId].classList.add('screen-active');
      this.currentScreen = screenId;
    }
  }

  updateActiveTab(screenId) {
    const tabs = this.bottomTabBar.querySelectorAll('.tab-item');
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-target') === screenId);
    });
  }

  shareWebsite() {
    const shareData = {
      title: "Happy Birthday Reeba Aamir! 👑",
      text: "Wishing our inspiring President of Maqam-e-JOUD Foundation, Reeba Aamir, a very Happy Birthday! 🎂✨",
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      this.fallbackCopy(`Happy Birthday Reeba Aamir! President of Foundation Maqam-e-JOUD 👑🎂 ${window.location.href}`);
      alert("Birthday link copied to clipboard! Share it with Reeba! 💖");
    }
  }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new BirthdayApp();
});
