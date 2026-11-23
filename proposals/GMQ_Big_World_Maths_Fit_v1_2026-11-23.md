# Algora's deciding years: the maths, fitted to the story

**Date:** 23 November 2026. **For:** Marc, the story thread, and the next reviewer. **From:** the big world thread.
**Read with:** `proposals/GMQ_Algora_Story_v1_2026-11-23.md`.
**Nothing here is built.** Everything is **[Proposal]** unless it says [Source].

**This is version 3.** One reviewer read version 1 and the story together. Its verdict: **"Not yet a base to build on. Close, for one child playing alone."** It found 6 blockers. Section 9 lists them. Version 2 answered them and asked six things of the story thread. **The story thread said yes to all six** (its section 14), and version 3 is brought in line with its words.

**What changed:**
- **Only the first kind of decision is fitted now: "how much?"** The other two are parked. Section 7 says why.
- The number rule was rewritten. It is `checks/bigworld_year_rule_check.js`. It lists every case, and it passes.
- **Version 3 has not been reviewed.** It goes, with the story, to one reviewer again. If that finds no blocker, the first kind is built for one child on one iPad.

---

## 1. What is decided [Source: Marc]

| | Decided | When |
|---|---|---|
| 1 | For now the maths is multiples: "3, 6, 9, 12". A pattern with a start comes later | 23 November |
| 2 | A wrong decision is carried out. Nobody says "wrong". The child sees what follows | 22 November |
| 3 | Then a new problem of the same size | 23 November |
| 4 | His maths skills engine decides a step down. Harder problems come unseen | 23 November |
| 5 | Each child has their own year | 23 November |
| 6 | The simulation is dropped. "Work it logically. I will see how well it works out" | 23 November |

---

## 2. The first kind: how much?

### What the child looks at

- **The keeper's tally stick fills the picture,** at the Lake Market. Four cuts, each with its number: 6, 12, 18, 24.
- Nothing is drawn after the fourth cut. The child's own table is in the notebook, and the game fills in none of it.
- **The keeper never says the step.** The child reads it off the stick.

### The words: one sentence, one moment

> "My raft comes on count day 7, after the count. Every mat waits at home till then. How many mats will there be, in all?"

The reviewer found four ways to read version 1's sentence. This one names the day, says the count is over, and says nothing has been handed over yet.

### What follows

