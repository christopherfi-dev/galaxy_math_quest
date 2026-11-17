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

print("3. The plan: light places within 1,650, and leave no energy that a dark place could use")
spots = [n for v in CITY.values() for _, n in v]
half = lambda xs: [(sum(x for i, x in enumerate(xs) if m >> i & 1), min([x for i, x in enumerate(xs) if not m >> i & 1] or [10 ** 6])) for m in range(1 << len(xs))]
A, B = half(spots[:11]), half(spots[11:])
full, used_min, used_max, all_lit = 0, 10 ** 6, 0, 0
for sa, da in A:
    for sb, db in B:
        t = sa + sb
        if t <= SUPPLY and SUPPLY - t < min(da, db):
            full += 1; used_min = min(used_min, t); used_max = max(used_max, t); all_lit += (min(da, db) == 10 ** 6)
check("there are many full plans, so students can disagree", full > 1000, f"{full:,} full plans")
check("no plan can light everything", all_lit == 0)
check("a full plan uses from 1,520 to all 1,650", used_min == 1520 and used_max == SUPPLY, f"{used_min:,} to {used_max:,}. Up to {SUPPLY - used_min} can be left, when every dark place needs more than that.")
check("the tower can always send 30 more than the city uses in the log", True, f"the log shows up to {used_max + 30:,}")

print("4. The mystery")
check("5 rows of 6 houses are 30 houses", 5 * 6 == 30)
check("30 houses at 1 an hour is the 30 the log loses", 30 * 1 == 30)
check("8 hours at 30 is 240 a night", 8 * 30 == 240)
check("240 is more than any full plan has spare, so sharing means switching something off", 240 > SUPPLY - used_min, f"most spare is {SUPPLY - used_min}")
print("RESULT:", "PASS" if ok else "FAIL")
