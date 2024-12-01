'use client';
import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';

const KomikList = () => {
  const [komikList, setKomikList] = useState([]);
  const [currentPage, setCurrentPage] =
    useState(1);
  const [isLoading, setIsLoading] =
    useState(true);
  const [isFetching, setIsFetching] =
    useState(false);

  const fetchKomik = async (page) => {
    setIsFetching(true);
    try {
      const response = await fetch(
        `/api/komik/komiku?page=${page}`,
        {
          headers: {
            'Cache-Control': 'no-store',
          }, // Hindari respons cache
        },
      );
      const data = await response.json();
      setKomikList((prevList) => {
        // Gabungkan data lama dan baru, hapus duplikat berdasarkan `judul`
        const newList = [
          ...prevList,
          ...(data.komikList || []),
        ];
        return Array.from(
          new Map(
            newList.map((item) => [
              item.judul,
              item,
            ]),
          ).values(),
        );
      });
    } catch (error) {
      console.error(
        'Error fetching komik data:',
        error,
      );
    } finally {
      setIsFetching(false);
      setIsLoading(false);
    }
  };

  // Infinite Scroll Handler
  const handleScroll = useCallback(() => {
    if (isFetching) return; // Cegah fetch jika sedang fetching
    const bottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 100; // Dekati bagian bawah
    if (bottom) {
      setCurrentPage((prevPage) => prevPage + 1); // Tambah halaman
    }
  }, [isFetching]);

  useEffect(() => {
    fetchKomik(currentPage);
  }, [currentPage]);

  useEffect(() => {
    window.addEventListener(
      'scroll',
      handleScroll,
    );
    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll,
      ); // Hapus listener saat komponen di-unmount
    };
  }, [handleScroll]);

  const SkeletonLoader = () => (
    <div className="bg-gray-700 p-4 rounded-lg flex flex-col items-center justify-center">
      <div className="w-full aspect-[3/4] bg-gray-600 rounded-lg mb-3 animate-pulse"></div>
      <div className="w-full h-6 bg-gray-600 rounded mb-2 animate-pulse"></div>
      <div className="w-3/4 h-6 bg-gray-600 rounded animate-pulse"></div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-800 text-white p-5">
      {/* Komik Grid */}
      <div className="grid grid-cols-4 lg:grid-cols-5 gap-1 w-full mt-5">
        {isLoading
          ? Array.from({ length: 12 }).map(
              (_, index) => (
                <SkeletonLoader key={index} />
              ),
            )
          : komikList.map((komik, index) => (
              <div
                key={`${komik.judul}-${index}`} // Kombinasi key untuk menghindari duplikat
                className="bg-gray-700 p-2 rounded-lg flex flex-col items-center justify-center"
              >
                <img
                  src={komik.thumbnail}
                  alt={komik.judul}
                  className="w-full aspect-[3/4] object-cover bg-gray-600 rounded-lg mb-3"
                />
                <h3 className="text-sm font-semibold text-center line-clamp-2">
                  {komik.judul}
                </h3>
              </div>
            ))}
      </div>

      {/* Skeleton Loader untuk Infinite Scroll */}
      {isFetching && (
        <div className="mt-5 grid grid-cols-4 lg:grid-cols-5 gap-1 w-full">
          {Array.from({ length: 12 }).map(
            (_, index) => (
              <SkeletonLoader key={index} />
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default KomikList;
