#!/usr/bin/env python3
"""Chronosia as one whole quest: the numbers in proposals/GMQ_Chronosia_Quest_Design_v1.  Run: python3 -I checks/chronosia_quest_design_check.py
[Source] Marc's Tasks 1 and 2: the clock readings, and the six Time Quakes with his rule (each lasts 5 minutes longer; the next starts 30 minutes after the last ended).
[Proposal] Claude's "quake day": two calm half-hours before the seventh quake, seven jobs with a length in minutes, and what each job keeps safe.
Nothing here is built. The design file says what each number is for.
"""
import itertools
ok = True
def check(name, cond, detail=""):
    global ok; ok &= bool(cond); print(f"  {'ok ' if cond else 'BAD'} {name}{': ' + detail if detail else ''}")
hm = lambda t: f"{(t // 60 - 1) % 12 + 1}:{t % 60:02d}"

print("1. The clock tower [Source: seven clocks agree in both prints]")
CLOCKS = {"3:67": "4:07", "12:15": "12:15", "14:75": "15:15", "9:42": "9:42", "25:00": "1:00", "7:99": "8:39", "5:30": "5:30"}
for shown, want in CLOCKS.items():
    h, m = map(int, shown.split(":")); h += m // 60; m %= 60; h %= 24; got = f"{h}:{m:02d}"
    check(f"{shown} -> {want}", got == want)
check("three clocks are not broken at all", sum(1 for k, v in CLOCKS.items() if k == v) == 3, "12:15, 9:42 and 5:30. Finding which ones are fine is part of the task.")
check("14:75 has two right answers", True, "15:15 on a 24-hour clock, or 3:15 in the afternoon. Both should be taken. 24-hour time is Marc's decision.")

print("2. The six Time Quakes, and the seventh [Source: Marc's rule and his printed table]")
start, quakes = 12 * 60 + 49, []
for i in range(7):
    lasts = 5 * (i + 1); quakes.append((start, start + lasts, lasts)); start = start + lasts + 30
want = [("12:49", "12:54", 5), ("1:24", "1:34", 10), ("2:04", "2:19", 15), ("2:49", "3:09", 20), ("3:39", "4:04", 25), ("4:34", "5:04", 30), ("5:34", "6:09", 35)]
check("the rule gives Marc's printed table, and quake 7 is 5:34 to 6:09, 35 minutes", [(hm(a), hm(b), c) for a, b, c in quakes] == want)
q5_end, q6_start, q6_end, q7_start = quakes[4][1], quakes[5][0], quakes[5][1], quakes[6][0]
check("there are two calm half-hours before quake 7", (q6_start - q5_end, q7_start - q6_end) == (30, 30), f"{hm(q5_end)} to {hm(q6_start)}, and {hm(q6_end)} to {hm(q7_start)}")

print("3. Quake day [Proposal]: seven jobs, two calm half-hours")
#        job                          minutes  kept safe   heals time
JOBS = [("Empty the school",              10,     90,        0),
        ("Close the river gates",         15,     80,        0),
        ("Move the Temporal Tortoises",   25,     40,        0),
        ("Tie down the market",           20,     60,        0),
        ("Carry the time capsule",        20,     30,        0),
        ("Ring the great bell",            5,     50,        0),     # it warns everyone. But the Clockwork Cougars bolt: see below.
        ("Charge the Time Stabilizer",    30,      0,        1)]
BELL_COST = 30          # the trade-off inside the bell: the cougars run from the noise, unless the tortoises' grove gate is already shut behind them
WINDOW = 30
total_min = sum(j[1] for j in JOBS); check("all seven jobs together need far more than the 60 calm minutes", total_min == 125, f"{total_min} minutes of jobs, 60 minutes to do them")
check("every job fits inside one calm half-hour", all(j[1] <= WINDOW for j in JOBS))
check("every job length is a multiple of 5 minutes", all(j[1] % 5 == 0 for j in JOBS))
plans = []
for where in itertools.product((0, 1, 2), repeat=len(JOBS)):                 # 0 = not done, 1 = first half-hour, 2 = second half-hour
    if any(sum(JOBS[i][1] for i in range(len(JOBS)) if where[i] == w) > WINDOW for w in (1, 2)): continue
    done = [JOBS[i] for i in range(len(JOBS)) if where[i]]
    if not done: continue
    names = {j[0] for j in done}; safe = sum(j[2] for j in done) - (BELL_COST if "Ring the great bell" in names and "Move the Temporal Tortoises" not in names else 0)
    plans.append((safe, any(j[3] for j in done), where, names))
sets = {}
for safe, healed, where, names in plans: sets[frozenset(names)] = (safe, healed)
print(f"   {len(plans):,} ways to fill the two half-hours, {len(sets)} different sets of jobs")
SAFE_GOAL = 170          # first try was 200: then no set of jobs could reach both goals
count = [0, 0, 0, 0]
for safe, healed in sets.values(): count[(2 if safe >= SAFE_GOAL else 0) + (1 if healed else 0)] += 1
names4 = ["worse off", "time is healed, but too few are safe", "most are safe, but time is still broken", "Chronosia is whole"]
for i in (3, 2, 1, 0): print(f"      {names4[i]:<42} {count[i]:>3} sets of jobs")
check("all four endings can happen", all(count))
best_all = max(v[0] for v in sets.values()); best_healed = max(v[0] for v in sets.values() if v[1])
check("the most that can be kept safe is 260, without the Stabilizer", best_all == 260, f"with the Stabilizer the most is {best_healed}")
check("so healing time costs safety today: the same lesson as Voltara's solar plant", best_healed < best_all, f"{best_all - best_healed} fewer kept safe")
whole = [set(k) for k, v in sets.items() if v[0] >= SAFE_GOAL and v[1]]
check("only a few sets of jobs reach both goals", 1 <= len(whole) <= 4, "; ".join(" + ".join(sorted(w)) for w in whole))
bell_alone = sets[frozenset({"Ring the great bell"})][0]; bell_tort = sets[frozenset({"Ring the great bell", "Move the Temporal Tortoises"})][0]
check("the bell is a trade-off inside one job", bell_alone == 20 and bell_tort == 90, "rung alone it keeps 50 safe and scares off 30. With the tortoises' grove shut first, nothing is lost.")
ends = sorted({q5_end + sum(c) for c in itertools.combinations([j[1] for j in JOBS], 2) if sum(c) <= WINDOW})
check("every end time a child must work out is a whole 5 minutes and stays inside the half-hour", all(e % 5 == 4 for e in ends) and max(ends) <= q6_start, f"for example {hm(q5_end)} + 25 minutes = {hm(q5_end + 25)}")
print("RESULT:", "PASS" if ok else "FAIL")
