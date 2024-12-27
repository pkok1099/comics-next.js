'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from 'components/ui/input';
import { Button } from 'components/ui/button';
import { motion } from 'framer-motion';
import ComicGrid from '../components/comic-grid';
import { searchComics } from '../api';

interface Comic {
  title: string;
  endpoint: string;
  thumbnail: string;
  rating: string;
}

interface ComicData {
  title: string;
  link: string;
  image: string;
  rating: string;
}

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPagination: (direction: 'next' | 'prev') => void;
}

const useComicSearch = (initialQuery: string) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const performSearch = async ({
    query,
    page,
  }: {
    query: string;
    page: number;
  }): Promise<void> => {
    setLoading(true);
    try {
      const data = await searchComics(query, page);
      setSearchResults(
        data.comics.map((comic: ComicData) => ({
          title: comic.title,
          endpoint: comic.link.replace(/https:\/\/[^]+\/komik\/([^]+)\//, '$1'),
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
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    performSearch,
  };
};

const SearchForm = ({
  searchQuery,
  setSearchQuery,
  onSearch,
}: SearchFormProps) => (
  <form onSubmit={onSearch} className='mb-6'>
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
);

const PaginationControls = ({
  currentPage,
  totalPages,
  onPagination,
}: PaginationControlsProps) => (
  <div className='mt-6 flex justify-between'>
    <Button
      onClick={() => onPagination('prev')}
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
      onClick={() => onPagination('next')}
      disabled={currentPage >= totalPages}
      variant='ghost'
      className='text-custom-pink bg-gray-700'
    >
      Next
    </Button>
  </div>
);

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    performSearch,
  } = useComicSearch(initialQuery);

  useEffect(() => {
    if (searchQuery) {
      performSearch({ query: searchQuery, page: currentPage });
    }
  }, [searchQuery, currentPage]);

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
      <SearchForm
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />
      <ComicGrid comics={searchResults} loading={loading} />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPagination={handlePagination}
      />
    </motion.div>
  );
}
