var currVersion = '06_04_2020__19_30_00'

// Responde a mensagem de atualização de SW
self.addEventListener("message", function(event) {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(currVersion).then(function(cache) {
        return cache.addAll([
          './',
          'index.html',
          'favicon.ico',
          'manifest.json',
          'sw.js',
          'swreg.js',
          'vendor/fontawesome-free/css/all.min.css',
          'https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i',
          'css/sb-admin-2.min.css',
          'css/sb-fupmobile.css',
          'app/codemirror-5.52.2/lib/codemirror.js',
          'app/codemirror-5.52.2/lib/codemirror.css',
          'app/codemirror-5.52.2/mode/javascript/javascript.js',
          'app/codemirror-5.52.2/theme/dracula.css',
          'app/codemirror-5.52.2/addon/edit/closebrackets.js',
          'app/codemirror-5.52.2/addon/hint/show-hint.js',
          'app/codemirror-5.52.2/addon/hint/javascript-hint.js',
          'vendor/jquery/jquery.min.js',
          'vendor/bootstrap/js/bootstrap.bundle.min.js',
          'vendor/jquery-easing/jquery.easing.min.js',
          'js/sb-admin-2.min.js',
          'app/jshint.js',
          'app/editor.js',
          'app/app.js',
          'app/icons/icon-72x72.png',
          'app/icons/icon-96x96.png',
          'app/icons/icon-128x128.png',
          'app/icons/icon-144x144.png',
          'app/icons/icon-152x152.png',
          'app/icons/icon-192x192.png',
          'app/icons/icon-384x384.png',
          'app/icons/icon-512x512.png',

          'app/codemirror-5.52.2/addon/lint/lint.css',
          'app/codemirror-5.52.2/addon/lint/lint.js',
          'js/mine-js-lint.js'
        ]);
      })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request).then(function (response) {
          // response may be used only once
          // we need to save clone to put one copy in cache
          // and serve second one
          let responseClone = response.clone();
          
          caches.open(currVersion).then(function (cache) {
            cache.put(event.request, responseClone);
          });
          return response;
        }).catch(function () {
          return caches.match('/sw-test/gallery/myLittleVader.jpg');
        });
      }
    }));
});

this.addEventListener('activate', function(event) {
  var cacheWhitelist = [currVersion];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});