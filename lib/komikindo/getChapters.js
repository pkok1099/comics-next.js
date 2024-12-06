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
      const lastUpdated = $(element).find('.dt a').text().trim();

      if (chapterUrl) {
        chapters.push({
          title: chapterTitle,
          url: chapterUrl,
          lastUpdated,
        });
      }
    });

    return chapters.sort(
      (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated),
    );
  } catch (error) {
    throw new Error(`Error scraping komik chapters: ${error.message}`);
  }
};

module.exports = getChapters;
