"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Search } from 'lucide-react'
import { SidebarToggle } from './sidebar-toggle'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-gray-700">
      <div className="container flex h-14 items-center bg-gray-700">
        <SidebarToggle />
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">OnLasdan</span>
          </Link>
        </div>
        <div className="ml-2 flex flex-1 rounded-lg items-center justify-between space-x-2 md:justify-end bg-gray-700">
          <form onSubmit={handleSearch} className="w-full max-w-lg rounded-lg border-2 border-[#FBDEFF]">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search comics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-custom-pink"
              />
            </div>
          </form>
          <nav className="flex items-center text-custom-pink bg-gray-700">
            <Button variant="ghost" asChild>
              <Link href="/profile">Profile</Link>
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

