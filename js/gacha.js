import { GASHAPON_MESSAGES, CAPSULE_COLORS, CAPSULE_HEARTS } from './gacha-messages.js';

const STORAGE_KEY = 'pilowna_gashapon_v3';
/** Set true untuk batas 1x sehari — false = mode testing */
const DAILY_LIMIT_ENABLED = true;

const machine = () => document.getElementById('gashapon-machine');
const knob = () => document.getElementById('gashapon-knob');
const globeBalls = () => document.getElementById('gashapon-globe-balls');
const scatterLayer = () => document.getElementById('gashapon-scatter');
const burstLayer = () => document.getElementById('gashapon-burst');
const ejectedArea = () => document.getElementById('gashapon-ejected');
const statusEl = () => document.getElementById('gacha-status');
const timerEl = () => document.getElementById('gacha-timer');
const resultEl = () => document.getElementById('gacha-result');
const messageEl = () => document.getElementById('gacha-message');

let isAnimating = false;
let audioCtx = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { usedIndices: [], lastDate: null, todayIndex: null, revealed: false };
  } catch {
    return { usedIndices: [], lastDate: null, todayIndex: null, revealed: false };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayStr() {
  return new Date().toDateString();
}

function pickMessageIndex(state) {
  let available = GASHAPON_MESSAGES.map((_, i) => i).filter((i) => !state.usedIndices.includes(i));

  if (available.length === 0) {
    state.usedIndices = [];
    available = GASHAPON_MESSAGES.map((_, i) => i);
  }

  const pick = available[Math.floor(Math.random() * available.length)];
  state.usedIndices.push(pick);
  return pick;
}

function getCapsuleStyle(index) {
  return {
    color: CAPSULE_COLORS[index % CAPSULE_COLORS.length],
    heart: CAPSULE_HEARTS[index % CAPSULE_HEARTS.length],
  };
}

export function initGacha() {
  renderGlobeBalls();
  restoreState();
  updateUI();

  knob()?.addEventListener('click', handleKnobClick);
  setInterval(updateCountdown, 1000);
}

/** Posisi bola rapat di bagian bawah kaca love */
const REST_POSITIONS = [
  { x: 20, y: 88, s: 0.88 }, { x: 32, y: 91, s: 0.95 }, { x: 44, y: 89, s: 1 },
  { x: 56, y: 90, s: 0.92 }, { x: 68, y: 91, s: 0.9 }, { x: 80, y: 88, s: 0.86 },
  { x: 26, y: 95, s: 0.84 }, { x: 38, y: 96, s: 0.98 }, { x: 50, y: 95, s: 1.02 },
  { x: 62, y: 96, s: 0.94 }, { x: 74, y: 95, s: 0.87 },
  { x: 32, y: 82, s: 0.9 }, { x: 46, y: 81, s: 0.93 }, { x: 58, y: 82, s: 0.88 },
  { x: 70, y: 83, s: 0.85 }, { x: 40, y: 76, s: 0.82 }, { x: 54, y: 75, s: 0.8 },
  { x: 48, y: 86, s: 0.96 }, { x: 22, y: 84, s: 0.83 }, { x: 76, y: 84, s: 0.81 },
];

function renderGlobeBalls() {
  const container = globeBalls();
  if (!container) return;
  container.innerHTML = '';

  REST_POSITIONS.forEach((pos, i) => {
    const cap = createCapsuleElement(i, 'sm');
    cap.style.left = `${pos.x}%`;
    cap.style.top = `${pos.y}%`;
    cap.style.setProperty('--ball-scale', pos.s);
    cap.dataset.ballIndex = i;
    cap.dataset.restX = pos.x;
    cap.dataset.restY = pos.y;
    container.appendChild(cap);
  });
}

function createCapsuleElement(seed, size = 'md') {
  const style = getCapsuleStyle(seed);
  const el = document.createElement('div');
  el.className = `gashapon-capsule gashapon-capsule--${size} gashapon-capsule--heart-shape`;
  el.style.setProperty('--cap-color', style.color);
  el.innerHTML = `<span class="gashapon-capsule__heart">${style.heart}</span>`;
  return el;
}

function canSpinToday(state) {
  if (!DAILY_LIMIT_ENABLED) return true;
  return state.lastDate !== todayStr();
}

function handleKnobClick() {
  if (isAnimating) return;

  const state = loadState();

  if (!canSpinToday(state)) {
    if (state.todayIndex !== null && !state.revealed) {
      statusEl().textContent = 'Klik bola love yang keluar untuk buka pesannya! 💕';
      pulseEjectedBall();
    } else {
      statusEl().textContent = 'Kamu sudah buka gashapon hari ini! 💕';
    }
    return;
  }

  isAnimating = true;
  const msgIndex = pickMessageIndex(state);
  if (DAILY_LIMIT_ENABLED) {
    state.lastDate = todayStr();
  }
  state.todayIndex = msgIndex;
  state.revealed = false;
  saveState(state);
  // Kunci tombol seketika supaya klik beruntun saat animasi berjalan tetap dianggap sudah dipakai.
  if (DAILY_LIMIT_ENABLED) knob()?.setAttribute('disabled', 'true');

  runSpinAnimation(msgIndex);
}

function assignTumbleOffsets(ball, i, total) {
  const spread = 18;
  ball.style.setProperty('--b1x', `${(Math.random() - 0.5) * spread}px`);
  ball.style.setProperty('--b1y', `${-8 - Math.random() * 14}px`);
  ball.style.setProperty('--b2x', `${(Math.random() - 0.5) * spread * 1.2}px`);
  ball.style.setProperty('--b2y', `${-4 - Math.random() * 10}px`);
  ball.style.setProperty('--b3x', `${(Math.random() - 0.5) * spread}px`);
  ball.style.setProperty('--b3y', `${2 + Math.random() * 6}px`);
  ball.style.animationDelay = `${(i % 5) * 0.04}s`;
}

function runSpinAnimation(msgIndex) {
  const m = machine();
  const burst = burstLayer();
  const balls = [...(globeBalls()?.querySelectorAll('.gashapon-capsule') || [])];

  m?.classList.add('gashapon-machine--spinning');
  globeBalls()?.classList.add('gashapon-globe-balls--tumbling');
  statusEl().textContent = 'Bola love saling bertabrakan... 💕';
  resultEl()?.classList.add('hidden');
  ejectedArea().innerHTML = '';
  ejectedArea().classList.add('hidden');
  burst.innerHTML = '';

  playSound('crank');

  const ejectIdx = Math.floor(Math.random() * balls.length);
  const ejectBall = balls[ejectIdx];

  balls.forEach((ball, i) => {
    assignTumbleOffsets(ball, i, balls.length);
    if (ball === ejectBall) {
      ball.classList.add('gashapon-capsule--ejecting');
    } else {
      ball.classList.add('gashapon-capsule--tumbling');
    }
  });

  setTimeout(() => playSound('clatter'), 350);
  setTimeout(() => playSound('clatter'), 650);
  setTimeout(() => playSound('clatter'), 950);

  setTimeout(() => {
    m?.classList.remove('gashapon-machine--spinning');
    globeBalls()?.classList.remove('gashapon-globe-balls--tumbling');

    renderGlobeBalls();
    showEjectedBall(msgIndex);
    playSound('drop');
    statusEl().textContent = 'Klik bola love-nya untuk buka pesan! 💕';
    isAnimating = false;
    updateUI();
  }, 2400);
}

function createBurstHearts(container) {
  if (!container) return;

  for (let i = 0; i < 12; i++) {
    const h = document.createElement('span');
    h.className = 'gashapon-burst-heart';
    h.textContent = CAPSULE_HEARTS[i % CAPSULE_HEARTS.length];
    const angle = (i / 12) * Math.PI * 2;
    h.style.setProperty('--bx', `${Math.cos(angle) * (50 + Math.random() * 40)}px`);
    h.style.setProperty('--by', `${Math.sin(angle) * (50 + Math.random() * 40) - 20}px`);
    h.style.animationDelay = `${0.1 + i * 0.04}s`;
    container.appendChild(h);
  }
}

function showEjectedBall(msgIndex) {
  const ejected = ejectedArea();
  if (!ejected) return;

  const ball = createCapsuleElement(msgIndex, 'lg');
  ball.className += ' gashapon-capsule--ejected gashapon-capsule--clickable';
  ball.setAttribute('role', 'button');
  ball.setAttribute('tabindex', '0');
  ball.setAttribute('aria-label', 'Buka bola love');

  ball.addEventListener('click', () => revealMessage(msgIndex));
  ball.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      revealMessage(msgIndex);
    }
  });

  ejected.innerHTML = '';
  ejected.appendChild(ball);
  ejected.classList.remove('hidden');
}

