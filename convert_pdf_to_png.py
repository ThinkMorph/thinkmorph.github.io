#!/usr/bin/env python3
"""
Convert PDF files to PNG for better web display
Requires: pip install pdf2image pillow
          brew install poppler (for pdf2image backend)
"""

import os
from pathlib import Path

try:
    from pdf2image import convert_from_path
    from PIL import Image
except ImportError:
    print("Required libraries not found. Install with:")
    print("pip install pdf2image pillow")
    print("brew install poppler")
    exit(1)

def convert_pdf_to_png(pdf_path, output_path=None, dpi=200):
    """Convert a PDF file to PNG"""
    if output_path is None:
        output_path = pdf_path.replace('.pdf', '.png')
    
    try:
        # Convert PDF to images
        images = convert_from_path(pdf_path, dpi=dpi, first_page=1, last_page=1)
        
        if images:
            # Save the first page as PNG
            images[0].save(output_path, 'PNG')
            print(f"✓ Converted: {Path(pdf_path).name} → {Path(output_path).name}")
            return True
    except Exception as e:
        print(f"✗ Error converting {Path(pdf_path).name}: {e}")
        return False

def main():
    # Get the images directory
    script_dir = Path(__file__).parent
    images_dir = script_dir / 'static' / 'images'
    
    if not images_dir.exists():
        print(f"Images directory not found: {images_dir}")
        return
    
    print(f"Converting PDF files in: {images_dir}\n")
    
    # Find all PDF files
    pdf_files = list(images_dir.glob('*.pdf'))
    
    if not pdf_files:
        print("No PDF files found.")
        return
    
    print(f"Found {len(pdf_files)} PDF files\n")
    
    # Convert each PDF
    success_count = 0
    for pdf_file in pdf_files:
        if convert_pdf_to_png(str(pdf_file)):
            success_count += 1
    
    print(f"\n{'='*50}")
    print(f"Conversion complete: {success_count}/{len(pdf_files)} files converted successfully")

if __name__ == '__main__':
    main()

