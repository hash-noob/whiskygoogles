from PIL import Image
import os

# Input and output directories
input_folder = "C:\\Users\\91891\\OneDrive\\Desktop\\Shop-the-look\\sample-apps\\shop-the-look\\public\\downloaded_images"
output_folder = "./compressed_images"
quality = 70  # Adjust from 1 (worst) to 95 (best) for JPGs

# Create output folder if not exists
os.makedirs(output_folder, exist_ok=True)

# Loop through each image in the input folder
for filename in os.listdir(input_folder):
    if filename.lower().endswith((".jpg", ".jpeg", ".png")):
        image_path = os.path.join(input_folder, filename)
        output_path = os.path.join(output_folder, filename)

        with Image.open(image_path) as img:
            img = img.convert("RGB")  # Convert to RGB to avoid issues with PNGs
            img.save(output_path, optimize=True, quality=quality)

        print(f"Compressed: {filename} → {output_path}")
