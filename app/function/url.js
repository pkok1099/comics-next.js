// Memeriksa dan menetapkan nilai BaseUrlK dan BaseUrlKc dari environment variables
const BaseUrlK = process.env.URL_KOMIK || 'https://komikindo.wtf';
const BaseUrlKc = process.env.URL_KOMIKC || 'https://api.komiku.id';
const BaseUrlKk = process.env.URL_KOMIKK || 'https://komiku.id';

module.exports = { BaseUrlK, BaseUrlKc, BaseUrlKk };