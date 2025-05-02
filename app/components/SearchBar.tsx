import { FC, FormEvent, useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onImageSearch?: (file: File) => void;
  isSearching: boolean;
  searchQuery: string;
  isDarkMode: boolean;
  setSearchQuery: (query: string) => void;
}

// Add a function to save search to localStorage
const saveSearchToHistory = (query: string, type: 'text' | 'image', imageUrl?: string) => {
  try {
    const savedHistory = localStorage.getItem('whiskeySearchHistory') || '[]';
    const history = JSON.parse(savedHistory);
    
    // Add new search to history
    const newItem = {
      id: Date.now().toString(),
      query,
      type,
      timestamp: Date.now(),
      imageUrl
    };
    
    // Limit history to 20 items
    const updatedHistory = [newItem, ...history].slice(0, 20);
    localStorage.setItem('whiskeySearchHistory', JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
};

const SearchBar: FC<SearchBarProps> = ({ 
  onSearch, 
  onImageSearch, 
  isSearching, 
  isDarkMode, 
  searchQuery, 
  setSearchQuery
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedImage && onImageSearch) {
      onImageSearch(selectedImage);
      saveSearchToHistory(searchQuery || 'Image search', 'image', previewUrl || undefined);
    } else if (searchQuery.trim()) {
      onSearch(searchQuery);
      saveSearchToHistory(searchQuery, 'text');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleCaptureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="mb-4">
      <h2 className={`text-lg font-medium mb-2 text-center text-amber-600 dark:text-amber-500`}>Search by Name or Image</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="relative">
          <input
            type="text"
            className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'} border focus:outline-none focus:ring-2 focus:ring-amber-500`}
            placeholder="Enter whiskey name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSearching}
          />
          <button
            type="button"
            onClick={handleCaptureClick}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            } text-amber-500`}
            disabled={isSearching}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
          disabled={isSearching}
        />

        {previewUrl && (
          <div className="relative mt-2">
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-amber-500">
              <img
                src={previewUrl}
                alt="Selected"
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={clearImage}
                className={`absolute top-2 right-2 p-1 rounded-full ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } text-red-500 shadow-md`}
                disabled={isSearching}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors text-white flex items-center justify-center gap-2 ${
            isSearching
              ? 'bg-amber-600 cursor-not-allowed opacity-70'
              : 'bg-amber-500 hover:bg-amber-600'
          }`}
          disabled={isSearching || (!searchQuery.trim() && !selectedImage)}
          onClick={handleSubmit}
        >
          {isSearching ? 'Searching...' : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <span>{selectedImage ? 'Search with Image' : 'Search'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchBar; 
