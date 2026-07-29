import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';

  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return NextResponse.next();
  }

  let shouldRedirect = false;
  const canonicalDomain = 'www.sanketkedare.com';

  if (host === 'sanketkedare.com') {
    url.host = canonicalDomain;
    url.port = '';
    shouldRedirect = true;
  }

  const forwardedProto = request.headers.get('x-forwarded-proto');
  if (url.protocol === 'http:' && forwardedProto !== 'https') {
    url.protocol = 'https:';
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)',
};
