const CACHE = 'kb-focus-v8-button-grid';
const ASSETS = ['./', './index.html', './styles.css?v=2026-06-25-button-grid', './app.js?v=2026-06-25-button-grid', './manifest.webmanifest', './icons/icon-192.svg', './icons/icon-512.svg', './assets/01_swing_focus.jpg', './assets/02_rack_focus.jpg', './assets/03_press_focus.jpg', './assets/04_windmill_focus.jpg', './assets/05_deadlift_focus.jpg', './assets/06_goblet_squat_focus.jpg', './assets/07_renegade_row_focus.jpg', './assets/08_around_the_world_focus.jpg', './assets/09_overhead_hold_focus.jpg', './assets/10_bent_over_row_focus.jpg', './heatmap.svg', './heatmap.html'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
