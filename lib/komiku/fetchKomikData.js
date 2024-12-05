const cheerio = require('cheerio');
const { BaseUrlKc } = require('@/f/url');

async function fetchKomikData(page = 1) {
  const url = `${BaseUrlKc}/manga/page/${page}/?orderby=date`;
  try {
    const response = await fetch(url, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}`,
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const komikList = [];
    const pagination = [1, 2, 3, 20]; // Selalu kosong

    // Memproses data komik
    $('.bge').each((_, element) => {
      const judul = $(element)
        .find('h3')
        .text()
        .trim();
      const thumbnail = $(element)
        .find('.sd.rd')
        .attr('src');
      const link = $(element)
        .find('a')
        .attr('href');
      const genre = $(element)
        .find('.tpe1_inf b')
        .text()
        .trim();
      const up = $(element)
        .find('.up')
        .text()
        .trim();
      const pembaca = $(element)
        .find('.judul2')
        .text()
        .trim();
      const description = $(element)
        .find('p')
        .text()
        .trim();
      const firstChapterLink = $(element)
        .find('.new1 a')
        .first()
        .attr('href');
      const latestChapterLink = $(element)
        .find('.new1 a')
        .last()
        .attr('href');

      if (judul && thumbnail && link) {
        komikList.push({
          judul,
          thumbnail,
          link,
          genre,
          up,
          pembaca,
          description,
          firstChapterLink,
          latestChapterLink,
        });
      }
    });

    // Pagination tetap kosong
    return { komikList, pagination };
  } catch (error) {
    console.error(
      'Error fetching komik data:',
      error.message,
    );
    throw error;
  }
}

module.exports = fetchKomikData;
