import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';

  // Ignore localhost / dev environments / Vercel preview URLs
  if (host.includes('localhost') || host.includes('127.0.0.1') || host.includes('.vercel.app')) {
    return NextResponse.next();
  }

  let shouldRedirect = false;
  const canonicalDomain = 'www.sanketkedare.com';

  // Redirect apex sanketkedare.com -> www.sanketkedare.com
  if (host === 'sanketkedare.com') {
    url.host = canonicalDomain;
    url.port = '';
    shouldRedirect = true;
  }

  // Force HTTPS if served via HTTP on production
  const forwardedProto = request.headers.get('x-forwarded-proto');
  if (url.protocol === 'http:' && forwardedProto !== 'https') {
    url.protocol = 'https:';
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    return NextResponse.redirect(url, 308); // Permanent Redirect (SEO canonical)
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|mp4|webm)).*)',
  ],
};
