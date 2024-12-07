'use client';
import { Skeleton } from '@/components/ui/skeleton';

// Skeleton Loader Component
export const SkeletonLoader = () => (
  <div className='mt-[40px] flex animate-pulse flex-col items-center space-y-6'>
    <Skeleton className='h-[400px] w-[300px]' />
    <Skeleton className='h-8 w-64' />
    <div className='mt-4 flex space-x-4'>
      <Skeleton className='h-10 w-24 rounded-full' />
      <Skeleton className='h-10 w-24 rounded-full' />
      <Skeleton className='h-10 w-24 rounded-full' />
    </div>
    <Skeleton className='h-6 w-64' />
    <div className='mt-6 w-full max-w-md'>
      <Skeleton className='h-6 w-full rounded' />
      <Skeleton className='h-6 w-full rounded' />
      <Skeleton className='h-6 w-full rounded' />
      <Skeleton className='h-6 w-full rounded' />
    </div>
  </div>
);
