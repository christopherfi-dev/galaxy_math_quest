# The big world: report for the morning

**Date:** 22 November 2026, night. **For:** Marc. **From:** the big world thread.
**Two rounds of work are in this report:** the first night (the Meadow), and the second (your Brief 2: typing, the Reach, a mini quest, the next region's design).

---

## 1. The links

| What | Where |
|---|---|
| **Planet Algora, to play** | https://christopherfi-dev.github.io/galaxy_math_quest/bigworld/ |
| The size test, for the old iPad | https://christopherfi-dev.github.io/galaxy_math_quest/bigworld/size_test.html |
| The same game as a private page | https://claude.ai/artifact/LnP7eaJwzSpwb4jXuBqz7u (opens signed in as you). The older private link still shows the first night's page |
| A one-page sheet for testing with your children | `proposals/GMQ_Big_World_Testing_Sheet_2026-11-22.md` |
| The planet's design, with the map | `proposals/GMQ_Big_World_Design_v1_2026-11-22.md` |
| The Reach, as built | `proposals/GMQ_Big_World_Reach_Design_v1_2026-11-22.md` |
| The Terrace Hills: designed, failed review, not built | `proposals/GMQ_Big_World_Hills_Design_v1_2026-11-22.md` |
| The sunk raft: designed, failed review, not built | `proposals/GMQ_Big_World_SunkRaft_Design_v1_2026-11-22.md` |
| **Patterns: a bank of ideas** (you asked me to step back) | `proposals/GMQ_Big_World_Pattern_Ideas_v1_2026-11-22.md` |

A game saved before tonight still opens. To begin at the story: **Ship**, then **Start again**.

---

## 2. Read this first

**Late in the night you told me to step back:** stop inventing as I build, and first find kinds of pattern and ways to show them. I stopped building. The ideas are in `proposals/GMQ_Big_World_Pattern_Ideas_v1_2026-11-22.md`.

**Its first finding:** Algora is in Galaxy Patternox, and almost nothing built on it is a pattern. The stepping stones are. The machines are rules. The fleet and the well are times tables.

So what follows is what is built. It is checked and it plays. Whether it is the right thing to have built is your call.

---

## 2b. What is new since the first report

**You said: "it needs to allow typing and actions like the previous one. That was the point."**

- **Algora is a typed world now.** A child may type, or tap. The doing words are the game's own: look, talk, take, use, give, push, open, dig, go, and more.
  - On an iPad the box brings up small letter keys on the desk, as in the game. The picture does not jump.
  - **Every thing answers every doing word.** It does something, or it says why not. Push the signpost: it wobbles. Talk to the well: it echoes. Roll the hollow log: the coin drops out. Dig anywhere: soil and a worm, or a crab on the beach.
  - Give or use anything the cadet carries, on anyone.
  - "help", "hint", "dance", "jump" and "sing" all answer.
- **Music:** five tunes of Algora's own, written in the game's form. Off until **Ship**, then **Music**.
- **The game's two fonts.**
- **Big quests upgrade the ship** [Source: Marc]. The Menders lift the Engine Core to Level 2. The Rillfolk lift Navigation. The Ship button shows all five parts.
- **The Reach is built** (region 2): the reed gate, the harbour, three towns over plank bridges, and the fleet as its big quest.
- **A mini quest of your lantern shape:** the thing in the well. Five steps over two peoples, a real problem inside, an **epic card**. **The brief asked for two mini quests in the Reach. One is built.** The second (the sunk raft by the long pier) was designed tonight, and failed its review. It is not built.
- **A surprise on the walk:** a loose cog rolls out of the grass. Three quick rules catch it.
- **A bottle with a note** in the reeds, for Pim over the river.
- **The law of the road** is in the page's own check.
- **The Terrace Hills** (region 3) are designed twice and reviewed twice. **The design failed both reviews. It is not ready to build.** Section 6.

---

## 3. What is built, in all

- **The map:** 128 × 96 squares. Mist. Tap or type to walk.
- **The Mender Meadow:** four number machines; the pip pouch and the bridge; the stepping stones; nine people; a chain of secrets; the well.
- **The Reach:** the harbour (the keeper, the baker, the net weaver, the loading board, an old singer); Stilt Town, Reed Town and Mud Town; a child on a raft; the long pier; the lift under the hill wall (shut: the Hills are not built).
- **Five finished examples,** each about something else: buckets, seeds, a rope with tags, loaves on trays, another box.
- **Cards:** Rule Finder, Bridge Bringer, Stone Stepper, Kind Finder, Lucky Coin, Sharp Eyes, Fleet Planner, River Post, Cog Catcher, and one epic: Deep Finder.
- **Rule Stones:** two of five can be lit.

**Not built:** regions 3 to 9. Any AI. Any link to the game. The raft and the rope ladder as tools.

---

## 4. A key for you, for one cadet

Open the website link with `?seed=7` on the end, on a fresh save.

| For cadet 7 | |
|---|---|
| The four machines | Pond + 4. Wall × 5. Hill ÷ 2. Orchard − 7 |
| The pouch and the pan | 8 pips to 37. Wall 40, Orchard 33, Pond 37 |
| The rafts | 7 rafts that carry 6. 9 that carry 7. 5 that carry 9 |
| The orders | Stilt Town 42. Reed Town 56. Mud Town 45 |
| The plan that works | Stilt: 7 rafts that carry 6. Reed: 8 that carry 7. Mud: 5 that carry 9 |
| The trap | Stilt as 6 rafts that carry 7. It is right for Stilt, but then only 3 of those rafts are left, and Reed Town needs 8 |
| The well | 6 turns of 3: 18 deep. 2 bundles of 9. 20 reeds |
| The Makers' box | × 4, then + 7 |

**Things to try typing:** `look sign`, `push sign`, `dig`, `talk well`, `push log`, `give coin`, `dance`, `hint`.

---

## 5. What ran

| Check | Result |
|---|---|
| **Number rules, 20,000 children** (`bigworld_numbers_check.js`) | Passed: the machines, the pouch and the pan, the stepping stones |
| **The Reach's numbers, 20,000 children** (`bigworld_reach_numbers_check.js`) | Passed: the fleet (its own search of every line; no right plan is "the same number for every town" or "use every raft"), the well, the Makers' box, the loose cog |
| **The map and the world's tables** (`bigworld_map_check.js`) | Passed. Fifteen broken copies were fed in, the law of the road among them; all fifteen were caught |
| **The tunes** (`bigworld_music_check.js`) | Passed as data. **I cannot hear them. Only you can judge them** |
| **The play test, by taps and typing** (`bigworld_play_test.js`) | **Passed** on all three screens, and for the second child over the old stones, on the page as pushed. Four full runs tonight. They found: two stale lines in the test; a tap on the walk that can begin the well's quest early (the test now allows it); and one real fault, the ship panel's Close button pushed off a phone's screen by a long list of cards (the buttons come first now) |
| **The size test page** | Passed on this machine. Not a real iPad |

**Not run:** the game's own tests. This thread changed no file of the game's.

---

## 6. The reviews

Nine independent reviews so far. Each reviewer saw the rules and what I gave them, never my reasoning.

| | What was reviewed | What it found | What I did |
|---|---|---|---|
| 1 | The planet's design note | 1 blocker (a hard chain), 11 major | All answered. The law of the road came from it |
| 2 | The Meadow's pictures | 6 major, 10 minor | Fixed |
| 3 | The Reach, version 1 | 2 blockers: a kind plan failed; no Grade 3 maths | A new problem |
| 4 | The Reach, version 2 | 1 blocker: a town served early could make the job impossible | Nothing sails until all three lamps are green |
| 5 | The Terrace Hills, version 1 | 2 blockers: a rule that refused correct maths; not an open problem | Version 2 |
| 6 | The Terrace Hills, version 2 | **6 blockers.** Four are in the top terrace. The arithmetic is all right; the design is not | **Not fixed. Not built.** The blockers, and what a version 3 needs, are in the note's section 10 |
| 7 | The Reach's pictures, 48 of them at three sizes | No blocker. 14 major, 25 minor | All 14 major points answered; one half of one is yours (below). Of the 25 minor: 8 fixed, 3 partly, 14 left (below) |
| 8 | The sunk raft: a second mini quest for the Reach, on paper | **2 blockers, 15 major.** The plainest: it is the well quest again | **Not built.** `proposals/GMQ_Big_World_SunkRaft_Design_v1_2026-11-22.md`, section 10 |

**What the pictures' reviewer found, and I fixed:**
- "Rafts of 4" could be read as four rafts. The board now says "each carries 4", and the desk "rafts that carry 4".
- The reed cutter's bundles were already tied, and could be counted. Now only the ties wait on the grass, each with a tag: 10. The bundles appear when he has cut.
- "How deep is the well?" had no numbers on the screen. The child's own notebook is in the picture now: the tally marks, and what one turn is.
- "The water gate swings open", and no gate was drawn. Each channel has a gate leaf now. It swings up.
- The keeper's words covered the rafts as they sailed. Her words are on the desk now.
- Leftover rafts vanished when the fleet sailed. They stay.
- "The lid opens", and it was drawn shut. It opens.
- The well had no bottom, and "the rope goes slack" showed a tight rope. Both are drawn.
- Red and green lamps differed only by colour. Each lamp has a tick or a cross too, and the words name the town.
- A name on the big map sat on top of the words below it.
- **"Sky-walker" sounds like a famous film's name. It was in the page ten times.** The peoples now say "visitor from the sky" and "sky visitor".
- "Click 1 of 3" read as an order to tap. It is "Catch 1 of 3".
- "The net mender" and "the Menders" were two peoples with one word. She is **the net weaver** now.
- One child in my three had 9 rafts of each kind and every answer 9. "Use every raft" solved it. The number rule now refuses any harbour where that works, or where all three lines are the same length. 20,000 children checked.
- The reviewer asked: a child with two green lamps and one red may not see that a green line can be the fault. After the second such try, the keeper now says: "A green lamp can still be in the way." No number is given.
- Why a new rope, when the bucket reaches the bottom? The well now says: "The bucket could never lift it, and the winch's old rope is thin."

**Left for you (the reviewer's point 11):** the planet has two suns, and a "Lake of Two Suns". With "sky-walker" gone the echo is weaker. Your call.

**Minor points not fixed:** the guard's gate does not look like a gate that opened; the astronaut stands on the OUT sign when entering the harbour, and far from the well's handle; the harbour scene shows no rafts; Stilt Town's huts stand on grass; an old line of the log can stay above the board; the rope's pieces are a different size for each child; the box sits in a plain room; small grey notes on iPads; the big map's key says nothing of the Reach; an upright iPad's desk is half empty on some screens; sail numbers are small on a phone; "arm-lengths" can break over two lines; hard words (below); "the Reach" is also a place name in some fantasy books.

**Words the reviewer thinks are hard for your class:** Nudge, winch, slack, arm-lengths, wind (it back up), tally, bundle, fetch, order tag, loose cog, slot, lid, speaker. The testing sheet's row 16 is for these.

**The reviews keep finding real faults.** Three versions of the Reach's main problem each had one. Two versions of the Hills failed. That is the best reason I have for you to read the Reach's note, section 8, before your class plays it, and for the Hills not to be built yet.

---

## 7. Shortcuts and limits. Please read.

- **Nobody has played it.** Not a child, not you. Every time, and every "too hard", is a guess.
- **No real iPad has opened it.** All pictures are from this machine's browser at iPad sizes.
- **I built the Reach on my own recommendations,** as Brief 2 says. Its nine decisions are yours (the Reach's note, section 8).
- **The Reach is hard.** One right plan for nearly every child, and the 7, 8 and 9 times tables. The stepping stones mean a child can still get there; nudges are on every task.
- **The Makers' box is past Grade 3** (a rule in two steps). It is a mini quest, off the main road.
- **The tunes are unheard.**
- **The fonts come from the internet.** With no internet the page uses the iPad's own font. Nothing else is fetched, and nothing is sent.
- **The Hills are not built, and their design is not ready.** Region 3 was "build only if there is time and it can be done well". It could not.
- **One mini quest in the Reach, not two.** My design for the second failed its review.
- **Nothing gets easier for a child who struggles.** The helps are finished examples, nudges and a notebook. The four machines are not in order of difficulty.
- **The raft does nothing yet.** It is given as the Rillfolk's thanks, and waits for the north channels.
- **The save is in the browser.** An iPad can clear it if the page is not opened for some days.
- **The play test takes about 12 minutes for each screen.**

---

## 8. Every choice I made that is yours, in one list

1. The planet's name: Algora.
2. One planet from your two Patternox quest pages.
3. Five peoples, and "the Makers".
4. The peoples' names: Menders, Rillfolk, Furrows, Eights, Twinseers. The towns: Stilt, Reed, Mud. What they call the cadet: "sky visitor". The net weaver.
5. The map's size: 128 × 96.
6. ~~Any four of five stones open the Gate.~~ **Decided by Marc, 25 November: all five stones, one from each people.**
7. **Engine Core from the Menders; Navigation from the Rillfolk; Shield from the Furrows.**
8. **An upgrade is lasting.** [Conflict] The battle thread's upgrade cards last one battle. Which is it?
9. Every town in the Reach can be served: a puzzle, not a choice of who goes without.
10. The Reach's numbers are hard: no 5s, one right plan.
11. A red lamp for each town, not one lamp for the fleet.
12. The mini quest's inside problem is past Grade 3.
13. A loose cog as the surprise: at most five, never beside a person or a place.
14. The well quest's epic card is called Deep Finder.
15. Typing uses the game's doing words, with "give" added.
16. The keeper's one line of help after two stuck tries: "A green lamp can still be in the way."
17. The child's notebook is shown at the net weaver: the tally marks and "one turn: 3 arm-lengths". The other way: the child must remember, or walk back.
18. **Should a child who struggles get easier numbers, or the same numbers with more help?** Nothing is built for this.

**Still waiting on you:** why the Gate broke; the Clockmaker; how extra lands open; ship hops between villages (the planet's note, section 11).

---

## 9. What I need from you

1. **Play it,** with the testing sheet, with one of your children.
2. **Listen to the music.** Ship, then Music. Tell me which tunes to change.
3. **Open the size test on the old iPad.** Tap "Test all three". A photo of the table.
4. **Decision 8 above:** lasting upgrades, or cards?
5. **Mini quests:** is one for each region enough for a first test? And does a mini quest always give an epic card (your words of 22 November), or a random card (16 November)? [Conflict]
6. **The Hills:** two answers first. Does your class learn tables to 10 × 10, or to 12 × 12? Do you want part of that quest off the screen, on paper? (The Hills' note, section 10.)

---

## 10. For the next big world session

- **Read:** `CLAUDE.md`, both handoffs (`HANDOFF_Big_World_2026-11-22.md`, `HANDOFF_Big_World_Brief2_2026-11-22.md`), this report, then the design notes.
- **The page:** `prototypes/big_world.html`. Copy it to `docs/bigworld/index.html` after every change.
- **Inside the page,** four marked parts:
  - `MAP-BEGIN` to `MAP-END`: the map's letters. Never edit them by hand. Change `checks/bigworld_map_build.js` and run it.
  - `NUM-BEGIN` to `NUM-END`: every number rule.
  - `WORLD-BEGIN` to `WORLD-END`: regions, things, people, scenes, gates, borders, peoples and ship parts, jobs, items, and the check `bwCheck()`.
  - `MUSIC-BEGIN` to `MUSIC-END`: the tunes and their player.
- **A thing answers doing words through three tables:** `NAT` (which words mean "the usual thing"), the thing's own `on:` lines, and `flavour()` for the rest.
- **After a change:**
  1. `node checks/bigworld_map_build.js` (only if the map changed)
  2. `node checks/bigworld_numbers_check.js`, `node checks/bigworld_reach_numbers_check.js`, `node checks/bigworld_music_check.js`, `node checks/bigworld_map_check.js` (seconds each)
  3. `node checks/bigworld_play_test.js --shots <folder>` in the background. `--only sideways` plays one screen. Do not edit the page while it runs.
  4. Look at the pictures yourself. Check each word against its picture.
  5. Copy to `docs/bigworld/index.html`. Merge the main branch. Commit. Push to both branches.
- **Before a new region:** a design note, an independent review, then Marc. The Reach's main problem was wrong three times on paper.
