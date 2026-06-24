/* Service Worker for Portal Regulasi Kepolisian */
const CACHE_NAME = 'portal-regulasi-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.tsx',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching assets');
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[SW] Cache addAll failed (some assets may be unavailable):', err);
        // Don't fail installation if some assets unavailable
      });
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and external domains
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Strategy 1: Video - Cache first (rarely changes)
  if (url.pathname.includes('/Video_') || url.pathname.endsWith('.mp4')) {
    return event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          console.log('[SW] Video from cache:', url.pathname);
          return response;
        }
        return fetch(request)
          .then((response) => {
            // Cache successful video responses
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            console.warn('[SW] Video fetch failed:', url.pathname);
            // Return offline response or cached version
            return caches.match(request);
          });
      })
    );
  }

  // Strategy 2: Fonts - Cache first
  if (url.pathname.includes('fonts.gstatic.com') || url.pathname.endsWith('.woff2')) {
    return event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
  }

  // Strategy 3: HTML/JS/CSS - Network first, fallback to cache
  if (
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css')
  ) {
    return event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          console.log('[SW] Offline, using cached:', url.pathname);
          return caches.match(request) || caches.match('/index.html');
        })
    );
  }

  // Strategy 4: API calls (Supabase) - Network first, cache if available
  if (url.hostname.includes('supabase.co')) {
    return event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          console.log('[SW] Supabase offline, using cached data');
          return caches.match(request);
        })
    );
  }

  // Strategy 5: Images & other assets - Cache first
  return event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          console.warn('[SW] Fetch failed and no cache:', request.url);
          return new Response('Offline - resource not available', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
    })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('[SW] Cache cleared');
    });
  }
});
