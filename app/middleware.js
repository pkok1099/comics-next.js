// import { NextResponse } from 'next/server'
// import { NextRequest } from 'next/server'
// import { jwtVerify } from 'jose'

// export async function middleware(request: NextRequest) {
// const token = request.cookies.get('token')?.value

// // Jika pengguna sudah login dan mencoba mengakses halaman login atau register, arahkan ke halaman utama
// if (token) {
// try {
// await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
// // Menghindari akses ke halaman login dan register jika sudah login
// if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') {
// return NextResponse.redirect(new URL('/', request.url))
// }
// return NextResponse.next()
// } catch (error) {
// // Jika token tidak valid, alihkan ke halaman login
// return NextResponse.redirect(new URL('/login', request.url))
// }
// }

// // Jika belum login, hanya bisa mengakses /login dan /register
// if (request.nextUrl.pathname !== '/login' && request.nextUrl.pathname !== '/register') {
// return NextResponse.redirect(new URL('/login', request.url))
// }

// return NextResponse.next()
// }

// export const config = {
// matcher: ['/', '/komikindo/:path*', '/login', '/register'],
// }