function pulseEjectedBall() {
  ejectedArea()?.querySelector('.gashapon-capsule--clickable')?.classList.add('gashapon-capsule--pulse');
}

function revealMessage(msgIndex) {
  const state = loadState();
  if (state.revealed && DAILY_LIMIT_ENABLED) return;
  if (state.todayIndex !== msgIndex && DAILY_LIMIT_ENABLED) return;

  state.revealed = true;
  saveState(state);

  const ball = ejectedArea()?.querySelector('.gashapon-capsule--clickable');
  ball?.classList.add('gashapon-capsule--opening');
  playSound('open');

  const burst = burstLayer();
  createBurstHearts(burst);

  setTimeout(() => {
    burst.innerHTML = '';
    ejectedArea()?.classList.add('hidden');
    resultEl()?.classList.remove('hidden');
    messageEl().textContent = GASHAPON_MESSAGES[msgIndex];
    statusEl().textContent = 'Pesan hari ini sudah dibuka! 💕';
    playSound('sparkle');
    updateUI();
  }, 700);
}

function restoreState() {
  if (!DAILY_LIMIT_ENABLED) return;
  const state = loadState();
  if (state.lastDate !== todayStr()) return;

  if (state.revealed && state.todayIndex !== null) {
    resultEl()?.classList.remove('hidden');
    messageEl().textContent = GASHAPON_MESSAGES[state.todayIndex];
  } else if (state.todayIndex !== null) {
    showEjectedBall(state.todayIndex);
    statusEl().textContent = 'Klik bola love-nya untuk buka pesan! 💕';
  }
}

