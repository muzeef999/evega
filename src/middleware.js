import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const isAuthenticated = req.cookies.get("next-auth.session-token"); // Adjust cookie name if necessary

  // Redirect authenticated users away from login
  if (url.pathname === "/login" && isAuthenticated) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users away from dashboard
  if (url.pathname === "/dashboard" && !isAuthenticated) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Allow requests to proceed for other routes
  return NextResponse.next();
}

// Apply middleware only to specific routes
export const config = {
  matcher: ["/login", "/dashboard"], // Apply to these routes
};
