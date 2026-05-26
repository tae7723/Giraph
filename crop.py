import os
from PIL import Image

image_path = r"d:\해달\2026 해달 해커톤\mood-tracker\design\giraffe face emoji.png"
output_dir = r"d:\해달\2026 해달 해커톤\mood-tracker\public\images"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

img = Image.open(image_path)
width, height = img.size
print(f"Image size: {width}x{height}")

# Since there are 5 columns, each face has roughly width / 5 width
box_width = width / 5

# Let's crop each one
names = ["giraffe_sad", "giraffe_tired", "giraffe_neutral", "giraffe_smile", "giraffe_happy"]

for i in range(5):
    left = i * box_width
    right = (i + 1) * box_width
    top = 0
    bottom = height
    
    # Crop the box
    cropped = img.crop((left, top, right, bottom))
    
    # Save it
    out_path = os.path.join(output_dir, f"{names[i]}.png")
    cropped.save(out_path)
    print(f"Saved {out_path}")
