import { MODULES, allLessons, lessonById, courseWords, toWord, SOUND_PY } from './course.js';
import { TOPICS, buildDictionary } from './dictionary.js';
import { store } from './storage.js';
import { speak, chineseVoices, hasSpeech } from './audio.js';
import { Writer } from './writer.js';
import { rubyHtml, pinyinHtml, colorizeText, toneContour, parseSentence, sentenceRuby, sentenceText, sentencePinyin, shuffle, sample, escapeHtml, stripTones } from './util.js';

const $ = (sel, root = document) => root.querySelector(sel);
const view = $('#view');
const tabs = $('#tabs');

const COURSE_WORDS = courseWords();
const DICT = buildDictionary(COURSE_WORDS);
const WORD_BY_ID = new Map([...DICT, ...COURSE_WORDS].map(w => [w.id, w]));
let STROKE_CHARS = new Set();
fetch('data/chars/index.json').then(r => r.json()).then(list => { STROKE_CHARS = new Set(list); }).catch(() => {});

const SPEAKER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const SLOW = '<span class="slow-ico">0.5×</span>';
const ICON = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
  pen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1-4.5L15.5 5a2.1 2.1 0 0 1 3 3L8 18.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2.5" fill="currentColor"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

function applySettings() {
  document.body.classList.toggle('tone-colors', !!store.state.settings.toneColors);
}
applySettings();

// ---------- Router ----------
let cleanup = null;
function route() {
  if (cleanup) { cleanup(); cleanup = null; }
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  const hash = location.hash.slice(1) || '/';
  const [, page, arg, arg2] = hash.split('/');
  const inLesson = page === 'lesson' || page === 'session';
  tabs.hidden = inLesson;
  document.body.classList.toggle('in-lesson', inLesson);
  const tab = { word: 'dictionary', write: 'none', session: 'review', lesson: 'learn' }[page] || page || 'learn';
  for (const a of tabs.querySelectorAll('a')) a.classList.toggle('active', a.dataset.tab === tab);
  window.scrollTo(0, 0);
  const a = arg ? decodeURIComponent(arg) : '';
  switch (page) {
    case 'lesson': return renderLesson(a);
    case 'review': return renderReviewHome();
    case 'session': return renderReviewSession(a);
    case 'dictionary': return renderDictionary();
    case 'word': return renderWord(a);
    case 'write': return renderWritePractice(a, Number(arg2) || 0);
    case 'settings': return renderSettings();
    default: return renderHome();
  }
}
window.addEventListener('hashchange', route);

// ---------- Helpers ----------
function lessonUnlocked(id) {
  if (store.state.settings.unlockAll) return true;
  const list = allLessons();
  const i = list.findIndex(l => l.id === id);
  return i === 0 || (i > 0 && store.isDone(list[i - 1].id));
}

function nextLesson() {
  return allLessons().find(l => !store.isDone(l.id));
}

function playBtn(hz, { cls = '', label = '' } = {}) {
  return `<button class="play ${cls}" data-say="${escapeHtml(hz)}" aria-label="Play ${escapeHtml(hz)}">${SPEAKER}${label}</button>`;
}

function slowBtn(hz) {
  return `<button class="play slow" data-say="${escapeHtml(hz)}" data-slow="1" aria-label="Play slowly">${SLOW}</button>`;
}

view.addEventListener('click', e => {
  const b = e.target.closest('[data-say]');
  if (b) { e.preventDefault(); e.stopPropagation(); speak(b.dataset.say, b.dataset.slow ? { slow: true } : {}); }
});

function wordsUpTo(lessonId) {
  const out = [];
  for (const l of allLessons()) {
    for (const w of l.words || []) out.push(toWord(w, l.id));
    if (l.id === lessonId) break;
  }
  return out;
}

// ---------- Home / course map ----------
function renderHome() {
  const next = nextLesson();
  const done = allLessons().filter(l => store.isDone(l.id)).length;
  const total = allLessons().length;
  const due = store.dueWordIds().length;
  const streak = store.state.streak;
  const streakNow = streak.last === new Date().toDateString() || streak.last === new Date(Date.now() - 864e5).toDateString() ? streak.count : 0;

  let html = `
    <header class="top">
      <div>
        <h1 class="brand">${rubyHtml('中文', 'zhōng wén')} <span>Chinese from Zero</span></h1>
        <p class="muted">${done} of ${total} lessons done${streakNow ? ` · ${streakNow}-day streak` : ''}</p>
      </div>
    </header>`;

  if (next) {
    html += `<a class="hero" href="#/lesson/${next.id}">
      <span class="hero-k">${done ? 'Continue' : 'Start here'}</span>
      <span class="hero-t">Lesson ${next.id} · ${escapeHtml(next.title)}</span>
      <span class="hero-go">Go →</span></a>`;
  }
  if (due) html += `<a class="due-banner" href="#/review">${due} word${due > 1 ? 's' : ''} ready for review</a>`;

  for (const m of MODULES) {
    const mDone = m.lessons.length && m.lessons.every(l => store.isDone(l.id));
    html += `<section class="module ${m.soon ? 'soon' : ''}">
      <div class="module-head">
        <span class="module-n">${m.id.slice(1)}</span>
        <div><h2>${escapeHtml(m.title)} ${mDone ? `<span class="tick">${ICON.check}</span>` : ''}</h2><p class="muted">${escapeHtml(m.goal)}</p></div>
      </div>`;
    if (m.soon) {
      html += `<p class="soon-note">Coming soon</p>`;
    } else {
      html += '<ol class="lessons">';
      for (const l of m.lessons) {
        const isDone = store.isDone(l.id);
        const open = lessonUnlocked(l.id);
        const state = isDone ? 'done' : open ? 'open' : 'locked';
        const icon = isDone ? ICON.check : open ? ICON.play : ICON.lock;
        const inner = `<span class="l-ico">${icon}</span><span class="l-id">${l.id}</span><span class="l-t">${escapeHtml(l.title)}</span>`;
        html += `<li class="${state}">${open ? `<a href="#/lesson/${l.id}">${inner}</a>` : `<div>${inner}</div>`}</li>`;
      }
      html += '</ol>';
    }
    html += '</section>';
  }
  view.innerHTML = html;
}

