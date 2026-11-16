#!/usr/bin/env python3
"""
Voltara Task 1 (Energy Council / Power-Up Challenge) - recomputation and seed tests.
Standard library only.   Run:  python3 -I checks/voltara_t1_check.py

Parts
  A  every needs list and every supply found in the sources, summed
  B  needs x supply: how short (or spare) each pairing is
  C  the three scenario decks, card by card
  D  every Round 3 draw (1 card, then 2 cards pick 1, then 1 card) on every version
  E  the class decks move blocks between sectors: when is a move impossible?
  F  the place-template draft rule (reference/voltara_number_rule_check.py)
     re-run per seed and EXTENDED with the scenario cards
  G  a proposed number rule, tested on 10,000 seeds with every card state
  H  counts of typed numbers and answers
All source numbers are copied from Marc's Drive docs and the student site (2026-11-16).
Takes about two minutes (part G checks 20 million card states).
"""
import itertools
import random

SEEDS = 10000


def line(t=""):
    print(t)


def head(t):
    print()
    print("=" * 78)
    print(t)
    print("=" * 78)


# --------------------------------------------------------------------------
# A. Needs lists and supplies, as written in the sources
# --------------------------------------------------------------------------
# N_A: Drive doc "City List" (1eP5F...), the doc the site's Task 1 page links to.
N_A = {
    "R": [("Neighborhood 1", 200), ("Neighborhood 2", 200), ("Schools", 100), ("Hospital", 50),
          ("Parks", 50), ("Zoo", 30), ("Swimming Pool", 20), ("Supermarket", 100)],
    "C": [("Shopping Mall", 250), ("Office Buildings", 200), ("Hotels", 150), ("Restaurants", 100),
          ("Sports Arena", 50), ("Arts Theater", 30), ("Bus Stop", 20), ("Amusement Park", 80)],
    "I": [("Factory", 200), ("Solar Power Plant", 250), ("Warehouse", 50),
          ("Recycling Plant", 50), ("Gas Station", 40)],
}
# N_B: top of Drive doc "Level 1" (1MAKN...). This is the list the world map and the template use.
N_B = {
    "R": [("Neighborhood 1", 200), ("Neighborhood 2", 150), ("Schools", 100), ("Hospital", 50),
          ("Parks & Recreational Areas", 50), ("Public Swimming Pool", 20)],
    "C": [("Shopping Mall", 250), ("Office Complex", 200), ("Hotels", 150), ("Restaurants", 100),
          ("Entertainment Zone", 120), ("Sports Arena", 50), ("Arts Theatre", 30), ("Train", 20)],
    "I": [("Manufacturing Plant", 200), ("Power Plant", 100), ("Warehousing", 50),
          ("Research & Development", 50), ("Chemical Lab", 30), ("Recycling Plant", 20)],
}
# N_C: ChatGPT breakdown at the end of "Level 1" and in "City Sector Map" (1TOfm...):
# core items, extra items, and the totals the doc STATES.
N_C_core = {
    "R": [200, 150, 100, 50, 50],
    "C": [250, 200, 150, 100, 120],
    "I": [200, 100, 50, 50],
}
N_C_extra = {
    "R": [30, 40, 30, 20],
    "C": [80, 50, 30, 20],
    "I": [40, 30, 20],
}
N_C_stated_core = {"R": 650, "C": 920, "I": 450}
N_C_stated_all = {"R": 820, "C": 1150, "I": 540}
N_C_stated_excess = {"R": 170, "C": 230, "I": 90}

SUPPLIES = [
    # label, ones, tens, hundreds, thousands, total the source states
    ("S1 site Task 1 page (\"8 of '100s' = 300\")", 150, 70, 8, 0, 1650),
    ("S2 'City List' doc and 'Energy Count Sheet'", 150, 70, 8, 0, 1650),
    ("S3 'Level 1' doc, Available Blocks", 200, 80, 10, 0, 2000),
    ("S4 'Level 1' doc, module text (Task 2)", 200, 60, 10, 3, None),
    ("S5 'Level 1' doc, \"exactly 2020 blocks\"", None, None, None, None, 2020),
]


def sector_totals(n):
    return {k: sum(v for _, v in items) for k, items in n.items()}


