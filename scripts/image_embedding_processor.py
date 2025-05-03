import base64
import vertexai
from pinecone import Pinecone
import os
import time
import vertexai
from vertexai.vision_models import MultiModalEmbeddingModel
from vertexai.preview.vision_models import Image
import pandas as pd
from dotenv import load_dotenv
load_dotenv()

REGION = 'us-central1'
FILE_TYPE = 'image'
SUPPORTED_IMAGE_FORMATS = ('*.jpeg', '*.jpg', '*.png', '*.bmp', '*.gif')

import math
import requests
from PIL import Image as PILImage
from io import BytesIO

def getImage(image_url,idx):
    output_dir = 'downloaded_images'
    try:
        filename = f'image_{idx}.jpg'
        response = requests.get(image_url, stream=True)
        if response.status_code == 200:
            image_path = os.path.join(output_dir, filename)
            with open(image_path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"Downloaded: {filename}")
            return image_path
        else:
            print(f"Failed to download (status {response.status_code}): {url}")
    except Exception as e:
        print(f"Error downloading {image_url}: {e}")

def sanitize_metadata(metadata):
    clean_meta = {}
    for key, value in metadata.items():
        # Convert NaN, None to None, then skip it
        if value is None or (isinstance(value, float) and math.isnan(value)):
            continue
        clean_meta[key] = value
    return clean_meta


def process_image(row, idx, model, index, max_retries=5):
    """Process a single image and upload its embedding to Pinecone."""
    attempt = 0
    
    while attempt < max_retries:
        try:
            # Get local image path
            image_path = f"downloaded_images/image_{row['id']}.jpg"
            if not os.path.exists(image_path):
                raise ValueError(f"Image file not found: {image_path}")
                
            # Load and process image
            image = Image.load_from_file(image_path)
            embeddings = model.get_embeddings(image=image)
            print(f"Received embeddings for image {idx} ({idx}/{len(df)})")

            # Create vector for Pinecone
            vector = [{
                'id': str(row['id']),
                'values': embeddings.image_embedding,
                'metadata': sanitize_metadata({
                    "name": row["name"],
                    "abv": row["abv"],
                    "spirit_type": row["spirit_type"],
                    "popularity": row["popularity"],
                    "avg_msrp": row["avg_msrp"],
                    "shelf_price": row["shelf_price"],
                    "total_score": row["total_score"],
                })
            }]
            
            # Upload to Pinecone
            index.upsert(vector)
            print(f"Successfully processed and upserted image {idx} ({idx}/{len(df)})")
            break
            
        except Exception as e:
            print(f"Error processing image {idx}: {str(e)}")
            attempt += 1
            if attempt < max_retries:
                wait_time = 60  # Fixed wait time between retries
                print(f"Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
            else:
                print(f"Failed to process image {idx} after {max_retries} attempts")
                raise  # Re-raise the exception after all retries

def main(gc_project_id, image_dir, df):
    api_key = os.getenv('PINECONE_API_KEY')  # Pinecone API key
    google_credentials_base64 = os.getenv('GOOGLE_CREDENTIALS_BASE64')
    
    # Use a path in the current directory
    credentials_path = os.path.join(os.path.dirname(__file__), 'google-credentials.json')

    if google_credentials_base64:
        google_credentials = base64.b64decode(google_credentials_base64).decode('utf-8')
        with open(credentials_path, 'w') as f:
            f.write(google_credentials)
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path

    pc = Pinecone(api_key=api_key)
    index = pc.Index("image-vector")

    vertexai.init(project=gc_project_id, location=REGION)
    model = MultiModalEmbeddingModel.from_pretrained("multimodalembedding@001")

        
   
    for i, row in df.iterrows():
        if row['id'] == 27294:
            try:
                process_image(row, i+1, model, index)
            except Exception as e:
                print(f"Failed to process image {i+1}: {e}")
                continue  # Stop processing if an image fails

if __name__ == '__main__':
    excel_path = 'C:\\Users\\91891\\OneDrive\\Documents\\whisky_googles.xlsx'  # Replace with your actual file path
    df = pd.read_excel(excel_path)
    project = os.getenv('GOOGLE_CLOUD_PROJECT_ID')
    directory = './downloaded_images'
    main(project, directory,df)

"""
Setup Instructions:

1. Environment Variables:
   Set the following environment variables before running the script:

   a. GOOGLE_CREDENTIALS_BASE64
      Base64-encoded Google Cloud service account key JSON.
      To set this:
      - Get your service account key JSON file
      - Encode it to base64:
        $ base64 -i path/to/your/service-account-key.json | tr -d '\n'
      - Set the environment variable:
        $ export GOOGLE_CREDENTIALS_BASE64="<base64-encoded-string>"

   b. PINECONE_API_KEY
      Your Pinecone API key.
      $ export PINECONE_API_KEY="your-pinecone-api-key"

2. Install required Python packages:
   $ pip install vertexai pinecone-client

3. Setup Google Cloud authentication for your environment: https://cloud.google.com/vertex-ai/generative-ai/docs/embeddings/get-multimodal-embeddings#prereqs

4. Run the script:
   $ python image_embedding_processor.py -p your-gc-project-id -d /path/to/images -i your-pinecone-index-name

   Replace the placeholders with your actual values:
   - your-gc-project-id: Your Google Cloud project ID
   - /path/to/images: The local directory containing your images
   - your-pinecone-index-name: The name of your Pinecone index

Example command:
$ python image_embedding_processor.py -p my-gcp-project -d ./images -i my-pinecone-index

Notes:
- Ensure that your Google Cloud service account has the necessary permissions to use Vertex AI.
- The script supports the following image formats: jpeg, jpg, png, bmp, gif.
- The script uses exponential backoff for retrying failed operations, with a maximum of 5 attempts per image.
"""
