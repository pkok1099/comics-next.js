// pages/api/images/[judul]/[chapter]/[index].js
import { getImageByIndex } from '@/f/index.js';

export default async function handler(req, res) {
  const { judul, chapter, index } = req.query; // Mengambil parameter judul, chapter, dan index dari query

  if (req.method === 'GET') {
    try {
      // Ambil URL gambar berdasarkan judul, chapter, dan index
      const imgUrl = await getImageByIndex(judul, chapter, index);

      // Ambil gambar dari URL
      const imgResponse = await fetch(imgUrl, {
        method: 'GET',
      });

      // Cek apakah respons gambar valid
      if (!imgResponse.ok) {
        return res.status(404).send('Image not found');
      }

      // Ambil buffer gambar dari response
      const imgBuffer = await imgResponse.arrayBuffer();

      // Set header content-type sesuai dengan jenis gambar
      res.setHeader('Content-Type', imgResponse.headers.get('content-type'));

      // Kirim gambar ke client
      res.end(Buffer.from(imgBuffer));
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).send('Failed to fetch image.');
    }
  } else {
    // Jika metode selain GET, kembalikan status error 405
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
