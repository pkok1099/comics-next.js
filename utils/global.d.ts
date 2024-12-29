import { Chapter } from './../types/komik';
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
    thumbnail: string;
  }

  interface PaginationData {
    currentPage: number;
    totalPages: number;
  }

  type ComicGridProps = {
    comics: Comic[];
    loading: boolean;
  };

  interface HistoryItem {
    _id: string;
    title: string;
    chapterId: number;
    imageUrl?: string;
  }

  interface HistoryListProps {
    history: HistoryItem[];
    loading: boolean;
    onHistoryClick: (title: string, chapterId: number) => void;
    onDeleteHistory: (id: string) => void;
  }

  interface ComicData {
    title: string;
    link: string;
    image: string;
    rating: number;
  }

  interface Comic {
    title: string;
    endpoint: string;
    thumbnail: string;
    rating: number;
  }

  interface Chapter {
    title: string;
    url: string;
    lastUpdated: string;
  }
}

// Menambahkan ekspor kosong agar TypeScript mengenali file ini sebagai modul.
export {};
