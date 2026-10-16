const CACHE_NAME = "atende-plus-shell-v1";
const APP_ROOT = self.registration.scope;
const INDEX_URL = new URL("index.html", APP_ROOT).href;
const APP_SHELL = [
    "./",
    "index.html",
    "manifest.json",
    "assets/css/global.css",
    "assets/js/api-client.js",
    "assets/js/geolocation.js",
    "assets/icons/icon-192.png",
    "assets/icons/icon-512.png"
].map((path) => new URL(path, APP_ROOT).href);

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((names) => Promise.all(
                names
                    .filter((name) => name.startsWith("atende-plus-shell-") && name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    const url = new URL(request.url);

    if (request.method !== "GET" || url.origin !== self.location.origin ||
            !url.href.startsWith(APP_ROOT)) {
        return;
    }

    // Versão atual pela rede; cópia local quando a ligação falha.
    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);

        try {
            const response = await fetch(request);
            if (response.status >= 500) {
                throw new Error("Servidor indisponível");
            }
            if (response.ok) {
                await cache.put(request, response.clone()).catch(() => {});
            }
            return response;
        } catch {
            const cached = await cache.match(request, { ignoreSearch: true });
            if (cached) return cached;

            if (request.mode === "navigate") {
                const index = await cache.match(INDEX_URL);
                if (index) return index;
            }

            return Response.error();
        }
    })());
});
