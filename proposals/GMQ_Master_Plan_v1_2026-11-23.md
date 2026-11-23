# Galaxy Math Quest: the whole plan

**Date:** 23 November 2026. **For:** Marc, and every thread.
**What this is:** one list of everything:
- what is built
- who is doing what
- what comes next, and in what order
- every decision waiting on Marc

**Keep it current.** The main thread updates it whenever something is built or decided. Other threads tell Marc, and the main thread writes it in.

Everything is **[Proposal]** unless it says [Source].

---

## 1. The goal [Source: CLAUDE.md and Marc's messages]

- **A persistent world for Marc's Grade 3 class,** played on their own iPads:
  - the KIS Station
  - then planets in five galaxies, with big quests, mini quests and secrets that lead to each other
  - cards earned by finishing tasks, and a card battle
- **The maths is the work.** Every task has a story reason first, a finished example, a picture that shows the task, and nothing that gives the answer away.
- **After the station, mistakes show themselves.** Then comes a step down to a smaller problem, then back up. [Source: Marc, 22 and 23 November]
- **Later:**
  - a class server, so children see each other's traces
  - an AI that answers and adds places inside the rules, with code holding every number
  - maybe a shared space for battles and discoveries between classes [Source: Marc, 22 November]

## 2. Who is doing what

| Thread | Owns | Where it is now |
|---|---|---|
| **Main** (a new thread replaces the old one on 23 November) | the game file, the class link, the preview, this plan, the handoff, the zip; it wires the other threads' work into the game; it reviews their work | Version 89 on the preview. The class link is on 81. |
| **Big world** (Planet Algora, Galaxy Patternox) | `docs/bigworld/*` and its notes | The first region (the Mender Meadow) is built and playable. The Reach is designed. Its second brief: `HANDOFF_Big_World_Brief2_2026-11-22.md`. |
| **Battle** | `docs/battle/*` and its notes | Marc's rules and the new card set, on its own page. See its newest notes in `proposals/GMQ_Card_Battle_*`. |
| **Fly-in** | `docs/flyin/*` and its notes | The Voltara arrival is built: first person, 13 seconds, ready to wire in (Phase 2). See `proposals/GMQ_Voltara_Flyin_v1_2026-11-22.md`, section 9. |

**Threads cannot talk to each other.** Marc carries messages between them. The repository is their shared memory: this plan, the handoffs, and `INFO_FROM_MARC.md`.

## 3. What the children have, and what is waiting for them

**The class link (version 81):**
- the station
- Voltara
- Galactic Trade
- the 20 small worlds
- space hazards
- Chronosia
- Xylophora
- Operation Stardust

**On the preview only (versions 82 to 89):**

| Version | What |
|---|---|
| 84 | The station's dark passage, until the poster switch. No secret is needed to launch. |
| 85 | Voltara's tunnel can be crossed slowly in the dark. |
| 86 | Planet Lengthar (metric measuring, fractions on a metre rod). |
| 87 | Chronosia's things lead to each other: the cave, the key and the cougar, the tortoise and the pond. |
| 88 | Music: a tune for each world, off until tapped. |
| 89 | Xylophora: the skin makes the walls (area, then perimeter). |

## 4. The order of work [Proposal]

### Stage 1: the newest game, with the fly-in, to the class (main thread)

1. **Wire the fly-in into the game,** as version 90 on the preview. The fly-in thread's section 9 says how.
   - It plays when a child lands on Voltara: the full scene the first time, two seconds after that.
   - A tap skips it.
   - It skips itself on an iPad that cannot draw it, or that asks for less motion. The game then lands as it does today.
   - A Teacher switch can turn it off.
   - The game's tests turn it off.
2. **Marc plays the preview** on an iPad: the fly-in, Lengthar, Chronosia's links, music, Xylophora's walls.
3. **The class update check:** saved class games open in the new version (`checks/class_update_test.js`).
4. **On Marc's word ("update the class link"),** the class gets everything from versions 82 to 90 at once. He is told first what the children will see new.

### Stage 2: Algora, the big world, as the pilot (big world thread)

[Source: Marc, 23 November: "Once you see how this large full planet works, then we can start fleshing things out. When we see how well all these different questions were relying on each other."]

1. The brief's night list:
   - quick fixes
   - the Reach built, with its big quest (a ship upgrade) and two mini quests
   - the Meadow's upgrade
   - region 3 designed
   - a sheet for testing with children
2. **Mistakes that show themselves,** in every big quest (`proposals/GMQ_Mistakes_and_Consequences_v1_2026-11-22.md`).
3. **A world many children change:** building land that grows, and a test with pretend classmates (brief, section 8).
4. **Marc and his children play it.** What they get lost in, bored by or stuck on decides what comes next.
5. **On Marc's word,** it goes on the website (one line of permission), then into the game (Phase 4, with the main thread).