// ---------- Lesson player ----------
function renderLesson(id) {
  const lesson = lessonById(id);
  if (!lesson) { location.hash = '#/'; return; }
  if (!lessonUnlocked(id)) {
    view.innerHTML = `<div class="center-msg"><p>Finish the previous lesson first.</p><a class="btn" href="#/">Back to lessons</a></div>`;
    return;
  }
  const steps = buildLessonSteps(lesson);
  runPlayer(steps, {
    title: `${lesson.id} · ${lesson.title}`,
    onFinish: ({ accuracy }) => {
      const ids = lesson.kind === 'sounds' ? [] : (lesson.words || []).map(w => w[0]);
      store.completeLesson(lesson.id, accuracy, ids);
      const nxt = nextLesson();
      return { lesson, accuracy, next: nxt };
    },
  });
}

function buildLessonSteps(lesson) {
  if (lesson.kind === 'sounds') return buildSoundSteps(lesson);
  if (lesson.kind === 'review') return buildReviewLessonSteps(lesson);

  const words = lesson.words.map(w => toWord(w, lesson.id));
  const pool = wordsUpTo(lesson.id);
  const steps = [];

  // 1. warm-up review of earlier words that are due
  const due = store.dueWordIds().map(i => WORD_BY_ID.get(i)).filter(w => w && w.lessonId !== lesson.id);
  for (const w of sample(due, 4)) steps.push(mcqStep(randomWordQuestion(w, pool), { review: w.id, warmup: true }));

  // 2. new words
  steps.push(infoStep(`<p class="kicker">New words</p><h2>${escapeHtml(lesson.title)}</h2><p class="muted">${words.length} new words. Tap any word to hear it again.</p>`));
  for (const w of words) steps.push(wordCardStep(w));

  // 3. pattern
  if (lesson.pattern) steps.push(patternStep(lesson.pattern));

  // 4. practice
  const ex = [];
  for (const w of words) ex.push(mcqStep(randomWordQuestion(w, pool)));
  ex.push(matchStep(sample(words, Math.min(4, words.length))));
  for (const [s, en] of sample(lesson.pattern?.examples || [], 2)) ex.push(buildStep(s, en, pool));
  steps.push(...shuffle(ex));

  // 5. write
  for (const ch of lesson.write || []) steps.push(writeStep(ch, lesson.writeNote?.includes(ch) ? lesson.writeNote : ''));

  // 6. dialogue
  if (lesson.dialogue) steps.push(dialogueStep(lesson.dialogue));
  return steps;
}

function buildSoundSteps(lesson) {
  const steps = [];
  const tipRow = ([k, v, tone]) => tone
    ? `<dt class="tone-dt t${tone}">${toneContour(tone)}<span>${escapeHtml(k)}</span></dt><dd>${colorizeText(v)}</dd>`
    : `<dt>${colorizeText(k)}</dt><dd>${colorizeText(v)}</dd>`;
  steps.push(infoStep(`<p class="kicker">Sounds</p><h2>${escapeHtml(lesson.title)}</h2><p>${colorizeText(lesson.intro)}</p>
    <dl class="tips">${lesson.tips.map(tipRow).join('')}</dl>
    ${lesson.colorNote ? `<p class="muted small color-note">${escapeHtml(lesson.colorNote)}</p>` : ''}`));
  steps.push(soundGridStep(lesson.sounds));

  const ex = [];
  for (const set of lesson.toneSets || []) {
    for (const target of sample(set, 2)) {
      ex.push(mcqStep({
        prompt: `<p class="q">Which tone do you hear?</p>${playBtn(target, { cls: 'big' })}`,
        autoplay: target,
        options: set.map(c => ({ html: pinyinHtml(SOUND_PY[c]), correct: c === target, say: c })),
        reveal: `${rubyHtml(target, SOUND_PY[target])}`,
      }));
    }
  }
  for (const pair of lesson.pairs || []) {
    const target = pair[Math.floor(Math.random() * 2)];
    ex.push(mcqStep({
      prompt: `<p class="q">Which one do you hear?</p>${playBtn(target, { cls: 'big' })}`,
      autoplay: target,
      options: pair.map(c => ({ html: pinyinHtml(SOUND_PY[c]), correct: c === target, say: c })),
      reveal: rubyHtml(target, SOUND_PY[target]),
    }));
  }
  for (const [hz, right, wrong] of lesson.choices || []) {
    ex.push(mcqStep({
      prompt: `<p class="q">How is it actually pronounced?</p><div class="prompt-hz">${escapeHtml(hz)}</div>${playBtn(hz, { cls: 'big' })}`,
      autoplay: hz,
      options: shuffle([right, ...wrong]).map(p => ({ html: pinyinHtml(p), correct: p === right })),
      reveal: `<span class="py-big">${pinyinHtml(right)}</span>`,
    }));
  }
  // general "pick the sound you hear" from the lesson's samples
  const singles = lesson.sounds.filter(s => [...s[1]].length === 1);
  for (const target of sample(singles, Math.max(0, 10 - ex.length))) {
    const others = sample(singles.filter(s => s !== target), 3);
    ex.push(mcqStep({
      prompt: `<p class="q">Which sound is it?</p>${playBtn(target[1], { cls: 'big' })}`,
      autoplay: target[1],
      options: shuffle([target, ...others]).map(s => ({ html: pinyinHtml(s[0]), correct: s === target, say: s[1] })),
      reveal: `${rubyHtml(target[1], target[0])} <span class="muted">${escapeHtml(target[2])}</span>`,
    }));
  }
  steps.push(...shuffle(ex));
  return steps;
}

