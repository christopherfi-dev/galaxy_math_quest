"""Mini-quest number rules for Galaxy Numerix [Proposal].

Each rule makes one quick problem for one student, with one typed number as
the answer. The skills and levels come from Marc's "tasks / strand order" doc,
Numbers Quests 1-4, plus two rules for the station bays (counting, odd and
even). Fractions (Quest 5) are left out for now.

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


def count_on(r):
    step, top = r.choice([(5, 100), (10, 1000), (100, 1000)])
    start = r.randrange(step, top - 3 * step + 1, step)
    seq = [start + i * step for i in range(3)]
    return f"{seq[0]}, {seq[1]}, {seq[2]}, __", start + 3 * step, {"seq": seq, "step": step, "top": top}


def odd_one_out(r):
    want_odd = r.random() < 0.5
    nums = []
    while len(nums) < 3:
        n = r.randint(11, 99)
        is_odd = n % 2 == 1
        need_special = len(nums) == 0
        if n not in nums and (is_odd == want_odd) == need_special:
            nums.append(n)
    special = nums[0]
    r.shuffle(nums)
    word = "odd" if want_odd else "even"
    return f"Which one is {word}? {nums[0]}, {nums[1]}, {nums[2]}", special, {"nums": nums, "odd": want_odd}


# ---------- what each rule must always obey

def ok_count(a, f):
    s = f["seq"]
    return s[1] - s[0] == f["step"] == s[2] - s[1] == a - s[2] and 0 < s[0] and a <= f["top"]


def ok_odd(a, f):
    hits = [n for n in f["nums"] if (n % 2 == 1) == f["odd"]]
    return hits == [a] and len(set(f["nums"])) == 3

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


# Each rule is matched to a skill statement in Marc's Math Skills engine
# (engines/math-skills/current-v1.1/api/constraints/skills/). [Source for the
# statements; the matching is a Proposal.]
STATEMENTS = {
    "pv_order": "Compares whole numbers within 1,000 using terms",
    "pv_partition": "Reads and writes whole numbers within 1,000 in expanded form",
    "round10": "Rounds whole numbers within 1,000",
    "round100": "Rounds whole numbers within 1,000",
    "add_1digit": "Adds whole numbers with sums within 20",
    "sub_1digit": "Subtracts whole numbers within 20",
    "add_2digit_plain": "Adds whole numbers with sums within 100, no regrouping",
    "sub_2digit_plain": "Subtracts whole numbers within 100, no regrouping",
    "add_2digit_regroup": "Adds whole numbers with sums within 100, with regrouping",
    "sub_2digit_regroup": "Subtracts whole numbers within 100, with regrouping",
    "mult_repeated": "Represents arrays with repeated addition expressions and finds the total number of objects",
    "mult_2_5_10": "Multiplies basic facts",
    "mult_facts": "Multiplies basic facts",
    "div_share": "Understands division as equal sharing",
    "div_2_5_10": "Divides basic facts",
    "div_facts": "Divides basic facts",
    "count_on": "Counts by 10s within 1,000",
    "odd_one_out": "Determines if sets of objects are even or odd",
}

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
    ("Station bay 1  count on by 5s, 10s, 100s",    count_on,           ok_count),
    ("Station bay 4  odd or even",                  odd_one_out,        ok_odd),
]


def check_statements():
    """Is every matched statement really in the Math Skills skill files?"""
    import glob, os
    here = os.path.dirname(os.path.abspath(__file__))
    folder = os.path.join(here, "..", "engines", "math-skills", "current-v1.1",
                          "api", "constraints", "skills")
    files = sorted(glob.glob(os.path.join(folder, "*.txt")))
    if not files:
        print("\nMath Skills skill files not found; statement check skipped.")
        return True
    total = 0
    where = {}
    for path in files:
        for line in open(path, encoding="utf-8"):
            text = line.strip().lstrip("*").strip().replace("\u2011", "-")
            if text:
                total += 1
                where.setdefault(text, []).append(os.path.basename(path)[:7])
    print(f"\nMath Skills engine: {len(files)} skill files, {total} skill statements.")
    print(f"{'rule':20} {'lowest band':11}  statement")
    ok = True
    for rule, text in STATEMENTS.items():
        bands = sorted(set(where.get(text, [])))
        ok &= bool(bands)
        print(f"{rule:20} {bands[0] if bands else 'NOT FOUND':11}  {text}")
    return ok


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

    all_ok &= check_statements()

    print("\nRESULT:", "PASS" if all_ok else "FAIL")


if __name__ == "__main__":
    main()
