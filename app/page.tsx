"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { track } from '@vercel/analytics';

// Components
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import Footer from './components/Footer';
import DisclaimerBanner from './components/DisclaimerBanner';
// Handles Python backend API URL based on the environment
const API_URL = "https://whiskygoogles.onrender.com";

interface Result {
  score: number;
  metadata: {
    id: string;
    file_type: 'image';
  };
}

export default function Home() {
  const [results, setResults] = useState<Result[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [totalVectors, setTotalVectors] = useState<number | null>(null);
  const [isSearchComplete, setIsSearchComplete] = useState<boolean>(false);
  const [searchTime, setSearchTime] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingResults, setIsLoadingResults] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Determine if we should show the side-by-side layout (results exist and not loading)
  const showSideBySide = results.length > 0 && !isLoadingResults;

  useEffect(() => {
    // Check if user has a preferred theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      // Check if user has a preferred system theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    // Save theme preference
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const fetchTotalVectors = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/index/info`);
        setTotalVectors(response.data.total_vectors);
      } catch (error) {
        console.error('Error fetching total vectors:', error);
      }
    };

    fetchTotalVectors();

    // Track page view
    const pageViewData = {
      timestamp: new Date().toISOString(),
      screenSize: `${window.screen.width}x${window.screen.height}`,
      deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      browserName: navigator.userAgent,
      loadTime: performance.now(),
      theme: darkMode ? 'dark' : 'light'
    };
    track('page_viewed', pageViewData);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const saveSearchToHistory = (query: string, type: 'text' | 'image', imageFile?: File) => {
    try {
      const savedHistory = localStorage.getItem('whiskeySearchHistory') || '[]';
      const history = JSON.parse(savedHistory);
      
      // Add new search to history  
      const newItem = {
        id: Date.now().toString(),
        query,
        type,
        timestamp: Date.now(),
        imageFile
      };

      // Limit history to 20 items
      const updatedHistory = [newItem, ...history].slice(0, 20);
      localStorage.setItem('whiskeySearchHistory', JSON.stringify(updatedHistory));
    } catch (error) { 
      console.error('Error saving search history:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file (JPG, PNG, GIF)');
      return;
    }

    const allowedFormats = ['bmp', 'gif', 'jpeg', 'png', 'jpg'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedFormats.includes(fileExtension)) {
      setErrorMessage(`We don't support this image format: ${fileExtension || 'unknown'}. Please upload an image in one of the following formats: ${allowedFormats.join(', ')}.`);
      return;
    }

    setIsUploading(true);
    setIsSearchComplete(false);
    setSearchTime(null);
    setErrorMessage(null);
    setIsLoadingResults(true);

    const startTime = Date.now();

    try {
      const formData = new FormData();
      formData.append('file', file);
      console.log(file);

      const response = await axios.post(`${API_URL}/api/search/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      const endTime = Date.now();
      setResults(response.data.results);
      setSearchTime(endTime - startTime);
      track('image_search', {
        fileType: 'image',
        fileName: file.name,
        fileSize: file.size
      });
      setIsSearchComplete(true);
      saveSearchToHistory(file.name, 'image', file);
    } catch (error) {
      console.error('Error during file upload:', error);
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(`Oops! ${error.response.data.detail || 'An unexpected error occurred'}`);
      } else {
        setErrorMessage('Oops! An unexpected error occurred. Our engineers have been notified.');
      }
    } finally {
      setIsSearching(false);
      setIsUploading(false);
      setIsLoadingResults(false);
    }
  };

  const handleTextSearch = async (query: string) => {
    if (!query.trim()) {
      setErrorMessage('Please enter a search term');
      return;
    }

    setIsSearching(true);
    setIsSearchComplete(false);
    setSearchTime(null);
    setErrorMessage(null);
    setIsLoadingResults(true);
    const startTime = Date.now();

    try {
      const response = await axios.get(`${API_URL}/api/search/text?query=${query}`);

      const endTime = Date.now();
      setResults(response.data.results);
      setSearchTime(endTime - startTime);
      track('text_search', {
        searchTerm: query
      });
      setIsSearchComplete(true);
      saveSearchToHistory(query, 'text');
    } catch (error) {
      console.error('Error during text search:', error);
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(`Oops! ${error.response.data.detail || 'An unexpected error occurred'}`);
      } else {
        setErrorMessage('Oops! An unexpected error occurred. Our engineers have been notified.');
      }
    } finally {
      setIsSearching(false);
      setIsLoadingResults(false);
    }
  };

  const handleSelectHistory = (query: string, imageFile?: File) => {
    if (imageFile) {
      handleFileUpload(imageFile);
    } else {
      handleTextSearch(query);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full">
      <div className="w-full max-w-[1440px] px-4 py-4 mx-auto">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <div className={`mt-6 ${showSideBySide ? 'lg:flex lg:gap-6' : 'max-w-4xl mx-auto'} layout-transition`}>
          {/* Upload Section - centered initially, left side when results show */}
          <div className={`${showSideBySide ? 'lg:w-4/12 lg:sticky lg:top-4' : 'w-full max-w-md mx-auto'} layout-transition`}>
            <div className="glass-morphism p-4 sm:p-6 rounded-2xl ">
              <SearchBar 
                onSearch={handleTextSearch} 
                isSearching={isSearching} 
                isDarkMode={darkMode}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              
              <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                <p>- or -</p>
              </div>
              
              <FileUpload onFileSelected={handleFileUpload} isUploading={isUploading} />
              
              {errorMessage && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg text-red-600 dark:text-red-400 text-center text-sm">
                  <p>{errorMessage}</p>
                </div>
              )}
              
              {isSearchComplete && searchTime !== null && totalVectors !== null && (
                <div className="mt-4 text-center text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg p-2 text-sm">
                  <p>
                    Searched {totalVectors.toLocaleString()} whiskeys in {(searchTime / 1000).toFixed(2)} seconds
                  </p>
                </div>
              )}
              
            </div>
          </div>
          
          {/* Results Section - below upload initially, right side on larger screens when results show */}
          <div className={`${showSideBySide ? 'lg:w-8/12 lg:mt-0 results-container' : 'w-full max-w-screen-lg'} mt-6 layout-transition mx-auto`}>
            <ResultsList results={results} isLoading={isLoadingResults} darkMode={darkMode} />
          </div>
        </div>
        
        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </main>
  );
}