/**
 * Service Worker for Waktu Solat PWA
 * Provides offline caching and background sync
 */

const CACHE_NAME = 'waktu-solat-v1';
const API_CACHE_NAME = 'waktu-solat-api-v1';

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// API routes to cache with network-first strategy
const API_ROUTES = [
  /^https:\/\/api\.waktusolat\.app\/.*/,
];

// Install event - precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== API_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - handle different strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API routes - Network First with cache fallback
  if (API_ROUTES.some((route) => route.test(url.href))) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  // Static assets - Cache First with network fallback
  if (request.destination === 'image' || request.destination === 'font') {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Navigation - Network First, fallback to offline page
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  // Default - Network First
  event.respondWith(handleDefault(request));
});

/**
 * API Request Handler - Network First
 */
async function handleAPIRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);

  try {
    // Try network first
    const response = await fetch(request);

    // Cache successful responses
    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Network failed, try cache
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    // Return error response
    return new Response(
      JSON.stringify({ error: 'Offline - no cached data available' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Static Asset Handler - Cache First
 */
async function handleStaticAsset(request) {
  const cache = await caches.open(CACHE_NAME);

  // Try cache first
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  // Cache miss, fetch from network
  try {
    const response = await fetch(request);

    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Return a placeholder or error
    return new Response('Asset not available offline', { status: 503 });
  }
}

/**
 * Navigation Handler - Network First
 */
async function handleNavigation(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    // Try network first
    const response = await fetch(request);

    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Network failed, try cache
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    // Return cached index page as fallback
    const indexPage = await cache.match('/');

    if (indexPage) {
      return indexPage;
    }

    // No cache available
    return new Response('Offline - app not cached', { status: 503 });
  }
}

/**
 * Default Handler - Network First
 */
async function handleDefault(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);

    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    throw error;
  }
}

/**
 * Background Sync for Prayer Times (for future use)
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-prayer-times') {
    event.waitUntil(syncPrayerTimes());
  }
});

async function syncPrayerTimes() {
  // Will be implemented when we add IndexedDB storage
  console.log('[Service Worker] Syncing prayer times...');
}
