# Handoff — Galaxy Math Quest World — 2026-11-16

**Stage:** design. Nothing has been built.
**Builds on:** `MUD_World_Handoff_2026-11-15.md` (the persistent text world). Read that file for the three-layer design, hosting and cost. This file applies it to Galaxy Math Quest and records what has been decided since.
**Version 8 (2026-11-16):** adds Marc's battle rules (§7.2) and the rule of one card per finished task. Battles stay a later stage; the main work is the world (§5, §6, §10).
**Read this first:** §2 is what Marc decided. Everything marked **Proposal** is not decided. Don't treat a proposal as a decision.

---

## 0. Context

- **Who:** Marc teaches Grade 3 at KIS International School in Bangkok. He builds AI engines on constraint architectures: a constraint file that defines the AI's whole reality, a small PHP API and a web page.
- **Where engines run:** tools.constraintlayer.ai, a VPS at `129.121.98.193` (AlmaLinux, nginx, PHP 8.0). Marc uploads with PowerShell, `ssh` and `scp`. The Claude Project "Engines And constraints" holds every engine's current files.
- **Galaxy Math Quest (GMQ):** Marc built it and ran it with his Grade 3 class in 2023–24. It turns the Grade 3 math curriculum into a space adventure:
  - Students first repair their ship on the Space Station: 15 tasks, three for each of five ship parts.
  - Then they take quests on planets in five galaxies.
  - Finished tasks earn collectible cards, and students battle each other with them.
  - His Edutopia draft reports an average gain of 1.4 grade levels on IXL across 20 students after seven months.
- **Devices:** students use their own iPads in class, so all typing happens on an on-screen keyboard.
- **Materials:** the Google Drive folder "Galaxy Math Quest" and the student site (Google Sites). Several card files sit in other Drive folders. Links are in §12.

---

## 1. What Marc wants

- Apply the persistent-world idea to GMQ. "We build these worlds. Pre-build them. Make them real. Explore them. And do the sorts of quests I wanted. And get cards. And maybe even battle each other. Online or in real life."

---

## 2. Decisions

1. **Battles are a reward, not math practice.** The math happens in the quests.
2. **The battle rules are Marc's.** They worked well in his class. §7.2 records them from his descriptions on 2026-11-15 and 2026-11-16, and lists the details still open.
3. **Battles are a later stage.** The world and the quests are built first. Until the battle rules are written down, students battle in person with printed cards.
4. **One master world, with a separate copy for each class.** Claude proposed this and Marc agreed (§5.1).
5. **Physical tasks are placed by what the hands-on part is for**, in three groups (§6). Claude proposed this and Marc agreed. The task-by-task placement in §6 is Claude's proposal, and Marc should confirm each line.
6. **Every task a student finishes earns one card draw** (Marc, 2026-11-16).

---

## 3. Open decisions

**Needed before any quest can award cards:**
1. **The official card set.** Four versions exist and conflict (§7.1).
2. **Rarity levels and draw odds.** The files use Common, Advanced and Epic (C, A, E), but no draw odds were found.
3. **Official ship-part stats.** Two documents give different numbers (§8).

**Needed before the first build:**
4. **Counter tasks (1-1, 4-2).** Every bag holds the same counts, so every student gets the same code. Make 3–4 bag versions and have the world assign one per student, or accept that the code will spread.
5. **How students give checkpoint answers** (§5.3).
6. **The pilot quest** (§10).
7. **Student login.** Options: a teacher-given name plus a password, as in Math Skills, or something else. A class copy opens with a teacher password, as Word Web rooms do.
8. **When and where students play:** in class only, or at home too. This is MUD handoff §2, question 2.
9. **Whether to run a nightly "world director"** (MUD handoff §5.2). GMQ's scenario cards may cover that role.
10. **Hosting** (MUD handoff §7).

**Later stage (battles):** see "Still open" in §7.2.

**MUD handoff §2 questions now answered:**
- Purpose: Grade 3 math curriculum practice, with cards and battles as motivation.
- World size: one master world plus class copies.

---

