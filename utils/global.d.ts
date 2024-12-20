// global.d.ts
declare global {
  type Comic = {
    title: string;
    thumbnail: string;
    endpoint: string;
    rating: string;
  };

  interface HistoryItem {
    _id: string;
    title: string;
    chapterId: string;
    thumbnailUrl: string;
    timestamp: string;
  }

  interface Komik {
    judul: string;
    link: string;
  }

  interface PaginationData {
    currentPage: number;
    totalPages: number;
  }

  type ComicGridProps = {
    comics: Comic[];
    loading: boolean;
  };
}

// Menambahkan ekspor kosong agar TypeScript mengenali file ini sebagai modul.
export {};