function buildReviewLessonSteps(lesson) {
  const words = lesson.reviewOf.flatMap(id => (lessonById(id).words || []).map(w => toWord(w, id)));
  const steps = [infoStep(`<p class="kicker">Review</p><h2>${escapeHtml(lesson.title)}</h2><p>${colorizeText(lesson.intro)}</p>`)];
  const ex = sample(words, 10).map(w => mcqStep(randomWordQuestion(w, words)));
  ex.push(matchStep(sample(words, 4)));
  ex.push(matchStep(sample(words, 4)));
  const sentences = lesson.reviewOf.flatMap(id => lessonById(id).pattern?.examples || []);
  for (const [s, en] of sample(sentences, 3)) ex.push(buildStep(s, en, words));
  steps.push(...shuffle(ex));
  for (const ch of sample(lesson.write, 4)) steps.push(writeStep(ch, 'Write it from memory: try hiding the outline.'));
  steps.push(dialogueStep(lesson.dialogue));
  return steps;
}

/** Pick a question type for a word: listen→meaning, hanzi→meaning, meaning→hanzi. */
function randomWordQuestion(w, pool) {
  const others = sample(pool.filter(o => o.id !== w.id && o.hz !== w.hz && o.en !== w.en), 3);
  while (others.length < 3) {
    const extra = DICT[Math.floor(Math.random() * DICT.length)];
    if (extra.hz !== w.hz && !others.includes(extra)) others.push(extra);
  }
  const opts = shuffle([w, ...others]);
  const type = ['listen', 'read', 'recall'][Math.floor(Math.random() * 3)];
  const reveal = `${rubyHtml(w.hz, w.py)} <span class="muted">${escapeHtml(w.en)}</span>`;
  if (type === 'listen') {
    return { prompt: `<p class="q">What does this mean?</p>${playBtn(w.hz, { cls: 'big' })}`, autoplay: w.hz,
      options: opts.map(o => ({ html: escapeHtml(o.en), correct: o === w })), reveal };
  }
  if (type === 'read') {
    return { prompt: `<p class="q">What does this mean?</p><div class="prompt-hz">${rubyHtml(w.hz, w.py)}</div>${playBtn(w.hz)}`, autoplay: w.hz,
      options: opts.map(o => ({ html: escapeHtml(o.en), correct: o === w })), reveal };
  }
  return { prompt: `<p class="q">Choose the Chinese for</p><div class="prompt-en">“${escapeHtml(w.en)}”</div>`,
    options: opts.map(o => ({ html: `<span class="opt-hz">${rubyHtml(o.hz, o.py)}</span>`, correct: o === w, say: o.hz })), reveal, sayAfter: w.hz };
}

// ----- Step factories. Each step: { kind, scored, render(box, ctx) } ; ctx.done(correct) -----
function infoStep(html) {
  return { kind: 'info', render(box, ctx) { box.innerHTML = `<div class="card info">${html}</div>`; ctx.continueBtn(); } };
}

function wordCardStep(w) {
  return {
    kind: 'word',
    render(box, ctx) {
      box.innerHTML = `<div class="card word-card">
        <div class="wc-hz">${rubyHtml(w.hz, w.py)}</div>
        <div class="wc-py">${pinyinHtml(w.py)}</div>
        <div class="wc-en">${escapeHtml(w.en)}</div>
        <div class="row-c">${playBtn(w.hz, { cls: 'big' })}${slowBtn(w.hz)}</div>
      </div>`;
      setTimeout(() => speak(w.hz), 250);
      ctx.continueBtn();
    },
  };
}

function soundGridStep(sounds) {
  return {
    kind: 'info',
    render(box, ctx) {
      box.innerHTML = `<div class="card"><p class="kicker">Listen & repeat</p><p class="muted">Tap each sound and say it out loud.</p>
        <div class="sound-grid">${sounds.map(([py, hz, en]) => `<button class="sound" data-say="${hz}"><span class="s-py">${pinyinHtml(py)}</span><span class="s-hz">${hz}</span><span class="s-en">${escapeHtml(en)}</span></button>`).join('')}</div></div>`;
      ctx.continueBtn();
    },
  };
}

function patternStep(p) {
  return {
    kind: 'info',
    render(box, ctx) {
      box.innerHTML = `<div class="card"><p class="kicker">Pattern</p><h2 class="pattern-t">${escapeHtml(p.title)}</h2><p>${colorizeText(p.note)}</p>
        <ul class="examples">${p.examples.map(([s, en]) => {
          const t = parseSentence(s);
          return `<li><div class="ex-zh">${sentenceRuby(t)}</div><div class="ex-en">${escapeHtml(en)}</div>${playBtn(sentenceText(t))}</li>`;
        }).join('')}</ul></div>`;
      ctx.continueBtn();
    },
  };
}

function mcqStep(q, { review = null, warmup = false } = {}) {
  return {
    kind: 'mcq', scored: true, review,
    render(box, ctx) {
      q = { ...q, options: shuffle(q.options) }; // new order on every attempt
      box.innerHTML = `<div class="card q-card">${warmup ? '<p class="kicker">Warm-up review</p>' : ''}${q.prompt}
        <div class="options ${q.options.length === 2 ? 'two' : ''}">${q.options.map((o, i) => `<button class="opt" data-i="${i}">${o.html}</button>`).join('')}</div></div>`;
      if (q.autoplay) setTimeout(() => speak(q.autoplay), 300);
      let answered = false;
      box.querySelector('.options').addEventListener('click', e => {
        const b = e.target.closest('.opt');
        if (!b || answered) return;
        const o = q.options[Number(b.dataset.i)];
        if (o.say && !q.autoplay) speak(o.say);
        answered = true;
        const ok = o.correct;
        b.classList.add(ok ? 'right' : 'wrong');
        if (!ok) box.querySelectorAll('.opt').forEach((x, i) => q.options[i].correct && x.classList.add('right'));
        if (q.sayAfter && ok) speak(q.sayAfter);
        ctx.feedback(ok, q.reveal);
      });
    },
  };
}

