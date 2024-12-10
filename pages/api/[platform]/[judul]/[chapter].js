import { komikindo } from '@/f/index.js';

export default async function handler(req, res) {
  const {
    query: { platform, judul, chapter },
    method,
  } = req;

  if (method === 'GET') {
    // Validasi platform
    const availablePlatforms = { komikindo };
    if (!availablePlatforms[platform]) {
      return res.status(400).json({ message: 'Invalid platform' });
    }

    try {
      // Menghapus angka 6 digit di depan judul jika ada
      const cleanedTitle = judul.replace(/^\d{6}-/, '');

      // Dapatkan URL gambar dari platform yang sesuai
      const imageUrls = await availablePlatforms[platform].getChapterImages(
        cleanedTitle,
        chapter,
      );

      // Gunakan proxy endpoint untuk mengarahkan permintaan gambar
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers['host'];
      const baseUrl = `${protocol}://${host}`;

      // Generate link melalui proxy
      const imageLinks = imageUrls.map((imgUrl) => {
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
