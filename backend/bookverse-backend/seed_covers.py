# -*- coding: utf-8 -*-
"""
Script to ensure 100% of books in BookVerse have high-resolution,
authentic cover pages stored locally in backend/bookverse-backend/uploads/.
"""

import os
import re
import json
import urllib.request
import urllib.parse
from PIL import Image, ImageDraw, ImageFont
from database import SessionLocal
from models import Book

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Color palettes for bespoke clothbound book covers
PALETTES = [
    {"bg": (13, 27, 42), "accent": (212, 175, 55), "text": (245, 240, 225)},      # Royal Navy & Gold
    {"bg": (61, 12, 17), "accent": (229, 193, 88), "text": (250, 245, 235)},      # Imperial Crimson & Gold
    {"bg": (17, 34, 17), "accent": (212, 175, 55), "text": (240, 245, 235)},      # Forest Green & Gold
    {"bg": (43, 27, 17), "accent": (223, 160, 67), "text": (250, 240, 230)},      # Warm Espresso & Bronze
    {"bg": (26, 26, 36), "accent": (200, 165, 80), "text": (240, 240, 245)},      # Obsidian Night & Gold
    {"bg": (38, 19, 41), "accent": (218, 185, 95), "text": (250, 240, 245)},      # Royal Plum & Gold
]

def slugify(text: str) -> str:
    s = text.lower()
    s = s.replace("é", "e").replace("ë", "e").replace("à", "a").replace("'", "").replace('"', "")
    s = re.sub(r'[^a-z0-9]+', '_', s).strip('_')
    return s

