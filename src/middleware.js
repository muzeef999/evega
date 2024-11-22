import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const authCookie = "next-auth.session-token"; // Define cookie name here
  const isAuthenticated = req.cookies.get(authCookie);



  // Redirect authenticated users away from login page
  if (url.pathname === "/login" && isAuthenticated) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  

  // Redirect unauthenticated users away from dashboard
  if (url.pathname === "/dashboard" && !isAuthenticated) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Proceed with the request for other routes
  return NextResponse.next();
}

// Apply middleware only to login and dashboard routes
export const config = {
  matcher: ["/login", "/dashboard"],
};
