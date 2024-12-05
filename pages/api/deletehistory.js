// pages/api/deleteHistory.js
import { connectToDatabase, deleteHistoryById } from '@/utils/mongodb';
import { ObjectId } from 'mongodb';  // Pastikan untuk mengimpor ObjectId jika ID adalah tipe ObjectId

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const cookies = req.headers.cookie;
    const userCookie = cookies && cookies.split(';').find(cookie => cookie.trim().startsWith('user='));

    if (!userCookie) {
      return res.status(401).json({ message: 'User is not logged in' });
    }

    const user = userCookie.split('=')[1]; // Mendapatkan nilai cookie 'user'
    const { historyId } = req.body; // Mendapatkan historyId dari request body

    // Cek apakah historyId ada di request body
    if (!historyId) {
      return res.status(400).json({ message: 'historyId is required' });
    }

    try {
      const { db, client } = await connectToDatabase();
      const collection = db.collection('history');

      // Pastikan historyId adalah ObjectId jika ID di MongoDB menggunakan tipe tersebut
      const parsedHistoryId = ObjectId.isValid(historyId) ? new ObjectId(historyId) : null;
      if (!parsedHistoryId) {
        return res.status(400).json({ message: 'Invalid historyId format' });
      }

      // Cek apakah history dengan ID yang diberikan ada
      const existingHistory = await collection.findOne({ _id: parsedHistoryId, user });

      if (!existingHistory) {
        return res.status(404).json({ message: 'History not found' });
      }

      // Menghapus history
      await deleteHistoryById(collection, parsedHistoryId);

      res.status(200).json({ message: 'History deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting history', error: err.message });
    } finally {
      await client.close(); // Pastikan koneksi ditutup setelah operasi selesai
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}