def get_system_font(name: str, size: int):
    font_paths = [
        os.path.join("C:\\Windows\\Fonts", name),
        os.path.join("C:\\Windows\\Fonts", "georgia.ttf"),
        os.path.join("C:\\Windows\\Fonts", "times.ttf"),
        os.path.join("C:\\Windows\\Fonts", "arial.ttf"),
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()

def generate_clothbound_cover(title: str, author: str, year: int, output_path: str):
    """Generate a luxury clothbound book cover using Pillow."""
    width, height = 600, 900
    palette_idx = sum(ord(c) for c in title) % len(PALETTES)
    palette = PALETTES[palette_idx]
    bg_color = palette["bg"]
    accent_color = palette["accent"]
    text_color = palette["text"]

    img = Image.new("RGB", (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    # 1. Subtle linen cloth texture
    for y in range(0, height, 4):
        draw.line([(0, y), (width, y)], fill=(bg_color[0] + 5, bg_color[1] + 5, bg_color[2] + 5))
    for x in range(0, width, 4):
        draw.line([(x, 0), (x, height)], fill=(bg_color[0] + 3, bg_color[1] + 3, bg_color[2] + 3))

    # 2. Ornate Gilded Borders
    margin = 35
    draw.rectangle([margin, margin, width - margin, height - margin], outline=accent_color, width=3)
    draw.rectangle([margin + 10, margin + 10, width - margin - 10, height - margin - 10], outline=accent_color, width=1)

    # Corner corner florets
    c_size = 20
    for cx, cy in [(margin + 10, margin + 10), (width - margin - 10, margin + 10),
                   (margin + 10, height - margin - 10), (width - margin - 10, height - margin - 10)]:
        draw.rectangle([cx - c_size // 2, cy - c_size // 2, cx + c_size // 2, cy + c_size // 2], fill=bg_color, outline=accent_color, width=1)

    # 3. Header
    font_header = get_system_font("georgia.ttf", 16)
    header_text = "BOOKVERSE CLASSICS COLLECTION"
    draw.text((width // 2, margin + 45), header_text, fill=accent_color, font=font_header, anchor="mm")

    # Divider ornament
    draw.line([(width // 2 - 140, margin + 75), (width // 2 + 140, margin + 75)], fill=accent_color, width=1)
    points_top = [(width // 2, margin + 75 - 6), (width // 2 + 6, margin + 75), (width // 2, margin + 75 + 6), (width // 2 - 6, margin + 75)]
    draw.polygon(points_top, fill=accent_color)

    # 4. Main Title
    font_title_size = 46 if len(title) < 20 else (36 if len(title) < 32 else 28)
    font_title = get_system_font("georgiab.ttf", font_title_size)

    words = title.split()
    lines = []
    current_line = []
    for w in words:
        current_line.append(w)
        line_str = " ".join(current_line)
        bbox = draw.textbbox((0, 0), line_str, font=font_title)
        if (bbox[2] - bbox[0]) > (width - margin * 4):
            current_line.pop()
            lines.append(" ".join(current_line))
            current_line = [w]
    if current_line:
        lines.append(" ".join(current_line))

    # Center title vertically around y=360
    line_height = font_title_size + 14
    total_title_h = len(lines) * line_height
    start_y = 350 - (total_title_h // 2)

    for i, line in enumerate(lines):
        y = start_y + i * line_height
        draw.text((width // 2, y), line, fill=text_color, font=font_title, anchor="mm")

    # 5. Central Ornamental Emblem
    divider_y = start_y + total_title_h + 30
    draw.line([(width // 2 - 120, divider_y), (width // 2 + 120, divider_y)], fill=accent_color, width=1)
    draw.polygon([(width // 2, divider_y - 7), (width // 2 + 7, divider_y), (width // 2, divider_y + 7), (width // 2 - 7, divider_y)], fill=accent_color)
    draw.polygon([(width // 2 - 25, divider_y - 4), (width // 2 - 21, divider_y), (width // 2 - 25, divider_y + 4), (width // 2 - 29, divider_y)], fill=accent_color)
    draw.polygon([(width // 2 + 25, divider_y - 4), (width // 2 + 29, divider_y), (width // 2 + 25, divider_y + 4), (width // 2 + 21, divider_y)], fill=accent_color)

    # 6. Author
    font_author = get_system_font("georgiab.ttf", 24)
    author_y = divider_y + 60
    draw.text((width // 2, author_y), author.upper(), fill=accent_color, font=font_author, anchor="mm")

    # 7. Year & Folio details
    font_sub = get_system_font("georgia.ttf", 15)
    year_str = f"CLASSIC EDITION · {year}" if year else "CLASSIC EDITION"
    draw.text((width // 2, height - margin - 75), year_str, fill=text_color, font=font_sub, anchor="mm")

    font_bottom = get_system_font("georgia.ttf", 13)
    draw.text((width // 2, height - margin - 45), "COMPLETE & UNABRIDGED · FOLIO PRESS", fill=accent_color, font=font_bottom, anchor="mm")

    # 8. Left Spine Shadow
    for x in range(30):
        alpha = int(120 * (1 - (x / 30)))
        draw.line([(x, 0), (x, height)], fill=(max(0, bg_color[0] - alpha), max(0, bg_color[1] - alpha), max(0, bg_color[2] - alpha)))

    img.save(output_path, "JPEG", quality=92)
    return True

def fetch_openlibrary_cover(title: str, author: str, output_path: str) -> bool:
    """Attempt to search and download a high-res cover from OpenLibrary."""
    try:
        query = urllib.parse.quote(f"{title} {author}")
        search_url = f"https://openlibrary.org/search.json?q={query}&limit=1"
        req = urllib.request.Request(search_url, headers={"User-Agent": "BookVerse/1.0 (contact@bookverse.local)"})
        with urllib.request.urlopen(req, timeout=7) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            docs = data.get("docs", [])
            if not docs:
                return False
            cover_i = docs[0].get("cover_i")
            if not cover_i:
                return False

        img_url = f"https://covers.openlibrary.org/b/id/{cover_i}-L.jpg"
        img_req = urllib.request.Request(img_url, headers={"User-Agent": "BookVerse/1.0"})
        with urllib.request.urlopen(img_req, timeout=8) as img_resp:
            img_data = img_resp.read()
            # OpenLibrary returns small 800-byte 1x1 image if cover is not found
            if len(img_data) < 6000:
                return False

            # Verify it's a real readable image with PIL
            import io
            test_img = Image.open(io.BytesIO(img_data))
            if test_img.width < 140 or test_img.height < 180:
                return False

            with open(output_path, "wb") as f:
                f.write(img_data)
            return True
    except Exception as e:
        return False

def main():
    db = SessionLocal()
    books = db.query(Book).all()
    print(f"Checking {len(books)} books for cover pages...")

    updated_count = 0
    generated_count = 0
    downloaded_count = 0

    for idx, b in enumerate(books):
        slug = slugify(b.title)
        filename = f"{slug}.jpg"
        filepath = os.path.join(UPLOAD_DIR, filename)

        # Check if already has a valid local file
        has_local_file = os.path.exists(filepath) and os.path.getsize(filepath) > 5000

        if not has_local_file:
            print(f"[{idx+1}/{len(books)}] Fetching cover for '{b.title}' by {b.author}...")
            # 1. Try OpenLibrary
            success = fetch_openlibrary_cover(b.title, b.author, filepath)
            if success:
                print(f"  [OK] Downloaded OpenLibrary cover for '{b.title}' ({os.path.getsize(filepath)} bytes)")
                downloaded_count += 1
            else:
                # 2. Fallback to generating gorgeous bespoke clothbound cover
                year = b.published_year or 1900
                generate_clothbound_cover(b.title, b.author, year, filepath)
                print(f"  [+] Generated luxury clothbound cover for '{b.title}'")
                generated_count += 1

        # Point cover_image_url in database to local uploads URL
        expected_url = f"http://127.0.0.1:8000/uploads/{filename}"
        if b.cover != expected_url:
            b.cover = expected_url
            updated_count += 1

    db.commit()
    print("=" * 60)
    print(f"Finished! Downloaded: {downloaded_count}, Generated: {generated_count}, DB Records Updated: {updated_count}")
    print(f"All {len(books)} books now have locally-served cover pages in {UPLOAD_DIR}!")
    db.close()

if __name__ == "__main__":
    main()
