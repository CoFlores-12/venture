const CACHE_NAME = "app-cache-v1";
const CACHE_URLS = [
    "/", 
    "/home",
    "/logo.png",
    "/events",
    "/offline.html",
    "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
];

self.addEventListener("install", (event) => {
  console.log("Service Worker instalado.");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS);
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone()); 
            return response;
          });
        })
        .catch(() => caches.match(event.request).then((response) => {
          return response || caches.match("/offline.html");
        }))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activado.");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

  
self.addEventListener('push', function (event) {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: data.icon || '/logo.png',
    image: data.image,
    badge: data.badge,
    data: {
      url: data.url,
      ...data.data
    },
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});



  
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const url = event.notification.data?.url || '/home';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Si ya hay una pestaña abierta, enfóquela
      for (let client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }

      // Si no, abre nueva pestaña
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
