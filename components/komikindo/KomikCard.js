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
      className='aspect-[3/4] w-full rounded-lg'
    />
    <CardHeader className='p-2'>
      <CardTitle className='line-clamp-2 text-center text-base font-semibold leading-tight'>
        {komik.judul}
      </CardTitle>
    </CardHeader>
  </Card>
);
