import { describe, it, expect, vi, beforeEach } from 'vitest';
import fetchKomikData from '../lib/komikindo/fetchKomikData';
import fetchWithTimeout from '../lib/utils/fetchWithTimeout';

vi.mock('../utils/fetchWithTimeout');
vi.mock('./utils', () => ({
  CustomError: class CustomError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'CustomError';
    }
  },
  constructUrl: (path: string) => `https://example.com${path}`,
}));

describe('fetchKomikData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw CustomError when page is not a number', async () => {
    await expect(fetchKomikData(NaN)).rejects.toThrow('page harus number');
  });

  it('should fetch and parse komik data successfully', async () => {
    const mockCheerio = {
      animepost: vi.fn().mockReturnValue({
        map: () => ({
          get: () => [
            {
              judul: 'Test Manga',
              thumbnail: 'https://example.com/image.jpg',
              link: 'https://example.com/manga/1',
            },
          ],
        }),
      }),
      pagination: vi.fn().mockReturnValue({
        map: () => ({
          get: () => [1, 2, 3],
        }),
      }),
    };

    (fetchWithTimeout as jest.Mock).mockResolvedValue(mockCheerio);

    const result = await fetchKomikData(1);

    expect(result).toEqual({
      komikList: [
        {
          judul: 'Test Manga',
          thumbnail: 'https://example.com/image.jpg',
          link: 'https://example.com/manga/1',
        },
      ],
      pagination: [1, 2, 3],
    });
  });

  it('should handle fetch errors', async () => {
    (fetchWithTimeout as jest.Mock).mockRejectedValue(
      new Error('Network error'),
    );

    await expect(fetchKomikData(1)).rejects.toThrow('Network error');
  });
});
