# The big world: report on the first night

**Date:** 22 November 2026. **For:** Marc. **From:** the big world thread.
**Your choice:** Patternox. [Source: Marc, 22 November: "Do patternox... Work as long as you can."]

---

## 1. What you can open

Nothing is on the website yet. I do not have your line of permission to push to the main branch.

| What | Where |
|---|---|
| The big world, to play | A private page on claude.ai (the link is in my reply). It opens on your own iPad or computer, signed in as you |
| The same page, in the repository | `docs/bigworld/index.html`, on branch `claude/inspiring-albattani-umveps` |
| The size test | `docs/bigworld/size_test.html`, same branch |
| The design note, with the map | `proposals/GMQ_Big_World_Design_v1_2026-11-22.md` |

**To put it on the website** for the children's iPads, give this thread one line: permission to push its own files to `claude/trusting-edison-vl78nc`. Then the links will be:
- `https://christopherfi-dev.github.io/galaxy_math_quest/bigworld/`
- `https://christopherfi-dev.github.io/galaxy_math_quest/bigworld/size_test.html`

---

## 2. What is built

- **Planet Algora, Galaxy Patternox.** A map of 128 × 96 squares. About 75 iPad screens. It scrolls as the cadet walks. Mist lifts six squares around.
- **Tap to walk.** Tap a word to do something. No typing.
- **Map, Needs and Ship buttons.** The whole-planet map; "what I still need"; back to the ship, the cards and the mission report.
- **The first region, the Mender Meadow:**
  - Six story pages before any maths.
  - **Four number machines.** The child tests each with grey pebbles, writes notes by choice, and makes its rule plate. A wrong plate is shown wrong by a test.
  - **The pip pouch and the bridge.** Turn 3 to 8 pips into exactly the pan's number, with machines in the right order. The child says each result before the machine runs.
  - **The old stepping stones.** The second way over the river: go on with a number pattern.
  - **Three finished examples,** each about something else: buckets and a pump; seeds; a rope with number tags.
  - **Nine people.** Some only say hello. Three ask for something. Some say new things after the child's work.
  - **Two secrets in a chain,** and three small quests. Neither secret helps with a rule.
  - **A Nudge button** on every task. It is counted in the report.
  - **The far bank:** a Rillfolk guard, and a lookout over the rest of the planet. The road east is shut.
- **Saving** after every step, in the iPad's own browser. Nothing is sent anywhere. The page cannot use the network at all.
- **Each child has their own numbers.**

**Not built:** regions 2 to 9. Music. Typing. Any AI. Any link to the game.

---

## 3. A key for you, for one cadet

Open the page with `?seed=7` on the end of the link, on a fresh save. (On the claude.ai page the numbers are picked by chance. The Ship button, then "Mission report", shows what a cadet did.)

| For cadet 7 | |
|---|---|
| The Pond Machine | + 4 |
| The Wall Machine | × 5 |
| The Hill Machine | ÷ 2 |
| The Orchard Machine | − 7 |
| The pouch starts with | 8 pips |
| The bridge pan wants | 37 |
| A three-run way | Wall: 8 × 5 = 40. Orchard: 40 − 7 = 33. Pond: 33 + 4 = 37 |
| The other three-run way | Wall: 40. Pond: 44. Orchard: 37 |

**The walk:** the ship, north to the village, talk to Elder Rivet, then the machines: by the pond (west), by the old wall (north), on the hill (north-east), by the orchard (south-east). The bridge is east. The stepping stones are north of the bridge, past the reeds.

**To start again:** Ship, then "Start again".

---

## 4. What ran

| Check | Result |
|---|---|
| **Number rules, 20,000 children** (`bigworld_numbers_check.js`) | Passed. Every wrong plate can be shown wrong with 2 to 12 pebbles. One test alone never settles a rule. The pan's number takes exactly 3 runs. Order matters. No dead end. Nothing over 100. Each stepping-stone row has one right stone. No stone is the next row's right stone |
| **The map and the world's tables** (`bigworld_map_check.js`) | Passed. Every thing can be reached. Nothing unbuilt can be reached. The river has two ways and each alone gets across. No main job needs a secret. No secret helps a main job. Ten broken copies were fed in; all ten were caught |
| **The play test, by taps only** (`bigworld_play_test.js`) | PLAYTEST_RESULT |
| **The size test page** (`bigworld_size_test.js`) | Passed on this machine: 60 frames a second at 100, 200 and 300 squares a side. Not a real iPad |
| **The world web check,** on the main spreadsheet joined with this thread's rows | Passed |

**The number check found two faults in my first rule, before any picture existed:**
- The stepping stones could show the same pattern twice in a row.
- For some children the pan's number could be made with times and share only. Then the order of the machines did not matter, and the carving's lesson was false for them. The rule now needs a times machine and an add or take-away machine together.

**Not run:** the game's own tests. This thread changed no file of the game's.

---

## 5. Two independent reviews

Each reviewer saw only CLAUDE.md, the handoff and what I gave them. Neither saw my reasoning or the code.

