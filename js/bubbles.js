const HEARTS = ['💕', '💖', '💗', '💓', '💞', '❤️', '🩷'];
const RED_HEARTS = ['❤️', '❤️', '♥️', '❤️'];
const CORNERS = ['tl', 'tr', 'bl', 'br'];
const BUBBLES_PER_CORNER = 5;
const PHOTO_HEARTS = [
  'assets/pilo1.png',
  'assets/pilo2.png',
  'assets/pilo3.jpeg',
  'assets/pilo4.jpeg',
  'assets/pilo5.jpeg',
  'assets/pilo6.png',
  'assets/pilo7.jpeg',
];
const SIZES = [
  { cls: 'love-bubble--xs', px: 28, font: '0.85rem' },
  { cls: 'love-bubble--sm', px: 36, font: '1.1rem' },
  { cls: 'love-bubble--md', px: 48, font: '1.4rem' },
  { cls: 'love-bubble--lg', px: 58, font: '1.7rem' },
  { cls: 'love-bubble--xl', px: 68, font: '2rem' },
];

const CORNER_OFFSETS = {
  tl: (i) => i === 0
    ? { top: '8px', left: '8px' }
    : { top: `${8 + (i - 1) * 18}px`, left: `${132 + ((i - 1) % 2) * 20}px` },
  tr: (i) => i === 0
    ? { top: '8px', right: '8px' }
    : { top: `${8 + (i - 1) * 18}px`, right: `${132 + ((i - 1) % 2) * 20}px` },
  bl: (i) => ({ bottom: `${8 + i * 14}px`, left: `${8 + (i % 3) * 18}px` }),
  br: (i) => ({ bottom: `${8 + i * 14}px`, right: `${8 + (i % 3) * 18}px` }),
};

export function initBubbles() {
  const container = document.getElementById('bubble-container');
  if (!container) return;

  initPhotoHeartGallery();

  CORNERS.forEach((corner) => {
    const bubbleCount = BUBBLES_PER_CORNER;
    for (let i = 0; i < bubbleCount; i++) {
      createBubble(container, corner, i);
    }
  });
}

function initPhotoHeartGallery() {
  const gallery = document.getElementById('photo-heart-gallery__items');
  if (!gallery) return;

  PHOTO_HEARTS.slice(2).forEach((src, index) => {
    const image = document.createElement('img');
    image.className = 'photo-heart-gallery__item';
    image.src = src;
    image.alt = `Foto love ${index + 3}`;
    image.loading = 'lazy';
    image.style.animationDelay = `${index * 0.18}s`;
    gallery.appendChild(image);
  });
}

function createBubble(container, corner, index) {
  const size = SIZES[index % SIZES.length];
  const bubble = document.createElement('div');
  bubble.className = `love-bubble ${size.cls}`;
  const isTopCorner = corner === 'tl' || corner === 'tr';
  const imageSrc = index === 0 && (corner === 'tl' || corner === 'tr')
      ? (corner === 'tl' ? PHOTO_HEARTS[0] : PHOTO_HEARTS[1])
      : null;

  if (imageSrc) {
    bubble.classList.add('love-bubble--image');
    const image = document.createElement('img');
    image.src = imageSrc;
    image.alt = 'Foto berbentuk love';
    bubble.appendChild(image);
  } else {
    const hearts = isTopCorner ? RED_HEARTS : HEARTS;
    bubble.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  }

  bubble.dataset.corner = corner;
  bubble.dataset.index = index;
  const bubbleSize = imageSrc ? 112 : size.px;
  bubble.style.width = `${bubbleSize}px`;
  bubble.style.height = `${bubbleSize}px`;
  bubble.style.fontSize = imageSrc ? '2rem' : size.font;

  const offsets = CORNER_OFFSETS[corner](index);
  Object.assign(bubble.style, offsets);
  bubble.style.animationDelay = `${index * 0.4 + Math.random() * 2}s`;

  container.appendChild(bubble);
  scheduleExplode(bubble, container, index);
}

function scheduleExplode(bubble, container, index) {
  const baseDelay = 3000 + index * 1800 + Math.random() * 4000;

  setTimeout(() => {
    if (!bubble.parentElement) return;
    explodeBubble(bubble, container);
  }, baseDelay);
}

function explodeBubble(bubble, container) {
  const rect = bubble.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const corner = bubble.dataset.corner;
  const index = parseInt(bubble.dataset.index, 10);

  bubble.classList.add('exploding');

  const particleCount = 6 + Math.floor(rect.width / 10);
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span');
    particle.className = 'bubble-particle';
    particle.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    particle.style.fontSize = `${0.6 + Math.random() * 0.6}rem`;

    const angle = (i / particleCount) * Math.PI * 2;
    const distance = 30 + Math.random() * 50;
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
    particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);

    container.appendChild(particle);
    setTimeout(() => particle.remove(), 900);
  }

  setTimeout(() => {
    bubble.remove();
    const respawnDelay = 600 + Math.random() * 2000;
    setTimeout(() => createBubble(container, corner, index), respawnDelay);
  }, 600);
}
