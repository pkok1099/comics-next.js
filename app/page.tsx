'use client';

import React, { useState, useEffect } from 'react';
import Pagination from '@/components/ui/Pagination';
import { useRouter } from 'next/navigation';
import { KomikCard } from '@/components/komikindo/KomikCard';
import { SkeletonLoader } from '@/components/komikindo/SkeletonLoader';
import { fetchKomik } from './api';

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
      <div className='grid w-full grid-cols-4 gap-2 lg:grid-cols-5'>
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <SkeletonLoader key={index} />
            ))
          : komikList.map((komik) => (
              <KomikCard
                key={komik.judul}
                komik={komik}
                onClick={() =>
                  (async (komikLink: string): Promise<void> => {
                    setIsLoading(true);
                    try {
                      await router.push(
                        `/komikindo/${komikLink.replace(/https:\/\/[^]+\/komik\/([^]+)\//, '$1')}/chapters`,
                      );
                    } catch (error) {
                      console.error('Error navigating to komik page:', error);
                    } finally {
                      setIsLoading(false);
                    }
                  })(komik.link)
                }
              />
            ))}
      </div>

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
