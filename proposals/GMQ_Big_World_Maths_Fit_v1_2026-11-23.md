# Algora's deciding years: the maths, fitted to the story

**Date:** 23 November 2026. **For:** Marc, the story thread, and the next reviewer. **From:** the big world thread.
**Read with:** `proposals/GMQ_Algora_Story_v1_2026-11-23.md`.
**Nothing here is built.** Everything is **[Proposal]** unless it says [Source].

**This is version 4.** Two joint reviews have read this note with the story.
- **The first:** "Not yet a base to build on. Close, for one child playing alone." 6 blockers. Section 9.
- **The second,** on the first kind only: **"Not yet. Three blockers, each a small fix. The numbers for the town's stick and promise hold."** Section 9b says what it found and what I did.

**What version 4 changes:** the small row is the same task made smaller; the question names today; both costs are told before the promise; the finished example is about another thing; the engine's path is written out and played in code for 27,000 made-up children; "finished", "a rest" and "decide without me" are defined.

**Version 4 has not been reviewed.** Four of its changes need the story thread's words (section 8b). Nothing is built.

Every number below comes from `checks/bigworld_year_rule_check.js`. It passes.

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

- **The keeper's tally stick fills the picture,** at the Lake Market. Four cuts. Each is marked with its count day and the pile that day:

| count day 1 | count day 2 | count day 3 | count day 4 |
|---|---|---|---|
| 6 | 12 | 18 | 24 |

- Nothing is drawn after the fourth cut. The child's own table is in the notebook, and the game fills in none of it.
- The keeper never says the step. The child reads it off the stick.

### What the seller says, in this order

1. **A finished example, about another thing.** Her own stick, for the oil she presses: 20, 40, 60, 80 pots. "I told the Twinseers I would have oil for them on count day 8. I counted on: 100, 120, 140, 160. I said 160. And I did." No band has a step of 20.
2. **Both costs, before any number is asked.** "One pot for each mat you promise, and one hook on my raft for each. Mats with no hook are no use to me. For a hook that sails empty I take two pots back: one for the mat, one for the hook."
3. **The question, with today in it:**

> "Today is count day 4. My raft comes on count day 7, after that day's count. How many mats will there be by then, in all?"

The second reviewer found six ways to misread version 3's sentence. Three came from not saying what today is. This one says it, and each cut carries its count day.

### What follows

| | |
|---|---|
| Right (42) | Every hook gets a mat. **No window is dark** |
| Too few (said 36) | **Six spare mats on the dock.** Then six dark windows |
| Too many (said 48) | **Six empty hooks.** She takes two pots back for each. Then six dark windows |
| Far too many (said 99) | She takes back every pot. Every window the mats could have lit is dark: 42 |

- **The picture shows only the gap:** the dock first (mats or hooks, which can be counted), then that many dark windows. It never shows a shelf with 42 places: that would be the answer, drawn.
- **Six too few costs what six too many costs.** No blind number pays: the reviewer tried "always 99", "always 0", "the last cut", "the next cut".
- A miss of one is one mat on the dock and one dark window.
- The check file tries every number from 0 to 99 for every problem.

### A reply that is a reading, not a count [your engine: classify from both wrong answers]

Code can tell some wrong replies apart with no AI. For 6, 12, 18, 24 and count day 7:

| The child says | What it is |
|---|---|
| 36 or 48 | **A count fault:** one count day short, or one over |
| 18 | **A reading fault:** only the mats still to come |
| 66 | **A reading fault:** seven more count days from today |
| 6, or 7 | **A reading fault:** one day's mats; or the count day itself |

Two count faults lead to the small row and the song. **Two reading faults do not:** the seller tells it again, with the stick laid along the days of her journey. The skip counting was never the trouble.

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

| | Problems, in a year of 9 gold months |
|---|---|
| Small | 11 |
| Low | 11 |
| High | 12 |
| Big | 12 |

With seven gold months there were 5 or 6 in a band. So the story thread changed its year to nine gold months and three white: twelve, like ours. It is still your decision 2.

### The small row: the same task, smaller

The second reviewer's first blocker: version 3's small row had no stick, and "one loop for each thing" read two ways (6 bundles, or 30 plums).

- **Now it is the town's task again, with a child's own stick.** A child of the town has a chore, and cuts their own small stick: 5, 10, 15, 20 plums.
- **Gran asks, in the same words:** "Today is count day 4. The rain comes on count day 7, after that day's count. How many plums will there be by then, in all?"
- **The thing to count is named:** plums, sandals, fire sticks. Never "things", and never bundles.
- **Both sides cost by the count:** a plum with no place spoils; an empty place is seen. How the places are made (loops, pegs, a tray) is the story thread's.
- Steps of 2, 5 and 10. Eleven problems.

