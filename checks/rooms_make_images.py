"""Make the test page's pictures from Marc's Gemini pictures (painted rooms thread).
Run from the repo root:  python3 checks/rooms_make_images.py
Rooms: 1180 and 2360 wide, WebP (q80) and JPEG (q78, for iPads older than iOS 14).
Cut-outs: WebP and PNG (PNG keeps the see-through edges on old iPads)."""
from PIL import Image
import os
SRC = 'proposals/pictures_gemini_test_2026-11-28/'
OUT = 'docs/rooms/img/'
os.makedirs(OUT, exist_ok=True)
rooms = {'docking_dark': '1_docking_bay_power_off', 'docking_lit': '3_docking_bay_power_on',
         'greenhouse': '4_greenhouse_own_room'}
for name, f in rooms.items():
    im = Image.open(SRC + f + '.webp').convert('RGB')
    for w in (1180, 2360):
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        r.save(OUT + f'{name}_{w}.webp', quality=80, method=6)
        r.save(OUT + f'{name}_{w}.jpg', quality=78, optimize=True, progressive=True)
things = {'cadet_front': 440, 'cadet_back': 440, 'cadet_left': 440, 'cadet_right': 440,
          'robot': 300, 'battery': 260, 'tin': 260, 'card': 240, 'book': 700}
for name, size in things.items():
    im = Image.open(SRC + 'cutouts/' + name + '.webp').convert('RGBA')
    s = size / max(im.size)
    if name.startswith('cadet'):
        s = size / im.height
    r = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    r.save(OUT + name + '.webp', quality=85, method=6)
    r.save(OUT + name + '.png', optimize=True)
for f in sorted(os.listdir(OUT)):
    print(f, os.path.getsize(OUT + f) // 1024, 'KB')
