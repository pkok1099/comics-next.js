import { Comic } from './types';

// types.ts
export type Comic = {
  title: string;
  thumbnail: string;
  endpoint: string;
  rating: string;
};
export interface HistoryItem {
  _id: string;
  title: string;
  chapterId: string;
  thumbnailUrl: string;
  timestamp: string;
}// Definisikan tipe untuk komik dan pagination
export interface Komik {
  judul: string;
  link: string;
}
export interface PaginationData {
  currentPage: number;
  totalPages: number;
}
export type ComicGridProps = {
  comics: Comic[];
  loading: boolean;
};

