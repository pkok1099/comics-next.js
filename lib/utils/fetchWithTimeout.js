// const axios = require('axios');
const cheerio = require('cheerio');

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 5000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });

    // Cek jika response tidak ok
    if (!response.status === 200) {
      throw new Error('Failed to fetch resource');
    }

    // Menggunakan cheerio untuk memparsing HTML
    const html = await response.text();
    const $ = cheerio.load(html);
    return $;
  } catch (error) {
    throw error;
  } finally {
    clearTimeout(id);
  }
}

module.exports = fetchWithTimeout;
