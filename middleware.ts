import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Ambil cookie user
  const user = req.cookies.get('user')?.value; // Ambil nilai cookie `user`

  // Redirect ke halaman login jika cookie `user` tidak ada atau kosong
  if (!user) {
    const loginUrl = new URL('/login', req.url); // Redirect ke /login
    return NextResponse.redirect(loginUrl);
  }

  // Lanjutkan ke halaman jika cookie valid
  return NextResponse.next();
}

// Konfigurasi halaman yang akan dilindungi oleh middleware
export const config = {
  matcher: ['/history/:path*', '/', '/komikindo/:path*', '/search'], // Middleware ini hanya aktif untuk rute /history dan turunannya
};
