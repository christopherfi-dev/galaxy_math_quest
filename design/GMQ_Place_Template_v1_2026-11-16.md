# GMQ Place Template — v1 — 2026-11-16

**Stage:** proposal. Nothing has been built.
**Builds on:** `GMQ_World_Handoff_2026-11-16_v8.md` (§5: master world, checkpoints, per-student numbers, rewards) and `GMQ_World_Map_v1_2026-11-16.md` (which places exist and how they connect).
**Read this first:** everything here is a proposal unless it is marked **Decided**. Open choices are collected in §7.

---

## 1. What the template is for

Every place in the master world is written in one fixed format. That splits the project into two separate jobs:
- **Writing the world:** the AI drafts places from Marc's Drive material into this format, and Marc checks them.
- **Writing the engine:** the code runs any place written in this format, so a new planet needs new place files, not new code.

A place file has three readers, and every section says which one it is for:

| Label | Who reads it | What it means |
|---|---|---|
| **[AI]** | The world's AI, every turn the student is in this place | Facts it describes from. The AI writes the scene at the student's reading level. Marc doesn't write scene text. |
| **[CODE]** | The server only | Unlocks, numbers, answer checks and rewards. The AI never sees these sections. |
| **[TEACHER]** | Marc and other teachers | Materials, sources and fixes. Neither the AI nor the code uses them. |

**What a place file never holds:** student data. Who is here now, what students left behind, and each student's numbers and progress all live in the class copy (handoff §5.1), never in the master file.

---

## 2. Four kinds of block

| Block | One per | Holds |
|---|---|---|
| **PLACE** | place | where it is, what is in it, how to get in and out |
| **TASK** | task | one task: its numbers, checkpoints, events and reward. A task lives inside the place where it happens. A Space Station bay holds three. |
| **CHECKPOINT** | step a student must pass | one checked answer inside a task |
| **QUEST** | quest | the tasks in order, what opens the quest, and the quest's reward. A quest can span several places, as Zephyron does (crash site, city, facility). |

---

## 3. The blank template

### 3.1 PLACE

```
PLACE
id:            galaxy.planet.place        e.g. numerix.voltara.council
name:          Energy Council Chamber
kind:          hub | quest | ambient       (handoff §5.2)
galaxy:        none | Numerix | Patternox | Metrica | Geometrica | Databa
planet:        none | Voltara | Chronosia | Xylophora | Zephyron | ...
position:      galaxy / planet / landmark  (for a later 3D layer; the text world ignores it)
status:        draft | checked | live
source:        the Drive docs or site pages this place comes from

OPENS WHEN  [CODE]
- always | ship part: <part> | quest done: <quest id> | task done: <task id> | teacher switch
locked:     [AI] what the student is told when it's locked (facts only, no hint about the answer)

EXITS  [CODE + AI]
- <exit name> -> <place id>    (only if: <condition>)

FACTS  [AI]
- Short, true statements the AI must keep true every time it describes this place.

ATMOSPHERE  [AI]
- Details the AI may vary freely: sounds, colours, smells, weather.
- Nothing here can be picked up, used or changed.

THINGS  [AI + CODE]
- <name>: what it is | take: yes/no | use: what happens | hidden until: <action>

PEOPLE AND CREATURES  [AI]
- <name>: who they are | what they know | what they will say | what they never say

TASKS HERE
- <task id>, <task id>   (TASK blocks follow)

STUDENT CHANGES  [CODE]
- What a student may change here that stays for the next visitor.
- Never saved: numbers, answers, codes.

NEVER  [AI]
- Things the AI must never do in this place, beyond the world's laws.

TEACHER NOTES  [TEACHER]
- Materials to prepare, errors fixed, links.
```

**Ambient places** use the same block, with no TASKS HERE and usually no OPENS WHEN. Under the Novus rule, most of their THINGS are dead ends (handoff §5.2).

### 3.2 TASK

