#!/usr/bin/env python3
"""Zephyron Task 3 - Alien Supply Missions. Recomputation and number-rule test.

Standard library only. Run:  python3 checks/zephyron_t3_check.py

The task: on "final task - deliver 3 places.pdf", chart a safe path from the
start (green flag) to each of three outposts (white X), avoiding mountains
and forests, and write the path down as coordinate points.

WHAT IS SOURCE AND WHAT IS NOT
[Source]   The grid: 17 columns (1-17, left to right) and 12 rows (1-12, bottom
           to top). The numbers label the SQUARES, not the lines.
[Source]   Start flag and three X marks. Positions measured from the PDF
           (Drive id 1CFVA0Vwu3lkWKGX_YyrpQZhjADfpnZ1a) rendered at 300 dpi.
[Reviewer] The TERRAIN table below. Marc's material has no terrain table and no
           answer key. This is one adult's reading of the picture, square by
           square. Marc must confirm or correct it before any code uses it.
           The source has no route lengths or totals to recompute.

Terrain codes
  .  clear            h  tan hills or cliffs (not grey mountains; read as clear)
  f  some forest      F  mostly forest
  m  some mountain    M  mostly mountain
  W  mostly water
"""
import random
from collections import deque

COLS, ROWS = 17, 12

# Row 12 (top) first, row 1 (bottom) last. Each string is columns 1..17.
TERRAIN_ROWS_TOP_DOWN = [
    "WWWWWW.WWWW...ff.",   # row 12
    ".WWW.fFfWWW.h.fF.",   # row 11
    "....fFf.WWWWhhFfh",   # row 10
    "f...ffF...WWfhMfM",   # row 9
    "....Ff..h.WWFmM.m",   # row 8
    "....fmhhh.WfFfmFF",   # row 7
    "hhh.hmh....FF.fFF",   # row 6
    "hhhhhhm.fF....ffF",   # row 5
    "hhhhmMMmFf....fFM",   # row 4
    ".h.hmMMmFf.fFffFM",   # row 3
    "..hhhmMMF..fffFMM",   # row 2
    ".FfmMMMMf..F.fFMM",   # row 1
]

START = (4, 6)                                   # green flag, beside Künkapää
OUTPOSTS = [(2, 2), (14, 8), (13, 1)]            # the three white X marks

# Vertical and horizontal grid lines, px at 300 dpi, and the marks' centres.
V_LINES = [264, 560, 862, 1144, 1439, 1742, 2024, 2318, 2621, 2902, 3198, 3500, 3782, 4077, 4380, 4662]
H_LINES = [236, 532, 833, 1129, 1418, 1713, 2002, 2298, 2586, 2882, 3170, 3465]
MARKS_PX = {"start flag": (1017, 1882), "X west": (446, 3032), "X north-east": (3899, 1270), "X south-east": (3651, 3281)}


def cell_of(px, py):
    col = 1 + sum(1 for v in V_LINES if px > v)
    row = 12 - sum(1 for h in H_LINES if py > h)
    return (col, row)


def terrain(col, row):
    return TERRAIN_ROWS_TOP_DOWN[12 - row][col - 1]


def passable(cell, reading):
    t = terrain(*cell)
    if reading == "lenient":          # only squares that are mostly forest/mountain/water block
        return t not in "FMW"
    if reading == "strict":           # any forest or mountain in the square blocks; so does water
        return t in ".h"
    if reading == "strict+boat":      # as strict, but water may be crossed (the task never bans it)
        return t in ".hW"
    if reading == "hills count":      # lenient, but tan hills are read as mountains
        return t not in "FMWh"
    raise ValueError(reading)


def bfs(start, goal, reading, diagonal=False):
    steps = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    if diagonal:
        steps += [(1, 1), (1, -1), (-1, 1), (-1, -1)]
    prev = {start: None}
    q = deque([start])
    while q:
        cur = q.popleft()
        if cur == goal:
            path = []
            while cur is not None:
                path.append(cur)
                cur = prev[cur]
            return path[::-1]
        for dx, dy in steps:
            nxt = (cur[0] + dx, cur[1] + dy)
            if not (1 <= nxt[0] <= COLS and 1 <= nxt[1] <= ROWS) or nxt in prev:
                continue
            if nxt != goal and not passable(nxt, reading):   # the outpost square itself is always enterable
                continue
            prev[nxt] = cur
            q.append(nxt)
    return None


