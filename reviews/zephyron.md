# Review — Galaxy Geometrica, Planet Zephyron (Quest 1: Stranded on Zephyron: The Engine Core Quest)

**Date:** 2026-11-16
**Stage:** review and verdict only. Nothing is redesigned here.
**Verdicts are provisional** until Marc fills in `INFO_FROM_MARC.md`.

**Summary.** Zephyron has three tasks, all done on A3 colour maps with a ruler or a highlighter. Tasks 1 and 2 are the same skill twice: measure with a ruler and use the map's scale bar. Task 3 is a route on a coordinate grid. The 200 km / 600 km conflict is settled by the map: **600 km is right and the city is Reisi** (measured 597 km; the answer form accepts any text containing "eis"). No city is near 200 km. Task 2 has a real fault: **no entrance is exactly 10 miles from the flag.** The form's key is D (9.3 to 9.7 miles), but C is 10.2 to 10.6 miles, and C is the nearer one if the child measures from the green triangle. A wrong answer locked the child out for a day. Task 3 has no answer key at all, asks for far more typing than the limit allows, and Marc's own page lists Grade 5 practice for it.

**Assumptions used [Assumption]:** one task = one 40-minute period; at most 3 numbers or one short sentence per typed answer; reading at most 10 words per sentence.

---

## Verdict table

| Task | What the student does | Est. minutes | Most typed in one answer | Verdict | One-line reason |
|---|---|---|---|---|---|
| 1 Journey to the Right City | Measures 5 cities on the map, turns cm into km, names the city 600 km away | 30 (25–40) | 1 word (a city name) | **fix** | Right answer exists (Reisi). Fix the 200 km line. Turning each cm reading into km needs decimals. |
| 2 Find the Engine Core! | Measures 5 entrances from the flag, names the one 10 miles away | 20 (15–25) | 1 letter | **fix** | No entrance is exactly 10 miles. C and D are both about half a mile off. Miles, not km. Repeats Task 1. |
| 3 Alien Supply Missions | Draws 3 safe routes on a grid map and writes each as coordinate points; photo and video | 50 (40–60) | 12 to 37 coordinate pairs in all (24 to 74 numbers) | **split** | Too long, too much to type, no answer key, and "safe" depends on judging part-forest squares. |

**Which verdicts would change**
- **Time budget of two periods:** Task 3 could become **fix** instead of split. Tasks 1 and 2 do not change.
- **Typing limit raised to a list of pairs:** Task 3's typing fits better, but it still needs a terrain key before code can check it.
- **If Marc says printed maps must stay (INFO item 9):** Tasks 1 and 2 stay hands-on (group B) and only a handful of per-student targets exist (see item 8 of each task).

---

## Sources for the whole quest (checklist item 1)

