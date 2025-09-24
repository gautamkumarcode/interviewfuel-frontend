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
  // Remove auth routes since you're using modals instead of dedicated pages
  auth: [
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

// Enhanced middleware with better session handling
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

  // Get token with enhanced session validation
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: process.env.NODE_ENV === 'production' 
      ? '__Secure-next-auth.session-token' 
      : 'next-auth.session-token',
    secureCookie: process.env.NODE_ENV === 'production'
  });

  // Enhanced session validation
  const isValidSession = token && 
    token.exp && 
    Date.now() < (token.exp as number) * 1000 && // Check if token is not expired
    !token.error; // Check if there are no token errors

  // Check route types with more efficient matching
  const isProtectedRoute = routeConfig.protected.some(route => 
    pathname.startsWith(route)
  );
  const isAuthRoute = routeConfig.auth.includes(pathname);
  const isPublicRoute = routeConfig.public.some(route => 
    pathname === route || pathname.startsWith(route.replace(':path*', ''))
  );

  // Handle authentication routes (only for dedicated auth pages like reset-password)
  if (isAuthRoute) {
    if (isValidSession) {
      // Redirect authenticated users away from auth pages
      const redirectUrl = request.nextUrl.searchParams.get('callbackUrl') || '/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute) {
    if (!isValidSession) {
      // Clear invalid session cookies
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('next-auth.session-token');
      response.cookies.delete('__Secure-next-auth.session-token');
      
      // Add query parameters to trigger login modal and store callback URL
      const homeUrl = new URL('/', request.url);
      homeUrl.searchParams.set('showLogin', 'true');
      homeUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(homeUrl);
    }

    // Additional session-based validations
    if (token?.error === "RefreshAccessTokenError") {
      const homeUrl = new URL('/', request.url);
      homeUrl.searchParams.set('showLogin', 'true');
      homeUrl.searchParams.set('error', 'SessionExpired');
      homeUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(homeUrl);
    }

    // Role-based access control
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Add session info to request headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', token?.id || '');
    requestHeaders.set('x-user-role', token?.role || '');
    requestHeaders.set('x-user-email', token?.email || '');

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Handle public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Default behavior for unmatched routes
  return NextResponse.next();
}

// Alternative: Using NextAuth's built-in middleware (simpler approach)
// export { default } from "next-auth/middleware";

// Or you can use withAuth for more control:
// export default withAuth(
//   function middleware(req) {
//     // Additional middleware logic here
//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token, req }) => {
//         const { pathname } = req.nextUrl;
//         
//         // Check if route requires authentication
//         if (routeConfig.protected.some(route => pathname.startsWith(route))) {
//           return !!token && !token.error;
//         }
//         
//         return true;
//       },
//     },
//   }
// );

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