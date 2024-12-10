import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ComicSkeleton() {
  return (
    <Card>
      <Skeleton className="h-48" />
      <CardContent className="p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardFooter>
    </Card>
  )
}

export function ComicGridSkeleton() {
  return (
    <div className="mt-16 grid w-full grid-cols-4 gap-3 lg:grid-cols-5">
      {[...Array(8)].map((_, index) => (
        <ComicSkeleton key={index} />
      ))}
    </div>
  )
}

