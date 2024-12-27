'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchChapterImages, fetchChapterList, saveHistory } from '@/app/api';
import { Button } from '@/components/ui/button';
import { getChapterUrl } from '@/ChapterList/getChapterUrl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function ChapterDetail() {
  const { id, chapterId } = useParams() as { id: string; chapterId: string };
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chapterList, setChapterList] = useState<Chapter[]>([]);
  const [pages, setPages] = useState<string[]>([]);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const loadChapterImages = useCallback(
    async (chapterId: string) => {
      setLoading(true);
      setError(null);

      try {
        const chapterImages = await fetchChapterImages(id, chapterId);
        setPages(chapterImages);
      } catch {
        setError('Error loading chapter images');
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  const handleScroll = () => {
    const currentScroll = window.scrollY;
    const scrollDelta = currentScroll - lastScrollY;

    if (Math.abs(scrollDelta) > 5 && !isDropdownOpen) {
      setButtonVisible(scrollDelta < 0);
    }
    setLastScrollY(currentScroll);
  };

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

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, isDropdownOpen]);

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
  chapterId
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

interface PageProps {
  id: string;
  chapterId: string;
  goToNextChapter: () => void;
  setIsDropdownOpen: (open: boolean) => void;
  isDropdownOpen: boolean;
  chapterList: Chapter[];
  router: ReturnType<typeof useRouter>;
}

interface Chapter {
  title: string;
  url: string;
  lastUpdated: string;
}

const NavigationButtons: React.FC<PageProps> = ({
  id,
  chapterId,
  goToNextChapter,
  chapterList,
  setIsDropdownOpen,
  isDropdownOpen,
  router
}) => (
  <div className='fixed right-2 top-1/2 z-50 flex -translate-y-1/2 transform flex-col gap-4 sm:right-4 md:right-8'>
    <Button
      variant='ghost'
      onClick={() =>
        router.push(
          `/komikindo/${decodeURIComponent(id)}/${parseInt(chapterId) - 1}`
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='default'
            className='hover:rotate-360 flex h-10 w-6 transform items-center justify-center rounded-lg bg-gray-700 text-white opacity-75 shadow-lg transition-transform duration-500 hover:opacity-80 sm:h-12 sm:w-8 md:h-14 md:w-10'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className='rotate-360 text-xs [writing-mode:vertical-rl] sm:text-sm md:text-base lg:text-lg'>
              Ch
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='center'
          className='max-h-[300px] w-48 overflow-y-auto'
        >
          {chapterList.map((chapter) => (
            <DropdownMenuItem
              key={chapter.title}
              onClick={() => {
                router.push(
                  `/komikindo/${decodeURIComponent(id)}/${getChapterUrl(chapter)}`
                );
                setIsDropdownOpen(false);
              }}
            >
              {chapter.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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
