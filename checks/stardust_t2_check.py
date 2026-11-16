#!/usr/bin/env python3
"""Operation Stardust Task 2 - Graphing our Data (Levels 1-4). Recomputation and number-rule tests.

Standard library only. Run:  python3 checks/stardust_t2_check.py

PART 1  Level 1 bar-graph data (Voltara Mission Control Data Sheet).
PART 2  Levels 2 and 3 line-graph data: the site's 9 months and Drive's 12 months.
PART 3  Level 4 data: the site's numbers against the Drive sheet the site links to.
PART 4  The draft "Final Boss" found in the same Drive folder (decision matrix sums).
PART 5  Rule BAR [Proposal], 10,000 seeds.
PART 6  Rule LINE [Proposal], 10,000 seeds.

Everything in PARTS 1-4 is [Source]. Values a typed world could check are
marked CHECKABLE. Drawing the graph itself is never checkable by typing.
"""
import math
import random
from functools import reduce

# ---------------------------------------------------------------- Level 1
L1_TEMPERATURE_C = {"Living Quarters": 23, "Engine Room": 30, "Food Storage": 4, "Greenhouse": 26, "Control Room": 22}
L1_FUEL_GALLONS = {"Main Thrusters": 200, "Backup Thrusters": 50, "Emergency Reserve": 20}
L1_FOOD_UNITS = {
    "Fruits": {"Freeze-Dried Apple": 30, "Canned Peaches": 20},
    "Grains": {"Brown Rice": 25, "Oats": 15, "Quinoa": 10},
    "Proteins": {"Canned Tuna": 20, "Chicken Jerky": 25, "Protein Bars": 30},
}

# ---------------------------------------------------------------- Levels 2 and 3
MONTHS9 = ["January", "February", "March", "April", "May", "June", "July", "August", "September"]
MONTHS12 = MONTHS9 + ["October", "November", "December"]
# Site Level 3 page, Drive "Level 2" data sheet and Drive "Level 2 - Line Graphs Overview" all agree:
FUEL_9 = [500, 480, 450, 530, 400, 390, 360, 480, 500]
DIST_9 = [1000, 900, 850, 700, 950, 920, 1100, 900, 1000]
# Drive "Level 3" folder (data sheet and "Level 3 Overview- Interpreting Data") has a different set:
FUEL_12 = [500, 450, 420, 400, 390, 650, 370, 410, 480, 420, 100, 440]
DIST_12 = [1000, 900, 800, 1100, 950, 600, 920, 1000, 980, 1300, 900, 950]
# Drive "Level 2 - Line Graphs Overview" also shows a third, three-month example:
EXAMPLE_FUEL_3 = [500, 450, 420]
EXAMPLE_DIST_3 = [1000, 2000, 3100]

# ---------------------------------------------------------------- Level 4
L4_SITE_FIRST = {"Fruits": 300, "Vegetables": 250, "Protein": 400, "Grains": 350, "Dairy": 400, "Snacks": 150}
L4_SITE_LAST = {"Protein": 100, "Dairy": 120, "Grains": 400, "Canned Goods": 350, "Freeze Dried": 250, "Snacks": 50}
L4_DRIVE_FIRST = {"Vegetables": 250, "Protein": 400, "Grains": 350, "Dairy": 200, "Snacks": 150, "Fruits": 300}
L4_DRIVE_LAST = {"Protein": 100, "Dairy": 320, "Grains": 400, "Canned Goods": 200, "Freeze Dried": 150, "Snacks": 50}

# ---------------------------------------------------------------- Final Boss draft
MATRIX = [  # criterion, weight %, score A, B, C, weighted A, B, C as printed
    ("Fuel Requirement", 20, 4, 5, 3, 0.8, 1, 0.6),
    ("Chance of Collision", 25, 3, 1, 5, 0.75, 0.25, 1.25),
    ("Travel Time", 15, 4, 5, 2, 0.6, 0.75, 0.3),
    ("Fuel Stations", 15, 3, 1, 5, 0.45, 0.15, 0.75),
    ("Communication Strength", 15, 1, 3, 5, 0.15, 0.45, 0.75),
    ("Crew Morale", 5, 4, 5, 2, 0.2, 0.25, 0.1),
    ("Risk of Delay", 5, 2, 3, 5, 0.1, 0.15, 0.25),
]
MATRIX_TOTALS_PRINTED = (3.05, 3.0, 4.0)


