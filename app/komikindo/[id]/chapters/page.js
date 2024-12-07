'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

import { Card } from '@/components/ui/card';
import { TabsComponent } from '@/ChapterList/TabsComponent';
import { ChapterListComponent } from '@/ChapterList/ChapterListComponent';
import { InfoBox } from '@/ChapterList/InfoBox';
import { SkeletonLoader } from '@/ChapterList/SkeletonLoader';
import { getChapterUrl } from '@/ChapterList/getChapterUrl';

// Utility function to fetch Komik data
const fetchKomikData = async (id, setKomikData) => {
  try {
    const response = await fetch(
      `/api/komikindo/info/${decodeURIComponent(id)}`,
    );
    const komik = await response.json();
    setKomikData(komik);
  } catch (error) {
    console.error('Error fetching komik data:', error);
  }
};

// Utility function to fetch chapters
const fetchChapters = async (id, setChapters, setLoading) => {
  try {
    const response = await fetch(`/api/komikindo/${id}/chapters`);
    const data = await response.json();
    setChapters(data);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    setLoading(false);
  }
};

const ChapterList = () => {
  const { id } = useParams();
  const [chapters, setChapters] = useState([]);
  const [komikData, setKomikData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('judul');

  useEffect(() => {
    if (id) {
      fetchKomikData(id, setKomikData);
      fetchChapters(id, setChapters, setLoading);
    }
  }, [id]);

  if (loading) return <SkeletonLoader />;

  const lastChapterUrl = chapters[0] ? getChapterUrl(chapters[0]) : null;
  const chapter1Url = chapters[chapters.length - 1]
    ? getChapterUrl(chapters[chapters.length - 1])
    : null;

  return (
    <div className='min-h-screen bg-gray-900 p-4 text-white'>
      <div className='mt-[40px] flex h-full items-center justify-center bg-gray-900'>
        <Card className='h-[400px] w-[300px] flex-shrink-0'>
          {komikData?.thumbnail ? (
            <Image
              src={komikData.thumbnail}
              alt='Thumbnail'
              width={300}
              height={400}
              className='aspect-[3/4] w-full rounded-lg bg-gray-600'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center rounded-md bg-gray-700 text-gray-400'>
              Thumbnail tidak tersedia
            </div>
          )}
        </Card>
      </div>

      <h1 className='mb-4 mt-8 text-center text-3xl font-bold'>
        {komikData?.title || 'Judul Komik Tidak Tersedia'}
      </h1>

      <InfoBox komikData={komikData} />
      <TabsComponent
        komikData={komikData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <ChapterListComponent chapters={chapters} id={id} />
    </div>
  );
};

export default ChapterList;
