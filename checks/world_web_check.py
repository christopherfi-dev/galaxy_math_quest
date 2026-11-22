"""World web check: the laws of GMQ_World_Web_v1_2026-11-21.md, run on its spreadsheet.

[Proposal] Nothing here is in the game yet. This checks the plan before anything is built.
Run: python3 checks/world_web_check.py   (exit code 0 = every law holds)

Faults (the check fails):
  1. a need names a row that does not exist
  2. something cannot be reached from the start (a loop, or a need nobody can meet)
  3. a new row needs a place that is not built ('later')
  4. a built row needs something new (the web would silently change what exists)
  5. law 7: a planet's own job waits on another planet (the station and landings are allowed)
  6. law 1: a new item, tool, need, find or place that nothing uses, and is not marked an end
  8. a secret is needed for a planet's own job or for leaving a place (Marc, 2026-11-21: "secrets should not be
     mandatory things that must be found"). Known cases waiting on Marc's decision are listed, not failed.
Reports (no failure):
  - built finds and items that lead nowhere yet: the gap Marc named
  - the planets each strand touches (law 2)
  - people, by role
"""
import csv, os, sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
CSV = os.path.join(HERE, '..', 'proposals', 'GMQ_World_Web_v1_2026-11-21.csv')
rows = list(csv.DictReader(open(sys.argv[1] if len(sys.argv) > 1 else CSV, newline='', encoding='utf-8')))
by = {r['id']: r for r in rows}
need = {r['id']: [n for n in r['needs'].split(';') if n] for r in rows}
faults = []

# 1. every need exists
for i, ns in need.items():
    for n in ns:
        if n not in by:
            faults.append(f'1. {i} needs "{n}", which is not in the table')

# 2. reachable from the start, with no loops
got, changed = set(), True
while changed:
    changed = False
    for i, ns in need.items():
        if i not in got and all(n in got for n in ns if n in by):
            got.add(i); changed = True
for i in by:
    if i not in got:
        faults.append(f'2. {i} can never be reached: a loop, or a need that nothing meets ({", ".join(need[i])})')

# 3 and 4. status rules
for i, r in by.items():
    for n in need[i]:
        if n not in by: continue
        s, t = r['status'], by[n]['status']
        if s in ('proposal', 'option') and t == 'later':
            faults.append(f'3. {i} ({s}) needs {n}, which is not built yet')
        if s == 'built' and t != 'built':
            faults.append(f'4. {i} is built but needs {n} ({t})')

# 5. law 7: a planet's own job list never waits on another planet
def all_needs(i, seen=None):
    seen = set() if seen is None else seen
    for n in need.get(i, []):
        if n in by and n not in seen:
            seen.add(n); all_needs(n, seen)
    return seen
for i, r in by.items():
    if r['planet_job'] != 'yes': continue
    for n in all_needs(i):
        o = by[n]
        if o['planet'] != r['planet'] and o['planet'] != 'station' and o['kind'] != 'land':
            faults.append(f'5. the {r["planet"]} job "{r["name"]}" waits on {n} ({o["planet"]})')

# 6. law 1: every new thing has a use
used = defaultdict(list)
for i, ns in need.items():
    for n in ns: used[n].append(i)
for i, r in by.items():
    if r['status'] in ('proposal', 'option') and r['kind'] in ('item', 'tool', 'need', 'find', 'place') \
            and not used[i] and r['keep'] not in ('keepsake', 'end'):
        faults.append(f'6. {i} is new, but nothing uses it')

# 8. no job and no landing may need a secret
WAITING = {}   # Voltara's glow stone and Nomad Hollow were waiting on Marc; decided 2026-11-22 (V2), built in version 85
waiting_seen = set()
for i, r in by.items():
    if r['planet_job'] != 'yes' and r['kind'] != 'land': continue
    for n in all_needs(i):
        if by[n].get('secret') == 'yes':
            if n in WAITING: waiting_seen.add(n)
            else: faults.append(f'8. {r["name"]} needs the secret "{by[n]["name"]}"')

# reports
def leads_nowhere(i, r, only_built):
    users = [u for u in used[i] if not only_built or by[u]['status'] == 'built']
    return r['status'] == 'built' and r['kind'] in ('item', 'find') and not users \
        and r['keep'] not in ('keepsake', 'scenery', 'end', 'pointer', 'helper')
gap_now = [r['name'] for i, r in by.items() if leads_nowhere(i, r, True)]
gap_after = [r['name'] for i, r in by.items() if leads_nowhere(i, r, False)]
strands = defaultdict(set)
for r in rows:
    if r['strand']: strands[r['strand']].add(r['planet'])
roles = defaultdict(int)
for r in rows:
    if r['kind'] == 'person':
        for part in r['people_role'].replace(' then ', ', ').split(','):
            w = part.strip().split(' ')[0]
            if w: roles[(r['status'], w)] += 1

print(f'{len(rows)} rows: {sum(r["status"] == "built" for r in rows)} built, '
      f'{sum(r["status"] in ("proposal", "option") for r in rows)} new, {sum(r["status"] == "later" for r in rows)} later')
print(f'\nBuilt finds and items that lead nowhere today ({len(gap_now)}), the gap Marc named:')
print('  ' + '; '.join(gap_now))
print(f'\nStill leading nowhere once the three strands are built ({len(gap_after)}):')
print('  ' + '; '.join(gap_after))
print('\nPlanets each strand touches (law 2):')
for s in sorted(strands):
    print(f'  strand {s}: {", ".join(sorted(strands[s]))}')
print('\nPeople, by role:')
for (st, w), n in sorted(roles.items()):
    print(f'  {st:8} {w}: {n}')
secrets = [r for r in rows if r.get('secret') == 'yes']
print(f'\nSecrets in the table: {len(secrets)}. Needed by a job or a landing, waiting on Marc ({len(waiting_seen)}):')
for n in sorted(waiting_seen): print('  ' + WAITING[n])
print()
if faults:
    print(f'FAULTS ({len(faults)}):')
    for f in faults: print('  ' + f)
    sys.exit(1)
print('Every law holds.')
