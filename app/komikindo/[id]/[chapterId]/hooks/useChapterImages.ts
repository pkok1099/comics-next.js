import { useState, useCallback } from 'react';
import { fetchChapterImages } from '@/app/api';

export const useChapterImages = (id: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<string[]>([]);

  const loadChapterImages = useCallback(
    async (chapterId: string) => {
      setLoading(true);
      setError(null);

      try {
        const chapterImages = await fetchChapterImages(id, chapterId);
        setPages(chapterImages);
      } catch {
        setError('Error loading chapter images');
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  return { loading, error, pages, loadChapterImages };
};
