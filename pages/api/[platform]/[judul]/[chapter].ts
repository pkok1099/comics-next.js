import { NextApiRequest, NextApiResponse } from 'next';
import { komikindo } from '@/f/index';

type AvailablePlatforms = 'komikindo'; // Define available platforms

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    query: { platform, judul, chapter },
    method,
  } = req;

  if (method === 'GET') {
    // Validasi platform
    const availablePlatforms = { komikindo };
    if (!availablePlatforms[platform as AvailablePlatforms]) {
      return res.status(400).json({ message: 'Invalid platform' });
    }

    try {
      // Pastikan judul adalah string
      if (typeof judul !== 'string') {
        return res.status(400).json({ message: 'Invalid judul' });
      }

      // Menghapus angka 6 digit di depan judul jika ada
      const cleanedTitle = judul.replace(/^\d{6}-/, '');

      // Dapatkan URL gambar dari platform yang sesuai
      const imageUrls = await availablePlatforms[
        platform as AvailablePlatforms
      ].getChapterImages(cleanedTitle, chapter as string);

      // Gunakan proxy endpoint untuk mengarahkan permintaan gambar
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers['host'];
      const baseUrl = `${protocol}://${host}`;

      // Generate link melalui proxy
      const imageLinks = imageUrls.map((imgUrl: string) => {
        return `${baseUrl}/api/proxy?url=${decodeURIComponent(imgUrl)}&head=${platform}`;
      });

      // Kirimkan respons dengan URL gambar
      return res.status(200).json(imageLinks);
    } catch (error) {
      console.error('Error fetching chapter images:', error);
      return res.status(500).send('Failed to fetch chapter images.');
    }
  } else {
    return res.status(405).send('Method Not Allowed');
  }
}
