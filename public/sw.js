const CACHE_NAME = 'ferrepos-v1';
const STATIC_ASSETS = ['/','/index.html','/manifest.json','/icons/icon-192x192.png','/icons/icon-512x512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(names => Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request).then(c => c || (e.request.mode === 'navigate' ? caches.match('/index.html') : undefined))));
});
