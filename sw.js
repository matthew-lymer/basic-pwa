const cacheName = 'PWA-sample-v1';
const dynamicCacheName = 'site-dynamic-v1.01';
const filesToCache = [
  'index.html',
  'css/style.css',
  'js/scripts.js'
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('caching shell assets');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
      caches.keys().then(keys => {
          return Promise.all(keys
              .filter(key => key !== cacheName)
              .map(key => caches.delete(key))
          );
      })
  );
});
