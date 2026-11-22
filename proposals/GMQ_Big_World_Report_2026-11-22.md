# The big world: report for the morning

**Date:** 22 November 2026, night. **For:** Marc. **From:** the big world thread.
**Two rounds of work are in this report:** the first night (the Meadow), and the second (your Brief 2: typing, the Reach, a mini quest, the next region's design).

---

## 1. The links

| What | Where |
|---|---|
| **Planet Algora, to play** | https://christopherfi-dev.github.io/galaxy_math_quest/bigworld/ |
| The size test, for the old iPad | https://christopherfi-dev.github.io/galaxy_math_quest/bigworld/size_test.html |
| The same game as a private page | https://claude.ai/artifact/XxJzhCzDk2dvTwuSjgqeav (opens signed in as you) |
| A one-page sheet for testing with your children | `proposals/GMQ_Big_World_Testing_Sheet_2026-11-22.md` |
| The planet's design, with the map | `proposals/GMQ_Big_World_Design_v1_2026-11-22.md` |
| The Reach, as built | `proposals/GMQ_Big_World_Reach_Design_v1_2026-11-22.md` |
| The Terrace Hills: designed, not built | `proposals/GMQ_Big_World_Hills_Design_v1_2026-11-22.md` |

A game saved before tonight still opens. To begin at the story: **Ship**, then **Start again**.

---

## 2. What is new since the first report

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
- **A mini quest of your lantern shape:** the thing in the well. Five steps over two peoples, a real problem inside, an **epic card**.
- **A surprise on the walk:** a loose cog rolls out of the grass. Three quick rules catch it.
- **A bottle with a note** in the reeds, for Pim over the river.
- **The law of the road** is in the page's own check.
- **The Terrace Hills** (region 3) are designed, with an independent review.

---

## 3. What is built, in all

- **The map:** 128 × 96 squares. Mist. Tap or type to walk.
- **The Mender Meadow:** four number machines; the pip pouch and the bridge; the stepping stones; nine people; a chain of secrets; the well.
- **The Reach:** the harbour (the keeper, the baker, the net mender, the loading board, an old singer); Stilt Town, Reed Town and Mud Town; a child on a raft; the long pier; the lift under the hill wall (shut: the Hills are not built).
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
| The rafts | 9 rafts of 7, 9 of 8, 9 of 9 |
| The orders | Stilt Town 63. Reed Town 81. Mud Town 72 |
| The plan that works | Stilt: 9 rafts of 7. Reed: 9 rafts of 9. Mud: 9 rafts of 8 |
| The trap | Stilt as 7 rafts of 9. It is right for Stilt, but then only 2 rafts of 9 are left, and Reed Town needs 9 |
| The well | 6 turns of 3: 18 deep. 2 bundles of 9. 20 reeds |
| The Makers' box | × 4, then + 7 |

**Things to try typing:** `look sign`, `push sign`, `dig`, `talk well`, `push log`, `give coin`, `dance`, `hint`.

---

## 5. What ran

| Check | Result |
|---|---|
| **Number rules, 20,000 children** (`bigworld_numbers_check.js`) | Passed: the machines, the pouch and the pan, the stepping stones |
| **The Reach's numbers, 20,000 children** (`bigworld_reach_numbers_check.js`) | Passed: the fleet (its own search of every line), the well, the Makers' box, the loose cog |
| **The map and the world's tables** (`bigworld_map_check.js`) | Passed. Fifteen broken copies were fed in, the law of the road among them; all fifteen were caught |
| **The tunes** (`bigworld_music_check.js`) | Passed as data. **I cannot hear them. Only you can judge them** |
| **The play test, by taps and typing** (`bigworld_play_test.js`) | PLAYTEST_RESULT |
| **The size test page** | Passed on this machine. Not a real iPad |

**Not run:** the game's own tests. This thread changed no file of the game's.

---

## 6. The reviews

Six independent reviews so far. Each reviewer saw the rules and what I gave them, never my reasoning.

| | What was reviewed | What it found | What I did |
|---|---|---|---|
| 1 | The planet's design note | 1 blocker (a hard chain), 11 major | All answered. The law of the road came from it |
| 2 | The Meadow's pictures | 6 major, 10 minor | Fixed |
| 3 | The Reach, version 1 | 2 blockers: a kind plan failed; no Grade 3 maths | A new problem |
| 4 | The Reach, version 2 | 1 blocker: a town served early could make the job impossible | Nothing sails until all three lamps are green |
| 5 | The Terrace Hills' design | HILLS_REVIEW | |
| 6 | The Reach's pictures | REACH_PICTURES | |

**The reviews keep finding real faults.** Three versions of the Reach's main problem each had one. That is the best reason I have for you to read the Reach's note, section 8, before your class plays it.

---

## 7. Shortcuts and limits. Please read.

- **Nobody has played it.** Not a child, not you. Every time, and every "too hard", is a guess.
- **No real iPad has opened it.** All pictures are from this machine's browser at iPad sizes.
- **I built the Reach on my own recommendations,** as Brief 2 says. Its nine decisions are yours (the Reach's note, section 8).
- **The Reach is hard.** One right plan for nearly every child, and the 7, 8 and 9 times tables. The stepping stones mean a child can still get there; nudges are on every task.
- **The Makers' box is past Grade 3** (a rule in two steps). It is a mini quest, off the main road.
- **The tunes are unheard.**
- **The fonts come from the internet.** With no internet the page uses the iPad's own font. Nothing else is fetched, and nothing is sent.
- **The raft does nothing yet.** It is given as the Rillfolk's thanks, and waits for the north channels.
- **The save is in the browser.** An iPad can clear it if the page is not opened for some days.
- **The play test takes about 12 minutes for each screen.**

---

## 8. Every choice I made that is yours, in one list

1. The planet's name: Algora.
2. One planet from your two Patternox quest pages.
3. Five peoples, and "the Makers".
4. The peoples' names: Menders, Rillfolk, Furrows, Eights, Twinseers. The towns: Stilt, Reed, Mud.
5. The map's size: 128 × 96.
6. Any four of five stones open the Gate.
7. **Engine Core from the Menders; Navigation from the Rillfolk; Shield from the Furrows.**
8. **An upgrade is lasting.** [Conflict] The battle thread's upgrade cards last one battle. Which is it?
9. Every town in the Reach can be served: a puzzle, not a choice of who goes without.
10. The Reach's numbers are hard: no 5s, one right plan.
11. A red lamp for each town, not one lamp for the fleet.
12. The mini quest's inside problem is past Grade 3.
13. A loose cog as the surprise: at most five, never beside a person or a place.
14. The well quest's epic card is called Deep Finder.
15. Typing uses the game's doing words, with "give" added.

**Still waiting on you:** why the Gate broke; the Clockmaker; how extra lands open; ship hops between villages (the planet's note, section 11).

---

## 9. What I need from you

1. **Play it,** with the testing sheet, with one of your children.
2. **Listen to the music.** Ship, then Music. Tell me which tunes to change.
3. **Open the size test on the old iPad.** Tap "Test all three". A photo of the table.
4. **Decision 8 above:** lasting upgrades, or cards?
5. **The Hills' note:** read it before I build region 3.

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
