import { FC, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  searchQuery: string;
  isDarkMode: boolean;
  setSearchQuery: (query: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch, isSearching, isDarkMode, searchQuery, setSearchQuery }) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="mb-4">
      <h2 className={`text-lg font-medium mb-2 text-center text-amber-600 dark:text-amber-500`}>Search by Name</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'} border focus:outline-none focus:ring-2 focus:ring-amber-500`}
          placeholder="Enter whiskey name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isSearching}
        />
        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors text-white ${
            isSearching
              ? 'bg-amber-600 cursor-not-allowed opacity-70'
              : 'bg-amber-500 hover:bg-amber-600'
          }`}
          disabled={isSearching}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchBar; 