import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'user'; // Nama cookie auth
const PROTECTED_ROUTES = ['/', '/history', '/komikindo', '/search']; // Rute yang butuh login
const AUTH_ROUTES = ['/login', '/register']; // Rute khusus user yang belum login

export function middleware(req: NextRequest) {
  const user = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const currentPath = req.nextUrl.pathname;

  // Cegah user login mengakses halaman /login atau /register
  if (user && AUTH_ROUTES.includes(currentPath)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Cegah user yang belum login mengakses halaman terlindungi
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => currentPath === route,
  );
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Jika tidak ada aturan redirect, teruskan request
  return NextResponse.next();
}

export const config = {
  matcher: ['/', ...PROTECTED_ROUTES, ...AUTH_ROUTES],
};
