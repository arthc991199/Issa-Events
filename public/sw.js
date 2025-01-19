const CACHE_NAME = 'issa-events-v1';
const OFFLINE_URL = '/dev/offline.html';

// Resources to pre-cache
const ASSETS_TO_CACHE = [
  '/dev/',
  '/dev/index.html',
  '/dev/manifest.json',
  '/dev/offline.html',
  '/dev/icons/icon-192x192.png',
  '/dev/icons/icon-512x512.png',
  '/dev/icons/icon-200x200.jpg'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

// Push Event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/dev/icons/icon-192x192.png',
    badge: '/dev/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Zobacz szczegóły'
      },
      {
        action: 'close',
        title: 'Zamknij'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('ISSA Events', options)
  );
});