# GMQ World Map — v1 — 2026-11-16

**Stage:** proposal. Nothing has been built.
**Builds on:** `GMQ_World_Handoff_2026-11-16_v8.md`. Places are written in the format of `GMQ_Place_Template_v1_2026-11-16.md`.
**Read this first:** each line is marked by where it comes from:
- **[Source]:** found in Marc's material (the student site or Drive). Links are in §8.
- **[Proposal]:** Claude's suggestion. Not decided.
- **[Conflict]:** Marc's sources disagree, or a source has an error.

---

## 1. The shape of the world

```
UNIVERSE
│
├── KIS STATION (Kepler International Space Station) ............ hub
│   ├── Arrival Dock ............................................. start
│   ├── Engine Core Bay ............ tasks 1-1, 1-2, 1-3   (counting)
│   ├── Navigation Bay ............. tasks 2-1, 2-2, 2-3   (addition, subtraction)
│   ├── Shield Bay ................. tasks 3-1, 3-2, 3-3   (multiplication, division)
│   ├── Weapons Bay ................ tasks 4-1, 4-2, 4-3   (odd and even)
│   ├── Power Bay .................. tasks 5-1, 5-2, 5-3   (place value)
│   ├── Launch Bay ................................. leave the station
│   └── Heart of the Learning Station ......... Cosmic Coding Comets
│
├── GALAXY NUMERIX (Numbers)
│   └── Planet Voltara ........ Quest 1: Voltara Energy Crisis & Galactic Trade
│       ├── Landing Field
│       ├── Energy Council Chamber ........ Task 1
│       ├── Trade Routes (in space) ....... Task 2
│       └── Colony Command ................ Final Boss
│
├── GALAXY PATTERNOX (Patterns) ........ CLOSED: the wormhole is broken
│   ├── Quest 1: Cracking the Cosmic Code ......... titles only
│   └── Quest 2: Harmony of the Twin Star System .. titles only
│
├── GALAXY METRICA (Measurement)
│   ├── Planet Chronosia ...... Quest 1: Time Riddles & Galactic Engineering
│   │   ├── Task 1: Calibrate the Time Streams
│   │   ├── Task 2: Unravel the Temporal Rift Riddle
│   │   ├── Task 3: Exam to Become a Temporal Coordinator
│   │   └── Task 4: Timekeeper Cadet's Challenge: Plan the Perfect Day
│   └── Planet Xylophora ...... Quest 2: Planetary Pioneers
│       ├── Task 1: Architectural Origami
│       ├── Task 2: Efficient Use of Alien Resources
│       ├── Task 3: Roofing Challenge
│       └── Task 4: Designing the Xylophora Colony
│
├── GALAXY GEOMETRICA (Shapes)
│   └── Planet Zephyron ....... Quest 1: Stranded on Zephyron: The Engine Core Quest
│       ├── Crash Site ............ Task 1: Journey to the Right City
│       ├── The City .............. Task 2: Find the Engine Core!
│       └── (around the city) ..... Task 3: Alien Supply Missions
│
└── GALAXY DATABA (Data)
    └── Operation Stardust .... aboard the commanders' own ship (no planet named)
        ├── Task 1: Food Shopping (Levels 1–2)
        └── Task 2: Graphing our Data (Levels 1–4)
```

**Where the names come from**
- **Galaxies, planets, quests and task titles:** [Source] the student site's menus and pages.
- **KIS Station:** [Source]. The intro calls it the Kepler International Space Station (KIS Station). "Space Station Info" calls it KIS Space Station.
- **The five bays:** [Source] for the tasks and parts. The bay names are [Proposal].
- **Arrival Dock and Launch Bay:** [Proposal].
- **Heart of the Learning Station:** [Source]. The Cosmic Coding Comets page says cracking the comets' codes repairs it. Making it a place on the station is [Proposal].
- **Voltara's Landing Field and Colony Command:** [Proposal].
- **Voltara's Trade Routes:** [Source]. The Task 2 doc opens with "We've just left Planet Voltara", so the task happens in space.
- **Zephyron's Crash Site and The City:** [Source], from the quest page.
- **Operation Stardust on the ship:** [Source]. The quest page sets it on the commanders' spaceship before a 12-month journey. Its graph data comes from "Voltara Mission Control".

