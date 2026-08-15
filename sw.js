// sw.js — Service Worker para PWA offline
const CACHE_NAME = 'surpresa-s2-v1';
const ASSETS = [
  '/',
  '/Surpresa-S2/',
  '/Surpresa-S2/index.html',
  '/Surpresa-S2/style.css',
  '/Surpresa-S2/script.js',
  '/Surpresa-S2/data.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Cache-first para arquivos locais, network-first para CDNs
  const url = new URL(e.request.url);
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        return cached || fetch(e.request).then((resp) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, resp.clone());
            return resp;
          });
        });
      })
    );
  }
});