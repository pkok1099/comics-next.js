const cheerio = require('cheerio');
// const commonHeaders = require('../commonHeaders');
const { BaseUrlK } = require('@/f/url');

const getChapters = async (judul) => {
  const baseUrl = `${BaseUrlK}/komik/${decodeURIComponent(judul)}/`;

  try {
    const response = await fetch(decodeURIComponent(baseUrl), {
      method: 'GET',
      // headers: commonHeaders,
    });

    if (!response.ok) {
      throw new Error(`Error fetching komik chapters: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
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

    return chapters.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  } catch (error) {
    throw new Error(`Error scraping komik chapters: ${error.message}`);
  }
};

module.exports = getChapters;
