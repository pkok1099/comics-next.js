import { NextApiRequest, NextApiResponse } from 'next';
import { loginUser } from '../../services/authService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;
      const result = await loginUser(username, password);

      // Set cookie user setelah login berhasil
      res.setHeader(
        'Set-Cookie',
        `user=${result.userId}; HttpOnly; Path=/; Max-Age=3600`,
      );
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User not found') {
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
