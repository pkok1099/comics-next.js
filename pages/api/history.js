import { validateUser } from '@/middleware/validateUser';
import { addOrUpdateHistory } from '@/services/historyService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const user = validateUser(req);
      const { chapterId, title } = req.body;

      if (!chapterId || !title) {
        return res
          .status(400)
          .json({ message: 'chapterId and title are required' });
      }

      const response = await addOrUpdateHistory(user, title, chapterId);
      res.status(200).json(response);
    } catch (error) {
      res
        .status(error.message === 'User is not logged in' ? 401 : 500)
        .json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
