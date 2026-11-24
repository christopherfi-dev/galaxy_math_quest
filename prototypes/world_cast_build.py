"""Makes prototypes/world_cast_sprites.js: Elder Thimble's and Pim's pictures from Gemini, cut out and ready for the game.   [Proposal, 24 November 2026]
Source pictures: content/art_test_2026-11-24/ (made by Marc in Gemini). Notes: proposals/GMQ_Character_Test_Results_v1_2026-11-24.md

For every frame (a whole-body picture of one feeling):
  - the background is cut away: white (flood from the corners, then the white closed inside a handle loop) or green (by colour, with the green tint taken off the edges)
  - a thicker dark outline is added round the whole figure, so it matches the line weight of the game's own drawings at game size
  - its anchor: the middle of the lid's knob (left and right) and the feet line (up and down; a jumping frame keeps its jump)
  - its eyes (white, round, in the face), for blinking in code, and the colour of the face around them
  - every frame of one character keeps one scale: the knob is the same size in every frame
Run:  python3 -I prototypes/world_cast_build.py      (also writes a check picture to the folder given as its first argument, if any)
"""
import base64, io, json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ART = os.path.join(HERE, '..', 'content', 'art_test_2026-11-24')
OUT = os.path.join(HERE, 'world_cast_sprites.js')
CHECK = sys.argv[1] if len(sys.argv) > 1 else None
INK = (14, 22, 38)

FRAMES = {   # character: [(frame name, file, figure number in the row (None: the only figure), background)]
    'elder': [('idle', 'thimble_1_sheet.png', 0, 'white'), ('happy', 'thimble_2_feelings.png', 0, 'white'), ('worried', 'thimble_2_feelings.png', 1, 'white'),
              ('thinking', 'thimble_2_feelings.png', 2, 'white'), ('surprised', 'thimble_2_feelings.png', 3, 'white')],
    'pim': [('idle', 'pim_5_sheet.png', 0, 'green'), ('sad', 'pim_6_feelings.png', 0, 'green'), ('joy', 'pim_6_feelings.png', 1, 'green'),
            ('secret', 'pim_6_feelings.png', 2, 'green'), ('excited', 'pim_6_feelings.png', 3, 'green'), ('spinner', 'pim_7_spinner.png', None, 'green')]}
IDLE_H = {'elder': 300, 'pim': 260}      # the idle frame's height in the sprite, in pixels (enough for an iPad's sharp screen)
OUTLINE = 4                               # extra outline, in sprite pixels

def flood_mask(rgb, seeds, thresh):
    """pixels connected to the seeds whose colour is within thresh of the seed's: True"""
    key = (255, 0, 254)
    k = Image.fromarray(rgb)
    for s in seeds:
        if tuple(np.array(k)[s[1], s[0]]) != key: ImageDraw.floodfill(k, s, key, thresh=thresh)
    a = np.array(k)
    return (a[:, :, 0] == 255) & (a[:, :, 1] == 0) & (a[:, :, 2] == 254)

def white_components(mask):
    """the separate pieces of a True/False mask (4-neighbour), each as (pixel count, centre x, centre y, box, mask of the piece)"""
    from collections import deque
    h, w = mask.shape; seen = np.zeros_like(mask, dtype=bool); out = []
    ys, xs = np.nonzero(mask)
    for y0, x0 in zip(ys.tolist(), xs.tolist()):
        if seen[y0, x0]: continue
        q = deque([(y0, x0)]); seen[y0, x0] = True; pts = []
        while q:
            y, x = q.popleft(); pts.append((y, x))
            for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]: seen[ny, nx] = True; q.append((ny, nx))
        pa = np.array(pts); comp = np.zeros_like(mask, dtype=bool); comp[pa[:, 0], pa[:, 1]] = True
        out.append((len(pa), float(pa[:, 1].mean()), float(pa[:, 0].mean()), (int(pa[:, 1].min()), int(pa[:, 0].min()), int(pa[:, 1].max()), int(pa[:, 0].max())), comp))
    return out

def cut(path, bg):
    rgb = np.array(Image.open(path).convert('RGB')); h, w, _ = rgb.shape; f = rgb.astype(float)
    if bg == 'green':
        R, G, B = f[:, :, 0], f[:, :, 1], f[:, :, 2]; m = np.maximum(R, B); ex = G - m
        alpha = np.clip(255 - (ex - 40) * 255 / 80, 0, 255); alpha[(G > 170) & (R < 110) & (B < 110)] = 0
        f[:, :, 1] = np.where(G > m, m + (G - m) * .15, G)
        return np.dstack([f, alpha]).astype(np.uint8)
    bgm = flood_mask(rgb, [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)], 40)
    alpha = np.where(bgm, 0, 255).astype(np.uint8)
    return np.dstack([rgb, alpha])

