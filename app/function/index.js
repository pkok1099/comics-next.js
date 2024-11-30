const komikuModules = {
  fetchKomikData: require('./komiku/fetchKomikData'),
  getChapters: require('./komiku/getChapters'),
};
const DoujindesuModules = {
  fetchKomikData: require('./doujindesu/fetchKomikData'),
  getChapters: require('./doujindesu/getChapters'),
  scrapeComicInfo: require('./doujindesu/scrapeComicInfo'),
  getChapterImages: require('./doujindesu/getChapterImages'),
};

const komikindoModules = {
  getChapterImages: require('./komikindo/getChapterImages'),
  getImageByIndex: require('./komikindo/getImageByIndex'),
  fetchKomikData: require('./komikindo/fetchKomikData'),
  getChapters: require('./komikindo/getChapters'),
  scrapeComicInfo: require('./komikindo/scrapeComicInfo'),
  SearchComicsPage: require('./komikindo/SearchComicsPage'),
};

module.exports = {
  komiku: komikuModules,
  komikindo: komikindoModules,
  Doujindesu: DoujindesuModules,
};
