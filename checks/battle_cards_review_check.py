#!/usr/bin/env python3
"""Battle thread, step A. Recomputes every number in proposals/GMQ_Cards_Review_v1_2026-11-22.md
from the spreadsheet beside it. Run:  python3 checks/battle_cards_review_check.py
The last line is "ALL OK" or the list of what failed."""
import csv, os, re, sys
from collections import Counter
HERE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(HERE, '..', 'proposals', 'GMQ_Cards_Review_v1_2026-11-22.csv')
rows = list(csv.DictReader(open(PATH, encoding='utf-8')))
bad = []
def want(label, got, exp):
    ok = got == exp
    print(('ok   ' if ok else 'FAIL ') + label + ': ' + str(got) + ('' if ok else '   expected ' + str(exp)))
    if not ok: bad.append(label)

# 1. every row is complete
want('rows', len(rows), 286)
want('rows by group', dict(Counter(r['group'] for r in rows)),
     {'booster card': 168, 'draft, never printed': 83, 'ship part': 30, 'upgrade card': 5})
want('rows with no verdict or no reason',
     sum(1 for r in rows if r['verdict'] not in ('keep', 'remake', 'drop') or len(r['reason']) < 15), 0)
want('rows with no effect text', sum(1 for r in rows if not r['effect (latest wording)'].strip()), 0)

# 2. the three printed sets
boost = [r for r in rows if r['group'] == 'booster card']
july = [r for r in boost if r['kind in July']]
sept = [r for r in boost if r['kind in Sept']]
nov = [r for r in boost if r['kind in Nov']]
want('July list: cards', len(july), 152)
want('July list: C, A, E', [Counter(r['kind in July'] for r in july)[k] for k in 'CAE'], [65, 54, 33])
want('Sept print: different cards', len(sept), 142)
want('Sept print: C, A, E', [Counter(r['kind in Sept'] for r in sept)[k] for k in 'CAE'], [50, 60, 32])
want('Sept print: cards found nowhere else', sum(1 for r in sept if r['sets it is in'] == 'Sept 2023 print'), 14)
want('Nov deck: cards', len(nov), 141)
nk = Counter(r['kind in Nov'] for r in nov)
want('Nov deck: C, A, E, SPY, P', [nk[k] for k in ('C', 'A', 'E', 'SPY', 'P')], [48, 39, 26, 27, 1])
want('July cards left out of the Nov deck', sum(1 for r in july if not r['kind in Nov']), 12)
def pct(n, d): return round(100.0 * n / d)
print('     July mix C/A/E %:', [pct(Counter(r['kind in July'] for r in july)[k], len(july)) for k in 'CAE'])
print('     Nov mix of the 113 C/A/E cards %:', [pct(nk[k], 113) for k in 'CAE'])
print('     Nov: Spy share of the whole deck %:', pct(nk['SPY'], len(nov)))

# 3. same effect, different card (November deck)
sig = Counter((r['what it does'], r['numbers']) for r in nov if not r['what it does'].startswith('switches off'))
groups = {k: v for k, v in sig.items() if v > 1}
want('Nov: groups of cards with the same effect and number', len(groups), 22)
want('Nov: cards inside those groups', sum(groups.values()), 74)
avoid = [r for r in nov if r['what it does'] == 'you cannot be hit this round' and r['numbers'] == '1 round']
want('Nov: "cannot be hit this round" cards', len(avoid), 12)
want('     ... and their kinds', sorted(Counter(r['kind in Nov'] for r in avoid).items()), [('A', 9), ('C', 2), ('E', 1)])
half = [r for r in nov if r['what it does'] == 'cuts an attack in half']
want('Nov: "half the attack" cards', len(half), 6)
add = [r for r in nov if r['what it does'] == 'adds to your attack']
want('Nov: plain "add to your attack" cards', len(add), 30)
cross = {}
for r in nov:
    if r['kind in Nov'] in 'CAE': cross.setdefault((r['what it does'], r['numbers']), set()).add(r['kind in Nov'])
want('Nov: effects printed in more than one kind', sum(1 for v in cross.values() if len(v) > 1), 10)

# 4. verdicts
want('Nov deck verdicts keep, remake, drop', [Counter(r['verdict'] for r in nov)[k] for k in ('keep', 'remake', 'drop')], [28, 52, 61])
want('all booster verdicts keep, remake, drop', [Counter(r['verdict'] for r in boost)[k] for k in ('keep', 'remake', 'drop')], [28, 54, 86])
dr = [r for r in rows if r['group'] == 'draft, never printed']
want('draft verdicts keep, remake, drop', [Counter(r['verdict'] for r in dr)[k] for k in ('keep', 'remake', 'drop')], [0, 9, 74])
fits = Counter(r['fits your rules sheet?'].split(' (')[0] for r in nov)
want('Nov: fits the rules sheet', dict(fits), {'yes': 67, 'yes, as a Spy': 21, 'needs your word': 37, 'no rule': 16})

