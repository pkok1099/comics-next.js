const cheerio = require('cheerio'); // Pastikan cheerio terinstall
const headers2 = require('@/f/doujinHeaders');

async function fetchAndParseManhwa(page = 1) {
  try {
    const response = await fetch(`https://doujindesu.tv/manhwa/page/${page}/`, {
      method: 'GET',
      headers: headers2,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const html = await response.text(); // Mengambil respons sebagai teks (HTML)
    const $ = cheerio.load(html);

    const komikList = [];
    const pagination = [];

    // Parsing data manhwa
    $('.feed .entry').each((index, element) => {
      const judul = $(element).find('.title span').text().trim();
      const thumbnail = $(element).find('.thumbnail img').attr('src');
      const link = $(element).find("a[href^='/manga/']").first().attr('href');
      const genre = $(element).data('tags') || '';
      const latestChapterLink = $(element).find('.artists a').attr('href') || '';

      // Konversi thumbnail ke URL internal (proxy)
      const thumbnailInternal = `/api/proxy?url=${encodeURIComponent(thumbnail)}`;

      komikList.push({
        judul,
        thumbnail: thumbnailInternal, // Gunakan URL internal untuk thumbnail
        link,
        genre,
        latestChapterLink,
      });
    });

    // Parsing pagination
    $('.pagination a').each((index, element) => {
      const href = $(element).attr('href');
      const match = href.match(/\/page\/(\d+)\//);
      if (match) {
        pagination.push(Number(match[1]));
      }
    });

    return { komikList, pagination };
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

module.exports = fetchAndParseManhwa;
