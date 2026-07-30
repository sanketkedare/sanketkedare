'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
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
    }
  }, []);

  return null;
}
