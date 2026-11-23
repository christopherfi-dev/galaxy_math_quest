# The big world thread: handoff, 23 November 2026

**For:** the next session that takes over the big world (Planet Algora). **From:** the big world thread.
Short. Read this, then the files it names. Everything is on the main branch (`claude/trusting-edison-vl78nc`).

---

## 1. Where things stand

| | |
|---|---|
| **Built and live** | `prototypes/big_world.html` = `docs/bigworld/index.html` ("big world 5"): the Mender Meadow, the Reach, typing, music, the well quest. All checks and the play test pass. https://christopherfi-dev.github.io/galaxy_math_quest/bigworld/ |
| **Building has stopped** | On purpose. Five designs of mine failed review on paper. Marc said: stop inventing while building |
| **What is being worked out** | "The deciding years": a story problem with a table, a decision, and what follows. A story thread writes the story. This thread fits the maths. One reviewer reads both together |
| **Three joint reviews so far** | 1: six blockers. 2: three. **3: two, both in my picker and number box. "The town's stick, the question and the oil rule hold."** Both are fixed in `checks/bigworld_year_rule_check.js`. **The fixes are not reviewed** |

### The very next steps, in order

1. **Send the story thread the six points** in the maths note's section 9c. Marc passes messages between threads.
2. **When it answers, bring the maths note in line,** word for word, as before.
3. **A short fourth review:** only "are the two blockers of review 3 fixed, and did the fixes break anything?" Give it the check file and section 9c.
4. **If that says yes: build the first kind,** for one child on one iPad, in `prototypes/big_world.html`. The rule, the picker and the engine's path are already written as code in the check file: move them into the page's `NUM` and `WORLD` parts. Then the page's own checks, pictures at three sizes, the play test, and an independent review of the pictures.
5. **Two things of mine still open:** a reading fault fails the small row too, because it is the same sentence; and "decide without me" is not in the code.

## 2. Read these, in this order

1. `CLAUDE.md`, and the end of `INFO_FROM_MARC.md` (Marc's words of 22 and 23 November).
2. `proposals/GMQ_Algora_Story_v1_2026-11-23.md`: the story. Sections 1, 3, 5, 7 and 15.
3. `proposals/GMQ_Big_World_Maths_Fit_v1_2026-11-23.md` (version 4): the maths, the engine's path, both reviews.
4. `checks/bigworld_year_rule_check.js`: the number rule, the picker and the engine's path, as code. A draft: none of it is in the page.
5. `proposals/GMQ_Big_World_Story_Fit_v1_2026-11-23.md`, sections 8 to 10: the class world.
6. `proposals/GMQ_Big_World_Pattern_Ideas_v1_2026-11-22.md`: kinds of pattern, and Marc's rule for mistakes (section 14).
7. `proposals/GMQ_Big_World_Report_2026-11-22.md`, section 10: how the page is laid out and how a change is made.

## 3. What Marc has decided [Source: `INFO_FROM_MARC.md`]

- For now the maths is multiples: "3, 6, 9, 12". A pattern with a start (3x + 2) comes later.
- A story problem gives a table. The child decides. A wrong decision is carried out. Nobody says "wrong". The child sees what follows. Then a new problem of the same size.
- His maths skills engine (`engines/math-skills/`) decides a step down. Harder problems come unseen.
- Each child has their own year. Classmates see only what is finished, and by whom. No simulation.
- "You and the other thread are both developing the story of this planet. Work it logically. I will see how well it works out."

## 4. What the two threads decided between them. Marc may overrule any of it.

Nine gold months and three white. Two tries at the gate, not three. Two pots of oil back for an empty hook. The singer may sing a wrong line again. Count faults go to the small row; reading faults are told again. The trial has no class view.

## 5. Still Marc's

1. Is "how much" enough for a first big quest?
2. Does one right year light a town for good?
3. A child taught at every band spends 24 years: accept and time it?
4. The older lists: the report's section 8 (18 choices), the story's section 9.

## 6. How to run the third review

Give one independent reviewer, with no other context: the story (sections 1, 3, 5, 7, 15), the maths note, the check file, the engine's rules file, `CLAUDE.md`, and the first 165 and last lines of `INFO_FROM_MARC.md`. Ask for a verdict first: is this a base to **build** the first kind on, for one child on one iPad? Then blockers, with a case and numbers for each. The second review's seven changes are the list to verify (maths note, section 9b).

## 7. Things I learned the hard way

- **Start from Marc's problem or the story thread's, not my own.** Every design I invented alone failed.
- **Play the rule in code before trusting it.** Playing made-up children through the engine's path found two faults that listing cases had missed.
- **A review of pictures finds different faults from a review of a note.** Do both.
- **Shared files** (`INFO_FROM_MARC.md`, `checks/RUN_ALL.md`): other threads write to them at the same time. Add lines at the end only. On a clash, keep both sides.
- **Never touch:** the game file `prototypes/kis_station_sketch.html`, `docs/index.html`, `docs/next/`, the zip, or any other thread's notes.
- Record every message from Marc at the end of `INFO_FROM_MARC.md`. Never a child's or a family member's name.
