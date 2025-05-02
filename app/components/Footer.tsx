import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent mb-8"></div>
      
      <div className="container mx-auto text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <a 
            href="https://github.com/hash-noob/whiskygoogles.git" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-amber-500 hover:text-amber-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          
        </div>
        
        <p className="text-gray-400 text-sm">
          Built with{' '}
          <a 
            href="https://www.pinecone.io/?utm_source=whiskey-goggles&utm_medium=referral" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-amber-500 hover:text-amber-300 transition-colors"
          >
            Pinecone
          </a>
          ,{' '}
          <a 
            href="https://cloud.google.com/vertex-ai/generative-ai/docs/embeddings/get-multimodal-embeddings" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-amber-500 hover:text-amber-300 transition-colors"
          >
            Google Multimodal Embedding Model
          </a>
          , and our{' '}
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-amber-500 hover:text-amber-300 transition-colors"
          >
            Whiskey Database
          </a>
        </p>
        
        <p className="text-xs mt-4 text-gray-500">
          Disclaimer: Please drink responsibly. Must be 21+ to use this service.
        </p>
        
        <p className="text-gray-600 text-xs mt-2">
          © {new Date().getFullYear()} WhiskeyGoggles. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;