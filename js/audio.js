// Audio: plays a recorded file from /audio if one exists (audio/<hanzi>.mp3),
// otherwise falls back to the device's built-in Chinese voice (Web Speech API).

import { store } from './storage.js';

let voices = [];
const fileCache = new Map(); // hanzi -> true/false (file exists)

function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  voices = speechSynthesis.getVoices().filter(v => /^zh[-_](CN|Hans)/i.test(v.lang) || v.lang === 'zh');
  if (!voices.length) voices = speechSynthesis.getVoices().filter(v => /^zh/i.test(v.lang) && !/HK|TW/i.test(v.lang));
}
if ('speechSynthesis' in window) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

export function chineseVoices() { loadVoices(); return voices; }
export function hasSpeech() { return 'speechSynthesis' in window; }

function pickVoice() {
  const uri = store.state.settings.voiceURI;
  return voices.find(v => v.voiceURI === uri)
    || voices.find(v => /Tingting|Xiaoxiao|Yunxi|Google 普通话|Lili|Meijia/i.test(v.name))
    || voices[0];
}

// audio/index.json lists the hanzi that have recorded files, e.g. ["你好", "谢谢"]
fetch('audio/index.json').then(r => (r.ok ? r.json() : [])).then(list => {
  for (const hz of list) fileCache.set(hz, true);
}).catch(() => {});

async function tryFile(hz, slow) {
  const a = new Audio(`audio/${encodeURIComponent(hz)}.mp3`);
  a.playbackRate = slow ? 0.7 : 1;
  try { await a.play(); return true; } catch { return false; }
}

export async function speak(hz, { slow } = {}) {
  const isSlow = slow ?? store.state.settings.slowAudio;
  if (fileCache.get(hz) && await tryFile(hz, isSlow)) return;
  if (!hasSpeech()) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(hz);
  u.lang = 'zh-CN';
  const v = pickVoice();
  if (v) u.voice = v;
  u.rate = isSlow ? 0.55 : 0.85;
  speechSynthesis.speak(u);
}
