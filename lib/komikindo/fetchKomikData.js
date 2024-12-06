const fetchWithTimeout = require('../utils/fetchWithTimeout');
const isValidUrl = require('../utils/isValidUrl');
const validateEnv = require('../utils/validateEnv');

async function fetchKomikData(page = 1) {
  try {
    const url = validateEnv('URL_KOMIK');
    console.log(url);
    const $ = await fetchWithTimeout(
      `${validateEnv('URL_KOMIK')}/komik-terbaru/page/${page}/`,
      { method: 'GET' },
    );

    // Parsing data komik
    const komikList = $('.animepost')
      .map((_, element) => {
        const $el = $(element); // Cache elemen saat iterasi
        const thumbnail = $el.find('img').attr('src');
        return {
          judul: $el.find('h4').text().trim(),
          thumbnail: isValidUrl(thumbnail) ? thumbnail : null, // Validasi URL thumbnail
          link: $el.find('a').attr('href'),
        };
      })
      .get()
      .filter((komik) => komik.thumbnail); // Hanya ambil data dengan thumbnail yang valid

    // Parsing pagination
    const pagination = $('.pagination .page-numbers')
      .map((_, element) => parseInt($(element).text().trim(), 10))
      .get()
      .filter((pageNumber) => !isNaN(pageNumber)); // Hanya ambil angka yang valid

    return { komikList, pagination };
  } catch (error) {
    console.error('Error fetching komik data:', error.message);
    throw error;
  }
}

module.exports = fetchKomikData;
