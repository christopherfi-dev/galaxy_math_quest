"""Marc's idea (2026-11-17): give every place values (energy, happy people, unhappy people) and set a goal: enough energy AND enough happy people.
This file is an EXPERIMENT for a proposal. It is not the built game.
The happy / unhappy numbers below are Claude's DRAFT [Proposal]. The energy numbers are Marc's City List [Source].
The question: what kind of decision does each way of scoring make? Every one of the 2,097,152 plans is tried.
"""
SUPPLY, BASE, SOLAR = 1650, 1350, 300
#        place               energy  happy if lit  unhappy if dark
P = [("Round Houses",       200,    80,           80),
     ("Stilt Houses",       200,    80,           80),
     ("Schools",              100,    60,           40),
     ("Hospital",              50,    40,          100),
     ("Parks",                 50,    30,            0),
     ("Zoo",                   30,    20,            0),
     ("Swimming Pool",         20,    10,            0),
     ("Supermarket",          100,    70,           80),
     ("Shopping Mall",        250,    90,            0),
     ("Office Buildings",     200,    50,           20),
     ("Hotels",               150,    30,            0),
     ("Restaurants",          100,    50,            0),
     ("Sports Arena",          50,    40,            0),
     ("Arts Theater",          30,    20,            0),
     ("Bus Stop",              20,    30,           30),
     ("Amusement Park",        80,    60,            0),
     ("Factory",              200,    50,           20),
     ("Solar Power Plant",    250,     0,            0),     # makes no one happy today. It gives 300 energy tomorrow.
     ("Warehouse",             50,    10,            0),
     ("Recycling Plant",       50,    20,           40),
     ("Gas Station",           40,    20,           10)]
N = len(P); idx = {p[0]: i for i, p in enumerate(P)}
E, H, U = [0] * (1 << N), [0] * (1 << N), [0] * (1 << N)
for m in range(1, 1 << N):
    low = m & -m; i = low.bit_length() - 1; r = m ^ low
    E[m], H[m], U[m] = E[r] + P[i][1], H[r] + P[i][2], U[r] + P[i][3]
ALLU = sum(p[3] for p in P)
fits = [m for m in range(1 << N) if E[m] <= SUPPLY]
names = lambda m: [P[i][0] for i in range(N) if m >> i & 1]
dark = lambda m: [P[i][0] for i in range(N) if not m >> i & 1]
print(f"{len(fits):,} plans fit in 1,650. The city could make {sum(p[2] for p in P)} people happy if everything were lit.\n")

print("A. ONE score: the most happy people. (Unhappy people are not counted.)")
best = max(H[m] for m in fits); top = [m for m in fits if H[m] == best]; near = [m for m in fits if H[m] >= best - 20]
print(f"   best = {best} happy. Plans that reach it: {len(top)}. Plans within 20 of it: {len(near)}.")
print(f"   the best plan leaves dark: {', '.join(dark(top[0]))}")
always = [P[i][0] for i in range(N) if all(m >> i & 1 for m in near)]; never = [P[i][0] for i in range(N) if not any(m >> i & 1 for m in near)]
print(f"   in ALL of the near-best plans, lit: {len(always)} places. Never lit: {', '.join(never)}")
# what a child might do: light the place with the most happy people that still fits
m, e = 0, 0
for i in sorted(range(N), key=lambda i: -P[i][2]):
    if e + P[i][1] <= SUPPLY: m |= 1 << i; e += P[i][1]
print(f"   'biggest happy number first' gets {H[m]} happy ({best - H[m]} short of the best), dark: {', '.join(dark(m))}")
m, e = 0, 0
for i in sorted(range(N), key=lambda i: -P[i][2] / P[i][1]):
    if e + P[i][1] <= SUPPLY: m |= 1 << i; e += P[i][1]
print(f"   'most happy for each energy first' gets {H[m]} happy, dark: {', '.join(dark(m))}")
sp = idx['Solar Power Plant']
print(f"   near-best plans that light the Solar Power Plant: {sum(1 for m in near if m >> sp & 1)} of {len(near)}  <- the plant makes no one happy today\n")

print("B. TWO numbers shown side by side: happy people (lit) and unhappy people (dark essentials). Goal: enough happy AND few unhappy.")
unh = lambda m: ALLU - U[m]
for T, X in [(600, 100), (650, 60), (700, 60), (700, 0), (720, 0)]:
    ok = [m for m in fits if H[m] >= T and unh(m) <= X]
    print(f"   at least {T} happy and at most {X:>3} unhappy: {len(ok):>7,} plans ({100 * len(ok) / len(fits):.2f}% of plans that fit)")
