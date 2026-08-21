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
  "/sourcing": ["SUDO", "ADMIN", "SOURCING_AGENT", "DISTRIBUTOR"],
  "/inventory": ["SUDO", "ADMIN", "WAREHOUSE_MANAGER", "SOURCING_AGENT", "DISTRIBUTOR", "SELLER"],
  "/finance": ["SUDO", "ADMIN", "INVESTOR"],
  "/orders": ["SUDO", "ADMIN", "WAREHOUSE_MANAGER", "SOURCING_AGENT", "DISTRIBUTOR", "SELLER"],
  "/customers": ["SUDO", "ADMIN", "SOURCING_AGENT", "DISTRIBUTOR", "SELLER"],
  "/catalog": ["SUDO", "ADMIN", "SOURCING_AGENT", "SELLER", "DISTRIBUTOR"],
  "/checkout": ["SUDO", "ADMIN", "SELLER", "DISTRIBUTOR"],
  "/dashboard": ["SUDO", "ADMIN", "SOURCING_AGENT", "INVESTOR", "SELLER", "DISTRIBUTOR", "WAREHOUSE_MANAGER"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] === "ur-PK" || segments[0] === "en-US" ? segments[0] : "en-US";
  const cleanPath = "/" + segments.slice(segments[0] === "ur-PK" || segments[0] === "en-US" ? 1 : 0).join("/");
  
  // Public auth routes
  if (cleanPath === "/login" || cleanPath.startsWith("/login/") || cleanPath === "/signup") {
    return NextResponse.next();
  }

  const matchedRoute = Object.keys(ROLE_PERMISSIONS).find((route) => cleanPath.startsWith(route));

  // If visiting protected route or unspecified inner page without token, redirect to login
  if (!token) {
    const loginUrl = new URL(`/${locale}/login`, req.url);
    if (cleanPath !== "/" && cleanPath !== "") {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role as string;
    const tenantId = payload.tenantId as string;

    const allowedRoles = matchedRoute ? ROLE_PERMISSIONS[matchedRoute] : undefined;

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
