# Handoff — Persistent Text World ("the MUD") — 2026-11-15

**Stage:** idea. Nothing has been designed in detail or built.
**Read this first:** §1 is what Marc said he wants. Everything from §4 on was proposed in the previous thread and is **not decided**. Don't treat a proposal as a decision.

---

## 0. Context

- **Who:** Marc teaches Grade 3 at KIS International School in Bangkok. He builds AI "engines" for classrooms on top of constraint architectures. Each engine is a constraint file that defines the AI's whole reality, plus a small PHP API and a web page.
- **Where they run:** tools.constraintlayer.ai, a rented server running nginx and PHP 8.0, at IP 129.121.98.193. The AI model is DeepSeek (`deepseek-flash`). Explorer, Word Web, Curiosity and Math Skills already run there. Marc uploads files with PowerShell and `scp`.
- **Project:** the Claude Project "Engines And constraints" holds every engine's current files. The most relevant one here is **`novus_txt v3_4 — Novus Expedition Constraint Architecture.md`**.

---

## 1. What Marc wants (his stated goals)

- A MUD, like the one his brother played over a LAN in the early 1990s. Students go into a world and can just do different things.
- A mix of choose-your-own-adventure story and an explorable world, built like the Zork games.
- **Persistent.** The world stays the way students left it.
- **Everything is typed.** Where to go, what to do: "if you want to dig a hole in the ground, you dig a hole in the ground." No arrow-key movement. A simple light display is acceptable, but movement and actions stay typed.
- Students **level up** and **get different tools**. Inspirations: Dungeons & Dragons and the *Dungeon Crawler Carl* books.
- Students mostly don't interact live. They interact with **what other students' characters have done**, and they can **see other characters coming**. Live interaction is possible "if they needed to."
- Students can **explore and change the world.**
- Everything leads to cool, magical things.
- A **constrained AI runs the world in the background.** It creates things and adds storylines based on what students are doing. Students may discover them, or may not.
- **His question:** would he have to add story or discoverable things himself, maybe daily?
- **His hosting question:** where would it run: his server, Amazon, or his home computer left running all the time?
- He thought it might be written in Python.

---

## 2. Questions asked of Marc and not yet answered

The first version's design depends on these.

1. **Purpose:** what should students get out of it? Reading and writing practice through typing, inquiry the way Novus does it, curriculum content, or mainly motivation and engagement?
2. **Players and timing:** which grades, and is it played in class, at home, or in free time?
3. **World size:** one world per class, or one shared world for everyone using his engines?
4. **Hosting:** see §7.

---

## 3. How Marc works (relevant to this project)

- **The constraint architecture is the foundation.**
  - The AI keeps its full intelligence inside a defined reality: the boundary is defined, the output is defined, and the freedom lives inside.
  - Code is for memory and hard facts. Code never takes the AI's judgment away or turns it into scripted output.
  - When something fails, find the escape point (a gap, a contradiction or a structural flaw) and close it in the constraint layer.
- **Reason from his goals.** Don't copy features from existing games because they're standard. Every borrowed feature needs a reason that applies here.
- **Answer his questions directly and first.** Don't start building until he agrees on what's being built. Don't make his design decisions for him; ask.
- **Ask about purpose and classroom need before judging a design.**
- **Deliverables** are .md files, plus a zip alongside the files.
- **SOURCE CHECK:** in this project, any file the thread receives is checked for contradictions with the project sources.
- **Dungeon Crawler Carl is inspiration only.** The world, its names and its characters must be original.

---

## 4. Starting point: Novus Expedition v3.4 (proposal)

Novus is already built like a text world:
- "YOU ARE NOT A STORYTELLER. YOU ARE A UNIVERSE."
- a "MUD-STYLE EXPLORATION PROTOCOL" section
- "Discovery Through Action, Not Menu": no menus of anomalies, and students type any action
- "DEAD-END BY DEFAULT": nothing becomes useful until a student really investigates it
- on/off switches for each discovery (whether it has been checked two ways, and whether progress is allowed)
- different prompts for each grade band

**What's missing is persistence.** A Novus game lives inside one conversation, and the AI tracks its switches only in memory. When the mission ends, the world is gone. No other student ever sees what one student changed.

**Proposal:** the step from Novus to the MUD is moving the world's memory out of the conversation into a database on the server. The world needs new constraints too: a fantasy world, levels, tools, and the effects students have on each other. The kind of AI stays the same.

---

## 5. Proposed design (not decided)

### 5.1 Three layers

1. **The world record (code and a database)** holds:
   - places and what's in them
   - each student's level, tools and location
   - every change anyone made, with who made it and when

   This has to live outside the AI, which forgets everything between calls. **Precedent:** Word Web's rooms already save shared, multi-student data on the server.
2. **The world's laws (a constraint file)** cover:
   - what exists, the tone, and how magic works
   - how levels and tools are earned
   - what a student can and can't change
   - dead-end by default, so typing "I find a sword of infinite power" doesn't work
