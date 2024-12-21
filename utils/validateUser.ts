import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'defaultsecretkey';

interface User {
  id: string;
  username: string;
  iat: number;
  exp: number;
}

export function validateUser(req: NextApiRequest): User {
  const cookies = req.headers.cookie || ''; // Mendapatkan cookie dari header, default ke string kosong jika undefined

  // Memisahkan dan mencari cookie 'user' menggunakan RegExp untuk validasi yang lebih kuat
  const match = cookies.match(/(?:^|;\s*)user=([^;]*)/);
  const userToken = match ? match[1] : null;

  if (!userToken) {
    throw new Error('User is not logged in'); // Error jika token user tidak ditemukan
  }

  try {
    // Memverifikasi token dengan secret key
    const decoded: any = jwt.verify(userToken, SECRET_KEY);

    // Memastikan properti iat dan exp ada dan bertipe number
    const iat = typeof decoded.iat === 'number' ? decoded.iat : 0;
    const exp = typeof decoded.exp === 'number' ? decoded.exp : 0;

    // Mengembalikan id dan username dari token yang terdekripsi
    return {
      id: decoded.id,
      username: decoded.username,
      iat,
      exp,
    };
  } catch (error) {
    throw new Error('Invalid token or token has expired'); // Error jika token tidak valid atau sudah kedaluwarsa
  }
}
