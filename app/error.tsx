'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-custom-pink">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Something went wrong!</h2>
      <Button
        onClick={() => reset()}
        className="bg-gray-700 text-custom-pink"
      >
        Try again
      </Button>
    </div>
  )
}

