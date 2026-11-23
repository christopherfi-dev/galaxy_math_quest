# Algora's deciding years: the maths, fitted to the story

**Date:** 23 November 2026. **For:** Marc, the story thread, and one reviewer who reads both. **From:** the big world thread.
**Read with:** `proposals/GMQ_Algora_Story_v1_2026-11-23.md` (sections 1, 3, 5 and 13). This note adds numbers to that story. It changes none of it.
**Nothing here is built.** No picture is drawn and no word of the page is written. Everything is **[Proposal]** unless it says [Source].
**It has not been reviewed.** The next step is one review of this note and the story together.

Every number below was made by `checks/bigworld_year_rule_check.js`, which lists every case and checks each one. It passes.

---

## 1. What is already decided [Source: Marc]

| | Decided | When |
|---|---|---|
| 1 | For now the maths is multiples: "3, 6, 9, 12". A pattern with a start (3x + 2) comes later | 23 November |
| 2 | A wrong decision is carried out. Nobody says "wrong". The child sees what follows | 22 November |
| 3 | Then a new problem of the same size | 23 November |
| 4 | His maths skills engine decides a step down. Harder problems come unseen | 23 November |
| 5 | Each child has their own year | 23 November |
| 6 | Classmates see only what is finished, and by whom. Nobody reads another child's table | 23 November |
| 7 | The simulation idea is dropped: "I agree my answer was not the best answer." Work it out logically | 23 November |

---

## 2. One row, three questions

Every problem on Algora's deciding years is **one row that starts from nothing and climbs by the same step.** The story gives three questions to ask of it.

| | The story's decision | The row | The child is asked | The sum |
|---|---|---|---|---|
| **1. How much?** | mats promised to the oil seller, at the Lake Market | count days → mats | "How many mats, in all, after count day 7?" | step × count days |
| **2. How many?** | plots sown with food, in sowing week | plots → sacks on a count day | "How many plots do we sow with food?" | need ÷ step |
| **3. For how long?** | months of the Furrows' carts, at New Year | months → blocks | "For how many months do we hire the carts?" | need ÷ step |

- **1 goes forwards along the row. 2 and 3 go along it until a number is reached.** That is the order the story now has, and it is the right order for the maths.
- **In every one the child may write the row out.** That always works. It is skip counting, which is what you asked for.
- **No sum has three numbers.** Following the story's section 5, the keeper always gives what *all* the weavers, or one plot, or all the carts bring on one count day.

### 1. How much?

| | |
|---|---|
| **In the picture** | The mat row: four cuts, each with its number. For example 6, 12, 18, 24 |
| **The oil seller asks** | "My raft comes back after count day 7. How many mats will there be, in all?" |
| **The answer** | 30, 36, **42** |
| **Said too little** (36) | Oil is poured for 36 mats. When the raft comes back there are 42. **Six spare mats lie on the dock.** The lamps go out early |
| **Said too much** (48) | Oil is poured for 48. When the raft comes back there are 42. **Six hooks on the raft are empty.** The seller takes oil back. The lamps go out early |

### 2. How many?

| | |
|---|---|
| **The keeper says** | "The store must gain 24 sacks on every count day. One plot brings 4. We have 9 good plots. How many do we sow with food?" The rest are sown with roof reed |
| **The answer** | 4, 8, 12, 16, 20, 24: **6 plots** |
| **Too few** (5) | The pile gains 20 on a count day, not 24. It stops below the line. Bowls are smaller in White month 3 |
| **Too many** (7) | The pile passes the line. But only 2 plots of reed were sown, not 3. Some roofs are not mended, and drip |

### 3. For how long?

| | |
|---|---|
| **The keeper says** | "The wall needs 40 blocks. The carts bring 8 on every count day. For how many months do we hire them?" |
| **The answer** | 8, 16, 24, 32, 40: **5 months** |
| **Too few** (4) | The carts stop coming. The wall is 8 blocks short at one end. The water comes over there |
| **Too many** (6) | The wall is finished and the carts still come. The sixth month is paid for in fish. The fish jars run out in White month 3 |

