const cheerio = require('cheerio');
const { commonHeaders } = require('./commonHeaders');
const { BaseUrlK } = require('./index');

async function scrapeComicInfo(komik) {
  const url = `${BaseUrlK}/komik/${komik}/`;
  console.log;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: commonHeaders,
    });

    if (!response.ok) {
      throw new Error(`Failed to load page: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Data object to store scraped information
    const data = {};

    // Extracting information based on the provided HTML structure
    // data.title = $('h2.animetitle-episode').text().trim() || 'Title not found';
    data.title = $('.entry-title[itemprop="name"]').text().trim(); // Judul
    data.thumbnail = $('.thumb img').attr('src'); // Thumbnail
    data.chapterAwal = $('.chapter-awal a').attr('href'); // Link Chapter Awal
    data.chapterBaru = $('.epsbaru .epsbr:not(.chapter-awal) a').attr('href'); // Link Chapter Baru
    data.rating = $('i[itemprop="ratingValue"]').text().trim(); // Rating

    // Alternative titles

    data.alternativeTitles = $('.spe span')
      .first()
      .text()
      .replace('Judul Alternatif:', '')
      .trim()
      .split(',')
      .map((title) => title.trim()) || ['No alternative title found'];

    // Status
    data.status = $('.spe span').eq(1).text().replace('Status:', '').trim() || 'Status not found';

    // Author and Illustrator
    data.author = $('.spe span').eq(2).text().replace('Pengarang:', '').trim() || 'Author not found';
    data.illustrator = $('.spe span').eq(3).text().replace('Ilustrator:', '').trim() || 'Illustrator not found';

    // Graphics
    data.graphics = $('.spe span').eq(4).text().replace('Grafis:', '').trim() || 'Graphics not found';

    // Themes
    data.theme = $('.spe span')
      .eq(5)
      .text()
      .replace('Tema:', '')
      .trim()
      .split(',')
      .map((theme) => theme.trim()) || ['No theme found'];

    // Comic type
    data.type = $('.spe span').eq(6).text().replace('Jenis Komik:', '').trim() || 'Comic type not found';

    // Official source
    data.officialSource = $('.spe span').eq(7).find('a').attr('href') || 'Not available';

    // Last updated date
    data.lastUpdated =
      $('.shortcsc.sht2 p')
        .text()
        .match(/Update chapter terbaru komik.*?adalah tanggal (.*?)/)?.[1] || 'Last updated date not found';

    // Synopsis
    data.synopsis = $('#sinopsis .entry-content').text().trim() || 'Synopsis not found';

    // Recommendations
    data.recommendations = $('.relatedpost .widget-post.miripmanga .serieslist li')
      .map((_, el) => {
        const title = $(el).find('.leftseries h4 a').text().trim();
        const link = $(el).find('.leftseries h4 a').attr('href');
        return { title, link };
      })
      .get() || ['No recommendations found'];

    // Spoiler images
    data.spoilerImages = $('.spoiler .spoiler-img img')
      .map((_, img) => $(img).attr('src'))
      .get()
      .filter(Boolean) || ['No spoiler images found'];

    // Output the scraped data
    return data;
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
}
// scrapeComicInfo("cold")
module.exports = scrapeComicInfo;
