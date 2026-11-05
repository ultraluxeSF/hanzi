// Stroke-order trainer: animates a character and lets you trace it stroke by stroke
// with a finger, mouse or Apple Pencil (pressure-sensitive ink, palm rejection).
// Stroke data: Make Me a Hanzi via hanzi-writer-data (data/chars/<char>.json).

const NS = 'http://www.w3.org/2000/svg';
const cache = new Map();

export async function loadChar(ch) {
  if (cache.has(ch)) return cache.get(ch);
  const p = fetch(`data/chars/${encodeURIComponent(ch)}.json`).then(r => {
    if (!r.ok) throw new Error('No stroke data for ' + ch);
    return r.json();
  });
  cache.set(ch, p);
  p.catch(() => cache.delete(ch));
  return p;
}

export function hasStrokeData(ch, available) {
  return available.has(ch);
}

function svgEl(tag, attrs = {}, parent) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (parent) parent.appendChild(n);
  return n;
}

function medianPath(pts) {
  return 'M ' + pts.map(p => `${p[0]} ${p[1]}`).join(' L ');
}

function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }

function pathLength(pts) {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += dist(pts[i - 1], pts[i]);
  return l;
}

function resample(pts, n) {
  if (pts.length < 2) return Array(n).fill(pts[0] || [0, 0]);
  const total = pathLength(pts);
  const step = total / (n - 1);
  const out = [pts[0]];
  let acc = 0;
  let prev = pts[0];
  for (let i = 1; i < pts.length && out.length < n; i++) {
    let cur = pts[i];
    let d = dist(prev, cur);
    while (acc + d >= step && out.length < n) {
      const t = (step - acc) / d;
      const np = [prev[0] + t * (cur[0] - prev[0]), prev[1] + t * (cur[1] - prev[1])];
      out.push(np);
      prev = np;
      d = dist(prev, cur);
      acc = 0;
    }
    acc += d;
    prev = cur;
  }
  while (out.length < n) out.push(pts[pts.length - 1]);
  return out;
}

/** Does the user's stroke match the expected median? Both in character coordinates. */
function strokeMatches(user, median, leniency = 1) {
  if (pathLength(user) < 15 && pathLength(median) > 60) return false;
  const N = 24;
  const u = resample(user, N);
  const m = resample(median, N);
  let sum = 0;
  for (let i = 0; i < N; i++) sum += dist(u[i], m[i]);
  const avg = sum / N;
  const startOk = dist(u[0], m[0]) < 260 * leniency;
  const endOk = dist(u[N - 1], m[N - 1]) < 260 * leniency;
  const lenRatio = pathLength(u) / Math.max(pathLength(m), 1);
  const lenOk = pathLength(m) < 80 || (lenRatio > 0.35 && lenRatio < 2.6);
  return avg < 190 * leniency && startOk && endOk && lenOk;
}

export class Writer {
  constructor(container, ch, opts = {}) {
    this.container = container;
    this.ch = ch;
    this.opts = { showOutline: true, leniency: 1, onComplete: null, onStroke: null, ...opts };
    this.svg = svgEl('svg', { viewBox: '0 0 1024 1024', class: 'writer' });
    this.drawGrid();
    this.charG = svgEl('g', { transform: 'translate(0, 900) scale(1, -1)' }, this.svg);
    this.defs = svgEl('defs', {}, this.svg);
    this.outlineG = svgEl('g', { class: 'w-outline' }, this.charG);
    this.doneG = svgEl('g', { class: 'w-done' }, this.charG);
    this.animG = svgEl('g', { class: 'w-anim' }, this.charG);
    this.inkG = svgEl('g', { class: 'w-ink' }, this.svg);
    container.innerHTML = '';
    container.appendChild(this.svg);
    this.ready = loadChar(ch).then(data => { this.data = data; this.drawOutline(); return this; });
    this.uid = Math.random().toString(36).slice(2, 8);
  }

  drawGrid() {
    const g = svgEl('g', { class: 'w-grid' }, this.svg);
    svgEl('rect', { x: 4, y: 4, width: 1016, height: 1016, rx: 24 }, g);
    svgEl('line', { x1: 0, y1: 0, x2: 1024, y2: 1024 }, g);
    svgEl('line', { x1: 1024, y1: 0, x2: 0, y2: 1024 }, g);
    svgEl('line', { x1: 512, y1: 0, x2: 512, y2: 1024 }, g);
    svgEl('line', { x1: 0, y1: 512, x2: 1024, y2: 512 }, g);
  }

  drawOutline() {
    this.outlineG.innerHTML = '';
    this.outlineG.style.display = this.opts.showOutline ? '' : 'none';
    for (const d of this.data.strokes) svgEl('path', { d }, this.outlineG);
  }

  setOutline(show) {
    this.opts.showOutline = show;
    if (this.data) this.outlineG.style.display = show ? '' : 'none';
  }

  clearDone() { this.doneG.innerHTML = ''; this.animG.innerHTML = ''; this.defs.innerHTML = ''; this.inkG.innerHTML = ''; }

