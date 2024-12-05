import fetchKomikDataKomiku from './komiku/fetchKomikData';
import getChaptersKomiku from './komiku/getChapters';

import fetchKomikDataDoujindesu from './doujindesu/fetchKomikData';
import getChaptersDoujindesu from './doujindesu/getChapters';
import scrapeComicInfoDoujindesu from './doujindesu/scrapeComicInfo';
import getChapterImagesDoujindesu from './doujindesu/getChapterImages';

import getChapterImagesKomikindo from './komikindo/getChapterImages';
import getImageByIndexKomikindo from './komikindo/getImageByIndex';
import fetchKomikDataKomikindo from './komikindo/fetchKomikData';
import getChaptersKomikindo from './komikindo/getChapters';
import scrapeComicInfoKomikindo from './komikindo/scrapeComicInfo';
import SearchComicsPageKomikindo from './komikindo/SearchComicsPage';


const komiku = {
  fetchKomikData: fetchKomikDataKomiku,
  getChapters: getChaptersKomiku,
};

const Doujindesu = {
  fetchKomikData: fetchKomikDataDoujindesu,
  getChapters: getChaptersDoujindesu,
  scrapeComicInfo: scrapeComicInfoDoujindesu,
  getChapterImages: getChapterImagesDoujindesu,
};

const komikindo = {
  getChapterImages: getChapterImagesKomikindo,
  getImageByIndex: getImageByIndexKomikindo,
  fetchKomikData: fetchKomikDataKomikindo,
  getChapters: getChaptersKomikindo,
  scrapeComicInfo: scrapeComicInfoKomikindo,
  SearchComicsPage: SearchComicsPageKomikindo,
};

export { komiku, Doujindesu, komikindo };