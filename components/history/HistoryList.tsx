import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

const HistoryList: React.FC<HistoryListProps> = ({
  history,
  loading,
  onHistoryClick,
  onDeleteHistory,
}) => {
  return (
    <div className='mt-5 grid grid-cols-4 gap-2 sm:grid-cols-4 lg:grid-cols-5'>
      {loading ? (
        Array.from({ length: 12 }).map((_, index) => (
          <Card key={index}>
            <CardContent>
              <Skeleton className='h-40 w-full bg-gray-500' />
              <Skeleton className='mt-2 h-5 w-3/4 bg-gray-500' />
              <Skeleton className='mt-1 h-5 w-1/2 bg-gray-500' />
            </CardContent>
          </Card>
        ))
      ) : history.length === 0 ? (
        <Card className='col-span-full text-center'>
          <CardContent>No history found</CardContent>
        </Card>
      ) : (
        history.map((item) => (
          <Card
            key={item._id}
            className='relative flex flex-col justify-between'
          >
            {/* DropdownMenu di kiri atas */}
            <div className='absolute left-2 top-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='sm'>
                    <MoreHorizontal className='h-5 w-5' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Option</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() =>
                      onHistoryClick(item.title, Number(item.chapterId))
                    }
                  >
                    Open Chapter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteHistory(item._id)}>
                    Delete History
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Konten Card */}
            <CardContent className='flex-grow p-2'>
              <Image
                width={200}
                height={200}
                src={item.imageUrl || '/placeholder.jpg'}
                alt={item.title}
                className='h-full w-full rounded-lg object-cover'
              />
            </CardContent>

            {/* Title di bawah Card */}
            <div className='p-1'>
              <h2
                className='line-clamp-2 cursor-pointer text-center text-lg font-semibold hover:underline'
                onClick={() =>
                  onHistoryClick(item.title, Number(item.chapterId))
                }
              >
                {item.title}
              </h2>
              <p className='text-center text-sm text-gray-400'>
                Chapter {item.chapterId}
              </p>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default HistoryList;