def part_a():
    head("A. NEEDS LISTS AND SUPPLIES, SUMMED")
    for name, n in (("N_A 'City List' doc (linked from the site)", N_A),
                    ("N_B top of 'Level 1' doc", N_B)):
        t = sector_totals(n)
        line(f"{name}")
        for k in "RCI":
            line(f"   {k}: {len(n[k]):2d} places, " + " + ".join(str(v) for _, v in n[k]) + f" = {t[k]}")
        line(f"   total = {sum(t.values())}   places = {sum(len(v) for v in n.values())}")
    line("N_C ChatGPT breakdown ('Level 1' end, 'City Sector Map'): stated vs summed")
    for k in "RCI":
        core, extra = sum(N_C_core[k]), sum(N_C_extra[k])
        line(f"   {k}: core items sum {core} (doc states {N_C_stated_core[k]})"
             f"{'  <-- MISMATCH' if core != N_C_stated_core[k] else ''};"
             f" extras sum {extra} (doc states {N_C_stated_excess[k]} 'excess')"
             f"{'  <-- MISMATCH' if extra != N_C_stated_excess[k] else ''};"
             f" stated core + extras = {N_C_stated_core[k] + extra} (doc states {N_C_stated_all[k]})"
             f"{'  <-- MISMATCH' if N_C_stated_core[k] + extra != N_C_stated_all[k] else ''}")
    line(f"   stated core total = {sum(N_C_stated_core.values())}; "
         f"summed core items = {sum(sum(v) for v in N_C_core.values())}")
    line()
    line("Supplies")
    for label, o, t, h, th, stated in SUPPLIES:
        if o is None:
            line(f"   {label}: stated {stated} (no block breakdown)")
            continue
        total = o + 10 * t + 100 * h + 1000 * th
        note = "" if stated in (None, total) else "  <-- MISMATCH"
        line(f"   {label}: {o} ones + {t} tens + {h} hundreds + {th} thousands = {total}"
             f" (source states {stated}){note}")
    line("   Site typo check: 150 + 700 + 300 = %d; 150 + 700 + 800 = %d" % (150 + 700 + 300, 150 + 700 + 800))
    line("   Blocks a child handles in S2: %d pieces" % (150 + 70 + 8))
    line("   Quiz Q7 ('Place Value and Resource Allocation Quiz'): 3000 - (1200+800+500) = %d left"
         % (3000 - (1200 + 800 + 500)))


# --------------------------------------------------------------------------
# B. needs x supply
# --------------------------------------------------------------------------
NEEDS_VERSIONS = [
    ("N_A City List (site-linked)", sector_totals(N_A)),
    ("N_B 'Level 1' top list", sector_totals(N_B)),
    ("N_C stated 650/920/450", dict(N_C_stated_core)),
]
SUPPLY_VERSIONS = [("1650", 1650), ("1150 (site typo read literally)", 1150),
                   ("2000", 2000), ("2020", 2020), ("4800", 4800)]


def part_b():
    head("B. HOW SHORT IS EACH PAIRING?  gap = total needs - supply  (gap <= 0: nothing to choose)")
    for nname, n in NEEDS_VERSIONS:
        tot = sum(n.values())
        for sname, s in SUPPLY_VERSIONS:
            gap = tot - s
            tag = "short by %d (%.0f%% of needs unmet)" % (gap, 100 * gap / tot) if gap > 0 \
                else "SPARE %d: everything can be powered" % (-gap)
            line(f"   {nname:30s} needs {tot}  supply {sname:32s} -> {tag}")
    line("   The site links N_A and states 1650, so the class pairing is 2220 vs 1650.")
    line("   The world map's 'needs 1,940, 290 short' pairs the site supply with the N_B list instead.")


