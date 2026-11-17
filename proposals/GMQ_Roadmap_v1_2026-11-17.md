# GMQ — the whole game: what exists, what is missing, what comes next — v1 — 2026-11-17

**Stage:** a plan. Section 6 lists what I built the same night.
**Why this file:** you asked, "Do you have them all outlined? What are all the different things we need to do?" [Source: Marc, 2026-11-17]
**Tags:** [Source] = from your material or your words. [Proposal] = my suggestion. [Conflict] = your sources disagree.
**How I made it:** I re-read the design files, all 33 task reviews, every earlier proposal and the sketch's code.

---

## 1. The short version

- **The game has twelve parts.** Section 2 lists them.
- **Three parts are well on:** the station, Voltara, and the things that help children play (the number pad, the reading cards, kind words).
- **Two big parts had not started when I wrote this plan:** the AI that runs the world, and the server that remembers it. Each now has a first version, made the same night. Neither has run on your site, and the AI has never answered a real child.
- **That matters most.** Your foundation is: the AI keeps its full mind inside a defined world, and code holds the facts. Until tonight I had built only the code half.
- **The sketch is still worth it.** It settles what the world is, what the maths is and what the rules are. The AI and the server need exactly that to stand on.
- **Only one child has played it.** Your daughter. Every "it works" in my reports means "a test passes", not "children enjoy it".

---

## 2. The twelve parts of the game

| # | Part | Where it stands | Next step |
|---|---|---|---|
| 1 | **The station** (the ship check) | Built: 9 rooms, 15 tasks, 5 ship parts, 18 secrets, 4 real-life tasks with your codes | Play it with children |
| 2 | **Space** (the map between places) | Built: 5 galaxies, flying, Voltara from orbit, and **Galactic Trade** (new tonight). Nothing happens on the way between galaxies yet. | Small events on the way |
| 3 | **Planets** (the big quests) | 1 built: Voltara. 4 more have your material. See section 3. | The next planet |
| 4 | **Small maths moments** (mini quests and mini battles) | 5 are staged inside the station and Voltara. A set of 14 is written, not built. | Decide if you still want them. See 5.4. |
| 5 | **Cards** | Built in the sketch: a card for each task, a gold card for a big quest. The real card set is not chosen. | Your decision. See 5.2. |
| 6 | **Battles** | Not built. The rules are yours. Students can battle with printed cards now. | Yours to say when |
| 7 | **The AI that runs the world** | A constraint file exists as a draft (version 0.3). It has never been run against a real model. **New tonight:** the server can call it, and checks every reply. It is switched off until you add a key. | You read the constraint file. Then try it yourself. |
| 8 | **The server** (logins, saving, your codes) | **New tonight:** a first version, tested on my machine only. Not on your site. | You decide where it runs. See 5.1. |
| 9 | **Your tools as the teacher** | Built: shortcuts, the codes, a log of what a student did, the reading-card switch. **New tonight:** a class view page, with the server. | Try it on your own computer |
| 10 | **Real-life tasks** | Built: 5 code-locked tasks. **New tonight:** sheets to print, in `GMQ_Real_Life_Task_Sheets_v1_2026-11-17.md`. | You check the sheets |
| 11 | **Helps for young readers** | Built: reading cards, the number pad, kind words, maths words with meanings. Paused by you: reading levels. | Watch children use them |
| 12 | **Pictures and sound** | Built: drawn by code. No painted art. Simple beeps. | Your decision. See 5.6. |

---

## 3. The planets

Your site and Drive hold five galaxies. [Source] This is what is in them.

| Galaxy | Planet and quest | Your material | My review found | State |
|---|---|---|---|---|
| **Numerix** (numbers) | **Voltara**, Task 1: the Energy Council | full, ran in class | too long as written | **Built**, rebuilt with your "values" idea |
| | **Voltara**, Task 2: Galactic Trade. It is set **in space**: "We've just left Planet Voltara". | full, ran in class | good rounding work. Several chance cards are broken. | **Built tonight.** See section 6. |
| | Voltara, the Final Boss | two versions [Conflict] | totals reach 10,800, money can go below zero | not started |
| **Metrica** (measuring) | **Chronosia**: four time tasks | full, printed, with videos | the best material you have. No wrong sums. | **designed tonight, not built.** My pick for the next planet. |
| | Xylophora: area | only Task 1 has materials | 3 of 4 tasks need redoing | not started |
| **Geometrica** (shapes) | Zephyron: maps and scale | 3 full tasks on A3 maps | the scale needs decimals. The maps may be someone else's art. | not started |
| **Databa** (data) | Operation Stardust, on the ship | 6 lessons, ran | you said it was too long | not started. Your Atlantis project is a better model for it. |
| **Patternox** (patterns) | closed: "the wormhole is broken" | drafts only | it opens after "Numbers Quest 2", which does not exist [Conflict] | not started |

**Never built, plans only:** Multiplo-Planet, Planet Lengthar, Geometria. [Source]

**Why Chronosia next [Proposal]:**
- It is your most complete quest. Four tasks, printed, with videos.
- Its numbers are right. I found no wrong arithmetic.
- It needs nothing on a table, so it is a fair test of a planet that is mostly on screen.
- Time is a good home for "your decision must matter". A day has only so many hours.

**What it needs fixed first:** one clock that reads two ways in two prints, 24-hour time (your decision), two questions with tied answers, and Task 4, which is mostly reading and has no answer key.

---

## 4. How the parts join, and the order I would build in

