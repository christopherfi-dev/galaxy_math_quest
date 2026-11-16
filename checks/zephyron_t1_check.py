#!/usr/bin/env python3
"""Zephyron Task 1 - Journey to the Right City. Recomputation and number-rule test.

Standard library only. Run:  python3 checks/zephyron_t1_check.py

PART 1  Recompute every city distance on "World Map - Crash - 600km.pdf".
PART 2  The scale arithmetic a child does, on A3 and on A4 paper.
PART 3  Rule A [Proposal]: keep the printed map, vary the target distance.
PART 4  Rule B [Proposal]: numbers given in the world (cm x km-per-cm), 10,000 seeds.

HOW THE PIXEL NUMBERS BELOW WERE MEASURED (2026-11-16)
The PDF (Drive id 1dR3pnDeKXRRwoyNQqmWE2kr5kcjRIo_F) is one A3 landscape page,
1190.25 x 842.25 pt. It was rendered with `pdftoppm -r 300` to 4960 x 3510 px.
- Crash site = centroid of the pasted red dot (5,560 red pixels).
- City = centroid of the white marker dot next to each name (136-284 pixels each).
- Scale bar = centres of the end ticks of the pasted "0 75 150 300 Kilometers" bar.
These are measurements from the image, good to about +/- 2 px (under 1 km).
"""
import math
import random

DPI = 300
CM_PER_PX_A3 = 2.54 / DPI                 # page printed at full size (A3)
A4_FACTOR = 297.0 / 420.0                 # A3 page shrunk to fit A4
CRASH = (2604.57, 2080.70)                # red dot centroid, px
SCALE_BAR_PX = (3578.5, 4416.0)           # x of the "0" tick and the "300" tick
SCALE_BAR_KM = 300
N_BAR_DIVISIONS = 8                       # the bar has 8 equal divisions

CITIES_PX = {                             # name as printed on the map: marker centroid
    "Talvela":  (3028.2, 1851.7),
    "Käraste":  (2118.1, 2139.1),
    "Pävala":   (2881.9, 2710.1),
    "Rabaraja": (2109.2, 1037.3),
    "Tapavee":  (2751.1, 3432.8),
    "Künkapää": (1044.5, 1990.0),
    "Reisi":    (4145.3, 2718.6),
    "Hólborg":  (4326.9, 1422.2),
    "Loikka":   (1095.0, 731.2),
    "Mägela":   (3190.8, 99.4),
    "Vestrbu":  (4204.9, 171.1),
    "Vaheri":   (199.2, 1271.1),
    "Laheste":  (337.7, 679.2),
    "Sjálborg": (4668.9, 118.2),
}

# What Marc's sources say
SITE_QUEST_PAGE_KM = 200      # quest page: "the city precisely 200 km away"
SITE_TASK_PAGE_KM = 600       # task page and map file name: 600 km
FORM_ACCEPTS = "eis"          # the answer form accepts any text containing "eis"
RECORD_DOC = {"Pävala": 230, "Talvela": 152}   # rows already typed in "5 Cities and their Distances"


def distances():
    bar_px = SCALE_BAR_PX[1] - SCALE_BAR_PX[0]
    km_per_px = SCALE_BAR_KM / bar_px
    out = {}
    for name, (x, y) in CITIES_PX.items():
        px = math.hypot(x - CRASH[0], y - CRASH[1])
        out[name] = {
            "km": px * km_per_px,
            "cm_a3": px * CM_PER_PX_A3,
            "cm_a4": px * CM_PER_PX_A3 * A4_FACTOR,
        }
    return out, bar_px, km_per_px


