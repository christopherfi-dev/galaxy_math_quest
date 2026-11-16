# GMQ Mini Quests — the Math Skills engine and a first station set — v1 — 2026-11-16

**Stage:** proposal. Nothing is built.
**Builds on:** `proposals/GMQ_Mini_Quests_v1_2026-11-16.md` (§0 holds your decisions).
**Tags:** [Source] = from your material. [Proposal] = my suggestion. [Conflict] = sources disagree.

---

## 1. What I read

Your zip is now in `engines/math-skills/`. It holds no keys and no student files. I read the v1.1 API, the v4.1 constraint file and the 48 skill files.

---

## 2. What the Math Skills engine really does

The handoff describes it as "per-student seeds and answer checks". That is close, but not exact. [Conflict with handoff §5.4 and `SOURCES_Index.md` §4]

**How it works [Source]:**
1. The student picks a level band (161–170 up to 231–240) and one of six maths areas.
2. The server loads a skill file: a list of plain statements. For example: "Adds whole numbers with sums within 100, with regrouping".
3. **The AI writes each question.** It ends the question with two hidden tags: `[ANSWER:80][CHECK:51+29]`.
4. **The server recomputes the CHECK sum.** If the AI's answer is wrong, the server replaces it.
5. The server compares the student's answer and tells the AI "correct" or "incorrect".
6. On a wrong answer the AI probes once, then teaches in small steps, then asks three in a row.
7. The "seed" is a random number given to the AI, with the words "use it to vary the numbers". Code does not make the numbers.

**What this means:** your engine already does "code and AI", but in a different way from my first proposal. So there are two ways to make a mini quest.

| | Way 1: code makes the numbers | Way 2: the Math Skills way |
|---|---|---|
| Who picks the numbers | Code, from a tested rule | The AI, from a skill statement |
| Who works out the answer | Code | The AI, then the server recomputes it |
| Who marks | Code | Code |
| Skills ready today | 18 rules (`checks/miniquest_numbers_check.py`) | 1,844 statements in 48 files |
| Stays inside the level | Always. Tested on 10,000 seeds. | Usually. Nothing checks it. |
| Works for word answers | No | Yes ("circle", "isosceles"), with spelling forgiven |

**Three gaps in Way 2, found by reading the code [Source: `math-skills-api.php` v1.1]:**
1. **The server checks the sum, not the story.** If the AI writes "51 shells and 29 more" but tags `[CHECK:51+28]`, the server accepts 79. A child who types 80 is marked wrong.
2. **Nothing checks the level.** A statement may say "no regrouping". If the AI picks 47 + 38, no code notices.
3. **Word answers have no check at all.** The AI's own answer is trusted.

These are small risks in a diagnostic tool with a teacher nearby. In a world that hands out cards, a wrong mark is more visible.

**My view [Proposal]:** use both.
- **Way 1** for the core number skills, where a tested rule exists. These are the facts children repeat most.
- **Way 2** for everything else, with one added check: the server confirms that every number in the CHECK sum also appears in the question text. That closes gap 1 cheaply.
- **What would prove this wrong:** log 500 Way 2 questions and count how often gaps 1 and 2 happen. If the count is near zero, Way 2 alone is enough.

---

## 3. What to reuse from the engine [Proposal]

| Part of Math Skills | Use in the world |
|---|---|
| The 48 skill files | The skill bank. A mini quest names one statement. |
| `[ANSWER:X][CHECK:expr]` and the server recompute | Way 2 marking |
| Spelling forgiven; "1,000" and "1000" both accepted | Answer checking everywhere. This matters on an iPad. |
| Probe once, then teach in small steps | What happens after a wrong answer |
| Skill statuses (PASSED, SELF-CORRECTED, REMEDIATED…) | Your view of each student |
| Student login and saved progress | The class copy |

**What does not carry over:** the engine's voice. Its constraint file forbids stories, praise and skill names, and it tests in file order. A world needs the story. So mini quests reuse the engine's method, not its character.

