#!/usr/bin/env python3
"""
Xylophora Task 2 - Efficient Use of Alien Resources (the alien skin map).

Part A  records what the printed Resource Map really holds and recomputes the
        totals a student could reach.
Part B  tests a PROPOSED per-student number rule on 10,000 seeds.

Sources (Marc's site and Drive, read 2026-11-16):
  - site page 'Task 2: Efficient Use of Alien Resources' and Drive doc 'intro'
  - 'alien map.pdf' (title inside the file: "alien skin map", A3, made in Canva
    on 2023-12-11): a picture of the creature with a white grid on top.
    It has NO numbers, NO scale and NO outline of the skin.
  - saved ChatGPT chat, Marc's plan: "I give them a grid that shows the total
    amount [of] resource available. They need to calculate how much area there
    is. ... They decided how to maximize the resource available by calculating
    how many of each buildings they can make."
  - NOT FOUND anywhere: the "Calculation Sheets" and "Building Plan Sheets" the
    page lists. The Drive folder 'quest 2/Task 2' is empty.

How the grid was counted: the PDF was rendered at 150 dpi (2480 x 1755 px) and
white lines were found by scanning for rows and columns that are mostly white.
The line positions are stored below so this script needs no image library.

Standard library only. Run:  python3 xylophora_t2_check.py
"""
import random
from itertools import product

# x positions of the vertical white lines, in pixels at 150 dpi
V_LINES = [0, 73, 145, 218, 290, 362, 435, 507, 510, 583, 655, 728, 800, 872, 945,
           1017, 1020, 1093, 1165, 1237, 1310, 1382, 1455, 1527, 1530, 1603, 1675,
           1747, 1820, 1892, 1965, 2037, 2040, 2113, 2185, 2257, 2330, 2402, 2475]
# y positions of the horizontal white lines
H_LINES = [0, 73, 145, 217, 290, 363, 436, 508, 581, 653, 726, 799, 872, 944, 1016,
           1090, 1163, 1235, 1307, 1380, 1453, 1526, 1598, 1671, 1743]
PAGE_W, PAGE_H = 2480, 1755


def cells(lines, min_gap=40):
    """Count gaps that are a full cell wide. Pairs of lines 3 px apart are the
    seams where the grid picture was tiled; they are not cells."""
    return sum(1 for a, b in zip(lines, lines[1:]) if b - a >= min_gap)


def part_a():
    print("PART A - the printed Resource Map")
    cols, rows = cells(V_LINES), cells(H_LINES)
    seams = sum(1 for a, b in zip(V_LINES, V_LINES[1:]) if b - a < 40)
    cell_px = (V_LINES[-1] - V_LINES[0]) / cols
    print(f"  Grid: {cols} columns x {rows} rows = {cols * rows} squares.")
    print(f"  The grid is {seams + 1} copies of a 7-column block side by side; the last copy is cut")
    print(f"  to 6 columns. The seams print as double lines.")
    print(f"  One square is about {cell_px / 150 * 25.4:.1f} mm wide on the A3 sheet.")
    print(f"  Left over at the bottom edge: a strip {PAGE_H - H_LINES[-1]} px high (not a full row).")
    total = cols * rows
    print(f"  {cols} x {rows} is a 2-digit x 2-digit product. Above Grade 3.")
    print("  The map prints no scale. Three readings a class could take:")
    for label, per in (("1 square = 1 square metre", 1),
                       ("1 square = one 2 x 2 m leaf", 4),
                       ("1 square = one 5 x 5 m tile", 25)):
        print(f"    {label:30} -> whole sheet {total * per:>6,} square metres")
    print("  The skin does not fill the sheet: two corners show farmland. The skin has")
    print("  no drawn edge, so 'the total area available' has no single right answer.")
    print("  How many buildings fit (sample building of 135 square metres from Task 1):")
    for per in (1, 4, 25):
        t = total * per
        print(f"    {t:>6,} / 135 = {t // 135} remainder {t % 135}")
    print("  That is division of a 3- to 5-digit number by a 3-digit number, then a")
    print("  choice across four building types. Above Grade 3, and many answers are right.\n")


