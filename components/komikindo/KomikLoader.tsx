import React from 'react';
import { SkeletonLoader } from 'components/komikindo/SkeletonLoader';

const KomikLoader: React.FC = () => {
  return (
    <div className='grid w-full grid-cols-4 gap-2 lg:grid-cols-5'>
      {Array.from({ length: 12 }).map((_, index) => (
        <SkeletonLoader key={index} />
      ))}
    </div>
  );
};

export default KomikLoader;
