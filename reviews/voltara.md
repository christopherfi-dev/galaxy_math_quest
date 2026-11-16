# Review — Galaxy Numerix, Planet Voltara (Task 1, Task 2, Final Boss)

**Date:** 2026-11-16
**Reviewer:** review agent, Voltara area
**Stage:** review and verdict only. Nothing here is a redesign.

**Summary.** Voltara has three tasks, and all three ran in class from printed sheets. Each one is a good idea with sound Grade 3 maths at its centre: place value with blocks, rounding to 10 and 100, and adding and subtracting. But each one is two or three lessons long, not one. The source files also disagree with each other far more than the design docs say. The City List the site links to needs 2,220 energy units, not 1,940, so the class was 570 short, not 290. The scenario cards used in class are a different deck from the one in the place-template draft. The "Decision Matrix" is not a Numerix final boss at all; it belongs to the Data Handling quest. I found 24 errors, including one trading card that no student can carry out and a final boss that can push a student below zero. Every number below was recomputed in code.

**How claims are marked:** **[Source]** found in Marc's material. **[Proposal]** my suggestion. **[Conflict]** his sources disagree, or a source has an error. **[Assumption]** from the brief, because `INFO_FROM_MARC.md` is blank. **[Estimate]** my own judgement, not measured.

---

## 1. Verdict table

Budget used: one task = one 40-minute period **[Assumption]**. Typing limit: 3 numbers or one short sentence per answer **[Assumption]**.

| Task | What the student does | Est. minutes [Estimate] | Most typed in one answer | Verdict | One-line reason |
|---|---|---|---|---|---|
| **Task 1** Energy Council / Power-Up Challenge | Shares 1,650 energy among 21 places with base-ten blocks, then re-plans after 3 scenario cards | Class: 60–90. Template draft: 45–60 | Class: a sheet of about 80 written numbers. Draft: **9 numbers** | **split** | Three lessons in one (plan, build, adapt). 48 typed numbers in the draft. Marc must first pick a needs list, a supply and a card deck. |
| **Task 2** Galactic Trade | Rounds 20 planets' distances and profits, plans a 50-token trip, then 2–3 more trips with scenario cards | Class: 60–80. Trip 1 alone: 25–30 | 39 one-number rounding answers; a trip is 1–5 letters plus 2 totals | **split**, and **fix** the cards | Trip 1 is one clean lesson. Later trips are a second lesson. 1 card cannot be carried out, 2 need maths above Grade 3, 4 confuse tokens with gems. |
| **Final Boss A** The Ultimate Colony Commander (site version) | Rounds 23 numbers, then runs 3 rounds of trading, building and cards on a Profit/Loss sheet | Class: 75–95 | 18–27 numbers per round on the sheet | **split**, and **fix** | One round is about one period. Totals reach 10,800. The balance can go below zero. Every trade wins, so there is little to decide. |
| Final Boss B Galactic Fair (1,000 credits) | Splits 1,000 credits into 3 budgets, picks attractions, draws a map | Cannot estimate | 3 numbers | **not reviewable** | An alternative draft. Its Attraction Menu was never written, so it has no numbers. |
| "Decision Matrix" | Weights 7 criteria in percent and multiplies | — | — | **out of area; redo if used** | It is the Data Handling Quest 1 boss (Planet Zorgon), not Numerix. Percent and decimals, far above Grade 3. |

**Which verdicts would change**
- If one task may take a double period (80–90 minutes): Task 1 becomes **fix** (pick one version, cut the typing). Task 2 becomes **fix**. Boss A stays **split**, or becomes **shorten** to two rounds.
- If a final boss is allowed to be a multi-day project: Boss A becomes **fix** only.
- If the typing limit were 9 numbers: Task 1 c2 would pass the typing check but the task would still be 45–60 minutes.
- If Marc says the block work must stay hands-on (INFO item 9): Task 1 moves from group A to group B, and the 9-number checkpoint disappears. That changes the redesign more than the verdict.

---

## 2. Sources read, and every version found

### 2.1 Site pages (fetched 2026-11-16, text quoted exactly)

| Page | What it holds |
|---|---|
| `/the-universe/galaxy-numerix` | One line. It describes measurement, not numbers (world map §6 item 5 is right). |
| `.../quest-1-mission-voltara-power-up-challenge` | Mission briefing, three objectives. Titled "Quest #1 - Voltara Energy Crisis & Galactic Trade". |
| `.../task-1-mission-voltara-power-up-challenge` | Task 1. Links City List, Energy Count Sheet, City Map, City Map Key. States the supply. Rounds 1–3. |
| `.../task-2-galactic-trade-quest` | Task 2. Links Trade Data Sheet, Profit Sheet, Scenario Cards. |
| `.../final-boss` | Final Boss. Links Distance Data Sheet, Colony Needs Sheet, Profit/Loss Sheet, Scenario Cards, Metacognitive Reflection. |

### 2.2 Drive, "Numbers Universe" folder

| File | Folder | What it is | Status |
|---|---|---|---|
| City List | quest 1/Level 1 | The needs list the **site links to**. 21 places, total 2,220. States 1,650 supply. | Class version |
| Energy Count Sheet | quest 1/Level 1 | Block table (150, 70, 8, 0 = 1,650) and a 20-row plan table | Class version |
| City Map (2).pdf, Map Key (1).pdf | quest 1/Level 1 | Printed A3 map and key. Text layer only was readable. Key names match the City List. | Class version |
| City Power - Scenario Cards: | quest 1/Level 1 | **15** energy cards in a print table (deck D3). The Task 2 trading cards are pasted underneath. | Probably the printed deck |
| energy scenario cards | quest 1/Level 1 | **10** energy cards with a "what to do" line each (deck D2) | Variant |
| Level 1 | quest 1/Level 1 | ChatGPT planning chat. A different needs list (1,940), three supplies (2,000; 4,800; 2,020), 10 cards (deck D1) | Planning |
| City Sector Map | quest 1/Level 1 | ChatGPT sector breakdown with wrong totals, and drawing directions | Planning |
| Place Value and Resource Allocation Quiz | quest 1/Level 1 | 8-question quiz, 18 points | Not on the site |
| Galaxy Numerix - Quest 1 - Task 2 | quest 1/Level 2 | Site text plus the planning chat. Two older data sets, two older card lists. The Drive tool cut the text off at the very end, in the middle of a repeated list. | Planning |
| Task 2 - Galactic Trade Quest OVERVIEW | quest 1/Level 2 | Same as the site, but without the scenario-card line | Class version |
| Distance Data Sheet with Potential Profits | quest 1/Level 2 | The Trade Data Sheet: planets A–J and "Challenge Round" K–T | Class version |
| Profit Chart | quest 1/Level 2 | The Profit Sheet: 4 empty tables | Class version |
| Trading Scenario Cards: | quest 1/Level 2 | 15 trading cards | Class version |
| Distance Data Sheet | quest 1/Final Boss | 10 colonies, 3 worked examples | Class version |
| Colony Needs Sheet | quest 1/Final Boss | 10 buildings, 1 worked example | Class version |
| Profit Loss Sheet | quest 1/Final Boss | 4 round tables (in the order 1, 3, 2, 4), start +1600 | Class version |
| final boss - Scenario Cards: | quest 1/Final Boss | 10 cards, a plus and a minus each | Class version |
| Final Boss Quest 1 Numbers | Final Boss/other stuff | ChatGPT planning chat, "Galactic Expansion". Older numbers. | Planning |
| Scenario cards | Final Boss/other stuff | Older card values (+15 to +70) | Planning |
| Untitled document | Final Boss/other stuff | A half-made card sheet, "Residential Housing - 700" repeated | Scrap |
| Metacognitive Reflection | Final Boss/other stuff | 5 reflection questions, linked from the site | Class version |
| New numbers Quest 1 | Numbers Universe | An **earlier** quest: Star Mapping, City Sector Energy, Galactic Trade by barter, and the Galactic Fair boss | Earlier plan |
| Numbers Universe - Quest 1 | Numbers Universe | An **even earlier** quest: Number Nomads, Digit Delta, and a "Number Overlord" final battle | Earliest plan |
| Updated Quests - Numbers Universe. | Numbers Universe | Strand outline, Quests 1–5 and Advanced 1–5 | Curriculum |
| Number Universe Quest 2 | Numbers Universe | **Empty** | — |

