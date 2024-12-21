import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { loginUser } from '../../services/authService';

const SECRET_KEY: string = process.env.JWT_SECRET_KEY || 'defaultsecretkey';

// Tipe data untuk user
interface User {
  _id: string;
  username: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;

      const user: User | null = await loginUser(username, password);

      if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      // Buat JWT untuk user yang berhasil login
      const token = jwt.sign(
        { id: user._id, username: user.username },
        SECRET_KEY,
        {
          expiresIn: '9999y', // Token berlaku selama 9999 tahun (teknisnya tidak ideal)
        },
      );

      // Set cookie dengan token
      res.setHeader(
        'Set-Cookie',
        `user=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 365 * 9999}; Secure; SameSite=Strict`,
      );

      // Respons dengan data user (tanpa password)
      res.status(200).json({
        message: 'Login successful',
        user: { username: user.username, userId: user._id },
      });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === 'User not found' ||
          error.message === 'Invalid credentials'
        ) {
          res.status(401).json({ message: error.message });
        } else {
          console.error('Error during login:', error);
          res
            .status(500)
            .json({ message: 'An unknown error occurred during login' });
        }
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
