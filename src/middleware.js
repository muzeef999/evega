import { NextResponse } from 'next/server';

// Check for session cookie directly in the request headers
export async function middleware(req) {
  const url = req.nextUrl.clone();
  
  // Get cookies from the request
  const cookies = req.cookies;

  // Check if there is an authentication cookie (e.g., `next-auth.session-token`)
  const isAuthenticated = cookies['next-auth.session-token']; // Update with your actual cookie name if needed

  // If the user is authenticated and trying to access the root, redirect to the dashboard
  if (url.pathname === '/') {
    if (isAuthenticated) {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    } else {
      // If not authenticated, redirect to login
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Allow the request to proceed if no redirection is needed
  return NextResponse.next();
}

// Optional: Configure the matcher if you want to limit where this middleware runs
export const config = {
  matcher: '/', // This will apply the middleware only to the root path
};
