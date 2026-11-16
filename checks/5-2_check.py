#!/usr/bin/env python3
"""5-2 Power Allocation: can each version be built with its blocks? Plus a per-student rule.

Run:  python3 -I checks/5-2_check.py
Standard library only. Written for the 2026-11-16 quest review (station bays 4-5).

Blocks are base-ten blocks: 1000s, 100s, 10s, 1s. A "kit" is how many of each.
A system's power must be built EXACTLY from blocks placed on that system.

PART A  [Source] every version found, checked two independent ways.
PART B  [Proposal] per-student requirements with the site's kit. 10,000 seeds.

This file is also imported by 5-3_check.py.
"""
import random
from functools import lru_cache

VALUES = (1000, 100, 10, 1)

# ----------------------------------------------------------------- the sources
# A. Planning doc "first 5 quests on Space Station" (2023-07)
DRAFT_TOTAL = 8724
DRAFT_REQ = {"Engine Core": 4325, "Navigation System": 3133,
             "Shield Generator": 954, "Weapon System": 312}
DRAFT_KIT = (6, 20, 20, 60)        # also the kit on "Things to Prepare - 1st Five" for 5-2 and 5-3

# B. Student site page "5.2 - Power Allocation- not done"
SITE_TOTAL = 4460
SITE_REQ = {"Engine Core": 1237, "Navigation System": 1193,
            "Shield Generator": 1097, "Weapon System": 933}
SITE_KIT = (2, 20, 40, 60)


def kit_value(kit):
    return sum(n * v for n, v in zip(kit, VALUES))