3. **One AI turn per typed action.**
   - The code sends the AI the laws plus a slice of the world:
     - this place and nearby places
     - the student's inventory
     - what others did here recently
     - any hidden story hooks here
   - The AI decides the outcome, writes the scene, and ends with tagged changes such as `hole_dug: well, by Mika` or `found: rusted key`.
   - The code checks the tags against the rules and saves them.
   - **Precedent:** Explorer's `[ACTUAL]` tags, which the PHP already pulls out of each reply.

The AI keeps all the open-ended judgment: "dig a hole" can mean anything. The code keeps the facts. Choosing which slice of the world the AI sees is the main engineering problem, because the world grows and the prompt can't hold all of it.

### 5.2 Marc's goals mapped to mechanisms

| Goal | Proposed mechanism |
|---|---|
| See what others did | Saved changes appear in the next visitor's scene: a damp, freshly dug hole, a note, a dropped tool, an opened door |
| See others coming | Movement is logged, so the AI can say "footprints lead north — someone passed minutes ago." Two students in the same place each see the other. |
| Live interaction (optional) | The page checks every few seconds and shows "Mika arrives from the north." Free student-to-student messages mean children read other children's words. Every student-written note would need an AI check first, plus a log the teacher can read. |
| Levels and tools | Code holds XP and inventory. Tools open new actions (no lantern, no dark caves). The AI suggests rewards; the code enforces limits, so rewards can't inflate. |
| Simple display | The page draws a small map from the database, maybe with dots for other students. Movement stays typed. |
| AI-made storylines | A **nightly "world director"**: a scheduled job on the server reads the day's log and plants new hooks (rumors, hidden places, consequences) within a story-bible constraint file Marc writes once. Hooks stay hidden until found, and some never are. The director only adds to what's established, never rewrites it, so contradictions don't pile up. Marc can approve each night's additions or let it run. **Answer to his question:** he wouldn't need to write story every day. |
| Privacy | Students use a nickname and a class code, the way the math-skills login works. No real names. |

### 5.3 Python or PHP

- **Python with Evennia:** Evennia is a maintained Python MUD framework with accounts, rooms, objects and a web client built in.
  - Its AI add-on only drives what characters say.
  - Its documentation says calling an outside AI service is "currently untested," and it doesn't mention DeepSeek.
  - In this design the AI interprets every action, so Evennia's command parser would go mostly unused.
  - It's a second system to learn and deploy.
- **PHP on the current setup:** this reuses the DeepSeek connection, the shared-room storage, student logins and Marc's existing deploy process.
- **Previous thread's assessment:** PHP fits better. **Marc has not decided.**

### 5.4 Suggested first version (not decided)

One world with 10–15 places. Saved changes, traces of other students, levels and tools. Add the nightly director once the base world holds up.

---

## 6. Cost estimate (AI calls)

Based on DeepSeek prices from the project's reference sheet (2026-11-11) at peak rates. Peak hours cover the Bangkok school day. Token counts come from Explorer's own logs, plus about 3,000 tokens of world slice per turn that can't be cached because it changes every turn.

| | Without thinking | High thinking |
|---|---|---|
| One typed action | ~$0.0014 | ~$0.0035 |
| 25 students × 40 actions × 20 school days | ~$28 a month | ~$70 a month |

The nightly director costs a few calls a night, which is pennies. Check DeepSeek's pricing page before relying on these numbers.

---

## 7. Hosting options

| Option | Cost | For | Against |
|---|---|---|---|
| **The current server** (tools.constraintlayer.ai) | Nothing extra at classroom scale | Already runs the engines; same PHP setup; same upload process | Shares the machine with the live engines. A game bug or heavy load could slow Explorer and the others. |
| **Amazon Lightsail** (Amazon's simple rented servers) | One third-party guide (updated March 2026) lists $5 a month with a public IPv4 address and $3.50 IPv6-only, with 3 months free on some plans. **Confirm on AWS's pricing page.** | Keeps the game separate from the school engines | A second server to set up, secure and update |
| **Marc's home computer, left on** | Electricity | Good for building and testing | It must never sleep or lose power or internet. Many home connections don't accept incoming connections without a tunnel service. It would expose a home machine and network to outside traffic, and student data would sit on a personal computer. **Not suitable for students.** |

Not decided. The previous thread's view: build and test at home or on the current server, then run it for students on the current server, or on Lightsail if it needs to be kept separate.

---

## 8. Checks before any build

1. Run `php -m` on the server. It shows whether SQLite, a simple file database, is available to PHP.
2. Confirm student game data can follow the same privacy approach as the math logins.
3. Get Marc's answers to §2.

---

## Sources

- [Evennia — LLM contrib documentation](https://www.evennia.com/docs/5.x/Contribs/Contrib-Llm.html)
- [Evennia MUD/MU* Creation System](https://evennia.com/)
- [Kuberns — "How Much Does AWS Lightsail Cost? 2026 Pricing Breakdown"](https://kuberns.com/blogs/aws-lightsail-pricing-your-comprehensive-guide/) (third-party; confirm on AWS)
- Project sources: `novus_txt v3_4`, `DeepSeek API Reference Sheet 2026-11-11.md`, `api_php v4_3_1` (Explorer tags), `api-swi_php v2_6` (shared rooms)
