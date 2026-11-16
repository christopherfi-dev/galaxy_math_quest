"""Mini-quest number rules for Galaxy Numerix [Proposal].

Each rule makes one quick problem for one student, with one typed number as
the answer. The skills and levels come from Marc's "tasks / strand order" doc,
Numbers Quests 1-4. Fractions (Quest 5) are left out for now.

This script tests every rule on 10,000 seeds and checks that it stays inside
the level it claims. For example, "no regrouping" must never regroup.

Run:  python3 checks/miniquest_numbers_check.py
Standard library only.
"""
import random

SEEDS = 10_000


# ---------- the rules: each returns (question text, answer, facts for testing)

def pv_order(r):
    nums = r.sample(range(100, 1000), 3)
    return f"Which is biggest? {nums[0]}, {nums[1]}, {nums[2]}", max(nums), {"nums": nums}


def pv_partition(r):
    h, t, o = r.randint(1, 9), r.randint(1, 9), r.randint(1, 9)
    n = 100 * h + 10 * t + o
    hide = r.choice("hto")
    parts = {"h": 100 * h, "t": 10 * t, "o": o}
    shown = " + ".join("__" if k == hide else str(v) for k, v in parts.items())
    return f"{n} = {shown}", parts[hide], {"n": n, "parts": parts}


def round10(r):
    n = r.randint(101, 989)
    while n % 10 == 0:
        n = r.randint(101, 989)
    return f"Round {n} to the nearest 10", (n + 5) // 10 * 10, {"n": n, "step": 10}


def round100(r):
    n = r.randint(101, 949)
    while n % 100 == 0:
        n = r.randint(101, 949)
    return f"Round {n} to the nearest 100", (n + 50) // 100 * 100, {"n": n, "step": 100}


def add_1digit(r):
    a, b = r.randint(1, 9), r.randint(1, 9)
    return f"{a} + {b}", a + b, {"a": a, "b": b, "op": "+"}


def sub_1digit(r):
    a = r.randint(2, 18)
    b = r.randint(max(1, a - 9), min(9, a - 1))
    return f"{a} - {b}", a - b, {"a": a, "b": b, "op": "-"}


def add_2digit_plain(r):
    while True:
        a, b = r.randint(10, 89), r.randint(10, 89)
        if a % 10 + b % 10 <= 9 and a // 10 + b // 10 <= 9:
            return f"{a} + {b}", a + b, {"a": a, "b": b, "op": "+"}


def sub_2digit_plain(r):
    while True:
        a, b = r.randint(11, 99), r.randint(10, 98)
        if a > b and a % 10 >= b % 10:
            return f"{a} - {b}", a - b, {"a": a, "b": b, "op": "-"}


def add_2digit_regroup(r):
    while True:
        a, b = r.randint(10, 89), r.randint(10, 89)
        if a % 10 + b % 10 >= 10 and a + b <= 99:
            return f"{a} + {b}", a + b, {"a": a, "b": b, "op": "+"}


def sub_2digit_regroup(r):
    while True:
        a, b = r.randint(20, 99), r.randint(11, 89)
        if a > b and a % 10 < b % 10:
            return f"{a} - {b}", a - b, {"a": a, "b": b, "op": "-"}


def mult_repeated(r):
    groups, size = r.randint(2, 5), r.randint(2, 10)
    text = " + ".join([str(size)] * groups)
    return text, groups * size, {"a": groups, "b": size}


def mult_2_5_10(r):
    a, b = r.choice([2, 5, 10]), r.randint(1, 10)
    return f"{b} x {a}", a * b, {"a": a, "b": b}


def mult_facts(r):
    a, b = r.randint(2, 10), r.randint(2, 10)
    return f"{a} x {b}", a * b, {"a": a, "b": b}


def div_share(r):
    groups, size = r.randint(2, 5), r.randint(2, 10)
    return f"Share {groups * size} between {groups}", size, {"total": groups * size, "d": groups}


def div_2_5_10(r):
    d, q = r.choice([2, 5, 10]), r.randint(1, 10)
    return f"{d * q} ÷ {d}", q, {"total": d * q, "d": d}


def div_facts(r):
    d, q = r.randint(2, 10), r.randint(1, 10)
    return f"{d * q} ÷ {d}", q, {"total": d * q, "d": d}


# ---------- what each rule must always obey

def ok_order(a, f):
    return len(set(f["nums"])) == 3 and all(100 <= n <= 999 for n in f["nums"]) and a == max(f["nums"])


def ok_partition(a, f):
    return sum(f["parts"].values()) == f["n"] and a in f["parts"].values() and 111 <= f["n"] <= 999


def ok_round(a, f):
    return a % f["step"] == 0 and abs(a - f["n"]) <= f["step"] // 2 and 0 < a <= 1000