**Ambient places:** each planet also gets ambient places, Novus-style, written after its quest places (template §5). None are listed here yet.

---

## 2. How students move

| Where | How | Status |
|---|---|---|
| Inside the station | Walk between rooms by typing, e.g. "go to the Navigation Bay" | [Proposal] |
| Leaving the station | From the Launch Bay, once the ship is ready (§3) | [Proposal] |
| To a galaxy | "fly to Galaxy Metrica." The student arrives at the galaxy, then lands on a planet: "land on Chronosia." | [Proposal] |
| Wormholes | The Patternox page says a broken wormhole leads there. **Proposal:** every galaxy is reached through a wormhole gate at the station, and Patternox's gate is the broken one. That turns the site's one notice into a rule for the whole world. | [Source] for Patternox; [Proposal] for the rest |
| Going back | Students can fly back to the station from any planet at any time. | [Proposal] |
| Later 3D layer | Every place's `position` line (galaxy / planet / landmark) puts it in a scene. This map is that layout. | [Proposal]. Marc wants flying between planets later (2026-11-16). |

---

## 3. What opens what

### 3.1 Rules found in Marc's material

| # | Rule | Source | Status |
|---|---|---|---|
| 1 | Station tasks come in this order: Engine Core, Navigation, Shield, Weapons, Power. | "Space Station Info": "The first task…", "Next…", "The third task…", "The fourth…", "The final task…" | [Source] gives the order. Whether a bay stays locked until the previous bay is finished is Marc's call. |
| 2 | Students leave the station once their ship is fixed. | Intro: "If you can fix the ships, you'll get to explore amazing galaxies." | [Source]. Open: all five parts, or fewer (§4). |
| 3 | Patternox opens when Quest 2 in the Numbers Universe is finished. | Patternox page: the wormhole is broken, and repairing it needs that quest. | [Source]. **[Conflict]:** no Numerix Quest 2 exists yet, so Patternox can't open until it is written. |
| 4 | Quest prerequisites, plus a 30-step order across all strands | "Pre-Requisite - Order of Strands" | [Source], but it is an AI-written draft. Marc chooses which rules the world enforces (§3.3). |

### 3.2 The built quests matched to the strand plan

The site numbers quests within each galaxy. The strand docs number them within each strand. The numbers don't line up: Chronosia is Metrica Quest #1 on the site, but its topic is Measurement Quest 3 (time). The matches below are by topic, and they are Claude's.

