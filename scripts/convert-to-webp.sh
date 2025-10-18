#!/bin/bash

# Directory where your images are stored
IMG_DIR="assets/images"

# Check if the directory exists
if [ ! -d "$IMG_DIR" ]; then
  echo "❌ Directory '$IMG_DIR' not found."
  exit 1
fi

echo "🚀 Converting images in '$IMG_DIR' to WebP..."

# Loop through all .png / .jpg / .jpeg files in the directory
find "$IMG_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r file; do
  base="${file%.*}"
  webp_file="${base}.webp"

  # Skip conversion if WebP version already exists
  if [ -f "$webp_file" ]; then
    echo "⏩ Skipping '$file' (already converted)"
  else
    cwebp -q 85 "$file" -o "$webp_file" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
      echo "✅ Converted '$file' → '$webp_file'"
    else
      echo "❌ Failed to convert '$file'"
    fi
  fi
done

echo "✨ Conversion complete!"

