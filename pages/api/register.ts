import { NextApiRequest, NextApiResponse } from 'next';
import { registerUser } from '../../services/authService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;
      const result = await registerUser(username, password);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
