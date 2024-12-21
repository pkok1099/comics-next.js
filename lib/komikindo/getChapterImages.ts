import { console } from 'inspector';
import commonHeaders from '../commonHeaders';
import fetchWithTimeout from '../utils/fetchWithTimeout';
import validateEnv from '../utils/validateEnv';

async function getChapterImages(
  komik: string,
  chapter: string,
): Promise<string[]> {
  const chapterUrl = `${validateEnv('URL_KOMIK')}/${komik}-chapter-${chapter}/`;
  console.log(chapterUrl);
  try {
    const $ = await fetchWithTimeout(chapterUrl, {
      headers: commonHeaders,
      method: 'GET',
    });

    if (!$) {
      throw new Error('Failed to fetch chapter images.');
    }

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
