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
>>>>>>> d3c4434 (Save changes before pulling)
    );
  };

  useEffect(() => {
    if (chapterId) {
      loadChapterImages(chapterId);
      saveHistory(chapterId, id);
    }
<<<<<<< HEAD
  }, [id, chapterId, loadChapterImages]); // Menambahkan loadChapterImages

  useEffect(() => {
    fetchChapterList();
  }, [id, fetchChapterList]); // Menambahkan fetchChapterList
=======
  }, [id, chapterId, loadChapterImages]);

  useEffect(() => {
    fetchChapterList(id).then((data) => setChapterList(data.chapterList));
  }, [id]);
>>>>>>> d3c4434 (Save changes before pulling)

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
<<<<<<< HEAD
  return (
    <div className='chapter-container relative'>
      <h2 className='line-clamp-2 truncate py-4 text-center text-2xl font-bold'>
        {id && chapterId ? `${id} - Chapter ${chapterId}` : 'Chapter Not Found'}
      </h2>

      {/* Chapter images */}
      <div className='chapter-images flex flex-col items-center'>
        {pages.length === 0 ? (
          <p>No images available for this chapter.</p>
        ) : (
          pages.map((img, imgIndex) => (
            <img
              key={imgIndex}
              src={img}
              alt={`Page ${imgIndex + 1} of Chapter ${chapterId}`}
              width={500} // Tentukan ukuran yang sesuai
              height={800} // Tentukan ukuran yang sesuai
              className='chapter-image w-full'
            />
          ))
        )}
      </div>

      {/* Navigation buttons */}
      {buttonVisible && (
        <div className='fixed right-2 top-1/2 z-50 flex -translate-y-1/2 transform flex-col gap-4 sm:right-4 md:right-8'>
          <button
            onClick={() =>
              router.push(
                `/komikindo/${decodeURIComponent(id)}/${parseInt(chapterId) - 1}`,
              )
            }
            className={`hover:rotate-360 flex h-10 w-6 transform items-center justify-center rounded-lg bg-gray-700 text-white opacity-75 shadow-lg transition-transform duration-500 hover:opacity-80 sm:h-12 sm:w-8 md:h-14 md:w-10 ${isFetching ? 'hidden' : ''}`}
          >
            <span className='rotate-360 text-xs [writing-mode:vertical-rl] sm:text-sm md:text-base lg:text-lg'>
              Prev
            </span>
          </button>
          <button
            onClick={goToNextChapter}
            className={`hover:rotate-360 flex h-10 transform items-center justify-center rounded-lg bg-gray-700 text-white opacity-75 shadow-lg transition-transform duration-500 hover:opacity-80 sm:h-12 md:h-14 ${isFetching ? 'hidden' : ''}`}
          >
            <span className='rotate-360 text-xs [writing-mode:vertical-rl] sm:text-sm md:text-base lg:text-lg'>
              Next
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChapterDetail;
=======

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
>>>>>>> d3c4434 (Save changes before pulling)