function matchStep(words) {
  return {
    kind: 'match', scored: true,
    render(box, ctx) {
      const left = shuffle(words), right = shuffle(words);
      box.innerHTML = `<div class="card q-card"><p class="q">Match the pairs</p><div class="match">
        <div class="col">${left.map(w => `<button class="m" data-id="${w.id}" data-side="l">${rubyHtml(w.hz, w.py)}</button>`).join('')}</div>
        <div class="col">${right.map(w => `<button class="m" data-id="${w.id}" data-side="r">${escapeHtml(w.en)}</button>`).join('')}</div>
      </div></div>`;
      let sel = null, errors = 0, matched = 0;
      box.querySelector('.match').addEventListener('click', e => {
        const b = e.target.closest('.m');
        if (!b || b.disabled) return;
        if (b.dataset.side === 'l') speak(WORD_BY_ID.get(b.dataset.id)?.hz || b.textContent);
        if (!sel || sel.dataset.side === b.dataset.side) {
          box.querySelectorAll('.m.sel').forEach(x => x.classList.remove('sel'));
          sel = b; b.classList.add('sel'); return;
        }
        if (sel.dataset.id === b.dataset.id) {
          for (const x of [sel, b]) { x.classList.remove('sel'); x.classList.add('ok'); x.disabled = true; }
          matched++;
          if (matched === words.length) ctx.feedback(errors === 0, null, { silentWrong: true });
        } else {
          errors++;
          const a = sel;
          for (const x of [a, b]) { x.classList.add('bad'); setTimeout(() => x.classList.remove('bad', 'sel'), 450); }
        }
        sel = null;
      });
    },
  };
}

function buildStep(sentence, en, pool) {
  const tokens = parseSentence(sentence);
  const wordsOnly = tokens.filter(t => !t.punct);
  return {
    kind: 'build', scored: true,
    render(box, ctx) {
      const distractors = sample(pool.filter(w => !wordsOnly.some(t => t.hz === w.hz)), 2).map(w => ({ hz: w.hz, py: w.py }));
      const bank = shuffle([...wordsOnly, ...distractors]).map((t, i) => ({ ...t, i }));
      box.innerHTML = `<div class="card q-card"><p class="q">Build the sentence</p><div class="prompt-en">“${escapeHtml(en)}”</div>
        <div class="answer" aria-live="polite"></div>
        <div class="bank">${bank.map(t => `<button class="tile" data-i="${t.i}" data-pos="${wordsOnly.indexOf(wordsOnly.find(w => w.hz === t.hz && w.py === t.py))}">${rubyHtml(t.hz, t.py)}</button>`).join('')}</div>
        <button class="btn check" disabled>Check</button></div>`;
      const ans = box.querySelector('.answer');
      const check = box.querySelector('.check');
      const chosen = [];
      box.querySelector('.bank').addEventListener('click', e => {
        const b = e.target.closest('.tile'); if (!b || b.disabled) return;
        const t = bank[Number(b.dataset.i)];
        speak(t.hz);
        chosen.push(t); b.disabled = true;
        const a = document.createElement('button');
        a.className = 'tile in'; a.innerHTML = rubyHtml(t.hz, t.py);
        a.onclick = () => { chosen.splice(chosen.indexOf(t), 1); a.remove(); b.disabled = false; check.disabled = !chosen.length; };
        ans.appendChild(a);
        check.disabled = false;
      });
      check.addEventListener('click', () => {
        const got = chosen.map(t => t.hz).join('');
        const want = wordsOnly.map(t => t.hz).join('');
        const ok = got === want;
        box.querySelectorAll('.tile').forEach(t => { t.disabled = true; });
        check.hidden = true;
        speak(sentenceText(tokens));
        ctx.feedback(ok, `<div class="ex-zh">${sentenceRuby(tokens)}</div>`);
      });
    },
  };
}

function writeStep(ch, note) {
  return {
    kind: 'write',
    render(box, ctx) {
      const w = COURSE_WORDS.find(x => x.hz === ch) || DICT.find(x => x.hz === ch);
      const py = w && [...w.hz].length === 1 ? w.py : '';
      box.innerHTML = `<div class="card write-card"><p class="kicker">Write</p>
        <div class="write-head"><span class="w-char">${rubyHtml(ch, py)}</span>${playBtn(ch)}<span class="muted">${escapeHtml(w?.en || '')}</span></div>
        ${note ? `<p class="muted small">${colorizeText(note)}</p>` : ''}
        <div class="writer-box"></div>
        <p class="w-status muted small">Watch the stroke order, then trace it.</p>
        <div class="row-c"><button class="btn ghost" data-a="watch">${ICON.play} Watch</button><button class="btn ghost" data-a="trace">${ICON.pen} Trace</button><label class="switch"><input type="checkbox" checked data-a="outline"> Outline</label></div></div>`;
      const status = box.querySelector('.w-status');
      const writer = new Writer(box.querySelector('.writer-box'), ch, {
        onComplete: ({ mistakes }) => {
          store.wroteChar(ch);
          status.textContent = mistakes ? `Done! ${mistakes} stroke${mistakes > 1 ? 's' : ''} needed another try.` : 'Perfect!';
          speak(ch);
          ctx.continueBtn('Continue');
        },
        onStroke: ({ correct }) => { if (!correct) status.textContent = 'Not quite: try that stroke again (start point and direction matter).'; else status.textContent = 'Good. Next stroke.'; },
      });
      ctx.addCleanup(() => writer.destroy());
      writer.ready.then(async () => { await writer.animate(); writer.quiz(); status.textContent = 'Now trace it, stroke by stroke.'; })
        .catch(() => { status.textContent = 'Stroke data not available for this character.'; ctx.continueBtn(); });
      box.querySelector('.row-c').addEventListener('click', e => {
        const a = e.target.closest('[data-a]')?.dataset.a;
        if (a === 'watch') writer.animate().then(() => writer.quiz());
        if (a === 'trace') writer.quiz();
      });
      box.querySelector('[data-a=outline]').addEventListener('change', e => writer.setOutline(e.target.checked));
      ctx.skipBtn();
    },
  };
}

