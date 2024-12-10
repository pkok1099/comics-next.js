import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-custom-pink">
      <h1 className="text-6xl font-bold text-gray-700 mb-4">404</h1>
      <p className="text-2xl text-gray-700 mb-8">Oops! Page not found</p>
      <Button asChild className="bg-gray-700 text-custom-pink">
        <Link href="/">
          Go back home
        </Link>
      </Button>
    </div>
  )
}

