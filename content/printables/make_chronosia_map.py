"""Makes the printable map of Chronosia and its field sheet.  [Source: Marc, 2026-11-20: "Maps of alien world with grid lines for them to practice
coordinate points, for them to use the ruler to measure things and measure distance and find the correct place."]
The map is the game's own map of Chronosia (CMAP in the game file), drawn so that 1 square is exactly 1 cm on A4 paper.
Grid lines run through the middle of each square, so every place sits on a point: (across, up).
Hidden places are left off on purpose: the Tortoise Grove, the stone ring, the fruit tree and every find.
Run:  python3 content/printables/make_chronosia_map.py      (writes the .html; the .pdf is printed from it by make_pdf.js)
Every answer on the key is worked out here, and the script stops if a ruler answer is too close to a half to be fair."""
import math, os, sys
CMAP = ['^^^^^^TTTTTTTT^^^^^^', '^^..Q....TTTTT....^^', '^...:....T.G.T...F.^', '^...:....TT.TT.....^', 'T...::::::::.......^', 'T..K:......:..H....T', 'T...:......::::....T',
        'T...:..............T', '~~~~=~~~~~~~~~~~~~~~', 'T...:.......^^.....T', 'T...::::S.....C..X.T', 'T..................T', 'TTTTTTTTTTTTTTTTTTTT']
W, H = 20, 13
pt = lambda col, row: (col + 1, H - row)                      # a square of the game -> a point on the paper map
PLACES = {'Clock Tower': pt(3, 5), 'Quake Station': pt(4, 1), 'Council Hall': pt(14, 5), 'Cougar Rock': pt(14, 10), 'Bridge': pt(4, 8), 'Your ship': pt(8, 10)}
def cm(a, b):
    (x1, y1), (x2, y2) = PLACES[a], PLACES[b]; return math.hypot(x2 - x1, y2 - y1)
def fair(d):                                                  # a ruler answer must not sit near a half centimetre
    f = d - math.floor(d); assert not (0.3 < f < 0.7), ('too close to a half', d); return round(d)
RULER = [('Clock Tower', 'Council Hall'), ('Clock Tower', 'Quake Station'), ('Bridge', 'Cougar Rock'), ('Your ship', 'Council Hall'), ('Your ship', 'Quake Station')]
ANS = {p: fair(cm(*p)) for p in RULER}
walk = (PLACES['Bridge'][0] + 6, PLACES['Bridge'][1] + 4)     # 6 cm east, 4 cm north of the bridge
assert CMAP[H - walk[1]][walk[0] - 1] == ':', 'the walk should end on the path'
south = (PLACES['Council Hall'][0], PLACES['Council Hall'][1] - 5); assert south == PLACES['Cougar Rock']

X = lambda x: 15 + (x - 1) * 10                                # millimetres
Y = lambda y: 10 + (H - y) * 10 + 5
svg = []
for row in range(H):
    for col in range(W):
        t = CMAP[row][col]; x0, y0 = 10 + col * 10, 10 + row * 10; cx, cy = x0 + 5, y0 + 5
        if t in '~=': svg.append(f'<rect x="{x0}" y="{y0+1}" width="10" height="8" fill="#cfe3f7"/>')
        if t in ':=QKHSC' and t != 'C': svg.append(f'<rect x="{x0}" y="{y0}" width="10" height="10" fill="#f6ecd0"/>') if t in ':' else None
        if t == '=': svg.append(f'<rect x="{x0+1.5}" y="{y0}" width="7" height="10" fill="#d9b98a" stroke="#6b4a22" stroke-width=".3"/>' + ''.join(f'<line x1="{x0+1.5}" y1="{y0+k}" x2="{x0+8.5}" y2="{y0+k}" stroke="#6b4a22" stroke-width=".25"/>' for k in (2.5, 5, 7.5)))
        if t == '^': svg.append(f'<path d="M{x0+1} {y0+9} L{cx-1} {y0+1.5} L{cx+1.5} {y0+5} L{cx+2.8} {y0+3.2} L{x0+9} {y0+9} Z" fill="#e3e1ee" stroke="#55506e" stroke-width=".35"/>')
        if t in 'TGF' : svg.append(f'<circle cx="{cx}" cy="{cy-.6}" r="3.4" fill="#d8ecd9" stroke="#3f7a56" stroke-width=".35"/><rect x="{cx-.5}" y="{cy+2.6}" width="1" height="1.8" fill="#6b4a22"/>')