**The 18 tested rules match your skill statements.** Each rule lines up with a statement that is in your files, word for word. For example, rule `add_2digit_regroup` is "Adds whole numbers with sums within 100, with regrouping" (band 161–170 and up). The full table prints when you run the check script.

**One thing to check before sharing outside your class.** The skill files are arranged in bands 161–240, and the statements read like a published assessment's learning statements. If they were copied from one, check its terms before the world is shared or sold.

---

## 4. What one mini quest or mini battle is

From your decisions [Source: Marc, 2026-11-16]:
- A set of **3 to 5 problems**.
- **One card** when it is finished.
- A **mini quest** is doing something with maths. A **mini battle** is fighting something with maths.
- Some are found. Some interrupt.

The rest is [Proposal]:
- **Finished** means 3 to 5 right answers. A wrong answer gets one hint and a fresh problem.
- **Time:** about 3 to 5 minutes.
- **In a mini battle,** each right answer is one hit. The foe needs 3 to 5 hits.
- **Level:** each one names a skill. The code gives problems at the student's own level in that skill.

**Cards, with your rule:** two activities a sitting, three sittings a week, 28 weeks is about 168 cards a student. The original set has about 130 different cards. So duplicates will be normal, and decks will be big, as you expected.

**Two questions**
1. Can a student lose a mini battle? Or does a wrong answer only cost time?
2. May a student replay the same one for another card? If so, how often?

---

## 5. A first set for the KIS Station [Proposal]

**Where the ideas come from:** each bay's skill and its story words are from your "Space Station Info" doc and the intro [Source]. The activities, their titles and their foes are mine [Proposal]. The bay names are from the world map [Proposal]. No new named characters are added. The foes are debris and asteroids, which are in your text.

| # | Kind | Appears | Where | The scene | Skill (your statement) | Rule |
|---|---|---|---|---|---|---|
| 1 | quest | found | Arrival Dock | Crates of scrap metal sit in rows. Count them into the store. | Counts by 10s within 1,000 | `count_on` |
| 2 | battle | interrupts | Arrival Dock | Debris drifts at the dock. Aim at the biggest piece first. | Compares whole numbers within 1,000 using terms | `pv_order` |
| 3 | quest | found | Engine Core Bay | A locked case holds a part. Its code is the next number. | Counts by 10s within 1,000 | `count_on` |
| 4 | quest | found | Navigation Bay | The fuel gauge is stuck. Add two tanks by hand. | Adds whole numbers with sums within 100 (no regrouping, then regrouping) | `add_2digit_plain`, `add_2digit_regroup` |
| 5 | quest | found | Navigation Bay | A cargo crate is too heavy. Take some weight off. | Subtracts whole numbers within 100 (no regrouping, then regrouping) | `sub_2digit_plain`, `sub_2digit_regroup` |
| 6 | battle | interrupts | Navigation Bay | The station drifts off course. Each right answer fires a thruster. | Adds whole numbers with sums within 20; Subtracts whole numbers within 20 | `add_1digit`, `sub_1digit` |
| 7 | quest | found | Shield Bay | Shield cells charge in equal groups. Find the total. | Represents arrays with repeated addition… ; Multiplies basic facts | `mult_repeated`, `mult_2_5_10` |
| 8 | battle | interrupts | Shield Bay | An asteroid field in rows and columns. Each right answer clears a row. | Multiplies basic facts | `mult_facts` |
| 9 | quest | found | Shield Bay | Share the shield power equally between the panels. | Understands division as equal sharing; Divides basic facts | `div_share`, `div_2_5_10` |
| 10 | quest | found | Weapons Bay | The ammo is mixed up. Pick out the odd one, or the even one. | Determines if sets of objects are even or odd | `odd_one_out` |
| 11 | battle | found | Weapons Bay | Target practice. Each right answer hits a target. | Divides basic facts | `div_facts` |
| 12 | quest | found | Power Bay | A circuit is missing one part of its number. | Reads and writes whole numbers within 1,000 in expanded form | `pv_partition` |
| 13 | quest | found | Power Bay | A power readout flickers. Round it to steady it. | Rounds whole numbers within 1,000 | `round10`, `round100` |
| 14 | battle | interrupts | any corridor | Loose debris bangs on the hull. | Any skill the student has already passed | the student's own |

