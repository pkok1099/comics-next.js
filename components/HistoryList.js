import React from 'react';
import HistoryCard from './HistoryCard';
import SkeletonLoader from './SkeletonLoader';

const HistoryList = ({
  history,
  loading,
  onHistoryClick,
  onDeleteHistory,
}) => {
  return (
    <div className="grid grid-cols-4 lg:grid-cols-5 gap-4 w-full mt-5">
      {loading ? (
        Array.from({ length: 12 }).map(
          (_, index) => (
            <SkeletonLoader key={index} />
          ),
        ) // Placeholder Skeleton
      ) : history.length === 0 ? (
        <p className="text-center w-full col-span-4">
          No history found.
        </p>
      ) : (
        history.map((item) => (
          <HistoryCard
            key={item._id}
            item={item}
            onHistoryClick={onHistoryClick}
            onDeleteHistory={onDeleteHistory}
          />
        ))
      )}
    </div>
  );
};

export default HistoryList;
