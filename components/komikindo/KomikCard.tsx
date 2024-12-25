import { FC } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface Komik {
  judul: string;
  thumbnail: string;
  link: string;
}

interface KomikCardProps {
  komik: Komik;
  onClick: () => void;
}

export const KomikCard: FC<KomikCardProps> = ({ komik, onClick }) => (
  <Card
    key={komik.judul}
    className='cursor-pointer hover:shadow-lg'
    onClick={onClick}
  >
    <img
      src={komik.thumbnail}
      alt={komik.judul}
      width={200}
      height={250}
      loading='lazy'
      className='border-1 aspect-[3/4] w-full rounded-xl border-cyan-200'
    />
    <CardHeader className='p-2'>
      <CardTitle className='drop-shadow-full line-clamp-2 rounded-full text-center font-raleway text-base leading-tight'>
        {komik.judul}
      </CardTitle>
    </CardHeader>
  </Card>
);
