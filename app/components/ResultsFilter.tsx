import React from 'react';

interface ResultsFilterProps {
  totalResults: number;
  maxResultsToShow: number;
  setMaxResultsToShow: (value: number) => void;
  darkMode?: boolean;
}

const ResultsFilter: React.FC<ResultsFilterProps> = ({ 
  totalResults, 
  maxResultsToShow, 
  setMaxResultsToShow,
  darkMode = true
}) => {
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
        <label htmlFor="results-filter" className={`mr-2 text-sm font-medium ${darkMode ? 'text-amber-500' : 'text-amber-600'}`}>
          Show
        </label>
        <div className="relative">
          <select
            id="results-filter"
            value={maxResultsToShow}
            onChange={(e) => setMaxResultsToShow(Number(e.target.value))}
            className={`border text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 py-1 pl-3 pr-8 ${
              darkMode 
                ? 'bg-gray-800 border-amber-500/30 text-amber-500' 
                : 'bg-white border-amber-300 text-amber-600'
            }`}
            style={{ 
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
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  color: darkMode ? '#f59e0b' : '#d97706'
                }}
              >
                {num} results
              </option>
            ))}
          </select>
          <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${darkMode ? 'text-amber-500' : 'text-amber-600'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div className={`text-xs italic ${darkMode ? 'text-amber-500/70' : 'text-amber-600/80'}`}>
        Sorted by confidence score
      </div>
    </div>
  );
};

export default ResultsFilter; 