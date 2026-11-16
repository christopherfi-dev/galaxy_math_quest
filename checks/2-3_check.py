"""2-3 Cargo Load: recompute the source task, then test a per-student number rule.

Run:  python3 checks/2-3_check.py
Standard library only.

Part A  [Source]   Marc's item list (Drive "2-3 - not done"; the site page has the same list).
                   Enumerate every subset. Two versions exist:
                     - 6 items, exactly 30 tons  (planning doc, "2-3 - not done", handoff)
                     - 7 items, exactly 30 tons  (student site page)
Part B  [Model]    How long would trial and error take? A simple swap model. An assumption, not data.
Part C  [Proposal] A per-student number rule, tested on 10,000 seeds.
"""
import random
from itertools import combinations
from math import comb

TARGET = 30
SOURCE = {  # [Source] Drive "2-3 - not done" and the site page (same list)
    "A": ("Space food supplies", 3), "B": ("Life support system", 7),
    "C": ("Science equipment", 5),   "D": ("Water reservoir", 6),
    "E": ("Communications gear", 4), "F": ("Spare parts", 4),
    "G": ("Landing gear", 2),        "H": ("Energy cells", 4),
    "I": ("Space suits", 2),         "J": ("Navigation systems", 3),
    "K": ("Emergency rations", 3),
}


def solutions(weights, k, target=TARGET):
    """Every k-item subset (by letter) whose weights total the target."""
    letters = sorted(weights)
    return [c for c in combinations(letters, k) if sum(weights[x] for x in c) == target]


def swap_model(weights, k, rng, cap=200):
    """[Model] Pick k items at random. While the total is not 30, swap one chosen item
    for one unchosen item so the total moves closer to 30 (random among the best swaps).
    Returns the number of swaps, or None if it gets stuck."""
    letters = sorted(weights)
    chosen = set(rng.sample(letters, k))
    for n in range(cap + 1):
        tot = sum(weights[x] for x in chosen)
        if tot == TARGET:
            return n
        best, moves = None, []
        for a in chosen:
            for b in letters:
                if b in chosen:
                    continue
                d = abs(tot - weights[a] + weights[b] - TARGET)
                if best is None or d < best:
                    best, moves = d, [(a, b)]
                elif d == best:
                    moves.append((a, b))
        if best >= abs(tot - TARGET):
            # no single swap improves the total: take a random sideways swap
            a, b = rng.choice([(a, b) for a in chosen for b in letters if b not in chosen])
        else:
            a, b = rng.choice(moves)
        chosen.remove(a)
        chosen.add(b)
    return None


def part_a():
    w = {k: v[1] for k, v in SOURCE.items()}
    print("PART A  [Source] item list")
    print("  weights:", " ".join(f"{k}{w[k]}" for k in sorted(w)), "| total of all 11 =", sum(w.values()))
    print("  heaviest item", max(w.values()), "tons; lightest", min(w.values()),
          "tons  (the site says 'weights 1-7 tons'; no item weighs 1)")
    for k in range(1, 12):
        sols = solutions(w, k)
        ws = sorted(w.values())
        print(f"  choose {k:2d}: {len(sols):3d} of {comb(11, k):3d} subsets total exactly 30"
              f"   (lightest {k} = {sum(ws[:k])}, heaviest {k} = {sum(ws[-k:])})")
    six = solutions(w, 6)
    print("  6-item solutions:", ["".join(s) for s in six])
    for s in six:
        print("    ", " + ".join(str(w[x]) for x in s), "=", sum(w[x] for x in s))
    seven = solutions(w, 7)
    print("  7-item solutions:", len(seven))
    patterns = sorted({tuple(sorted((w[x] for x in s), reverse=True)) for s in seven}, reverse=True)
    print("  7-item solutions by weight pattern:", len(patterns))
    for p in patterns:
        n = sum(1 for s in seven if tuple(sorted((w[x] for x in s), reverse=True)) == p)
        print("    ", "+".join(map(str, p)), "= 30   x", n)
    return w


