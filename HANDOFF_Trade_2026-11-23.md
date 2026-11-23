# Handoff: the trade thread (Galactic Trade, rebuilt as a market)

**Date:** 23 November 2026. **From:** the main thread. **For:** a new Claude Code session whose only job is to **rebuild Galactic Trade as a market**, on a page of its own.
Everything here is **[Proposal]** unless it says [Source].

---

## 0. Start here

1. `CLAUDE.md` loads by itself. Every rule applies.
2. Read this file to the end.
3. Then read, in this order:
   - `proposals/GMQ_Trade_Rethought_v1_2026-11-23.md`: **the design you build.** It is short.
   - `HANDOFF_2026-11-20.md`, sections 2b (who owns which file) and 3 (Marc's rules, learned the hard way).
   - In `INFO_FROM_MARC.md`, search for "Rethink Galactic Trade" and "a trade thread". Read those two entries only.
4. **Before you build anything, tell Marc in three lines** what you understand your job to be. Then build. He said: "We can do your idea, see how it works."

---

## 1. Your job, in one paragraph

Build **Galactic Trade as the galaxy's market**, on its own page: `docs/trade/index.html`, live at https://christopherfi-dev.github.io/galaxy_math_quest/trade/ . A child trades because they **need** something: first a glow stone, sold on a far planet. Each trip is one decision: **which offers are worth the fuel?** The child rounds to estimate before flying, and counts exactly on landing. Every number stays **within 1,000**. When it works, the main thread wires it into the game, in place of the old trading season, the way it wired in the Voltara fly-in.

---

## 2. Your limits. Each one has been learned the hard way.

| Rule | Why |
|---|---|
| **Your files:** `prototypes/trade*.html`, `docs/trade/*`, `checks/trade_*`, `proposals/GMQ_Trade_*` (new notes only, after the design note), this handoff, and **lines added at the end** of `INFO_FROM_MARC.md` and `checks/RUN_ALL.md`. | Several threads push to one branch. Each file has one owner. |
| **Never edit** `prototypes/kis_station_sketch.html` (the game), `docs/index.html` (the class link), `docs/next/` (the preview), `HANDOFF_2026-11-20.md`, the plan, the zip, or any other thread's files. | The main thread owns them. It wires your page in. |
| **You may push your own files** to `claude/trusting-edison-vl78nc`. Before every push: `git fetch origin claude/trusting-edison-vl78nc && git merge --no-edit FETCH_HEAD`. Never force-push. | Marc wants every thread's notes on the main branch, so the others can read them. |
| **`INFO_FROM_MARC.md` clashes on almost every merge.** Keep both sides: the other thread's lines first, then yours. Never drop a line. | It happened many times on 23 November. |
| **Write every message of Marc's at the end of `INFO_FROM_MARC.md`,** with the date, his words, and how you read them. No children's names: the repository is public. | His rule 15. |
| **Do not make his decisions.** Where the design leaves a choice, build on the note's pick, mark it **[pick]**, and tell him. | |
| **The full test run of the game is paused.** You do not need it. Run your own checks and your own play test. | It takes 35 minutes or more. |
| **Avoid `?.` and `??`** in your code. Older school iPads cannot read them, and the whole page stops. | Version 91 fixed this in the game. `node checks/parse_check.js docs/trade/index.html` catches it. |

---

## 3. How Marc works with a thread

- **He writes by voice, on a phone, often while teaching.** Words come out wrong. Say how you read them.
- **He carries messages between threads by hand.** A message that begins "From the main thread" is that thread's words, passed on by him.
- **Short replies. Plain English. Short sentences. Lists.** Lead with what he asked.
- **He wants pushback.** If something in this handoff or the note is wrong for an eight-year-old, say so, with what you would do instead.
- **He pays for every turn.** Do not poll a background job. Do not re-read big files.

---

## 4. What Marc has decided [Source]

All 23 November 2026, unless marked.

1. **The 2023 task is not a script.** "2023 was just loose baked ideas... We can do better." Do not keep a rule for its own sake.
2. **The market, the note's option A:** "We can do your idea, see how it works."
3. **Rounding can stay:** "the idea of rounding kinda still works." In the note it is the trader's quick estimate before a trip.
4. **The glow stone on a far planet,** bought with trade profits: "the only way to get that is by doing the correct trade with other planets that eventually get us enough profits so we can actually afford to go get that."
5. **Not ratios.** Choosing by "pay 3, get 8 against pay 7, get 16" was too hard. Grade 3 compares by taking away. (Ratios can come later, for Grades 5 and 6.)
6. **The child does the adding** (21 November): "Never show the adding for the child." No running totals, no worked sums, no total that fills up as offers are chosen.
7. **Story first** (CLAUDE.md): the child is told why before any maths.
8. **The picture shows the task** (21 November): what the child works on fills the picture. The desk holds only words, boxes and buttons.
9. **Mistakes show themselves** (22 and 23 November): a bad trip comes home poorer, and the child sees why.
10. **Struggle is the point** (19 November): a big task is an open problem, with nudges only when asked, and never a number of the answer in a nudge.
11. **Children know it is a story** (21 November): no need to soften it.
12. **Grams are fine; anything in AERO Grade 3 may be taught.**

---

## 5. What to build

### 5a. The story, told first

- **Voltara's Energy Council calls the ship** [Source: Marc's Task 2 page: "they have sent out a galaxy-wide SOS! They're low on essential supplies"]. "Our city is low on supplies. Will you trade for us? Your hold is full of Voltaran goods."
- **The goal is shown at once, as a price list,** so every trip has a reason (the note, section 4). For a first build:
  - **a glow stone**, on a far planet: 300 gems, plus the fuel to get there;
  - **supplies for Voltara**: 500 gems **[pick]**.
  - The Power Module, Marc's 2023 reward, waits on his decision 1 in the plan (lasting upgrade, or a card for one battle). Show it on the list as "coming soon", or leave it out. **[pick: leave it out]**
