"""Makes prototypes/world_cast_sprites.js: Elder Thimble's and Pim's pictures from Gemini, cut out and ready for the game.   [Proposal, 24 November 2026]
Source pictures: content/art_test_2026-11-24/ (made by Marc in Gemini). Notes: proposals/GMQ_Character_Test_Results_v1_2026-11-24.md

For every frame (a whole-body picture of one feeling):
  - the background is cut away: white (flood from the corners, then the white closed inside a handle loop) or green (by colour, with the green tint taken off the edges)
  - a thicker dark outline is added round the whole figure, so it matches the line weight of the game's own drawings at game size
  - its anchor: the middle of the lid's knob (left and right) and the feet line (up and down; a jumping frame keeps its jump)
  - its eyes (white, round, in the face), for blinking in code, and the colour of the face around them
  - every frame of one character keeps one scale: the knob is the same size in every frame
THE RILLFOLK (the Reach) [Proposal, 25 November 2026; prompts: proposals/GMQ_Character_Test_Rillfolk_v1_2026-11-25.md]: no knob, so
  - left and right: the middle of the two eyes (or, with no eyes found, the middle of the body)
  - scale: one scale for each picture, from the space between the eyes against the calm frame's (Gemini draws everyone in one picture the same size)
  - a character is built once its calm picture is in content/art_test_2026-11-25/ (until then the game draws its own); a feeling still to come shows the calm frame
Run:  python3 -I prototypes/world_cast_build.py      (also writes a check picture to the folder given as its first argument, if any)
      For a trial: CAST_RILL_ART=<folder of pictures> CAST_OUT=<sprites file> python3 -I prototypes/world_cast_build.py
"""
import base64, io, json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ART = os.path.join(HERE, '..', 'content', 'art_test_2026-11-24')
RILL_ART = os.environ.get('CAST_RILL_ART') or os.path.join(HERE, '..', 'content', 'art_test_2026-11-25')
OUT = os.environ.get('CAST_OUT') or os.path.join(HERE, 'world_cast_sprites.js')
CHECK = sys.argv[1] if len(sys.argv) > 1 else None
INK = (14, 22, 38)

FRAMES = {   # character: [(frame name, file, figure number in the row (None: the only figure), background)]
    'elder': [('idle', 'thimble_1_sheet.png', 0, 'white'), ('happy', 'thimble_2_feelings.png', 0, 'white'), ('worried', 'thimble_2_feelings.png', 1, 'white'),
              ('thinking', 'thimble_2_feelings.png', 2, 'white'), ('surprised', 'thimble_2_feelings.png', 3, 'white')],
    'pim': [('idle', 'pim_5_sheet.png', 0, 'green'), ('sad', 'pim_6_feelings.png', 0, 'green'), ('joy', 'pim_6_feelings.png', 1, 'green'),
            ('secret', 'pim_6_feelings.png', 2, 'green'), ('excited', 'pim_6_feelings.png', 3, 'green'), ('spinner', 'pim_7_spinner.png', None, 'green')],
    'mender': [('idle', 'mender_9_sheet.png', 0, 'green'), ('happy', 'mender_10_feelings.png', 0, 'green'), ('worried', 'mender_10_feelings.png', 1, 'green'),
               ('thinking', 'mender_10_feelings.png', 2, 'green'), ('surprised', 'mender_10_feelings.png', 3, 'green')]}
