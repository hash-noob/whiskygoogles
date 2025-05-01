import React from 'react';

interface DisclaimerBannerProps {
  minimal?: boolean;
}

const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ minimal = false }) => {
  if (minimal) {
    return (
      <p className="text-xs text-amber-500/70 mt-2 mb-4 lg:text-left text-center">
        Note: Predictions are based on visual similarity and may occasionally be inaccurate.
      </p>
    );
  }
  
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 my-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 text-amber-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-amber-500">Accuracy Disclaimer</h3>
          <div className="mt-1 text-xs text-amber-400/80">
            <p>
              Our whiskey identification is based on visual similarity and may not always be accurate. 
              Results are presented in order of confidence score, but we recommend verifying with a whiskey expert 
              before making purchasing decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerBanner; 