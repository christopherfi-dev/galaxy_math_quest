#!/usr/bin/env python3
"""
Chronosia Task 1 - Calibrate the Time Streams (clock tower).

Part A  recomputes the original eight clocks, for both printed versions.
Part B  tests a PROPOSED per-student number rule on 10,000 seeds.

Sources (Marc's Drive, read 2026-11-16):
  - '"Chronosia Clock Tower" checklist' (Google Doc)      -> CHECKLIST
  - 'Clocks.pdf' (the colour print of the eight clocks)   -> CLOCKS_PDF
  - 'Clock Tower WOrksheet' (ChatGPT draft with a key)    -> CHATGPT_KEY
  - Loom video 'Measurement - Quest 1 - Task 1': Marc says "anything past 60
    you go to the next hour" and turns 14:75 into 3:15 (12-hour).

Standard library only. Run:  python3 chronosia_t1_check.py
"""
import random

# ---------------------------------------------------------------- Part A
CHECKLIST = ["3:67", "12:15", "14:75", "9:42", "25:00", "7:99", "5:30", "0:00"]
CLOCKS_PDF = ["3:67", "12:15", "14:75", "9:42", "25:00", "7:99", "5:30", "00:90"]
CHATGPT_KEY = ["4:07", "12:15", "15:15", "9:42", "1:00", "8:39", "5:30", "0:00"]


def parse(t):
    h, m = t.split(":")
    return int(h), int(m)


def is_valid(h, m):
    """A real 24-hour clock time."""
    return 0 <= h <= 23 and 0 <= m <= 59


