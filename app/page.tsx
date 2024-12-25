'use client';

import React, { useState, useEffect } from 'react';
import Pagination from 'components/ui/Pagination';
import { useRouter } from 'next/navigation';
import { fetchKomik } from './api';
import KomikGrid from '@/components/komikindo/KomikGrid';
import KomikLoader from '@/components/komikindo/KomikLoader';

function KomikList() {
  const [komikList, setKomikList] = useState<Komik[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

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
    loadKomik(currentPage);
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentPage]);

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
          currentPage={currentPage}
          pagination={pagination}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}

export default KomikList;
