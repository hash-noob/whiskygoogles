import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
            <div className="mr-3 relative w-10 h-10">
              <Image 
                src="/images/logo.png" 
                alt="WhiskeyGoggles Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
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