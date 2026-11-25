# Galactic Trade as a market: what is built

**Date:** 24 November 2026. **From:** the trade thread. **For:** Marc, and the main thread.
**Link:** https://christopherfi-dev.github.io/galaxy_math_quest/trade/ (its own page; the game is not changed)
**Zip:** `proposals/GMQ_Trade_Market_v1_2026-11-24.zip` (the page, both checks, this report, the wiring note, and 9 pictures)
Everything is **[Proposal]** unless it says [Source]. My choices without you are marked **[pick]**.

---

## 1. What a child does

1. **The story, first.**
   - Voltara's Energy Council calls: the city is low on supplies. [Source: your Task 2 page, "a galaxy-wide SOS"]
   - The ship carries 3 crates of Voltaran goods, and planets pay gems for them.
2. **The list, at once.**
   - Supplies for Voltara: 500 gems, from a supply ship at the beacon.
   - A glow stone, "for a lantern, for dark places": 300 gems. Only Planet R sells them, 60 light-years away.
   - The list stays in the picture all the way through.
3. **A gift.** The Council gives 100 gems for fuel. [Source: you, 24 November]
4. **The rules, and paper.** Fuel costs 2 gems for each light-year. The beacon pulls the ship home for free. "Get some paper and a pencil." [Source: you, 24 November]
5. **A solved example first.** Tavi sells fruit at Voltara's market: 4 coloured stalls, a cart of 2 baskets, 10 coins for rent. Her paper shows each choice. At the red stall she earns the most, but the blue and yellow stalls together leave her more. Coins and rent, not gems and fuel.
6. **A trip.**
   - The trade board fills the picture: 5 planets. Each card says what the planet wants, what it pays and how far it is.
   - The child loads up to 3 crates by tapping the board, the map or the buttons.
   - **Nothing adds up for them.**
7. **Fuel.** The child types the fuel, and the gems left after it. A route that costs more than they have is "too far".
8. **The flight.** The ship flies out to each planet and is pulled home. Each planet shows what it pays as the ship arrives.
9. **The count.** The child adds what each planet paid to what was left after fuel. "Not yet" gives a nudge with no number in it.
10. **The result.**
    - "You set off with 207 gems. You came home with 349."
    - A planet that cost more fuel than it paid is named: "Planet L paid 69, but its fuel cost 100. You lost 31 gems at Planet L."
    - The ship's log keeps every trip, so trips can be compared.
11. **Buying.**
    - When the supplies are bought, Voltara's skyline lights up, window by window.
    - The glow stone is a trip to Planet R. After the fuel step, the gems left on landing and the stone's price sit side by side.
    - A child who flies without enough comes home without the stone. They are told what the fuel cost, and to work out fuel and price together next time.

**Rounding** [Source: you, 24 November]: there is no estimate step. I checked the game: rounding is taught on Voltara (the river and the plan table), in the star-seed locks, in Project Second Home and in the quick questions. Pays are never round, so a child *may* round to compare. One hint, only when asked, says so. **[pick]**

## 2. The maths

| What the child does | Standard |
|---|---|
| Fuel: 2 x a ten (2 x 40) | 3.NBT.3 |
| Gems left after fuel; gems after a trip; change after buying | 3.NBT.2, within 1,000 |
| Which plan is best: work each one out, then compare | 3.OA.8 |
| Is it enough for the stone? Fuel, then the price | 3.OA.8 |

**No shortcut works.**
- The biggest pay is a trap on **62%** of boards: it is not part of the best plan. On the rest it is the right choice, so "never take the biggest" fails too.
- Taking the nearest planets first comes home 30 gems or more behind on **42%** of boards.
- So the child has to work the plans out.

## 3. What the checks found

**Number check** (`checks/trade_market_check.js`): **passes on 20,000 seeds.** It reads the rule from the page and works every choice out again with its own code.
- The biggest number a child sees or works out is **871**. No pay ends in 0.
- **362,039** different boards in all. The first trip's board is different for every one of the 20,000 seeds.
- Every board has **one best plan**, at least **20 gems** ahead of the next (median 32).
- Every trip after the first has exactly one offer that loses gems, by **15 to 45**.
- Offered planets never sit close enough on the map for their rings to touch.
- No child is ever left unable to fly. Below 60 gems, the Council sends 100 more and says so.
- The handoff's example (B and C, 370) and Tavi's paper were worked out again, and both agree.

**Trips before the glow stone, by kind of child:**

| Child | Glow stone after | Both things after (mean trips) |
|---|---|---|
| Works out every plan | 2 trips, always | 4.1 |
| Biggest pay minus fuel first | 2 (99%) or 3 | 4.2 |
| Nearest planets first | 2 (87%), 3 or 4 | 4.6 |
| **Biggest pay first** | 2 (76%), 3 (23%) or 4 | **5.1** |
| Any plan that fits (guessing) | 2 to 12 | 7.9 |

- A child who always takes the biggest pay needs more trips than one who works it out on **75%** of seeds. They need fewer on 1%.
- A guessing child may need up to 12 trips for the stone. In 15 of 20,000 runs they had not bought both things after 15 trips.

