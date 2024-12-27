'use client';

import React, { useState, useEffect } from 'react';
import Pagination from '@/components/ui/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchKomik } from '@/app/api';
import KomikGrid from 'components/komikindo/KomikGrid';
import KomikLoader from 'components/komikindo/KomikLoader';

export default function KomikList() {
  const [komikList, setKomikList] = useState<Komik[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams?.get('page') || '1', 10); // Handle nullability

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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [initialPage]);

  const handlePageChange = (page: number) => {
    router.push(`?page=${page}`); // Corrected arguments
    loadKomik(page);
  };

  return (
    <div className='flex min-h-screen flex-col items-center p-5'>
      {isLoading ? (
        <KomikLoader />
      ) : (
        <KomikGrid
          komikList={komikList}
          router={router}
          setIsLoading={setIsLoading}
        />
      )}

      {!isLoading && (
        <Pagination
          currentPage={initialPage}
          pagination={pagination}
          setCurrentPage={handlePageChange}
        />
      )}
    </div>
  );
}
