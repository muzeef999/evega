export async function middleware(req) {
  const { pathname } = req.nextUrl;
  // Get the user's session token (provided by NextAuth)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    // User is not logged in
    if (pathname === '/') {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/login'; // Redirect unauthenticated users to /login
      return NextResponse.redirect(loginUrl);
    }
  } else {
    // User is logged in
    if (pathname === '/login') {
      const dashboardUrl = req.nextUrl.clone();
      dashboardUrl.pathname = '/dashboard'; // Redirect authenticated users to /dashboard
      return NextResponse.redirect(dashboardUrl);
    }
  }
  // Allow other requests to proceed
  return NextResponse.next();
}
// Configure middleware to run on specific paths
export const config = {
  matcher: ['/', '/login', '/dashboard'], // Adjust paths as needed
};