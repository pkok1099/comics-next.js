// import fetchKomikDataKomiku from './komiku/fetchKomikData';
// import getChaptersKomiku from './komiku/getChapters';

// import fetchKomikDataDoujindesu from './doujindesu/fetchKomikData';
// import getChaptersDoujindesu from './doujindesu/getChapters';
// import scrapeComicInfoDoujindesu from './doujindesu/scrapeComicInfo';
// import getChapterImagesDoujindesu from './doujindesu/getChapterImages';

import getChapterImagesKomikindo from './komikindo/getChapterImages';
import getImageByIndexKomikindo from './komikindo/getImageByIndex';
import fetchKomikDataKomikindo from './komikindo/fetchKomikData';
import getChaptersKomikindo from './komikindo/getChapters';
import scrapeComicInfoKomikindo from './komikindo/scrapeComicInfo';
import SearchComicsPageKomikindo from './komikindo/SearchComicsPage';

// interface Komiku {
// fetchKomikData: typeof fetchKomikDataKomiku;
// getChapters: typeof getChaptersKomiku;
// }

// interface Doujindesu {
// fetchKomikData: typeof fetchKomikDataDoujindesu;
// getChapters: typeof getChaptersDoujindesu;
// scrapeComicInfo: typeof scrapeComicInfoDoujindesu;
// getChapterImages: typeof getChapterImagesDoujindesu;
// }

interface Komikindo {
  getChapterImages: typeof getChapterImagesKomikindo;
  getImageByIndex: typeof getImageByIndexKomikindo;
  fetchKomikData: typeof fetchKomikDataKomikindo;
  getChapters: typeof getChaptersKomikindo;
  scrapeComicInfo: typeof scrapeComicInfoKomikindo;
  SearchComicsPage: typeof SearchComicsPageKomikindo;
}

// const komiku: Komiku = {
// fetchKomikData: fetchKomikDataKomiku,
// getChapters: getChaptersKomiku,
// };

// const doujindesu: Doujindesu = {
// fetchKomikData: fetchKomikDataDoujindesu,
// getChapters: getChaptersDoujindesu,
// scrapeComicInfo: scrapeComicInfoDoujindesu,
// getChapterImages: getChapterImagesDoujindesu,
// };

const komikindo: Komikindo = {
  getChapterImages: getChapterImagesKomikindo,
  getImageByIndex: getImageByIndexKomikindo,
  fetchKomikData: fetchKomikDataKomikindo,
  getChapters: getChaptersKomikindo,
  scrapeComicInfo: scrapeComicInfoKomikindo,
  SearchComicsPage: SearchComicsPageKomikindo,
};

export {
  // komiku,
  // doujindesu,
  komikindo,
};
