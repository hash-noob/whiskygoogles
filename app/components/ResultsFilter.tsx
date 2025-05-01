import React, { useEffect, useState } from 'react';

interface ResultsFilterProps {
  totalResults: number;
  maxResultsToShow: number;
  setMaxResultsToShow: (value: number) => void;
}

const ResultsFilter: React.FC<ResultsFilterProps> = ({ 
  totalResults, 
  maxResultsToShow, 
  setMaxResultsToShow 
}) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  useEffect(() => {
    // Check the current theme from data-theme attribute
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'light' ? 'light' : 'dark');
    
    // Set up an observer to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme');
          setTheme(newTheme === 'light' ? 'light' : 'dark');
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  // Create array of options based on the total number of results
  // Only include options that make sense for the current result count
  const availableOptions = [5, 10, 15, 20];
  const resultOptions = availableOptions.filter(num => num <= totalResults);
  
  // Ensure at least the current selection and the minimum option are available
  if (!resultOptions.includes(maxResultsToShow) && maxResultsToShow <= totalResults) {
    resultOptions.push(maxResultsToShow);
    resultOptions.sort((a, b) => a - b);
  }
  
  if (resultOptions.length <= 1) {
    return null;
  }
  
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <label htmlFor="results-filter" className="text-amber-500 mr-2 text-sm font-medium">
          Show
        </label>
        <div className="relative">
          <select
            id="results-filter"
            value={maxResultsToShow}
            onChange={(e) => setMaxResultsToShow(Number(e.target.value))}
            className="glass-morphism border border-amber-500/30 text-amber-500 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 py-1 pl-3 pr-8"
            style={{ 
              backgroundColor: 'transparent',
              backgroundImage: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none'
            }}
          >
            {resultOptions.map(num => (
              <option 
                key={num} 
                value={num} 
                style={{
                  backgroundColor: theme === 'light' ? '#f3f4f6' : '#1f2937',
                  color: '#f59e0b'
                }}
              >
                {num} results
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-amber-500/70 italic">
        Sorted by confidence score
      </div>
    </div>
  );
};

export default ResultsFilter; 