| Site quest | Strand quest (by topic) | Prerequisite in "Order of Strands" | Is the prerequisite built? |
|---|---|---|---|
| Voltara (Numerix #1) | Numbers Quest 1: place value, rounding | none | — |
| Chronosia (Metrica #1) | Measurement Quest 3: time | Numbers Quest 1 | yes (Voltara) |
| Xylophora (Metrica #2) | Measurement Quest 4: area | Shapes Quest 1 (2D shapes) | **no** |
| Zephyron (Geometrica #1) | Shapes Quest 2: maps, scale, coordinates | none | — |
| Operation Stardust (Databa #1) | Data Quests 1–2: categories, bar and line graphs | Data Quest 2 needs Patterns Quest 1 | **no**, and Patternox is closed |
| Patternox #1 and #2 | not known (titles only) | — | — |
| Cosmic Coding Comets | not in the strand docs (Scratch coding) | — | — |

### 3.3 What that means

If the world enforced "Order of Strands" exactly as written:
- **Xylophora would stay locked** behind Shapes Quest 1, which isn't built.
- **Operation Stardust's graphs would stay locked** behind Patterns Quest 1, which sits behind the closed Patternox wormhole, which needs Numerix Quest 2, which isn't built.
- So 2 of the 5 built quests could never open.

**Options (Marc decides):**
- **(a)** Enforce only the rules in §3.1. Treat the strand prerequisites as advice for the teacher, not locks.
- **(b)** Enforce a prerequisite only once the quest it points to exists.
- **(c)** Leave everything open after the station, and let the teacher steer.

**Check:** in 2023–24, did students have to finish quests in order, or could they pick? The answer shows which option matches how GMQ actually ran.

---

## 4. Ship parts as unlocks (Marc decides)

Each part already has a skill from "Space Station Info": Engine Core (counting), Navigation System (addition and subtraction), Shield Generator (multiplication and division), Weapons System (odd and even), Power Module (place value).

**Options:**
- **(a) All five parts to leave the station.** This matches the intro's "If you can fix the ships". It is the simplest rule, and every student meets all five skills first.
- **(b) Navigation to leave, other parts for particular places.** For example, Shield needed to cross an asteroid field. This gives each part a use in the world, the MUD handoff's "tools open new actions". It needs the planets to have places that call for each part.
- **(c) Mixed.** All five to leave, then upgrades open harder places. Voltara's reward is already a Power Module upgrade (site, Final Boss).

**Zephyron needs a decision either way.** Its story says the ship crash-lands and needs a new Engine Core. The world must decide what that does to the student's real Engine Core:
- the crash is story only, and the part is untouched; or
- the part is damaged until the quest is finished. That affects battle stats if the part's HP and AP count (handoff §7.2).

---

## 5. Size of the first world

| Area | Quest places | Status of material |
|---|---|---|
| KIS Station | 8 | All 15 tasks drafted. Some keys have errors (handoff §8; §6 below). |
| Voltara | 4 | Ran in class. Supply numbers conflict (§6). Two final-boss versions (§6). |
| Chronosia | 4 | Printed for class ("Things to Prepare", October prints). |
| Xylophora | 4 | Area tasks above Grade 3 in places (handoff §8). |
| Zephyron | 3 | Printed for class (October prints). Distance conflict, 200 km vs 600 km (handoff §8). |
| Operation Stardust | 2 | Drafted on the site. |
| Patternox | 0 | Titles only, and closed. |
| **Total** | **about 25** | plus ambient places for each planet |

**No pages on the student site for:** Numerix Quests 2–5, Patternox content, Shapes Quests 1, 3 and 4, Measurement Quests 1–2, Data Quests 3–4, and every Advanced quest. Drive may hold plans for some of them. For example, a saved ChatGPT chat ("chat 2") plans a multiplication quest on "Multiplo-Planet". Drive wasn't searched for all of them.

---

## 6. New problems found while making this map

These belong in handoff §8 (known errors) at the next version.

| # | Where | Problem |
|---|---|---|
| 1 | Voltara Task 1 energy supply | Three versions. **Site:** "150 of '1s' = 150, 70 of '10s' = 700, 8 of '100s' = 300", total 1,650. The 300 should be 800; with 800 the total of 1,650 is right. **"Level 1" doc:** 200 ones, 80 tens and 10 hundreds, 2,000 in all. **The same doc's module text:** 200 ones, 60 tens, 10 hundreds and 3 thousands, which is 4,800. The doc's City List needs total 1,940. So the site version is 290 short, which fits its goal of making students prioritise. The 2,000 version has 60 to spare. Marc picks one. |
| 2 | 5-2 Power Allocation ("first 5 quests on Space Station") | The total power is 8,724 (4,325 + 3,133 + 954 + 312), but the blocks given are worth only 8,260: six 1000s, twenty 100s, twenty 10s and sixty 1s. The task can't be done with those blocks. Check whether the printed version differs. |
| 3 | Numerix Quest 1 final boss | Two versions. The site's Final Boss ("The Ultimate Colony Commander") and the "Final Boss Quest 1 Numbers" doc build colonies, using the sheets on the print list (Distance Data, Colony Needs, Profit/Loss). "New numbers Quest 1" has a different final boss, Building a Galactic Fair with 1,000 Galactic Credits. Earlier in this thread Claude called the Galactic Fair a GMQ project. The site's version is the colony one, and the Fair is an alternative draft. |
| 4 | Patternox | Its wormhole needs "Quest 2 in the Numbers Universe", which doesn't exist (§3.1, rule 3). |
| 5 | Galaxy Numerix page | Its description ("a precise gridwork of interstellar distances and volumes") is Metrica's, copied over. |
| 6 | "New numbers Quest 1", Level 1 | Navigational Star Mapping (in a "Star Mapping Chamber") isn't on the site. It may have been dropped. |

---

## 7. Open decisions for the map

1. **Station order:** must the bays be done in order, or are all five open from the start? (§3.1, rule 1)
2. **Leaving the station:** all five parts, or fewer? (§3.1, rule 2; §4)
3. **Prerequisites:** option (a), (b) or (c) in §3.3.
4. **Ship parts as unlocks:** option (a), (b) or (c) in §4.
5. **Zephyron's crash:** story only, or the Engine Core is really damaged? (§4)
6. **Wormhole gates for every galaxy:** yes or no. (§2)
7. **Operation Stardust:** keep it aboard the student's own ship, or give it a planet or station in Galaxy Databa?
8. **Cosmic Coding Comets:** give it a place on the station (Heart of the Learning Station) with teacher-confirmed tasks, or leave the Scratch work outside the world.
9. **The fixes in §6**, especially the Voltara supply (item 1), which the pilot needs.

---

## 8. Sources

**Student site:** [Galaxy Math Quest 2023–2024](https://sites.google.com/view/g3c-2023-space-math-quest)
- [The Universe](https://sites.google.com/view/g3c-2023-space-math-quest/the-universe)
- [Galaxy Patternox](https://sites.google.com/view/g3c-2023-space-math-quest/the-universe/galaxy-patternox) (closure notice)
- [Cosmic Coding Comets](https://sites.google.com/view/g3c-2023-space-math-quest/the-universe/cosmic-coding-comets)
- [Galaxy Numerix](https://sites.google.com/view/g3c-2023-space-math-quest/the-universe/galaxy-numerix), [Galaxy Metrica](https://sites.google.com/view/g3c-2023-space-math-quest/the-universe/galaxy-metrica), [Galaxy Geometrica](https://sites.google.com/view/g3c-2023-space-math-quest/the-universe/galaxy-geometrica), [Galaxy Databa](https://sites.google.com/view/g3c-2023-space-math-quest/the-universe/galaxy-databa)
- [Voltara Quest #1](https://sites.google.com/view/g3c-2023-space-math-quest/the-universe/galaxy-numerix/quest-1-mission-voltara-power-up-challenge) and [Task 1](https://sites.google.com/view/g3c-2023-space-math-quest/the-universe/galaxy-numerix/quest-1-mission-voltara-power-up-challenge/task-1-mission-voltara-power-up-challenge)
- [Operation Stardust](https://sites.google.com/view/g3c-2023-space-math-quest/the-universe/galaxy-databa/quest-1-operation-stardust-prepping-for-a-year-long-space-adventure)

**Google Drive**
- [Intro to background story](https://docs.google.com/document/d/1nwQvU7MI0DxV9UxrfAA0nt0fQdqbpw8DR_PmKuJRfaE/edit)
- [Space Station Info](https://docs.google.com/document/d/196w9XBERLqnXhqOe_Qz48mX57xBNBNx1WfwslUlR6jM/edit)
- [first 5 quests on Space Station](https://docs.google.com/document/d/1B0DIWre_nK32iTWOF8YfqhQk5sKw4GMy_dxP2hE9Dfg/edit)
- [tasks / strand order](https://docs.google.com/document/d/177Lw8fdJzNte6bTNe3kOcBFBFAyG_7yob2rJ9D94-s8/edit)
- [Pre-Requisite - Order of Strands](https://docs.google.com/document/d/11o56plHYtzte3_pdJ_pL-MgH8sc9MCuQmyrKPT1aSRY/edit)
- [Level 1 (Voltara city list and scenario cards)](https://docs.google.com/document/d/1MAKNhT7Gwj5AJAV8EEpD1RaFvYrnMtr1NRdqG4W05xo/edit)
- [New numbers Quest 1](https://docs.google.com/document/d/12lZQoXYVLkWMtSEKAncpkO_8J-zBCwfenvQSTe49Nmo/edit)
- [Final Boss Quest 1 Numbers](https://docs.google.com/document/d/1AyldtDUVhHYZE4G2ZM1cV2CnD63Fy-UqGoVtCQTRyfk/edit)
- [Task 2 - Galactic Trade Quest OVERVIEW](https://docs.google.com/document/d/1CmpHhsuJz6iauh76L76-HeYEfFPCMC2zMRHWK-PQsGg/edit)
- [Galaxy Geometrica Quest #1 - Stranded on Zephyron](https://docs.google.com/document/d/1hbxTR7b599Z93bx4VCAWOciAkeFWmSeK2WNUhL-2riU/edit)
- [Things to Prepare - 1st Five](https://docs.google.com/spreadsheets/d/1sKaP3i0gT2TN1zhGeJQhEfnIPgjFuvfLu-tXiSY2iD0/edit)
