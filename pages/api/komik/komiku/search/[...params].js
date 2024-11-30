// pages/api/komik/[...params].js
import { SearchComicsPage } from '@/f/index'; // Pastikan path ini sesuai

export default async function handler(req, res) {
  const { params } = req.query; // Mengambil parameter dari query string

  if (req.method === 'GET') {
    // Pastikan ada dua parameter: search dan pages
    if (params.length !== 2) {
      return res.status(400).json({ message: 'Invalid parameters' });
    }

    const [search, pages] = params; // Mendapatkan search dan pages dari params

    try {
      const chapters = await SearchComicsPage(search, pages); // Mengambil data chapters dari fungsi yang diimpor
      res.status(200).json(chapters); // Mengirimkan response dengan data chapters
    } catch (error) {
      console.error('Error scraping komik chapters:', error);
      res.status(500).json({ message: 'Error retrieving chapter list' });
    }
  } else {
    // Menangani metode HTTP yang tidak diizinkan
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