def ok_1digit(a, f):
    right = f["a"] + f["b"] if f["op"] == "+" else f["a"] - f["b"]
    return a == right and 1 <= a <= 18 and 1 <= f["b"] <= 9 and f["a"] <= 18


def regroups(f):
    if f["op"] == "+":
        return f["a"] % 10 + f["b"] % 10 >= 10
    return f["a"] % 10 < f["b"] % 10


def ok_2digit(want_regroup):
    def check(a, f):
        right = f["a"] + f["b"] if f["op"] == "+" else f["a"] - f["b"]
        return (a == right and 1 <= a <= 99 and 10 <= f["a"] <= 99 and 10 <= f["b"] <= 99
                and regroups(f) == want_regroup)
    return check


def ok_mult(allowed):
    def check(a, f):
        return a == f["a"] * f["b"] and f["a"] in allowed and 1 <= f["b"] <= 10 and a <= 100
    return check


def ok_div(allowed):
    def check(a, f):
        return f["total"] % f["d"] == 0 and a == f["total"] // f["d"] and f["d"] in allowed \
            and 1 <= a <= 10 and f["total"] <= 100
    return check


RULES = [
    # strand quest and level [Source: "tasks / strand order"], rule name, rule, test
    ("Numbers 1 L1  order numbers to 1,000",        pv_order,           ok_order),
    ("Numbers 1 L2  partition to 1,000",            pv_partition,       ok_partition),
    ("Numbers 1 L3  round to nearest 10",           round10,            ok_round),
    ("Numbers 1 L3  round to nearest 100",          round100,           ok_round),
    ("Numbers 2 L1  add single digits",             add_1digit,         ok_1digit),
    ("Numbers 2 L1  subtract single digits",        sub_1digit,         ok_1digit),
    ("Numbers 2 L2  add 2-digit, no regrouping",    add_2digit_plain,   ok_2digit(False)),
    ("Numbers 2 L2  subtract 2-digit, no regroup",  sub_2digit_plain,   ok_2digit(False)),
    ("Numbers 2 L3  add 2-digit, regrouping",       add_2digit_regroup, ok_2digit(True)),
    ("Numbers 2 L3  subtract 2-digit, regrouping",  sub_2digit_regroup, ok_2digit(True)),
    ("Numbers 3 L1  repeated addition",             mult_repeated,      ok_mult(range(2, 6))),
    ("Numbers 3 L2  x2, x5, x10",                   mult_2_5_10,        ok_mult([2, 5, 10])),
    ("Numbers 3 L3  facts to 10 x 10",              mult_facts,         ok_mult(range(2, 11))),
    ("Numbers 4 L1  sharing",                       div_share,          ok_div(range(2, 6))),
    ("Numbers 4 L2  ÷2, ÷5, ÷10",                   div_2_5_10,         ok_div([2, 5, 10])),
    ("Numbers 4 L3  division facts to 10 x 10",     div_facts,          ok_div(range(2, 11))),
]


def main():
    all_ok = True
    print(f"{'skill and level':46} {'fails':>5} {'different':>9}  example")
    for name, rule, check in RULES:
        fails, seen, example = 0, set(), None
        for seed in range(SEEDS):
            q, a, facts = rule(random.Random(seed))
            if not check(a, facts):
                fails += 1
            seen.add(q)
            if seed == 7:
                example = f"{q}  ->  {a}"
        all_ok &= fails == 0
        print(f"{name:46} {fails:5d} {len(seen):9d}  {example}")

    # Two students, same skill, same try: do they get different problems?
    same = 0
    for s in range(SEEDS):
        q1 = mult_facts(random.Random(f"student-A|mult_facts|{s}"))[0]
        q2 = mult_facts(random.Random(f"student-B|mult_facts|{s}"))[0]
        same += q1 == q2
    print(f"\nTwo students on 'facts to 10 x 10': same problem on the same try "
          f"{same} times in {SEEDS:,} ({100 * same / SEEDS:.1f}%).")
    print("Skills with few different problems will repeat. The story around them is what varies.")

    # Cards: how many would one student earn?  (illustration, not Marc's numbers)
    print("\nCards per student over 28 school weeks, 3 sittings a week:")
    for label, per_sitting in [("1 card for every mini quest, 3 mini quests a sitting", 3),
                               ("1 card for every 3 mini quests", 1),
                               ("first mini quest of the day only", 1),
                               ("1 card for every 5 mini quests", 3 / 5)]:
        print(f"   {label:52} {round(per_sitting * 3 * 28):4d}")
    print("   For scale: the big tasks give about 33 cards in total, and the original set has about 130 cards.")

    print("\nRESULT:", "PASS" if all_ok else "FAIL")


if __name__ == "__main__":
    main()
