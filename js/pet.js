const STORAGE_KEY = 'pilowna_pet_v2';
const MAX_HUNGER = 100;
const HUNGER_PER_BITE = 20;
const DEATH_DAYS = 183;
const MAX_AGE_MS = 5 * 365.25 * 24 * 60 * 60 * 1000;
const BASE_SCALE = 0.38;
const GROWTH_PER_FED_DAY = 0.01;
const MAX_SCALE = 1.35;
const DAYS_PER_MONTH = 365.25 / 12;
const EVOLUTION_MILESTONES = [
  { month: 1, label: 'Mulai tumbuh' },
  { month: 3, label: 'Telinga mulai terlihat' },
  { month: 6, label: 'Moncong dan kaki mulai terbentuk' },
  { month: 9, label: 'Bulu dan ekor mulai muncul' },
  { month: 12, label: '80% evolusi — sudah jadi anjing muda' },
  { month: 18, label: 'Proporsi tubuh makin dewasa' },
  { month: 24, label: '100% sempurna — anjing dewasa' },
];

const FOODS = ['🍎', '🍇', '🥕', '🍓', '🧁', '🍪'];

const FULL_MESSAGES = [
  'Terima kasih mami pilo udah suapin aku makan, mami juga jangan lupa makan yaa',
  'Mami pilo sayang, aku sayang mami juga! Jangan lupa istirahat yaa 💕',
  'Makasih ya mami, makanannya enak banget! Mami juga harus makan yang bergizi loh~',
  'Perutku udah kenyang nih, tapi cintaku ke mami nggak pernah kenyang! 💖',
  'Mami pilo hebat banget! Hari ini juga semangat ya~ ✨',
  'Nyam nyam~ makasih mami pilo! Jangan lupa minum air putih ya 🥤',
  'Aku bahagia banget punya mami sebaik mami pilo! I love you mami 💕',
];

const CLICK_MESSAGES = [
  'Mami pilo sayang banget sama aku yaa? 💕',
  'Hehe, jangan lupa senyum hari ini ya mami ✨',
  'Makasih udah datang dan klik aku, mami! 🥰',
  'Aku selalu siap nemenin mami kapan pun 💖',
  'Mami pilo adalah orang favoritku! 💞',
  'Peluk virtual dulu buat mami 🤗💕',
  'Kalau dunia terasa berat, klik aku lagi ya mami, biar aku peluk hati mami pakai cinta kecilku 💗',
  'Aku mungkin kecil, tapi rasa sayangku ke mami gede banget—ngalahin ukuran mangkuk makanku 🥰',
  'Mami pilo, senyum dong… senyum mami itu rumah paling nyaman buat aku 💕',
  'Aku tumbuh karena makanan mami, tapi aku bahagia karena kasih sayang mami 💖',
  'Jangan pernah merasa sendirian ya, mami. Aku selalu ada di sini, jadi teman kecil paling setia mami 🐶💞',
  'Mami adalah alasan ekorku bergoyang, bahkan saat aku lagi pura-pura jaim ✨💕',
  'Satu klik dari mami rasanya seperti seribu pelukan buat aku 🤗💗',
  'Aku sayang mami hari ini, besok, dan setiap hari—iya, aku memang seimut itu dan sesayang itu 😚',
  'Terima kasih sudah memilih aku, mami. Dari sekian banyak manusia, mami tetap favoritku selamanya 💝',
  'Kalau cinta bisa digonggong, aku sudah menggonggong paling keras buat bilang: aku sayang mami! 🐾💕',
];

let state = loadState();
let audioCtx = null;
let visitSoundTimer = null;
let isChewing = false;
let _onLoveMessage = null;

const $ = (id) => document.getElementById(id);

export function initPet(onLoveMessage) {
  _onLoveMessage = onLoveMessage;
  applyDayNight();
  setInterval(applyDayNight, 60000);
  processDailyReset();
  checkDeath();
  checkMaxAge();

  renderUI(onLoveMessage);
  setupEgg(onLoveMessage);
  setupNaming(onLoveMessage);
  setupDragDrop(onLoveMessage);
  setupEyeTracking();
  setupPetClick();
  setupSleepCycle();
  scheduleVisitSound();
  setInterval(refreshEvolutionUI, 60000);

  if (state.phase === 'hatched') {
    updatePetVisuals();
    spawnFoodTray();
  }
}

