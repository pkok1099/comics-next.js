'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { HistoryItem } from '@/utils/global';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch('/api/history/gets');
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  const handleDelete = async (historyId: string) => {
    try {
      const response = await fetch(
        `/api/history/delete?historyId=${historyId}`,
        {
          method: 'DELETE',
        },
      );
      if (!response.ok) {
        throw new Error('Failed to delete history item');
      }
      setHistory(history.filter((item) => item._id !== historyId));
    } catch (err) {
      setError('Failed to delete history item');
    }
  };

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center text-red-500'>
        {error}
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-custom-pink mb-6 text-3xl font-bold'>
        Reading History
      </h1>
      {history.length === 0 ? (
        <p>No reading history found.</p>
      ) : (
        <div className='grid grid-cols-4 gap-4 lg:grid-cols-5'>
          {history.map((item) => (
            <div
              key={item._id}
              className='overflow-hidden rounded-lg bg-white shadow-md'
            >
              <div className='relative h-40 w-full bg-gray-700'>
                <Image
                  src={item.thumbnailUrl || '/placeholder.jpg'}
                  alt={item.title}
                  layout='fill'
                  objectFit='cover'
                  className='rounded-t-lg'
                />
              </div>
              <div className='bg-gray-700 p-2'>
                <h2 className='title text-custom-pink mb-1 line-clamp-2 text-sm font-medium'>
                  {item.title}
                </h2>
                <p className='truncate text-sm text-gray-400'>
                  Chapter: {item.chapterId}
                </p>
                <p className='truncate text-xs text-gray-300'>
                  {new Date(item.timestamp).toLocaleString()}
                </p>
                <div className='mt-2 flex items-center justify-between'>
                  <DropdownMenu>
                    <DropdownMenuTrigger className='text-custom-pink rounded border-2 border-gray-200 bg-gray-700 px-3 py-1 text-sm hover:bg-gray-700'>
                      Actions
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/komikindo/${encodeURIComponent(item.title)}/chapters/${item.chapterId}`,
                          )
                        }
                      >
                        Continue Reading
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(item._id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
