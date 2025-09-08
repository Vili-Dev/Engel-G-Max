/**
 * Service Worker pour Engel G-Max PWA
 * Optimisé pour la méthode G-Maxing et les contenus d'Engel Garcia Gomez
 */

const CACHE_NAME = 'engelgmax-v1.0.0';
const STATIC_CACHE = 'engelgmax-static-v1.0.0';
const DYNAMIC_CACHE = 'engelgmax-dynamic-v1.0.0';
const IMAGES_CACHE = 'engelgmax-images-v1.0.0';

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  
  // Pages principales
  '/about',
  '/blog',
  '/coaching', 
  '/shop',
  '/newsletter',
  
  // Assets critiques
  '/assets/css/main.css',
  '/assets/js/main.js',
  
  // Icônes PWA
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  
  // Polices importantes (si utilisées)
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Ressources à mettre en cache avec stratégie Network First
const NETWORK_FIRST_ROUTES = [
  '/api/',
  '/blog/',
  '/shop/',
  '/coaching/'
];

// Ressources d'images à mettre en cache
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker G-Maxing: Installation en cours...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Mise en cache des ressources statiques G-Maxing');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker G-Maxing installé avec succès');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Erreur installation Service Worker:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker G-Maxing: Activation en cours...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Supprimer les anciens caches
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGES_CACHE) {
              console.log('🗑️ Suppression ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker G-Maxing activé');
        return self.clients.claim();
      })
  );
});

// Intercepter les requêtes réseau
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }

  // Stratégie différente selon le type de ressource
  if (isImageRequest(request.url)) {
    event.respondWith(handleImageRequest(request));
  } else if (isNetworkFirstRoute(request.url)) {
    event.respondWith(handleNetworkFirstRequest(request));
  } else if (isStaticAsset(request.url)) {
    event.respondWith(handleCacheFirstRequest(request));
  } else {
    event.respondWith(handleStaleWhileRevalidate(request));
  }
});

// Vérifier si c'est une requête d'image
function isImageRequest(url) {
  return IMAGE_EXTENSIONS.some(ext => url.includes(ext));
}

// Vérifier si c'est une route Network First
function isNetworkFirstRoute(url) {
  return NETWORK_FIRST_ROUTES.some(route => url.includes(route));
}

// Vérifier si c'est un asset statique
function isStaticAsset(url) {
  return url.includes('/assets/') || 
         url.includes('/icons/') ||
         url.includes('.css') ||
         url.includes('.js') ||
         url.includes('fonts.googleapis.com');
}

// Stratégie Cache First pour les assets statiques
async function handleCacheFirstRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    // Mettre en cache la réponse
    if (networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Erreur Cache First:', error);
    
    // Fallback vers une ressource générique si disponible
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    return new Response('Ressource non disponible', { 
      status: 503,
      statusText: 'Service Unavailable' 
    });
  }
}

// Stratégie Network First pour le contenu dynamique
async function handleNetworkFirstRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Mettre en cache les réponses réussies
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network First fallback to cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Page offline pour les documents
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    return new Response('Contenu non disponible hors ligne', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Stratégie Stale While Revalidate pour le contenu général
async function handleStaleWhileRevalidate(request) {
  try {
    const cachedResponse = await caches.match(request);
    
    const networkResponsePromise = fetch(request).then(networkResponse => {
      // Mettre à jour le cache en arrière-plan
      if (networkResponse.status === 200) {
        const responseToCache = networkResponse.clone(); // Cloner avant utilisation
        caches.open(DYNAMIC_CACHE).then(c => c.put(request, responseToCache));
      }
      return networkResponse;
    }).catch(() => null);
    
    // Retourner immédiatement la version en cache si disponible
    if (cachedResponse) {
      networkResponsePromise.catch(() => {}); // Ignorer les erreurs réseau
      return cachedResponse;
    }
    
    // Sinon, attendre la réponse réseau
    const networkResponse = await networkResponsePromise;
    if (networkResponse) {
      return networkResponse;
    }
    
    // Fallback vers la page offline
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    return new Response('Contenu non disponible', {
      status: 503,
      statusText: 'Service Unavailable'
    });
    
  } catch (error) {
    console.error('Erreur Stale While Revalidate:', error);
    
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    return new Response('Erreur de service', {
      status: 500,
      statusText: 'Internal Server Error'
    });
  }
}

// Gestion spéciale des images avec cache long terme
async function handleImageRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    // Cache les images avec succès
    if (networkResponse.status === 200) {
      const cache = await caches.open(IMAGES_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Image non disponible:', request.url);
    
    // Retourner une image placeholder générique
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" fill="#374151"><rect width="100%" height="100%"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white">Image non disponible</text></svg>',
      {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}

// Écouter les messages du main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then(size => {
      event.ports[0].postMessage({
        type: 'CACHE_SIZE_RESPONSE',
        size: size
      });
    });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    clearAllCaches().then(() => {
      event.ports[0].postMessage({
        type: 'CACHE_CLEARED'
      });
    });
  }
});

// Calculer la taille du cache
async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

// Nettoyer tous les caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

// Nettoyage périodique des caches (tous les 7 jours)
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 jours

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanExpiredCache());
  }
});

async function cleanExpiredCache() {
  const now = Date.now();
  const cache = await caches.open(DYNAMIC_CACHE);
  const requests = await cache.keys();
  
  for (const request of requests) {
    const response = await cache.match(request);
    if (response) {
      const cachedTime = response.headers.get('sw-cached-time');
      if (cachedTime && (now - parseInt(cachedTime)) > CACHE_EXPIRY) {
        await cache.delete(request);
      }
    }
  }
}

// Gestion des notifications push (pour newsletter)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: data.tag || 'engelgmax-notification',
      data: data.url || '/',
      actions: [
        {
          action: 'open',
          title: 'Ouvrir G-Max',
          icon: '/icons/open-action.png'
        },
        {
          action: 'close',
          title: 'Fermer'
        }
      ],
      requireInteraction: false,
      silent: false
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Nouveau contenu G-Maxing !', options)
    );
  }
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Vérifier si une fenêtre est déjà ouverte
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Ouvrir une nouvelle fenêtre
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Synchroniser les données en attente
    console.log('🔄 Synchronisation en arrière-plan G-Maxing');
    
    // Ici, vous pourriez synchroniser :
    // - Les formulaires soumis hors ligne
    // - Les analytics en attente
    // - Les inscriptions newsletter
    
  } catch (error) {
    console.error('Erreur synchronisation:', error);
  }
}

console.log('🚀 Service Worker Engel G-Max chargé et prêt !');