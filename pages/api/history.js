// pages/api/saveHistory.js
import {
  connectToDatabase,
  insertHistory,
  updateHistory,
  findHistory,
} from '@/utils/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Mengambil cookie user dari header HTTP
    const cookies = req.headers.cookie;
    const userCookie =
      cookies &&
      cookies
        .split(';')
        .find((cookie) =>
          cookie.trim().startsWith('user='),
        );

    if (!userCookie) {
      return res
        .status(401)
        .json({
          message: 'User is not logged in',
        });
    }

    const user = userCookie.split('=')[1]; // Mendapatkan nilai cookie 'user'
    const { chapterId, title } = req.body; // Ambil data chapterId dan title dari body permintaan

    try {
      const { db, client } =
        await connectToDatabase(); // Menggunakan koneksi dari utils
      const collection = db.collection('history');

      // Cek apakah data dengan title yang sama sudah ada
      const existingHistory = await findHistory(
        collection,
        user,
        title,
      );

      if (existingHistory) {
        // Jika data chapter sebelumnya ada, update chapterId dan timestamp-nya
        await updateHistory(
          collection,
          existingHistory._id,
          chapterId,
        );
        return res
          .status(200)
          .json({
            message:
              'Chapter updated successfully',
          });
      }

      // Jika tidak ada, simpan data baru dengan chapterId dan title
      await insertHistory(
        collection,
        user,
        title,
        chapterId,
      );

      res
        .status(200)
        .json({
          message: 'History saved successfully',
        });
    } catch (err) {
      res
        .status(500)
        .json({
          message:
            'Error saving or updating history',
          error: err.message,
        });
    } finally {
      await client.close();
    }
  } else {
    res
      .status(405)
      .json({ message: 'Method not allowed' });
  }
}
