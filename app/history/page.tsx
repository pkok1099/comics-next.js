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
import HistorySkeleton from '@/components/HistorySkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

const ITEMS_PER_PAGE = 10;

interface HistoryResponse {
  items: HistoryItem[];
  total: number;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();

  const handleSortChange = (newSort: 'newest' | 'oldest') => {
    setLoading(true);
    setPage(1);
    setSortBy(newSort);
    setHistory([]); // Clear current history when sort changes
    setHasMore(true); // Reset hasMore when sort changes
    setTotalItems(0);
  };

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch(`/api/history/gets?page=${page}&sort=${sortBy}&limit=${ITEMS_PER_PAGE}`);
        if (!response.ok) throw new Error('Failed to fetch history');
        const data: HistoryResponse = await response.json();
        
        // Remove client-side sorting to prevent duplicates
        setTotalItems(data.total);
        setHasMore(page * ITEMS_PER_PAGE < data.total);
        setHistory(prev => page === 1 ? data.items : [...prev, ...data.items]);
      } catch {
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [page, sortBy]);

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
    } catch {
      setError('Failed to delete history item');
    }
  };

  if (loading && page === 1) return <HistorySkeleton />;

  if (error) {
    return (
      <div className='flex h-[50vh] items-center justify-center rounded-lg bg-gray-800 p-4'>
        <p className='text-red-500'>{error}</p>
        <button 
          onClick={() => { setError(null); setLoading(true); }}
          className='ml-4 rounded bg-custom-pink px-4 py-2'
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-custom-pink text-3xl font-bold'>History</h1>
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value as 'newest' | 'oldest')}
          className='rounded bg-gray-300 text-gray-700 font-semibold dark:text-gray-300 dark:bg-gray-700 px-3 py-2 border-1 border-gray-700'
          disabled={loading}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {history.length === 0 ? (
        <p>No reading history found.</p>
      ) : (
        <>
          <div className='grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5'>
            {history.map((item) => (
              <Card
                key={item._id}
                className="overflow-hidden p-0 "
              >
                <div className='relative h-40 w-full'>
                  <Image
                    src={item.thumbnailUrl || '/placeholder.jpg'}
                    alt={item.title}
                    layout='fill'
                    objectFit='cover'
                    className='rounded-t-lg'
                  />
                </div>
                <CardContent className='p-2'>
                  <h2 className='title mb-1 line-clamp-2 text-sm font-medium'>
                    {item.title}
                  </h2>
                  <p className='truncate text-sm dark:text-gray-800 text-gray-400'>
                    Chapter: {item.chapterId}
                  </p>
                  <p className='truncate text-xs'>
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </CardContent>
                <CardFooter className='p-2 pt-0'>
                  <DropdownMenu>
                    <DropdownMenuTrigger className='border-1 border-gray-700 dark:border-gray-200  rounded border-2  px-3 py-1 text-sm '>
                      Actions
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                      className='dark:bg-gray-700 dark:text-gray-300 bg-gray-300 text-gray-700'
                        onClick={() =>
                          router.push(
                            `/komikindo/${encodeURIComponent(item.title)}/chapters/${item.chapterId}`,
                          )
                        }
                      >
                        Continue Reading
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                      className='dark:bg-gray-700 dark:text-gray-300 bg-gray-300 text-gray-700'
                      onClick={() => handleDelete(item._id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {loading && page > 1 && (
            <div className="mt-4 flex items-center justify-center">
              <Skeleton className="h-8 w-32" />
            </div>
          )}
          
          {!loading && hasMore && (
            <button
              onClick={() => setPage(p => p + 1)}
              className='mt-8 w-full rounded bg-gray-300 hover:bg-gray-300 text-gray-800 dark:text-gray-300 dark:bg-gray-700 py-2 dark:hover:bg-gray-600'
            >
              Load More ({totalItems - history.length} items remaining)
            </button>
          )}
        </>
      )}
    </div>
  );
}
