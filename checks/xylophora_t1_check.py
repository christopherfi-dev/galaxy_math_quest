#!/usr/bin/env python3
"""
Xylophora Task 1 - Architectural Origami (magnetic tile buildings).

Part A  recomputes the area of every tile from the numbers on the site, shows
        what maths each one needs, and counts the blanks on the calculation sheet.
Part B  tests on 10,000 seeds how often the ORIGINAL numbers give a decimal
        answer, and tests a PROPOSED whole-number rule.

Sources (Marc's site and Drive, read 2026-11-16):
  - site page 'Task 1 - Architectural Origami' and the Drive doc 'intro'
    (same text):  "The side of each square = 5 meters"
                  "The height of the tallest triangles = 10 meters."
                  "The height of the smallest triangle = 4 meters."
                  "Two of the middle-sized triangles = one square"
  - 'building area calculation' (the calculation sheet: S, BT, MT, ST)
  - saved ChatGPT chat: an earlier version had "rectangles (5x3 meters),
    squares (5x5 meters), and triangles (5x4 meters)"; then Marc wrote
    "I've got magnetic blocks ... (Squareness and 2 kinds of triangles) ...
    We could say a square is 5x5 and the triangles are half the size."

ASSUMPTION used below, because no source gives it: every triangle's base is
5 m (its short edge clicks onto the side of a square). The chat's "5x4"
triangle supports this for the small one. If the base is different, BT and ST
change.

Standard library only. Run:  python3 xylophora_t1_check.py
"""
import math
import random
from fractions import Fraction

SIDE = 5            # metres [Source]
BT_HEIGHT = 10      # metres [Source]
ST_HEIGHT = 4       # metres [Source]
BASE = 5            # metres [ASSUMPTION - not in any source]

AREA = {
    "S":  Fraction(SIDE * SIDE),              # 5 x 5
    "BT": Fraction(BASE * BT_HEIGHT, 2),      # 1/2 x 5 x 10
    "MT": Fraction(SIDE * SIDE, 2),           # half of a square
    "ST": Fraction(BASE * ST_HEIGHT, 2),      # 1/2 x 5 x 4
}
NEEDS = {
    "S":  "5 x 5. Grade 3 (IXL MM8, the skill the page names).",
    "BT": "1/2 x base x height, and the base is not given. Above Grade 3.",
    "MT": "25 / 2 = 12.5. A decimal (or 'twelve and a half'). Above Grade 3.",
    "ST": "1/2 x base x height, and the base is not given. Above Grade 3.",
}


def show(x):
    return str(x.numerator) if x.denominator == 1 else f"{float(x):g}"


def building_area(counts):
    return sum(AREA[k] * n for k, n in counts.items())


def part_a():
    print("PART A - tile areas from the site's numbers")
    for k in ("S", "BT", "MT", "ST"):
        print(f"  {k:2} = {show(AREA[k]):>5} square metres   {NEEDS[k]}")
    print(f"  One big triangle ({show(AREA['BT'])}) covers the same as one square ({show(AREA['S'])}).")
    print(f"  A child who multiplies 5 x 10 and 5 x 4 without halving gets 50 and 20: double.")

    print("\n  Are the site's heights true for real tiles with 5 m edges?")
    eq_h = math.sqrt(SIDE ** 2 - (SIDE / 2) ** 2)
    tall_h = math.sqrt(10 ** 2 - (SIDE / 2) ** 2)
    print(f"    equal-sided triangle, 5 m edges: height {eq_h:.2f} m, area {0.5 * SIDE * eq_h:.2f} "
          f"(site: height 4, area {show(AREA['ST'])})")
    print(f"    tall triangle, 5 m base and 10 m long edges: height {tall_h:.2f} m, "
          f"area {0.5 * SIDE * tall_h:.2f} (site: height 10, area {show(AREA['BT'])})")
    print("    The site's heights are rounded story numbers. That is fine, but the tiles")
    print("    will not measure exactly what the page says.")

    print("\n  Perimeter: no Xylophora source asks for one. For the record:")
    print(f"    square {4 * SIDE} m. Every triangle has a slanted side that needs a square root")
    print(f"    (MT {2 * SIDE + SIDE * math.sqrt(2):.2f} m, "
          f"BT {BASE + 2 * math.hypot(BT_HEIGHT, BASE / 2):.2f} m, "
          f"ST {BASE + 2 * math.hypot(ST_HEIGHT, BASE / 2):.2f} m). Far above Grade 3.")

    print("\n  Two sample buildings (my examples, to show the arithmetic):")
    for label, counts in (("3 squares, 1 big, 2 medium, 1 small", {"S": 3, "BT": 1, "MT": 2, "ST": 1}),
                          ("2 squares, 0 big, 3 medium, 2 small", {"S": 2, "BT": 0, "MT": 3, "ST": 2})):
        parts = " + ".join(f"{n} x {show(AREA[k])}" for k, n in counts.items() if n)
        print(f"    {label}: {parts} = {show(building_area(counts))} square metres")

    blanks_shapes = 4
    blanks_per_building = 4 + 4 + 1      # four counts, four subtotals, one total
    print(f"\n  Calculation sheet: {blanks_shapes} shape areas + 4 buildings x "
          f"{blanks_per_building} blanks = {blanks_shapes + 4 * blanks_per_building} blanks.")
    print("  Every area blank is labelled 'meters'. Area is measured in square metres.")
    print("  Two count blanks carry 'meters' by mistake (Solar Factory big triangles,")
    print("  Food Store small triangles); one area blank has no unit (Solar Factory,")
    print("  total area of big triangles).\n")


