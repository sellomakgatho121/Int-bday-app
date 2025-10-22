const VERSION = 'v1';
const APP_SHELL = [
  './',
  './index.html',
  './main.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(`awesome-shell-${VERSION}`).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.endsWith(VERSION)).map((k) => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET
  if (request.method !== 'GET') return;

  // Runtime cache for GitHub API and raw content
  const isGithub = /(^|\.)githubusercontent\.com$/.test(url.hostname) || url.hostname === 'api.github.com' || url.hostname === 'raw.githubusercontent.com';

  if (isGithub) {
    event.respondWith(
      caches.open('awesome-runtime').then(async (cache) => {
        try {
          const network = await fetch(request);
          if (network && network.ok) cache.put(request, network.clone());
          return network;
        } catch (e) {
          const cached = await cache.match(request);
          if (cached) return cached;
          throw e;
        }
      })
    );
    return;
  }

  // App shell: try cache first, then network
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
