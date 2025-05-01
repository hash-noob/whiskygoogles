import React, { useState, useEffect } from 'react';
import ResultsFilter from './ResultsFilter';
import DisclaimerBanner from './DisclaimerBanner';

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
}

interface WhiskyMetadataMap {
  [key: string]: WhiskyMetadata;
}

interface ResultsListProps {
  results: Result[];
  isLoading: boolean;
}

const ResultsList: React.FC<ResultsListProps> = ({ results, isLoading }) => {
  // State for controlling how many results to display
  const [maxResultsToShow, setMaxResultsToShow] = useState<number>(5);
  const [whiskyMetadata, setWhiskyMetadata] = useState<WhiskyMetadataMap>({});
  const [isMetadataLoading, setIsMetadataLoading] = useState<boolean>(false);
  
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
    <div className="max-w-screen-lg mx-auto">
      <div className="flex flex-col mb-4">
        <h2 className="text-2xl font-bold text-center lg:text-left text-amber-500">
          Top Whiskey {resultText}
        </h2>
        <DisclaimerBanner minimal={true} />
      </div>
      
      <ResultsFilter 
        totalResults={sortedResults.length} 
        maxResultsToShow={maxResultsToShow} 
        setMaxResultsToShow={setMaxResultsToShow} 
      />
      
      {/* Add max height and scrolling for many results */}
      <div className="lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {topResults.map((result, index) => {
            const whiskyId = result.metadata.id;
            const whiskyData = whiskyMetadata[whiskyId];
            //console.log(whiskyData);
            
            return (
            <div key={`result-${index}`} className="result-card">
              <div className="relative aspect-[3/4] max-h-60">
                <img 
                  src={`/downloaded_images/image_${result.metadata.id}.jpg`} 
                  alt={`Result ${index + 1}`}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute top-0 left-0 bg-amber-500 text-black px-2 py-1 rounded-tr-lg rounded-bl-lg font-bold text-xs">
                  #{index + 1}
                </div>
              </div>
              <div className="p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-amber-400 text-sm">Match Score</div>
                  <div className="text-white font-bold text-sm flex items-center">
                    <div className="h-2 w-14 bg-gray-700 rounded-full mr-2 overflow-hidden">
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
                  <h3 className="font-semibold text-white text-sm truncate mb-2">{whiskyData.name}</h3>
                )}
                
                {/* Whiskey details section */}
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <h3 className="font-medium text-amber-300 text-xs">Whiskey Details</h3>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    {whiskyData ? (
                      <>
                        <p className="text-xs text-gray-400">
                          Type: <span className="text-white">{whiskyData.spirit_type || 'Unknown'}</span>
                        </p>
                        <p className="text-xs text-gray-400">
                          ABV: <span className="text-white">{whiskyData.abv ? `${whiskyData.abv}%` : 'N/A'}</span>
                        </p>
                        <p className="text-xs text-gray-400">
                          Size: <span className="text-white">{whiskyData.size ? `${whiskyData.size}ml` : 'N/A'}</span>
                        </p>
                        <p className="text-xs text-gray-400">
                          Rank: <span className="text-white">{whiskyData.ranking || 'N/A'}</span>
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-400 col-span-2">
                        {isMetadataLoading ? 'Loading details...' : 'Metadata not available'}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 flex justify-end">
                  <a 
                    href={`/downloaded_images/image_${result.metadata.id}.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-500 hover:text-amber-400 flex items-center"
                  >
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
};

export default ResultsList; 