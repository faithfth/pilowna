import { initBubbles } from './bubbles.js';
import { initPet } from './pet.js';
import { initChat } from './chat.js';
// Query versi memaksa browser memuat aturan batas harian terbaru.
import { initGacha } from './gacha.js?v=daily-limit-1';
import { initEntryFlow } from './entry.js';

function showModal({ title, message }) {
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-message').textContent = message;
  overlay.classList.remove('hidden');
}

function hideModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

function initNavigation() {
  const buttons = document.querySelectorAll('.nav__btn');
  const sections = document.querySelectorAll('.section');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.section;

      buttons.forEach((b) => b.classList.remove('nav__btn--active'));
      btn.classList.add('nav__btn--active');

      sections.forEach((sec) => {
        sec.classList.toggle('section--active', sec.id === `section-${target}`);
      });
    });
  });

  buttons[0]?.classList.add('nav__btn--active');
}

function getRelationshipStartDate() {
  const key = 'pilowna_relationship_start_v1';
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const saved = localStorage.getItem(key);
    if (saved) return new Date(`${saved}T00:00:00`);

    const start = new Date(today);
    start.setDate(start.getDate() - 7);
    localStorage.setItem(key, start.toISOString().slice(0, 10));
    return start;
  } catch {
    const start = new Date(today);
    start.setDate(start.getDate() - 7);
    return start;
  }
}

function getRelationshipDays() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = getRelationshipStartDate();
  start.setHours(0, 0, 0, 0);
  return Math.max(1, Math.floor((today - start) / 86400000) + 1);
}

function initPilownaEasterEgg() {
  const title = document.getElementById('pilowna-title');
  if (!title) return;

  let clickCount = 0;
  title.addEventListener('click', () => {
    clickCount += 1;
    title.classList.add('header__title--clicked');
    setTimeout(() => title.classList.remove('header__title--clicked'), 220);

    if (clickCount < 8) return;
    clickCount = 0;
    const days = getRelationshipDays();
    showModal({
      title: `💊 ${days} Hari Bareng Kamu 💕`,
      message: `Selamat ya, kita sudah menjalani ${days} hari yang isinya campur aduk: ketawa, gemas, sedikit drama, tapi tetap saling pilih. Besok hitungannya nambah lagi—jadi jangan kabur 😏💖`,
    });
  });
}

function initApp() {
  initBubbles();
  initNavigation();
  initPilownaEasterEgg();
  initPet(showModal);
  initChat(showModal);
  initGacha();

  document.getElementById('modal-close')?.addEventListener('click', hideModal);
  document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') hideModal();
  });
}

document.addEventListener('DOMContentLoaded', () => initEntryFlow(initApp));