# 5. the three ways to tell common, rare and epic apart
OLD = {'C': 'common', 'A': 'rare', 'E': 'epic'}; ORDER = ['common', 'rare', 'epic']
cae = [r for r in nov if r['kind in Nov'] in OLD]
exp = {'kind by option 1 (size)': (21, 20, 1, 55), 'kind by option 2 (reach)': (43, 21, 22, 0), 'kind by option 3 (both)': (44, 41, 3, 0)}
for col, e in exp.items():
    moved = [r for r in cae if r[col] in ORDER and r[col] != OLD[r['kind in Nov']]]
    up = sum(1 for r in moved if ORDER.index(r[col]) > ORDER.index(OLD[r['kind in Nov']]))
    unplaced = sum(1 for r in cae if r[col] not in ORDER)
    want(col + ': moved, up, down, cannot be placed (of 113)', (len(moved), up, len(moved) - up, unplaced), e)
    left = [r for r in nov if r['verdict'] != 'drop' and r[col] in ORDER]
    print('     cards left after the drops, by this option:', len(left), dict(Counter(r[col] for r in left)))

# 6. ship parts
parts = [r for r in rows if r['group'] == 'ship part']
def pair(r, key):
    m = re.search(key + r': HP (\d+), AP (\d+)', r['numbers'])
    return (int(m.group(1)), int(m.group(2))) if m else None
std = [r for r in parts if r['latest version'] == 'Standard']
want('Standard parts', len(std), 5)
want('ship of five Standard parts, printed sheet (HP, AP)', tuple(sum(pair(r, 'printed sheet')[i] for r in std) for i in (0, 1)), (75, 40))
want('ship of five Standard parts, table from the 2023 chats (HP, AP)', tuple(sum(pair(r, 'chat table')[i] for r in std) for i in (0, 1)), (100, 55))
want('ship of five Standard parts, 2023 website (HP, AP)', tuple(sum(pair(r, '2023 website')[i] for r in std) for i in (0, 1)), (70, 40))
want('printed parts whose 2023 website numbers differ from the print', [r['name'] for r in parts if pair(r, 'printed sheet') and pair(r, '2023 website') != pair(r, 'printed sheet')], ['Standard Reactor'])
lucky = [r for r in parts if r['latest version'] == 'Lucky Draw']
want('ship of five Lucky Draw parts, printed sheet (HP, AP)', tuple(sum(pair(r, 'printed sheet')[i] for r in lucky) for i in (0, 1)), (135, 80))
want('ship of five Lucky Draw parts, table from the 2023 chats (HP, AP)', tuple(sum(pair(r, 'chat table')[i] for r in lucky) for i in (0, 1)), (140, 85))
printed = [r for r in parts if pair(r, 'printed sheet')]
want('parts on the printed sheet', len(printed), 20)
want('printed parts whose two sets of numbers differ', sum(1 for r in printed if pair(r, 'printed sheet') != pair(r, 'chat table')), 13)
want('printed descriptions that contradict the printed numbers', sum(1 for r in printed if 'printed numbers contradict' in r['problems']), 7)
want('printed descriptions that contradict the chat-table numbers', sum(1 for r in printed if 'chat-table numbers contradict' in r['problems']), 0)
# in the chat table every regular version of a part has the same HP + AP
tot = {}
for r in parts:
    if r['latest version'] != 'Lucky Draw': tot.setdefault(r['ship part it touches'], set()).add(sum(pair(r, 'chat table')))
want('chat table: HP + AP of every regular version, by part', {k: sorted(v) for k, v in sorted(tot.items())},
     {'Engine Core': [25], 'Navigation System': [25], 'Power Module': [40], 'Shield Generator': [35], 'Weapons System': [30]})
# the 19 November note said "+15" for every Lucky Draw part; Navigation's is +10
want('chat table: a Lucky Draw part is the regular total plus', {r['ship part it touches']: sum(pair(r, 'chat table')) - list(tot[r['ship part it touches']])[0] for r in lucky},
     {'Engine Core': 15, 'Power Module': 15, 'Weapons System': 15, 'Navigation System': 10, 'Shield Generator': 15})
# on the printed sheet the Standard is the weakest version in four of the five parts
weak = 0
for part in tot:
    reg = [r for r in printed if r['ship part it touches'] == part and r['latest version'] != 'Lucky Draw']
    s = [sum(pair(r, 'printed sheet')) for r in reg if r['latest version'] == 'Standard'][0]
    if all(sum(pair(r, 'printed sheet')) > s for r in reg if r['latest version'] != 'Standard'): weak += 1
want('printed sheet: part types where the Standard has the lowest HP + AP', weak, 4)

# 7. scale: what one card does to a Standard ship (chat-table numbers)
hp = sorted(pair(r, 'chat table')[0] for r in std)
want('Standard part HPs (chat table)', hp, [10, 15, 20, 25, 30])
want('parts destroyed by a Spy card "20 to all parts"', sum(1 for h in hp if h <= 20), 3)
want('parts destroyed by a Spy card "10 to all parts"', sum(1 for h in hp if h <= 10), 1)

print('ALL OK' if not bad else 'FAILED: ' + '; '.join(bad))
sys.exit(1 if bad else 0)
