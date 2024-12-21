import isValidUrl from '../utils/isValidUrl';
import fetchWithTimeout from '../utils/fetchWithTimeout';
import { CustomError, constructUrl } from './utils';

// Fungsi untuk mengambil gambar berdasarkan chapter dan index
async function getImageByIndex(
  judul: string,
  chapter: string,
  index: number,
): Promise<string> {
  if (!judul || !chapter || !index || isNaN(index)) {
    throw new CustomError(
      "Parameter 'judul', 'chapter', dan 'index' harus valid.",
    );
  }
  try {
    // Ambil URL chapter
    const url = constructUrl(
      `/${encodeURIComponent(judul)}-chapter-${chapter}/#page_${index}`,
    );
    const $ = await fetchWithTimeout(url, { method: 'GET' });
    let imgSrc = $(`.img-landmine > img:nth-child(${index})`).attr('src');

    if (imgSrc) {
      // Menangani relative URL jika ditemukan
      if (!isValidUrl(imgSrc)) {
        if (imgSrc.startsWith('//')) {
          imgSrc = `https:${imgSrc}`;
        } else {
          console.warn(
            'Peringatan: URL gambar tidak valid. URL mungkin relatif atau salah format.',
          );
        }
      }
      return imgSrc;
    } else {
      throw new CustomError('Image not found.');
    }
  } catch (error) {
    const err = error as CustomError; // Type assertion
    console.error('Error fetching image:', err.message);
    throw new CustomError('Failed to fetch image.');
  }
}

export default getImageByIndex;
