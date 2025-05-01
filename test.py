import os
import json
import base64
from google.oauth2 import service_account
from google.cloud import storage

from dotenv import load_dotenv
load_dotenv()

# === Step 1: Load environment variables ===
GOOGLE_CREDENTIALS_BASE64 = os.getenv("GOOGLE_CREDENTIALS_BASE64")
GOOGLE_CLOUD_PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT_ID")

if not (GOOGLE_CREDENTIALS_BASE64 and GOOGLE_CLOUD_PROJECT_ID):
    raise EnvironmentError("Missing required environment variables.")

# === Step 2: Decode credentials and authenticate ===
service_account_info = json.loads(base64.b64decode(GOOGLE_CREDENTIALS_BASE64))
credentials = service_account.Credentials.from_service_account_info(service_account_info)
client = storage.Client(credentials=credentials, project=GOOGLE_CLOUD_PROJECT_ID)

# === Step 3: List all buckets ===
print("📦 Fetching buckets...")
buckets = list(client.list_buckets())

if not buckets:
    print("❌ No buckets found in the project.")
    exit()

# === Step 4: Explore and download images ===
downloaded = 0
for bucket in buckets:
    print(f"\n📁 Bucket: {bucket.name}")
    blobs = bucket.list_blobs()

    for blob in blobs:
        if blob.name.lower().endswith((".jpg", ".jpeg", ".png")):
            print(f"📥 Downloading: {blob.name}")

            # Create local folder if needed
            os.makedirs("downloads", exist_ok=True)
            local_path = os.path.join("downloads", os.path.basename(blob.name))

            # Download the image
            blob.download_to_filename(local_path)
            downloaded += 1

print(f"\n✅ Done! {downloaded} images downloaded to ./downloads/")
