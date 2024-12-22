'use client';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant='ghost'
      size='icon'
      className='ml-0'
      onClick={toggleSidebar}
      aria-label='Toggle Sidebar'
    >
      <Menu className='h-5 w-5' />
    </Button>
  );
}
