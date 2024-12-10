'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { LogIn, Home, Bookmark, Search, History, LogOut, X } from 'lucide-react';
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
  const { isOpen, toggleSidebar } = useSidebar();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <>
      {/* Sidebar untuk layar besar */}
      <div
        className={cn(
          ' relative left-0 top-0 h-full border-r bg-gray-700 text-white',
          isOpen ? 'w-64' : 'w-11',
          'z-50 hidden min-h-screen md:block transition-all duration-300'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex justify-end p-2">
          </div>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-2 pt-4">
              {sidebarItems.map((item) => (
                <Button
                  key={item.name}
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className={cn(
                    'relative w-full justify-start pl-3',
                    pathname === item.href && 'bg-primary font-semibold',
                  )}
                  asChild
                >
                  <Link href={item.href} className="z-10 flex items-center">
                    <item.icon className="mr-2 h-4 w-4" />
                    <span
                      className={cn(
                        'ml-0 text-sm transition-opacity duration-300',
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
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar dalam dialog untuk layar kecil */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 md:hidden">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative w-11/12 max-w-sm bg-gray-700 p-4 rounded-lg"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="flex flex-col gap-2"
            >
              {sidebarItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Button
                    variant={pathname === item.href ? 'secondary' : 'ghost'}
                    asChild
                    className="flex items-center"
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-5 w-5" />
                      {item.name}
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      )}
    </>
  );
}
