# GMQ Mini Quests — proposal v1 — 2026-11-16

**Stage:** proposal. Nothing is decided and nothing is built.
**Builds on:** `design/GMQ_World_Handoff_2026-11-16_v8.md` §5 and `design/GMQ_Place_Template_v1_2026-11-16.md`.
**Tags:** [Source] = from your material or your words. [Proposal] = my suggestion. [Conflict] = it disagrees with something already decided.

---

## 0. Decided by Marc (2026-11-16)

These replace the options in §4 to §7 and §13.

1. **Who marks:** code makes the numbers and marks. The AI tells the story and gives hints. (§4, option c)
2. **How they appear:** both. The world can interrupt the child, and the child can find them by exploring. (§5)
3. **The name:** "mini battle" and "mini quest" are both fine. A mini quest is doing something with maths. A mini battle is fighting something with maths. This sits beside handoff §2 decision 1: card battles between students are still a reward.
4. **Cards:** one card for each activity. Students will have big decks and can tune them. (§7, option a)
5. **Size:** one mini quest or mini battle is a set of 3 to 5 problems.
6. **Order of work:** Claude's choice. Chosen: mini quests first, built on the Math Skills engine once Marc adds it.

Still open: whether mini quests can stand in for Numbers Quest 2 and open Patternox (§8).

---

## 1. What you said (2026-11-16, by voice, tidied)

- The Numbers universe needs the plain skills: place value, addition, double-digit addition and subtraction, multiplication and so on.
- Your first dream was an AI that gives small steps or checks. You called them mini battles or a quick quiz.
- Each student sees different problems, as a little mini quest.
- With the AI running a world that is already built, the mini quests would sit inside it.
- Each mini quest earns a battle card.
- You were not sure how this fits the MUD.

---

## 2. The short answer

**It fits. It also fills the biggest gap in the plan.**

- My analysis said the explore layer was nearly empty. Children could wander, but nothing paid off.
- Mini quests are the pay-off. A child explores, finds something, solves a quick problem and gets a card.
- They suit an iPad better than the big tasks do. Each answer is one number. Each prompt is one or two short sentences.
- The number rules already work. All 16 rules for Numbers Quests 1–4 pass 10,000 seeds (`checks/miniquest_numbers_check.py`).

---

## 3. What a mini quest is [Proposal]

- **Size:** one to three minutes.
- **Answer:** one typed number.
- **Where:** inside a place in the world. A creature, a lock or a broken machine offers it.
- **Numbers:** different for each student, made by code from a seed.
- **Skill:** one level of one strand quest.
- **Reward:** a card (see §7).

**How it could read at Reading Level 3–4** (the example uses your Gumblefish from Voltara [Source]):

> A Gumblefish pops up. It giggles.
> "I dropped my shells! I had 51. Then I found 29 more. How many now?"
>
> **Your numbers: 51 + 29**
> **Answer:** `80`
>
> The Gumblefish spins. "Yes! 80 shells!"
> **You earned a card.**

The lines in bold come from the code. The rest is the AI.

---

## 4. Who makes the problem and who marks it

This is the main choice. Your dream, as you said it, was the AI doing it.

| Option | How it works | For | Against |
|---|---|---|---|
| **(a) The AI writes and marks** | The AI invents the problem and says right or wrong. | Closest to your words. No rules to write. | The AI gets sums wrong sometimes. The review found wrong answer keys in your ChatGPT-written docs. A child marked wrong for a right answer learns the wrong thing. [Conflict] with handoff §5.1: "The AI never marks math." |
| **(b) A fixed bank** | You write the problems ahead. | Safe. | Problems repeat. Every student sees the same ones. A lot to write. |
| **(c) Code makes the numbers, the AI makes the story** | Code picks the numbers and knows the answer. The AI wraps them in a small scene that fits the place, and gives hints. Code marks. | Always right. Different for each student. The AI still does all the creative work. Fits your constraint architecture. | Each skill needs a number rule first. 16 are written and tested. |