def part1_and_2():
    d, bar_px, km_per_px = distances()
    bar_a3 = bar_px * CM_PER_PX_A3
    bar_a4 = bar_a3 * A4_FACTOR
    print("PART 1  Distances from the crash site (measured on the map image)")
    print("  scale bar 0-300 km = %.1f px = %.2f cm on A3 = %.2f cm on A4" % (bar_px, bar_a3, bar_a4))
    print("  so 1 cm = %.1f km on A3, and 1 cm = %.1f km on A4" % (300 / bar_a3, 300 / bar_a4))
    print("  one small division of the bar = %.1f km (300 / %d)" % (300 / N_BAR_DIVISIONS, N_BAR_DIVISIONS))
    print("  %-9s %7s %8s %8s" % ("city", "km", "cm A3", "cm A4"))
    for name, v in sorted(d.items(), key=lambda kv: kv[1]["km"]):
        print("  %-9s %7.0f %8.1f %8.1f" % (name, v["km"], v["cm_a3"], v["cm_a4"]))

    within600 = [n for n, v in d.items() if v["km"] <= 600]
    print("  cities within 600 km: %d %s" % (len(within600), sorted(within600, key=lambda n: d[n]["km"])))

    def nearest(target):
        ranked = sorted(d.items(), key=lambda kv: abs(kv[1]["km"] - target))
        return [(n, v["km"] - target) for n, v in ranked[:3]]

    print("\n  600 km (task page, map file name): nearest cities and how far off")
    for n, off in nearest(600):
        print("    %-9s %+6.0f km" % (n, off))
    print("  200 km (quest page): nearest cities and how far off")
    for n, off in nearest(200):
        print("    %-9s %+6.0f km" % (n, off))

    best600 = nearest(600)[0][0]
    assert best600 == "Reisi", best600
    assert FORM_ACCEPTS in best600, "form key does not match the measured city"
    assert abs(d["Reisi"]["km"] - 600) < 10
    assert min(abs(v["km"] - 200) for v in d.values()) > 20, "a city IS near 200 km"
    print("  RESULT: 600 km -> Reisi (%.0f km). The answer form accepts text containing '%s'. They agree."
          % (d["Reisi"]["km"], FORM_ACCEPTS))
    print("  RESULT: no city is within 20 km of 200 km. The quest page's 200 km has no answer on this map.")

    print("\n  Rows already typed in the record doc, against the measurement:")
    for n, km in RECORD_DOC.items():
        print("    %-8s doc says %d km, measured %.0f km (doc is %.0f km low)" % (n, km, d[n]["km"], d[n]["km"] - km))

    print("\nPART 2  The arithmetic a child does")
    print("  Way 1 (double the bar): 300 km + 300 km = 600 km. Bar length doubled:")
    print("     A3: %.1f cm + %.1f cm = %.1f cm. Reisi measures %.1f cm." % (bar_a3, bar_a3, 2 * bar_a3, d["Reisi"]["cm_a3"]))
    print("     A4: %.1f cm + %.1f cm = %.1f cm. Reisi measures %.1f cm." % (bar_a4, bar_a4, 2 * bar_a4, d["Reisi"]["cm_a4"]))
    print("     Nearest wrong city Künkapää: %.1f cm on A3, %.1f cm on A4 (%.1f / %.1f cm short)."
          % (d["Künkapää"]["cm_a3"], d["Künkapää"]["cm_a4"],
             2 * bar_a3 - d["Künkapää"]["cm_a3"], 2 * bar_a4 - d["Künkapää"]["cm_a4"]))
    print("  Way 2 (convert each city to km): needs km = cm x %.1f (A3) or cm x %.1f (A4)." % (300 / bar_a3, 300 / bar_a4))
    print("     Example Pävala on A4: %.1f cm x 60 = %.0f km. A decimal times 60 is above Grade 3."
          % (d["Pävala"]["cm_a4"], round(d["Pävala"]["cm_a4"], 1) * 60))
    print("     The record sheet asks for this for 5 cities.")
    return d


