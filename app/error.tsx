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
    <div className='bg-custom-pink flex min-h-screen flex-col items-center justify-center'>
      <h2 className='mb-4 text-2xl font-bold text-gray-700'>
        Something went wrong!
      </h2>
      <Button onClick={() => reset()} className='text-custom-pink bg-gray-700'>
        Try again
      </Button>
    </div>
  );
}
