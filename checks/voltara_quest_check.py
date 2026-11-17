"""Check every number in the Voltara quest in prototypes/kis_station_sketch.html.   [Proposal]

[Source] The 21 places and their needs are Marc's "City List" (the doc his site links to).
         The supply is his: 8 hundreds, 70 tens and 150 ones.
[Proposal] The river rule, the plan rule, the night log and the hidden town are Claude's.

Run:  python3 checks/voltara_quest_check.py     (standard library only)
"""
import random

CITY = {"Home Street": [("Neighborhood 1", 200), ("Neighborhood 2", 200), ("Schools", 100), ("Hospital", 50), ("Parks", 50), ("Zoo", 30), ("Swimming Pool", 20), ("Supermarket", 100)],
        "Market Street": [("Shopping Mall", 250), ("Office Buildings", 200), ("Hotels", 150), ("Restaurants", 100), ("Sports Arena", 50), ("Arts Theater", 30), ("Bus Stop", 20), ("Amusement Park", 80)],
        "Factory Row": [("Factory", 200), ("Solar Power Plant", 250), ("Warehouse", 50), ("Recycling Plant", 50), ("Gas Station", 40)]}
SUPPLY = 1650
ok = True


def check(name, cond, detail=""):
    global ok
    ok &= bool(cond)
    print(f"  {'ok ' if cond else 'BAD'} {name}{': ' + detail if detail else ''}")


def round100(n): return (n + 50) // 100 * 100     # halfway goes up


