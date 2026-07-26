document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. Loading Screen Controller --- */
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const loadingScreen = document.getElementById('loading-screen');
  let progress = 0;

  const loadingInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 6;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
      }, 400);
    }
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText) progressText.innerText = `${progress}%`;
  }, 100);

  /* --- 2. Canvas Particle & Firework Engine --- */
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.radius = Math.random() * 3 + 1;
      this.velocity = {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8
      };
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.005;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }

    update() {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.velocity.y += 0.05; // gravity
      this.alpha -= this.decay;
    }
  }

  function createBurst(x, y) {
    const colors = ['#fbbf24', '#7c3aed', '#2563eb', '#ec4899', '#38bdf8'];
    for (let i = 0; i < 40; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push(new Particle(x, y, color));
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle, index) => {
      if (particle.alpha <= 0) {
        particles.splice(index, 1);
      } else {
        particle.update();
        particle.draw();
      }
    });
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  function triggerCelebration() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height * 0.5);
    createBurst(x, y);
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }

  /* --- 3. Music Player Engine --- */
  const musicBtn = document.getElementById('music-btn');
  const musicIcon = document.getElementById('music-icon');
  const bgMusic = document.getElementById('bg-music');
  let isPlaying = false;

  if (musicBtn && bgMusic) {
    musicBtn.addEventListener('click', () => {
      if (isPlaying) {
        bgMusic.pause();
        musicIcon.innerText = '🎵';
      } else {
        bgMusic.play().catch(() => {});
        musicIcon.innerText = '⏸️';
      }
      isPlaying = !isPlaying;
    });
  }

  /* --- 4. Live Countdown --- */
  const targetDate = new Date('August 12, 2026 00:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      const timerElem = document.getElementById('countdown-timer');
      const msgElem = document.getElementById('birthday-msg');
      if (timerElem) timerElem.classList.add('hidden');
      if (msgElem) msgElem.classList.remove('hidden');
      triggerCelebration();
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const dElem = document.getElementById('days');
    const hElem = document.getElementById('hours');
    const mElem = document.getElementById('minutes');
    const sElem = document.getElementById('seconds');

    if (dElem) dElem.innerText = String(days).padStart(2, '0');
    if (hElem) hElem.innerText = String(hours).padStart(2, '0');
    if (mElem) mElem.innerText = String(minutes).padStart(2, '0');
    if (sElem) sElem.innerText = String(seconds).padStart(2, '0');
  }
  setInterval(updateCountdown, 1000);

  /* --- 5. Interactive Cake --- */
  const flame = document.getElementById('flame');
  const blowBtn = document.getElementById('blow-btn');

  if (blowBtn && flame) {
    blowBtn.addEventListener('click', () => {
      flame.classList.add('off');
      blowBtn.innerText = 'Candles Blown! ✨';
      triggerCelebration();
    });
  }

  /* --- 6. Secret Envelope Letter & Typewriter --- */
  const envelope = document.getElementById('envelope');
  const letterText = document.getElementById('letter-text');
  let letterOpened = false;

  const fullLetterMessage = `Dear Shyam,\n\nHappy 18th Birthday!\n\nToday is your special day, and I just want to say thank you for being an amazing friend. I hope your future is filled with success, happiness, good health, and unforgettable memories.\n\nKeep smiling, keep dreaming, and never stop believing in yourself.\n\nEnjoy every moment of your birthday.\n\nHappy Birthday once again!\n\n— Your Friend, Avinash ❤️`;

  if (envelope) {
    envelope.addEventListener('click', () => {
      envelope.classList.toggle('open');
      if (!letterOpened && letterText) {
        letterOpened = true;
        typeWriter(fullLetterMessage, 0);
      }
    });
  }

  function typeWriter(text, index) {
    if (index < text.length) {
      letterText.innerHTML += text.charAt(index) === '\n' ? '<br>' : text.charAt(index);
      setTimeout(() => typeWriter(text, index + 1), 30);
    }
  }

  /* --- 7. Gallery & Lightbox --- */
  const galleryImages = document.querySelectorAll('.gallery-item img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeLightbox = document.querySelector('.close-lightbox');

  galleryImages.forEach(img => {
    img.addEventListener('click', () => {
      if (lightbox && lightboxImg) {
        lightbox.style.display = 'flex';
        lightboxImg.src = img.src;
      }
    });
  });

  if (closeLightbox) {
    closeLightbox.addEventListener('click', () => {
      lightbox.style.display = 'none';
    });
  }

  /* --- 8. Surprise Gift Modal --- */
  const giftBox = document.getElementById('gift-box');
  const giftModal = document.getElementById('gift-modal');
  const closeModal = document.querySelector('.close-modal');

  if (giftBox) {
    giftBox.addEventListener('click', () => {
      if (giftModal) giftModal.style.display = 'flex';
      triggerCelebration();
    });
  }

  if (closeModal) {
    closeModal.addEventListener('click', () => {
      giftModal.style.display = 'none';
    });
  }

  /* --- 9. Floating Atmosphere Particle System --- */
  const floatingContainer = document.getElementById('floating-elements-container');
  const floatIcons = ['✨', '⭐', '💖', '🎈'];

  function createFloatingElement() {
    if (!floatingContainer) return;
    const element = document.createElement('div');
    element.classList.add('floating-item');
    element.innerText = floatIcons[Math.floor(Math.random() * floatIcons.length)];
    element.style.left = `${Math.random() * 100}vw`;
    element.style.animationDuration = `${7 + Math.random() * 6}s`;
    floatingContainer.appendChild(element);

    setTimeout(() => {
      element.remove();
    }, 12000);
  }
  setInterval(createFloatingElement, 1200);
});
