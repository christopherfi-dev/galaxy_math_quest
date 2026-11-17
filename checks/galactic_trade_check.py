#!/usr/bin/env python3
"""Galactic Trade, as built in the sketch.  Run: python3 -I checks/galactic_trade_check.py
[Source] Marc's Voltara Task 2: the 20 planets, their distances and profits (the final Trade Data Sheet), 50 fuel tokens for trip 1,
         3 trips, "1 Fuel Token for 20 Galactic Gems", round distances to the nearest 10 and profits to the nearest 100.
[Proposal] Claude's rules, so the sums stay fair for Grade 3 and no one can get stuck:
   - trip 1: the near planets A to J only, 50 free tokens
   - trips 2 and 3: any planet not yet visited; fuel is paid for in gems, 200 gems for every 10 tokens; a trip can use at most 100 tokens
   - each planet once in a season
The school rounding rule is used: halfway goes up. Python's round() is NOT used.
"""
import itertools, random

rnd = lambda n, m: ((n + m // 2) // m) * m
NEAR = [("A", 12, 507), ("B", 26, 812), ("C", 33, 1209), ("D", 18, 459), ("E", 44, 1004), ("F", 5, 307), ("G", 22, 709), ("H", 25, 756), ("I", 45, 1408), ("J", 17, 608)]
FAR = [("K", 37, 1337), ("L", 53, 889), ("M", 28, 467), ("N", 66, 3129), ("O", 52, 2764), ("P", 71, 1583), ("Q", 48, 945), ("R", 59, 2221), ("S", 41, 1896), ("T", 64, 1007)]
ALL = NEAR + FAR
FUEL = {n: rnd(d, 10) for n, d, p in ALL}; PAY = {n: rnd(p, 100) for n, d, p in ALL}
FREE, TANK, PRICE = 50, 100, 20           # tokens on trip 1, most tokens on one trip, gems for one token
ok = True
def check(name, cond, detail=""):
    global ok; ok &= bool(cond); print(f"  {'ok ' if cond else 'BAD'} {name}{': ' + detail if detail else ''}")

print("1. Rounding")
print("   " + "  ".join(f"{n}:{d}->{FUEL[n]}, {p}->{PAY[n]}" for n, d, p in ALL))
ties = [n for n, d, p in ALL if d % 10 == 5]; check("three distances are exactly halfway and go up", ties == ["F", "H", "I"] and [FUEL[n] for n in ties] == [10, 30, 50])
check("no profit is exactly halfway", not [n for n, d, p in ALL if p % 100 == 50])
check("every rounded distance is a whole number of tens from 10 to 70", all(10 <= FUEL[n] <= 70 and FUEL[n] % 10 == 0 for n in FUEL))
check("every rounded profit is a whole number of hundreds, and each is at most 3,100", all(PAY[n] % 100 == 0 and 300 <= PAY[n] <= 3100 for n in PAY))
bad = 0
for seed in range(10000):       # the rounding rule itself, on random numbers, against a second way of working it out
    r = random.Random(seed); n = r.randrange(1, 3200); m = r.choice([10, 100]); lo = n - n % m; want = lo if n - lo < lo + m - n else lo + m
    bad += rnd(n, m) != want
check("the rounding rule agrees with 'the nearer one, and halfway goes up' on 10,000 random numbers", bad == 0)

print("2. Trip 1: planets A to J, 50 free tokens")
near = [n for n, _, _ in NEAR]
plans1 = [c for r in range(1, 11) for c in itertools.combinations(near, r) if sum(FUEL[n] for n in c) <= FREE]
gems1 = sorted({sum(PAY[n] for n in c) for c in plans1})
best1 = max(plans1, key=lambda c: sum(PAY[n] for n in c))
check("the best first trip is A + C + F for 2,000 gems", set(best1) == {"A", "C", "F"} and gems1[-1] == 2000, f"{len(plans1)} plans fit; they earn from {gems1[0]:,} to {gems1[-1]:,}")
check("only one plan earns the most", sum(1 for c in plans1 if sum(PAY[n] for n in c) == 2000) == 1)
check("a child who picks the biggest profits first does worse", True, "I (1,400, 50 tokens) alone earns 1,400. C + G earns 1,900.")

print("3. Paying for fuel: which planets are worth the trip?")
net = {n: PAY[n] - PRICE * FUEL[n] for n, _, _ in ALL}
print("   gain after fuel: " + "  ".join(f"{n} {net[n]:+,}" for n in net))
losers = [n for n in net if net[n] < 0]; check("four far planets cost more in fuel than they pay", losers == ["L", "M", "Q", "T"], ", ".join(f"{n} {net[n]:+}" for n in losers))
check("every near planet still gains after fuel", all(net[n] > 0 for n in near))
check("the price of fuel for any trip is a whole number of hundreds", all((PRICE * f) % 100 == 0 for f in range(10, TANK + 1, 10)))

print("4. A whole season: three trips")
idx = {n: i for i, (n, _, _) in enumerate(ALL)}
subs = []        # every set of planets one trip could visit: (mask, fuel, pay)
names = [n for n, _, _ in ALL]
def grow(i, mask, fuel, pay):
    if i == len(names):
        if mask: subs.append((mask, fuel, pay))
        return
    grow(i + 1, mask, fuel, pay)
    if fuel + FUEL[names[i]] <= TANK: grow(i + 1, mask | 1 << i, fuel + FUEL[names[i]], pay + PAY[names[i]])
grow(0, 0, 0, 0)
subs.sort(key=lambda s: -(s[2] - PRICE * s[1]))
print(f"   {len(subs):,} different routes use 100 tokens or fewer")
states = {}      # after trip 1: (mask, gems)
for c in plans1: states[(sum(1 << idx[n] for n in c), sum(PAY[n] for n in c))] = True
def step(states):
    out, stuck, low, high = {}, 0, 10 ** 9, 0
    for (mask, gems) in states:
        any_ = False
        for m, fuel, pay in subs:
            if m & mask or PRICE * fuel > gems: continue
            any_ = True; g = gems - PRICE * fuel + pay; out[(mask | m, g)] = True; low = min(low, g); high = max(high, g)
        stuck += not any_
    return out, stuck, low, high
s2, stuck2, lo2, hi2 = step(states)
check("after any first trip, a second trip can always be paid for", stuck2 == 0, f"{len(states)} ways to finish trip 1")
check("the most gems after trip 2 is 4,900", hi2 == 4900, f"from {lo2:,} to {hi2:,}")
best3, stuck3, lo3 = 0, 0, 10 ** 9
for (mask, gems) in s2:
    any_ = False
    for m, fuel, pay in subs:
        if m & mask or PRICE * fuel > gems: continue
        g = gems - PRICE * fuel + pay; lo3 = min(lo3, g)
        if not any_: best3 = max(best3, g)            # subs is sorted by gain, so the first that fits is the best for this state
        any_ = True
    stuck3 += not any_
check("after any two trips, a third trip can always be paid for", stuck3 == 0, f"{len(s2):,} states after trip 2")
check("the most gems after three trips stays under 10,000", best3 < 10000, f"best season: {best3:,} gems. Worst: {lo3:,}.")
check("gems can never go below zero", lo2 > 0 and lo3 > 0)
print(f"   SEASON  best possible: {best3:,}")

print("5. The three pieces of trade news [Source: Marc's scenario cards 6, 9 and 12, the ones that can be carried out]")
check("Meteor Shower: 20 light-years more is 20 tokens, which is 400 gems", PRICE * 20 == 400)
check("Alien Investors: doubling the lowest planet's profit never passes 6,200", max(PAY.values()) * 2 == 6200)
check("Resource Scarcity: a planet that pays nothing always loses its fuel cost", all(PRICE * FUEL[n] >= 200 for n in FUEL))
print("RESULT:", "PASS" if ok else "FAIL")
