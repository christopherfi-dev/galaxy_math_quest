# TASK — Review every GMQ quest, and redesign the ones that don't fit

**For:** Claude Code, working in this folder. Read `CLAUDE.md` and `INFO_FROM_MARC.md` first.
**Why:** Marc thinks some quests are too long or too hard for Grade 3. One example is the ship supplies task (see `INFO_FROM_MARC.md`, item 3). Before the world is built, every task needs a verdict, and the ones that don't fit need a new version written in the place template.

---

## GOAL

For every task in the built quests (world map §1):
1. Judge it against the checklist below.
2. Give it a verdict: **keep**, **fix**, **shorten**, **split** or **redo**.
3. For every task not marked keep, write a new version in the place template (`design/GMQ_Place_Template_v1_2026-11-16.md`).

**In scope:**
- the 15 KIS Station tasks (1-1 to 5-3)
- Voltara (Numerix): Task 1, Task 2 and Final Boss
- Chronosia (Metrica): 4 tasks
- Xylophora (Metrica): 4 tasks
- Zephyron (Geometrica): 3 tasks
- Operation Stardust (Databa): 2 tasks with levels
- Patternox and Cosmic Coding Comets: report what exists; don't invent quests for them

---

## PRIORITIES (in this order when they conflict)

1. **Correct maths.** Every answer and every number rule is verified by running code.
2. **Right for Grade 3:**
   - the maths level, using the curriculum Marc gives in `INFO_FROM_MARC.md`, or the strand docs if he gives none
   - the time it takes
   - the reading load
3. **Works in the typed world on an iPad:**
   - every checkpoint can be checked by code, or is clearly teacher-confirmed
   - typing stays within Marc's limit
   - each student gets their own numbers
4. **Keeps Marc's story, characters and fun.** Redesigns keep the planet, the story and the skill. They change the task, not the world.
5. **Stays close to Marc's original** wherever the original works.

---

## CONSTRAINTS

- **Follow everything in `CLAUDE.md`,** especially the privacy rules and "don't make Marc's decisions".
- **Don't decide what Marc must decide.** Where a redesign depends on an open decision (for example, Voltara's supply version), write it for the option you judge best, mark it **Proposal**, and say what changes under the other options.
- **Don't invent curriculum.** Map each task to a strand quest in "tasks / strand order", and to Marc's scope and sequence if he provides it.
- **Use only maths at or below Grade 3,** unless Marc's curriculum says otherwise. Known breaches include triangle areas that need ½ × base × height, decimal areas, and weighted percentages (handoff §8).
- **Use only names that already exist in Marc's material,** or new ones marked **Proposal**.
- **Every redesigned task keeps "one card per finished task".** This is decided.

---

## CHECKLIST (for every task)

| # | Check | What to record |
|---|---|---|
| 1 | Sources | Every file and site page for this task, and every version of it. Conflicts are marked. |
| 2 | Skill | The strand quest and level it covers. Anything above Grade 3. |
| 3 | Time | Estimated minutes for a typical Grade 3 student, compared with Marc's budget |
| 4 | Steps | The number of steps, and the numbers or words typed per answer, compared with Marc's limit |
| 5 | Reading | The longest instruction, words per sentence, and hard vocabulary. Novus Reading Level 3–4 is the reference: at most 10 words per sentence, common words. |
| 6 | Maths check | Every number and answer recomputed in code. Errors listed. |
| 7 | Checkpoints | Which kind each step can be (one answer, conditions, hands-on result, teacher-confirmed: template §3.3) |
| 8 | Per-student numbers | Whether they can vary, and a proposed rule tested on 10,000 seeds |
| 9 | Hands-on | Group A, B or C (handoff §6). What the materials are for. |
| 10 | Verdict | keep, fix, shorten, split or redo, with the reasons |

---

## PROCESS (use subagents)

1. **Inventory (one agent).**
   - List every quest and task file in `drive/`, and every page on the student site (https://sites.google.com/view/g3c-2023-space-math-quest).
   - Match each one to the world map tree.
   - Convert .docx and .xlsx files to text for reading (pandoc or python). Look at images and PDFs directly; maps and printed sheets carry numbers.
   - When you fetch site pages, ask for numbers quoted exactly as written, and keep their typos. Some numbers on the site are wrong (world map §6, item 1).
   - **Output:** `reviews/00_inventory.md`, including files that look private (don't open them) and files that are missing.
2. **Review (one agent per area, in parallel).**
   - **Areas:** Station bays 1–5; Voltara; Chronosia; Xylophora; Zephyron; Operation Stardust; Patternox and Comets (a status report only).
   - Each agent works through the checklist for every task in its area.
   - **Output:** `reviews/<area>.md`, with one section per task and the verdict table at the top.
3. **Stop here if Marc asked to approve verdicts first** (`INFO_FROM_MARC.md`, item 10). Write `SUMMARY_FOR_MARC.md` (step 6) and wait.
4. **Redesign (one agent per area).**
   - For every task marked fix, shorten, split or redo, write the new version in template format: `places/<place id>.md`.
   - Every number rule gets a test script in `checks/`.
5. **Independent check (a separate agent that never saw the reasoning).**
   - It reads only the finished `places/` files and the `checks/` scripts.
   - It recomputes every answer, runs every number rule on 10,000 seeds, and checks the Grade 3 level, the reading load and the typing load against `INFO_FROM_MARC.md`.
   - It returns defects in priority order.
   - Fix the defects and run the check again, until nothing above "minor" remains.
6. **Summary for Marc:** `SUMMARY_FOR_MARC.md`, two pages at most.
   - A table of every task: verdict, one-line reason, and estimated minutes before and after.
   - The decisions only Marc can make, each with its options.
   - New errors found in his material.
   - What couldn't be read or checked.

---

## OUTPUTS

```
reviews/00_inventory.md
reviews/<area>.md            one per area
places/<place id>.md         redesigned places, in template format
checks/<task id>_check.py    one per number rule, plus results
SUMMARY_FOR_MARC.md
GMQ_Quest_Review_<date>.zip  everything above
```

---

## DONE WHEN

- Every in-scope task has a completed checklist and a verdict.
- Every task not marked keep has a redesign in template format (unless Marc asked to approve verdicts first).
- Every number rule passes its seed test, and the independent check reports nothing above "minor".
- `SUMMARY_FOR_MARC.md` lists every decision Marc still has to make.