### 2.3 Drive, elsewhere

| File | Where | Note |
|---|---|---|
| Decision Matrix | **Data Handling Universe**/Quest 1/Final Boss | See §6.4. Not a Numerix file. |
| Untitled document | same folder | Titled "Data Handling Quest 1: Final Boss Challenge". The Decision Matrix is its Task 2. |
| Things to Prepare - 1st Five, "October Prints" sheet | Space Station Initial quests | The print list. It confirms what was printed for Numbers Quest 1 (16 copies; 4 sets of each card deck). |
| Task 2 - Galactic Trade Quest OVERVIEW.docx, Trading Scenario Cards_.docx | outside the GMQ folder | Exports from September 2023 and May 2024. Same text as the Docs. |
| tasks / strand order; Pre-Requisite - Order of Strands | root | Curriculum reference |
| new quest | outside | Skip-counting "Operations". Not Voltara. Listed only. |
| Voltara Mission Control Data Sheet | outside | Belongs to Operation Stardust. Not opened. |

**Private folder seen by name only, not opened:** "Math Assessment Test" (in the root listing).

### 2.4 The versions, side by side

**Task 1 needs lists**

| Code | Source | Residential | Commercial | Industrial | Total | Places |
|---|---|---|---|---|---|---|
| N-A | "City List" doc, linked from the site | 750 | 880 | 590 | **2,220** | 21 |
| N-B | top of "Level 1" doc | 570 | 920 | 450 | **1,940** | 20 |
| N-C | "Level 1" end, "City Sector Map", "New numbers Quest 1" | 650 (stated) | 920 (stated) | 450 (stated) | **2,020** (stated) | 13 core + 11 extra |

**Task 1 supplies**

| Code | Source | Blocks | Total |
|---|---|---|---|
| S1 | Site Task 1 page | "150 of '1s' = 150 / 70 of '10s' = 700 / 8 of '100s' = 300 / Total: 1650" | 1,650 stated. The 300 is a typo for 800. Read literally the lines add to 1,150. |
| S2 | "City List" and "Energy Count Sheet" | 150 ones, 70 tens, 8 hundreds, 0 thousands | 1,650. Both docs print 800 correctly. |
| S3 | "Level 1" doc | 200 ones, 80 tens, 10 hundreds | 2,000 |
| S4 | "Level 1" doc, module text | 200 ones, 60 tens, 10 hundreds, 3 thousands | 4,800 (the doc gives no total) |
| S5 | "Level 1" doc | "exactly 2020 blocks" | 2,020 |

**Task 1 card decks**

| Code | Source | Cards | How a card works |
|---|---|---|---|
| D1 | "Level 1" doc (ChatGPT) | 10 | Changes what a sector **needs**. This is the deck in the place-template draft. |
| D2 | "energy scenario cards" | 10 | **Moves** blocks from one sector to another. 8 of 10 leave the total unchanged. |
| D3 | "City Power - Scenario Cards:" | 15 | The same moves as D2, plus 5 new cards. 12 of 15 leave the total unchanged. |

**Task 2 data:** first draft (3-digit distances, 1 token = 10 light-years); second draft (C = 27, I = 42 light-years and 1,108 profit); final sheet (C = 33, I = 45 and 1,408; plus K–T). An older, different task also exists: barter cards in "New numbers Quest 1" (strawberries for rocket fuel).

**Final boss:** four versions. A (site, "Ultimate Colony Commander"), with its planning draft A0 ("Galactic Expansion"). B (Galactic Fair). D ("Number Overlord", earliest). The "Decision Matrix" (C) is from another galaxy.

---

## 3. Task 1 — Mission Voltara: Power-Up Challenge (Energy Council)

### 3.1 Sources (checklist 1)

See §2. The class version is: site Task 1 page + City List (N-A) + Energy Count Sheet (S2) + printed map and key + a printed card deck (D3 or D2; I could not confirm which).

**[Conflict]** The design docs pair the site's supply with the wrong needs list. World map §6 item 1 says "The doc's City List needs total 1,940. So the site version is 290 short." The 1,940 list is the one typed at the top of the "Level 1" planning doc (N-B). The site links to a separate doc called "City List" (N-A), and that one totals 2,220. Its place names match the printed Map Key (Zoo, Supermarket, Bus Stop, Amusement Park, Gas Station, Solar Power Plant). So the class was **570 short (26% of needs unmet), not 290**.

**[Conflict]** The Energy Count Sheet does not match the City List. Its 20 rows carry the N-B names. 11 of those rows are not on the City List (for example Entertainment Zone, Chemical Lab, Research & Development). 12 City List places have no row with their name. Five are missing outright (Zoo, Supermarket, Amusement Park, Gas Station, Solar Power Plant). The other seven differ in wording (for example "Parks" against "Parks & Recreational Areas", "Factory" against "Manufacturing Plant").

### 3.2 Skill (checklist 2)

- **Strand:** Numbers Quest 1, Level 2: "Understanding and applying place value to partition and rearrange numbers up to 1,000" **[Source: tasks / strand order]**.
- **What the task really exercises:** adding up to 21 three-digit numbers and keeping the total at or under 1,650. That is Numbers Quest 2, Level 3 (three-digit addition with regrouping), which the strand order puts after Quest 1. Place value itself is practised only when the student builds amounts from blocks.
- **Above Grade 3:** nothing. Totals pass 1,000 (1,650 and 2,220), a little beyond the strand's "up to 1,000", but each place needs 250 or less.
- **[Conflict]** "Before you Begin" lists IXL C1 and C2, which are rounding skills. Task 1 has no rounding. The rounding is in Task 2.

### 3.3 Time (checklist 3) [Estimate]

Basis: a typical Grade 3 student, working alone, about 1 minute per written three-digit sum.

| Part (class version) | Minutes |
|---|---|
| Watch the video, read the City List (21 places) | 5–8 |
| Round 1: decide who goes without, fill the Energy Count Sheet | 15–20 |
| Round 2: put up to 228 blocks on the map, check the total | 15–20 |
| Round 3: 4 cards drawn, 3 applied. The site allows 5 minutes for the first. | 15–25 |
| Photo, upload, reflection video | 10–15 |
| **Total** | **60–90** |

Against the 40-minute budget **[Assumption]**: about two periods. The "Level 1" doc itself says "Time Required: Variable".

The place-template draft (typed): briefing and looking around 5; c1 5–8; c2 8–12; c3 three rounds at 7–10 each; c4 3–5. **45–60 minutes.** Over budget.

**So: is this one task? No.** It is three lessons: make a plan, build it in blocks, adapt to events and reflect.

### 3.4 Steps and typing (checklist 4)

Counted in `checks/voltara_t1_check.py`, part H.

- **Class version:** 21 places to decide. A 20-row sheet with blocks and units for each row, plus two totals: up to 82 written numbers. Up to 228 blocks to place. Then 3 cards, each changing 2 or 3 sectors.
- **Place-template draft:** c1 = 3 numbers. c2 = 9 numbers. c3 = three rounds of (3 + 9) = 36 numbers, plus one card choice and one "why" sentence. c4 = one sentence. **48 typed numbers and 10 answers if nothing goes wrong.** The largest answer is 9 numbers, three times the assumed limit. One wrong digit in c2 means retyping 9 numbers.

