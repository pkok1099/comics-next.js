'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogIn, Home, Bookmark, Search, History, LogOut } from 'lucide-react';
import { useSidebar } from '../contexts/SidebarContext';

const sidebarItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'History', href: '/history', icon: History },
  { name: 'Login', href: '/login', icon: LogIn },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen } = useSidebar();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <>
      <div
        className={cn(
          'fixed left-0 top-0 h-full border-r bg-gray-700 text-white',
          isOpen ? 'w-64' : 'w-11', // Sidebar lebih sempit saat tertutup
          'z-50 transition-all duration-300',
        )}
      >
        <div className='flex h-full flex-col'>
          <ScrollArea className='flex-1'>
            <div className='flex flex-col gap-2 pt-4'>
              {' '}
              {/* Mengurangi padding kiri pada sidebar */}
              {sidebarItems.map((item) => (
                <Button
                  key={item.name}
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className={cn(
                    'relative w-full justify-start pl-3 transition-all', // Menghilangkan padding kiri
                    pathname === item.href && 'bg-primary font-semibold',
                  )}
                  asChild
                >
                  <Link href={item.href} className='z-10 flex items-center'>
                    <item.icon className='mr-2 h-4 w-4' />
                    <span
                      className={cn(
                        'ml-0 text-sm transition-opacity duration-300', // Menghilangkan margin kiri
                        isOpen ? 'opacity-100' : 'opacity-0',
                      )}
                    >
                      {item.name}
                    </span>
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
          <div className='p-4'>
            <Button
              variant='ghost'
              className='w-full justify-start pl-0'
              onClick={handleLogout}
            >
              <LogOut className='mr-2 h-4 w-4 pl-0' />
              <span
                className={cn(
                  'ml-2 text-sm transition-opacity duration-300',
                  isOpen ? 'opacity-100' : 'opacity-0', // Menyembunyikan nama saat sidebar tertutup
                )}
              >
                Logout
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Konten utama yang terdorong saat sidebar terbuka */}
      <div
        className={cn(
          'transition-all duration-300',
          isOpen ? 'ml-64' : 'ml-11', // Menyesuaikan margin dengan lebar sidebar saat tertutup
          'min-h-screen', // Pastikan konten utama memiliki tinggi yang sesuai
        )}
      >
        {/* Konten utama di sini */}
      </div>
    </>
  );
}
