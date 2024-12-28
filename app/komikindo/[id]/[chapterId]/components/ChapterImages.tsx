interface ChapterImagesProps {
  pages: string[];
  chapterId: string;
}

export const ChapterImages = ({ pages, chapterId }: ChapterImagesProps) => (
  <div className='chapter-images flex flex-col items-center'>
    {pages.length === 0 ? (
      <p>No images available for this chapter.</p>
    ) : (
      pages.map((img, imgIndex) => (
        <img
          key={imgIndex}
          src={img}
          alt={`Page ${imgIndex + 1} of Chapter ${chapterId}`}
          width={500}
          height={800}
          className='chapter-image w-full'
        />
      ))
    )}
  </div>
);
