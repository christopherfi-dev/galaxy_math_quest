# Energy Grid (station, Shield Bay task 2): every number pair, recomputed.   [Proposal]
#
# Why this check exists: on 2026-11-19 Marc saw step 3 on a student's iPad:
#   "Each section held 8 cells. Now each holds 10. How many more is that?"
# The game wanted 2. He thought 8. The sentence allowed both, and 0 as well.
# The sentence now asks about ONE section. This check proves three things for every pair in the game:
#   1. every answer is a whole number
#   2. the three readings (more in one section, cells that moved, more in the whole grid) are three different numbers,
#      so the game can tell them apart
#   3. the question on the page names one section
#
# Run:  python3 checks/energy_grid_check.py
import re, sys, os, json
here = os.path.dirname(os.path.abspath(__file__))
bad = []
for rel in sys.argv[1:] or ['../prototypes/kis_station_sketch.html']:
    page = open(os.path.join(here, rel) if not os.path.isabs(rel) else rel, encoding='utf-8').read()
    m = re.search(r'const GRIDS = (\[\[.*?\]\]);', page)
    if not m: bad.append(rel + ': no GRIDS list'); continue
    grids = json.loads(m.group(1))
    print(rel)
    print('  sections  each  all  after the rock: sections  each | one section gets  cells that moved  whole grid')
    for g, e in grids:
        T = g * e
        if T % (g - 1): bad.append(f'{rel}: {g} x {e} = {T} does not share equally over {g - 1}'); continue
        q = T // (g - 1); more = q - e; moved = more * (g - 1); whole = q * (g - 1) - T
        print(f'  {g:8}  {e:4}  {T:3}  {g - 1:24}  {q:4} | {more:16}  {moved:15}  {whole:10}')
        if more < 1: bad.append(f'{rel}: pair {g},{e}: one section does not get more')
        if moved != e: bad.append(f'{rel}: pair {g},{e}: cells that moved should be the broken section, {e}')
        if whole != 0: bad.append(f'{rel}: pair {g},{e}: the whole grid changed')
        if len({more, moved, whole, q}) != 4: bad.append(f'{rel}: pair {g},{e}: two readings give the same number, so the game cannot tell them apart')
    q3 = re.search(r'`(Look at one section\.[^`]*)`, q - w\.e\]', page)
    if not q3: bad.append(rel + ': step 3 does not start with "Look at one section."')
    elif 'How many more cells does it hold now than before?' not in q3.group(1): bad.append(rel + ': step 3 does not ask "more ... than before"')
    if 'How many more is that?' in page: bad.append(rel + ': the old unclear sentence is still on the page')
print('\nFAILED:\n  ' + '\n  '.join(bad) if bad else '\nAll pairs pass. Step 3 asks about one section.')
print('RESULT: FAIL' if bad else 'RESULT: PASS')
sys.exit(1 if bad else 0)
