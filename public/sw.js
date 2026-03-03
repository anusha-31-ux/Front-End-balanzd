
// Service Worker for caching and update management
// IMPORTANT: Update CACHE_VERSION when deploying new versions to force cache invalidation
// Example: Change 'balanzed-v0.1.0' to 'balanzed-v0.1.1' before deployment
const CACHE_VERSION = 'balanzed-v0.1.1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const API_CACHE = `${CACHE_VERSION}-api`;

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/robots.txt'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_FILES);
    })
  );
  // Force activation
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.startsWith(CACHE_VERSION)) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all clients
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP/HTTPS requests (like chrome-extension://)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  // Skip requests to different origins (for security)
  if (url.origin !== self.location.origin && !url.pathname.startsWith('/api/')) {
    return;
  }

  // Handle API requests - always fetch fresh
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful GET API responses for offline use
          if (response.ok && request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(API_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Handle static assets - cache first, then network
  // Exclude JavaScript files from caching to prevent version conflicts
  if ((request.destination === 'script' && url.pathname.includes('.js')) ||
      request.destination === 'style' ||
      request.destination === 'image' ||
      request.destination === 'font') {
    // Only cache same-origin requests (but not JS files)
    if (url.origin === self.location.origin && !url.pathname.includes('.js')) {
      event.respondWith(
        caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request).then((response) => {
            // Cache the new response
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
            return response;
          });
        })
      );
    } else if (url.pathname.includes('.js')) {
      // For JavaScript files, always fetch from network first
      event.respondWith(
        fetch(request).catch(() => {
          // Only fall back to cache if network fails
          return caches.match(request);
        })
      );
    }
    return;
  }

  // Handle navigation requests - network first, then cache
  if (request.mode === 'navigate') {
    // Only cache same-origin navigation requests
    if (url.origin === self.location.origin) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Cache the response
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
            return response;
          })
          .catch(() => {
            // Return cached version
            return caches.match(request) || caches.match('/index.html');
          })
      );
    }
    return;
  }

  // Default - try network first, then cache
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
  );
});

// Message event - handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});