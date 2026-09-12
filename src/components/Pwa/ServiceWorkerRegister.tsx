'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[PWA] ServiceWorker registered silently with scope:', reg.scope);
          })
          .catch((err) => {
            console.error('[PWA] ServiceWorker registration failed:', err);
          });
      });
    } else {
      // In development mode, unregister any active service worker and purge cache storage
      // to guarantee zero stale cache serving and prevent hydration mismatches during dev
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then((success) => {
            if (success) console.log('[PWA] Dev mode: Unregistered stale ServiceWorker');
          });
        }
      });
      if ('caches' in window) {
        caches.keys().then((keys) => {
          for (const key of keys) {
            caches.delete(key);
          }
        });
      }
    }
  }, []);

  return null;
}
