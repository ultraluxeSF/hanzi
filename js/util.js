// Helpers: pinyin, ruby rendering, sentences, randomness.

const CJK = /[㐀-鿿豈-﫿]/;
const TONE_MARKS = {
  1: 'āēīōūǖĀĒĪŌŪǕ',
  2: 'áéíóúǘÁÉÍÓÚǗ',
  3: 'ǎěǐǒǔǚǍĚǏǑǓǙ',
  4: 'àèìòùǜÀÈÌÒÙǛ',
};

export function toneOf(syl) {
  for (const [t, marks] of Object.entries(TONE_MARKS)) {
    for (const ch of syl) if (marks.includes(ch)) return Number(t);
  }
  return 5; // neutral
}

export function stripTones(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ü/g, 'v').toLowerCase();
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function sylSpan(syl) {
  return `<span class="t${toneOf(syl)}">${escapeHtml(syl)}</span>`;
}

/** Pinyin text coloured by tone, e.g. "nǐ hǎo". */
export function pinyinHtml(py, { joined = false } = {}) {
  const syls = py.split(/\s+/).filter(Boolean);
  return syls.map(sylSpan).join(joined ? '' : ' ');
}

/** Escape text and colour every pinyin syllable that carries a tone mark. */
export function colorizeText(text) {
  return escapeHtml(text).replace(/[A-Za-z\u00C0-\u024F\u01CD-\u01DC]+/g, w => {
    const t = toneOf(w);
    return t === 5 ? w : `<span class="t${t}">${w}</span>`;
  });
}

/** Small pitch-contour drawing for a tone (1–4, 5 = neutral). */
export function toneContour(tone) {
  const y = l => 26 - (l - 1) * 5.5; // pitch level 1 (low) … 5 (high)
  const paths = { 1: `M4 ${y(5)} L40 ${y(5)}`, 2: `M4 ${y(3)} L40 ${y(5)}`, 3: `M4 ${y(2)} Q18 ${y(0)} 26 ${y(1)} T40 ${y(4)}`, 4: `M4 ${y(5)} L40 ${y(1)}` };
  const grid = [1, 2, 3, 4, 5].map(l => `<line x1="2" x2="42" y1="${y(l)}" y2="${y(l)}" class="tc-grid"/>`).join('');
  const mark = tone === 5 ? `<circle cx="22" cy="${y(2)}" r="3.2" fill="currentColor"/>` : `<path d="${paths[tone]}" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>`;
  return `<svg class="tone-contour t${tone}" viewBox="0 0 44 30" aria-hidden="true">${grid}${mark}</svg>`;
}

/** Hanzi with pinyin above each character (ruby). Falls back to one ruby over the whole word. */
export function rubyHtml(hz, py) {
  const chars = [...hz];
  const syls = (py || '').split(/\s+/).filter(Boolean);
  const cjkCount = chars.filter(c => CJK.test(c)).length;
  if (!syls.length) return escapeHtml(hz);
  if (cjkCount !== syls.length) {
    return `<ruby>${escapeHtml(hz)}<rt>${pinyinHtml(py)}</rt></ruby>`;
  }
  let i = 0;
  return chars.map(c => {
    if (!CJK.test(c)) return `<span class="punct">${escapeHtml(c)}</span>`;
    const s = syls[i++];
    return `<ruby>${escapeHtml(c)}<rt>${sylSpan(s)}</rt></ruby>`;
  }).join('');
}

/** Parse "我:wǒ/是:shì/。" into tokens [{hz, py}] */
export function parseSentence(str) {
  return str.split('/').filter(Boolean).map(tok => {
    const idx = tok.indexOf(':');
    if (idx === -1) return { hz: tok, py: '', punct: true };
    return { hz: tok.slice(0, idx), py: tok.slice(idx + 1) };
  });
}

export function sentenceText(tokens) {
  return tokens.map(t => t.hz).join('');
}

export function sentencePinyin(tokens) {
  return tokens.filter(t => !t.punct).map(t => t.py).join(' ');
}

export function sentenceRuby(tokens) {
  return tokens.map(t => (t.punct ? `<span class="punct">${escapeHtml(t.hz)}</span>` : `<span class="tok">${rubyHtml(t.hz, t.py)}</span>`)).join('');
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample(arr, n) {
  return shuffle(arr).slice(0, n);
}

export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
