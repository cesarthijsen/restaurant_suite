const CACHE_NAME = "restaurant-pos-demo-v1";
const DEMO_START = "/desk/restaurant-pos?mode=demo";

self.addEventListener("install", () => {
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((keys) =>
			Promise.all(keys.filter((key) => key.startsWith("restaurant-pos-") && key !== CACHE_NAME).map((key) => caches.delete(key)))
		).then(() => self.clients.claim())
	);
});

self.addEventListener("fetch", (event) => {
	const request = event.request;
	if (request.method !== "GET") return;

	const url = new URL(request.url);
	if (url.origin !== self.location.origin) return;

	if (request.mode === "navigate" && (url.pathname === "/desk/restaurant-pos" || url.pathname === "/desk/restaurant-time-clock")) {
		event.respondWith(
			fetch(request)
				.then((response) => {
					if (response.ok) {
						const copy = response.clone();
						caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
					}
					return response;
				})
				.catch(async () => {
					const cached = await caches.match(request, { ignoreSearch: true });
					if (cached) return cached;
					const start = await caches.match(DEMO_START, { ignoreSearch: true });
					if (start) return start;
					return new Response("Restaurant POS is offline. Connect once to prepare this tablet.", {
						status: 503,
						headers: { "Content-Type": "text/plain; charset=utf-8" },
					});
				})
		);
		return;
	}

	if (url.pathname.startsWith("/assets/")) {
		event.respondWith(
			caches.match(request).then((cached) => {
				const network = fetch(request).then((response) => {
					if (response.ok) {
						const copy = response.clone();
						caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
					}
					return response;
				});
				return cached || network;
			})
		);
	}
});