| | The rule |
|---|---|
| At the Market | The seller pours **one pot of oil for each mat promised,** and ties one hook on her raft for each |
| On count day 7, right (42) | She takes every mat. The town has 42 pots |
| Too few (said 36) | She takes 36. **Six spare mats lie on the dock.** The town has 36 pots: 6 short |
| Too many (said 48) | She takes 42. **Six hooks on her raft are empty.** "One pot back for the mat I did not get. One pot back for the hook that sailed empty." [the story's words] The town has 36 pots: 6 short |
| Far too many (said 99) | She takes back every pot. The town has none. It can never have fewer than none |

- **Six too few costs what six too many costs.** So neither "always say less" nor "always say more" is safe. In version 1, saying too many cost nothing at all.
- **The picture shows three things, in this order:** the dock (spare mats, or empty hooks: they can be counted), the oil shelf (the same number of empty places), then the lamps going out.
- The number box takes 0 to 99. Her raft holds 99 pots.
- The check file tries every number a child could type, for every problem: a miss always costs, and a right answer never does.

### The finished example: a prediction, not a full row

Scratched on the Market's old stone, from long ago. Another keeper's stick: 5, 10, 15, 20. Her raft came on count day 8. "Four more count days: 25, 30, 35, 40. She said 40. The raft took every mat." No child is given this row.

---

## 3. The sizes, and every problem there is

| Band | The step | Who asks |
|---|---|---|
| **Small** | 2, 5 or 10 | the step down: **a child's own rack** (below). Your skill map's level below Grade 3 |
| **Low** | 3, 4 or 6 | the first town a child helps |
| **High** | 7, 8 or 9 | the second |
| **Big** | 11 to 15 | later, unseen: "we are more houses this year" |

The reviewer was right that one "full" size from 3 to 9 was too wide: after a miss on 8 × 7 the next problem could be 3 × 5.

**The raft never comes on count day 5.** That is only "the next number". It always comes two or more count days after the last cut.

| | Year of 7 gold months | Year of 9 gold months |
|---|---|---|
| Small | | **20** |
| Low | 5 problems | **11** |
| High | 6 | **12** |
| Big | 9 | **12** |
| Problems in a row, each new in step, count day and answer | 3 to 7 | **9 to 15** |

- **Seven count days leave 5 or 6 problems in a town's band.** So the story thread changed its year to nine gold months and three white: twelve, like ours. It is still your decision 2.

### The small row: a child's own rack [the story's section 5]

- A child of the town has a chore. It brings **one bundle each count day:** a pair of sandals, a hand of five plums, or a bundle of ten fire sticks.
- In the first week, gran ties the rack: **one loop for each thing there will be "on count day 6, after the count".** The child says how many.
- **There is no stick,** because nothing is cut yet. The bundle is said in words. So this is the same row with nothing shown: 5, 10, 15... to the 6th.
- Too few loops: things with no loop lie on the floor. Too many: empty loops. Both can be counted.
- It is small in the story too: one child, one chore.

- **After any year the next problem has a new step, a new count day and a new answer,** and its answer is no number the last year showed. The check file tries this for every problem and every reply.
- **Refused,** each printed by the check file with its reason: a row where a wrong method lands on the right answer (3, 6, 9, 12 on count day 6: the last cut plus the count day is also 18); any total over 99; the finished example's own row.
- **"Double the 4th cut" for count day 8 is not refused.** It is a right way, and a good one.

---

## 4. Your engine's steps, in years

[Source: `engines/math-skills/current-v1.1/api/constraints/math-skills.txt`, version 4.1.]

| Your engine | In the world |
|---|---|
| Assess | A town asks at the Market. The cadet promises. The year runs |
| Right | The keeper has learned it. Lit windows from then on |
| Wrong, then a probe | The year shows what followed. Next year the same town asks again, with a new stick |
| Probe right: a slip | She has learned it. She asks once more on a later visit, as your engine does |
| Probe wrong: check the skill underneath | A small row: steps of 2, 5 or 10 |
| Teach in single steps | **The old singer teaches,** not the keeper [the story's section 5]. Her gran's counting song has a verse by twos, by fives and by tens. Each line is one count day more. She sings a line and stops; the child gives the number. Sung one line past today, the song counts ahead. For a town's row there is no verse: **the cadet makes the new verse,** by threes or by sevens, and the keeper learns it |
| A worked example | One more row, sung together |
| Mastery gate: three new, right in a row | Three more years in that town's band |
| The step below is missing too | Your words to the main thread: "go down one or two levels... teach that and then work back up." So the song is taught at the small size first. If that fails, the kind rests, your report names the skill, and the town asks again on a later visit, starting small |

### Where I bend your engine, said plainly

| | Your engine | Here | Why |
|---|---|---|---|
| 1 | States the answer after a miss | The year shows it | Your rule of 22 November |
| 2 | Three tries at the gate: up to 14 problems | **One try at the gate: 8 at most.** Then the kind rests | There are not 14 all-new problems in a band, even with nine count days. And you called the engine "a bit too much" for a world |
| 3 | Picks the skill underneath from the two wrong answers | Always the small row | No AI is in the page yet. It is decision 4 |
| 4 | Assesses a skill once | Each of the three mat towns asks, one band higher each time | A town is a place, not a test |
| 5 | Confirms or corrects every small step | In the song, a wrong number is sung again with the pips laid out | Is that "saying wrong"? Decision 5 |
| 6 | Has "skip" and "I don't know" | "Decide without me": the keeper promises a few mats, to be safe. Dark evenings. The year runs | The story's own way out, as for the fleet |

### How long

| A child who... | Years in one town |
|---|---|
| is right first time | 1 |
| slips once | 2, and one more later |
| is stepped down, and passes the gate | 8 |
| is stepped down, and misses the gate | 8, then a rest |

The reviewer's estimate, not measured: five to seven minutes for the first year, three after that. So a child who is stepped down spends about 25 minutes in one town.

---

## 5. What the trial would be

| | |
|---|---|
| **One child, on one iPad** | No wall of names. That needs a server, and none has run. [`CLAUDE.md`: each iPad keeps its own game today] |
| **The three mat towns** | Stilt, Reed and Mud. The Menders and the Furrows have no worked "how much" yet (the reviewer's finding 17) |
| **Saved at once** | The stick a town shows is saved when it asks. Closing and opening the game brings the same stick back. A year that has begun to run, finishes |
| **Walking away** | The town waits at the Market. No other town asks until this one has its answer, or is told "decide without me" |

---

## 6. The maths, against the standards

| What the child does | Standard | How sure |
|---|---|---|
| Reads a row of multiples and goes on with it | 3.OA.9, 3.OA.7 | sure |
| Decides from a table | 3.OA.3 | sure |
| The big band: steps of 11 to 15 | past the tables | a stretch. The reviewer notes it is uneven: counting by 11 is easier than by 7 |

**An honest note, which is decision 1:** on 19 November you said big quests "should require them to actually think and solve and struggle". "How much" is one to three additions. You also chose multiples for now. Both are your words.

---

## 7. Parked: "how many?" and "for how long?"

The reviewer found these further off. I agree. I have not fitted them.

| | The fault | A case |
|---|---|---|
| a | **Neither has a table.** Both are decided at New Year, before any count day. The keeper says numbers and the child divides. That is a sum with a story on top | 24 ÷ 4. 40 ÷ 8 |
| b | **"For how long": too many months is worse than the keeper's own safe way** | She hires for all 7 months and "keeps enough fish back". The cadet says 6 where 5 is right, and the fish jars run out. The town is worse off with the cadet than without |
| c | **"How many": my rule did not model my own question.** With "9 good plots" said aloud, the answer is 9 in five cases, and "9 take away the step" is right in three more | 27 ÷ 3 = 9 |
| d | **The reed side is never told.** A child who sows one plot more "to be safe" is punished by a rule they could not know | |
| e | **A keeper who knows what the store must gain each count day has already counted ahead** | |

**One idea for the story thread, which would give both a table:** the other side brings one. A Furrow carter has a load board: 1 month, 8 blocks. 2 months, 16. 3 months, 24. The child reads on until the wall's number is reached. It is theirs to judge.

---

## 8. What I asked of the story thread, and its answers

All six: **yes.** [The story's section 14.]

| | I asked for | The story now says |
|---|---|---|
| 1 | The rule for too many mats, in its words | One pot for each mat promised, and one hook tied for each. "One pot back for the mat I did not get. One pot back for the hook that sailed empty." Never fewer than none |
| 2 | "On count day N, after the count" | That is now the one way a day is named. Rafts still sail on Last Raft day |
| 3 | A tally stick at the Market | A keeper never leaves home without her stick. She does not say the step: she has never thought of the pile that way |
| 4 | Nine gold months | Its pick now. Your decision 2 |
| 5 | A small row that is small in the story | A child's chore, and gran's rack |
| 6 | The singer as the teacher | Her counting song |

**One thing it asks me to check:** a child may feel "she took two!" as a punishment. If so, its other fair rule is: she takes back one pot, and next year ties only as many hooks as she was given mats. That lasts past New Year, so it is yours. Decision 6.

---

## 9. What the reviewer found, and what I did

| | Found | Done |
|---|---|---|
| B1 | Saying too many mats cost nothing | Section 2: two pots back for each empty hook, with a floor. Checked for every number. The story now says the same |
| B2 | "For how long": too many months contradicts the keeper's safe way | Parked. Section 7b |
| B3 | "How many" and "for how long" have no table | Parked. Section 7a |
| B4 | The "how many" rule did not model its question | Parked. Section 7c |
| B5 | The weakest child's path was a loop of misses with no teaching | Section 4: taught at the small size, then a rest |
| B6 | The wall of names needs a server that has never run | Section 5: left out of the trial |
| | A third of "how much" was only the next number | The raft never comes on count day 5 |
| | "Full" was too wide. One answer could give away the next | Bands. A new answer after every year |
| | The question read four ways | Section 2 |
| | A family made more than a town | The small row is a child's chore now (section 3) |
| | The keeper taught the child | The singer does (section 4) |
| | The years table was short. Engine bends were not stated | Section 4 |
| | The example was not an example of the task | Section 2 |
| | Closing the game and walking away were not designed | Section 5 |
| | My check file claimed more than it did | Rewritten. It now checks the consequences, the picker, and that the note's example is a real problem |

**Not done:** the class picture (the reviewer's finding 18). With no server there is nothing to build. It stays a question.

---

## 10. Your decisions

The reviewer counted 30 between the two notes: "more than a person can answer". These are the ones that matter for a first build.

| | Decision | Options, with costs | I would choose |
|---|---|---|---|
| 1 | **Is "how much" enough for a big quest?** | Yes: it is your multiples, a table, a decision, and what follows. Or it is practice, and the big quest needs the other two kinds as well, which are not ready | yes, as a first trial |
| 2 | **Nine gold months, or seven?** | Seven: 5 problems in a band. Nine: 11, and a year of 12 months, like ours | nine |
| 3 | **One try at the gate, or your engine's three?** | One: 8 years at most in a town, then a rest. Three: 14, and problems must repeat | one |
| 4 | **The step down is always the small row** | Or wait for the AI, which can choose the skill underneath as your engine does | the small row, for now |
| 5 | **In the singer's song, may a wrong number be sung again?** | Yes: teaching needs it. Or the song also lets a wrong line stand, and the pips show it at the end | yes |
| 6 | **Two pots back, or one pot and fewer hooks next year?** | Two: it ends at New Year, and too few costs what too many costs. One and fewer hooks: gentler on the day, but it lasts into next year | two |
