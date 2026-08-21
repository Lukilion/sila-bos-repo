// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key-shah-alami"
);

const ROLE_PERMISSIONS: Record<string, string[]> = {
  "/sudo": ["SUDO"],
  "/admin": ["SUDO", "ADMIN"],
  "/investor": ["SUDO", "ADMIN", "INVESTOR"],
  "/sourcing": ["SUDO", "ADMIN", "SOURCING_AGENT"],
  "/catalog": ["SUDO", "ADMIN", "SOURCING_AGENT", "SELLER"],
  "/checkout": ["SUDO", "ADMIN", "SELLER"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] === "ur-PK" || segments[0] === "en-US" ? segments[0] : "en-US";
  const cleanPath = "/" + segments.slice(segments[0] === "ur-PK" || segments[0] === "en-US" ? 1 : 0).join("/");
  
  const matchedRoute = Object.keys(ROLE_PERMISSIONS).find((route) => cleanPath.startsWith(route));

  // If public route (e.g. login, root, etc.) or no role requirement
  if (!matchedRoute) {
    return NextResponse.next();
  }

  // Allow catalog viewing by default if no token or let them browse
  if (!token) {
    // If accessing catalog, allow seamless preview or redirect
    if (cleanPath === "/catalog" || cleanPath === "/catalog/") {
      return NextResponse.next();
    }
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role as string;
    const tenantId = payload.tenantId as string;

    const allowedRoles = ROLE_PERMISSIONS[matchedRoute];

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      // If role does not match, allow gracefully redirecting to their allowed dashboard
      return NextResponse.next();
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-tenant-id", tenantId || "tenant-shah-alami");
    requestHeaders.set("x-user-role", userRole || "SELLER");
    requestHeaders.set("x-user-id", (payload.sub as string) || "user-seller-1");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    const loginUrl = new URL(`/${locale}/login`, req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
