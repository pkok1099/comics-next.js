const cheerio = require('cheerio');
// const commonHeaders = require('../commonHeaders');
const { BaseUrlK } = require('@/f/url');

// Fungsi untuk mengambil gambar berdasarkan chapter dan index

async function getImageByIndex(judul, chapter, index) {
  const chapterUrl = `${BaseUrlK}/${judul}-chapter-${chapter}/#page_${index}`;
  try {
    const response = await fetch(chapterUrl, {
      method: 'GET',
      // headers: commonHeaders,
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    const imgSrc = $(`.img-landmine img:nth-child(${index})`).attr('src');

    if (imgSrc) {
      return imgSrc;
    } else {
      throw new Error('Image not found.');
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    throw new Error('Failed to fetch image.');
  }
}
module.exports = getImageByIndex;
