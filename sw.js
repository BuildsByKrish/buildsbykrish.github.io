// Service Worker for OurShow PWA
// Bump cache names when updating core assets to force clients to refresh
const CACHE_NAME = 'ourshow-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/prototype.js',
  '/manifest.webmanifest',
  '/login.html',
  '/profile.html',
  '/watchlist.html',
  '/watch&download.html',
  '/submit.html',
  '/ai.html',
  '/korean.html',
  '/hindi.html',
  '/english.html',
  '/chinese.html'
];

const TMDB_CACHE = 'ourshow-tmdb-v2';
const IMAGE_CACHE = 'ourshow-images-v2';

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Non-fatal if some assets don't exist
        return Promise.resolve();
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== TMDB_CACHE && cacheName !== IMAGE_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Helper to return a minimal image response when an image fetch fails
  const fallbackImageResponse = () => {
    const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' width='300' height='450'><rect width='100%' height='100%' fill='%23ddd'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-family='Arial' font-size='20'>No Image</text></svg>`;
    return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' }, status: 200 });
  };

  // Generic safe respondWith wrapper that guarantees a Response is returned
  const safeRespond = async (promise) => {
    try {
      const res = await promise;
      if (res instanceof Response) return res;
      // if nothing matched, return a generic 503 response for non-image requests
      return new Response('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
    } catch (e) {
      // On any unexpected error return a generic response
      return new Response('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
    }
  };

  // Cache static assets (cache-first)
  if (url.origin === location.origin && STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(safeRespond((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const fetchResponse = await fetch(request);
        if (fetchResponse && fetchResponse.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, fetchResponse.clone()).catch(() => {});
          return fetchResponse;
        }
      } catch (e) {
        // fallthrough to index.html
      }
      const index = await caches.match('/index.html');
      return index || new Response('Offline', { status: 503 });
    })()));
    return;
  }

  // Navigation requests (HTML page loads) - always try network first, fallback to cached index.html
  const acceptHeader = request.headers.get('accept') || '';
  if (request.mode === 'navigate' || acceptHeader.includes('text/html')) {
    event.respondWith(safeRespond((async () => {
      try {
        const net = await fetch(request);
        if (net && net.ok) return net;
      } catch (e) {
        // network failed
      }
      const cachedIndex = await caches.match('/index.html');
      return cachedIndex || new Response('Offline', { status: 503 });
    })()));
    return;
  }

  // Cache TMDB images (cache-first) - provide a safe SVG when all else fails
  if (url.hostname && url.hostname.includes('image.tmdb.org')) {
    event.respondWith(safeRespond((async () => {
      const cache = await caches.open(IMAGE_CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const fetchResponse = await fetch(request);
        if (fetchResponse && fetchResponse.ok) {
          cache.put(request, fetchResponse.clone()).catch(() => {});
          return fetchResponse;
        }
      } catch (e) {
        // ignore
      }
      return fallbackImageResponse();
    })()));
    return;
  }

  // If request is an image from other cross-origin hosts (e.g., via.placeholder.com), avoid caching and return safe fallback if network fails
  if (request.destination === 'image' && url.hostname && url.hostname !== location.hostname) {
    event.respondWith(safeRespond((async () => {
      try {
        const r = await fetch(request);
        if (r && r.ok) return r;
      } catch (e) {
        // ignore
      }
      return fallbackImageResponse();
    })()));
    return;
  }

  // Cache TMDB API (network-first)
  if (url.hostname && url.hostname.includes('api.themoviedb.org')) {
    event.respondWith(safeRespond((async () => {
      try {
        const fetchResponse = await fetch(request);
        if (fetchResponse && fetchResponse.ok) {
          const cache = await caches.open(TMDB_CACHE);
          cache.put(request, fetchResponse.clone()).catch(() => {});
          return fetchResponse;
        }
      } catch (e) {
        // network failed
      }
      const cached = await caches.match(request);
      return cached || new Response('Service Unavailable', { status: 503 });
    })()));
    return;
  }

  // Default: network-first with safe fallback to cache or generic response
  event.respondWith(safeRespond((async () => {
    try {
      const fetchResponse = await fetch(request);
      if (fetchResponse && fetchResponse.ok) return fetchResponse;
    } catch (e) {
      // ignore
    }
    const cached = await caches.match(request);
    if (cached) return cached;
    // If request expects an image, return image fallback
    if (request.destination === 'image') return fallbackImageResponse();
    return new Response('Service Unavailable', { status: 503 });
  })()));
});
