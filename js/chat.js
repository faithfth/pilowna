import {
  CHAT_CONFIG,
  INTENTS,
  RESPONSES,
  QUICK_REPLIES,
  SWEET_TRIGGERS,
} from './chat-data.js';

const $ = (id) => document.getElementById(id);

/** State machine */
const STATES = {
  IDLE: 'idle',
  COMFORT: 'comfort',
  COMFORT_DEEP: 'comfort_deep',
  ASKED_FOLLOWUP: 'asked_followup',
};

let chatState = STATES.IDLE;
let comfortCount = 0;
let isTyping = false;
let onSweetMessage = null;

function loadMemory() {
  try {
    const raw = localStorage.getItem(CHAT_CONFIG.storageKey);
    return raw
      ? { visitCount: 0, lastMood: null, lastIntent: null, messages: [], ...JSON.parse(raw) }
      : { visitCount: 0, lastMood: null, lastIntent: null, messages: [] };
  } catch {
    return { visitCount: 0, lastMood: null, lastIntent: null, messages: [] };
  }
}

function saveMemory(mem) {
  localStorage.setItem(CHAT_CONFIG.storageKey, JSON.stringify(mem));
}

function normalize(text) {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

function fillTemplate(text) {
  return text.replace(/\{nickname\}/g, CHAT_CONFIG.userNickname);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickFreshResponse(pool, memory) {
  if (!pool?.length) return RESPONSES.default[0];
  const recentBotTexts = (memory.messages || [])
    .filter((message) => message.role === 'bot')
    .slice(-4)
    .map((message) => message.text);
  const fresh = pool.filter((response) => !recentBotTexts.includes(response));
  return pickRandom(fresh.length ? fresh : pool);
}

/** Deteksi intent dari input — skor keyword + sinonim */
function detectIntent(text) {
  const norm = normalize(text);
  let best = { intent: 'default', score: 0 };

  for (const [intent, cfg] of Object.entries(INTENTS)) {
    let score = 0;
    for (const kw of cfg.keywords) {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = kw.includes(' ')
        ? norm.includes(kw)
        : new RegExp(`(^|\\s)${escaped}($|\\s|[?!.,])`).test(norm);
      if (matches) {
        score += cfg.weight + (norm === kw ? 2 : 1);
      }
    }
    if (score > best.score) {
      best = { intent, score };
    }
  }

  return best.intent;
}

function getResponse(intent, memory) {
  const stateResponses = resolveStateResponse(intent, memory);
  if (stateResponses) return pickFreshResponse(stateResponses, memory);

  if (intent === 'default') {
    const previousIntent = memory.lastIntent;
    if (previousIntent === 'sad') return pickFreshResponse([...RESPONSES.sad_followup, ...RESPONSES.sad_deep], memory);
    if (previousIntent === 'anxious') return pickFreshResponse(RESPONSES.anxious, memory);
    if (previousIntent === 'lonely') return pickFreshResponse(RESPONSES.lonely, memory);
    if (['work', 'study', 'relationship', 'family'].includes(previousIntent)) {
      return pickFreshResponse([
        ...RESPONSES[previousIntent],
        'Aku masih ngikutin ceritamu. Bagian mana yang paling ingin kamu bereskan dulu? 🤍',
        'Aku dengerin kok. Kalau kamu siap, lanjutkan dari bagian yang paling mengganjal ya 💕',
      ], memory);
    }
  }

  const pool = RESPONSES[intent] || RESPONSES.default;
  return pickFreshResponse(pool, memory);
}

function resolveStateResponse(intent, memory) {
  if (chatState === STATES.COMFORT && (intent === 'yes' || intent === 'sad' || intent === 'help')) {
    chatState = STATES.COMFORT_DEEP;
    comfortCount++;
    return RESPONSES.sad_deep;
  }

  if (chatState === STATES.COMFORT && intent === 'no') {
    chatState = STATES.IDLE;
    return RESPONSES.no;
  }

  if (chatState === STATES.ASKED_FOLLOWUP && intent !== 'default') {
    chatState = STATES.COMFORT_DEEP;
    comfortCount++;
    return RESPONSES.sad_deep;
  }

  if (intent === 'sad') {
    chatState = STATES.COMFORT;
    comfortCount++;
    memory.lastMood = 'sad';
    setTimeout(() => {
      if (chatState === STATES.COMFORT) {
        chatState = STATES.ASKED_FOLLOWUP;
        addBotMessage(pickRandom(RESPONSES.sad_followup), false);
      }
    }, 1800);
    return RESPONSES.sad;
  }

  if (intent === 'tired') memory.lastMood = 'tired';
  if (intent === 'happy') memory.lastMood = 'happy';

  if (chatState === STATES.COMFORT_DEEP && (intent === 'thanks' || intent === 'happy')) {
    chatState = STATES.IDLE;
    maybeTriggerSweet();
    return [...RESPONSES.thanks, ...RESPONSES.comfort_close];
  }

  return null;
}

function maybeTriggerSweet() {
  if (comfortCount >= SWEET_TRIGGERS.afterComfortMessages && onSweetMessage) {
    const sweet = pickRandom(SWEET_TRIGGERS.sweetMessages);
    setTimeout(() => {
      onSweetMessage({
        title: sweet.title,
        message: fillTemplate(sweet.message),
      });
    }, 1200);
    comfortCount = 0;
  }
}

function createBubble(text, isUser) {
  const div = document.createElement('div');
  div.className = `chat-bubble ${isUser ? 'chat-bubble--user' : 'chat-bubble--bot'}`;

  if (!isUser) {
    const avatar = document.createElement('span');
    avatar.className = 'chat-bubble__avatar';
    avatar.textContent = CHAT_CONFIG.botEmoji;
    div.appendChild(avatar);
  }

  const content = document.createElement('div');
  content.className = 'chat-bubble__content';
  content.textContent = text;
  div.appendChild(content);

  return div;
}

function createTypingIndicator() {
  const div = document.createElement('div');
  div.className = 'chat-bubble chat-bubble--bot chat-bubble--typing';
  div.id = 'chat-typing';
  div.innerHTML = `
    <span class="chat-bubble__avatar">${CHAT_CONFIG.botEmoji}</span>
    <div class="chat-bubble__content chat-typing">
      <span></span><span></span><span></span>
    </div>
  `;
  return div;
}

function scrollToBottom() {
  const log = $('chat-log');
  if (log) log.scrollTop = log.scrollHeight;
}

function addUserMessage(text) {
  const log = $('chat-log');
  log?.appendChild(createBubble(text, true));
  scrollToBottom();
}

function addBotMessage(text, animate = true) {
  const log = $('chat-log');
  if (!log || isTyping) return;

  if (!animate) {
    log.appendChild(createBubble(fillTemplate(text), false));
    scrollToBottom();
    return;
  }

  isTyping = true;
  const typing = createTypingIndicator();
  log.appendChild(typing);
  scrollToBottom();

  const delay = Math.min(2000, 600 + text.length * 25);

  setTimeout(() => {
    typing.remove();
    log.appendChild(createBubble(fillTemplate(text), false));
    scrollToBottom();
    isTyping = false;
  }, delay);
}

function processInput(text) {
  if (!text.trim() || isTyping) return;

  const memory = loadMemory();
  memory.messages = (memory.messages || []).slice(-30);
  memory.messages.push({ role: 'user', text, ts: Date.now() });
  saveMemory(memory);

  addUserMessage(text);

  const intent = detectIntent(text);
  const reply = getResponse(intent, memory);
  memory.lastIntent = intent;
  
  memory.messages.push({ role: 'bot', text: reply, intent, ts: Date.now() });
  saveMemory(memory);

  addBotMessage(reply);
}

function renderQuickReplies() {
  const container = $('chat-quick-replies');
  if (!container) return;
  container.innerHTML = '';

  QUICK_REPLIES.forEach((label) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chat-quick-reply';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      $('chat-input').value = label;
      sendMessage();
    });
    container.appendChild(btn);
  });
}

function sendMessage() {
  const input = $('chat-input');
  const text = input?.value.trim();
  if (!text) return;
  input.value = '';
  processInput(text);
}

function welcomeMessage() {
  const memory = loadMemory();
  memory.visitCount = (memory.visitCount || 0) + 1;
  saveMemory(memory);

  const pool = memory.visitCount > 1 ? RESPONSES.greeting_return : RESPONSES.greeting;
  setTimeout(() => addBotMessage(pickRandom(pool)), 400);
}

function restoreHistory() {
  const memory = loadMemory();
  const log = $('chat-log');
  if (!log || !memory.messages?.length) return false;

  memory.messages.slice(-12).forEach((msg) => {
    if (msg.role === 'user') {
      log.appendChild(createBubble(msg.text, true));
    } else {
      log.appendChild(createBubble(fillTemplate(msg.text), false));
    }
  });
  scrollToBottom();
  return true;
}

export function initChat(onSweet) {
  onSweetMessage = onSweet;

  renderQuickReplies();

  if (!restoreHistory()) {
    welcomeMessage();
  }

  $('chat-send')?.addEventListener('click', sendMessage);
  $('chat-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}
