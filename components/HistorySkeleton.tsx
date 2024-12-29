import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function HistorySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
      {[...Array(10)].map((_, i) => (
        <Card key={i} className="overflow-hidden dark:ay-700">
          <Skeleton className="h-40 w-full" />
          <CardContent className="space-y-2 p-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </CardContent>
          <CardFooter className="p-2 pt-0">
            <Skeleton className="h-8 w-20" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
