// pages/api/komik/[judul]/chapters.js
import { komiku } from '@/app/function/index.js';

export default async function handler(req, res) {
  const { judul } = req.query; // Mengambil parameter `judul` dari URL

  if (req.method === 'GET') {
    try {
      // Decode judul yang diterima sebagai parameter
      const decodedJudul = decodeURIComponent(judul).trim();

      // Validasi input judul
      if (!decodedJudul) {
        return res.status(400).json({ message: 'Judul komik tidak valid atau kosong.' });
      }

      console.log(`Mendapatkan chapter untuk judul: ${decodedJudul}`);
console.log(decodedJudul)
      // Ambil data chapters dari fungsi getChapters
      const chapters = await komiku.getChapters(decodedJudul);
console.log(chapters)
      // Jika tidak ditemukan chapter
      if (!chapters || chapters.length === 0) {
        return res.status(404).json({
          message: `Tidak ditemukan chapter untuk komik "${decodedJudul}".`,
        });
      }

      // Kirim data chapter yang ditemukan
      return res.status(200).json(chapters);
    } catch (error) {
      // Tangani error seperti URL encoding yang tidak valid atau error lainnya
      console.error('Error scraping komik chapters:', error.message || error);

      if (error instanceof URIError) {
        return res.status(400).json({ message: 'URL encoding tidak valid.' });
      }

      return res.status(500).json({ message: 'Gagal mendapatkan daftar chapter.' });
    }
  } else {
    // Jika metode selain GET, kembalikan status error 405
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
