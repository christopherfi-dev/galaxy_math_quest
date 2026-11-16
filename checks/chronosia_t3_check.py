#!/usr/bin/env python3
"""
Chronosia Task 3 - Exam to Become a Temporal Coordinator (the timetable).

Part A  recomputes the printed timetable and its five exam questions.
Part B  tests a PROPOSED per-student number rule on 10,000 seeds.

Sources (Marc's Drive and site, read 2026-11-16):
  - 'Council of Timekeepers: Annual Timetable' (Google Doc, printed) -> EVENTS
  - site page 'Task 3: Exam to Become a Time Coordinator ...' (same 5 questions)
  - saved ChatGPT chat ('chat'): the first draft of the same table   -> CHAT_DRAFT
  - Loom video 'Measurement - Quest 1 - Task 3': Marc's hint for question 5,
    "It's tricky because these are on different days ... more than 20 hours."

Standard library only. Run:  python3 chronosia_t3_check.py
"""
import random
from collections import Counter
from itertools import combinations

# name, place, same dimension?, day of October 267, start, end   (as printed)
EVENTS = [
    ("Restore Ancient Atlantis",         "Ancient Earth",     False, 3, "12:00", "12:30"),
    ("Sun Alignment Ceremony",           "Solarius-IV",       True,  4, "14:00", "15:00"),
    ("Stop the Black Hole",              "Galaxy ZY-31",      True,  4, "14:45", "15:45"),
    ("Intergalactic Alien Peace Summit", "Andromeda",         True,  5, "10:00", "11:30"),
    ("Save the Dinosaurs",               "Prehistoric Earth", False, 5, "11:00", "11:45"),
    ("Prevent the Robot Uprising",       "CyberWorld-2077",   True,  6, "09:00", "10:30"),
    ("Time Capsule Unveiling",           "Chronosia",         True,  6, "09:30", "10:00"),
    ("Repair the Space-Time Fabric",     "Multiverse Core",   True,  7, "13:00", "13:20"),
]
NAMES = [e[0] for e in EVENTS]
# ChatGPT's first draft differed in one cell: the last event ran 13:00-13:30.
CHAT_DRAFT_LAST = ("13:00", "13:30")


def mins(t):
    h, m = map(int, t.split(":"))
    return h * 60 + m


def hhmm(x):
    return f"{x // 60:02d}:{x % 60:02d}"


def analyse(rows):
    """rows: list of (name, day, start_min, end_min). Returns the exam answers
    as sets, so ties are visible."""
    durs = {n: e - s for n, _, s, e in rows}
    lo, hi = min(durs.values()), max(durs.values())
    shortest = {n for n, d in durs.items() if d == lo}
    longest = {n for n, d in durs.items() if d == hi}
    clashes = []
    for a, b in combinations(rows, 2):
        if a[1] == b[1] and a[2] < b[3] and b[2] < a[3]:
            clashes.append((a[1], a[0], b[0], min(a[3], b[3]) - max(a[2], b[2])))
    per_day = Counter(d for _, d, _, _ in rows)
    top = max(per_day.values())
    busiest = {d for d, c in per_day.items() if c == top}
    return durs, shortest, longest, clashes, per_day, busiest


