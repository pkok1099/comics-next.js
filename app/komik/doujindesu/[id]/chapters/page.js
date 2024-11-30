'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const ChapterList = () => {
  const { id } = useParams();
  const [chapters, setChapters] = useState([]);
  const [komikData, setKomikData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('judul');

  useEffect(() => {
    const fetchKomikData = async () => {
      try {
        const response = await fetch(`/api/komik/doujindesu/info/${decodeURIComponent(id)}`);
        const komik = await response.json();
        setKomikData(komik);
      } catch (error) {
        console.error('Error fetching komik data:', error);
      }
    };

    const fetchChapters = async () => {
      try {
        const response = await fetch(`/api/komik/doujindesu/${id}/chapters`);
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
      <div className="animate-pulse flex flex-col items-center space-y-6 mt-[40px]">
        <div className="bg-gray-700 rounded-md" style={{ width: '300px', aspectRatio: '3 / 4' }} />
        <div className="bg-gray-700 h-8 w-64 rounded-md mt-4" />
        <div className="bg-gray-700 p-4 rounded-lg mt-6 w-full max-w-md">
          <div className="space-y-4">
            <div className="bg-gray-700 h-6 w-full rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 text-white">
      {/* Thumbnail */}
      <div className="flex justify-center mt-[40px]">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg" style={{ width: '300px', height: `${(300 * 4) / 3}px` }}>
          {komikData?.thumbnail ? (
            <img src={komikData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover rounded-md" />
          ) : (
            <div className="bg-gray-700 text-gray-400 flex items-center justify-center h-full">
              Thumbnail tidak tersedia
            </div>
          )}
        </div>
      </div>

      {/* Informasi Komik */}
      <h1 className="mt-8 text-3xl font-bold text-center">{komikData?.title || 'Judul Tidak Tersedia'}</h1>
      <p className="text-gray-400 text-center mt-2">{komikData?.synopsis || 'Sinopsis tidak tersedia.'}</p>

      {/* Daftar Chapter */}
      <div className="bg-gray-800 p-4 rounded-lg mt-6 shadow-lg max-h-96 overflow-y-scroll">
        <h2 className="text-xl font-bold text-center mb-4">Daftar Chapter</h2>
        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-all">
              <h3 className="text-lg font-bold">{chapter.chapterTitle}</h3>
              <p className="text-sm text-gray-400">{chapter.chapterDate}</p>
              <Link
                href={`/komik/doujindesu/${id}/chapters/${chapter.chapterTitle.replace(/.*Chapter (\d+).*/, '$1')}`}
                className="block mt-2 text-blue-500 hover:underline"
              >
                Baca Chapter
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChapterList;