print()

print("C. THREE numbers: happy, unhappy, and ENOUGH ENERGY: the tower must not be weaker tomorrow (1,350 + 300 if solar + saved >= 1,650).")
energy_ok = lambda m: BASE + (SOLAR if m >> sp & 1 else 0) + SUPPLY - E[m] >= SUPPLY
for T, X in [(500, 100), (550, 60), (600, 60), (600, 0), (620, 0), (640, 0)]:
    ok = [m for m in fits if H[m] >= T and unh(m) <= X and energy_ok(m)]
    lit_always = [P[i][0] for i in range(N) if ok and all(m >> i & 1 for m in ok)]
    print(f"   {T} happy, at most {X:>3} unhappy, tower not weaker: {len(ok):>6,} plans. Lit in every one: {len(lit_always)} places")
bestC = max((H[m] for m in fits if unh(m) == 0 and energy_ok(m)), default=0)
print(f"   the most happy people possible with nobody unhappy and the tower not weaker: {bestC}")
noS = max(H[m] for m in fits if unh(m) == 0); print(f"   the same without caring about tomorrow's energy: {noS}  -> the price of thinking ahead is {noS - bestC} happy people today\n")

print("D. Can one place make up for another? (the 'mall beats the hospital' test, using NET = happy - unhappy as ONE number)")
net = lambda m: H[m] - unh(m); bn = max(net(m) for m in fits); nearn = [m for m in fits if net(m) >= bn - 30]
hosp = idx['Hospital']; print(f"   best net = {bn}. Near-best plans: {len(nearn)}. Of those, the Hospital is dark in {sum(1 for m in nearn if not m >> hosp & 1)}.")
mid = [m for m in fits if net(m) >= 450]; print(f"   plans with a 'good' net of 450 or more: {len(mid):,}. Hospital dark in {sum(1 for m in mid if not m >> hosp & 1):,}. A Neighborhood dark in {sum(1 for m in mid if (m & 3) != 3):,}.")

print()
print("E. Marc's correction (2026-11-17): one place can be good for one number and bad for another WHILE IT RUNS.")
print("   'Factory could make more power, but make people unhappy because of pollution. Amusement park makes people happy, but gives no power.'")
print("   DRAFT [Proposal]: the Factory uses 200 today and gives FACT more energy tomorrow. While it runs, SMOKE people are unhappy. It gives 30 people jobs.")
print("   The Solar Power Plant uses 250 today and gives 300 tomorrow. It is clean. Night theft (240) is left out here, to keep the picture clear.")
fa = idx['Factory']
def best(S, solar, fact, cap, smoke):
    """most happy people with energy <= S, the two power places on or off as told, and unhappy people <= cap"""
    b = (-1, 0)
    want = (solar << sp) | (fact << fa); both = (1 << sp) | (1 << fa)
    for m in fits_all:
        if m & both == want and E[m] <= S:
            h = H[m] - (20 if fact else 0)                  # in this model a running Factory makes 30 people happy (jobs), not the 50 of the table above
            unhappy = ALLU - U[m] + (smoke if fact else -20)   # dark essentials, plus smoke if it runs. A dark Factory upsets no one here, so its 20 from the table is taken off.
            if unhappy <= cap and h > b[0]: b = (h, m)
    return b
fits_all = [m for m in range(1 << N) if E[m] <= 2600]
for FACT, SMOKE, CAP in [(400, 60, 60), (400, 100, 60), (400, 100, 100), (600, 100, 100), (300, 60, 60)]:
    print(f"\n   Factory gives {FACT} tomorrow, {SMOKE} unhappy from smoke. Goal: at most {CAP} unhappy.")
    print("     day 1 choice               day 1 happy   day 2 tower   day 2 most happy (clean day)   (factory again)")
    for solar, fact, label in [(0, 0, 'no power places   '), (1, 0, 'solar only        '), (0, 1, 'factory only      '), (1, 1, 'solar and factory ')]:
        h1, m1 = best(SUPPLY, solar, fact, CAP, SMOKE)
        if h1 < 0: print(f"     {label}        cannot keep unhappy people under {CAP}"); continue
        S2 = BASE + (SOLAR if solar else 0) + (FACT if fact else 0) + SUPPLY - E[m1]
        clean = max(best(S2, s, 0, CAP, SMOKE)[0] for s in (0, 1)); dirty = max(best(S2, s, 1, CAP, SMOKE)[0] for s in (0, 1))
        print(f"     {label}        {h1:>5}        {S2:>6,}          {clean:>5}                      {dirty if dirty >= 0 else 'not allowed':>5}")
