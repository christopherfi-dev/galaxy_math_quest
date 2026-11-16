"""1-1 Alien Artifacts: recompute the source code, then test a per-student bag rule.

Run:  python3 checks/1-1_check.py
Standard library only.

Part A  [Source]   "Things to Prepare - 1st Five": 9 red, 8 blue, 4 green, 9 yellow.
                   The Google Form "1-1 - Engine Core Counters" accepts 9849.
Part B  [Proposal] Bag versions. Two options are tested on 10,000 seeds each:
                     option 1: 4 bag versions shared by the class (handoff section 3, item 4)
                     option 2: one bag per student (24 bags)
"""
import random
from itertools import permutations

ORDER = ("red", "blue", "green", "yellow")          # [Source] "red-blue-green-yellow"
SOURCE = {"red": 9, "blue": 8, "green": 4, "yellow": 9}
FORM_ANSWER = "9849"


def code(bag):
    return "".join(str(bag[c]) for c in ORDER)


def part_a():
    print("PART A  [Source] the one bag every student gets")
    c = code(SOURCE)
    print("  code:", c, "| form accepts:", FORM_ANSWER, "| match:", c == FORM_ANSWER)
    print("  counters in the bag:", sum(SOURCE.values()),
          " (the planning doc and the Engine Core page say the SUM is the code; the sum is not", c + ")")
    same = [p for p in permutations(ORDER) if "".join(str(SOURCE[x]) for x in p) == c]
    print("  colour orders that give the same code:", len(same), "of 24 ->", same)
    print("  so a student who swaps red and yellow still gets in: the code cannot catch that mistake")
    return c == FORM_ANSWER


# ---------------------------------------------------------------- Part B: the proposed rule
LOW, HIGH = 3, 9      # every colour count is one digit, so the code always has 4 digits
CLASS = 24            # [Assumption] class size for the supply numbers


def gen_bags(rng, how_many):
    """[Proposal] A set of bags.
    - Each bag: four DIFFERENT counts from 3 to 9, one per colour.
    - No two bags in the set have the same code.
    - No two bags hold the same four numbers in another order, so reading a
      neighbour's counters in the wrong colour order never opens your own lock."""
    bags, used_codes, used_sets = [], set(), set()
    while len(bags) < how_many:
        counts = rng.sample(range(LOW, HIGH + 1), 4)
        bag = dict(zip(ORDER, counts))
        if code(bag) in used_codes or frozenset(counts) in used_sets:
            continue
        used_codes.add(code(bag))
        used_sets.add(frozenset(counts))
        bags.append(bag)
    return bags


def check_set(bags):
    """Returns the number of rule breaks in one set of bags."""
    bad = 0
    codes = [code(b) for b in bags]
    for b, c in zip(bags, codes):
        if len(c) != 4 or not c.isdigit():
            bad += 1                                  # unambiguous 4-digit code
        if len(set(b.values())) != 4:
            bad += 1                                  # all four counts differ
        if not all(LOW <= v <= HIGH for v in b.values()):
            bad += 1
        if not 18 <= sum(b.values()) <= 30:
            bad += 1                                  # never more counters than Marc's bag (30)
        # any wrong colour order gives a wrong code
        if sum(1 for p in permutations(ORDER) if "".join(str(b[x]) for x in p) == c) != 1:
            bad += 1
    if len(set(codes)) != len(codes):
        bad += 1                                      # every bag has its own code
    if len({frozenset(b.values()) for b in bags}) != len(bags):
        bad += 1
    return bad


def run(option, how_many, seeds=10000):
    bad, most_colour, most_total = 0, 0, 0
    for seed in range(seeds):
        rng = random.Random(seed)
        bags = gen_bags(rng, how_many)
        bad += check_set(bags)
        copies = CLASS // how_many                    # students per bag version
        most_colour = max(most_colour, max(sum(b[c] for b in bags) * copies for c in ORDER))
        most_total = max(most_total, sum(sum(b.values()) for b in bags) * copies)
    share = (CLASS // how_many - 1) / (CLASS - 1)
    print(f"  {option}: {how_many} bags | seeds {seeds} | rule failures {bad}")
    print(f"     chance that a classmate's code also opens your lock: {share:.0%}"
          f"   (today, with one bag for all: 100%)")
    print(f"     counters needed for a class of {CLASS}: at most {most_total} in all,"
          f" at most {most_colour} of one colour")
    return bad


def part_b():
    print("\nPART B  [Proposal] bag versions: four different counts from 3 to 9 in every bag")
    print("  possible bags under the rule:", len(list(permutations(range(LOW, HIGH + 1), 4))),
          "codes;", "35 different sets of four numbers")
    bad = run("option 1", 4)
    bad += run("option 2", CLASS)
    print(f"  Marc's bag under the rule: counts differ? {len(set(SOURCE.values())) == 4}"
          " (red and yellow are both 9, so it would not pass)")
    return bad


if __name__ == "__main__":
    ok = part_a()
    bad = part_b()
    print("\nRESULT:", "PASS" if ok and bad == 0 else "FAIL")