def figures(rgba):
    al = rgba[:, :, 3] > 40; cols = al.any(axis=0); runs = []; x = 0; W = len(cols)
    while x < W:
        if cols[x]:
            s = x
            while x < W and cols[x]: x += 1
            if x - s > 80: runs.append((s, x))
        else: x += 1
    out = []
    for s, e in runs:
        ys = np.nonzero(al[:, s:e].any(axis=1))[0]; out.append((s, int(ys[0]), e, int(ys[-1]) + 1))
    return out

def has_pupil(rgb, comp, box):
    """an eye: dark pixels held inside the white piece (white on at least three of their four sides). The dark rim of a crescent-shaped hole is not held."""
    x0, y0, x1, y1 = box; P = comp[y0:y1 + 1, x0:x1 + 1]; D = (rgb[y0:y1 + 1, x0:x1 + 1].max(axis=2) < 80) & ~P
    if P.sum() == 0: return False
    L = np.maximum.accumulate(P, axis=1); Rr = np.maximum.accumulate(P[:, ::-1], axis=1)[:, ::-1]
    U = np.maximum.accumulate(P, axis=0); Dn = np.maximum.accumulate(P[::-1, :], axis=0)[::-1, :]
    held = D & ((L.astype(int) + Rr + U + Dn) >= 3)
    return held.sum() > .04 * P.sum()

def holes_away(fig):
    """white closed inside a handle loop or between an arm and the body: white pieces whose middle is outside the face's middle band"""
    rgb = fig[:, :, :3].astype(int); a = fig[:, :, 3]; h, w = a.shape
    white = (a > 0) & (rgb.min(axis=2) >= 246) & ((rgb.max(axis=2) - rgb.min(axis=2)) <= 8)
    for n, cx, cy, box, comp in white_components(white):
        if n < 30: continue
        if has_pupil(rgb, comp, box): continue                    # an eye: it keeps its white
        if cx < w * .38 or cx > w * .62 or n > 60:                  # white closed in, with no pupil: a hole in a handle or under an arm
            grown = np.array(Image.fromarray((comp * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))) > 0
            light = (rgb.min(axis=2) > 165) & ((rgb.max(axis=2) - rgb.min(axis=2)) < 40)      # its pale, half-white rim
            fig[:, :, 3][comp | (grown & light)] = 0
    return fig

def find_knob(fig):
    rgb = fig[:, :, :3].astype(int); a = fig[:, :, 3] > 100; h, w = a.shape
    R, G, B = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    y = (R > 205) & (G > R * .76) & (B < 160) & (R - B > 80) & a        # gold, not light copper (copper's green is under 0.72 of its red)
    y[int(h * .35):, :] = False
    pieces = [p for p in white_components(y) if p[0] > 40]
    if not pieces: return w / 2, w * .1
    n, cx, cy, box, comp = min(pieces, key=lambda p: p[3][1])          # the highest gold piece: the knob
    return float((box[0] + box[2]) / 2), float(box[2] - box[0])

def find_eyes(fig):
    rgb = fig[:, :, :3].astype(int); a = fig[:, :, 3]; h, w = a.shape
    white = (a > 200) & (rgb.min(axis=2) >= 240) & ((rgb.max(axis=2) - rgb.min(axis=2)) <= 14)
    eyes = []
    for n, cx, cy, box, comp in white_components(white):
        x0, y0, x1, y1 = box; bw, bh = x1 - x0 + 1, y1 - y0 + 1
        if n < h * w * .001 or n > h * w * .04: continue
        if not (.15 * w < cx < .85 * w and .15 * h < cy < .7 * h): continue
        if not (.5 < bw / bh < 1.9): continue
        if not has_pupil(rgb, comp, box): continue           # an eye has a pupil; a shine, a hole or a wisp of beard does not
        eyes.append((cx, cy, bw / 2, bh / 2))
    eyes.sort(key=lambda e: -e[2] * e[3]); eyes = sorted(eyes[:2], key=lambda e: e[0])
    lid = None
    if len(eyes) == 2:
        mx = int((eyes[0][0] + eyes[1][0]) / 2); my = int((eyes[0][1] + eyes[1][1]) / 2)
        patch = rgb[max(0, my - 6):my + 6, max(0, mx - 6):mx + 6].reshape(-1, 3); lid = '#%02x%02x%02x' % tuple(int(v) for v in np.median(patch, axis=0))
    elif len(eyes) == 1:
        e = eyes[0]; px = rgb[int(e[1]), min(w - 1, int(e[0] + e[2] * 1.6))]; lid = '#%02x%02x%02x' % tuple(int(v) for v in px)
    return eyes, lid