function dialogueStep(lines) {
  return {
    kind: 'info',
    render(box, ctx) {
      box.innerHTML = `<div class="card"><p class="kicker">Dialogue</p><p class="muted">Listen to the whole conversation, then tap each line to repeat it.</p>
        <button class="btn ghost play-all">${ICON.play} Play all</button>
        <ul class="dialogue">${lines.map(([who, s, en]) => {
          const t = parseSentence(s);
          return `<li class="who-${who}"><span class="who">${who}</span><div class="bubble" data-say="${escapeHtml(sentenceText(t))}"><div class="ex-zh">${sentenceRuby(t)}</div><div class="ex-en">${escapeHtml(en)}</div></div></li>`;
        }).join('')}</ul></div>`;
      let stop = false;
      ctx.addCleanup(() => { stop = true; });
      box.querySelector('.play-all').addEventListener('click', async () => {
        for (const [, s] of lines) {
          if (stop) return;
          const text = sentenceText(parseSentence(s));
          speak(text);
          await new Promise(r => setTimeout(r, 900 + text.length * 380));
        }
      });
      ctx.continueBtn();
    },
  };
}

// ----- Player -----
function runPlayer(steps, { title, onFinish, onAnswer }) {
  const queue = steps.map((s, i) => ({ ...s, uid: i }));
  const scoredTotal = queue.filter(s => s.scored).length;
  let firstTryRight = 0;
  const attempted = new Set();
  let idx = 0;
  let stepCleanups = [];

  view.innerHTML = `<div class="player">
    <div class="p-top"><a class="close" href="#/" aria-label="Close">✕</a><div class="bar"><i></i></div></div>
    <div class="p-body"></div>
    <div class="p-foot"></div></div>`;
  const body = $('.p-body', view), foot = $('.p-foot', view), bar = $('.bar i', view);

  function runCleanups() { stepCleanups.forEach(f => f()); stepCleanups = []; }
  cleanup = runCleanups;

  function show() {
    runCleanups();
    bar.style.width = `${Math.round((idx / queue.length) * 100)}%`;
    if (idx >= queue.length) return finish();
    const step = queue[idx];
    foot.innerHTML = '';
    foot.className = 'p-foot';
    body.scrollTop = 0;
    step.render(body, ctx(step));
  }

  function ctx(step) {
    return {
      addCleanup: f => stepCleanups.push(f),
      continueBtn(label = 'Continue') {
        foot.innerHTML = `<button class="btn primary next">${label}</button>`;
        foot.querySelector('.next').onclick = () => { idx++; show(); };
      },
      skipBtn() {
        if (foot.querySelector('.next')) return;
        foot.innerHTML = `<button class="btn ghost next">Skip</button>`;
        foot.querySelector('.next').onclick = () => { idx++; show(); };
      },
      feedback(ok, reveal, { silentWrong = false } = {}) {
        if (!attempted.has(step.uid)) { attempted.add(step.uid); if (ok) firstTryRight++; }
        if (step.review) { store.review(step.review, ok); }
        onAnswer?.(step, ok);
        if (!ok && !silentWrong) queue.push({ ...step }); // try again at the end
        foot.className = `p-foot fb ${ok ? 'ok' : 'no'}`;
        foot.innerHTML = `<div class="fb-msg"><strong>${ok ? pick(['Correct!', 'Nice!', 'Great!', '对! Right!']) : silentWrong ? 'Done, a few slips' : 'Not quite'}</strong>${reveal && !ok ? `<div class="fb-reveal">${reveal}</div>` : ''}</div>
          <button class="btn primary next">Continue</button>`;
        foot.querySelector('.next').onclick = () => { idx++; show(); };
      },
    };
  }

  function finish() {
    const accuracy = scoredTotal ? Math.round((firstTryRight / scoredTotal) * 100) : 100;
    const res = onFinish({ accuracy }) || {};
    bar.style.width = '100%';
    foot.innerHTML = '';
    foot.className = 'p-foot';
    body.innerHTML = `<div class="card done-card"><div class="done-mark">${ICON.check}</div><h2>${res.lesson ? 'Lesson complete' : 'Review complete'}</h2>
      <p class="muted">${escapeHtml(title || '')}</p>
      ${scoredTotal ? `<div class="score">${accuracy}%</div><p class="muted">right on the first try</p>` : ''}
      <div class="col-c">${res.next ? `<a class="btn primary" href="#/lesson/${res.next.id}">Next: ${res.next.id} ${escapeHtml(res.next.title)}</a>` : ''}
      <a class="btn ghost" href="#/">Back to lessons</a></div></div>`;
  }

  show();
}

function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

// ---------- Review ----------
function renderReviewHome() {
  const due = store.dueWordIds().filter(id => WORD_BY_ID.has(id));
  const learned = store.learnedWordIds().filter(id => WORD_BY_ID.has(id));
  view.innerHTML = `<header class="top"><h1>Review</h1></header>
    <div class="card center">
      <div class="score">${due.length}</div><p class="muted">word${due.length === 1 ? '' : 's'} due now · ${learned.length} learned in total</p>
      ${due.length ? `<a class="btn primary" href="#/session/due">Start review</a>` : `<p>Nothing due right now. Come back later.</p>`}
      ${learned.length ? `<a class="btn ghost" href="#/session/all">Practise all learned words</a>` : '<p class="muted small">Finish a lesson to start building your review deck.</p>'}
    </div>
    ${learned.length ? `<h2 class="section-t">Characters to write</h2><div class="char-chips">${[...new Set(allLessons().flatMap(l => store.isDone(l.id) ? l.write || [] : []))].map(c => `<a class="chip big" href="#/write/${encodeURIComponent(c)}">${c}</a>`).join('')}</div>` : ''}`;
}

