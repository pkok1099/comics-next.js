'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Search } from 'lucide-react';
import { SidebarToggle } from './sidebar-toggle';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 bg-gray-700 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-14 max-w-full items-center justify-between bg-gray-700 px-4'>
        <SidebarToggle />
        <div className='mr-4 hidden md:flex'>
          <Link href='/' className='mr-6 flex items-center space-x-2'>
            <span className='ml-2 hidden font-bold sm:inline-block'>
              OnLasdan
            </span>
          </Link>
        </div>
        <div className='ml-2 flex flex-1 items-center justify-between space-x-2 bg-gray-700 md:justify-end'>
          <form
            onSubmit={handleSearch}
            className='w-full max-w-lg rounded-lg border-2 border-[#FBDEFF]'
          >
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search comics...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='text-custom-pink pl-8'
              />
            </div>
          </form>
          <nav className='text-custom-pink flex items-center bg-gray-700'>
            <Button variant='ghost' asChild>
              <Link href='/profile'>Profile</Link>
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
