#!/usr/bin/env python3
"""Battle thread, step B. Checks the new card set, read straight from the page that shows it
(prototypes/card_battle_cards.html), so the page, this check and the list cannot drift apart.

Run:   python3 checks/battle_cards_set_check.py           (checks only)
       python3 checks/battle_cards_set_check.py --csv     (also writes the list to proposals/)
The last line is "ALL OK" or the list of what failed."""
import csv, json, os, random, re, sys
from collections import Counter
HERE = os.path.dirname(os.path.abspath(__file__))
PAGE = os.path.join(HERE, '..', 'prototypes', 'card_battle_cards.html')
LIVE = os.path.join(HERE, '..', 'docs', 'battle', 'cards.html')
html = open(PAGE, encoding='utf-8').read()
D = json.loads(re.search(r'<script id="carddata" type="application/json">(.*?)</script>', html, re.S).group(1))
bad = []
def want(label, got, exp=True):
    ok = got == exp
    print(('ok   ' if ok else 'FAIL ') + label + ': ' + str(got) + ('' if ok else '   expected ' + str(exp)))
    if not ok: bad.append(label)

cards, parts, ups, ideas = D['cards'], D['parts'], D['upgrades'], D['ideas']

# ---------- 1. the set ----------
want('battle cards', len(cards), 47)
want('ship part cards', len(parts), 20)
want('upgrade cards', len(ups), 5)
want('cards in all, without the ideas', len(cards) + len(parts) + len(ups), 72)
want('by type', dict(Counter(c['type'] for c in cards)), {'attack': 12, 'defence': 17, 'repair': 10, 'spy': 7, 'guard': 1})
# Marc, 22 November: a card that gives Main Shield shows a shield; a heart is only for repairing the HP of parts
want('every card that adds to the Main Shield is a shield card', [c['id'] for c in cards if any(o['op'].startswith('shield_') for o in c['ops']) and c['type'] != 'defence'], [])
want('no heart card touches the Main Shield', [c['id'] for c in cards if c['type'] == 'repair' and any(o['op'].startswith('shield_') or o['op'].startswith('block') for o in c['ops'])], [])
mix = Counter(c['rarity'] for c in cards)
want('common, rare, epic', [mix['common'], mix['rare'], mix['epic']], [23, 17, 7])
print('     that is', [round(100.0 * mix[k] / len(cards)) for k in ('common', 'rare', 'epic')], 'in a hundred; the 2023 target was 50, 35, 15')
everything = cards + parts + ups + ideas
want('every id is used once', len(set(c['id'] for c in everything)), len(everything))
names = Counter(c['name'] for c in cards + ups + ideas)
want('no two cards share a name', [n for n, k in names.items() if k > 1], [])
want('the longest name fits the title bar (22 letters or fewer)', max(len(c['name']) for c in cards + parts + ideas) <= 22, True)
# words that belong to famous films and shows: none in a NEW name (the part names are Marc's own, from 2023)
BORROWED = re.compile(r'photon|phaser|warp|proton torpedo|replicant|lightsaber|death star|jedi|klingon|tardis', re.I)
want('no new name borrows a famous word', [c['name'] for c in cards + ideas if BORROWED.search(c['name'])], [])
print('     Marc\'s own part names that use such a word:', [p['name'] for p in parts if BORROWED.search(p['name'])])
want('every card says what the child works out, and where it came from', all(c.get('maths') and c.get('from') for c in cards + ups + ideas), True)

# ---------- 2. every card uses only mechanics the rules sheet has ----------
RULES = {  # op: where the rules sheet carries it
    'atk_add': 'section 3: a bonus from the card', 'atk_per_part': 'section 3: a bonus from the card', 'atk_double': 'section 3: a bonus from the card',
    'atk_round100': 'section 3: a bonus from the card', 'block': 'section 5: defence cards', 'block_all': 'section 5: defence cards',
    'repair_one': 'section 5: healing HP', 'repair_share': 'section 5: healing HP', 'repair_all': 'section 5: healing HP', 'repair_full': 'section 5: healing HP',
    'round_up10': 'section 5: healing HP', 'move_hp': 'section 5: healing HP', 'revive': 'section 5: revival', 'shield_add': 'section 5: defence cards',
    'shield_per_card': 'section 5: defence cards', 'shield_rebuild': 'section 5: defence cards', 'block_per_card': 'section 5: defence cards', 'block_dodge': 'section 5: defence cards', 'spy': 'section 6: Spy', 'guard': 'section 6: Policeman', 'upgrade': 'section 9: upgrades'}
