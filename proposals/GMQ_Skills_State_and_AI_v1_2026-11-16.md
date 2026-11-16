# GMQ — every skill, the state, and the AI — v1 — 2026-11-16

**Stage:** proposal, with working parts in the sketch.
**Sketch:** https://claude.ai/artifact/PrDvY1EZX9tYh1sDCHJ4Xe
**Tags:** [Source] = from your material or your words. [Proposal] = my suggestion.

---

## 1. What you said [Source: Marc, 2026-11-16]

- The goal is that **every maths skill is addressed**. Students find their gaps and fix them.
- It is a maths skills builder **and** a fun, creative, exploring adventure.
- The scenarios and word problems should be engaging and unique.
- Two questions: do you need a constraint architecture for the AI? Does code keep track of state?

---

## 2. Your two questions

### 2.1 Do you need a constraint architecture for the AI? Yes.

The AI has three small jobs in this world:

| Job | Example |
|---|---|
| **Answer the unexpected** | A cadet types "lick the wall". The world answers, inside that room's facts. |
| **Wrap a problem in a story** | The code sends 35 and 47 and "add". The AI makes it Zip sweeping up bolts. |
| **Give a hint** | "Add the ones, then the tens." Never the answer. |

A constraint file is what keeps it to those jobs. Without one, an AI will mark answers, change numbers, hand out rewards and invent rooms.

**I drafted one:** `engines/gmq-world/constraints/gmq-world.txt` (v0.1). It follows the shape of your Novus and Math Skills files.

- It has three modes: EXPLORE, WRAP and HINT. The server says which.
- It never marks maths, never makes a number, and never names a reward.
- It may end a reply with one tag, such as `[TRY: push crate]` or `[TRACE: dug]`. The server checks the tag before anything is saved.
- It keeps "Solon is the architect" for debug mode.
- **It has not been run against a model.** It is a draft for you to rewrite. You know how your models slip. I do not.

**What the server must check, because a constraint file alone is not enough:**
1. Every number in a story is one the code sent, and none is missing.
2. The question line is the code's own, unchanged.
3. A tag names a real thing and an allowed action.
4. If a story fails a check, the server uses a plain one from the bank.

### 2.2 Does code keep track of state? Yes. All of it.

The AI remembers nothing between turns. Each turn the server sends it a small slice of the world. Everything that must be true tomorrow lives in code.

**For each student, the code keeps:**

| What | Example |
|---|---|
| Where they are | Navigation Bay, tile 30, 9 |
| What they carry | wrench, magnet, key card |
| What they changed | crate pushed, vent open, robot fixed and named Zip |
| Secrets found | 9 of 15 |
| Ship parts and cards | Shield, Navigation; card numbers only |
| **Every skill's status** | "Add with regrouping": REMEDIATED, 9 answers |
| Their own numbers | a seed, so their problems differ from a classmate's |
| A log | each answer: skill, right or wrong, step, time |

**For each class, the code keeps:** the traces students leave (holes, beacons), class goals, and the teacher's view.

**For the world, written once:** places, things, secrets, number rules, the story bank and the card list.

The skill statuses are your own, from Math Skills v4.1: PASSED, SELF-CORRECTED, REMEDIATED, IN-PROGRESS, FAILED-FOUNDATIONAL and NOT-TESTED. [Source]

---

## 3. Every skill addressed

### 3.1 The skill list already exists: yours

Your Math Skills engine holds the list. I read all 48 files (`checks/skill_map_build.py`, output in `skills/skill_map.csv`).

- **1,835** skill statements in 8 level bands and 6 maths areas.
- **662** different statements. Many repeat across bands.
- For a Grade 3 class I took six bands: two below for gaps (161–180), two at level (181–200) and two above for stretch (201–210). That is my assumption. Check it against your own test data.
- That gives **419 different skills** to cover.

### 3.2 Your six maths areas match your five galaxies

| Your maths area | Galaxy | Grade 3 skills |
|---|---|---|
| Number Sense, and Computation | Numerix | 186 |
| Algebraic Concepts | Patternox | 87 |
| Measurement | Metrica | 76 |
| Geometry | Geometrica | 45 |
| Data, Statistics and Probability | Databa | 25 |

So each galaxy can own its skills. A planet is a cluster of skills. [Proposal]

### 3.3 How each skill can be asked

I sorted the 419 by keywords. This is a first pass, not a teacher's judgement.

| How | Skills | What it needs |
|---|---|---|
| **A number answer** | 216 | A number rule, or your engine's check. Works in a mini quest today. |
| **Needs a picture** | 169 | A toy in the scene: a clock, a graph, a number line, a shape, an array |
| **A word answer** | 28 | Your engine's spelling-forgiving match |
| **Hands-on** | 6 | A real task. You confirm it. |

**The honest gap:** 34 number rules are written and tested. Each is matched to a statement in your engine, apart from fraction of a set, which comes from your 2026 tracker. That covers about 30 skills of 419. The 169 picture skills are the big job. Each kind of picture is a toy that must be built once: the sketch has four (an array of rocks, crates on a scale, tanks, a lit city).

**A defect in your skill files** [Source]: `231-240_AlgebraicConcepts.txt` holds seven lines of AI chat text ("Structural_assessment:" and so on). Two skills in the 181–190 files have lost their bullet star, so the engine may not read them.