```
TASK
id:             numerix.voltara.t1
title:
quest:          <quest id>, task <n> of <n>
strand:         the curriculum quest it covers ("tasks / strand order" doc)
group:          A | B | C   (handoff §6)
before you begin: IXL skills or other practice, if any
opens when:     [CODE] always | previous task done

BRIEFING  [AI]
- What the student needs to know: the story, the job, what counts as done.

STUDENT NUMBERS  [CODE]
- Each variable: its range, its step (e.g. multiples of 10) and the rules
  that keep it at Grade 3 level.
- Seeded per student, so places are shared and numbers are not (handoff §5.4).
- SOLVABLE: the rule that guarantees every generated version can be done.
  The code tests it on many seeds before the task goes live.

SHOWN TO STUDENT  [AI]
- Which of the student's own numbers the AI may show, and when.

CHECKPOINTS
- <checkpoint id>, ...   (CHECKPOINT blocks follow)

EVENTS  [CODE]
- Random events (e.g. scenario cards): the deck, how many are drawn, when,
  and what each one changes. The code draws; the AI only narrates.

ON FINISH  [CODE]
- One card draw. Decided (Marc, 2026-11-16).
- Plus any ship part, upgrade or special reward.

HINTS  [AI]
- What the AI may say after a wrong answer: strategy, never the answer.

PHYSICAL PART  [TEACHER]
- Group B and C only: materials, where students work, what they bring back.
```

### 3.3 CHECKPOINT

```
CHECKPOINT
id:             numerix.voltara.t1.c1
kind:           one answer | conditions | hands-on result | teacher-confirmed
asks:           [AI] the question, with the student's numbers in {braces}
student gives:  [CODE] one number | a list of numbers | a word | a choice
check:          [CODE] the rule. Code only; the AI never sees it.
if right:       [CODE] next checkpoint | task done
if wrong:       [CODE] the code tells the AI which condition failed.
                [AI] the AI may name the problem, never the fix.
tries:          [CODE] how many before the teacher is flagged (§7, item 4)
```

The four kinds come from handoff §5.3:
- **One answer:** the code computes the answer from the student's numbers and compares.
- **Conditions:** the code checks written conditions, for tasks with many right answers.
- **Hands-on result:** the world gives the numbers, the student works with real materials, then types the result.
- **Teacher-confirmed:** the teacher marks it done.

### 3.4 QUEST

```
QUEST
id:             numerix.q1
title:
galaxy / planet:
tasks in order: <task id>, <task id>, ...
opens when:     [CODE] (world map §3)
on finish:      [CODE] quest reward (part, upgrade, special)
source:
```

---

## 4. Filled example: Voltara, Energy Council Chamber

Taken from Marc's material: the Numerix Quest 1 page and Task 1 page on the student site, the "Level 1" doc (city list and scenario cards) and "New numbers Quest 1". Anything not in those sources is marked **Proposal**. Voltara is the pilot candidate in handoff §10, so this example doubles as a first draft of the pilot.

### 4.1 PLACE

```
PLACE
id:            numerix.voltara.council
name:          Energy Council Chamber
kind:          quest
galaxy:        Numerix
planet:        Voltara
position:      Numerix / Voltara / Energy Council Chamber
status:        draft
source:        site: Quest #1 page, Task 1 page; Drive: "Level 1", "Galaxy Numerix - Quest 1 - Task 2"

OPENS WHEN  [CODE]
- The student has landed on Voltara. (What opens Voltara is in world map §3.)

EXITS  [CODE + AI]                                        Proposal
- landing field  -> numerix.voltara.landing
- city overlook  -> numerix.voltara.overlook   (ambient)

FACTS  [AI]
- Voltara has rainbow-coloured skies and clouds like cotton candy.
- Its trees have leaves that glow in the dark. Its rivers sparkle like diamonds.
- Animals talk here, such as butterflies and the giggling Gumblefish.
- FlavorBursts are fruits that change flavour with each bite.
- The Energy Council shares Voltara's energy among the city's three sectors:
  Residential, Commercial and Industrial.
- The energy supply is limited.

ATMOSPHERE  [AI]
- Colours, the hum of the city, glowing leaves at the windows.

THINGS  [AI + CODE]
- City List: what each part of the city needs | take: no | use: shows the
  student's own needs
- Energy Count Sheet: the student's energy blocks in 1s, 10s and 100s |
  take: no | use: shows the student's own blocks
- City Map: the three sectors | take: no | use: where the student places energy

PEOPLE AND CREATURES  [AI]
- Energy Council members: not described in the sources. Proposal: Marc names
  them, or they stay unnamed.

TASKS HERE
- numerix.voltara.t1

STUDENT CHANGES  [CODE]                                   Proposal
- None. Each student's map and blocks are their own, in the class copy.

NEVER  [AI]
- Never say whether a plan works. Only the code decides that.
- Never show another student's city list, blocks or plan.

TEACHER NOTES  [TEACHER]
- The supply numbers conflict across versions (world map §6, item 1). Pick one
  before this goes live.
```

