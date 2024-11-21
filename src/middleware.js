import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const isAuthenticated = req.cookies.get("next-auth.session-token"); // Adjust cookie name if necessary

  // Redirect from root to dashboard if authenticated
  if (url.pathname === "/") {
    if (isAuthenticated) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    } else {
      // Redirect to login if not authenticated
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Redirect to login if trying to access /dashboard without being authenticated
  if (url.pathname === "/dashboard" && !isAuthenticated) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Proceed with request if no redirection is needed
  return NextResponse.next();
}

// Apply middleware only to specific routes
export const config = {
  matcher: ["/", "/dashboard"], // Apply to these routes
};
