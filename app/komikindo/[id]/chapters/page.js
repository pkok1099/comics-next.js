'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FaStar, FaUser, FaPen, FaBook, FaGamepad } from 'react-icons/fa'; // Importing icons

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

// Utility function to extract chapter URL
const getChapterUrl = (chapter) => {
  const regex = /chapter-(\d+)/;
  const match = chapter.url.match(regex);
  return match ? match[1] : 'unknown';
};

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className='mt-[40px] flex animate-pulse flex-col items-center space-y-6'>
    <Skeleton className='h-[400px] w-[300px]' />
    <Skeleton className='h-8 w-64' />
    <div className='mt-4 flex space-x-4'>
      <Skeleton className='h-10 w-24 rounded-full' />
      <Skeleton className='h-10 w-24 rounded-full' />
      <Skeleton className='h-10 w-24 rounded-full' />
    </div>
    <Skeleton className='h-6 w-64' />
    <div className='mt-6 w-full max-w-md'>
      <Skeleton className='h-6 w-full rounded' />
      <Skeleton className='h-6 w-full rounded' />
      <Skeleton className='h-6 w-full rounded' />
      <Skeleton className='h-6 w-full rounded' />
    </div>
  </div>
);

// InfoBox Component
const InfoBox = ({ komikData }) => (
  <div className='mb-6 flex items-center justify-center space-y-4'>
    <div className='grid grid-cols-3 gap-3'>
      <div className='flex items-center space-x-2'>
        <FaBook className='text-2xl' />
        <span className="text-lg">{komikData?.type || 'Manga'}</span>
      </div>
      <div className='flex items-center space-x-2'>
        <FaStar className='text-2xl' />
        <span className="text-lg">{komikData?.rating || 'Rating tidak tersedia'}</span>
      </div>
      <div className='flex items-center space-x-2'>
        <FaUser className='text-2xl' />
        <span className="text-lg">{komikData?.author || 'Penulis tidak tersedia'}</span>
      </div>
      <div className='flex items-center space-x-2'>
        <FaPen className='text-2xl' />
        <span className="text-lg">{komikData?.illustrator || 'Ilustrator tidak tersedia'}</span>
      </div>
      <div className='flex items-center space-x-2'>
        <FaBook className='text-2xl' />
        <span className="text-lg">{komikData?.status || 'Status tidak tersedia'}</span>
      </div>
      <div className='flex items-center space-x-2'>
        <FaGamepad className='text-2xl' />
        <span className="text-lg">{komikData?.graphics || 'Graphics tidak tersedia'}</span>
      </div>
      <div className='flex items-center space-x-2'>
        <FaGamepad className='text-2xl' />
        <span className="text-lg">{komikData?.theme?.join(', ') || 'Tema tidak tersedia'}</span>
      </div>
    </div>
  </div>
);

// Chapter List Component
const ChapterListComponent = ({ chapters, id }) => (
  <Collapsible className='mt-8'>
    <CollapsibleTrigger className='flex cursor-pointer items-center justify-between rounded-md bg-gray-800 px-6 py-2'>
      <span className='text-lg font-bold text-gray-300'>Daftar Chapters</span>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <ScrollArea className='h-[300px] w-full overflow-y-scroll'>
        {chapters.length > 0 ? (
          chapters.map((chapter, index) => (
            <div
              key={chapter.title}
              className='mt-2 flex items-center justify-between border-b border-gray-600 p-4'
            >
              <div className='flex flex-col'>
                <span className='font-semibold'>{chapter.title}</span>
                <span className='text-sm text-gray-400'>
                  {chapter.lastUpdated}
                </span>
              </div>
              <Link
                href={`/komikindo/${id}/chapters/${getChapterUrl(chapter)}`}
                className='ml-2 inline-block rounded-lg bg-gray-800 px-6 py-3 text-gray-400 hover:bg-gray-700'
              >
                Baca Chapter
              </Link>
            </div>
          ))
        ) : (
          <p className='text-center text-gray-400'>No chapters available</p>
        )}
      </ScrollArea>
    </CollapsibleContent>
  </Collapsible>
);


const TabsComponent = ({ komikData, activeTab, setActiveTab }) => {
  return (
    <Tabs
      defaultValue={activeTab}
      className='mb-4 text-center'
      onValueChange={(value) => setActiveTab(value)}
    >
      <TabsList className='h-18 rounded-full border-blue-500 bg-gray-700'>
        <TabsTrigger
          className='h-18 ml-2 mr-2 rounded-full px-6 py-2'
          value='judul'
        >
          alternative
        </TabsTrigger>
        <TabsTrigger
          className='h-18 ml-2 mr-2 rounded-full px-6 py-2'
          value='sinopsis'
        >
          Sinopsis
        </TabsTrigger>
        <TabsTrigger
          className='h-18 ml-2 mr-2 rounded-full px-6 py-2'
          value='spoiler'
        >
          Spoiler
        </TabsTrigger>
      </TabsList>
      <TabsContent value='judul'>
        <div className='text-xl font-bold'>
          {komikData?.alternativeTitles?.length > 0 ? (
            komikData.alternativeTitles.map((title, index) => (
              <span key={index}>{title}</span>
            ))
          ) : (
            'Alternative Titles tidak ditemukan.'
          )}
        </div>
      </TabsContent>
      <TabsContent value='sinopsis'>
        <div className='max-w-4xl text-justify'>{komikData?.synopsis || "kosong"}</div>
      </TabsContent>
        <TabsContent value='spoiler'>
          {komikData?.spoilerImages && (
            <div className='flex flex-wrap justify-center'>
              {komikData.spoilerImages.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  width={300}
                  height={400}
                  alt={`spoiler ${index}`}
                  className='m-2 h-64 w-64 rounded-lg'
                />
              ))}
            </div>
          )}
        </TabsContent>
    </Tabs>
  );
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
