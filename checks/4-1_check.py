#!/usr/bin/env python3
"""4-1 Weapons Coding: recompute both source versions, then test a per-student rule.

Run:  python3 -I checks/4-1_check.py
Standard library only. Written for the 2026-11-16 quest review (station bays 4-5).

PART A  [Source]   The two card sets in Marc's Drive, typed in exactly as written.
PART B  [Proposal] A rule that deals each student their own 10 cards. Tested on 10,000 seeds.
"""
import random
from math import comb

# ---------------------------------------------------------------- PART A
# Doc "4-1 not done" (id 1yVwJHFYrFXyb8UabIuLsG8Qtl7Q3th3AcbJb3om7Xxs), 2023-08-03
NOT_DONE = {
    1: [3, 5, 7, 9, 11],
    2: [2, 4, 6, 8, 10],
    3: [5, 10, 15, 20, 25],
    4: [1, 3, 5, 7, 2],
    5: [9, 7, 5, 3, 1],
    6: [2, 3, 5, 7, 11],
    7: [10, 8, 6, 4, 2],
    8: [3, 3, 3, 3, 3],
    9: [4, 8, 12, 16, 20],
    10: [1, 2, 3, 4, 5],
}
NOT_DONE_KEY = [1, 5, 6, 8, 10]   # the doc's note: "Only Cards 1, 5, 6, 8, and 10"

# Doc "Card Codes" (id 1FgWsgQtBYs0bQJPfEEfT8x4v6dfz7SiO6cu4VpMKqEI), 2023-08-18.
# This is the doc the student site links to.
CARD_CODES = {
    1: [3, 5, 7, 9, 11],
    2: [2, 4, 6, 8, 10],
    3: [5, 10, 15, 20, 25],
    4: [1, 3, 5, 7, 21],
    5: [9, 7, 5, 3, 1],
    6: [2, 3, 5, 7, 11],
    7: [10, 8, 6, 4, 2],
    8: [3, 3, 3, 3, 3],
    9: [1, 23, 43, 45, 55],
    10: [4, 8, 12, 16, 20],
}
# The Google Form on the site ("Weapons Coding - Activate the Weapons System")
# accepts only text that matches this pattern:
FORM_ANSWER = "1,4,5,8,9"


def all_odd(seq):
    return all(n % 2 == 1 for n in seq)


def kind(seq):
    if all_odd(seq):
        return "all odd"
    if all(n % 2 == 0 for n in seq):
        return "all even"
    return "mixed (even numbers: %s)" % ", ".join(str(n) for n in seq if n % 2 == 0)


def solve(cards):
    """Back numbers of the all-odd cards, smallest first."""
    return sorted(back for back, seq in cards.items() if all_odd(seq))


def part_a():
    print("PART A - the two source versions")
    for name, cards in (("4-1 not done", NOT_DONE), ("Card Codes", CARD_CODES)):
        print("\n  %s" % name)
        for back, seq in cards.items():
            print("    card %2d  %-22s %s" % (back, seq, kind(seq)))
        code = solve(cards)
        print("    all-odd cards: %s  -> final code %s" % (code, ",".join(map(str, code))))

    nd = solve(NOT_DONE)
    cc = solve(CARD_CODES)
    print("\n  '4-1 not done' key says   :", NOT_DONE_KEY)
    print("  '4-1 not done' recomputed :", nd)
    wrong = [c for c in NOT_DONE_KEY if c not in nd]
    print("  cards the key wrongly calls all odd:", wrong)
    for c in wrong:
        print("     card %d = %s -> %s" % (c, NOT_DONE[c], kind(NOT_DONE[c])))
    print("  the task asks for 5 all-odd cards; this set has", len(nd))
    print("  'Card Codes' recomputed   :", cc, "(count %d)" % len(cc))
    print("  site form accepts         :", FORM_ANSWER)

    assert nd == [1, 5, 8]
    assert wrong == [6, 10]
    assert cc == [1, 4, 5, 8, 9]
    assert ",".join(map(str, cc)) == FORM_ANSWER
    print("  RESULT: 'Card Codes' matches the form. '4-1 not done' has only 3 all-odd cards.")


