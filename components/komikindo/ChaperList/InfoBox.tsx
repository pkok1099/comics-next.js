'use client';
import { FaStar, FaUser, FaPen, FaBook, FaGamepad } from 'react-icons/fa';

interface KomikData {
  type?: string;
  rating?: string;
  author?: string;
  illustrator?: string;
  status?: string;
  graphics?: string;
  theme?: string[];
}

interface InfoBoxProps {
  komikData?: KomikData;
}

// InfoBox Component
export const InfoBox: React.FC<InfoBoxProps> = ({ komikData }) => (
  <div className='mb-6 ml-6 space-y-4'>
    <div className='grid grid-cols-1 gap-3'>
      <div className='flex items-center space-x-2'>
        <FaBook className='text-2xl' />
        <span className='text-lg'>{komikData?.type || 'Manga'}</span>
      </div>
      <div className='flex items-center space-x-2'>
        <FaStar className='text-2xl' />
        <span className='text-lg'>
          {komikData?.rating || 'Rating tidak tersedia'}
        </span>
      </div>
      <div className='flex items-center space-x-2'>
        <FaUser className='text-2xl' />
        <span className='text-lg'>
          {komikData?.author || 'Penulis tidak tersedia'}
        </span>
      </div>
      <div className='flex items-center space-x-2'>
        <FaPen className='text-2xl' />
        <span className='text-lg'>
          {komikData?.illustrator || 'Ilustrator tidak tersedia'}
        </span>
      </div>
      <div className='flex items-center space-x-2'>
        <FaBook className='text-2xl' />
        <span className='text-lg'>
          {komikData?.status || 'Status tidak tersedia'}
        </span>
      </div>
      <div className='flex items-center space-x-2'>
        <FaGamepad className='text-2xl' />
        <span className='text-lg'>
          {komikData?.graphics || 'Graphics tidak tersedia'}
        </span>
      </div>
      <div className='flex items-center space-x-2'>
        <FaGamepad className='text-2xl' />
        <span className='text-lg'>
          {komikData?.theme?.join(', ') || 'Tema tidak tersedia'}
        </span>
      </div>
    </div>
  </div>
);
