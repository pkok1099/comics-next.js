import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, Bookmark } from 'lucide-react'
import { motion } from 'framer-motion'
import {useRouter} from 'next/navigation'

type Comic = {
  judul: string
  thumbnail: string
  endpoint: string
  rating: string
}

type ComicGridProps = {
  comics: Comic[]
  loading: boolean
}

export default function ComicGrid({ comics, loading }: ComicGridProps) {
const router = useRouter()

const handleKomikClick = async (komikLink) => {
    setIsLoading(true);
    try {
      await router.push(
        `/komikindo/${komikLink.replace(/https:\/\/[^]+\/komik\/([^]+)\//, '$1')}/chapters`,
      );
    } catch (error) {
      console.error('Error navigating to komik page:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="mt-16 grid w-full grid-cols-4 gap-3 lg:grid-cols-5 ">
      {loading
        ? [...Array(8)].map((_, index) => (
            <Card key={index}>
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
          ))
        : comics.map((comic, index) => (
            <motion.div
              key={handleKomikClick(comic.link)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="cursor-pointer hover:shadow-lg">
                <Link href={`/komikindo/${comic.endpoint}`}>
                  <Image
                    src={comic.thumbnail}
                    alt={comic.judul}
                    width={300}
                    height={400}
                    className="aspect-[3/4] w-full h-full rounded-lg"
                  />
                </Link>
                <CardContent className="p-2">
                  <h3 className="line-clamp-2 text-center text-base font-semibold leading-tight">{comic.judul}</h3>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <Button variant="ghost" size="icon">
                    <Bookmark className="w-4 h-4 text-gray-700" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
    </div>
  )
}

