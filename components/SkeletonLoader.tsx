import { FC } from 'react';

const SkeletonLoader: FC = () => {
  return (
    <div className='relative flex h-[10vh] cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-700 p-4'></div>
  );
};

export default SkeletonLoader;