def correct(h, m):
    """Marc's rule from the video: minutes past 60 roll into the next hour.
    Hours past 23 roll into the next day. Returns (hour 0-23, minute, days)."""
    total = h * 60 + m
    return (total // 60) % 24, total % 60, total // (24 * 60)


def fmt(h, m):
    return f"{h}:{m:02d}"


def to12(h, m):
    suffix = "AM" if h < 12 else "PM"
    return f"{(h - 1) % 12 + 1}:{m:02d} {suffix}"


def part_a():
    print("PART A - the original clocks, recomputed")
    print(f"{'clock':5} {'checklist':>9} {'Clocks.pdf':>10} {'valid?':>7} "
          f"{'fixed (24h)':>11} {'fixed (12h)':>11} {'ChatGPT key':>11}  note")
    errors = 0
    for i in range(8):
        a, b = CHECKLIST[i], CLOCKS_PDF[i]
        for label, shown in (("doc", a), ("pdf", b)):
            if label == "pdf" and a == b:
                continue
            h, m = parse(shown)
            ok = is_valid(h, m)
            ch, cm, days = correct(h, m)
            note = []
            if a != b:
                note.append(f"CONFLICT: checklist says {a}, Clocks.pdf says {b}")
            if days:
                note.append("next day")
            key = CHATGPT_KEY[i] if label == "doc" else "(none)"
            if label == "doc" and parse(key) != (ch, cm):
                note.append("KEY WRONG")
                errors += 1
            print(f"{i + 1:<5} {a if label == 'doc' else '':>9} "
                  f"{b if label == 'pdf' or a == b else '':>10} "
                  f"{'yes' if ok else 'NO':>7} {fmt(ch, cm):>11} "
                  f"{(to12(ch, cm) if not ok else '(as shown)'):>11} {key:>11}  {'; '.join(note)}")
    broken_doc = sum(not is_valid(*parse(t)) for t in CHECKLIST)
    broken_pdf = sum(not is_valid(*parse(t)) for t in CLOCKS_PDF)
    print(f"\nImpossible clocks: checklist {broken_doc} of 8, Clocks.pdf {broken_pdf} of 8")
    print(f"ChatGPT key errors against the roll-over rule: {errors}")
    print("Clocks that use hours above 12 (24-hour time): "
          + ", ".join(t for t in CLOCKS_PDF if parse(t)[0] > 12 or parse(t)[0] == 0))
    print("Smallest step of the valid times: 1 minute (9:42).")
    print("Every fix crosses the hour by design (67-60, 75-60, 99-60, 90-60).")
    print("25:00 crosses midnight.\n")


# ---------------------------------------------------------------- Part B
# PROPOSED rule (not Marc's). Eight clocks per student, like the print:
#   3 clocks already right, 5 clocks broken.
# Broken kinds, each chosen so the fix is ONE roll-over and has ONE answer:
#   K1  hour 1-11, minutes 60-99          -> next hour, minutes - 60
#   K2  (only if 24-hour time is kept) hour 13-22, minutes 60-99
#   K3  (only if 24-hour time is kept) hour 25-29, minutes 00
#                                         -> hour - 24, "next day"
# use_24h=False gives a 12-hour-only version (5 x K1).

def make_clocks(seed, use_24h=True):
    rng = random.Random(seed)
    clocks = []          # (shown_h, shown_m, kind)
    seen = set()

    def add(h, m, kind):
        if (h, m) in seen:
            return False
        # the fixed time must not equal any time already shown or fixed
        fh, fm, _ = correct(h, m)
        if (fh, fm) in seen and kind != "ok":
            return False
        seen.add((h, m))
        seen.add((fh, fm))
        clocks.append((h, m, kind))
        return True

    kinds = ["K1", "K1", "K1", "K2", "K3"] if use_24h else ["K1"] * 5
    for kind in kinds:
        while True:
            if kind == "K1":
                h, m = rng.randint(1, 11), rng.randint(60, 99)
            elif kind == "K2":
                h, m = rng.randint(13, 22), rng.randint(60, 99)
            else:
                h, m = rng.randint(25, 29), 0
            if add(h, m, kind):
                break
    for _ in range(3):
        while True:
            h, m = rng.randint(1, 12), rng.randint(0, 59)
            if add(h, m, "ok"):
                break
    rng.shuffle(clocks)
    return clocks


def answer_matches(typed_h, typed_m, h, m):
    """The checker accepts the 24-hour answer or its 12-hour form
    (Marc's video gives 3:15 for 14:75; the ChatGPT key gives 15:15)."""
    fh, fm, _ = correct(h, m)
    if typed_m != fm:
        return False
    return typed_h == fh or typed_h == (fh - 1) % 12 + 1


def part_b(n=10_000):
    print(f"PART B - proposed number rule, {n:,} seeds per version")
    for use_24h in (True, False):
        bad = 0
        max_typed = 0
        for seed in range(n):
            clocks = make_clocks(seed, use_24h)
            ok = len(clocks) == 8
            ok &= sum(k == "ok" for _, _, k in clocks) == 3
            for h, m, kind in clocks:
                fh, fm, days = correct(h, m)
                ok &= is_valid(fh, fm)                       # the fix is a real time
                if kind == "ok":
                    ok &= is_valid(h, m) and (fh, fm) == (h, m)
                else:
                    ok &= not is_valid(h, m)                 # really broken
                    ok &= (m < 120)                          # one roll-over only
                    ok &= answer_matches(fh, fm, h, m)       # 24-hour answer accepted
                    ok &= answer_matches((fh - 1) % 12 + 1, fm, h, m)  # 12-hour too
                    # a wrong "just drop the tens" answer must not pass
                    ok &= not answer_matches(h % 24, m % 60, h, m) or (h % 24, m % 60) == (fh, fm)
                    if kind == "K3":
                        ok &= days == 1
                    else:
                        ok &= days == 0
                max_typed = max(max_typed, 2)                # hour and minute
            shown = [(h, m) for h, m, _ in clocks]
            ok &= len(set(shown)) == 8                       # no repeated clock
            bad += not ok
        label = "with 24-hour clocks" if use_24h else "12-hour only"
        print(f"  {label:20}: {n - bad:,} of {n:,} seeds pass; "
              f"most numbers typed in one answer: {max_typed} (hour, minute)")
    print("  Example (seed 7, with 24-hour):",
          ", ".join(f"{fmt(h, m)}->{fmt(*correct(h, m)[:2])}" if k != "ok" else f"{fmt(h, m)} ok"
                    for h, m, k in make_clocks(7)))


if __name__ == "__main__":
    part_a()
    part_b()
