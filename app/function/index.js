// File: data.js
const BaseUrlK = process.env.URL_KOMIK || 'https://komikindo.wtf';
exports.BaseUrlK = BaseUrlK;

// Mengimpor dan mengekspor fungsi atau objek
const getChapterImages = require('./getChapterImages');
const getImageByIndex = require('./getImageByIndex');
const fetchKomikData = require('./fetchKomikData');
const getChapters = require('./getChapters');
const scrapeComicInfo = require('./scrapeComicInfo');
const SearchComicsPage = require('./SearchComicsPage');

// Mengekspor semua fungsi dan variabel dengan nama yang sesuai
module.exports = {
  getChapterImages,
  getImageByIndex,
  fetchKomikData,
  getChapters,
  scrapeComicInfo,
  SearchComicsPage,
};
