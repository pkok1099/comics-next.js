import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getChapterUrl } from '@/ChapterList/getChapterUrl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface NavigationButtonsProps {
  id: string;
  chapterId: string;
  goToNextChapter: () => void;
  setIsDropdownOpen: (open: boolean) => void;
  isDropdownOpen: boolean;
  chapterList: Chapter[];
  router: ReturnType<typeof useRouter>;
}

interface Chapter {
  title: string;
  url: string;
  lastUpdated: string;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  id,
  chapterId,
  goToNextChapter,
  chapterList,
  setIsDropdownOpen,
  isDropdownOpen,
  router
}) => (
  <div className='fixed right-2 top-1/2 z-50 flex -translate-y-1/2 transform flex-col gap-4 sm:right-4 md:right-8'>
    <Button
      variant='ghost'
      onClick={() =>
        router.push(
          `/komikindo/${decodeURIComponent(id)}/${parseInt(chapterId) - 1}`
        )
      }
      size='default'
      className='hover:rotate-360 flex h-10 w-6 transform items-center justify-center rounded-lg bg-gray-700 text-white opacity-75 shadow-lg transition-transform duration-500 hover:opacity-80 sm:h-12 sm:w-8 md:h-14 md:w-10'
    >
      <span className='rotate-360 text-xs [writing-mode:vertical-rl] sm:text-sm md:text-base lg:text-lg'>
        Prev
      </span>
    </Button>

    <div className='relative'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='default'
            className='hover:rotate-360 flex h-10 w-6 transform items-center justify-center rounded-lg bg-gray-700 text-white opacity-75 shadow-lg transition-transform duration-500 hover:opacity-80 sm:h-12 sm:w-8 md:h-14 md:w-10'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className='rotate-360 text-xs [writing-mode:vertical-rl] sm:text-sm md:text-base lg:text-lg'>
              Ch
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='center'
          className='max-h-[300px] w-48 overflow-y-auto'
        >
          {chapterList.map((chapter) => (
            <DropdownMenuItem
              key={chapter.title}
              onClick={() => {
                router.push(
                  `/komikindo/${decodeURIComponent(id)}/${getChapterUrl(chapter)}`
                );
                setIsDropdownOpen(false);
              }}
            >
              {chapter.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <Button
      onClick={goToNextChapter}
      variant='ghost'
      size='default'
      className='hover:rotate-360 flex h-10 w-6 transform items-center justify-center rounded-lg bg-gray-700 text-white opacity-75 shadow-lg transition-transform duration-500 hover:opacity-80 sm:h-12 sm:w-8 md:h-14 md:w-10'
    >
      <span className='rotate-360 text-xs [writing-mode:vertical-rl] sm:text-sm md:text-base lg:text-lg'>
        Next
      </span>
    </Button>
  </div>
);
