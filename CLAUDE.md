# CLAUDE.md — Galaxy Math Quest world (standing rules)

These rules apply to every Claude Code session in this folder. **Start with `HANDOFF_2026-11-20.md`.** It is short. It says what is built, how a change is made, and what is waiting on Marc. Open other files only when the task needs them. (`TASK_Quest_Review.md` was the first job, the review of the old tasks. It is done.)

## Who and what

- **Marc** teaches Grade 3 at KIS International School in Bangkok. His students use their own iPads.
- **Galaxy Math Quest (GMQ)** is the space math adventure he built and ran in 2023–24.
  - Students repair their ship on the KIS Station (15 tasks, three for each of five ship parts).
  - Then they take quests on planets in five galaxies.
  - Finished tasks earn collectible cards.
- **The project:** rebuild GMQ as a persistent, typed text world (a MUD). An AI runs the world inside a constraint file, and a small PHP server keeps the facts. The first design is in `design/`. **The game is built as one file** (`prototypes/kis_station_sketch.html`), and Marc's class of 14 plays it on GitHub Pages: the station, Planet Voltara, Galactic Trade, 20 small worlds, Planet Chronosia, Planet Xylophora and Operation Stardust. A first server exists in `engines/gmq-world/server/`. It has never run on Marc's site, and the AI has never answered a child.

## How Marc works

- **The constraint architecture is the foundation.**
  - The AI keeps its full intelligence inside a defined reality.
  - Code holds memory and hard facts: numbers, answer checks and rewards.
  - Never redesign code-first, and never shrink the AI's role to scripted output.
- **The picture shows the task.** While a child works on something (a map, a mat, a wall, a number line, a clock, a chart), it fills the picture area. The side panel holds only words, boxes and buttons. [Marc, 2026-11-21: "Every mini-game quest must be that way. Whatever you're doing takes up the full screen."]
- **Learning and the child's experience come before speed of building.** Marc: "If you're trying to do things that are the fastest... you're not even concerned about the pedagogy or the user experience?" When a quicker build and a better one differ, build the better one, or say plainly which you chose and why.
- **Don't make his decisions.** Lay out options with what each one costs, and mark them **Proposal**. The open decisions are listed in `design/GMQ_World_Handoff_2026-11-16_v8.md` §3, `design/GMQ_World_Map_v1_2026-11-16.md` §7 and `design/GMQ_Place_Template_v1_2026-11-16.md` §7.
- **Reason from his goals.** Don't copy features from other games or apps because they're common. Every borrowed feature needs a reason that applies to Grade 3 students on iPads.
- **The battle rules are his,** and they are out of scope here. Don't redesign them.
- **Bring independent insight.** Say what to check that could prove a claim wrong, not only what supports it.
- **Deliverables:** .md files in plain English, with short sentences, plus a zip of what you deliver. When a list helps, use one.

## Facts and checking

- **Recompute every number.** Many GMQ docs were drafted with AI (mostly ChatGPT), and their answer keys contain errors. Known errors are in handoff §8 and world map §6.
- **Test every per-student number rule** in code on thousands of random seeds before calling it solvable. `reference/voltara_number_rule_check.py` is an example.
- **Mark where each claim comes from:**
  - **[Source]:** found in Marc's material
  - **[Proposal]:** your suggestion
  - **[Conflict]:** his sources disagree
- **Different versions of the same task:** list them all. Don't pick one silently.
- **Say what you couldn't read:** images you couldn't interpret, broken files, pages you couldn't reach.

## Privacy and safety (absolute)

- **Never open, copy or quote student data.** If `drive/` contains any of these, don't open them; list them in your report so Marc can remove them:
  - "Users Info"
  - "Galaxy Math Quest - Users"
  - anything in "Math Assessment Test"
  - any file with student names, passwords or results
- **Never copy API keys or passwords** into any output. "API information" may contain keys. Don't open it.
- **Never edit Marc's Google Drive or his live server.** Work only in this folder.
- **Every place, name and character must be original or Marc's own.** GMQ is his work.

## Key files

| File | What it is |
|---|---|
| `HANDOFF_2026-11-20.md` | **Read first.** Short. What is built, how a change is made, Marc's rules, what is waiting on him |
| `HANDOFF_2026-11-17.md` | The long record of every version, with function names. Search it; do not read it all. |
| `proposals/GMQ_Roadmap_v1_2026-11-17.md` | The whole game outlined: twelve parts, what is built, what is next |
| `prototypes/kis_station_sketch.html` | The game itself, one file |
| `checks/RUN_ALL.md` | Every test and number check, and how to run them |
| `design/GMQ_World_Handoff_2026-11-16_v8.md` | Master design record: decisions, open questions, known errors |
| `design/GMQ_World_Map_v1_2026-11-16.md` | Every place, how places connect, what unlocks what |
| `design/GMQ_Place_Template_v1_2026-11-16.md` | The fixed format every place is written in, with a worked Voltara example |
| `design/MUD_World_Handoff_2026-11-15.md` | The general persistent-world design GMQ builds on |
| `reference/novus_txt v3_4 …md` | Marc's Novus engine: the starting point for the world's laws (reading levels, MUD exploration, dead ends) |
| `SOURCES_Index.md` | Where every GMQ source file is, and what is missing |
| `INFO_FROM_MARC.md` | Marc's answers about time, difficulty and his class. Read it before judging any task. |
| `drive/` | Marc's Google Drive download of the GMQ folder |
