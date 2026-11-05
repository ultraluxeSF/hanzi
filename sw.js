// Service worker: makes the app work offline.
// Bump VERSION on every release so phones pick up the new files.
const VERSION = 'v0.1.4';
const CACHE = `zhongwen-${VERSION}`;
const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'js/app.js',
  'js/course.js',
  'js/dictionary.js',
  'js/storage.js',
  'js/audio.js',
  'js/writer.js',
  'js/util.js',
  'data/chars/index.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  'fonts/PoppinsPinyin-400.woff',
  'fonts/PoppinsPinyin-500.woff',
  'fonts/PoppinsPinyin-600.woff',
  'fonts/PoppinsPinyin-700.woff',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('zhongwen-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Cache-first for everything on this site; stroke data and audio are cached the first time they load.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok && (url.pathname.includes('/data/') || url.pathname.includes('/audio/') || url.pathname.includes('/icons/'))) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('index.html'))),
  );
});