### 3.5 Reading (checklist 5)

Site Task 1 page: 504 words, 62 sentences, mean 8.1 words. 19 sentences (31%) are over 10 words.

- **Longest instruction a student must act on:** "You must decide how much energy goes to homes, stores, and factories on Planet Voltara." (15 words)
- **Longest sentence on the page:** "Your well-thought-out decisions ensure that Voltara thrives, and you've honed valuable skills in resource management and adaptability." (17 words)
- **Mission steps** are short and clear ("Check: Make sure you didn't give away too much energy.").
- **Hard words on the page:** allocation, prioritize, sectors, unforeseen scenarios, resource-efficient, adaptability.
- **Hard words on the cards:** "Innovation in Energy Efficiency", "Implementation of Public Transport", "Cybersecurity Breach", Residential, Commercial, Industrial. Card stories are friendly ("Hooray! Scientists invented a machine that uses less energy."), but the titles are adult.

### 3.6 Maths check (checklist 6)

Run: `python3 -I checks/voltara_t1_check.py` (about 2 minutes).

**Needs and supplies, recomputed**

- N-A: 750 + 880 + 590 = **2,220**. N-B: 570 + 920 + 450 = **1,940**.
- N-C: the doc's own items do not add to its totals. Residential items sum to 550 (stated 650). Commercial 820 (stated 920). Industrial 400 (stated 450). The "excess" figures are also wrong: 120 not 170, and 180 not 230.
- Supplies: 150 + 700 + 800 = 1,650. 200 + 800 + 1,000 = 2,000. 200 + 600 + 1,000 + 3,000 = 4,800.

**The world map's three supply versions: confirmed, with one correction**

| World map says | Result |
|---|---|
| Site: 1,650, with "8 of '100s' = 300" a typo for 800 | **Confirmed.** The City List and Energy Count Sheet both print 800. |
| "Level 1" doc: 200, 80, 10 = 2,000 | **Confirmed.** |
| Module text: 200, 60, 10, 3 thousands = 4,800 | **Confirmed.** The doc gives no total. |
| City List needs 1,940; site version is 290 short | **Corrected.** That is the "Level 1" list. The site-linked City List needs 2,220. The class was 570 short. |
| "The 2,000 version has 60 to spare" | **Confirmed**, but only against the 1,940 list. Against the City List it is 220 short. |

A fourth supply exists: "exactly 2020 blocks", meant to match the 650/920/450 needs exactly.

**Every pairing**

| Needs | vs 1,650 | vs 2,000 | vs 2,020 | vs 4,800 |
|---|---|---|---|---|
| N-A 2,220 | 570 short | 220 short | 200 short | 2,580 spare |
| N-B 1,940 | 290 short | **60 spare** | 80 spare | 2,860 spare |
| N-C 2,020 | 370 short | 20 short | 0 spare | 2,780 spare |

"Spare" means every place can be powered. Then there is nothing to choose and the task is trivially easy.

**Every scenario card, every deck** (change to needs R / C / I, change to supply, change to the shortage)

| Card | D1 (template draft) | D2 | D3 |
|---|---|---|---|
| Solar Flare Impact | supply −300 → shortage +300 | same | same |
| Innovation in Energy Efficiency | −50 / −50 / −50 → −150 | same | same |
| Earthquake | R +100 → +100 | R +100, C −100 → 0 | as D2 |
| Commercial Boom | C +150 → +150 | R −75, C +150, I −75 → 0 | as D2 |
| Industrial Strike | I −100 → −100 | R +50, C +50, I −100 → 0 | as D2 |
| Festival Time | R +50, C +50 → +100 | R +50, C +50, I −100 → 0 | as D2 |
| New Factory Built | I +200 → +200 | R −100, C −100, I +200 → 0 | as D2 |
| Public Transport | C −30 → −30 | C −30, I +30 → 0 | as D2 |
| Heatwave | R +70 → +70 | R +70, I −70 → 0 | as D2 |
| Tourist Season | R +20, C +50 → +70 | R +30, C +40, I −70 → 0 | R +20, C +50, I −70 → 0 |
| Cybersecurity Breach | — | — | C −50, I +50 → 0 |
| School Science Fair | — | — | Schools +30, Parks −30 (both Residential) → 0 |
| Green Energy Investment | — | — | supply +300 → −300 |
| Hospital Emergency | — | — | Hospital +50, Schools −25, Office Complex −25 → 0 |
| Park Renovation | — | — | Parks −10, Neighborhood 1 +5, Neighborhood 2 +5 → 0 |
| **Best 3 cards / worst 3 cards** | −280 / +650 | −150 / +300 | −450 / +300 |

**Every Round 3 draw.** The site's Round 3 is: one card, then two cards (keep one), then a final card. That is 2,520 draws for a 10-card deck and 16,380 for the 15-card deck. Result for each pairing:

| Pairing | Deck | Shortage after the cards | Draws where the shortage is gone whichever card is kept |
|---|---|---|---|
| **N-A vs 1,650 (class)** | D1 | 290 to 1,220 | 0 |
| **N-A vs 1,650 (class)** | D2 | 420 to 870 | 0 |
| **N-A vs 1,650 (class)** | D3 | 120 to 870 | 0 |
| N-B vs 1,650 (world map pairing) | D1 | 10 to 940 | 0 |
| N-B vs 1,650 | D3 | −160 to 590 | 1,716 (10.5%) |
| N-B vs 2,000 ("Level 1" pairing) | D1 | −340 to 590 | 242 (9.6%); and it starts with 60 spare |
| N-B vs 2,000 | D2 | −210 to 240 | 1,512 (60.0%) |
| N-B vs 2,000 | D3 | −510 to 240 | 12,480 (76.2%) |
| N-C 2,020 vs 2,020 | D1 | −280 to 650 | 126 (5.0%) |
| any needs vs 4,800 | any | always spare | all (100%) |

**Card sequences that make the task trivially easy**
1. **The "Level 1" pairing (1,940 needs, 2,000 supply) is easy before any card.** 60 units are spare.
2. **The 4,800 supply is always easy.** No card sequence comes close to using it up.
3. **N-B vs 1,650 with deck D3:** Innovation in Energy Efficiency plus Green Energy Investment leaves 160 spare. 10.5% of draws force this.
4. **The class pairing (2,220 vs 1,650) never becomes easy,** with any deck. It is the only pairing that keeps the task's point ("we only have so much energy to share") under every draw.
5. **In decks D2 and D3 most cards need no decision.** 8 of 10 (D2) and 12 of 15 (D3) cards just say "move this many blocks from here to there". The student follows the instruction. Only Solar Flare, Energy Efficiency and Green Energy make the student choose.

**Card sequences that make the task impossible**
1. **No sequence drives a need or the supply to zero or below** in any fixed version (lowest need after 3 cards: 175; lowest supply: 850, and that only if the site typo is read literally).
2. **Deck D2/D3 cards can ask for blocks that are not there.** Industrial Strike (−100), Festival Time (−100) and Heatwave (−70) can all land on one student with no way to dodge: 270 units out of Industrial. A student who gave Industrial less than that is stuck. With the plan "homes and shops first" (R 750, C 880, I 20) a card cannot be carried out in 61% (D3) to 79% (D2) of draws. With balanced plans it never happens. With "shops last" (C 150) it happens in about 1% of draws.
3. **Three D3 cards name places that are not on the City List:** "Parks & Recreational Areas" and "Office Complex". (The City List says "Parks" and "Office Buildings".)
4. **Heatwave in D2 contradicts itself:** the effect says "+70 to Residential", the instruction says "add them to the Commercial sector".
5. **Site typo read literally (1,150 supply):** Solar Flare leaves 850 against 2,220 needed. Not impossible, but 62% of the city goes dark.

