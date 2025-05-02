import React, { useState, useCallback, useRef } from 'react';
import Image from 'next/image';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, isUploading }) => {
  const [dragging, setDragging] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Wrap handleFile in useCallback
  const handleFile = useCallback((file: File) => {
    // Only process image files
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileSelected(file);
    }
  }, [onFileSelected]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  }, [handleFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`upload-area cursor-pointer ${dragging ? 'active' : ''} ${isUploading ? 'opacity-70 pointer-events-none' : ''} p-4`}
      >
        {preview ? (
          <div className="relative w-full max-w-xs mx-auto aspect-square max-h-48 overflow-hidden rounded-lg">
            <Image 
              src={preview} 
              alt="Preview" 
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="rounded-lg object-contain"
            />
            {!isUploading && (
              <button 
                onClick={removePreview} 
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="text-amber-600 dark:text-amber-500 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-amber-600 dark:text-amber-500 mb-2 text-center">Upload a Whiskey Bottle Image</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center text-xs mb-3">
              Drag &amp; drop your image here, or click to browse
            </p>
            <div className="w-full max-w-xs mx-auto bg-amber-100 dark:bg-amber-500/10 p-2 rounded-lg border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs">
              <p className="text-center mb-1">We&apos;ll identify the whiskey and find similar options</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-amber-600 dark:text-amber-400/80">
                <li>Ensure label is visible in frame</li>
                <li>Max file size: 4.5MB</li>
              </ul>
            </div>
            <p className="text-gray-600 dark:text-gray-500 text-xs mt-3 text-center">Supports: JPG, PNG, GIF, JPEG</p>
          </>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="spinner border-3 border-t-transparent border-amber-500 rounded-full w-10 h-10 mx-auto mb-3"></div>
              <p className="text-amber-500 font-medium text-sm">Processing...</p>
              <div className="w-40 mt-3 mx-auto">
                <div className="progress-bar"></div>
              </div>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </div>
  );
};

export default FileUpload; 