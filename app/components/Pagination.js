import React from 'react';

const Pagination = ({ currentPage, pagination, setCurrentPage }) => (
  <div className="flex justify-center mt-5 flex-wrap">
    {/* Tombol Previous */}
    <button
      className={`px-4 py-2 rounded mr-2 mb-2 bg-gray-700 text-white hover:bg-gray-600 transition ${
        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={() => setCurrentPage(currentPage - 1)}
      disabled={currentPage === 1}
    >
      Previous
    </button>

    {/* Tombol Halaman */}
    {pagination.map((page, index) => (
      <button
        key={index}
        className={`px-4 py-2 rounded mr-2 mb-2 ${
          page === currentPage
            ? 'bg-gray-700 text-white'
            : 'bg-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition'
        }`}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </button>
    ))}

    {/* Tombol Next */}
    <button
      className={`px-4 py-2 rounded ml-2 mb-2 bg-gray-700 text-white hover:bg-gray-600 transition ${
        currentPage === pagination[pagination.length - 1] ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={() => setCurrentPage(currentPage + 1)}
      disabled={currentPage === pagination[pagination.length - 1]}
    >
      Next
    </button>
  </div>
);

export default Pagination;
