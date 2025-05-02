import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

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

interface WhiskeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  whiskey: WhiskyMetadata;
  darkMode: boolean;
}

const WhiskeyModal: React.FC<WhiskeyModalProps> = ({ isOpen, onClose, whiskey, darkMode }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Removed the body overflow hidden to allow scrolling
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
      <div 
        ref={modalRef}
        className={`relative max-w-lg w-full rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className={`p-4 flex justify-between items-center border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {whiskey.name}
          </h2>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full hover:bg-opacity-10 ${
              darkMode 
                ? 'hover:bg-white text-gray-400 hover:text-white' 
                : 'hover:bg-gray-800 text-gray-600 hover:text-gray-800'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Image */}
            <div className="w-full sm:w-1/3 flex justify-center">
              <div className={`rounded-lg overflow-hidden aspect-[3/4] w-48 ${
                darkMode ? 'bg-gray-900' : 'bg-gray-100'
              }`}>
                <Image 
                  src={`/downloaded_images/image_${whiskey.id}.jpg`} 
                  alt={whiskey.name} 
                  width={192}
                  height={256}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-3 ${
                darkMode ? 'text-amber-400' : 'text-amber-600'
              }`}>
                Whiskey Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                <DetailItem 
                  label="Name" 
                  value={getWhiskeyValue(whiskey.name)} 
                  darkMode={darkMode}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                />
                <DetailItem 
                  label="Spirit Type" 
                  value={getWhiskeyValue(whiskey.spirit_type)} 
                  darkMode={darkMode}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  }
                />
                <DetailItem 
                  label="ABV" 
                  value={getWhiskeyValue(whiskey.abv, val => `${val}%`)} 
                  darkMode={darkMode}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  }
                />
                <DetailItem 
                  label="Proof" 
                  value={getWhiskeyValue(whiskey.proof, val => `${val}°`)} 
                  darkMode={darkMode}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  }
                />
                <DetailItem 
                  label="Brand ID" 
                  value={getWhiskeyValue(whiskey.brand_id)} 
                  darkMode={darkMode}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-17.5 0V12a9 9 0 007.5 9.5M12 17.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" />
                    </svg>
                  }
                />
                <DetailItem 
                  label="Ranking" 
                  value={getWhiskeyValue(whiskey.ranking, val => `#${val}`)} 
                  darkMode={darkMode}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  }
                />
              </div>

              <h3 className={`text-lg font-semibold mt-6 mb-3 ${
                darkMode ? 'text-amber-400' : 'text-amber-600'
              }`}>
                Pricing Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                <DetailItem 
                  label="Average MSRP" 
                  value={getWhiskeyValue(whiskey.avg_msrp, val => `$${Number(val).toFixed(2)}`)} 
                  darkMode={darkMode}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
                <DetailItem 
                  label="Fair Price" 
                  value={getWhiskeyValue(whiskey.fair_price, val => `$${Number(val).toFixed(2)}`)} 
                  darkMode={darkMode}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
                <DetailItem 
                  label="Shelf Price" 
                  value={getWhiskeyValue(whiskey.shelf_price, val => `$${Number(val).toFixed(2)}`)} 
                  darkMode={darkMode}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  }
                />
              </div>

              <h3 className={`text-lg font-semibold mt-6 mb-3 ${
                darkMode ? 'text-amber-400' : 'text-amber-600'
              }`}>
                Popularity Stats
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                <DetailItem 
                  label="Wishlist Count" 
                  value={getWhiskeyValue(whiskey.wishlist_count)} 
                  darkMode={darkMode}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  }
                />
                <DetailItem 
                  label="Vote Count" 
                  value={getWhiskeyValue(whiskey.vote_count)} 
                  darkMode={darkMode}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  }
                />
                <DetailItem 
                  label="Bar Count" 
                  value={getWhiskeyValue(whiskey.bar_count)} 
                  darkMode={darkMode}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                    </svg>
                  }
                />
                {/* <DetailItem 
                  label="Total Score" 
                  value={getWhiskeyValue(whiskey.total_score, val => `${val}/100`)} 
                  darkMode={darkMode}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  }
                /> */}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 flex justify-end border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper component for detail items with icons
const DetailItem: React.FC<{
  label: string; 
  value: string; 
  darkMode: boolean;
  icon?: React.ReactNode;
}> = ({ label, value, darkMode, icon }) => (
  <div className="flex items-start">
    {icon && (
      <div className={`mr-2 mt-0.5 ${
        darkMode ? 'text-amber-500' : 'text-amber-600'
      }`}>
        {icon}
      </div>
    )}
    <div>
      <p className={`text-sm ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {label}
      </p>
      <p className={`text-base font-medium ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {value}
      </p>
    </div>
  </div>
);

// Get all whiskey data with fallbacks for missing values
const getWhiskeyValue = (value: any, formatter?: (val: any) => string): string => {
  if (value === undefined || value === null) return 'N/A';
  return formatter ? formatter(value) : String(value);
};

export default WhiskeyModal; 