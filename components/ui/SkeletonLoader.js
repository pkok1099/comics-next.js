const SkeletonLoader = () => (
  <div className="bg-gray-700 p-2 rounded-lg flex flex-col items-center justify-center">
    <div className="w-full aspect-[3/4] bg-gray-600 rounded-lg mb-3 animate-pulse"></div>
    <div className="w-full h-6 bg-gray-600 rounded mb-2 animate-pulse"></div>
    <div className="w-3/4 h-6 bg-gray-600 rounded animate-pulse"></div>
  </div>
);

export default SkeletonLoader;