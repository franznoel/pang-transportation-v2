var staticCacheName = 'pang-transportation-static-v1';

self.addEventListener('install',function(event) {
  // console.log(event.request);
  caches.open(staticCacheName).then(function(cache) {
    return cache.addAll([
      '/',
      'https://storage.googleapis.com/game-usher.appspot.com/reload.gif',
      'libs/bootstrap/dist/css/bootstrap.css',
      'css/style.css',
      'libs/jquery/dist/jquery.min.js',
      'libs/bootstrap/dist/js/bootstrap.js',
      'scripts/app.js'
    ]);
  });
});

self.addEventListener('activate',function() {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('pang-transportation-') &&
            cacheName != staticCacheName;
        }).map(function(cacheName) {
          return cache.delete(cacheName);
        })
      );
    })
  )
});

self.addEventListener('fetch',function(event) {
  // console.log(event.request);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (!response) {
        return fetch(event.request);
      } else {
        return response;
      }
    })
  );
})