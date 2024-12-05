import React from 'react';
import Dropdown from './Dropdown'; // Pastikan untuk mengimpor dropdown
import { useRouter } from 'next/navigation';

const HistoryCard = ({
  item,
  onDeleteHistory,
}) => {
  const router = useRouter();

  const handleHistoryClick = (
    komikId,
    chapterNumber,
  ) => {
    router.push(
      `/komik/komikindo/${komikId}/chapters/${chapterNumber}`,
    );
  };

  return (
    <div
      className="relative bg-gray-700 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer"
      onClick={() =>
        handleHistoryClick(
          item.title,
          item.chapterId,
        )
      } // Menangani klik
    >
      <h3 className="text-sm font-semibold text-center line-clamp-2 w-full">
        {item.title}
      </h3>
      <p className="text-xs text-center mt-1">
        Chapter {item.chapterId} -{' '}
        {new Date(
          item.timestamp,
        ).toLocaleDateString()}
      </p>

      {/* Dropdown */}
      <Dropdown
        historyId={item._id}
        onDeleteHistory={onDeleteHistory}
      />

      {/* Desain card lebih rapih */}
    </div>
  );
};

export default HistoryCard;
