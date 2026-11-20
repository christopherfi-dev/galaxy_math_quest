# The kit for finds

**Date:** 20 November 2026. **For:** Marc. **Sketch version 56, on the preview link only.** The class link is still version 54.

**Added the same day, version 56:** one deep find, the Backward Mountain. It is section 0 below. Read that first.

[Source: Marc, 2026-11-20] "things that they could just find in the world like a cave to go in and discover something new and they all have like math things involved in them, and some of them affect the outcome of the world."

Everything below is **[Proposal]** unless it says [Source].

---

## 0. The Backward Mountain: one deep find (version 56)

[Source: Marc, 2026-11-20] "An immersive, math based story that is real to them. The tasks I was giving them off-line were much more complex than clicking on things online. They took time."

The nine finds below are one question each. That is clicking. This one is not.

### Where it comes from

| From your pages [Source] | Added by me [Proposal] |
|---|---|
| "mountains that age backward, getting smaller as you climb them" | The mountain has a name, three trails and an old climber at its foot |
| Sara "loves to open time capsules" | Sara buried a capsule at the top, years ago |
| "Time Capsule Unveiling", Chronosia, Oct 6 | The capsule on the mountain is the one for the Unveiling |
| "too much time travel is ripping holes in the universe" | From the top, long ago, you can see the sky before it cracked |

### What a child does

1. **Finds three facts in three places.** They are not on one screen.
   - The climbers' hut, north-west: how much the top comes down, and how many years younger the mountain grows, for every 10 minutes of climbing.
   - The Council notice, by the Council Hall: how many years ago Sara buried the capsule.
   - The sign at the mountain: how tall it is today, and how fast each of three trails climbs.
2. **Hears the idea first.** The old climber tells it with a candle and a snail: a finished example about something else. [Source: your rule, "see the idea before you do it"]
3. **Makes a plan on paper.** She will not let anyone climb without one: how many minutes to the top, how tall the top is by then, how many years younger.
   - The top comes down while you go up. You arrive where the two heights meet.
   - The natural way is a table with a row for every 10 minutes. Nothing on the screen draws it for them.
4. **Tells her the plan.** A wrong plan gets only a count: "2 of your 3 numbers do not fit the Ramp."
5. **Climbs, and meets the twist.**
   - On the two slower trails the mountain goes back too far. The top is bare: **the capsule is not buried yet.** That is a dead end with a reason. It is also a secret: from there the sky has one thin crack, or none at all.
   - Only the fastest trail arrives after the capsule was buried.
6. **Chooses, and the choice stays.** [Source: your rule, "your decision must matter"]
   - **Carry it down sealed:** a card. Sara will open it at the Unveiling. The child never sees inside.
   - **Open it there:** the child sees what is inside. No card. The Unveiling is spoiled, and Sara says so.
   - `look` on the map, the mountain itself and Sara's first words all change with the choice.

### A key for you

Every cadet has a different mountain. The rule, for the trail they choose:

- **Minutes** = 10 × (height today ÷ (metres the trail climbs + metres the top comes down))
- **Height then** = height today − (metres the top comes down × number of 10-minute steps)
- **Years younger** = years for each step × number of steps

One worked example. Height 72 m. The top comes down 4 m every 10 minutes. The mountain grows 3 years younger every 10 minutes. The Stair climbs 20 m every 10 minutes.

| Minutes | You | The top |
|---|---|---|
| 0 | 0 | 72 |
| 10 | 20 | 68 |
| 20 | 40 | 64 |
| 30 | 60 | 60 |

So: 30 minutes, 60 metres, 9 years younger.

### What was tested

- 5,000 cadets' mountains were climbed step by step, the way a child's table would. All 15,000 climbs end exactly on a 10-minute step. Exactly one trail reaches the capsule, every time. No trail arrives in the very year of the burying.
- There are 3,285 different mountains, so neighbours will not share numbers.
- A browser played it on two screens: sealed on one, opened on the other.
- The check now reads deep finds too. It caught one of my own nudges as too long.

