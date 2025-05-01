# Whisky Goggles Image Download

This document explains how to download the whiskey bottle images required for the Whisky Goggles application.

## Overview

The application requires whiskey bottle images to function properly. These images are stored at URLs specified in the dataset file (`dataset/501 Bottle Dataset.csv`). 

The `download_images.py` script provides an easy way to download these images to the correct location in the application's public folder.

## Option 1: Download Images via API Endpoint

If you have the application running, you can use the API endpoints to download images:

1. Start the application
2. Use one of the following API endpoints:
   - `GET /api/v1/download/all-images` - Download all images from the dataset
   - `GET /api/v1/download/image/{image_id}` - Download a specific image by ID

## Option 2: Run the Script Directly

You can run the script directly to download all images in one go:

1. Navigate to the application root directory
2. Activate your Python environment if needed
3. Run the script:

```bash
cd whiskygoogles
python -m api.v1.endpoints.download_images
```

This will download all images from the URLs in the dataset CSV file to the `public/downloaded_images` folder.

## What the Script Does

The script:

1. Reads the whiskey data from `dataset/501 Bottle Dataset.csv`
2. For each entry, downloads the image from the `image_url` field
3. Saves the images to `public/downloaded_images/image_[ID].jpg`
4. Handles errors gracefully and provides a summary of the download results

## Troubleshooting

If you encounter any issues:

1. Make sure the dataset CSV file exists at `dataset/501 Bottle Dataset.csv`
2. Ensure you have permissions to create the `public/downloaded_images` directory
3. Check your internet connection, as the script needs to download images from external URLs
4. If specific images fail to download, check if those URLs are still valid

## Integration with Frontend

The frontend expects images to be available at `/downloaded_images/image_[ID].jpg`. After running the script, the images will be correctly placed for the frontend to use them 