"""2-1 Fuel Calculation: recompute every path in every version, then test a per-student rule.

Run:  python3 checks/2-1_check.py
Standard library only.

Part A  [Source]   Planning draft, Drive doc "2-1 - not done" (five straight paths A to E).
Part B  [Source]   Printed map, "2-1 Refueling Map (1).pdf" (the map the site links to),
                   with the routes named in the "Fuel Refilling" answer sheet.
Part C  [Proposal] A per-student number rule in the shape of the printed map, 10,000 seeds.

A path is a list of steps. A negative step is a leg (fuel used). A positive step is a refill.
A ship cannot fly a leg that needs more fuel than it has.
"""
import random

START = 100

# ---------------------------------------------------------------- Part A: planning draft
DRAFT = {  # [Source] "2-1 - not done", copied exactly
    "A": [-15, +70, -35, -25, -20],
    "B": [-25, +50, -35, -15, -30],
    "C": [-20, -40, +80, -50, -30],
    "D": [-30, -20, +60, -50, -40],
    "E": [-35, -40, +90, -60, -55],
}
DRAFT_CLAIM = "paths B and E run out of fuel before reaching the end"

# ---------------------------------------------------------------- Part B: printed map
# Read from the PDF image, edge by edge. Route names are from the "Fuel Refilling" sheet.
PRINTED = {
    "ABD-END":    [("A>B", -15), ("B>refill", -25), ("refill", +25), ("refill>D", -40), ("D>End", -50)],
    "AFGC - END": [("A>F", -40), ("F>G", -25), ("G>refill", -40), ("refill", +100), ("refill>C", -10), ("C>End", -10)],
    "AHJZ - END": [("A>H", -20), ("H>J", -25), ("J>Z", -25), ("Z>refill", -25), ("refill", +25), ("refill>End", -35)],
    "AKWP - END": [("A>K", -40), ("K>W", -25), ("W>refill", -25), ("refill", +40), ("refill>P", -25), ("P>End", -30)],
    "ALST - END": [("A>L", -30), ("L>S", -25), ("S>refill", -10), ("refill", +25), ("refill>T", -25), ("T>End", -25)],
}
# The 29 numbers pdftotext finds on the map (24 legs and 5 refills). Used as a cross-check
# on the edge-by-edge reading above.
PDF_NUMBERS = sorted([40, 40, 25, 15, 20, 25, 30, 25, 25, 25, 25, 40, 25, 25, 40, 25, 35, 10, 50, 25,
                      10, 30, 25, 10] + [25, 25, 40, 100, 25])


def fly(steps, start=START, tank=None):
    """Follow a path. Returns (reached, fuel_at_end_or_at_failure, short_by, trace, lowest)."""
    fuel, trace, lowest = start, [start], start
    for s in steps:
        if s < 0 and fuel + s < 0:
            return False, fuel, -(fuel + s), trace, lowest
        fuel += s
        if tank is not None and fuel > tank:
            fuel = tank
        trace.append(fuel)
        lowest = min(lowest, fuel)
    return True, fuel, 0, trace, lowest


def part_a():
    print("PART A  [Source] planning draft '2-1 - not done'")
    print(f"  the draft says: '{DRAFT_CLAIM}'")
    for cap, label in ((None, "no tank limit"), (100, "tank holds at most 100")):
        print(f"  -- {label}")
        for name, steps in DRAFT.items():
            ok, fuel, short, trace, low = fly(steps, tank=cap)
            line = " -> ".join(map(str, trace))
            if ok:
                print(f"     Path {name}: {line}   reaches the end with {fuel} (lowest point {low})")
            else:
                print(f"     Path {name}: {line}   STOPS, short by {short}")
    runs_out = [n for n, s in DRAFT.items() if not fly(s)[0]]
    print("  paths that really run out (no tank limit):", runs_out or "none")
    return runs_out


def part_b():
    print("\nPART B  [Source] printed map '2-1 Refueling Map (1).pdf'")
    nums = sorted(abs(v) for route in PRINTED.values() for _, v in route)
    print("  edge reading matches the 29 numbers in the PDF text:", nums == PDF_NUMBERS)
    winners = []
    for name, route in PRINTED.items():
        steps = [v for _, v in route]
        ok, fuel, short, trace, low = fly(steps)
        line = " -> ".join(map(str, trace))
        if ok:
            winners.append((name, fuel))
            print(f"     {name:11s}: {line}   REACHES the end with {fuel}")
        else:
            failed_leg = route[len(trace) - 1][0]
            print(f"     {name:11s}: {line}   stops before leg {failed_leg}: has {fuel}, short by {short}")
    print("  routes that reach the end:", winners)
    return winners


