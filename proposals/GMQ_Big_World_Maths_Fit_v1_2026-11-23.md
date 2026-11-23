# Algora's deciding years: the maths, fitted to the story

**Date:** 23 November 2026. **For:** Marc, the story thread, and the next reviewer. **From:** the big world thread.
**Read with:** `proposals/GMQ_Algora_Story_v1_2026-11-23.md`.
**Nothing here is built.** Everything is **[Proposal]** unless it says [Source].

**This is version 5.** Three joint reviews have read this note with the story.
- **The first:** "Not yet a base to build on. Close, for one child playing alone." 6 blockers. Section 9.
- **The second,** on the first kind only: **"Not yet. Three blockers, each a small fix. The numbers for the town's stick and promise hold."** Section 9b says what it found and what I did.

**What version 4 changes:** the small row is the same task made smaller; the question names today; both costs are told before the promise; the finished example is about another thing; the engine's path is written out and played in code for 27,000 made-up children; "finished", "a rest" and "decide without me" are defined.

**A third joint review has read version 4: "Not yet. Two blockers, each a small fix. The town's stick, the question and the oil rule hold."** Both blockers were in my picker and my number box. Both are fixed in the check file, and section 9c says how. The fixes have not been reviewed.

**What version 5 changes (23 November, night):** the story thread answered the third review's six points, and its own reviewer then found four story blockers, all fixed (the story, section 16). Version 5 takes the story's words as they are (its section 16c) and follows its section 16d, row by row:
- the seller is a man, the Furrows' tally keeper; his finished example is the last plan of the Year Machine, for the Menders, on count day 9 (no longer a double of the last cut);
- his four lines on cost, said before he asks;
- the small row is **Promise**, a children's game on Market day: reed cups, plums, clay beads; Gran's hooks; shells, by the same rule as the oil;
- the song is taught by the lamp, in the white months of a year already played, so **it costs no year**; a child taught at every band now spends **18 years, not 24**;
- "decide without me" and the second telling use the story's words.
**The story thread's second reviewer has not read the rewritten story yet** (its section 16g). Its words may change once more. The fixes to my picker and box (section 9c) have still not been reviewed.

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

- **The tally keeper's stick fills the picture,** at the Lake Market. Four cuts. Each is marked with its count day and the pile that day:

| count day 1 | count day 2 | count day 3 | count day 4 |
|---|---|---|---|
| 6 | 12 | 18 | 24 |

- Nothing is drawn after the fourth cut. The child's own table is in the notebook, and the game fills in none of it.
- The tally keeper never says the step. The child reads it off the stick.

### What the seller says, in this order

1. **A finished example, about another thing.** His old stick, for the oil of one press: four cuts of 20, 40, 60, 80 pots, then the Year Machine's faint scratches ahead, one for each count day, with numbers (100, 120, 140, 160, 180). In the story's words [story, 16c]:
   > "In the last year of the Year Machine, my stick looked like yours: four cuts. The machine scratched on ahead, one count day at a time. It said: promise the Menders this many, on count day 9, after the count. I did. The Year Machine burnt before that day. The oil came anyway, onto every scratch."
   > "That is what the Year Machine did for us. Can you do it without one?"
   - The answer is 180. No band has a step of 20. **Count day 9, not 8:** 160 was a double of the last cut, which a child could take as the rule [third review]. 180 is not. It is the last three cuts added (40 + 60 + 80), which is a true way; the picker catches a child who has only that habit (section 3).
2. **Both costs, before any number is asked.** In the story's words [story, 16c]:
   > "One pot for each mat you promise, now. One pot fills one lamp for the white months. And one hook on my raft for each mat."
   > "Too few, and the mats with no hook stay on your dock. No pot for them."
   > "Too many, and a hook sails empty. For each, my crew takes two pots back: one for the mat, one for the hook."
   > "Short by one, or over by one: one dark window, the same."
3. **The question, with today in it:**

> "Today is count day 4. My raft comes on count day 7, after that day's count. How many mats will there be by then, in all?"

The second reviewer found six ways to misread version 3's sentence. Three came from not saying what today is. This one says it, and each cut carries its count day.

### What follows

| | |
|---|---|
| Right (42) | Every hook gets a mat. **No window is dark** |
| Too few (said 36) | **Six spare mats on the dock.** Then six dark windows |
| Too many (said 48) | **Six empty hooks.** His crew takes two pots back for each. Then six dark windows |
| Far too many (said 99) | His crew takes back every pot. Every window the mats could have lit is dark: 42 |