**My view [Proposal]:** option (c). It keeps your dream: the AI makes every mini quest feel new. It only takes away the one job AIs do badly, which is being exactly right about numbers every time.

**What would prove this wrong:** run option (a) on 500 generated problems and count the wrong marks. If the count is zero, (a) is safe enough and simpler.

---

## 5. How mini quests "pop out" [Proposal]

They can mix. Each has a cost.

| Way | Example | For | Against |
|---|---|---|---|
| **Found** | A locked crate. A trader. A Gumblefish. The student chooses to touch it. | Rewards exploring. The child is in control. | A child who does not explore finds none. |
| **Travel encounter** | Flying to Voltara, rocks drift into the path. Solve to steer past. | Feels like a mini battle. Makes travel exciting. | It interrupts. A child who only wanted to reach a task is stopped. |
| **Gate** | A door opens only for the right answer. | Gives exploring a goal. | A stuck child is locked out. Needs a way round. |
| **Mission board** | A board on the station lists skills to practise today. You can pin one. | You can steer the class. Easy to find. | It is a menu, not a discovery. |

**One question for you:** when you say "pops them out", do you mean the world interrupts the child, or the child finds them?

---

## 6. "Mini battles" and the battle rule

- Handoff §2, decision 1 says: "Battles are a reward, not math practice." [Source]
- A maths mini battle against something in the world is a different thing from a card battle between two students.
- **Options:**
  - **(a)** Keep the word "battle" for card battles only. Give the maths ones another name. The name is yours to choose.
  - **(b)** Change decision 1, so that some battles are maths practice.
- Either works. They should not share one name by accident.

---

## 7. Cards: the numbers behind "a card every mini quest"

You said every mini quest gives a card. Here is what that adds up to. The figures assume 28 school weeks and 3 sittings a week. Those are my assumptions.

| Rule | Cards per student in a year |
|---|---|
| A card for every mini quest, 3 a sitting | about 252 |
| A card for every 3 mini quests | about 84 |
| A card for the first mini quest of each day | about 84 |
| A card for every 5 mini quests | about 50 |
| **For scale:** all the big tasks together | about 33 |
| **For scale:** the original card set | about 130 different cards |

**What this means**
- At a card each, a student owns the whole set within months. Then new cards stop being exciting.
- A two-minute mini quest would pay the same as a 40-minute task. Children would choose mini quests and skip the tasks.

**Options [Proposal]:**
- **(a) A card each, as you said.** Simple. Needs a much bigger card set, or duplicates that can be traded.
- **(b) A card for every few mini quests.** A small meter fills up. Cards stay special.
- **(c) A card for the first one each day.** Rewards coming back. More practice still counts towards levels.
- **(d) Mini quests give cards; big tasks give better things.** Tasks already give ship parts and upgrades (handoff §5.5). They could also give the rare cards.

**A question that changes the numbers:** is one mini quest one problem, or a set of three to five?

---

## 8. The skill ladder for Galaxy Numerix

The skills and levels are from your "tasks / strand order" doc [Source]. The rules and examples are mine [Proposal]. Every rule passed 10,000 seeds with no failures.

| Strand quest and level | Example | What the rule guarantees |
|---|---|---|
| Numbers 1 L1: order numbers to 1,000 | Which is biggest? 431, 254, 504 | Three different 3-digit numbers |
| Numbers 1 L2: partition to 1,000 | 637 = 600 + 30 + __ | One missing part |
| Numbers 1 L3: round to the nearest 10 | Round 432 to the nearest 10 | Never already a multiple of 10 |
| Numbers 1 L3: round to the nearest 100 | Round 432 to the nearest 100 | Answer is 1,000 at most |
| Numbers 2 L1: add single digits | 6 + 3 | |
| Numbers 2 L1: subtract single digits | 12 − 4 | Never below 1 |
| Numbers 2 L2: add 2-digit, no regrouping | 60 + 16 | Never regroups. Sum is 99 at most. |
| Numbers 2 L2: subtract 2-digit, no regrouping | 79 − 22 | Never regroups |
| Numbers 2 L3: add 2-digit, regrouping | 51 + 29 | Always regroups. Sum is 99 at most. |
| Numbers 2 L3: subtract 2-digit, regrouping | 70 − 17 | Always regroups |
| Numbers 3 L1: repeated addition | 4 + 4 + 4 + 4 | 2 to 5 groups |
| Numbers 3 L2: ×2, ×5, ×10 | 3 × 5 | |
| Numbers 3 L3: facts to 10 × 10 | 7 × 4 | Nothing past 10 × 10 |
| Numbers 4 L1: sharing | Share 16 between 4 | No remainders |
| Numbers 4 L2: ÷2, ÷5, ÷10 | 15 ÷ 5 | No remainders |
| Numbers 4 L3: division facts to 10 × 10 | 21 ÷ 7 | No remainders |

