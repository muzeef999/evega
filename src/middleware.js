import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Define paths that do not require authentication
const publicPaths = ["/login", "/api/auth/error", "/", "/about"];

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Allow access to public paths without authentication
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if the user is trying to access the dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      // Redirect unauthenticated users to the login page
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged-in users from the login page to the dashboard
  if (pathname === "/login" && token) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Proceed with the request for all other cases
  return NextResponse.next();
}

export const config = {
  // Explicitly match all routes except static files, API routes, and images
  matcher: [
    "/dashboard/:path*", // Protect dashboard and its subpaths
    "/((?!api|_next/static|_next/image|.*\\..*).*)", // Match pages without file extensions
  ],
};
