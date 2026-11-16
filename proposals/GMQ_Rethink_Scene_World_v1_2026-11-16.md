# GMQ — the rethink: a world you can see and type into — v1 — 2026-11-16

**Stage:** proposal, with a playable sketch. Nothing real is built.
**Sketch:** https://claude.ai/artifact/PrDvY1EZX9tYh1sDCHJ4Xe (file: `prototypes/kis_station_sketch.html`)
**Tags:** [Source] = from your material or your words. [Proposal] = my suggestion.

---

## 1. What you asked

You said "MUD" because you did not know what was possible. You asked me to step back and find a better way. You want it visual, interactive and engaging, like the things you make now, with your constrained AI behind it.

---

## 2. What I looked at

- **Midnight at Hollow House** (the HTML file). I played it through in a browser.
- **The Survival Laws missions.** I read Missions 3 and 5 in full.
- **Your Math Skills engine** and all the GMQ material from before.
- I left the skills tracker out of the repo. It holds your current students' names and results.

---

## 3. What your 2026 work does well [Source]

These are the design rules I can see in your own work. They are the point of it.

| What you do | Example |
|---|---|
| One story, with facts from another unit | Reef facts, savanna facts |
| A picture for every question | The bar graph, the reef map, the fraction bar |
| One number in one box | Every answer box |
| Answers carry forward | 24 bats, then ¾ fly out, then tickets for the 6 that stay |
| **A final unlock that checks itself** | The hidden animal, the letter grid, the maze. A wrong answer gives nonsense, so the child goes back. |
| "Prove it!" with because, but, so | Every mission |
| A stretch question | The wildebeest |
| New words explained inside the sentence | "the attic, the room under the roof" |
| A map that fills in | Hollow House |
| Doors to choose, and more than one ending | Hollow House |
| A report for the teacher | "Show this report to your teacher." |
| Notes on what a wrong answer means | Your tracker |

**The review found four faults in the 2023 tasks: no finish line, no self-check, too much writing, and reading that was too hard. Your 2026 work fixes all four.** So the best model for the new GMQ is not a MUD. It is what you already make.

**Hollow House is already a small world.** Its rooms are data: a title, a few lines, a picture, a question, an answer and doors. The page just runs the data. That is the same idea as the place template, and it already works.

---

## 4. Why "text only" was the wrong rule

1. **Typing is slow at this age.** A New South Wales study measured a median of 9 words a minute for Year 3. A four-word command takes about half a minute. A lesson of typed commands is mostly typing.
2. **Your maths is visual.** Text cannot show an array, a clock, a graph or a map.
3. **Old text games frustrate people.** Teachers who use them report that students get stuck on what to type. An AI fixes the "wrong word" problem. It does not fix the typing speed.

**What a MUD is really for:** a world that stays, a choice of where to go, surprises, signs of other players, and something that answers whatever you try. All of that can be kept without making the child type everything.

---

## 5. The proposal: a scene world

**One rule: tap for the expected, type for the unexpected.**

### 5.1 The screen
1. **A map that fills in.** Tap a room next to you to walk there.
2. **A scene:** a picture, three short lines, and the things you can look at.
3. **One typed line.** "What do you do?" This goes to your constrained AI.

### 5.2 Four kinds of thing in a scene
| Kind | What it does | Who runs it |
|---|---|---|
| **Things to look at** | A short answer | The scene's own words, or the AI |
| **Toys** | A mini quest, a mini battle or a project helper, with a picture you can touch | Code |
| **Doors** | Open with a ship part, a finished project or a passed skill | Code |
| **Secrets** | Found only by typing an idea | The AI, with the code saving what is found |

Typing becomes the special power, not the chore. The sketch has one secret room. Only typing finds it.

### 5.3 What the AI does
- Answers anything a child types, inside the facts of that scene.
- Wraps each mini quest in a small story.
- Gives hints after a wrong answer. Never the answer.
- Later: reads a "Prove it!" sentence, replies in the story, and saves it for you.