function renderReviewSession(mode) {
  const ids = (mode === 'all' ? store.learnedWordIds() : store.dueWordIds()).filter(id => WORD_BY_ID.has(id));
  if (!ids.length) { location.hash = '#/review'; return; }
  const words = sample(ids, 15).map(id => WORD_BY_ID.get(id));
  const pool = store.learnedWordIds().map(id => WORD_BY_ID.get(id)).filter(Boolean);
  const steps = words.map(w => mcqStep(randomWordQuestion(w, pool), { review: w.id }));
  runPlayer(steps, { title: `${words.length} words reviewed`, onFinish: () => ({}) });
}

// ---------- Dictionary ----------
const dictState = { q: '', topic: '', sort: 'logical' };

function renderDictionary() {
  const learned = new Set(store.learnedWordIds());
  const CHEV = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  view.innerHTML = `<header class="top"><h1>Dictionary</h1><p class="muted">${DICT.length} words</p></header>
    <div class="dict-tools">
      <input class="search" type="search" placeholder="Search words or topics" value="${escapeHtml(dictState.q)}" autocomplete="off" autocapitalize="off">
      <div class="seg"><button data-sort="logical">By topic</button><button data-sort="pinyin">A–Z pinyin</button><button data-sort="english">A–Z English</button></div>
      <div class="chips-wrap">
        <button class="chips-arrow left" aria-label="Scroll topics left">${CHEV('M15 5l-7 7 7 7')}</button>
        <div class="topic-chips"><button class="chip" data-topic="">All</button>${TOPICS.map(([id, label]) => `<button class="chip" data-topic="${id}">${escapeHtml(label)}</button>`).join('')}</div>
        <button class="chips-arrow right" aria-label="Scroll topics right">${CHEV('M9 5l7 7-7 7')}</button>
      </div>
    </div>
    <div class="topic-hits"></div>
    <div class="dict-list"></div>`;
  const list = $('.dict-list', view);
  const hits = $('.topic-hits', view);
  const chips = $('.topic-chips', view);
  const wrap = $('.chips-wrap', view);

  // ----- topic row: mouse wheel, click-drag and arrow buttons for desktop -----
  const updateArrows = () => {
    const max = chips.scrollWidth - chips.clientWidth;
    wrap.classList.toggle('at-start', chips.scrollLeft <= 2);
    wrap.classList.toggle('at-end', chips.scrollLeft >= max - 2);
  };
  chips.addEventListener('scroll', updateArrows, { passive: true });
  chips.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    if (chips.scrollWidth <= chips.clientWidth) return;
    e.preventDefault();
    chips.scrollLeft += e.deltaY;
  }, { passive: false });
  let drag = null, lastDragEnd = 0;
  chips.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag = { x: e.clientX, left: chips.scrollLeft, moved: false };
  });
  window.addEventListener('pointermove', onDragMove);
  window.addEventListener('pointerup', onDragEnd);
  function onDragMove(e) {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4) { drag.moved = true; chips.classList.add('dragging'); }
    if (drag.moved) chips.scrollLeft = drag.left - dx;
  }
  function onDragEnd() {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    chips.classList.remove('dragging');
    if (moved) lastDragEnd = Date.now();
  }
  cleanup = () => { window.removeEventListener('pointermove', onDragMove); window.removeEventListener('pointerup', onDragEnd); };
  wrap.querySelector('.left').onclick = () => chips.scrollBy({ left: -chips.clientWidth * 0.7, behavior: 'smooth' });
  wrap.querySelector('.right').onclick = () => chips.scrollBy({ left: chips.clientWidth * 0.7, behavior: 'smooth' });
  const selectTopic = id => {
    dictState.topic = id;
    draw();
    const chip = chips.querySelector(`[data-topic="${CSS.escape(id)}"]`);
    if (chip) chips.scrollTo({ left: chip.offsetLeft - chips.clientWidth / 2 + chip.offsetWidth / 2, behavior: 'smooth' });
  };

  function draw() {
    view.querySelectorAll('[data-sort]').forEach(b => b.classList.toggle('on', b.dataset.sort === dictState.sort));
    chips.querySelectorAll('[data-topic]').forEach(b => b.classList.toggle('on', b.dataset.topic === dictState.topic));
    const q = dictState.q.trim().toLowerCase();
    const qPlain = stripTones(q).replace(/\s+/g, '');

    // topics whose name matches the search
    const topicMatches = q.length >= 2 ? TOPICS.filter(([id, label]) => label.toLowerCase().includes(q) || id.includes(q)) : [];
    const matchedIds = new Set(topicMatches.map(t => t[0]));
    hits.innerHTML = topicMatches.length
      ? `<p class="hits-label">Topics</p><div class="char-chips">${topicMatches.map(([id, label]) => {
          const n = DICT.filter(w => w.topic === id).length;
          return `<button class="chip topic-hit ${id === dictState.topic ? 'on' : ''}" data-hit="${id}">${escapeHtml(label)} <span class="muted">${n}</span></button>`;
        }).join('')}</div>`
      : '';

    let items = DICT.filter(w => !dictState.topic || w.topic === dictState.topic);
    if (q) {
      items = items.filter(w => w.hz.includes(q) || w.en.toLowerCase().includes(q)
        || stripTones(w.py).replace(/\s+/g, '').includes(qPlain) || matchedIds.has(w.topic));
    }
    const logical = dictState.sort === 'logical';
    const key = w => (dictState.sort === 'english' ? w.en.toLowerCase().replace(/^(to|the|a) /, '') : stripTones(w.py).replace(/\s+/g, ''));
    if (logical) items.sort((a, b) => a.ord - b.ord);
    else items.sort((a, b) => key(a).localeCompare(key(b)));
    if (!items.length) { list.innerHTML = '<p class="muted center">No words found.</p>'; return; }
    let html = '', group = '';
    for (const w of items) {
      const t = TOPICS.find(t => t[0] === w.topic);
      const g = logical ? (t ? escapeHtml(t[1]) : 'Other') : (key(w)[0]?.toUpperCase() || '#');
      if (g !== group && !dictState.topic) { group = g; html += `<div class="letter${logical ? ' topic-h' : ''}">${g}</div>`; }
      html += `<a class="d-row" href="#/word/${encodeURIComponent(w.id)}">
        <span class="d-hz">${rubyHtml(w.hz, w.py)}</span>
        <span class="d-mid"><span class="d-py">${pinyinHtml(w.py)}</span><span class="d-en">${escapeHtml(w.en)}</span></span>
        <span class="d-tags">${learned.has(w.id) ? '<span class="learned" title="Learned">●</span>' : ''}${playBtn(w.hz, { cls: 'row-play' })}</span>
      </a>`;
    }
    list.innerHTML = html;
  }

  $('.search', view).addEventListener('input', e => { dictState.q = e.target.value; draw(); });
  view.querySelector('.seg').addEventListener('click', e => { const b = e.target.closest('[data-sort]'); if (b) { dictState.sort = b.dataset.sort; draw(); } });
  chips.addEventListener('click', e => { if (Date.now() - lastDragEnd < 80) return; const b = e.target.closest('[data-topic]'); if (b) selectTopic(b.dataset.topic); });
  hits.addEventListener('click', e => {
    const b = e.target.closest('[data-hit]'); if (!b) return;
    dictState.q = ''; $('.search', view).value = '';
    selectTopic(b.dataset.hit);
  });
  draw();
  requestAnimationFrame(updateArrows);
}