**Two things the test showed**
- **Some skills have few different problems.** ×2, ×5 and ×10 has only 30. Sharing has 36. These will repeat. That is fine for facts a child should know by heart, and the AI's story makes each one feel different.
- **Two students rarely get the same problem.** On facts to 10 × 10, it happened 1.3% of the time.

**Not covered yet:** fractions (Numbers 5), and the other four galaxies. Time, measuring, shapes and graphs can have mini quests too. Some of those need a picture, which a text world cannot check as easily.

**A possible use [Proposal]:** Numbers Quest 2 (addition and subtraction) was never built, and Patternox's wormhole waits for it. Passing every Numbers 2 mini-quest level could count as finishing Quest 2. That would open Patternox without a new big quest. It is your call.

---

## 9. Levels [Proposal]

- The code keeps each student's level for each skill.
- A student moves up after a run of right answers. For example, 5 in a row.
- After several misses, the code steps down a level, or flags you.
- You can see every student's level for every skill. This is the "quick check" you described, built into the game.
- **Option:** you set a student's level by hand.

---

## 10. Wrong answers [Proposal]

- The AI gives a strategy hint. It never gives the answer. (This is already in the place template.)
- The student tries again with new numbers.
- Nothing is taken away. A wrong answer costs only time.

---

## 11. What a place file would need

One new block, added to the four in the place template [Proposal]:

```
MINI QUEST
id:           numerix.voltara.overlook.m1
offered by:   [AI] the giggling Gumblefish in the river
skill:        [CODE] Numbers 2 L3: add 2-digit, regrouping
              (or "the student's current Numbers 2 level")
appears:      found | travel encounter | gate | mission board
story:        [AI] The Gumblefish has lost count of its shells.
              The AI may vary the object and the mood, never the numbers.
numbers:      [CODE] rule add_2digit_regroup, seeded per student and per try
shown:        [CODE] the code prints the numbers in a fixed line
student gives: one number, on the answer line
check:        [CODE] equals the answer
if right:     [CODE] counts towards the level and the card rule (§7)
if wrong:     [AI] one strategy hint. [CODE] new numbers.
repeat:       [CODE] how often this one can be played (once a day? always?)
```

In the template's Voltara example, the Gumblefish "knows nothing about energy (dead end)". With this block it becomes something worth finding.

---

## 12. The Math Skills engine (updated 2026-11-16)

- You sent the engine. It is in `engines/math-skills/`, and I have read it.
- It marks with code, but the AI picks the numbers. So it is a second way to do "code and AI".
- The findings, and a first set of 14 mini quests and mini battles for the station, are in `proposals/GMQ_Mini_Quests_Station_Set_v1_2026-11-16.md`.

---

## 13. Decisions for you

1. **Who marks:** option (a), (b) or (c) in §4.
2. **How they appear:** found, travel encounters, gates, a mission board, or a mix (§5).
3. **The name:** keep "battle" for card battles only, or not (§6).
4. **The card rule:** (a), (b), (c) or (d) in §7.
5. **One problem or a set** per mini quest (§7).
6. **Numbers Quest 2:** may mini quests stand in for it and open Patternox (§8)?
7. **Order of work:** build mini quests first, or redesign the big tasks first?
