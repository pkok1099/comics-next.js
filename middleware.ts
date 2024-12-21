import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE = 'user'; // Authentication cookie name
const PROTECTED_ROUTES = ['/', '/history', '/komikindo', '/search']; // Rute yang butuh login
const AUTH_ROUTES = ['/login', '/register']; // Rute khusus user yang belum login

export function middleware(req: NextRequest) {
  const user = req.cookies.get(AUTH_COOKIE)?.value;
  const currentPath = req.nextUrl.pathname; // Get the current request path

  // Prevent logged-in users from accessing /login or /register pages
  if (user && AUTH_ROUTES.includes(currentPath)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Prevent non-logged-in users from accessing protected pages
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => currentPath === route,
  );
  if (!user && isProtectedRoute) {
    // Check if the current path is a protected route
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Jika tidak ada aturan redirect, teruskan request
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/history', '/komikindo', '/search', '/login', '/register'],
};
