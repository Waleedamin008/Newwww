/**
 * Interactive Birthday Mini-Game:
 * "Pop the Balloons of Blessings & Reveal Royal Tributes"
 */
import { BALLOON_BLESSINGS } from './wishes-data.js';
import { sound } from './audio.js';

export class BirthdayGame {
  constructor(container, onComplete) {
    this.container = container;
    this.onComplete = onComplete;
    this.balloons = [];
    this.poppedCount = 0;
    this.totalBalloons = BALLOON_BLESSINGS.length;
    this.isRunning = false;
    this.spawnTimer = null;
    this.unlockedBlessings = [];

    this.balloonColors = [
      { bg: 'linear-gradient(135deg, #FF6B6B, #EE5253)', border: '#FF7675' },
      { bg: 'linear-gradient(135deg, #F368E0, #FF9FF3)', border: '#FDA7DF' },
      { bg: 'linear-gradient(135deg, #00D2D3, #01A3A4)', border: '#48DBFB' },
      { bg: 'linear-gradient(135deg, #FECA57, #FF9F43)', border: '#FDCB6E' },
      { bg: 'linear-gradient(135deg, #54A0FF, #2E86DE)', border: '#74B9FF' },
      { bg: 'linear-gradient(135deg, #5F27CD, #341F97)', border: '#A29BFE' },
      { bg: 'linear-gradient(135deg, #1DD1A1, #10AC84)', border: '#55EFC4' }
    ];
  }

  start() {
    this.isRunning = true;
    this.poppedCount = 0;
    this.unlockedBlessings = [];
    this.renderLayout();
    this.spawnLoop();
  }

