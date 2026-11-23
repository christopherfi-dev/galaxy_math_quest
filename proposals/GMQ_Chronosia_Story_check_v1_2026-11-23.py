# Number rules proposed in proposals/GMQ_Chronosia_Story_v1_2026-11-23.md, checked before anyone builds them.
# [Proposal: every rule here.] Nothing in the game uses these yet. The main thread would write them in the game, with the game's own seeds.
# This file does not sample seeds. It walks through EVERY combination each rule allows, so a pass means no cadet can get a bad question.
# Run: python3 proposals/GMQ_Chronosia_Story_check_v1_2026-11-23.py
import itertools, sys

bad = []
def T(m):  # minutes of the day to a clock time with no am or pm
    return f"{m // 60}:{m % 60:02d}"

# ---------------------------------------------------------------------------------------------------------------
# 1. THE FLOODED PASSAGE (the cave). The wall lists three floods: when the water comes in, and when it goes out.
#    The walk takes W minutes. The child chooses the minute to step in. Dry feet if: the water is out, and the walk ends
#    no later than the next "water in". Exactly one of the two dry gaps is long enough.
#    W: 15, 20 or 25.  Flood 1 goes out at t (1:00 to 3:55, in fives).  Short gap: W-10 or W-5.  Long gap: W+5 to W+20.
#    Either gap can come first.  Floods 1 and 2 last 20 to 40 minutes.
def flood_cases():
    for W in (15, 20, 25):
        for out1 in range(60, 240, 5):
            for f1 in (20, 30, 40):
                for f2 in (20, 30, 40):
                    for short in (W - 10, W - 5):
                        for long_ in (W + 5, W + 10, W + 15, W + 20):
                            for long_first in (True, False):
                                g1, g2 = (long_, short) if long_first else (short, long_)
                                in1 = out1 - f1
                                in2 = out1 + g1
                                out2 = in2 + f2
                                in3 = out2 + g2
                                yield W, [(in1, out1), (in2, out2), (in3, None)], (g1, g2)

