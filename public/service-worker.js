const CACHE_NAME = "app-cache-v1";
const CACHE_URLS = [
    "/", 
    "/home"
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
    let notificationData = {};

    if (event.data) {
        try {
            notificationData = JSON.parse(event.data.text());
        } catch (error) {
            console.error('Error al parsear el payload de la notificación:', error);
        }
    }

    const options = {
        body: notificationData.body || 'Tienes una nueva notificación.', 
        icon: notificationData.icon || '/logo.png'
    };

    if (notificationData.image) {
        options.image = notificationData.image;
    }

    const title = notificationData.title || 'Nueva notificación';

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});


  
  self.addEventListener('notificationclick', function (event) {
    // Aquí puedes manejar el clic en la notificación
    event.notification.close();
    event.waitUntil(
      clients.openWindow('/home') // Abre la aplicación al hacer clic en la notificación
    );
  });
  