function defaultState() {
  return {
    phase: 'egg',
    name: null,
    nameLocked: false,
    hatchedAt: null,
    lastFedAt: null,
    dailyHunger: 0,
    lastHungerDate: null,
    totalFedDays: 0,
    isDead: false,
    eggTaps: 0,
    fullMessageLog: {},
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayStr() {
  return new Date().toDateString();
}

function processDailyReset() {
  const today = todayStr();
  if (state.lastHungerDate !== today) {
    state.dailyHunger = 0;
    state.lastHungerDate = today;
    saveState();
  }
}

function checkDeath() {
  if (state.phase !== 'hatched' || state.isDead || !state.lastFedAt) return;
  const daysSinceFed = (Date.now() - new Date(state.lastFedAt).getTime()) / 86400000;
  if (daysSinceFed >= DEATH_DAYS) {
    state.isDead = true;
    saveState();
  }
}

function checkMaxAge() {
  if (!state.hatchedAt || state.isDead) return;
  const age = Date.now() - new Date(state.hatchedAt).getTime();
  if (age >= MAX_AGE_MS) {
    state.isDead = true;
    saveState();
  }
}

function getAgeDays() {
  if (!state.hatchedAt) return 0;
  return Math.floor((Date.now() - new Date(state.hatchedAt).getTime()) / 86400000);
}

function getAgeDaysPrecise() {
  if (!state.hatchedAt) return 0;
  return Math.max(0, (Date.now() - new Date(state.hatchedAt).getTime()) / 86400000);
}

function getEvolutionProgress() {
  const ageDays = getAgeDaysPrecise();
  const firstYear = Math.min(ageDays / 365.25, 1) * 0.8;
  if (ageDays <= 365.25) return firstYear;
  const secondYear = Math.min((ageDays - 365.25) / 365.25, 1) * 0.2;
  return Math.min(1, 0.8 + secondYear);
}

function getEvolutionStage() {
  const months = getAgeDaysPrecise() / DAYS_PER_MONTH;
  return Math.min(7, Math.max(0, EVOLUTION_MILESTONES.filter((milestone) => months >= milestone.month).length));
}

function getEvolutionLabel() {
  const stage = getEvolutionStage();
  if (stage === 0) return 'Baru menetas';
  return EVOLUTION_MILESTONES[stage - 1].label;
}

function formatAge() {
  const days = getAgeDays();
  if (days < 30) return `${days} hari`;
  if (days < 365) return `${Math.max(1, Math.floor(days / DAYS_PER_MONTH))} bulan`;
  const years = Math.floor(days / 365);
  const rem = days % 365;
  if (years === 0) return `${days} hari`;
  return rem > 0 ? `${years} tahun ${rem} hari` : `${years} tahun`;
}

function refreshEvolutionUI() {
  if (state.phase !== 'hatched') return;
  $('pet-age').textContent = formatAge();
  $('pet-size-text').textContent = `${Math.round(getScale() * 100)}%`;
  $('pet-evolution').textContent = `Evolusi: ${Math.round(getEvolutionProgress() * 100)}% — ${getEvolutionLabel()}`;
  updatePetVisuals();
}

function getScale() {
  const hungerBoost = (state.dailyHunger / MAX_HUNGER) * 0.06;
  const growth = getEvolutionProgress() * (MAX_SCALE - BASE_SCALE);
  return BASE_SCALE + growth + hungerBoost;
}

function applyDayNight() {
  const hour = new Date().getHours();
  const room = $('pet-room');
  if (!room) return;
  room.classList.remove('time-morning', 'time-afternoon', 'time-night');
  if (hour >= 5 && hour < 12) room.classList.add('time-morning');
  else if (hour >= 12 && hour < 18) room.classList.add('time-afternoon');
  else room.classList.add('time-night');
}

function renderUI(onLoveMessage) {
  const statsEl = $('pet-stats');
  const trayEl = $('food-tray');
  const eggEl = $('pet-egg');
  const petEl = $('pet-creature');
  const nameDisplay = $('pet-name-display');

  if (state.phase === 'egg') {
    statsEl?.classList.add('hidden');
    trayEl?.classList.add('hidden');
    eggEl?.classList.remove('hidden');
    petEl?.classList.add('hidden');
    nameDisplay.textContent = '';
    return;
  }

  eggEl?.classList.add('hidden');
  petEl?.classList.remove('hidden');
  statsEl?.classList.remove('hidden');

  if (!state.isDead) trayEl?.classList.remove('hidden');
  else trayEl?.classList.add('hidden');

  nameDisplay.textContent = state.name ? `${state.name} 💕` : '';
  $('pet-evolution').textContent = `Evolusi: ${Math.round(getEvolutionProgress() * 100)}% — ${getEvolutionLabel()}`;
  $('pet-age').textContent = formatAge();
  $('pet-hunger-bar').style.width = `${state.dailyHunger}%`;
  $('pet-hunger-text').textContent = `${Math.round(state.dailyHunger)}%`;
  $('pet-size-text').textContent = `${Math.round(getScale() * 100)}%`;

  updatePetVisuals();

  if (state.phase === 'hatched' && !state.nameLocked) {
    showNamingModal();
  }
}

function isSleeping() {
  const hour = new Date().getHours();
  return hour >= 4 && hour < 7;
}

function setupSleepCycle() {
  updateSleepState();
  setInterval(updateSleepState, 30000);
}

function updateSleepState() {
  const pet = $('pet-creature');
  const zzz = document.querySelector('.pet__zzz');
  if (!pet || state.phase !== 'hatched' || state.isDead) return;

  if (isSleeping()) {
    pet.classList.add('pet--sleeping');
    zzz?.classList.remove('hidden');
  } else {
    pet.classList.remove('pet--sleeping');
    zzz?.classList.add('hidden');
  }
}

function setupEyeTracking() {
  const room = $('pet-room');
  if (!room) return;

  const track = (x, y) => {
    if (isSleeping() || state.isDead || state.phase !== 'hatched') return;
    updateEyeTracking(x, y);
  };

  document.addEventListener('mousemove', (e) => track(e.clientX, e.clientY));
  document.addEventListener('touchmove', (e) => {
    if (e.touches[0]) track(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  room.addEventListener('touchstart', (e) => {
    if (e.touches[0]) track(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
}

function updateEyeTracking(x, y) {
  document.querySelectorAll('.pet__eye').forEach((eye) => {
    const pupil = eye.querySelector('.pet__pupil');
    if (!pupil) return;
    const rect = eye.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.min(Math.hypot(dx, dy) * 0.12, 10);
    const angle = Math.atan2(dy, dx);
    const px = Math.cos(angle) * dist;
    const py = Math.sin(angle) * dist;
    pupil.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
  });
}

function setupPetClick() {
  const pet = $('pet-creature');
  if (!pet) return;

  pet.addEventListener('click', () => {
    if (state.phase !== 'hatched' || state.isDead || isSleeping()) return;
    playRandomClickSound();
    pet.classList.add('pet--boop');
    setTimeout(() => pet.classList.remove('pet--boop'), 300);
    const message = CLICK_MESSAGES[Math.floor(Math.random() * CLICK_MESSAGES.length)];
    showSpeech(message);
    setTimeout(hideSpeech, 8000);
  });
}

function playRandomClickSound() {
  const variants = ['boop', 'squeak', 'giggle', 'pop', 'chirp', 'bleat'];
  playCuteSound(variants[Math.floor(Math.random() * variants.length)]);
}

function updatePetVisuals() {
  const pet = $('pet-creature');
  if (!pet || state.phase !== 'hatched') return;

  const scale = getScale();
  const evolutionProgress = getEvolutionProgress();
  const evolutionStage = getEvolutionStage();
  pet.style.setProperty('--pet-scale', scale);
  pet.style.setProperty('--evolution-progress', evolutionProgress);
  pet.dataset.evolutionStage = evolutionStage;

  [...pet.classList].forEach((className) => {
    if (className.startsWith('pet--evolution-')) pet.classList.remove(className);
  });
  pet.classList.add(`pet--evolution-${evolutionStage}`);

  pet.classList.remove('pet--normal', 'pet--hungry', 'pet--happy', 'pet--dead', 'pet--chewing', 'pet--mouth-open');

  updateSleepState();

  if (state.isDead) {
    pet.classList.add('pet--dead');
    return;
  }

  if (isSleeping()) return;

  if (isChewing) {
    pet.classList.add('pet--chewing');
    return;
  }

  if (state.dailyHunger >= MAX_HUNGER) {
    pet.classList.add('pet--happy');
  } else if (state.dailyHunger < 40) {
    pet.classList.add('pet--hungry');
  } else {
    pet.classList.add('pet--normal');
  }
}

function setupEgg(onLoveMessage) {
  const egg = $('pet-egg');
  if (!egg) return;

  egg.addEventListener('click', () => {
    if (state.phase !== 'egg') return;

    state.eggTaps++;
    egg.classList.add('egg-shake');
    setTimeout(() => egg.classList.remove('egg-shake'), 400);

    if (state.eggTaps >= 3) {
      hatchEgg(onLoveMessage);
    } else {
      const cracks = ['...', 'retak!', 'hampir!'];
      showSpeech(cracks[state.eggTaps - 1] || '...');
    }
    saveState();
  });
}

function hatchEgg(onLoveMessage) {
  const egg = $('pet-egg');
  egg.classList.add('egg-cracking');

  setTimeout(() => {
    state.phase = 'hatched';
    state.hatchedAt = new Date().toISOString();
    state.lastFedAt = new Date().toISOString();
    state.lastHungerDate = todayStr();
    saveState();

    if (!state.nameLocked) showNamingModal();

    renderUI(onLoveMessage);
    spawnFoodTray();
    showSpeech('Halo mami! 💕');
    playCuteSound('hatch');
  }, 800);
}

function setupNaming(onLoveMessage) {
  $('btn-save-name')?.addEventListener('click', () => {
    const input = $('pet-name-input');
    const name = input?.value.trim();
    if (!name || state.nameLocked) return;

    state.name = name;
    state.nameLocked = true;
    saveState();
    $('naming-modal')?.classList.add('hidden');
    $('pet-name-display').textContent = `${name} 💕`;
    showSpeech(`Namaku ${name}! 🥰`);
  });
}

function showNamingModal() {
  if (state.nameLocked) return;
  $('naming-modal')?.classList.remove('hidden');
  $('pet-name-input')?.focus();
}

function spawnFoodTray() {
  const tray = document.querySelector('.food-tray__items');
  if (!tray || state.isDead) return;
  tray.innerHTML = '';

  FOODS.forEach((emoji) => {
    const food = document.createElement('div');
    food.className = 'food-drag';
    food.textContent = emoji;
    food.dataset.food = emoji;

    food.addEventListener('mousedown', (e) => startFoodDrag(e, food, emoji));
    food.addEventListener('touchstart', (e) => startFoodDrag(e, food, emoji), { passive: false });
    tray.appendChild(food);
  });
}

function startFoodDrag(e, el, emoji) {
  if (state.isDead || state.dailyHunger >= MAX_HUNGER || isSleeping()) return;
  e.preventDefault();

  const clone = document.createElement('div');
  clone.className = 'food-drag food-drag--floating';
  clone.textContent = emoji;
  document.body.appendChild(clone);
  el.classList.add('dragging');

  const pet = $('pet-creature');

  const moveAt = (clientX, clientY) => {
    clone.style.left = `${clientX}px`;
    clone.style.top = `${clientY}px`;
    const near = isNearMouth(clientX, clientY);
    clone.classList.toggle('food-drag--near-mouth', near);
    pet?.classList.toggle('pet--mouth-open', near);
  };

  const getCoords = (ev) => {
    if (ev.touches) return { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
    return { x: ev.clientX, y: ev.clientY };
  };

  const { x, y } = getCoords(e);
  moveAt(x, y);

  const onMove = (ev) => {
    ev.preventDefault();
    const c = getCoords(ev);
    moveAt(c.x, c.y);
  };

  const onEnd = (ev) => {
    const c = ev.changedTouches
      ? { x: ev.changedTouches[0].clientX, y: ev.changedTouches[0].clientY }
      : { x: ev.clientX, y: ev.clientY };

    if (isNearMouth(c.x, c.y)) feedPet(emoji, _onLoveMessage);

    clone.remove();
    el.classList.remove('dragging');
    pet?.classList.remove('pet--mouth-open');
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);
  };

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd);
}

function setupDragDrop(onLoveMessage) {
  _onLoveMessage = onLoveMessage;
}

function getMouthRect() {
  const zone = $('pet-mouth-zone');
  return zone?.getBoundingClientRect();
}

function isNearMouth(x, y) {
  const rect = getMouthRect();
  if (!rect) return false;
  const pad = 40;
  return x >= rect.left - pad && x <= rect.right + pad && y >= rect.top - pad && y <= rect.bottom + pad;
}

async function feedPet(emoji, onLoveMessage) {
  if (state.isDead || state.dailyHunger >= MAX_HUNGER || isChewing || isSleeping()) return;

  isChewing = true;
  const pet = $('pet-creature');
  pet.classList.add('pet--mouth-open', 'pet--chewing');
  showSpeech('Nyam nyam~ 😋');
  playCuteSound('eat');

  await delay(1500);

  state.dailyHunger = Math.min(MAX_HUNGER, state.dailyHunger + HUNGER_PER_BITE);
  state.lastFedAt = new Date().toISOString();

  const wasNotFull = state.dailyHunger - HUNGER_PER_BITE < MAX_HUNGER;
  const nowFull = state.dailyHunger >= MAX_HUNGER;

  if (nowFull && wasNotFull) {
    state.totalFedDays++;
    handleFullMessage(onLoveMessage);
  }

  saveState();
  isChewing = false;
  pet.classList.remove('pet--mouth-open', 'pet--chewing');
  updatePetVisuals();
  renderUI(onLoveMessage);
  hideSpeech();
}

function handleFullMessage(onLoveMessage) {
  const today = todayStr();
  const year = new Date().getFullYear();

  if (!state.fullMessageLog[year]) state.fullMessageLog[year] = {};

  const shownThisYear = Object.keys(state.fullMessageLog[year]);
  let available = FULL_MESSAGES.map((_, i) => i).filter((i) => !state.fullMessageLog[year][i]);

  if (available.length === 0) {
    state.fullMessageLog[year] = {};
    available = FULL_MESSAGES.map((_, i) => i);
  }

  const pick = available[Math.floor(Math.random() * available.length)];
  state.fullMessageLog[year][pick] = today;
  saveState();

  const msg = FULL_MESSAGES[pick];
  showSpeech(msg);
  playCuteSound('happy');

  setTimeout(() => {
    onLoveMessage({
      title: `${state.name || 'Sayang'} Kenyang! 💕`,
      message: msg,
    });
  }, 600);
}

function showSpeech(text) {
  const el = $('pet-speech');
  if (!el) return;
  el.textContent = text;
  el.classList.add('visible');
}

function hideSpeech() {
  $('pet-speech')?.classList.remove('visible');
}

function scheduleVisitSound() {
  if (visitSoundTimer) clearTimeout(visitSoundTimer);
  visitSoundTimer = setTimeout(() => {
    if (state.phase === 'hatched' && !state.isDead) {
      playCuteSound('greeting');
      showSpeech('Halo mami~ 👋');
      setTimeout(hideSpeech, 2500);
    }
  }, 15000);
}

function playCuteSound(type) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioCtx;
    const now = ctx.currentTime;

    const notes = {
      greeting: [523, 659, 784, 1047],
      eat: [440, 554, 659],
      happy: [587, 740, 880, 1175],
      hatch: [392, 523, 659, 784, 1047],
      boop: [600, 750],
      squeak: [880, 1100, 880],
      giggle: [523, 622, 740, 622],
      pop: [400, 600],
      chirp: [1047, 1319],
      bleat: [349, 440, 523],
    };

    (notes[type] || notes.greeting).forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.3);
    });
  } catch {
    /* audio unavailable */
  }
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
