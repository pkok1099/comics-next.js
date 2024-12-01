const cheerio = require('cheerio'); // Pastikan cheerio terinstall
const headers2 = require('@/f/doujinHeaders');

const { BaseUrlDd } = require('@/f/url');

const getChapters = async (judul) => {
  const baseUrl = `${BaseUrlDd}/manga/${decodeURIComponent(judul)}/`;

  try {
    const response = await fetch(
      decodeURIComponent(baseUrl),
      {
        method: 'GET',
        headers: headers2,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching komik chapters: ${response.statusText}`,
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Ambil data chapters saja
    const chapters = $('#chapter_list ul li')
      .map((_, el) => {
        const chapterTitle = $(el)
          .find('.lchx a')
          .text()
          .trim();
        const chapterLink = $(el)
          .find('.lchx a')
          .attr('href');
        const chapterDate = $(el)
          .find('.date')
          .text()
          .trim();
        return {
          chapterTitle,
          chapterLink,
          chapterDate,
        };
      })
      .get();

    // Urutkan berdasarkan tanggal terbaru
    return chapters.sort(
      (a, b) =>
        new Date(b.chapterDate) -
        new Date(a.chapterDate),
    );
  } catch (error) {
    throw new Error(
      `Error scraping komik chapters: ${error.message}`,
    );
  }
};

module.exports = getChapters;
