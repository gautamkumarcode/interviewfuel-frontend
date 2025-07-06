import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/profile"];
const authRoutes = ["/login", "/register"];
const publicRoutes = ["/", "/about"];

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.some((route) =>
		path.startsWith(route)
	);
	const isAuthRoute = authRoutes.includes(path);
	const isPublicRoute = publicRoutes.includes(path);

	// Get token from cookies
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	// Handle auth routes
	if (isAuthRoute) {
		if (token) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}
		return NextResponse.next();
	}

	// Handle protected routes
	if (isProtectedRoute) {
		if (!token) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		// You can also verify token expiration here if needed
		if (token.error === "RefreshAccessTokenError") {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		return NextResponse.next();
	}

	// Handle public routes
	if (isPublicRoute) {
		return NextResponse.next();
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
