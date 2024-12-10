"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LogIn, Home, BookOpen, Star, Bookmark, Search, History, LogOut } from 'lucide-react'
import { useSidebar } from '../contexts/SidebarContext'

const sidebarItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'History', href: '/history', icon: History },
  { name: 'Login', href: '/login', icon: LogIn },
  
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isOpen } = useSidebar()

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div
      className={cn(
        "relative border-r transition-all duration-300",
        isOpen ? "w-64" : "w-0"
      )}
      style={{ backgroundColor: '#374151' }}
    >
      <div
        className={cn(
          "absolute inset-0 flex flex-col transition-all duration-300",
          isOpen
            ? "opacity-100 transform translate-x-0"
            : "opacity-0 transform -translate-x-full"
        )}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-2 p-4">
            {sidebarItems.map((item) => (
              <Button
                key={item.name}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href && "bg-primary font-semibold"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
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
  )
}