'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Import useParams dari next/navigation
import Link from 'next/link';

const ChapterList = () => {
  const { id } = useParams(); // Ambil parameter id menggunakan useParams()
  const [chapters, setChapters] = useState([]);
  const [komikData, setKomikData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('judul');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const fetchKomikData = async () => {
      try {
        const response = await fetch(`/api/komik/komikindo/info/${decodeURIComponent(id)}`);
        const komik = await response.json();
        setKomikData(komik);
      } catch (error) {
        console.error('Error fetching komik data:', error);
      }
    };

    const fetchChapters = async () => {
      try {
        const response = await fetch(`/api/komik/komikindo/${id}/chapters`);
        const data = await response.json();
        setChapters(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chapters:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchKomikData();
      fetchChapters();
    }
  }, [id]);

  if (loading) {
    return (
      // Skeleton dengan proporsi yang diperbaiki
      <div className="animate-pulse flex flex-col items-center space-y-6 mt-[40px]">
        <div
          className="bg-gray-700 rounded-md"
          style={{
            width: '300px', // Lebar kontainer tetap
            aspectRatio: '3 / 4', // Rasio 3:4 untuk thumbnail
          }}
        />
        <div className="bg-gray-700 h-8 w-64 rounded-md mt-4" />
        <div className="flex space-x-4 mt-4">
          <div className="bg-gray-700 h-10 w-24 rounded-full" />
          <div className="bg-gray-700 h-10 w-24 rounded-full" />
          <div className="bg-gray-700 h-10 w-24 rounded-full" />
        </div>
        <div className="bg-gray-700 h-6 w-64 rounded-md mt-4" />
        <div className="bg-gray-700 p-4 rounded-lg mt-6 w-full max-w-md">
          <div className="space-y-4">
            <div className="bg-gray-700 h-6 w-full rounded-md" />
            <div className="bg-gray-700 h-6 w-full rounded-md" />
            <div className="bg-gray-700 h-6 w-full rounded-md" />
            <div className="bg-gray-700 h-6 w-full rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  const getChapterUrl = (chapter) => {
    const regex = /chapter-(\d+)/;
    const match = chapter.url.match(regex);
    return match ? match[1] : 'unknown';
  };

  const lastChapterUrl = chapters[0] ? getChapterUrl(chapters[0]) : null;
  const chapter1Url = chapters[chapters.length - 1] ? getChapterUrl(chapters[chapters.length - 1]) : null;

  return (
    <div className="p-4 bg-gray-900 text-white">
      {/* Thumbnail Komik */}
      {/* Card Thumbnail */}

      <div className="flex justify-center items-center h-full bg-gray-900 mt-[40px]">
        <div
          className="flex justify-center items-center p-4 bg-gray-800 rounded-lg shadow-lg"
          style={{
            width: '300px', // Lebar kontainer tetap
            height: `${(300 * 4) / 3}px`, // Tinggi dihitung dengan rasio 3:4
          }}
        >
          {komikData?.thumbnail ? (
            <div className="w-full h-full flex justify-center items-center rounded-lg overflow-hidden">
              <img
                src={komikData.thumbnail}
                alt="Thumbnail"
                width={300}
                height={400}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center bg-gray-700 text-gray-400 rounded-md">
              Thumbnail tidak tersedia
            </div>
          )}
        </div>
      </div>

      {/* Judul */}
      <h1 className="mt-8 text-3xl font-bold text-center mb-4">{komikData?.title || 'Judul Komik Tidak Tersedia'}</h1>

      {/* Tombol Tab */}
      <div className="text-center mb-4">
        <button
          onClick={() => setActiveTab('judul')}
          className={`px-6 py-2 rounded-full mr-2 ${activeTab === 'judul' ? 'bg-blue-500' : 'bg-transparent border-2 border-blue-500'}`}
        >
          Judul
        </button>
        <button
          onClick={() => setActiveTab('sinopsis')}
          className={`px-6 py-2 rounded-full mr-2 ${activeTab === 'sinopsis' ? 'bg-blue-500' : 'bg-transparent border-2 border-blue-500'}`}
        >
          Sinopsis
        </button>
        <button
          onClick={() => setActiveTab('spoiler')}
          className={`px-6 py-2 rounded-full ${activeTab === 'spoiler' ? 'bg-blue-500' : 'bg-transparent border-2 border-blue-500'}`}
        >
          Spoiler
        </button>
      </div>

      {/* Konten Tab */}
      <div className="text-center mb-4 text-gray-300">
        {activeTab === 'judul' && <h2 className="text-xl font-bold">{komikData?.title}</h2>}
        {activeTab === 'sinopsis' && <p className="italic">{komikData?.synopsis || 'Sinopsis tidak ditemukan.'}</p>}
        {activeTab === 'spoiler' && komikData?.spoilerImages && (
          <div className="flex flex-wrap justify-center">
            {komikData.spoilerImages.map((img, index) => (
              <img
                key={index}
                src={img}
                width={300}
                height={400}
                alt={`spoiler ${index}`}
                className="w-64 h-64 m-2 rounded-lg"
              />
            ))}
          </div>
        )}
      </div>

      {/* Tombol untuk Chapter 1 dan Chapter Terakhir */}
      <div className="mt-4 text-center">
        <div className="flex justify-between items-center mb-2">
          <Link
            href={`/komik/komikindo/${id}/chapters/${chapter1Url}`}
            className="bg-gray-800 px-6 py-3 rounded-lg text-gray-400 text-left w-1/2 mr-2 hover:bg-gray-700"
          >
            Chapter 1
          </Link>
          <Link
            href={`/komik/komikindo/${id}/chapters/${lastChapterUrl}`}
            className="bg-gray-800 px-6 py-3 rounded-lg text-gray-400 text-right w-1/2 ml-2 hover:bg-gray-700"
          >
            Chapter {chapters.length}
          </Link>
        </div>
      </div>

      {/* Daftar Chapter dalam Scrollable Box */}
      <div className="bg-gray-800 p-4 rounded-lg mt-4 shadow-lg max-h-96 overflow-y-scroll transition-all duration-300">
        <h2 className="text-xl font-bold text-center mb-4">Daftar Chapter</h2>
        <div className="space-y-4">
          {chapters.map((chapter, index) => {
            const chapterNumber = getChapterUrl(chapter);

            return (
              <div key={index} className="transition-all duration-300 hover:bg-gray-700 p-4 rounded-lg chapter-item">
                <h3 className="text-lg font-bold">{chapter.title}</h3>
                <p className="text-sm text-gray-400">Last Updated: {chapter.lastUpdated}</p>

                {/* Tombol Baca Chapter */}
                {/* Tombol Baca Chapter dengan Border */}
                <Link href={`/komik/komikindo/${id}/chapters/${chapterNumber}`} className="inline-block mt-2">
                  <button className="border-2 border-blue-600 hover:border-blue-700 text-blue-600 hover:text-blue-700 py-2 px-4 rounded-lg w-full transition duration-200 ease-in-out transform hover:scale-105">
                    Baca Chapter
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChapterList;
