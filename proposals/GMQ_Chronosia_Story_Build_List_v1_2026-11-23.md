# Chronosia's story: the build list

**Date:** 23 November 2026. **For:** the main thread. **From:** the Chronosia story thread.
**What this is:** what to change in the game, in order, with the tests each change needs.
**The design is in** `proposals/GMQ_Chronosia_Story_v1_2026-11-23.md` ("the note"). Task and rule numbers below are the note's.

---

## 0. What Marc has decided

[Source: Marc, 23 November: "Your four are fine."]

| Decision | Decided |
|---|---|
| 1. The cause | Extra trips by night tear the sky. Eight missions a year it can mend. |
| 2. The Clockmaker | Keep, with the note's story: asked for a guard, was refused, left notes, went one way. |
| 14. The history | The note's three ages, years and customs, with Sara's history wall. |
| 6, first part. The glow stone | A trader at Galactic Trade sells one for gems. |

**The other twelve decisions are not decided.** This list builds on the note's picks. Each is marked **[pick]** where it matters, so it can be changed later without tearing the rest out.

**Rules for the whole build**
- Keep every saved name the game uses now. Add new ones beside them. (The note, section 8.)
- Each stage goes to the preview only. The class link changes on Marc's word.
- After each stage: `node checks/parse_check.js`, the tests named, and `checks/class_update_test.js` with saves for the rows of the note's section 8.
- Look at each new picture at iPad sideways, iPad upright and phone size. Check every word against it.

---

## Stage 1. Words only: the story is told, and the faults go

No new mechanics. Small risk. A child feels the difference at once.

1. **Landing words:** the call for help, the Engine Core, and what happened. They change once the quake is held. (Section 1; faults 8, 24.)
2. **The Keeper:** why the clocks are wrong (R11), eight valleys (R12), why the day is stuck (R13).
3. **The Watcher:** "Hold one quake... and the chain breaks", from the Clockmaker's notes (R10).
4. **Zara and the Council:** one leader for each mission; a mission flown twice is a ninth trip. (Tasks 3, 4.)
5. **The case board:** "did not sign the log... Today the quakes began." "The crack grew again." "Locked by night" in place of chains. Nights without dates. Three nights signed "Council errand". (Task 19; faults 1, 2, 4, 11.) **[pick: decisions 12, 13]**
6. **Names:** "the guard key"; "the Stabilizer's crank"; "a ring of tower keys". (Fault 16, 33.)
7. **Small lines:** the mission panel's pointer; the report home; the tower top; the workbench bell; the fruit's words. (Faults 23, 8, 32, 31, 29.)
8. **"A perfect week."** **[pick: decision 10]**

**Tests:** `chronosia_test.js`, `case_test.js`, `finds_test.js`, `chronosia_links_test.js`, with their expected words updated. The kind-words and sentence-length checks on every new line.

## Stage 2. The stuck afternoon

The main road gets its order and its reason. **[pick: decision 3]**

1. **The four states of R14:** nothing runs; the eight clocks tick and the Keeper holds the great clock; the switch is thrown; the day turns.
2. **The clocks' win words** change: "The great clock is ready." Not "ticks again".
3. **The Watcher,** while the clocks are wrong: "The seventh quake cannot come. So it cannot be held."
4. **What shows the day turning:** the sundial's shadow, the burrow's digger, the landing words. (Tasks 16, 22.)
5. **The crack fades** only when the quake is held **and** the night trips are stopped.

**Tests:** `chronosia_test.js` played in both orders: clocks first; and an old save with the quake held first. A save test for each row of section 8 that touches quests 1 and 2.

## Stage 3. The black cave, on Chronosia

Marc's example. The cave ends where it should, before the other planets are wired.

1. **Undo version 90's daylight on the wall.** The cave is black (R18). **[pick: decision 5]**
2. **The broken lantern** by the way in, with its maker's mark. The Keeper's line.
3. **The glow stone alone** lights only your hand. (Fault 17.)
4. **The tide table** (task 9), seen only with the lantern. "Once is enough."
5. **The gear door** as a mechanism (task 10). The epic card inside.
6. **The workshop** (task 11): the plans, the makers' marks, the last page, the Long Spring, the coat. **[pick: decision 7]**
7. **The stone door** as one build: lamp room, stair, inner door bolted on the workshop side (task 12).