- **Before the promise, nothing shows the answer.** It never shows a shelf with 42 places: that would be the answer, drawn.
- **After the promise, the year runs** [Proposal, accepting the story's 16b, finding 17]: the stick gets its new cuts, one each count day; then the dock (spare mats, or empty hooks, which can be counted); then, on raft day, one lamp for each mat the town wove, lit or dark. The climb comes after the promise, so it gives nothing away, and it shows the count the child should have made.
- **Six too few costs what six too many costs.** No blind number pays: the reviewer tried "always 99", "always 0", "the last cut", "the next cut".
- A miss of one is one mat on the dock and one dark window.
- **The box takes three digits.** No answer is over 99, but a child who means 108 must be able to say 108. The check file tries every number from 0 to 999 for every problem.

### A reply that is a reading, not a count [your engine: classify from both wrong answers]

Code can tell some wrong replies apart with no AI. For 6, 12, 18, 24 and count day 7:

| The child says | What it is |
|---|---|
| 36 or 48 | **A count fault:** one count day short, or one over |
| 18 | **A reading fault:** only the mats still to come |
| 66 | **A reading fault:** seven more count days from today |
| 6, or 7 | **A reading fault:** one day's mats; or the count day itself |

Two count faults lead to the small row and the song. **Two reading faults do not:** the seller tells it again. In the story's words [story, 16d, row 7], he lays the tally keeper's stick on the planks of the Market jetty, one plank for each count day: "Here is today. Then this day, and this. Here my raft comes." The skip counting was never the trouble.

---

## 3. The sizes, and every problem there is

| Band | The step | Who asks |
|---|---|---|
| **Small** | 2, 5 or 10 | the step down: **Promise**, a children's game (below). Your skill map's level below Grade 3 |
| **Low** | 3, 4 or 6 | the first town a child helps |
| **High** | 7, 8 or 9 | the second |
| **Big** | 11 to 15 | later, unseen: "We are more houses than Stilt Town." [story, 16d, row 8] |

The reviewer was right that one "full" size from 3 to 9 was too wide: after a miss on 8 × 7 the next problem could be 3 × 5.

**The raft never comes on count day 5.** That is only "the next number". It always comes two or more count days after the last cut.

| | Problems, in a year of 9 gold months |
|---|---|
| Small | 11 |
| Low | 11 |
| High | 12 |
| Big | 12 |

With seven gold months there were 5 or 6 in a band. So the story thread changed its year to nine gold months and three white: twelve, like ours. It is still your decision 2.

### The small row: Promise, the same task, smaller

The second reviewer's first blocker: version 3's small row had no stick, and "one loop for each thing" read two ways (6 bundles, or 30 plums). The third review then found that its cost worked on one side only.

- **It is Promise,** a children's game on Market day: the lake's deal, made small [story, 16a, point 4]. A step-down year is an errand: the tally keeper asks the cadet to stay in the town that Market day [story, 16b, finding 12].
- **The thing to count is named,** and counted one by one: reed cups (two each count day), plums (five), clay beads (ten). Never bundles or pairs.
- **Gran says both costs first, then asks,** in the story's words [story, 16c]:
  > "One shell for each plum you promise, now. And one hook on my rack for each."
  > "Too few, and the plums with no hook are mine for nothing."
  > "Too many, and a hook hangs empty. You give me two shells back for it: one for the plum, one for the hook."
  > "Today is count day 4. I come for them on count day 7, after that day's count. How many plums will there be by then, in all?"
- **It is the oil rule:** one for each promised, two back for each empty hook, never fewer than none. Both sides cost shells, one for each one out. The check file plays it with the same rule.
- **The story thread's caution:** Promise is a game in a game. If a child shrugs at shells, it costs nothing. To check with a child.
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
| Wrong again: two count faults | Promise, on Market day, in the town. Right: on to the song. Wrong: the song by twos, fives and tens, then Promise once more, on the next Market day. Wrong again: a rest [story, 16b, finding B2] | 1 or 2 |
| Wrong again: two reading faults | The seller tells it again, with the stick laid along the days | |
| Taught in single steps, then a worked example | The singer and the cadet make the new verse, one line for each count day, with shells, by the lamp, in the white months of a year already played. **The two rows made this way are the child's own two missed rows.** They use up no new problem | 0 |
| The gate | Three new years, right in a row: **learned.** A miss: that line of the song again, by the lamp, in that year's white months, and one more gate. A second miss: a rest | 3 to 6 |

### Across the three mat towns

| The first town ended... | The next town asks |
|---|---|
| learned at the first try, or through the gate | one band up: low, then high, then big. Nothing is said |
| learned by a slip | the same band once more, as your engine re-asks a fragile skill |
| in a rest | nothing. The kind rests in every town, and your report names the skill |

- **"Learned"** is the word for a town. **"Finished"** is all three towns learned.
- **"A rest"** means: the tally keepers of towns not yet learned go on promising a few mats, the safe way, and their evenings stay dark. **A learned town stays lit** [story, 16a, point 6]. No town asks again in the trial. The rest of the planet is open.
- **"Decide without me"** is a button at the Market. The tally keeper promises a few, the safe way, and says so. The year runs. Nothing is counted for or against the child. After the second in one town, the singer finds the cadet in the white months: "They say you have stopped deciding. Come and sing." [story, 16d, row 6]
- **The picker never repeats a problem.** When it cannot give a problem that is new in step, count day and answer, it gives up one wish at a time: first a count day the child has not been right on, then a new count day, then a new step. Only when every problem of a band is used does it stop. Then a gate with only right answers so far counts as passed.

### Played in code: 3,000 made-up children of each kind

| A child who... | Years for three towns | How the towns ended |
|---|---|---|
| is always right | 3 | all learned at the first try. The third town was the big band |
| is right 8 times in 10 | 3 to 17. Half need 3 | mostly learned. No band ran out |
| is wrong until taught, in every band | **18** | all three learned through the gate: 6 years each |
| always counts one day over | 4 | a rest in the first town |
| always reads "only the mats to come" | 4 | a rest in the first town |
| only ever adds the last two cuts | 4 to 6 | at most one town learned, then a rest. **Not waved through.** But half of these children do light the first town at the first try: see decision 2 |
| is right half the time, by chance | 3 to 23 | mixed. A whole band was used up for 1 child in 3,000 |

**Read the third row.** A child who must be taught at every band spends 18 years here (version 4 said 24: the song now costs no year). How long a year takes is not known: **time it with children** [story, 16d, row 9]. The story's reviewer still finds 18 New Years thin if a child counts them (the story, 16e).

### Where this bends your engine

| | Your engine | Here | Why |
|---|---|---|---|
| 1 | States the answer after a miss | The year shows it | Your rule of 22 November |
| 2 | Three tries at the gate | Two | A band has 11 or 12 problems. Two gates need 10 |
| 3 | Picks the skill underneath by judgement | Two count faults: the small row. Two reading faults: told again. Anything else: the small row | Code can see this much. The AI could see more |
| 4 | Stops when the step below is missing | Teaches the step below once, by song | Your words to the main thread: "go down one or two levels... teach that and then work back up" |
| 5 | Assesses a skill once | Three towns, a band higher each time | A town is a place |
| 6 | Confirms or corrects each small step | The singer sings a line again, with shells, by the lamp | She is teaching a song |
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

## 8b. What I asked of the story thread the second time. All five: yes [its section 15]

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

## 9c. The third joint review: two blockers, both mine

| | Found | Done |
|---|---|---|
| B1 | **A band "ran out" with problems still unused,** and a child who was getting them right was put in a rest. One path could never finish: it needed 12 low problems and there are 11 | The picker gives up one wish at a time and never stops while a problem is unused. The two sung rows are the child's own missed rows, so they use up none. Played again: no band runs out, except for 1 coin-flip child in 3,000 |
| B2 | **Likely wrong replies could not be typed.** "One count day over" for 12 × 8 is 108. In a two-digit box it became 10, and the dock showed the wrong side | The box takes three digits. Checked from 0 to 999 |

**For the story thread, from the same review (not blockers). All six are answered in the story's section 16a, and version 5 of this note follows them:**
1. **The seller counts ahead, and "nobody on Algora can".** Her example says "I counted on: 100, 120, 140, 160." A child can ask why she does not read the keeper's stick herself.
2. **Her example lands on a double** (80, then 160). A child may take "double the last cut" from it. Count day 6 or 9 would not.
3. **The cost of too few is not said as a cost.** "Mats with no hook are no use to me" is her loss, and the story adds "nobody is worse off for a mat". Before the promise, saying less sounds safe.
4. **"A cousin with no plum" costs nothing on the plum side.** Saying 99 loses no plums. And Gran does not say either cost before she asks.
5. **Where does a sung year happen?** The Market is at the lake. The singer is in a town.
6. **A rest: does it darken towns already learned?** My note said "in every town". The story says lit windows "from then on". The story is right: a learned town stays lit.

**Mine, still open:** a reading fault fails the small row for the same reason, because it is the same sentence. "Decide without me" is not in the code yet.

**Not done:** the class picture (the reviewer's finding 18). With no server there is nothing to build. It stays a question.

---

## 10. Your decisions

Both reviewers said the two notes hold more decisions than a person can answer. The second said the threads could simply decide four of mine. So I have, and they are listed under the table. These three are left.

| | Decision | Options, with costs | I would choose |
|---|---|---|---|
| 1 | **Is "how much" enough for a first big quest?** | Yes: it is your multiples, a table, a decision, and what follows. Or it is practice, and the big quest must wait for the other two kinds, which are not ready | yes, as a first trial |
| 2 | **One right year lights a town for good** | Yes, as your engine passes a skill on one right answer. Or two right years on different count days: surer, and twice as long for every child | one |
| 3 | **A child who must be taught at every band spends 18 years** (24 in version 4: the song now costs no year) | Accept it for the trial, and time it. Or teach once only, and after that a miss is a rest | accept, and time it |

**Decided by the two threads, as you said we should. Say if you disagree.**
- **Nine gold months.** You said: "however long you make their year."
- **Two tries at the gate,** not your engine's three. A band has 11 or 12 problems.
- **The singer may sing a wrong line again.** Your engine corrects in teaching too.
- **Two pots back for an empty hook.** The other way lasts into the next year.
- **The step down:** the small row for count faults, a second telling for reading faults.
- **The trial has no class view.** No server has run.
