const cheerio = require('cheerio');

/**
 * Fetch dan parse data manhwa dari situs manhwadesu.asia
 * @param {string} page - Nomor halaman (default: 1)
 * @returns {Promise<{ komikList: object[], pagination: number[]}>}
 */
async function fetchAndParseManhwa(page = 1) {
  try {
    const response = await fetch(
      `https://komikindo.asia/manga/?page=${page}&order=update`,
      { method: 'GET' },
    );

    if (!response.ok) {
      throw new Error(
        'Network response was not ok.',
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const komikList = [];
    const pagination = [];

    // Parsing data manhwa berdasarkan HTML yang baru
    $('.listupd .bs').each((index, element) => {
      const judul = $(element)
        .find('.bigor .tt')
        .text()
        .trim();
      const thumbnail = $(element)
        .find('.limit img')
        .attr('src');
      const link = $(element)
        .find('a')
        .attr('href');
      const genre = $(element).data('tags') || ''; // Mengambil genre jika ada
      const latestChapterLink = $(element)
        .find('.epxs')
        .text()
        .trim();

      // Konversi thumbnail ke URL internal (proxy)
      const thumbnailInternal = `/api/proxy?url=${encodeURIComponent(thumbnail)}`;

      komikList.push({
        judul,
        thumbnail, // Gunakan URL internal untuk thumbnail
        link,
        genre,
        latestChapterLink,
      });
    });

    // Parsing pagination untuk mengetahui halaman berikutnya
    $('.hpage a.r').each((index, element) => {
      const href = $(element).attr('href');
      const match = href.match(/\?page=(\d+)/); // Menangkap nomor halaman dari URL
      if (match) {
        pagination.push(Number(match[1])); // Menambahkan nomor halaman ke pagination
      }
    });

    return { komikList, pagination };
  } catch (error) {
    console.error(
      'There was a problem with the fetch operation:',
      error,
    );
  }
}

module.exports = fetchAndParseManhwa;
