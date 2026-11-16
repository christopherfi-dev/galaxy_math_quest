"""3-3 Shield Calibration: list every multiplication and division fact in every version,
then test a per-student rule.

Run:  python3 checks/3-3_check.py
Standard library only.

Part A  [Source]   Facts in each version, flagged if outside the 10 x 10 tables or if the
                   division leaves a remainder. Three different totals appear: 80, 85 and 60.
Part B  [Proposal] A per-student rule, tested on 10,000 seeds.
"""
import random


def flag(kind, a, b):
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
    ("site page 3-3 + doc '3.2.1 - Power Distribution'", "80 total units over the pie's 5 sections", "/", 80, 5),
    ("sheet '3-3.Shield Calibration' chart title", "'Power Distribution - 85 TOTAL UNITS', 5 sections", "/", 85, 5),
    ("sheet '3-3.Shield Calibration' data + doc '3-3 Shield Calibration'", "12 in each of 5 sections", "x", 12, 5),
    ("draft '3-3 not done' Activity 1", "6 sections, 3 units each", "x", 3, 6),
    ("draft '3-3 not done' Activity 2", "18 units over 9 sections", "/", 18, 9),
    ("planning doc 'first 5 quests'", "5 sections, 2 units each", "x", 2, 5),
]


def part_a():
    print("PART A  [Source] every multiplication and division fact")
    flagged = 0
    for where, what, kind, a, b in VERSIONS:
        text, problems = flag(kind, a, b)
        flagged += bool(problems)
        print(f"  {text:24s} {'FLAG: ' + ', '.join(problems) if problems else 'ok':24s} {where}: {what}")
    print("  the same sheet says 85 total units in its title and holds 12 x 5 =", 12 * 5, "in its cells")
    print("  site 3-3 (80 / 5 = 16) is the same sum as Part 2 of the 3-2 answers form")
    print("  skip counting 80 into 5 sections one counter at a time:", 80, "counters per student")
    print(f"  flagged facts: {flagged} of {len(VERSIONS)}")
    return flagged


SECTION_CHOICES = (2, 5, 10)      # strand doc, Numbers Quest 3 and 4, Level 2: 2s, 5s and 10s
MAX_COUNTERS = 50                 # [Proposal] what one student can lay out on a mat


def gen(rng):
    """[Proposal] One student's shield.
    Step 1 (repeated addition / skip counting): the shield has `sections` sections (2, 5 or 10).
            Each needs `each` units (2-10). Total = sections x each, at most 50.
    Step 2 (sharing): a new supply `supply` is spread evenly over `sections2` sections (2, 5 or 10,
            a different number of sections from step 1). Each gets supply / sections2, 2-10, no remainder."""
    while True:
        sections = rng.choice(SECTION_CHOICES)
        each = rng.randint(2, 10)
        sections2 = rng.choice([s for s in SECTION_CHOICES if s != sections])
        each2 = rng.randint(2, 10)
        if sections * each <= MAX_COUNTERS and sections2 * each2 <= MAX_COUNTERS:
            return sections, each, sections2, sections2 * each2


def part_b(seeds=10000):
    print("\nPART B  [Proposal] rule: 2, 5 or 10 sections; 2-10 units each; totals of 50 or less")
    bad, distinct, biggest = 0, set(), 0
    for seed in range(seeds):
        sections, each, sections2, supply = gen(random.Random(seed))
        _, p1 = flag("x", each, sections)
        _, p2 = flag("/", supply, sections2)
        if p1 or p2:
            bad += 1                                   # inside 10 x 10, no remainder
        if sections == sections2:
            bad += 1                                   # step 2 is not step 1 run backwards
        if max(sections * each, supply) > MAX_COUNTERS:
            bad += 1
        skip = list(range(sections2, supply + 1, sections2))
        if len(skip) != supply // sections2 or skip[-1] != supply:
            bad += 1                                   # skip counting lands exactly on the supply
        biggest = max(biggest, sections * each, supply)
        distinct.add((sections, each, sections2, supply))
    print(f"  seeds tested: {seeds}   rule failures: {bad}")
    print(f"  biggest total: {biggest}; different versions: {len(distinct)}")
    print("  answers typed: total power (1 number), units per section (1 number)")
    return bad


if __name__ == "__main__":
    flagged = part_a()
    bad = part_b()
    print("\nRESULT:", "PASS" if bad == 0 else "FAIL", f"(rule). Source facts flagged: {flagged}")