### What it does not do yet

- **Nothing is done with hands.** It needs paper, but no blocks, no ruler, no partner. Your station tasks have a code you give after watching. This could have one.
- **The picture of the mountain is small.** It is one square on the map. There is no view from the top.
- **The crack in the sky leads nowhere yet.** It is a thread for a later quest.
- **It is on Chronosia only.**

### What could prove it wrong

- **It may be too hard.** Two things move at once. Watch whether a child starts a table without being told, or stops.
- **It may be too much reading.** The climber's story is 11 short sentences.
- **Children may guess.** Three boxes with a count of wrong ones can be worn down. The log keeps the number of tries, so you can see it.
- **The steepest trail is the right one.** A child may pick it by feel. They still have to work out the three numbers.
- **Opening the capsule costs a card.** Some children will feel punished for being curious. That is the point of the choice, but it is yours to keep or change.

---

## 1. What it is

- A **find** is a thing on a map that nobody sends you to: a cave, a nest, a carved stone.
- A find is **data, not code.** It is about eight lines: where it is, what it looks like, its words, its maths, what happens.
- The game does the rest. It draws the find, walks the cadet to it, asks the question, checks the answer and remembers what was done.
- **A check reads the data before a child sees it.** A find with a fault is refused.

This is the same idea as your 20 small worlds, but for things inside a planet.

**Why it matters for your vision:**

- To add a find, I write eight lines. No new code.
- Later an AI could write those eight lines, inside the constraint file. The same check would read them first.
- What a child did is saved as one small fact ("cave: done"). A server could hold that fact for the whole class, so the next child finds the cave already open.

None of the AI or server part is built. The kit is the shape they would plug into.

---

## 2. How a child meets a find

1. They see it on the map when the mist clears. It has no "!" and no label.
2. They tap it, or type `go cave`. The cadet walks to the square beside it.
3. The game says what they see. The find's name shows above it, and its word joins the Here row.
4. They tap it again, or type `use cave`.
5. Then one of three things happens:
   - **A lock:** one maths question, with the cadet's own numbers. A wrong answer gets only "That is not it. Read it again."
   - **A free secret:** something happens, with no question.
   - **A dead end:** nothing. It stays nothing. [Source: your Novus engine, "Dead Ends Are Real"]

---

## 3. Your question: do they have effects?

You wrote: "Can we make it so...quests do have effects. Or no." You did not decide, so I built the small effects and left the big ones.

**Built into the kit:**

| Effect | Example on Chronosia |
|---|---|
| The find changes for good | The cave lights up. The arch stands again. The digger comes out and sits in the sun. |
| One find opens another | The cave holds a map. Only then can the stone door in the hills be seen. |
| The world's own words change | `look` on the map gains "A lamp burns in the hills." It shows the two newest marks. |

**Not built. These are your choice:**

- A being who speaks differently because of what you did.
- A find that leaves the place worse off if you get it wrong or walk away. Your rule "Your decision must matter" is kept on Voltara only.
- A find that changes one of the six real quests. The check forbids this today: a find cannot sit on a place.

---

## 4. The nine small finds on Chronosia: a key for you

Every cadet gets different numbers, so the key gives the rule.

| Find | Where | What it asks | Answer | Card? | What changes |
|---|---|---|---|---|---|
| small burrow | South, right of the ship | "There were A seeds. Now there are B. How many are gone?" | A − B | no | The digger sits outside |
| still pool | South-west corner | nothing | free secret | no | A ripple |
| dark cave | In the rocks left of Cougar Rock | "The dripping started at 3:40. It stopped at 4:15. How many minutes did it last?" | the minutes between | no | The cave is lit. **The stone door appears.** |
| stone door | Far north-east hills, only after the cave | "The door shows 347. Round 347 to the nearest hundred." | rounded | **yes** | The door is open. A lamp burns. |
| carved stone | East, below the Council Hall | "The stone reads: 7, 13, 19, 25. What number comes next?" | add the same step again | **yes** | The stone glows |
| hollow tree | West edge, below the Clock Tower | "There are 4 branches. Each has 6 clocks. How many clocks in all?" | A × B | **yes** | The hole glows |
| big nest | South-east corner | "24 eggs must go in 4 sand pits. Each gets the same number. How many eggs go in each?" | A ÷ B | no | Shells, and a baby tortoise |
| broken arch | North-east, left of the TimeTweak tree | "One pile has 245 blocks. The other has 318. How many blocks in all?" | A + B | **yes** | The arch stands whole |
| old stump | North, right of the Quake Station | nothing | dead end | no | nothing, ever |

