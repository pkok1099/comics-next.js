export interface Chapter {
  title: string;
  url: string;
  lastUpdated: string;
}

export interface KomikData {
  title: string;
  thumbnail: string;
  chapterList: Chapter[];
  status?: string;
  author?: string;
  genre?: string[];
  synopsis?: string;
}
