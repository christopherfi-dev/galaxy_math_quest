"""2-2 Coordinate Plotting: recompute every version, then test a per-student rule.

Run:  python3 checks/2-2_check.py
Standard library only.

Part A  [Source]   The printed grid (Drive sheet "2-2 coordinate plotting").
                   Both Google Forms accept the answer (5,5).
Part B  [Source]   The drafts in the Drive doc "2-2 - Coordinate plotting not done".
Part C  [Proposal] A per-student rule: a new path on the same 6 x 6 grid, 10,000 seeds.

A cell is (column, row), counted from the bottom left, as on the printed sheet.
"""
import random
import re

SIZE = 6
FORM_ANSWER = (5, 5)   # [Source] answer check inside both "2-2 - Coordinate Plotting" forms

# ---------------------------------------------------------------- Part A: printed grid
# [Source] cell -> instruction text, copied exactly (two cells have a stray extra bracket).
SHEET = {
    (1, 1): "Go to (1+2, 1+0)",   # marked "Start"
    (3, 1): "Go to (3+0, 1+3)",
    (2, 2): "Go to (2+3, 5+0)",
    (3, 2): "Go to (3+0, 4+2)",
    (4, 2): "Go to (4-1, 1+1)",
    (1, 3): "Go to (1+0, 4+1)",
    (6, 3): "Go to (2-1, 2+1)",
    (3, 4): "Go to (3+2, 4+0)",
    (5, 4): "Go to (5+0, 4+2)",
    (1, 5): "Go to (2+2, 4+1)",
    (4, 5): "Go to (4-1, 3+0))",
    (2, 6): "Go to (2+0, 4-2)",
    (3, 6): "Go to (5+1, 3+3))",
    (5, 6): "Go to (5-3, 6+0)",
    (6, 6): "Go to (4+2, 6-3)",
}
START = (1, 1)

EXPR = re.compile(r"\(\s*(\d+)\s*([+-])\s*(\d+)\s*,\s*(\d+)\s*([+-])\s*(\d+)\s*\)")


def target(text):
    a, op1, b, c, op2, d = EXPR.search(text).groups()
    x = int(a) + int(b) if op1 == "+" else int(a) - int(b)
    y = int(c) + int(d) if op2 == "+" else int(c) - int(d)
    return (x, y)


def follow(grid, start):
    """Follow instructions from a cell until a cell with no instruction. Returns the list of cells."""
    path, cell = [start], start
    while cell in grid:
        cell = target(grid[cell])
        if cell in path:
            return path + [cell], "LOOP"
        path.append(cell)
    return path, "ok"


def part_a():
    print("PART A  [Source] printed grid")
    bad = 0
    for cell, text in sorted(SHEET.items()):
        t = target(text)
        if not (1 <= t[0] <= SIZE and 1 <= t[1] <= SIZE):
            print("  off the grid:", cell, text, "->", t)
            bad += 1
    path, state = follow(SHEET, START)
    print("  true path:", " -> ".join(map(str, path)), "|", len(path) - 1, "moves |", state)
    print("  ends at", path[-1], "| form answer", FORM_ANSWER, "| match:", path[-1] == FORM_ANSWER)
    off_path = [c for c in SHEET if c not in path]
    print("  cells with an instruction that are NOT on the true path:", len(off_path))
    ends = {}
    for c in sorted(off_path):
        p, st = follow(SHEET, c)
        ends.setdefault((p[-1], st), []).append(c)
    for (end, st), cells in ends.items():
        print(f"    starting from {cells} a lost student ends at {end} ({st})")
    longest = max((follow(SHEET, c)[0] for c in off_path), key=len)
    print("  the decoy chain:", " -> ".join(map(str, longest)))
    brackets = [c for c, t in SHEET.items() if t.count("(") != t.count(")")]
    print("  cells with an unbalanced bracket (typo):", sorted(brackets))
    sums = [int(n) for t in SHEET.values() for n in EXPR.search(t).groups() if n.isdigit()]
    print("  largest number in any sum:", max(sums), "| largest result:", max(max(target(t)) for t in SHEET.values()))
    return bad + (path[-1] != FORM_ANSWER)


# ---------------------------------------------------------------- Part B: drafts
DRAFTS = {  # [Source] (written sum -> written result), copied exactly
    "Path 1 (start (4, 1))": [("(4-1, 1+1)", (3, 2)), ("(3+0, 2+2)", (3, 4)), ("(3+1, 4+0)", (4, 4)),
                              ("(4+0, 4-2)", (4, 2)), ("(4+0, 2-1)", (4, 1)), ("(4-2, 1+0)", (2, 1))],
    "Path 2 (start (1, 3))": [("(1+2, 3+0)", (3, 3)), ("(3-2, 3+0)", (1, 3)), ("(1+1, 3-1)", (2, 2)),
                              ("(2+2, 2+0)", (4, 2)), ("(4-1, 2+1)", (3, 3)), ("(3+1, 3-2)", (4, 1))],
    "The 7 sentences":       [("(1+2, 1+0)", (3, 1)), ("(3+0, 1+3)", (3, 4)), ("(3+2, 4+0)", (5, 4)),
                              ("(5+0, 4+2)", (5, 6)), ("(5-3, 6+0)", (2, 6)), ("(2+0, 6+3)", (2, 9)),
                              ("(2+3, 9+0)", (5, 9))],
    "Simplified example":    [("(1+1, 2+2)", (2, 4)), ("(2+4, 4+1)", (6, 5)), ("(6-3, 5-2)", (3, 3))],
}