**What follows always comes from the child's own number:** six mats, one plot, eight blocks. And then the year is over, and the next problem has new numbers [Source: decision 3].

---

## 3. The three sizes

**A size is a range of the step. It is never a different kind of sum.** [My tide post failed on exactly this: its "smaller" problem could be solved by a method that was wrong at full size.]

| Size | Who asks | The step | Where it sits in your skill map [Source: `skills/skill_map.csv`] |
|---|---|---|---|
| **Small** | a family | 2, 5 or 10 | the gap levels, below Grade 3: the skip counts of the year before |
| **Full** | a town | 3, 4, 6, 7, 8 or 9 | the core levels: "equal-groups multiplication, products within 100" and "unknown factors, products within 100" |
| **Big** | "we are more houses this year" | 11, 12, 13, 14 or 15 | the stretch level. Past the times tables, but still one row: 12, 24, 36, 48 |

### Every problem there is

| | Small | Full | Big |
|---|---|---|---|
| 1. How much? | 7 problems. Totals 10 to 70 | **17.** Totals 15 to 63 | 14. Totals 55 to 98 |
| 2. How many? | 13. Answers 2 to 6 | **36.** Answers 3 to 9 | 26. Answers 3 to 8 |
| 3. For how long? | 13. Answers 2 to 6 | **26.** Answers 3 to 7 | 24. Answers 3 to 7 |

**What the rule refuses,** and the check file prints each one:
- **An answer that is a number the keeper has just said.** "The store must gain 49. One plot brings 7." The answer is 7, and a child could just say it back.
- **A wrong method that lands on the right answer.** With cuts 3, 6, 9, 12 and count day 6, the last cut plus the count day is 12 + 6 = 18, and so is the right answer. That row is refused.
- **Any total over 100,** and any count day or month past the 7th.
- **The finished example's own row.**

**After a miss, the next problem has a new step and a new count.** So the last answer is no help with the next one. The check shows that 12 such problems in a row exist at full size, for each kind.

### The finished example [the story's section 5: "an old row on the store wall"]

An old row for river rice, from another year: a line at 35, and cuts 5, 10, 15, 20, 25, 30, 35 climbing to it. No child is ever given this row.

---

## 4. Your engine's steps, in years

[Source: `engines/math-skills/current-v1.1/api/constraints/math-skills.txt`, version 4.1.] I follow it as written, with one change you asked for: the world does not state the answer.