  stop() {
    this.isRunning = false;
    if (this.spawnTimer) clearTimeout(this.spawnTimer);
    const area = this.container.querySelector('.balloon-area');
    if (area) area.innerHTML = '';
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="game-wrapper">
        <div class="game-header">
          <div class="game-badge">🎈 Interactive Birthday Special</div>
          <h2 class="game-title">Pop the Balloons of Blessings!</h2>
          <p class="game-subtitle">Tap floating balloons to collect special birthday tributes & unlock your Royal Honor</p>
          <div class="game-progress-bar-container">
            <div class="game-progress-fill" id="game-progress" style="width: 0%"></div>
          </div>
          <div class="game-score-badge">
            <span id="game-score">0</span> / ${this.totalBalloons} Tributes Collected
          </div>
        </div>

        <div class="balloon-area" id="balloon-area"></div>

        <div class="last-revealed-card" id="last-revealed" style="display: none;">
          <div class="revealed-icon">✨</div>
          <div class="revealed-text" id="revealed-text"></div>
        </div>
      </div>
    `;
  }

  spawnLoop() {
    if (!this.isRunning) return;

    if (this.poppedCount < this.totalBalloons) {
      const activeBalloons = this.container.querySelectorAll('.balloon-item');
      if (activeBalloons.length < 5) {
        this.spawnBalloon();
      }
    }

    const nextDelay = 800 + Math.random() * 1000;
    this.spawnTimer = setTimeout(() => this.spawnLoop(), nextDelay);
  }

  spawnBalloon() {
    const area = this.container.querySelector('#balloon-area');
    if (!area) return;

    const balloon = document.createElement('div');
    balloon.className = 'balloon-item';

    const color = this.balloonColors[Math.floor(Math.random() * this.balloonColors.length)];
    const size = 65 + Math.floor(Math.random() * 25);
    const leftPercent = 8 + Math.floor(Math.random() * 80);
    const floatDuration = 6 + Math.random() * 3.5;
    const swayDelay = Math.random() * 2;

    balloon.style.width = `${size}px`;
    balloon.style.height = `${size * 1.25}px`;
    balloon.style.left = `${leftPercent}%`;
    balloon.style.background = color.bg;
    balloon.style.animation = `floatUp ${floatDuration}s linear forwards, sway 2.5s ease-in-out ${swayDelay}s infinite alternate`;

    // String under balloon
    const string = document.createElement('div');
    string.className = 'balloon-string';
    balloon.appendChild(string);

    // Inner highlight reflection
    const shine = document.createElement('div');
    shine.className = 'balloon-shine';
    balloon.appendChild(shine);

    // Pop event (pointerdown for instant touch response)
    const onPop = (e) => {
      e.stopPropagation();
      this.popBalloon(balloon, e.clientX, e.clientY);
    };

    balloon.addEventListener('pointerdown', onPop);

    // Remove when floated off-screen
    balloon.addEventListener('animationend', (e) => {
      if (e.animationName === 'floatUp' && balloon.parentNode) {
        balloon.remove();
      }
    });

    area.appendChild(balloon);
  }

  popBalloon(balloonEl, clickX, clickY) {
    if (!balloonEl.parentNode) return;

    const rect = balloonEl.getBoundingClientRect();
    const x = clickX || rect.left + rect.width / 2;
    const y = clickY || rect.top + rect.height / 2;

    balloonEl.remove();
    sound.playPopSound();
    sound.playTwinkleSound(600 + Math.random() * 400);

    // Spawn burst confetti particles at position
    this.createConfettiBurst(x, y);

    // Reveal next blessing
    if (this.poppedCount < this.totalBalloons) {
      const blessing = BALLOON_BLESSINGS[this.poppedCount];
      this.unlockedBlessings.push(blessing);
      this.poppedCount++;

      this.updateProgress();
      this.displayRevealedBlessing(blessing);

      if (this.poppedCount === this.totalBalloons) {
        setTimeout(() => this.showVictoryModal(), 900);
      }
    }
  }

  updateProgress() {
    const progressEl = this.container.querySelector('#game-progress');
    const scoreEl = this.container.querySelector('#game-score');
    if (progressEl) {
      const pct = (this.poppedCount / this.totalBalloons) * 100;
      progressEl.style.width = `${pct}%`;
    }
    if (scoreEl) {
      scoreEl.textContent = this.poppedCount;
    }
  }

  displayRevealedBlessing(text) {
    const card = this.container.querySelector('#last-revealed');
    const textEl = this.container.querySelector('#revealed-text');
    if (card && textEl) {
      card.style.display = 'flex';
      textEl.textContent = text;
      card.classList.remove('pulse-in');
      void card.offsetWidth; // trigger reflow
      card.classList.add('pulse-in');
    }
  }

  createConfettiBurst(x, y) {
    const colors = ['#FFD700', '#FF69B4', '#00FFFF', '#FF4500', '#32CD32', '#FFF'];
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('div');
      p.className = 'mini-confetti-particle';
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;

      const angle = (Math.PI * 2 / 24) * i + (Math.random() * 0.4);
      const velocity = 50 + Math.random() * 90;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);
      document.body.appendChild(p);

      setTimeout(() => p.remove(), 750);
    }
  }

  showVictoryModal() {
    sound.startBirthdayMusic();
    const modal = document.createElement('div');
    modal.className = 'victory-modal-overlay';
    modal.innerHTML = `
      <div class="victory-card">
        <div class="crown-icon">👑</div>
        <div class="victory-tag">Certificate of Honor</div>
        <h3 class="victory-title">To Our Beloved President</h3>
        <h2 class="victory-name">Reeba Aamir</h2>
        <p class="victory-desc">
          On behalf of Foundation <strong>"Maqam-e-JOUD"</strong> and every heart you inspire, 
          we crown your birthday with utmost gratitude, everlasting prayers, and pure love.
        </p>
        <div class="tribute-quote">
          "A leader who turns compassion into action and dreams into reality."
        </div>
        <div class="victory-actions">
          <button class="btn-royal" id="btn-replay">🎈 Play Again</button>
          <button class="btn-gold-outline" id="btn-share-tribute">💖 Share Tribute</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#btn-replay').addEventListener('click', () => {
      modal.remove();
      this.start();
    });

    modal.querySelector('#btn-share-tribute').addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: "Happy Birthday Reeba Aamir!",
          text: "Wishing our inspiring President of Maqam-e-JOUD Foundation, Reeba Aamir, a very Happy Birthday! 👑✨",
          url: window.location.href
        }).catch(() => {});
      } else {
        alert("Wishing Reeba Aamir a magnificent Birthday full of blessings and triumphs! 👑💖");
      }
    });
  }
}
