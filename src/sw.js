self.addEventListener('install',function(event) {
  console.log(event.request);
  caches.open('pang-transportation-static-v1').then(function(cache) {
    return cache.addAll([
      '/',
      'libs/bootstrap/dist/css/bootstrap.css',
      'css/style.css',
      'libs/jquery/dist/jquery.min.js',
      'libs/bootstrap/dist/js/bootstrap.js',
      'scripts/app.js'
    ]);
  });
});

self.addEventListener('fetch',function(event) {
  console.log(event.request);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      console.log(response);
      if (!response) {
        return fetch(event.request);
      } else {
        return response;
      }
    })
  );
})