### 4.2 TASK

```
TASK
id:             numerix.voltara.t1
title:          Mission Voltara: Power-Up Challenge
quest:          numerix.q1, task 1 of 3
strand:         Numbers Quest 1 (place value; rounding)
group:          A
before you begin: IXL Grade 3 C1 and C2 (rounding)
opens when:     always, once the student is on Voltara

BRIEFING  [AI]
- The student joins Voltara's Energy Council as an "energy helper".
- Lights and machines need energy, shared among homes, stores and factories.
- There is not enough energy for everything, so the student must choose.

STUDENT NUMBERS  [CODE]                                   Proposal
- needs: each place on the City List starts from the "Level 1" doc
  (Residential 570, Commercial 920, Industrial 450; 1,940 in all)
  and moves up or down by 0, 10, 20 or 30, never below 10.
- shortfall: 200 to 300, in steps of 10.
- supply: total needs minus shortfall.
- blocks: 6 to 9 hundreds, the rest made of tens and ones, with at least
  100 ones and the ones a multiple of 10.
- SOLVABLE: supply is always less than total needs, the blocks always add up
  exactly to the supply, and any plan within the supply can be built from them.

SHOWN TO STUDENT  [AI]
- The student's own City List and block counts, whenever asked.

CHECKPOINTS
- c1 Make a Plan, c2 Build it in blocks, c3 What if something changes?,
  c4 Reflect

EVENTS  [CODE]
- Scenario deck: the 10 cards in the "Level 1" doc (Solar Flare: 300 less
  supply; Energy Efficiency: each sector needs 50 less; Earthquake: Residential
  +100; Commercial Boom +150; Industrial Strike -100; Festival: Residential and
  Commercial +50 each; New Factory: Industrial +200; Public Transport:
  Commercial -30; Heatwave: Residential +70; Tourist Season: Commercial +50,
  Residential +20).
- Draws follow the site's Round 3: one card, then two cards (the student picks
  one), then a final card.
- Proposal: Solar Flare takes away 3 hundred-blocks. Every card that changes
  the supply needs a rule like this, so the blocks still match the supply.

ON FINISH  [CODE]
- One card draw. Decided.

HINTS  [AI]
- Strategy only, e.g. "Which places can't go without power?"

PHYSICAL PART  [TEACHER]
- None if the blocks are typed. The class version used real base-ten blocks
  and a printed City Map.
```

### 4.3 CHECKPOINTS

