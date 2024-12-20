import fetchWithTimeout from '../utils/fetchWithTimeout';
import validateEnv from '../utils/validateEnv';

interface Chapter {
  title: string;
  url: string;
  lastUpdated: string; // Optional if needed
}

const getChapters = async (judul: string): Promise<Chapter[]> => {
  const baseUrl = `${validateEnv('URL_KOMIK')}/komik/${decodeURIComponent(judul)}/`;

  try {
    const $ = await fetchWithTimeout(decodeURIComponent(baseUrl), {
      method: 'GET',
    });
    const chapters: Chapter[] = [];

    $('.eps_lst .listeps ul li').each((_, element) => {
      const chapterUrl = $(element).find('.lchx a').attr('href');
      const chapterTitle = $(element).find('.lchx a').text().trim();
      const lastUpdated = $(element).find('.dt a').text().trim(); // Mengambil lastUpdated jika diperlukan

      if (chapterUrl) {
        chapters.push({
          title: chapterTitle,
          url: chapterUrl,
          lastUpdated, // Bisa menyimpan tanggal, jika tetap diperlukan
        });
      }
    });

    // Urutkan berdasarkan chapter title, asumsi judul chapter bisa berupa nomor atau format urutan
    return chapters.sort((a, b) => {
      const chapterA = parseInt(a.title.replace(/\D/g, ''), 10); // Ambil angka dari title chapter
      const chapterB = parseInt(b.title.replace(/\D/g, ''), 10);
      return chapterB - chapterA; // Urutkan dari chapter terbesar
    });
  } catch (error) {
    const err = error as Error; // Type assertion
    throw new Error(`Error scraping komik chapters: ${err.message}`);
  }
};

export default getChapters;
