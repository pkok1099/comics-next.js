import { validateUser } from '@/lib/services/validateUser';
import { deleteHistoryById } from '@/lib/services/historyService';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    try {
      const user = validateUser(req);
      const { historyId } = req.body;

      if (!historyId) {
        return res.status(400).json({ message: 'historyId is required' });
      }

      const response = await deleteHistoryById(user, historyId);
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
