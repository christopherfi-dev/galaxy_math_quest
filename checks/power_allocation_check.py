"""Power Allocation, as Marc wrote it (station task 5-2): four systems, and only the blocks on the table.
[Source: Marc's page 5-2] Engine Core 1237, Navigation System 1193, Shield Generator 1097, Weapon System 933.
Available: two 1000 blocks, twenty 100 blocks, forty 10 blocks, sixty 1 blocks. "No system gets more or less than its required units."
This works out every way to build the four numbers from those blocks, and says whether the task can be solved, and how many ways there are."""
from itertools import product
NEED = [('Engine Core', 1237), ('Navigation System', 1193), ('Shield Generator', 1097), ('Weapon System', 933)]
HAVE = (2, 20, 40, 60)
print('Total needed:', sum(n for _, n in NEED), ' Total on the table:', HAVE[0] * 1000 + HAVE[1] * 100 + HAVE[2] * 10 + HAVE[3])
ways = []
for _, n in NEED:
    w = []
    for t in range(HAVE[0] + 1):
        for h in range(HAVE[1] + 1):
            for d in range(HAVE[2] + 1):
                o = n - 1000 * t - 100 * h - 10 * d
                if 0 <= o <= HAVE[3]: w.append((t, h, d, o))
    ways.append(w)
sols = []
for combo in product(*ways):
    if all(sum(c[k] for c in combo) <= HAVE[k] for k in range(4)): sols.append(combo)
print('Ways to build each number alone:', [len(w) for w in ways])
print('Ways to build all four from the table:', len(sols))
assert sols, 'NO SOLUTION'
used_all = all(all(sum(c[k] for c in s) == HAVE[k] for k in range(4)) for s in sols)
print('Every solution uses every block:', used_all)
std = [(n // 1000, n // 100 % 10, n // 10 % 10, n % 10) for _, n in NEED]
print('Building each number the usual way (fewest blocks) needs:', tuple(sum(s[k] for s in std) for k in range(4)), ' which', 'fits' if all(sum(s[k] for s in std) <= HAVE[k] for k in range(4)) else 'does NOT fit', 'the table')
ex = sols[0]; print('One solution:', {NEED[i][0]: ex[i] for i in range(4)})
print('RESULT: PASS')
