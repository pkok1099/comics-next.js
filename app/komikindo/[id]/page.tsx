'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
// import Image from 'next/image';

import { Card } from '@/components/ui/card';
import { TabsComponent } from '@/ChapterList/TabsComponent';
import { ChapterListComponent } from '@/ChapterList/ChapterListComponent';
import { InfoBox } from '@/ChapterList/InfoBox';
import { SkeletonLoader } from '@/ChapterList/SkeletonLoader';
import { fetchKomikData as fetchKomikDataFromApi } from '@/app/api';
import { KomikData } from '@/types/komik';

// Utility function to fetch Komik data
const fetchKomikDataFromComponent = async (
  id: string,
  setKomikData: React.Dispatch<React.SetStateAction<KomikData | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    const komik = await fetchKomikDataFromApi(id); // await response.json();
    setKomikData(komik);
  } catch (error) {
    console.error('Error fetching komik data:', error);
  } finally {
    setLoading(false);
  }
};

const ChapterList: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const [komikData, setKomikData] = useState<KomikData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('judul');

  useEffect(() => {
    if (id) {
      fetchKomikDataFromComponent(id, setKomikData, setLoading);
    }
  }, [id]);

  if (loading || !komikData) return <SkeletonLoader />;

  return (
    <div className='min-h-screen bg-gray-900 p-4 text-white'>
      <div className='mt-[40px] flex h-full items-center justify-center bg-gray-900'>
        <Card className='h-[400px] w-[300px] flex-shrink-0'>
          {komikData?.thumbnail ? (
            <img
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
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        komikData={komikData}
      />
      <ChapterListComponent chapters={komikData.chapterList || []} id={id} />
    </div>
  );
};

export default ChapterList;
