self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Passthrough fetch para cumplir con el requerimiento de instalabilidad PWA
  event.respondWith(fetch(event.request));
});
