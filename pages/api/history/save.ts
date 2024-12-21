import { NextApiRequest, NextApiResponse } from 'next';
import { addOrUpdateHistory } from '@/services/addOrUpdateHistory';
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
  if (req.method === 'POST') {
    try {
      const decodedUser: User = validateUser(req); // Mendapatkan user yang sudah didekodekan
      const { title, chapterId, thumbnailUrl } = req.body;

      // Menambahkan atau memperbarui history menggunakan decodedUser yang sudah memiliki informasi dari token
      const result = await addOrUpdateHistory(
        decodedUser.username, // Hanya mengirim username
        title,
        chapterId,
        thumbnailUrl,
      );

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