def part1():
    assert len(TERRAIN_ROWS_TOP_DOWN) == ROWS and all(len(r) == COLS for r in TERRAIN_ROWS_TOP_DOWN)
    print("PART 1  Coordinate facts (every coordinate question in the task, with its answer)")
    for name, (x, y) in MARKS_PX.items():
        print("  %-13s at pixel (%d, %d) -> square %s" % (name, x, y, cell_of(x, y)))
    assert cell_of(*MARKS_PX["start flag"]) == START
    assert sorted(cell_of(*MARKS_PX[k]) for k in MARKS_PX if k != "start flag") == sorted(OUTPOSTS)
    counts = {}
    for r in TERRAIN_ROWS_TOP_DOWN:
        for ch in r:
            counts[ch] = counts.get(ch, 0) + 1
    print("  squares: %d in all; by terrain code %s" % (COLS * ROWS, dict(sorted(counts.items()))))
    print("  terrain under the marks: start %r; outposts %s"
          % (terrain(*START), {o: terrain(*o) for o in OUTPOSTS}))


def part2():
    print("\nPART 2  Is there a safe route? Shortest route in squares moved (reviewer's terrain reading)")
    readings = ["lenient", "hills count", "strict", "strict+boat"]
    result = {}
    for reading in readings:
        print("  reading: %s" % reading)
        for o in OUTPOSTS:
            p4 = bfs(START, o, reading)
            p8 = bfs(START, o, reading, diagonal=True)
            result[(reading, o)] = p4
            print("    to %-8s side-steps only: %-13s with diagonals: %s"
                  % (o, ("%d moves" % (len(p4) - 1)) if p4 else "NO ROUTE",
                     ("%d moves" % (len(p8) - 1)) if p8 else "NO ROUTE"))
    print("  example lenient routes (side-steps only):")
    total = 0
    for o in OUTPOSTS:
        p = result[("lenient", o)]
        total += len(p) - 1
        print("    to %s: %s" % (o, " ".join("(%d,%d)" % c for c in p)))
    print("  total moves for the three lenient routes: %d. Numbers to type: %d (two per square)."
          % (total, 2 * sum(len(result[("lenient", o)]) for o in OUTPOSTS)))

    def turning_points(path):
        """The squares where the route changes direction, plus the end (straight-line legs, as the task asks)."""
        pts = []
        for a, b, c in zip(path, path[1:], path[2:]):
            if (b[0] - a[0], b[1] - a[1]) != (c[0] - b[0], c[1] - b[1]):
                pts.append(b)
        return pts + [path[-1]]

    tp_total = 0
    for o in OUTPOSTS:
        tp = turning_points(result[("lenient", o)])
        tp_total += len(tp)
        print("    straight-line legs to %s: go to %s" % (o, " then ".join("(%d,%d)" % c for c in tp)))
    print("  written as turning points only: %d points = %d numbers." % (tp_total, 2 * tp_total))
    assert all(result[("lenient", o)] for o in OUTPOSTS)
    unreachable_strict = [o for o in OUTPOSTS if result[("strict", o)] is None]
    print("  RESULT: under the strict reading these outposts cannot be reached: %s" % (unreachable_strict or "none"))
    print("  RESULT: so 'right or wrong' depends on how a part-forest square is judged. The source does not say.")


def rule(seed):
    """[Proposal] per-student layout on the same grid.

    Start and three outposts are drawn from clear squares ('.' or 'h').
    Accept the draw only if each outpost has a lenient route of 3 to 12 moves
    from the start. The student types one square per answer (two numbers).
    """
    rng = random.Random(seed)
    clear = [(c, r) for c in range(1, COLS + 1) for r in range(1, ROWS + 1) if terrain(c, r) in ".h"]
    for attempt in range(1, 201):
        start = rng.choice(clear)
        outs = rng.sample([c for c in clear if c != start], 3)
        paths = [bfs(start, o, "lenient") for o in outs]
        if all(p and 3 <= len(p) - 1 <= 12 for p in paths):
            return {"start": start, "outposts": outs, "paths": paths, "attempts": attempt}
    return None


def part3():
    print("\nPART 3  Rule [Proposal]: per-student start and outposts, 10,000 seeds")
    fails, max_attempts, longest, layouts = 0, 0, 0, set()
    for seed in range(10000):
        p = rule(seed)
        if p is None:
            fails += 1
            continue
        max_attempts = max(max_attempts, p["attempts"])
        for path in p["paths"]:
            longest = max(longest, len(path) - 1)
            for a, b in zip(path, path[1:]):                       # every step is one square sideways or up/down
                assert abs(a[0] - b[0]) + abs(a[1] - b[1]) == 1
            assert all(passable(c, "lenient") for c in path[1:-1])  # never through a blocked square
        layouts.add((p["start"], tuple(p["outposts"])))
    print("  failures: %d of 10,000. Most redraws needed: %d. Longest route: %d moves. Different layouts: %d."
          % (fails, max_attempts, longest, len(layouts)))
    ex = rule(11)
    print("  example seed 11: start %s, outposts %s, route lengths %s"
          % (ex["start"], ex["outposts"], [len(p) - 1 for p in ex["paths"]]))
    assert fails == 0


if __name__ == "__main__":
    part1()
    part2()
    part3()
    print("\nALL CHECKS PASSED")
