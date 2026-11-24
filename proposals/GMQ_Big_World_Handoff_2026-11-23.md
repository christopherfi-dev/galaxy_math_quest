# The big world thread: handoff, 23 November 2026 (updated at night)

**For:** the next session that takes over the big world (Planet Algora). **From:** the big world thread.
Short. Read this, then the files it names. Everything is on the main branch (`claude/trusting-edison-vl78nc`).

---

## 1. Where things stand

| | |
|---|---|
| **Built and live** | `prototypes/big_world.html` = `docs/bigworld/index.html` (**"big world 9"**): the Mender Meadow, the Reach, typing, music, the well quest, and since 23 November the walking changes below. https://christopherfi-dev.github.io/galaxy_math_quest/bigworld/ |
| **Walking, 23 November** | Marc played Algora and could not see far or tell where to go. Built on his word ("we can try this and see what happens"; then, at bedtime, "make it more clear for students to walk around"): no black mist on the walking screen; 16 squares across on an iPad; worn-earth paths to every person; a landmark at each (a new big old tree; the listener moved to the bridge); signposts at three forks and by the ship (each beside its fork, so every way it names can be walked; its own words work with "go"); a truthful sign by the ship; "go" follows a path; fixes from two independent picture reviews. Note: `proposals/GMQ_Big_World_Walking_v1_2026-11-23.md`. **Next: two or three children play (step 2).** Step 3, one screen at a time, only if they still get lost |
| **Reading cards, 24 November ("big world 7", then "9")** | Marc: children did not notice the words. The card blocks: everything else waits for OK, a tap elsewhere shakes it, words wait while the fleet sails, and OK sleeps while a bar fills. **Big world 9:** on the class board the card in the middle hid the scenes, so it now sits where the desk is, never over the picture (wide screen: top of the side panel; upright and phone: just below the picture), with the panel behind it dark. OK wakes after 2.5 seconds for a short card, at most 3.5 (Marc: "maybe 2.5 seconds or so"). **Watch:** do children notice a card at the side? If not, the next step is a stronger arrival (a sound, a glow), not the middle again. `checks/bigworld_reading_test.js` checks it. **The play test and the sign test load the page with `&fastread=1`** (OK wakes at once) so they do not wait on every card; no child's link has it |
| **The first lesson, 24 November ("big world 8")** | Marc: a hands-on lesson the moment the cadet lands, "not a sign in the building". A Mender and a practice machine (+ 2) at the ship: 3 makes 5, write it down, pick 1 to 9, write it down, tap +, tap 2. Nothing else can be done first. Elder Rivet no longer sends the child to his painted board. Also live: a box that holds one try empties after it; after three hand-backs a Mender names a number the machine takes |
| **Building new places has stopped** | On purpose. Five designs of mine failed review on paper. Marc said: stop inventing while building |
| **The deciding years** | A story problem with a table, a decision, and what follows. A story thread writes the story; this thread fits the maths. **Five joint reviews.** The fourth: "a base to build on: yes". The fifth, after the story's second review changed the seller's re-ask: **"Not yet", one blocker** (a child put on the planks who then miscounted went down the reading path). All its points are answered in the check file's draft 8 and the maths note's section 9e. **The answers are not reviewed** |
| **The story thread** | Answered the six points, then two reviews of its own (the story, 16b and 16h). The biggest change for the maths: the seller cannot count ahead, so he re-asks only when a promise is less than the stick shows. **The maths note is version 7 and the check file draft 8: both follow the story's 16c and 16d, row by row. The story's round 4 review has not run** |

### The very next steps, in order

