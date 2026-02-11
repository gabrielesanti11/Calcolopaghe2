const CACHE = "cpa-apmal-v7"; // <-- cambia numero ogni volta che vuoi forzare update
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./pagheicon-192.png",
  "./pagheicon-512.png",
  // se hai css/js separati aggiungili qui
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request))
  );
});
