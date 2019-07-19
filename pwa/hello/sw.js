// Add all the files you would like to be available while offline
var offlineFiles = [
    "/pwa/hello/",
    "/pwa/hello/index.html",
    "/pwa/hello/manifest.json",
    "/pwa/hello/icon.png"
];

// The first event handled by the worker. Start by caching all the assets needed to run the app offline.
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open("serviceWorkerCache").then(cache => {
            return cache.addAll(offlineFiles);
        }));
});

// After the 'install' event is complete, start using this service worker to start serving assets for the page.
self.addEventListener("activate", function(event) {
    event.waitUntil(self.clients.claim());
});

// Handle requests for the app's resources e.g. index.html, main.css, etc.
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(response => {
            // If we have the file cached, return it, otherwise fetch it over the internet.
            return response || fetch(event.request);
        }).catch(() => {
            console.log("Failed to get " + event.request.url + " from the cache");
        }));
});