- Keep it to a few sentences, a sentence or two at a time (his rule 7).

### 5b. A trip

1. **The trade board fills the picture.** Four to six offers, each pinned to its planet on the star map. Every number is in view. Nothing is "?".
   - "Planet B wants Voltaran fruit. It pays 240 gems. 40 light-years away."
2. **Fuel costs 2 gems for each light-year.** The trade beacon pulls the ship home for free, so a planet costs its distance once. (The game's version 97 tells children the same about the beacon. Keep it.)
3. **The hold carries 3 crates.** One crate for each offer. So a trip visits at most three planets. **[pick: 3; try 4 if 3 is too easy]**
4. **The first trip:** the Council lends 100 gems for fuel. **[pick; Marc has not chosen between a loan and free fuel]** After that, fuel comes out of the child's own gems.
5. **The child chooses offers** by tapping them on the board or on the map. No total appears.
6. **Before flying, the child estimates:** "About how many gems will you come home with?" Rounding to the nearest ten or hundred (3.NBT.1). The estimate is kept, not marked right or wrong.
7. **The ship flies** out to each planet and is pulled home. The picture shows it.
8. **On landing, the traders pay exactly.** The child works out what they came home with: paid in, minus fuel (3.NBT.2, 3.OA.8). Check, with "Not yet" and a nudge that holds no number.
9. **The estimate and the real count are shown side by side.** "You said about 400. You came home with 370. Close."
10. **A loss shows itself:** "Planet T paid 120. Your fuel cost 140. You came home 20 gems poorer."
11. **Buying:** when the child has enough, they fly to the far planet and buy the glow stone. Planning that trip is the big problem: "I have 370. The stone is 300, and the fuel is 120. Is that enough?"

### 5c. The worked example in the note (check it again in code)

The Council lends 100 gems.

| Offer | Pays | Light-years | Fuel |
|---|---|---|---|
| A | 180 | 20 | 40 |
| B | 240 | 40 | 80 |
| C | 130 | 10 | 20 |
| D | 290 | 50 | 100 |
| E | 150 | 30 | 60 |

B and C give the most (370). D pays the most and is not the best. A and B do not fit the fuel. Keep this shape in your rule: **the biggest pay is not always the best choice.**

### 5d. A finished example first (his rule 3)

Before the first trip, show one solved trip about something else: for example, a fruit seller on Voltara choosing two market stalls to visit with a cart and a few coins. Not about gems and fuel. It shows "pay minus cost, then compare".

### 5e. The numbers: a rule, not a table

Each child gets their own offers from a seed, like every other task in the game. Write the rule, then check it on **20,000 seeds** in `checks/trade_market_check.js`. It must hold:

- every number a child sees or computes is **within 1,000**;
- distances are tens (10 to 70), so fuel is 2 × a ten (3.NBT.3);
- on every trip there is **one best choice**, and **the biggest pay is not it** on at least half of the seeds;
- at least one offer on the far trips **loses gems** (pays less than its fuel);
- the glow stone can be bought after **two or three good trips**, never one, and never more than four;
- no trip leaves a child **unable to fly anywhere** (if it can happen, the Council lends fuel again, and the child is told);
- the estimate step: rounding each pay is a real choice (no pays already round).

Say in the check's output how many different boards there are across the 20,000 seeds.

### 5f. What to reuse

Copy what you need into your page; do not link to the game file. In the game (`prototypes/kis_station_sketch.html`), search for these by name:

| What | Where in the game |
|---|---|
| The star map with rings for each ten, and the planets' places | `drawTrade`, `trR`, `trPos`, `TR_ORDER`, `TR_COL` |
| The planets A to T and their distances | `TR` (Marc's Trade Data Sheet). Keep the letters and distances so the map looks the same and the small worlds still match. Make new pays within 1,000. |
| The ship, flying | `rocket`, and the flight in `drawTrade` (out along a line, pulled home with no flame) |
| The space background | `spaceBack` |
| A number line for rounding | `lineSvg` |
| Numbers with commas | `num` |
| The desk's look: eyebrow, story, question, fields, buttons, message | `toy(...)` calls, for example `tradeBrief` and `tradeSum` |
| Fonts and colours | the game's `<style>`: "Chakra Petch", "Andika", `INK` |

### 5g. How the main thread will wire it in

Build your page so the piece can be lifted out whole, like the fly-in:

- **Mark it:** everything the game needs sits between `/* ===== GMQ TRADE: start =====` and `/* ===== GMQ TRADE: end ===== */`.
- **One entry point:** `GMQTrade.open(host, state, done)`.
  - `host`: the game's functions the piece may call (`say`, `beep`, `card`, `give`, `has`, `save`, `toy`, `closeToy`, the canvas `cx`, `vw`, `vh`, `tNow`). Your page supplies stand-ins.
  - `state`: one object the game saves for the child (gems, trips done, items bought, the seed). Keep it small and plain.
  - `done(why)`: called when the child leaves.
- **Items it gives** use the game's item names: the glow stone is `'stone'`. The game's lantern chain (version 96) already uses it: the glassmaker takes a glow stone into the lantern.
- **Old saves:** children may have version 97's trading season, with up to 7,000 gems. **[pick: the market starts fresh, with the Council's loan; the old gems become a line in the ship's log, "Last season: 2,000 gems"]**. Marc decides; say so in your report.
- **Do not change the game.** Write a short note, `proposals/GMQ_Trade_Wiring_v1_<date>.md`: what the main thread must change, in order, with the test it must run.

---

## 6. Tests, before you say it is done

1. `node checks/parse_check.js docs/trade/index.html`.
2. `checks/trade_market_check.js`: the rule on 20,000 seeds (5e).
3. `checks/trade_market_test.js`: a play test with Playwright, as a child plays, at **iPad sideways (1180 × 745), iPad upright (820 × 1180) and phone (390 × 760)**:
   - the story first; the price list in view;
   - a wrong total, a wrong estimate, then right;
   - a trip that loses gems, and the words that say so;
   - a route too far for the fuel;
   - buying the glow stone after two or three trips;
   - closing the page and opening it again in the middle of a trip;
   - no running total anywhere (search the page's text for one);
   - kind words on every line the child sees.
   Chromium and Playwright are installed. Do not install them again. See `checks/voltara_landing_test.js` for how the game's tests launch, wait and take pictures.
4. **Look at every picture yourself,** at the three sizes. Check every word against the picture.
5. **An independent review** of the pictures and the words, by a helper that sees only `CLAUDE.md`, the note and your pictures. Fix what it finds.
6. Add a line for each new check at the end of `checks/RUN_ALL.md`.

---

## 7. Open choices for Marc (ask; build on the pick meanwhile)

| | Choice | Pick |
|---|---|---|
| 1 | The first trip's fuel: a loan from the Council, or free | a loan of 100 gems |
| 2 | The name of the far planet that sells the glow stone | his to give; until then, a letter from the map |
| 3 | How many crates in the hold | 3 |
| 4 | Supplies for Voltara: its price, and what the city shows afterwards | 500 gems; Voltara's windows light up |
| 5 | The Power Module | waits on the plan's decision 1 |
| 6 | Old saves with version 97's gems | the market starts fresh; the old season is kept in the log |

---

## 8. What could prove this wrong

- **Children pick by the biggest pay and never look at fuel.** Watch the second trip. If they never change, the loss line is not landing.
- **Estimating, then counting, feels like doing the sum twice.** If children are bored, estimate only on far trips.
- **Three crates may be too few to struggle.** Try four.
- **The glow stone becomes a chore** at the end of a long lantern chain. Voltara's tall-tree glow stone stays in the game as a second way.
- **Your own check can flatter your own rule.** Have one check that a child who always takes the biggest pay does worse than one who thinks.

---

## 9. When you are done, report to Marc in this shape

- What is built, and the link.
- What the checks found, with the numbers.
- What you looked at, at which sizes.
- What you chose without him (each **[pick]**).
- A short message for him to paste to the main thread: the page's link, the wiring note, and anything the main thread must decide.
