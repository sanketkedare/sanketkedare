/**
 * Client-side resume URL cache.
 * The real source of truth is MongoDB (resumes collection, isActive: true).
 * This module caches the URL in localStorage so components can read it
 * synchronously after the first async fetch.
 */

let cachedResumeUrl: string | null = null;

/**
 * Fetches the active resume URL from MongoDB via /api/resume.
 * Caches in localStorage for subsequent synchronous reads.
 * Returns empty string if nothing is configured.
 */
export async function fetchActiveResumeUrl(): Promise<string> {
  if (typeof window === 'undefined') return '';

  try {
    const res = await fetch('/api/resume', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.url && data.url.startsWith('http')) {
        cachedResumeUrl = data.url;
        localStorage.setItem('sk_active_resume_url', data.url);
        return data.url;
      }
    }
  } catch (e) {
    console.warn('[resume-config] Could not fetch from MongoDB:', e);
  }

  const stored = localStorage.getItem('sk_active_resume_url');
  if (stored && stored.startsWith('http')) return stored;

  return cachedResumeUrl || '';
}

/**
 * Synchronous read of the cached/stored resume URL.
 */
export function getResumeUrl(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('sk_active_resume_url');
    if (stored && stored.startsWith('http')) return stored;
  }
  return cachedResumeUrl || '';
}

/**
 * Writes a URL to the in-memory cache and localStorage,
 * then dispatches an update event for any listening components.
 */
export function setActiveResumeUrl(url: string) {
  cachedResumeUrl = url;
  if (typeof window !== 'undefined') {
    if (url) {
      localStorage.setItem('sk_active_resume_url', url);
    } else {
      localStorage.removeItem('sk_active_resume_url');
    }
    window.dispatchEvent(new CustomEvent('sk-resume-updated', { detail: { url } }));
  }
}

export const RESUME_FILENAME = 'Sanket_Kedare_Full_Stack_Developer_Resume.pdf';
