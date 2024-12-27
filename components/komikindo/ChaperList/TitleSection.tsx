'use client';

export const TitleSection: React.FC<{ title?: string }> = ({ title }) => (
  <h1 className='mb-4 mt-8 text-center text-3xl font-bold'>
    {title || 'Judul Komik Tidak Tersedia'}
  </h1>
);
