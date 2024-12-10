import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Custom404() {
  return (
    <div className='bg-custom-pink flex min-h-screen flex-col items-center justify-center'>
      <h1 className='mb-4 text-6xl font-bold text-gray-700'>404</h1>
      <p className='mb-8 text-2xl text-gray-700'>Oops! Page not found</p>
      <Button asChild className='text-custom-pink bg-gray-700'>
        <Link href='/'>Go back home</Link>
      </Button>
    </div>
  );
}
