import { NextApiRequest, NextApiResponse } from 'next';
import { addOrUpdateHistory } from '../../../services/historyService';
import { validateUser } from '../../../utils/validateUser';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const user = validateUser(req);
      const { title, chapterId } = req.body;
      const result = await addOrUpdateHistory(user, title, chapterId);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

