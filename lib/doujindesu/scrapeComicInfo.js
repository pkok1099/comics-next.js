const cheerio = require('cheerio');
const headers2 = require('@/f/doujinHeaders');

async function scrapeComicInfo(komik) {
  const url = `${process.env.URL_KOMIKDD}/komik/${komik}/`;
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
    const Tthumbnail = $('.bigbanner.img-blur').css('background-image');

    const Thumbnail = Tthumbnail.replace(/^url\(['"]?/, '').replace(
      /['"]?\)$/,
      '',
    );
    // Judul
    data.title =
      $('.entry-title[itemprop="name"]').text().trim() || 'Title not found';

    // Thumbnail
    data.thumbnail = `/api/proxy?url=${encodeURIComponent(Thumbnail)}`;

    // Link Chapter Awal
    data.chapterAwal =
      $('.eplister ul.clstyle li').last().find('a').attr('href') ||
      'Chapter awal not found';

    // Link Chapter Baru
    data.chapterBaru =
      $('.eplister ul.clstyle li').first().find('a').attr('href') ||
      'Chapter baru not found';

    // Rating
    data.rating =
      $('.num[itemprop="ratingValue"]').text().trim() || 'Rating not found';

    // Judul Alternatif
    data.alternativeTitles = $('.alternative').text().trim() || [
      'No alternative title found',
    ];

    // Status
    data.status =
      $('.imptdt:contains("Status") i').text().trim() || 'Status not found';

    // Pengarang
    data.author =
      $('.imptdt:contains("Author") i').text().trim() || 'Author not found';

    // Ilustrator
    data.illustrator =
      $('.spe span').eq(3).text().replace('Ilustrator:', '').trim() ||
      'Illustrator not found';

    // Grafis
    data.graphics =
      $('.spe span').eq(4).text().replace('Grafis:', '').trim() ||
      'Graphics not found';

    // Tema
    data.theme = $('.mgen a')
      .map((i, el) => $(el).text().trim())
      .get() || ['No theme found'];

    // Jenis Komik
    data.type =
      $('.imptdt:contains("Type") a').text().trim() || 'Comic type not found';

    // Sumber Resmi
    data.officialSource =
      $('.spe span').eq(7).find('a').attr('href') ||
      'Official source not found';

    // Update Terakhir
    data.lastUpdated =
      $('.shortcsc.sht2 p')
        .text()
        .match(/Update chapter terbaru komik.*?adalah tanggal (.*?)/)?.[1] ||
      'Last updated date not found';

    // Sinopsis
    data.synopsis =
      $('.entry-content[itemprop="description"] p').text().trim() ||
      'Synopsis not found';

    // Rekomendasi
    data.recommendations = $(
      '.relatedpost .widget-post.miripmanga .serieslist li',
    )
      .map((_, el) => {
        const title = $(el).find('.leftseries h4 a').text().trim();
        const link = $(el).find('.leftseries h4 a').attr('href');
        return { title, link };
      })
      .get() || ['No recommendations found'];

    // Tambahan dari Struktur HTML
    data.chapters = $('.eplister ul.clstyle li')
      .map((_, el) => {
        const chapterNumber = $(el).find('.chapternum').text().trim();
        const chapterDate = $(el).find('.chapterdate').text().trim();
        const chapterLink = $(el).find('a').attr('href');
        return {
          title: chapterNumber,
          url: chapterDate,
          lastUpdated: chapterLink,
        };
      })
      .get();

    // Spoiler Images (Tidak tersedia di struktur ini)
    data.spoilerImages = ['Spoiler images not available in the new structure'];

    // Output data yang diambil
    return data;
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
}

module.exports = scrapeComicInfo;
