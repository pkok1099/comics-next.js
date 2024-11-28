const komikuModules = {
  fetchKomikData: require('./komiku/fetchKomikData'),
  getChapters: require('./komiku/getChapters'),
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
};