def part_a():
    print("PART A - the printed timetable, recomputed")
    rows = [(n, day, mins(s), mins(e)) for n, _, _, day, s, e in EVENTS]
    durs, shortest, longest, clashes, per_day, busiest = analyse(rows)
    for n, _, same, day, s, e in EVENTS:
        d = durs[n]
        cross = mins(s) // 60 != (mins(e) - 1) // 60
        print(f"  Oct {day}  {s}-{e}  {d:>3} min  {'same dim ' if same else 'DIFFERENT'}  {n}"
              f"{'  (runs past the hour)' if cross else ''}")
    print(f"\n  Q1 shortest event : {sorted(shortest)} ({min(durs.values())} min)"
          f"{'' if len(shortest) == 1 else '   <-- TIE'}")
    print(f"  Q2 longest event  : {sorted(longest)} ({max(durs.values())} min)"
          f"{'' if len(longest) == 1 else '   <-- TIE: the question has two right answers'}")
    oct4 = [c for c in clashes if c[0] == 4]
    print(f"  Q3 clash on Oct 4 : {oct4[0][1]} and {oct4[0][2]} (overlap {oct4[0][3]} min)")
    print(f"     all clashes    : " + "; ".join(f"Oct {d}: {a} / {b} ({o} min)" for d, a, b, o in clashes))
    print(f"  Q4 busiest date   : {['Oct %d' % d for d in sorted(busiest)]} "
          f"({max(per_day.values())} events each)"
          f"{'' if len(busiest) == 1 else '   <-- TIE: three dates share the top count'}")
    dino = next(r for r in rows if r[0] == "Save the Dinosaurs")
    robot = next(r for r in rows if r[0] == "Prevent the Robot Uprising")
    gap = (robot[1] - dino[1]) * 24 * 60 + robot[2] - dino[3]
    print(f"  Q5 end of Dinosaurs (Oct {dino[1]} {hhmm(dino[3])}) to start of Robots "
          f"(Oct {robot[1]} {hhmm(robot[2])}): {gap} min = {gap // 60} h {gap % 60} min")
    print("     It crosses noon and midnight and a change of date.")
    print("     A student who ignores the dates gets", robot[2] - dino[3], "minutes (a negative number).")
    print("  24-hour time is used in every row. All times are multiples of 5 minutes.")
    past = sum(mins(s) // 60 != (mins(e) - 1) // 60 for _, _, _, _, s, e in EVENTS)
    noon = sum(mins(s) < 12 * 60 < mins(e) for _, _, _, _, s, e in EVENTS)
    print(f"  Events that run past an hour mark: {past} of 8. Events that cross noon: {noon}. "
          "None crosses midnight.")
    print("  Answers needed: 8 durations + 5 questions = 13.")
    # the first draft
    rows2 = rows[:-1] + [(rows[-1][0], rows[-1][1], mins(CHAT_DRAFT_LAST[0]), mins(CHAT_DRAFT_LAST[1]))]
    _, sh2, _, _, _, _ = analyse(rows2)
    print(f"  ChatGPT's first draft (last event 13:00-13:30): shortest was a {len(sh2)}-way tie.")
    print("  Marc's printed version (13:20) fixed Q1. Q2 and Q4 still tie.\n")


# ---------------------------------------------------------------- Part B
# PROPOSED rule (not Marc's). Same eight events, same order, same five dates.
#   dates     : one date holds 3 events, one holds 2, three hold 1
#               (so "which date has the most events?" has one answer)
#   durations : one event of 15 or 20 min (the only shortest),
#               one event of 90 min (the only longest),
#               six events of 30, 45 or 60 min
#   starts    : multiples of 15 min, between 09:00 and about 15:00
#   2-event date: the two events overlap (the one clash in the table)
#   3-event date: one after another, with gaps of 15, 30 or 45 min
#   new Q5    : time between the first and second event on the 3-event date
#               (same day, under an hour)                      [Proposal]
#   zara_split: exactly one of Zara's two events (Stop the Black Hole, Repair
#               the Space-Time Fabric) lasts more than 45 min, so Task 4 works.

ZARA = (2, 7)   # indexes of her two events


def make_timetable(seed, zara_split=True):
    rng = random.Random(seed)
    # dates
    big = rng.randrange(5)
    two = rng.choice([i for i in range(5) if i != big])
    counts = [1] * 5
    counts[big], counts[two] = 3, 2
    day_of = [d for d, c in zip((3, 4, 5, 6, 7), counts) for _ in range(c)]
    # durations
    while True:
        durs = [rng.choice([15, 20]), 90] + [rng.choice([30, 45, 60]) for _ in range(6)]
        rng.shuffle(durs)
        if not zara_split or (durs[ZARA[0]] > 45) != (durs[ZARA[1]] > 45):
            break
    rows, i = [], 0
    for d, c in zip((3, 4, 5, 6, 7), counts):
        idx = list(range(i, i + c))
        i += c
        if c == 1:
            s = rng.choice(range(9 * 60, 15 * 60 + 1, 15))
            rows.append((NAMES[idx[0]], d, s, s + durs[idx[0]]))
        elif c == 2:
            s = rng.choice(range(9 * 60, 14 * 60 + 1, 15))
            offset = 15 if durs[idx[0]] <= 30 else rng.choice([15, 30])
            if offset >= durs[idx[0]]:
                offset = 5 if durs[idx[0]] == 15 else 15       # keep a real overlap
            rows.append((NAMES[idx[0]], d, s, s + durs[idx[0]]))
            rows.append((NAMES[idx[1]], d, s + offset, s + offset + durs[idx[1]]))
        else:
            s = rng.choice(range(9 * 60, 11 * 60 + 1, 15))
            for k in idx:
                rows.append((NAMES[k], d, s, s + durs[k]))
                s = s + durs[k] + rng.choice([15, 30, 45])
    return rows, big, two


def q5_same_day(rows):
    """Gap between the first and second event on the 3-event date."""
    per_day = Counter(r[1] for r in rows)
    big_day = max(per_day, key=per_day.get)
    a, b = [r for r in rows if r[1] == big_day][:2]
    return b[2] - a[3]


def part_b(n=10_000):
    print(f"PART B - proposed number rule, {n:,} seeds")
    bad = 0
    reasons = Counter()
    for seed in range(n):
        rows, _, _ = make_timetable(seed)
        durs, shortest, longest, clashes, per_day, busiest = analyse(rows)
        checks = {
            "8 events": len(rows) == 8,
            "one shortest": len(shortest) == 1,
            "one longest": len(longest) == 1,
            "exactly one clash": len(clashes) == 1,
            "one busiest date": len(busiest) == 1,
            "times are multiples of 5": all(s % 5 == 0 and e % 5 == 0 for _, _, s, e in rows),
            "durations 15-90": all(15 <= d <= 90 for d in durs.values()),
            "inside 09:00-18:00": all(9 * 60 <= s and e <= 18 * 60 for _, _, s, e in rows),
            "Q5 gap 15-45 same day": q5_same_day(rows) in (15, 30, 45),
            "Zara split": (durs[NAMES[ZARA[0]]] > 45) != (durs[NAMES[ZARA[1]]] > 45),
        }
        if not all(checks.values()):
            bad += 1
            reasons.update(k for k, v in checks.items() if not v)
    print(f"  {n - bad:,} of {n:,} seeds pass." + (f"  Failures: {dict(reasons)}" if bad else ""))
    rows, _, _ = make_timetable(11)
    print("  Example (seed 11):")
    for name, d, s, e in rows:
        print(f"    Oct {d}  {hhmm(s)}-{hhmm(e)}  {e - s:>2} min  {name}")
    print("  Most typed in one answer: 1 number (a duration) or 1 event number (1-8).")


if __name__ == "__main__":
    part_a()
    part_b()
