'use client';

import { useEffect } from 'react';
import { TrafficSource } from '@/lib/mongodb';

/**
 * Detects visitor source accurately based on URL parameters and document.referrer.
 * Supports: 'linkedin' | 'google' | 'naukri' | 'resume' | 'direct' | 'other'
 */
function parseTrafficSource(referrer: string, searchParams: URLSearchParams): { source: TrafficSource; rawReferrer: string } {
  const refParam = (searchParams.get('ref') || searchParams.get('utm_source') || searchParams.get('source') || '').toLowerCase();
  const lowerRef = referrer.toLowerCase();

  // 1. Explicit URL parameter matching
  if (refParam.includes('linkedin')) return { source: 'linkedin', rawReferrer: referrer };
  if (refParam.includes('naukri')) return { source: 'naukri', rawReferrer: referrer };
  if (refParam.includes('resume') || searchParams.get('utm_campaign')?.toLowerCase().includes('resume')) {
    return { source: 'resume', rawReferrer: referrer };
  }
  if (refParam.includes('google')) return { source: 'google', rawReferrer: referrer };

  // 2. HTTP Document Referrer matching
  if (lowerRef) {
    // If referrer is internal/same site navigation, ignore referrer domain
    const isInternal = lowerRef.includes('sanketkedare.com') || lowerRef.includes('localhost') || lowerRef.includes('127.0.0.1');

    if (!isInternal) {
      if (lowerRef.includes('linkedin.com') || lowerRef.includes('lnkd.in')) {
        return { source: 'linkedin', rawReferrer: referrer };
      }
      if (lowerRef.includes('google.') || lowerRef.includes('google.co')) {
        return { source: 'google', rawReferrer: referrer };
      }
      if (lowerRef.includes('naukri.com')) {
        return { source: 'naukri', rawReferrer: referrer };
      }
      if (lowerRef.includes('cloudinary.com') || lowerRef.endsWith('.pdf')) {
        return { source: 'resume', rawReferrer: referrer };
      }
      // Any other external domain (GitHub, Twitter/X, Reddit, etc.)
      return { source: 'other', rawReferrer: referrer };
    }
  }

  // 3. Fallback to Direct Navigation
  return { source: 'direct', rawReferrer: referrer };
}

function detectDevice(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;
  if (/ipad|tablet/i.test(ua) || (width >= 768 && width < 1024)) return 'tablet';
  if (/mobile|iphone|ipod|android.*mobile|blackberry/i.test(ua) || width < 768) return 'mobile';
  return 'desktop';
}

function detectBrowser(): string {
  if (typeof navigator === 'undefined') return 'Other';
  const ua = navigator.userAgent;
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/')) return 'Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Opera') || ua.includes('OPR/')) return 'Opera';
  return 'Other';
}

function detectOS(): string {
  if (typeof navigator === 'undefined') return 'Other';
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac') && !ua.includes('iPhone') && !ua.includes('iPad')) return 'macOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Linux')) return 'Linux';
  return 'Other';
}

/**
 * Invisible Client-Side Visit Tracker
 * Dispatches asynchronously on initial mount with session deduplication.
 * Renders null — zero public UI impact.
 */
export default function VisitTracker() {
  useEffect(() => {
    // Avoid double counting within the same browser tab session
    const SESSION_KEY = 'sanket_portfolio_tracked';
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        return;
      }
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch (_) {
      // Ignore if storage is blocked
    }

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const { source, rawReferrer } = parseTrafficSource(document.referrer, searchParams);

      const payload = {
        source,
        rawReferrer: rawReferrer.slice(0, 500),
        utmSource: (searchParams.get('utm_source') || searchParams.get('ref') || '').slice(0, 100),
        utmMedium: (searchParams.get('utm_medium') || '').slice(0, 100),
        utmCampaign: (searchParams.get('utm_campaign') || '').slice(0, 100),
        path: window.location.pathname || '/',
        device: detectDevice(),
        browser: detectBrowser(),
        os: detectOS(),
      };

      const jsonStr = JSON.stringify(payload);

      // Prefer non-blocking sendBeacon if supported
      if (navigator.sendBeacon) {
        const blob = new Blob([jsonStr], { type: 'application/json' });
        navigator.sendBeacon('/api/track', blob);
      } else {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: jsonStr,
          keepalive: true,
        }).catch(() => {});
      }
    } catch (err) {
      // Fail silently to never impact the portfolio experience
    }
  }, []);

  return null;
}