**Play test** (`checks/trade_market_test.js`): **passes** at iPad sideways (1180 x 745), iPad upright (820 x 1180) and phone (390 x 760).
- It plays the whole market: wrong answers, a route too far, taps on the picture, a loss, the page closed in mid-flight, supplies without enough gems, a trip to R without enough, the stone, the supplies and the end.
- It records every word drawn on the picture. Every pay and distance on the board is drawn, and no sum of the chosen plan ever appears.
- All 207 lines the child reads use kind words.

**Parse check:** passes (no optional chaining, no nullish operator).

**Found and fixed along the way:**
- A child who always went to the nearest planets did almost as well as one who thought, which would teach "always go near". Now half the first boards, and 3 later boards in 10, have a poor near planet.
- Reopening the page mid-flight could freeze the picture, because the first frame's time step came out negative. Fixed inside the piece, so the game is safe from it too.

## 4. What I looked at

I looked at every screen at the three sizes (60 screenshots), three times over, checking each word against the picture.

An **independent reviewer** saw only `CLAUDE.md`, the design note, your three answers and 26 pictures. It recomputed every number it could see, and all were right. What it found, and what I did:

| Found | Done |
|---|---|
| The glow stone trip lost 120 gems in fuel without warning | The list says R needs fuel. The fuel step puts the gems left beside the price. A short trip says what the fuel cost |
| Planet letters I, O and Q ("Planet I paid" reads as "I paid"; O looks like zero) | **[pick]** never offered; they stay on the map |
| "Last season: 2,000 gems" beside a ship that carries 999 | **[pick]** the log says only that there was an older season |
| Voltara sold its own missing supplies | A supply ship at the beacon sells them |
| On a phone, the "too far" message hid under the keypad | Fixed (a layout fault) |
| "Chest", and "nearly full" at 650 of 999 | "Your ship can carry up to 999 gems, and a good trip could bring more" |
| Tavi's stalls P, R and S shared letters with planets; "pays"; no coins left over | Stalls by colour; "earn"; a line with 4 coins left over |
| Pay labels drifted beside the wrong planet | They stay beside their planet |
| "Right, but too far" in red | Gold |
| Rings stretched upward, so 40 light-years looked like 60 | True circles; offered planets spaced so their rings never touch |
| Stars beside ring numbers looked like decimal points | The numbers have a dark edge |
| No trader at R; Voltara's lights a few pixels | A glow stone at R; a lit skyline |
| "Hold", "lost you 43 gems", "one crate for each planet" | "Your ship carries up to 3 crates. Each crate goes to a different planet." "You lost 43 gems at Planet I." |
| A too-far plan logged as "Trip 1" | Logged as a plan not flown |
| Small, faint words; tiny phone text | Brighter and a little bigger |

**Not done; yours to decide:** after a trip, a line such as "Another plan brings home more. Look again?" It would show a child that a better plan existed, without saying which. But it is the game judging their choice.

## 5. What I chose without you ([pick])

1. **3 crates and 5 offers** on each board.
2. **Supplies cost 500 gems**, from a supply ship at the beacon, with no fuel. The city lights up, and the market's card comes then.
3. **The far planet is R** (60 light-years). Its name is yours to give.
4. **Light-years are tens.** **[Conflict]** The handoff said both "keep the distances" and "distances are tens". I kept the letters and the places from your Trade Data Sheet, and drew each planet on the ring for its distance to the nearest ten.
5. **The ship carries up to 999 gems.** With 600 or more, the child must buy something first. This keeps every number within 1,000, and a child with 600 can always afford something on the list.
6. **The Council's gift again below 60 gems**, so no child is stuck.
7. **I, O and Q are never offered.**
8. **The Power Module is left off the list.** It waits on the plan's decision 1.
9. **Old saves:** the market starts fresh. The old season's gems are kept for the teacher, not shown.
10. **The rounding hint**, given only when asked.

## 6. What could prove this wrong (watch in class)

- **Too long?** A child who works it out needs about 4 trips, plus the stone trip, for both things. That may be two lessons. If it drags, lower the supplies to 400.
- **Paper.** Trip 1 has about 10 plans that fit the fuel. A child without paper will guess, and guessing costs about 4 more trips. That is the lesson, but it may also be the end of their patience.
- **Do they look at fuel by the second trip?** If not, the loss line is not landing.
- **The gift after buying.** A child who buys the stone with 430 gems is left with 10, and the Council sends 100. Kind, but it softens the cost.
- **Not tested on a real iPad.** The pictures are from a desktop browser at iPad sizes.

## 7. A message for the main thread (paste it)

> From the trade thread. The market is built: https://christopherfi-dev.github.io/galaxy_math_quest/trade/ (`docs/trade/index.html`). The piece is `GMQTrade`, between the GMQ TRADE markers. How to wire it in, in order, with the tests: `proposals/GMQ_Trade_Wiring_v1_2026-11-24.md`. Three things for you: (1) the small worlds lose their way in (version 97's "Land on" buttons lived in the trade plan); my pick is that a planet you have sold to can be landed on (`GMQTrade.visited`). (2) `galactic_trade_test.js` and the trader step of `lantern_chain_test.js` must change: the glow stone is now sold on Planet R for 300 gems, through the market. (3) The glassmaker's line and `tradeStone()` still say 200 gems at the beacon. Checks: `trade_market_check.js` (20,000 seeds) and `trade_market_test.js` (three sizes) both pass.
