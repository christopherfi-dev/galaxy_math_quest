#!/usr/bin/env python3
"""5-1 Circuit Connection: recompute the source answers, then test a per-student rule.

Run:  python3 -I checks/5-1_check.py
Standard library only. Written for the 2026-11-16 quest review (station bays 4-5).

PART A  [Source]   The printed board and the three rounds on the site's Google Form.
PART B  [Proposal] Per-student numbers for the board and the three rounds. 10,000 seeds.
"""
import random

ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
TEENS = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
         "seventeen", "eighteen", "nineteen"]
TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]


def digits(n):
    """(hundreds, tens, ones) of a 3-digit number."""
    assert 100 <= n <= 999
    return n // 100, (n // 10) % 10, n % 10


def words(n):
    """432 -> 'four hundred and thirty-two' (the form writes numbers this way)."""
    h, t, o = digits(n)
    out = ONES[h] + " hundred"
    rest = n % 100
    if rest == 0:
        return out
    if rest < 10:
        tail = ONES[rest]
    elif rest < 20:
        tail = TEENS[rest - 10]
    else:
        tail = TENS[t] + ("-" + ONES[o] if o else "")
    return out + " and " + tail


def unwords(text):
    """Independent reader for words(), used to prove the wording is not ambiguous."""
    text = text.replace(" and ", " ").replace("-", " ")
    total = 0
    for w in text.split():
        if w == "hundred":
            total *= 100
        elif w in TEENS:
            total += 10 + TEENS.index(w)
        elif w in TENS and w:
            total += 10 * TENS.index(w)
        else:
            total += ONES.index(w)
    return total


def board_labels(n):
    """The nine labels round the board: each digit as ones, tens and hundreds."""
    return sorted({d * m for d in digits(n) for m in (1, 10, 100)})


def board_answer(n):
    h, t, o = digits(n)
    return [h * 100, t * 10, o]


# ---------------------------------------------------------------- PART A
def part_a():
    print("PART A - source versions")
    # Printed board, doc "Power Module - Print" (linked from the site): number 634,
    # labels read from the page image: 3, 4, 60, 30, 600, 40, 400, 6, 300.
    printed = sorted([3, 4, 60, 30, 600, 40, 400, 6, 300])
    assert printed == board_labels(634), "printed labels are not the 9 expected ones"
    print("  board 634: labels", printed)
    print("  board 634: correct connections", board_answer(634), "sum", sum(board_answer(634)))
    assert board_answer(634) == [600, 30, 4] and sum(board_answer(634)) == 634
    # The planning doc's example: 632 with 6, 60, 600, 3, 300, 30, 2, 200, 20
    assert sorted([6, 60, 600, 3, 300, 30, 2, 200, 20]) == board_labels(632)
    assert board_answer(632) == [600, 30, 2]
    print("  planning example 632: labels and answer [600, 30, 2] are consistent")

    # Form rounds. Accepted answers are the form's own validation strings.
    h, t, o = digits(432)
    r1 = "%d,%d,%d" % (h, t, o)
    print("  round 1: '%s' -> H,T,O = %s   form accepts '4,3,2'" % (words(432), r1))
    assert r1 == "4,3,2"
    h, t, o = digits(678)
    r2 = "%d,%d,%d" % (t, o, h)                    # the form asks Tens, Ones, Hundreds
    print("  round 2: '%s' -> T,O,H = %s   form accepts text containing '7,8,6'" % (words(678), r2))
    assert r2 == "7,8,6"
    h, t, o = digits(123)
    r3 = h + o - t
    print("  round 3: '%s' -> H + O - T = %d + %d - %d = %d   form accepts 2" % (words(123), h, o, t, r3))
    assert r3 == 2
    assert words(432) == "four hundred and thirty-two"
    assert words(678) == "six hundred and seventy-eight"
    assert words(123) == "one hundred and twenty-three"
    print("  RESULT: every source answer is correct.")

    # How often would H + O - T go below zero if the number were picked freely?
    neg = sum(1 for n in range(100, 1000) if digits(n)[0] + digits(n)[2] - digits(n)[1] < 0)
    print("  warning: for %d of the 900 three-digit numbers, H + O - T is negative "
          "(example 190 gives %d)." % (neg, 1 + 0 - 9))


# ---------------------------------------------------------------- PART B
# [Proposal] Each student gets four different 3-digit numbers.
#   board  : three different digits, none zero -> nine different labels, 3 are right
#   round 1: three different digits, none zero; answer H,T,O
#   round 2: three different digits, none zero; answer in a mixed order (not H,T,O)
#   round 3: three different digits, none zero; H + O - T is 0 or more (no negatives)
ORDERS = ["TOH", "OTH", "THO", "OHT", "HOT"]       # every order except H,T,O


def pick(rng, used, ok=lambda n: True):
    while True:
        n = rng.randint(123, 987)
        d = digits(n)
        if 0 in d or len(set(d)) < 3 or n in used or not ok(n):
            continue
        used.add(n)
        return n


def generate(seed):
    rng = random.Random(seed)
    used = set()
    board = pick(rng, used)
    r1 = pick(rng, used)
    r2 = pick(rng, used)
    order = rng.choice(ORDERS)
    r3 = pick(rng, used, lambda n: digits(n)[0] + digits(n)[2] - digits(n)[1] >= 0)
    return board, r1, r2, order, r3


def part_b(seeds=10000):
    seen = set()
    r3_lo, r3_hi = 99, -99
    for seed in range(seeds):
        board, r1, r2, order, r3 = generate(seed)
        assert len({board, r1, r2, r3}) == 4
        # board: nine different labels, exactly three correct, they rebuild the number
        labels = board_labels(board)
        ans = board_answer(board)
        assert len(labels) == 9, "seed %d: labels collide" % seed
        assert all(a in labels for a in ans) and sum(ans) == board
        assert len([x for x in labels if x in ans]) == 3
        # rounds 1 and 2: the typed digits rebuild the number
        h, t, o = digits(r1)
        assert h * 100 + t * 10 + o == r1
        d = dict(zip("HTO", digits(r2)))
        typed = [d[c] for c in order]
        assert typed != list(digits(r2)), "seed %d: round 2 order did not change the answer" % seed
        # round 3: never negative, single step sums stay small
        h, t, o = digits(r3)
        special = h + o - t
        assert special >= 0, "seed %d: negative special connection" % seed
        r3_lo, r3_hi = min(r3_lo, special), max(r3_hi, special)
        # number words read back to the same number
        for n in (r1, r2, r3):
            assert unwords(words(n)) == n, "seed %d: wording of %d is ambiguous" % (seed, n)
        seen.add((board, r1, r2, order, r3))
    print("\nPART B - per-student rule [Proposal]")
    print("  %d seeds passed. Distinct sets seen: %d. Round 3 answers range %d to %d."
          % (seeds, len(seen), r3_lo, r3_hi))
    print("  Typing: 3 numbers at most (board, rounds 1 and 2), 1 number in round 3.")
    for n in range(100, 1000):                     # wording check on every 3-digit number
        assert unwords(words(n)) == n
    print("  Number words checked for all 900 three-digit numbers.")


if __name__ == "__main__":
    part_a()
    part_b()
    print("\nALL CHECKS PASSED")
