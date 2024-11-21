import { NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';

export async function middleware(req) {
  const url = req.nextUrl.clone();

  // Get the session to check if the user is authenticated
  const session = await getSession({ req });

  // Check if the user is trying to access the root path and is authenticated
  if (url.pathname === '/') {
    if (session) {
      // If the user is authenticated, redirect to the dashboard
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    } else {
      // If the user is not authenticated, redirect to login
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Return NextResponse.next() if no redirection is needed
  return NextResponse.next();
}

// Optional: Configure the matcher if you want to limit where this middleware runs
export const config = {
  matcher: '/', // This will apply the middleware only to the root path
};