# --------------------------------------------------------------------------
# C. Decks.  A card = (name, dR, dC, dI, dSupply)  at sector level.
#    In deck D1 the d's change NEEDS.  In D2/D3 the card moves blocks between
#    sectors, so the same d's are applied to needs AND are a forced move.
# --------------------------------------------------------------------------
D1 = [  # 'Level 1' doc, ChatGPT list of 10. Used by the place-template draft.
    ("Solar Flare Impact", 0, 0, 0, -300),
    ("Innovation in Energy Efficiency", -50, -50, -50, 0),
    ("Natural Disaster - Earthquake", 100, 0, 0, 0),
    ("Commercial Boom", 0, 150, 0, 0),
    ("Industrial Strike", 0, 0, -100, 0),
    ("Festival Time", 50, 50, 0, 0),
    ("New Factory Built", 0, 0, 200, 0),
    ("Implementation of Public Transport", 0, -30, 0, 0),
    ("Heatwave", 70, 0, 0, 0),
    ("Tourist Season", 20, 50, 0, 0),
]
D2 = [  # Drive doc 'energy scenario cards' (10 cards with instructions)
    ("Solar Flare Impact", 0, 0, 0, -300),
    ("Innovation in Energy Efficiency", -50, -50, -50, 0),
    ("Natural Disaster - Earthquake", 100, -100, 0, 0),
    ("Commercial Boom", -75, 150, -75, 0),
    ("Industrial Strike", 50, 50, -100, 0),
    ("Festival Time", 50, 50, -100, 0),
    ("New Factory Built", -100, -100, 200, 0),
    ("Implementation of Public Transport", 0, -30, 30, 0),
    ("Heatwave", 70, 0, -70, 0),          # its instruction line says 'add them to the Commercial sector'
    ("Tourist Season", 30, 40, -70, 0),
]
D3 = [  # Drive doc 'City Power - Scenario Cards:' (15 cards in a print table)
    ("Innovation in Energy Efficiency", -50, -50, -50, 0),
    ("Solar Flare Impact", 0, 0, 0, -300),
    ("Natural Disaster - Earthquake", 100, -100, 0, 0),
    ("Commercial Boom", -75, 150, -75, 0),
    ("Industrial Strike", 50, 50, -100, 0),
    ("Festival Time", 50, 50, -100, 0),
    ("New Factory Built", -100, -100, 200, 0),
    ("Implementation of Public Transport", 0, -30, 30, 0),
    ("Heatwave", 70, 0, -70, 0),
    ("Tourist Season", 20, 50, -70, 0),
    ("Cybersecurity Breach", 0, -50, 50, 0),
    ("School Science Fair", 0, 0, 0, 0),        # +30 Schools, -30 Parks: both Residential
    ("Green Energy Investment", 0, 0, 0, 300),
    ("Hospital Emergency", 25, -25, 0, 0),      # +50 Hospital, -25 Schools, -25 Office Complex
    ("Park Renovation", 0, 0, 0, 0),            # -10 Parks, +5 Neighborhood 1, +5 Neighborhood 2
]
DECKS = [("D1 'Level 1' ChatGPT list (template draft)", D1),
         ("D2 'energy scenario cards'", D2),
         ("D3 'City Power - Scenario Cards:'", D3)]


def gap_change(card):
    _, r, c, i, s = card
    return (r + c + i) - s   # how much the shortage grows


def part_c():
    head("C. THE THREE DECKS, CARD BY CARD   (change to needs R/C/I, to supply, to the shortage)")
    for dname, deck in DECKS:
        line(dname)
        zero = 0
        for card in deck:
            name, r, c, i, s = card
            g = gap_change(card)
            zero += (g == 0)
            odd = "  [not a multiple of 10]" if any(x % 10 for x in (r, c, i)) else ""
            line(f"   {name:36s} R{r:+5d} C{c:+5d} I{i:+5d} supply{s:+5d} -> shortage {g:+5d}{odd}")
        best = sorted(gap_change(c) for c in deck)[:3]
        worst = sorted((gap_change(c) for c in deck), reverse=True)[:3]
        line(f"   cards that leave the shortage unchanged: {zero} of {len(deck)}")
        line(f"   best 3 cards together: shortage {sum(best):+d};  worst 3 together: shortage {sum(worst):+d}")
    line("Differences between decks for the same card name:")
    by = {}
    for dname, deck in DECKS:
        for card in deck:
            by.setdefault(card[0], {})[dname[:2]] = card[1:]
    for name, v in by.items():
        if len(set(v.values())) > 1:
            line(f"   {name}: " + "; ".join(f"{k} {val}" for k, val in v.items()))


# --------------------------------------------------------------------------
# D. Every Round 3 draw on every version
#    Site: "Pick a Scenario card ... Pick two more ... Decide which change is
#    more important ... Pick a final Scenario card".  So 4 cards are drawn and
#    3 are applied; the student chooses 1 of the middle 2.
# --------------------------------------------------------------------------
def draws(deck):
    idx = range(len(deck))
    for a in idx:
        rest = [x for x in idx if x != a]
        for b, c in itertools.combinations(rest, 2):
            for d in rest:
                if d not in (b, c):
                    yield a, (b, c), d