function renderWord(id) {
  const w = WORD_BY_ID.get(id);
  if (!w) { location.hash = '#/dictionary'; return; }
  const t = TOPICS.find(t => t[0] === w.topic);
  const chars = [...new Set([...w.hz])];
  const lesson = w.lessonId ? lessonById(w.lessonId) : null;
  view.innerHTML = `<header class="top"><a class="back" href="#/dictionary">← Dictionary</a></header>
    <div class="card word-card">
      <div class="wc-hz">${rubyHtml(w.hz, w.py)}</div>
      <div class="wc-py">${pinyinHtml(w.py)}</div>
      <div class="wc-en">${escapeHtml(w.en)}</div>
      <div class="row-c">${playBtn(w.hz, { cls: 'big' })}${slowBtn(w.hz)}</div>
      <p class="muted small">${t ? escapeHtml(t[1]) : ''}${lesson ? ` · taught in lesson ${lesson.id}` : ''}</p>
    </div>
    <h2 class="section-t">Write the characters</h2>
    ${[...w.hz].length > 1 ? `<a class="btn primary write-word" href="#/write/${encodeURIComponent(w.hz)}/0">${ICON.pen} Write the whole word</a>` : ''}
    <div class="char-chips">${chars.map(c => `<a class="chip big" href="#/write/${encodeURIComponent(w.hz)}/${[...w.hz].indexOf(c)}">${c}</a>`).join('')}</div>`;
  setTimeout(() => speak(w.hz), 200);
}