### 5.4 What the code does
Numbers, marking, cards, locks, the map and saving. The AI never marks maths.

### 5.5 It still works when the AI is slow or down
Taps, toys, locks and cards need no AI. Only the typed line does. On a bad wifi day the class can still play.

### 5.6 Scenes are data, like Hollow House
| Hollow House field | Place template field |
|---|---|
| title | name |
| text | FACTS |
| art | (new) the picture |
| asks, answers | CHECKPOINT |
| choices | EXITS |
| ending | QUEST on finish |
| skill | strand |

- A new planet is new data. The page and the server do not change.
- You make a scene the way you make a mission now: one Claude thread, a few minutes.
- I would keep the template's labels ([AI], [CODE], [TEACHER]) and store each scene as data the page can run.

---

## 6. How a paper project joins the world [Proposal]

You said the major quests are real-life projects, and you can check a design yourself.

**Use your own unlock idea.**
1. The world gives the briefing and shows the sheet.
2. The student does the project on paper, with blocks, tiles or a map.
3. The packet ends with an unlock, as your missions do: a word, a hidden picture or a code.
4. The student types the unlock into the world. The code checks it.
5. You check the design and the "Prove it!". Then the gold card is released.

- The code checks the numbers. You check the thinking. Neither does the other's job.
- Two or three versions of a packet give different unlock words. That stops one answer spreading round the class.

---

## 7. Cards

**Decided [Source: Marc, 2026-11-16]:** a mini quest gives a random card. A major quest always gives gold. There should be set odds.

**Names.** Your card files say Common, Advanced and Epic. You said common, rare and gold. I have treated them as the same three levels. Please confirm.

**Odds.** I simulated 10,000 students for a year: 168 mini quests and 20 projects each, with a set of 130 cards (`checks/card_odds_check.py`). The set sizes and counts are my assumptions.

| Odds: common / rare / gold | Gold cards from luck in a year | Different cards owned |
|---|---|---|
| A: 80 / 17 / 3 | about 5 (most get 2 to 9) | about 97 of 130 |
| B: 70 / 25 / 5 | about 8 (most get 4 to 13) | about 99 of 130 |
| C: 60 / 30 / 10 | about 17 (most get 11 to 23) | about 98 of 130 |

- Every student also gets about 20 gold cards from projects, whatever their luck.
- So gold from projects is the floor, and gold from luck is the surprise.
- With option C, luck gives nearly as much gold as projects do. That weakens "the big quest gives the best card".
- With option A, 1 student in 200 gets no lucky gold all year.
- Nobody completes the set in a year under any option.

---

## 8. Cool things to do [Proposal]

Every idea starts from something in your own material.

### 8.1 Toys for the station
| Task | On the screen | In real life |
|---|---|---|
| 1-2 Alien Species | Tap aliens to tally them. Pull bars up to build the graph. | The printed grid |
| 1-3 Star Map | Colour stars by number. A hidden shape appears, like your hidden animal. | Painting |
| 2-1 Fuel | Tap a route. The ship flies it and the gauge drains. Only one route makes it. | The printed map |
| 2-2 Coordinates | Tap points on the grid. Lines join them into a shape. | — |
| 2-3 Cargo Load | Tap crates onto a scale. (In the sketch.) | The item cards |
| 3-1 Asteroid Field | Rows and columns of rocks. (In the sketch.) | — |
| 3-3 Shield Calibration | Drag energy into five equal sections. | Counters on a mat |
| 4-2 Ammo Count | Flick each number left for odd, right for even. | Counters |
| 4-3 Target Practice | Type your total. The code checks it against the rule. | Throwing at targets |
| 5-2 Power Allocation | A tray of blocks to drag into four systems. | The real base-ten blocks |

