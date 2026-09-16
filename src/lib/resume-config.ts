/**
 * Client-side resume URL cache.
 * The real source of truth is MongoDB (resumes collection, isActive: true).
 * This module caches the URL in localStorage so components can read it
 * synchronously after the first async fetch.
 */

let cachedResumeUrl: string | null = null;
let cachedResumeFilename: string | null = null;

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
        cachedResumeFilename = data.filename || null;
        localStorage.setItem('sk_active_resume_url', data.url);
        if (data.filename) {
          localStorage.setItem('sk_active_resume_filename', data.filename);
        }
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
 * Synchronous read of the cached/stored original resume filename.
 */
export function getResumeFilename(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('sk_active_resume_filename');
    if (stored) return stored;
  }
  return cachedResumeFilename || 'resume.pdf';
}

/**
 * Writes a URL to the in-memory cache and localStorage,
 * then dispatches an update event for any listening components.
 */
export function setActiveResumeUrl(url: string, filename?: string) {
  cachedResumeUrl = url;
  if (filename) cachedResumeFilename = filename;
  if (typeof window !== 'undefined') {
    if (url) {
      localStorage.setItem('sk_active_resume_url', url);
      if (filename) localStorage.setItem('sk_active_resume_filename', filename);
    } else {
      localStorage.removeItem('sk_active_resume_url');
      localStorage.removeItem('sk_active_resume_filename');
    }
    window.dispatchEvent(new CustomEvent('sk-resume-updated', { detail: { url, filename } }));
  }
}

export const RESUME_FILENAME = 'resume.pdf';

/**
 * Transforms a raw Cloudinary PDF URL to include the `fl_attachment` transformation flag.
 * This instructs Cloudinary to deliver the asset with `Content-Disposition: attachment`,
 * bypassing Cloudinary's in-browser raw PDF rendering restrictions and ensuring instant downloads.
 */
export function getDownloadableResumeUrl(url: string, filename?: string): string {
  if (!url) return '';
  if (url.includes('cloudinary.com') && url.includes('/image/upload/')) {
    if (filename) {
      const cleanName = filename.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      return url.replace(/\/image\/upload\/(?:fl_attachment[^/]*\/)?/, `/image/upload/fl_attachment:${cleanName}/`);
    }
    return url.replace(/\/image\/upload\/(?:fl_attachment[^/]*\/)?/, '/image/upload/fl_attachment/');
  }
  return url;
}

/**
 * Initiates an immediate download of the resume file.
 * Preserves the exact original PDF filename uploaded and configured in MongoDB.
 * Priority order:
 * 1. Fetch from the same-origin `/api/resume/download` Next.js proxy route as a blob (clean, seamless, no tab change).
 * 2. Fallback to same-origin download anchor trigger.
 * 3. Fallback to direct Cloudinary `fl_attachment` URL.
 */
export async function triggerResumeDownload(customFilename?: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const initialFilename = customFilename || getResumeFilename() || 'resume.pdf';

  try {
    const res = await fetch('/api/resume/download');
    if (res.ok) {
      // Extract exact filename from Content-Disposition header if provided by server
      let targetFilename = initialFilename;
      const disposition = res.headers.get('content-disposition');
      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
          targetFilename = decodeURIComponent(match[1].replace(/['"]/g, '').trim());
        }
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = targetFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1500);
      return;
    }
  } catch (err) {
    console.warn('[resume-download] Stream fetch failed, falling back to direct route:', err);
  }

  // Fallback 1: Direct same-origin route navigation
  try {
    const a = document.createElement('a');
    a.href = '/api/resume/download';
    a.download = initialFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  } catch (err) {
    console.warn('[resume-download] Direct route anchor failed:', err);
  }

  // Fallback 2: Cloudinary forced-download URL
  const resumeUrl = getResumeUrl() || (await fetchActiveResumeUrl());
  if (resumeUrl) {
    const directUrl = getDownloadableResumeUrl(resumeUrl, initialFilename);
    const a = document.createElement('a');
    a.href = directUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.download = initialFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