def part_b(w):
    print("\nPART B  [Model] trial and error (10,000 simulated children per version)")
    for k in (6, 7):
        rng = random.Random(23 + k)
        runs = [swap_model(w, k, rng) for _ in range(10000)]
        ok = sorted(r for r in runs if r is not None)
        first_try = sum(1 for r in ok if r == 0)
        print(f"  {k} items: right on the first random pick {first_try / 100:.2f}% of the time;"
              f" swaps needed: median {ok[len(ok) // 2]}, 9 in 10 finish within {ok[int(len(ok) * 0.9)]},"
              f" worst {ok[-1]}; stuck {10000 - len(ok)}")


# ---------------------------------------------------------------- Part C: the proposed rule
K_ITEMS = 7          # [Proposal] the site's version. With 6 items the source list has one answer.
MIN_SOL, MAX_SOL = 15, 60   # between about 1 in 22 and 1 in 5 of the 330 possible picks


def gen(rng):
    """[Proposal] Per-student cargo list.
    - Same 11 items and names as Marc's list.
    - Each weight is a whole number from 2 to 7 tons (the range of Marc's list).
    - Keep generating until the list is fair (see SOLVABLE in check())."""
    while True:
        w = {k: rng.randint(2, 7) for k in SOURCE}
        if fair(w):
            return w


def fair(w):
    ws = sorted(w.values())
    n = len(solutions(w, K_ITEMS))
    return (MIN_SOL <= n <= MAX_SOL                 # several answers, but not most picks
            and sum(ws[-K_ITEMS:]) >= TARGET + 3    # the heaviest 7 are over the limit
            and sum(ws[:K_ITEMS]) <= TARGET - 3     # the lightest 7 are under it
            and len(set(ws)) >= 4                   # at least 4 different weights
            and 7 in ws)                            # one clearly heavy item, as in the source


def check_answer(w, picked):
    """The conditions checkpoint: exactly K different items, total exactly 30."""
    return (len(picked) == K_ITEMS and len(set(picked)) == K_ITEMS
            and all(p in w for p in picked) and sum(w[p] for p in picked) == TARGET)


def part_c(seeds=10000):
    print(f"\nPART C  [Proposal] rule: 11 items, weights 2-7, choose {K_ITEMS}, exactly {TARGET} tons")
    counts, distinct, bad = [], set(), 0
    stuck = 0
    for seed in range(seeds):
        rng = random.Random(seed)
        w = gen(rng)
        sols = solutions(w, K_ITEMS)
        # SOLVABLE and fair
        if not (MIN_SOL <= len(sols) <= MAX_SOL):
            bad += 1
        if not all(2 <= v <= 7 for v in w.values()):
            bad += 1
        # the checker accepts every real solution and rejects near misses
        if not all(check_answer(w, s) for s in sols):
            bad += 1
        letters = sorted(w)
        for _ in range(5):
            pick = rng.sample(letters, K_ITEMS)
            if check_answer(w, pick) != (sum(w[p] for p in pick) == TARGET):
                bad += 1
        if check_answer(w, sols[0][:-1]) or check_answer(w, list(sols[0][:-1]) + [sols[0][0]]):
            bad += 1  # 6 items, or a repeated item, must fail
        if swap_model(w, K_ITEMS, rng) is None:
            stuck += 1
        counts.append(len(sols))
        distinct.add(tuple(w[k] for k in letters))
    counts.sort()
    print(f"  seeds tested: {seeds}   rule failures: {bad}")
    print(f"  answers per student: fewest {counts[0]}, median {counts[len(counts) // 2]}, most {counts[-1]}")
    print(f"  different cargo lists among {seeds} students: {len(distinct)}")
    print(f"  swap model got stuck on {stuck} lists")
    src = {k: v[1] for k, v in SOURCE.items()}
    print(f"  does Marc's own list pass the rule with {K_ITEMS} items? {fair(src)}")
    return bad


if __name__ == "__main__":
    w = part_a()
    part_b(w)
    bad = part_c()
    print("\nRESULT:", "PASS" if bad == 0 else "FAIL")
