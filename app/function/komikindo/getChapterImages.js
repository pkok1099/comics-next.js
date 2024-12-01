const cheerio = require('cheerio');
const { BaseUrlK } = require('@/f/url');

async function getChapterImages(komik, chapter) {
  const chapterUrl = `${BaseUrlK}/${komik}-chapter-${chapter}/`;
  console.log(chapterUrl);
  try {
    const response = await fetch(chapterUrl, {
      method: 'GET',
    });

    const html = await response.text();
    const $ = cheerio.load(html);
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
    console.log(imageUrls);
    return imageUrls;
  } catch (error) {
    console.error(
      'Error fetching chapter images:',
      error,
    );
    throw new Error(
      'Failed to fetch chapter images.',
    );
  }
}
module.exports = getChapterImages;
