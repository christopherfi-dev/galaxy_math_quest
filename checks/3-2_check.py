"""3-2 Energy Grid: list every multiplication and division fact in every version,
then test a per-student rule.

Run:  python3 checks/3-2_check.py
Standard library only.

Part A  [Source]   Facts in each version, flagged if outside the 10 x 10 tables or if the
                   division leaves a remainder.
Part B  [Proposal] A per-student rule, tested on 10,000 seeds.
"""
import random


def flag(kind, a, b):
    """kind 'x': a x b.  kind '/': a / b.  Returns (text, problems)."""
    problems = []
    if kind == "x":
        text = f"{a} x {b} = {a * b}"
        if not (a <= 10 and b <= 10):
            problems.append("outside 10 x 10")
    else:
        q, rem = divmod(a, b)
        text = f"{a} / {b} = {q}" + (f" remainder {rem}" if rem else "")
        if rem:
            problems.append("remainder")
        if not (b <= 10 and q <= 10):
            problems.append("outside 10 x 10")
    return text, problems


VERSIONS = [  # [Source] (where, what it asks, kind, a, b)
    ("site page 3-2", "each part needs 12 units, 5 parts, add 12 over and over", "x", 12, 5),
    ("form '3.2 Energy Grid Answers' Part 1 (key: 60)", "total shield value", "x", 12, 5),
    ("form '3.2 Energy Grid Answers' Part 2 (key: 16)", "energy for each of 5 sections from 80", "/", 80, 5),
    ("sheet '3-2 - Energy Grid' (linked from the site)", "five sections showing 16, 'TOTAL ENERGY ='", "x", 16, 5),
    ("draft '3-2 not done' Part 1", "6 sections, 5 units each", "x", 5, 6),
    ("draft '3-2 not done' Part 2", "30 units, 5 per section", "/", 30, 5),
    ("draft '3-2 not done' Independent", "8 sections, 4 units each", "x", 4, 8),
    ("draft '3-2 not done' revised Part 2", "30 units, 4 per section (doc: '30/4 = 7.5, round down to 7')", "/", 30, 4),
]


def part_a():
    print("PART A  [Source] every multiplication and division fact")
    flagged = 0
    for where, what, kind, a, b in VERSIONS:
        text, problems = flag(kind, a, b)
        flagged += bool(problems)
        print(f"  {text:28s} {'FLAG: ' + ', '.join(problems) if problems else 'ok':30s} {where}: {what}")
    print("  other arithmetic in the draft: 37 - 32 =", 37 - 32, "| 30 - 28 =", 30 - 28,
          "| 12+12+12+12+12 =", sum([12] * 5))
    print("  key check: form Part 1 = 60 ->", 12 * 5 == 60, "| form Part 2 = 16 ->", 80 // 5 == 16 and 80 % 5 == 0)
    print("  the linked sheet shows 16 in each section; its total is", 16 * 5, "- the form's Part 1 key is 60")
    print(f"  flagged facts: {flagged} of {len(VERSIONS)}")
    return flagged


def gen(rng):
    """[Proposal] One student's energy grid.
    Part 1 (repeated addition): `parts` shield parts need `units` each. parts 3-6, units 2-10.
            Total = parts x units, by adding `units` over and over.
    Part 2 (sharing): `power` units are on hand. Each part still needs `units`.
            How many parts can stay on? power = units x on, with on < parts. No remainder."""
    parts = rng.randint(3, 6)
    units = rng.randint(2, 10)
    on = rng.randint(1, parts - 1)
    return parts, units, units * on, on


def part_b(seeds=10000):
    print("\nPART B  [Proposal] rule: parts 3-6, units 2-10; then share a smaller supply with nothing left over")
    bad, distinct, biggest = 0, set(), 0
    for seed in range(seeds):
        parts, units, power, on = gen(random.Random(seed))
        _, p1 = flag("x", units, parts)
        _, p2 = flag("/", power, units)
        if p1 or p2:
            bad += 1                                   # inside 10 x 10, no remainder
        if not 1 <= on < parts or power // units != on:
            bad += 1                                   # fewer parts than before can stay on
        if sum([units] * parts) != parts * units:
            bad += 1
        biggest = max(biggest, parts * units)
        distinct.add((parts, units, power))
    print(f"  seeds tested: {seeds}   rule failures: {bad}")
    print(f"  biggest total: {biggest}; longest repeated addition: 6 numbers; different versions: {len(distinct)}")
    print("  answers typed: total power (1 number), parts that stay on (1 number)")
    return bad


if __name__ == "__main__":
    flagged = part_a()
    bad = part_b()
    print("\nRESULT:", "PASS" if bad == 0 else "FAIL", f"(rule). Source facts flagged: {flagged}")
