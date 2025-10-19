// Mobile-optimized Service Worker for caching static assets
const CACHE_NAME = 'fildex-mobile-v1';
const MOBILE_CACHE_NAME = 'fildex-mobile-critical-v1';

// Critical resources for mobile
const CRITICAL_CACHE_URLS = [
  '/',
  '/index.html',
  '/src/index.css'
];

// Static assets cache
const STATIC_CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Mobile-specific cache strategy
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Check for slow connection
const isSlowConnection = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    return connection.effectiveType === 'slow-2g' || 
           connection.effectiveType === '2g' || 
           connection.saveData === true;
  }
  return false;
};

// Install event - cache static assets with mobile optimization
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache critical resources for mobile
      caches.open(MOBILE_CACHE_NAME).then((cache) => {
        return cache.addAll(CRITICAL_CACHE_URLS);
      }),
      // Cache static assets
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_CACHE_URLS);
      })
    ]).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== MOBILE_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - mobile-optimized caching strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip API requests
  if (event.request.url.includes('/api/')) {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isMobileDevice = isMobile();
  const isSlow = isSlowConnection();

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // For mobile devices, use different caching strategies
        if (isMobileDevice) {
          // For critical resources on mobile, try critical cache first
          if (requestUrl.pathname === '/' || requestUrl.pathname.includes('index.css')) {
            return caches.match(event.request, { cacheName: MOBILE_CACHE_NAME })
              .then((criticalResponse) => {
                if (criticalResponse) {
                  return criticalResponse;
                }
                return fetchAndCache(event.request, isSlow);
              });
          }
        }

        return fetchAndCache(event.request, isSlow);
      })
  );
});

// Helper function to fetch and cache with mobile optimization
function fetchAndCache(request, isSlowConnection) {
  return fetch(request)
    .then((fetchResponse) => {
      // Don't cache if not a valid response
      if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
        return fetchResponse;
      }

      // Clone the response
      const responseToCache = fetchResponse.clone();

      // Choose cache based on resource type and connection speed
      const cacheName = isSlowConnection ? MOBILE_CACHE_NAME : CACHE_NAME;
      
      // Cache the fetched response
      caches.open(cacheName)
        .then((cache) => {
          // For slow connections, limit cache size
          if (isSlowConnection) {
            cache.put(request, responseToCache);
          } else {
            cache.put(request, responseToCache);
          }
        });

      return fetchResponse;
    })
    .catch(() => {
      // Return offline page for mobile if available
      if (request.destination === 'document') {
        return caches.match('/offline.html');
      }
    });
}

