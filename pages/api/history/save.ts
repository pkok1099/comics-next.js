import { NextApiRequest, NextApiResponse } from 'next';
import { addOrUpdateHistory } from '../../../services/historyService';
import { validateUser } from '../../../utils/validateUser';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const user = validateUser(req);
      const { title, chapterId } = req.body;
      const result = await function addOrUpdateHistory(
        user: string,
        title: string,
        chapterId: string | number,
        thumbnailUrl?: string,
      ): void {
        if (typeof chapterId === 'string') {
          console.log(`Chapter ID as string: ${chapterId}`);
        } else if (typeof chapterId === 'number') {
          console.log(`Chapter ID as number: ${chapterId}`);
        }
      };
      res.status(200).json(result);
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