  /** Animate one stroke; resolves when finished. */
  animateStroke(i, { cls = 'w-anim-stroke', speed = 1 } = {}) {
    const strokePath = this.data.strokes[i];
    const med = this.data.medians[i];
    const clipId = `clip-${this.uid}-${i}-${Math.random().toString(36).slice(2, 6)}`;
    const clip = svgEl('clipPath', { id: clipId }, this.defs);
    svgEl('path', { d: strokePath }, clip);
    const p = svgEl('path', { d: medianPath(med), class: cls, 'clip-path': `url(#${clipId})` }, this.animG);
    const len = p.getTotalLength() + 200;
    p.style.strokeDasharray = `${len} ${len}`;
    p.style.strokeDashoffset = len;
    const dur = Math.max(260, len * 0.9) / speed;
    const anim = p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: dur, easing: 'ease-in-out', fill: 'forwards' });
    return new Promise(res => { anim.onfinish = () => res(p); });
  }

  /** Play the whole character stroke by stroke. Resolves true if it played to the end, false if skipped. */
  async animate({ speed = 1 } = {}) {
    await this.ready;
    this.stopQuiz();
    this.clearDone();
    this.animating = (this.animating || 0) + 1;
    const token = this.animating;
    this.setAnimating(true);
    for (let i = 0; i < this.data.strokes.length; i++) {
      if (token !== this.animating) return false;
      await this.animateStroke(i, { speed });
      if (token !== this.animating) return false;
      await new Promise(r => setTimeout(r, 120 / speed));
    }
    if (token !== this.animating) return false;
    this.setAnimating(false);
    return true;
  }

  setAnimating(on) {
    this.isAnimating = on;
    if (on && !this.skipHandler) {
      // touching the canvas during the animation skips it and starts tracing straight away
      this.skipHandler = e => { if (this.isAnimating) { this.skipAnimation(); this.onDown(e); } };
      this.svg.addEventListener('pointerdown', this.skipHandler);
    }
    this.opts.onMode?.(on ? 'animating' : 'idle');
  }

  /** Stop the animation and go straight to tracing. */
  skipAnimation() {
    if (!this.data) return;
    this.startQuiz();
  }

  fillStroke(i, cls = 'w-filled') {
    const p = svgEl('path', { d: this.data.strokes[i], class: cls }, this.doneG);
    p.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, fill: 'forwards' });
  }

  /** Start tracing mode. */
  async quiz() {
    await this.ready;
    this.startQuiz();
  }

  startQuiz() {
    this.animating = (this.animating || 0) + 1; // cancel animation
    if (this.isAnimating) { this.isAnimating = false; }
    this.stopQuiz();
    this.clearDone();
    this.svg.classList.remove('complete');
    this.current = 0;
    this.mistakes = 0;
    this.strokeMistakes = 0;
    this.activePointer = null;
    this.svg.classList.add('quiz');
    this.handlers = {
      down: e => this.onDown(e),
      move: e => this.onMove(e),
      up: e => this.onUp(e),
    };
    this.svg.addEventListener('pointerdown', this.handlers.down);
    this.svg.addEventListener('pointermove', this.handlers.move);
    this.svg.addEventListener('pointerup', this.handlers.up);
    this.svg.addEventListener('pointercancel', this.handlers.up);
    this.opts.onMode?.('tracing');
  }

  stopQuiz() {
    if (!this.handlers) return;
    this.svg.removeEventListener('pointerdown', this.handlers.down);
    this.svg.removeEventListener('pointermove', this.handlers.move);
    this.svg.removeEventListener('pointerup', this.handlers.up);
    this.svg.removeEventListener('pointercancel', this.handlers.up);
    this.handlers = null;
    this.svg.classList.remove('quiz');
  }

  toSvg(e) {
    const pt = this.svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(this.svg.getScreenCTM().inverse());
    return [p.x, p.y];
  }

  onDown(e) {
    if (!this.handlers) return;
    if (e.pointerType === 'pen') this.penSeen = true;
    if (this.penSeen && e.pointerType === 'touch') return; // palm rejection
    if (this.activePointer !== null || this.current >= this.data.strokes.length) return;
    e.preventDefault();
    this.activePointer = e.pointerId;
    this.svg.setPointerCapture?.(e.pointerId);
    this.points = [this.toSvg(e)];
    this.inkPath = svgEl('g', { class: 'w-user' }, this.inkG);
  }

  onMove(e) {
    if (e.pointerId !== this.activePointer) return;
    e.preventDefault();
    const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of events.length ? events : [e]) {
      const p = this.toSvg(ev);
      const last = this.points[this.points.length - 1];
      if (dist(p, last) < 2) continue;
      const pressure = ev.pointerType === 'pen' ? (ev.pressure || 0.5) : 0.5;
      svgEl('line', { x1: last[0], y1: last[1], x2: p[0], y2: p[1], 'stroke-width': 18 + pressure * 44 }, this.inkPath);
      this.points.push(p);
    }
  }

  onUp(e) {
    if (e.pointerId !== this.activePointer) return;
    this.activePointer = null;
    const user = this.points.map(([x, y]) => [x, 900 - y]); // to character coordinates
    const ink = this.inkPath;
    const i = this.current;
    if (strokeMatches(user, this.data.medians[i], this.opts.leniency)) {
      ink.remove();
      this.fillStroke(i);
      this.animG.innerHTML = '';
      this.current++;
      this.strokeMistakes = 0;
      this.opts.onStroke?.({ index: i, correct: true });
      if (this.current >= this.data.strokes.length) {
        this.svg.classList.add('complete');
        this.stopQuiz();
        this.opts.onComplete?.({ mistakes: this.mistakes, strokes: this.data.strokes.length });
      }
    } else {
      this.mistakes++;
      this.strokeMistakes++;
      ink.classList.add('wrong');
      ink.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, delay: 250, fill: 'forwards' }).onfinish = () => ink.remove();
      this.opts.onStroke?.({ index: i, correct: false });
      if (this.strokeMistakes >= 2) this.hint();
    }
  }

  /** Show the current stroke as a hint. */
  async hint() {
    if (!this.data || this.current >= this.data.strokes.length) return;
    this.animG.innerHTML = '';
    const p = await this.animateStroke(this.current, { cls: 'w-hint-stroke', speed: 1.2 });
    p.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, delay: 400, fill: 'forwards' });
  }

  destroy() { this.stopQuiz(); this.animating++; this.container.innerHTML = ''; }
}