function updateUI() {
  const state = loadState();
  const m = machine();
  const k = knob();

  if (!DAILY_LIMIT_ENABLED) {
    m?.classList.remove('gashapon-machine--used');
    k?.removeAttribute('disabled');
    timerEl().textContent = '';
    return;
  }

  if (state.lastDate === todayStr()) {
    m?.classList.add('gashapon-machine--used');
    k?.setAttribute('disabled', 'true');
    if (state.revealed) {
      statusEl().textContent = 'Gashapon hari ini sudah dibuka! 💕';
    }
  } else {
    m?.classList.remove('gashapon-machine--used');
    k?.removeAttribute('disabled');
    statusEl().textContent = 'Putar tombol gashapon untuk dapat bola love! 💕';
    resultEl()?.classList.add('hidden');
    ejectedArea()?.classList.add('hidden');
  }

  updateCountdown();
}

function updateCountdown() {
  if (!DAILY_LIMIT_ENABLED) {
    timerEl().textContent = '';
    return;
  }
  const state = loadState();
  if (state.lastDate !== todayStr()) {
    timerEl().textContent = '';
    return;
  }

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const diff = tomorrow - now;
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  timerEl().textContent = `Gashapon berikutnya: ${hours}j ${mins}m ${secs}d`;
}

function playSound(type) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioCtx;
    const now = ctx.currentTime;

    const patterns = {
      crank: [{ f: 180, d: 0.08 }, { f: 220, d: 0.08 }, { f: 260, d: 0.1 }],
      clatter: [{ f: 400 + Math.random() * 200, d: 0.05 }],
      drop: [{ f: 330, d: 0.12 }, { f: 220, d: 0.15 }],
      open: [{ f: 523, d: 0.1 }, { f: 659, d: 0.12 }, { f: 784, d: 0.14 }],
      sparkle: [{ f: 880, d: 0.08 }, { f: 1047, d: 0.1 }, { f: 1319, d: 0.12 }],
    };

    let offset = 0;
    (patterns[type] || patterns.crank).forEach(({ f, d }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type === 'clatter' ? 'square' : 'sine';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(type === 'clatter' ? 0.06 : 0.12, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + d + 0.05);
      offset += d * 0.6;
    });
  } catch {
    /* audio unavailable */
  }
}