# the Rillfolk, by the game's own names for them (THINGS and the harbour scene); file names as Marc saves them
R12, R13, R14, R15, R16, R17, R18 = 'rill_12_keeper_sheet.png', 'rill_13_keeper_feelings.png', 'rill_14_baker.png', 'rill_15_weaver.png', 'rill_16_singer.png', 'rill_17_reach_calm.png', 'rill_18_reach_happy.png'
RILL = {
    'keeper2': [('idle', R12, 1), ('happy', R13, 0), ('worried', R13, 1), ('thinking', R13, 2), ('surprised', R13, 3)],
    'baker': [('idle', R14, 0), ('happy', R14, 1), ('worried', R14, 2), ('thinking', R14, 3)],
    'netmender': [('idle', R15, 0), ('happy', R15, 1), ('worried', R15, 2), ('thinking', R15, 3)],
    'singer': [('idle', R16, 0), ('sad', R16, 1), ('remember', R16, 2), ('sing', R16, 3)],
    'guard': [('idle', R17, 0), ('happy', R18, 0)], 'sp_stilt': [('idle', R17, 1), ('happy', R18, 1)], 'sp_reed': [('idle', R17, 2), ('happy', R18, 2)],
    'sp_mud': [('idle', R17, 3), ('happy', R18, 3)], 'rafter': [('idle', R17, 4), ('happy', R18, 4)]}
RILL_H = {'keeper2': 280, 'baker': 260, 'netmender': 260, 'singer': 250}      # the calm frame's height in the sprite, in pixels: enough for the harbour scene on an iPad's sharp screen.
MAP_H = 190       # the five on the map are drawn smaller there, so their pictures are smaller (a lighter page). How tall each stands in the game is set in the kit
PROPS = ['hat', 'apron', 'shawl', 'can', 'rod', 'reeds', 'basket', 'toolbox']      # picture 11, row by row
PROP_FILE = 'mender_11_things.png'
IDLE_H = {'elder': 300, 'pim': 260, 'mender': 260}      # the idle frame's height in the sprite, in pixels (enough for an iPad's sharp screen)
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

def find_lid(fig):
    """the lid's rim: the widest row between the knob and the handles (top 30%; lower, the handles stick out), as (middle x, rim y, half width, top of lid y)"""
    a = fig[:, :, 3] > 100; h, w = a.shape; best = (0, 0, 0)
    rows = [r for r in range(h) if a[r].any()]
    top = rows[0] if rows else 0
    for r in range(top, int(h * .30)):
        xs = np.nonzero(a[r])[0]
        if len(xs) and xs[-1] - xs[0] > best[0]: best = (xs[-1] - xs[0], r, (xs[0] + xs[-1]) / 2)
    return best[2], best[1], best[0] / 2, top

def copper_of(fig):
    rgb = fig[:, :, :3].astype(float); a = fig[:, :, 3] > 200; R, G, B = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    m = a & (R > 150) & (R - B > 70) & (G < R * .74) & (G > R * .45)
    return '#%02x%02x%02x' % tuple(int(v) for v in np.median(rgb[m], axis=0)) if m.any() else '#c9793a'

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
        raw[name] = dict(fig=fig, kx=kx, kw=kw, eyes=eyes, lid=lid, lift=ground - box[3], rim=find_lid(fig), copper=copper_of(fig))
    idle = raw['idle']; base_scale = IDLE_H[ch] / idle['fig'].shape[0]
    data[ch] = {'h': IDLE_H[ch], 'base': idle['copper'], 'frames': {}}
    for name, r in raw.items():
        s = base_scale * idle['kw'] / r['kw'] if r['kw'] > 4 else base_scale
        s = max(base_scale * .3, min(base_scale * 2, s))         # a knob read wrongly must not blow a frame up (the spinner picture is drawn more than twice as large)
        im = Image.fromarray(r['fig'], 'RGBA'); im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
        im, pad = outline(im, OUTLINE)
        ax = r['kx'] * s + pad; ay = im.height - pad + r['lift'] * s     # the feet line, in sprite pixels
        eyes = [[round(e[0] * s + pad, 1), round(e[1] * s + pad, 1), round(e[2] * s, 1), round(e[3] * s, 1)] for e in r['eyes']]
        src, n = png64(im); total += n
        rc = r['rim']; data[ch]['frames'][name] = {'src': src, 'w': im.width, 'h': im.height, 'ax': round(ax, 1), 'ay': round(ay, 1), 'eyes': eyes, 'lid': r['lid'] or '#c9793a',
            'rim': [round(rc[0] * s + pad, 1), round(rc[1] * s + pad, 1), round(rc[2] * s, 1), round(rc[3] * s + pad, 1)]}
        print(f'{ch:6} {name:9} {im.width}x{im.height}  knob {r["kw"]:.0f}px  scale {s:.3f}  eyes {len(eyes)}  lift {r["lift"]}  {n // 1024} KB')
        if CHECK:
            t = im.copy(); d = ImageDraw.Draw(t)
            for e in eyes: d.ellipse([e[0] - e[2], e[1] - e[3], e[0] + e[2], e[1] + e[3]], outline=(255, 0, 0), width=2)
            d.line([ax - 12, ay, ax + 12, ay], fill=(0, 120, 255), width=3); d.line([ax, ay - 12, ax, ay], fill=(0, 120, 255), width=3)
            bgc = Image.new('RGBA', t.size, (96, 170, 92, 255)); bgc.alpha_composite(t); check_tiles.append((f'{ch} {name}', bgc))

