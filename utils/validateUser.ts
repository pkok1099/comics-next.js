import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'defaultsecretkey';

export function validateUser(req: NextApiRequest): string {
  const cookies = req.headers.cookie || ''; // Mendapatkan cookie dari header, default ke string kosong jika undefined

  // Memisahkan dan mencari cookie 'user' menggunakan RegExp untuk validasi yang lebih kuat
  const match = cookies.match(/(?:^|;\s*)user=([^;]*)/);
  const userToken = match ? match[1] : null;

  if (!userToken) {
    throw new Error('User is not logged in'); // Error jika token user tidak ditemukan
  }

  try {
    // Memverifikasi token dengan secret key
    const decoded = jwt.verify(userToken, SECRET_KEY);
    console.log(decoded)
    // Mengembalikan id dan username dari token yang terdekripsi
    return decoded as string;
  } catch (error) {
    throw new Error('Invalid token or token has expired'); // Error jika token tidak valid atau sudah kedaluwarsa
  }
}
