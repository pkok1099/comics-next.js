import fetchWithTimeout from '../utils/fetchWithTimeout';
import validateEnv from '../utils/validateEnv';

async function getChapterImages(komik: string, chapter: string): Promise<string[]> {
  const chapterUrl = `${validateEnv('URL_KOMIK')}/${komik}-chapter-${chapter}/`;
  try {
    const $ = await fetchWithTimeout(chapterUrl, {
      method: 'GET',
    });

    const imageUrls: string[] = [];
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

export default getChapterImages;
