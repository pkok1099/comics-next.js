import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { loginUser } from '../../services/authService';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'defaultsecretkey';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;
      const user = await loginUser(username, password);

      // Buat JWT untuk user yang berhasil login tanpa waktu kedaluwarsa
      const token = jwt.sign(
        { id: user._id, username: user.username },
        SECRET_KEY,
        // Token ini akan bertahan selamanya
        { expiresIn: '9999y' }, // Token berlaku selama 9999 tahun (asumsi bertahan selamanya)
      );

      // Set cookie dengan token
      res.setHeader(
        'Set-Cookie',
        `user=${token}; HttpOnly; Path=/; Max-Age=315360000; Secure; SameSite=Strict`,
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
            .status(401)
            .json({ message: 'Invalid credentials or unknown error' });
        }
      } else {
        res.status(401).json({ message: 'Unknown error occurred' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
