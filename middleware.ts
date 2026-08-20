// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key-shah-alami');

const ROLE_PERMISSIONS: Record<string, string[]> = {
  '/sudo': ['SUDO'],
  '/admin': ['SUDO', 'ADMIN'],
  '/investor': ['SUDO', 'ADMIN', 'INVESTOR'],
  '/sourcing': ['SUDO', 'ADMIN', 'SOURCING_AGENT'],
  '/catalog': ['SUDO', 'ADMIN', 'SOURCING_AGENT', 'SELLER'],
  '/checkout': ['SUDO', 'ADMIN', 'SELLER'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('auth_token')?.value;

  const cleanPath = '/' + pathname.split('/').slice(2).join('/');
  const matchedRoute = Object.keys(ROLE_PERMISSIONS).find(route => cleanPath.startsWith(route));

  if (!matchedRoute) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role as string;
    const tenantId = payload.tenantId as string;

    const allowedRoles = ROLE_PERMISSIONS[matchedRoute];

    if (!allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-tenant-id', tenantId);
    requestHeaders.set('x-user-role', userRole);
    requestHeaders.set('x-user-id', payload.sub as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
