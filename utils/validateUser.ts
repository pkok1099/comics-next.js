import { NextApiRequest } from 'next';

export function validateUser(req: NextApiRequest): string {
  const cookies = req.headers.cookie; // Mendapatkan cookie dari header
  const userCookie =
    cookies &&
    cookies.split(';').find((cookie) => cookie.trim().startsWith('user=')); // Mencari cookie 'user'

  if (!userCookie) {
    throw new Error('User is not logged in'); // Error jika cookie 'user' tidak ditemukan
  }

  return userCookie.split('=')[1]; // Mendapatkan nilai dari cookie 'user'
}