want('ops outside the rules sheet (set)', sorted({o['op'] for c in cards + ups for o in c['ops']} - set(RULES)), [])
want('a Guard has one job (rules sheet, section 6)', [c['id'] for c in cards if c['type'] == 'guard' and c['ops'] != [{'op': 'guard'}]], [])
want('idea cards are kept out of the set', all(c['ops'] == [{'op': 'x'}] and c.get('ask') for c in ideas), True)

# ---------- 3. the number rule: every card sits in its step ----------
def spy_total(o): return o['n'] * o['parts']
STEPS = {  # (op, rarity): allowed numbers
    ('atk_add', 'common'): range(5, 11), ('atk_add', 'rare'): (15, 20),
    ('block', 'common'): range(8, 16), ('block', 'rare'): (20, 25),
    ('repair_one', 'common'): range(6, 13),
    ('shield_add', 'common'): range(10, 16), ('shield_add', 'rare'): (25,), ('shield_rebuild', 'epic'): (100,),
}
out = []
for c in cards:
    if len(c['ops']) > 1:
        if c['rarity'] != 'rare': out.append(c['id'] + ' has two effects and is not rare')
        for o in c['ops']:   # each half of a two-effect card is no bigger than a common
            if o['op'] in ('atk_add', 'block', 'repair_one', 'shield_add') and o['n'] > 15: out.append(c['id'] + ' half is bigger than a common')
        continue
    o = c['ops'][0]; key = (o['op'], c['rarity'])
    if key in STEPS:
        if o['n'] not in STEPS[key]: out.append('%s %s %s is outside its step' % (c['id'], o['op'], o['n']))
    elif o['op'] == 'spy':
        t = spy_total(o); lo, hi = {'common': (3, 4), 'rare': (6, 9), 'epic': (20, 20)}[c['rarity']]
        if not lo <= t <= hi: out.append('%s Spy total %d is outside its step' % (c['id'], t))
    elif o['op'] in ('atk_add', 'block', 'repair_one', 'shield_add'): out.append(c['id'] + ' has no step for its kind')
    elif o['op'] in ('atk_double', 'atk_round100', 'block_all', 'revive', 'repair_full') and c['rarity'] != 'epic': out.append(c['id'] + ' should be epic')
    elif o['op'] in ('repair_share', 'repair_all', 'round_up10', 'move_hp', 'atk_per_part', 'block_per_card') and c['rarity'] != 'rare': out.append(c['id'] + ' should be rare')
want('cards outside the number rule', out, [])
for op in ('atk_add', 'block', 'repair_one', 'shield_add'):
    nums = sorted(c['ops'][0]['n'] for c in cards if len(c['ops']) == 1 and c['ops'][0]['op'] == op)
    want('no two plain "%s" cards have the same number' % op, len(nums) == len(set(nums)), True)
    top_common = max(c['ops'][0]['n'] for c in cards if len(c['ops']) == 1 and c['ops'][0]['op'] == op and c['rarity'] == 'common')
    rares = [c['ops'][0]['n'] for c in cards if len(c['ops']) == 1 and c['ops'][0]['op'] == op and c['rarity'] == 'rare']
    if rares: want('every rare "%s" beats every common one' % op, min(rares) > top_common, True)
spies = {r: sorted(spy_total(c['ops'][0]) for c in cards if c['type'] == 'spy' and c['rarity'] == r) for r in ('common', 'rare', 'epic')}
want('Spy totals rise with the kind', spies['common'][-1] < spies['rare'][0] and spies['rare'][-1] < spies['epic'][0], True)
print('     Spy totals:', spies)

