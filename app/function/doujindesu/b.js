const cheerio = require('cheerio'); // Pastikan cheerio terinstall
const commonHeaders = require('../doujinHeaders.js');
const { BaseUrlDd } = require('../url.js');

(async () => {
  try {
    // URL target
    const baseUrl = `${BaseUrlDd}/manga/honestly-i-like-you-a-lot/`;

    const response = await fetch(
      decodeURIComponent(baseUrl),
      {
        method: 'GET',
        headers: commonHeaders,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching komik chapters: ${response.statusText}`,
      );
    }

    const html = await response.text();

    // Parsing HTML dengan Cheerio
    const $ = cheerio.load(html);

    // Ambil informasi yang diminta
    const thumbnail = $('.thumbnail img').attr(
      'src',
    );
    const title = $('h1.title')
      .text()
      .split(' <')[0]
      .trim();
    // const title = $(".metadata .title").text().trim();
    const synopsis = $(
      ".pb-2 strong:contains('Sinopsis:')",
    )
      .next()
      .text()
      .trim();
    const genre = $('.tags a')
      .map((_, el) => $(el).text().trim())
      .get();
    const status = $("td:contains('Status')")
      .next()
      .text()
      .trim();
    const type = $("td:contains('Type')")
      .next()
      .text()
      .trim();
    const author = $("td:contains('Author')")
      .next()
      .text()
      .trim();
    const rating = $('.rating-prc').text().trim();
    const created = $(
      "td:contains('Created Date')",
    )
      .next()
      .text()
      .trim();
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

    // Hasil
    const result = {
      thumbnail,
      title,
      synopsis,
      genre,
      status,
      type,
      author,
      rating,
      created,
      chapters,
    };

    console.log(result);
  } catch (error) {
    console.error(
      'Terjadi kesalahan:',
      error.message,
    );
  }
})();
