const cheerio = require('cheerio');
const { commonHeaders } = require('../commonHeaders');
const { BaseUrlK } = require('@/f/url');

async function fetchKomikData(page = 1) {
  const url = `${BaseUrlK}/komik-terbaru/page/${page}/`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: commonHeaders,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const komikList = [];
    const pagination = [];

    // Memproses data komik
    $('.animepost').each((_, element) => {
      const judul = $(element).find('h4').text().trim();
      const thumbnail = $(element).find('img').attr('src');
      const link = $(element).find('a').attr('href');
      if (judul && thumbnail && link) {
        komikList.push({ judul, thumbnail, link });
      }
    });

    // Memproses data pagination
    $('.pagination .page-numbers').each((_, element) => {
      const pageNumber = $(element).text().trim();
      if (!isNaN(pageNumber)) {
        pagination.push(parseInt(pageNumber));
      }
    });

    return { komikList, pagination };
  } catch (error) {
    console.error('Error fetching komik data:', error.message);
    throw error;
  }
}

module.exports = fetchKomikData;
