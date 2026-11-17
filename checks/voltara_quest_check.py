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

print("3. The plan: what people need, and what each need costs")
names = [n for v in CITY.values() for n, _ in v]; cost = dict((n, c) for v in CITY.values() for n, c in v)
FUN = ['Parks', 'Zoo', 'Swimming Pool', 'Sports Arena', 'Arts Theater', 'Amusement Park', 'Shopping Mall', 'Restaurants']
def needs_met(on, kin=False):
    """The nine needs (ten once the Nomads are known). `on` is the set of lit places."""
    m = [{'Neighborhood 1', 'Neighborhood 2'} <= on, 'Hospital' in on, 'Supermarket' in on, 'Schools' in on, bool({'Factory', 'Office Buildings'} & on),
         bool({'Bus Stop', 'Gas Station'} & on), 'Recycling Plant' in on, len(on & set(FUN)) >= 2, 'Solar Power Plant' in on]
    return m + (['Nomad Hollow' in on] if kin else [])
# every one of the 2,097,152 plans, by bit mask
bit = {n: 1 << i for i, n in enumerate(names)}
mask = lambda ns: sum(bit[n] for n in ns)
tests = [lambda m, a=mask(['Neighborhood 1', 'Neighborhood 2']): m & a == a, lambda m, a=bit['Hospital']: m & a, lambda m, a=bit['Supermarket']: m & a, lambda m, a=bit['Schools']: m & a,
         lambda m, a=mask(['Factory', 'Office Buildings']): m & a, lambda m, a=mask(['Bus Stop', 'Gas Station']): m & a, lambda m, a=bit['Recycling Plant']: m & a,
         lambda m, a=mask(FUN): bin(m & a).count('1') >= 2, lambda m, a=bit['Solar Power Plant']: m & a]
total = [0] * (1 << 21)
for m in range(1, 1 << 21):
    low = m & -m; total[m] = total[m ^ low] + cost[names[low.bit_length() - 1]]
fits = [m for m in range(1 << 21) if total[m] <= SUPPLY]
all9 = [m for m in fits if all(t(m) for t in tests)]
cheapest = min(total[m] for m in range(1 << 21) if all(t(m) for t in tests))
check("meeting all nine needs costs at least 1,220", cheapest == 1220, f"cheapest is {cheapest:,}")
check("no plan can light everything on day 1", total[(1 << 21) - 1] == 2220 > SUPPLY)
check("on day 1 many plans meet all nine needs, so students can disagree", len(all9) > 1000, f"{len(all9):,} of {len(fits):,} plans that fit meet all nine")
check("very few plans that fit meet all nine, so tapping at random does not work on day 1", len(all9) * 100 < len(fits), f"about 1 plan in {len(fits) // len(all9)}")
check("the test's mending plan is one of the cheapest", sum(cost[n] for n in ['Neighborhood 1', 'Neighborhood 2', 'Hospital', 'Supermarket', 'Schools', 'Factory', 'Bus Stop', 'Recycling Plant', 'Zoo', 'Swimming Pool', 'Solar Power Plant']) == 1220)

print("4. The days: what the tower holds each morning")
BASE, SOLAR, MEND, THEFT, NOMAD = 1350, 300, 100, 240, 240
def next_day(supply, on, known):
    """known = the Council has decided about the Nomads. Returns (expected, actual)."""
    used = sum(cost.get(n, NOMAD) for n in on); assert 0 < used <= supply
    expected = BASE + (SOLAR if 'Solar Power Plant' in on else 0) + (MEND if known and 'Nomad Hollow' in on else 0) + (supply - used)
    return expected, expected - (0 if known else THEFT)
