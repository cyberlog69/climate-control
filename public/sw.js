// ClimateSphere Service Worker for Offline Caching & PWA Support
const CACHE_NAME = "climatesphere-v3";
const RUNTIME_CACHE = "climatesphere-runtime-v3";
const MAX_RUNTIME_ENTRIES = 80;

const ASSETS_TO_CACHE = ["/", "/index.html", "/manifest.webmanifest"];

// Weather and wildfire JSON APIs only. Map tiles are left to the browser's HTTP cache.
const API_HOSTS = new Set([
  "api.open-meteo.com",
  "air-quality-api.open-meteo.com",
  "geocoding-api.open-meteo.com",
  "nominatim.openstreetmap.org",
  "get.geojs.io",
  "eonet.gsfc.nasa.gov"
]);

async function trimRuntimeCache() {
  const cache = await caches.open(RUNTIME_CACHE);
  const keys = await cache.keys();
  const excess = keys.length - MAX_RUNTIME_ENTRIES;
  if (excess > 0) {
    await Promise.all(keys.slice(0, excess).map((key) => cache.delete(key)));
  }
}

// Install Event: Skip waiting to activate immediately
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate Event: Immediately purge older caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);

  // 1. Navigation requests (HTML document): network-first to pick up new deploys.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  const isApiRequest = requestUrl.origin !== location.origin && API_HOSTS.has(requestUrl.hostname);

  // 2. External API calls: network-first, cache successful JSON for offline fallback.
  if (isApiRequest) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches
              .open(RUNTIME_CACHE)
              .then((cache) => cache.put(request, responseClone))
              .then(trimRuntimeCache)
              .catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 3. Other cross-origin requests (map tiles, etc.): network only.
  if (requestUrl.origin !== location.origin) {
    return;
  }

  // 4. Local static assets: cache-first with network fallback.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
