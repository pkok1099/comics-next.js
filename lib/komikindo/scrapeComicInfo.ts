import fetchWithTimeout from '../utils/fetchWithTimeout';
import { CustomError, constructUrl } from './utils';

interface Recommendation {
  title: string;
  link: string;
}

interface ComicInfo {
  title: string;
  thumbnail: string;
  chapterAwal: string;
  chapterBaru: string;
  rating: string;
  alternativeTitles: string[];
  status: string;
  author: string;
  illustrator: string;
  graphics: string;
  theme: string[];
  type: string;
  officialSource: string;
  lastUpdated: string;
  synopsis: string;
  recommendations: Recommendation[];
  spoilerImages: string[];
  chapterList: { title: string; url: string; lastUpdated: string }[];
  [key: string]: any; // Allow dynamic property access
}

const scrapeComicInfo = async (komik: string): Promise<ComicInfo> => {
  if (!komik) {
    throw new CustomError("Parameter 'komik' harus valid.");
  }

  try {
    const url = constructUrl(`/komik/${encodeURIComponent(komik)}/`);
    const $ = await fetchWithTimeout(url, { method: 'GET' });

    const data: ComicInfo = {} as ComicInfo;

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
        const link = $(el).find('.leftseries h4 a').attr('href') || ''; // Provide a default empty string
        return { title, link };
      })
      .get() || [{ title: 'No recommendations found', link: '' }]; // Ensure the return type matches Recommendation

    // Gambar Spoiler
    data.spoilerImages = $('.spoiler .spoiler-img img')
      .map((_, img) => {
        let src = $(img).attr('src');
        if (src && !src.startsWith('http')) { // Check if src is defined
          src = `https:${src}`;
        }
        return src;
      })
      .get()
      .filter(Boolean) || ['No spoiler images found'];

    // Mendapatkan Chapter List
    const chapterBaseUrl = constructUrl(`/komik/${encodeURIComponent(komik)}/`);
    const chapterList: { title: string; url: string; lastUpdated: string }[] = [];

    const $chapters = await fetchWithTimeout(
      decodeURIComponent(chapterBaseUrl),
      { method: 'GET' },
    );

    $chapters('.eps_lst .listeps ul li').each((_, element) => {
      const chapterUrl = $chapters(element).find('.lchx a').attr('href');
      const chapterTitle = $chapters(element).find('.lchx a').text().trim();
      const lastUpdated = $chapters(element).find('.dt a').text().trim();

      if (chapterUrl) {
        chapterList.push({
          title: chapterTitle,
          url: chapterUrl,
          lastUpdated,
        });
      }
    });

    // Urutkan chapter berdasarkan title
    data.chapterList = chapterList.sort((a, b) => {
      const chapterA = parseInt(a.title.replace(/\D/g, ''), 10);
      const chapterB = parseInt(b.title.replace(/\D/g, ''), 10);
      return chapterB - chapterA;
    });

    return data;
  } catch (error) {
    const err = error as CustomError; // Type assertion
    console.error(`Error occurred while scraping comic info: ${err.message}`);
    throw new CustomError('Failed to scrape comic info.');
  }
};

export default scrapeComicInfo;