# ---------- 4. the words on a card agree with its numbers ----------
out = []
for c in cards + ups:
    for o in c['ops']:
        for k in ('n', 'hp', 'ap'):
            if k in o and not re.search(r'(?<!\d)%d(?!\d)' % o[k], c['text']) and o['op'] not in ('spy',) : out.append('%s: %d is not in the words' % (c['id'], o[k]))
        if o['op'] == 'spy':
            if not re.search(r'(?<!\d)%d damage' % o['n'], c['text']): out.append(c['id'] + ' Spy number missing')
            word = {1: 'one enemy part', 2: 'two enemy parts', 3: 'three enemy parts', 5: 'every enemy part'}[o['parts']]
            if word not in c['text']: out.append(c['id'] + ' Spy part count missing')
    o = c['ops'][0]
    exp = {'atk_add': lambda: '+%d' % o['n'], 'block': lambda: '−%d' % o['n'], 'repair_one': lambda: '+%d' % o['n'], 'shield_add': lambda: '+%d' % o['n'],
           'repair_all': lambda: '+%d' % o['n'], 'atk_double': lambda: '×2', 'atk_round100': lambda: '100s', 'shield_rebuild': lambda: '%d' % o['n'], 'revive': lambda: '+%d' % o['n'], 'repair_share': lambda: '+%d' % o['n']}.get(o['op'])
    if exp and c['type'] != 'guard' and c['badge'] != exp(): out.append('%s badge %s, expected %s' % (c['id'], c['badge'], exp()))
    if c['id'] == 'A03' and o['n'] % 2 == 0: out.append('Odd Rocket is not odd')
    if c['id'] == 'A04' and o['n'] % 2 == 1: out.append('Even Beam is not even')
want('words, badges and numbers disagree', out, [])
want('no card says "Add +"', [c['id'] for c in cards + ideas if 'Add +' in c['text']], [])
want('every repair of parts says working, lost or damaged', [c['id'] for c in cards if any(o['op'] in ('repair_one', 'repair_share', 'repair_all', 'repair_full', 'move_hp', 'round_up10', 'revive') for o in c['ops']) and not re.search(r'working|lost|damaged', c['text'])], [])
# Marc, 22 November: a shield card puts a broken Main Shield back up. Every such card says so.
want('every card that adds to the Main Shield says a broken shield comes back', [c['id'] for c in cards if any(o['op'] in ('shield_add', 'shield_per_card', 'shield_rebuild') for o in c['ops']) and 'A broken shield comes back' not in c['text']], [])
want('every block card says it can bring back a broken shield', [c['id'] for c in cards if any(o['op'] in ('block', 'block_per_card') for o in c['ops']) and 'bring back a broken shield' not in c['text']], [])
want('a dodge card, and only a dodge card, carries the dodge picture', [c['id'] for c in cards if (c.get('sym') == 'dodge') != any(o['op'] == 'block_dodge' for o in c['ops'])], [])
want('every dodge card says you still fire', [c['id'] for c in cards if any(o['op'] == 'block_dodge' for o in c['ops']) and 'You still fire' not in c['text']], [])
want('no card still says "if it is still up"', [c['id'] for c in cards if 'still up' in c['text']], [])
want('a card with two effects names both parts it needs', [c['id'] for c in cards if len(c['ops']) > 1 and ' and ' not in c.get('needs', '')], [])
want('longest card text (letters)', max(len(c['text']) for c in cards + ups + ideas) <= 90, True)

# ---------- 5. the ship parts ----------
K = {k['key']: k for k in D['kinds']}
by = {}
for p in parts: by.setdefault(p['part'], {})[p['kind']] = p
want('five parts, each in four kinds', sorted((k, sorted(v)) for k, v in by.items()) == sorted((k, ['guardian', 'lucky', 'standard', 'striker']) for k in by) and len(by) == 5, True)
out = []
for part, v in by.items():
    s = v['standard']
    for kind, p in v.items():
        if (p['hp'], p['ap']) != (s['hp'] + K[kind]['hp'], s['ap'] + K[kind]['ap']): out.append(p['name'])
        if p['hp'] < 5 or p['ap'] < 0 or p['hp'] % 5 or p['ap'] % 5: out.append(p['name'] + ' odd number')
