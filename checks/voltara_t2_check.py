#!/usr/bin/env python3
"""
Voltara Task 2 (Galactic Trade) - recomputation and seed test.
Standard library only.   Run:  python3 -I checks/voltara_t2_check.py

Parts
  A  the three versions of the planet data, rounded
  B  the best first trip with 50 fuel tokens, by brute force
  C  buying fuel: which planets earn more gems than the fuel costs
  D  best totals over 3 and 4 trips (no cards)
  E  the 15 scenario cards: effect, and which ones cannot be carried out
  F  the older barter version ("New numbers Quest 1", Level 3): its goal key
  G  a proposed per-student number rule, tested on 10,000 seeds
  H  counts of written and typed answers
Rounding: "5 rounds up" (school rule). Python's round() is NOT used: round(25, -1) gives 20.
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
    """Round n to the nearest m, halves go up."""
    return ((n + m // 2) // m) * m


def is_tie(n, m):
    return n % m == m // 2


# Final sheet: Drive doc "Distance Data Sheet with Potential Profits" (1trtB...), linked from the site.
FINAL_1 = [("A", 12, 507), ("B", 26, 812), ("C", 33, 1209), ("D", 18, 459), ("E", 44, 1004),
           ("F", 5, 307), ("G", 22, 709), ("H", 25, 756), ("I", 45, 1408), ("J", 17, 608)]
FINAL_2 = [("K", 37, 1337), ("L", 53, 889), ("M", 28, 467), ("N", 66, 3129), ("O", 52, 2764),
           ("P", 71, 1583), ("Q", 48, 945), ("R", 59, 2221), ("S", 41, 1896), ("T", 64, 1007)]
# Draft in "Galaxy Numerix - Quest 1 - Task 2" (planning part): C and I differ.
DRAFT_2DIGIT = [("A", 12, 507), ("B", 26, 812), ("C", 27, 1209), ("D", 18, 459), ("E", 44, 1004),
                ("F", 5, 307), ("G", 22, 709), ("H", 25, 756), ("I", 42, 1108), ("J", 17, 608)]
# First draft: 3-digit distances, 1 token = 10 light-years, 50 tokens.
DRAFT_3DIGIT = [("A", 123, 507), ("B", 267, 812), ("C", 349, 1209), ("D", 152, 459), ("E", 413, 1004),
                ("F", 96, 307), ("G", 201, 709), ("H", 287, 756), ("I", 390, 1108), ("J", 178, 608)]

GEMS_PER_TOKEN = 20
START_TOKENS = 50


def rounded(data, dist_to=10):
    return [(n, rnd(d, dist_to), rnd(p, 100)) for n, d, p in data]


def show_table(title, data, dist_to=10):
    print(title)
    for n, d, p in data:
        rd, rp = rnd(d, dist_to), rnd(p, 100)
        notes = []
        if is_tie(d, dist_to): notes.append("distance is exactly halfway")
        if is_tie(p, 100): notes.append("profit is exactly halfway")
        print(f"   Planet {n}: distance {d:4d} -> {rd:4d}   profit {p:5d} -> {rp:5d}"
              f"   gems per token {rp / rd:5.1f}" + ("   [" + "; ".join(notes) + "]" if notes else ""))


def best_plans(items, budget):
    """items: (name, cost, profit). Every subset, each planet at most once."""
    best, best_sets, exact, feasible = -1, [], [], 0
    for r in range(1, len(items) + 1):
        for combo in itertools.combinations(items, r):
            cost = sum(c for _, c, _ in combo)
            if cost > budget:
                continue
            feasible += 1
            profit = sum(p for _, _, p in combo)
            if cost == budget:
                exact.append(("".join(n for n, _, _ in combo), profit))
            if profit > best:
                best, best_sets = profit, [("".join(n for n, _, _ in combo), cost)]
            elif profit == best:
                best_sets.append(("".join(n for n, _, _ in combo), cost))
    return best, best_sets, exact, feasible


def part_a():
    head("A. PLANET DATA, ROUNDED (distance to nearest 10, profit to nearest 100)")
    show_table("Final sheet, round 1 (A-J):", FINAL_1)
    show_table("Final sheet, 'Challenge Round' (K-T):", FINAL_2)
    show_table("Draft with 2-digit distances (planning doc):", DRAFT_2DIGIT)
    show_table("First draft, 3-digit distances (1 token = 10 light-years):", DRAFT_3DIGIT)
    ties = [n for n, d, p in FINAL_1 + FINAL_2 if is_tie(d, 10) or is_tie(p, 100)]
    print("Final sheet numbers that sit exactly halfway:", ties, "(distances 5, 25, 45)")
    print("Python round() on the halfway distances:", [round(x, -1) for x in (5, 25, 45)],
          "; school rule:", [rnd(x, 10) for x in (5, 25, 45)])


def part_b():
    head("B. BEST FIRST TRIP WITH 50 TOKENS (each planet at most once)")
    for title, data in (("Final sheet", FINAL_1), ("2-digit draft", DRAFT_2DIGIT)):
        items = rounded(data)
        best, sets, exact, feas = best_plans(items, START_TOKENS)
        print(f"{title}: {feas} plans fit in 50 tokens; best profit {best} with {sets}")
        print(f"   plans that use exactly 50 tokens: {len(exact)}: "
              + ", ".join(f"{n}={p}" for n, p in sorted(exact, key=lambda x: -x[1])))
        raw_best, raw_sets, _, _ = best_plans([(n, d, p) for n, d, p in data], START_TOKENS)
        print(f"   if a child does NOT round: best {raw_best} with {raw_sets}")
        worst_single = min(items, key=lambda x: x[2])
        print(f"   weakest single-planet trip: {worst_single[0]} earns {worst_single[2]} gems"
              f" -> buys {worst_single[2] // GEMS_PER_TOKEN} tokens")
    items = rounded(DRAFT_3DIGIT, 10)
    tok = [(n, d // 10, p) for n, d, p in items]       # 1 token = 10 light-years
    best, sets, exact, feas = best_plans(tok, START_TOKENS)
    print(f"First draft (3-digit, 50 tokens = 500 light-years): best profit {best} with {sets}")
    # repeats allowed?
    a = rounded(FINAL_1)[0]
    print(f"If one planet may be visited again and again: {START_TOKENS // a[1]} trips to Planet A"
          f" = {START_TOKENS // a[1] * a[2]} gems (the sheets do not say this is forbidden)")


def part_c():
    head("C. BUYING FUEL AT 20 GEMS A TOKEN")
    print("Site example: 800 gems buy", 800 // GEMS_PER_TOKEN, "tokens (site says 40)")
    for title, data in (("Round 1", FINAL_1), ("Challenge Round", FINAL_2)):
        lose = []
        for n, d, p in rounded(data):
            net = p - GEMS_PER_TOKEN * d
            if net <= 0:
                lose.append((n, net))
            print(f"   {title} Planet {n}: fuel {d} tokens = {GEMS_PER_TOKEN * d} gems; profit {p}; net {net:+d}")
        print(f"   {title}: planets that lose gems when the fuel is bought: {lose}")


def best_trip(items, gems, free_tokens=0):
    """Maximise gems at the end of one trip. Unused bought tokens are not bought."""
    best, plan = gems, ("stay home", 0)
    for r in range(1, len(items) + 1):
        for combo in itertools.combinations(items, r):
            cost = sum(c for _, c, _ in combo)
            pay = max(0, cost - free_tokens) * GEMS_PER_TOKEN
            if pay > gems:
                continue
            end = gems - pay + sum(p for _, _, p in combo)
            if end > best:
                best, plan = end, ("".join(n for n, _, _ in combo), cost)
    return best, plan


def part_d():
    head("D. BEST TOTALS OVER SEVERAL TRIPS, NO CARDS (each planet at most once per trip)")
    r1, r2 = rounded(FINAL_1), rounded(FINAL_2)
    for trips in (3, 4):
        for label, pool in (("later trips use K-T only", r2), ("later trips use A-T", r1 + r2)):
            gems, log = 0, []
            for t in range(trips):
                if t == 0:
                    gems, plan = best_trip(r1, 0, START_TOKENS)
                else:
                    gems, plan = best_trip(pool, gems)
                log.append(f"trip {t + 1}: {plan[0]} ({plan[1]} tokens) -> {gems} gems")
            print(f"{trips} trips, {label}: " + "; ".join(log))
    print("Note: the site says 'a total of 3 trips' and 'rounds 2-4'; the Profit Chart has 4 tables.")


CARDS = [
    "Galactic Festival: Double your profits from one planet.",
    "Space Pirates!: Lose all profits from one planet.",
    "Wormhole Discovery: Cut the distance to a planet in half.",
    "Fuel Price Surge: Lose 100 fuel tokens.",
    "Solar Flare: Lose half of your fuel tokens from one planet.",
    "Meteor Shower: Add 20 light-years to one planet you'll visit.",
    "Trade Embargo: Lose profits from the farthest planet you picked.",
    "New Engine Tech: Gain 50 extra fuel tokens.",
    "Alien Investors: Double the profits from your lowest-earning planet.",
    "Black Market Boom: Add 200 tokens to your profits from one planet.",
    "Cosmic Taxes: Lose 10% of your total profits so far.",
    "Resource Scarcity: One planet you picked offers no profits this round.",
    "Galactic Holiday: Gain 100 extra fuel tokens for not trading this round.",
    "Cosmic Windfall: Find 200 extra tokens in your ship.",
    "Quantum Glitch: Lose all your tokens, but gain 300 new ones.",
]


def part_e():
    head("E. THE 15 TRADING SCENARIO CARDS")
    r1, r2 = rounded(FINAL_1), rounded(FINAL_2)
    g1, p1 = best_trip(r1, 0, START_TOKENS)
    print(f"Best trip 1: {p1[0]} -> {g1} gems -> at most {g1 // GEMS_PER_TOKEN} tokens for trip 2.")
    all_first = []
    for r in range(1, 11):
        for combo in itertools.combinations(r1, r):
            if sum(c for _, c, _ in combo) <= START_TOKENS:
                all_first.append(sum(p for _, _, p in combo))
    under100 = sum(1 for g in all_first if g // GEMS_PER_TOKEN < 100)
    exactly100 = sum(1 for g in all_first if g // GEMS_PER_TOKEN == 100)
    print(f"Trip-1 plans: {len(all_first)}. Plans that leave FEWER than 100 tokens for trip 2: {under100};"
          f" exactly 100: {exactly100}; more than 100: {len(all_first) - under100 - exactly100}")
    print("   -> 'Fuel Price Surge: Lose 100 fuel tokens' on trip 2 leaves every student with 0 tokens or fewer.")
    g2, p2 = best_trip(r2, g1)
    print(f"Best trip 2 (K-T): {p2[0]} using {p2[1]} tokens -> {g2} gems.")
    plan2 = [x for x in r2 if x[0] in p2[0]]
    profit2 = sum(p for _, _, p in plan2)
    hi = max(plan2, key=lambda x: x[2]); lo = min(plan2, key=lambda x: x[2])
    far = max(plan2, key=lambda x: x[1])
    print("Effect of each card on that trip-2 plan (gems at the end of trip 2):")
    effects = {
        0: g2 + hi[2], 1: g2 - hi[2], 6: g2 - far[2], 8: g2 + lo[2], 9: g2 + 200,
        10: g2 - (g1 + profit2) // 10, 11: g2 - hi[2],
    }
    for k, text in enumerate(CARDS):
        note = ""
        if k in effects:
            note = f"-> {effects[k]} gems ({effects[k] - g2:+d})"
        elif k == 2:
            raw = {n: d for n, d, _ in FINAL_1 + FINAL_2}
            odd_raw = [n for n, d in raw.items() if d % 2]
            odd_rounded = [n for n, d, _ in r1 + r2 if (d // 10) % 2]
            note = (f"-> half of the sheet distance is not a whole number for {len(odd_raw)} of 20 planets {odd_raw};"
                    f" half of the rounded distance ends in 5 for {len(odd_rounded)} of 20")
        elif k == 3:
            note = "-> cannot be carried out on trip 2 (see above); 100 tokens = 2,000 gems of fuel"
        elif k == 4:
            note = "-> wording unclear: fuel tokens do not come 'from a planet'"
        elif k == 5:
            note = f"-> plan needs {p2[1] + 20} tokens; +20 tokens cost {20 * GEMS_PER_TOKEN} gems"
        elif k == 7:
            note = f"-> worth {50 * GEMS_PER_TOKEN} gems of fuel"
        elif k == 12:
            note = f"-> worth {100 * GEMS_PER_TOKEN} gems of fuel, but the trip's profit ({profit2}) is given up"
        elif k == 13:
            note = f"-> if 'tokens' means fuel: worth {200 * GEMS_PER_TOKEN} gems; if gems: +200"
        elif k == 14:
            note = (f"-> a student holding {g1 // GEMS_PER_TOKEN} tokens now holds 300"
                    f" (+{(300 - g1 // GEMS_PER_TOKEN) * GEMS_PER_TOKEN} gems of fuel)")
        print(f"   {k + 1:2d}. {text}\n         {note}")
    print("10% of the running total is a whole number here because totals are multiples of 100:",
          (g1 + profit2), "->", (g1 + profit2) // 10)
    print("Cards that use maths above Grade 3: 11 (percent); 3 (halving odd numbers gives .5)")
    print("Cards that say 'tokens' where gems may be meant: 10, 13 (list copy), 14, 15")
    # luck against skill
    weak = 1000                                   # a weak but legal first trip (for example planet E alone)
    g_glitch, plan_g = best_trip(r2, weak, free_tokens=300)
    print(f"Luck against skill on trip 2: best planner, no card: {g2} gems."
          f" Best planner who draws Fuel Price Surge: {g1} gems (no trip)."
          f" A student with {weak} gems who draws Quantum Glitch (300 tokens): {plan_g[0]} -> {g_glitch} gems.")


def part_f():
    head("F. OLDER BARTER VERSION ('New numbers Quest 1', Level 3): GOAL KEY RECOMPUTED")
    cards = {  # number: (give_qty, give_item, get_qty, get_item)
        1: (25, "dollars", 6, "strawberries"),
        2: (6, "strawberries", 12, "kiloliters of fuel"),
        3: (6, "strawberries", 18, "gold coins"),
        4: (10, "kiloliters of fuel", 27, "bananas"),
        5: (20, "gold coins", 5, "space tools"),
        6: (30, "bananas", 58, "meteorite fragments"),
        7: (10, "space tools", 6, "alien pets"),
        8: (60, "meteorite fragments", 9, "space crystals"),
        9: (10, "space crystals", 1, "spaceship"),
    }
    no_round = {1, 9}   # card 1 gives 6 strawberries; card 9 has no rounding rule
    goals = [
        ("Obtain a Spaceship", [1, 2, 4, 8, 9], "spaceship", 1),
        ("Build a Meteorite Collection", [1, 2, 4, 6], "meteorite fragments", 60),
        ("Set Up a Space Tool Workshop", [1, 3, 5], "space tools", 10),
        ("Fuel Your Rocket", [1, 2], "kiloliters of fuel", 10),
        ("Collect Alien Pets (doc says: not achievable)", [1, 3, 5, 7], "alien pets", 10),
    ]
    for k, (gq, gi, tq, ti) in cards.items():
        got = tq if k in no_round else rnd(tq, 10)
        print(f"   card {k}: give {gq} {gi}, get {tq} {ti} -> after rounding {got}")

    def run(chain):
        have = {"dollars": 25}
        for k in chain:
            gq, gi, tq, ti = cards[k]
            if have.get(gi, 0) < gq:
                return have, f"stuck at card {k}: needs {gq} {gi}, has {have.get(gi, 0)}"
            have[gi] -= gq
            have[ti] = have.get(ti, 0) + (tq if k in no_round else rnd(tq, 10))
        return have, "ok"

    for name, chain, item, want in goals:
        have, status = run(chain)
        ok = status == "ok" and have.get(item, 0) >= want
        print(f"   {name}: cards {chain} -> {status}; {item}: {have.get(item, 0)} (goal {want})"
              f" -> {'reached' if ok else 'NOT reached'}")
    have, status = run([1, 2, 4, 6, 8, 9])
    print(f"   Spaceship with card 6 added, cards [1, 2, 4, 6, 8, 9]: {status}; spaceship: {have.get('spaceship', 0)}")


# --------------------------------------------------------------------------
# G. Proposed per-student rule
# --------------------------------------------------------------------------
R1_CLASSES = [10, 10, 20, 20, 20, 30, 30, 40, 40, 50]       # Marc's sheet: 10,30,30,20,40,10,20,30,50,20
R2_CLASSES = [30, 40, 40, 50, 50, 50, 60, 60, 70, 70]       # Marc's sheet: 40,50,30,70,50,70,50,60,40,60


def near(rng, centre, step):
    """A number that rounds to centre (nearest step), never exactly halfway, never centre itself."""
    half = step // 2
    off = rng.choice([x for x in range(-half + 1, half) if x != 0])
    return centre + off


def t2_gen(rng):
    """[Proposal] number rule for Task 2.
    round 1 : 10 planets. Rounded distances are a shuffle of 10,10,20,20,20,30,30,40,40,50.
              Sheet distance = rounded distance + (-4..+4, never 0): no halfway numbers.
              Rounded profit = rounded distance x (30, 35, 40, 45 or 50), rounded up to a hundred, at least 300.
              Sheet profit = rounded profit + (-49..+49, never 0).
    round 2 : 10 planets. Rounded distances are a shuffle of 30,40,40,50,50,50,60,60,70,70.
              3 or 4 planets lose 100 or 200 gems when fuel costs 20 (Marc's sheet has 4 such planets);
              the others earn 25..55 gems per token.
    """
    def make(classes, rates, floor, losers=0):
        ds = classes[:]
        rng.shuffle(ds)
        lose = set(rng.sample(range(len(ds)), losers))
        out = []
        for i, rd in enumerate(ds):
            if i in lose:
                rp = GEMS_PER_TOKEN * rd - rng.choice([100, 200])      # loses 100 or 200 gems
            else:
                rp = max(floor, -(-rd * rng.choice(rates) // 100) * 100)
            out.append((near(rng, rd, 10), near(rng, rp, 100)))
        return out
    r1 = make(R1_CLASSES, [30, 35, 40, 45, 50], 300)
    r2 = make(R2_CLASSES, [25, 30, 35, 40, 45, 50, 55], 500, losers=rng.choice([3, 4]))
    return r1, r2


def part_g():
    head("G. PROPOSED RULE [Proposal], 10,000 SEEDS")
    print(t2_gen.__doc__)
    fails = {}
    stat = dict(best=[10 ** 9, 0], exact=[10 ** 9, 0], worst40=[10 ** 9, 0], losers=[10 ** 9, 0], d=[10 ** 9, 0],
                p=[10 ** 9, 0], best2=[10 ** 9, 0])

    def fail(k):
        fails[k] = fails.get(k, 0) + 1

    def track(k, v):
        stat[k][0] = min(stat[k][0], v); stat[k][1] = max(stat[k][1], v)

    for s in range(SEEDS):
        rng = random.Random(s)
        r1, r2 = t2_gen(rng)
        for d, p in r1 + r2:
            track("d", d); track("p", p)
            if is_tie(d, 10) or is_tie(p, 100): fail("a halfway number")
            if d % 10 == 0 or p % 100 == 0: fail("a number that needs no rounding")
            if d < 1 or p < 1: fail("non-positive number")
        items1 = [(chr(65 + i), rnd(d, 10), rnd(p, 100)) for i, (d, p) in enumerate(r1)]
        items2 = [(chr(75 + i), rnd(d, 10), rnd(p, 100)) for i, (d, p) in enumerate(r2)]
        if sorted(c for _, c, _ in items1) != sorted(R1_CLASSES): fail("round 1 distances off")
        if sorted(c for _, c, _ in items2) != sorted(R2_CLASSES): fail("round 2 distances off")
        best, sets, exact, feas = best_plans(items1, START_TOKENS)
        track("best", best); track("exact", len(exact))
        if len(exact) < 3: fail("fewer than 3 plans use exactly 50 tokens")
        if any(p <= GEMS_PER_TOKEN * c for _, c, p in items1): fail("a round-1 planet loses gems")
        if any(p % 100 for _, _, p in items1 + items2): fail("rounded profit not a multiple of 100")
        # any trip that uses at least 40 of the 50 tokens must fund a round-2 trip
        worst40 = 10 ** 9
        for r in range(1, 6):
            for combo in itertools.combinations(items1, r):
                cost = sum(c for _, c, _ in combo)
                if 40 <= cost <= 50:
                    worst40 = min(worst40, sum(p for _, _, p in combo))
        track("worst40", worst40)
        if worst40 // GEMS_PER_TOKEN < min(c for _, c, _ in items2): fail("a 40-token trip cannot fund round 2")
        if best % GEMS_PER_TOKEN: fail("gems do not divide into whole tokens")
        losers = sum(1 for _, c, p in items2 if p <= GEMS_PER_TOKEN * c)
        track("losers", losers)
        if losers not in (3, 4): fail("round 2 does not have 3 or 4 losing planets")
        g2, plan2 = best_trip(items2, best)
        track("best2", g2)
        if g2 <= best: fail("no profitable round-2 trip")
    print(f"seeds {SEEDS}: " + ("PASS" if not fails else "FAIL " + str(fails)))
    print(f"   sheet distances {stat['d'][0]}..{stat['d'][1]}; sheet profits {stat['p'][0]}..{stat['p'][1]}")
    print(f"   best round-1 profit {stat['best'][0]}..{stat['best'][1]};"
          f" plans using exactly 50 tokens {stat['exact'][0]}..{stat['exact'][1]}")
    print(f"   weakest trip that uses 40-50 tokens earns {stat['worst40'][0]}..{stat['worst40'][1]} gems")
    print(f"   round-2 planets that lose gems {stat['losers'][0]}..{stat['losers'][1]};"
          f" best gems after round 2: {stat['best2'][0]}..{stat['best2'][1]}")
    # the same checks on Marc's own sheet
    items1, items2 = rounded(FINAL_1), rounded(FINAL_2)
    worst40 = min(sum(p for _, _, p in combo) for r in range(1, 6)
                  for combo in itertools.combinations(items1, r) if 40 <= sum(c for _, c, _ in combo) <= 50)
    print("Marc's sheet against the same checks: halfway numbers",
          [n for n, d, p in FINAL_1 + FINAL_2 if is_tie(d, 10) or is_tie(p, 100)],
          f"; weakest 40-50 token trip earns {worst40} -> {worst40 // GEMS_PER_TOKEN} tokens"
          f" (nearest challenge planet needs {min(c for _, c, _ in items2)})")


def part_h():
    head("H. HOW MUCH WRITING AND TYPING?")
    print("Class version:")
    print("   rounding answers: round 1 sheet 20 boxes (1 filled in as an example) = 19;"
          " challenge sheet 20; total", 19 + 20)
    print("   Profit Chart: 4 tables x (8 planet rows x 3 boxes + 2 totals) = up to", 4 * (8 * 3 + 2), "boxes")
    print("   a likely trip fills 3 rows x 3 + 2 totals = 11 boxes; 4 trips = 44; plus buying fuel 3 times")
    print("   written numbers in a typical run: about", 39 + 44 + 3)
    print("Typed world, same task: every rounding answer is 1 number (39 answers), or 2 numbers per planet (20 answers);")
    print("   a trip plan is a list of 1-5 planet letters plus 2 totals.")


if __name__ == "__main__":
    part_a()
    part_b()
    part_c()
    part_d()
    part_e()
    part_f()
    part_g()
    part_h()
