#!/usr/bin/env python3
"""Operation Stardust Task 1 - Food Shopping (Levels 1-2). Recomputation and number-rule tests.

Standard library only. Run:  python3 checks/stardust_t1_check.py

PART 1  The Food Supplies Data Sheet: recount every category.
PART 2  Level 1 workload: how much a child sorts and writes.
PART 3  Level 2 arithmetic: recompute the site's numbers; count the calculations.
PART 4  Rule L1 [Proposal]: 8 foods per student, answers are counts. 10,000 seeds.
PART 5  Rule L2 [Proposal]: 3 foods per 3-month part, facts within 10 x 10. 10,000 seeds.

[Source] FOODS is the "Food Supplies Data Sheet" (Drive id
1Da255g08YtGJWyQ5MeybiqmrPBWlpaRUOP6xuLQYh_M). The copy in the Level 2 folder
and the copy inside "Level 1: Galaxy Food Supplies" are identical to it.
"""
import itertools
import random
import statistics

# name, shelf life (months), nutritional value label, nutritional score, energy score
FOODS = [
    ("Freeze-Dried Apple", 18, "High", 9, 5),
    ("Canned Beans", 24, "High", 8, 7),
    ("Instant Ramen", 12, "Low", 3, 8),
    ("Brown Rice", 6, "Medium", 6, 6),
    ("Almonds", 9, "High", 9, 9),
    ("Protein Bars", 18, "High", 8, 10),
    ("Oats", 8, "High", 7, 8),
    ("Canned Tuna", 36, "Medium", 6, 6),
    ("Dried Lentils", 12, "High", 8, 7),
    ("Cornflakes", 6, "Low", 2, 5),
    ("Fresh Carrots", 1, "Medium", 6, 4),
    ("Dark Chocolate", 24, "Low", 4, 8),
    ("Trail Mix", 9, "Medium", 6, 7),
    ("Fresh Spinach", 0.5, "High", 8, 4),
    ("Peanut Butter", 9, "High", 8, 9),
    ("Whole Wheat Bread", 1, "Medium", 6, 6),
    ("Canned Peaches", 36, "Low", 3, 5),
    ("Fresh Milk", 0.5, "Medium", 5, 6),
    ("Chicken Jerky", 12, "Medium", 7, 7),
    ("Quinoa", 8, "High", 9, 7),
]
NAME, SHELF, LABEL, NUTR, ENERGY = range(5)

# [Source] site, Level 2 "Eating Schedule"
SITE_MONTHS, SITE_CREW, SITE_POINTS = 12, 4, 30
SITE_TOTAL, SITE_PER_3_MONTHS = 1440, 360
SITE_EXAMPLES = [("Fresh Milk", 5, 30), ("Fresh Spinach", 4, 16)]   # "5 x 6 = 30", "4 x 4 = 16"
PLAN_DOC_EXAMPLE = ("Brown Rice", 6, 10, 60)                        # row pre-filled in "12-month food plan"
SEGMENTS = [(1, 3), (4, 6), (7, 9), (10, 12)]
PLAN_ROWS_PER_TABLE = 10


def shelf_bin(months):
    """[Proposal] thresholds. Marc's sheet says only 'Short / Medium / Long-Lasting' with no cut-offs."""
    if months <= 3:
        return "short"
    if months < 12:
        return "medium"
    return "long"


def eligible(segment_end):
    """A food can be eaten in a 3-month part if it lasts to the end of that part.

    Months 1-3 are the exception: every food can be eaten then, and the four
    fresh foods (shelf life 0.5 or 1 month) can ONLY be eaten then, at the start.
    """
    if segment_end == 3:
        return list(FOODS)
    return [f for f in FOODS if f[SHELF] >= segment_end]


