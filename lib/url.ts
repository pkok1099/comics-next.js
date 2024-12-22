// Memeriksa dan menetapkan nilai BaseUrlK dan BaseUrlKc dari environment variables
const BaseUrlK: string = process.env.URL_KOMIK || 'https://komikindo.wtf';
const BaseUrlKc: string = process.env.URL_KOMIKC || 'https://api.komiku.id';
const BaseUrlKk: string = process.env.URL_KOMIKK || 'https://komiku.id';
const BaseUrlDd: string = process.env.URL_KOMIKK || 'https://manhwadesu.asia';

export { BaseUrlK, BaseUrlKc, BaseUrlKk, BaseUrlDd };
