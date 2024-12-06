const SkeletonLoader = () => (
  <div className='flex flex-col items-center justify-center rounded-lg bg-gray-700 p-2'>
    <div className='mb-3 aspect-[3/4] w-full animate-pulse rounded-lg bg-gray-600'></div>
    <div className='mb-2 h-6 w-full animate-pulse rounded bg-gray-600'></div>
    <div className='h-6 w-3/4 animate-pulse rounded bg-gray-600'></div>
  </div>
);

export default SkeletonLoader;
