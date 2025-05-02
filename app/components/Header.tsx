import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="w-full py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo and Title on the left */}
          <div className="flex items-center">
            <div className="mr-3">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Liquid in bottle - amber color with opacity */}
                <path d="M9 22H15C16.1 22 17 21.1 17 20V13C17 11.9 16.1 11 15 11H9C7.9 11 7 11.9 7 13V20C7 21.1 7.9 22 9 22Z" fill="#F59E0B" fillOpacity="0.2" />
                
                {/* Bottle shape */}
                <path d="M9 22H15C16.1 22 17 21.1 17 20V13C17 11.9 16.1 11 15 11H9C7.9 11 7 11.9 7 13V20C7 21.1 7.9 22 9 22Z" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Bottle neck */}
                <path d="M10 11V6H14V11" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Bottle cap */}
                <path d="M10 6C10 4.9 10.9 4 12 4C13.1 4 14 4.9 14 6" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Goggles frame */}
                <path d="M7 13.5C6.2 13.5 5.5 14.2 5.5 15C5.5 15.8 6.2 16.5 7 16.5" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 13.5C17.8 13.5 18.5 14.2 18.5 15C18.5 15.8 17.8 16.5 17 16.5" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 15H7" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Liquid levels in bottle */}
                <path d="M9 18H15" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" strokeDasharray="1 1" />
                <path d="M9 16H15" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" strokeDasharray="1 1" />
                
                {/* Goggles lens reflection */}
                <circle cx="9" cy="15" r="1" fill="#F59E0B" fillOpacity="0.3" />
                <circle cx="15" cy="15" r="1" fill="#F59E0B" fillOpacity="0.3" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600 leading-relaxed py-1">
              WhiskeyGoggles
            </h1>
          </div>
          
          {/* Dark Mode Toggle on the right */}
          <div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={darkMode} 
                onChange={toggleDarkMode} 
              />
              <span className={`slider ${!darkMode ? 'bg-gray-300' : ''}`}>
                <svg className="sun text-amber-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
                <svg className="moon text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              </span>
            </label>
          </div>
        </div>
        
        <p className="mt-4 text-center text-lg text-amber-600 dark:text-amber-300">
          Upload a whiskey bottle image to identify & find similar options
        </p>
        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent mt-6"></div>
      </div>
    </header>
  );
};

export default Header; 