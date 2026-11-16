"""3-1 Asteroid Field: list every reading of the printed sheet, then test a per-student rule.

Run:  python3 checks/3-1_check.py
Standard library only.

Part A  [Source]   The printed sheet "3-1 Asteroid Field - Sheet1.pdf": a 4 x 4 table.
                   Rows and columns are both labelled 1, 2, 5, 10. Nine cells hold a rock picture.
                   No file says how to read it, and no file shows the "three ways through".
                   So every reading is computed here. None is marked as the right one.
Part B  [Source]   The example grid in the Drive doc "3-1 not done".
Part C  [Proposal] A per-student rule with one clear answer, tested on 10,000 seeds.
"""
import random

LABELS = [1, 2, 5, 10]
# [Source] 1 = a rock picture, 0 = empty. Rows top to bottom are labelled 1, 2, 5, 10.
PRINTED = [
    [0, 1, 0, 1],   # row labelled 1
    [1, 0, 1, 0],   # row labelled 2
    [1, 1, 1, 1],   # row labelled 5
    [0, 0, 1, 0],   # row labelled 10
]
DRAFT = [           # [Source] "3-1 not done": A = asteroid, 0 = empty
    "A0AA",
    "AA00",
    "0AA0",
    "A00A",
]
PATHS = 3           # [Source] site: "Three ways through the rocks"


def in_tables(a, b):
    return 1 <= a <= 10 and 1 <= b <= 10


def part_a():
    print("PART A  [Source] printed sheet")
    pictures = sum(map(sum, PRINTED))
    print("  reading 1, count the pictures:", pictures)
    print("  reading 2, 'Rows x Columns = Total rocks' (site): 4 x 4 =", 4 * 4,
          "-> not equal to the", pictures, "pictures. The site's rule does not fit the sheet.")
    products, facts = [], []
    for r, row in enumerate(PRINTED):
        for c, v in enumerate(row):
            if v:
                products.append(LABELS[r] * LABELS[c])
                facts.append(f"{LABELS[r]}x{LABELS[c]}={LABELS[r] * LABELS[c]}")
    print("  reading 3, each rock cell is worth row label x column label (planning doc's labels 1, 2, 5, 10):")
    print("    facts:", ", ".join(facts))
    print("    all inside 10 x 10:", all(in_tables(LABELS[r], LABELS[c]) for r in range(4) for c in range(4)),
          "| total:", " + ".join(map(str, products)), "=", sum(products))
    print("  'divide total asteroids by number of potential pathways' (planning doc), 3 paths:")
    for name, total in (("reading 1", pictures), ("reading 2", 16), ("reading 3", sum(products))):
        q, rem = divmod(total, PATHS)
        print(f"    {name}: {total} / {PATHS} = {q}" + (f" remainder {rem}" if rem else " exactly"))
    print("  path guesses (the sheet shows no paths; the sheet has 4 rows and 4 columns, not 3):")
    cols1 = [sum(PRINTED[r][c] for r in range(4)) for c in range(4)]
    rows1 = [sum(row) for row in PRINTED]
    cols3 = [sum(LABELS[r] * LABELS[c] * PRINTED[r][c] for r in range(4)) for c in range(4)]
    rows3 = [sum(LABELS[r] * LABELS[c] * PRINTED[r][c] for c in range(4)) for r in range(4)]
    print("    pictures per column:", cols1, "| per row:", rows1)
    print("    reading-3 rocks per column:", cols3, "| per row:", rows3)
    print("    with reading 1 the fewest-rocks column is a tie:", cols1.count(min(cols1)), "columns have", min(cols1))
    return pictures


def part_b():
    print("\nPART B  [Source] example grid in '3-1 not done'")
    n = sum(row.count("A") for row in DRAFT)
    rows_with = sum(1 for row in DRAFT if "A" in row)
    cols_with = sum(1 for c in range(4) if any(row[c] == "A" for row in DRAFT))
    print("  asteroids counted:", n)
    print("  the doc's rule, rows x columns containing asteroids:", rows_with, "x", cols_with, "=", rows_with * cols_with,
          "-> not equal to", n)


# ---------------------------------------------------------------- Part C: the proposed rule
def gen(rng):
    """[Proposal] One student's asteroid field.
    - A full block of rocks: rows 2-10, columns 2-10, so rows x columns really is the total.
    - Three paths. Each path's rock count is rocks-per-step x steps, both 2-10.
      One path has clearly the fewest rocks (at least 2 fewer than the next).
    - Lanes: the total is also shared equally among 2, 5 or 10 lanes with nothing left over,
      and the share is 10 or less. Fields where no such lane count exists are thrown away."""
    while True:
        rows, cols = rng.randint(2, 10), rng.randint(2, 10)
        total = rows * cols
        lanes = [k for k in (2, 5, 10) if total % k == 0 and total // k <= 10]
        if not lanes:
            continue
        paths = [(rng.randint(2, 10), rng.randint(2, 10)) for _ in range(PATHS)]
        rocks = sorted(a * b for a, b in paths)
        if rocks[1] - rocks[0] < 2:
            continue
        return rows, cols, rng.choice(lanes), paths


def part_c(seeds=10000):
    print("\nPART C  [Proposal] rule: full block of rocks, three paths, equal lanes")
    bad, distinct, biggest = 0, set(), 0
    for seed in range(seeds):
        rows, cols, lanes, paths = gen(random.Random(seed))
        total = rows * cols
        if not in_tables(rows, cols) or total > 100:
            bad += 1
        if total % lanes or not in_tables(lanes, total // lanes):
            bad += 1                                   # division: no remainder, inside the tables
        rocks = [a * b for a, b in paths]
        if not all(in_tables(a, b) for a, b in paths):
            bad += 1
        if sorted(rocks)[0] == sorted(rocks)[1]:
            bad += 1                                   # SOLVABLE: one safest path
        biggest = max(biggest, total, max(rocks))
        distinct.add((rows, cols, lanes, tuple(paths)))
    print(f"  seeds tested: {seeds}   rule failures: {bad}")
    print(f"  biggest number a student meets: {biggest}; different versions among {seeds} students: {len(distinct)}")
    print("  answers typed: total rocks (1 number), rocks per lane (1 number), safest path (1 number or word)")
    return bad


if __name__ == "__main__":
    pictures = part_a()
    part_b()
    bad = part_c()
    print("\nRESULT:", "PASS" if bad == 0 else "FAIL",
          "(the rule passes; the SOURCE task has no single checkable answer)")
