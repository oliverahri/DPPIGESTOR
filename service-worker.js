const CACHE_NAME = "app-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/styles.css",
    "/script.js",
    "/img/icon-192x192.png",
    "/img/icon-512x512.png"
];

// Instalar el Service Worker y almacenar en caché los recursos
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Abriendo caché...");
            return cache.addAll(urlsToCache);
        })
    );
});

// Interceptar las solicitudes y servir desde la caché
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Actualizar el caché cuando cambie el contenido
self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log("Eliminando caché antiguo:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
});