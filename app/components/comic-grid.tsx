import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
// import { ComicGridProps } from '@/utils/global';

export default function ComicGrid({ comics, loading }: ComicGridProps) {
  return (
    <div className='mt-16 grid w-full grid-cols-4 gap-3 lg:grid-cols-5'>
      {loading
        ? [...Array(8)].map((_, index) => (
            <Card key={index}>
              <Skeleton className='h-48' />
              <CardContent className='p-4'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='mt-2 h-4 w-2/3' />
              </CardContent>
              <CardFooter className='flex justify-between p-4 pt-0'>
                <Skeleton className='h-4 w-16' />
                <Skeleton className='h-8 w-8 rounded-full' />
              </CardFooter>
            </Card>
          ))
        : comics.map((comic, index) => (
            <motion.div
              key={`${comic.endpoint}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className='w-full cursor-pointer hover:shadow-lg'>
                <Link href={`/komikindo/${comic.endpoint}/chapters`}>
                  <Image
                    src={comic.thumbnail}
                    alt={comic.title}
                    width={300}
                    height={400}
                    className='aspect-[3/4] h-full w-full rounded-lg'
                  />
                </Link>
                <CardContent className='p-2'>
                  <h3 className='line-clamp-2 text-center text-base font-semibold leading-tight'>
                    {comic.title}
                  </h3>
                  <div className='flex items-center justify-center space-x-1'>
                    <Star className='text-yellow-400' size={18} />
                    <span className='text-sm'>{comic.rating}</span>
                  </div>
                </CardContent>
                <CardFooter className='flex justify-between p-4 pt-0'>
                  <Button variant='ghost' size='icon'></Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
    </div>
  );
}
