const CACHE_NAME = "movie-watch-list-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/images/android-chrome-192x192.png",
  "/images/android-chrome-512x512.png",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