# hidden things are drawn as plain ground or plain trees: G (the grove) and F (the fruit tree) look like any tree; X (the stone ring) is bare
svg.append(f'<path d="M10 {10+8*10+3} q5 -1.2 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0" fill="none" stroke="#7fa9d6" stroke-width=".3"/>')
for x in range(1, W + 1): svg.append(f'<line x1="{X(x)}" y1="10" x2="{X(x)}" y2="{10+H*10}" stroke="#8a93a8" stroke-width=".18"/><text x="{X(x)}" y="{10+H*10+5}" font-size="3.6" text-anchor="middle" font-weight="700">{x}</text>')
for y in range(1, H + 1): svg.append(f'<line x1="10" y1="{Y(y)}" x2="{10+W*10}" y2="{Y(y)}" stroke="#8a93a8" stroke-width=".18"/><text x="7" y="{Y(y)+1.3}" font-size="3.6" text-anchor="end" font-weight="700">{y}</text>')
svg.append(f'<rect x="10" y="10" width="{W*10}" height="{H*10}" fill="none" stroke="#17203a" stroke-width=".5"/>')
ICON = {'Clock Tower': '<rect x="-2" y="-9" width="4" height="10" fill="#ddd6f3" stroke="#17203a" stroke-width=".35"/><path d="M-2.8 -9 L0 -12.5 L2.8 -9 Z" fill="#ffb59f" stroke="#17203a" stroke-width=".35"/><circle cx="0" cy="-6" r="1.4" fill="#fff" stroke="#17203a" stroke-width=".3"/>',
        'Quake Station': '<path d="M-4 1 A4 4 0 0 1 4 1 Z" fill="#cfe1ee" stroke="#17203a" stroke-width=".35"/><path d="M-2.6 -.6 l1 -1.4 l1 1.8 l1 -2 l1 1.6" fill="none" stroke="#d8483a" stroke-width=".4"/><line x1="0" y1="-3" x2="0" y2="-5.5" stroke="#17203a" stroke-width=".35"/>',
        'Council Hall': '<rect x="-4.2" y="-4" width="8.4" height="5" fill="#f4efe0" stroke="#17203a" stroke-width=".35"/><path d="M-5 -4 L0 -7.5 L5 -4 Z" fill="#ddd6f3" stroke="#17203a" stroke-width=".35"/>' + ''.join(f'<rect x="{k}" y="-3.6" width=".8" height="4.4" fill="#8a7fb5"/>' for k in (-3.3, -1.4, .5, 2.4)),
        'Cougar Rock': '<ellipse cx="0" cy=".5" rx="4.4" ry="1.8" fill="#dcdae8" stroke="#17203a" stroke-width=".35"/><ellipse cx="-.3" cy="-2" rx="2.6" ry="1.3" fill="#f0c98a" stroke="#17203a" stroke-width=".3"/><circle cx="2.4" cy="-3" r="1.2" fill="#f0c98a" stroke="#17203a" stroke-width=".3"/>',
        'Bridge': '', 'Your ship': '<path d="M0 -8 C2 -5 1.8 -1 1.4 1 L-1.4 1 C-1.8 -1 -2 -5 0 -8 Z" fill="#fff" stroke="#17203a" stroke-width=".35"/><path d="M-1.6 -2 L-3.6 1.4 L-1.2 .6 Z M1.6 -2 L3.6 1.4 L1.2 .6 Z" fill="#e58a76" stroke="#17203a" stroke-width=".3"/>'}