want('parts that break the kind rule', out, [])
def ship(kind): return (sum(by[p][kind]['hp'] for p in by), sum(by[p][kind]['ap'] for p in by))
want('a ship of five Standard parts (HP, AP)', ship('standard'), (D['standard_ship']['hp'], D['standard_ship']['ap']))
want('... and the rules sheet says', ship('standard'), (100, 55))
want('five Guardian parts', ship('guardian'), (125, 30))
want('five Striker parts', ship('striker'), (75, 80))
want('five Lucky Draw parts', ship('lucky'), (125, 80))
# the words on each part, against its numbers
out = []
for part, v in by.items():
    s, g, k, l = v['standard'], v['guardian'], v['striker'], v['lucky']
    for p in v.values():
        t = p['text'].lower()
        if 'nothing to your attack' in t and p['ap'] != 0: out.append(p['name'])
        if p['ap'] == 0 and 'nothing to your attack' not in t: out.append(p['name'] + ' has AP 0 and does not say so')
        if 'balanced' in t and p['hp'] != p['ap']: out.append(p['name'] + ' says balanced')
        if ('toughest' in t or 'a tough core' in t or 'heavy' in t or 'built to last' in t or 'more armour' in t) and not p['hp'] > s['hp']: out.append(p['name'] + ' is not tougher than the Standard')
        if ('less armour' in t or 'thin walls' in t or 'lighter' in t or 'very little armour' in t) and not (p['hp'] < s['hp'] and p['ap'] > s['ap']): out.append(p['name'] + ' is not a Striker in numbers')
        if 'toughest' in t and p['hp'] < max(q['hp'] for q in v.values()): out.append(p['name'] + ' is not the toughest')
    if (l['hp'], l['ap']) != (g['hp'], k['ap']): out.append(l['name'] + ' is not the Guardian\'s HP with the Striker\'s AP')
want('part descriptions that contradict their numbers', out, [])
# against the table from Marc's 2023 chats (rules file, section 3)
CHAT = {'Standard Reactor': (20, 5), 'Neutron Reactor': (25, 0), 'Quantum Reactor': (15, 10), 'Stellar Reactor': (30, 10), 'Standard Navigator': (15, 10), 'Celestial Cartographer': (20, 5),
        'Astrolabe Navigator': (10, 15), 'Cosmic Navigator': (20, 15), 'Standard Shield': (30, 5), 'Neutron Wall': (33, 2), 'Quantum Deflector': (28, 7), 'Nova Shield': (40, 10),
        'Standard Arsenal': (10, 20), 'Proton Launcher': (15, 15), 'Pulsar Phaser': (5, 25), 'Supernova Arsenal': (15, 30), 'Standard Battery': (25, 15), 'Proton Generator': (30, 10),
        'Quantum Dynamo': (20, 20), 'Galaxy Battery': (35, 20)}
want('all 20 part names are Marc\'s', sorted(p['name'] for p in parts), sorted(CHAT))
same = [p['name'] for p in parts if p['kind'] != 'lucky' and CHAT[p['name']] == (p['hp'], p['ap'])]
want('Standard, Guardian and Striker numbers equal to the chat table (of 15)', len(same), 13)
print('     the two that differ:', [(p['name'], (p['hp'], p['ap']), CHAT[p['name']]) for p in parts if p['kind'] != 'lucky' and p['name'] not in same])
print('     Lucky Draw, new against chat table:', [(p['name'], (p['hp'], p['ap']), CHAT[p['name']]) for p in parts if p['kind'] == 'lucky'])
want('every Level 2 upgrade is HP +4, AP +3', all(u['ops'] == [{'op': 'upgrade', 'hp': 4, 'ap': 3}] for u in ups) and sorted(u['part'] for u in ups) == sorted(by), True)