**What the set covers**
- Every bay has at least one. Most have two or three.
- All 18 tested rules are used.
- 9 are quests and 5 are battles. 4 interrupt and 10 are found.
- Number 14 is revision. It keeps passed skills fresh.
- Number 3 uses your intro's line: "Hidden around the station are special parts." [Source]

**What it does not cover:** the galaxies. Voltara, Chronosia and the others can each get a set once this one is agreed.

---

## 6. Two written in full

### 6.1 A mini quest that is found

```
MINI QUEST
id:           station.navigation.m1
title:        Top Up the Tank                                Proposal
kind:         quest
appears:      found. The student looks at or touches the fuel gauge.
where:        station.navigation (Navigation Bay)
story:        [AI] The fuel gauge is stuck. Two small tanks must be added by hand.
              The AI may vary the tanks, the sounds and the mood.
              The AI never changes or restates the numbers.
skill:        [CODE] "Adds whole numbers with sums within 100, no regrouping",
              then "…with regrouping" once the first is passed.
numbers:      [CODE] Way 1. Rules add_2digit_plain and add_2digit_regroup.
              Seeded by student, mini quest and try.
set:          [CODE] 4 right answers finish it.
shown:        [CODE] The code prints each sum on a fixed line.
student gives: one number, on the answer line
check:        [CODE] equals the answer
if right:     [AI] one short line. [CODE] next problem, or finish.
if wrong:     [AI] one strategy hint, never the answer. [CODE] a fresh problem.
on finish:    [CODE] one card draw. Decided (Marc, 2026-11-16).
repeat:       open (§4, question 2)
```

**How it could read:**

> The fuel gauge is stuck. It blinks red.
> Two small tanks sit below it.
>
> **Tank A: 34. Tank B: 25. How much fuel in all?**
> **Answer:** `59`
>
> The gauge clicks. One light turns green.

### 6.2 A mini battle that interrupts

```
MINI QUEST
id:           station.shield.b1
title:        Asteroid Field                                 Proposal
kind:         battle
appears:      interrupts. It may start when the student enters the Shield Bay.
              [CODE] At most once a sitting. Never during a task.
where:        station.shield (Shield Bay)
story:        [AI] Rocks drift at the station in rows and columns.
              Each right answer clears one row.
skill:        [CODE] "Multiplies basic facts", at the student's level:
              x2, x5, x10 first, then facts to 10 x 10.
numbers:      [CODE] Way 1. Rules mult_2_5_10 and mult_facts.
set:          [CODE] 5 hits win.
if wrong:     [AI] the rocks drift closer; one strategy hint. [CODE] a fresh problem.
              Nothing is lost.                               open (§4, question 1)
on finish:    [CODE] one card draw.
escape:       [CODE] the student may type "leave". No card. The rocks stay.
```

**How it could read:**

> A horn sounds. Rocks drift at the station!
> They come in rows.
>
> **4 rows. 6 rocks in each row. How many rocks?**
> **Answer:** `24`
>
> The shield flashes. One row is gone. Four more to go.

**Two rules for anything that interrupts [Proposal]:**
- It never starts while a task is open.
- The student can always leave it.

---

## 7. Decisions for you

1. **Way 1, Way 2, or both** (§2).
2. **Losing a mini battle:** possible, or not (§4).
3. **Replays for cards:** allowed, and how often (§4).
4. **The station set** (§5): keep, cut or change each line. Titles and foes are yours to rename.
5. **How often an interruption may happen.** I wrote "at most once a sitting".

**What I would do next:** write the same kind of set for Voltara, then go back to the big-task redesigns, starting with the Navigation Bay and the food planning in Operation Stardust.
