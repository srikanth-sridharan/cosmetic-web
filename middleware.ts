import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // Allow all API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isRootPage = pathname === '/';

  // Create response for modification
  let response: NextResponse;

  // Handle redirects
  if (token) {
    if (isRootPage || isAuthPage) {
      response = NextResponse.redirect(new URL('/profile', request.url));
    } else {
      response = NextResponse.next();
    }
  } else {
    response = NextResponse.next();
  }

  // Add CSP header with nonce to all responses
  const cspHeader = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data:`,
    `font-src 'self'`,
  ].join('; ');

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Nonce', nonce);

  // Custom redirection logic for /about/*
  if (pathname.startsWith('/about')) {
    response = NextResponse.redirect(new URL('/home', request.url));
    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('X-Nonce', nonce);
  }

  return response;
}

export const config = {
  matcher: ['/', '/login', '/signup', '/about/:path*'],
};
