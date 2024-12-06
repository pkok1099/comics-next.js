// pages/api/komik/index.js
import { Doujindesu } from '@/f/index';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Ambil parameter `page` dari query string, jika tidak ada, default ke halaman 1
      const page = parseInt(req.query.page) || 1;

      // Ambil data komik berdasarkan halaman
      // const { komikList, pagination } = await Doujindesu.fetchKomikData(page);

      const result = await Doujindesu.fetchKomikData(page);
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response from Doujindesu API');
      }
      const { komikList, pagination } = result;
      // Kirimkan data komik dan pagination
      return res.status(200).json({ komikList, pagination });
    } catch (error) {
      // Menangani error jika terjadi masalah dalam scraping
      console.error(error);
      return res.status(500).json({
        message: 'Error scraping data komik: ' + error.message,
      });
    }
  } else {
    // Jika metode selain GET, kembalikan status error 405
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