## 4. How Marc works

Everything in MUD handoff §3 applies: work from the constraint architecture, reason from his goals, answer his questions first, don't make his decisions, and deliver .md files plus a zip. In addition:
- **Battle rules are his.** Write down what he describes. Don't redesign them, and don't borrow features from Pokémon or other games that he didn't specify.
- **Check every answer key before it enters the world.** The AI-written keys in his Drive contain errors (§8).

---

## 5. Proposed design (not decided except §5.1)

### 5.1 Four parts

1. **Master world** (written once, students can't change it). **Agreed.**
   - **Places:** the Space Station (the hub, with five ship-part bays), the galaxies and their planets.
   - **Each place:** a written description and a fixed list of features.
   - **Each quest:** its tasks, checkpoints, answer checks and the formula that generates each student's numbers.
   - **Unlock rules:** which ship parts and finished quests open which places.
   - **Authorship:** Marc writes it with AI help before students arrive. A fix to a quest reaches every class.
2. **Class copy** (one per class). **Agreed.**
   - **Created by:** the teacher, with a password. Precedent: Word Web rooms in `api-swi.php`.
   - **Holds:** student accounts, each student's location, quest progress, ship parts and levels, and card collection (card numbers only). It also holds everything students change and leave behind, and, later, battle records.
   - **Reset:** each school year.
   - **Visibility:** students see traces from their own class only.
3. **The world's laws (a constraint file).** Proposal: adapt Novus v3.4.
   - **Keep:**
     - the MUD-style exploration
     - "Discovery Through Action, Not Menu"
     - the grade-adaptive language (Reading Level 3–4: at most 10 words per sentence, basic commands; for Grades 3–5 the prompt adds "You could look around, touch something…")
     - the reality lock
     - the debug mode
   - **Remove:**
     - "No two playthroughs use same planets"
     - generating galaxies and planets fresh for each playthrough
     - The world is pre-built.
   - **Change:** "Dead-end by default" applies to ambient areas only (§5.2).
   - **Add:**
     - The AI describes only what the master world and the class copy contain.
     - Something becomes permanent only through a saved write: a student's action, or the director if Marc adds one. Narration alone never makes anything permanent.
     - The AI never marks math, never awards rewards and never names a card a student receives.
     - The AI never shows a student another student's numbers or answers.
     - The AI never corrects spelling. (This is the Math Skills rule, and it matters because Grade 3 students type on iPads.)
4. **Server code**
   - It picks the slice of the world sent with each typed action (MUD handoff §5.1).
   - It checks every checkpoint, grants every reward and draws every card.
   - It checks the AI's tagged changes against the rules before saving them.

### 5.2 Two kinds of place (proposal)

- **Quest locations:** written by hand, fixed, and always reachable once unlocked. The Novus dead-end rule does not apply here.
- **Ambient areas:** Novus-style exploration. Dead ends and false leads are allowed.
- **Why:** Novus makes most things dead ends and adds 3–4 false leads for every real discovery. Applied everywhere, that would hide the quests students must reach.

### 5.3 Checkpoints (proposal)

The server always knows the right answer, because it generated the student's numbers. The AI is never the source of an answer.

| Kind | Used for | How it is checked |
|---|---|---|
| One answer | fuel totals, clock times, place value | The server computes the answer from the student's numbers and compares. |
| Conditions | tasks with many right answers: the Galactic Fair budget, trade routes, cargo load | The server checks written conditions, such as "three amounts, each a multiple of 10, totalling exactly 1,000" or "exactly 6 items totalling exactly 30 tons". |
| Hands-on result | group B in §6 | The world gives the student their numbers, the student works with real materials, then types the result. The server compares. |
| Teacher-confirmed | group C in §6 | The teacher marks the task complete. |

**Open (§3, item 5):** the AI can misread a typed answer when it turns it into a tag. Two ways to close that gap:
- **(a)** The server repeats the answer back before checking it: "You entered 400, 350 and 250. Is that your plan?"
- **(b)** Answers go in a separate answer line on the page.

Either way, everything stays typed.

### 5.4 Each student gets their own numbers (proposal)

- **Places are shared; numbers are not.** Each checkpoint gives each student different numbers from a seed. Precedent: Math Skills seeds every session.
- **Traces never carry answer values,** and the AI never sees another student's numbers.
- **Why:** the Engine Core counters (9 red, 8 blue, 4 green, 9 yellow) make the code 9849. One note left in the world would end that task for every student who comes after.

### 5.5 Rewards (the first line is decided; the rest is proposal, following how GMQ already worked)

- **Each finished task:** one card, drawn at random from the official set with the official odds. **Decided by Marc (2026-11-16).** The task intros already end with "Share your work to get a new card."
- **Each ship part:** earned by finishing its three Space Station tasks.
- **Upgrades:** come from galaxy quests. Voltara ends with "upgrade your power module", and Level 2 upgrade cards already exist ("upgrade to level 2.pdf").
- **Special rewards:** for example, the Lucky Draw ship part for the Voltara student with the most Galactic Gems.
- **Code grants every reward.** The AI only narrates it.
- **Collections store card numbers only.** Card text lives in one card list, so a later edit (for example, when the battle rules are written) reaches every copy students already own.

### 5.6 Ship parts as tools (proposal)

- This is the MUD handoff's "tools open new actions." For example, a ship with no Navigation System can't leave the station.
- Which part opens which place is Marc's decision.
- The "Pre-Requisite - Order of Strands" document already gives an order for the quests.

---

## 6. Physical tasks: where each one goes (proposal, confirm each line)

**Groups (agreed):**
- **A, into the world:** paper was only the way the task reached students. These tasks are numbers already, and per-student numbers are easy.
- **B, hands-on:** handling the materials is the learning. The world gives the numbers, the student works with real materials, and the result is typed back in.
- **C, classroom event:** movement or art for its own sake. It stays outside the world, and the teacher marks it done.

**Space Station**

| Task | What students do now | Group | Note |
|---|---|---|---|
| 1-1 Alien Artifacts | Count coloured counters and turn the counts into a code | B | Same counts in every bag (§3, item 4) |
| 1-2 Alien Species | Count aliens on a printed grid and draw a bar graph | B | Counts can be checked; the graph is teacher-confirmed or photographed |
| 1-3 Star Map | Paint a star map and make a key | C | |
| 2-1 Fuel Calculation | Track fuel along paths with refuel stops | A | Planning draft has an error (§8) |
| 2-2 Coordinate Plotting | Solve problems to find coordinates | A | Needs a grid in the simple display |
| 2-3 Cargo Load | Choose 6 of 11 items totalling exactly 30 tons | A | Conditions checkpoint |
| 3-1 Asteroid Field | Rows × columns, and safe paths by division | A | |
| 3-2 Energy Grid | Multiplication and division for shield energy | A | |
| 3-3 Shield Calibration | Repeated addition and skip counting | A | |
| 4-1 Weapons Coding | Keep only the all-odd sequence cards and order the code | A | Use the "Card Codes" version (§8) |
| 4-2 Ammo Count | Coloured counters, odd and even | B | Same counts in every bag |
| 4-3 Target Practice | Throw at numbered targets | C | |
| 5-1 Circuit Connection | Connect place-value parts of a number | A | |
| 5-2 Power Allocation | Split a total with base-ten blocks | B | Each student gets a different total |
| 5-3 Emergency Power | Regroup the power under new limits | B | Each student gets different numbers |

**Galaxy quests**

| Quest | Group | Note |
|---|---|---|
| Numerix, Planet Voltara (Energy Council, Galactic Trade, Final Boss) | A | Scenario cards drawn by the server |
| Metrica, Chronosia (clock tower, time-quake data, timetable, plan a day) | A | |
| Metrica, Xylophora (tile buildings, alien-skin resources, roofs, colony design) | B | Magnetic tiles; area problems in §8 |
| Geometrica, Zephyron (map scale with a ruler, coordinates, supply missions) | B | Printed map and ruler; the answer is a city name; distance conflict in §8 |
| Databa, Operation Stardust (food lists and plans, bar and line graphs) | A, plus B or C for drawn graphs | Mixed |
| Patternox, Cosmic Coding Comets | not placed | Not reviewed in this thread |

---

## 7. Cards and battles (later stage)

### 7.1 Card set: pick one before quests award cards

Four versions exist:

| Version | Where | What changed |
|---|---|---|
| Original, July–August 2023, about 130 cards | "Booster Cards" doc, Cards.csv, Booster Cards.pdf | Flat effects such as "Inflict 6 HP damage". The doc includes notes on which Common cards are too strong. |
| Booster 2, August 2023 | "Booster 2" doc | Effects scale with ship-part level, such as "+3 per level of 'Weapons System'" |
| November 2023 deck | FINAL DECK NOVEMBER CARDS DECK.pdf, Booster Cards - November sheet; also Galaxy Math quest Policeman.pdf (January 2024) | Adds SPY cards. The separate Policeman print adds SECURITY "Stop the Spy" cards. Marc's rules for both are in §7.2. |
| January 2024 print | GMQ Cards Print - january.pdf | Attacks become "Add +X to your AP for this attack"; defences add HP to the Ship Shield or block attacks. This matches the battle board and is the easiest version to code. |

**Conflicts the official set must remove:**
- **The same number is used for different cards in different versions.** 131–134 are Epic cards in the original doc and Common cards in Booster 2. 135, 146, 150, 151 and 153 are different cards in Booster 2 and in the January print.
- **The same name is used for different cards:**
  - Laser Cannon is #2 and #48.
  - Stealth Mode is #42 (Common) and #90 (Advanced).
  - Booster 2 lists Quantum Quell, Void Vortex and Asteroid Assault twice each, with different effects.
  - Nebula Nova is an Epic heal-and-damage card (#131) in the original and an Advanced attack card in Booster 2.

The official set needs one number, one name and one effect for each card.

### 7.2 Battle rules (Marc's, recorded 2026-11-15 and 2026-11-16)

Marc gave these rules by voice, and they are written here as he described them. Anything marked **open** was not answered, or the transcript was unclear.

**Two kinds of battle**
- **Fun battle:** played for fun, with nothing at stake.
- **Challenge battle:** something is at stake. Marc's current thinking (2026-11-16): each player puts up a gold card, and the winner takes the loser's. Earlier he described the prize as one of the loser's cards, drawn at random. Not final. A battle nobody wins moves no card.

**Setup**
- **Deck:** each player builds a deck from their own card collection, with no limit on its size or make-up (Marc, 2026-11-16). Spy and Policeman cards can be included. Marc also said "one gold card, two rare cards, and all the rest common". Since there's no deck limit, that probably describes how a student's cards are drawn. **Open:** confirm.
- **Hand limit:** 5 cards, rising as students level up their ship parts. **Open (Marc will say later):** whether it is set by the Engine Core level, with the "Engine Cores" doc's numbers: 6 at Level 3, 7 at Level 6 and 8 at Level 10.
- **Starting hand:** each player starts with a full hand, as many cards as their hand limit allows.
- **Main Shield:** every player starts with 80 HP (Marc, 2026-11-16). Shield cards can rebuild a broken shield when the card says so.

A **round** is both players playing a card. A card that says "for the next 2 turns" lasts 2 rounds.

**Each round**
1. The leading player plays one card from their hand.
2. The other player sees it and plays one card in response.
3. Both cards' effects go live.
4. Both ships attack, every round. A ship's attack is its AP, the sum of the AP of all its ship parts, plus any attack bonus from the card it played. Bonus cards either add to the attack or defend against certain attacks.
5. Played cards go to the bottom of their player's deck, so nobody ever runs out of cards.
6. Each player draws one card, up to their hand limit.
7. The other player leads the next round.

**Cards that can't be used:** each player plays a card every round, even one they can't use, such as an attack card after losing Weapons. Nothing happens, and the card goes to the bottom of the deck like any other. So a hand never jams, and every card in a deck keeps coming round (Marc, 2026-11-16).

**Damage**
- **Shield first:** attacks hit the Main Shield first. The shield blocks everything except Spy cards.
- **No carry-over from the shield:** if an attack is bigger than what is left of the shield, the shield breaks and absorbs the whole attack. Nothing carries through to the ship parts that round.
- **Defender splits damage to parts:** once the shield is gone, attacks hit the ship parts, and the defender decides how to split the damage across them.
  - An 80-point attack can be split 16 to each of five parts, so all five survive.
  - Or the whole 80 can go onto one part with 5 HP left. That part is destroyed and the other 75 points are lost.
  - Marc treats this split as a math and logic skill for the defender.
  - Choosing which part to lose is strategy. Losing a part costs the player the ability to play one kind of card: heal (HP) cards, defense cards or attack cards.
  - **Losing Weapons means the ship cannot attack at all:** no AP attack and no attack cards (Marc, 2026-11-16).
- **Destroyed parts:** a part keeps its full AP until it is destroyed. A destroyed part adds 0 AP and triggers its penalty on the battle board.
- **Revival:** some cards bring a destroyed part back by moving HP or adding HP. A revived part gets its AP back, and its board penalty ends.

**Spy and Policeman**
- **Spy cards are sabotage** and get past the shield.
- **When:** a Spy can be played only in a round you lead, so the other player always has the chance to answer with a Policeman.
- **Policeman:** it has one job, which is to cancel the Spy. Playing it uses the responding player's card for that round.
- **Targets:** the Spy's owner chooses which parts the Spy hits (Marc, 2026-11-16).
- **After losing Weapons:** a Spy still works after its owner has lost Weapons (Marc, 2026-11-16).
- **Spy acts first:** if the other player doesn't answer with a Policeman, the Spy acts before anything else in the round. If it destroys the other player's Weapons, that player's ship can't attack that round, and any attack card they played does nothing (Marc, 2026-11-16).

**End**
- **Win:** play continues until one ship is destroyed, which means all five of its parts are at 0.
- **Nobody wins:** as soon as it is impossible for either player to win, the battle is over (Marc, 2026-11-16).
  - **In practice:** both ships have lost Weapons, so neither can attack. Play continues while either player could still draw a Spy card, which works without Weapons, or a card that brings their Weapons back. If neither player has one, the battle ends.
  - **The test in code:** both ships have lost Weapons, and neither player's whole deck (hand and draw pile together) holds a Spy card or a Weapons-revival card that the player is still able to play. The test also depends on open item 2: which lost part blocks which cards.

**Still open (Marc will answer the battle details later; battles are a later stage)**
1. The hand limit by level (see Setup).
2. **Which lost part stops which kind of card.** Weapons at 0 means the ship cannot attack at all (confirmed by Marc). The rest of the board, read as text, probably says: Shield Generator, cannot defend; Power Module, cannot heal; Engine Core and Navigation, lose 1 card in hand. Marc should confirm.
   - **Added 2026-11-19:** Marc sent the board as a PDF. It says exactly that, word for word [Source: `reference/marc-2026/5_Card_Battle/Battle_Game_Board.pdf`]. Still open: whether the board is current (the Canva design is dated June 2024, his voice rules November 2026); whether "lose 1 card in hand" is one card at that moment or a smaller hand for the rest of the battle; whether "cannot defend" stops defence cards only or the Main Shield too. See `proposals/GMQ_Card_Battle_What_Is_Known_v1_2026-11-19.md`.
3. **Challenge battles:**
    - What is the final stake: a gold card from each player, or one of the loser's cards drawn at random?
    - Can a student with no gold card take part?
    - Do both players have to agree before a challenge battle starts?
4. Does "one gold card, two rare cards, and all the rest common" describe how a student's cards are drawn? (See Setup.)
5. Effects that need exact wording, such as "Reverse the last turn", "Take a random card from your enemy's hand and play it now" and "Swap one of your ship parts (including HP and AP) with one of the opponent's ship parts".

**What these rules mean for the build (analysis, not decisions)**
- **Battle length:** a shield absorbs the whole attack that breaks it, and a destroyed part absorbs the rest of its attack. So once the shield is down, a defender can lose as little as one part per round. A ship lasts at least the rounds needed to break its shield plus five more, unless Spy cards hit several parts in one round. Revival cards add more. **Checked:** with printed cards in class, a battle took 5–6 minutes, 10 at most (Marc).
- **Online play:** once a shield is down, each round also needs each defender's split before the next round starts. That is up to four saved moves per round: the lead card, the response card and two splits.
  - Played live in class, with both students on their iPads at once, a battle should take about as long as the card version.
  - Played across separate sittings, the same battle stretches over several sittings.
- **Spies:** they are the only cards where the attacker chooses which enemy part gets hit, so they are the main threat to Weapons, and the Policeman is the only answer. Because a Spy acts first, a Spy that destroys Weapons also cancels that player's attack in the same round.
- **Code checks:** the defender's split is the only arithmetic a player does in a battle. The server checks that the split adds up to the attack and names only parts that are still working. Everything else in a battle is calculated by code.

### 7.3 Balance (proposal)

- **Risk:** the students who finish the most quests get the biggest and strongest decks and win most battles. That works against the students GMQ was built to pull in.
- **Proposed fixes:**
  - A fixed deck size and a cap on Epic cards per deck: not adopted, because Marc chose no deck limit (2026-11-16).
  - card draws that stay random. The Edutopia draft says lucky Epic draws are what turned around a reluctant student.
- **Still unaddressed:**
  - Levelling up compounds. Higher part levels raise the attack, because the attack is the sum of the parts' AP, and they also raise the hand limit.
  - Challenge battles move cards from losers to winners, which adds to it. A student who loses many challenges sees their collection shrink.
- **Possible limits on challenge battles, all Marc's choice:**
  - both players agree before each challenge
  - the teacher can switch challenge battles off for a class
  - a student can't lose cards below a minimum deck size
- **Record-keeping:** the code records every card that changes hands, with both students' names and the date, so the teacher can settle disputes.
- **Check:** did the strongest math students dominate the 2023–24 battles? Did challenge battles leave some students with very few cards?

### 7.4 Until battles are built

- **In person:** students battle with printed cards. The world exports each class's collections as a CSV in the format of Marc's existing card files (`name,effect,type,number,color,image`), so his print merge still works.
- **Online, later:** battles are turn-based, and each card played is one saved move, so the two students don't have to be online together. This fits the MUD handoff's design, where the page checks for updates every few seconds.
- **Who runs battles:** the code, using the written rules. The AI may narrate.

---

## 8. Known errors in the existing GMQ material

Fix each one before that content goes into the master world.

| Where | Problem |
|---|---|
| 2-1 fuel planning draft ("2-1 - not done") | It says Paths B and E run out of fuel. In fact B ends with 45 and E with exactly 0. (The printed refueling map has different numbers.) |
| "4-1 not done" key | It counts cards 6 (2, 3, 5, 7, 11) and 10 (1, 2, 3, 4, 5) as all odd. The later "Card Codes" doc is correct: the all-odd cards are 1, 4, 5, 8 and 9. |
| Xylophora area task | Triangle areas need ½ × base × height, or decimals (half a square is 12.5 m²). Both are above Grade 3. The calculation sheet says "meters" where it should say "square meters". |
| Zephyron | The quest page says the city is 200 km away. The task says 600 km, and the map file is "World Map - Crash - 600km". |
| Ship-part stats | "Engine Cores" gives Standard Reactor HP 10, AP 10. "ship parts" gives HP 20, AP 5. Other reactors differ too. |
| Numbers final boss ("Decision Matrix" draft) | Weighted percentages and decimal scores, far above Grade 3. The print list for the final boss names different sheets: Distance Data, Colony Needs, Profit/Loss. |
| Card versions | See §7.1. |

---

## 9. Corrections to the MUD handoff

These were checked against the project sources on 2026-11-15.

1. **§5.2 privacy line.** It says students use "a nickname and a class code, the way the math-skills login works". Math Skills (login v1.1, api v1.1) actually uses the name the teacher gives (for example "sam-k") plus a password the student picks. There is no class code, and nothing prevents real names.
2. **§0 model.** It says the model is `deepseek-flash`. That holds for Explorer and Word Web only. Novus, the proposed starting point, runs through `api.php`'s default path on `deepseek-v4-pro`. That path sends no thinking setting, which DeepSeek's docs say means thinking at high effort. The §6 cost estimate holds only if the new engine sets `deepseek-flash` explicitly. On the default path, Pro costs 4.4 times as much on uncached input and 3.3 times as much on output.
3. **§6 cost table.** The high-thinking column assumes thinking tokens are billed at the output rate. Project State §4 requires that assumption to be labelled INFERRED.
4. **Student data location (from Project State §5).** Student files and logs sit inside the web-served folder, and whether a browser can reach them has not been checked. A world that stores student accounts should keep its data above the web root, as the `api-swi.php` header recommends.

---

## 10. Proposed first build (not decided)

- **Pilot one quest end to end** in one class copy before writing the rest of the world.
- **Candidate: Voltara (Numerix Quest 1).**
  - It is all numbers.
  - It already has scenario cards, which the server would draw.
  - Its reward is set (a Power Module upgrade, plus a Lucky Draw part for the student with the most gems).
  - It ran in class.
  - It would test per-student numbers, conditions checkpoints, random events, rewards and class-copy saving.
- **Alternative: the Engine Core tasks (1-1 to 1-3).** They are the real start of the game, but they are mostly hands-on, so they would test group B and the counters problem instead.

---

## 11. Checks before any build

1. Run `php -m` on the VPS to confirm SQLite is available to PHP (MUD handoff §8).
2. Get Marc's decisions on §3, items 1–3, before writing any reward code.
3. Get Marc's confirmation of the §6 placements for the pilot quest.
4. Fix the §8 errors that affect the pilot quest.
5. Confirm student data will sit outside the web root (§9, item 4).
6. Set the model explicitly in the new API, and re-check DeepSeek's pricing page before relying on the cost estimate.

---

## 12. Sources

**Google Drive (Marc's account)**
- [Galaxy Math Quest folder](https://drive.google.com/drive/folders/1DV4iuNnVx-u_9t4Ry1yduMzHRL0nQwj2)
- [Intro to background story](https://docs.google.com/document/d/1nwQvU7MI0DxV9UxrfAA0nt0fQdqbpw8DR_PmKuJRfaE/edit)
- [first 5 quests on Space Station](https://docs.google.com/document/d/1B0DIWre_nK32iTWOF8YfqhQk5sKw4GMy_dxP2hE9Dfg/edit)
- [Space Station Info](https://docs.google.com/document/d/196w9XBERLqnXhqOe_Qz48mX57xBNBNx1WfwslUlR6jM/edit)
- [Things to Prepare - 1st Five](https://docs.google.com/spreadsheets/d/1sKaP3i0gT2TN1zhGeJQhEfnIPgjFuvfLu-tXiSY2iD0/edit)
- [1-1 INTRO](https://docs.google.com/document/d/11kDmjvbFB2oluK1ZKBjTVqodw897eZ1FrHbB3q5WgSk/edit)
- [2-1 - not done](https://docs.google.com/document/d/1ycXV-Z8q_y5_wOKqWuOvvfE56fsnjUZITRtt9fm4Qh8/edit)
- [4-1 not done](https://docs.google.com/document/d/1yVwJHFYrFXyb8UabIuLsG8Qtl7Q3th3AcbJb3om7Xxs/edit)
- [Card Codes](https://docs.google.com/document/d/1FgWsgQtBYs0bQJPfEEfT8x4v6dfz7SiO6cu4VpMKqEI/edit)
- [tasks / strand order](https://docs.google.com/document/d/177Lw8fdJzNte6bTNe3kOcBFBFAyG_7yob2rJ9D94-s8/edit)
- [Pre-Requisite - Order of Strands](https://docs.google.com/document/d/11o56plHYtzte3_pdJ_pL-MgH8sc9MCuQmyrKPT1aSRY/edit)
- [Galaxy Numerix - Quest 1 - Task 2](https://docs.google.com/document/d/1y8YS7CdE9_nvLE5N8LkybU1mg9wCsyXFbpl9RDcQ9Vo/edit)
- [New numbers Quest 1](https://docs.google.com/document/d/12lZQoXYVLkWMtSEKAncpkO_8J-zBCwfenvQSTe49Nmo/edit)
- [Decision Matrix](https://docs.google.com/document/d/1tryCO4Ba71BtmBpE55DyrQJ_c5pmvV_L39m-ORZutoA/edit)
- [Xylophora intro](https://docs.google.com/document/d/1D2avZUy3xIzC6CQCy8xKVZhZqH70zPyjxtuDmfGqg9w/edit)
- [building area calculation](https://docs.google.com/document/d/1gnGDj4MV1jiJmbnUSEmg3ribcZpp01U_H-qE6rTMHy0/edit)
- [Zephyron quest page](https://docs.google.com/document/d/1hbxTR7b599Z93bx4VCAWOciAkeFWmSeK2WNUhL-2riU/edit)
- [Zephyron Task 1 overview](https://docs.google.com/document/d/1jcCCU-Lt-k4gRE3QShLumVNbD7f-hd4Ygp45mHSWQsI/edit)
- [ship parts](https://docs.google.com/document/d/15WWhctog-qjwD0_P52xCj0mFOxDcO2-yqYZxhUCjkC8/edit)
- [Engine Cores](https://docs.google.com/document/d/1IkOWQ5cbfYrX_GkAiIbjcCIvATfje4NVmazmgCgN9Gk/edit)
- [Booster Cards](https://docs.google.com/document/d/1QAfrrLs6-GX0gLGAOj6yvq6hA4pKncatqKqJ0ctZIgE/edit)
- [Booster 2](https://docs.google.com/document/d/10pOF5P99pg4rfKB4rg3xCO62PcLW6ZvyOE51fzIeoa4/edit)
- [Booster Cards - November](https://docs.google.com/spreadsheets/d/148NqlChuZhza409BBMA-D-RZVIulOCjRTworBEAjph8/edit)
- [FINAL DECK NOVEMBER CARDS DECK.pdf](https://drive.google.com/file/d/18xn5O9stm-WzhULu3yxvmgmiYvM-5Pn3/view)
- [GMQ Cards Print - january.pdf](https://drive.google.com/file/d/10SNwYBga8fyHulJWaqgkcVyz7JlfP06H/view)
- [Galaxy Math quest Policeman.pdf](https://drive.google.com/file/d/10f4PoyRchLh7D2E4I6P1zIKaJD1ylOcc/view)
- [Copy of Battle Game Board.jpg](https://drive.google.com/file/d/16308HxxKrs50qFmXPB6ntjUUzHkS5nnY/view)
- [Cards.csv](https://drive.google.com/file/d/1G222S_Z_7pjW-PW5nR8bM3poz0eP6jJM/view)
- [Edutopia draft](https://docs.google.com/document/d/1w98b3d9gVVmtHsVHRaZJl0mwu_6B9tcffFmQyAxNo50/edit)

**Student site**
- [Galaxy Math Quest 2023–2024 (Google Sites)](https://sites.google.com/view/g3c-2023-space-math-quest)

**Project sources ("Engines And constraints")**
- `novus_txt v3_4 — Novus Expedition Constraint Architecture.md`
- `math-skills_txt v4_1`, `math-skills-api_php v1_1`, `math-skills-login_html v1_1`
- `api_php v4_3_1` (Novus's model path), `api-swi_php v2_6` (rooms)
- `Project State 2026-11-14.md`, `DeepSeek API Reference Sheet 2026-11-11.md`, `POWERSHELL-DEPLOY-HANDOFF.md`
- `MUD_World_Handoff_2026-11-15.md` (supplied by Marc, not in the project)
