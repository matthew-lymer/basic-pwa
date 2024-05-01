var cacheName = 'version-1.05';
var filesToCache = [
    //HTML
    'index.html?v='+cacheName,
    //CSS
    'css/style.css?v='+cacheName,
    //JS
    'js/scripts.js?v='+cacheName,
    'js/jquery.min.js?v='+cacheName,
    'js/pwa.js?v='+cacheName,
    //Images
    'images/tab-icon-01.svg?v='+cacheName,
    'images/tab-icon-02.svg?v='+cacheName,
    'images/tab-icon-03.svg?v='+cacheName,
    'images/close-white.svg?v='+cacheName,
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

self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});

//Cache first
//Use this - network first breaks while offline :(
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if(response) {
                return response;
            }
            return fetch(event.request);
        }
        )
    );
});
