'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-indigo-200'>
      <h2 className='mb-4 text-2xl font-bold text-gray-700'>
        Something went wrong!
      </h2>
      <Button onClick={() => reset()} className='bg-gray-700 text-indigo-600'>
        Try again
      </Button>
    </div>
  );
}