# ---------------------------------------------------------------- PART B
# [Proposal] Per-student rule. It keeps Marc's design: 10 cards, 5 numbers on each,
# back numbers 1-10, keep the all-odd cards, give their back numbers smallest first.
#   - K of the 10 cards are all odd. Marc's K is 5. K = 3 fits a 3-number typing limit.
#   - Which cards are all odd is chosen by the student's seed.
#   - Every other card has at least one even number.
#   - At least 2 of the other cards are "one even number among odd ones" traps,
#     like Marc's "1, 3, 5, 7, 2", so a child must read the whole card.
#   - Numbers are 1 to 99.
LOW, HIGH = 1, 99
ODDS = [n for n in range(LOW, HIGH + 1) if n % 2 == 1]
EVENS = [n for n in range(LOW, HIGH + 1) if n % 2 == 0]


def make_all_odd(rng):
    style = rng.choice(["count up", "count down", "same", "scattered"])
    if style == "count up":
        start = rng.choice([n for n in ODDS if n + 8 <= HIGH])
        return [start + 2 * i for i in range(5)]
    if style == "count down":
        start = rng.choice([n for n in ODDS if n - 8 >= LOW])
        return [start - 2 * i for i in range(5)]
    if style == "same":
        return [rng.choice(ODDS[:5])] * 5          # like Marc's 3, 3, 3, 3, 3
    return sorted(rng.sample(ODDS, 5))             # like Marc's 1, 23, 43, 45, 55


def make_not_all_odd(rng, style):
    if style == "trap":                            # four odd, one even
        seq = sorted(rng.sample(ODDS, 4))
        seq.insert(rng.randrange(5), rng.choice(EVENS))
        return seq
    if style == "all even":
        start = rng.choice([n for n in EVENS if n + 8 <= HIGH])
        seq = [start + 2 * i for i in range(5)]
        return seq if rng.random() < 0.5 else seq[::-1]
    if style == "times table":                     # like 5, 10, 15, 20, 25
        step = rng.choice([3, 5, 7, 9])
        return [step * i for i in range(1, 6)]
    if style == "counting":                        # like 1, 2, 3, 4, 5
        start = rng.randint(LOW, HIGH - 4)
        return [start + i for i in range(5)]
    raise ValueError(style)


def generate(seed, k):
    rng = random.Random(seed)
    backs = list(range(1, 11))
    odd_backs = set(rng.sample(backs, k))
    other = [b for b in backs if b not in odd_backs]
    styles = ["trap", "trap"] + [rng.choice(["trap", "all even", "times table", "counting"])
                                 for _ in range(len(other) - 2)]
    rng.shuffle(styles)
    cards = {}
    for b in backs:
        if b in odd_backs:
            cards[b] = make_all_odd(rng)
        else:
            cards[b] = make_not_all_odd(rng, styles.pop())
    return cards


def part_b(k, seeds=10000):
    answers = set()
    traps_min = 99
    for seed in range(seeds):
        cards = generate(seed, k)
        assert sorted(cards) == list(range(1, 11)), "back numbers must be 1-10"
        for seq in cards.values():
            assert len(seq) == 5
            assert all(LOW <= n <= HIGH for n in seq), "number out of range"
        ans = solve(cards)
        assert len(ans) == k, "seed %d: wrong number of all-odd cards" % seed
        assert ans == sorted(ans)
        # every other card must contain an even number (true by definition of
        # all_odd, checked again here so a generator bug cannot hide)
        for b, seq in cards.items():
            if b not in ans:
                assert any(n % 2 == 0 for n in seq)
        traps = sum(1 for b, seq in cards.items()
                    if b not in ans and sum(n % 2 == 0 for n in seq) == 1)
        traps_min = min(traps_min, traps)
        assert traps >= 2, "seed %d: fewer than 2 one-even traps" % seed
        answers.add(tuple(ans))
    print("  K=%d: %d seeds passed. Distinct answers seen: %d of %d possible. "
          "Fewest one-even trap cards in any deal: %d"
          % (k, seeds, len(answers), comb(10, k), traps_min))


if __name__ == "__main__":
    part_a()
    print("\nPART B - per-student rule [Proposal], 10,000 seeds each")
    part_b(5)   # Marc's size: 5 numbers typed
    part_b(3)   # fits a 3-number typing limit
    print("\nALL CHECKS PASSED")
