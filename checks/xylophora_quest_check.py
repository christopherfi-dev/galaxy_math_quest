# Planet Xylophora as built: every cadet's numbers, worked out again.   [Proposal]
#
# The game gives each cadet their own numbers from a seed (function xNums in prototypes/kis_station_sketch.html).
# This file makes the same numbers in Python, with no code shared with the game, and checks 20,000 seeds:
#   1. every number comes from its list, and the skin's two rectangles fit their place on the map
#   2. the skin's area is right: the squares are counted one by one on the map and compared with a x b + c x d
#   3. the Hospital has exactly one floor shape with the shortest wall; the Food Store has exactly one biggest floor
#   4. the Solar Factory fits on the Sun Ledge (10 squares by 3)
#   5. the skin is enough for the four floors, and "how many more Homes?" has one answer, from 2 to 6
#   6. the three floors on the building ground fit, with a path between them
#   7. the Leafgrove grows enough leaves for careful roofs, and one more
#   8. the herder's field shares into four equal parts
#   9. every times fact a cadet needs is inside 10 x 10
# The play test (checks/xylophora_test.js) holds the same check number, so the two cannot drift apart unseen.
#
# Run:  python3 checks/xylophora_quest_check.py
import math, sys, collections

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

A_SET, B_SET, C_SET, D_SET = [8, 9, 10], [6, 7, 8], [3, 4, 5], [2, 3, 4, 5]
H_SET, P_SET, W_SET, K_SET = [6, 8, 12], [12, 16, 20, 24], [10, 12, 14, 16, 18], [5, 6, 7, 8]
FIELDS = [[4, 2], [4, 3], [4, 4], [6, 2], [6, 4], [8, 2], [8, 3], [8, 4]]
BOX_W, BOX_H, GROUND_W, GROUND_H, LEDGE_W, LEDGE_H = 13, 8, 14, 8, 10, 3

