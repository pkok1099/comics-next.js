/**
 * Fetches comic data from the specified page.
 *
 * @param {number} [page=1] - The page number to fetch data from. Defaults to 1.
 * @returns {Promise<FetchKomikDataResponse>} A promise that resolves to an object containing the list of comics and pagination data.
 * @throws {CustomError} Throws a custom error if the page parameter is not a valid number or if there is an error during fetching.
 *
 * @example
 * ```typescript
 * fetchKomikData(1).then(response => {
 *   console.log(response.komikList);
 *   console.log(response.pagination);
 * }).catch(error => {
 *   console.error(error.message);
 * });
 * ```
 *
 * @example
 * Sample result:
 * ```json
 * {
 *   "komikList": [
 *     {
 *       "judul": "Comic Title 1",
 *       "thumbnail": "https://example.com/thumbnail1.jpg",
 *       "link": "https://example.com/comic1"
 *     },
 *     {
 *       "judul": "Comic Title 2",
 *       "thumbnail": "https://example.com/thumbnail2.jpg",
 *       "link": "https://example.com/comic2"
 *     }
 *   ],
 *   "pagination": [1, 2, 3, 4, 5]
 * }
 * ```
 */
import commonHeaders from '../commonHeaders';
import fetchWithTimeout from '../utils/fetchWithTimeout';
import isValidUrl from '../utils/isValidUrl';
import { CustomError, constructUrl } from './utils';

interface Komik {
  judul: string;
  thumbnail: string | null | undefined; // Allow undefined
  link: string | undefined;
}

interface FetchKomikDataResponse {
  komikList: Komik[];
  pagination: number[];
}

async function fetchKomikData(
  page: number = 1,
): Promise<FetchKomikDataResponse> {
  try {
    if (typeof page !== 'number' || isNaN(page)) {
      throw new CustomError('page harus number');
    }

    const url = constructUrl(`/komik-terbaru/page/${page}/`);
    const $ = await fetchWithTimeout(url, {
      headers: commonHeaders,
      method: 'GET',
    });

    // Parsing data komik
    const komikList: Komik[] = $('.animepost')
      .map((_, element) => {
        const $el = $(element); // Cache elemen saat iterasi
        const thumbnail = $el.find('img').attr('src');
        return {
          judul: $el.find('h4').text().trim(),
          thumbnail: thumbnail && isValidUrl(thumbnail) ? thumbnail : null, // Validasi URL thumbnail
          link: $el.find('a').attr('href'),
        };
      })
      .get()
      .filter((komik) => komik.thumbnail); // Hanya ambil data dengan thumbnail yang valid

    // Parsing pagination
    const pagination: number[] = $('.pagination .page-numbers')
      .map((_, element) => parseInt($(element).text().trim(), 10))
      .get()
      .filter((pageNumber) => !isNaN(pageNumber)); // Hanya ambil angka yang valid

    return { komikList, pagination };
  } catch (error) {
    const err = error as CustomError; // Type assertion
    console.error('Error fetching komik data:', err.message);
    throw err;
  }
}

export default fetchKomikData;