- The Temporal Tortoises are yours [Source]. The digger, the door, the lamp and the rest are mine. Any of them can go.
- The cards come from the same pile as every other card.

---

## 5. The seven locks

A find picks a lock and gives it words. The numbers come from the code.

| Lock | The maths | AERO |
|---|---|---|
| times | equal groups | 3.OA.1, 3.OA.7 |
| share | equal shares | 3.OA.2, 3.OA.6 |
| mins | minutes between two clock times | 3.MD.1 |
| next | the next number in a pattern | 3.OA.9 |
| round | round to the nearest ten or hundred | 3.NBT.1 |
| sum | add within 1,000 | 3.NBT.2 |
| less | subtract within 1,000 | 3.NBT.2 |

---

## 6. What the check refuses

The test tries 21 broken finds on purpose. All 21 are caught.

- A find on a place, on the path, off the map, or where a cadet cannot walk.
- Two finds on one square, or with one standing square.
- A word that already means something on that planet, such as "tower".
- A sentence over 10 words. Unkind words.
- A lock that does not exist, or one that gives a bad question.
- A find that waits on a find that is not there, or on a dead end. A ring of finds that wait on each other.
- A card from a find with no lock. More than half the finds giving a card.
- A dead end that gives or changes anything.

---

## 7. What was tested

- `node checks/finds_test.js`: **PASS.**
  - The game's own check finds no fault in the nine finds.
  - 35,000 lock questions were worked out again a second way. None was wrong.
  - A browser played all nine at iPad size and at phone size: typing, tapping the map, tapping words, wrong answers, the hidden door, closing and opening the game, and an old saved game.
  - One find was done by taps only, with the reading cards on, as a child has them.
- The older tests that touch Chronosia, the word rows and the number pad passed for version 55. For version 56, see `INFO_FROM_MARC.md`, the last line of 20 November.
- **The full run of 26 tests was not done.** You paused it. The kit adds one line to shared code (the list of words the game knows).

**One real fault the test caught:** the kind-words filter read the clock time "4:55" as a rude word. It only mattered inside the check, and it is fixed there. It never reached a child.

---

## 8. Decisions for you

1. **Effects.** Are the three small ones enough for now, or do you want a being who answers differently, or a find that can go wrong?
2. **Cards.** Four of nine finds give a card. Too many? Too few? The check caps it at half.
3. **No worked example first.** Your rule is "see the idea before you do it". These are small secrets with one question, and I did not put an example before them. Should I?
4. **No "!" and no count.** A child is never told how many finds there are. Is that right?
5. **What next:**
   - **Fill Chronosia** to 20 or more finds. About 8 lines each, plus a drawing for each new kind.
   - **Plug the kit into Xylophora and the mission ship.** One short adapter each.
   - **Both.**

---

## 9. What could prove this wrong

- **Children may never tap them.** A find has no "!" mark. Watch whether anyone finds the burrow beside the ship without being told.
- **One question may be too thin.** A cave that asks one sum is not "going into a cave". If it feels flat, a find needs a room behind it, which is a bigger build.
- **The numbers may be too hard or too easy.** Subtracting 227 from 366 is harder than 4 times 6. I did not level them. Tell me which felt wrong.
- **Nine is not fifty.** The kit makes each one cheap, but each still needs a good idea. Fifty thin ones would be worse than fifteen good ones.
- **I saw it in Chromium on a server, not in Safari on an iPad.**
