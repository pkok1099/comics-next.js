'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import Pagination from '@/components/ui/Pagination';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const KomikList = () => {
  const [komikList, setKomikList] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchKomik = async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/komik/komikindo?page=${page}`);
      const data = await response.json();
      setKomikList(data.komikList || []);
      setPagination(data.pagination || []);
    } catch (error) {
      console.error('Error fetching komik data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSearchResults = async (query) => {
    if (query) {
      try {
        const response = await fetch(`/api/komik/komikindo/search/${query}/1`);
        const data = await response.json();
        setSearchResults(data.comics || []);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchKomik(currentPage);
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentPage]);

  useEffect(() => {
    const cookies = document.cookie;
    const userCookie =
      cookies &&
      cookies.split(';').find((cookie) => cookie.trim().startsWith('user='));

    if (userCookie) {
      setIsLoggedIn(true);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter') {
      window.location.href = `/search/${searchQuery}`;
    }
  };

  const handleKomikClick = async (komikLink) => {
    setIsLoading(true);
    try {
      await router.push(
        `/komik/komikindo/${komikLink.replace(/https:\/\/[^]+\/komik\/([^]+)\//, '$1')}/chapters`,
      );
    } catch (error) {
      console.error('Error navigating to komik page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center bg-gray-800 p-5 text-white'>
      <div className='absolute mb-5 w-full max-w-lg'>
        <Popover>
          <PopoverTrigger asChild>
            <Input
              type='text'
              placeholder='Cari Komik'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              className='w-full rounded-lg bg-gray-700 p-3 text-white placeholder-gray-400 outline-none'
            />
          </PopoverTrigger>
          {searchQuery && (
            <ScrollArea className='absolute z-50 mt-2 max-h-52 w-full overflow-y-auto rounded-lg bg-gray-700 p-3 shadow-lg'>
              <ul className='space-y-2'>
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
            </ScrollArea>
          )}
        </Popover>
      </div>

      <div className='mt-16 grid w-full grid-cols-4 gap-3 lg:grid-cols-5'>
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

      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          pagination={pagination}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

const KomikCard = ({ komik, onClick }) => (
  <Card
    key={komik.judul}
    className='cursor-pointer bg-gray-700 hover:shadow-lg'
    onClick={onClick}
  >
    <Image
      src={komik.thumbnail}
      alt={komik.judul}
      width={200}
      height={250}
      loading='lazy'
      className='aspect-[3/4] w-full rounded-lg bg-gray-600'
    />
    <CardHeader className='p-2'>
      <CardTitle className='line-clamp-2 text-center text-base font-semibold leading-tight'>
        {komik.judul}
      </CardTitle>
    </CardHeader>
  </Card>
);

const SkeletonLoader = () => (
  <Card className='bg-gray-700 p-4'>
    <Skeleton className='mb-3 aspect-[3/4] w-full rounded-lg bg-gray-600' />
    <Skeleton className='mb-2 h-6 w-full bg-gray-600' />
    <Skeleton className='h-6 w-3/4 bg-gray-600' />
  </Card>
);

export default KomikList;
