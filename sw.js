const CACHE = "cpaapmal-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./pagheicon-192.png",
  "./pagheicon-512.png",
  "./level-up-08-402152.mp3"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE ? caches.delete(k) : null)))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request))
  );
});
