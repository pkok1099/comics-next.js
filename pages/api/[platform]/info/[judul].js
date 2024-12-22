import { komikindo } from '@/f/index';

export default async function handler(req, res) {
  const { platform, judul } = req.query; // Mengambil platform dan judul dari URL

  if (req.method !== 'GET') {
    // Menangani metode selain GET
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Validasi platform
  const availablePlatforms = { komikindo };
  if (!availablePlatforms[platform]) {
    return res.status(400).json({ message: 'Invalid platform' });
  }

  try {
    // Panggil fungsi scrapeComicInfo sesuai platform yang dipilih
    const comicInfo = await availablePlatforms[platform].scrapeComicInfo(judul);

    // Jika data komik tidak ditemukan
    if (!comicInfo) {
      return res.status(404).json({
        message: 'Comic info not found',
      });
    }

    // Mengirimkan data info komik
    return res.status(200).json(comicInfo);
  } catch (error) {
    // Menangani error jika terjadi masalah dalam scraping
    console.error('Error scraping comic info:', error);
    return res.status(500).json({
      message: 'Error retrieving comic info',
    });
  }
}
