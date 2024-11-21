import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const authCookie =
    process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

  const isAuthenticated = req.cookies.get(authCookie)?.value;

  console.log("Middleware Auth Cookie:", isAuthenticated); // Debugging

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

  // Allow other requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard"],
};