check("the solar plant gives more than it costs", SOLAR > cost['Solar Power Plant'], f"costs {cost['Solar Power Plant']}, gives {SOLAR}")
check("with the solar plant lit and nothing saved or taken, the tower is back at 1,650", BASE + SOLAR == SUPPLY)
check("240 a night is 30 an hour for 8 hours, and 30 houses at 1 each", THEFT == 8 * 30 and 5 * 6 == 30)
no_solar_full = [m for m in fits if total[m] == SUPPLY and not m & bit['Solar Power Plant']]
worst = BASE - THEFT
check("the worst morning is 1,110: spend everything, leave the solar plant dark", bool(no_solar_full) and worst == 1110, f"{len(no_solar_full):,} day-1 plans do this")
best_on_worst = max(sum(1 for t in tests if t(m)) for m in range(1 << 21) if total[m] <= worst)
check("on that worst morning all nine needs cannot be met", worst < cheapest, f"at most {best_on_worst} of 9")
check("a careful day 1 (all nine needs, save the rest) gives 1,840 on day 2", next_day(SUPPLY, set(n for n in names if bit[n] & mask(['Neighborhood 1', 'Neighborhood 2', 'Hospital', 'Supermarket', 'Schools', 'Factory', 'Bus Stop', 'Recycling Plant', 'Zoo', 'Swimming Pool', 'Solar Power Plant'])), False) == (2080, 1840))
check("after the choice, all ten needs cost 1,460", cheapest + NOMAD == 1460)
check("with the Nomads lit, the tower makes 1,750 a day, enough for all ten needs", BASE + SOLAR + MEND == 1750 >= 1460)
# the four days the Playwright test plays
nine = {'Neighborhood 1', 'Neighborhood 2', 'Hospital', 'Supermarket', 'Schools', 'Factory', 'Bus Stop', 'Recycling Plant', 'Zoo', 'Swimming Pool', 'Solar Power Plant'}
careless = {'Hospital', 'Shopping Mall', 'Amusement Park', 'Hotels', 'Restaurants', 'Sports Arena', 'Arts Theater', 'Zoo', 'Swimming Pool', 'Parks', 'Office Buildings', 'Neighborhood 1', 'Neighborhood 2', 'Supermarket'}
d2 = next_day(1650, careless, False)[1]; d3 = next_day(d2, nine, False)[1]; d4 = next_day(d3, (nine | {'Nomad Hollow'}) - {'Zoo', 'Swimming Pool'}, True)[1]; d5 = next_day(d4, nine | {'Nomad Hollow'}, True)[1]
check("the played days go 1,650 -> 1,250 -> 1,440 -> 1,780 -> 2,070", (d2, d3, d4, d5) == (1250, 1440, 1780, 2070))
check("the careless plan meets 5 of 9 needs", sum(needs_met(careless)) == 5)
check("on day 3 of that path, all ten needs (1,460) do not fit in 1,440", 1460 > d3)
# thousands of random students: random plans for 8 days, the Nomads decided on a random day
bad, lo, hi, never9 = 0, 10 ** 9, 0, 0
for seed in range(5000):
    rnd = random.Random(seed); supply, decided = SUPPLY, rnd.randint(2, 9); got9 = False
    for day in range(1, 9):
        known = day >= decided; pool = names + (['Nomad Hollow'] if known else []); rnd.shuffle(pool); on, used = set(), 0
        for n in pool[:rnd.randint(1, len(pool))]:
            c = cost.get(n, NOMAD)
            if used + c <= supply: on.add(n); used += c
        if not on: bad += 1; break
        exp, act = next_day(supply, on, known); parts = [BASE] + ([SOLAR] if 'Solar Power Plant' in on else []) + ([MEND] if known and 'Nomad Hollow' in on else []) + ([supply - used] if supply - used else [])
        bad += not (sum(parts) == exp and exp - act in (0, THEFT) and (exp - act == 0) == known and act >= worst and act >= 20 and exp < 10 ** 6)
        got9 = got9 or all(needs_met(on, known)); supply = act; lo, hi = min(lo, act), max(hi, act)
    never9 += not got9
check("5,000 random students, 8 days each: every morning sum has one whole answer, and a plan is always possible", bad == 0, f"the tower stayed between {lo:,} and {hi:,}")
print(f"   NOTE  [found by this check] over 8 days, {5000 - never9:,} of 5,000 random students still had a day with every need met. They got there by saving: the tower grew as high as {hi:,}. Saving has no limit yet, so the shortage fades after a few days.")
# for Marc's decision about a limit on saving
s_, days = SUPPLY, 1
while s_ < 2220: s_ = next_day(s_, nine, False)[1]; days += 1
print(f"   NOTE  a student who meets the nine needs and saves the rest can light all 21 places on day {days} (tower {s_:,}). There is no limit on saving yet.")
print("RESULT:", "PASS" if ok else "FAIL")
