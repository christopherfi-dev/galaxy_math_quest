"""Mini-quest number rules, set 2: sixteen more skills.   [Proposal]

Each rule is matched to a statement in Marc's Math Skills engine, except
fraction of a set, which comes from his 2026 skills tracker (it names that
skill as the clearest gap in his class).

Tested on 10,000 seeds each: every rule must stay inside the level it claims.

Run:  python3 checks/miniquest_numbers2_check.py      (standard library only)
"""
import glob, os, random

SEEDS = 10_000
digs = lambda n: [n % 10, n // 10 % 10, n // 100]


def ten_more_less(r):
    while True:
        n = r.randint(20, 989)
        if 1 <= n // 10 % 10 <= 8: break
    d = r.choice(["more", "less"]); return (n, 10, d), n + 10 if d == "more" else n - 10
def hundred_more_less(r):
    n = r.randint(200, 899); d = r.choice(["more", "less"]); return (n, 100, d), n + 100 if d == "more" else n - 100
def count_back(r):
    st, top = r.choice([(10, 100), (100, 1000)]); s1 = st * r.randint(4, top // st); return (s1, s1 - st, s1 - 2 * st, st), s1 - 3 * st
def sub_tens(r):
    a = 10 * r.randint(2, 9); b = 10 * r.randint(1, a // 10 - 1); return (a, b), a - b
def add_three(r):
    while True:
        a, b, c = r.randint(5, 45), r.randint(5, 45), r.randint(5, 45)
        if a + b + c <= 99 and a % 10 + b % 10 + c % 10 >= 10: return (a, b, c), a + b + c
def add_3digit_plain(r):
    while True:
        a, b = r.randint(100, 899), r.randint(100, 899)
        if a + b <= 999 and all(x + y <= 9 for x, y in zip(digs(a), digs(b))): return (a, b), a + b
def add_3digit_regroup(r):
    while True:
        a, b = r.randint(100, 899), r.randint(100, 899)
        if a + b <= 999 and any(x + y >= 10 for x, y in zip(digs(a)[:2], digs(b)[:2])): return (a, b), a + b
def sub_3digit_plain(r):
    while True:
        a, b = r.randint(200, 999), r.randint(100, 899)
        if a > b and all(x >= y for x, y in zip(digs(a), digs(b))): return (a, b), a - b
def mult_tens(r):
    g, e = r.randint(2, 9), 10 * r.randint(1, 9); return (g, e), g * e
def missing_add(r):
    s = r.randint(5, 20); a = r.randint(1, s - 1); return (a, s), s - a
def missing_factor(r):
    g, q = r.randint(2, 10), r.randint(2, 10); return (g, g * q), q
def frac_set(r):
    den = r.choice([2, 3, 4, 5]); num = r.randint(1, den - 1); k = r.randint(2, 9); return (num, den, den * k), num * k
def time_forward(r):
    if r.random() < .5:
        h1 = r.randint(1, 8); dur = r.randint(1, 12 - h1); return (f"{h1}:00", f"{h1 + dur}:00", "hours"), dur
    h = r.randint(1, 12); m1 = 5 * r.randint(0, 9); dur = 5 * r.randint(1, (55 - m1) // 5); return (f"{h}:{m1:02d}", f"{h}:{m1 + dur:02d}", "minutes"), dur
def perimeter_rect(r):
    l = r.randint(3, 12); w = r.randint(2, l); return (l, w), 2 * (l + w)
def area_rect(r):
    l = r.randint(2, 10); w = r.randint(2, 10); return (l, w), l * w
def money_change(r):
    a = 5 * r.randint(1, 19); return (a,), 100 - a


RULES = [
    # rule, the statement it covers, the check it must always pass
    (ten_more_less, "Finds 10 more or 10 less than a given number", lambda v, a: abs(a - v[0]) == 10 and 1 <= a <= 999 and a // 100 == v[0] // 100),
    (hundred_more_less, "Finds 100 more or 100 less than a given number", lambda v, a: abs(a - v[0]) == 100 and 100 <= a <= 999),
    (count_back, "Counts backward by 100s within 1,000", lambda v, a: v[0] - v[1] == v[1] - v[2] == v[2] - a == v[3] and a >= v[3] and v[0] <= 1000),
    (sub_tens, "Subtracts multiples of 10 from multiples of 10 within 100", lambda v, a: v[0] % 10 == 0 and v[1] % 10 == 0 and 10 <= a <= 80 and v[0] <= 90),
    (add_three, "Adds three or more whole numbers with sums within 100, with regrouping", lambda v, a: a == sum(v) <= 99 and sum(x % 10 for x in v) >= 10),
    (add_3digit_plain, "Adds whole numbers with sums within 1,000, no regrouping", lambda v, a: a == v[0] + v[1] <= 999 and all(x + y <= 9 for x, y in zip(digs(v[0]), digs(v[1])))),
    (add_3digit_regroup, "Adds whole numbers with sums within 1,000, with regrouping", lambda v, a: a == v[0] + v[1] <= 999 and any(x + y >= 10 for x, y in zip(digs(v[0])[:2], digs(v[1])[:2]))),
    (sub_3digit_plain, "Subtracts whole numbers within 1,000, no regrouping", lambda v, a: a == v[0] - v[1] >= 0 and v[0] > v[1] and all(x >= y for x, y in zip(digs(v[0]), digs(v[1])))),
    (mult_tens, "Multiplies one-digit whole numbers by multiples of 10", lambda v, a: 2 <= v[0] <= 9 and v[1] % 10 == 0 and 10 <= v[1] <= 90 and a == v[0] * v[1]),
    (missing_add, "Determines unknown parts in addition equations with whole numbers, sums within 20", lambda v, a: v[0] + a == v[1] <= 20 and a >= 1),
    (missing_factor, "Determines unknown factors in multiplication equations with whole numbers and products within 100", lambda v, a: v[0] * a == v[1] <= 100 and 2 <= a <= 10),
    (frac_set, None, lambda v, a: v[2] % v[1] == 0 and a == v[0] * v[2] // v[1] and 1 <= v[0] < v[1] <= 5 and v[2] <= 45),
    (time_forward, "Solves elapsed-time word problems involving counting forward by either hours or minutes", lambda v, a: (v[2] == "hours" and 1 <= a <= 11) or (v[2] == "minutes" and a % 5 == 0 and 5 <= a <= 55)),
    (perimeter_rect, "Solves problems involving perimeters of rectangles within a real-world or mathematical context", lambda v, a: a == 2 * (v[0] + v[1]) <= 48),
    (area_rect, "Determines the area of rectangles with whole-number sides, formula not provided", lambda v, a: a == v[0] * v[1] <= 100),
    (money_change, "Solves one-step money word problems involving whole number addition or subtraction", lambda v, a: v[0] + a == 100 and v[0] % 5 == 0 and 5 <= a <= 95),
]


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    known = set()
    for path in glob.glob(os.path.join(here, "..", "engines", "math-skills", "current-v1.1", "api", "constraints", "skills", "*.txt")):
        known |= {l.strip().lstrip("*").strip().replace("‑", "-") for l in open(path, encoding="utf-8")}
    ok = True
    print(f"{'rule':20} {'fails':>5} {'different':>9}  {'in engine':9}  example")
    for rule, text, check in RULES:
        fails, seen, ex = 0, set(), None
        for seed in range(SEEDS):
            v, a = rule(random.Random(seed))
            fails += not check(v, a); seen.add(v)
            if seed == 7: ex = f"{v} -> {a}"
        found = "tracker" if text is None else ("yes" if text in known else "NOT FOUND")
        ok &= fails == 0 and found != "NOT FOUND"
        print(f"{rule.__name__:20} {fails:5d} {len(seen):9d}  {found:9}  {ex}")
    print("\nRESULT:", "PASS" if ok else "FAIL")


if __name__ == "__main__":
    main()
