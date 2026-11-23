# Handoff: Chronosia's story, for a new thread

**Date:** 23 November 2026. **From:** the main GMQ thread. **For:** a new Claude Code thread whose only job is to make **Planet Chronosia one cohesive story.**

**You write. You do not build.** You deliver a design note; once Marc approves it, the main thread builds from it.

Everything here is **[Proposal]** unless it says [Source].

---

## 0. Read this first

1. **`CLAUDE.md`** loads by itself. Every rule applies. Most of all:
   - "What is the story reason for this task, and is the child told it before the maths starts?"
   - "Don't make his decisions."
2. **This file.**
3. **`HANDOFF_2026-11-20.md`, section 3:** Marc's rules, learned the hard way.
4. **`proposals/GMQ_Master_Plan_v1_2026-11-23.md`:** where Chronosia sits in the whole plan.
5. The rest of section 3 below, as you need it.

## 1. Why this thread exists [Source: Marc, 23 November]

Marc was showing Chronosia to his class. Inside the cave, a time question ("A great flood started at 1:20. It stopped at 1:55. How many minutes did it last?") slides a wall open.

> "But what is the point of that question. Why would that open a wall in the cave? That's what I mean. You're not doing a cohesive story."

**He is right.** That question is **maths as a password.** Many of Chronosia's finds were built that way (version 55, "the finds kit"):
- a stone door asks you to round 903
- a hollow tree asks you to count clocks
- a tin box lock asks for the next number

The maths opens something, but it does nothing the story needs.

## 2. Your job

**Make Chronosia one story in which every place, person and task has a reason, and every maths task is what someone in the story really needs worked out.**

**The test for every task.** Each must pass all four:
1. **Need:** someone in the story needs this worked out, for a reason the child is told first.
2. **Meaning:** the answer changes the world because of what it means, not because it is a code.
3. **Consequence:** a wrong answer plays out and shows why. [Source: Marc, 22 and 23 November: after the station, "it's OK for the students to fail... and see something happen".] See `proposals/GMQ_Mistakes_and_Consequences_v1_2026-11-22.md`.
4. **Picture:** the child looks at the thing being worked on, and it fills the picture.

