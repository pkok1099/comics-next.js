'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchChapterImages, fetchChapterList, saveHistory } from '@/app/api';
import { Button } from '@/components/ui/button';
// import Image from 'next/image';

export default function ChapterDetail() {
  const { id, chapterId } = useParams() as { id: string; chapterId: string };
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chapterList, setChapterList] = useState([]);
  const [pages, setPages] = useState<string[]>([]);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const loadChapterImages = useCallback(
    async (chapterId: string) => {
      setLoading(true);
      setError(null);

      try {
        const chapterImages = await fetchChapterImages(id, chapterId);
        setPages(chapterImages);
      } catch (err) {
        setError('Error loading chapter images');
      } finally {
        setLoading(false);
      }
    },
    [id],
  );

  const handleScroll = () => {
    const currentScroll = window.scrollY;
    const scrollDelta = currentScroll - lastScrollY;

    if (Math.abs(scrollDelta) > 5) {
      setButtonVisible(scrollDelta < 0);
    }
    setLastScrollY(currentScroll);
  };

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (touchStart === null) return;

    const touchDelta = touchStart - e.touches[0].clientY;
    if (Math.abs(touchDelta) > 5) {
      setButtonVisible(touchDelta < 0);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const goToNextChapter = () => {
    router.push(
      `/komikindo/${decodeURIComponent(id)}/${parseInt(chapterId) + 1}`,
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

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [lastScrollY, touchStart]);

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
      <h2 className='line-clamp-2 truncate py-4 text-center text-2xl font-bold'>
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

const ChapterImages = ({
  pages,
  chapterId,
}: {
  pages: string[];
  chapterId: string;
}) => (
  <div className='chapter-images flex flex-col items-center'>
    {pages.length === 0 ? (
      <p>No images available for this chapter.</p>
    ) : (
      pages.map((img, imgIndex) => (
        <img
          key={imgIndex}
          src={img}
          alt={`Page ${imgIndex + 1} of Chapter ${chapterId}`}
          width={500}
          height={800}
          className='chapter-image w-full'
        />
      ))
    )}
  </div>
);

const NavigationButtons = ({
  id,
  chapterId,
  goToNextChapter,
  isDropdownOpen,
  setIsDropdownOpen,
  chapterList,
  router,
}: {
  id: string;
  chapterId: string;
  goToNextChapter: () => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  chapterList: any[];
  router: any;
}) => (
  <div className='fixed right-2 top-1/2 z-50 flex -translate-y-1/2 transform flex-col gap-4 sm:right-4 md:right-8'>
    <Button
      variant='ghost'
      onClick={() =>
        router.push(
          `/komikindo/${decodeURIComponent(id)}/${parseInt(chapterId) - 1}`,
        )
      }
      size='default'
      className='hover:rotate-360 flex h-10 w-6 transform items-center justify-center rounded-lg bg-gray-700 text-white opacity-75 shadow-lg transition-transform duration-500 hover:opacity-80 sm:h-12 sm:w-8 md:h-14 md:w-10'
    >
      <span className='rotate-360 text-xs [writing-mode:vertical-rl] sm:text-sm md:text-base lg:text-lg'>
        Prev
      </span>
    </Button>

    <div className='relative'>
      <Button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        variant='ghost'
        size='default'
        className='hover:rotate-360 flex h-10 w-6 transform items-center justify-center rounded-lg bg-gray-700 text-white opacity-75 shadow-lg transition-transform duration-500 hover:opacity-80 sm:h-12 sm:w-8 md:h-14 md:w-10'
      >
        <span className='rotate-360 text-xs [writing-mode:vertical-rl] sm:text-sm md:text-base lg:text-lg'>
          Ch
        </span>
      </Button>

      {isDropdownOpen && (
        <div
          className='absolute right-full top-0 mr-2 max-h-96 w-48 overflow-y-auto rounded-lg bg-gray-800 py-2 shadow-lg'
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {chapterList.map((chapter: any) => (
            <Button
              key={chapter.title}
              onClick={() => {
                router.push(
                  `/komikindo/${decodeURIComponent(id)}/${chapter.url}`,
                );
                setIsDropdownOpen(false);
              }}
              variant='ghost'
              size='default'
              className='hover:rotate-360 flex h-10 w-6 transform items-center justify-center rounded-lg bg-gray-700 text-white opacity-75 shadow-lg transition-transform duration-500 hover:opacity-80 sm:h-12 sm:w-8 md:h-14 md:w-10'
            >
              {chapter.title}
            </Button>
          ))}
        </div>
      )}
    </div>

    <Button
      onClick={goToNextChapter}
      variant='ghost'
      size='default'
      className='hover:rotate-360 flex h-10 w-6 transform items-center justify-center rounded-lg bg-gray-700 text-white opacity-75 shadow-lg transition-transform duration-500 hover:opacity-80 sm:h-12 sm:w-8 md:h-14 md:w-10'
    >
      <span className='rotate-360 text-xs [writing-mode:vertical-rl] sm:text-sm md:text-base lg:text-lg'>
        Next
      </span>
    </Button>
  </div>
);