def part_d():
    head("D. EVERY ROUND 3 DRAW ON EVERY VERSION")
    line("A draw = first card, a pair (student keeps one), last card.")
    line("'forced easy' = the shortage is gone whichever card the student keeps.")
    line("'can be easy' = the shortage is gone for at least one choice.")
    pairings = [
        ("N_A 2220 vs 1650 (class pairing)", 2220, 1650),
        ("N_A 2220 vs 1150 (site typo read literally)", 2220, 1150),
        ("N_B 1940 vs 1650 (world map pairing)", 1940, 1650),
        ("N_B 1940 vs 2000 ('Level 1' doc pairing)", 1940, 2000),
        ("N_C 2020 vs 2020 ('exactly 2020 blocks')", 2020, 2020),
        ("N_C 2020 vs 2000", 2020, 2000),
        ("N_B 1940 vs 4800 (module text)", 1940, 4800),
    ]
    for dname, deck in DECKS:
        g = [gap_change(c) for c in deck]
        n_draws = sum(1 for _ in draws(deck))
        line(f"{dname}: {n_draws} draws")
        for pname, need, sup in pairings:
            base = need - sup
            forced = can = 0
            lo, hi = 10 ** 9, -10 ** 9
            worst_supply = 10 ** 9
            for a, (b, c), d in draws(deck):
                e1 = base + g[a] + g[b] + g[d]
                e2 = base + g[a] + g[c] + g[d]
                lo, hi = min(lo, e1, e2), max(hi, e1, e2)
                forced += (e1 <= 0 and e2 <= 0)
                can += (e1 <= 0 or e2 <= 0)
            for combo in itertools.combinations(deck, 3):
                worst_supply = min(worst_supply, sup + sum(c[4] for c in combo))
            start = "starts with nothing to choose" if base <= 0 else f"starts {base} short"
            line(f"   {pname:44s} {start:30s} after cards: shortage {lo:+5d}..{hi:+5d}; "
                 f"forced easy {forced:5d} ({100 * forced / n_draws:4.1f}%), "
                 f"can be easy {can:5d} ({100 * can / n_draws:4.1f}%); lowest supply {worst_supply}")
    line("No draw makes any sector's need or the supply negative in these fixed versions"
         " (checked below).")
    for dname, deck in DECKS:
        for pname, needs in (("N_A", sector_totals(N_A)), ("N_B", sector_totals(N_B))):
            lowest = {k: needs[k] + sum(sorted(c[j + 1] for c in deck)[:3]) for j, k in enumerate("RCI")}
            assert min(lowest.values()) > 0, (dname, pname, lowest)
            line(f"   {dname[:2]} on {pname}: lowest possible needs after 3 cards {lowest}")


# --------------------------------------------------------------------------
# E. Class decks (D2, D3) move blocks.  A move is impossible if the sector
#    does not hold that many blocks in the student's plan.
# --------------------------------------------------------------------------
def simulate_moves(deck, plan, order):
    """Apply cards in order to an allocation (R,C,I). Return False if a card
    asks to remove more than a sector holds."""
    r, c, i = plan
    for k in order:
        _, dr, dc, di, ds = deck[k]
        r, c, i = r + dr, c + dc, i + di
        if min(r, c, i) < 0:
            return False
        if ds < 0 and r + c + i < -ds:
            return False
    return True