**Until Stage 4 is built,** the lantern does not exist. Give the test a lantern by hand. Children on the preview see the black cave and the broken lantern, and cannot go further. Say so to Marc before this goes to the class.

**Tests:**
- Port the tide and gear rules from `proposals/GMQ_Chronosia_Story_check_v1_2026-11-23.py` into the game, and check them on 20,000 seeds with the game's own numbers.
- Rewrite `chronosia_links_test.js`: wrong answers both ways (too early, too late; too few turns, too many); leaving and coming back; closing the game in the passage and in the workshop.
- Old saves: the cave's question answered; the stone door opened. Neither may reach the workshop without the lantern.
- Pictures: the wall table, the two wheels with their teeth, the workshop. Nothing may give the answer away.

## Stage 4. The lantern, across the planets

This is the plan's Stage 3, strand A. The note's section 5a and 5b say what each planet must tell.

1. **Voltara:** the glow stone's words ("as far as your hand"). A Nomad glassmaker in Nomad Hollow. The furnace and the scale: how much sand (the note, section 5a).
2. **Xylophora:** the leaf print first, then soft sand.
3. **Galactic Trade:** a trader sells a glow stone for gems. **[decided]** A child who already has Voltara's stone may use it.
4. **The tape is left out.** **[pick: decision 6]** Lengthar's tape stays a prize with no use. That is a loose thread on Lengthar.

**Tests:** the sand rule on 20,000 seeds. A play test that walks the whole chain, with a child who visited the planets in each order. `world_web_check.py` with the new rows. `no_secret_needed_test.js`: nothing on any main road needs the lantern.

## Stage 5. The guard's trail

1. **The tortoise's eggs** (task 5): the need, the nest's two parts, the two mistake lines.
2. **The dock** (task 16): the drum, the hook, one task in place of the north-west sundial, the boat and the tin box.
3. **The cougar's clock** (task 6): wind, then three wheels from three faces. It guards by night.
4. **The Clockmaker's note** reworded. The Council's line when the guard takes its post.

**Tests:** the dock and cougar rules on 20,000 seeds. `chronosia_test.js` and `chronosia_links_test.js`. Old saves: tortoise done; cougar wound; sundial, boat and tin box finished (the key is kept).

## Stage 6. The people and their history

1. **The evidence:** the year wheel, the valley plates and numbered chairs, the notches and the sun mark, the birth clocks with the row deep inside, the makers' tallies. (Task 31.)
2. **Sara's wall** and her old map. Six tiles earn the card. The seventh is in the workshop.
3. **The year stone** as Zara's forecast (task 20). The members' words change after it.
4. **The people:** eight runners at the tower; the family at the hollow tree; the children on the landing field once the quake is held.
5. **The hollow tree and the arch** lose their sums. **[pick: decision 9]**

**Still to come from Marc:** names for the eight valleys, and the name the Council gives to a friend of its history.

**Tests:** a new play test for the wall: each claim right, each claim wrong, in any order of finding. The fixed numbers against the check script. Old saves: the carved stone, the tree and the arch already done.

## Stage 7. The reward

1. **The Engine Core** from the Council after Marc's four tasks. **[pick: decision 4]**
2. **The Long Spring** fitted to it.
3. **This waits on the plan's decision 1:** is an upgrade lasting, or a card for one battle?

---

## What could go wrong with this order

- **Stage 3 before Stage 4 leaves a locked cave on the preview.** It is honest (the cave is black), but a child cannot finish it yet. If that is worse than waiting, build 3 and 4 together.
- **Stage 1 changes many words at once.** A line in one place can contradict a line not yet changed in another. Read the whole of Chronosia aloud once after Stage 1.
- **The full run of all play tests is paused.** Stages 2 and 4 reach into shared code (saving, the bag, other planets). Ask Marc for one full run after each.
