import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const nonce = crypto.randomUUID().replace(/-/g, ''); // Generate nonce
  
  // Allow all API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isRootPage = pathname === '/';

  // Create response object for other routes
  const response = token && (isRootPage || isAuthPage)
    ? NextResponse.redirect(new URL('/profile', request.url))
    : pathname.startsWith('/about')
      ? NextResponse.redirect(new URL('/home', request.url))
      : NextResponse.next();

  // Set CSP header with nonce
  response.headers.set(
    'Content-Security-Policy',
    `script-src 'self' 'nonce-${nonce}';` +
    `style-src 'self' 'unsafe-inline';` +  // Required for Next.js styles
    `default-src 'self';` +
    `base-uri 'self';` +
    `frame-ancestors 'none';`
  );

  // Add nonce to request headers for pages to consume
  request.headers.set('x-nonce', nonce);

  return response;
}

export const config = {
  matcher: ['/', '/login', '/signup', '/about/:path*'],
};
