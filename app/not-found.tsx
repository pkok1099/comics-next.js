import Link from 'next/link';

export default function Custom404() {
  return (
    <div className='bg-custom-pink flex min-h-screen flex-col items-center justify-center'>
      <h1 className='mb-4 text-6xl font-bold text-gray-700'>404</h1>
      <p className='mb-8 text-2xl text-gray-700'>Oops! Page not found</p>
      <Link
        href='/'
        className='text-custom-pink rounded-lg bg-gray-700 p-3 hover:bg-gray-600'
      >
        Go back home
      </Link>
    </div>
  );
}
