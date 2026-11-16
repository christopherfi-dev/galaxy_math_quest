#!/usr/bin/env python3
"""Zephyron Task 2 - Find the Engine Core! Recomputation and number-rule test.

Standard library only. Run:  python3 checks/zephyron_t2_check.py

The task: on "city map.pdf", find the secret entrance (A-E) that is
"exactly 10 miles" from the Target Building (the green flag).

HOW THE PIXEL NUMBERS BELOW WERE MEASURED (2026-11-16)
The PDF (Drive id 1_r7G97Td-BY03L_FB0WLVlyTFyWKHSYr) is one A3 landscape page.
It was rendered with `pdftoppm -r 300` to 4960 x 3510 px.
- Entrances = centroid of each red ring (about 3,850 red pixels each).
- Flag = four reference points, because the page does not say which one to use.
- Scale = centres of the six mile ticks (0 to 5 Mi) on the pasted Km/Mi bar.
Good to about +/- 3 px (0.01 mile). The map is a photo of a model city taken at
an angle, so one scale cannot be true everywhere. That is ignored here, as the task ignores it.
[Source] "Things to Prepare - 1st Five", sheet "October Prints": printed "15 - A3 - color".
"""
import math
import random

DPI = 300
A4_FACTOR = 297.0 / 420.0
MILE_TICKS_PX = [3445.0, 3724.0, 4003.0, 4281.5, 4560.0, 4839.0]   # 0,1,2,3,4,5 Mi
KM_8_TICK_PX = 3330 + 1500                                         # the "8" Km tick (read from a crop)

ENTRANCES_PX = {
    "A": (967.08, 1152.35),
    "B": (2421.91, 1210.22),
    "C": (3649.90, 891.31),
    "D": (3591.91, 1511.43),
    "E": (3156.81, 2495.73),
}
RING_RADIUS_PX = 52.0          # mean radius of a red ring

FLAG_REFS_PX = {
    "centre of the green triangle": (1000.9, 2066.9),
    "bottom of the flag pole":      (970.0, 2155.0),
    "top of the flag pole":         (970.0, 2030.0),
    "tip of the green triangle":    (1057.0, 2067.0),
}

FORM_ACCEPTS = "D"             # the answer form accepts any text containing "D"
TARGET_MILES = 10


def px_per_mile():
    return (MILE_TICKS_PX[-1] - MILE_TICKS_PX[0]) / 5.0


def table():
    ppm = px_per_mile()
    rows = {}
    for ref, (fx, fy) in FLAG_REFS_PX.items():
        rows[ref] = {k: math.hypot(x - fx, y - fy) / ppm for k, (x, y) in ENTRANCES_PX.items()}
    return rows, ppm