for name, (x, y) in PLACES.items():
    svg.append(f'<g transform="translate({X(x)} {Y(y)})">{ICON[name]}<circle cx="0" cy="0" r=".9" fill="#17203a"/></g>')
    dy = 5.2 if name != 'Bridge' else -2.2; dx = 0 if name != 'Bridge' else 9
    svg.append(f'<text x="{X(x)+dx}" y="{Y(y)+dy}" font-size="3.1" text-anchor="middle" font-weight="700" paint-order="stroke" stroke="#fff" stroke-width="1.1">{name}</text>')
MAP = f'<svg xmlns="http://www.w3.org/2000/svg" width="220mm" height="150mm" viewBox="0 0 220 150" font-family="Verdana, Arial, sans-serif" fill="#17203a">{"".join(s for s in svg if s)}</svg>'
P = PLACES; q = lambda n: f'({P[n][0]}, {P[n][1]})'
html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Sara's Old Map of Chronosia</title><style>
@page {{ size: A4 landscape; margin: 9mm 12mm; }} * {{ box-sizing: border-box; }} body {{ margin: 0; font-family: Verdana, Arial, sans-serif; color: #17203a; font-size: 11.5pt; line-height: 1.35; }}
.page {{ page-break-after: always; }} .page:last-child {{ page-break-after: auto; }} h1 {{ font-size: 17pt; margin: 0 0 1mm; }} h2 {{ font-size: 12.5pt; margin: 3.5mm 0 1mm; }} p {{ margin: 0 0 1.5mm; }}
.top {{ display: flex; justify-content: space-between; align-items: baseline; gap: 8mm; }} .small {{ font-size: 9pt; color: #44506c; }} .name {{ white-space: nowrap; }}
.rule {{ display: flex; align-items: center; gap: 3mm; margin-top: 1mm; }} .rule i {{ display: block; width: 100mm; height: 0; border-top: .5mm solid #17203a; position: relative; }} .rule i::before, .rule i::after {{ content: ""; position: absolute; top: -2mm; height: 3.5mm; border-left: .5mm solid #17203a; }} .rule i::before {{ left: 0; }} .rule i::after {{ right: 0; }}
ol {{ margin: 0; padding-left: 7mm; }} li {{ margin-bottom: 2.6mm; }} .line {{ display: inline-block; min-width: 34mm; border-bottom: .3mm solid #17203a; }} .cols {{ display: grid; grid-template-columns: 1fr 1fr; gap: 0 12mm; }}
table {{ border-collapse: collapse; font-size: 10.5pt; }} td, th {{ border: .25mm solid #8a93a8; padding: 1.2mm 2.5mm; text-align: left; }} .box {{ border: .4mm solid #17203a; border-radius: 2mm; padding: 2.5mm 4mm; margin-top: 2mm; }}
</style></head><body>
<div class="page"><div class="top"><h1>Sara's Old Map of Chronosia</h1><span class="name">Timekeeper Cadet: <span class="line"></span></span></div>
<p class="small">Sara, the Senior Historian, drew this map long ago. Some places are not on it. A point is (across, up). The Clock Tower is at {q('Clock Tower')}.</p>
{MAP}
<div class="rule"><i></i><span class="small"><b>Check your print:</b> this line must be 10 cm long. If it is not, print again at 100%. &nbsp; <b>Scale:</b> 1 cm on the map is 100 steps on Chronosia.</span></div></div>
<div class="page"><div class="top"><h1>Field sheet: read the old map</h1><span class="name">Timekeeper Cadet: <span class="line"></span></span></div>
<p>You need the map, a ruler and a pencil. Measure from dot to dot. Give each length to the nearest centimetre.</p>
<div class="cols"><div><h2>A. Points</h2><ol>
<li>What is at (4, 8)? <span class="line"></span></li><li>What is at (15, 3)? <span class="line"></span></li><li>Write the point of the Quake Station. ( ___ , ___ )</li><li>Write the point of the Council Hall. ( ___ , ___ )</li><li>Write the point of your ship. ( ___ , ___ )</li></ol>
<h2>C. Find the place</h2><ol start="11">
<li>Start at the Bridge. Go 6 cm east. Then go 4 cm north. Write the point. ( ___ , ___ )<br>What are you standing on? <span class="line"></span></li>
<li>Start at the Council Hall. Go 5 cm south. What is there? <span class="line"></span></li>
<li>Sara says: "One place is not on my map. It is about 4 cm from the Council Hall, to the north-west." Mark the point. ( ___ , ___ ) Then go and look, in the game.</li></ol></div>
<div><h2>B. The ruler</h2><ol start="6">
<li>Clock Tower to Council Hall: <span class="line"></span> cm</li><li>Clock Tower to Quake Station: <span class="line"></span> cm</li><li>Bridge to Cougar Rock: <span class="line"></span> cm</li><li>Your ship to Council Hall: <span class="line"></span> cm</li>
<li>Which is farther from your ship: the Quake Station or the Council Hall? <span class="line"></span><br>How many steps farther? <span class="line"></span> steps</li></ol>
<div class="box"><b>Steps.</b> 1 cm on the map is 100 steps. How many steps is it from the Clock Tower to the Council Hall? <span class="line"></span> steps</div></div></div></div>
<div class="page"><h1>For the teacher: the key</h1>
<p class="small">Print the map page at 100% ("actual size"). Check the 10 cm line with a ruler before you copy it. Every answer below was worked out by the script that drew the map.</p>
<div class="cols"><div><h2>A. Points</h2><table><tr><th>1</th><td>Clock Tower</td></tr><tr><th>2</th><td>Cougar Rock</td></tr><tr><th>3</th><td>{q('Quake Station')}</td></tr><tr><th>4</th><td>{q('Council Hall')}</td></tr><tr><th>5</th><td>{q('Your ship')}</td></tr></table>
<h2>C. Find the place</h2><table><tr><th>11</th><td>({walk[0]}, {walk[1]}). On the path.</td></tr><tr><th>12</th><td>Cougar Rock</td></tr><tr><th>13</th><td>(12, 11): the Tortoise Grove. It is 3 across and 3 up from the Hall, which is {math.hypot(3, 3):.1f} cm. In the game it is hidden behind a gap in the trees. Leave this question off if you want the grove to stay a secret.</td></tr></table></div>
<div><h2>B. The ruler</h2><table><tr><th></th><th>Exact</th><th>Nearest cm</th></tr>
{''.join(f'<tr><th>{i+6}</th><td>{cm(*p):.1f} cm</td><td>{ANS[p]} cm</td></tr>' for i, p in enumerate(RULER[:4]))}
<tr><th>10</th><td colspan="2">The Quake Station: {ANS[RULER[4]]} cm against {ANS[RULER[3]]} cm. That is {ANS[RULER[4]] - ANS[RULER[3]]} cm, so {(ANS[RULER[4]] - ANS[RULER[3]]) * 100} steps farther.</td></tr>
<tr><th>Steps</th><td colspan="2">{ANS[RULER[0]]} cm, so {ANS[RULER[0]] * 100:,} steps</td></tr></table>
<p class="small" style="margin-top:3mm">Accept 1 cm either way on a slanted line. A ruler laid from dot to dot is the skill; the last millimetre is not.</p>
<h2>What this practises</h2><p class="small">Points on a grid, as in your station task 2-2. Measuring a length with a ruler and showing it in whole units (AERO 3.MD.4, in centimetres). A scale: one unit stands for 100.</p></div></div></div>
</body></html>"""
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'GMQ_Chronosia_Old_Map_v1.html'); open(out, 'w').write(html)
g = (PLACES['Council Hall'][0] - 3, PLACES['Council Hall'][1] + 3); assert g == pt(11, 2) and CMAP[2][11] == 'G'   # the grove is at pt(11, 2) = (12, 11): 3 across and 3 up from the Hall, so about 4 cm north-west
print('points:', PLACES); print('ruler:', {a + ' to ' + b: (round(cm(a, b), 2), ANS[(a, b)]) for a, b in RULER}); print('walk ends at', walk, '| grove at', pt(11, 2), '| distance Hall to grove: %.2f cm' % math.hypot(3, 3)); print('wrote', out)
