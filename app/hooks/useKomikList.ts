import { useState, useEffect } from 'react';
import { fetchKomik } from '@/app/api';

export function useKomikList(initialPage: number) {
  const [komikList, setKomikList] = useState<Komik[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadKomik = async (page: number): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await fetchKomik(page);
      setKomikList(data.komikList);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading komik data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadKomik(initialPage);
  }, [initialPage]);

  return {
    komikList,
    pagination,
    isLoading,
    setIsLoading,
    loadKomik
  };
}