```
CHECKPOINT
id:             numerix.voltara.t1.c1    Make a Plan
kind:           conditions
asks:           How much energy will each sector get? You have {supply}.
student gives:  three numbers (Residential, Commercial, Industrial)
check:          all three are whole numbers
                AND their total is no more than {supply}
                AND no sector gets more than it needs
if right:       c2
if wrong:       the code names the condition that failed

CHECKPOINT
id:             numerix.voltara.t1.c2    Build it in blocks
kind:           conditions
asks:           Which blocks will you use for each sector?
student gives:  hundreds, tens and ones for each sector (9 numbers)
check:          for each sector, 100×hundreds + 10×tens + ones = its amount from c1
                AND the hundreds, tens and ones used are each no more than the
                student has
if right:       c3

CHECKPOINT
id:             numerix.voltara.t1.c3    What if something changes?
kind:           conditions, three times
asks:           Read the card. Fix your plan.
student gives:  new amounts and blocks after each card; after the two-card draw,
                which card they chose and why
check:          c1 and c2 rules again, with the card's changes applied
                The "why" is saved for the teacher. The code doesn't mark it.
if right:       c4

CHECKPOINT
id:             numerix.voltara.t1.c4    Reflect
kind:           teacher-confirmed
asks:           Is your city a great place to live now? Why?
check:          the teacher marks it done (the site asks for a photo and a video)
if right:       task done
```

### 4.4 What the example shows

- **One place, four checkpoint uses:** c1 and c2 are conditions checks, c3 adds random events, and c4 is teacher-confirmed.
- **The place-value maths sits in c2.** The total check in c1 is subtraction. The block check in c2 is where place value is tested.
- **The number rule was tested:** 20,000 random students, with 30 random plans each, all within the supply. Every plan could be built from that student's blocks (Python check, 2026-11-16). The scenario cards were not part of the test.
- **Typing load:** c2 asks for 9 numbers, and c3 asks for them three more times. That may be too much typing on an iPad for Grade 3. One option is to check blocks for only one sector, chosen by the code (§7, item 5).
- **"Uses all the energy" is not a condition yet.** The site says "check that you haven't given away too much" and assesses "resource-efficient" allocation. Whether a plan must use the whole supply is Marc's call (§7, item 6).

---

## 5. Ambient example: Voltara city overlook

```
PLACE
id:            numerix.voltara.overlook
name:          City Overlook
kind:          ambient
galaxy:        Numerix
planet:        Voltara
position:      Numerix / Voltara / City Overlook
status:        draft
source:        Proposal; facts from the Quest #1 page

EXITS  [CODE + AI]
- council chamber -> numerix.voltara.council

FACTS  [AI]
- From here you can see the three sectors of the city.
- Glowing trees line a sparkling river below.

ATMOSPHERE  [AI]
- Talking animals passing by; the smell of FlavorBursts.

THINGS  [AI + CODE]
- a giggling Gumblefish in the river: use: it chats, and it knows nothing
  about energy (dead end)

STUDENT CHANGES  [CODE]
- Proposal: a student may leave a marker here (e.g. a flag). Markers never
  carry numbers.
```

---

## 6. How a place gets into the world

1. **Draft:** the AI drafts the place from Marc's Drive docs into this template, citing its sources.
2. **Check the keys:** every answer key and number rule is checked before it goes in. The AI-written keys in Drive contain errors (handoff §8). The code also tests each SOLVABLE rule on many seeds. Per-student numbers make this more important. A fixed worksheet with an error fails once, but a number rule with an error fails for some students and not others. (The 5-2 Power Allocation draft already has one: its blocks can't make its total. See world map §6, item 2.)
3. **Confirm:** Marc reads the place and marks it `checked`.
4. **Pilot:** a class copy runs it, and it becomes `live`.

---

## 7. Open decisions on the template

1. **File layout:** one .md file per place (proposed), or one file per planet with every place in it.
2. **Exit names:** named exits ("council chamber") or compass directions ("north"). Named exits are proposed because students type them. Whether Grade 3 students find names easier is a guess to check in the pilot.
3. **Arrival text:** always written by the AI from FACTS (proposed), or a fixed first-arrival text Marc writes for some places.
4. **Wrong answers:** how many tries before the teacher is flagged, and whether the code may tell the AI which condition failed.
5. **Typing load:** how many numbers a checkpoint may ask for on an iPad (see §4.4).
6. **Voltara c1:** must a plan use the whole supply, or only stay within it?
7. **How answers are entered:** handoff §3, item 5. The template works with either option.
8. **Student changes:** which places allow lasting marks, and what kind.
