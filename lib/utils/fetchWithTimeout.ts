import * as cheerio from 'cheerio';

async function fetchWithTimeout(
  resource: string,
  options: RequestInit & { timeout?: number } = {},
): Promise<cheerio.CheerioAPI> {
  const { timeout = 5000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });

    // Check if response is not ok
    if (!response.ok) {
      throw new Error('Failed to fetch resource');
    }

    // Using cheerio to parse HTML
    const html = await response.text();
    const $ = cheerio.load(html);
    return $;
  } catch (error) {
    throw error;
  } finally {
    clearTimeout(id);
  }
}

export default fetchWithTimeout;
