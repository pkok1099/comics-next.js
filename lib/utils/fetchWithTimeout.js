const axios = require('axios');
const cheerio = require('cheerio');

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 5000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await axios.get(resource, {
      ...options,
      signal: controller.signal,
    });

    // Cek jika response tidak ok
    if (!response.status === 200) {
      throw new Error('Failed to fetch resource');
    }

    // Menggunakan cheerio untuk memparsing HTML
    const $ = cheerio.load(response.data);
    return $;
  } catch (error) {
    throw error;
  } finally {
    clearTimeout(id);
  }
}

module.exports = fetchWithTimeout;