### 3.4 Stars: how a student sees their gaps [Proposal]

- **Every skill is a star.** A galaxy's stars are its skills. A lit star is a skill shown. A dark star is a gap.
- The student's goal becomes "light every star". You see the same chart with the statuses on it.
- The sketch has a star chart for 34 skills in nine groups, with a teacher view.

### 3.4a The 34 skills in the sketch

| Group | Skills |
|---|---|
| Place value | order numbers, split into parts, round to 10, round to 100 |
| Counting | count on, odd and even |
| Add and subtract | small numbers, 2-digit, with and without regrouping |
| Multiply | equal groups, times 2, 5 and 10, tables to 10 |
| Divide | share equally, divide by 2, 5 and 10, division facts |
| More and less | 10 more or less, 100 more or less, count back, take away tens |
| Bigger sums | add three numbers, 3-digit add and subtract, 3-digit with regrouping |
| Find the missing number | times tens, missing part of a sum, missing times number |
| Fractions | fraction of a set. Your tracker names this as your class's clearest gap. [Source] |
| Measure | how long it took, all the way round, area of a rectangle, change from 100 baht |

### 3.5 The robot is the trainer [Proposal]

In the sketch, the robot you fix in the Shield Bay follows you. Talk to it and it asks the next skill you have not shown. It follows your Math Skills flow [Source]:

1. **Ask.** Three right answers light the star.
2. **One more try.** After a miss it shows the answer and asks one like it. If that is right, the miss was a slip.
3. **Teach in small steps.** After a second miss it breaks the sum into single steps. "Add the ones first. 8 + 6 =".
4. **Three in a row.** Then the student proves it. The star turns gold.
5. **Not ready.** After two failed tries at three in a row, it says "This one needs some building blocks first" and moves on.

Code makes every number and marks every answer. I tested all five paths, and 300 problems for each of the 34 rules, with their stories and teaching steps.

**The butterfly and the Gumblefish on Voltara ask from the same list.** So practice also turns up while exploring, not only from the robot.

---

## 4. Engaging, unique problems

- `content/scenario_bank_numerix.json` holds **120 story problems**, three or four for each of the 34 rules.
- They are set in your world: Zip and the bolts, the Gumblefish and its shells, FlavorBurst pies, energy blocks, comets, Galaxy Gems.
- The code picks the numbers. The story only carries them. So every student gets a different problem, and it is always correct.
- A script checks each one (`checks/scenario_bank_check.py`): the right numbers, no sentence over 15 words, no hard words. All 120 pass.
- On your site, the AI in WRAP mode would write new stories each time. The bank is the safe fallback, and it shows the AI the style.

**Problems that carry forward** [Proposal], as your missions do: the number of bats in one room becomes the tickets in the next. The trainer does not do this yet. It is the next thing I would add to quests.

---

## 5. What is built, and what is not

| Part | Status |
|---|---|
| Station and Voltara you can walk and explore, 15 secrets | In the sketch |
| 34 number rules, tested on 10,000 seeds | Done |
| 120 story problems, checked | Done |
| Trainer: ask, one more try, small steps, three in a row | In the sketch, tested |
| Star chart with teacher view | In the sketch |
| Skill map of your 1,835 statements | Done, first pass |
| Constraint file for the world AI | Draft, not run |
| Server: saving, logins, the AI call | Not built |
| Rules for the other 390 or so skills | Not built |
| Toys for picture skills (clock, graph, number line, shapes) | Four built, many to go |
| Painted art | Not started. Your decision. |

---

## 6. What could prove this wrong

| Claim | Test |
|---|---|
| The trainer finds real gaps | Give five students the trainer and your own check-up. Compare the gaps each finds. |
| Small steps teach | Count how many students pass three in a row after the steps. |
| Stars motivate | Watch whether students go back to a dark star by choice. |
| The AI stays inside the constraint file | Run 200 odd inputs through it. Count broken rules. |
| Six bands is the right range | Compare with your class's test scores. |

---

## 6a. Answers so far (Marc, 2026-11-16)

- **Bands:** 161 to 210 to start. Up to 240 later.
- **Order:** probably the skill list in order. He asked for my view.
  - **My view [Proposal]:** follow the list in order. Add one thing: you set each student's starting band. Your skill files are already sorted into the same bands an NWEA maths score falls into, so a score of 193 points straight at the 191–200 files. A student who starts too high drops back, because the trainer already steps down when a skill "needs building blocks".
  - Without a score, start everyone at 161–170. Strong students pass each skill in three answers and move up fast.
- **What next:** my choice. I will build picture toys next, starting with the kinds that unlock the most skills: a number line, a clock, a bar graph, a grid for area, and a fraction bar.
- **The opening:** built into the sketch from your own site text.

## 7. Decisions for you

1. **The level bands:** are 161–210 right for your class?
2. **The robot as trainer:** keep it? It is a new character.
3. **Order:** should the trainer follow the skill list in order, as your engine does, or start from each student's test results?
4. **What next:** more number rules (fast), or picture toys (slow, but they cover 169 skills)?
5. **The constraint file:** will you rewrite the draft, or shall I test it against a model first?