def part1():
    print("PART 1  The data sheet")
    assert len(FOODS) == 20 and len({f[NAME] for f in FOODS}) == 20
    print("  foods: %d (the site says '20-25 foods')" % len(FOODS))
    by_label = {}
    for f in FOODS:
        by_label.setdefault(f[LABEL], []).append(f)
    for lab in ("High", "Medium", "Low"):
        scores = sorted(f[NUTR] for f in by_label[lab])
        print("  nutrition %-6s: %d foods, scores %s" % (lab, len(by_label[lab]), scores))
    hi_min = min(f[NUTR] for f in by_label["High"])
    med_max = max(f[NUTR] for f in by_label["Medium"])
    clash = [(f[NAME], f[LABEL]) for f in FOODS if f[NUTR] == 7]
    print("  label/score clash: lowest High score is %d, highest Medium score is %d -> %s" % (hi_min, med_max, clash))
    assert hi_min == med_max == 7
    bins = {}
    for f in FOODS:
        bins.setdefault(shelf_bin(f[SHELF]), []).append(f)
    for b in ("short", "medium", "long"):
        print("  shelf life %-6s: %d foods, months %s" % (b, len(bins[b]), sorted(x[SHELF] for x in bins[b])))
    decimals = [f[NAME] for f in FOODS if f[SHELF] != int(f[SHELF])]
    print("  decimal shelf lives (0.5 months): %s" % decimals)
    print("  energy scores: lowest %d, highest %d, all 20 added = %d"
          % (min(f[ENERGY] for f in FOODS), max(f[ENERGY] for f in FOODS), sum(f[ENERGY] for f in FOODS)))
    name_chars = [len(f[NAME]) for f in FOODS]
    print("  food names: %d characters in all, longest %d ('%s')"
          % (sum(name_chars), max(name_chars), max(FOODS, key=lambda f: len(f[NAME]))[NAME]))
    return sum(name_chars)