**An example of the change wanted** (the main thread's proposal for the cave; improve it or replace it):
- **The cave is pitch dark.** You need a lantern, from another planet.
- **By lantern light, you see why nobody goes deeper:** the slow river floods the passage every day. The Clockmaker scratched the times on the wall. The child works out when it is safe to walk through and back. Wrong: the water rises to your knees, and you turn back.
- **The Clockmaker's door is a real mechanism.** The big wheel has 24 teeth and must turn exactly once; the handle's wheel has 6. How many turns of the handle? Wrong: the bolt stops short, or overshoots.

## 3. What to read about Chronosia

**Marc's own material** [Source]:
- His 2023 Chronosia pages: `reference/gmq-site-2023/pages/the-universe__galaxy-metrica__quest-1-time-riddles-galactic-engineering-on-chronosia*.txt` (the quest and its four tasks).
- The Council's booklet, "Council of Timekeepers: Annual Timetable": in the game as `CBOOK`, `CTT` and `CWHO`; his words, page for page.
- Search `INFO_FROM_MARC.md` for "Chronosia" and "chromeria" (his voice typing).

**What is built.** All of it is in `prototypes/kis_station_sketch.html`. Read it; never edit it. Search by name:

| What | Where |
|---|---|
| The map, the places, the six quests (clocks, the seventh quake, who goes where, the Council's day, the tortoise, the cougar) | `CMAP`, `CPL`, `CSC`, `CQ`, `startClocks`, `startStab`, `startMatch`, `startDay` |
| The 19 finds, their locks, the Backward Mountain (a deep find), the time portal case | `FINDS.chrono`, `FLOCK`, `FPROB`, `FCASE` |
| The trails of version 87: the cave, the workshop, the key and the cougar, the cold tortoise and the pond | the section "CHRONOSIA'S THINGS LEAD TO EACH OTHER" |
| Time wisps, the TimeTweak fruit, the buried sundial | `CWISP`, `cFruit`, `cDig` |

**The notes:**
- `proposals/GMQ_Chronosia_Guide_v1_2026-11-18.md` (the guide)
- `proposals/GMQ_Chronosia_Quest_Design_v1_2026-11-17.md`
- `proposals/GMQ_Finds_Kit_v1_2026-11-20.md`
- `proposals/GMQ_Case_Kit_v1_2026-11-20.md`
- `proposals/GMQ_Chronosia_Links_v1_2026-11-22.md`
- `proposals/GMQ_Invitations_v1_2026-11-21.md`
- the world web: `proposals/GMQ_World_Web_v1_2026-11-21.md` and its `.csv`

**Marc's newer rules that touch Chronosia:**
- Big quests upgrade a ship part [Source: Marc, 22 November].
- Mini quests have 3 or 4 steps and end in an epic card.
- **The lantern recipe** [Source: Marc, 23 November]: soft sand from Xylophora, the Nomads on Voltara, glass panes measured with Lengthar's tape, and maybe the glow stone as its light. The plan's Stage 3, and decision 13.
- "You can't explore the cave on Chronosia until you get a special torch... as a quest prize on another planet" [Source: Marc, 21 November].

**Play it yourself:** the preview link, https://christopherfi-dev.github.io/galaxy_math_quest/next/ . Type `teacher chronosia` to land there.

## 4. What to deliver

**One note:** `proposals/GMQ_Chronosia_Story_v1_<date>.md`, in plain English with short sentences.

1. **The story on one page:**
   - what happened on Chronosia (the time quakes, the crack in the sky, the Clockmaker, the portal)
   - why the cadet comes
   - what the cadet does
   - how it ends, and what is different afterwards
2. **Each place:** why it is there, who is there, and what they need.
3. **A table of every task** (the 6 quests, the 19 finds, the case, the mountain, the version 87 trails). For each one:
   - its story reason
   - who needs the maths, and why
   - what the answer changes
   - what a mistake shows
   - which standard it serves
   - **a verdict:** keep, rework, merge or drop, with the reworked version written out
4. **How things lead to each other:** the chains, including the lantern from other planets.
5. **The big quest that upgrades a ship part,** and which part.
6. **What is Marc's and what is yours,** marked [Source] and [Proposal].
7. **What could prove it wrong.**
8. **Marc's decisions,** as options with costs.

**Then:**
- An **independent reviewer** reads the note, seeing only CLAUDE.md, this handoff and your note. Fix what it finds.
- **Stop and report to Marc.** Once he approves, write a short build list for the main thread: what to change in the game, in order, with the tests each change needs.

## 5. Limits

- **Write only.** Never edit the game file, the class link, the preview, `HANDOFF_2026-11-20.md`, the plan or the zip. The main thread owns them.
- **Your files:**
  - `proposals/GMQ_Chronosia_Story_*`
  - your lines at the end of `INFO_FROM_MARC.md`
- **Keep what children have played in mind.** Marc's class has Chronosia on version 81.
  - A change to a quest they finished must not break their saves.
  - Say what changes for a child who has already played it.
- **Every name and character is Marc's or new.**
  - Marc's: the Council of Timekeepers (Sara, Tim, Alex and Zara, from his booklet) and the Temporal Tortoise.
  - The Clockmaker is the main thread's proposal.
  - Check the others in the guide before you call them his.
- **Before each push:** `git fetch origin claude/trusting-edison-vl78nc && git merge --no-edit FETCH_HEAD`. You need one line from Marc to push to that branch. Never force-push.
- **Marc's way of working:** short replies, plain English, lists; push back; say what could prove you wrong; record every message of his at the end of `INFO_FROM_MARC.md`, with no children's or family names.
