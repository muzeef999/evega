import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  
  // Check if the request is for the root path
  if (url.pathname === '/') {
    url.pathname = '/login'; // Redirect to login
    return NextResponse.redirect(url);
  }
  
  // Return NextResponse.next() if no redirection is needed
  return NextResponse.next();
}

// Optional: Configure the matcher if you want to limit where this middleware runs
export const config = {
  matcher: '/', // This will apply the middleware only to the root path
};