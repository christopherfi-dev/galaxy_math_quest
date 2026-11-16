#!/usr/bin/env python3
"""
Voltara Final Boss - recomputation of every version found, and a seed test.
Standard library only.   Run:  python3 -I checks/voltara_boss_check.py

Versions
  A  "The Ultimate Colony Commander" (student site; printed Distance Data Sheet,
     Colony Needs Sheet, Profit/Loss Sheet, final-boss Scenario Cards)
  A0 its planning draft "Galactic Expansion" (Drive doc "Final Boss Quest 1 Numbers")
  B  "Building a Galactic Fair", 1,000 Galactic Credits (Drive doc "New numbers Quest 1")
  C  "Decision Matrix" (Drive: Data Handling Universe / Quest 1 / Final Boss)
  D  "Confronting the Number Overlord" (Drive doc "Numbers Universe - Quest 1", an earlier plan)
Rounding: "5 rounds up". Python's round() is not used.
"""
import itertools
import random

SEEDS = 10000


def head(t):
    print()
    print("=" * 78)
    print(t)
    print("=" * 78)


def rnd(n, m):
    return ((n + m // 2) // m) * m


def is_tie(n, m):
    return n % m == m // 2


# ---------------------------------------------------------------- Version A
START = 1600
COLONIES = [("Alpha", 630, 943), ("Beta", 833, 1340), ("Gamma", 955, 1950), ("Delta", 1042, 2025),
            ("Epsilon", 1186, 2155), ("Zeta", 609, 1123), ("Theta", 754, 960), ("Iota", 846, 1350),
            ("Kappa", 975, 2343), ("Pi", 1059, 2211)]
SHEET_EXAMPLES = {"Alpha": (600, 900), "Beta": (800, 1300), "Gamma": (1000, 2000)}
STARTERS = ("Alpha", "Beta", "Gamma")
BUILDINGS = [("Housing", 325), ("Spaceport", 476), ("Research Facility", 248), ("Farming Domes", 365),
             ("Solar Farms", 631), ("Water Purification", 288), ("Commercial Centers", 550),
             ("Communication Towers", 150), ("Recreation Facilities", 248), ("Defense Systems", 462)]
# final-boss Scenario Cards: name as printed, building it refers to, plus, minus
CARDS = [("Housing", "Housing", 150, -75), ("Farming Drones", "Farming Domes", 240, -120),
         ("Research Facility", "Research Facility", 460, -200), ("Spaceport", "Spaceport", 560, -250),
         ("Solar Farms", "Solar Farms", 470, -240), ("Water Purification", "Water Purification", 320, -150),
         ("Commercial Centers", "Commercial Centers", 250, -120),
         ("Communication Towers", "Communication Towers", 415, -210),
         ("Parks", "Recreation Facilities", 225, -115), ("Defense Systems", "Defense Systems", 330, -125)]


def col_table():
    return [(n, rnd(d, 100), rnd(p, 100)) for n, d, p in COLONIES]


def bld_table():
    return [(n, rnd(c, 10)) for n, c in BUILDINGS]


def part_a():
    head("A. 'THE ULTIMATE COLONY COMMANDER' (site version): SHEETS RECOMPUTED")
    print("Distance Data Sheet: round distance (= cost) and profit to the nearest 100")
    for n, d, p in COLONIES:
        rd, rp = rnd(d, 100), rnd(p, 100)
        notes = []
        if is_tie(d, 100): notes.append("distance exactly halfway")
        if is_tie(p, 100): notes.append("profit exactly halfway")
        if n in SHEET_EXAMPLES:
            notes.append("sheet example %s -> %s" % (SHEET_EXAMPLES[n], "matches" if SHEET_EXAMPLES[n] == (rd, rp) else "DIFFERS"))
        print(f"   {n:8s} distance {d:5d} -> cost {rd:5d}   profit {p:5d} -> {rp:5d}   net {rp - rd:+5d}"
              + ("   [" + "; ".join(notes) + "]" if notes else ""))
    four = sum(1 for _, d, p in COLONIES for x in (d, p) if x >= 1000)
    print(f"   numbers of 1,000 or more on this sheet: {four} of 20")
    print("Colony Needs Sheet: round to the nearest 10")
    total = 0
    for n, c in BUILDINGS:
        rc = rnd(c, 10)
        total += rc
        tag = "  [exactly halfway]" if is_tie(c, 10) else ("  [already a multiple of 10]" if c % 10 == 0 else "")
        print(f"   {n:22s} {c} -> {rc}{tag}")
    print(f"   all ten buildings cost {total}; the student starts with {START}")
    print("   Profit/Loss Sheet example row: Housing ( -320 ). Colony Needs Sheet example: 325 -> (330)."
          f" Recomputed: {rnd(325, 10)}.")
    print("Scenario cards (plus if you own the building, minus if you do not)")
    names = {n for n, _ in BUILDINGS}
    for printed, b, plus, minus in CARDS:
        cost = dict(bld_table())[b]
        mism = "" if printed in names else f"  [card says '{printed}', sheet says '{b}']"
        print(f"   {printed:22s} {plus:+5d} / {minus:+5d}   building costs {cost}; swing {plus - minus}{mism}")
    odd = [x for _, _, plus, minus in CARDS for x in (plus, minus) if x % 10]
    print(f"   card amounts that are not multiples of 10: {odd}")


def subsets(items):
    for r in range(len(items) + 1):
        yield from itertools.combinations(items, r)


def part_b():
    head("B. VERSION A, ROUND 1: EVERY LEGAL OPENING, EVERY 3 CARDS")
    cols = {n: (c, p) for n, c, p in col_table()}
    blds = bld_table()
    lowest = (10 ** 9, None)
    highest = (-10 ** 9, None)
    openings = 0
    cannot_trade_next = 0
    states = 0
    for s in STARTERS:
        cost, profit = cols[s]
        left = START - cost
        for bs in subsets(blds):
            b = sum(c for _, c in bs)
            if b > left:
                continue
            openings += 1
            own = {n for n, _ in bs}
            for cards in itertools.combinations(CARDS, 3):
                states += 1
                eff = sum(plus if bname in own else minus for _, bname, plus, minus in cards)
                cash = START - cost - b + profit + eff
                if cash < lowest[0]:
                    lowest = (cash, (s, sorted(own), [c[0] for c in cards]))
                if cash > highest[0]:
                    highest = (cash, (s, sorted(own), [c[0] for c in cards]))
                if cash < 600:
                    cannot_trade_next += 1
    print(f"legal openings (one of Alpha/Beta/Gamma + buildings that fit): {openings}")
    print(f"opening x 3-card states: {states}")
    print(f"lowest cash after round 1: {lowest[0]}  {lowest[1]}")
    print(f"highest cash after round 1: {highest[0]}  {highest[1]}")
    print(f"states that leave less than 600 (the cheapest trade): {cannot_trade_next}"
          f" ({100 * cannot_trade_next / states:.2f}%)")
    # can the balance go below zero in round 2?
    s, own, cards = lowest[1]
    own = set(own)
    used = set(cards)
    cash = lowest[0]
    rest = [c for c in CARDS if c[0] not in used]
    worst2 = sorted((minus for _, b, plus, minus in rest if b not in own))[:2]
    print(f"Round 2 from that lowest state: cash {cash}, no trade is affordable."
          f" Two worst cards left in a single deck: {worst2} -> balance {cash + sum(worst2)}")
    worst2r = sorted((minus for _, b, plus, minus in CARDS if b not in own))[:2]
    print(f"   if cards go back in the deck: {worst2r} -> balance {cash + sum(worst2r)}")
    print("   A balance below zero needs negative numbers, which are above Grade 3.")


def best_trades(cols, cash, allowed):
    """Best set of trades (each colony once) the cash can pay for."""
    best, pick = 0, ()
    for combo in subsets([c for c in cols if c[0] in allowed]):
        cost = sum(c for _, c, _ in combo)
        if cost <= cash:
            net = sum(p - c for _, c, p in combo)
            if net > best:
                best, pick = net, combo
    return best, pick


def part_c():
    head("C. VERSION A: HOW BIG DO THE NUMBERS GET? (best play, no cards)")
    cols = col_table()
    every = {n for n, _, _ in cols}
    for label, first_buildings in (("no buildings in round 1", 0), ("580 on buildings in round 1 (Housing + Research)", 580)):
        cash = START
        log = []
        # round 1: exactly one trade, and it must be Alpha, Beta or Gamma
        pick = max(([c] for c in cols if c[0] in STARTERS and c[1] <= cash - first_buildings),
                   key=lambda x: x[0][2] - x[0][1])
        net = pick[0][2] - pick[0][1]
        cash = cash - first_buildings + net
        log.append(f"round 1: {pick[0][0]} -> cash {cash}")
        for r in (2, 3):
            net, pick = best_trades(cols, cash, every)
            cash += net
            log.append(f"round {r}: {'+'.join(c[0] for c in pick)} -> cash {cash}")
        print(f"{label}: " + "; ".join(log) + f"; final total with buildings {cash + first_buildings}")
    nets = sorted(((p - c, n) for n, c, p in cols))
    print("every trade earns more than it costs:", nets)
    print("so 'Profit/Loss' never shows a loss from trading; only cards can lose tokens.")
    print("Place value blocks 'totaling 1600' cannot show totals above 1,600.")


def part_d():
    head("D. VERSION A: COUNTING THE WORK")
    r_dist = len(COLONIES) * 2 - 6          # 3 colonies are filled in as examples
    r_need = len(BUILDINGS) - 1             # Housing is filled in
    print(f"rounding answers: {r_dist} on the Distance Data Sheet + {r_need} on the Colony Needs Sheet = {r_dist + r_need}")
    rows = 7 + 5 + 3
    print(f"Profit/Loss Sheet: {rows} rows a round (7 buildings, 5 planets, 3 cards), 3 number boxes each, + start + total")
    print(f"   up to {rows * 3 + 2} numbers a round; the sheet has 4 round tables (the site says 3 rounds)")
    print("   a typical round: 1-3 buildings, 1-3 trades, 2-3 cards = about 6-9 rows = 18-27 numbers and one long sum")
    print("scenario cards drawn: 3 in round 1, 2 in round 2, 2 in round 3 = 7 of a deck of 10")
    print("reflection sheet: 5 written questions")


# ---------------------------------------------------------------- Version A0
def part_e():
    head("E. VERSION A0: PLANNING DRAFT 'Galactic Expansion' (ChatGPT) RECOMPUTED")
    needs = [700, 500, 300, 400, 600, 250, 550, 150, 200, 450]
    profits = [480, 750, 950, 420, 870, 310, 670, 720, 1040, 560]
    dist = [123, 267, 349, 152, 413, 96, 201, 287, 390, 178]
    print(f"sum of the 10 Colony Needs cards: {sum(needs)} (doc says 4,000)")
    print(f"sum of potential profits: {sum(profits)} (doc says 6,050)")
    r100 = [rnd(d, 100) for d in dist]
    print(f"distances rounded to the nearest 100: {r100} (doc says 100, 300, 300, 200, 400, 100, 200, 300, 400, 200)")
    print(f"   total {sum(r100)} (doc says 2,500); at 10 light-years a token: {sum(r100) // 10} tokens (doc says 250)")
    r10 = [rnd(d, 10) for d in dist]
    print(f"distances rounded to the nearest 10: {r10}; total {sum(r10)}")
    pre = {"Alpha": (123, 12), "Beta": (267, 27), "Gamma": (349, 35)}
    for n, (d, tok) in pre.items():
        print(f"   'pre-calculated fuel cost' {n}: {d} light-years -> doc says {tok} tokens;"
              f" {rnd(d, 10)} / 10 = {rnd(d, 10) // 10}; at 5 light-years a token doc says"
              f" {dict(Alpha=25, Beta=54, Gamma=70)[n]}, {rnd(d, 10)} / 5 = {rnd(d, 10) / 5:g}")
    print("   'start with 1,500 energy units ... so that would be 150 tokens?' ChatGPT answers"
          " 'Correct ... 1,500 Fuel Tokens'. 150 and 1,500 cannot both be right.")
    rows = [(1, 200, 2020, 650, 920, 450), (2, -100, 1920, 600, 920, 400), (3, 300, 2220, 700, 1000, 520)]
    prev = None
    for rnd_no, pl, pool, r, c, i in rows:
        msg = f"   P/L template round {rnd_no}: change {pl:+d}, pool {pool}; sectors {r}+{c}+{i} = {r + c + i}"
        if prev is not None:
            msg += f"; previous pool {prev} {pl:+d} = {prev + pl}" + ("" if prev + pl == pool else "  <-- MISMATCH")
        if r + c + i != pool:
            msg += "  <-- sectors do not add up to the pool"
        print(msg)
        prev = pool
    print("   'Research Facility: future projects cost 10% less energy' uses a percentage.")


# ---------------------------------------------------------------- Version B
def part_f():
    head("F. VERSION B: 'BUILDING A GALACTIC FAIR' (1,000 Galactic Credits)")
    n0 = sum(1 for a in range(0, 1001, 10) for b in range(0, 1001 - a, 10))
    n1 = sum(1 for a in range(10, 1001, 10) for b in range(10, 1001 - a, 10) if 1000 - a - b >= 10)
    print(f"budgets (Rides, Games, Food Stalls) in multiples of 10 that total exactly 1,000: {n0}"
          f" if a category may get 0; {n1} if each gets at least 10")
    print("The Attraction Menu with costs is listed under 'Documents to Create'. No menu was found in Drive,")
    print("so steps 2 and 3 (pick attractions, label rounded costs) have no numbers to recompute.")


# ---------------------------------------------------------------- Version C
def part_g():
    head("G. VERSION C: 'DECISION MATRIX' (weighted percentages)")
    crit = ["Fuel Requirement", "Chance of Collision", "Travel Time", "Fuel Stations",
            "Communication Strength", "Crew Morale", "Risk of Delay"]
    w = [20, 25, 15, 15, 15, 5, 5]
    sc = {"A": [4, 3, 4, 3, 1, 4, 2], "B": [5, 1, 5, 1, 3, 5, 3], "C": [3, 5, 2, 5, 5, 2, 5]}
    stated_w = {"A": [0.8, 0.75, 0.6, 0.45, 0.15, 0.2, 0.1], "B": [1, 0.25, 0.75, 0.15, 0.45, 0.25, 0.15],
                "C": [0.6, 1.25, 0.3, 0.75, 0.75, 0.1, 0.25]}
    stated_t = {"A": 3.05, "B": 3.0, "C": 4.0}
    print(f"weights sum to {sum(w)}%")
    for p in "ABC":
        cells = [wi * si for wi, si in zip(w, sc[p])]            # in hundredths
        bad = [crit[k] for k in range(7) if cells[k] != round(stated_w[p][k] * 100)]
        tot = sum(cells)
        print(f"   Path {p}: weighted cells {[c / 100 for c in cells]} total {tot / 100:.2f}"
              f" (doc says {stated_t[p]}) -> {'matches' if tot == round(stated_t[p] * 100) and not bad else 'DIFFERS ' + str(bad)}")
    fuel = {"A": (300, 1), "B": (250, 0), "C": (350, 2)}
    print("   fuel needed after refuelling at 50 gallons a station:",
          {p: f - 50 * s for p, (f, s) in fuel.items()}, "(the three paths come out equal)")
    time = {"A": (5, "Low"), "B": (4, "Moderate"), "C": (7, "High")}
    print("   travel time with '+1 hour for a moderate or weak signal':",
          {p: t + (1 if sig != "High" else 0) for p, (t, sig) in time.items()})
    print("   companion doc cards: 'Path A is the only one with a fuel station' -> data: stations A 1, B 0, C 2")
    print("   companion doc cards: 'Only Path A has a strong communication signal' -> data: A Low, C High")
    print("   all 9 event cards end 'Mission terminated', whichever path was chosen")
    print("   maths used: percent weights, percent x score giving decimals (0.75, 1.25), chance in percent")
    print("   The doc sits in Data Handling Universe / Quest 1 / Final Boss and is about Planet Zorgon.")


# ---------------------------------------------------------------- Version D
def part_h():
    head("H. VERSION D: 'CONFRONTING THE NUMBER OVERLORD' (earlier plan)")
    print("   step 1: order 531, 315, 153 ->", sorted([531, 315, 153]))
    print("   step 2: round 456 to the nearest hundred ->", rnd(456, 100))
    key = {"@": 100, "#": 10, "$": 1, "(": 500, "&": 50, "*": 5, "%": 1000, "^": 100, "!": 10}
    msg = "@#$ *@# *(&"
    print(f"   step 3: decode '{msg}' ->", [sum(key[ch] for ch in word) for word in msg.split()])
    for label, m in (("Alien Message 1", "@#$ *(& ^^%"), ("Alien Message 2", "!@# %@^ *&$"), ("Alien Message 3", "%$^ *@# &&^")):
        print(f"   {label} '{m}' ->", [sum(key[ch] for ch in word) for word in m.split()])
    dup = {}
    for k, v in key.items():
        dup.setdefault(v, []).append(k)
    print("   symbols that share a value:", {v: ks for v, ks in dup.items() if len(ks) > 1})
    print("   step 4 ('total value of all star fragments') has no numbers in the doc.")


# ---------------------------------------------------------------- seed test
def near(rng, centre, step):
    half = step // 2
    return centre + rng.choice([x for x in range(-half + 1, half) if x != 0])


def boss_gen(rng):
    """[Proposal] number rule for version A, kept as close to Marc's sheets as possible.
    colonies : 10. Three starters cost 600, 800 and 1,000 (rounded) and each returns at least 900 (rounded).
               The other seven cost 600..1,200. Every trade earns 200..1,300 more than it costs.
               Sheet numbers = rounded number + (-49..+49, never 0): no halfway numbers.
    buildings: 10. Rounded costs 150..630 in tens, total at least 3,000 (more than the 1,600 start).
               Sheet numbers = rounded cost + (-4..+4, never 0).
    cards    : Marc's ten cards, unchanged.
    """
    cols = []
    for cost in (600, 800, 1000):
        profit = max(900, cost + rng.choice(range(200, 1100, 100)))
        cols.append((near(rng, cost, 100), near(rng, profit, 100)))
    for _ in range(7):
        cost = rng.choice(range(600, 1300, 100))
        profit = cost + rng.choice(range(200, 1400, 100))
        cols.append((near(rng, cost, 100), near(rng, profit, 100)))
    while True:
        costs = [rng.choice(range(150, 640, 10)) for _ in range(10)]
        if sum(costs) >= 3000:
            break
    blds = [near(rng, c, 10) for c in costs]
    return cols, blds


def part_i():
    head("I. PROPOSED RULE [Proposal] FOR VERSION A, 10,000 SEEDS")
    print(boss_gen.__doc__)
    worst3 = sum(sorted(c[3] for c in CARDS)[:3])
    print(f"three worst cards together: {worst3}")
    fails = {}
    stat = dict(low=[10 ** 9, -10 ** 9], openings=[10 ** 9, 0])

    def fail(k):
        fails[k] = fails.get(k, 0) + 1

    for s in range(SEEDS):
        rng = random.Random(s)
        cols, blds = boss_gen(rng)
        for d, p in cols:
            if is_tie(d, 100) or is_tie(p, 100): fail("halfway number on the distance sheet")
            if d % 100 == 0 or p % 100 == 0: fail("number needs no rounding")
            if rnd(p, 100) - rnd(d, 100) < 200: fail("a trade earns less than 200")
        for c in blds:
            if is_tie(c, 10) or c % 10 == 0: fail("halfway or round building cost")
        rb = [rnd(c, 10) for c in blds]
        if sum(rb) <= START: fail("all buildings affordable at the start")
        if [rnd(d, 100) for d, _ in cols[:3]] != [600, 800, 1000]: fail("starter costs off")
        # round 1: every legal opening stays at 0 or above after the three worst cards
        opens = 0
        low = 10 ** 9
        for d, p in cols[:3]:
            cost, profit = rnd(d, 100), rnd(p, 100)
            left = START - cost
            if min(rb) > left: fail("no building affordable beside a starter trade")
            # the most a student can spend on buildings is 'left'; cash after trade is then at least 'profit'
            low = min(low, profit + worst3)
            opens += 1
        stat["low"][0] = min(stat["low"][0], low); stat["low"][1] = max(stat["low"][1], low)
        if low < 0: fail("round 1 can end below zero")
    print(f"seeds {SEEDS}: " + ("PASS" if not fails else "FAIL " + str(fails)))
    print(f"   lowest possible cash after round 1 (all cash spent, three worst cards): {stat['low'][0]}..{stat['low'][1]}")
    print("   Not covered by any number rule: rounds 2 and 3 can still go below zero when the student")
    print("   cannot afford a trade (shown for Marc's own numbers in part B). That is a rule gap, not a number gap.")


if __name__ == "__main__":
    part_a()
    part_b()
    part_c()
    part_d()
    part_e()
    part_f()
    part_g()
    part_h()
    part_i()
