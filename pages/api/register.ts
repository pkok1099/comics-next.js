import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { registerUser } from '../../services/authService';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'defaultsecretkey';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;
      const user = await registerUser(username, password);

      // Buat JWT untuk user yang baru terdaftar
      const token = jwt.sign(
        { id: user._id, username: user.username },
        SECRET_KEY,
        { expiresIn: '1h' }, // Token berlaku selama 1 jam
      );

      // Set cookie dengan token
      res.setHeader(
        'Set-Cookie',
        `user=${token}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Strict`,
      );

      // Respons dengan data user (tanpa password)
      res.status(201).json({
        message: 'User successfully registered',
        user: { username: user.username, userId: user._id },
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(401).json({ message: 'Unknown error occurred' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