def find_eye_pair(fig):
    """the Rillfolk's two eyes: white pieces with a pupil, the pair most alike in size and height (a white hat, apron or shawl with a fold line is not an eye).
    Also the body's colour round the eyes, for the eyelids when they blink."""
    rgb = fig[:, :, :3].astype(int); a = fig[:, :, 3]; h, w = a.shape
    white = (a > 200) & (rgb.min(axis=2) >= 232) & ((rgb.max(axis=2) - rgb.min(axis=2)) <= 18)
    c = []
    for n, cx, cy, box, comp in white_components(white):
        x0, y0, x1, y1 = box; bw, bh = x1 - x0 + 1, y1 - y0 + 1
        if n < h * w * .0006 or n > h * w * .05: continue
        if not (.1 * w < cx < .9 * w and .08 * h < cy < .75 * h): continue
        if not (.45 < bw / bh < 2.2): continue
        if not has_pupil(rgb, comp, box): continue
        c.append((cx, cy, bw / 2, bh / 2, n))
    best = None
    for i in range(len(c)):
        for j in range(i + 1, len(c)):
            e1, e2 = c[i], c[j]; dx = abs(e1[0] - e2[0])
            if dx < (e1[2] + e2[2]) * .9 or dx > w * .6: continue
            score = abs(e1[4] - e2[4]) / max(e1[4], e2[4]) + abs(e1[1] - e2[1]) / h * 4
            if best is None or score < best[0]: best = (score, e1, e2)
    if not best: return [], None
    eyes = sorted([best[1][:4], best[2][:4]], key=lambda e: e[0])
    yy, xx = np.mgrid[0:h, 0:w]; ring = np.zeros((h, w), dtype=bool)
    for ex, ey, rx, ry in eyes:
        d = ((xx - ex) / max(rx, 1)) ** 2 + ((yy - ey) / max(ry, 1)) ** 2; ring |= (d > 1.6) & (d < 3.2)
    body = ring & (a > 200) & (rgb.max(axis=2) > 90) & (rgb.min(axis=2) < 225)
    lid = '#%02x%02x%02x' % tuple(int(v) for v in np.median(rgb[body], axis=0)) if body.any() else None
    return eyes, lid

def body_mid(fig):
    """the middle of the body, left to right: the middle of the solid rows between a fifth and two thirds of the way down"""
    a = fig[:, :, 3] > 100; h, w = a.shape; xs = np.nonzero(a[int(h * .2):int(h * .67)])[1]
    return float(np.median(xs)) if len(xs) else w / 2

missing = {}
TOGETHER = {}      # characters drawn together in one picture keep their sizes from it (the tall Stilt Town speaker, the small child): one scale, from the tallest calm figure
for ch, frames in RILL.items():
    if frames[0][1] == R17 and os.path.exists(os.path.join(RILL_ART, R17)):
        rgba = cut(os.path.join(RILL_ART, R17), 'green'); TOGETHER['h'] = max(f[3] - f[1] for f in figures(rgba)); break
