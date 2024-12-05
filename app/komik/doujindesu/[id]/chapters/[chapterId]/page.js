'use client';

import React, {
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  useParams,
  useRouter,
} from 'next/navigation';
import Image from 'next/image';
const ChapterDetail = () => {
  const { id, chapterId } = useParams(); // Get id and chapterId from URL
  const router = useRouter(); // For navigation
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapterList, setChapterList] = useState(
    [],
  );
  const [pages, setPages] = useState([]); // Store loaded pages
  const [buttonVisible, setButtonVisible] =
    useState(true); // For next button visibility
  const [isFetching, setIsFetching] =
    useState(false); // For fetching state
  const [lastScrollY, setLastScrollY] =
    useState(0); // Menyimpan posisi scroll terakhir

  // Fetch images for the chapter
  const fetchChapterImages = useCallback(
    async (chapterId) => {
      try {
        const response = await fetch(
          `/api/komik/doujindesu/${decodeURIComponent(id)}/chapter/${chapterId}/images`,
        );
        if (!response.ok)
          throw new Error(
            'Failed to fetch images',
          );

        const data = await response.json();
        return data; // Return image data
      } catch (err) {
        setError(err.message); // Handle error
        return [];
      }
    },
    [id],
  ); // Menambahkan id sebagai dependensi

  const loadChapterImages = useCallback(
    async (chapterId) => {
      setLoading(true);
      setError(null); // Reset error

      try {
        // Fetch images for the current chapter
        const chapterImages =
          await fetchChapterImages(chapterId);
        setPages(chapterImages); // Set pages data
      } catch (err) {
        setError('Error loading chapter images');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    },
    [fetchChapterImages],
  ); // Menambahkan fetchChapterImages sebagai dependensi

  // Handle scroll to hide/show the next button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // Jika scroll ke bawah
        setButtonVisible(false);
      } else {
        // Jika scroll ke atas
        setButtonVisible(true);
      }
      setLastScrollY(window.scrollY); // Update posisi scroll terakhir
    };

    window.addEventListener(
      'scroll',
      handleScroll,
    );

    // Bersihkan event listener ketika komponen di-unmount
    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll,
      );
    };
  }, [lastScrollY]); // Dependensi ke lastScrollY untuk mengecek pergerakan scroll

  // Fetch the list of chapters
  const fetchChapterList =
    useCallback(async () => {
      try {
        const response = await fetch(
          `/api/komik/doujindesu/info${decodeURIComponent(id)}/`,
        );
        if (!response.ok)
          throw new Error(
            'Failed to fetch chapters',
          );

        const data = await response.json();
        setChapterList(data?.chapters); // Set chapter list
        console.log(data);
      } catch (err) {
        setError(err.message); // Handle error
      }
    }, [id]); // Menambahkan id sebagai dependensi

  // Navigate to the next chapter
  const goToNextChapter = () => {
    router.push(
      `/komik/doujindesu/${decodeURIComponent(id)}/chapters/${parseInt(chapterId) + 1}`,
    );
  };

  // useEffect(() => {
  // if (chapterId) {
  // loadChapterImages(chapterId);
  // }
  // }, [id, chapterId]);

  useEffect(() => {
    if (chapterId) {
      loadChapterImages(chapterId);
    }
  }, [id, chapterId, loadChapterImages]); // Menambahkan loadChapterImages

  useEffect(() => {
    fetchChapterList();
  }, [id, fetchChapterList]); // Menambahkan fetchChapterList

  console.log(id, chapterId);
  // Fetch chapter list once when the component mounts
  // useEffect(() => {
  // fetchChapterList();
  // }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500">
          {' '}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="chapter-container relative">
      <h2 className="text-center font-bold text-2xl py-4 truncate ">
        {id && chapterId
          ? `${id} - Chapter ${chapterId}`
          : 'Chapter Not Found'}
      </h2>

      {/* Chapter images */}
      <div className="chapter-images flex flex-col items-center">
        {pages.length === 0 ? (
          <p>
            No images available for this chapter.
          </p>
        ) : (
          pages.map((img, imgIndex) => (
            <Image
              key={imgIndex}
              src={img}
              alt={`Page ${imgIndex + 1} of Chapter ${chapterId}`}
              width={500} // Tentukan ukuran yang sesuai
              height={800} // Tentukan ukuran yang sesuai
              className="chapter-image w-full"
            />
          ))
        )}
      </div>

      {/* Navigation buttons */}
      {buttonVisible && (
        <div className="fixed right-2 sm:right-4 md:right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-50">
          <button
            onClick={() =>
              router.push(
                `/komik/doujindesu/${decodeURIComponent(id)}/chapters/${parseInt(chapterId) - 1}`,
              )
            }
            className={`opacity-75 w-6 h-10 sm:w-8 sm:h-12 md:w-10 md:h-14 rounded-lg bg-gray-700 text-white flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:rotate-360 hover:opacity-80 ${isFetching ? 'hidden' : ''}`}
          >
            <span className="[writing-mode:vertical-rl] rotate-360 text-xs sm:text-sm md:text-base lg:text-lg">
              Prev
            </span>
          </button>
          <button
            onClick={goToNextChapter}
            className={`opacity-75 h-10 sm:h-12 md:h-14 rounded-lg bg-gray-700 text-white flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:rotate-360 hover:opacity-80 ${isFetching ? 'hidden' : ''}`}
          >
            <span className="[writing-mode:vertical-rl] rotate-360 text-xs sm:text-sm md:text-base lg:text-lg">
              Next
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChapterDetail;
