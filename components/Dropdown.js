import React, {
  useState,
  useEffect,
} from 'react';

const Dropdown = ({
  historyId,
  onDeleteHistory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (event) => {
    event.stopPropagation(); // Menambahkan stopPropagation untuk menghentikan event
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (
      event.target.closest('.dropdown') === null
    ) {
      setIsOpen(false);
    }
  };

  const handleDelete = (event) => {
    event.stopPropagation(); // Mencegah event klik untuk diteruskan ke card
    onDeleteHistory(historyId);
  };

  useEffect(() => {
    document.addEventListener(
      'click',
      handleClickOutside,
    );
    return () => {
      document.removeEventListener(
        'click',
        handleClickOutside,
      );
    };
  }, []);

  return (
    <div className="relative dropdown z-10">
      {' '}
      {/* Tambahkan z-index */}
      <button
        className="text-white bg-gray-700 p-2 rounded-full"
        onClick={toggleDropdown}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="16" r="1" />
          <circle cx="12" cy="8" r="1" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute bg-gray-800 text-white p-3 rounded-lg shadow-lg mt-2 w-40">
          <button
            onClick={handleDelete} // Gunakan handler khusus untuk delete
            className="block w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
          >
            Delete History
          </button>
          <p className="text-xs text-gray-400 mt-2">
            ID: {historyId}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
