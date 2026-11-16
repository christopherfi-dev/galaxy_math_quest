#!/usr/bin/env python3
"""5-3 Emergency Power: is every regrouping possible with the stated blocks?

Run:  python3 -I checks/5-3_check.py
Standard library only. Needs 5-2_check.py in the same folder (it reuses its block tests).
Written for the 2026-11-16 quest review (station bays 4-5).

The task  [Source: site page "5.3 -Emergency Power- not done"]
  Before: Engine Core 1237, Navigation System 1193, Shield Generator 1097, Weapon System 933.
  Now:    Shield Generator limit 500, Weapon System limit 150.
  Rules:  Engine Core and Navigation System must have the same units,
          "and we must use all of the power available".
  Kit:    two 1000s, twenty 100s, forty 10s, sixty 1s.

PART A  [Source] every version found.
PART B  [Proposal] per-student limits that follow on from 5-2. 10,000 seeds.
"""
import importlib.util
import os
import random
import sys

sys.dont_write_bytecode = True     # do not leave a __pycache__ folder behind
_here =os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location("check_5_2", os.path.join(_here, "5-2_check.py"))
p52 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(p52)

feasible, count_layouts, one_layout = p52.feasible, p52.count_layouts, p52.one_layout
kit_value, VALUES = p52.kit_value, p52.VALUES
SITE_KIT, DRAFT_KIT = p52.SITE_KIT, p52.DRAFT_KIT
NAMES = ["Engine Core", "Navigation System", "Shield Generator", "Weapon System"]


def balanced(total, shield, weapon):
    """Engine = Navigation when shield and weapon take exactly these amounts and all
    power is used. Returns the shared value, or None if it does not split evenly."""
    rest = total - shield - weapon
    return rest // 2 if rest % 2 == 0 else None


# ----------------------------------------------------------------- PART A
def part_a():
    print("PART A - every version found")

    # 1. Site numbers, site kit, limits met exactly
    before = [1237, 1193, 1097, 933]
    total = sum(before)
    s_lim, w_lim = 500, 150
    x = balanced(total, s_lim, w_lim)
    print("\n  1. site: total %d, Shield %d, Weapon %d" % (total, s_lim, w_lim))
    print("     %d - %d - %d = %d ;  %d / 2 = %d" % (total, s_lim, w_lim, total - s_lim - w_lim,
                                                    total - s_lim - w_lim, x))
    assert total == 4460 and x == 1905
    after = [x, x, s_lim, w_lim]
    assert sum(after) == total
    print("     answer: Engine Core = Navigation System = %d" % x)
    print("     moves: Shield gives up %d, Weapon gives up %d (%d in all);"
          % (before[2] - s_lim, before[3] - w_lim, before[2] - s_lim + before[3] - w_lim))
    print("            Engine gains %d, Navigation gains %d (%d in all)"
          % (x - before[0], x - before[1], 2 * x - before[0] - before[1]))
    assert (before[2] - s_lim) + (before[3] - w_lim) == (x - before[0]) + (x - before[1]) == 1380
    f = feasible(after, SITE_KIT)
    n = count_layouts(after, SITE_KIT)
    assert f and n > 0
    lay = one_layout(after, SITE_KIT)
    print("     buildable with the site kit %s? YES (%d layouts). One layout (1000s,100s,10s,1s):"
          % (SITE_KIT, n))
    for name, r, l in zip(NAMES, after, lay):
        assert sum(a * v for a, v in zip(l, VALUES)) == r
        print("       %-18s %5d = %s" % (name, r, l))
    used = tuple(sum(l[i] for l in lay) for i in range(4))
    assert used == SITE_KIT
    print("     every block is used again, including all 60 ones and all 40 tens.")

    # 2. Same numbers with the kit listed on "Things to Prepare - 1st Five"
    f2 = feasible(after, DRAFT_KIT)
    most = 2 * 1000 + DRAFT_KIT[1] * 100 + DRAFT_KIT[2] * 10 + DRAFT_KIT[3]
    print("\n  2. site numbers with the 'Things to Prepare' kit %s: buildable? %s"
          % (DRAFT_KIT, "YES" if f2 else "NO"))
    print("     Only two systems reach 1000, so at most two 1000-blocks can be placed:")
    print("     2x1000 + 20x100 + 20x10 + 60x1 = %d, which is %d short of %d."
          % (most, total - most, total))
    assert not f2 and most == 4260 and count_layouts(after, DRAFT_KIT) == 0

    # 3. If "limit" means "at most" (Shield <= 500, Weapon <= 150)
    answers = {}
    not_buildable = 0
    for s in range(0, s_lim + 1):
        for w in range(0, w_lim + 1):
            v = balanced(total, s, w)
            if v is None:
                continue
            answers.setdefault(v, 0)
            answers[v] += 1
            if not feasible([v, v, s, w], SITE_KIT):
                not_buildable += 1
    print("\n  3. if the limits are 'at most': %d different Engine=Navigation values are valid"
          % len(answers))
    print("     (from %d to %d). Combinations that cannot be built with the site kit: %d."
          % (min(answers), max(answers), not_buildable))
    assert not_buildable == 0
    assert min(answers) == 1905
    print("     So the page needs to say 'exactly 500 and exactly 150' to have one answer.")
    # multiples of 10 only, a likelier child reading
    tens_only = {balanced(total, s, w) for s in range(0, s_lim + 1, 10)
                 for w in range(0, w_lim + 1, 10)}
    tens_only.discard(None)
    print("     Even with amounts in whole tens there are %d valid values." % len(tens_only))

    # 4. Planning doc version
    d_total, d_before = 8724, [4325, 3133, 954, 312]
    assert sum(d_before) == d_total
    dx = balanced(d_total, 500, 150)
    print("\n  4. planning doc: total %d, Shield 500 (from 954), Weapon 150 (from 312)" % d_total)
    print("     %d - 500 - 150 = %d ; / 2 = %d" % (d_total, d_total - 650, dx))
    assert dx == 4037
    f4 = feasible([dx, dx, 500, 150], DRAFT_KIT)
    print("     buildable with its kit %s (worth %d)? %s"
          % (DRAFT_KIT, kit_value(DRAFT_KIT), "YES" if f4 else "NO"))
    assert not f4
    print("\n  RESULT: the site version works with the site kit and has one answer (1905)")
    print("          only if both limits are met exactly. It fails with the kit on the prep sheet.")


