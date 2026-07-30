'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiDownload, FiX, FiCheckCircle } from 'react-icons/fi';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker in production / client
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[PWA] ServiceWorker registration successful with scope: ', reg.scope);
          })
          .catch((err) => {
            console.error('[PWA] ServiceWorker registration failed: ', err);
          });
      });
    }

    // 2. Capture Chrome / Edge beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      // Check if user dismissed recently
      const lastDismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!lastDismissed || Date.now() - Number(lastDismissed) > 7 * 24 * 60 * 60 * 1000) {
        setIsVisible(true);
      }
    };

    // 3. Listen for successful app installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
      console.log('[PWA] Application installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already in standalone display mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show native browser install prompt
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('[PWA] User accepted the install prompt');
      setIsInstalled(true);
    } else {
      console.log('[PWA] User dismissed the install prompt');
    }

    setIsVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
  };

  if (!isVisible || isInstalled || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] max-w-sm w-[calc(100vw-2.5rem)] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/80 dark:bg-slate-950/85 backdrop-blur-xl border border-cyan-500/30 dark:border-cyan-500/30 rounded-2xl p-4 shadow-2xl shadow-cyan-500/10 flex items-start gap-3.5 relative overflow-hidden group">
        {/* Top Glow Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

        {/* App Icon */}
        <div className="relative w-11 h-11 flex-shrink-0 bg-transparent p-2">
          <Image
            src="/image.png"
            alt="Sanket Kedare App Icon"
            width={44}
            height={44}
            className="w-full h-full object-contain bg-transparent"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 leading-tight">
            Install Portfolio App
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
            Install for fast, offline access and native app experience on your device.
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-xs shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <FiDownload className="w-3.5 h-3.5" />
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              Not Now
            </button>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          aria-label="Close install prompt"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
