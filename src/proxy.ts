import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Guard Admin Dashboard Routes
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      // Decode JWT base64 payload to check role at the routing layer
      const payloadBase64 = token.split(".")[1];
      // atob is standard in Edge runtime
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      if (payload.role !== "ADMIN") {
        // Redirect standard customers to home page
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // 2. Guard Customer profile and checkout flows
  if (pathname.startsWith("/profile") || pathname.startsWith("/checkout")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Matches all routes under /admin, /profile, and /checkout
  matcher: ["/admin/:path*", "/profile/:path*", "/checkout/:path*"],
};
