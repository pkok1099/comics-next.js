import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl; // Path URL saat ini
  const userCookie = request.cookies.get('user'); // Ambil cookie 'user'

  // Izinkan akses ke halaman tertentu tanpa autentikasi
  if (pathname.startsWith('/login') || pathname.startsWith('/public')) {
    return NextResponse.next();
  }

  // Redirect ke login jika user belum login
  if (!userCookie) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Izinkan akses jika user sudah login
  return NextResponse.next();
}

// Konfigurasi agar middleware bekerja di semua halaman
export const config = {
  matcher: '/:path*', // Proteksi semua halaman
};
