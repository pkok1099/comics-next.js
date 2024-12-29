'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Search } from 'lucide-react';
import { SidebarToggle } from './sidebar-toggle';
import { useScroll } from '../hooks/useScroll';
import { cn } from '@/lib/utils';
import clsx from 'clsx';

interface HeaderProps {
  children?: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { scrolled, hidden } = useScroll();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'transition-all transform duration-200 ease-in-out will-change-transform',
        clsx({
          'translate-y-0 opacity-100': !hidden,
          '-translate-y-full opacity-0': hidden,
          'border-b shadow-sm': scrolled,
        })
      )}
    >
      <div className='flex h-14 max-w-full items-center justify-between px-2 sm:px-4'>
        <SidebarToggle />
        <div className='mr-2 hidden md:flex'>
          <Link href='/' className='mr-4 flex items-center space-x-2'>
            <span className='ml-2 hidden font-bold sm:inline-block'>
              OnLasdan
            </span>
          </Link>
        </div>
        <div className='ml-2 flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <form onSubmit={handleSearch} className='w-full max-w-lg rounded-lg'>
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-8 text-sm sm:text-base'
                placeholder='Search...'
              />
            </div>
          </form>
          <nav className='flex items-center space-x-1 sm:space-x-2'>
            <Button variant='ghost' size='sm' className='hidden sm:inline-flex' asChild>
              <Link href='/history'>History</Link>
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </div>
      {children}
    </header>
  );
}