def canonical(n):
    """Plain place-value split: 1237 -> (1, 2, 3, 7)."""
    return (n // 1000, (n // 100) % 10, (n // 10) % 10, n % 10)


def canonical_need(reqs):
    return tuple(sum(canonical(r)[i] for r in reqs) for i in range(4))


# ----------------------------------------------------------------- method 1
def feasible(reqs, kit):
    """Exact test using totals only.
    If T thousands, H hundreds and X tens are placed in total, then the ones must
    cover the rest. Placing a bigger block on a system always leaves room that is a
    multiple of the smaller block, so only the totals matter:
        T <= sum(r // 1000)
        H <= sum(r // 100) - 10*T
        X <= sum(r // 10)  - 100*T - 10*H
        ones needed = sum(r) - 1000*T - 100*H - 10*X  <= ones in kit
    Every (T, H, X) is tried, so nothing is assumed about which choice is best."""
    reqs = list(reqs)
    total = sum(reqs)
    k1000, k100, k10, k1 = kit
    cap_t = sum(r // 1000 for r in reqs)
    for t in range(min(k1000, cap_t) + 1):
        cap_h = sum(r // 100 for r in reqs) - 10 * t
        for h in range(min(k100, cap_h) + 1):
            cap_x = sum(r // 10 for r in reqs) - 100 * t - 10 * h
            for x in range(min(k10, cap_x) + 1):
                if total - 1000 * t - 100 * h - 10 * x <= k1:
                    return True
    return False


# ----------------------------------------------------------------- method 2
def count_layouts(reqs, kit):
    """Independent brute force: count every way to place blocks system by system.
    Slow but simple. Returns the number of different layouts (0 = impossible)."""
    reqs = tuple(reqs)

    def ways_for(req, kit_left):
        out = []
        for a in range(min(kit_left[0], req // 1000) + 1):
            r1 = req - 1000 * a
            for b in range(min(kit_left[1], r1 // 100) + 1):
                r2 = r1 - 100 * b
                for c in range(min(kit_left[2], r2 // 10) + 1):
                    d = r2 - 10 * c
                    if d <= kit_left[3]:
                        out.append((a, b, c, d))
        return out

    @lru_cache(maxsize=None)
    def go(i, kit_left):
        if i == len(reqs):
            return 1
        n = 0
        for use in ways_for(reqs[i], kit_left):
            n += go(i + 1, tuple(k - u for k, u in zip(kit_left, use)))
        return n

    return go(0, tuple(kit))


def one_layout(reqs, kit):
    """One valid layout, preferring big blocks. None if impossible."""
    reqs = list(reqs)

    def go(i, kit_left):
        if i == len(reqs):
            return []
        req = reqs[i]
        for a in range(min(kit_left[0], req // 1000), -1, -1):
            r1 = req - 1000 * a
            for b in range(min(kit_left[1], r1 // 100), -1, -1):
                r2 = r1 - 100 * b
                for c in range(min(kit_left[2], r2 // 10), -1, -1):
                    d = r2 - 10 * c
                    if d > kit_left[3]:
                        continue
                    left = tuple(k - u for k, u in zip(kit_left, (a, b, c, d)))
                    if feasible(reqs[i + 1:], left):
                        rest = go(i + 1, left)
                        if rest is not None:
                            return [(a, b, c, d)] + rest
        return None

    return go(0, tuple(kit))


# ----------------------------------------------------------------- PART A
def report(name, total, req, kit):
    reqs = list(req.values())
    print("\n  %s" % name)
    print("    requirements %s" % ", ".join("%s %d" % kv for kv in req.items()))
    print("    sum of requirements = %d   stated total = %d   %s"
          % (sum(reqs), total, "match" if sum(reqs) == total else "DO NOT MATCH"))
    print("    kit %d x1000, %d x100, %d x10, %d x1 = %d units in %d blocks"
          % (kit + (kit_value(kit), sum(kit))))
    print("    kit value - requirements = %d" % (kit_value(kit) - sum(reqs)))
    need = canonical_need(reqs)
    print("    plain place-value split needs %d x1000, %d x100, %d x10, %d x1 -> %s"
          % (need + ("fits the kit" if all(n <= k for n, k in zip(need, kit)) else "does NOT fit the kit",)))
    f = feasible(reqs, kit)
    n = count_layouts(reqs, kit)
    assert f == (n > 0), "the two methods disagree"
    print("    can it be built? %s   (different layouts: %d)" % ("YES" if f else "NO", n))
    return f, n


def part_a():
    print("PART A - every version found")
    f, n = report("A. planning doc numbers + planning doc kit", DRAFT_TOTAL, DRAFT_REQ, DRAFT_KIT)
    assert sum(DRAFT_REQ.values()) == 8724 and kit_value(DRAFT_KIT) == 8260
    assert not f and n == 0
    print("    -> impossible: the kit is %d units short." % (8724 - 8260))

    f, n = report("B. site numbers + site kit", SITE_TOTAL, SITE_REQ, SITE_KIT)
    assert sum(SITE_REQ.values()) == 4460 and kit_value(SITE_KIT) == 4460
    assert f and n > 0
    lay = one_layout(SITE_REQ.values(), SITE_KIT)
    used = tuple(sum(l[i] for l in lay) for i in range(4))
    print("    one layout (1000s, 100s, 10s, 1s):")
    for (name, r), l in zip(SITE_REQ.items(), lay):
        assert sum(a * v for a, v in zip(l, VALUES)) == r
        print("      %-18s %5d = %s" % (name, r, l))
    print("      blocks used %s of kit %s -> every block is used" % (used, SITE_KIT))
    assert used == SITE_KIT
    # what the student is forced to do
    print("    forced swaps: three systems need a 1000 but there are two 1000-blocks,")
    print("      so one system is built from ten 100s; then 100s run short (22 needed, 20),")
    print("      so 2 hundreds become 20 tens; then 10s run short (44 needed, 40),")
    print("      so 4 tens become 40 ones. 20 + 40 = 60 ones.")
    assert canonical_need(SITE_REQ.values()) == (3, 12, 24, 20)
    assert (3 - 1, 12 + 10 - 2, 24 + 20 - 4, 20 + 40) == SITE_KIT

    f, n = report("C. site numbers + the kit on 'Things to Prepare' (same as planning doc kit)",
                  SITE_TOTAL, SITE_REQ, DRAFT_KIT)
    assert f
    print("    -> possible, with 3 x1000 and 8 x100 left over.")

    f, n = report("D. planning doc numbers + site kit", DRAFT_TOTAL, DRAFT_REQ, SITE_KIT)
    assert not f
    print("\n  RESULT: only the site numbers can be built. The planning doc version cannot.")


# ----------------------------------------------------------------- PART B
# [Proposal] Every student uses the same class kit (the site's: 2, 20, 40, 60) but
# gets their own four requirements.
#   Engine Core, Navigation System, Shield Generator: 1,000 to 1,499 each
#   Weapon System: 300 to 999
#   total: 4,460 or less (the kit's value), and EVEN (5-3 needs to halve what is left)
#   Three systems need a 1000 and the kit has two, so one swap of a 1000-block for
#   ten 100s is always forced, as in Marc's version.
KIT = SITE_KIT
NAMES = ["Engine Core", "Navigation System", "Shield Generator", "Weapon System"]


def generate(seed):
    rng = random.Random(seed)
    while True:
        e, n, s = (rng.randint(1000, 1499) for _ in range(3))
        w = rng.randint(300, 999)
        if (e + n + s + w) % 2 == 1:
            w += 1 if w < 999 else -1
        if e + n + s + w <= kit_value(KIT) and len({e, n, s, w}) == 4 and e != n:
            return [e, n, s, w]


def part_b(seeds=10000):
    seen = set()
    lo, hi = 10 ** 9, 0
    all_used = 0
    for seed in range(seeds):
        reqs = generate(seed)
        total = sum(reqs)
        assert total <= kit_value(KIT) and total % 2 == 0
        assert all(1000 <= r <= 1499 for r in reqs[:3]) and 300 <= reqs[3] <= 999
        assert feasible(reqs, KIT), "seed %d: cannot be built: %s" % (seed, reqs)
        need = canonical_need(reqs)
        assert need[0] == 3 > KIT[0], "seed %d: no forced swap" % seed
        if seed % 500 == 0:                         # cross-check with the brute force
            lay = one_layout(reqs, KIT)
            assert lay is not None
            for r, l in zip(reqs, lay):
                assert sum(a * v for a, v in zip(l, VALUES)) == r
            assert all(sum(l[i] for l in lay) <= KIT[i] for i in range(4))
        if total == kit_value(KIT):
            all_used += 1
        lo, hi = min(lo, total), max(hi, total)
        seen.add(tuple(reqs))
    print("\nPART B - per-student rule [Proposal], kit %s" % (KIT,))
    print("  %d seeds passed: every set can be built, every set forces a 1000 -> ten 100s swap."
          % seeds)
    print("  Distinct sets: %d. Totals range %d to %d. Sets that use every block: %d."
          % (len(seen), lo, hi, all_used))
    print("  Checking a student's layout needs 4 numbers per system (1000s, 100s, 10s, 1s).")


if __name__ == "__main__":
    part_a()
    part_b()
    print("\nALL CHECKS PASSED")
