'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import ComicGrid from '../components/comic-grid';
// import { Comic } from '@/utils/global';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (searchQuery) {
      performSearch({ query: searchQuery, page: currentPage });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, currentPage]);

  async function performSearch({ query, page }: { query: string; page: number; }): Promise<void> {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/komikindo/search/${encodeURIComponent(query)}/${page}`,
      );
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      // Menyesuaikan struktur data sesuai dengan response baru
      setSearchResults(
        data.comics.map((comic: any) => ({
          title: comic.title,
          endpoint: comic.link.replace(/https:\/\/[^]+\/komik\/([^]+)\//, '$1'), // Endpoint dapat diambil dari link
          thumbnail: comic.image,
          rating: comic.rating,
        })) || [],
      );
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error searching comics:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    performSearch({ query: searchQuery, page: 1 });
  };

  const handlePagination = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='container bg-black py-6'
    >
      <h1 className='text-custom-pink mb-6 text-3xl font-bold'>
        Search Comics
      </h1>
      <form onSubmit={handleSearch} className='mb-6'>
        <div className='flex gap-2'>
          <Input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search for comics...'
            className='text-custom-pink flex-grow border-2 border-[#FBDEFF]'
          />
          <Button
            type='submit'
            className='text-custom-pink bg-gray-700'
            variant='ghost'
          >
            Search
          </Button>
        </div>
      </form>
      <ComicGrid comics={searchResults} loading={loading} />

      <div className='mt-6 flex justify-between'>
        <Button
          onClick={() => handlePagination('prev')}
          disabled={currentPage <= 1}
          variant='ghost'
          className='text-custom-pink bg-gray-700'
        >
          Previous
        </Button>
        <span className='text-custom-pink'>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => handlePagination('next')}
          disabled={currentPage >= totalPages}
          variant='ghost'
          className='text-custom-pink bg-gray-700'
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
}
