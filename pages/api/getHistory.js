import { connectToDatabase } from '@/utils/mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Mengambil cookie dari header HTTP
    const cookies = req.headers.cookie;
    const userCookie = cookies && cookies.split(';').find(cookie => cookie.trim().startsWith('user='));

    if (!userCookie) {
      return res.status(401).json({ message: 'User is not logged in' });
    }

    const user = userCookie.split('=')[1]; // Mendapatkan nilai cookie 'user'

    try {
      const { db, client } = await connectToDatabase(); // Menggunakan koneksi dari utils
      const collection = db.collection('history');
      
      // Mengambil history berdasarkan user yang sudah login
      const history = await collection.find({ user }).toArray();
      res.status(200).json({ history });
    } catch (err) {
    console.log(err)
      res.status(500).json({ message: 'Error fetching history', error: err.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}