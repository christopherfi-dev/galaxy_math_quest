#!/usr/bin/env python3
"""
Chronosia Task 4 - Timekeeper Cadet's Challenge: Plan the Perfect Day.

Part A  works out the original task in code: who wants which events, what the
        four special conditions remove, and whether any time clash matters.
Part B  tests, on 10,000 seeds, that the task still has a computable answer
        when it uses the per-student timetable PROPOSED in chronosia_t3_check.py.

Sources (Marc's Drive and site, read 2026-11-16):
  - 'Council of Timekeepers: Annual Timetable' (times, dates, dimensions)
  - 'Character Profiles' (interests)
  - site page 'Task 4 ...' (the four special conditions)
  - 'Events Description brochure.pdf' (what each event is)
  - Loom video 'Measurement - Quest 1 - Task 4': Marc says each person visits
    "two different events" and "each of them will probably not be able to
    attend one of those".
  - saved ChatGPT chat: Marc wrote the brochure so that "we might know that
    the dinosaur one is too risky".

What is NOT in any source: a list of which events are "risky", the time of
Sara's meeting, and an answer key. Those are marked OPEN below.

Standard library only. Run:  python3 chronosia_t4_check.py
"""
from collections import Counter
from itertools import combinations

from chronosia_t3_check import EVENTS, NAMES, make_timetable, mins

# Interests -> events. Read from 'Character Profiles'; the matching is mine,
# and it agrees with what Marc says in the Task 4 video for Sara.
WANTS = {
    "Sara": ("Restore Ancient Atlantis", "Time Capsule Unveiling"),
    "Tim":  ("Sun Alignment Ceremony", "Intergalactic Alien Peace Summit"),
    "Alex": ("Save the Dinosaurs", "Prevent the Robot Uprising"),
    "Zara": ("Stop the Black Hole", "Repair the Space-Time Fabric"),
}
PLACE = {e[0]: e[1] for e in EVENTS}
SAME_DIM = {e[0]: e[2] for e in EVENTS}
ZARA_LIMIT = 45   # "can't do any events longer than 45 minutes"

# OPEN: no source lists the risky events. Four readings are tested.
RISKY_READINGS = {
    "Marc's stated intent (dinosaurs only)": {"Save the Dinosaurs"},
    "robots only": {"Prevent the Robot Uprising"},
    "both of Alex's events": {"Save the Dinosaurs", "Prevent the Robot Uprising"},
    "neither": set(),
}


def overlap(a, b):
    return a[1] == b[1] and a[2] < b[3] and b[2] < a[3]


def final_schedule(rows, risky):
    """rows: (name, day, start, end). Returns person -> (kept, removed-with-reason)."""
    row = {r[0]: r for r in rows}
    out = {}
    for person, wants in WANTS.items():
        kept, removed = [], []
        for ev in wants:
            dur = row[ev][3] - row[ev][2]
            if person == "Sara" and PLACE[ev] != "Chronosia":
                removed.append((ev, "not in Chronosia"))
            elif person == "Tim" and not SAME_DIM[ev]:
                removed.append((ev, "different dimension"))
            elif person == "Alex" and ev in risky:
                removed.append((ev, "risky, no chaperone"))
            elif person == "Zara" and dur > ZARA_LIMIT:
                removed.append((ev, f"{dur} min is longer than {ZARA_LIMIT}"))
            else:
                kept.append(ev)
        out[person] = (kept, removed)
    return out


def part_a():
    print("PART A - the original task, worked in code")
    rows = [(n, day, mins(s), mins(e)) for n, _, _, day, s, e in EVENTS]
    row = {r[0]: r for r in rows}

    used = Counter(ev for w in WANTS.values() for ev in w)
    print(f"  Each of the 8 events is wanted by exactly one person: "
          f"{set(used.values()) == {1} and len(used) == 8}")

    clashes = [(a[0], b[0]) for a, b in combinations(rows, 2) if overlap(a, b)]
    owner = {ev: p for p, w in WANTS.items() for ev in w}
    print("  Clashes in the timetable and who wants each event:")
    same_person = 0
    for a, b in clashes:
        same_person += owner[a] == owner[b]
        print(f"    {a} ({owner[a]})  /  {b} ({owner[b]})")
    print(f"  Clashes that hit one person's own two events: {same_person} of {len(clashes)}")
    print("  So no time clash changes anyone's schedule. The draft answer is")
    print("  'everyone goes to both of their events'.")

    print("\n  After the four special conditions:")
    for label, risky in RISKY_READINGS.items():
        sched = final_schedule(rows, risky)
        lost = sum(bool(rem) for _, rem in sched.values())
        print(f"  Reading of 'risky': {label}")
        for person, (kept, removed) in sched.items():
            rem = "; ".join(f"{ev} ({why})" for ev, why in removed) or "nothing"
            print(f"    {person:5} keeps {len(kept)}: {', '.join(kept) or '-'} | loses: {rem}")
        print(f"    people who lose at least one event: {lost} of 4")
    print("\n  Tim loses nothing under every reading: both of his events are printed as")
    print("  'Same Timeline / Same Dimension'. Marc's video expects each person to lose one.")
    zara = [(ev, row[ev][3] - row[ev][2]) for ev in WANTS["Zara"]]
    print(f"  The only number work in the task: Zara's durations {zara} against {ZARA_LIMIT} minutes.")
    short = sorted((r[3] - r[2], r[0]) for r in rows if r[3] - r[2] <= ZARA_LIMIT)
    print(f"  Events of {ZARA_LIMIT} minutes or less: {short}")
    print("  OPEN: which events are risky; when Sara's meeting is; no answer key exists.\n")


def part_b(n=10_000):
    print(f"PART B - Task 4 on the proposed per-student timetables, {n:,} seeds")
    risky = RISKY_READINGS["Marc's stated intent (dinosaurs only)"]
    bad = 0
    zara_keeps = Counter()
    own_clash = 0
    for seed in range(n):
        rows, _, _ = make_timetable(seed, zara_split=True)
        sched = final_schedule(rows, risky)
        row = {r[0]: r for r in rows}
        ok = set(sched) == set(WANTS)
        ok &= all(len(k) + len(r) == 2 for k, r in sched.values())      # every event decided
        ok &= len(sched["Zara"][0]) == 1                               # her limit always bites once
        ok &= len(sched["Sara"][0]) == 1 and len(sched["Alex"][0]) == 1
        ok &= len(sched["Tim"][0]) == 2
        # after the conditions nobody is left holding two events that clash
        for person, (kept, _) in sched.items():
            if len(kept) == 2 and overlap(row[kept[0]], row[kept[1]]):
                ok = False
        own_clash += any(overlap(row[a], row[b]) for a, b in WANTS.values())
        zara_keeps[sched["Zara"][0][0]] += 1
        bad += not ok
    print(f"  {n - bad:,} of {n:,} seeds give one computable final schedule.")
    print(f"  Zara's surviving event varies by student: {dict(zara_keeps)}")
    print(f"  Seeds where one person's own two events clash before the conditions: {own_clash:,}")
    print("  The check needs two facts stored as data, not left to reading:")
    print("  each person's two events, and which events count as risky.")


if __name__ == "__main__":
    part_a()
    part_b()
