// pages/api/komik/[komik]/[chapter]/images.js
import { komikindo } from '@/app/function/index'; // Sesuaikan lokasi function

export default async function handler(req, res) {
  const {
    query: { judul, chapter },
    method,
  } = req;

  if (method === 'GET') {
    try {
      // Menghapus angka 6 digit di depan judul jika ada
      const cleanedTitle = judul.replace(
        /^\d{6}-/,
        '',
      );

      // Dapatkan URL gambar asli menggunakan function dari `komikindo`
      const imageUrls =
        await komikindo.getChapterImages(
          cleanedTitle,
          chapter,
        );

      // Gunakan proxy endpoint untuk mengarahkan permintaan gambar
      const protocol =
        req.headers['x-forwarded-proto'] ||
        'http';
      const host = req.headers['host'];
      const baseUrl = `${protocol}://${host}`;

      // Generate link melalui proxy
      const imageLinks = imageUrls.map(
        (imgUrl, index) => {
          return `${baseUrl}/api/proxy?url=${decodeURIComponent(imgUrl)}&head=komikindo`;
        },
      );

      console.log(
        'Generated Proxy Image Links:',
        imageLinks,
      );

      res.status(200).json(imageLinks);
    } catch (error) {
      console.error(
        'Error fetching chapter images:',
        error,
      );
      res
        .status(500)
        .send('Failed to fetch chapter images.');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