| Your engine | In the world |
|---|---|
| Assess: one question | A town asks one kind, at New Year. The cadet decides. The year runs |
| Right | The keeper has learned it. Lit windows from then on (the story's "what lasts") |
| Wrong | The year shows what followed. Then New Year |
| Probe: one more, new numbers | The same town asks the same kind again: new step, new count |
| Probe right: a slip | The keeper has learned it. Your engine marks it fragile and asks once more another day. So does she |
| Probe wrong: check the skill underneath, with one question | **A family asks, not the town.** The same kind, small size |
| That is wrong too | A neighbour's keeper helps this town this year. The child goes on to another town. Your report says which skill, for you to teach |
| That is right: teach in single steps | The keeper lays the town's row out in pips with the child, one count day at a time. The child does each sum |
| A worked example | One more row together |
| Mastery gate: three new ones, right in a row | Three more years, full size |
| Consistently right | The next town asks the big size. Nothing is said |

- **"Finished"** means the keeper has learned that kind: right at the first try, right at the second, or through the gate.
- **"Consistently"** [Proposal]: right at the first try in two towns running, for one kind. Then the big size.

### How long this is. Please read.

| A child who... | Years for one kind in one town |
|---|---|
| is right first time | 1 |
| slips once | 2 |
| needs the step down and passes the gate at once | 8 |
| the worst case your engine allows | 14 |

A year is one decision, the months going by on the screen, and the white months. If that is two minutes, the worst case is about half an hour on one kind in one town. **You called the engine "a bit too much" on 16 November. This is where that would show.** It is decision 1 below.

---

## 5. The class in one world

| | |
|---|---|
| **Each child's years are their own, and they really happen.** | No simulation. A miss is mild and ends at New Year, as the story says |
| **A step down is a family asking, in the child's own year.** | No classmate sees it |
| **What the class sees** | On each town's store wall, one mark for each kind a cadet has finished there, with the cadet's name |
| **What nobody sees** | Another child's numbers, table, misses, or how many years it took |

**The flaw I could not remove is still here:** in a class of 14, a wall of names shows who is not on it yet. Decision 3.

---

## 6. Four places where the numbers found a hole in the story

For the story thread. I have not changed its note.

| | The hole | A way to close it [Proposal] |
|---|---|---|
| a | **In "how much", saying too much may cost nothing.** The seller "takes pots of oil back". If she takes back only the oil for the mats that are missing, the town ends with exactly the oil its mats were worth: the same as a right answer | For every mat she cannot have, she takes back its pot **and one more**, for her empty raft. Then six too many costs what six too few costs, and neither way is the safe way |
| b | **The table is not where the decision is.** The mat row is on the store wall, in the town. The promise is made at the Lake Market | The keeper carries a tally stick to the lake: the same four cuts |
| c | **In "how many", who knows what the store must gain on a count day?** The story's keeper knows the need by Last Raft. That would make the sum three numbers | She reads it off an old row that reached its line: each cut is the same amount above the last |
| d | **In "how much", too little and too much both end in dark lamps.** The story says so itself | The picture must show the heap of spare mats, or the empty hooks, before the lamps. Section 2 above |

---

## 7. The maths, against the standards

| What the child does | Standard | How sure |
|---|---|---|
| Goes on with a row of multiples | 3.OA.9, 3.OA.7 | sure |
| Reads a table and decides from it | 3.OA.3 | sure |
| Finds how many steps reach a number | 3.OA.4, 3.OA.6 | sure |
| The big size: steps of 11 to 15 | past the tables. By skip counting it is reachable | a stretch, and never announced |

**What this does not carry:** counting far ahead (the 24th count day), a row with a start (3x + 2), repeating patterns, growing shapes. The story's decision 25 would open the first. You said the second comes later.

---

## 8. What could prove this wrong

- **Writing the row out always works.** With seven count days at most, nothing forces a better idea. Is going on with a row enough for now? You said it is skip counting, and that is fine. I believe you, and say it plainly.
- **"How much" has only 17 problems at full size.** Fourteen children will share some.
- **Questions 2 and 3 are one sum in two stories.** A child may notice. That may be good.
- **Half an hour on one kind,** in the worst case.
- **A child may not link the heap of mats to their number.** Ask one: "Why are there six mats on the dock?"
- **Nobody has played anything like this.**

---

## 9. Your decisions

| | Decision | Options, with costs | I would choose |
|---|---|---|---|
| 1 | **How much of your engine?** | All of it: up to 14 years on one kind in one town. Or a short form: a miss, one new one, a family, then back; 4 or 5 years at most, and less proof that the skill is mended | all of it for the trial, and time it with a child |
| 2 | **Small is 2, 5 and 10** | Your skill map's level below. Or small numbers of the same tables (3 × 2, 4 × 3): easier to build, but not the skill underneath | 2, 5 and 10 |
| 3 | **Names on the wall** | A mark appears only when finished. Or every cadet's name is there from the first day, and a finished kind lights it. Either way, who is behind can be worked out | yours |
| 4 | **"Consistently" is two towns running** | Or three. More proof, more years | two |
| 5 | **Counting far ahead** (the story's decision 25) | Seven count days now, and far counts later. Or a count day every week from the start: your "24th day" can be asked, and the story's wall has 28 cuts | seven now |
