# Operation Stardust as built: every cadet's numbers, worked out again.   [Proposal]
#
# The game gives each cadet their own numbers from a seed (function sNums in prototypes/kis_station_sketch.html).
# This file makes the same numbers in Python, with no code shared with the game, and checks 20,000 seeds:
#   1. the rooms: every thermometer shows an even number from 0 to 40; exactly one room breaks its plate,
#      and "by how many degrees" has one answer (2, 4 or 6)
#   2. the locker: six foods on the shelf, four that last the trip and two that do not; the whole amount is
#      4 people x 10 or 20 points x 3 months; the four good foods can make it exactly, in at least 12 ways,
#      with no crate over 10 packs (counted here by brute force, a different way from the game)
#   3. the fuel log: one month burned the most fuel AND went the least far. One other month burned as much
#      but went the farthest. So the fuel chart alone cannot answer; the two charts together give one month.
#   4. the tanks: each gauge is cut into equal parts; the litres to add is a whole number, more than 0, less than full
#   5. what the crew ate: of the four kinds on both charts, exactly one fell the most, by 150 or more;
#      every bar is a multiple of 50 from 50 to 500
#   6. the greenhouse: beds x litres is a whole number of cans, 2 or more
#   7. the signal: a pattern that adds the same number each time; the answer is under 100
#   8. every times fact a cadet needs is inside 10 x 10, or a multiple of ten
# The play test (checks/stardust_test.js) holds the same check number, so the two cannot drift apart unseen.
#
# Run:  python3 checks/stardust_quest_check.py
import itertools, collections, sys

M = 0xFFFFFFFF
def wrng(seed):
    a = seed & M
    def r():
        nonlocal a
        a = (a + 0x6D2B79F5) & M
        t = a
        t = ((t ^ (t >> 15)) * (t | 1)) & M
        t = (t ^ ((t + (((t ^ (t >> 7)) * (t | 61)) & M)) & M)) & M
        return ((t ^ (t >> 14)) & M) / 4294967296
    return r

ROOMS = [('control', 18, 24), ('living', 18, 24), ('green', 24, 28), ('food', 2, 6), ('engine', 20, 28)]
MONTHS = 6
TANKS = [(200, [2, 4, 5, 10]), (50, [2, 5, 10]), (20, [2, 4, 5, 10])]
# [Source: Marc's food sheet] name, energy score, months it lasts
LONG = [('Freeze-Dried Apple', 5, 18), ('Canned Beans', 7, 24), ('Instant Ramen', 8, 12), ('Protein Bars', 10, 18), ('Canned Tuna', 6, 36), ('Dried Lentils', 7, 12), ('Dark Chocolate', 8, 24), ('Canned Peaches', 5, 36), ('Chicken Jerky', 7, 12)]
SHORT = [('Brown Rice', 6, 6), ('Almonds', 9, 9), ('Oats', 8, 8), ('Cornflakes', 5, 6), ('Fresh Carrots', 4, 1), ('Trail Mix', 7, 9), ('Fresh Spinach', 4, 0.5), ('Peanut Butter', 9, 9), ('Whole Wheat Bread', 6, 1), ('Fresh Milk', 6, 0.5), ('Quinoa', 7, 8)]
BOTH = ['Protein', 'Dairy', 'Grains', 'Snacks']
WAYS_MIN, CRATE, TRIP = 12, 10, 12

WAYS = {}
def ways(scores, T):
    """How many ways can packs of these foods (0 to 10 of each) make exactly T? Every combination is tried."""
    key = (tuple(sorted(scores)), T)
    if key not in WAYS:
        WAYS[key] = sum(1 for c in itertools.product(range(CRATE + 1), repeat=len(scores)) if sum(a * b for a, b in zip(c, scores)) == T)
    return WAYS[key]

