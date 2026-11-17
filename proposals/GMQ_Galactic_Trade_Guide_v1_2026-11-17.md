# GMQ — Galactic Trade: Voltara's second task, built in space — guide and answer key — v1 — 2026-11-17

**Stage:** built in the sketch (version 26).
**Added in version 27:** every planet you have scanned can be landed on and explored. See `GMQ_Bigger_Universe_v1_2026-11-17.md`.
**To play it:** tap **Go to space** in the Teacher bar. Then tap the trade beacon beside the planet. Students reach it by making an energy plan on Voltara first.
**Tags:** [Source] = from your material. [Proposal] = my design.

---

## 1. The short version

- This is your Task 2. Your page says "We've just left Planet Voltara", so it happens in space. [Source]
- It is the "something to do while travelling" you asked about.
- The 20 planets, their distances and their profits are your Trade Data Sheet, unchanged. [Source]
- A student **scans** a planet by rounding its two numbers. Then plans a route with the fuel they have. Then flies it and counts the gems.
- There are **three trips**, as in your task. The first is free. After that, fuel costs gems.
- **The choice matters.** Four far planets cost more in fuel than they pay. That trap is in your own numbers.

---

## 2. What the student sees

- **A star map.** Voltara is at the bottom. Rings mark 10, 20, 30 light-years, and so on. A planet 33 light-years away sits between the 30 ring and the 40 ring, nearer 30. So the rounding can be seen.
- **Planets with a "?"** until they are scanned.
- **The route** as a dotted gold line. The ship flies it.
- **A gems counter** in the status row.

---

## 3. How a trip goes

| Step | What happens | The maths |
|---|---|---|
| See it first | The beacon rounds one distance on a number line. It shows that halfway goes up. | — |
| Scan | Tap a planet. Round its distance to the nearest 10 and its gems to the nearest 100. | rounding |
| Plan | Tap scanned planets to put them on the route. The fuel total must fit. | adding tens within a limit |
| Buy fuel (trips 2 and 3) | "Your route needs 90 tokens. Every 10 tokens cost 200 gems. How many gems?" | 9 lots of 200 |
| Fly | The ship flies the route on the map. | — |
| Sell | "They paid 500 + 1,200 + 300. How many gems did you earn?" | adding hundreds |
| Count (trips 2 and 3) | "That left 200. Then you earned 4,700. How many now?" | adding to a four-digit total |

After the third trip the beacon shows the whole season: each route, its fuel cost, what it earned, and the final gems. A student can trade a new season. Their scans are kept.

---

## 4. The rules

| Rule | Where it comes from |
|---|---|
| 50 fuel tokens for the first trip. 1 token flies 1 light-year. | [Source] |
| Round distances to the nearest 10 and profits to the nearest 100 | [Source] |
| 3 trips | [Source]. Your materials also say 4 in one place. |
| 1 fuel token costs 20 gems | [Source]. I say it as "200 gems for every 10 tokens", which is the same and is a Grade 3 sum. |
| Trip 1 goes to the near planets, A to J | [Source]: your first sheet |
| Later trips may go to any planet not yet visited | [Proposal] |
| A trip can use 100 tokens at most | [Proposal], so totals stay below 10,000 |
| Each planet once in a season | [Proposal]. Your page does not say. Without it, five trips to Planet A is the best plan. |

**Left out:** the 15 scenario cards. In my review, several could not be carried out ("lose 100 fuel tokens" when nobody has 100), one used percent, and one let luck beat skill by a wide margin. Three of them are sound: Meteor Shower, Alien Investors and Resource Scarcity. I can add those as trade news if you want.

---

## 5. Answer key

**Rounded numbers** (distance in tokens, then gems):

| Near | | Far | |
|---|---|---|---|
| A | 10 · 500 | K | 40 · 1,300 |
| B | 30 · 800 | L | 50 · 900 |
| C | 30 · 1,200 | M | 30 · 500 |
| D | 20 · 500 | N | 70 · 3,100 |
| E | 40 · 1,000 | O | 50 · 2,800 |
| F | 10 · 300 | P | 70 · 1,600 |
| G | 20 · 700 | Q | 50 · 900 |
| H | 30 · 800 | R | 60 · 2,200 |
| I | 50 · 1,400 | S | 40 · 1,900 |
| J | 20 · 600 | T | 60 · 1,000 |

- **Halfway cases:** F is 5 light-years, H is 25, I is 45. All go up.
- **Best first trip:** A + C + F. It uses all 50 tokens and earns 2,000 gems. Only that one plan earns the most.
- **Planets that lose gems once fuel is paid for:** L, M, Q and T.
- **Best season:** 7,000 gems. The game calls it "the Trade Guild record".
- **One good season:** trip 1: A, C, F (2,000). Trip 2: O, S, fuel 1,800 (4,900). Trip 3: N alone, fuel 1,400 (6,600).

---

## 6. How it was checked

- `checks/galactic_trade_check.py` checks every number. All pass.
  - It tried all 49 first trips, and every season of three trips from each one.
  - **No student can get stuck.** After any trip, another trip can always be paid for.
  - Gems never go below zero. The best season is 7,000. The worst is 500.
  - The rounding rule was checked on 10,000 random numbers.
- `checks/galactic_trade_test.js` plays a whole season at iPad and phone size, with touch, and works every answer out from the rules.

**Not tested:** children. The star map is small on a phone. It is made for an iPad.

---

## 7. What could prove this wrong

| Claim | Test |
|---|---|
| The rings help children see rounding | Ask: "Why is Planet C 30 and not 40?" Watch whether they point at the map. |
| Scanning is not a chore | Count how many planets a student scans before the first trip. Two is too few to choose from. Ten is all of them. |
| The fuel price sum is fair | "9 lots of 200" is the hardest sum here. Watch it. |
| Students notice the planets that lose gems | See whether anyone avoids L, M, Q or T on trip 3. |

---

## 8. Decisions for you

1. **Gems: what are they for?** Your page says they go "a long way in procuring advanced ship parts". Now they are only a score. They could buy something on Voltara, or a ship upgrade.
2. **The scenario cards:** add the three sound ones as trade news?
3. **Three trips, or four?** Your materials say both.
4. **Each planet once:** is that your rule?
