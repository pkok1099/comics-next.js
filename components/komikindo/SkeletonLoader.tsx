import { FC } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const SkeletonLoader: FC = () => (
  <Card className='cursor-pointer'>
    <Skeleton className='aspect-[3/4] w-full rounded-lg' />
    <CardHeader className='p-2'>
      <CardTitle>
        <Skeleton className='mx-auto h-5 w-3/4' />
      </CardTitle>
    </CardHeader>
  </Card>
);

export default SkeletonLoader;