# ---------------------------------------------------------------- Part C: the proposed rule
SHAPES = [  # (route name, legs before the refill, legs after it): the printed map's shape
    ("A-B-D", 2, 2), ("A-F-G-C", 3, 2), ("A-H-J-Z", 4, 1), ("A-K-W-P", 3, 2), ("A-L-S-T", 3, 2),
]
LEGS = range(10, 55, 5)      # each leg uses 10 to 50, a multiple of 5
REFILLS = range(20, 65, 5)   # each refill adds 20 to 60, a multiple of 5


def make_route(rng, before, after, want):
    """want = 'win' (reaches End with 5 to 20 left) or 'fail' (short by 5 or 10 at one leg)."""
    while True:
        legs = [rng.choice(LEGS) for _ in range(before + after)]
        refill = rng.choice(REFILLS)
        steps = [-x for x in legs[:before]] + [refill] + [-x for x in legs[before:]]
        ok, fuel, short, trace, low = fly(steps)
        if max(trace) > START:                   # never more fuel than a full tank
            continue
        if want == "win" and ok and 5 <= fuel <= 20:
            return steps
        if want == "fail" and not ok and short in (5, 10) and len(trace) >= 2:
            return steps


def gen(rng):
    """[Proposal] One student's map: the printed map's five routes with new numbers.
    Exactly one route, chosen by the seed, reaches End."""
    winner = rng.randrange(len(SHAPES))
    routes = {}
    for i, (name, before, after) in enumerate(SHAPES):
        routes[name] = make_route(rng, before, after, "win" if i == winner else "fail")
    return routes, SHAPES[winner][0]


def part_c(seeds=10000):
    print("\nPART C  [Proposal] rule: printed map's shape, start 100, legs 10-50, refills 20-60, all multiples of 5")
    bad = 0
    which = {name: 0 for name, _, _ in SHAPES}
    left_seen, short_seen, distinct, most_ops = set(), set(), set(), 0
    for seed in range(seeds):
        rng = random.Random(seed)
        routes, winner = gen(rng)
        reached = []
        for name, steps in routes.items():
            ok, fuel, short, trace, low = fly(steps)
            most_ops = max(most_ops, len(steps))
            if any(v % 5 for v in steps) or any(t % 5 for t in trace):
                bad += 1
            if min(trace) < 0 or max(trace) > START:
                bad += 1
            if ok:
                reached.append(name)
                left_seen.add(fuel)
                if not 5 <= fuel <= 20:
                    bad += 1
            else:
                short_seen.add(short)
                if short not in (5, 10):
                    bad += 1
        if reached != [winner]:                    # SOLVABLE: exactly one route works
            bad += 1
        which[winner] += 1
        distinct.add(tuple(tuple(s) for s in routes.values()))
    print(f"  seeds tested: {seeds}   rule failures: {bad}")
    print(f"  winning route spread: {which}")
    print(f"  fuel left on the winning route: {sorted(left_seen)}; failing routes are short by: {sorted(short_seen)}")
    print(f"  most steps on one route: {most_ops}; different maps among {seeds} students: {len(distinct)}")
    # Marc's printed map against the rule
    ok_shape = all(sum(1 for v in [x for _, x in r] if v > 0) == 1 for r in PRINTED.values())
    shorts = sorted(fly([v for _, v in r])[2] for r in PRINTED.values())
    print(f"  Marc's printed map: one refill per route {ok_shape}; shortfalls {shorts}"
          f" (it breaks the proposed rule in one place: its +100 refill is above 60)")
    return bad


if __name__ == "__main__":
    runs_out = part_a()
    winners = part_b()
    bad = part_c()
    print("\nSUMMARY")
    print("  planning draft: paths that run out =", runs_out or "none", "(the draft's claim is wrong)")
    print("  printed map: exactly one route reaches End =", len(winners) == 1, winners)
    print("RESULT:", "PASS" if bad == 0 and len(winners) == 1 else "FAIL")