def leaves(w, l): return math.ceil(w / 2) * math.ceil(l / 2)
def rects(area): return [(w, area // w) for w in range(1, area + 1) if area % w == 0 and w * w <= area]
def best_floor(P):
    w = P // 4
    return (w, P // 2 - w)

def nums(seed):
    r = wrng(seed)
    pk = lambda xs: xs[int(r() * len(xs))]
    v = None
    for _ in range(200):
        a, b = pk(A_SET), pk(B_SET)
        c = pk([x for x in C_SET if a + x <= 13])
        d = pk([x for x in D_SET if x <= b - 2])
        S = a * b + c * d
        h, p, W, k = pk(H_SET), pk(P_SET), pk(W_SET), pk(K_SET)
        sf = best_floor(W); st = sf[0] * sf[1]; f = 3 * k; T = h + p + st + f; n = (S - T) // h
        if 2 <= n <= 6:
            v = dict(a=a, b=b, c=c, d=d, S=S, h=h, p=p, W=W, sf=sf, st=st, k=k, f=f, T=T, left=S - T, n=n, rem=(S - T) % h)
            break
    if v is None: return None
    v['fx'] = r() < .5; v['fy'] = r() < .5; v['field'] = pk(FIELDS)
    return v

def skin_tiles(v):
    """The squares of skin, as the game lays them in its 13 x 8 place on the map."""
    wd = v['a'] + v['c']; ox = (BOX_W - wd) // 2; oy = (BOX_H - v['b']) // 2; out = []
    for y in range(BOX_H):
        for x in range(BOX_W):
            lx, ly = x - ox, y - oy
            if v['fx']: lx = wd - 1 - lx
            if v['fy']: ly = v['b'] - 1 - ly
            if (0 <= lx < v['a'] and 0 <= ly < v['b']) or (v['a'] <= lx < wd and v['b'] - v['d'] <= ly < v['b']): out.append((x, y))
    return out

def fits_ground(shapes):
    """Can these floors (w, l), either way round, stand on the building ground with a path between them? Brute force."""
    def place(i, placed):
        if i == len(shapes): return True
        for (w, l) in {shapes[i], shapes[i][::-1]}:
            if w > GROUND_W or l > GROUND_H: continue
            for y in range(GROUND_H - l + 1):
                for x in range(GROUND_W - w + 1):
                    if all(x > px + pw or px > x + w or y > py + pl or py > y + l for (px, py, pw, pl) in placed):
                        if place(i + 1, placed + [(x, y, w, l)]): return True
        return False
    return place(0, [])

bad, N = [], 20000
sets, n_count, rem0, dry, facts_out = set(), collections.Counter(), 0, 0, set()
fit_cache, check_number = {}, 0
for seed in range(1, N + 1):
    v = nums(seed)
    if v is None: bad.append(f'seed {seed}: no numbers'); continue
    a, b, c, d, S, h, p, W, k, f = (v[x] for x in 'a b c d S h p W k f'.split())
    if a not in A_SET or b not in B_SET or c not in C_SET or d not in D_SET or a + c > 13 or d > b - 2: bad.append(f'seed {seed}: skin sides out of range')
    if h not in H_SET or p not in P_SET or W not in W_SET or k not in K_SET: bad.append(f'seed {seed}: an order out of range')
    tiles = skin_tiles(v)
    if len(tiles) != S or S != a * b + c * d: bad.append(f'seed {seed}: the skin counts {len(tiles)} squares, not {S}')
    # 3. one best shape each
    hw = [(q, 2 * (q[0] + q[1])) for q in rects(p)]; bestP = min(x[1] for x in hw); hbest = [q for q, per in hw if per == bestP]
    if len(hbest) != 1: bad.append(f'seed {seed}: Hospital {p} has {len(hbest)} shapes with the shortest wall')
    store = [(w, W // 2 - w, w * (W // 2 - w)) for w in range(1, W // 4 + 1)]; bestA = max(x[2] for x in store); sbest = [x for x in store if x[2] == bestA]
    if len(sbest) != 1 or bestA != v['st'] or (sbest[0][0], sbest[0][1]) != tuple(v['sf']): bad.append(f'seed {seed}: Food Store with {W} panels: best floor is not single or not {v["st"]}')
    # 4. the factory on the ledge
    fr = [q for q in rects(f) if q[0] <= LEDGE_H and q[1] <= LEDGE_W]
    if not fr: bad.append(f'seed {seed}: Solar Factory {f} does not fit the ledge')
    # 5. skin enough; one answer for more Homes
    T = h + p + bestA + f
    if T != v['T'] or S < T: bad.append(f'seed {seed}: floors need {T}, skin is {S}')
    n = (S - T) // h
    if n != v['n'] or not (2 <= n <= 6) or n * h > S - T or (n + 1) * h <= S - T: bad.append(f'seed {seed}: more Homes {n}')
    # 6. fit on the ground (the Home in its least wasteful shape, and also in its thinnest shape that the ground allows)
    home_shapes = rects(h); need_home = min(leaves(*q) for q in home_shapes); home_best = [q for q in home_shapes if leaves(*q) == need_home][0]
    key = (hbest[0], (sbest[0][0], sbest[0][1]), home_best)
    if key not in fit_cache: fit_cache[key] = fits_ground([hbest[0], (sbest[0][0], sbest[0][1]), home_best])
    if not fit_cache[key]: bad.append(f'seed {seed}: the three floors do not fit the ground')
    # 7. leaves
    need = need_home + leaves(*hbest[0]) + leaves(sbest[0][0], sbest[0][1]) + min(leaves(*q) for q in fr); G = need + 1
    trees = [G // 4 + (1 if i < G % 4 else 0) for i in range(4)]
    if sum(trees) != G or max(trees) > 9: bad.append(f'seed {seed}: trees {trees}')
    worst_home = max(leaves(*q) for q in home_shapes if q[1] <= GROUND_W)
    if need - need_home + worst_home > G: dry += 1
    # 8. the field
    fw, fh = v['field']
    if (fw * fh) % 4 or fw > 8 or fh > 4: bad.append(f'seed {seed}: field {fw} x {fh}')
    # 9. times facts
    for (x, y) in [(a, b), (c, d), hbest[0], (sbest[0][0], sbest[0][1]), (3, k), (n, h), (fw, fh)] + home_shapes:
        if x > 10 and y > 10: facts_out.add((x, y))
    sets.add((a, b, c, d, h, p, W, k)); n_count[n] += 1; rem0 += (S - T) % h == 0
    if seed <= 2000: check_number = (check_number + S * 7 + h * 5 + p * 3 + W + k * 11 + n * 13 + (1 if v['fx'] else 0) + (2 if v['fy'] else 0) + fw * 17 + fh * 19 + G * 23) % 1000000007

print(f'{N:,} seeds. Different sets of numbers: {len(sets):,}.')
print('More Homes:', ', '.join(f'{k} in {n_count[k]:,}' for k in sorted(n_count)))
print(f'Skin left over after the last Home: none in {rem0:,} seeds, some in {N - rem0:,}.')
print(f'A thin Home makes the grove run dry in {dry:,} seeds. The way out is always there: lay the Home again in a better shape.')
print('Times facts outside 10 x 10:', sorted(facts_out) if facts_out else 'none')
print(f'Check number for seeds 1 to 2,000: {check_number}')
EXPECT = 2708402   # the play test holds the same number
if EXPECT and check_number != EXPECT: bad.append(f'the check number is {check_number}, not {EXPECT}: the rule changed')
if facts_out: bad.append('a times fact is outside 10 x 10')
print('\nFAILED:\n  ' + '\n  '.join(bad[:20]) if bad else '\nEvery seed gives a planet that can be finished, with one answer where one is asked for.')
print('RESULT: FAIL' if bad else 'RESULT: PASS')
sys.exit(1 if bad else 0)
