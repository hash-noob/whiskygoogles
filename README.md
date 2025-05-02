# <img src="public/images/logo.png" alt="WhiskeyGoggles Logo" width="25" height="25"> WhiskeyGoggles 

WhiskeyGoggles is an AI-powered whiskey identification and search application that helps users identify whiskey bottles through image recognition and text search. The app matches uploaded images or text queries against a comprehensive database of whiskeys, providing detailed information about the closest matches.

## Table of Contents

- [Key Features](#key-features)
- [Technical Highlights](#technical-highlights)
  - [Advanced AI Integration](#advanced-ai-integration)
  - [Modern Tech Stack](#modern-tech-stack)
  - [Performance Optimizations](#performance-optimizations)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Technical Architecture](#technical-architecture)
  - [Image Recognition Pipeline](#image-recognition-pipeline)
  - [Text Search Pipeline](#text-search-pipeline)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

## Key Features

- **Dual Search Capabilities**:
  - **Image Recognition**: Upload photos of whiskey bottles for instant identification
  - **Text Search**: Search by whiskey name or description
- **Detailed Whiskey Information**: View comprehensive details about each whiskey in a modal view
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Dark/Light Mode**: Seamless theme switching with consistent styling
- **Real-time Search Results**: Fast and accurate matching with similarity scores

## Technical Highlights

### Advanced AI Integration

- **Zero-shot Classification**: Utilizes CLIP (Contrastive Language-Image Pre-training) for accurate image recognition without prior training on whiskey images
- **Vector Search**: Implements Pinecone vector database for efficient similarity search
- **Google Vertex AI**: Leverages state-of-the-art multimodal embedding models for robust image understanding

### Modern Tech Stack

- **Frontend**:
  - Next.js 13 with TypeScript
  - Tailwind CSS for responsive design
  - React Icons for consistent iconography
  - Axios for API communication
- **Backend**:
  - FastAPI (Python) for high-performance API endpoints
  - Pinecone for vector similarity search
  - Google Cloud services for AI capabilities

### Performance Optimizations

- **Efficient Image Processing**: Optimized image handling with Pillow
- **Caching**: Local storage for search history and user preferences
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Progressive Loading**: Optimized image loading and lazy loading of components

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- pip (Python package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hash-noob/whiskygoogles.git
   cd whiskey-goggles
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Install backend dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file with the following:
   ```
   GOOGLE_CREDENTIALS_BASE64=your_google_cred_base64
   GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
   GOOGLE_CLOUD_PROJECT_LOCATION=your_google_cloud_project_location
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_INDEX_NAME=your_pinecone_index_name
   PINECONE_TOP_K=top_k_number_of_matches
   ```

### Running the Application

1. Start the backend server:

   ```bash
   cd whiskygoogles
   uvicorn api.index:app --reload
   ```

2. In a new terminal, start the frontend:

   ```bash
   cd whiskygoogles
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
whiskygoogles/
├── app/                      # Next.js app directory
│   ├── components/           # React components
│   │   ├── FileUpload.tsx    # Image upload component
│   │   ├── SearchBar.tsx     # Text search component
│   │   ├── ResultsList.tsx   # Search results display
│   │   ├── WhiskeyModal.tsx  # Detailed whiskey modal
│   │   └── ...               # Other UI components
│   ├── page.tsx              # Main application page
│   └── ...                   # Other app files
├── api/                      # FastAPI backend
│   ├── v1/                   # API version 1
│   │   └── endpoints/        # API endpoint definitions
│   │       ├── image.py      # Image search endpoint
│   │       ├── search.py     # Text search endpoint
│   │       └── ...           # Other endpoints
│   ├── config.py             # API configuration
│   └── index.py              # FastAPI application entry point
├── public/                   # Static files
│   ├── images/               # Application images
│   └── ...                   # Other static assets
└── dataset/                  # Contains whiskey dataset
```

## Technical Architecture

### Image Recognition Pipeline

1. **Image Upload**: User uploads an image of a whiskey bottle
2. **Preprocessing**: Image is processed and optimized for analysis
3. **Embedding Generation**: Google Vertex AI generates image embeddings
4. **Vector Search**: Pinecone performs similarity search against whiskey database
5. **Results Ranking**: Top matches are ranked by similarity score
6. **Response**: Detailed whiskey information is returned to the user

### Text Search Pipeline

1. **Query Processing**: User enters search text
2. **Embedding Generation**: Text is converted to vector embeddings
3. **Vector Search**: Pinecone performs similarity search
4. **Results Ranking**: Matches are ranked by relevance
5. **Response**: Relevant whiskey information is returned

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Google Cloud Platform for AI capabilities
- Pinecone for vector search infrastructure
- The whiskey community for their support and feedback
