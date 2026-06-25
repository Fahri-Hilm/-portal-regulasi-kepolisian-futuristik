/**
 * Service Worker Registration Utility
 * Handles SW registration, updates, and lifecycle
 */

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service Workers not supported');
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('[SW] Registered successfully:', registration);

        // Check for updates periodically
        setInterval(() => {
          registration.update().catch((err) => {
            console.warn('[SW] Update check failed:', err);
          });
        }, 60000); // Check every 60 seconds

        // Handle waiting state (new SW ready)
        if (registration.waiting) {
          promptUpdateReady(registration.waiting);
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if ((newWorker.state as any) === 'waiting' && navigator.serviceWorker.controller) {
                // New SW waiting and old SW still active
                promptUpdateReady(newWorker);
              }
            });
          }
        });
      })
      .catch((err) => {
        console.warn('[SW] Registration failed:', err);
      });

    // Listen for controller change (when new SW takes over)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[SW] Controller changed, reloading page to apply updates...');
      window.location.reload();
    });
  });
}

function promptUpdateReady(newWorker: ServiceWorker) {
  console.log('[SW] New version available');
  
  // Dispatch custom event to notify the React app
  const event = new CustomEvent('pkr-update-available', {
    detail: {
      update: () => {
        newWorker.postMessage({ type: 'SKIP_WAITING' });
        // After skipping waiting, the controllerchange event will reload the page
      }
    }
  });
  window.dispatchEvent(event);
}

/**
 * Preload critical resources
 * Called on app start
 */
export async function preloadCriticalAssets() {
  if (!('serviceWorker' in navigator)) return;

  try {
    const cache = await caches.open('portal-regulasi-v1');
    const criticalAssets = [
      '/index.html',
      '/src/main.tsx',
    ];

    for (const asset of criticalAssets) {
      if (!(await cache.match(asset))) {
        await cache.add(asset).catch((err) => {
          console.warn(`[SW] Failed to preload ${asset}:`, err);
        });
      }
    }
  } catch (err) {
    console.warn('[SW] Preload failed:', err);
  }
}

/**
 * Get cache status for debugging
 */
export async function getCacheStatus() {
  if (!('serviceWorker' in navigator)) return null;

  try {
    const cacheNames = await caches.keys();
    const cacheStatus: Record<string, number> = {};

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      cacheStatus[cacheName] = keys.length;
    }

    return cacheStatus;
  } catch (err) {
    console.warn('[SW] Cache status check failed:', err);
    return null;
  }
}

/**
 * Clear all caches (for reset/logout)
 */
export async function clearAllCaches() {
  if (!('serviceWorker' in navigator)) return;

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
    console.log('[SW] All caches cleared');

    // Notify SW
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
    }
  } catch (err) {
    console.warn('[SW] Cache clear failed:', err);
  }
}
