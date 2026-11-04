// Progress, spaced repetition and settings, kept in localStorage on this device.

const KEY = 'zhongwen-progress-v1';
const DAY = 24 * 60 * 60 * 1000;
// Leitner boxes: days until the next review for each box
const INTERVALS = [0, 1, 2, 4, 7, 15, 30, 60];

const defaults = () => ({
  version: 1,
  completed: {},          // lessonId -> { date, accuracy }
  srs: {},                // wordId -> { box, due }
  writing: {},            // char -> times written correctly
  settings: { toneColors: true, slowAudio: false, voiceURI: '' },
  streak: { last: '', count: 0 },
});

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const data = JSON.parse(raw);
    const d = defaults();
    return { ...d, ...data, settings: { ...d.settings, ...(data.settings || {}) } };
  } catch {
    return defaults();
  }
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full or blocked */ }
}

export const store = {
  get state() { return state; },

  isDone(lessonId) { return !!state.completed[lessonId]; },

  completeLesson(lessonId, accuracy, wordIds) {
    const prev = state.completed[lessonId];
    state.completed[lessonId] = { date: Date.now(), accuracy: Math.max(accuracy, prev?.accuracy || 0) };
    for (const id of wordIds) if (!state.srs[id]) state.srs[id] = { box: 1, due: Date.now() + DAY };
    bumpStreak();
    save();
  },

  review(wordId, correct) {
    const item = state.srs[wordId] || { box: 0, due: 0 };
    item.box = correct ? Math.min(item.box + 1, INTERVALS.length - 1) : 1;
    item.due = Date.now() + (correct ? INTERVALS[item.box] * DAY : 10 * 60 * 1000);
    state.srs[wordId] = item;
    save();
  },

  dueWordIds(now = Date.now()) {
    return Object.entries(state.srs).filter(([, v]) => v.due <= now).map(([k]) => k);
  },

  learnedWordIds() { return Object.keys(state.srs); },

  wroteChar(ch) { state.writing[ch] = (state.writing[ch] || 0) + 1; save(); },

  setSetting(k, v) { state.settings[k] = v; save(); },

  exportJSON() { return JSON.stringify(state, null, 2); },

  importJSON(text) {
    const data = JSON.parse(text);
    if (!data || typeof data !== 'object' || !data.completed) throw new Error('Not a progress file');
    state = { ...defaults(), ...data, settings: { ...defaults().settings, ...(data.settings || {}) } };
    save();
  },

  reset() { state = defaults(); save(); },
};

function bumpStreak() {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - DAY).toDateString();
  if (state.streak.last === today) return;
  state.streak.count = state.streak.last === yesterday ? state.streak.count + 1 : 1;
  state.streak.last = today;
}
