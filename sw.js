const CACHE_NAME = "cpa-apmal-v7"; // cambia versione quando aggiorni
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./pagheicon-192.png",
  "./pagheicon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Navigazione (index) -> network-first (così non “resta incastrata”)
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Altri asset -> cache-first
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
