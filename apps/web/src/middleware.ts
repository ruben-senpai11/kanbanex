import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const { pathname, search } = request.nextUrl;

  // Detect if current request is accessing the App subdomain (e.g. app.kanbanex.vercel.app, app.kabanex.vercel.app, app.localhost:3000)
  const isAppDomain = host.startsWith('app.') || host.includes('app.kanbanex.vercel.app') || host.includes('app.kabanex.vercel.app');
  const token = request.cookies.get('kanbanex_token')?.value;

  // Case 1: User is accessing via the App Domain
  if (isAppDomain) {
    // When hitting root `/` on app domain, never show landing page: go straight to app or login
    if (pathname === '/') {
      const destination = token ? '/overview' : '/login';
      return NextResponse.redirect(new URL(destination, request.url));
    }

    // If logged in and visiting auth pages, redirect to /overview
    if (token && (pathname === '/login' || pathname === '/signup')) {
      return NextResponse.redirect(new URL('/overview', request.url));
    }

    return NextResponse.next();
  }

  // Case 2: User is accessing via the Landing / Marketing Domain (e.g. kanbanex.vercel.app, kabanex.vercel.app)
  // In production (non-localhost), app routes and auth routes accessed on marketing domain should redirect to app domain
  const isAppRoute =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/verify-email') ||
    pathname.startsWith('/overview') ||
    pathname.startsWith('/projects') ||
    pathname.startsWith('/calendar') ||
    pathname.startsWith('/billing') ||
    pathname.startsWith('/admin');

  const isProduction =
    process.env.NODE_ENV === 'production' &&
    !host.includes('localhost') &&
    !host.includes('127.0.0.1');

  if (isAppRoute && isProduction) {
    const targetAppDomain = host.includes('kanbanex.vercel.app') ? 'app.kanbanex.vercel.app' : 'app.kabanex.vercel.app';
    const appUrl = `https://${targetAppDomain}${pathname}${search}`;
    return NextResponse.redirect(appUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. Static files: images, favicon, apple-touch-icon, svgs, etc.
     */
    '/((?!api|_next/static|_next/image|images|favicon.ico|apple-touch-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