### Stage 3: the world web across the planets (main thread)

1. **Strand A, the lantern.** This is Marc's own example of a mini quest [Source: Marc, 22 November]:
   - Voltara's Nomads can make a lantern, but need soft sand.
   - Xylophora's cactus ring has the sand: dig it up.
   - The Nomads' glassworks cut the panes; the child measures them with Lengthar's tape.
   - The lantern lights Chronosia's dark passage for every child.
2. **Every planet's big quests upgrade a ship part** [Source: Marc, 22 November]: which quest gives which part. Waits on decision 1 in section 5.
3. **Mistakes that show themselves,** in the big quests already built after the station: Voltara, Chronosia, Lengthar, Stardust. (Xylophora's walls already do it.)
4. **Strands B and C** (the hungry families; the Gumblefish's bubble), after strand A.
5. **The radio's ending 3,** the map in the beeps (decided 22 November).

### Stage 4: cards and the battle (battle thread, then the main thread)

1. Marc's rules and the new card set, played against the computer on its own page.
2. **Into the game, on Marc's word:**
   - the child's own earned cards
   - ship part upgrades from big quests count in a battle
   - fun battles and challenge battles

### Stage 5: the class server (main thread, or a server thread)

See `proposals/GMQ_Server_Layers_Analysis_v1_2026-11-22.md`.

1. **Run the server that is already built** (version 0.1, never run) on Marc's site with his class:
   - a class code, a name and a 4-digit number
   - saves on the server
   - the teacher's view
2. The AI answers a child, inside its rules file, checked first.
3. Traces inside the class: "Built by Cadet Comet7". Each child keeps their own maths.
4. Building land that grows, from Algora's test, then on Xylophora.
5. A wider layer between classes, much later, and only with the school's approval.

### Stage 6: more of the universe (later)

- **Patternox opens:** Algora is its first planet.
- **Massar** (grams and kilograms).
- **Galaxy Geometrica and Databa's other planets.**
- **Grades 4 to 6, by mastery** (`proposals/GMQ_Multi_Grade_Analysis_v1_2026-11-21.md`).
- **Other planets' fly-ins,** after Voltara's has been used in class.

## 5. Waiting on Marc: one list

Each note lays out the choices and recommends one.

| # | Decision | Note |
|---|---|---|
| 1 | **Is a ship upgrade from a big quest lasting, or a card for one battle?** [Conflict] with the battle thread's upgrade cards | `HANDOFF_Big_World_Brief2_2026-11-22.md`, section 6 |
| 2 | **Update the class link,** after Stage 1 | this plan, Stage 1 |
| 3 | The fly-in: should the child have a little control (A none, B lean, C a longer flight)? How do the children address you? | `GMQ_Voltara_Flyin_v1_2026-11-22.md`, section 8 |
| 4 | Algora: its six choices (the name, one planet from your two quests, five peoples and the Makers, their names, its size, any four stones), its decisions 7 to 15, and the Reach's seven | the big world design note, section 11; the Reach note, section 9 (on its branch until it is pushed) |
| 5 | Typing on Algora, or taps only | the big world brief, section 6 |
| 6 | Permission for the big world thread to push its files to the website | the big world report |
| 7 | Chronosia: the Clockmaker; the "One way" ticket; may the cougar's guard mend the sky after a kept secret; the workshop's reward (a turning clock is recommended) | `GMQ_Chronosia_Links_v1_2026-11-22.md`, section 5 |
| 8 | Music: off or on at first; headphones; tunes for single places; a teacher switch (needs the server) | `GMQ_Music_v1_2026-11-22.md`, section 5 |
| 9 | Mistakes: the five rules; offer the smaller problem, or go to it; which quests first | `GMQ_Mistakes_and_Consequences_v1_2026-11-22.md`, section 7 |
| 10 | The server: the split as the long-term shape; one class or a grade per world; when to try step 1; what children may do across classes | `GMQ_Server_Layers_Analysis_v1_2026-11-22.md`, section 5 |
| 11 | "Start again": should it ask "Are you sure?" first | not written up yet |
| 12 | **Older decisions from 21 November, some answered since** | `GMQ_Decisions_Waiting_2026-11-21.md`. The main thread should mark which are answered (its first job). |

## 6. How we will know it works

- **Children play it, not tests:**
  - how many get through a big quest in one or two lessons
  - where they get stuck
  - what they talk about
  - Marc's reports decide what changes.
- **Every number rule passes on thousands of seeds,** and every place is played by a test as a child would.
- **Nothing on the main road needs a secret** or another planet.
- **No child is ever stuck with no way on.**
