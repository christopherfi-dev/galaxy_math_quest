# The kit for finds

**Date:** 20 November 2026. **For:** Marc. **Sketch version 55, on the preview link only.** The class link is still version 54.

[Source: Marc, 2026-11-20] "things that they could just find in the world like a cave to go in and discover something new and they all have like math things involved in them, and some of them affect the outcome of the world."

Everything below is **[Proposal]** unless it says [Source].

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

## 4. The nine finds on Chronosia: a key for you

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
- The four older tests that touch Chronosia and the word rows: see the handoff for the result.
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
