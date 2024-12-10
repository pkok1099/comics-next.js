import { doujindesu, komikindo } from '@/f/index.js'; // Sesuaikan dengan penamaan platform kecil

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { platform, page } = req.query; // Mengambil params dari URL

  try {
    const availablePlatforms = { doujindesu, komikindo };

    // Validasi platform
    if (!platform || !availablePlatforms[platform]) {
      return res.status(400).json({ message: 'Invalid or missing platform' });
    }

    // Panggil fungsi `fetchKomikData` sesuai platform
    const { komikList, pagination } = await availablePlatforms[
      platform
    ].fetchKomikData(parseInt(page));

    // Kirimkan hasil data komik
    return res.status(200).json({ komikList, pagination });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: `Error fetching data for platform: ${error.message}`,
    });
  }
}