# ----------------------------------------------------------------- PART B
# [Proposal] Follows on from the student's own 5-2 numbers (5-2_check.generate).
#   Shield limit: a multiple of 100, from 300 to 700
#   Weapon limit: a multiple of 50, from 100 to 250
#   Both limits are below the old values, are met exactly, and all power is used.
#   Engine Core and Navigation System both go UP to the same value (below 2,000).
#   The 5-2 rule keeps the total even, so the split is always a whole number.
KIT = SITE_KIT


def generate(seed):
    e, n, s, w = p52.generate(seed)
    total = e + n + s + w
    rng = random.Random(seed * 7919 + 53)
    options = []
    for s_lim in range(300, 701, 100):
        for w_lim in range(100, 251, 50):
            if s_lim >= s or w_lim >= w:
                continue
            x = balanced(total, s_lim, w_lim)
            if x is None or x <= max(e, n) or x > 1999:
                continue
            options.append((s_lim, w_lim, x))
    assert options, "seed %d: no valid limits for %s" % (seed, (e, n, s, w))
    s_lim, w_lim, x = rng.choice(options)
    return (e, n, s, w), s_lim, w_lim, x, len(options)


def part_b(seeds=10000):
    seen = set()
    lo, hi, fewest_options = 10 ** 9, 0, 10 ** 9
    for seed in range(seeds):
        (e, n, s, w), s_lim, w_lim, x, n_opt = generate(seed)
        total = e + n + s + w
        assert s_lim < s and w_lim < w
        assert 2 * x + s_lim + w_lim == total, "seed %d: power not all used" % seed
        assert x > e and x > n, "seed %d: a critical system lost power" % seed
        assert x <= 1999
        assert feasible([x, x, s_lim, w_lim], KIT), "seed %d: cannot be built" % seed
        if seed % 500 == 0:
            lay = one_layout([x, x, s_lim, w_lim], KIT)
            assert lay is not None
            for r, l in zip([x, x, s_lim, w_lim], lay):
                assert sum(a * v for a, v in zip(l, VALUES)) == r
        lo, hi = min(lo, x), max(hi, x)
        fewest_options = min(fewest_options, n_opt)
        seen.add((e, n, s, w, s_lim, w_lim))
    print("\nPART B - per-student rule [Proposal], kit %s" % (KIT,))
    print("  %d seeds passed: one whole-number answer each, both critical systems go up,"
          % seeds)
    print("  and every answer can be built. Answers range %d to %d. Distinct sets: %d."
          % (lo, hi, len(seen)))
    print("  Fewest valid limit pairs for any student: %d." % fewest_options)
    print("  Typing: 1 number (the shared Engine/Navigation value).")


if __name__ == "__main__":
    part_a()
    part_b()
    print("\nALL CHECKS PASSED")
