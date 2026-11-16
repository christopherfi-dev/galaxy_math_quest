# SOURCES INDEX — where the GMQ material is

Checked in Marc's Google Drive and on the student site on 2026-11-16.

---

## 1. The main Drive folder

**[Galaxy Math Quest](https://drive.google.com/drive/folders/1DV4iuNnVx-u_9t4Ry1yduMzHRL0nQwj2)**. Owned by Marc's KIS account and shared with his personal account. Almost everything is inside it:

| Folder or file | What's in it |
|---|---|
| Space Station Initial quests/ | The 15 station tasks, including "Weapons Systems/" (Card Codes) and "Things to Prepare - 1st Five" |
| Numbers Universe/quest 1/ | Voltara: Level 1 (Task 1), Level 2 (Task 2), Final Boss/ |
| Measurement Universe/ | Chronosia; Xylophora ("quest 2/Task 1": intro, building area calculation) |
| Shapes and Space Universe/New Quest 1/ | Zephyron |
| Data Handling Universe/ | Operation Stardust |
| Patterns Universe/ | Patternox (the student site has titles only) |
| Comets Universes/ | Cosmic Coding Comets |
| Card Prints and Images/ | Booster Cards, Booster 2, Booster Cards - November, Engine Cores, FINAL DECK NOVEMBER CARDS DECK.pdf |
| photos for cards/ | Card images |
| Intro to background story, ship parts, tasks / strand order, Pre-Requisite - Order of Strands, QR CODES for QUESTS, Galaxy_Math_Quest_Presentation.pptx | Top-level docs |

### Remove before giving the download to Claude Code

The names suggest these hold student data or keys. Claude hasn't opened them. Delete them from the downloaded copy (not from Drive):

| File | Why |
|---|---|
| Users Info (sheet) | Probably student accounts |
| Galaxy Math Quest - Users (sheet) | Probably student accounts |
| Math Assessment Test/ (folder) | May hold student results. Check before keeping. |
| API information (doc) | May hold API keys |
| Galaxy Math Quest AP API (Apps Script) | Code with possible keys. Drive won't download it anyway. |

## 2. Files outside the main folder (download separately)

| File | Where |
|---|---|
| [GMQ Cards Print - january.pdf](https://drive.google.com/file/d/10SNwYBga8fyHulJWaqgkcVyz7JlfP06H/view) | "Downloads" folder |
| [Galaxy Math quest Policeman.pdf](https://drive.google.com/file/d/10f4PoyRchLh7D2E4I6P1zIKaJD1ylOcc/view) | "Downloads" folder |
| [Copy of Battle Game Board.jpg](https://drive.google.com/file/d/16308HxxKrs50qFmXPB6ntjUUzHkS5nnY/view) | "Downloads" folder |
| [Cards.csv](https://drive.google.com/file/d/1G222S_Z_7pjW-PW5nR8bM3poz0eP6jJM/view) | another folder |
| [Edutopia draft](https://docs.google.com/document/d/1w98b3d9gVVmtHsVHRaZJl0mwu_6B9tcffFmQyAxNo50/edit) | another folder. It has the class results and student stories. |
| [Decision Matrix](https://docs.google.com/document/d/1tryCO4Ba71BtmBpE55DyrQJ_c5pmvV_L39m-ORZutoA/edit) | not checked; may already be in the main folder |

The card and battle files are for the later battle stage. They are listed so nothing is lost.

## 3. The student site

**[Galaxy Math Quest 2023–2024](https://sites.google.com/view/g3c-2023-space-math-quest)** is public, so Claude Code can fetch it.
- It has quest briefings and task pages that aren't in Drive.
- It has an error: Voltara Task 1 says "8 of '100s' = 300" (world map §6, item 1).
- Page addresses are listed in world map §8.

## 4. Marc's other engines (in the Claude Project "Engines And constraints", not in this zip)

Not needed for the quest review. They will matter when the world is built:
- `math-skills_txt v4_1`, `math-skills-api_php v1_1`, `math-skills-login_html v1_1`: per-student seeds, answer checks, logins
- `api-swi_php v2_6`: shared rooms
- `api_php v4_3_1`: model paths and the tag-extraction pattern
- `Project State 2026-11-14.md`, `DeepSeek API Reference Sheet 2026-11-11.md`, `POWERSHELL-DEPLOY-HANDOFF.md`

**Never** add `api/config.php` (live keys) or any server folder holding student data.

## 5. Added on 2026-11-16

- `engines/math-skills/`: the Math Skills engine, sent by Marc as a zip. No keys and no student files. Its own README lists what was left out.
- `reference/third-party/abyssal-garden/`: "Abyssal Garden" by Maksymilian Dendura, MIT licence. Not Marc's work. Kept as a reference for a later travel view.
- `reference/marc-2026/`: Marc's 2026 work, sent as a zip: six Survival Laws missions, Midnight at Hollow House (paper and HTML), Math Check-Up 1 and three Grade 5 puzzles. **Left out on purpose:** `G3_Math_Skills_Tracker.md`, because it holds current students' names and results.