def part_b():
    print("\nPART B  [Source] drafts in '2-2 - Coordinate plotting not done'")
    wrong = 0
    for name, steps in DRAFTS.items():
        notes = []
        m = re.search(r"start \((\d), (\d)\)", name)
        cells = [(int(m.group(1)), int(m.group(2)))] if m else []
        for text, written in steps:
            got = target(text)
            cells.append(got)
            if got != written:
                wrong += 1
                notes.append(f"{text} is {got}, the doc says {written}")
            if max(got) > SIZE or min(got) < 1:
                notes.append(f"{text} = {got} is off a 6 x 6 grid")
        revisits = len(cells) - len(set(cells))
        if revisits:
            notes.append(f"comes back to a cell it already used, {revisits} time(s),"
                         " so it cannot be printed one instruction per cell")
        print(f"  {name}: {len(steps)} steps, ends {cells[-1]}; " + ("; ".join(notes) if notes else "arithmetic correct"))
    print("  arithmetic errors in the drafts:", wrong)
    return wrong


# ---------------------------------------------------------------- Part C: the proposed rule
def write_sum(rng, value):
    """Write a coordinate (1..6) as a small sum a+b or a-b. a is 1..6, b is 0..3."""
    choices = []
    for b in range(0, 4):
        if 1 <= value - b <= SIZE:
            choices.append((value - b, "+", b))
        if 1 <= value + b <= SIZE:
            choices.append((value + b, "-", b))
    return rng.choice(choices)


def instruction(rng, cell):
    a, o1, b = write_sum(rng, cell[0])
    c, o2, d = write_sum(rng, cell[1])
    return f"Go to ({a}{o1}{b}, {c}{o2}{d})"


def gen(rng):
    """[Proposal] One student's grid.
    - 6 x 6, start at (1,1), as on Marc's sheet.
    - A true path of 6 to 8 moves through different cells. The last cell has no instruction.
    - A decoy chain of 5 to 8 other cells that ends on a different empty cell.
    - Every instruction is a pair of sums with numbers 0 to 6 and results 1 to 6."""
    while True:
        cells = [(x, y) for x in range(1, SIZE + 1) for y in range(1, SIZE + 1) if (x, y) != START]
        rng.shuffle(cells)
        n_true, n_decoy = rng.randint(6, 8), rng.randint(5, 8)
        true_path = [START] + cells[:n_true]
        decoy = cells[n_true:n_true + n_decoy + 1]      # the last one is the decoy's empty end
        grid = {}
        for a, b in zip(true_path, true_path[1:]):
            grid[a] = instruction(rng, b)
        for a, b in zip(decoy, decoy[1:]):
            grid[a] = instruction(rng, b)
        text = " ".join(grid[c] for c in true_path[:-1])
        if "+" in text and "-" in text and "+0" not in grid[START][-9:]:
            return grid, true_path, decoy


def check_answer(typed, answer):
    """Accept '(5,5)', '(5, 5)', '5,5', '5 5'. Marc's form only took the exact text '(5,5)'."""
    nums = re.findall(r"\d+", typed)
    return len(nums) == 2 and (int(nums[0]), int(nums[1])) == answer


def part_c(seeds=10000):
    print("\nPART C  [Proposal] rule: new path on the 6 x 6 grid")
    bad = 0
    ends, lengths, distinct = {}, {}, set()
    for seed in range(seeds):
        rng = random.Random(seed)
        grid, true_path, decoy = gen(rng)
        path, state = follow(grid, START)
        if state != "ok" or path != true_path:             # SOLVABLE: one path, no loop
            bad += 1
        if len(set(path)) != len(path) or not 6 <= len(path) - 1 <= 8:
            bad += 1
        if path[-1] in grid:                               # the end cell must be empty
            bad += 1
        for cell, text in grid.items():
            t = target(text)
            nums = [int(n) for n in re.findall(r"\d+", text)]
            if not (1 <= t[0] <= SIZE and 1 <= t[1] <= SIZE) or max(nums) > SIZE:
                bad += 1
        dpath, dstate = follow(grid, decoy[0])
        if dstate != "ok" or dpath[-1] == path[-1] or set(dpath) & set(path):
            bad += 1                                       # decoys never touch the true path
        a = path[-1]
        if not (check_answer(f"({a[0]},{a[1]})", a) and check_answer(f"({a[0]}, {a[1]})", a)
                and check_answer(f"{a[0]} {a[1]}", a)):
            bad += 1                                       # spacing and brackets must not matter
        wrong = decoy[-1]
        if check_answer(f"({wrong[0]},{wrong[1]})", a):
            bad += 1                                       # the decoy's end is rejected
        ends[a] = ends.get(a, 0) + 1
        lengths[len(path) - 1] = lengths.get(len(path) - 1, 0) + 1
        distinct.add(tuple(sorted(grid.items())))
    print(f"  seeds tested: {seeds}   rule failures: {bad}")
    print(f"  moves on the true path: {dict(sorted(lengths.items()))}")
    print(f"  different end cells used: {len(ends)} of 35; most common end cell is the answer for"
          f" {max(ends.values()) / seeds:.1%} of students")
    print(f"  different grids among {seeds} students: {len(distinct)}")
    # does Marc's sheet fit the rule's shape?
    path, _ = follow(SHEET, START)
    print(f"  Marc's sheet: {len(path) - 1} moves, {len(SHEET) - (len(path) - 1)} decoy cells (rule allows 6-8 and 5-8)")
    return bad


if __name__ == "__main__":
    a = part_a()
    b = part_b()
    c = part_c()
    print("\nRESULT:", "PASS" if a == 0 and c == 0 else "FAIL", f"(draft arithmetic errors: {b})")
