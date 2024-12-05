import { useState, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';
import Image from "next/image"

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
    [onSearch]
  );

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  }, [handleSearch]);

  const handleSelect = useCallback((item: any) => {
    setQuery('');
    onSelect(item); // Pilih item
  }, [onSelect]);

  return (
    <div className="relative w-full max-w-lg mb-5">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none placeholder-gray-400"
        aria-label={placeholder}
        aria-describedby="search-results"
      />
      {query && (
        <div
          className="absolute z-50 max-h-52 overflow-y-auto bg-gray-700 w-full mt-2 p-3 rounded-lg shadow-lg"
          id="search-results"
          role="listbox"
        >
          <ul>
            {data
              .filter((item) => item[displayProperty].toLowerCase().includes(query.toLowerCase()))
              .slice(0, maxResults)
              .map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(item)}
                  className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-600"
                  role="option"
                  aria-selected={false}
                >
                  {item[imageProperty] && (
                    <Image
                      src={item[imageProperty]}
                      alt={item[displayProperty]}
                      width={48}
                      height={48}
                      className="rounded-lg"
                    />
                  )}
                  <span className="text-sm">{item[displayProperty]}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;