# GMQ — joining the game to your maths dashboard: a first step — v1 — 2026-11-19

**Stage:** a first step is built in sketch version 37. Played by tests only.
**Tags:** [Source] = from your dashboard files or your words. [Proposal] = my suggestion, yours to change.

---

## 1. What I did with the zip

- I unpacked it in a working folder **outside** the repository. Nothing from it went to GitHub.
- **I opened:** the README, the active skill map (`maps/num-2.0.json`), the data contract and the master overview.
- **I did not open** the `private/` folder. Your own README calls it "real class data". You told me the names are aliases, and I believe you. I simply did not need it, so it stayed shut.
- I searched the rest for live keys or passwords. I found none. The config file in the zip is only the example one.
- The zip also holds a `.git` folder with the project's history. I did not look inside it.

---

## 2. What your dashboard is, as I read it [Source]

Please correct me if this is wrong.

- A tool for one teacher and one class. It records what evidence exists about each student on each skill.
- **It will not say more than the evidence supports.** No grades, no mastery percentages, no rankings, no labels.
- Evidence comes from work **you have marked**. Each answer is one record: the student, the item, the skill, CORRECT or INCORRECT or PARTIAL or UNGRADED.
- A status, such as "strong evidence" or "repeated difficulty", is worked out in one place only: a fixed table on the server. The screen never works one out.
- "Not looked at yet" must never look like "did badly".
- Several answers on one worksheet are not several assessments.
- The map is yours: **37 skills in 11 threads**, all Grade 3 number and operations.

---

## 3. What the game does now

### It keeps evidence, in your codes

Every quick answer is kept as one record:

| Kept | Example |
|---|---|
| the day | 2026-11-19 |
| your skill code | NUM.FACT.1 |
| where it happened | space hazard, time wisp, mud rats, world lock |
| right or wrong | right |
| first try, or a later try | first try |
| the question | 7 + 5 |

The 37 codes and their names were copied from your map by a script. I did not retype them.

### A teacher's view, with a tab for each thread

In the teacher section of the game: **Practice evidence, by your skill map.**

- One tab for each of your 11 threads: REL, FACT, PV, EST, ADD, SUB, MULT, DIV, PROB, PAT, FRAC. A dot marks a tab that has practice in it.
- For each skill: first tries right, first tries wrong, later tries, how many different days, the last day, and where.
- **Counts only.** No percentage. No status. No label. A test checks that none ever appears.
- A skill with no answers says "No practice yet." It is not shown as a zero score.
- A skill the game cannot practise says "The game has no quick questions for this skill yet."
- One more tab: **Not on the map.** Chronosia's time skills go there. Your map is number only, so time has no code.
- "Show as data" gives the records in your dashboard's words, CORRECT and INCORRECT. It says plainly that it is **not** a Stage 2 import.

### Which game questions go with which of your skills [Proposal: check these]

| Your skill | Its name | In the game |
|---|---|---|
| NUM.FACT.1 | Addition and Subtraction Facts Within 20 | sums within 10 and within 20: space hazards, time wisps, mud rats |
| NUM.ADD.1 | Add Within 100 | 2-digit sums, with and without regrouping: the same three |
| NUM.PV.6 | Round to the Nearest 10 | number locks on the small worlds |
| NUM.PV.7 | Round to the Nearest 100 | number locks on the small worlds |
| NUM.ADD.2 | Add Within 1,000 Using Place Value | number locks on the small worlds |
| NUM.SUB.3 | Subtract Within 1,000 Using Place Value | number locks on the small worlds |

**That is 6 of your 37 skills.** The other 31 have no quick questions yet. This is the honest size of the gap you named: "we have to make sure that you get enough practice on enough problems."

### Mud rats are off for now

You said "let's try wisps for now." So the mud rats on Voltara are switched off. The teacher switch turns them back on. Wisps stay on.

---

## 4. The decision that matters: does game practice count in the dashboard?

Your dashboard is built on work you have marked. Game answers are different: a child alone, a machine checking, hints after a wrong answer, and a lot of answers very fast.

