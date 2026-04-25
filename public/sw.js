const CACHE_NAME = "amsy-cache-v1";

// Pages and assets to pre-cache for instant PWA startup
const PRECACHE_URLS = [
  "/",
  "/dashboard",
  "/login",
  "/manifest.json",
  "/images/pwa-192.png",
  "/images/pwa-512.png",
];

// Minimal service worker to satisfy installability checks and provide basic offline support
self.addEventListener("install", (event) => {
  console.log("[SW] Install event - Pre-caching critical assets");
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();

  // Pre-cache critical pages for instant startup
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.log("[SW] Pre-cache failed (non-critical):", err);
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activate event");
  // Tell the active service worker to take control of the page immediately
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
    ])
  );
});

// Scoped fetch handler to only intercept specific requests
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Navigation Requests (HTML) - Network First, Fallback to Cache
  // This ensures the user gets the latest content when online, but can still see the page offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Check if we received a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response because it's a stream and can only be consumed once
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(request);
        })
    );
    return;
  }

  // 2. Static Assets (Images, Fonts, CSS, JS) - Stale-While-Revalidate
  // Only cache specific file types and Next.js static assets to improve performance
  const isStaticAsset =
    /\.(png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2|ico)$/i.test(url.pathname);
  const isNextStatic = url.pathname.includes("/_next/static/");

  // Exclude API calls and other dynamic paths explicitly to be safe
  const isApiCall = url.pathname.includes("/api/");

  if ((isStaticAsset || isNextStatic) && !isApiCall) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Return cached response immediately if available
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        });

        // Return cached response if available, otherwise wait for network
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. All other requests (API, external, etc.) - Network Only
  // Do not intercept - let the browser handle them naturally
});

self.addEventListener("push", (event) => {
  console.log("[SW] Push event received");

  if (!event.data) {
    console.log("[SW] No data in push event");
    return;
  }

  try {
    const payload = event.data.json();
    const notificationTitle = payload.notification?.title || "New Notification";
    const notificationBody = payload.notification?.body || "";
    const notificationId = payload.data?.notificationId || "";
    const transactionId = payload.data?.transactionId || "";

    const notificationOptions = {
      body: notificationBody,
      icon: payload.notification?.image || "/images/pwa-192.png",
      badge: "/res/drawable-xxxhdpi/ic_notification.png",
      tag: notificationId || "notification",
      requireInteraction: false,
      data: {
        notificationId,
        transactionId,
        ...payload.data,
      },
    };

    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  } catch (error) {
    console.error("[SW] Error handling push:", error);
  }
});

self.addEventListener("notificationclose", (event) => {
  console.log("[SW] Notification closed:", event.notification.tag);
});

self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event.notification);
  event.notification.close();

  const notificationId = event.notification.data?.notificationId;
  const transactionId = event.notification.data?.transactionId;
  let urlToOpen = "/dashboard";

  if (notificationId) {
    urlToOpen = "/dashboard/notifications/";
  } else if (transactionId) {
    urlToOpen = `/dashboard/transactions/${transactionId}`;
  }

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            if ("focus" in client) {
              client.focus();
            }

            client.postMessage({
              type: "navigate",
              url: urlToOpen,
              notificationId,
              transactionId,
            });
            return undefined;
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }

        return undefined;
      })
      .catch((error) => {
        console.error("[SW] Error handling notification click:", error);
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
        return undefined;
      })
  );
});
