import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';

  // Safely bypass middleware for local development environments
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return NextResponse.next();
  }

  let shouldRedirect = false;
  const canonicalDomain = 'www.sanketkedare.com';

  // 1. Enforce 'www' subdomain
  if (host === 'sanketkedare.com') {
    url.host = canonicalDomain;
    url.port = ''; // Strip ports just in case
    shouldRedirect = true;
  }

  // 2. Enforce HTTPS Protocol
  // Cloud ingress providers like Vercel and AWS pass the original protocol via headers
  const forwardedProto = request.headers.get('x-forwarded-proto');
  if (url.protocol === 'http:' && forwardedProto !== 'https') {
    url.protocol = 'https:';
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    // 301 gracefully tells Google/Bing to permanently merge all SEO juice to the canonical HTTPS WWW URL
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

// Config blocks middleware from running on static assets where it isn't needed
export const config = {
  matcher: '/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)',
};