def part_e():
    head("E. CLASS DECKS MOVE BLOCKS BETWEEN SECTORS: WHEN IS A MOVE IMPOSSIBLE?")
    needs = sector_totals(N_A)
    plans = [
        ("share by need (R 560, C 650, I 440)", (560, 650, 440)),
        ("homes and shops first (R 750, C 880, I 20)", (750, 880, 20)),
        ("homes first, then split (R 750, C 500, I 400)", (750, 500, 400)),
        ("homes and factories first (R 750, C 310, I 590)", (750, 310, 590)),
        ("shops last (R 750, C 150, I 590 + 160 unused)", (750, 150, 590)),
    ]
    for label, p in plans:
        assert sum(p) <= 1650 and all(p[j] <= needs[k] for j, k in enumerate("RCI")), label
    for dname, deck in DECKS[1:]:
        line(dname)
        for j, k in enumerate("RCI"):
            rem = sorted((-c[j + 1] for c in deck if c[j + 1] < 0), reverse=True)
            forced = (rem[0] if rem else 0) + (rem[1] if len(rem) > 1 else 0) + (rem[3] if len(rem) > 3 else 0)
            line(f"   cards that take from {k}: {rem}; worst three together {sum(rem[:3])};"
                 f" worst that cannot be dodged with the one choice: {forced}")
        n_draws = sum(1 for _ in draws(deck))
        for label, p in plans:
            stuck_forced = stuck_any = 0
            for a, (b, c), d in draws(deck):
                ok1 = simulate_moves(deck, p, (a, b, d))
                ok2 = simulate_moves(deck, p, (a, c, d))
                stuck_forced += (not ok1 and not ok2)
                stuck_any += (not ok1 or not ok2)
            line(f"   plan {label:48s}: draws where a card cannot be carried out whichever is kept"
                 f" {stuck_forced:5d} ({100 * stuck_forced / n_draws:4.1f}%),"
                 f" for at least one choice {stuck_any:5d} ({100 * stuck_any / n_draws:4.1f}%)")
    line("Place-level cards in D3 name places that are not on the site-linked City List:")
    names_a = {n for items in N_A.values() for n, _ in items}
    for card, places in (("School Science Fair", ["Schools", "Parks & Recreational Areas"]),
                         ("Hospital Emergency", ["Hospital", "Schools", "Office Complex"]),
                         ("Park Renovation", ["Parks & Recreational Areas", "Neighborhood 1", "Neighborhood 2"])):
        missing = [p for p in places if p not in names_a]
        line(f"   {card}: names {places}; not on City List: {missing}")
    sheet_rows = ["Neighborhood 1", "Neighborhood 2", "Schools", "Hospital", "Parks & Recreational Areas",
                  "Public Swimming Pool", "Shopping Mall", "Office Complex", "Hotels", "Restaurants",
                  "Entertainment Zone", "Sports Arena", "Arts Theatre", "Taxi & Bus Stand",
                  "Manufacturing Plant", "Power Plant", "Warehousing", "Research & Development",
                  "Chemical Lab", "Recycling Plant"]
    line(f"Energy Count Sheet has {len(sheet_rows)} rows; City List has {len(names_a)} places.")
    line("   sheet rows not on the City List: " + ", ".join(r for r in sheet_rows if r not in names_a))
    line("   City List places with no sheet row: " + ", ".join(sorted(n for n in names_a if n not in sheet_rows)))


