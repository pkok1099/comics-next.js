const fetchWithTimeout = require('../utils/fetchWithTimeout');
const validateEnv = require('../utils/validateEnv');

const getChapters = async (judul) => {
  const baseUrl = `${validateEnv('URL_KOMIK')}/komik/${decodeURIComponent(judul)}/`;

  try {
    const $ = await fetchWithTimeout(decodeURIComponent(baseUrl), {
      method: 'GET',
      // headers: commonHeaders,
    });
    const chapters = [];

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
    throw new Error(`Error scraping komik chapters: ${error.message}`);
  }
};

module.exports = getChapters;
