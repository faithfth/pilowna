const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const TNC_SEEN_KEY = 'pilowna_tnc_seen_v1';

let typingAudioCtx = null;

function playTypingSound(character) {
  if (/\s/.test(character)) return;

  try {
    if (!typingAudioCtx) {
      typingAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (typingAudioCtx.state === 'suspended') typingAudioCtx.resume();

    const now = typingAudioCtx.currentTime;
    const oscillator = typingAudioCtx.createOscillator();
    const gain = typingAudioCtx.createGain();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(1250 + Math.random() * 260, now);
    gain.gain.setValueAtTime(0.018, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    oscillator.connect(gain);
    gain.connect(typingAudioCtx.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.04);
  } catch {
    // Audio tidak tersedia, animasi ketikan tetap berjalan.
  }
}

function typeText(element, text, speed = 55) {
  element.textContent = '';
  return new Promise((resolve) => {
    let index = 0;
    const tick = () => {
      const character = text[index++];
      element.textContent += character;
      playTypingSound(character);
      if (index >= text.length) return resolve();
      setTimeout(tick, speed);
    };
    tick();
  });
}

function showApp(onComplete) {
  document.getElementById('terms-screen')?.classList.add('hidden');
  document.getElementById('intro-screen')?.classList.add('hidden');
  document.getElementById('main-app')?.classList.remove('hidden');
  onComplete();
}

function makeAction(label, handler) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'entry-action';
  button.textContent = label;
  button.addEventListener('click', handler);
  return button;
}

async function playIntro(onComplete) {
  const answers = document.getElementById('intro-answers');
  const feedback = document.getElementById('intro-feedback');
  const message = document.getElementById('intro-message');
  const actions = document.getElementById('intro-actions');
  const choiceFeedback = document.getElementById('intro-choice-feedback');
  const inputWrap = document.getElementById('intro-input-wrap');
  const introCopy = document.querySelector('.entry-card--intro .entry-card__text');
  const introTitle = document.querySelector('.entry-card--intro .entry-card__title');
  const introEyebrow = document.querySelector('.entry-card--intro .entry-card__eyebrow');
  if (!answers || !feedback || !message || !actions || !choiceFeedback || !inputWrap) return;

  const hideQuestion = () => {
    introCopy?.classList.add('hidden');
    introTitle?.classList.add('hidden');
    introEyebrow?.classList.add('hidden');
  };

  const continueAfterYes = async () => {
    actions.classList.add('hidden');
    choiceFeedback.textContent = '';
    await typeText(message, 'gitu dongg 😁', 60);
    await wait(700);
    askLoveQuestion();
  };

  const showYesNo = () => {
    actions.innerHTML = '';
    actions.append(
      makeAction('Ya 💕', continueAfterYes),
      makeAction('Tantrum 🤬', async () => {
        await typeText(choiceFeedback, 'nfkjdsnfjkdsnfjkdsnjdsfbjhdfbf', 60);
      }),
    );
    actions.classList.remove('hidden');
  };

  const askLoveQuestion = async () => {
    actions.classList.add('hidden');
    message.classList.remove('intro-message--typewriter');
    await typeText(message, 'kamu sayang aku ga?', 65);
    inputWrap.innerHTML = `
      <div class="intro-input-row">
        <input id="intro-love-input" class="intro-input" type="text" maxlength="80" placeholder="Jawab...">
        <button id="intro-love-submit" class="entry-action" type="button">Kirim 💌</button>
      </div>
      <p id="intro-love-feedback" class="intro-love-feedback" aria-live="polite"></p>
    `;
    inputWrap.classList.remove('hidden');

    const input = document.getElementById('intro-love-input');
    const loveFeedback = document.getElementById('intro-love-feedback');
    const submitLoveAnswer = async () => {
      const answer = input.value.trim().toLowerCase();
      if (!answer) return;

      const loveAnswer = /^(?:(?:iya|ya)\s+)?sayang+$/.test(answer);
      const gCount = (answer.match(/g/g) || []).length;

      if (loveAnswer && gCount < 2) {
        loveFeedback.textContent = 'g nya kurang banyak 😏 Tambahin lagi g nya.';
        loveFeedback.classList.add('entry-feedback--wrong');
        input.value = '';
        input.focus();
        return;
      }

      if (answer === 'iya' || answer === 'ya') {
        loveFeedback.textContent = 'Jawaban yang benar harus ada kata “sayang”. Kata sayangnya mana? 😏';
        loveFeedback.classList.add('entry-feedback--wrong');
        input.value = '';
        input.focus();
        return;
      }

      if (!loveAnswer) {
        loveFeedback.textContent = 'yaudah ga usah di lanjutin 😎';
        loveFeedback.classList.add('entry-feedback--wrong');
        input.value = '';
        input.focus();
        return;
      }

      inputWrap.classList.add('hidden');
      await typeText(message, 'Nah baru keliatan sayangnya 🤣💕', 60);
      await wait(900);
      message.classList.add('intro-message--typewriter');
      await typeText(message, 'aku buatin kamu peliharaan kecil yang bisa kamu rawat, kasih makan, dan temanin kamu setiap hari, peliharaan ini juga akan tumbuh besar seiring waktu, jadi jangan terlantarin dia  karena kalau dalam kurun waktu tertentu dia tidak makan sama sekali, dia akan meninggoy 😭😭😭   .', 45);
      actions.innerHTML = '';
      actions.append(makeAction('Aku paham, masuk 💕', () => {
        showApp(onComplete);
      }));
      actions.classList.remove('hidden');
    };

    document.getElementById('intro-love-submit').addEventListener('click', submitLoveAnswer);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') submitLoveAnswer();
    });
    input.focus();
  };

  answers.querySelectorAll('.entry-answer').forEach((button) => {
    button.addEventListener('click', async () => {
      if (button.dataset.correct !== 'true') {
        feedback.textContent = 'Astoge, bukan itu 😏 bener bener ya kamu';
        feedback.classList.add('entry-feedback--wrong');
        return;
      }

      answers.classList.add('hidden');
      feedback.textContent = '';
      hideQuestion();
      await typeText(message, 'Pinter 🐷🐷 ku', 75);
      await wait(3000);
      message.classList.add('intro-message--typewriter');
      await typeText(message, 'sayang, pertanyaan tolol selanjutnya hanya akan muncul sekali aja, jadi gausah tantrum', 55);
      await wait(500);
      showYesNo();
    });
  });
}

export function initEntryFlow(onComplete) {
  const terms = document.getElementById('terms-screen');
  const intro = document.getElementById('intro-screen');
  const agree = document.getElementById('terms-agree');
  const letter = document.getElementById('terms-letter');
  const letterModal = document.getElementById('terms-letter-modal');
  const letterClose = document.getElementById('terms-letter-close');

  try {
    if (localStorage.getItem(TNC_SEEN_KEY) === 'true') {
      showApp(onComplete);
      return;
    }
  } catch {
    // Kalau storage tidak tersedia, T&C tetap tampil seperti biasa.
  }

  const showIntro = () => {
    terms?.classList.add('hidden');
    intro?.classList.remove('hidden');
    playIntro(onComplete);
  };

  agree?.addEventListener('click', () => {
    try { localStorage.setItem(TNC_SEEN_KEY, 'true'); } catch { /* abaikan */ }
    showIntro();
  }, { once: true });

  letter?.addEventListener('click', () => letterModal?.classList.remove('hidden'));
  letterClose?.addEventListener('click', () => letterModal?.classList.add('hidden'));
  letterModal?.addEventListener('click', (event) => {
    if (event.target === letterModal) letterModal.classList.add('hidden');
  });
}
