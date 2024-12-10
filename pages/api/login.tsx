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
      res.setHeader(
        'Set-Cookie',
        `user=${result.userId}; HttpOnly; Path=/; Max-Age=3600`,
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