# ---------- 6. the number rules, played on 20,000 random ships ----------
# Working guesses, each to be a switch in step C: a part is never repaired above its starting HP; the Main Shield never passes 100.
random.seed(20261122)
ORDER = list(by)
fails = Counter(); biggest = Counter()
def apply(c, ship, hand, enemy, incoming):
    """Returns (attack bonus, blocked, notes). Changes ship / enemy in place."""
    ap = sum(p['ap'] for p in ship['parts'] if p['hp'] > 0)
    bonus = blocked = 0
    for o in c['ops']:
        op = o['op']
        if op == 'atk_add': bonus += o['n']
        elif op == 'atk_per_part': bonus += o['n'] * sum(1 for p in ship['parts'] if p['hp'] > 0)
        elif op == 'atk_double': bonus += ap
        elif op == 'atk_round100': bonus += (-ap) % 100
        # Marc, 22 November: on a broken shield a block card puts up a shield of its own number instead
        elif op in ('block', 'block_per_card'):
            n = o['n'] * (hand if op == 'block_per_card' else 1)
            if ship['shield'] == 0:
                if n > 0: ship['shield'] = min(100, n)
            else: blocked += min(n, incoming)
        elif op == 'block_dodge': blocked += incoming   # the ship's attack misses; Marc, 23 November: the ship that dodges still fires
        elif op == 'block_all': blocked += incoming
        elif op == 'repair_one':
            live = [p for p in ship['parts'] if p['hp'] > 0]
            if live: p = min(live, key=lambda p: p['hp'] - p['max']); p['hp'] = min(p['max'], p['hp'] + o['n'])
        elif op == 'repair_all':
            for p in ship['parts']:
                if p['hp'] > 0: p['hp'] = min(p['max'], p['hp'] + o['n'])
        elif op == 'repair_full':
            for p in ship['parts']:
                if p['hp'] > 0: p['hp'] = p['max']
        elif op == 'repair_share':
            left = o['n']
            for p in ship['parts']:
                if p['hp'] > 0:
                    t = min(left, p['max'] - p['hp'], random.randint(0, left)); p['hp'] += t; left -= t
        elif op == 'round_up10':
            for p in ship['parts']:
                if 0 < p['hp'] < p['max']: p['hp'] = min(p['max'], -(-p['hp'] // 10) * 10)
        elif op == 'move_hp':
            live = [p for p in ship['parts'] if p['hp'] > 0]
            if len(live) > 1:
                a, b = random.sample(live, 2); t = min(random.randint(0, o['n']), a['hp'] - 1, b['max'] - b['hp']); t = max(t, 0); a['hp'] -= t; b['hp'] += t
        elif op == 'revive':
            dead = [p for p in ship['parts'] if p['hp'] == 0]
            if dead: dead[0]['hp'] = min(o['n'], dead[0]['max'])
        elif op == 'shield_add': ship['shield'] = min(100, ship['shield'] + o['n'])
        elif op == 'shield_per_card': ship['shield'] = min(100, ship['shield'] + o['n'] * hand)
        elif op == 'shield_rebuild': ship['shield'] = max(ship['shield'], o['n'])   # Shield Reborn: back to full
        elif op == 'spy':
            live = [p for p in enemy['parts'] if p['hp'] > 0]
            for p in random.sample(live, min(o['parts'], len(live))): p['hp'] = max(0, p['hp'] - o['n'])
        elif op == 'guard': pass
    return bonus, blocked, ap
def make():
    ps = []
    for part in ORDER:
        p = by[part][random.choice(['standard', 'guardian', 'striker', 'lucky'])]
        hp = random.choice([p['hp'], p['hp'], random.randint(0, p['hp'])])
        ps.append({'part': part, 'max': p['hp'], 'hp': hp, 'ap': p['ap']})
    return {'parts': ps, 'shield': random.choice([100, 100, 0, random.randint(1, 99)])}
N = 20000
for i in range(N):
    for c in cards:
        me, foe = make(), make(); hand = random.randint(0, 7); incoming = random.randint(0, 110)
        before = [(p['hp'], p['max']) for p in me['parts']]; total_before = sum(p['hp'] for p in me['parts']); shield_before = me['shield']
        bonus, blocked, ap = apply(c, me, hand, foe, incoming)
        if any(p['hp'] < 0 or p['hp'] > p['max'] for p in me['parts'] + foe['parts']): fails[c['id'] + ' HP out of range'] += 1
        if not 0 <= me['shield'] <= 100: fails[c['id'] + ' shield out of range'] += 1
        if bonus < 0 or blocked < 0 or blocked > incoming: fails[c['id'] + ' bad bonus or block'] += 1
        if c['type'] in ('repair',) and sum(p['hp'] for p in me['parts']) < total_before: fails[c['id'] + ' a repair lowered HP'] += 1
        if shield_before == 0 and me['shield'] > 0 and not any(o['op'] in ('block', 'block_per_card', 'shield_add', 'shield_per_card', 'shield_rebuild') for o in c['ops']): fails[c['id'] + ' has no shield on it, and rebuilt a broken shield'] += 1
        if shield_before == 0 and me['shield'] == 0 and any(o['op'] in ('block', 'shield_add', 'shield_rebuild') for o in c['ops']): fails[c['id'] + ' is a shield card, and did not bring a broken shield back'] += 1
        if c['id'] == 'R15' and me['shield'] != 100: fails['R15 did not put the shield back to full'] += 1
        if c['id'] != 'R13' and any(b[0] == 0 and p['hp'] > 0 for b, p in zip(before, me['parts'])): fails[c['id'] + ' brought back a lost part'] += 1
        if c['id'] == 'R11' and sum(p['hp'] for p in me['parts']) != total_before: fails['R11 moved HP changed the total'] += 1
        if c['id'] == 'R13' and any(b[0] > 0 and p['hp'] != b[0] for b, p in zip(before, me['parts'])): fails['R13 touched a working part'] += 1
        if c['id'] == 'A12' and ap > 0 and ((ap + bonus) % 100 or bonus < 0 or bonus >= 100): fails['A12 is not the next hundred'] += 1
        if c['id'] == 'A12' and ap == 0 and bonus != 0: fails['A12 gave an attack to a ship with no AP'] += 1
        if c['id'] == 'A11' and bonus != ap: fails['A11 is not double'] += 1
        if c['id'] == 'A09' and bonus != 5 * sum(1 for p in me['parts'] if p['hp'] > 0): fails['A09 is not 5 a part'] += 1
        if c['id'] == 'R10' and any(p['hp'] % 10 and p['hp'] != p['max'] for b, p in zip(before, me['parts']) if 0 < b[0] < b[1]): fails['R10 left a part not rounded'] += 1
        biggest[c['id']] = max(biggest[c['id']], ap + bonus)
want('number rules that failed on %d random ships a card' % N, dict(fails), {})
want('the biggest attack a child ever has to work out is under 200', max(biggest.values()) < 200, True)
print('     biggest attack by card:', {k: v for k, v in sorted(biggest.items()) if k.startswith('A')})
# an attack card and a block card of the same size cancel
pairs = [(a['id'], d['id']) for a in cards for d in cards if len(a['ops']) == 1 and len(d['ops']) == 1 and a['ops'][0]['op'] == 'atk_add' and d['ops'][0]['op'] == 'block' and a['ops'][0]['n'] == d['ops'][0]['n']]
print('     attack and block cards of the same size:', pairs)

# ---------- 7. what Marc should know before he picks: Spy cards against Weapons ----------
print('     A ship with Weapons at 0 cannot attack (your board). One Spy card against a full-HP Weapons System:')
for kind in ('standard', 'guardian', 'striker', 'lucky'):
    w = by['Weapons System'][kind]
    killers = [c['name'] for c in cards if c['type'] == 'spy' and c['ops'][0]['n'] >= w['hp']]
    print('       %-10s %-18s HP %2d: destroyed by %s' % (K[kind]['name'], w['name'], w['hp'], killers or 'no single Spy card'))
commons = sorted((c['ops'][0]['n'] for c in cards if c['type'] == 'spy' and c['rarity'] == 'common'), reverse=True)
want('no two common Spy cards together destroy a full-HP Standard Arsenal', commons[0] + commons[1] < by['Weapons System']['standard']['hp'], True)
want('the lost-part card never returns a part above its full HP', all(o['n'] <= min(p['hp'] for p in parts) for c in cards for o in c['ops'] if o['op'] == 'revive'), True)
want('no single Spy card destroys a full-HP Standard Arsenal', [c['name'] for c in cards if c['type'] == 'spy' and c['ops'][0]['n'] >= by['Weapons System']['standard']['hp']], [])

# ---------- 8. the battle page carries the same cards and the same drawing code ----------
BATTLE = os.path.join(HERE, '..', 'prototypes', 'card_battle.html')
if os.path.exists(BATTLE):
    bh = open(BATTLE, encoding='utf-8').read()
    grab = lambda t, pat: re.search(pat, t, re.S).group(0)
    want('the battle page has the same card list as the cards page', grab(bh, r'<script id="carddata" type="application/json">.*?</script>') == grab(html, r'<script id="carddata" type="application/json">.*?</script>'), True)
    want('the battle page draws the cards with the same code', grab(bh, r'/\* DRAW-BEGIN.*?/\* DRAW-END \*/') == grab(html, r'/\* DRAW-BEGIN.*?/\* DRAW-END \*/'), True)
    LIVEB = os.path.join(HERE, '..', 'docs', 'battle', 'index.html')
    if os.path.exists(LIVEB): want('docs/battle/index.html is the same as the battle prototype', open(LIVEB, encoding='utf-8').read() == bh, True)
    for name, text in (('cards page', html), ('battle page', bh)):
        want('the ' + name + ' loads nothing from outside (no http link, no script file, no image file)', re.findall(r'(?:src|href)="(?!index\.html|cards\.html)[^"#]+"|url\((?!#)|@import|fetch\(|XMLHttpRequest', text.replace('xmlns="http://www.w3.org/2000/svg"', '')), [])

# ---------- 8. the page on the site is the same file ----------
if os.path.exists(LIVE): want('docs/battle/cards.html is the same as the prototype', open(LIVE, encoding='utf-8').read() == html, True)
else: print('     docs/battle/cards.html is not there yet')

if '--csv' in sys.argv:
    path = os.path.join(HERE, '..', 'proposals', 'GMQ_Card_Battle_New_Set_v1_2026-11-22.csv')
    with open(path, 'w', newline='', encoding='utf-8') as fh:
        w = csv.writer(fh)
        w.writerow(['group', 'id', 'name', 'what it is', 'kind', 'HP', 'AP', 'words on the card', 'what the child works out', 'it grew from', 'rules sheet', 'needs from Marc'])
        for p in parts: w.writerow(['ship part', p['id'], p['name'], p['part'], K[p['kind']]['name'], p['hp'], p['ap'], p['text'], '', 'your 2023 name', 'section 1', ''])
        for c in cards: w.writerow(['battle card', c['id'], c['name'], c['type'], c['rarity'], '', '', c['text'], c['maths'], c['from'], '; '.join(sorted({RULES[o['op']] for o in c['ops']})), ''])
        for c in ups: w.writerow(['upgrade', c['id'], c['name'], c['part'], 'Level 2', 4, 3, c['text'], c['maths'], c['from'], RULES['upgrade'], ''])
        for c in ideas: w.writerow(['idea, not in the set', c['id'], c['name'], c['type'], c['rarity'], '', '', c['text'], c['maths'], c['from'], 'no rule yet', c['ask']])
    print('     wrote', os.path.relpath(path))
print('ALL OK' if not bad else 'FAILED: ' + '; '.join(bad))
sys.exit(1 if bad else 0)