def part2(total_name_chars):
    print("\nPART 2  Level 1 workload (as written on the site)")
    rounds = 3
    print("  %d rounds x %d foods = %d placements. No arithmetic." % (rounds, len(FOODS), rounds * len(FOODS)))
    print("  writing or typing: %d food names = about %d characters, plus notes, a final list and a video."
          % (rounds * len(FOODS), rounds * total_name_chars))
    print("  data cells to read: %d foods x 5 columns = %d." % (len(FOODS), len(FOODS) * 5))
    for secs in (20, 30, 45):
        print("    at %d seconds per placement: %d minutes of sorting alone" % (secs, rounds * len(FOODS) * secs // 60))


def best_counts(scores, target, max_count):
    """Counts (each >= 1) with sum(score x count) == target, smallest largest-count first."""
    best = None
    for counts in itertools.product(range(1, max_count + 1), repeat=len(scores)):
        if sum(s * c for s, c in zip(scores, counts)) == target:
            if best is None or max(counts) < max(best):
                best = counts
    return best


def part3():
    print("\nPART 3  Level 2 arithmetic")
    total = SITE_MONTHS * SITE_CREW * SITE_POINTS
    per3 = 3 * SITE_CREW * SITE_POINTS
    print("  %d months x %d crew x %d points = %d (site says %d)" % (SITE_MONTHS, SITE_CREW, SITE_POINTS, total, SITE_TOTAL))
    print("  3 months x %d crew x %d points = %d (site says %d); 4 parts x %d = %d"
          % (SITE_CREW, SITE_POINTS, per3, SITE_PER_3_MONTHS, per3, 4 * per3))
    assert total == SITE_TOTAL and per3 == SITE_PER_3_MONTHS and 4 * per3 == total
    energy = {f[NAME]: f[ENERGY] for f in FOODS}
    for name, units, claimed in SITE_EXAMPLES:
        print("  site example: %d units of %s x %d = %d (site says %d)" % (units, name, energy[name], units * energy[name], claimed))
        assert units * energy[name] == claimed
    n, e, c, t = PLAN_DOC_EXAMPLE
    assert energy[n] == e and e * c == t
    print("  plan sheet example: %s %d x %d = %d (correct)" % (n, e, c, t))
    ex_total = sum(c for _, _, c in SITE_EXAMPLES)
    print("  the site's example for months 1-3 adds to %d of the %d needed (%d short; the page does not say so)"
          % (ex_total, per3, per3 - ex_total))

    print("  foods that last long enough for each part:")
    for lo, hi in SEGMENTS:
        el = eligible(hi)
        print("    months %2d-%-2d: %2d foods, energy scores %s" % (lo, hi, len(el), sorted(f[ENERGY] for f in el)))
    must_first = [f[NAME] for f in FOODS if f[SHELF] < 3]
    print("  must be eaten in months 1-3 (shelf life under 3 months): %s" % must_first)

    # One honest smallest plan: every food used once ("use up all of the food"), 5 foods per part.
    order = sorted(FOODS, key=lambda f: f[SHELF])
    parts = [order[0:5], order[5:10], order[10:15], order[15:20]]
    print("  smallest plan that obeys every rule on the page (all 20 foods, shelf life, exactly 360 each part):")
    mults = adds = cells = 0
    biggest_product = biggest_count = 0
    for (lo, hi), foods in zip(SEGMENTS, parts):
        assert all(f[SHELF] >= hi or f[SHELF] < 3 and hi == 3 for f in foods), "shelf-life rule broken"
        scores = [f[ENERGY] for f in foods]
        counts = best_counts(scores, per3, 20)
        assert counts is not None
        products = [s * c for s, c in zip(scores, counts)]
        assert sum(products) == per3
        mults += len(foods)
        adds += len(foods) - 1
        cells += 4 * len(foods) + 1
        biggest_product = max(biggest_product, max(products))
        biggest_count = max(biggest_count, max(counts))
        print("    months %2d-%-2d: %s = %d"
              % (lo, hi, " + ".join("%s %dx%d=%d" % (f[NAME], s, c, p) for f, s, c, p in zip(foods, scores, counts, products)), sum(products)))
    print("  that plan: %d multiplications, %d additions (4 column totals of 5 numbers), %d cells written."
          % (mults, adds, cells))
    print("    biggest count %d, biggest product %d, running totals up to %d." % (biggest_count, biggest_product, per3))
    fresh_scores = sorted(f[ENERGY] for f in FOODS if f[SHELF] < 3)
    cap = 10 * (sum(fresh_scores) + max(f[ENERGY] for f in FOODS))
    print("    months 1-3 with the 4 fresh foods and 1 more: counts of 10 or less give at most %d, under 360."
          % cap)
    print("    so that part needs counts above 10 (a 2-digit x 1-digit product) or more than 5 foods.")
    assert cap < per3 and biggest_count > 10
    full = 4 * PLAN_ROWS_PER_TABLE
    print("  if all %d rows of the four printed tables are filled: %d multiplications, %d additions, %d cells."
          % (full, full, 4 * (PLAN_ROWS_PER_TABLE - 1), 4 * (4 * PLAN_ROWS_PER_TABLE + 1)))
    avg = statistics.mean(f[ENERGY] for f in FOODS)
    print("  units needed: about %d per part, about %d for the year (average energy score %.2f)."
          % (round(per3 / avg), round(SITE_TOTAL / avg), avg))
    # Why it is a search, not a sum: how many ways are there even for one small case?
    seg4 = [f[ENERGY] for f in eligible(12)][:3]
    ways = sum(1 for cs in itertools.product(range(0, 61), repeat=3) if sum(s * c for s, c in zip(seg4, cs)) == per3)
    print("  with only 3 foods (scores %s) there are already %d different ways to make exactly 360." % (seg4, ways))


def rule_l1(seed):
    """[Proposal] Level 1: each student gets 8 of Marc's 20 foods.

    At least one food in every shelf-life bin and every nutrition label.
    The student answers with counts (three numbers per answer), not lists of names.
    """
    rng = random.Random("L1-%d" % seed)
    for attempt in range(1, 101):
        picks = rng.sample(FOODS, 8)
        bins = [shelf_bin(f[SHELF]) for f in picks]
        labs = [f[LABEL] for f in picks]
        if all(b in bins for b in ("short", "medium", "long")) and all(l in labs for l in ("High", "Medium", "Low")):
            return {
                "foods": picks,
                "shelf_answer": tuple(bins.count(b) for b in ("short", "medium", "long")),
                "label_answer": tuple(labs.count(l) for l in ("Low", "Medium", "High")),
                "attempts": attempt,
            }
    return None


def part4():
    print("\nPART 4  Rule L1 [Proposal], 10,000 seeds")
    fails, max_attempts, seen = 0, 0, set()
    for seed in range(10000):
        p = rule_l1(seed)
        if p is None or sum(p["shelf_answer"]) != 8 or sum(p["label_answer"]) != 8 \
                or min(p["shelf_answer"]) < 1 or min(p["label_answer"]) < 1:
            fails += 1
            continue
        max_attempts = max(max_attempts, p["attempts"])
        seen.add(tuple(sorted(f[NAME] for f in p["foods"])))
    print("  failures: %d of 10,000. Most redraws: %d. Different food sets: %d." % (fails, max_attempts, len(seen)))
    ex = rule_l1(1)
    print("  example seed 1: %s" % [f[NAME] for f in ex["foods"]])
    print("    short/medium/long = %s; low/medium/high = %s (each answer is 3 numbers)" % (ex["shelf_answer"], ex["label_answer"]))
    assert fails == 0


def rule_l2(seed):
    """[Proposal] Level 2: Marc's story and energy scores, smaller numbers.

    crew = 2..5; each person needs 10 energy points a month.
    One month = crew x 10. One 3-month part = that x 3 (60, 90, 120 or 150).
    For each part the world offers 3 foods that last long enough.
    The first part always includes a fresh food (shelf life under 3 months).
    The student types 3 counts, each 1 to 10. Check: the three products add to the target.
    Every product is a fact within 10 x 10.
    """
    rng = random.Random("L2-%d" % seed)
    crew = rng.choice([2, 3, 4, 5])
    month = crew * 10
    target = month * 3
    parts = []
    redraws = 0
    for lo, hi in SEGMENTS:
        pool = eligible(hi)
        while True:
            if hi == 3:
                fresh = rng.choice([f for f in FOODS if f[SHELF] < 3])
                foods = [fresh] + rng.sample([f for f in FOODS if f[SHELF] >= 3], 2)
            else:
                foods = rng.sample(pool, 3)
            scores = [f[ENERGY] for f in foods]
            sols = [cs for cs in itertools.product(range(1, 11), repeat=3)
                    if sum(s * c for s, c in zip(scores, cs)) == target]
            if sols:
                break
            redraws += 1
            if redraws > 500:
                return None
        parts.append({"months": (lo, hi), "foods": foods, "solutions": sols})
    return {"crew": crew, "month": month, "target": target, "year": 4 * target, "parts": parts, "redraws": redraws}


def part5():
    print("\nPART 5  Rule L2 [Proposal], 10,000 seeds")
    fails, max_redraws, n_sols, puzzles = 0, 0, [], set()
    for seed in range(10000):
        p = rule_l2(seed)
        if p is None:
            fails += 1
            continue
        ok = p["target"] in (60, 90, 120, 150) and p["year"] <= 600 and len(p["parts"]) == 4
        for part in p["parts"]:
            hi = part["months"][1]
            scores = [f[ENERGY] for f in part["foods"]]
            ok = ok and len(part["solutions"]) >= 1
            ok = ok and all(f[SHELF] >= hi or (hi == 3 and f[SHELF] < 3) for f in part["foods"])   # nothing spoils early
            ok = ok and all(1 <= c <= 10 and s * c <= 100 for cs in part["solutions"] for s, c in zip(scores, cs))
            ok = ok and all(sum(s * c for s, c in zip(scores, cs)) == p["target"] for cs in part["solutions"])
            ok = ok and len({f[NAME] for f in part["foods"]}) == 3
            n_sols.append(len(part["solutions"]))
        ok = ok and any(f[SHELF] < 3 for f in p["parts"][0]["foods"])
        fails += 0 if ok else 1
        max_redraws = max(max_redraws, p["redraws"])
        puzzles.add((p["crew"], tuple(tuple(f[NAME] for f in part["foods"]) for part in p["parts"])))
    print("  failures: %d of 10,000. Most redraws for one student: %d. Different puzzles: %d."
          % (fails, max_redraws, len(puzzles)))
    print("  right answers per part: fewest %d, median %d, most %d (a 'conditions' checkpoint, not one answer)."
          % (min(n_sols), statistics.median(n_sols), max(n_sols)))
    print("  largest numbers: product 100, part target 150, year total 600. Typed per answer: 3 numbers.")
    ex = rule_l2(5)
    print("  example seed 5: crew %d; one month = %d x 10 = %d; three months = %d x 3 = %d"
          % (ex["crew"], ex["crew"], ex["month"], ex["month"], ex["target"]))
    for part in ex["parts"]:
        s = part["solutions"][0]
        print("    months %2d-%-2d: %s -> one right answer %s"
              % (part["months"][0], part["months"][1],
                 ", ".join("%s (%d)" % (f[NAME], f[ENERGY]) for f in part["foods"]), s))
    print("  calculations for the whole proposal: 2 for the target, then 3 multiplications + 2 additions per part = %d."
          % (2 + 4 * 5))
    assert fails == 0


if __name__ == "__main__":
    chars = part1()
    part2(chars)
    part3()
    part4()
    part5()
    print("\nALL CHECKS PASSED")
