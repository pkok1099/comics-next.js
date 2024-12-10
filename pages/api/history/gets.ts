import { NextApiRequest, NextApiResponse } from 'next';
import { getHistoryByUser } from '../../../services/historyService';
import { validateUser } from '../../../utils/validateUser';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const user = validateUser(req);
      const history = await getHistoryByUser(user);
      res.status(200).json(history);
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
