'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/components/ui/Pagination';
import KomikGrid from 'components/komikindo/KomikGrid';
import KomikLoader from 'components/komikindo/KomikLoader';
import { useKomikList } from '@/app/hooks/useKomikList';
import { scrollToTop } from '@/app/utils/scroll';

export default function KomikList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams?.get('page') || '1', 10);

  const { komikList, pagination, isLoading, setIsLoading, loadKomik } =
    useKomikList(initialPage);

  useEffect(() => {
    scrollToTop();
  }, [initialPage]);

  const handlePageChange = (page: number) => {
    router.push(`?page=${page}`);
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