### 3.7 Checkpoints (checklist 7)

| Step | Kind (template §3.3) |
|---|---|
| Round 1, the plan | conditions (total within supply; no place over its need) |
| Round 2, the blocks | **hands-on result** if real blocks are used; conditions if typed |
| Round 3, each card | conditions, with the card's change applied |
| Which of the two cards, and why | saved for the teacher; code cannot mark the "why" |
| Photo and reflection video | teacher-confirmed |

### 3.8 Per-student numbers (checklist 8)

**The reference script.** `python3 -I reference/voltara_number_rule_check.py` prints:

```
unbuildable plans found: 0
```

**What that script does not test**
1. **Scenario cards.** None at all. The template says so too.
2. **Whether the shortage survives the cards.** The draft's SOLVABLE line says "supply is always less than total needs". With deck D1 that is false after some cards (see below).
3. **The class decks D2 and D3.** They move 75, 25 and 5 units. Sector totals stop being multiples of 10, and the script's "ones act as groups of 10" shortcut no longer holds.
4. **Whole-number plans.** The script only tries multiples of 10. Template c1 accepts "whole numbers".
5. **Proof.** It samples 30 random plans per student. That shows the common case, not "any plan". A hand-built case inside the rule's own ranges fails: needs 410 / 710 / 300, supply 1,120, blocks 9 hundreds, 12 tens, 100 ones. The plan 90 / 90 / 90 cannot be built. The chance of meeting it is about 1 in 7^20, so no sample will ever find it.
6. **Sensible block counts.** The rule gives 6.7% of students more than 99 tens rods (up to 132), and up to 300 ones.
7. **A seed per student.** It uses one random stream for all 20,000, so a failing student cannot be replayed.
8. **The right needs list.** It starts from N-B (1,940), not the site-linked City List (2,220).
9. **Typing and time.** Out of its scope.

**The extended check** (`checks/voltara_t1_check.py`, part F). Same generator, one seed per student, 10,000 seeds, every set of 1, 2 or 3 D1 cards (1,750,000 card states), Solar Flare taking 3 hundred-blocks as the template proposes:

| Check | Result |
|---|---|
| A need at or below 0 after cards | 0 |
| Supply or hundreds run out | 0 |
| Hardest plan cannot be built after cards | 0 |
| **Supply ≥ total needs after cards** | **13,587 states. 8,194 students (81.9%) have at least one such card set.** |
| Which card sets | Energy Efficiency + Industrial Strike (53.9% of students); those two + Public Transport (81.9%) |
| Share of (student, draw) pairs where the student can pick their way to "no shortage" | 1.37% |

So the draft rule is safe to build from, but it does not keep its own promise once cards are drawn.

**Proposed rule [Proposal]** (tested, part G):
- **Needs:** each place = its source value plus one of −30 to +30 in tens, never below 10.
- **Shortfall:** the largest relief any 3 cards can give (D1 280, D2 150, D3 450), plus 50 to 200 in tens. So the student is always short, even after the luckiest cards.
- **Supply:** total needs minus shortfall.
- **Blocks:** ones 100–150 in tens; tens 40–89; hundreds make up the rest, at least 4. Tens and ones together are worth at least 500. Three sector amounts can never need more than 297 in tens and ones, so every plan can be built. This is a proof, not a sample.
- **Supply cards** add or remove hundred-blocks.

Result on 10,000 seeds, for both needs lists and all three decks:

| Needs base | Deck | Card states | Plans built | Result |
|---|---|---|---|---|
| N-A City List | D1 | 1,750,000 | 3,610,000 | PASS |
| N-A City List | D2 | 1,750,000 | 3,610,000 | PASS |
| N-A City List | D3 | 5,750,000 | 11,610,000 | PASS |
| N-B "Level 1" | D1 | 1,750,000 | 3,610,000 | PASS |
| N-B "Level 1" | D2 | 1,750,000 | 3,610,000 | PASS |
| N-B "Level 1" | D3 | 5,750,000 | 11,610,000 | PASS |

Shortage after cards stays between 50 and 1,130. The rule does **not** fix "a card asks for blocks the sector does not hold" (§3.6). That depends on the student's plan, so it needs a rule of play, not a number rule. Marc decides.

### 3.9 Hands-on (checklist 9)

The handoff puts Voltara in **group A**. **[Conflict with the source]** The class version is built on real base-ten blocks: 150 ones, 70 tens and 8 hundreds on a printed A3 map. The template itself says "The place-value maths sits in c2." Handling the blocks is the place-value learning, so on the handoff's own test this is **group B**. Typing nine block counts is a thin copy of it. Marc's answer to INFO item 9 decides this.

### 3.10 Verdict (checklist 10): **split**

- **Why:** 60–90 minutes in class; 45–60 minutes and 48 typed numbers in the draft; one answer of 9 numbers.
- **What works and should stay:** scarcity (570 short forces real choices), the three sectors, the city of named places, cards that change the plan.
- **What Marc must pick first** (these are his decisions): the needs list (N-A is the class one); the supply (1,650 keeps the task meaningful under every draw); the deck (D1 changes needs and forces choices; D2/D3 mostly just move blocks); whether blocks stay real.
- **What would prove this verdict wrong:** if the class finished Task 1 in one period in 2023–24. Marc knows; I do not.

---

## 4. Task 2 — Galactic Trade Quest

### 4.1 Sources (checklist 1)

See §2. Class version: site Task 2 page + Trade Data Sheet + Profit Chart + 15 Trading Scenario Cards. The story opens "We've just left Planet Voltara", so it happens in space (world map is right).

**[Conflict]** The page calls trips 2 onward the "Final Boss Challenge". That is not the Final Boss page; it is the second half of Task 2.

**[Conflict]** "You can do a total of 3 trips", but the materials line says cards are "For rounds 2-4", and the Profit Chart has 4 tables. So the task is 3 trips or 4.

**[Conflict]** The objective says "make the most **fuel tokens**". The prize is for "the most **Galactic Gems**". The Trade Data Sheet is described as listing "what you can trade at each planet for fuel tokens", but it lists gems.

### 4.2 Skill (checklist 2)

- **Strand:** Numbers Quest 1, Level 3: "Rounding numbers to the nearest 10 and 100." A good match. IXL C3 and C4 fit.
- **Slightly beyond the strand:** 3 of the 10 round-1 profits and 7 of the 10 challenge profits are four-digit numbers (up to 3,129). The strand level stops at 1,000.
- **Above Grade 3:**
  - **Cosmic Taxes:** "Lose 10% of your total profits so far." Percent.
  - **Wormhole Discovery:** "Cut the distance to a planet in half." Half of the sheet distance is not a whole number for 10 of the 20 planets (33 → 16.5).
  - **Buying fuel:** "1 Fuel Token for 20 Galactic Gems". Dividing 2,000 by 20 is beyond Grade 3 division facts. It works as "5 tokens for every 100 gems", but the page does not say that.

### 4.3 Time (checklist 3) [Estimate]

| Part | Minutes |
|---|---|
| Video, read the sheet | 5 |
| Round 19 numbers on the first sheet (about 30 seconds each) | 8–10 |
| Plan and record trip 1 | 8–10 |
| Round 20 more numbers (challenge sheet) | 8–10 |
| Each later trip (2 or 3 of them): buy fuel, plan, draw a card, adjust, record | 10–12 each |
| Photo and reflection video | 10 |
| **Total** | **60–70 with 3 trips; 70–80 with 4** |

Trip 1 alone, with its rounding: **25–30 minutes.** That fits one period.

### 4.4 Steps and typing (checklist 4)

