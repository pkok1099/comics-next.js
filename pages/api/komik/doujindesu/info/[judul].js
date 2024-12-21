// pages/api/doujindesu/komik/info/[judul]/
import { Doujindesu } from '@/f/index';

export default async function handler(req, res) {
  const { judul } = req.query; // Mengambil parameter `judul` dari URL

  if (req.method === 'GET') {
    try {
      // Memanggil fungsi scrapeComicInfo untuk mendapatkan informasi komik
      const chapters = await Doujindesu.scrapeComicInfo(judul);

      // Jika chapters tidak ditemukan
      if (!chapters || chapters.length === 0) {
        return res.status(404).json({
          message: 'Chapter list not found',
        });
      }

      // Mengirimkan data chapter
      return res.status(200).json(chapters);
    } catch (error) {
      // Menangani error jika terjadi masalah dalam scraping
      console.error('Error scraping komik chapters:', error);

      return res.status(500).json({
        message: 'Error retrieving chapter list',
      });
    }
  } else {
    // Menangani request dengan metode selain GET
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