```
   the world's facts          the AI                    the server
   (places, things,    -->    (answers what a child     (who you are, where you are,
    rules, numbers)            types, in the world's     what you have, your codes,
                               voice, inside the rules)  what the class has done)
        ^                          |                          |
        |                          v                          v
   the sketch (built)  <--- the child's screen --->   your teacher view
```

- **The sketch is the left box and the middle screen.** It holds the facts and shows them.
- **The AI has one job the sketch cannot do:** answer anything a child types. Now the sketch says "You do not see that here."
- **The server has one job the sketch cannot do:** remember. A child's game should follow them from the class iPad to home, and you should see the whole class.

**The order [Proposal], and why:**

| Step | What | Why this order |
|---|---|---|
| 1 | **Space: Galactic Trade, and something on the way** | It joins the station and Voltara to the rest. It is your own material. A child can see it tomorrow. |
| 2 | **A first server** | Everything after this needs it: saving, your codes, approving ship names, the class view, the AI. |
| 3 | **The AI, connected** | It needs the server to keep its key safe. It is your foundation, and it is the part with the most unknowns. |
| 4 | **Chronosia** | A second planet shows whether Voltara's way of building can be repeated. |
| 5 | **Children play it** | Before a third planet. What they do will change the plan. |
| 6 | **Cards and battles** | After you choose the card set. |

**What I would not do yet:** 3-D flight, painted art, more maths skills, reading levels. Each is real work and none is blocking.

---

## 5. What only you can decide

In order of how much each one holds up.

### 5.1 The AI and the server
1. **Where does it run?** Your Math Skills engine runs on your own site in PHP, with student files and a login. I have built the first GMQ server the same way, so it can sit beside it. Is that right?
2. **How do students log in?** A class code and a name? The same logins as Math Skills?
3. **Class only, or at home too?**

### 5.2 Cards
4. **Which card set is the real one?** Four versions disagree. [Conflict]
5. **The odds.** The sketch uses 70 common, 25 rare, 5 gold. That is my guess.

### 5.3 The world
6. **What opens what?** You said "whatever works best". Now everything opens after the station, and Patternox is closed. Options: all five ship parts to leave (built), or each part opens something.
7. **Voltara while you are away:** does it stay as you left it (built), or does it change by itself?
8. **24-hour time on Chronosia:** yes or no?

### 5.4 Small maths moments
9. **Do you still want the set of 14 mini quests and mini battles?** You said later that the skills engine was "too much". I have built only the ones that sit naturally in a place. I would keep it that way.

### 5.5 Real life
10. **The printed sheets for the five real-life tasks** are made. Are the checks on them the ones you would use?

### 5.6 Pictures
11. **Painted art, or the drawn look as it is?**

### 5.7 Still open from before
- The Factory on Voltara: does it use energy and give more back (built), or only make it?
- Cargo Load: 6 items or 7? [Conflict]
- Zephyron's maps: are they your art?
- Which tasks did your class love? I have never had an answer, and it would help me most.

---

## 6. What I built the same night

| What | Where to look | Checked by |
|---|---|---|
| **Galactic Trade.** Your Voltara Task 2, in space: a star map with distance rings, scanning planets by rounding, three trips, paying for fuel. | In the sketch: Teacher bar, **Go to space**, then the trade beacon. Guide: `GMQ_Galactic_Trade_Guide_v1_2026-11-17.md` | `galactic_trade_check.py`, `galactic_trade_test.js` |
| **A first world server.** Logins, a game that follows the cadet to any device, your codes kept on the server, ship names that wait for you, a class view, and the AI behind a reply check. | `engines/gmq-world/server/`. Start with its `README.md`. | `world_server_test.js`, `world_online_test.js` |
| **The game page can talk to that server.** With no server, as on the sketch's own link, it plays exactly as before. | the sketch | `world_online_test.js` |
| **A fault found and fixed:** a page reloaded within a second of an action could lose the saved game. The game is now saved in two places on the device. | the sketch | found by `galactic_trade_test.js` |
| **Chronosia, designed.** Not built. Your Tasks 1 and 2 kept, and a "quake day" with decisions that matter. | `GMQ_Chronosia_Quest_Design_v1_2026-11-17.md` | `chronosia_quest_design_check.py` |
| **The other galaxies name their planets** when you fly to them. | the sketch | — |
| **Sheets to print** for the five real-life tasks, with a page for you. | `GMQ_Real_Life_Task_Sheets_v1_2026-11-17.md` | — |

**What I did not get to:**
- Small events on the way between galaxies. Galactic Trade is the one thing to do in space so far. I held back on purpose: you said the skills engine was "too much", and a pop-up sum in mid-flight is close to that. Tell me if you want them.
- Any work on battles or cards. Those wait for your decisions.

**What is still true after tonight:**
- The server has only run on my machine. You decide if and when it goes on your site.
- The AI has still never answered a real child. The server's stand-in AI proves the checks work, not that the constraint file works.
- The page still marks the maths, even when the server is there.

---

## 7. What could prove this plan wrong

| Claim | Test |
|---|---|
| The AI is the biggest gap | Watch a child type something the game does not know. If they shrug and tap on, the gap is small. If they stop, it is big. |
| Chronosia is the right next planet | Ask your class which quest they remember. If nobody names Chronosia, pick the one they do name. |
| The server should come before the AI | If you would rather see the AI talk first, it can run from your own computer for a trial. That is quicker and less safe. |
| Children will read now | Your daughter, with the reading cards on. |
| One planet can be built on the pattern of another | Chronosia. If it takes as long as Voltara did, the pattern is not a pattern yet. |