def part1():
    rows, ppm = table()
    cm_mile_a3 = ppm / DPI * 2.54
    print("PART 1  Distances from the green flag, in miles")
    print("  scale: 5 miles = %.1f px = %.2f cm on A3 = %.2f cm on A4" % (5 * ppm, 5 * cm_mile_a3, 5 * cm_mile_a3 * A4_FACTOR))
    print("         10 miles = %.1f cm on A3 = %.1f cm on A4 (two bar lengths)" % (10 * cm_mile_a3, 10 * cm_mile_a3 * A4_FACTOR))
    px_per_km = (KM_8_TICK_PX - MILE_TICKS_PX[0]) / 8.0
    print("         cross-check: 1 mile = %.2f km on the bar (true value 1.61)" % (ppm / px_per_km))
    print("  %-30s %6s %6s %6s %6s %6s" % ("measured from", "A", "B", "C", "D", "E"))
    for ref, r in rows.items():
        print("  %-30s %6.2f %6.2f %6.2f %6.2f %6.2f" % (ref, r["A"], r["B"], r["C"], r["D"], r["E"]))
    ring = RING_RADIUS_PX / ppm
    print("  a red ring is %.2f miles across, so 'which edge' moves an answer by up to %.2f miles" % (2 * ring, ring))

    print("\n  How far C and D are from %d miles, by where the child puts the ruler:" % TARGET_MILES)
    winners = {}
    for ref, r in rows.items():
        offc, offd = abs(r["C"] - TARGET_MILES), abs(r["D"] - TARGET_MILES)
        w = "C" if offc < offd else "D"
        winners[ref] = w
        print("    %-30s C is off by %.2f, D is off by %.2f -> nearest is %s" % (ref, offc, offd, w))

    exact = [k for r in rows.values() for k, v in r.items() if abs(v - TARGET_MILES) < 0.15]
    print("\n  RESULT: entrances within 0.15 miles of exactly 10, from any reference point: %s" % (sorted(set(exact)) or "none"))
    print("  RESULT: the form's key is '%s'. D measures %.1f to %.1f miles. C measures %.1f to %.1f miles."
          % (FORM_ACCEPTS, min(r["D"] for r in rows.values()), max(r["D"] for r in rows.values()),
             min(r["C"] for r in rows.values()), max(r["C"] for r in rows.values())))
    print("  RESULT: nearest-to-10 is %s." % ", ".join("%s from the %s" % (w, ref) for ref, w in winners.items()))
    assert not exact, "an entrance is exactly 10 miles away after all"
    assert set(winners.values()) == {"C", "D"}, "the answer no longer depends on the reference point"

    ref = rows["bottom of the flag pole"]
    print("\n  In ruler terms (A3 page, from the bottom of the pole): 10 miles = %.1f cm; D = %.1f cm; C = %.1f cm."
          % (10 * cm_mile_a3, ref["D"] * cm_mile_a3, ref["C"] * cm_mile_a3))
    print("  On A4: 10 miles = %.1f cm; D = %.1f cm; C = %.1f cm."
          % (10 * cm_mile_a3 * A4_FACTOR, ref["D"] * cm_mile_a3 * A4_FACTOR, ref["C"] * cm_mile_a3 * A4_FACTOR))
    return rows


def part2_printed_map_targets(rows):
    """Which whole-mile targets have one clear answer from EVERY reference point?"""
    print("\nPART 2  Whole-mile targets that are safe on the printed map [Proposal]")
    safe = []
    for target in range(2, 12):
        ok_letters = set()
        clear = True
        for r in rows.values():
            offs = sorted((abs(v - target), k) for k, v in r.items())
            if offs[0][0] <= 0.35 and offs[1][0] >= 1.0:
                ok_letters.add(offs[0][1])
            else:
                clear = False
        if clear and len(ok_letters) == 1:
            safe.append((target, ok_letters.pop()))
    print("  safe targets (answer within 0.35 miles, every other entrance at least 1 mile off):", safe or "none")
    print("  10 miles is %s." % ("safe" if any(t == 10 for t, _ in safe) else "NOT safe"))
    return safe


def rule(seed):
    """[Proposal] numbers in the world: 1 cm = k miles (or km), five entrances at whole cm.

    k in {1, 2, 5}; five different whole-cm distances from 2 to 10;
    target = one of them, in miles. Child's arithmetic: cm x k, at most 10 x 5 = 50.
    """
    rng = random.Random(seed)
    k = rng.choice([1, 2, 5])
    cms = rng.sample(range(2, 11), 5)
    letters = ["A", "B", "C", "D", "E"]
    ent = dict(zip(letters, cms))
    ans = rng.choice(letters)
    return {"k": k, "entrances": ent, "target": ent[ans] * k, "answer": ans}


def part3():
    print("\nPART 3  Rule [Proposal]: numbers in the world, 10,000 seeds")
    fails = 0
    answers = {}
    for seed in range(10000):
        p = rule(seed)
        vals = {l: c * p["k"] for l, c in p["entrances"].items()}
        hits = [l for l, v in vals.items() if v == p["target"]]
        ok = hits == [p["answer"]] and len(set(vals.values())) == 5 and max(vals.values()) <= 50
        fails += 0 if ok else 1
        answers[p["answer"]] = answers.get(p["answer"], 0) + 1
    print("  failures: %d of 10,000. Answer letters used: %s" % (fails, dict(sorted(answers.items()))))
    ex = rule(3)
    print("  example seed 3: 1 cm = %d miles; entrances (cm) %s; which is %d miles away? -> %s"
          % (ex["k"], ex["entrances"], ex["target"], ex["answer"]))
    assert fails == 0


if __name__ == "__main__":
    rows = part1()
    part2_printed_map_targets(rows)
    part3()
    print("\nALL CHECKS PASSED")
