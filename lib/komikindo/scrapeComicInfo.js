const fetchWithTimeout = require('../utils/fetchWithTimeout');
const validateEnv = require('../utils/validateEnv');

async function scrapeComicInfo(komik) {
  try {
    const $ = await fetchWithTimeout(
      `${validateEnv('URL_KOMIK')}/komik/${encodeURIComponent(komik)}/`,
      { method: 'GET' },
    );

    const data = {};

    // Cache elemen yang sering digunakan
    const speElements = $('.spe span');

    // Judul, Thumbnail, dan Chapters
    data.title =
      $('.entry-title[itemprop="name"]').text().trim() || 'Title not found';
    data.thumbnail = $('.thumb img').attr('src') || 'Thumbnail not found';
    data.chapterAwal =
      $('.chapter-awal a').attr('href') || 'No initial chapter link found';
    data.chapterBaru =
      $('.epsbaru .epsbr:not(.chapter-awal) a').attr('href') ||
      'No latest chapter link found';

    // Rating
    data.rating =
      $('i[itemprop="ratingValue"]').text().trim() || 'Rating not found';

    // Judul Alternatif
    const alternativeTitles = speElements
      .eq(0)
      .text()
      .replace('Judul Alternatif:', '')
      .trim();
    data.alternativeTitles = alternativeTitles
      ? alternativeTitles.split(',').map((title) => title.trim())
      : ['No alternative title found'];

    // Informasi Status, Author, dll., dengan iterasi
    const infoLabels = [
      'Status',
      'Pengarang',
      'Ilustrator',
      'Grafis',
      'Tema',
      'Jenis Komik',
      'Sumber Resmi',
    ];
    const infoKeys = [
      'status',
      'author',
      'illustrator',
      'graphics',
      'theme',
      'type',
      'officialSource',
    ];
    infoLabels.forEach((label, index) => {
      const text = speElements
        .eq(index + 1)
        .text()
        .replace(`${label}:`, '')
        .trim();
      data[infoKeys[index]] =
        label === 'Tema'
          ? text.split(',').map((t) => t.trim()) || ['No theme found']
          : text || `${label} not found`;
    });

    // Terakhir Diperbarui
    data.lastUpdated =
      $('.shortcsc.sht2 p')
        .text()
        .match(/Update chapter terbaru komik.*?adalah tanggal (.*?)/)?.[1] ||
      'Last updated date not found';

    // Sinopsis
    data.synopsis =
      $('#sinopsis .entry-content').text().trim() || 'Synopsis not found';

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

    // Gambar Spoiler
    data.spoilerImages = $('.spoiler .spoiler-img img')
      .map((_, img) => {
        let src = $(img).attr('src');
        if (!src.startsWith('http')) {
          src = `https:${src}`;
        }
        return src;
      })
      .get()
      .filter(Boolean) || ['No spoiler images found'];

    return data;
  } catch (error) {
    console.error(`Error occurred while scraping comic info: ${error.message}`);
    throw error;
  }
}

module.exports = scrapeComicInfo;
