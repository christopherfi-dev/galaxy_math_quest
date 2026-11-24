# Galactic Trade as a market: what is built

**Date:** 24 November 2026. **From:** the trade thread. **For:** Marc, and the main thread.
**Link:** https://christopherfi-dev.github.io/galaxy_math_quest/trade/ (its own page; the game is not changed)
Everything is **[Proposal]** unless it says [Source]. My choices without you are marked **[pick]**.

---

## 1. What a child does

1. **The story, first.** Voltara's Energy Council calls: the city is low on supplies. The child's hold carries 3 crates of Voltaran goods. Planets pay gems for them. [Source: your Task 2 page, "a galaxy-wide SOS"]
2. **The list, at once.** Supplies for Voltara, 500 gems. A glow stone, 300 gems, sold only on Planet R, 60 light-years away. The list stays in the picture all the way through.
3. **A gift.** The Council gives 100 gems for fuel. [Source: you, 24 November: "I think it's a gift."]
4. **The rules, and paper.** Fuel costs 2 gems for each light-year. The beacon pulls the ship home for free. "Get some paper and a pencil." [Source: you, 24 November]
5. **A solved example first.** Tavi sells fruit at Voltara's market: 4 stalls, a cart of 2 baskets, 10 coins for rent. Her paper shows every choice. Stall P pays the most, but Q and R together leave her more. Coins and rent, not gems and fuel.
6. **A trip.** The trade board fills the picture: 5 planets, each with what it wants, what it pays and how far it is. The child loads up to 3 crates, on the board or with the buttons. **Nothing adds up for them.**
7. **Fuel.** The child types the fuel and the gems left after it. A route that costs more than they have is "too far".
8. **The flight.** The ship flies out to each planet and is pulled home. Each planet shows what it pays as the ship arrives.
9. **The count.** The child adds what each planet paid to what was left after fuel. "Not yet" gives a nudge with no number in it.
10. **The result.** "You set off with 235 gems. You came home with 312." A planet that cost more fuel than it paid is named: "Planet I paid 57, but its fuel cost 100. That planet lost you 43 gems."
11. **Buying.** Supplies are bought at Voltara: the city's windows light up. The glow stone is a trip to Planet R. The fuel step shows what will be left on landing. A child who flies without enough comes home without the stone, and the fuel is spent.

**Rounding.** [Source: you, 24 November] Rounding is taught elsewhere, so there is no estimate step. I checked this in the game: the Voltara river, its plan table, the star-seed locks, Project Second Home and the quick questions. Pays are not round (none ends in 0), so a child *may* round to compare quickly. One hint, given only when asked, says so: "round each pay to the nearest ten. Then count exactly before you choose." **[pick]**

## 2. The maths

| What the child does | Standard |
|---|---|
| Fuel: 2 x a ten (2 x 40) | 3.NBT.3 |
| Gems left after fuel; gems after a trip; change after buying | 3.NBT.2, within 1,000 |
| Which plan is best: work each one out, then compare | 3.OA.8, two steps |
| Is it enough for the stone? (fuel, then the price) | 3.OA.8 |

**No one shortcut works.** Across the 20,000-seed check:
- The biggest pay is a trap on 62% of boards (it is not part of the best plan). On the rest it is the right choice. So "never take the biggest" is not a rule either.
- Taking the nearest planets first is a trap on 41% of boards: it comes home 30 gems or more behind.
- So the child has to work the plans out.

## 3. What the checks found

**Number check** (`checks/trade_market_check.js`, 20,000 seeds; it reads the rule from the page and works every choice out again with its own code): **passes.**
- The biggest number a child sees or works out: **922**. Pays end in 0: **never**.
- Different boards: **371,872**. First boards: **19,999 different** in 20,000 seeds.
- Every board has **one best plan**, at least **20 gems** ahead of the next (median 34).
- Every trip after the first has a far offer that **loses 15 to 45 gems**.
- No child is ever left unable to fly. Below 60 gems the Council sends 100 more, and says so.
- The handoff's example (B and C, 370) and Tavi's paper are worked out again, and they agree.
- **Trips before the glow stone, by kind of child:**

