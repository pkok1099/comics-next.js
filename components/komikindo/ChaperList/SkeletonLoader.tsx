'use client';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-900 p-4 text-white'>
      {/* Skeleton untuk Thumbnail */}
      <div className='mt-[40px] flex h-full items-center justify-center bg-gray-900'>
        <Skeleton className='h-[400px] w-[300px] rounded-lg' />
      </div>

      {/* Skeleton untuk Judul */}
      <div className='mb-4 mt-8 text-center'>
        <Skeleton className='mx-auto h-8 w-3/4 rounded-md' />
      </div>

      {/* Skeleton untuk InfoBox */}
      <div className='mb-6 ml-6 space-y-4'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className='flex items-center space-x-2'>
            <Skeleton className='h-6 w-6 rounded-full' />
            <Skeleton className='h-5 w-3/4' />
          </div>
        ))}
      </div>

      {/* Skeleton untuk Tabs */}
      <div className='mb-4 text-center'>
        <div className='flex justify-center space-x-2'>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className='h-10 w-[100px] rounded-full bg-gray-700'
            />
          ))}
        </div>
      </div>

      {/* Skeleton untuk Chapter List */}
      <div className='mt-8'>
        <Skeleton className='mx-auto mb-4 h-6 w-1/2 rounded-md' />
        <div className='h-[300px] w-full overflow-y-scroll'>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className='mt-2 flex items-center justify-between border-b border-gray-600 p-4'
            >
              <div className='flex flex-col space-y-2'>
                <Skeleton className='h-5 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
              </div>
              <Skeleton className='h-8 w-[100px] rounded-lg' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
