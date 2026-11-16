"""1-2 Alien Species: count the printed alien grid, then test two per-student rules.

Run:  python3 checks/1-2_check.py
Standard library only.

Part A  [Source]   The alien grid in the Drive doc "1-2 alien graph" (10 x 10 pictures).
                   Read from the image twice: by eye, and by colour measurement of each cell.
                   Both readings gave the grid below. No answer key was found in Marc's files.
Part B  [Proposal] Rule 1: keep the printed grid; each student counts only a band of rows
                   or columns chosen by the seed.
Part C  [Proposal] Rule 2: print several new grids; counts are generated per version.

The five species have no names in the sources. The letters are mine:
  C = green, one eye     G = green, round, two antennae     R = dark blue, robot-like
  T = light blue, thin   S = white, big eyes
"""
import random
from collections import Counter

GRID = """GGCCGRTCTG
SRTCRCGTTG
RCGCRRTGCG
RRCRGCTCGR
GCRCCCRRGC
GGTCTTGGCS
CGRCGCCRRT
RTGTCRSCTC
RCTCRCRGSS
STCRTGTCRS""".split()                     # row 1 is the top row of the printed sheet
SPECIES = "CGRTS"


def counts(cells):
    c = Counter(cells)
    return tuple(c.get(s, 0) for s in SPECIES)


def part_a():
    print("PART A  [Source] the printed grid")
    assert len(GRID) == 10 and all(len(r) == 10 for r in GRID)
    total = counts("".join(GRID))
    print("  cells:", sum(total), "| species:", len([t for t in total if t]))
    for s, n in zip(SPECIES, total):
        print(f"    {s}: {n}")
    print("  most common:", SPECIES[total.index(max(total))], "| least common:", SPECIES[total.index(min(total))])
    print("  the two green species together:", total[0] + total[1], "| the two blue species together:", total[2] + total[3])
    print("  tallest bar is", max(total), "-> a graph on the 10-row table needs a scale (2s or 5s), or 30 rows")
    return total


# ---------------------------------------------------------------- Part B: rule 1, bands
def band(orientation, start, length):
    """Cells in rows (or columns) start..start+length-1, numbered from 1."""
    if orientation == "rows":
        return "".join(GRID[r] for r in range(start - 1, start - 1 + length))
    return "".join(row[c] for row in GRID for c in range(start - 1, start - 1 + length))


def band_ok(v):
    """All five species appear, and one species is clearly the most common."""
    return 0 not in v and sum(1 for x in v if x == max(v)) == 1


def gen_band(rng, strict=True):
    """[Proposal] Each student counts a band of 4 to 7 whole rows or whole columns.
    strict=True also throws away bands where a species is missing or the tallest bar is tied.
    (The first draft of this rule had no such filter and failed the seed test.)"""
    while True:
        orientation = rng.choice(["rows", "columns"])
        length = rng.randint(4, 7)
        start = rng.randint(1, 10 - length + 1)
        if not strict or band_ok(counts(band(orientation, start, length))):
            return orientation, start, length


def part_b(seeds=10000):
    print("\nPART B  [Proposal] rule 1: same printed sheet, each student counts a band of 4-7 rows or columns")
    variants = {(o, s, l): counts(band(o, s, l))
                for o in ("rows", "columns") for l in range(4, 8) for s in range(1, 10 - l + 2)}
    vectors = list(variants.values())
    print("  possible bands:", len(variants), "| different answer sets:", len(set(vectors)))
    good = {k: v for k, v in variants.items() if band_ok(v)}
    print("  bands that pass the filter (all five species, one clear tallest bar):", len(good),
          "| different answer sets among them:", len(set(good.values())))
    for strict in (False, True):
        bad = 0
        seen = Counter()
        for seed in range(seeds):
            rng = random.Random(seed)
            o, s, l = gen_band(rng, strict)
            v = counts(band(o, s, l))
            if sum(v) != 10 * l:                   # every cell in the band is counted once
                bad += 1
            if max(v) > 30 or not band_ok(v):
                bad += 1                           # all species present, one clear tallest bar
            if v != variants[(o, s, l)]:
                bad += 1
            seen[(o, s, l)] += 1
        print(f"  {'with' if strict else 'first draft, without'} the filter: seeds tested {seeds},"
              f" rule failures {bad}")
    ties_max = sum(1 for v in vectors if sum(1 for x in v if x == max(v)) != 1)
    zero = sum(1 for v in vectors if 0 in v)
    print(f"  bands with a tie for the most common species: {ties_max}; bands where a species is missing: {zero}")
    print(f"  cells to count: {min(10 * l for (_, _, l) in variants)} to {max(10 * l for (_, _, l) in variants)}"
          f" (the whole sheet is 100)")
    share = max(seen.values()) / seeds
    print(f"  with {len(good)} bands, two students share a band about 1 time in {len(good)};"
          f" most used band: {share:.1%} of students")
    return bad


# ---------------------------------------------------------------- Part C: rule 2, new grids
def gen_grid_counts(rng):
    """[Proposal] Counts for a newly printed 10 x 10 grid.
    Five species, 100 aliens, each count 5 to 35, all five counts different."""
    while True:
        cuts = sorted(rng.sample(range(1, 100), 4))
        c = [b - a for a, b in zip([0] + cuts, cuts + [100])]
        if all(5 <= x <= 35 for x in c) and len(set(c)) == 5:
            rng.shuffle(c)
            return tuple(c)


def part_c(seeds=10000):
    print("\nPART C  [Proposal] rule 2: new grid versions, 100 aliens, five counts of 5-35, all different")
    bad, distinct = 0, set()
    for seed in range(seeds):
        c = gen_grid_counts(random.Random(seed))
        if sum(c) != 100 or len(set(c)) != 5 or not all(5 <= x <= 35 for x in c):
            bad += 1
        distinct.add(c)
    src = counts("".join(GRID))
    print(f"  seeds tested: {seeds}   rule failures: {bad}   different count sets: {len(distinct)}")
    print(f"  Marc's grid under this rule: {src} -> passes: "
          f"{sum(src) == 100 and len(set(src)) == 5 and all(5 <= x <= 35 for x in src)}")
    return bad


if __name__ == "__main__":
    total = part_a()
    bad = part_b() + part_c()
    print("\nRESULT:", "PASS" if bad == 0 and sum(total) == 100 else "FAIL")