for ch, frames in RILL.items():
    have = lambda f: os.path.exists(os.path.join(RILL_ART, f))
    if not have(frames[0][1]): missing[ch] = sorted(set(f[1] for f in frames if not have(f[1]))); continue      # no calm picture yet: the game draws its own
    gone = sorted(set(f[1] for f in frames if not have(f[1])))
    if gone: missing[ch] = gone; frames = [f for f in frames if have(f[1])]      # a feeling whose picture is still to come: the calm frame shows instead
    files = sorted(set(f[1] for f in frames))
    raw, cache = {}, {}
    for name, fn, idx in frames:
        if fn not in cache:
            rgba = cut(os.path.join(RILL_ART, fn), 'green'); cache[fn] = (rgba, figures(rgba))
        rgba, figs = cache[fn]
        if idx >= len(figs): print(f'STOP: {fn} has {len(figs)} figures, not {idx + 1} or more. Look at the picture.'); sys.exit(1)
        box = figs[idx]; ground = max(f[3] for f in figs); fig = rgba[box[1]:box[3], box[0]:box[2]].copy()
        eyes, lid = find_eye_pair(fig)
        raw[name] = dict(fn=fn, fig=fig, eyes=eyes, lid=lid, lift=ground - box[3], mid=body_mid(fig),
                         d=(eyes[1][0] - eyes[0][0]) if len(eyes) == 2 else None, ex=(eyes[0][0] + eyes[1][0]) / 2 if len(eyes) == 2 else None)
    idle = raw['idle']; base_scale = MAP_H / TOGETHER['h'] if idle['fn'] == R17 and TOGETHER else RILL_H.get(ch, MAP_H) / idle['fig'].shape[0]
    ratio = {}      # one scale for each picture: the calm frame's eye spacing against this picture's (the median of its frames)
    for fn in files:
        rs = [idle['d'] / r['d'] for r in raw.values() if r['fn'] == fn and r['d'] and idle['d']]
        hs = [idle['fig'].shape[0] / r['fig'].shape[0] for r in raw.values() if r['fn'] == fn]
        ratio[fn] = 1.0 if fn == idle['fn'] else float(np.median(rs)) if rs else float(np.median(hs))
        ratio[fn] = max(.6, min(1.6, ratio[fn]))
    off = (idle['ex'] - idle['mid']) if idle['ex'] is not None else 0.0      # where the eyes sit from the body's middle, for a frame with closed eyes
    data[ch] = {'h': RILL_H.get(ch, MAP_H), 'folk': 'rill', 'frames': {}}
    if idle['fn'] == R17: data[ch]['ref'] = MAP_H      # the tallest of the five is MAP_H; the rest keep their sizes against it
    for name, r in raw.items():
        s = base_scale * ratio[r['fn']]
        im = Image.fromarray(r['fig'], 'RGBA'); im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
        im, pad = outline(im, OUTLINE)
        kx = r['ex'] if r['ex'] is not None else r['mid'] + off / ratio[r['fn']]
        ax = kx * s + pad; ay = im.height - pad + r['lift'] * s
        eyes = [[round(e[0] * s + pad, 1), round(e[1] * s + pad, 1), round(e[2] * s, 1), round(e[3] * s, 1)] for e in r['eyes']]
        src, n = png64(im); total += n
        data[ch]['frames'][name] = {'src': src, 'w': im.width, 'h': im.height, 'ax': round(ax, 1), 'ay': round(ay, 1), 'eyes': eyes, 'lid': r['lid'] or idle['lid'] or '#2f7fc0'}
        print(f'{ch:9} {name:9} {im.width}x{im.height}  eyes {len(eyes)}  scale {s:.3f} (picture {ratio[r["fn"]]:.2f})  lift {r["lift"]}  {n // 1024} KB')
        if CHECK:
            t = im.copy(); d = ImageDraw.Draw(t)
            for e in eyes: d.ellipse([e[0] - e[2], e[1] - e[3], e[0] + e[2], e[1] + e[3]], outline=(255, 0, 0), width=2)
            d.line([ax - 12, ay, ax + 12, ay], fill=(0, 120, 255), width=3); d.line([ax, ay - 12, ax, ay], fill=(0, 120, 255), width=3)
            bgc = Image.new('RGBA', t.size, (96, 170, 92, 255)); bgc.alpha_composite(t); check_tiles.append((f'{ch} {name}', bgc))