def part3_rule_a(d):
    """Rule A [Proposal]: printed map stays; each student gets one target distance."""
    print("\nPART 3  Rule A [Proposal]: printed map, per-student target distance")
    TOL_HIT = 15      # the right city must be within 15 km of the target
    TOL_MISS = 40     # every other city must be at least 40 km from the target
    usable = []
    for target in range(150, 1001, 25):
        offs = sorted((abs(v["km"] - target), n) for n, v in d.items())
        if offs[0][0] <= TOL_HIT and offs[1][0] >= TOL_MISS:
            usable.append((target, offs[0][1], offs[0][0], offs[1][0], offs[1][1]))
    for t, n, off, off2, n2 in usable:
        print("  target %4d km -> %-9s (off by %4.1f km; next nearest %s is %.0f km off)" % (t, n, off, n2, off2))
    targets = [u[0] for u in usable]
    answers = {u[0]: u[1] for u in usable}
    fails = 0
    counts = {}
    for seed in range(10000):
        rng = random.Random(seed)
        t = rng.choice(targets)
        offs = sorted((abs(v["km"] - t), n) for n, v in d.items())
        ok = offs[0][1] == answers[t] and offs[0][0] <= TOL_HIT and offs[1][0] >= TOL_MISS
        fails += 0 if ok else 1
        counts[t] = counts.get(t, 0) + 1
    n_cities = len(set(answers.values()))
    print("  10,000 seeds: %d failures. Only %d targets and %d different answer cities exist,"
          % (fails, len(targets), n_cities))
    print("  so in a class of 20 about %d students share each answer." % round(20 / n_cities))
    print("  spread:", dict(sorted(counts.items())))
    assert fails == 0
    assert 600 in targets


def rule_b(seed):
    """Rule B [Proposal]: the world gives a scale and five map distances in whole cm.

    scale: 1 cm = k km, k in {10, 20, 50, 100}
    five cities with different whole-cm distances from 2 to 10 cm
    target = the km distance of one of them
    Child's arithmetic: cm x k (one digit or 10, times a multiple of 10).
    """
    rng = random.Random(seed)
    k = rng.choice([10, 20, 50, 100])
    cms = rng.sample(range(2, 11), 5)
    names = rng.sample(["Talvela", "Käraste", "Pävala", "Rabaraja", "Tapavee", "Künkapää", "Reisi", "Hólborg"], 5)
    cities = dict(zip(names, cms))
    answer = rng.choice(names)
    return {"k": k, "cities": cities, "target_km": cities[answer] * k, "answer": answer}


def part4_rule_b():
    print("\nPART 4  Rule B [Proposal]: numbers in the world, 10,000 seeds")
    fails = 0
    max_km = 0
    distinct = set()
    for seed in range(10000):
        p = rule_b(seed)
        kms = [c * p["k"] for c in p["cities"].values()]
        matches = [n for n, c in p["cities"].items() if c * p["k"] == p["target_km"]]
        ok = (
            len(matches) == 1 and matches[0] == p["answer"]      # exactly one right city
            and len(set(kms)) == 5                                # all five distances differ
            and all(km <= 1000 for km in kms)                     # stays within 1,000
            and all(2 <= c <= 10 for c in p["cities"].values())   # one factor is 2..10
            and p["k"] in (10, 20, 50, 100)                       # other factor is a friendly multiple of 10
        )
        fails += 0 if ok else 1
        max_km = max(max_km, max(kms))
        distinct.add((p["k"], tuple(sorted(p["cities"].items())), p["answer"]))
    print("  failures: %d of 10,000. Largest distance: %d km. Different puzzles: %d." % (fails, max_km, len(distinct)))
    ex = rule_b(7)
    print("  example seed 7: 1 cm = %d km; map distances (cm) %s; find the city %d km away -> %s"
          % (ex["k"], ex["cities"], ex["target_km"], ex["answer"]))
    assert fails == 0


if __name__ == "__main__":
    d = part1_and_2()
    part3_rule_a(d)
    part4_rule_b()
    print("\nALL CHECKS PASSED")