### 8.2 Toys for the planets
- **Voltara:** drag energy onto the city map. Lights come on in each sector. A scenario card flips and some lights go out.
- **Chronosia:** clocks with hands you turn.
- **Zephyron:** a ruler you slide across the map.
- **Xylophora:** tiles that snap together. The code counts the squares.
- **Operation Stardust:** drag food onto one shelf. An energy meter fills to 360. One table, not four.

### 8.3 Things that last (the MUD part)
- **Name your ship.** The name stays on the map. (In the sketch.)
- **Paint your bay door.** Others see the colour.
- **A station garden.** One plant each. It grows on each day you finish a mini quest.
- **Beacons.** Leave one on a planet. Others see "The Comet was here." Fixed words only, so no child reads another child's typing.
- **A class star map.** Each finished project lights one star for the whole class.

### 8.4 Things the class does together
- **The Patternox wormhole.** Your site says it is broken. It could open when the whole class has passed enough addition and subtraction mini quests. Every student helps, not only the fastest.
- **Station repair.** A meter shows how much of the station the class has fixed.

### 8.5 Secrets and surprises
- **Hidden parts.** Your intro says parts are "hidden around the station". The vent in the sketch is one.
- **A comet day.** On some days a comet passes, and mini battles give something extra.
- **A creature that follows you** if you feed it.

---

## 9. The sketch

Open it on an iPad or a phone. It takes about five minutes.

**What is real in it**
- The map, the scenes and the secret room.
- A mini battle that interrupts (Asteroid Field, multiplication).
- A mini quest you find (Top Up the Tank, addition).
- The Cargo Load project, with your own item list. The code checks both conditions.
- Random numbers for each player, card draws with odds, gold for the project, a locked door and a mission report.

**What is not real**
- The typed line knows only a few words. On your site, your AI answers it.
- Progress is saved on that device only.
- The card names are six samples from your files.

I tested it at iPad and phone size, in light and dark. It ran with no errors.

---

## 10. How it would run on your site [Proposal]

- **The page:** one HTML file, like Hollow House.
- **The scenes:** data files on the server.
- **Your PHP server, three jobs:**
  1. Send the typed line to the AI, with that scene's facts. Check the AI's reply before saving anything.
  2. Check answers and unlock words.
  3. Save each student's place, parts, cards and marks.
- **Reused from Math Skills:** the login, the forgiving answer check, and the server-side sum check.

---

## 11. What could prove this wrong

| Claim | Test |
|---|---|
| Children type when typing finds secrets | Watch five children in the sketch. Count who finds the vent. |
| Toys teach as well as paper | Give half a group the paper array task and half the screen one. Compare the next day. |
| The AI's replies arrive fast enough | Time 50 replies on school wifi. Over about 4 seconds is too slow for this age. |
| A scene takes five minutes to make | Make three with the template and time them. |

---

## 12. What this changes in the earlier documents

| Earlier | Now |
|---|---|
| "Everything is typed" | Tap for the expected, type for the unexpected |
| Novus "dead end by default" | Most things answer back. Secrets reward typing. |
| Big quests moved onto the screen | Projects stay real. The world frames them. |
| Places written as text files | Scenes as data, with a picture |
| The AI in every turn | The AI on the typed line only |
| Pilot Voltara | Pilot the station, starting from the sketch |

---

## 13. Decisions

**Decided by you (2026-11-16)**
1. The three layers: explore, mini quests, projects. Yes.
2. You check the designs yourself.
3. Locks: whatever works best. I will use the table in `GMQ_Three_Layers_and_Locks_v1`.
4. No teacher key.
5. A major quest gives gold. Mini quests give a random card, with set odds.

**Still open**
1. Is "tap for the expected, type for the unexpected" the right rule?
2. The odds: A, B, C or your own.
3. Are common, rare and gold the same as Common, Advanced and Epic?
4. Which ideas in §8 do you want? Which are wrong for your class?
5. Should the station be the first thing built?