| # | Source | What it is |
|---|---|---|
| S1 | Site: [Galaxy Geometrica](https://sites.google.com/view/g3c-2023-space-math-quest/the-universe/galaxy-geometrica) | Galaxy page. One quest listed. |
| S2 | Site: Quest #1 page | Briefing and three task summaries. Says **200 km**. |
| S3 | Site: Task 1, Task 2, Task 3 pages | Student instructions. |
| S4 | Drive "Shapes and Space Universe / New Quest 1 / Task 1": "Galaxy Geometrica Quest #1 - Stranded on Zephyron" (doc) | Same text as S2. The Drive reader returned it cut off mid-sentence at the end. Says **200 km**. |
| S5 | Same folder: "Task 1 overview" (doc) | Same text as the site's Task 1 page. Says **600 km**. |
| S6 | Same folder: "World Map - Crash - 600km.pdf" | The Task 1 map. A3. Red dot = crash site. Scale bar 0–75–150–300 km. |
| S7 | Same folder: "5 Cities and their Distances" (doc) | Record sheet. Two rows already filled: Pävala 230, Talvela 152. |
| S8 | "New Quest 1 / Task 2": "city map.pdf" | The Task 2 map. A3. Photo of a model city, entrances A–E, green flag, Km/Mi scale bar. |
| S9 | "New Quest 1 / Task 2": "5 Buildings and their Distances" (doc) | Empty record sheet, "Distance (in miles) from Target Building". |
| S10 | "New Quest 1 / Task 3": "final task - deliver 3 places.pdf" | The Task 3 map. A3. Same world map with a 17 × 12 grid, a green flag and three white X marks. |
| S11 | "New Quest 1": "Original Map.png" | The world map before the dot, scale bar and grid were added. |
| S12 | Google Forms linked from Tasks 1 and 2 | Answer forms. The accepted answer is visible in the public form page. |
| S13 | "Things to Prepare - 1st Five", sheet "October Prints" | Print list: three maps "15 - A3 - color"; two record sheets "15-A4 - Black/white". |
| S14 | Loom videos, one per task (112 s, 111 s, 132 s) | Marc's spoken instructions. **Not read** (see "Could not read"). |
| S15 | "tasks / strand order", "Pre-Requisite - Order of Strands", "Copy of Updated Quests - Shapes and Space Universe." | Strand plan. Zephyron matches Shapes Quest 2 "Magnificent Maps". |

**Other files in "Shapes and Space Universe" that are not Zephyron:** "Shapes - Quest 1" (Alien Construction Site), "lesson planning for shapes quest 1", "new intro for shapes quest" (planet Geometria, Space Architects), "example Design: Alien Monument". These are drafts for Shapes Quest 1 (2D shapes). No site pages exist for them.

**Versions.** Each task has one version of its instructions (site = Drive doc for Task 1; site only for Tasks 2 and 3). The only version conflict is the distance: 200 km in S2 and S4, 600 km in S3, S5, S6 and S12.

**The scale, measured [Source: S6, measured by `checks/zephyron_t1_check.py`]**
- The scale bar is 300 km long and has 8 equal divisions (37.5 km each). Labels: 0, 75, 150, 300.
- On the A3 print the bar is **7.1 cm**. So 1 cm = 42.3 km. (On A4 it would be 5.0 cm, 1 cm = 60 km.)
- The bar is a separate picture pasted onto the map. So is the red dot.

---

## Task 1 — Journey to the Right City

### 1. Sources
S2, S3, S4, S5, S6, S7, S12, S13, S14. **[Conflict]** 200 km (S2, S4) against 600 km (S3, S5, S6, S12).

### 2. Skill
- **Strand quest:** Shapes Quest 2 "Magnificent Maps", Level 1: "Identify the scale used on maps of cities and rural areas, and describe the difference." [Source: S15] Task 1 is the rural map. Task 2 is the city map. No task asks the child to describe the difference.
- **The arithmetic the child does** [recomputed]:
  - **Way 1, double the bar.** 300 km + 300 km = 600 km, so the city is two bar-lengths away: 7.1 cm + 7.1 cm = 14.2 cm. Reisi measures 14.1 cm. This is Grade 3 if done in millimetres (71 + 71 = 142) or with a paper strip. **Within Grade 3.**
  - **Way 2, turn every measurement into km.** The record sheet asks for the distance in km of 5 cities. That needs cm × 42.3, for example Pävala 5.8 cm → 246 km. **Above Grade 3** (decimal × 2-digit, or proportional reasoning). Counting bar divisions does not rescue it: one division is 37.5 km.
- So the task is not "cm × 100 km". There is no whole-number rule for this map at A3.
- The page's "Learning Objectives" and "Performance Assessment" mention coordinate planes. Task 1 has no coordinates. [Conflict, minor]

### 3. Time
About **30 minutes** (25–40). Video 2 min; read the page 3 min; measure the bar and 5 cities 10 min; convert and record 10 min; form 2 min. The converting step is where a typical child stalls. Inside the 40-minute assumption only if the conversion is dropped or helped.

### 4. Steps
- The page lists 3 mission steps. Real small steps: about 16 (video, find the bar, measure it, 5 × measure, 5 × convert, record 5 names and 5 numbers, decide, open the form, type).
- Typed: **one word**, the city name. Within the limit.
- The names are hard to type on an iPad: Pävala, Käraste, Künkapää, Hólborg. Marc's form avoided the problem: it accepts any answer containing "eis".
- Hand-written on the record sheet: 5 names and 5 numbers.

### 5. Reading
- 364 words on the page. 14 of 24 sentences are over 10 words. Mean 14.5 words.
- Longest instruction (31 words): "Measure to Multiple Points: Use the 300 km scale on the map to measure distances and calculate how to get to 5 different cities within 600 km from your current location."
- Longest sentence on the page (34 words) is in the conclusion.
- Hard words: intel, symposium, desperately, navigate, prowess, strategic, intricate, acquiring, vigilant.
- Above the Novus Level 3–4 reference.

### 6. Maths check
Run: `python3 checks/zephyron_t1_check.py`. Distances from the crash site, measured on the map image:

| City | km | cm on A3 |
|---|---|---|
| Talvela | 173 | 4.1 |
| Käraste | 176 | 4.1 |
| Pävala | 246 | 5.8 |
| Rabaraja | 414 | 9.8 |
| Tapavee | 487 | 11.5 |
| Künkapää | 560 | 13.2 |
| **Reisi** | **597** | **14.1** |
| Hólborg | 661 | 15.6 |
| Loikka | 725 | 17.1 |
| Mägela | 740 | 17.5 |
| Vestrbu | 892 | 21.1 |
| Vaheri | 909 | 21.5 |
| Laheste | 955 | 22.6 |
| Sjálborg | 1,020 | 24.1 |

- **600 km → Reisi** (3 km short of 600). The form's key "eis" agrees. [Source + recomputed]
- **200 km → no city.** The nearest are Käraste (176) and Talvela (173), then Pävala (246). [Conflict resolved: 200 is a leftover.]
- The nearest wrong city to 600 km is Künkapää, 1.0 cm short on A3. A child must measure to within about half a centimetre over 14 cm.
- Seven cities are within 600 km. The task asks for five.
- Talvela and Käraste are 3 km apart in distance (under 1 mm). They cannot be told apart with a ruler.
- The record sheet's filled rows are low: Pävala 230 (measured 246), Talvela 152 (measured 173).

### 7. Checkpoints
| Step | Kind |
|---|---|
| Measure and record five cities | hands-on result, or teacher-confirmed. Code cannot check a ruler reading exactly; it could accept a range. |
| Name the city at the target distance | **one answer** (a word). Accept spelling variants; the world never corrects spelling. |

### 8. Per-student numbers
Two rules tested, both in `checks/zephyron_t1_check.py`.
- **Rule A [Proposal]: keep the printed map, vary the target.** A target is usable when one city is within 15 km and every other city is at least 40 km off. Result: 10 usable targets (250, 400, 425, 475, 500, 550, 600, 650, 675, 950 km) but only **7 different answer cities**. 10,000 seeds: 0 failures. In a class of 20, about 3 students share each answer. This does not stop one child telling another.
- **Rule B [Proposal]: the world gives the numbers.** Scale 1 cm = 10, 20, 50 or 100 km. Five cities at different whole-cm distances from 2 to 10. Child's sum: cm × km-per-cm. 10,000 seeds: 0 failures, largest distance 1,000 km, 9,998 different puzzles. Grade 3 arithmetic. It gives up the ruler.
- Marc chooses: the ruler (A) or truly different numbers (B). Both could be used: B to learn the rule, A as the hands-on finish.

### 9. Hands-on
Group **B** [Source: handoff §6]. The A3 map and the ruler are the learning: reading a scale bar and measuring in a straight line. Rule B would move the task to group A.

### 10. Verdict: **fix**
- Change "200 km" to "600 km" on the quest page and in S4.
- Decide what to do with "calculate the distance of 5 cities". As written it is above Grade 3.
- The core (find the city two bar-lengths away) is sound, short and has a checked answer.

---

## Task 2 — Find the Engine Core!

### 1. Sources
S2 (summary), S3 (task page), S8, S9, S12, S13, S14. One version. **[Conflict]** The quest page says "Use the city map and coordinates to pinpoint the exact location". The task page has no coordinates. It is a second scale task.

### 2. Skill
- Shapes Quest 2, Level 1 again: the scale on a **city** map. [Source: S15]
- **Units:** miles. Task 1 used km. The scale bar shows both (0–8 km above, 0–5 miles below).
- **Arithmetic:** 10 miles = two bar-lengths (5 + 5). On A3 the 5-mile bar is 11.8 cm, so 10 miles = 23.6 cm. Doubling is Grade 3. Turning each of the 5 measurements into miles needs cm ÷ 2.36: **above Grade 3**.
- Reading a two-sided scale bar (km and miles on one line) is an extra demand that Task 1 did not have.

### 3. Time
About **20 minutes** (15–25). It repeats Task 1's method, so it goes faster.

### 4. Steps
- 4 mission steps on the page. Real small steps: about 14.
- Typed: **one capital letter**. Within the limit.
- Hand-written: 5 numbers on the record sheet.
- The form says: "If you miss this question, you can not try again for one day."

### 5. Reading
- 359 words. 15 of 26 sentences are over 10 words. Mean 13.3 words.
- Longest instruction (27 words): "Submit Your Answers: Click on the link to a Google Form and input the letter of the secret entrance exactly 10 miles away from the target building."
- Hard words: undetected, intel, precisely, strategic, covert, discreet, honed.

### 6. Maths check
Run: `python3 checks/zephyron_t2_check.py`. Distances in miles from the green flag to each red ring:

| Measured from | A | B | C | D | E |
|---|---|---|---|---|---|
| centre of the green triangle | 3.28 | 5.95 | **10.40** | **9.50** | 7.88 |
| bottom of the flag pole | 3.60 | 6.21 | **10.63** | **9.68** | 7.94 |
| top of the flag pole | 3.15 | 5.98 | 10.44 | 9.59 | 8.02 |
| tip of the green triangle | 3.30 | 5.78 | 10.21 | 9.31 | 7.69 |

- **No entrance is exactly 10 miles away.** D is 0.3 to 0.7 miles short. C is 0.2 to 0.6 miles over.
- The form's key is **D**. [Source: S12]
- Which is nearer to 10 depends on where the ruler starts: **C** from the green triangle (centre or tip), **D** from the pole (top or bottom). The page says only "The Target Building is the Green Flag!".
- On the A3 print: 10 miles = 23.6 cm; D = 22.9 cm; C = 25.1 cm (from the bottom of the pole).
- Each red ring is 0.37 miles across, so "which edge" moves an answer by up to 0.19 miles.
- The map is a photo of a model taken at an angle. One scale cannot be true across the picture. The task ignores this, and so does the table.
- The form's "correct" message says "You have found the right city!!!!" It was copied from Task 1.

### 7. Checkpoints
| Step | Kind |
|---|---|
| Measure five entrances | hands-on result or teacher-confirmed |
| Name the entrance | **one answer** (a letter) |

### 8. Per-student numbers
- **On the printed map:** only two whole-mile targets have one clear answer from every starting point: **6 miles → B** and **8 miles → E**. 10 miles is not safe. Two targets are too few to give each child their own.
- **Rule [Proposal]: the world gives the numbers.** 1 cm = 1, 2 or 5 miles (or km); five entrances at different whole cm from 2 to 10; the child multiplies. 10,000 seeds: 0 failures; largest product 50; all five letters used evenly.
- Results are in `checks/zephyron_t2_check.py`.

### 9. Hands-on
Group **B** [Source: handoff §6]. Same materials and same purpose as Task 1.

### 10. Verdict: **fix**
- The stated answer cannot be reached by careful measuring. That must be fixed before the task is used again in any form.
- It is in miles while the rest of the quest is in km.
- It teaches the same thing as Task 1. Marc may want to merge the two; that is his decision.
- The verdict does not depend on the time budget or the typing limit.

---

## Task 3 — Alien Supply Missions (page heading: "The Supply Run Gauntlet")

### 1. Sources
S2 (summary), S3 (task page), S10, S13, S14. One version. No record sheet, no answer form and **no answer key** exist. Evidence was photos and a video uploaded to Google Drive.

### 2. Skill
- Shapes Quest 2, Level 3: "Locate features on a grid using coordinates." [Source: S15]
- **Marc's own page lists the practice as IXL Grade 5** (LL2 "Objects on a coordinate plane", LL3 "Graph points on a coordinate plane"). [Source: S3]
- **The map and the practice do not match.** On the map the numbers label the **squares** (column 4, row 6 is a box). On a coordinate plane the numbers label the **lines** and a point is a crossing. Square labels are the easier form.
- Planning a route around obstacles and writing it as a list of coordinates is harder than locating a feature.
- Shapes Quest 2, Level 2 (north, south, east, west) is not used anywhere in the quest.

### 3. Time
About **50 minutes** (40–60). Video 2 min; read 4 min; find and note the obstacles 8 min; find the 3 outposts 3 min; draw 3 routes 12 min; write the routes 10 min; photos, upload, reflection video, upload 10 min. Over the 40-minute assumption.

### 4. Steps
- 5 mission steps on the page; each holds several.
- **Typing if moved into the world:** the three shortest routes on my reading of the map are 6, 14 and 14 moves. Written square by square that is 37 squares = **74 numbers**. Written as turning points only it is 12 points = **24 numbers**. Either way it is far over 3 numbers per answer, unless each answer is one square ("go to 5,6").
- The first mission step, "note their coordinate ranges" for every mountain and forest, would be dozens of squares. 90 of the 204 squares hold forest or mountain on my reading.

### 5. Reading
- 421 words. 18 of 37 sentences are over 10 words. Mean 11.0 words.
- Longest instruction (20 words): "Alien Territory Map with Coordinate Grid: A map displaying our starting point, the locations of the outposts, mountains, and forests."
- Hard words: acquiring, carnivorous, coordinate ranges, tactical, hazards, invaluable, strategic.
- The example on the page has a typo: "go to (4,1). Then go to (3.5)." It should be (3,5).

### 6. Maths check
Run: `python3 checks/zephyron_t3_check.py`.

**Every coordinate question in the task, with its answer** [Source: S10, measured]

| Feature | Square (column, row) |
|---|---|
| Start (green flag, beside Künkapää) | **(4, 6)** |
| Outpost, west | **(2, 2)** |
| Outpost, north-east | **(14, 8)** |
| Outpost, south-east | **(13, 1)** |

- The grid is 17 columns by 12 rows. Each square is about 105 km wide (same map scale as Task 1).
- The task asks no other coordinate question with a single answer. "Coordinate ranges" of the obstacles and the routes have many possible answers.
- City squares, for future questions [Reviewer, measured]: Vaheri (1,8), Laheste (2,10), Loikka (4,10), Käraste (8,5), Rabaraja (8,9), Tapavee (10,1), Talvela (11,6), Reisi (15,3), Vestrbu (15,12). Künkapää, Mägela, Hólborg and Sjálborg sit on grid lines, and Pävala is close to one; avoid them.

**Routes and totals.** The source has **no routes, no distances and no totals** to recompute. To test whether the task can be done, I wrote a terrain table by reading the picture square by square. **That table is my reading, not Marc's.** With it:

| How a part-forest or part-mountain square is judged | to (2,2) | to (14,8) | to (13,1) |
|---|---|---|---|
| Lenient: only mostly-forest, mostly-mountain or water squares block | 6 moves | 14 moves | 14 moves |
| Tan hills also count as mountains | **no route** | 20 moves | 20 moves |
| Strict: any forest or mountain in the square blocks | 6 moves | **no route** | **no route** |
| Strict, but the sea may be crossed | 6 moves | 20 moves | **no route** |

- Example lenient routes, as straight legs:
  - to (2,2): go to (2,6) then (2,2)
  - to (14,8): go to (11,6) then (11,5) then (14,5) then (14,8)
  - to (13,1): go to (11,6) then (11,5) then (12,5) then (12,2) then (13,2) then (13,1)
- The north-east outpost (14,8) is drawn on the edge of a forest with mountains beside it. Its own square holds both.
- The task bans mountains and forests. It does not say whether the sea can be crossed.
- The west of the map is covered in tan cliffs. A child could fairly call them mountains.
- **So whether a route is "safe" is a judgement.** In class a teacher made it from the photo. Code cannot make it without a terrain table that Marc has agreed.

### 7. Checkpoints
| Step | Kind |
|---|---|
| Give the square of the start and of each outpost | **one answer** each (2 numbers) |
| Note the obstacles' coordinate ranges | teacher-confirmed (too many squares to type) |
| Chart a safe route | **conditions**: each step moves to a neighbouring square that is not blocked. Needs the terrain table. |
| Draw the routes, photo, reflection video | teacher-confirmed |

### 8. Per-student numbers
- **Rule [Proposal]:** on the same grid, draw a start and three outposts from clear squares; accept the draw only if every outpost has a lenient route of 3 to 12 moves. The student types one square per answer (2 numbers).
- **Test:** 10,000 seeds, 0 failures, at most 45 redraws for one seed, longest route 12 moves, 9,996 different layouts.
- The rule rests on the terrain table, which Marc must confirm first.

### 9. Hands-on
Group **B** in handoff §6 (printed map, highlighter). The highlighter and paper are a way to plan, not the skill itself. If the grid can be shown in the world's simple display, the routes could be group A. The reflection video is group C (teacher marks it).

### 10. Verdict: **split**
- Too long for one period: three routes, a full obstacle survey, photos and a video.
- Too much to type unless each answer is one square.
- No key exists, and right or wrong depends on how part-forest squares are judged.
- The listed practice is Grade 5 and teaches line crossings, while the map labels squares.
- Typos to fix: "Weapo", "(3.5)", and two names for the task.
- With a two-period budget this would be **fix** (agree a terrain table, cut the obstacle survey).

---

## Errors found

| # | Where | Problem | Recomputation |
|---|---|---|---|
| 1 | Quest page (S2) and its Drive copy (S4) | "the city precisely 200 km away" | No city within 20 km of 200 km. Nearest: Käraste 176, Talvela 173, Pävala 246. At 600 km: Reisi 597. `zephyron_t1_check.py` PART 1. |
| 2 | Task 2 | "exactly 10 miles" has no exact answer. Key is D. | D = 9.31–9.68 miles, C = 10.21–10.63 miles, depending on the starting point. `zephyron_t2_check.py` PART 1. |
| 3 | Task 2 | Nearest-to-10 flips between C and D | C from the triangle's centre (0.40 off against 0.50) and tip; D from the pole's bottom (0.32 against 0.63) and top (0.41 against 0.44). |
| 4 | Task 1 record sheet (S7) | Two filled rows are low | Pävala 230 (measured 246); Talvela 152 (measured 173). Who typed them is not known. |
| 5 | Task 1 | Asks for the km distance of 5 cities | Needs cm × 42.3 on A3. Above Grade 3. |
| 6 | Task 1 | "5 different cities within 600 km" | Seven cities are within 600 km. Two of them (Talvela, Käraste) are 3 km apart in distance. |
| 7 | Quest page | Task 2 summary says "city map and coordinates" | Task 2 has no coordinates. Task 1's objectives mention coordinate planes too. |
| 8 | Task 3 | "our much-needed Weapo" | The quest is about an Engine Core. |
| 9 | Task 3 | Example "(3.5)" | Should be (3,5). |
| 10 | Task 3 | Practice listed as IXL **Grade 5** LL2, LL3 | Marc's own page marks the skill as two grades up. |
| 11 | Task 3 | No key; outpost (14,8) is in a forest-and-mountain square | Under a strict reading two of three outposts cannot be reached. `zephyron_t3_check.py` PART 2. |
| 12 | Task 2 form | Success message says "You have found the right city!!!!" | Copied from Task 1. |
| 13 | Task 2 | Miles, while Task 1 is km | The bar shows both; 1 mile = 1.61 km on the bar, which is correct. |
| 14 | Quest page vs Task 1 | "interstellar meetup" vs "interstellar symposium" | Wording only. |
| 15 | Site menu vs page | Task 3 is "Alien Supply Missions" in the menu and "The Supply Run Gauntlet" on the page | Naming only. |

**Against the design docs**
- Handoff §8 lists the 200/600 conflict as open. It can now be closed: 600 km, Reisi.
- Handoff §6 describes Zephyron as "map scale with a ruler, coordinates, supply missions". In fact it is scale, scale again, then coordinates and supply missions together.
- World map §1 places Task 2 in "The City". On the site, Task 2 happens outside the city: the job is to choose a secret entrance into it.

---

## Could not read or find

- **The three Loom videos** (Task 1: 112 s, Task 2: 111 s, Task 3: 132 s). They hold Marc's spoken instructions, and probably say how he taught the scale step and where to put the ruler on the flag. The Loom page asks automated readers to use an authorised Loom or Atlassian connection for transcripts. This session has none, so I did not fetch them. Marc can say what the videos tell students.
- **Who filled the two rows in "5 Cities and their Distances"**, and when (the doc was last changed in November 2024).
- **Where the two map pictures come from.** "Original Map.png" is a screenshot of a web map (a menu icon is visible at the top left). The city map is a photo of a white model city. I could not identify either source. See the note below.
- **Student work** (photos, videos in Drive) was not looked for and not opened.
- **A terrain key or model answer for Task 3.** None found.
- Not opened, by rule: "Users Info", "Galaxy Math Quest - Users", "API information", "Galaxy Math Quest AP API", and the folder "Math Assessment Test". All five sit in the root folder.

**Note for Marc on the maps [Reviewer's inference, not confirmed].** `CLAUDE.md` says every place and name in the world must be original or Marc's own. The world map's names (Reisi, Künkapää, Talvela, Aethelland, Rothnia, Martyr's Oak and the rest) come with the map picture. If the picture is someone else's work, the names are too. Marc should say where the map came from before those names go into the master world.

---

## What a child could explore or play with here

All from Marc's own text unless marked.

- **The crash site.** The broken ship, the red dot on the map, the missing Engine Core.
- **Singing grass.** "Fields where the grass sings as you pass by."
- **The Levitiger.** "A feline that floats in the air."
- **MoodQuench.** A drink that changes taste, "from tasting like mango to a blueberry surprise".
- **The city.** Five secret entrances (A to E) and the Target Building with the green flag, where the Engine Core is stored.
- **The Zephyronians.** The aliens whose trust must be won.
- **The supply zone and three outposts.** The start flag and the three X marks.
- **Mountains "home to deadly creatures" and forests of "carnivorous plants".** Places to steer around.
- **The map itself, if the names are cleared:** Martyr's Oak, the Gap of Rothnia, Mõhistu Marsh, Punala Woods, Lake Vabajärv, the inland sea.
- **[Proposal]** The interstellar meetup the commanders were flying to. The story never says what happened to it.
