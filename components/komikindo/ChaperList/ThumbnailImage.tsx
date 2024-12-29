import { Card } from '@/components/ui/card';

export const ThumbnailImage: React.FC<{ thumbnail?: string }> = ({
  thumbnail,
}) => (
  <div className='mt-[40px] flex h-full items-center justify-center bg-gray-900'>
    <Card className='h-[400px] w-[300px] flex-shrink-0'>
      {thumbnail ? (
        <img
          src={thumbnail}
          alt='Thumbnail'
          width={300}
          height={400}
          className='aspect-[3/4] w-full rounded-lg bg-gray-600'
        />
      ) : (
        <div className='flex h-full w-full items-center justify-center rounded-md bg-gray-700 text-gray-400'>
          Thumbnail tidak tersedia
        </div>
      )}
    </Card>
  </div>
);
