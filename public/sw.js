const CACHE_NAME = 'rv-v1';
const EMERGENCY_CACHE = 'rv-emergency-v1';

const EMERGENCY_PATHS = ['/notfall', '/api/emergency/', '/api/risk/'];
const STATIC_EXT = ['.js', '.css', '.png', '.svg', '.ico', '.woff', '.woff2'];
const NETWORK_ONLY = ['/api/news', '/news'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(['/', '/dashboard', '/notfall', '/manifest.json'])
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME && k !== EMERGENCY_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  
  // Network-only for news
  if (NETWORK_ONLY.some(p => url.pathname.startsWith(p))) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }

  // Cache-first for emergency data
  if (EMERGENCY_PATHS.some(p => url.pathname.startsWith(p))) {
    e.respondWith(
      caches.open(EMERGENCY_CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          const fetchPromise = fetch(e.request).then(response => {
            if (response.ok) cache.put(e.request, response.clone());
            return response;
          }).catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // Cache-first for static assets
  if (STATIC_EXT.some(ext => url.pathname.endsWith(ext))) {
    e.respondWith(
      caches.match(e.request).then(cached =>
        cached || fetch(e.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
          }
          return response;
        })
      )
    );
    return;
  }

  // Network-first for everything else (HTML pages, API)
  e.respondWith(
    fetch(e.request).then(response => {
      if (response.ok && (response.headers.get('content-type') || '').includes('text/html')) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      }
      return response;
    }).catch(() => caches.match(e.request).then(cached => cached || caches.match('/')))
  );
});

// Background sync for check-ins
self.addEventListener('sync', (e) => {
  if (e.tag === 'sync-checkins') {
    e.waitUntil(syncCheckins());
  }
});

async function syncCheckins() {
  // Replay stored checkins when back online
  const db = await openDB();
  const tx = db.transaction('pending-checkins', 'readonly');
  const store = tx.objectStore('pending-checkins');
  const checkins = await store.getAll();
  for (const ci of checkins) {
    try {
      await fetch('/api/checkin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ci) });
      const writeTx = db.transaction('pending-checkins', 'readwrite');
      writeTx.objectStore('pending-checkins').delete(ci.id);
    } catch {}
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('rv-offline', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('pending-checkins')) db.createObjectStore('pending-checkins', { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
