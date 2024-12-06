'use client';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const SkeletonLoader = () => (
  <Card className='bg-gray-700 p-4'>
    <Skeleton className='mb-3 aspect-[3/4] w-full rounded-lg bg-gray-600' />
    <Skeleton className='mb-2 h-6 w-full bg-gray-600' />
    <Skeleton className='h-6 w-3/4 bg-gray-600' />
  </Card>
);
