'use client';
import Link from 'next/link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getChapterUrl } from './getChapterUrl';

// Chapter List Component
export const ChapterListComponent = ({ chapters, id }) => (
  <Collapsible className='mt-8'>
    <CollapsibleTrigger className='flex cursor-pointer items-center justify-between rounded-md bg-gray-800 px-6 py-2'>
      <span className='text-lg font-bold text-gray-300'>Daftar Chapters</span>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <ScrollArea className='h-[300px] w-full overflow-y-scroll'>
        {chapters.length > 0 ? (
          chapters.map((chapter, index) => (
            <div
              key={chapter.title}
              className='mt-2 flex items-center justify-between border-b border-gray-600 p-4'
            >
              <div className='flex flex-col'>
                <span className='font-semibold'>{chapter.title}</span>
                <span className='text-sm text-gray-400'>
                  {chapter.lastUpdated}
                </span>
              </div>
              <Link
                href={`/komikindo/${id}/chapters/${getChapterUrl(chapter)}`}
                className='ml-2 inline-block rounded-lg bg-gray-800 px-6 py-3 text-gray-400 hover:bg-gray-700'
              >
                Baca Chapter
              </Link>
            </div>
          ))
        ) : (
          <p className='text-center text-gray-400'>No chapters available</p>
        )}
      </ScrollArea>
    </CollapsibleContent>
  </Collapsible>
);
