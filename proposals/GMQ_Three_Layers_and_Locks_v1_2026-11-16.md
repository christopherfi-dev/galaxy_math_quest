# GMQ — projects, mini quests and locks — proposal v1 — 2026-11-16

**Stage:** proposal. Nothing is built.
**Why this note:** on 2026-11-16 you said two things that change the plan.
**Tags:** [Source] = from your material or your words. [Proposal] = my suggestion. [Conflict] = it disagrees with a design doc.

---

## 1. What you said [Source: Marc, 2026-11-16, by voice, tidied]

1. GMQ was visual and physical. Most things were print-offs or things students did with their hands.
2. The major quests should be things students design in real life. They are like project-based learning. They show true understanding.
3. Some galaxies or planets should stay locked until other things are unlocked. You think most of those rules are already in your material.

---

## 2. What this changes

### 2.1 The big quests stay off the screen
- The design docs planned to move most galaxy quests "into the world" as typed checkpoints (handoff §6, group A). [Conflict]
- Your words say the opposite: the major quest is a real-life project.
- So the world does not replace the project. It **frames** it.

### 2.2 Many review problems get smaller
- Several verdicts said "too much typing": 9 numbers at once in Voltara, 48 in all, 20 food names a round.
- If the project stays on paper, those problems go away.
- These problems stay: wrong numbers, maths above Grade 3, versions that disagree, tasks that are too long, and tasks with no finish line.
- The verdict table in `SUMMARY_FOR_MARC.md` still holds. The redesigns will be lighter than I expected.

### 2.3 The world now has three clear layers [Proposal]

| Layer | What it is | Where it happens | Who checks | Reward |
|---|---|---|---|---|
| **Explore** | Places, creatures, hidden things, changes that last | Typed, on the iPad | No one. It is play. | Finding things |
| **Mini quests and mini battles** | 3 to 5 quick problems | Typed, on the iPad | Code | One card each [Source: decided] |
| **Projects** (the major quests) | Design, build, measure, draw, plan | Real life: paper, blocks, tiles, maps | You | A card, plus ship parts and upgrades |

**What the world does for a project [Proposal]:**
1. Tells the story and gives the briefing, at the student's reading level.
2. Shows your own sheets and maps on screen, so the visuals are not lost. Students still get the print-offs.
3. Gives each student or pair their numbers, where numbers can vary.
4. Checks a few key numbers along the way, where a number has one right answer.
5. Waits for you to mark the project done. Your pages already say "Share your work to get a new card." [Source]
6. Opens what comes next.

### 2.4 Mini quests take over the job IXL did
- Your task pages start with "Before you begin" and IXL links. [Source]
- That was practice before the project.
- Mini quests can do that job inside the world. A student passes the skill, and the project opens.
- This is the link between the three layers, and it is how locks can work.

---

## 3. Locks

### 3.1 What your material already says [Source]

| Rule | Where |
|---|---|
| Station bays come in order: Engine Core, Navigation, Shield, Weapons, Power | "Space Station Info" |
| Fix the ship, then explore the galaxies | Intro |
| Patternox's wormhole is broken until "Quest 2 in the Numbers Universe" is done | Site, Patternox page |
| A prerequisite for each quest, and a 30-step order | "Pre-Requisite - Order of Strands" |

So yes: most of the rules are there.

### 3.2 Three problems the review found
1. **Some locks point at quests that were never built.** Followed exactly, Xylophora, the Stardust graphs and Patternox could never open.
2. **The 2023–24 class did not follow the 30-step order.** After Voltara it did time, maps and graphs, which the plan puts at steps 21 to 25. [Source: file dates; my reading]
3. **The two strand docs disagree** on whether shapes or area comes first. [Conflict]

### 3.3 A way to keep your locks and still open everything [Proposal]

A lock can ask for one of three things:
- **a ship part** (the station),
- **a finished project** (a quest that exists),
- **a passed mini-quest skill** (in place of a quest that was never built).

| Place | Lock in your material [Source] | Can it open today? | Lock that works [Proposal] |
|---|---|---|---|
| The galaxies | Fix the ship | Yes | The ship parts. All five, or fewer: your choice. |
| Voltara | None | Yes | Open after the station |
| Voltara Task 1 project | "Before you begin": IXL practice | Yes | Pass the place-value mini quests |
| Voltara Task 2 project | "Before you begin": IXL rounding | Yes | Pass the rounding mini quests |
| Chronosia | Numbers Quest 1 | Yes | Finish Voltara |
| Zephyron | None | Yes | Open after the station |
| Xylophora | Shapes Quest 1 (never built) | **No** | Pass the multiplication mini quests. Area is rows × columns. |
| Operation Stardust graphs | Patterns Quest 1 (never built) | **No** | Pass the count-on mini quests. Patterns Quest 1 Level 1 is skip counting. [Source: strand doc] |
| Patternox | Numbers Quest 2 (never built) | **No** | Pass the addition and subtraction mini quests. That is Numbers Quest 2's content. [Source: strand doc] |

- Every rule for these mini quests is already written and tested (`checks/miniquest_numbers_check.py`).
- Patternox itself still has nothing to play. The lock can open, but the planet is empty until a quest is written.
- Mini quests for time, measuring and graphs are not written yet.

**What would prove this wrong:** if a child passes the mini quests and still cannot start the project, the lock is testing the wrong skill. The pilot will show it.

### 3.4 A teacher key [Proposal]
- You can open any lock for any student or for the whole class.
- **Why:** you taught the quests out of order in 2023–24, and you may need to again.

---

## 4. Decisions for you

1. **The three layers** (§2.3): is this the right picture?
2. **Projects:** should the world check a few key numbers along the way, or leave all checking to you?
3. **Locks:** the table in §3.3. Keep, cut or change each line.
4. **The 30-step order:** enforce it, or keep only the locks in §3.3?
5. **The teacher key:** yes or no.
6. **Pairs:** a project done in pairs gives a card to each student, or one to share?