def nums(seed):
    r = wrng(seed * 3 + 11)
    pk = lambda xs: xs[int(r() * len(xs))]
    def take(n, k):
        idx = list(range(n)); out = []
        for _ in range(k): out.append(idx.pop(int(r() * len(idx))))
        return out
    v = {}
    v['temp'] = [pk(list(range(lo, hi + 1, 2))) for _, lo, hi in ROOMS]
    v['bad'] = int(r() * 5)
    v['hot'] = True if ROOMS[v['bad']][0] == 'food' else r() < .5
    v['off'] = pk([2, 4, 6])
    _, lo, hi = ROOMS[v['bad']]
    v['temp'][v['bad']] = hi + v['off'] if v['hot'] else lo - v['off']
    v['shelf'] = None
    for _ in range(200):
        v['p'] = pk([10, 20]); v['T'] = 4 * v['p'] * 3
        lg, sh = take(len(LONG), 4), take(len(SHORT), 2)
        v['ways'] = ways([LONG[j][1] for j in lg], v['T'])
        if v['ways'] >= WAYS_MIN:
            order = [LONG[j] for j in lg] + [SHORT[j] for j in sh]; shelf = []
            while order: shelf.append(order.pop(int(r() * len(order))))
            v['shelf'] = shelf
            break
    m = take(MONTHS, 3); top = pk([550, 600])
    v['wm'], v['gm'], v['lm'] = m
    fuel = [pk([400, 450]) for _ in range(MONTHS)]; dist = [pk([900, 1000]) for _ in range(MONTHS)]
    fuel[v['wm']] = top; dist[v['wm']] = pk([600, 700]); fuel[v['lm']] = top; dist[v['lm']] = 1200; fuel[v['gm']] = pk([300, 350]); dist[v['gm']] = 1100
    v['fuel'], v['dist'] = fuel, dist
    v['tanks'] = []
    for cap, bs in TANKS:
        b = pk(bs); k = 1 + int(r() * (b - 1))
        v['tanks'].append((cap, b, k, (b - k) * cap / b))
    v['first'] = None
    for _ in range(200):
        first = {c: pk([250, 300, 350, 400, 450]) for c in BOTH}
        up = pk(BOTH); last = {}
        for c in BOTH: last[c] = first[c] + 50 if c == up else first[c] - pk([50, 100, 150, 200, 250, 300])
        fall = [first[c] - last[c] for c in BOTH]; mx = max(fall)
        if all(last[c] >= 50 for c in BOTH) and fall.count(mx) == 1 and mx >= 150:
            v['first'], v['last'], v['fell'], v['by'] = first, last, BOTH[fall.index(mx)], mx
            break
    v['fresh'] = [pk([250, 300, 350]), pk([200, 250, 300])]; v['store'] = [pk([200, 250, 300, 350]), pk([150, 200, 250])]
    ok = False
    for _ in range(200):
        v['beds'], v['each'], v['can'] = pk([4, 6, 8]), pk([2, 3, 4, 6]), pk([4, 6, 8, 12])
        if v['can'] != v['each'] and (v['beds'] * v['each']) % v['can'] == 0 and v['beds'] * v['each'] // v['can'] >= 2: ok = True; break
    v['water_ok'] = ok; v['cans'] = v['beds'] * v['each'] / v['can']
    s0, st = pk([2, 3, 4, 5]), pk([3, 4, 5, 6])
    v['sig'] = [s0 + st * i for i in range(4)]; v['next'] = s0 + st * 4
    return v