| Child | Glow stone after | Both things after (mean) |
|---|---|---|
| Works out every plan | 2 trips, always | 4.1 trips |
| Biggest pay minus fuel first | 2 (99%), 3 | 4.2 |
| Nearest planets first | 2 (86%), 3, 4 | 4.6 |
| **Biggest pay first** | 2 (71%), 3 (28%), 4 or 5 | **5.2** |
| Any plan that fits (guessing) | 2 to 12 | 8.2 |

- A child who always takes the biggest pay needs more trips than one who works it out on **77%** of seeds, and fewer on 1%.

**Play test** (`checks/trade_market_test.js`, about 2 minutes): **passes** at iPad sideways (1180 x 745), iPad upright (820 x 1180) and phone (390 x 760). It plays the whole market, with wrong answers, a route too far, a loss, the page closed in mid-flight, a trip to R without enough, the stone, the supplies and the end. It records every word drawn on the picture: no sum of the chosen plan ever appears, and every pay and distance on the board is drawn. Kind words on all 207 lines.

**Parse check:** passes (no optional chaining, no nullish operator).

**Found and fixed by the checks and the pictures:**
- A child who always went to the nearest planets did almost as well as one who thought, which would have taught "always go near". Half the first boards, and 3 later boards in 10, now have a poor near planet.
- Reopening the page mid-flight could freeze the picture: the first frame's time step could come out negative. Fixed in the piece, so the game is safe from it too.
- On a phone, the "too far" message hid under the number pad. Messages now scroll into view.
- A loss of 4 gems was too small to notice. Losses are now 15 to 45.

## 4. What I looked at

Every screen, at the three sizes: 60 screenshots, each checked against the desk's words. An independent reviewer, who saw only `CLAUDE.md`, the design note, your three answers and 26 of the pictures, also checked them. What it found, and what I changed, is in section 7.

## 5. What I chose without you ([pick])

1. **3 crates, 5 offers** on each board.
2. **Supplies 500 gems.** Bought at Voltara, with no fuel. The city's windows light up. The market's card comes then.
3. **The far planet is R** (60 light-years). Its name is yours to give.
4. **Light-years are tens.** Each planet keeps its letter and place from your Trade Data Sheet, drawn on the ring for its distance to the nearest ten. **[Conflict]** The handoff said both "keep the distances" and "distances are tens". I kept the letters, the places and the rings, and rounded the distances.
5. **A chest holds 999 gems.** With 600 or more, the child must buy something first. This keeps every number within 1,000, and a child who has 600 can always afford one thing on the list.
6. **The Council's gift again below 60 gems**, so no child is stuck.
7. **The Power Module is left off the list.** It waits on the plan's decision 1.
8. **Old saves:** the market starts fresh. Version 97's season shows as one line in the ship's log.
9. **The hint about rounding**, given only when asked.

## 6. What could prove this wrong (watch in class)

- **Too long?** Working it out, both things take about 4 trips, plus the stone trip. That may be two lessons. If it drags, lower the supplies to 400.
- **Paper.** Trip 1 has about 10 plans that fit the fuel. A child without paper will guess. Guessing costs about 4 more trips, which is the lesson, but it may also be the end of patience.
- **Do they look at fuel by the second trip?** If not, the loss line is not landing.
- **The gift after buying.** A child who buys the stone with 430 gems is left with 10, and the Council sends 100. Kind, but it softens the cost.

## 7. The independent review

(Filled in below, after the review.)

## 8. A message for the main thread (paste it)

> From the trade thread. The market is built: https://christopherfi-dev.github.io/galaxy_math_quest/trade/ (`docs/trade/index.html`). The piece is `GMQTrade`, between the GMQ TRADE markers. How to wire it in, in order, with the tests: `proposals/GMQ_Trade_Wiring_v1_2026-11-24.md`. Three things for you: (1) the small worlds lose their way in (version 97's "Land on" buttons lived in the trade plan); my pick is that a planet you have sold to can be landed on (`GMQTrade.visited`). (2) `galactic_trade_test.js` and the trader step of `lantern_chain_test.js` must change: the stone is now sold on Planet R for 300 gems, through the market. (3) The glassmaker's line and `tradeStone()` still say 200 gems at the beacon. Checks: `trade_market_check.js` (20,000 seeds) and `trade_market_test.js` (three sizes) both pass.
