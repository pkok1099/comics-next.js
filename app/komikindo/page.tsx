'use client';

import React, { useState, useEffect } from 'react';
// import { ScrollArea } from '@/components/ui/scroll-area';
import Pagination from '@/components/ui/Pagination';
// import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { KomikCard } from '@/components/komikindo/KomikCard';
import { SkeletonLoader } from '@/components/komikindo/SkeletonLoader';

interface Komik {
  judul: string;
  link: string;
  // Add other properties as needed
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  // Add other properties as needed
}

const KomikList: React.FC = () => {
  const [komikList, setKomikList] = useState<Komik[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchKomik = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/komikindo?page=${page}`);
      const data = await response.json();
      setKomikList(data.komikList || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error('Error fetching komik data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKomik(currentPage);
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentPage]);

  const handleKomikClick = async (komikLink: string) => {
    setIsLoading(true);
    try {
      router.push(
        `/komikindo/${komikLink.replace(/https:\/\/[^]+\/komik\/([^]+)\//, '$1')}/chapters`,
      );
    } catch (error) {
      console.error('Error navigating to komik page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center bg-gray-800 p-5 text-white'>
      <div className='grid w-full grid-cols-4 gap-3 lg:grid-cols-5'>
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <SkeletonLoader key={index} />
            ))
          : komikList.map((komik) => (
              <KomikCard
                key={komik.judul}
                komik={komik}
                onClick={() => handleKomikClick(komik.link)}
              />
            ))}
      </div>

      {!isLoading && pagination && (
        <Pagination
          currentPage={currentPage}
          pagination={pagination}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default KomikList;
