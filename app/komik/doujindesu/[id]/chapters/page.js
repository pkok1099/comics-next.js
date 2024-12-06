'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const ChapterList = () => {
  const { id } = useParams();
  const [komikData, setKomikData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Logging utility
  const logData = (label, data) => {
    console.log(`${label}:`, data);
  };

  // Fetch Komik Info
  const fetchKomikData = useCallback(async (id) => {
    try {
      const response = await fetch(
        `/api/komik/doujindesu/info/${decodeURIComponent(id)}`,
      );
      const data = await response.json();
      logData('Komik Data', data);
      return data;
    } catch (error) {
      throw new Error('Error fetching komik data:', error);
    }
  }, []);

  // Render Thumbnail
  const renderThumbnail = (thumbnail) => (
    <div
      className='flex items-center justify-center rounded-lg bg-gray-800 p-4 shadow-lg'
      style={{
        width: '300px',
        height: `${(300 * 4) / 3}px`,
      }}
    >
      {thumbnail ? (
        <Image
          width={300}
          height={400}
          src={thumbnail}
          alt='Thumbnail'
          className='flex h-full w-full items-center justify-center rounded-md object-cover'
        />
      ) : (
        <div className='flex h-full items-center justify-center bg-gray-700 text-gray-400'>
          Thumbnail tidak tersedia
        </div>
      )}
    </div>
  );

  // Render Komik Info
  const renderKomikInfo = (komikData) => (
    <>
      <h1 className='mt-8 text-center text-3xl font-bold'>
        {komikData?.title !== 'Title not found'
          ? komikData?.title
          : 'Judul Tidak Tersedia'}
      </h1>
      <p className='mt-2 text-center text-gray-400'>
        {komikData?.synopsis !== 'Synopsis not found'
          ? komikData?.synopsis
          : 'Sinopsis tidak tersedia.'}
      </p>
    </>
  );

  // Render Chapters
  const renderChapters = (chapters, id) =>
    chapters.map((chapter, index) => (
      <div
        key={index}
        className='rounded-lg bg-gray-700 p-4 transition-all hover:bg-gray-600'
      >
        <h3 className='text-lg font-bold'>
          {chapter.title || 'Judul Tidak Tersedia'}
        </h3>
        <p className='text-sm text-gray-400'>
          {chapter.url || 'Tanggal Tidak Tersedia'}
        </p>
        {chapter.lastUpdated && (
          <Link
            href={`/komik/doujindesu/${id}/chapters/${encodeURIComponent(chapter.lastUpdated.replace(/.*chapter-(\d+).*/, '$1'))}`}
            className='mt-2 block text-blue-500 hover:underline'
          >
            Baca Chapter
          </Link>
        )}
      </div>
    ));

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      if (id) {
        setLoading(true);
        const komik = await fetchKomikData(id);
        setKomikData(komik);
        setChapters(komik?.chapters || []);
        setLoading(false);
      }
    };

    loadData();
  }, [id, fetchKomikData]);

  // Loading State
  if (loading) {
    return (
      <div className='mt-[40px] flex animate-pulse flex-col items-center space-y-6'>
        <div
          className='rounded-md bg-gray-700'
          style={{
            width: '300px',
            aspectRatio: '3 / 4',
          }}
        />
        <div className='mt-4 h-8 w-64 rounded-md bg-gray-700' />
        <div className='mt-6 w-full max-w-md rounded-lg bg-gray-700 p-4'>
          <div className='space-y-4'>
            <div className='h-6 w-full rounded-md bg-gray-700' />
          </div>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className='bg-gray-900 p-4 text-white'>
      {/* Thumbnail */}
      <div className='mt-[40px] flex justify-center'>
        {renderThumbnail(komikData?.thumbnail)}
      </div>

      {/* Komik Info */}
      {renderKomikInfo(komikData)}

      {/* Daftar Chapter */}
      <div className='mt-6 max-h-96 overflow-y-scroll rounded-lg bg-gray-800 p-4 shadow-lg'>
        <h2 className='mb-4 text-center text-xl font-bold'>Daftar Chapter</h2>
        <div className='space-y-4'>{renderChapters(chapters, id)}</div>
      </div>
    </div>
  );
};

export default ChapterList;