for ch, gone in missing.items(): print(f'{ch:9} waiting for: {", ".join(gone)}' + (' (calm until then)' if ch in data else ' (the game draws its own until then)'))

def pieces2d(rgba, step=8):
    """separate objects on one picture, row by row: found on a coarse grid, then cut at full size"""
    al = rgba[:, :, 3] > 60; h, w = al.shape; small = al[:h - h % step, :w - w % step].reshape(h // step, step, w // step, step).any(axis=(1, 3))
    small = np.array(Image.fromarray((small * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3))) > 0      # join thin parts (a fishing line)
    out = []
    for n, cx, cy, box, comp in white_components(small):
        if n < 20: continue
        x0, y0, x1, y1 = box; out.append((x0 * step, y0 * step, min(w, (x1 + 1) * step), min(h, (y1 + 1) * step)))
    rows = sorted(out, key=lambda b: b[1]); mid = (rows[0][1] + rows[-1][3]) / 2
    return sorted([b for b in out if (b[1] + b[3]) / 2 < mid], key=lambda b: b[0]) + sorted([b for b in out if (b[1] + b[3]) / 2 >= mid], key=lambda b: b[0])

props = {}
rgba = cut(os.path.join(ART, PROP_FILE), 'green'); boxes = pieces2d(rgba)
print('things found:', len(boxes))
for name, b in zip(PROPS, boxes):
    piece = rgba[b[1]:b[3], b[0]:b[2]].copy(); al = piece[:, :, 3] > 40; ys, xs = np.nonzero(al)
    piece = piece[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    im = Image.fromarray(piece, 'RGBA'); s = 200 / max(im.width, im.height); im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    im, pad = outline(im, 3); src, n = png64(im); total += n
    props[name] = {'src': src, 'w': im.width, 'h': im.height}
    print(f'thing  {name:8} {im.width}x{im.height}  {n // 1024} KB')
    if CHECK:
        bgc = Image.new('RGBA', im.size, (96, 170, 92, 255)); bgc.alpha_composite(im); check_tiles.append(('thing ' + name, bgc))

with open(OUT, 'w') as fh:
    fh.write('/* Elder Thimble and Pim' + (', the Mender crowd and the Rillfolk' if any(c in data for c in RILL) else '') + ', cut out from Marc\'s Gemini pictures by prototypes/world_cast_build.py. Do not edit by hand. [Proposal, 24 November 2026] */\n')
    fh.write('const CAST_SPRITES = ' + json.dumps(data, separators=(',', ':')) + ';\n')
    fh.write('const CAST_PROPS = ' + json.dumps(props, separators=(',', ':')) + ';\n')
print(f'wrote {os.path.relpath(OUT)}: {total // 1024} KB of pictures')
if CHECK:      # every frame and thing on one sheet, wrapped into rows
    MAXW, x, y, rowh, places = 2000, 10, 10, 0, []
    for n, t in check_tiles:
        if x + t.width > MAXW: x, y, rowh = 10, y + rowh + 26, 0
        places.append((n, t, x, y)); x += t.width + 12; rowh = max(rowh, t.height)
    sheet = Image.new('RGB', (MAXW, y + rowh + 40), 'white')
    for n, t, x, y in places: sheet.paste(t.convert('RGB'), (x, y + 16)); ImageDraw.Draw(sheet).text((x, y), n, fill=(0, 0, 0))
    sheet.save(os.path.join(CHECK, 'cast_check.png')); print('check picture:', os.path.join(CHECK, 'cast_check.png'))