# ---------------------------------------------------------------- Part B
# PROPOSED rule (not Marc's). Everything is counted in SQUARES (one square =
# one square tile), so the numbers stay inside the 10 x 10 facts.
#   skin   : an L-shape made of two rectangles, each side 5 to 10 squares.
#            The student splits it into two rectangles (the IXL MM12 skill the
#            page already names) and adds.
#   costs  : House, Food Store, Hospital, Solar Factory: four different sizes
#            from 3 to 12 squares. In the world these would be the student's
#            own Task 1 buildings; here they are random.
#   plan   : how many of each. Conditions: at least one of each; the plan fits;
#            what is left is too small for the student's smallest building.

def make_task(seed):
    rng = random.Random(seed)
    r1 = (rng.randint(5, 10), rng.randint(5, 10))
    r2 = (rng.randint(5, 10), rng.randint(5, 10))
    costs = rng.sample(range(3, 13), 4)
    return r1, r2, costs


def plan_ok(plan, costs, total):
    """The check the server would run on a typed plan."""
    used = sum(p * c for p, c in zip(plan, costs))
    return all(p >= 1 for p in plan) and used <= total and total - used < min(costs)


def count_good_plans(costs, total):
    """How many plans pass plan_ok. Counted by walking the plans with early
    stopping (a plain 4-deep loop over every count is too slow)."""
    low = min(costs)
    good = 0
    a, b, c, d = costs
    for na in range(1, total // a + 1):
        left_a = total - na * a
        for nb in range(1, left_a // b + 1):
            left_b = left_a - nb * b
            for nc in range(1, left_b // c + 1):
                left_c = left_b - nc * c
                # nd must leave less than the smallest building: one or two values
                for nd in range(max(1, (left_c - low) // d), left_c // d + 1):
                    if 0 <= left_c - nd * d < low:
                        good += 1
    return good


def part_b(n=10_000):
    print(f"PART B - proposed number rule, {n:,} seeds")
    bad = 0
    plan_counts = []
    totals = []
    for seed in range(n):
        r1, r2, costs = make_task(seed)
        total = r1[0] * r1[1] + r2[0] * r2[1]
        ok = all(5 <= s <= 10 for s in r1 + r2)            # inside the 10 x 10 facts
        ok &= 50 <= total <= 200
        ok &= len(set(costs)) == 4 and sum(costs) <= total  # one of each always fits
        good = count_good_plans(costs, total)
        ok &= good >= 1                                    # solvable
        if seed < 25:                                      # cross-check the fast count
            limit = [total // c for c in costs]
            slow = sum(plan_ok(p, costs, total)
                       for p in product(*(range(1, m + 1) for m in limit)))
            assert slow == good, (seed, slow, good)
        plan_counts.append(good)
        totals.append(total)
        bad += not ok
    plan_counts.sort()
    print(f"  {n - bad:,} of {n:,} seeds are solvable and stay inside the 10 x 10 facts.")
    print(f"  Skin totals: {min(totals)} to {max(totals)} squares.")
    print(f"  Right plans per student: fewest {plan_counts[0]}, middle {plan_counts[n // 2]}, "
          f"most {plan_counts[-1]}.")
    print("  So this is a 'conditions' checkpoint, not a 'one answer' checkpoint.")
    r1, r2, costs = make_task(5)
    print(f"  Example (seed 5): rectangles {r1[0]}x{r1[1]} and {r2[0]}x{r2[1]} = "
          f"{r1[0] * r1[1] + r2[0] * r2[1]} squares; building sizes {costs}.")
    print("  Typed: the total (1 number), then the plan (4 numbers). Four numbers is over")
    print("  the 3-number limit; it would need two answers or a higher limit.")


if __name__ == "__main__":
    part_a()
    part_b()