| Option | What happens | Good | Cost |
|---|---|---|---|
| **A. Keep them apart** (built) | Game practice shows only in the game's teacher view. | Your dashboard stays exactly what it is. | Two places to look. |
| **B. A new kind of evidence in the dashboard** | The dashboard takes game records as "practice", marked as checked by a machine. Your fixed table decides if and how they count. | One place to look. The two kinds never get mixed up. | A change to your data contract, which you have under change control. |
| **C. Send game answers in as if they were marked work** | The game writes a Stage 2 file. It imports today. | No change to the dashboard. | I advise against it. See below. |

**Why not C.** By your own table, two or more graded answers across two assessments at 80% right is "strong evidence". If each day of play were an assessment, two short play sessions would say "strong" about a skill. And 96 wins is about 290 answers. That would drown a ten-item worksheet you marked by hand.

**If you choose B later, three rules I would bring [Proposal]:**
1. Only **first tries** count. A right answer after a hint is not the same evidence. The game already marks this.
2. **One day of play is one assessment**, however many answers it has. This follows your own rule that repeated answers are not independent assessments.
3. Timed answers, from hazards, are marked as timed. Being slow is not being wrong.

---

## 5. How to cover more of your 37 skills [Proposal]

| Way | Skills it could add | Cost |
|---|---|---|
| Record the tasks already in the game | Voltara and Galactic Trade already ask for rounding, regrouping, adding to 1,000, estimating and finding a difference. That reaches PV.2, PV.6, PV.7, EST.1, ADD.2, SUB.3 and perhaps MULT.1. | Small. A day. |
| Wake up the skills bank | The sketch still holds 72 small skills with question makers. You found it "too much" as a trainer and it is hidden. Its questions could feed wisps and hazards instead. Each one would be matched to one of your 37 codes. | A few days, mostly matching and checking. |
| New question makers | REL (true or false equations, unknowns), MULT and DIV facts, FRAC. The credits already use quarters. | A day or two for each thread. |

Subtraction, multiplication and division hazards were already on your list. They would land on NUM.FACT.1, NUM.SUB.1, NUM.MULT.3 and NUM.DIV.3.

---

## 6. One thing to know

The game page is public, and so is its repository. It now carries the **codes and short names** of your 37 skills, for example "NUM.PV.6 Round to the Nearest 10". It does not carry the full wording, the prerequisites or anything else from the dashboard. If you would rather the names were not public, I can keep the codes and drop the names.

---

## 7. How it was checked

| Check | Result |
|---|---|
| The map in the game: num-2.0, 37 skills, 11 threads, every code well formed | yes |
| A space hazard, a 2-digit sum and a world lock each leave records under the right code | yes |
| A wrong first try and a right later try are kept as two different things | yes |
| The view shows counts for each thread, and never a percentage, a status or a label | yes, all 12 tabs |
| The numbers in the view are easy to see | yes. The first version was not. A contrast check is now in the test. |
| The records are kept after a reload. Only the newest 1,500 are kept. | yes |

The test is `checks/practice_evidence_test.js`.

---

## 8. What could prove this wrong

| Claim | Test |
|---|---|
| My six matches are right | Read the table in section 3. You wrote the skills. If "add within 20" is not what you mean by NUM.FACT.1 here, say so. |
| Counts with no status are useful | Look at the view after your daughter plays. If you find yourself working out a percentage in your head, the view is missing something your dashboard already does better. |
| First tries are the fair thing to count | Watch her get one wrong, read the hint and get it right. Decide whether that second answer tells you anything. |
| Keeping them apart is right for now | If you never open the game's teacher view, option B is needed sooner. |

---

## 9. Decisions for you

1. **A, B or C** in section 4.
2. **The six matches** in section 3: right or wrong?
3. **Which way to cover more skills first:** the tasks already there, the skills bank, or new question makers?
4. **Time skills:** leave them off the map, or will your dashboard get a measurement map one day?
5. **The skill names in a public page:** fine, or codes only?