def extremes(d):
    hi = max(d.values())
    lo = min(d.values())
    return [k for k, v in d.items() if v == hi], hi, [k for k, v in d.items() if v == lo], lo


def grid_step(values):
    return reduce(math.gcd, values)


def part1():
    print("PART 1  Level 1 (bar graphs). Site and Drive agree on every number.")
    hi_k, hi, lo_k, lo = extremes(L1_TEMPERATURE_C)
    print("  temperature: hottest %s %d, coldest %s %d, difference %d   CHECKABLE" % (hi_k, hi, lo_k, lo, hi - lo))
    hi_k, hi, lo_k, lo = extremes(L1_FUEL_GALLONS)
    print("  fuel: most %s %d, least %s %d, total %d   CHECKABLE" % (hi_k, hi, lo_k, lo, sum(L1_FUEL_GALLONS.values())))
    flat = {}
    for group, items in L1_FOOD_UNITS.items():
        flat.update(items)
        print("  food %-8s: %s total %d" % (group, items, sum(items.values())))
    print("  food total %d; most %s; least %s   CHECKABLE" % (sum(flat.values()), extremes(flat)[0], extremes(flat)[2]))
    print("  values to draw: %d temperature + %d fuel + %d food = %d bars"
          % (len(L1_TEMPERATURE_C), len(L1_FUEL_GALLONS), len(flat), len(L1_TEMPERATURE_C) + len(L1_FUEL_GALLONS) + len(flat)))
    for name, vals in (("temperature", L1_TEMPERATURE_C.values()), ("fuel", L1_FUEL_GALLONS.values()), ("food", flat.values())):
        vals = list(vals)
        step = grid_step(vals)
        print("  %-11s: every bar ends on a line only if the scale counts in %ds (%d lines to reach %d)"
              % (name, step, max(vals) // step, max(vals)))
    print("  one graph for all three mixes degrees, gallons and units on one axis: 4 to 200.")
    assert sum(flat.values()) == 175 and sum(L1_FUEL_GALLONS.values()) == 270


def describe_line(months, fuel, dist, label):
    print("  %s" % label)
    fi, fj = fuel.index(max(fuel)), fuel.index(min(fuel))
    di, dj = dist.index(max(dist)), dist.index(min(dist))
    assert fuel.count(max(fuel)) == fuel.count(min(fuel)) == dist.count(max(dist)) == dist.count(min(dist)) == 1
    print("    most fuel %s %d; least fuel %s %d; difference %d   CHECKABLE"
          % (months[fi], fuel[fi], months[fj], fuel[fj], fuel[fi] - fuel[fj]))
    print("    farthest %s %d; shortest %s %d; difference %d   CHECKABLE"
          % (months[di], dist[di], months[dj], dist[dj], dist[di] - dist[dj]))
    print("    totals: fuel %d gallons, distance %d miles (4-digit sums; the task does not ask for them)" % (sum(fuel), sum(dist)))
    print("    fuel: %d to %d, all multiples of %d; distance: %d to %d, all multiples of %d (not of 50: %s)"
          % (min(fuel), max(fuel), grid_step(fuel), min(dist), max(dist), grid_step(dist), sorted({v for v in dist if v % 50})))
    print("    points to plot: %d per line, %d for both lines" % (len(months), 2 * len(months)))
    return months[fi], months[fj], months[di], months[dj]


def part2():
    print("\nPART 2  Levels 2 and 3 (line graphs)")
    a = describe_line(MONTHS9, FUEL_9, DIST_9, "9-month set (site Level 3; Drive Level 2 sheet and overview)")
    print("    'strange' months: %s = most fuel AND shortest distance; %s = least fuel AND farthest."
          % (a[0], a[1]))
    assert a[0] == a[3] == "April" and a[1] == a[2] == "July"
    print("    Marc's notes agree: April 'Solar Winds', July 'Gravity Assist'. The data tell one clear story.")
    b = describe_line(MONTHS12, FUEL_12, DIST_12, "12-month set (Drive 'Level 3' folder only)")
    print("    notes say June = solar winds (most fuel, shortest distance: consistent).")
    print("    notes put the gravity slingshot in %s for distance but in %s for fuel: two different months."
          % (b[2], b[1]))
    assert b[2] != b[1]
    same = FUEL_9 == FUEL_12[:9] and DIST_9 == DIST_12[:9]
    print("    do the first 9 months of the 12-month set match the 9-month set? %s (%d of 18 values differ)"
          % ("yes" if same else "NO", sum(1 for x, y in zip(FUEL_9 + DIST_9, FUEL_12[:9] + DIST_12[:9]) if x != y)))
    print("  third version: an example in the Level 2 overview, fuel %s, distance %s (running totals)."
          % (EXAMPLE_FUEL_3, EXAMPLE_DIST_3))
    print("  site Level 2 and site Level 3 use the same 18 numbers, so the child plots the same 18 points twice.")


def part3():
    print("\nPART 3  Level 4 (bar graph of food eaten): site against the Drive sheet the site links to")
    for title, site, drive in (("first 3 months", L4_SITE_FIRST, L4_DRIVE_FIRST), ("last 3 months", L4_SITE_LAST, L4_DRIVE_LAST)):
        diffs = {k: (site[k], drive[k]) for k in site if site[k] != drive[k]}
        print("  %-14s site total %d, Drive total %d; different values (site, Drive): %s"
              % (title, sum(site.values()), sum(drive.values()), diffs))
    for name, first, last in (("site", L4_SITE_FIRST, L4_SITE_LAST), ("Drive", L4_DRIVE_FIRST, L4_DRIVE_LAST)):
        shared = [k for k in first if k in last]
        changes = {k: last[k] - first[k] for k in shared}
        hi_k, hi, lo_k, lo = extremes(first)
        hi2_k, hi2, lo2_k, lo2 = extremes(last)
        print("  %-5s first: most %s %d, least %s %d | last: most %s %d, least %s %d"
              % (name, hi_k, hi, lo_k, lo, hi2_k, hi2, lo2_k, lo2))
        print("        change for foods in both lists: %s   CHECKABLE" % changes)
        print("        only in first: %s; only in last: %s"
              % ([k for k in first if k not in last], [k for k in last if k not in first]))
    print("  the site has a tie for 'most' in the first 3 months (Protein and Dairy, both 400).")
    print("  dairy goes DOWN on the site (400 to 120) and UP on the Drive sheet (200 to 320).")
    for name, first, last in (("site", L4_SITE_FIRST, L4_SITE_LAST), ("Drive", L4_DRIVE_FIRST, L4_DRIVE_LAST)):
        vals = list(first.values()) + list(last.values())
        odd = sorted({v for v in vals if v % 50})
        print("  scale, %s: all values are multiples of 50 except %s, so a scale in 50s leaves those between lines."
              % (name, odd))
    assert sum(L4_SITE_FIRST.values()) == 1850 and sum(L4_SITE_LAST.values()) == 1270
    assert sum(L4_DRIVE_FIRST.values()) == 1650 and sum(L4_DRIVE_LAST.values()) == 1220


def part4():
    print("\nPART 4  Draft 'Data Handling Quest 1: Final Boss' (Drive only, not on the site)")
    wsum = sum(r[1] for r in MATRIX)
    tot = [0.0, 0.0, 0.0]
    bad = 0
    for name, w, a, b, c, wa, wb, wc in MATRIX:
        for i, (score, printed) in enumerate(((a, wa), (b, wb), (c, wc))):
            calc = w * score / 100.0
            tot[i] += calc
            bad += 0 if abs(calc - printed) < 1e-9 else 1
    print("  weights add to %d%%; wrong cells: %d; totals A %.2f, B %.2f, C %.2f (printed %s)"
          % (wsum, bad, tot[0], tot[1], tot[2], MATRIX_TOTALS_PRINTED))
    assert wsum == 100 and bad == 0 and all(abs(t - p) < 1e-9 for t, p in zip(tot, MATRIX_TOTALS_PRINTED))
    print("  the sums are right. The maths is percentages x scores with decimal answers: far above Grade 3.")


def rule_bar(seed):
    """[Proposal] bar-graph numbers for one student.

    Five of Marc's ship rooms or food groups, five different multiples of 10
    from 10 to 100. Scale counts in 10s, at most 10 lines.
    Typed checks: biggest (name), smallest (name), difference, total of two named bars.
    """
    rng = random.Random("BAR-%d" % seed)
    labels = rng.sample(["Fruits", "Vegetables", "Protein", "Grains", "Dairy", "Snacks", "Canned Goods", "Freeze Dried"], 5)
    values = rng.sample(range(10, 101, 10), 5)
    data = dict(zip(labels, values))
    a, b = rng.sample(labels, 2)
    return {"data": data, "pair": (a, b)}


def part5():
    print("\nPART 5  Rule BAR [Proposal], 10,000 seeds")
    fails, sets = 0, set()
    for seed in range(10000):
        p = rule_bar(seed)
        d = p["data"]
        hi_k, hi, lo_k, lo = extremes(d)
        a, b = p["pair"]
        ok = (len(hi_k) == 1 and len(lo_k) == 1                 # one biggest, one smallest
              and all(v % 10 == 0 and 10 <= v <= 100 for v in d.values())
              and 10 <= hi - lo <= 90                            # difference is a 2-digit subtraction
              and d[a] + d[b] <= 200 and sum(d.values()) <= 500  # sums stay small
              and len(set(d.values())) == 5)
        fails += 0 if ok else 1
        sets.add(tuple(sorted(d.items())))
    print("  failures: %d of 10,000. Different data sets: %d." % (fails, len(sets)))
    ex = rule_bar(2)
    hi_k, hi, lo_k, lo = extremes(ex["data"])
    a, b = ex["pair"]
    print("  example seed 2: %s" % ex["data"])
    print("    biggest %s; smallest %s; difference %d; %s + %s = %d" % (hi_k[0], lo_k[0], hi - lo, a, b, ex["data"][a] + ex["data"][b]))
    assert fails == 0


def rule_line(seed):
    """[Proposal] line-graph numbers for one student. Keeps Marc's story.

    Six months. Fuel: multiples of 10 from 360 to 530 (Marc's range).
    Distance: multiples of 50 from 700 to 1,100 (Marc's range).
    One 'solar wind' month has the most fuel AND the shortest distance.
    One 'gravity assist' month has the least fuel AND the farthest distance.
    Every other month sits strictly between, so each answer is unique.
    """
    rng = random.Random("LINE-%d" % seed)
    months = ["January", "February", "March", "April", "May", "June"]
    wind, assist = rng.sample(range(6), 2)
    fuel_hi = rng.choice([510, 520, 530])
    fuel_lo = rng.choice([360, 370, 380])
    dist_hi = rng.choice([1050, 1100])
    dist_lo = rng.choice([700, 750])
    fuel, dist = [], []
    for i in range(6):
        if i == wind:
            fuel.append(fuel_hi); dist.append(dist_lo)
        elif i == assist:
            fuel.append(fuel_lo); dist.append(dist_hi)
        else:
            fuel.append(rng.randrange(fuel_lo + 10, fuel_hi, 10))
            dist.append(rng.randrange(dist_lo + 50, dist_hi, 50))
    return {"months": months, "fuel": fuel, "dist": dist, "wind": months[wind], "assist": months[assist]}


def part6():
    print("\nPART 6  Rule LINE [Proposal], 10,000 seeds")
    fails, sets = 0, set()
    for seed in range(10000):
        p = rule_line(seed)
        f, d, m = p["fuel"], p["dist"], p["months"]
        ok = (f.count(max(f)) == 1 and f.count(min(f)) == 1 and d.count(max(d)) == 1 and d.count(min(d)) == 1
              and m[f.index(max(f))] == p["wind"] == m[d.index(min(d))]
              and m[f.index(min(f))] == p["assist"] == m[d.index(max(d))]
              and all(v % 10 == 0 and 360 <= v <= 530 for v in f)
              and all(v % 50 == 0 and 700 <= v <= 1100 for v in d)
              and max(f) - min(f) <= 170 and max(d) - min(d) <= 400)
        fails += 0 if ok else 1
        sets.add((tuple(f), tuple(d)))
    print("  failures: %d of 10,000. Different data sets: %d." % (fails, len(sets)))
    ex = rule_line(4)
    print("  example seed 4: fuel %s" % dict(zip(ex["months"], ex["fuel"])))
    print("                  distance %s" % dict(zip(ex["months"], ex["dist"])))
    print("    most fuel %s; least fuel %s; fuel difference %d; the strange 'solar wind' month is %s"
          % (ex["wind"], ex["assist"], max(ex["fuel"]) - min(ex["fuel"]), ex["wind"]))
    assert fails == 0


if __name__ == "__main__":
    part1()
    part2()
    part3()
    part4()
    part5()
    part6()
    print("\nALL CHECKS PASSED")
