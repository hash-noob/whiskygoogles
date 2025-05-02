import React, { useState, useEffect } from 'react';
import { FaHistory, FaTrash, FaSearch } from 'react-icons/fa';

interface SearchItem {
  id: string;
  query: string;
  type: 'text' | 'image';
  timestamp: number;
  imageUrl?: string;
}

interface SearchHistoryProps {
  isDarkMode: boolean;
  onSelectHistory: (query: string, imageFile?: File) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ isDarkMode, onSelectHistory }) => {
  const [history, setHistory] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('whiskeySearchHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error parsing search history:', error);
      }
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('whiskeySearchHistory');
    setHistory([]);
  };

  const handleSelectItem = (item: SearchItem) => {
    onSelectHistory(item.query);
    setIsOpen(false);
  };

  const toggleHistory = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleHistory}
        className={`flex items-center gap-1 px-3 py-2 rounded-full ${
          isDarkMode
            ? 'bg-gray-800 hover:bg-gray-700 text-amber-400'
            : 'bg-amber-100 hover:bg-amber-200 text-amber-700'
        } transition-colors`}
        aria-label="Search History"
      >
        <FaHistory />
        <span className="text-sm">History</span>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-72 rounded-lg shadow-lg z-10 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border overflow-hidden`}
        >
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Recent Searches</h3>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-500'}`}
                aria-label="Clear History"
              >
                <FaTrash size={14} />
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {history.length === 0 ? (
              <div className={`p-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No search history yet
              </div>
            ) : (
              <ul>
                {history.map((item) => (
                  <li key={item.id} className="border-b last:border-b-0 border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleSelectItem(item)}
                      className={`w-full p-3 text-left flex items-center gap-3 ${
                        isDarkMode
                          ? 'hover:bg-gray-700 text-gray-200'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className={`flex-shrink-0 ${item.type === 'image' ? 'text-blue-500' : 'text-amber-500'}`}>
                        <FaSearch size={14} />
                      </div>
                      <div className="flex-1 truncate">
                        <span className="block truncate">{item.query}</span>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {/* {item.type === 'image' && item.imageUrl && (
                        <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 border border-gray-300 dark:border-gray-600">
                          <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      )} */}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHistory; 