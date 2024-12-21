import { NextApiRequest, NextApiResponse } from 'next';
import { getHistoryByUser } from '@/services/getHistoryByUser';
import { validateUser } from '../../../utils/validateUser';

interface User {
  id: string;
  username: string;
  iat: number;
  exp: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const user: User = validateUser(req); // Pastikan validateUser mengembalikan objek User
      const history = await getHistoryByUser(user.username);
      res.status(200).json(history);
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
        console.log(error);
      } else {
        res.status(401).json({ message: 'Unknown error occurred' });
      }
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
