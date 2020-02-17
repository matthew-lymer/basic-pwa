var cacheName = 'PWA-sample-v1234567'; //V7
var filesToCache = [
  'index.html',
  'css/style.css',
  'js/scripts.js',
  'images/smiley.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('caching shell assets');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request);
        })
    );
});