N = 20000
bad = collections.Counter(); sets = set(); ways_all = []; check = 0; facts = collections.Counter()
for s in range(1, N + 1):
    v = nums(s); t = v['temp']
    # 1. the rooms
    out = [i for i, (_, lo, hi) in enumerate(ROOMS) if not lo <= t[i] <= hi]
    if out != [v['bad']]: bad['not exactly one room breaks its plate'] += 1
    if any(x % 2 or x < 0 or x > 40 for x in t): bad['a thermometer is off the chart'] += 1
    _, lo, hi = ROOMS[v['bad']]; gap = t[v['bad']] - hi if t[v['bad']] > hi else lo - t[v['bad']]
    if gap != v['off'] or gap not in (2, 4, 6): bad['degrees over the plate'] += 1
    # 2. the locker
    if v['shelf'] is None: bad['no shelf found'] += 1; continue
    good = [f for f in v['shelf'] if f[2] >= TRIP]; spoil = [f for f in v['shelf'] if f[2] < TRIP]
    if len(good) != 4 or len(spoil) != 2 or len({f[0] for f in v['shelf']}) != 6: bad['shelf is not four good foods and two that spoil'] += 1
    if v['T'] != 4 * v['p'] * 3 or v['T'] not in (120, 240): bad['whole amount'] += 1
    n_ways = sum(1 for c in itertools.product(range(CRATE + 1), repeat=4) if sum(a * f[1] for a, f in zip(c, good)) == v['T']) if s <= 1500 else ways([f[1] for f in good], v['T'])
    if n_ways != v['ways'] or n_ways < WAYS_MIN: bad['locker ways'] += 1
    ways_all.append(n_ways)
    # 3. the fuel log
    f, d = v['fuel'], v['dist']
    if len({v['wm'], v['gm'], v['lm']}) != 3: bad['special months collide'] += 1
    worst = [i for i in range(MONTHS) if f[i] == max(f) and d[i] == min(d)]
    if worst != [v['wm']] or d.count(min(d)) != 1: bad['the bad month is not the only one'] += 1
    if sorted(i for i in range(MONTHS) if f[i] == max(f)) != sorted([v['wm'], v['lm']]): bad['fuel chart alone would answer'] += 1
    if d.index(max(d)) != v['lm'] or d.count(max(d)) != 1 or f.index(min(f)) != v['gm'] or f.count(min(f)) != 1: bad['good months'] += 1
    if min(range(MONTHS), key=lambda i: d[i] / f[i]) != v['wm']: bad['km for each litre'] += 1
    if any(x % 50 or x > 700 for x in f) or any(x % 100 or x > 1200 for x in d): bad['fuel bars off the lines'] += 1
    # 4. the tanks
    for cap, b, k, need in v['tanks']:
        if cap % b or need != int(need) or not 0 < need < cap or not 1 <= k < b: bad['tank'] += 1
        if need != (cap // b) * (b - k): bad['tank sum'] += 1
        facts[(cap // b, b - k)] += 1
    # 5. what the crew ate
    if v['first'] is None: bad['no food charts found'] += 1; continue
    fall = {c: v['first'][c] - v['last'][c] for c in BOTH}; mx = max(fall.values())
    if list(fall.values()).count(mx) != 1 or mx < 150 or fall[v['fell']] != mx or v['by'] != mx: bad['biggest fall'] += 1
    bars = list(v['first'].values()) + list(v['last'].values()) + v['fresh'] + v['store']
    if any(x % 50 or x < 50 or x > 500 for x in bars): bad['food bars off the lines'] += 1
    # 6. the greenhouse, 7. the signal
    if not v['water_ok'] or v['cans'] != int(v['cans']) or v['cans'] < 2 or v['beds'] * v['each'] != v['cans'] * v['can'] or v['beds'] * v['each'] > 48: bad['water'] += 1
    step = v['sig'][1] - v['sig'][0]
    if any(v['sig'][i + 1] - v['sig'][i] != step for i in range(3)) or v['next'] != v['sig'][3] + step or v['next'] > 99: bad['signal'] += 1
    sets.add((tuple(t), v['T'], tuple(f[0] for f in v['shelf']), v['wm'], tuple(v['tanks']), v['fell'], v['by']))
    if s <= 2000:
        check = (check + sum(t) * 7 + v['bad'] * 3 + v['off'] * 5 + v['T'] + sum(ord(f[0][0]) * (i + 1) for i, f in enumerate(v['shelf'])) + v['wm'] * 11 + v['gm'] * 13 + v['lm'] * 17 + sum(f) + sum(d)
                 + sum(int(x[3]) * (i + 2) for i, x in enumerate(v['tanks'])) + BOTH.index(v['fell']) * 19 + v['by'] + sum(v['fresh']) + sum(v['store']) + int(v['cans']) * 23 + v['next'] * 29) % 1000000007

ways_all.sort()
print(f'cadets checked: {N}')
print(f'different sets of numbers: {len(sets)}')
print(f'ways to fill the locker exactly: fewest {ways_all[0]}, middle {ways_all[len(ways_all) // 2]}, most {ways_all[-1]}')
print(f'tank sums (litres in one part x parts to add), largest: {max(a * b for a, b in facts)} litres; all are a tens fact or inside 10 x 10: {all(a % 10 == 0 or a * b <= 100 for a, b in facts)}')
EXPECT = 26692101      # the same number is in checks/stardust_test.js
print(f'check number: {check}')
if bad:
    print('FAILED:', dict(bad)); sys.exit(1)
if EXPECT and check != EXPECT:
    print(f'FAILED: the check number changed. It was {EXPECT}. Change it here and in checks/stardust_test.js together.'); sys.exit(1)
print('PASS: every cadet gets a mission ship that can be cleared for launch')