- **A child never meets a problem twice.** After any year the next problem has a new step, a new count day and a new answer, and its answer is not what the child last said.
- **A count day the child has been right on does not come again while another can.** There are three quick ways that are right: add the last two cuts (count day 7), double the last cut (8), add the last three (9). A child who knows all three knows the row. A child with only one of them is right once, and is then asked for another day.
- **Refused,** each printed by the check file with its reason: a row where a wrong method lands on the right answer (3, 6, 9, 12 on count day 6: the last cut plus the count day is also 18); any total over 99; the finished example's own row.
- **"Double the 4th cut" for count day 8 is not refused.** It is a right way, and a good one.

---

## 4. Your engine's steps, in years

[Source: `engines/math-skills/current-v1.1/api/constraints/math-skills.txt`, version 4.1.] The path below is written as code in the check file, and played there.

### In one town

| Step | What happens | Years |
|---|---|---|
| Assess | The town asks at the Market. The cadet promises. The year runs | 1 |
| Right | **Learned.** Lit windows from then on | |
| Wrong, then a new one | Next year the same town asks again: a new stick | 1 |
| Right this time | **Learned,** by a slip | |
| Wrong again: two count faults | The small row. Right: on to the song. Wrong: the song by twos, fives and tens, then the small row once more. Wrong again: a rest | 1 or 2 |
| Wrong again: two reading faults | The seller tells it again, with the stick laid along the days | |
| Taught in single steps, then a worked example | The singer and the cadet make the new verse, one line for each count day, with pips. Two rows are made this way | 2 |
| The gate | Three new years, right in a row: **learned.** A miss: that line of the song again, and one more gate. A second miss: a rest | 3 to 6 |

### Across the three mat towns

| The first town ended... | The next town asks |
|---|---|
| learned at the first try, or through the gate | one band up: low, then high, then big. Nothing is said |
| learned by a slip | the same band once more, as your engine re-asks a fragile skill |
| in a rest | nothing. The kind rests in every town, and your report names the skill |

- **"Learned"** is the word for a town. **"Finished"** is all three towns learned.
- **"A rest"** means: the keepers go on promising a few mats, the safe way. The evenings stay dark. No town asks again in the trial. The rest of the planet is open.
- **"Decide without me"** is a button at the Market. The keeper promises a few mats. The year runs. Nothing is counted for or against the child. Two in a row in one town, and the singer comes over.
- **When a band has no new problem left for a child, the kind rests.** It never repeats a problem to keep going.

### Played in code: 3,000 made-up children of each kind

| A child who... | Years for three towns | How the towns ended |
|---|---|---|
| is always right | 3 | all learned at the first try. The third town was the big band |
| is right 8 times in 10 | 3 to 21. Half need 3 | mostly learned. For 1 child in 100 a band ran out |
| is wrong until taught, in every band | 24 | all three learned through the gate: 8 years each |
| always counts one day over | 4 | a rest in the first town |
| always reads "only the mats to come" | 4 to 6 | a rest in the first town |
| only ever adds the last two cuts | 4 to 9 | at most one town learned, then a rest. **Not waved through** |
| is right half the time, by chance | 3 to 29 | mixed. For 4 in 100 a band ran out |

**Read the third row.** A child who must be taught at every band spends 24 years here. At three minutes a year that is over an hour, across several lessons.

### Where this bends your engine

| | Your engine | Here | Why |
|---|---|---|---|
| 1 | States the answer after a miss | The year shows it | Your rule of 22 November |
| 2 | Three tries at the gate | Two | A band has 11 or 12 problems. Two gates need 10 |
| 3 | Picks the skill underneath by judgement | Two count faults: the small row. Two reading faults: told again. Anything else: the small row | Code can see this much. The AI could see more |
| 4 | Stops when the step below is missing | Teaches the step below once, by song | Your words to the main thread: "go down one or two levels... teach that and then work back up" |
| 5 | Assesses a skill once | Three towns, a band higher each time | A town is a place |
| 6 | Confirms or corrects each small step | The singer sings a line again, with pips | She is teaching a song |
| 7 | "Skip", "I don't know" | "Decide without me" | The story's way out |

---

## 5. What the trial would be

