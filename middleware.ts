import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Route configuration with more granular control
const routeConfig = {
  protected: [
    "/dashboard",
    "/profile",
    "/settings",
    "/account",
    "/billing"
  ],
  auth: [
    "/login",
    "/register",
    "/reset-password",
    "/forgot-password"
  ],
  public: [
    "/",
    "/about",
    "/contact",
    "/pricing",
    "/blog",
    "/blog/:path*"
  ],
  api: [
    "/api/auth",
    "/api/public"
  ]
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApiRoute = pathname.startsWith('/api');

  // Skip middleware for API auth routes and static files
  if (
    isApiRoute && routeConfig.api.some(route => pathname.startsWith(route)) ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next();
  }

  // Get token with additional security options
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: process.env.NODE_ENV === 'production' 
      ? '__Secure-next-auth.session-token' 
      : 'next-auth.session-token',
    secureCookie: process.env.NODE_ENV === 'production'
  });

  // Check route types with more efficient matching
  const isProtectedRoute = routeConfig.protected.some(route => 
    pathname.startsWith(route)
  );
  const isAuthRoute = routeConfig.auth.includes(pathname);
  const isPublicRoute = routeConfig.public.some(route => 
    pathname === route || pathname.startsWith(route.replace(':path*', ''))
  );

  // Handle authentication routes
  if (isAuthRoute) {
    if (token) {
      // Redirect to previous page or dashboard
      const redirectUrl = request.nextUrl.searchParams.get('callbackUrl') || '/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute) {
    if (!token) {
      // Store the attempted URL for redirect after login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Additional token validation
    if (token.error === "RefreshAccessTokenError") {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'SessionExpired');
      return NextResponse.redirect(loginUrl);
    }

    // You can add role-based access control here
    // if (pathname.startsWith('/admin') && token.role !== 'admin') {
    //   return NextResponse.redirect(new URL('/unauthorized', request.url));
    // }

    return NextResponse.next();
  }

  // Handle public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Default behavior for unmatched routes (404 or redirect)
  return NextResponse.next();
  // Alternatively, redirect to 404 page:
  // return NextResponse.rewrite(new URL('/404', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};