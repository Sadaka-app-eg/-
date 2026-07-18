// Service Worker لمعرض الدار العالمية للنشر والتجليد
// بيخزن كل ملفات الموقع جوه الجهاز عشان يشتغل من غير إنترنت خالص

const CACHE_NAME = 'dar-alalamiya-cache-v7';

const FILES_TO_CACHE = [
  './index.html',
  './books.js',
  './manifest.json',
  
  './icon-512.png'
];

// عند تثبيت الـ Service Worker: نخزن كل الملفات الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// عند التفعيل: نمسح أي نسخة قديمة من الكاش
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// عند أي طلب: نجيب من الكاش الأول (Cache First)، ولو مش موجود نحاول من النت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // لو مفيش نت ومفيش نسخة مخزنة، نرجع صفحة الفهرس كحل بديل
        return caches.match('./index.html');
      });
    })
  );
});

