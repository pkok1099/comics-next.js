const fetchWithTimeout = require('../utils/fetchWithTimeout');
const validateEnv = require('../utils/validateEnv');

async function getChapterImages(komik, chapter) {
  const chapterUrl = `${validateEnv('URL_KOMIK')}/${komik}-chapter-${chapter}/`;
  try {
    const $ = await fetchWithTimeout(chapterUrl, {
      method: 'GET',
    });

    const imageUrls = [];
    $('.img-landmine img').each((_, img) => {
      let src = $(img).attr('src');
      if (src) {
        if (!src.startsWith('http')) {
          src = `https:${src}`;
        }
        imageUrls.push(src);
      }
    });
    return imageUrls;
  } catch (error) {
    console.error('Error fetching chapter images:', error);
    throw new Error('Failed to fetch chapter images.');
  }
}
module.exports = getChapterImages;
