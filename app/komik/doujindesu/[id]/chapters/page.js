'use client';

import {
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const ChapterList = () => {
  const { id } = useParams();
  const [komikData, setKomikData] =
    useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Logging utility
  const logData = (label, data) => {
    console.log(`${label}:`, data);
  };

  // Fetch Komik Info
  const fetchKomikData = useCallback(
    async (id) => {
      try {
        const response = await fetch(
          `/api/komik/doujindesu/info/${decodeURIComponent(id)}`,
        );
        const data = await response.json();
        logData('Komik Data', data);
        return data;
      } catch (error) {
        throw new Error(
          'Error fetching komik data:',
          error,
        );
      }
    },
    [],
  );

  // Render Thumbnail
  const renderThumbnail = (thumbnail) => (
    <div
      className="bg-gray-800 p-4 rounded-lg shadow-lg"
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
          alt="Thumbnail"
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <div className="bg-gray-700 text-gray-400 flex items-center justify-center h-full">
          Thumbnail tidak tersedia
        </div>
      )}
    </div>
  );

  // Render Komik Info
  const renderKomikInfo = (komikData) => (
    <>
      <h1 className="mt-8 text-3xl font-bold text-center">
        {komikData?.title !== 'Title not found'
          ? komikData?.title
          : 'Judul Tidak Tersedia'}
      </h1>
      <p className="text-gray-400 text-center mt-2">
        {komikData?.synopsis !==
        'Synopsis not found'
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
        className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-all"
      >
        <h3 className="text-lg font-bold">
          {chapter.title ||
            'Judul Tidak Tersedia'}
        </h3>
        <p className="text-sm text-gray-400">
          {chapter.url ||
            'Tanggal Tidak Tersedia'}
        </p>
        {chapter.lastUpdated && (
          <Link
            href={`/komik/doujindesu/${id}/chapters/${encodeURIComponent(
              chapter.lastUpdated.replace(
                /.*chapter-(\d+).*/,
                '$1',
              ),
            )}`}
            className="block mt-2 text-blue-500 hover:underline"
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
      <div className="animate-pulse flex flex-col items-center space-y-6 mt-[40px]">
        <div
          className="bg-gray-700 rounded-md"
          style={{
            width: '300px',
            aspectRatio: '3 / 4',
          }}
        />
        <div className="bg-gray-700 h-8 w-64 rounded-md mt-4" />
        <div className="bg-gray-700 p-4 rounded-lg mt-6 w-full max-w-md">
          <div className="space-y-4">
            <div className="bg-gray-700 h-6 w-full rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="p-4 bg-gray-900 text-white">
      {/* Thumbnail */}
      <div className="flex justify-center mt-[40px]">
        {renderThumbnail(komikData?.thumbnail)}
      </div>

      {/* Komik Info */}
      {renderKomikInfo(komikData)}

      {/* Daftar Chapter */}
      <div className="bg-gray-800 p-4 rounded-lg mt-6 shadow-lg max-h-96 overflow-y-scroll">
        <h2 className="text-xl font-bold text-center mb-4">
          Daftar Chapter
        </h2>
        <div className="space-y-4">
          {renderChapters(chapters, id)}
        </div>
      </div>
    </div>
  );
};

export default ChapterList;
