import * as cheerio from 'cheerio';

async function fetchWithTimeout(
  resource: string,
  options: RequestInit & { timeout?: number } = {},
): Promise<ReturnType<typeof cheerio.load>> { // Menggunakan tipe generik
  const { timeout = 5000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch resource. Status: ${response.status} ${response.statusText}`,
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html); // Tipe ini akan secara otomatis disesuaikan
    return $;
} catch (error: unknown) {
  if (error instanceof Error && error.name === 'AbortError') {
    throw new Error('Request timeout: Fetch operation aborted');
  }
    throw error;
  } finally {
    clearTimeout(id);
  }
}

export default fetchWithTimeout;


