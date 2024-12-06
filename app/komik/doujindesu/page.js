'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import debounce from 'lodash';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
import Image from 'next/image';

const KomikList = () => {
  const [komikList, setKomikList] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  // Gabungkan fetch komik dan search menjadi satu fungsi
  const fetchKomik = useCallback(async (page = 1, query = '') => {
    setIsLoading(true);
    const url = query
      ? `/api/komik/doujindesu/search/${query}/${page}` // Pencarian
      : `/api/komik/doujindesu?page=${page}`; // Daftar komik

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (query) {
        setSearchResults(data.comics || []);
      } else {
        setKomikList(data.komikList || []);
        setPagination(data.pagination || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (query) {
        setSearchResults([]); // Clear search results on error
      } else {
        setKomikList([]);
        setPagination([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetchKomik = useMemo(
    () => debounce(fetchKomik, 500),
    [fetchKomik],
  );

  useEffect(() => {
    fetchKomik(currentPage); // Load komik list pertama kali
  }, [currentPage, fetchKomik]);

  useEffect(() => {
    router.prefetch(`/komik/doujindesu`);
  }, [router]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery) {
      router.push(`/search/${searchQuery}`);
      fetchKomik(1, searchQuery); // Menjalankan pencarian saat submit
    }
  };

  const handleKomikClick = (komikLink) => {
    const komikSlug = komikLink.replace(
      /https:\/\/[^]+\/manga\/([^]+)\//,
      '$1',
    );
    router.push(`/komik/doujindesu/${komikSlug}/chapters`);
  };

  return (
    <div className='flex min-h-screen flex-col items-center bg-gray-800 p-5 text-white'>
      <form onSubmit={handleSearchSubmit} className='mb-5 w-full max-w-lg'>
        <input
          type='text'
          placeholder='Cari Komik'
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            debouncedFetchKomik(currentPage, e.target.value); // Panggil fetch dengan query pencarian
          }}
          className='w-full rounded-lg bg-gray-700 p-3 text-white placeholder-gray-400 outline-none'
        />
        {searchQuery && (
          <div className='absolute z-50 mt-2 max-h-52 w-full overflow-y-auto rounded-lg bg-gray-700 p-3 shadow-lg'>
            <ul>
              {searchResults.slice(0, 5).map((komik) => (
                <li
                  key={komik.link}
                  onClick={() => handleKomikClick(komik.link)}
                  className='flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-600'
                >
                  <Image
                    src={komik.image}
                    alt={komik.title}
                    width={48}
                    height={48}
                    className='rounded-lg'
                  />
                  <span className='text-sm'>{komik.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>

      <div className='mt-5 grid w-full grid-cols-4 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <SkeletonLoader key={index} />
            ))
          : (searchQuery ? searchResults : komikList).map((komik) => (
              <Card key={komik.link} komik={komik} onClick={handleKomikClick} />
            ))}
      </div>

      {!searchQuery && pagination.length > 0 && !isLoading && (
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
