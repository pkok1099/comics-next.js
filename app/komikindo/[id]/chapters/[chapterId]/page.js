'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import Image from 'next/image';
const ChapterDetail = () => {
  const { id, chapterId } = useParams(); // Get id and chapterId from URL
  const router = useRouter(); // For navigation
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapterList, setChapterList] = useState([]);
  const [pages, setPages] = useState([]); // Store loaded pages
  const [buttonVisible, setButtonVisible] = useState(true); // For next button visibility
  const [isFetching, setIsFetching] = useState(false); // For fetching state
  const [lastScrollY, setLastScrollY] = useState(0); // Menyimpan posisi scroll terakhir
  // Fetch images for the chapter
  const fetchChapterImages = useCallback(
    async (chapterId) => {
      try {
        const response = await fetch(
          `/api/komikindo/${decodeURIComponent(id)}/${chapterId}/`,
        );
        if (!response.ok) throw new Error('Failed to fetch images');

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
        const chapterImages = await fetchChapterImages(chapterId);
        setPages(chapterImages); // Set pages data
      } catch (err) {
        setError('Error loading chapter images');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    },
    [fetchChapterImages],
  ); // Menambahkan fetchChapterImages sebagai dependensi

  const saveHistory = async (chapterId, title) => {
    const response = await fetch('/api/history/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chapterId, title }),
    });

    const data = await response.json();
    if (response.ok) {
      // console.log('History saved:', data.message);
    } else {
      // console.error('Failed to save history:', data.message);
    }
  };

  const deleteHistory = async (historyId) => {
    try {
      const response = await fetch(`/api/history/delete?historyId=${historyId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        console.log('History deleted:', data.message);
        // You might want to update the UI or state here
      } else {
        console.error('Failed to delete history:', data.message);
      }
    } catch (error) {
      console.error('Error deleting history:', error);
    }
  };

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

    window.addEventListener('scroll', handleScroll);

    // Bersihkan event listener ketika komponen di-unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]); // Dependensi ke lastScrollY untuk mengecek pergerakan scroll

  // Fetch the list of chapters
  const fetchChapterList = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/komikindo/info/${decodeURIComponent(id)}`,
      );
      if (!response.ok) throw new Error('Failed to fetch chapters');

      const data = await response.json();
      setChapterList(data); // Set chapter list
    } catch (err) {
      setError(err.message); // Handle error
    }
  }, [id]); // Menambahkan id sebagai dependensi

  // Navigate to the next chapter
  const goToNextChapter = () => {
    router.push(
      `/komikindo/${decodeURIComponent(id)}/chapters/${parseInt(chapterId) + 1}`,
    );
  };

  useEffect(() => {
    if (chapterId) {
      loadChapterImages(chapterId);
      saveHistory(chapterId, id);
    }
  }, [id, chapterId, loadChapterImages]); // Menambahkan loadChapterImages

  useEffect(() => {
    fetchChapterList();
  }, [id, fetchChapterList]); // Menambahkan fetchChapterList

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
                `/komikindo/${decodeURIComponent(id)}/chapters/${parseInt(chapterId) - 1}`,
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

