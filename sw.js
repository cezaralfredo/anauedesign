/**
 * Anauê Design - Service Worker (PWA)
 * Versão: 1.0.0
 */

const CACHE_NAME = 'anaue-cache-v12';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/style.css?v=48',
  '/script.js?v=48',
  '/manifest.json',
  '/favicon.ico',
  '/assets/images/logo-anaue-design-marketing-ia-negativo.png',
  '/assets/images/icons/android-icon-192x192.png',
  '/assets/images/icons/favicon-32x32.png',
  '/assets/images/icons/apple-touch-icon-180x180.png'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Falha no pré-cache de alguns arquivos do SW:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia de requisições:
// Para páginas HTML: Network-first (conteúdo sempre fresco), com fallback para o cache
// Para arquivos estáticos (CSS, JS, imagens, fontes): Stale-while-revalidate / Cache-first
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Ignorar requisições não-GET ou extensões de navegador
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return;
  }

  // Requisições de navegação (HTML)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // Requisições para arquivos estáticos (CSS, JS, Imagens, Fontes)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Atualiza cache em segundo plano (stale-while-revalidate)
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {/* ignora offline */});
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      });
    })
  );
});
