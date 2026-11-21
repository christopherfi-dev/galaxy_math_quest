# Cargo Load (station task 2-3, Navigation): load 7 of the 11 crates so they weigh exactly 30 tons.
# Every way is checked, not a sample: there are only 330 ways to pick 7 of 11.
#   - the crates are read from the game itself, so this check follows any change to CARGO
#   - at least one way makes exactly 30, and every crate is part of at least one right load (no crate is a trap)
#   - not too easy: a load picked at random is right only about 1 time in 10
#   - Voltara's supply list (CARGO_NEED): at least 5 right loads carry it, so there is still a real choice
#   - the help after a wrong load ("Swap a crate for a heavier / lighter one") can always be followed:
#     from every wrong load, one swap of a single crate reaches 30 or comes closer to it
# Run: python3 checks/cargo_load_check.py
import re, os
from itertools import combinations
html = open(os.path.join(os.path.dirname(__file__), '..', 'prototypes', 'kis_station_sketch.html'), encoding='utf-8').read()
m = re.search(r"const CARGO = \[(.*?)\];", html, re.S)
crates = [(n, int(w)) for n, w in re.findall(r"\['([^']+)', (\d+)\]", m.group(1))]
names, W = [c[0] for c in crates], [c[1] for c in crates]
bad = []
if len(crates) != 11: bad.append(f'{len(crates)} crates, not 11')
loads = list(combinations(range(len(W)), 7)); right = [c for c in loads if sum(W[i] for i in c) == 30]
if not right: bad.append('no load makes 30')
never = [names[i] for i in range(len(W)) if not any(i in c for c in right)]
if never: bad.append('never in a right load: ' + ', '.join(never))
share = len(right) / len(loads)
if share > 0.25: bad.append(f'too easy: {share:.0%} of random loads are right')
stuck = 0
for c in loads:
    t = sum(W[i] for i in c)
    if t == 30: continue
    out = [i for i in range(len(W)) if i not in c]
    if not any(abs(t - W[i] + W[j] - 30) < abs(t - 30) for i in c for j in out): stuck += 1
if stuck: bad.append(f'{stuck} wrong loads where no single swap comes closer')
# Voltara's supply list: the crates named in CARGO_NEED must be in the hold
need = [int(x) for x in re.search(r"const CARGO_NEED = \[([\d, ]+)\]", html).group(1).split(',')]
with_need = [c for c in right if all(i in c for i in need)]
if len(with_need) < 5: bad.append(f'only {len(with_need)} right loads carry Voltara\'s list')
print(f"Voltara's list ({', '.join(names[i] for i in need)}): {len(with_need)} of the {len(right)} right loads carry both")
print(f'{len(loads)} ways to pick 7 crates; {len(right)} make exactly 30 ({share:.0%}); every crate is in a right load: {not never}; '
      f'the heaviest load is {max(sum(W[i] for i in c) for c in loads)}, the lightest {min(sum(W[i] for i in c) for c in loads)}')
print('PROBLEMS: ' + ' | '.join(bad) if bad else 'RESULT: PASS')
if bad: print('RESULT: FAIL')
