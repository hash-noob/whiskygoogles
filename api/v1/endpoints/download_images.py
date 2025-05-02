import os
import csv
import json
import requests
import concurrent.futures
from tqdm import tqdm
from fastapi import APIRouter, HTTPException

router = APIRouter()

# Path to the dataset CSV file
DATASET_PATH = os.path.join(os.getcwd(), "dataset", "501 Bottle Dataset.csv")

# Target directory for downloaded images within the app's public folder for frontend access
PUBLIC_DIR = os.path.join(os.getcwd(), "public", "downloaded_images")

# Path for the metadata JSON file
METADATA_PATH = os.path.join(os.getcwd(), "public", "whisky_metadata.json")

def ensure_dir_exists(directory):
    """Create directory if it doesn't exist"""
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"Created directory: {directory}")

def download_image(row):
    """Download a single image from the CSV row data"""
    try:
        whisky_id = row['id']
        image_url = row['image_url']
        
        # Skip if no image URL is provided
        if not image_url:
            return {
                "id": whisky_id,
                "success": False,
                "error": "No image URL provided"
            }
        
        # Define the target path for this image
        target_path = os.path.join(PUBLIC_DIR, f"image_{whisky_id}.jpg")
        
        # Skip if file already exists locally
        if os.path.exists(target_path):
            return {
                "id": whisky_id,
                "success": True,
                "message": "Image already exists, skipped"
            }
        
        # Download the image
        response = requests.get(image_url, stream=True, timeout=30)
        response.raise_for_status()
        
        # Save to public folder
        with open(target_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        return {
            "id": whisky_id,
            "success": True,
            "message": f"Downloaded image for whisky ID {whisky_id}"
        }
        
    except Exception as e:
        return {
            "id": whisky_id if 'whisky_id' in locals() else "unknown",
            "success": False,
            "error": str(e)
        }

def save_metadata(whisky_data):
    """Save whisky metadata to a JSON file for frontend use"""
    try:
        # Create a dictionary with whisky IDs as keys for quick lookup
        metadata = {}
        for row in whisky_data:
            whisky_id = row['id']
            # Convert numeric fields to appropriate types
            metadata[whisky_id] = {
                "id": whisky_id,
                "name": row['name'],
                "size": int(row['size']) if row['size'] and row['size'].isdigit() else None,
                "proof": float(row['proof']) if row['proof'] and row['proof'].replace('.', '', 1).isdigit() else None,
                "abv": float(row['abv']) if row['abv'] and row['abv'].replace('.', '', 1).isdigit() else None,
                "spirit_type": row['spirit_type'],
                "brand_id": row['brand_id'],
                "popularity": int(row['popularity']) if row['popularity'] and row['popularity'].isdigit() else None,
                "image_url": row['image_url'],
                "avg_msrp": float(row['avg_msrp']) if row['avg_msrp'] and row['avg_msrp'].replace('.', '', 1).isdigit() else None,
                "fair_price": float(row['fair_price']) if row['fair_price'] and row['fair_price'].replace('.', '', 1).isdigit() else None,
                "shelf_price": float(row['shelf_price']) if row['shelf_price'] and row['shelf_price'].replace('.', '', 1).isdigit() else None,
                "total_score": int(row['total_score']) if row['total_score'] and row['total_score'].isdigit() else None,
                "ranking": int(row['ranking']) if row['ranking'] and row['ranking'].isdigit() else None,
                "wishlist_count": int(row['wishlist_count']) if row['wishlist_count'] and row['wishlist_count'].isdigit() else None,
                "vote_count": int(row['vote_count']) if row['vote_count'] and row['vote_count'].isdigit() else None,
                "bar_count": int(row['bar_count']) if row['bar_count'] and row['bar_count'].isdigit() else None
            }
        
        # Save metadata to JSON file
        with open(METADATA_PATH, 'w', encoding='utf-8') as json_file:
            json.dump(metadata, json_file, indent=2)
        
        print(f"Saved metadata for {len(metadata)} whiskies to {METADATA_PATH}")
        return True
    except Exception as e:
        print(f"Error saving metadata: {str(e)}")
        return False

@router.get("/download/all-images")
async def download_all_images():
    """Download all images from the dataset CSV file and save metadata"""
    try:
        # Ensure the target directory exists
        ensure_dir_exists(PUBLIC_DIR)
        
        # Check if the dataset file exists
        if not os.path.exists(DATASET_PATH):
            raise HTTPException(status_code=404, detail=f"Dataset file not found at {DATASET_PATH}")
        
        # Read the dataset
        whisky_data = []
        with open(DATASET_PATH, 'r', encoding='utf-8') as csv_file:
            reader = csv.DictReader(csv_file)
            whisky_data = list(reader)
        
        if not whisky_data:
            raise HTTPException(status_code=404, detail="No data found in dataset file")
        
        print(f"Found {len(whisky_data)} whisky entries in the dataset")
        
        # Save metadata to JSON file
        save_metadata(whisky_data)
        
        # Download images in parallel
        results = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            future_to_row = {executor.submit(download_image, row): row for row in whisky_data}
            
            # Use tqdm for progress bar
            for future in tqdm(concurrent.futures.as_completed(future_to_row), total=len(whisky_data)):
                results.append(future.result())
        
        # Summarize results
        successful = sum(1 for result in results if result['success'])
        failed = len(results) - successful
        failed_ids = [result['id'] for result in results if not result['success']]
        
        return {
            "message": "Image download complete",
            "total_images": len(whisky_data),
            "successful": successful,
            "failed": failed,
            "metadata_saved": os.path.exists(METADATA_PATH),
            "failed_ids": failed_ids[:100] if len(failed_ids) > 100 else failed_ids  # Limit failed IDs in response
        }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error downloading images: {str(e)}")

@router.get("/download/image/{image_id}")
async def download_single_image(image_id: str):
    """Download a single image by whisky ID"""
    try:
        # Ensure the target directory exists
        ensure_dir_exists(PUBLIC_DIR)
        
        # Check if the dataset file exists
        if not os.path.exists(DATASET_PATH):
            raise HTTPException(status_code=404, detail=f"Dataset file not found at {DATASET_PATH}")
        
        # Find the whisky data in the CSV
        target_row = None
        all_data = []
        with open(DATASET_PATH, 'r', encoding='utf-8') as csv_file:
            reader = csv.DictReader(csv_file)
            all_data = list(reader)
            for row in all_data:
                if row['id'] == image_id:
                    target_row = row
                    break
        
        if not target_row:
            raise HTTPException(status_code=404, detail=f"Whisky with ID {image_id} not found in dataset")
        
        # Save metadata if it doesn't exist
        if not os.path.exists(METADATA_PATH):
            save_metadata(all_data)
        
        # Download the image
        result = download_image(target_row)
        
        if result['success']:
            return {
                "message": result['message'],
                "id": image_id,
                "path": f"/downloaded_images/image_{image_id}.jpg"
            }
        else:
            raise HTTPException(status_code=500, detail=f"Failed to download image: {result['error']}")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error downloading image: {str(e)}")

def main():
    """CLI entry point for running the script directly"""
    import asyncio
    
    # Ensure the target directory exists
    ensure_dir_exists(PUBLIC_DIR)
    
    # Run the download function
    print("Starting image download...")
    result = asyncio.run(download_all_images())
    
    print(f"\nDownload Summary:")
    print(f"- Total images: {result['total_images']}")
    print(f"- Successfully downloaded: {result['successful']}")
    print(f"- Failed: {result['failed']}")
    print(f"- Metadata saved: {result['metadata_saved']}")
    
    if result['failed'] > 0:
        print("\nFailed image IDs:")
        for failed_id in result['failed_ids'][:20]:  # Show only first 20 failed IDs
            print(f"- {failed_id}")
        
        if len(result['failed_ids']) > 20:
            print(f"... and {len(result['failed_ids']) - 20} more")

if __name__ == "__main__":
    main() 