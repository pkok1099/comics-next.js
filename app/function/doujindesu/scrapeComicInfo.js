const cheerio = require('cheerio');
const headers2 = require('@/f/doujinHeaders');
const { BaseUrlDd } = require('@/f/url');

async function scrapeComicInfo(komik) {
  const url = `${BaseUrlDd}/manga/${komik}/`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers2,
    });

    if (!response.ok) {
      throw new Error(`Failed to load page: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Data object to store scraped information
    const data = {};
    const Thumbnail = $('.thumbnail img').attr('src') || 'Thumbnail not found';
    // Judul
    data.title = $('h1.title').text().split(' <')[0].trim() || 'Title not found';

    // Thumbnail
    data.thumbnail = `/api/proxy?url=${encodeURIComponent(Thumbnail)}`;

    // Link Chapter Awal
    data.chapterAwal = $('#chapter_list ul li').first().find('.lchx a').attr('href') || 'Chapter awal not found';

    // Link Chapter Baru
    data.chapterBaru = $('#chapter_list ul li').last().find('.lchx a').attr('href') || 'Chapter baru not found';

    // Rating
    data.rating = $('.rating-prc').text().trim() || 'Rating not found';

    // Judul Alternatif
    data.alternativeTitles = $('.spe span')
      .first()
      .text()
      .replace('Judul Alternatif:', '')
      .trim()
      .split(',')
      .map((title) => title.trim()) || ['No alternative title found'];

    // Status
    data.status = $('td:contains("Status")').next().text().trim() || 'Status not found';

    // Pengarang
    data.author = $('td:contains("Author")').next().text().trim() || 'Author not found';

    // Ilustrator
    data.illustrator = $('.spe span').eq(3).text().replace('Ilustrator:', '').trim() || 'Illustrator not found';

    // Grafis
    data.graphics = $('.spe span').eq(4).text().replace('Grafis:', '').trim() || 'Graphics not found';

    // Tema
    data.theme = $('.spe span')
      .eq(5)
      .text()
      .replace('Tema:', '')
      .trim()
      .split(',')
      .map((theme) => theme.trim()) || ['No theme found'];

    // Jenis Komik
    data.type = $('td:contains("Type")').next().text().trim() || 'Comic type not found';

    // Sumber Resmi
    data.officialSource = $('.spe span').eq(7).find('a').attr('href') || 'Official source not found';

    // Update Terakhir
    data.lastUpdated =
      $('.shortcsc.sht2 p')
        .text()
        .match(/Update chapter terbaru komik.*?adalah tanggal (.*?)/)?.[1] || 'Last updated date not found';

    // Sinopsis
    data.synopsis = $(".pb-2 strong:contains('Sinopsis:')").next().text().trim() || 'Synopsis not found';

    // Rekomendasi
    data.recommendations = $('.relatedpost .widget-post.miripmanga .serieslist li')
      .map((_, el) => {
        const title = $(el).find('.leftseries h4 a').text().trim();
        const link = $(el).find('.leftseries h4 a').attr('href');
        return { title, link };
      })
      .get() || ['No recommendations found'];

    // Spoiler Images (Tidak tersedia di struktur ini)
    data.spoilerImages = ['Spoiler images not available in the new structure'];

    // Output data yang diambil
    return data;
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
}

module.exports = scrapeComicInfo;
