var cacheName = 'PWA-sample-v12345678'; //V8
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

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (!cacheName.includes(key)) {
                    return caches.delete(key);
                }
            })
        )).then(() => {
            console.log(cacheName +' update applied and cached!');
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
