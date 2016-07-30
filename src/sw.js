var staticCacheName = 'pang-transportation-static-v1';

self.addEventListener('install',function(event) {
  // console.log(event.request);
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        'https://cdn.firebase.com/js/client/2.4.2/firebase.js',
        'images/reload.gif',
        'css/styles.css',
        'scripts/app.js'
      ]);
    })
  );
});

self.addEventListener('activate',function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('pang-transportation-') &&
            cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  )
});

self.addEventListener('fetch',function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  )
});

self.addEventListener('message',function(event) {
  if (event.data.action == 'skipWaiting') {
    self.skipWaiting();
  }
});