- **Rounding answers:** 19 on the first sheet (Planet A's distance is given), 20 on the challenge sheet. **39** in all.
- **Profit Chart:** a likely trip fills 3 rows of 3 boxes plus 2 totals = 11 numbers. Four trips = 44.
- **About 86 written numbers** in a typical run.
- **Typed world:** each rounding answer is 1 number (or 2 per planet). A trip is a list of 1–5 planet letters plus 2 totals. No single answer breaks the 3-number limit, but there are a lot of answers.

### 4.5 Reading (checklist 5)

Site Task 2 page: 557 words, 61 sentences, mean 9.1 words. 27 sentences (44%) are over 10 words.

- **Longest instruction:** "A Deck of Scenario Cards - For rounds 2-4, these will help you see how random events can ruin the best-planned routes." (22 words)
- **Longest sentence:** "Your Galactic Gems will go a long way in procuring advanced ship parts, and who knows, maybe one day you'll sit on the Galactic Council." (25 words)
- **Hard words:** Embargo, Scarcity, Investors, Quantum Glitch, profit, procuring, unforeseen, strategic.
- **Cards** are short (one line plus a joke line). Good.

### 4.6 Maths check (checklist 6)

Run: `python3 -I checks/voltara_t2_check.py`. Rounding uses the school rule, "5 rounds up". Python's own `round()` gives 0, 20 and 40 for 5, 25 and 45, so it must not be used in the server.

**The real numbers, rounded**

| Planet | Distance → rounded | Profit → rounded | Gems per token |
|---|---|---|---|
| A | 12 → 10 | 507 → 500 | 50.0 |
| B | 26 → 30 | 812 → 800 | 26.7 |
| C | 33 → 30 | 1209 → 1,200 | 40.0 |
| D | 18 → 20 | 459 → 500 | 25.0 |
| E | 44 → 40 | 1004 → 1,000 | 25.0 |
| F | **5 → 10** | 307 → 300 | 30.0 |
| G | 22 → 20 | 709 → 700 | 35.0 |
| H | **25 → 30** | 756 → 800 | 26.7 |
| I | **45 → 50** | 1408 → 1,400 | 28.0 |
| J | 17 → 20 | 608 → 600 | 30.0 |
| K | 37 → 40 | 1337 → 1,300 | 32.5 |
| L | 53 → 50 | 889 → 900 | **18.0** |
| M | 28 → 30 | 467 → 500 | **16.7** |
| N | 66 → 70 | 3129 → 3,100 | 44.3 |
| O | 52 → 50 | 2764 → 2,800 | 56.0 |
| P | 71 → 70 | 1583 → 1,600 | 22.9 |
| Q | 48 → 50 | 945 → 900 | **18.0** |
| R | 59 → 60 | 2221 → 2,200 | 36.7 |
| S | 41 → 40 | 1896 → 1,900 | 47.5 |
| T | 64 → 60 | 1007 → 1,000 | **16.7** |

- **Three distances sit exactly halfway (5, 25, 45).** They need the "5 rounds up" rule. A child without it has no way to decide.
- **Four challenge planets (L, M, Q, T) lose gems** once fuel costs 20 gems a token. That is a nice trap, if it is meant.

**Trip 1 (50 free tokens, each planet once)**
- 49 different plans fit. 21 of them use exactly 50 tokens.
- **Best: A + C + F = 2,000 gems**, using all 50 tokens. Next: C + G = 1,900.
- A child who does not round also lands on A + C + F (12 + 33 + 5 = 50 exactly) with 2,023. So the sheet cannot tell a child who rounded from one who did not, by the plan alone.
- **Not stated:** whether a planet may be visited twice. If it may, five trips to Planet A earn 2,500.

**Later trips, best play, no cards**

| Rule assumed | Trip 2 | Trip 3 | Trip 4 |
|---|---|---|---|
| Later trips use K–T only | O + S, 90 tokens → 4,900 | N + O + R + S → 10,500 | K + N + O + P + R + S → 16,800 |
| Later trips use A–T | A + O + S → 5,200 | → 11,700 | → 20,500 |

Totals pass 10,000 by trip 3. That is five-digit addition, well past the strand's 1,000.

**The 15 cards, on the best trip-2 plan (O + S, 4,900 gems)**

| # | Card | Effect, recomputed |
|---|---|---|
| 1 | Galactic Festival: double one planet's profit | 7,700 (+2,800) |
| 2 | Space Pirates: lose one planet's profit | 2,100 (−2,800) |
| 3 | Wormhole Discovery: halve one distance | Not a whole number for 10 of 20 sheet distances |
| 4 | **Fuel Price Surge: lose 100 fuel tokens** | **Cannot be carried out.** See below. |
| 5 | Solar Flare: "Lose half of your fuel tokens from one planet." | Wording unclear. Fuel tokens do not come from a planet. |
| 6 | Meteor Shower: +20 light-years to one planet | Plan needs 110 tokens; costs 400 gems more |
| 7 | Trade Embargo: lose the farthest planet's profit | 2,100 (−2,800) |
| 8 | New Engine Tech: +50 tokens | Worth 1,000 gems of fuel |
| 9 | Alien Investors: double the lowest planet's profit | 6,800 (+1,900) |
| 10 | Black Market Boom: "Add 200 tokens to your profits" | 5,100 (+200) if gems are meant |
| 11 | Cosmic Taxes: lose 10% of total profits so far | 4,230 (−670). Percent. |
| 12 | Resource Scarcity: one planet pays nothing | 2,100 (−2,800). Same as card 2. |
| 13 | Galactic Holiday: +100 tokens for not trading | Worth 2,000 gems of fuel, but 4,700 profit is given up |
| 14 | Cosmic Windfall: "200 extra tokens" | 4,000 gems if fuel tokens; 200 if gems |
| 15 | Quantum Glitch: lose all tokens, gain 300 | A student with 100 tokens now has 300 |

- **Impossible card.** The best trip 1 earns 2,000 gems, which buys exactly 100 tokens. All 48 other trip-1 plans buy fewer. So on trip 2, "Lose 100 fuel tokens" leaves **every student with zero tokens or fewer**. Nobody can trade, and most would need a negative number.
- **Luck beats skill.** Best planner, no card, after trip 2: 4,900 gems. A student who earned only 1,000 on trip 1 but draws Quantum Glitch can reach 13,300 (300 free tokens, gems not yet spent). The Lucky Draw ship part goes to "the student with the most Galactic Gems", so the cards decide it, not the maths.
- **Tokens or gems?** Cards 10, 13, 14 and 15 say "tokens". The two copies of card 13 differ: the table says "100 extra fuel tokens", the list says "100 extra tokens".

**The older barter version** ("New numbers Quest 1", Level 3), recomputed:
- Goal 1 (spaceship) key says cards 1, 2, 4, 8, 9. **Wrong.** Card 8 needs 60 meteorite fragments, which only card 6 gives. The chain is 1, 2, 4, 6, 8, 9.
- Goal 5 (10 alien pets) is called "unachievable". **Wrong.** 6 pets rounded to the nearest 10 is 10, so the goal is reached.
- Rounding there creates goods from nothing (5 space tools become 10). This version was dropped, rightly.

### 4.7 Checkpoints (checklist 7)

| Step | Kind |
|---|---|
| Each rounded distance or profit | one answer |
| Trip plan (which planets) | conditions: each planet once, rounded fuel within tokens. The server works out the profit. |
| Trip totals (fuel used, gems earned) | one answer (2 numbers) |
| Tokens bought | one answer |
| Plan after a card | conditions again |
| Photo and reflection video | teacher-confirmed |

### 4.8 Per-student numbers (checklist 8)

They can vary. **Proposed rule [Proposal]** (part G of the script):
- **Round 1:** 10 planets. Rounded distances are a shuffle of 10, 10, 20, 20, 20, 30, 30, 40, 40, 50 (Marc's sheet has 10, 10, 20, 20, 20, 30, 30, 30, 40, 50). The sheet distance is the rounded distance plus −4 to +4, never 0. So **no halfway numbers** and nothing already round. Rounded profit = rounded distance × 30 to 50, at least 300; sheet profit = that plus −49 to +49, never 0.
- **Round 2:** 10 planets, rounded distances a shuffle of 30, 40, 40, 50, 50, 50, 60, 60, 70, 70. Three or four planets lose 100 or 200 gems at 20 gems a token (Marc's sheet has four).

Result: **10,000 seeds, PASS.** Checked for every seed: no halfway number; every planet needs rounding; 19 different plans use exactly 50 tokens; no round-1 planet loses gems; any trip that uses 40–50 tokens earns at least 1,200 gems, enough to reach round 2; gems always divide into whole tokens; round 2 has 3 or 4 losing planets and a profitable trip exists.

Marc's own sheet, against the same checks: 3 halfway numbers (F, H, I). His weakest 40–50 token trip earns 1,000 gems = 50 tokens, enough for round 2.

**Open for Marc:** whether to keep the three halfway numbers on purpose. They teach "5 rounds up", but they are the hardest items on the sheet.

### 4.9 Hands-on (checklist 9)

**Group A.** Paper was only the carrier. The planning draft used physical fuel tokens on a map; the final version lists "Fuel Tokens: You start with 50" with no print item, so I cannot tell whether real tokens were used.

### 4.10 Verdict (checklist 10): **split**, and **fix** the cards

- **Part 1 (rounding + trip 1)** fits one period and matches the strand exactly. Close to **keep**.
- **Part 2 (trips 2–4 with cards)** is a second lesson. Before it goes in: remove or change Fuel Price Surge; replace the percent and halving cards or restrict them; fix "tokens" against "gems"; say whether a planet can be visited twice; say 3 trips or 4; decide whether a prize should hang on card luck.
- **What would prove this wrong:** if Marc's class treated the trips as a multi-day game and enjoyed it, the length is a feature. Then the verdict is **fix** only.

---

## 5. Final Boss

### 5.1 Version A — "The Ultimate Colony Commander" (site; the version that ran)

**Sources (1).** Site Final Boss page + Distance Data Sheet + Colony Needs Sheet + Profit Loss Sheet + 10 scenario cards + Metacognitive Reflection. The print list confirms all four printed items. Reward **[Source]**: "Do a great job and upgrade your power module!"

**What happens [Source].** The student starts with 1,600 tokens.
- **Step 1:** round each colony's distance and profit to the nearest 100, and each building's cost to the nearest 10.
- **Step 2, round 1:** draw 2 cards and read them. Trade with Alpha, Beta or Gamma. Spend the rest on buildings. The teacher approves the plan. Draw 1 more card. Apply all 3: a plus if you own that building, a minus if you do not.
- **Rounds 2 and 3:** trade and build first, then draw 2 cards.
- **End:** final profit, counting the value of buildings. Then a written reflection.

**Skill (2).** Numbers Quest 1 Levels 2 and 3 (place value, rounding), plus Numbers Quest 2 Level 3 (three-digit addition and subtraction). Above the strand level or above Grade 3:
- **Four-digit rounding:** 11 of the 20 numbers on the Distance Data Sheet are 1,000 or more.
- **Totals up to 10,800** with best play (see below). The "place value blocks totaling 1600" cannot show them.
- **Signed numbers:** the Profit/Loss Sheet writes "( −320 )", "( −600 )", "( +900 )", "( +300 )" and asks for "Net Gain/Loss". A balance can fall **below zero** (see below). Negative numbers are above Grade 3.
- **Long sums:** one round's total can mean adding and subtracting 6 to 9 three- and four-digit numbers.

**Time (3) [Estimate].** Rounding 23 numbers 10–12 minutes. Round 1 with the teacher's approval 20–25. Rounds 2 and 3 15–20 each. Final total and 5 written reflection answers 15. **75–95 minutes.** The planning doc's own target was "60-90 minute". That is two to two and a half periods.

**Steps (4).** 23 rounding answers (3 colonies and 1 building are worked examples; 2 buildings are already round). Each round fills 6–9 rows of 3 numbers (18–27 numbers) and one long sum. 7 cards are drawn out of 10. 5 reflection questions.

**Reading (5).** Site page: 631 words, 67 sentences, mean 9.4 words; 26 sentences (39%) over 10 words.
- **Longest instruction:** "For Rounds 2 and 3, do the same thing again, except this time, you draw your 2 Scenario Cards after you have done your trades." (25 words)
- **Hard words:** Metacognitive Reflection, colonies, consequences, sustainable, judicious, potential profits, strategic investments.
- The rules are the hardest reading in the quest. The order of "draw, read, decide, trade, draw again, apply" changes between round 1 and rounds 2–3.

**Maths check (6).** Run: `python3 -I checks/voltara_boss_check.py`.

| Colony | Distance → cost | Profit → rounded | Net |
|---|---|---|---|
| Alpha | 630 → 600 | 943 → 900 | +300 |
| Beta | 833 → 800 | 1340 → 1,300 | +500 |
| Gamma | 955 → 1,000 | 1950 → 2,000 (halfway) | +1,000 |
| Delta | 1042 → 1,000 | 2025 → 2,000 | +1,000 |
| Epsilon | 1186 → 1,200 | 2155 → 2,200 | +1,000 |
| Zeta | 609 → 600 | 1123 → 1,100 | +500 |
| Theta | 754 → 800 | 960 → 1,000 | +200 |
| Iota | 846 → 800 | 1350 → 1,400 (halfway) | +600 |
| Kappa | 975 → 1,000 | 2343 → 2,300 | +1,300 |
| Pi | 1059 → 1,100 | 2211 → 2,200 | +1,100 |

The sheet's three worked examples (Alpha, Beta, Gamma) are correct.

| Building | Cost → rounded | Card: own it / do not |
|---|---|---|
| Housing | 325 → 330 (halfway) | +150 / −75 |
| Spaceport | 476 → 480 | +560 / −250 |
| Research Facility | 248 → 250 | +460 / −200 |
| Farming Domes | 365 → 370 (halfway) | +240 / −120 (card says "Farming Drones") |
| Solar Farms | 631 → 630 | +470 / −240 |
| Water Purification | 288 → 290 | +320 / −150 |
| Commercial Centers | 550 → 550 (no rounding needed) | +250 / −120 |
| Communication Towers | 150 → 150 (no rounding needed) | +415 / −210 |
| Recreation Facilities | 248 → 250 | +225 / −115 (card says "Parks") |
| Defense Systems | 462 → 460 | +330 / −125 |

All ten buildings cost 3,760. The student starts with 1,600.

Findings:
1. **The Profit/Loss Sheet's example is wrong.** It shows Housing "( −320 )". The Colony Needs Sheet's own example rounds 325 to "(330)". 330 is right.
2. **Every trade earns more than it costs** (+200 to +1,300). So "Profit/Loss" never shows a trading loss, Kappa is always the best buy, and there is no real trade-off between colonies. Buildings cost exactly what they are worth at the end. The only real decisions are which buildings to own before the cards land.
3. **Round 1, all 158 legal openings × all 120 sets of 3 cards (18,960 states):** cash afterwards runs from **200 to 3,000**. In 8.5% of states the student has less than 600 and cannot afford any trade in round 2.
4. **The balance can go below zero.** From the lowest state (Alpha; Defense, Research and Water built; cards Spaceport, Solar Farms, Communication Towers) the student has 200 and cannot trade. Two more bad cards give **−40** with one deck, or **−290** if cards go back in the deck.
5. **Numbers grow fast.** Best play with no cards: 2,600 after round 1, 5,400 after round 2, **10,800** after round 3.
6. **Five card amounts are not multiples of 10** (−75, +415, +225, −115, −125) while everything else on the sheets has been rounded to 10 or 100.
7. **[Conflict]** The site says 3 rounds. The Profit/Loss Sheet has 4 round tables, printed in the order 1, 3, 2, 4.

**Checkpoints (7).**

| Step | Kind |
|---|---|
| Each rounded number | one answer |
| Round plan (one starter trade, buildings within the tokens left) | conditions |
| "Show your Commander (your teacher) and have your plans approved" | teacher-confirmed |
| New total after cards | one answer |
| Final profit with buildings | one answer |
| Metacognitive Reflection (5 questions) | teacher-confirmed |

**Per-student numbers (8).** The two sheets can vary; Marc's ten cards can stay fixed. **Proposed rule [Proposal]** (part I): three starter colonies cost 600, 800 and 1,000 and each returns at least 900; seven more cost 600–1,200; every trade earns 200–1,300; ten building costs 150–630 totalling at least 3,000; no halfway numbers anywhere. **10,000 seeds, PASS.** After round 1 the cash is at least 200 for every legal choice and the three worst cards. The same bound holds for Marc's own sheet, where full enumeration finds exactly 200.

What no number rule fixes: rounds 2 and 3 can still fall below zero. That needs a rule of play (for example, a card can never take more than the student holds). Marc decides.

**Hands-on (9).** Mostly group A. The materials list "Place value blocks (1s, 10s, 100s) - Totaling 1600". If those were really used, round 1 has a group B part. After round 1 the blocks cannot keep up with the totals.

**Verdict (10): split, and fix.**
- One round is about one period. Three rounds plus 23 rounding answers plus a reflection is not.
- Fix before it goes in: the −320 example; "Farming Drones" and "Parks"; balances below zero; totals past 10,000; 3 rounds or 4.
- Keep: colonies, buildings with good and bad stories, cards shown before the choice in round 1 (the best idea in the quest, because it rewards reading), the Power Module upgrade.
- **What would prove this wrong:** if the class finished it in one double period and totals stayed small because most students bought buildings rather than trading. Marc knows.

### 5.2 Version A0 — planning draft "Galactic Expansion" ("Final Boss Quest 1 Numbers")

The ChatGPT chat that became version A. Older numbers: ten needs cards of 150–700, colonies Alpha–Kappa at 96–413 light-years, 1 token = 10 light-years, a 1,500 start. Recomputed:
- "Summing the energy required … equals 4,000 units." **It is 4,100.**
- "The sum of all potential profits … equals 6,050 units." **It is 6,770.**
- Rounded distances total 2,500 and 250 tokens: correct.
- Marc asks "so that would be 150 tokens?" ChatGPT answers "Correct … 1,500 Fuel Tokens". Both cannot be right.
- At 5 light-years a token it gives Alpha 25 tokens. 120 ÷ 5 = 24. (Beta 54 and Gamma 70 are right.)
- "Research Facility … Future projects cost 10% less energy." Percent. The printed card dropped this, rightly.
- A second set of needs cards (15–40 units) and "Level 2 Negative Scenarios" also sit in the doc. Neither was used.

### 5.3 Version B — "Building a Galactic Fair" ("New numbers Quest 1")

- **What it is:** split 1,000 Galactic Credits among Rides, Games and Food Stalls, "rounding to the nearest ten", total exactly 1,000. Pick attractions from a menu within each budget. Draw a fair map. Reflect.
- **Recomputed:** 5,151 valid budgets if a category may get 0; 4,851 if each gets at least 10. A conditions checkpoint, as handoff §5.3 already says.
- **Maths level:** at Grade 3. Three numbers, adding to 1,000.
- **Missing:** the Attraction Menu. The doc lists it under "Documents to Create". I searched Drive and found none. So steps 2 and 3 have no numbers.
- **Status:** an alternative draft that did not run. World map §6 item 3 is right. It is the only final boss here that would fit one period and the 3-number limit, **if** Marc wants it and writes a menu. That is his call.

### 5.4 Version C — "Decision Matrix"

- **[Conflict with handoff §8]** The handoff lists this as "Numbers final boss ('Decision Matrix' draft)". It is not. The doc sits in **Data Handling Universe / Quest 1 / Final Boss**. Its title is "Decision Matrix for Navigating to Planet Zorgon". The doc beside it is headed "Data Handling Quest 1: Final Boss Challenge" and lists the matrix as its Task 2. It belongs with Operation Stardust.
- **Recomputed:** the weights sum to 100. The weighted totals 3.05, 3.0 and 4.0 are all correct.
- **Above Grade 3:** percent weights; percent × score giving decimals (0.75, 1.25); chance of collision in percent; "reduce crew morale by 10%".
- **Other faults:** after refuelling, all three paths need the same 250 gallons, so the fuel rows measure nothing. The event cards say "Path A is the only one with a fuel station" (C has two) and "Only Path A has a strong communication signal" (A is Low, C is High). All 9 event cards end "Mission terminated", whichever path was chosen.

### 5.5 Version D — "Confronting the Number Overlord" ("Numbers Universe - Quest 1")

The earliest plan, with Number Nomads and Digit Delta. It never reached the site. Recomputed: order 531, 315, 153 → 153, 315, 531. Round 456 to the nearest hundred → 500. Decode "@#$ \*@# \*(&" → 111, 115, 555. The key gives two symbols the value 100 (@ and ^) and two the value 10 (# and !). Step 4 has no numbers.

### 5.6 Which maths is above Grade 3, in one place

| Version | Above Grade 3 or above the strand level |
|---|---|
| A (site) | Signed numbers and possible negative balances; totals to 10,800; four-digit rounding (borderline) |
| A0 (draft) | "10% less energy" |
| B (Fair) | Nothing |
| C (Decision Matrix) | Percent, decimals, weighted scores, probability |
| D (Number Overlord) | Nothing; a 1,200 and a 1,101 appear in the alien messages |
| Task 2 cards | 10% tax; halving odd numbers; ÷ 20 |

---

## 6. Errors found

Each one was recomputed in the scripts named.

**Task 1** (`voltara_t1_check.py`)
1. **Site:** "8 of '100s' = 300". Should be 800. 150 + 700 + 300 = 1,150, not the 1,650 stated.
2. **"Level 1" / "City Sector Map":** "Residential Sector (Total: 650 units)". Its five items sum to 550.
3. **Same:** "Commercial Sector (Total: 920 units)". Items sum to 820.
4. **Same:** "Industrial Sector (Total: 450 units)". Items sum to 400.
5. **Same:** "Total Possible Requirement: 820 units (170 units excess)". Extras sum to 120; 650 + 120 = 770.
6. **Same:** "1150 units (230 units excess)". Extras sum to 180; 920 + 180 = 1,100.
7. **"Level 1":** "Total: 2000 energy units available" next to needs of 1,940: 60 spare, so nothing to choose. The same doc's module text gives blocks worth 4,800.
8. **Energy Count Sheet:** its rows do not match the City List (11 rows have no place; 12 places have no matching row).
9. **"energy scenario cards", Heatwave:** effect "+70 to Residential", instruction "add them to the Commercial sector".
10. **Same doc:** card numbered "45) Commercial Boom". Tourist Season is +40 / +30 here and +50 / +20 in the other deck.
11. **"City Power - Scenario Cards:":** three cards name places not on the City List. The Task 2 trading cards are pasted into the same doc.
12. **Site:** Task 1's IXL practice is rounding; the task has no rounding.

**Task 2** (`voltara_t2_check.py`)
13. **Fuel Price Surge, "Lose 100 fuel tokens":** cannot be carried out on trip 2 by any student (most they can hold is 100).
14. **Cosmic Taxes:** percent. **Wormhole Discovery:** half of 10 of the 20 sheet distances is not a whole number.
15. **Solar Flare:** "Lose half of your fuel tokens from one planet" has no clear meaning.
16. **Tokens against gems:** cards 10, 13, 14, 15; and the page's objective ("make the most fuel tokens") against its prize ("most Galactic Gems").
17. **Trips:** "a total of 3 trips" against "rounds 2-4" and 4 tables.
18. **"New numbers Quest 1", barter goals:** the spaceship key leaves out card 6; the "unachievable" pets goal is achievable.

**Final Boss** (`voltara_boss_check.py`)
19. **Profit/Loss Sheet:** Housing "( −320 )" should be −330.
20. **Scenario cards:** "Farming Drones" (sheet: Farming Domes); "Parks" (sheet: Recreation Facilities).
21. **Rules:** a balance can fall below zero (−40, or −290).
22. **Rounds:** site says 3; sheet has 4, in the order 1, 3, 2, 4.
23. **"Final Boss Quest 1 Numbers":** sums stated as 4,000 and 6,050 are 4,100 and 6,770; "150 tokens" confirmed as "1,500 Fuel Tokens"; Alpha 25 tokens should be 24.
24. **"Decision Matrix" companion doc:** two event cards contradict the path data (fuel stations; signal strength).

---

## 7. Where this review disagrees with the design docs

| Design doc | It says | What the sources show |
|---|---|---|
| World map §6 item 1 | "The doc's City List needs total 1,940 … 290 short" | The site-linked City List totals 2,220. 570 short. 1,940 is a list inside the "Level 1" planning doc. |
| World map §6 item 1 | Three supply versions | Four. "exactly 2020 blocks" is also in "Level 1". |
| Place template §4.2 | Needs "from the 'Level 1' doc (Residential 570, Commercial 920, Industrial 450)" | That is the planning list. The class list is 750 / 880 / 590. |
| Place template §4.2 | "Scenario deck: the 10 cards in the 'Level 1' doc" | Two later decks exist (10 and 15 cards) and work differently: they move blocks between sectors. The draft uses the planning values, not those of either later deck. |
| Place template §4.2 | "SOLVABLE: supply is always less than total needs" | Not true once cards are drawn. 81.9% of students have at least one set of cards that removes the shortage (deck D1). |
| Place template §4.4 | "Every plan could be built" (20,000 students) | True in the sample. A hand-built case inside the ranges fails. |
| Handoff §6 | Voltara is group A | Task 1's place-value learning is in handling real blocks. Group B fits better. Marc decides. |
| Handoff §8 | "Numbers final boss ('Decision Matrix' draft)" | The Decision Matrix is the Data Handling Quest 1 boss (Planet Zorgon). |
| Handoff §10 | Voltara as pilot: "It ran in class" | True. But as it ran it is about 5–7 periods **[Estimate]**, and its sources conflict in many places. A pilot would first need Marc's picks in §3.10. |
| World map §3.1 rule 3 | Patternox needs "Quest 2 in the Numbers Universe" | Confirmed missing: the Drive doc "Number Universe Quest 2" is empty. |

---

## 8. Could not read or find

1. **City Map (2).pdf and Map Key (1).pdf:** the Drive tool returned the text layer only ("city map / Commercial / Residential / Industrial" and the list of key names). I could not see the picture, so I cannot say whether the map prints numbers.
2. **The three Loom videos** (Task 1, Task 2, Final Boss directions). Not opened. They may settle rules the pages leave open: visiting a planet twice, 3 or 4 trips, which later-trip planets are allowed.
3. **Which energy deck was printed** (D2 or D3). The print list says only "Scenario Cards … 4 sets".
4. **The end of "Galaxy Numerix - Quest 1 - Task 2".** The tool cut the text at "Planet J: 178 ligh", inside a list that had already appeared in full. Probably nothing new was lost; not certain.
5. **The Attraction Menu** for the Galactic Fair. Not in Drive.
6. **Whether real fuel tokens were used** in Task 2, and **whether real blocks were used** in the Final Boss.
7. **How long each task really took in class,** and whether students worked alone or in pairs. All minutes here are estimates.
8. **The root folder beyond its first page of results.** I listed only what my area needed. "Math Assessment Test" was seen by name and not opened.

---

## 9. What a child could explore or play with here

Marc's own material only, unless marked.

**The planet [Source: quest page]**
- Rainbow-coloured skies and clouds like cotton candy.
- Trees whose leaves glow in the dark. Rivers that sparkle like diamonds.
- Animals that talk: a butterfly to chat with, a giggling Gumblefish.
- FlavorBursts, fruit that changes flavour with every bite ("strawberries, and the next bite could be chocolate").

**The city, 21 named places [Source: City List, Map Key]**
- Homes: Neighborhood 1 and 2, Schools, Hospital, Parks, Zoo, Swimming Pool, Supermarket.
- Shops: Shopping Mall, Office Buildings, Hotels, Restaurants, Sports Arena (the key says Sports Stadium), Arts Theater, Bus Stop, Amusement Park.
- Factories: Factory, Solar Power Plant, Warehouse, Recycling Plant, Gas Station.
- Each could be a place that is lit or dark depending on the student's own plan. **[Proposal]** A dark Zoo or a lit Amusement Park would make the choice visible.

**Events with stories [Source: scenario cards]**
- A solar flare that damages the panels. An earthquake and emergency shelters. A festival. A heatwave. Tourists arriving. A school science fair. A flu outbreak at the hospital. Hackers stopped by "our computer experts". New LED lights in the parks.

**In space [Source: Task 2]**
- Twenty trading planets, A to T, named only by letter. **[Proposal]** Marc could name them.
- Space Pirates ("Arrr!"), a wormhole shortcut, a meteor shower, Alien Investors who "loved your goods", a black market, a galactic holiday, a hidden stash in the ship, a Quantum Glitch in the ship's computer.
- The Galactic Council, which sends the SOS and takes its taxes.

**The colonies [Source: Final Boss]**
- Ten colonies with Greek-letter names: Alpha, Beta, Gamma, Delta, Epsilon, Zeta, Theta, Iota, Kappa, Pi.
- Ten buildings to raise, each with a good and a bad story: Housing, Spaceport, Research Facility, Farming Domes, Solar Farms, Water Purification, Commercial Centers, Communication Towers, Recreation Facilities, Defense Systems.
- "Your Commander (your teacher)" approves the first plan. That is a ready-made teacher role in the world.

**From the earlier drafts [Source], unused**
- The Number Nomads, a lost civilization stranded by a cosmic storm; the star system Digit Delta; alien number symbols; the Number Overlord.
- The Star Mapping Chamber and its star map.
- A Galactic Fair with rides, games and food stalls, and a "Galactic Fair Expo".

---

## 10. Scripts

All use only the Python standard library. Run with `python3 -I`.

| Script | What it does | Seed test |
|---|---|---|
| `checks/voltara_t1_check.py` | Sums every needs list and supply; scores every card in three decks; runs every Round 3 draw on seven pairings; finds impossible block moves; re-runs the template draft rule with cards; tests a proposed rule | Draft rule + cards: 10,000 seeds, shortage lost for 81.9% of students. Proposed rule: 10,000 seeds × 6 setups, PASS. |
| `checks/voltara_t2_check.py` | Rounds all four data sets; best trips by brute force; fuel economics; 15 cards; old barter key; proposed rule | 10,000 seeds, PASS |
| `checks/voltara_boss_check.py` | Recomputes versions A, A0, B, C, D; every round-1 opening × every 3 cards; proposed rule | 10,000 seeds, PASS |
| `reference/voltara_number_rule_check.py` (not mine) | Output: `unbuildable plans found: 0` | — |