1. **Marc: step 2.** Two or three children play Algora. The testing sheet has rows for walking (rows 18 to 22). Change the walking again only for what they show.
2. **When the story thread's round 4 review is written in** (its 16g), compare its words with the maths note's quotes (section 2, and "Shells" in section 3). Bring the note in line, word for word. Run `node checks/bigworld_year_rule_check.js`.
3. **A short sixth joint review** of the check file's draft 8 and the maths note's section 9e only: "are the fifth review's points answered in the code, and did the answers break anything?"
4. **If it says yes: build the first kind,** for one child on one iPad, in `prototypes/big_world.html`. The rule, the picker and the engine's path are written as code in the check file: move them into the page's `NUM` and `WORLD` parts. Then the page's own checks, `checks/bigworld_wander_check.js`, pictures at three sizes, the play test, and an independent review of the pictures. Build on the threads' picks where Marc has not decided, each marked.
5. **Later, when they are written or decided:** the Year Machine's stones at the Lake Market and Elder Rivet's line about it (the story, 16e; Marc's decision 29); something found in each of the four empty places (`proposals/GMQ_Big_World_Empty_Places_v1_2026-11-23.md`), written by the story thread.

## 2. Read these, in this order

1. `CLAUDE.md`, and the end of `INFO_FROM_MARC.md` (Marc's words of 22 and 23 November).
2. `proposals/GMQ_Big_World_Audit_2026-11-23.md`: an honest audit of this thread. One page.
3. `proposals/GMQ_Algora_Story_v1_2026-11-23.md`: the story. Sections 1 to 5, and 16.
4. `proposals/GMQ_Big_World_Maths_Fit_v1_2026-11-23.md` (version 7): the maths, the engine's path, all five reviews.
5. `checks/bigworld_year_rule_check.js` (draft 8): the number rule, the picker and the engine's path, as code. None of it is in the page.
6. `proposals/GMQ_Big_World_Walking_v1_2026-11-23.md`: what changed in walking, and what the lost-child check showed.
7. `proposals/GMQ_Big_World_Report_2026-11-22.md`, section 10: how the page is laid out and how a change is made.

## 3. What Marc has decided [Source: `INFO_FROM_MARC.md`]

- For now the maths is multiples: "3, 6, 9, 12". A pattern with a start (3x + 2) comes later.
- A story problem gives a table. The child decides. A wrong decision is carried out. Nobody says "wrong". The child sees what follows. Then a new problem of the same size.
- His maths skills engine (`engines/math-skills/`) decides a step down. Harder problems come unseen.
- Each child has their own year. Classmates see only what is finished, and by whom. No simulation.
- "You and the other thread are both developing the story of this planet. Work it logically. I will see how well it works out."
- Walking: "we can try this and see what happens" (step 1); the goal is that children "walk around and explore".

## 4. What the two threads decided between them. Marc may overrule any of it.

Nine gold months and three white. Two pots of oil back for an empty hook. The singer may sing a wrong line again. Count faults go to Shells and the song; reading faults get the jetty planks. Shells comes once only. The trial has no class view. **Two tries at the gate, not three: its first reason was wrong** (fourth review, M5); two is still the pick, now because three runs a band out for 17 children in 6,000 who answer by chance.

## 5. Still Marc's

1. **Decided (23 November):** two or three children try Algora this week, and "how much" is fine as the first big quest.
2. **Answered (24 November):** the reading card's wait is 2.5 seconds for a short card, up to 3.5, and the card sits beside or below the picture.
3. Does one right year light a town for good?
4. A child taught at every band spends 16 to 26 years: accept and time it?
5. Two gate tries or the engine's three?
6. Put right on the seller's planks: a slip (the engine's "self-corrected"), or learned as if at the first try? (maths note, section 10, decision 4)
7. Walking: the new tree, the signposts, the moved listener; phones (unchanged); "go to [name]" for people never met. The walking note, sections 5 and 6.
8. The older lists: the report's section 8 (18 choices), the story's section 9.

## 6. How to run a joint review

Give one independent reviewer, with no other context: the story's sections 1 to 5 and 16, the maths note, the check file, the engine's rules file (`engines/math-skills/current-v1.1/api/constraints/math-skills.txt`), and `CLAUDE.md`. Ask for a verdict first: is this a base to **build** the first kind on, for one child on one iPad? Then blockers, with a case and numbers for each. Ask it to check what the check file *claims* against what it *checks*.

## 7. Things I learned the hard way

- **Start from Marc's problem or the story thread's, not my own.** Every design I invented alone failed.
- **The play test cannot get lost:** it knows where everything is. `checks/bigworld_wander_check.js` plays children who know only a name. Run it after any change to the map, the camera or the signs. It found that the old sign by the ship sent children the wrong way.
- **Play the rule in code before trusting it,** and **check what your check claims.** The fourth review found five lines in my check file that claimed more than the code checked.
- **A review of pictures finds different faults from a review of a note.** Do both.
- **A sign must never stand on a way it names.** Every signpost did, until a second picture review typed "go" at each one. `checks/bigworld_signs_test.js` now does that at every sign, on three screens.
- **A play-test tap that means to walk can land on a thing and use it,** when the target is off the screen. `tapSquare` now taps beside things.
- **Shared files** (`INFO_FROM_MARC.md`, `checks/RUN_ALL.md`): other threads write to them at the same time. Add lines at the end only. On a clash, keep both sides.
- **Never touch:** the game file `prototypes/kis_station_sketch.html`, `docs/index.html`, `docs/next/`, the zip, or any other thread's notes.
- Record every message from Marc at the end of `INFO_FROM_MARC.md`. Never a child's or a family member's name.