# ---------------------------------------------------------------- Part B
def random_design(rng, even_mt=False):
    mt = rng.randint(0, 4)
    if even_mt:
        mt = rng.choice([0, 2, 4])
    return {"S": rng.randint(1, 6), "BT": rng.randint(0, 2), "MT": mt, "ST": rng.randint(0, 3)}


def part_b(n=10_000):
    print(f"PART B - {n:,} random students, 4 buildings each")
    print("  (a building = 1-6 squares, 0-2 big, 0-4 medium, 0-3 small triangles)")

    # 1. the original numbers
    rng = random.Random(2026)
    decimal_students = 0
    biggest = 0
    for _ in range(n):
        totals = [building_area(random_design(rng)) for _ in range(4)]
        decimal_students += any(t.denominator != 1 for t in totals)
        biggest = max(biggest, max(totals))
    print(f"  ORIGINAL numbers: {decimal_students:,} of {n:,} students "
          f"({100 * decimal_students / n:.0f}%) meet a decimal total in at least one building.")
    print(f"  Largest building total seen: {show(biggest)} square metres.")

    # 2. PROPOSED rule: medium triangles are used in pairs (two make one square,
    #    which is the fact the site already gives). Areas are GIVEN to the
    #    student, not worked out: S 25, BT 25 ("covers the same as a square"),
    #    pair of MT 25, ST 10. The student types four counts, then one total.
    #    The code checks the total against the counts the student typed.
    bad = 0
    biggest = 0
    for seed in range(n):
        rng = random.Random(seed)
        for _ in range(4):
            d = random_design(rng, even_mt=True)
            total = building_area(d)
            whole_number_way = 25 * d["S"] + 25 * d["BT"] + 25 * (d["MT"] // 2) + 10 * d["ST"]
            ok = total.denominator == 1 and total == whole_number_way
            ok &= total % 5 == 0 and 25 <= total <= 1000
            biggest = max(biggest, total)
            bad += not ok
    print(f"  PROPOSED rule (medium triangles in pairs, areas given): "
          f"{4 * n - bad:,} of {4 * n:,} buildings give a whole number.")
    print(f"  Largest total: {show(biggest)}. Every total is a multiple of 5.")
    print("  Numbers typed per building: 4 counts + 1 total = 5. That is over the")
    print("  3-number limit, so it needs two answers (counts, then total).")

    # 3. a second option: change the scale so half a square is a whole number
    print("  OTHER OPTION: an even side makes half a square whole:")
    for side in (2, 4, 6, 10):
        sq = side * side
        assert sq % 2 == 0
        print(f"    side {side:>2} m: square {sq:>3}, medium triangle {sq // 2:>2} square metres")
    print("  (This changes Marc's 5 m. His choice.)")
    print("  What code cannot check: that the typed counts match the real building.")
    print("  That needs the photo or the teacher.")


if __name__ == "__main__":
    part_a()
    part_b()
