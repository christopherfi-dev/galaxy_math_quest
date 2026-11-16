#!/usr/bin/env python3
"""
Xylophora Task 3 - Roofing Challenge (2x2 Xylotree leaves).

Part A  recomputes how many leaves cover the Task 1 tiles, two ways.
Part B  tests a PROPOSED per-student number rule on 10,000 seeds.

Sources (Marc's site and Drive, read 2026-11-16):
  - site page 'Task 3: Roofing Challenge' and Drive doc 'intro':
    "the leaves of Xylotrees, shaped like 2x2 squares"
    "Work out how many leaves are needed to cover each building's roof completely."
    "Determine the quantity available"
  - saved ChatGPT chat: "square leaves (2x2 meters)"; Marc: "They need to
    calculate how much area of leaves are available from another grid."
  - NOT FOUND anywhere: the leaf grid, the "Leaf Area Calculation Sheets", the
    "Roof Design Sheets", and a rule for which part of a building is its roof.
    The Drive folder 'quest 2/Task 3' is empty.

Tile areas come from xylophora_t1_check.py (triangle base 5 m is an assumption).

Standard library only. Run:  python3 xylophora_t3_check.py
"""
import math
import random
from fractions import Fraction

LEAF_SIDE = 2                      # metres [Source: chat says metres; the site gives no unit]
LEAF_AREA = LEAF_SIDE * LEAF_SIDE  # 4 square metres
TILE_AREA = {"S": Fraction(25), "BT": Fraction(25), "MT": Fraction(25, 2), "ST": Fraction(10)}


def whole_leaves_to_cover_square(side, leaf=LEAF_SIDE):
    """Fewest uncut leaves, edges straight, that cover a side x side square.
    Lower bound: put a marker in the middle of every 2 x 2 step. No single leaf
    (2 m wide, edge excluded) can hide two markers, so you need one leaf each.
    Upper bound: a grid of ceil(side/leaf) x ceil(side/leaf) leaves does it."""
    k = math.ceil(side / leaf)
    markers = [(0.5 + leaf * i, 0.5 + leaf * j) for i in range(k) for j in range(k)]
    assert all(m[0] < side and m[1] < side for m in markers)
    for a in markers:
        for b in markers:
            if a != b:
                assert max(abs(a[0] - b[0]), abs(a[1] - b[1])) >= leaf
    return k * k


def part_a():
    print("PART A - leaves needed for the Task 1 tiles")
    print(f"  One leaf = {LEAF_SIDE} x {LEAF_SIDE} = {LEAF_AREA} square metres.")
    print("  Method 1, divide the area by 4 (leaves may be cut):")
    for k, a in TILE_AREA.items():
        q = a / LEAF_AREA
        print(f"    {k:2}: {float(a):>5g} / 4 = {float(q):g}  -> {math.ceil(q)} leaves, with waste"
              f"{'' if q.denominator == 1 else '   (not a whole number)'}")
    never_whole = all((a / LEAF_AREA).denominator != 1 for a in TILE_AREA.values())
    print(f"  No single tile gives a whole number of leaves: {never_whole}")
    n9 = whole_leaves_to_cover_square(5)
    print("  Method 2, whole leaves only (no cutting):")
    print(f"    a 5 x 5 square needs {n9} leaves (3 rows of 3; they hang over the edge).")
    print(f"  So one 5 m square has two defensible answers: {math.ceil(Fraction(25, 4))} or {n9}.")
    print("  5 is odd and the leaf is 2 wide, so leaves can never fit a square exactly.")
    print("  Triangles cannot be covered exactly by squares at all.")
    sample = 3 * 25 + 25 + 2 * Fraction(25, 2) + 10
    print(f"  Sample building from Task 1 ({float(sample):g} square metres): "
          f"{float(sample)} / 4 = {float(sample / 4):g} -> {math.ceil(sample / 4)} leaves by area.")
    print("  Maths needed: division with a remainder or a decimal, then rounding up.")
    print("  Above Grade 3 as written, and the page never says which part is the roof.\n")


# ---------------------------------------------------------------- Part B
# PROPOSED rule (not Marc's): each student gets four roofs that are rectangles
# with EVEN sides (4, 6, 8 or 10 m), so 2 x 2 leaves fit with no cutting.
#   leaves for a roof = (width / 2) x (length / 2)
# Both methods then agree, and every product is inside the 5 x 5 facts.

def make_roofs(seed):
    rng = random.Random(seed)
    return [(rng.choice([4, 6, 8, 10]), rng.choice([4, 6, 8, 10])) for _ in range(4)]


def part_b(n=10_000):
    print(f"PART B - proposed number rule, {n:,} seeds")
    bad = 0
    most = 0
    for seed in range(n):
        for w, l in make_roofs(seed):
            by_area = Fraction(w * l, LEAF_AREA)
            by_rows = (w // LEAF_SIDE) * (l // LEAF_SIDE)
            ok = by_area.denominator == 1 and by_area == by_rows   # one answer, both ways
            ok &= w % 2 == 0 and l % 2 == 0
            ok &= 4 <= by_rows <= 25                               # 2x2 up to 5x5
            most = max(most, by_rows)
            bad += not ok
    print(f"  {4 * n - bad:,} of {4 * n:,} roofs have exactly one answer, the same by both methods.")
    print(f"  Most leaves on one roof: {most}. Typed per answer: 1 number.")
    print("  Example (seed 1):", ", ".join(f"{w}x{l} m -> {(w // 2) * (l // 2)} leaves"
                                          for w, l in make_roofs(1)))


if __name__ == "__main__":
    part_a()
    part_b()
