import re
import requests
import os
import time

# Open CSS file
with open('all.css', 'r') as f:
    css_content = f.read()

# Use regex to get every font url
font_urls = re.findall(r'webfonts/fa-[(\w*\-)|(\d*)]*.\w+', css_content)

# Create a directory to store downloaded fonts
if not os.path.exists('webfonts'):
    os.makedirs('webfonts')


# Download each font
unique = []
for font_url in font_urls:
    if font_url not in unique:
        unique.append(font_url)

for font_url in unique:
    # does the font already exist?
    if os.path.exists(f'webfonts/{os.path.basename(font_url)}'):
        print(f"Skipping {font_url}... (# {unique.index(font_url) + 1} of {len(unique)})")
        continue

    print(f"Downloading {font_url}... (# {unique.index(font_url) + 1} of {len(unique)})")
    response = requests.get(f'https://site-assets.fontawesome.com/releases/v6.4.0/{font_url}')
    
    # If the request is successful, save the font
    if response.status_code == 200:
        with open(f'webfonts/{os.path.basename(font_url)}', 'wb') as f:
            f.write(response.content)
    else:
        print(f"Failed to download {font_url}")
    
    time.sleep(.3)

print("Fonts downloaded successfully.")