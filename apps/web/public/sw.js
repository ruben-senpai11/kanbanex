/**
 * KanbanEx - Advanced Offline Progressive Web App Service Worker
 * Supports offline browsing on Desktop, iOS, Android, macOS & Windows
 */

const CACHE_VERSION = 'v1.0.1';
const CACHE_STATIC_NAME = `kanbanex-static-${CACHE_VERSION}`;
const CACHE_PAGES_NAME = `kanbanex-pages-${CACHE_VERSION}`;
const CACHE_API_NAME = `kanbanex-api-${CACHE_VERSION}`;

// Core assets to pre-cache on service worker installation
const PRECACHE_ASSETS = [
  '/',
  '/overview',
  '/login',
  '/signup',
  '/calendar',
  '/billing',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-192x192.png',
  '/icons/icon-maskable-512x512.png',
  '/images/kanbanex-k-emblem.png',
  '/images/kanbanex-logo.svg',
  '/images/kanbanex-logo-small.png',
  '/images/kanbanex-logo.png'
];

// Install Event: pre-cache application shell and core routes
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_STATIC_NAME)
      .then((cache) => {
        // Use individual add to avoid 1 failed request breaking entire precache
        return Promise.allSettled(
          PRECACHE_ASSETS.map((url) =>
            fetch(url, { cache: 'no-cache' })
              .then((response) => {
                if (response.ok) {
                  return cache.put(url, response);
                }
              })
              .catch((err) => {
                console.warn(`[KanbanEx SW] Precaching skipped for ${url}:`, err);
              })
          )
        );
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate Event: clean up obsolete cache versions and take immediate control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (
              name !== CACHE_STATIC_NAME &&
              name !== CACHE_PAGES_NAME &&
              name !== CACHE_API_NAME
            ) {
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch Event: intelligent tiered offline routing
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-http / non-https schemes (e.g. chrome-extension:)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 1. Navigation requests (HTML pages) -> Network-first with cache fallback and offline page
  if (request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_PAGES_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // If offline, attempt exact URL match in caches
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }

          // If looking for an app page and it's not cached, try /overview
          if (url.pathname.startsWith('/overview') || url.pathname.startsWith('/projects') || url.pathname.startsWith('/calendar')) {
            const overviewCached = await caches.match('/overview');
            if (overviewCached) return overviewCached;
          }

          // Fallback to designated /offline page
          const offlinePage = await caches.match('/offline');
          if (offlinePage) {
            return offlinePage;
          }

          return new Response(
            `<!DOCTYPE html>
            <html lang="fr">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width,initial-scale=1">
              <title>KanbanEx - Mode Hors-ligne</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0B0D11; color: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; padding: 24px; }
                h1 { font-size: 24px; margin-bottom: 8px; color: #FF7A00; }
                p { color: #94A3B8; max-width: 440px; line-height: 1.5; font-size: 14px; }
                button { background: linear-gradient(135deg, #FF9D00, #FF3B08); color: white; border: none; padding: 10px 20px; border-radius: 9999px; font-weight: 600; cursor: pointer; margin-top: 20px; }
              </style>
            </head>
            <body>
              <h1>Mode Hors-Ligne</h1>
              <p>KanbanEx ne parvient pas à contacter le réseau. Vos données déjà consultées restent accessibles.</p>
              <button onclick="window.location.reload()">Réessayer la connexion</button>
            </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // 2. API Requests (/api/...) -> Network-first with cached data fallback
  if (url.pathname.startsWith('/api/') && request.method === 'GET') {
    event.respondWith(
      fetch(request)
        .then((apiResponse) => {
          if (apiResponse && apiResponse.status === 200) {
            const responseClone = apiResponse.clone();
            caches.open(CACHE_API_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return apiResponse;
        })
        .catch(async () => {
          const cachedApiResponse = await caches.match(request);
          if (cachedApiResponse) {
            return cachedApiResponse;
          }
          return new Response(
            JSON.stringify({
              offline: true,
              message: 'Vous êtes actuellement hors-ligne. Les données récentes sauvegardées sont utilisées.',
              data: []
            }),
            { headers: { 'Content-Type': 'application/json' }, status: 200 }
          );
        })
    );
    return;
  }

  // 3. Static Assets (CSS, JS, Fonts, Images, SVGs) -> Stale-While-Revalidate / Cache-First
  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.woff2');

  if (isStaticAsset && request.method === 'GET') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_STATIC_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default fallback for any other GET requests: try cache then network
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).catch(() => {
            return new Response('', { status: 408, statusText: 'Request timed out' });
          })
        );
      })
    );
  }
});

// Background sync and message handling
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