| | |
|---|---|
| **One child, on one iPad** | No wall of names. That needs a server, and none has run. [`CLAUDE.md`: each iPad keeps its own game today] |
| **The three mat towns** | Stilt, Reed and Mud. The Menders and the Furrows have no worked "how much" yet (the reviewer's finding 17) |
| **Saved at once** | The stick is saved when a town asks. The promise is saved when it is given. Closing and opening the game brings the same stick back. If the game closes while the year runs, the year is shown again from its start on opening |
| **Walking away** | The town waits at the Market. No other town asks until this one has its answer, or is told "decide without me" |

---

## 6. The maths, against the standards

| What the child does | Standard | How sure |
|---|---|---|
| Reads a row of multiples and goes on with it | 3.OA.9, 3.OA.7 | sure |
| Decides from a table | 3.OA.3 | sure |
| The big band: steps of 11 to 15 | past the tables | a stretch. The reviewer notes it is uneven: counting by 11 is easier than by 7 |

**An honest note, which is decision 1:** on 19 November you said big quests "should require them to actually think and solve and struggle". "How much" is two to five additions. You also chose multiples for now. Both are your words.

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

## 8b. What I need from the story thread now

| | | Why |
|---|---|---|
| 1 | **The small row as the town's task, smaller:** a child's own stick, the same question, the thing named (plums, sandals, fire sticks). Both sides cost by the count | The second review's first blocker. Section 3 |
| 2 | **The seller's own stick as the finished example,** and both costs said before the question | Sections 2. Its note has "an old stone", and mats again |
| 3 | **One line on the mats made after the raft has come,** and one on the spare mats | A child will ask. The reviewer did |
| 4 | **Four stale lines:** section 5 still lets the keeper say what comes in each count day; section 3 says "four cuts on the wall", "a step down is a family", and a town asking "at New Year" | They contradict its own rewritten first kind |
| 5 | Old rows on store walls carry no numbers | With three steps in a band, a numbered old row could be this year's |

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

## 9b. The second joint review: three blockers

| | Found | Done |
|---|---|---|
| B1 | **The small row read two ways.** "One loop for each thing": 6 bundles, or 30 plums. And it had no stick | It is the town's task with a child's stick. The thing is named. Section 3. Needs the story thread (8b.1) |
| B2 | **The picker could run dry** after one small row, and its check never tried a change of band | The picker has the child's whole history now. The engine's path is played in code for 27,000 made-up children. It found two more faults of mine, both fixed |
| B3 | **The finished example was the same thing again** (mats, by fives), and its row was the small row's own | The seller's own stick, for oil, by twenties. Section 2 |
| | The question still had six misreadings | "Today is count day 4" is in it. Each cut carries its count day |
| | A fixed habit landed on the answer, and one hit lit a town for ever | The picker does not repeat a count day the child has been right on. Checked |
| | The cost of "too many" was told only after it happened | Told first. Section 2 |
| | The oil shelf gave the answer away, or did not work for "too many" | Only the gap is drawn: dark windows |
| | "Always the small row" ignored what code can see | Reading faults are told again, not sent to the small row |
| | "Finished", the third town, a rest, "decide without me", closing the game: not defined | Sections 4 and 5 |
| | The years table was wrong | Replaced by the played paths. Section 4 |

**Not done:** the class picture (the reviewer's finding 18). With no server there is nothing to build. It stays a question.

---

## 10. Your decisions

Both reviewers said the two notes hold more decisions than a person can answer. The second said the threads could simply decide four of mine. So I have, and they are listed under the table. These three are left.

| | Decision | Options, with costs | I would choose |
|---|---|---|---|
| 1 | **Is "how much" enough for a first big quest?** | Yes: it is your multiples, a table, a decision, and what follows. Or it is practice, and the big quest must wait for the other two kinds, which are not ready | yes, as a first trial |
| 2 | **One right year lights a town for good** | Yes, as your engine passes a skill on one right answer. Or two right years on different count days: surer, and twice as long for every child | one |
| 3 | **A child who must be taught at every band spends 24 years** | Accept it for the trial, and time it. Or teach once only, and after that a miss is a rest | accept, and time it |

**Decided by the two threads, as you said we should. Say if you disagree.**
- **Nine gold months.** You said: "however long you make their year."
- **Two tries at the gate,** not your engine's three. A band has 11 or 12 problems.
- **The singer may sing a wrong line again.** Your engine corrects in teaching too.
- **Two pots back for an empty hook.** The other way lasts into the next year.
- **The step down:** the small row for count faults, a second telling for reading faults.
- **The trial has no class view.** No server has run.
