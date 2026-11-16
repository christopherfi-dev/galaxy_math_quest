#!/usr/bin/env python3
"""
Chronosia Task 2 - Unravel the Temporal Rift Riddle (Time Quakes).

Part A  recomputes the printed worksheet and the seventh quake.
Part B  tests a PROPOSED per-student number rule on 10,000 seeds.

Sources (Marc's Drive, read 2026-11-16):
  - 'Time Quake Data Analysis Worksheet' (Google Doc, printed)  -> WORKSHEET
  - saved ChatGPT chat ('chat'): Marc's own rule, in his words:
    "time duration increases by 5 minutes each time ... always have the next
    quake start 30 minutes after the last one ended"                -> the rule
  - the same chat: ChatGPT's first table                           -> CHAT_DRAFT

The worksheet prints no AM/PM. Times are read as one afternoon: 12:49 is just
after noon, and 1:24 is 13:24.

Standard library only. Run:  python3 chronosia_t2_check.py
"""
import random

WORKSHEET = [("12:49", "12:54"), ("1:24", "1:34"), ("2:04", "2:19"),
             ("2:49", "3:09"), ("3:39", "4:04"), ("4:34", "5:04")]
CHAT_DRAFT = [("12:49", "12:54", 5), ("1:24", "1:34", 10), ("2:04", "2:19", 15),
              ("2:49", "3:09", 20), ("3:39", "4:04", 25), ("4:34", "4:59", 25),
              ("5:29", "5:54", 25)]


def mins(t):
    """Clock text -> minutes after 12:00. '12:49' -> 49, '1:24' -> 84."""
    h, m = map(int, t.split(":"))
    return (h % 12) * 60 + m


def clock(x):
    h, m = divmod(x, 60)
    return f"{(h - 1) % 12 + 1 if h else 12}:{m:02d}"


def part_a():
    print("PART A - the printed worksheet, recomputed")
    durs, gaps, cross = [], [], 0
    prev_end = None
    for i, (s, e) in enumerate(WORKSHEET, 1):
        d = mins(e) - mins(s)
        crosses = mins(s) // 60 != mins(e) // 60
        cross += crosses
        gap = None if prev_end is None else mins(s) - prev_end
        if gap is not None:
            gaps.append(gap)
        durs.append(d)
        print(f"  quake {i}: {s:>5} - {e:<5}  lasts {d:>2} min"
              f"{'  (crosses the hour)' if crosses else ''}"
              f"{'' if gap is None else f'  | starts {gap} min after the last one ended'}")
        prev_end = mins(e)
    steps = [b - a for a, b in zip(durs, durs[1:])]
    print(f"  durations {durs}; they grow by {sorted(set(steps))}; gaps {sorted(set(gaps))}")
    assert set(steps) == {5} and set(gaps) == {30}, "the printed table breaks Marc's rule"
    s7 = prev_end + 30
    d7 = durs[-1] + 5
    e7 = s7 + d7
    print(f"  SEVENTH QUAKE: starts {clock(s7)}, lasts {d7} min, ends {clock(e7)}"
          f"{'  (crosses the hour)' if s7 // 60 != e7 // 60 else ''}")
    print(f"  Durations that cross the hour: {cross} of 6 (quakes 4, 5 and 6).")
    print("  The gap from quake 1 to quake 2 crosses from 12 to 1 on a 12-hour clock.")
    print("  Nothing crosses noon or midnight if the day starts at 12:49 PM. No AM/PM is printed.")
    print("  Times are to the minute. All durations and gaps are multiples of 5.")
    print("  Answers needed: 6 durations + start, end and length of quake 7 = 9 numbers,")
    print("  plus two written parts (the pattern, the strategy).")

    print("\n  ChatGPT's first table in the saved chat (not the printed one):")
    for i, (s, e, d) in enumerate(CHAT_DRAFT, 1):
        real = mins(e) - mins(s)
        expect = 5 * i
        flag = "" if real == expect else f"   <-- breaks the +5 rule (should last {expect})"
        print(f"    {i}: {s}-{e} listed {d}, really {real}{flag}")
    print("  Marc's printed worksheet fixed row 6 (5:04, not 4:59) and left row 7 blank.\n")


# ---------------------------------------------------------------- Part B
# PROPOSED rule (not Marc's): keep his pattern, vary the numbers.
#   first start : hour 1-5, any minute 01-59 that is not a multiple of 5
#                 (the original starts at 12:49; an hour of 1-5 keeps the whole
#                 afternoon on one side of 12 so no answer wraps past 12:59)
#   first length: 5 or 10 minutes
#   growth      : +5 minutes each quake (Marc's rule)
#   gap         : 20, 30 or 40 minutes between a quake's end and the next start
#   six quakes shown; the student predicts the seventh.

def make_quakes(seed):
    rng = random.Random(seed)
    hour = rng.randint(1, 5)
    minute = rng.choice([m for m in range(1, 60) if m % 5])
    first = rng.choice([5, 10])
    gap = rng.choice([20, 30, 40])
    t = hour * 60 + minute
    rows = []
    for i in range(7):
        d = first + 5 * i
        rows.append((t, t + d, d))
        t = t + d + gap
    return rows, gap


def part_b(n=10_000):
    print(f"PART B - proposed number rule, {n:,} seeds")
    bad = 0
    cross_counts = []
    latest = 0
    for seed in range(n):
        rows, gap = make_quakes(seed)
        ok = len(rows) == 7
        durs = [d for _, _, d in rows]
        ok &= all(b - a == 5 for a, b in zip(durs, durs[1:]))          # one pattern
        ok &= all(rows[i + 1][0] - rows[i][1] == gap for i in range(6))  # one gap
        ok &= all(5 <= d <= 45 for d in durs)                          # Grade 3 sized
        ok &= rows[0][0] >= 60 and rows[-1][1] <= 12 * 60 + 59          # never wraps 12 -> 1
        ok &= all(e > s for s, e, _ in rows)
        # the seventh quake follows from the first six in exactly one way
        s7 = rows[5][1] + gap
        d7 = durs[5] + 5
        ok &= (s7, s7 + d7, d7) == rows[6]
        cross_counts.append(sum(s // 60 != e // 60 for s, e, _ in rows[:6]))
        latest = max(latest, rows[-1][1])
        bad += not ok
    print(f"  {n - bad:,} of {n:,} seeds pass.")
    print(f"  Durations that cross the hour, per student: min {min(cross_counts)}, "
          f"max {max(cross_counts)}, mean {sum(cross_counts) / n:.2f} of 6.")
    print(f"  Latest end time of any seventh quake: {clock(latest)}.")
    rows, gap = make_quakes(3)
    print("  Example (seed 3): " + ", ".join(f"{clock(s)}-{clock(e)}" for s, e, _ in rows[:6])
          + f" -> seventh {clock(rows[6][0])}-{clock(rows[6][1])} ({rows[6][2]} min, gap {gap})")
    print("  Most numbers typed in one answer: 2 (an hour and a minute).")


if __name__ == "__main__":
    part_a()
    part_b()
