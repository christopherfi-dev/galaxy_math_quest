import random
base = {'R':[200,150,100,50,50,20],'C':[250,200,150,100,120,50,30,20],'I':[200,100,50,50,30,20]}
def gen(rng):
    needs = {k:[max(10, v + rng.choice([-30,-20,-10,0,10,20,30])) for v in vs] for k,vs in base.items()}
    tot = {k:sum(v) for k,v in needs.items()}
    short = rng.choice(range(200,310,10))
    supply = sum(tot.values()) - short
    h = rng.randint(6,9)
    rest = supply - 100*h
    ones = rng.choice(range(100, min(rest, 300)+1, 10))
    tens = (rest - ones)//10
    assert 100*h + 10*tens + ones == supply
    return tot, supply, h, tens, ones
def buildable(plan, h, t, o):
    # amounts are multiples of 10; ones act as groups of 10
    tu = t + o//10
    maxh = min(h, sum(a//100 for a in plan))
    return sum(plan)//10 - 10*maxh <= tu
rng = random.Random(1)
bad = 0; worst_short = []
for s in range(20000):
    tot, supply, h, t, o = gen(rng)
    assert supply < sum(tot.values())
    for _ in range(30):
        # random plan: multiples of 10, each <= need, total <= supply
        plan = [rng.choice(range(0, tot[k]+1, 10)) for k in 'RCI']
        while sum(plan) > supply:
            i = rng.randrange(3); plan[i] = max(0, plan[i]-10)
        if not buildable(plan, h, t, o): bad += 1
print('unbuildable plans found:', bad)
