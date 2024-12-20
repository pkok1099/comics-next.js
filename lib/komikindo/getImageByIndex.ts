import isValidUrl from '../utils/isValidUrl';
import fetchWithTimeout from '../utils/fetchWithTimeout';
import validateEnv from '../utils/validateEnv';

// Fungsi untuk mengambil gambar berdasarkan chapter dan index
async function getImageByIndex(judul: string, chapter: string, index: number): Promise<string> {
  if (!judul || !chapter || !index || isNaN(index)) {
    throw new Error("Parameter 'judul', 'chapter', dan 'index' harus valid.");
  }
  try {
    // Ambil URL chapter
    const $ = await fetchWithTimeout(
      `${validateEnv('URL_KOMIK')}/${encodeURIComponent(judul)}-chapter-${chapter}/#page_${index}`,
      { method: 'GET' },
    );
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
      throw new Error('Image not found.');
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    throw new Error('Failed to fetch image.');
  }
}

export default getImageByIndex;
