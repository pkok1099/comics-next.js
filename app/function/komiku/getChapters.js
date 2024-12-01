const cheerio = require('cheerio');
const { BaseUrlKk } = require('@/f/url');

const getChapters = async (judul) => {
  const baseUrl = `${BaseUrlKk}/manga/${decodeURIComponent(judul)}/`;
  console.log(baseUrl);
  try {
    const response = await fetch(
      decodeURIComponent(baseUrl),
      {
        method: 'GET',
      },
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching komik chapters: ${response.statusText}`,
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const chapters = [];

    // Mengambil daftar chapter dan informasi terkait
    $('#Daftar_Chapter tbody tr').each(
      (_, element) => {
        const chapterTitle = $(element)
          .find('.judulseries a span')
          .text()
          .trim();
        const chapterUrl = $(element)
          .find('.judulseries a')
          .attr('href');
        const pembacaCount = $(element)
          .find('.pembaca i')
          .text()
          .trim();
        const tanggal = $(element)
          .find('.tanggalseries')
          .text()
          .trim();

        // Menyimpan data chapter ke dalam array jika chapterTitle ada
        if (chapterTitle && chapterUrl) {
          chapters.push({
            title: chapterTitle, // Judul Chapter
            url: chapterUrl, // URL Chapter
            pembaca: pembacaCount, // Jumlah Pembaca
            tanggal: tanggal, // Tanggal Rilis
          });
        }
      },
    );

    // Mengurutkan chapter berdasarkan tanggal rilis terbaru
    return chapters.sort(
      (a, b) =>
        new Date(b.tanggal) - new Date(a.tanggal),
    );
  } catch (error) {
    throw new Error(
      `Error scraping komik chapters: ${error.message}`,
    );
  }
};

module.exports = getChapters;
