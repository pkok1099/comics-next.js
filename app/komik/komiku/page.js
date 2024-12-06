'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import debounce from 'lodash'; // Import debounce

const KomikList = () => {
  const [komikList, setKomikList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Tambahkan state hasMore untuk mengecek apakah masih ada halaman berikutnya

  const fetchKomik = useCallback(
    async (page) => {
      if (!hasMore) return; // Jangan fetch jika tidak ada lagi halaman untuk dimuat
      setIsFetching(true);
      try {
        const response = await fetch(`/api/komik/komiku?page=${page}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.komikList && data.komikList.length === 0) {
          setHasMore(false); // Jika data kosong, set hasMore ke false
        } else {
          setKomikList((prevList) => {
            const updatedList = [...prevList, ...(data.komikList || [])];
            const uniqueKomik = Array.from(
              new Map(updatedList.map((item) => [item.link, item])).values(),
            );
            return uniqueKomik;
          });
        }
      } catch (error) {
        console.error('Error fetching komik data:', error);
      } finally {
        setIsFetching(false);
        setIsLoading(false);
      }
    },
    [hasMore],
  );

  // Menggunakan debounce untuk membatasi frekuensi pemanggilan handleScroll
  // const handleScroll = debounce(
  //   debounce(() => {
  //     if (isFetching || !hasMore) return; // Jangan lanjutkan jika sedang fetching atau sudah tidak ada halaman lagi
  //     if (
  //       window.innerHeight + window.scrollY >=
  //       document.documentElement.scrollHeight - 100
  //     ) {
  //       setCurrentPage((prevPage) => prevPage + 1);
  //     }
  //   }, 300), // 300ms debounce delay
  //   [isFetching, hasMore], // Perhatikan dependencies untuk menangani state `hasMore`
  // );

  const debouncedHandleScroll = debounce(() => {
    if (isFetching || !hasMore) return; // Jangan lanjutkan jika sedang fetching atau sudah tidak ada halaman lagi
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 100
    ) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, 300); // 300ms debounce delay

  useEffect(() => {
    fetchKomik(currentPage);
  }, [currentPage, fetchKomik]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [debouncedHandleScroll]);

  return (
    <div className='flex min-h-screen flex-col items-center bg-gray-800 p-5 text-white'>
      <div className='mt-5 grid w-full grid-cols-4 gap-1 sm:grid-cols-3 md:grid-cols-4'>
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <SkeletonLoader key={index} />
            ))
          : komikList.map((komik) => (
              <div
                key={komik.link}
                className='flex flex-col items-center justify-center rounded-lg bg-gray-700 p-1'
              >
                <Image
                  src={komik.thumbnail}
                  alt={komik.judul}
                  width={200}
                  height={280}
                  className='mb-3 aspect-[2/3] w-full rounded-lg bg-gray-600 object-cover'
                />
                <h3 className='line-clamp-2 text-center text-sm font-semibold'>
                  {komik.judul}
                </h3>
              </div>
            ))}
      </div>

      {isFetching && hasMore && (
        <div className='mt-5 grid w-full grid-cols-4 gap-4 sm:grid-cols-3 md:grid-cols-4'>
          {Array.from({ length: 12 }).map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      )}

      {!hasMore && (
        <div className='mt-5 text-center text-gray-400'>
          <p>Semua komik telah dimuat.</p>
        </div>
      )}
    </div>
  );
};

export default KomikList;
