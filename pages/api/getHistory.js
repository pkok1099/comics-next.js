import { validateUser } from '@/lib/services/validateUser';
import { getHistoryByUser } from '@/lib/services/historyService';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const user = validateUser(req);
      const history = await getHistoryByUser(user);
      res.status(200).json({ history });
    } catch (error) {
      res
        .status(error.message === 'User is not logged in' ? 401 : 500)
        .json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