def outline(img, t):
    pad = t * 2; c = Image.new('RGBA', (img.width + pad * 2, img.height + pad * 2), (0, 0, 0, 0)); c.paste(img, (pad, pad), img)
    al = c.split()[3].point(lambda v: 255 if v > 110 else 0).filter(ImageFilter.MaxFilter(t * 2 + 1))
    ink = Image.new('RGBA', c.size, INK + (255,)); ink.putalpha(al); ink.alpha_composite(c); return ink, pad

def png64(img):
    b = io.BytesIO(); img.quantize(colors=200, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).save(b, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode(), len(b.getvalue())

data, check_tiles, total = {}, [], 0
for ch, frames in FRAMES.items():
    cache, raw = {}, {}
    for name, fn, idx, bg in frames:
        if fn not in cache:
            rgba = cut(os.path.join(ART, fn), bg); cache[fn] = (rgba, figures(rgba))
        rgba, figs = cache[fn]
        box = figs[idx] if idx is not None else figs[0] if len(figs) == 1 else (min(f[0] for f in figs), min(f[1] for f in figs), max(f[2] for f in figs), max(f[3] for f in figs))
        ground = max(f[3] for f in figs)                          # the row's feet line: a jump stays a jump
        fig = rgba[box[1]:box[3], box[0]:box[2]].copy()
        if bg == 'white': fig = holes_away(fig)
        kx, kw = find_knob(fig); eyes, lid = find_eyes(fig)
        raw[name] = dict(fig=fig, kx=kx, kw=kw, eyes=eyes, lid=lid, lift=ground - box[3])
    idle = raw['idle']; base_scale = IDLE_H[ch] / idle['fig'].shape[0]
    data[ch] = {'h': IDLE_H[ch], 'frames': {}}
    for name, r in raw.items():
        s = base_scale * idle['kw'] / r['kw'] if r['kw'] > 4 else base_scale
        s = max(base_scale * .3, min(base_scale * 2, s))         # a knob read wrongly must not blow a frame up (the spinner picture is drawn more than twice as large)
        im = Image.fromarray(r['fig'], 'RGBA'); im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
        im, pad = outline(im, OUTLINE)
        ax = r['kx'] * s + pad; ay = im.height - pad + r['lift'] * s     # the feet line, in sprite pixels
        eyes = [[round(e[0] * s + pad, 1), round(e[1] * s + pad, 1), round(e[2] * s, 1), round(e[3] * s, 1)] for e in r['eyes']]
        src, n = png64(im); total += n
        data[ch]['frames'][name] = {'src': src, 'w': im.width, 'h': im.height, 'ax': round(ax, 1), 'ay': round(ay, 1), 'eyes': eyes, 'lid': r['lid'] or '#c9793a'}
        print(f'{ch:6} {name:9} {im.width}x{im.height}  knob {r["kw"]:.0f}px  scale {s:.3f}  eyes {len(eyes)}  lift {r["lift"]}  {n // 1024} KB')
        if CHECK:
            t = im.copy(); d = ImageDraw.Draw(t)
            for e in eyes: d.ellipse([e[0] - e[2], e[1] - e[3], e[0] + e[2], e[1] + e[3]], outline=(255, 0, 0), width=2)
            d.line([ax - 12, ay, ax + 12, ay], fill=(0, 120, 255), width=3); d.line([ax, ay - 12, ax, ay], fill=(0, 120, 255), width=3)
            bgc = Image.new('RGBA', t.size, (96, 170, 92, 255)); bgc.alpha_composite(t); check_tiles.append((f'{ch} {name}', bgc))

with open(OUT, 'w') as fh:
    fh.write('/* Elder Thimble and Pim, cut out from Marc\'s Gemini pictures by prototypes/world_cast_build.py. Do not edit by hand. [Proposal, 24 November 2026] */\n')
    fh.write('const CAST_SPRITES = ' + json.dumps(data, separators=(',', ':')) + ';\n')
print(f'wrote {os.path.relpath(OUT)}: {total // 1024} KB of pictures')
if CHECK:
    W = sum(t.width for _, t in check_tiles[:6]) + 70; H = max(t.height for _, t in check_tiles) * 2 + 60
    sheet = Image.new('RGB', (max(W, 1200), H), 'white'); x = y = 10; row = 0
    for i, (n, t) in enumerate(check_tiles):
        if i == 5 and row == 0: x, y, row = 10, H // 2, 1
        sheet.paste(t.convert('RGB'), (x, y + 16)); ImageDraw.Draw(sheet).text((x, y), n, fill=(0, 0, 0)); x += t.width + 12
    sheet.save(os.path.join(CHECK, 'cast_check.png')); print('check picture:', os.path.join(CHECK, 'cast_check.png'))