print("1. The city and the tower")
tot = {k: sum(n for _, n in v) for k, v in CITY.items()}
check("street totals are 750, 880 and 590", list(tot.values()) == [750, 880, 590], str(tot))
need = sum(tot.values())
check("the city needs 2,220", need == 2220)
check("the tower holds 1,650", 8 * 100 + 70 * 10 + 150 == SUPPLY)
check("150 sparks make 15 rods", 150 // 10 == 15 and 150 % 10 == 0)
check("85 rods make 8 big crystals and 5 rods", divmod(70 + 15, 10) == (8, 5))
check("16 big crystals and 5 rods are 1,650", (8 + 8) * 100 + 5 * 10 == SUPPLY)
r = [round100(v) for v in tot.values()]
check("the round numbers are 800, 900 and 600", r == [800, 900, 600])
check("the quick answer is 2,300 - 1,700 = 600", sum(r) == 2300 and round100(SUPPLY) == 1700 and sum(r) - 1700 == 600)
check("the exact answer is 570 short", need - SUPPLY == 570)
check("the quick answer is close to the exact one", abs(600 - 570) <= 50)

print("2. The river: round to the nearest hundred, on 10,000 seeds")
bad = 0
for seed in range(10000):
    rnd = random.Random(seed); seen = []
    for hop in range(4):
        lo = rnd.choice([x for x in range(100, 900, 100) if x not in seen]); seen.append(lo)
        off = 50 if hop == 3 else rnd.choice([1, 2, 3, 4, 6, 7, 8, 9]) * 10 + rnd.randrange(10)
        n, ans = lo + off, (lo + 100 if off >= 50 else lo)
        # the nearer hundred, found a second way: by distance. A tie goes up.
        d_lo, d_hi = n - lo, lo + 100 - n
        bad += not (ans == (lo if d_lo < d_hi else lo + 100) and n % 100 != 0 and (hop < 3) == (d_lo != d_hi) and 110 <= n <= 899)
check("every stone has one right answer, and only the last is halfway", bad == 0, f"{bad} bad in 40,000 stones")

print("3. The values [Proposal: Claude's numbers, on Marc's idea]. Every place uses energy and makes people happy. Some make people unhappy if dark.")
#  place: (people happy if lit, people unhappy if dark)
VAL = {"Neighborhood 1": (80, 250), "Neighborhood 2": (80, 250), "Schools": (60, 60), "Hospital": (40, 300), "Parks": (40, 0), "Zoo": (30, 0), "Swimming Pool": (20, 0), "Supermarket": (60, 250),
       "Shopping Mall": (80, 0), "Office Buildings": (50, 20), "Hotels": (30, 0), "Restaurants": (60, 0), "Sports Arena": (40, 0), "Arts Theater": (30, 0), "Bus Stop": (30, 40), "Amusement Park": (70, 0),
       "Factory": (40, 0), "Solar Power Plant": (0, 0), "Warehouse": (20, 0), "Recycling Plant": (20, 40), "Gas Station": (20, 20), "Nomad Hollow": (40, 40)}
MAKES = {"Solar Power Plant": 600, "Factory": 500, "Nomad Hollow": 100}       # energy for tomorrow, if lit today
BASE, GOAL, UP, DOWN, THEFT, NOMAD_E, CAP = 1050, 600, 50, 20, 240, 240, 2000      # CAP: the tower is full at 2,000
names = [n for v in CITY.values() for n, _ in v]; cost = dict((n, c) for v in CITY.values() for n, c in v); cost["Nomad Hollow"] = NOMAD_E
N = len(names); bit = {n: 1 << i for i, n in enumerate(names)}; FAC, SOL = bit["Factory"], bit["Solar Power Plant"]
check("every place has values, and they are whole tens", set(VAL) == set(cost) and all(a % 10 == 0 and b % 10 == 0 for a, b in VAL.values()))
check("the tower by itself plus the solar plant makes exactly what you found: 1,650", BASE + MAKES["Solar Power Plant"] == SUPPLY)
check("each power place gives more than it uses", all(MAKES[n] > cost[n] for n in ("Solar Power Plant", "Factory")), "solar 250 -> 600, factory 200 -> 500")
ALL_H = sum(VAL[n][0] for n in names); ALL_U = sum(VAL[n][1] for n in names)
check("with all 21 places lit, 900 people are happy. With all dark, 1,230 are unhappy", (ALL_H, ALL_U) == (900, 1230))
check("the tower can never hold enough to light everything", CAP < 2220)


def day(supply, smoke, on, known):
    """One day. on = set of lit places. Returns happy, unhappy, smoke after, tower should hold, tower holds."""
    spots = names + (["Nomad Hollow"] if known else [])
    usedE = sum(cost[n] for n in on); assert on and usedE <= supply and on <= set(spots)
    smoke2 = smoke + UP if "Factory" in on else max(0, smoke - DOWN)
    happy = sum(VAL[n][0] for n in on); unhappy = sum(VAL[n][1] for n in spots if n not in on) + smoke2
    expected = BASE + sum(MAKES.get(n, 0) for n in on) + supply - usedE
    return happy, unhappy, smoke2, expected, min(CAP, expected - (0 if known else THEFT))


ENDING = ["worse off", "power, but not happy", "happy, but short of power", "shines"]
ending = lambda mood, tower: (2 if mood >= GOAL else 0) + (1 if tower >= SUPPLY else 0)
# every one of the 2,097,152 plans, by bit mask
E, H, U = [0] * (1 << N), [0] * (1 << N), [0] * (1 << N)        # energy used, happy, unhappy AVOIDED
for m in range(1, 1 << N):
    low = m & -m; n = names[low.bit_length() - 1]; r = m ^ low
    E[m], H[m], U[m] = E[r] + cost[n], H[r] + VAL[n][0], U[r] + VAL[n][1]
def one(m, supply, smoke, known, nomad=False):
    """the same day as day(), from the tables. Returns mood, tower next morning"""
    sm = smoke + UP if m & FAC else max(0, smoke - DOWN)
    mood = H[m] - (ALL_U - U[m]) - sm + ((40 if nomad else -40) if known else 0)
    tower = BASE + (600 if m & SOL else 0) + (500 if m & FAC else 0) + (100 if nomad else 0) + supply - E[m] - (NOMAD_E if nomad else 0) - (0 if known else THEFT)
    return mood, min(CAP, tower)
# the two ways of working agree
rnd = random.Random(1); agree = True
for _ in range(2000):
    m = rnd.randrange(1, 1 << N); on = {names[i] for i in range(N) if m >> i & 1}; known = rnd.random() < .5; nom = known and rnd.random() < .5; sm = rnd.choice([0, 20, 50, 130])
    sup = rnd.choice([2000, 2500, 3000]); h, u, s2, ex, act = day(sup, sm, on | ({"Nomad Hollow"} if nom else set()), known); agree &= (h - u, act) == one(m, sup, sm, known, nom)
check("two separate ways of working out a day agree on 2,000 random plans", agree)

VITAL = [n for n in names if VAL[n][1]]; FUN = [n for n in names if not VAL[n][1] and n not in MAKES]
def careful_child(rnd, supply, known, keep):
    """A child who thinks a little: light every place marked '!', and the solar plant. Then add fun places in a random order while they fit, keeping `keep` energy back."""
    on = set(VITAL) | {"Solar Power Plant"}; usedE = sum(cost[n] for n in on)
    if known and rnd.random() < .5: on.add("Nomad Hollow"); usedE += NOMAD_E
    for n in rnd.sample(FUN, len(FUN)):
        if usedE + cost[n] <= supply - keep: on.add(n); usedE += cost[n]
    return on
def best_value_child(supply, known, keep, nomad, factory=False):
    """A child who thinks harder: after the '!' places and the solar plant, picks the fun place with the most happy people for its energy, again and again."""
    on = set(VITAL) | {"Solar Power Plant"} | ({"Nomad Hollow"} if nomad else set()) | ({"Factory"} if factory else set()); usedE = sum(cost[n] for n in on)
    for n in sorted(FUN, key=lambda n: -VAL[n][0] / cost[n]):
        if usedE + cost[n] <= supply - keep: on.add(n); usedE += cost[n]
    return on

print("   Day 1, before the mystery is solved (tower 1,650, 240 goes missing):")
count = [0, 0, 0, 0]; clean_perfect = 0
for m in range(1, 1 << N):
    if E[m] > SUPPLY: continue
    mood, tower = one(m, SUPPLY, 0, False); e = ending(mood, tower); count[e] += 1; clean_perfect += e == 3 and not m & FAC
fit1 = sum(count)
for i in (3, 2, 1, 0): print(f"      {ENDING[i]:<28} {count[i]:>9,} plans")
check("all four endings can happen on day 1", all(count))
check("both goals can be met on day 1, with or without the Factory", clean_perfect > 0 and count[3] > clean_perfect, f"{clean_perfect:,} clean plans, {count[3] - clean_perfect:,} with the Factory")
check("the Factory makes it easier today", count[3] - clean_perfect > 2 * clean_perfect)
for must in ("Hospital", "Neighborhood 1", "Neighborhood 2", "Supermarket"):
    top = max(one(m, CAP, 0, True, nom)[0] for m in range(1 << N) if not m & bit[must] for nom in (False, True) if E[m] + (NOMAD_E if nom else 0) <= CAP)
    check(f"no plan makes the people happy with the {must} dark, even with a full tower", top < GOAL, f"best is {top}")
h, u, _, _, t = day(SUPPLY, 0, best_value_child(SUPPLY, False, 0, False), False)
check("day 1, a child who thinks hard but does not know about the missing 240: happy, but short of power", ENDING[ending(h - u, t)] == "happy, but short of power", f"{h} happy, {u} unhappy, tower {t:,}")
h, u, _, _, t = day(SUPPLY, 0, best_value_child(SUPPLY, False, 240, False), False)
check("the same child, keeping 240 back for the night, just misses: before the choice the clean way is very narrow", ENDING[ending(h - u, t)] == "power, but not happy" and GOAL - (h - u) <= 20, f"{h} happy, {u} unhappy, tower {t:,}")
h, u, _, _, t = day(SUPPLY, 0, best_value_child(SUPPLY, False, 0, False, factory=True), False)
check("with the Factory as well, that child meets both goals on day 1, at the price of smoke", ending(h - u, t) == 3, f"{h} happy, {u} unhappy, tower {t:,}")

print("   After the Council's choice (22 places, nothing goes missing, tower 1,650, clear sky):")
cnt = {}; repeat = {True: 0, False: 0}; no_solar = 0
for m in range(1 << N):
    for nom in (False, True):
        if E[m] + (NOMAD_E if nom else 0) > SUPPLY or (m == 0 and not nom): continue
        mood, tower = one(m, SUPPLY, 0, True, nom); e = ending(mood, tower); cnt[e] = cnt.get(e, 0) + 1
        if e == 3 and not m & FAC: repeat[nom] += 1; no_solar += not m & SOL
fit2 = sum(cnt.values())
check("all four endings can still happen", all(cnt.get(i) for i in range(4)), ", ".join(f"{ENDING[i]} {cnt[i]:,}" for i in (3, 2, 1, 0)))
check("there are clean plans that meet both goals and can be repeated every day", repeat[True] > 0 and repeat[False] > 0, f"{repeat[True]:,} with the Nomads lit, {repeat[False]:,} with them dark")
check("so the Council's choice stays open: sharing or not, Voltara can shine", repeat[True] > 100 and repeat[False] > 100)
check("every one of those lights the Solar Power Plant", no_solar == 0)
check("it is much easier than before the choice", repeat[True] + repeat[False] > 10 * clean_perfect, f"{repeat[True] + repeat[False]:,} against {clean_perfect:,}")
wins = [0, 0]
for seed in range(4000):
    rnd = random.Random(seed); known = seed % 2 == 1; on = careful_child(rnd, SUPPLY, known, 0 if known else 240); h, u, _, _, t = day(SUPPLY, 0, on, known); wins[known] += ending(h - u, t) == 3
check("a careful child (all '!' places, the solar plant, then fun at random) sometimes meets both goals, not always", 100 < wins[1] < 1900, f"before the choice {wins[0] / 20:.0f}%, after it {wins[1] / 20:.0f}%. Choosing WHICH fun places is the thinking.")
for nomad in (False, True):
    h, u, _, _, t = day(SUPPLY, 0, best_value_child(SUPPLY, True, 0, nomad), True)
    check(f"a child who picks the best-value fun places meets both goals, Nomads {'lit' if nomad else 'dark'}", ending(h - u, t) == 3, f"{h} happy, {u} unhappy, tower {t:,}")

print("4. The days")
# the most happy-minus-unhappy the 19 other places can give for a given energy (a knapsack table), used to search every policy
others = [n for n in names if n not in ("Factory", "Solar Power Plant")]; M = 180
best = [-sum(VAL[n][1] for n in others)] * (M + 1)
for n in others:
    e = cost[n] // 10
    for c in range(M, e - 1, -1): best[c] = max(best[c], best[c - e] + sum(VAL[n]))
for c in range(1, M + 1): best[c] = max(best[c], best[c - 1])
check("the knapsack table agrees with trying every plan", all(best[c] == max(H[m] - (ALL_U - U[m]) for m in range(1 << N) if not m & (FAC | SOL) and E[m] <= c * 10) for c in (0, 37, 91, 116, 140, 177)))
least = lambda mood: next((c * 10 for c in range(M + 1) if best[c] >= mood), None)
def moves(S, sm, known, factory_every_day=False):
    """every way to meet BOTH goals today that keeps the most energy. Yields (tower, smoke) for tomorrow."""
    for sol in (0, 1):
        for fac in ((1,) if factory_every_day else (0, 1)):
            for nom in ((0, 1) if known else (0,)):
                s2 = sm + UP if fac else max(0, sm - DOWN); bonus = (40 if fac else 0) - s2 + ((40 if nom else -40) if known else 0)
                e = least(GOAL - bonus)
                if e is None: continue
                usedE = e + 250 * sol + 200 * fac + NOMAD_E * nom
                if usedE == 0 or usedE > S: continue
                S2 = min(CAP, BASE + 600 * sol + 500 * fac + 100 * nom + S - usedE - (0 if known else THEFT))
                if S2 >= SUPPLY: yield S2, s2
SMAX, GMAX = CAP, 600
def forever(known, factory_every_day=False):
    """the states (tower, smoke) from which both goals can be met EVERY day from now on. Also: how many days in a row from landing."""
    K = {(S, g) for S in range(0, SMAX + 1, 10) for g in range(0, GMAX + 1, 10)}; rounds = 0; run = None
    while True:
        K2 = {x for x in K if any((min(a, SMAX), min(b, GMAX)) in K for a, b in moves(x[0], x[1], known, factory_every_day))}; rounds += 1
        if run is None and (SUPPLY, 0) not in K2: run = rounds - 1
        if K2 == K or not K2: return K2, run
        K = K2
K, run = forever(True)
check("after the Council's choice, both goals can be met every day from the day you landed", (SUPPLY, 0) in K)
K, run = forever(False, factory_every_day=True)
check("running the Factory every day cannot last: the smoke builds up", not K, f"from landing it holds both goals for {run} days in a row")
K, run2 = forever(True, factory_every_day=True)
check("the same after the choice", not K, f"{run2} days in a row")
check("the worst morning is 810: spend everything, light no power place", BASE - THEFT == 810 and any(E[m] == SUPPLY and not m & (FAC | SOL) for m in range(1 << N)))

# the five days the Playwright test plays
D1 = {'Hospital', 'Shopping Mall', 'Amusement Park', 'Hotels', 'Restaurants', 'Sports Arena', 'Arts Theater', 'Zoo', 'Swimming Pool', 'Parks', 'Office Buildings', 'Neighborhood 1', 'Neighborhood 2', 'Supermarket'}
D2 = {'Factory', 'Neighborhood 1', 'Neighborhood 2', 'Hospital', 'Supermarket', 'Schools', 'Bus Stop', 'Recycling Plant', 'Swimming Pool'}
D3 = {'Factory', 'Solar Power Plant', 'Neighborhood 1', 'Neighborhood 2', 'Hospital', 'Supermarket', 'Schools', 'Bus Stop', 'Recycling Plant', 'Gas Station', 'Amusement Park', 'Swimming Pool'}
D4 = set(VITAL) | {'Solar Power Plant', 'Nomad Hollow', 'Amusement Park', 'Parks', 'Sports Arena', 'Restaurants', 'Zoo', 'Swimming Pool', 'Arts Theater', 'Warehouse'}
D5 = set(names) - {'Factory', 'Solar Power Plant'}
S_, sm, path = SUPPLY, 0, []
for on, known in [(D1, False), (D2, False), (D3, True), (D4, True), (D5, True)]:
    h, u, sm, ex, S_ = day(S_, sm, on, known); path.append((h, u, sm, ex, S_, ENDING[ending(h - u, S_)]))
print("   the five played days: " + " | ".join(f"{h} happy, {u} unhappy, smoke {g}, should hold {x:,}, holds {t:,}: {e}" for h, u, g, x, t, e in path))
check("the five played days give all four endings", [p[5] for p in path] == ["worse off", "worse off", "power, but not happy", "shines", "happy, but short of power"])
check("day 3 of that path fills the tower: more is made than the 2,000 it can keep", path[2][3] > CAP and path[2][4] == CAP, f"{path[2][3]:,} made")

# thousands of random students
bad, lo, hi, ends, moods = 0, 10 ** 9, 0, [0, 0, 0, 0], set()
for seed in range(5000):
    rnd = random.Random(seed); S_, sm, decided = SUPPLY, 0, rnd.randint(2, 9)
    for d in range(1, 9):
        known = d >= decided; pool = names + (["Nomad Hollow"] if known else []); rnd.shuffle(pool); on, usedE = set(), 0
        for n in pool[:rnd.randint(1, len(pool))]:
            if usedE + cost[n] <= S_: on.add(n); usedE += cost[n]
        if not on: bad += 1; break
        h, u, sm, ex, act = day(S_, sm, on, known)
        bad += not (h >= 0 and u >= 0 and h % 10 == 0 and u % 10 == 0 and act == min(CAP, ex - (0 if known else THEFT)) and 810 <= act <= CAP and ex < 10 ** 5 and abs(h - u) < 10 ** 4)
        S_ = act; lo, hi = min(lo, act), max(hi, act); moods.add(h - u)
    ends[ending(h - u, S_)] += 1
check("5,000 random students, 8 days each: every morning sum has one whole answer, and a plan is always possible", bad == 0, f"the tower stayed between {lo:,} and {hi:,}; happy minus unhappy ran from {min(moods)} to {max(moods)}")
print("   NOTE  how those random students left Voltara: " + ", ".join(f"{ENDING[i]} {ends[i]:,}" for i in (3, 2, 1, 0)))
print("RESULT:", "PASS" if ok else "FAIL")
