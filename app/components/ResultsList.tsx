import React, { useState, useEffect } from 'react';
import ResultsFilter from './ResultsFilter';
import DisclaimerBanner from './DisclaimerBanner';
import WhiskeyModal from './WhiskeyModal';

interface Result {
  score: number;
  metadata: {
    id: string;
    file_type: 'image';
  };
}

interface WhiskyMetadata {
  id: string;
  name: string;
  size: number | null;
  proof: number | null;
  abv: number | null;
  spirit_type: string;
  brand_id: string;
  popularity: number | null;
  image_url: string;
  avg_msrp: number | null;
  fair_price: number | null;
  shelf_price: number | null;
  total_score: number | null;
  ranking: number | null;
  wishlist_count: number | null;
  vote_count: number | null;
  bar_count: number | null;
}

interface WhiskyMetadataMap {
  [key: string]: WhiskyMetadata;
}

interface ResultsListProps {
  results: Result[];
  isLoading: boolean;
  darkMode?: boolean;
}

const ResultsList: React.FC<ResultsListProps> = ({ results, isLoading, darkMode = true }) => {
  // State for controlling how many results to display
  const [maxResultsToShow, setMaxResultsToShow] = useState<number>(5);
  const [whiskyMetadata, setWhiskyMetadata] = useState<WhiskyMetadataMap>({});
  const [isMetadataLoading, setIsMetadataLoading] = useState<boolean>(false);
  const [selectedWhiskey, setSelectedWhiskey] = useState<WhiskyMetadata | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // Fetch whisky metadata on component mount
  useEffect(() => {
    async function fetchMetadata() {
      setIsMetadataLoading(true);
      try {
        const response = await fetch('/whisky_metadata.json');
        if (response.ok) {
          const data = await response.json();
          setWhiskyMetadata(data);
        } else {
          console.error('Failed to load whisky metadata');
        }
      } catch (error) {
        console.error('Error loading whisky metadata:', error);
      } finally {
        setIsMetadataLoading(false);
      }
    }
    
    fetchMetadata();
  }, []);
  
  // Ensure results are sorted by score (highest first)
  const sortedResults = [...results].sort((a, b) => b.score - a.score);
  
  // Show only the top N results based on user selection
  const topResults = sortedResults.slice(0, maxResultsToShow);
  
  const formatScore = (score: number): string => {
    return (score * 100).toFixed(1) + '%';
  };

  // Function to open modal with whiskey details
  const openWhiskeyDetails = (whiskyData: WhiskyMetadata) => {
    setSelectedWhiskey(whiskyData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-screen-lg mx-auto">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="animate-pulse result-card">
            <div className="bg-gray-800 h-48 w-full rounded-t-lg"></div>
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sortedResults.length === 0) {
    return null;
  }

  const resultText = topResults.length === 1 ? 'Match' : 'Matches';

  return (
    <>
      {/* Modal component moved outside main container */}
      {selectedWhiskey && (
        <WhiskeyModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          whiskey={selectedWhiskey} 
          darkMode={darkMode}
        />
      )}
      
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col mb-4">
          <h2 className="text-2xl font-bold text-center lg:text-left text-amber-600 dark:text-amber-500">
            Top Whiskey {resultText}
          </h2>
          <DisclaimerBanner minimal={true} />
        </div>
        
        <ResultsFilter 
          totalResults={sortedResults.length} 
          maxResultsToShow={maxResultsToShow} 
          setMaxResultsToShow={setMaxResultsToShow}
          darkMode={darkMode}
        />
        
        {/* Add max height and scrolling for many results */}
        <div className="lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {topResults.map((result, index) => {
              const whiskyId = result.metadata.id;
              const whiskyData = whiskyMetadata[whiskyId];
              
              return (
              <div key={`result-${index}`} className={`result-card shadow-md rounded-lg overflow-hidden flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className={`relative aspect-[3/4] max-h-60 flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <img 
                    src={`/downloaded_images/image_${result.metadata.id}.jpg`} 
                    alt={`Result ${index + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute top-0 left-0 bg-amber-500 text-black px-2 py-1 rounded-tr-lg rounded-bl-lg font-bold text-xs">
                    #{index + 1}
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <div className={`font-medium text-sm ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>Match Score</div>
                    <div className={`font-bold text-sm flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <div className={`h-2 w-14 rounded-full mr-2 overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div 
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" 
                          style={{ width: `${result.score * 100}%` }}
                        ></div>
                      </div>
                      {formatScore(result.score)}
                    </div>
                  </div>
                  
                  {/* Whiskey name */}
                  {whiskyData && (
                    <h3 className={`font-semibold text-sm truncate mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{whiskyData.name}</h3>
                  )}
                  
                  {/* Whiskey details section */}
                  <div className={`border-t pt-2 mt-2 flex-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`font-medium text-xs mb-2 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>Whiskey Details</h3>
                    <div className="grid grid-cols-2 gap-2 mt-1 w-full">
                      {whiskyData ? (
                        <>
                          <div className="flex items-start justify-between">
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Type:</p>
                            <p className={`text-xs font-medium text-right ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {whiskyData.spirit_type || 'Unknown'}
                            </p>
                          </div>
                          <div className="flex items-start justify-between">
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ABV:</p>
                            <p className={`text-xs font-medium text-right ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {whiskyData.abv ? `${whiskyData.abv}%` : 'N/A'}
                            </p>
                          </div>
                          <div className="flex items-start justify-between">
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Size:</p>
                            <p className={`text-xs font-medium text-right ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {whiskyData.size ? `${whiskyData.size}ml` : 'N/A'}
                            </p>
                          </div>
                          <div className="flex items-start justify-between">
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Rank:</p>
                            <p className={`text-xs font-medium text-right ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {whiskyData.ranking || 'N/A'}
                            </p>
                          </div>
                        </>
                      ) : (
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} col-span-2`}>
                          {isMetadataLoading ? 'Loading details...' : 'Metadata not available'}
                        </p>
                      )}
                    </div>
                    
                  </div>
                  
                  {/* Add back the View Details button */}
                  {whiskyData && (
                    <div className="mt-3 flex justify-end">
                      <button 
                        onClick={() => openWhiskeyDetails(whiskyData)}
                        className={`text-xs flex items-center ${
                          darkMode 
                          ? 'text-amber-500 hover:text-amber-400' 
                          : 'text-amber-600 hover:text-amber-700'
                        }`}
                      >
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsList; 