// Write one character, or a whole word character by character (#/write/<text>/<index>).
function renderWritePractice(text, idx = 0) {
  const chars = [...text].filter(c => /[㐀-鿿]/.test(c));
  if (!chars.length) { history.back(); return; }
  const i = Math.min(Math.max(idx, 0), chars.length - 1);
  const ch = chars[i];
  const multi = chars.length > 1;
  const word = DICT.find(x => x.hz === text);
  const single = DICT.find(x => x.hz === ch);
  const syls = (word?.py || '').split(/\s+/).filter(Boolean);
  const chPy = single?.py || (syls.length === chars.length ? syls[i] : '');
  const go = n => location.replace(`#/write/${encodeURIComponent(text)}/${n}`); // replace: Back still returns to the word

  const progress = multi ? `<div class="w-progress">
      <div class="w-word">${chars.map((c, k) => `<button class="w-step ${k === i ? 'cur' : ''} ${k < i ? 'done' : ''}" data-go="${k}">${rubyHtml(c, syls.length === chars.length ? syls[k] : '')}</button>`).join('')}</div>
      <p class="muted small">Character ${i + 1} of ${chars.length}${word ? ` · ${escapeHtml(word.en)}` : ''}</p>
    </div>` : '';

  view.innerHTML = `<header class="top"><a class="back" href="javascript:history.back()">← Back</a></header>
    <div class="card write-card">
      ${progress}
      <div class="write-head"><span class="w-char">${rubyHtml(ch, chPy)}</span>${playBtn(ch)}<span class="muted">${escapeHtml(single?.en || (!multi ? word?.en || '' : ''))}</span></div>
      <div class="writer-box"></div>
      <p class="w-status muted small"></p>
      <div class="row-c"><button class="btn ghost" data-a="watch">${ICON.play} Watch</button><button class="btn ghost" data-a="trace">${ICON.pen} Again</button><label class="switch"><input type="checkbox" checked data-a="outline"> Outline</label></div>
      ${multi ? `<div class="w-nav">
        <button class="btn ghost" data-nav="prev" ${i === 0 ? 'disabled' : ''}>← Previous</button>
        <button class="btn ghost" data-nav="next">${i === chars.length - 1 ? 'Finish' : 'Skip →'}</button>
      </div>` : ''}
    </div>`;

  const status = $('.w-status', view);
  const nextBtn = $('[data-nav=next]', view);
  const writer = new Writer($('.writer-box', view), ch, {
    onComplete: ({ mistakes }) => {
      store.wroteChar(ch);
      speak(ch);
      const how = mistakes ? `Done with ${mistakes} retr${mistakes > 1 ? 'ies' : 'y'}.` : 'Perfect!';
      if (!multi) { status.textContent = `${how} Tap "Again" to repeat.`; return; }
      $('.w-step.cur', view)?.classList.add('done');
      if (i < chars.length - 1) {
        status.textContent = `${how} Now the next character: ${chars[i + 1]}`;
        nextBtn.textContent = `Next: ${chars[i + 1]} →`;
      } else {
        status.textContent = `${how} You wrote the whole word ${text}.`;
        nextBtn.textContent = 'Finish';
        setTimeout(() => speak(text), 700);
      }
      nextBtn.classList.remove('ghost');
      nextBtn.classList.add('primary', 'pulse');
      nextBtn.focus({ preventScroll: true });
    },
    onStroke: ({ correct }) => { status.textContent = correct ? 'Good. Next stroke.' : 'Not quite: check the start point and direction.'; },
  });
  cleanup = () => writer.destroy();
  writer.ready.then(async () => { await writer.animate(); writer.quiz(); status.textContent = 'Now trace it.'; })
    .catch(() => { status.textContent = 'Stroke data is not available for this character yet.'; });
  $('.row-c', view).addEventListener('click', e => {
    const a = e.target.closest('[data-a]')?.dataset.a;
    if (a === 'watch') writer.animate().then(() => writer.quiz());
    if (a === 'trace') { writer.quiz(); status.textContent = 'Trace it again.'; }
  });
  $('[data-a=outline]', view).addEventListener('change', e => writer.setOutline(e.target.checked));
  if (multi) {
    $('.w-nav', view).addEventListener('click', e => {
      const n = e.target.closest('[data-nav]')?.dataset.nav;
      if (n === 'prev' && i > 0) go(i - 1);
      if (n === 'next') { if (i < chars.length - 1) go(i + 1); else history.back(); }
    });
    $('.w-word', view).addEventListener('click', e => {
      const b = e.target.closest('[data-go]');
      if (b && Number(b.dataset.go) !== i) go(Number(b.dataset.go));
    });
  }
}

// ---------- Settings ----------
function renderSettings() {
  const s = store.state.settings;
  const voices = chineseVoices();
  view.innerHTML = `<header class="top"><h1>Settings</h1></header>
    <div class="card settings">
      <label class="set-row"><span>Colour pinyin by tone<small>1 red · 2 green · 3 blue · 4 purple</small></span><input type="checkbox" data-k="toneColors" ${s.toneColors ? 'checked' : ''}></label>
      <label class="set-row"><span>Slow audio by default</span><input type="checkbox" data-k="slowAudio" ${s.slowAudio ? 'checked' : ''}></label>
      <label class="set-row"><span>Open all lessons<small>Skip the step-by-step lock</small></span><input type="checkbox" data-k="unlockAll" ${s.unlockAll ? 'checked' : ''}></label>
      <label class="set-row col"><span>Chinese voice</span>
        <select data-k="voiceURI">${voices.length ? voices.map(v => `<option value="${escapeHtml(v.voiceURI)}" ${v.voiceURI === s.voiceURI ? 'selected' : ''}>${escapeHtml(v.name)}</option>`).join('') : `<option>${hasSpeech() ? 'No Chinese voice found on this device' : 'Speech not supported'}</option>`}</select>
        <button class="btn ghost small test-voice" type="button">${SPEAKER} Test 你好</button>
      </label>
    </div>
    <h2 class="section-t">Progress</h2>
    <div class="card settings">
      <p class="muted small">Progress is saved on this device. To continue on another device, export a file here and import it there.</p>
      <div class="row-c wrap"><button class="btn ghost" data-act="export">Export progress</button>
      <label class="btn ghost">Import progress<input type="file" accept="application/json,.json" hidden data-act="import"></label>
      <button class="btn danger" data-act="reset">Reset progress</button></div>
    </div>
    <p class="muted small credits">Stroke data: <a href="https://github.com/skishore/makemeahanzi" target="_blank" rel="noopener">Make Me a Hanzi</a> (Arphic Public License) via hanzi-writer-data. Audio: your device's Chinese voice.</p>`;

  view.querySelectorAll('[data-k]').forEach(inp => inp.addEventListener('change', () => {
    store.setSetting(inp.dataset.k, inp.type === 'checkbox' ? inp.checked : inp.value);
    applySettings();
  }));
  $('.test-voice', view).onclick = () => speak('你好');
  view.addEventListener('click', e => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'export') {
      const blob = new Blob([store.exportJSON()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `chinese-progress-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }
    if (act === 'reset' && confirmInline(e.target.closest('[data-act]'))) { store.reset(); applySettings(); renderSettings(); }
  });
  $('[data-act=import]', view).addEventListener('change', async e => {
    const f = e.target.files[0]; if (!f) return;
    try { store.importJSON(await f.text()); applySettings(); renderSettings(); toast('Progress imported'); }
    catch { toast('That file is not a progress file'); }
  });
}

// Two-tap confirmation instead of a blocking dialog
function confirmInline(btn) {
  if (btn.dataset.armed) return true;
  btn.dataset.armed = '1';
  const old = btn.textContent;
  btn.textContent = 'Tap again to confirm';
  setTimeout(() => { delete btn.dataset.armed; btn.textContent = old; }, 3000);
  return false;
}

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2400);
}

// ---------- Service worker ----------
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js').catch(() => {});
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController) location.reload(); });
}

route();
