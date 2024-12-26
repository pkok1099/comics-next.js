import * as cheerio from 'cheerio';
import commonHeaders from '../commonHeaders';
import fetchWithTimeout from '../utils/fetchWithTimeout';
import isValidUrl from '../utils/isValidUrl';
import { CustomError, constructUrl } from './utils';

interface PopularComic {
  title: string;
  cover: string;
  rating: number;
  author: string;
  type: string; // Manga/Manhwa/Manhua
  description: string;
  latestChapter: {
    chapter: string;
    url: string;
  };
  url: string;
}

interface LatestUpdate {
  title: string;
  cover: string;
  type: string;
  rating: number;
  status: string; // Ongoing/Completed
  chapters: {
    chapter: string;
    url: string;
    updatedAt: string;
  }[];
  url: string;
}

interface HomePageResponse {
  popular: PopularComic[];
  latest: LatestUpdate[];
}

async function fetchKomikPage(): Promise<HomePageResponse> {
  try {
    const url = constructUrl('/');
    const $ = await fetchWithTimeout(url, {
      headers: commonHeaders,
      method: 'GET',
    });

    return {
      popular: extractPopular($),
      latest: extractLatest($),
    };
  } catch (error) {
    if (error instanceof CustomError) {
      console.error('Error fetching home page:', error.message, error);
      throw error;
    } else {
      console.error('Unexpected error:', error);
      throw new CustomError('Unexpected error occurred');
    }
  }
}

function extractPopular($: cheerio.Root): PopularComic[] {
  return $('.mangapopuler .animepost')
    .map((_, el) => {
      const item = $(el);
      const cover = item.find('.limit img').attr('src');

      if (!cover || !isValidUrl(cover)) return null;

      return {
        title: item.find('.tt h4').text().trim(),
        cover,
        rating: parseFloat(item.find('.rating i').text() || '0'),
        author: item.find('.author').text().trim(),
        type: item.find('.typeflag').attr('class')?.split(' ')[1] || '',
        description: item.find('.ttls').text().trim(),
        latestChapter: {
          chapter: item.find('.lsch a').text().trim(),
          url: item.find('.lsch a').attr('href') || '',
        },
        url: item.find('a').first().attr('href') || '',
      };
    })
    .get()
    .filter((item): item is PopularComic => item !== null);
}

function extractLatest($: cheerio.Root): LatestUpdate[] {
  return $('.chapterbaru .animepost')
    .map((_, el) => {
      const item = $(el);
      const cover = item.find('.animepostxx-top img').attr('src');

      if (!cover || !isValidUrl(cover)) return null;

      const chapters = item
        .find('.list-ch-skroep a')
        .map((_, ch) => ({
          chapter: $(ch).text().trim(),
          url: $(ch).attr('href') || '',
          updatedAt: '',
        }))
        .get();

      return {
        title: item.find('.animepostxx-top a').attr('title')?.trim() || '',
        cover,
        type: item.find('.typeflag').attr('class')?.split(' ')[1] || '',
        rating: parseFloat(item.find('.rating i').text() || '0'),
        status: item.find('.status-skroep').text().trim(),
        chapters,
        url: item.find('.animepostxx-top a').attr('href') || '',
      };
    })
    .get()
    .filter((item): item is LatestUpdate => item !== null);
}

export default fetchKomikPage;
