import { useState, useMemo, useCallback } from 'react';
import debounce from 'lodash';
import Image from 'next/image';

interface SearchBarProps {
  placeholder: string;
  data: any[];
  onSearch: (value: string) => void;
  onSelect: (item: any) => void;
  displayProperty: string;
  imageProperty: string;
  maxResults?: number;
}

const SearchBar = ({
  placeholder = 'Search...',
  data = [],
  onSearch = () => {},
  onSelect = () => {},
  displayProperty = 'title',
  imageProperty = 'image',
  maxResults = 5,
}: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSearch = useMemo(
    () =>
      debounce((value) => {
        onSearch(value); // Panggil fungsi pencarian
      }, 500),
    [onSearch],
  );

  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      setQuery(value);
      handleSearch(value);
    },
    [handleSearch],
  );

  const handleSelect = useCallback(
    (item: any) => {
      setQuery('');
      onSelect(item); // Pilih item
    },
    [onSelect],
  );

  return (
    <div className='relative mb-5 w-full max-w-lg'>
      <input
        type='text'
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className='w-full rounded-lg bg-gray-700 p-3 text-white placeholder-gray-400 outline-none'
        aria-label={placeholder}
        aria-describedby='search-results'
      />
      {query && (
        <div
          className='absolute z-50 mt-2 max-h-52 w-full overflow-y-auto rounded-lg bg-gray-700 p-3 shadow-lg'
          id='search-results'
          role='listbox'
        >
          <ul>
            {data
              .filter((item) =>
                item[displayProperty]
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              )
              .slice(0, maxResults)
              .map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(item)}
                  className='flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-600'
                  role='option'
                  aria-selected={false}
                >
                  {item[imageProperty] && (
                    <Image
                      src={item[imageProperty]}
                      alt={item[displayProperty]}
                      width={48}
                      height={48}
                      className='rounded-lg'
                    />
                  )}
                  <span className='text-sm'>{item[displayProperty]}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
