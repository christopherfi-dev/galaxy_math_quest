"""1-3 Star Map: check the code arithmetic and what a server could and could not check.

Run:  python3 checks/1-3_check.py
Standard library only.

The star map is painted by each student and the teacher draws the path, so every
student already has their own numbers. The server cannot see the painting. What it
CAN check is the arithmetic: the student types the count of each star type on the
path and the code, and the server recomputes  code = sum(count x star number).

Part A  [Source]   The only star numbers found: "Each Blue Star = 2, Each Pink Star = 5"
                   (Drive "Untitled document" in the engine core folder).
Part B  [Proposal] A five-colour key for the site's five colours, and a self-check rule,
                   tested on 10,000 seeds. The key's numbers are NOT Marc's.
"""
import random

SOURCE_KEY = {"blue": 2, "pink": 5}                                     # [Source]
SITE_COLOURS = ("red", "blue", "white", "yellow", "orange")             # [Source] site, no numbers given
PROPOSED_KEY = {"red": 1, "blue": 2, "white": 3, "yellow": 5, "orange": 10}   # [Proposal] blue = 2 kept
MIN_SPECIAL_STARS = 12                                                  # [Source] "1-3 - Paint a Star Map"


def code(key, counts):
    return sum(key[c] * counts[c] for c in key)


def part_a():
    print("PART A  [Source] two-colour key: blue = 2, pink = 5")
    for blue, pink in ((3, 2), (6, 6), (10, 10)):
        print(f"  {blue} blue and {pink} pink: {blue} x 2 + {pink} x 5 = {code(SOURCE_KEY, {'blue': blue, 'pink': pink})}")
    print("  facts used: the 2 and 5 times tables. With up to 10 of each, all are inside 10 x 10.")
    print("  the site names five colours:", ", ".join(SITE_COLOURS), "- no numbers for them were found")


def server_check(key, typed_counts, typed_code):
    """[Proposal] conditions checkpoint: counts are whole numbers 0-10, at least 5 stars
    on the path, and the typed code matches the typed counts."""
    if any(not 0 <= typed_counts[c] <= 10 for c in key):
        return False
    if sum(typed_counts.values()) < 5:
        return False
    return typed_code == code(key, typed_counts)


def part_b(seeds=10000):
    print("\nPART B  [Proposal] five-colour key", PROPOSED_KEY)
    bad, lo, hi, biggest_product = 0, None, None, 0
    for seed in range(seeds):
        rng = random.Random(seed)
        # a painted map: 12 to 20 special stars; the path crosses 5 to 12 of them
        painted = [rng.choice(SITE_COLOURS) for _ in range(rng.randint(MIN_SPECIAL_STARS, 20))]
        on_path = rng.sample(painted, rng.randint(5, 12))
        counts = {c: on_path.count(c) for c in SITE_COLOURS}
        right = code(PROPOSED_KEY, counts)
        biggest_product = max(biggest_product, max(PROPOSED_KEY[c] * counts[c] for c in SITE_COLOURS))
        if any(n > 10 for n in counts.values()):
            bad += 1                                   # every product stays inside 10 x 10
        if not server_check(PROPOSED_KEY, counts, right):
            bad += 1                                   # a correct answer is accepted
        if server_check(PROPOSED_KEY, counts, right + 1) or server_check(PROPOSED_KEY, counts, right - 1):
            bad += 1                                   # a wrong total is rejected
        c = rng.choice(SITE_COLOURS)
        miscount = dict(counts, **{c: counts[c] + 1})
        if miscount[c] <= 10 and server_check(PROPOSED_KEY, miscount, right):
            bad += 1                                   # counts and code must agree
        lo = right if lo is None else min(lo, right)
        hi = right if hi is None else max(hi, right)
    print(f"  seeds tested: {seeds}   rule failures: {bad}")
    print(f"  codes range from {lo} to {hi}; biggest single product {biggest_product}")
    print("  LIMIT: the server checks the sum only. It cannot tell whether the counts match the")
    print("  painting. A student can type any counts that add up. The teacher still has to look.")
    return bad


if __name__ == "__main__":
    part_a()
    bad = part_b()
    print("\nRESULT:", "PASS" if bad == 0 else "FAIL", "(arithmetic rule only; the painting is teacher-confirmed)")
