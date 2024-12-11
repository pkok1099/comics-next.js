'use client';
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export const KomikCard = ({ komik, onClick }) => (
  <Card
    key={komik.judul}
    className='cursor-pointer hover:shadow-lg'
    onClick={onClick}
  >
    <Image
      src={komik.thumbnail}
      alt={komik.judul}
      width={200}
      height={250}
      loading='lazy'
      className='border-1 aspect-[3/4] w-full rounded-3xl border-cyan-200'
    />
    <CardHeader className='p-2'>
      <CardTitle className='rounded-full line-clamp-2 text-center font-raleway text-base leading-tight drop-shadow-full'>
        {komik.judul}
      </CardTitle>
    </CardHeader>
  </Card>
);
