# Whisky Goggles

Whisky Goggles is an AI-powered application that helps users identify whiskey bottles through image recognition. Simply upload a photo of a whiskey bottle, and the app will match it against a database of 500+ whiskeys, providing detailed information about the closest matches.

![Whisky Goggles Logo](public/images/logo.png)

## Features

- **Image Recognition**: Upload images of whiskey bottles to find matching products
- **Whiskey Database**: Access details on 500+ whiskey bottles with accurate metadata
- **Top Matches**: View the top matching whiskey bottles with similarity scores
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Choose your preferred theme

## Technology Stack

### Frontend
- Next.js 13 (React framework)
- TypeScript
- Tailwind CSS
- Axios for API requests

### Backend
- FastAPI (Python)
- Pinecone Vector Database for similarity search
- Google Vertex AI for image embedding generation
- Python libraries:
  - Pillow for image processing
  - Requests for API communication

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- pip (Python package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/whisky-goggles.git
   cd whisky-goggles
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Download whiskey images (required for the frontend):
   ```bash
   cd whiskygoogles
   python -m api.v1.endpoints.download_images
   ```
   This will download all whiskey bottle images and create a metadata JSON file.

### Configuration

1. Create a `.env` file in the project root with the necessary credentials:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_ENVIRONMENT=your_pinecone_environment
   PINECONE_INDEX_NAME=your_pinecone_index_name
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
│   │   ├── ResultsList.tsx   # Search results display
│   │   └── ...               # Other UI components
│   ├── page.tsx              # Main application page
│   └── ...                   # Other app files
├── api/                      # FastAPI backend
│   ├── v1/                   # API version 1
│   │   └── endpoints/        # API endpoint definitions
│   │       ├── image.py      # Image search endpoint
│   │       └── download_images.py # Image downloading utility
│   ├── config.py             # API configuration
│   └── index.py              # FastAPI application entry point
├── public/                   # Static files
│   ├── downloaded_images/    # Downloaded whiskey bottle images
│   └── whisky_metadata.json  # Whiskey metadata
└── dataset/                  # Contains whiskey dataset CSV
```

## Using the Application

1. **Upload an Image**: Click on the upload area or drag and drop an image of a whiskey bottle.
2. **View Results**: The application will show the top matching whiskeys with similarity scores.
3. **Explore Details**: Each match displays information like name, type, ABV%, and size.

## Image Download Utility

The application includes a utility to download whiskey bottle images from the provided dataset:

```bash
python -m api.v1.endpoints.download_images
```

For more details, see [README_IMAGE_DOWNLOAD.md](README_IMAGE_DOWNLOAD.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Whiskey database courtesy of a comprehensive 501-bottle dataset
- Built with Next.js, FastAPI, and Pinecone vector database 