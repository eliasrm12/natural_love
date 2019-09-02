console.log("Service Worker Loaded...");

// Files to cache
const myCache = 'cache-v1';
var contentToCache = [
  './',
  './index.html',
  './naturallove.webmanifest',
  './js/routes.js',
  './js/spa.js',
  './js/app.js',
  './js/info.json',
  './bridge.css',
  './css/reset.css',
  './css/style.css',
  './css/responsive.css',
  './fonts/nunito-v11-latin-regular.eot',
  './fonts/nunito-v11-latin-regular.svg',
  './fonts/nunito-v11-latin-regular.ttf',
  './fonts/nunito-v11-latin-regular.woff',
  './fonts/nunito-v11-latin-regular.woff2',
  './img/natural-love.ico',
  './img/assets.svg',
  './img/logos.svg',
  './img/logo.svg',
  './img/sil.jpg',
  './img/bg.svg',
  './img/placeholder.png',
  './views/blog/blog.html',
  './views/blog/create.html',
  './views/blog/update.html',
  './views/galery/galery.html',
  './views/home.html'
];



// Installing Service Worker

self.addEventListener('install', function(e){

  // Guardar archivos iniciales
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(myCache).then(function(cache) {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(contentToCache);
    })
  );

});



self.addEventListener('activate', event => {
  
  event.waitUntil( // Se utiliza para que el worker espere a que la promesa termine
    caches.keys().then(function(cacheNames){
      let promises = cacheNames.map(cacheName => {
        if(myCache !== cacheName) return caches.delete(cacheName); //caches.delete(cacheName) devuelve una promesa
      });

      return Promise.all(promises);

    })
  );
});


self.addEventListener('fetch', function(e) { 
  e.respondWith(
    caches.match(e.request).then(function(r) {
      console.log('[Service Worker] Fetching resource: '+e.request.url); 
      return r || fetch(e.request).then(function(response) {
        return caches.open(myCache).then(function(cache) {
          console.log('[Service Worker] Caching new resource: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    }).catch(function(err){
      if (e.request.mode == 'navigate') {
        return caches.match(event.request);
      }
    })
  );
});


self.addEventListener("push", e => {
  if (!Notification || Notification.permission !== 'granted') {
    return;
  }
  const data = e.data.json();
  const subscribed = self.registration.showNotification(data.title, {
    body: data.message ,
    icon: './img/icons/icon-96.png'
  });
  e.waitUntil(subscribed);
});
