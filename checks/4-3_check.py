#!/usr/bin/env python3
"""4-3 Target Practice: what the maths allows, and a per-student target rule.

Run:  python3 -I checks/4-3_check.py
Standard library only. Written for the 2026-11-16 quest review (station bays 4-5).

The task  [Source: site page 4-3, doc "4-3 not done"]
  A wall has the numbers 1 to 9. The student throws a ball, writes down each number
  hit, and keeps a running total. Goal: "an even number between 32 and 40".

The sources do not say:
  - whether 32 and 40 themselves count,
  - what happens if the total goes past 40,
  - how many throws are allowed.
PART A works out what each reading means. It tests nothing physical.
PART B  [Proposal] gives each student their own target and tests it on 10,000 seeds.
The throwing itself cannot be checked by code. See the review file.
"""
import random

TARGETS = range(1, 10)


def goal_totals(low, high, parity, inclusive=True):
    lo, hi = (low, high) if inclusive else (low + 1, high - 1)
    return [t for t in range(lo, hi + 1) if t % 2 == parity]


def min_hits(total):
    """Fewest hits (each 1-9) that can add up to total."""
    return -(-total // 9)


def part_a():
    print("PART A - Marc's numbers: targets 1-9, even total, 32 to 40")
    inc = goal_totals(32, 40, 0, True)
    exc = goal_totals(32, 40, 0, False)
    print("  winning totals if 32 and 40 count      :", inc)
    print("  winning totals if 32 and 40 do not count:", exc)
    assert inc == [32, 34, 36, 38, 40] and exc == [34, 36, 38]
    print("  fewest hits to reach 32: %d   (3 hits reach at most %d)" % (min_hits(32), 3 * 9))
    assert min_hits(32) == 4 and 3 * 9 < 32
    print("  most hits: no limit is stated (40 hits of '1' reach 40)")

    # Parity facts the video script states. Check them for every pair of targets.
    for a in TARGETS:
        for b in TARGETS:
            assert ((a + b) % 2 == 0) == (a % 2 == b % 2)
    print("  parity: even+even and odd+odd are even; odd+even is odd. Checked for all 81 pairs.")

    # If going past 40 loses ("bust"), how many of the 9 targets are still safe?
    print("\n  If going past 40 is a bust, safe targets by running total (32 and 40 count):")
    print("    total  finishes-now  keeps-going  bust")
    for total in range(27, 40):
        finish = [h for h in TARGETS if total + h in inc]
        alive = [h for h in TARGETS if total + h <= 40 and total + h not in inc]
        bust = [h for h in TARGETS if total + h > 40]
        print("    %5d  %-13s %-12s %d of 9" % (total, finish, alive, len(bust)))
    # A student is never mathematically stuck: from any total below 40 some target helps.
    for total in range(0, 40):
        assert any(total + h <= 40 for h in TARGETS)
    assert [h for h in TARGETS if 39 + h in inc] == [1]
    assert [h for h in TARGETS if 38 + h in inc] == [2]
    print("  From 39, only the '1' target works. From 38, only the '2' target finishes.")
    print("  Under a bust rule the end of the game is mostly about aim, not about parity.")


# ---------------------------------------------------------------- PART B
# [Proposal] The world gives each student a target: "an EVEN total from 32 to 40" or
# "an ODD total from 27 to 35", and so on. The student throws, then types the numbers
# hit. Code can check the typed list. It cannot check that the throws happened.
#   - parity: even or odd, chosen by seed
#   - low end: 20 to 40, with the same parity as the goal, so both ends can win
#   - window: low to low + 8, as in Marc's 32 to 40
def generate(seed):
    rng = random.Random(seed)
    parity = rng.choice([0, 1])
    low = rng.choice([n for n in range(20, 41) if n % 2 == parity])
    return parity, low, low + 8


def check_answer(hits, parity, low, high):
    """The conditions checkpoint: what code can verify from a typed list of hits."""
    if not hits or any(h not in TARGETS for h in hits):
        return False
    total = sum(hits)
    return low <= total <= high and total % 2 == parity


def part_b(seeds=10000):
    seen = set()
    fewest, most = 99, 0
    for seed in range(seeds):
        parity, low, high = generate(seed)
        wins = goal_totals(low, high, parity, True)
        assert len(wins) == 5, "seed %d: should have 5 winning totals" % seed
        assert wins[0] == low and wins[-1] == high
        # solvable: build a list of hits for every winning total and check it
        for total in wins:
            hits = [9] * (total // 9) + ([total % 9] if total % 9 else [])
            assert check_answer(hits, parity, low, high), (seed, total, hits)
            fewest = min(fewest, len(hits))
            most = max(most, len(hits))
        # a wrong-parity total in the window must be refused
        bad = low + 1
        assert not check_answer([9] * (bad // 9) + ([bad % 9] if bad % 9 else []), parity, low, high)
        seen.add((parity, low))
    print("\nPART B - per-student target [Proposal]")
    print("  %d seeds passed. Distinct targets seen: %d. Fewest hits needed for a win: %d to %d."
          % (seeds, len(seen), fewest, most))
    print("  Typing: the list of hits is 3 to 5 numbers at best, more with low hits.")
    print("  Typing only the final total is 1 number, but then code checks almost nothing.")


if __name__ == "__main__":
    part_a()
    part_b()
    print("\nALL CHECKS PASSED")
