import React from 'react';

const Pagination = ({ currentPage, pagination, setCurrentPage }) => (
  <div className='mt-5 flex flex-wrap justify-center'>
    {/* Tombol Previous */}
    <button
      className={`mb-2 mr-2 rounded bg-gray-700 px-4 py-2 text-white transition hover:bg-gray-600 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
      onClick={() => setCurrentPage(currentPage - 1)}
      disabled={currentPage === 1}
    >
      Previous
    </button>

    {/* Tombol Halaman */}
    {pagination.length >= 4 &&
      pagination.map((page, index) => (
        <button
          key={index}
          className={`mb-2 mr-2 rounded px-4 py-2 ${page === currentPage ? 'bg-gray-700 text-white' : 'bg-gray-600 text-gray-300 transition hover:bg-gray-700 hover:text-white'}`}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}

    {/* Tombol Next */}
    <button
      className={`mb-2 ml-2 rounded bg-gray-700 px-4 py-2 text-white transition hover:bg-gray-600 ${currentPage === pagination[pagination.length - 1] ? 'cursor-not-allowed opacity-50' : ''}`}
      onClick={() => setCurrentPage(currentPage + 1)}
      disabled={currentPage === pagination[pagination.length - 1]}
    >
      Next
    </button>
  </div>
);

export default Pagination;
