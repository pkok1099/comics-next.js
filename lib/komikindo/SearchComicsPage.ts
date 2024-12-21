import fetchWithTimeout from '../utils/fetchWithTimeout';
import isValidUrl from '../utils/isValidUrl';
import validateEnv from '../utils/validateEnv';

interface Comic {
  title: string;
  link: string;
  image: string | undefined;
  rating: string;
}

interface FetchComicsResult {
  comics: Comic[];
  totalPages: number;
}

// Fungsi utama untuk mengambil daftar komik dari halaman
async function fetchComicsFromPage(
  query: string = '',
  page: number = 1,
): Promise<FetchComicsResult> {
  try {
    const $ = await fetchWithTimeout(
      `${validateEnv('URL_KOMIK')}/page/${page}/?s=${query}`,
      { method: 'GET' },
    );

    // Data komik
    const comics: Comic[] = [];

    // Menghitung total halaman
    const pagination = $('.pagination');
    let totalPages = 1;

    const lastPageLink = pagination
      .find('.page-numbers.dots')
      .next('a')
      .attr('href');
    if (lastPageLink) {
      const match = lastPageLink.match(/page\/(\d+)/);
      if (match) {
        totalPages = parseInt(match[1], 10);
      }
    }

    // Mengambil data setiap komik
    $('.animepost').each((_, element) => {
      const title = $(element).find('h4').text().trim();
      const link = $(element).find('a[itemprop="url"]').attr('href');
      let image = $(element).find('img[itemprop="image"]').attr('src');
      const rating = $(element).find('.rating i').text().trim();

      if (image && !isValidUrl(image)) {
        console.warn(`imgage tidak ada: ${image}`);
        image = undefined;
      }
      if (link && !isValidUrl(link)) {
        console.warn(`link tidak ada: ${link}`);
      }

      if (title && link && image) {
        comics.push({
          title,
          link,
          image,
          rating: rating || 'No rating',
        });
      }
    });

    return { comics, totalPages };
  } catch (error) {
    console.error(`Error fetching comics: ${(error as Error).message}`);
    return { comics: [], totalPages: 1 };
  }
}

export default fetchComicsFromPage;
