#!/usr/bin/env python3
"""4-2 Ammo Count: check the balancing rule, then test a per-student rule.

Run:  python3 -I checks/4-2_check.py
Standard library only. Written for the 2026-11-16 quest review (station bays 4-5).

What the sources give  [Source]
  - "4-2 not done" doc: 5 colours. 3 odd: blue, yellow, red. 2 even: green, white.
    Extras in the box: blue, red, green.
    Rule: an odd count with an extra available -> add one.
          an odd count with no extra -> remove one.
  - "Things to Prepare - 1st Five" sheet: the same, but the second even colour is
    black, and it says "1 extra of each of these colors in the box - blue red green".
  - "4-2 Ammo Count Bar Graph" sheet: Blue, Yellow, Green, Black, Red, all set to 2
    (a placeholder the student overwrites).
  - Student site: "Make them even by adding or removing one counter." No extras rule.
  NO SOURCE GIVES THE ACTUAL COUNTS. The numbers in PART A below are examples only.

PART A  The rule itself, on example counts.
PART B  [Proposal] per-student counts, 10,000 seeds.
PART C  The cheaper option: same bags for everyone, only the spares vary.
"""
import random
from itertools import product

COLOURS = ["blue", "yellow", "red", "green", "black"]   # "white" in the older doc


def balance(counts, spares):
    """Marc's rule from '4-2 not done'. counts: {colour: n}. spares: set of colours
    that have one extra counter in the box. Returns the final counts."""
    final = {}
    for colour, n in counts.items():
        if n % 2 == 0:
            final[colour] = n            # already even: leave it, even if a spare exists
        elif colour in spares:
            final[colour] = n + 1        # odd, spare in the box: add one
        else:
            final[colour] = n - 1        # odd, no spare: remove one
    return final


def part_a():
    print("PART A - the rule on EXAMPLE counts (the sources give no counts)")
    example = {"blue": 7, "yellow": 9, "red": 5, "green": 8, "black": 6}
    spares = {"blue", "red", "green"}
    final = balance(example, spares)
    for c in COLOURS:
        note = "spare in box" if c in spares else "no spare"
        print("    %-6s %2d -> %2d   (%s)" % (c, example[c], final[c], note))
    assert final == {"blue": 8, "yellow": 8, "red": 6, "green": 8, "black": 6}
    assert all(v % 2 == 0 for v in final.values())
    print("  Pattern for Marc's set-up: blue +1, red +1, yellow -1, green and black unchanged.")
    print("  Green's spare is a distractor: green is already even.")


# ---------------------------------------------------------------- PART B
# [Proposal] The world gives each student their own "ammo order". The student counts
# that many counters of each colour out of a shared class tub (hands-on), then makes
# every count even with Marc's rule, and types the new counts.
#   - 5 colours, as in the source.
#   - Each count is 3 to 11, so a final count is 2 to 12 (Grade 3 counting, small tub).
#   - Exactly 3 colours are odd and 2 are even, as in the source.
#   - Spares: 2 of the 3 odd colours and 1 of the 2 even colours, as in the source
#     (blue, red odd with a spare; yellow odd without; green even with a spare).
#   - Which colours play which part is chosen by the seed.
LOW, HIGH = 3, 11


def generate(seed):
    rng = random.Random(seed)
    colours = COLOURS[:]
    rng.shuffle(colours)
    odd_cols, even_cols = colours[:3], colours[3:]
    counts = {}
    for c in odd_cols:
        counts[c] = rng.choice([n for n in range(LOW, HIGH + 1) if n % 2 == 1])
    for c in even_cols:
        counts[c] = rng.choice([n for n in range(LOW, HIGH + 1) if n % 2 == 0])
    spares = set(rng.sample(odd_cols, 2)) | {rng.choice(even_cols)}
    return counts, spares


def part_b(seeds=10000):
    answers = set()
    lo, hi, biggest_bag = 99, 0, 0
    for seed in range(seeds):
        counts, spares = generate(seed)
        assert set(counts) == set(COLOURS)
        assert all(LOW <= n <= HIGH for n in counts.values())
        assert sum(n % 2 for n in counts.values()) == 3, "need exactly 3 odd colours"
        assert len(spares) == 3
        final = balance(counts, spares)
        assert all(v % 2 == 0 for v in final.values()), "seed %d: a count is still odd" % seed
        assert all(v >= 2 for v in final.values()), "seed %d: a colour was emptied" % seed
        changes = [final[c] - counts[c] for c in COLOURS]
        assert sorted(changes) == [-1, 0, 0, 1, 1], "seed %d: not the +1,+1,-1,0,0 pattern" % seed
        # a spare is only ever used where one exists
        for c in COLOURS:
            if final[c] == counts[c] + 1:
                assert c in spares
        lo = min(lo, min(final.values()))
        hi = max(hi, max(final.values()))
        biggest_bag = max(biggest_bag, sum(counts.values()) + len(spares))
        answers.add(tuple(final[c] for c in COLOURS))
    print("PART B - per-student rule [Proposal]")
    print("  %d seeds passed. Final counts range %d to %d. Distinct answers seen: %d."
          % (seeds, lo, hi, len(answers)))
    print("  Most counters one student takes from the tub (bag + spares): %d." % biggest_bag)
    print("  Typing: 5 final counts. One colour per answer keeps it to 1 number each.")


# ---------------------------------------------------------------- PART C
def part_c():
    """Same physical bag for everyone; only which colours have a spare changes.
    Shows how little this varies: the answer depends only on the 3 odd colours."""
    bag = {"blue": 7, "yellow": 9, "red": 5, "green": 8, "black": 6}   # example counts
    seen = set()
    for bits in product([0, 1], repeat=5):
        spares = {c for c, b in zip(COLOURS, bits) if b}
        final = balance(bag, spares)
        assert all(v % 2 == 0 for v in final.values())
        seen.add(tuple(final[c] for c in COLOURS))
    print("PART C - same bag, different spares: only %d different answers exist." % len(seen))
    assert len(seen) == 8


if __name__ == "__main__":
    part_a()
    part_b()
    part_c()
    print("\nALL CHECKS PASSED")