n = 0; cross = 0; starts_min = 99
for W, rows, gaps in flood_cases():
    n += 1
    (in1, out1), (in2, out2), (in3, _) = rows
    fits = [g >= W for g in gaps]
    if fits.count(True) != 1: bad.append(f"flood: {fits.count(True)} gaps fit, W={W}, gaps={gaps}")
    # every start a child could type, minute by minute, and what happens
    ok = []
    for s in range(in1, in3 + 1):
        dry_now = (out1 <= s < in2) or (out2 <= s < in3)
        nxt = in2 if s < in2 else in3
        if dry_now and s + W <= nxt: ok.append(s)
    if not ok: bad.append(f"flood: no safe start, W={W}, rows={rows}")
    if ok and ok != list(range(ok[0], ok[-1] + 1)): bad.append("flood: the safe starts are not one unbroken stretch")
    five = [s for s in ok if s % 5 == 0]
    starts_min = min(starts_min, len(five))
    if len(five) < 2: bad.append(f"flood: fewer than two safe starts on a five-minute mark, W={W}, gaps={gaps}")
    if in1 < 20 or in3 >= 10 * 60: bad.append(f"flood: a time before 0:20 or after 9:59: {T(in1)} to {T(in3)}")
    if any(a // 60 != b // 60 for a, b in ((out1, in2), (out2, in3))): cross += 1
    if min(gaps) <= 0: bad.append("flood: a gap of no minutes")
print(f"1. The flooded passage: {n} tables, every one walked minute by minute. Fewest safe five-minute starts: {starts_min}. Tables where a gap crosses the hour: {cross}.")

# ---------------------------------------------------------------------------------------------------------------
# 2. THE GEAR DOOR (the cave). The handle's small wheel has a teeth. The big wheel has a x k teeth and must turn exactly once.
#    How many turns of the handle?  a: 4 to 9.  k: 3 to 8.  The answer is k.
n = 0; answers = set()
for a in range(4, 10):
    for k in range(3, 9):
        n += 1; big = a * k
        if big % a or big // a != k: bad.append(f"gears: {big} / {a}")
        if big > 100: bad.append(f"gears: {big} teeth is past the facts to 100")
        if k == a: pass  # a square (6 and 36) is allowed: it is still one answer
        answers.add(k)
print(f"2. The gear door: {n} pairs of wheels. The big wheel has at most {max(a * k for a in range(4, 10) for k in range(3, 9))} teeth. Answers: {sorted(answers)}.")

# ---------------------------------------------------------------------------------------------------------------
# 3. THE SAND FOR THE LANTERN (Nomad Hollow). Four panes, p grams each. One lens, L grams. How many grams in all?
#    p: 30 to 90 in tens.  L: 50, 100, 150 or 200.  Weights on the scale: 100 g, 50 g and 10 g.
n = 0; totals = set()
for p in range(30, 100, 10):
    for L in (50, 100, 150, 200):
        n += 1; tot = 4 * p + L; totals.add(tot)
        if tot % 10: bad.append(f"sand: {tot} cannot be made from the weights")
        if tot > 1000: bad.append(f"sand: {tot} is past 1,000")
        if 4 * p == L: pass  # allowed
        # the two likely slips must not give the right total: one pane only, or the lens forgotten
        if p + L == tot or 4 * p == tot: bad.append(f"sand: a slip gives the right answer, p={p}, L={L}")
        # the fewest weights that make it: never more than 9 of the tens
        h, r = divmod(tot, 100); f, t = divmod(r, 50); t //= 10
        if h + f + t > 12: bad.append(f"sand: {tot} needs {h + f + t} weights")
print(f"3. The sand: {n} recipes. Totals from {min(totals)} g to {max(totals)} g, {len(totals)} different.")

# ---------------------------------------------------------------------------------------------------------------
# 4. THE DRIFTING BOAT (the dock). The post shows the last three times the boat came past: t, t+g, t+2g. When will it come next?
#    t: 1:00 to 4:55, in fives.  g: 35, 40, 45, 50 or 55 minutes.  The answer is t+3g.
n = 0; cross = 0
for t in range(60, 300, 5):
    for g in (35, 40, 45, 50, 55):
        n += 1; ts = [t, t + g, t + 2 * g, t + 3 * g]
        if ts[3] >= 10 * 60: bad.append(f"boat: the answer {T(ts[3])} is past 9:59")
        if len({x // 60 for x in ts}) > 1: cross += 1
        else: bad.append(f"boat: no time crosses an hour, t={T(t)}, g={g}")
        # no other simple rule fits the three times: the gaps are equal, so "add g" is the only reading
        if ts[1] - ts[0] != ts[2] - ts[1]: bad.append("boat: unequal gaps")
        # reading the times as plain numbers (1:50 as 150) must not also give an equal step, or a child could find a second "pattern"
        plain = [int(T(x).replace(':', '')) for x in ts[:3]]
        if plain[1] - plain[0] == plain[2] - plain[1] and (ts[2] + g) != t + 3 * g: bad.append("boat: a second pattern")
print(f"4. The drifting boat: {n} posts. Every one crosses an hour ({cross} of {n}).")

# ---------------------------------------------------------------------------------------------------------------
# 5. THE COUGAR'S CLOCK (Cougar Rock). Three windings. Each takes a while, so the master clock has moved on each time.
#    The child reads the master clock (a clock face, to 5 minutes) and sets the cougar's number wheels.
#    First time: 1:00 to 8:55, in fives.  Then 20 to 40 minutes later, twice.
n = 0
for t in range(60, 9 * 60, 5):
    for g1 in (20, 25, 30, 35, 40):
        for g2 in (20, 25, 30, 35, 40):
            n += 1; ts = [t, t + g1, t + g1 + g2]
            if any(x % 5 for x in ts): bad.append("cougar: a time off the five-minute marks")
            if not (ts[0] < ts[1] < ts[2]): bad.append("cougar: the times do not go forward")
            if ts[2] > 12 * 60 + 55: bad.append(f"cougar: {T(ts[2])} is past 12:55")
            if len(set(ts)) != 3: bad.append("cougar: two readings the same")
print(f"5. The cougar's clock: {n} sets of three readings. Each is later than the one before, and on a five-minute mark.")

# ---------------------------------------------------------------------------------------------------------------
# THE SAMPLE TIDE TABLE printed in the note, worked out here so the note cannot be wrong about it.
W = 20; rows = [(80, 110), (125, 155), (190, None)]
ok = [s for s in range(rows[0][0], rows[2][0] + 1) if ((rows[0][1] <= s < rows[1][0]) or (rows[1][1] <= s < rows[2][0])) and s + W <= (rows[1][0] if s < rows[1][0] else rows[2][0])]
print(f"   The note's sample: walk {W} minutes. Water in {T(80)}, out {T(110)}. In {T(125)}, out {T(155)}. In {T(190)}. Safe to step in from {T(ok[0])} to {T(ok[-1])}.")
if (T(ok[0]), T(ok[-1])) != ('2:35', '2:50'): bad.append("the note's sample tide table does not give 2:35 to 2:50")

print()
if bad:
    print(f"FAULTS: {len(bad)}"); [print(' -', b) for b in bad[:20]]; print("RESULT: FAIL"); sys.exit(1)
print("Every combination each rule allows was walked through. 0 faults.")
print("RESULT: PASS")
