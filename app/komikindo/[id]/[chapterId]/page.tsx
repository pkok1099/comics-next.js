'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchChapterList, saveHistory } from '@/app/api';
import { ChapterImages } from './components/ChapterImages';
import { NavigationButtons } from './components/NavigationButtons';
import { useChapterImages } from './hooks/useChapterImages';
import useScrollVisibility from './hooks/useScrollVisibility';

interface Chapter {
  title: string;
  url: string;
  lastUpdated: string;
}

export default function ChapterDetail() {
  const { id, chapterId } = useParams() as { id: string; chapterId: string };
  const router = useRouter();
  const [chapterList, setChapterList] = useState<Chapter[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { loading, error, pages, loadChapterImages } = useChapterImages(id);
  const { buttonVisible } = useScrollVisibility(isDropdownOpen);

  const goToNextChapter = () => {
    router.push(
      `/komikindo/${decodeURIComponent(id)}/${parseInt(chapterId) + 1}`
    );
  };

  useEffect(() => {
    if (chapterId) {
      loadChapterImages(chapterId);
      saveHistory(chapterId, id);
    }
  }, [id, chapterId, loadChapterImages]);

  useEffect(() => {
    fetchChapterList(id).then((data) => setChapterList(data.chapterList));
  }, [id]);

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500'>
          {' '}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-screen flex-col items-center justify-center'>
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className='chapter-container relative'>
      <h2 className='mx-4 break-words py-2 text-center text-xl font-bold sm:text-2xl'>
        {id && chapterId ? `${id} - Chapter ${chapterId}` : 'Chapter Not Found'}
      </h2>

      <ChapterImages pages={pages} chapterId={chapterId} />

      {buttonVisible && (
        <NavigationButtons
          id={id}
          chapterId={chapterId}
          goToNextChapter={goToNextChapter}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          chapterList={chapterList}
          router={router}
        />
      )}
    </div>
  );
}