# --------------------------------------------------------------------------
# Exact buildability of a plan from a stock of blocks
# --------------------------------------------------------------------------
def buildable_exact(plan, h, t, o):
    """Can every amount in plan be made from h hundreds, t tens, o ones?
    Greedy is exact: use as many hundreds as fit, then as many tens as fit."""
    if min(plan) < 0 or h < 0 or t < 0 or o < 0:
        return False
    hu = min(h, sum(a // 100 for a in plan))
    rem_tens_slots = sum(a // 10 for a in plan) - 10 * hu
    tu = min(t, rem_tens_slots)
    ones_needed = sum(plan) - 100 * hu - 10 * tu
    return ones_needed <= o


def brute_buildable(plan, h, t, o):
    """Slow exact check, used only to validate buildable_exact on small cases."""
    def rec(k, h, t, o):
        if k == len(plan):
            return True
        a = plan[k]
        for hh in range(min(h, a // 100) + 1):
            r = a - 100 * hh
            for tt in range(min(t, r // 10) + 1):
                if r - 10 * tt <= o and rec(k + 1, h - hh, t - tt, o - (r - 10 * tt)):
                    return True
        return False
    return rec(0, h, t, o)


def validate_buildable():
    rng = random.Random(7)
    for _ in range(4000):
        plan = [rng.randint(0, 330) for _ in range(3)]
        h, t, o = rng.randint(0, 4), rng.randint(0, 12), rng.randint(0, 40)
        assert buildable_exact(plan, h, t, o) == brute_buildable(plan, h, t, o), (plan, h, t, o)


# --------------------------------------------------------------------------
# F. The template draft rule, per seed, extended with the cards
# --------------------------------------------------------------------------
REF_BASE = {'R': [200, 150, 100, 50, 50, 20], 'C': [250, 200, 150, 100, 120, 50, 30, 20],
            'I': [200, 100, 50, 50, 30, 20]}


def ref_gen(rng):
    """Same steps, in the same order, as reference/voltara_number_rule_check.py gen()."""
    needs = {k: [max(10, v + rng.choice([-30, -20, -10, 0, 10, 20, 30])) for v in vs]
             for k, vs in REF_BASE.items()}
    tot = {k: sum(v) for k, v in needs.items()}
    short = rng.choice(range(200, 310, 10))
    supply = sum(tot.values()) - short
    h = rng.randint(6, 9)
    rest = supply - 100 * h
    ones = rng.choice(range(100, min(rest, 300) + 1, 10))
    tens = (rest - ones) // 10
    assert 100 * h + 10 * tens + ones == supply
    return tot, supply, h, tens, ones, short


def random_plan(rng, needs, supply, step):
    plan = [rng.randrange(0, needs[k] + 1, step) for k in "RCI"]
    while sum(plan) > supply:
        i = rng.randrange(3)
        plan[i] = max(0, plan[i] - step)
    return plan


def nasty_plan(needs, supply):
    """Amounts ending in 99 (or 90): the hardest to build without hundreds."""
    plan = []
    left = supply
    for k in "RCI":
        a = min(needs[k], left)
        a = a - ((a + 1) % 100) if a >= 99 else a
        plan.append(max(0, a))
        left -= plan[-1]
    return plan


def card_states(deck):
    """Every set of 1, 2 or 3 different cards."""
    for n in (1, 2, 3):
        yield from itertools.combinations(range(len(deck)), n)


def part_f():
    head("F. TEMPLATE DRAFT RULE, PER SEED, EXTENDED WITH THE SCENARIO CARDS (deck D1)")
    validate_buildable()
    line("exact block check validated against brute force on 4,000 small cases")
    deck = D1
    states = list(card_states(deck))
    g = [gap_change(c) for c in deck]
    stats = dict(tens_min=10 ** 9, tens_max=0, ones_min=10 ** 9, ones_max=0, sup_min=10 ** 9, sup_max=0)
    bad_plain = bad_plain_ones = 0
    seeds_easy = states_easy = 0
    states_total = 0
    easy_by_set = {}
    bad_after_cards = 0
    neg_need = neg_supply = 0
    tens_over_99 = tens_under_10 = 0
    draws_forced = draws_can = draws_total = 0
    all_draws = list(draws(deck))
    draw_cache = {}
    for s in range(SEEDS):
        rng = random.Random(s)
        tot, supply, h, t, o, short = ref_gen(rng)
        stats["tens_min"] = min(stats["tens_min"], t); stats["tens_max"] = max(stats["tens_max"], t)
        stats["ones_min"] = min(stats["ones_min"], o); stats["ones_max"] = max(stats["ones_max"], o)
        stats["sup_min"] = min(stats["sup_min"], supply); stats["sup_max"] = max(stats["sup_max"], supply)
        tens_over_99 += t > 99
        tens_under_10 += t < 10
        # F1: what the reference tests (multiples of 10), plus plans typed in ones
        for _ in range(10):
            if not buildable_exact(random_plan(rng, tot, supply, 10), h, t, o):
                bad_plain += 1
            if not buildable_exact(random_plan(rng, tot, supply, 1), h, t, o):
                bad_plain_ones += 1
        if not buildable_exact(nasty_plan(tot, supply), h, t, o):
            bad_plain_ones += 1
        # F2: every card state
        seed_easy = False
        for st in states:
            states_total += 1
            n = dict(tot)
            sup, hh = supply, h
            for k in st:
                _, dr, dc, di, ds = deck[k]
                n["R"] += dr; n["C"] += dc; n["I"] += di
                sup += ds
                if ds == -300:
                    hh -= 3          # template: "Solar Flare takes away 3 hundred-blocks"
            if min(n.values()) <= 0:
                neg_need += 1
            if sup <= 0 or hh < 0:
                neg_supply += 1
                continue
            assert 100 * hh + 10 * t + o == sup
            if sup >= sum(n.values()):
                states_easy += 1
                seed_easy = True
                easy_by_set[st] = easy_by_set.get(st, 0) + 1
            if not buildable_exact(nasty_plan(n, sup), hh, t, o):
                bad_after_cards += 1
        seeds_easy += seed_easy
        if short not in draw_cache:          # the draw result depends only on the shortfall
            f = c_ = 0
            for a, (b, c), d in all_draws:
                e1 = short + g[a] + g[b] + g[d]
                e2 = short + g[a] + g[c] + g[d]
                f += (e1 <= 0 and e2 <= 0)
                c_ += (e1 <= 0 or e2 <= 0)
            draw_cache[short] = (f, c_)
        draws_total += len(all_draws)
        draws_forced += draw_cache[short][0]
        draws_can += draw_cache[short][1]
    line(f"seeds: {SEEDS} (one random.Random(seed) per student)")
    line(f"supply range {stats['sup_min']}..{stats['sup_max']}; tens rods {stats['tens_min']}..{stats['tens_max']};"
         f" ones {stats['ones_min']}..{stats['ones_max']}")
    line(f"students given more than 99 tens rods: {tens_over_99} ({100 * tens_over_99 / SEEDS:.1f}%);"
         f" fewer than 10 tens rods: {tens_under_10}")
    line(f"no cards: unbuildable multiples-of-10 plans {bad_plain}; unbuildable whole-number plans {bad_plain_ones}")
    line(f"with cards: card states checked {states_total}")
    line(f"   states where a sector's need is 0 or less: {neg_need}; where supply or hundreds run out: {neg_supply}")
    line(f"   states where the hardest plan cannot be built from the blocks: {bad_after_cards}")
    line(f"   states where supply >= total needs (the draft's SOLVABLE line says this never happens): "
         f"{states_easy} ({100 * states_easy / states_total:.2f}%)")
    line(f"   students who have at least one such state: {seeds_easy} ({100 * seeds_easy / SEEDS:.1f}%)")
    for st, n in sorted(easy_by_set.items(), key=lambda x: -x[1]):
        line(f"      {' + '.join(deck[k][0] for k in st)}: {n} students ({100 * n / SEEDS:.1f}%)")
    line(f"   Round 3 draws (seed x draw): {draws_total}; shortage gone whichever card is kept: {draws_forced}"
         f" ({100 * draws_forced / draws_total:.2f}%); gone for at least one choice: {draws_can}"
         f" ({100 * draws_can / draws_total:.2f}%)")
    # A hand-built counterexample to "any plan within the supply can be built"
    tot = {k: sum(max(10, v - 30) for v in vs) for k, vs in REF_BASE.items()}
    supply = sum(tot.values()) - 300
    h, o = 9, 100
    t = (supply - 100 * h - o) // 10
    plan = [90, 90, 90]
    line("Hand-built case inside the draft rule's ranges (every need at its lowest, shortfall 300, 9 hundreds):")
    line(f"   needs {tot}, supply {supply}, blocks {h} hundreds {t} tens {o} ones; plan {plan} (total {sum(plan)})"
         f" buildable? {buildable_exact(plan, h, t, o)}")
    line("   The reference script never meets this case: its chance is about 1 in 7^20 per student.")


# --------------------------------------------------------------------------
# G. Proposed rule, tested on 10,000 seeds with every card state
# --------------------------------------------------------------------------
def relief(deck):
    """Largest drop in the shortage that 3 different cards can cause."""
    return -sum(sorted(gap_change(c) for c in deck)[:3])


def prop_gen(rng, base, deck):
    """[Proposal] number rule for Task 1.
    needs   : each place = its source value + one of -30..+30 (step 10), never below 10
    shortfall: (largest relief 3 cards can give) + 50..200 (step 10)  -> always short, even after cards
    supply  : total needs - shortfall
    blocks  : ones 100..150 (step 10); tens 40..89; hundreds = what is left, at least 4
              tens + ones are worth at least 500, so any plan can be built
    """
    needs = {k: sum(max(10, v + rng.choice([-30, -20, -10, 0, 10, 20, 30])) for _, v in items)
             for k, items in base.items()}
    short = relief(deck) + rng.choice(range(50, 210, 10))
    supply = sum(needs.values()) - short
    ones = rng.choice(range(100, 160, 10))
    rest = supply - ones                      # a multiple of 10
    t0 = 40 + ((rest // 10 - 40) % 10)        # 40..49, makes the hundreds whole
    options = [t0 + 10 * j for j in range(5) if (rest - 10 * (t0 + 10 * j)) // 100 >= 4]
    tens = rng.choice(options)
    hundreds = (rest - 10 * tens) // 100
    return needs, supply, hundreds, tens, ones, short


def part_g():
    head("G. PROPOSED RULE [Proposal], 10,000 SEEDS, EVERY SET OF 1-3 CARDS")
    line(prop_gen.__doc__)
    for bname, base in (("N_A City List", N_A), ("N_B 'Level 1' list", N_B)):
        for dname, deck in DECKS:
            states = list(card_states(deck))
            fails = {}
            rng_stats = dict(sup=[10 ** 9, 0], h=[10 ** 9, 0], t=[10 ** 9, 0], o=[10 ** 9, 0],
                             gap=[10 ** 9, 0], gap_after=[10 ** 9, -10 ** 9])
            checked_states = plans = 0

            def fail(key):
                fails[key] = fails.get(key, 0) + 1

            for s in range(SEEDS):
                rng = random.Random(s)
                needs, supply, h, t, o, short = prop_gen(rng, base, deck)
                for key, v in (("sup", supply), ("h", h), ("t", t), ("o", o), ("gap", short)):
                    rng_stats[key][0] = min(rng_stats[key][0], v)
                    rng_stats[key][1] = max(rng_stats[key][1], v)
                if 100 * h + 10 * t + o != supply: fail("blocks do not add up to the supply")
                if not (4 <= h and 40 <= t <= 89 and 100 <= o <= 150): fail("block count out of range")
                if 10 * t + o < 300: fail("tens+ones worth less than 300")
                if supply >= sum(needs.values()): fail("not short before cards")
                if any(v % 10 for v in needs.values()) or supply % 10: fail("not a multiple of 10")
                for step in (10, 1):
                    for _ in range(5):
                        plans += 1
                        if not buildable_exact(random_plan(rng, needs, supply, step), h, t, o):
                            fail("random plan cannot be built")
                plans += 1
                if not buildable_exact(nasty_plan(needs, supply), h, t, o): fail("hardest plan cannot be built")
                for st in states:
                    checked_states += 1
                    n = dict(needs); sup, hh = supply, h
                    for k in st:
                        _, dr, dc, di, ds = deck[k]
                        n["R"] += dr; n["C"] += dc; n["I"] += di
                        sup += ds; hh += ds // 100      # supply cards add or remove hundreds
                    gap = sum(n.values()) - sup
                    rng_stats["gap_after"][0] = min(rng_stats["gap_after"][0], gap)
                    rng_stats["gap_after"][1] = max(rng_stats["gap_after"][1], gap)
                    if min(n.values()) <= 0: fail("a need is 0 or less after cards")
                    if sup <= 0 or hh < 0: fail("supply or hundreds run out after cards")
                    if 100 * hh + 10 * t + o != sup: fail("blocks do not match supply after cards")
                    if gap <= 0: fail("no shortage after cards (nothing to choose)")
                    plans += 2
                    if not buildable_exact(nasty_plan(n, sup), hh, t, o): fail("hardest plan fails after cards")
                    if not buildable_exact(random_plan(rng, n, sup, 5), hh, t, o): fail("random plan fails after cards")
            verdict = "PASS" if not fails else "FAIL " + str(fails)
            line(f"{bname:20s} {dname[:2]}: {SEEDS} seeds, {checked_states} card states, {plans} plans -> {verdict}")
            line(f"      relief allowed for {relief(deck)}; shortfall {rng_stats['gap'][0]}..{rng_stats['gap'][1]};"
                 f" shortage after cards {rng_stats['gap_after'][0]}..{rng_stats['gap_after'][1]};"
                 f" supply {rng_stats['sup'][0]}..{rng_stats['sup'][1]}; hundreds {rng_stats['h'][0]}..{rng_stats['h'][1]},"
                 f" tens {rng_stats['t'][0]}..{rng_stats['t'][1]}, ones {rng_stats['o'][0]}..{rng_stats['o'][1]}")


# --------------------------------------------------------------------------
# H. Counting the work
# --------------------------------------------------------------------------
def part_h():
    head("H. HOW MUCH WRITING AND TYPING?")
    places = sum(len(v) for v in N_A.values())
    line("Class version (site + printed sheets):")
    line(f"   places to decide on: {places} (City List); rows on the Energy Count Sheet: 20, plus 2 totals")
    line(f"   numbers written if every row is filled (blocks as up to 3 counts + units): up to {20 * 4 + 2}")
    line(f"   blocks to put on the map if all energy is used: {150 + 70 + 8}")
    line("   scenario cards drawn 4, applied 3; each one changes 2 or 3 sectors and the totals")
    line("Place-template draft (design/GMQ_Place_Template_v1 section 4.3):")
    c1, c2 = 3, 9
    c3 = 3 * (c1 + c2)
    line(f"   c1 {c1} numbers; c2 {c2} numbers; c3 three rounds of ({c1} + {c2}) = {c3} numbers,"
         f" plus 1 card choice and 1 'why' sentence; c4 1 sentence")
    line(f"   total typed numbers with no mistakes: {c1 + c2 + c3};"
         f" answers sent: {2 + 3 * 2 + 1 + 1} (2 + 6 + choice/why + reflection)")
    line(f"   largest single answer: {c2} numbers; assumed limit: 3")


if __name__ == "__main__":
    part_a()
    part_b()
    part_c()
    part_d()
    part_e()
    part_f()
    part_g()
    part_h()