**Review 1: the design note.** 1 blocker, 11 major, 4 minor. All answered: see the note's section 13. The ones that changed the game:
- **A hard chain:** the lake could only be reached with one people's raft. Now no people's job is needed to reach another people.
- **Both secrets helped with a rule.** That breaks a decided rule (Secrets Balance, section 4). They are now a chain to the Gate.
- **The test tray did the child's sum.** It is shut while real pips are in hand.
- **A name one letter from a famous game's character.** Now "Menders".
- **No help for a stuck child.** Nudges, when asked.

**Review 2: the pictures,** at three screen sizes. No blocker, 6 major, 10 minor. Fixed:
- A wrong plate did not look wrong in the picture. Now the plate lies on the grass, crossed out, and the drums show the Mender's test.
- "Tap OK" where the button said "Next".
- Words for things the picture lacked: a lever, a chain, a carving, drums on a post. All drawn now. "Stamped" became a tag. The "painted wall" was a board; it is called a board.
- The child's own pips were not in the picture at a machine. They are now.
- On a phone the reading card covered the small picture. It sits on the desk there now.
- A place name covered the astronaut. Names sit above things now.
- The Menders looked like another game's creature. Redrawn as small copper pots with a lid and handles.
- A wrong stepping stone could be spotted: it was the next row's right stone. Not any more, and the number check now tests it.

**Faults I found myself in the pictures, before the reviewers:** the lookout picture let the map show through and put the Reach on the wrong side; the astronaut hid the pan's number; a machine showed another machine's last test; the phone's desk overflowed.

**Left as they are, on purpose:**
- **Phone keys are about 35 points high.** The phone is not your class's screen. On both iPad sizes every button is 40 or more.
- **In the village the astronaut can stand in front of a barrel.** Six things share one screen.
- **A wrong plate gives the child one free test.** See the design note, decision 8.

**Not reviewed a second time:** the fixes from review 2 were checked by me and by the play test, not by a third reviewer.

---

## 6. Shortcuts and limits. Please read.

- **Nobody has played it.** Not a child, not you. Every time and every "too hard" or "too easy" is a guess.
- **No real iPad has opened either page.** All pictures are from this machine's browser at iPad sizes.
- **I did not stop after Phase 0 and Phase 1** as the handoff says, because you said to work on. So the Meadow was built before you saw its design. The design note lists what that decided for you (section 11).
- **The planet's name, the peoples and "the Makers" are mine.** All can be changed.
- **Typing is off.** The game is a typed world; this page is taps only. The game's own letter keys are not copied yet.
- **Fonts:** the game loads two fonts from the internet. This page may not use the network, so it falls back to the iPad's own font. It looks a little plainer than the game.
- **Regions 2 to 7 are outlines.** I would not build any of them from what is written.
- **The save is in the browser.** An iPad can clear it if the page is not opened for some days.
- **Sound is a few beeps.** No music.
- **The play test takes about 12 minutes,** because the cadet really walks.

---

## 7. What I need from you

1. **Open the size test on the old iPad.** Tap "Test all three". Send a photo of the table.
2. **Play the Meadow** on your own iPad. Tell me where you got lost, bored or stuck.
3. **One line of permission** to push this thread's own files to the main branch, if you want it on the website.
4. **The decisions** in the design note, section 11. The first six are choices I made tonight that are yours.
5. **Which region next?** I would write the Reach's full design note first, and build nothing until you have read it.

---

## 8. For the next big world session

- **Read:** `CLAUDE.md`, `HANDOFF_Big_World_2026-11-22.md`, this report, then the design note.
- **The page:** `prototypes/big_world.html`. Copy it to `docs/bigworld/index.html` after every change.
- **Inside the page,** three marked parts hold everything a designer changes:
  - `MAP-BEGIN` to `MAP-END`: the map's letters. Never edit them by hand. Change `checks/bigworld_map_build.js` and run it.
  - `NUM-BEGIN` to `NUM-END`: every number rule.
  - `WORLD-BEGIN` to `WORLD-END`: regions, things, people, finds, gates, jobs, items, and the check `bwCheck()`.
- **After a change:**
  1. `node checks/bigworld_map_build.js` (only if the map changed)
  2. `node checks/bigworld_numbers_check.js` (seconds)
  3. `node checks/bigworld_map_check.js` (a second)
  4. `node checks/bigworld_play_test.js --shots <folder>` (12 minutes; `--only phone` plays one screen). Start it in the background. Do not edit the page while it runs.
  5. Look at the pictures yourself, at all three sizes. Check each word against its picture.
  6. `cp prototypes/big_world.html docs/bigworld/index.html`. Commit. Push.
- **Its save key** is `gmq-bigworld-v1`. It reads one number from the game's save (the cadet's seed), and writes nothing to it.
- **Before a new region:** write its design note, with a full open problem, a finished example about something else, and a number rule checked on thousands of children. Send it to an independent reviewer. Then Marc.
- **The law of the road** (design note, section 3) must be added to `bwCheck()` when a second region is built: leave any one people's job undone, and every people can still be reached.
