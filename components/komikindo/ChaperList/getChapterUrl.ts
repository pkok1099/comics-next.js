'use client';
// Utility function to extract chapter URL

export const getChapterUrl = (chapter: { url: string }): string => {
  const regex = /chapter-(\d+)/;
  const match = chapter.url.match(regex);
  return match ? match[1] : 'unknown';
};
