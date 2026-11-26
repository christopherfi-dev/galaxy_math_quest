# Pictures for the cards

**Date:** 26 November 2026, while Marc slept. **For:** Marc, the cards thread and the main thread. **Changed:** new files only (listed in section 5). The class game is not touched.

**Why now** [Source: the conductor's plan, `HANDOFF_Next_Threads_2026-11-26.md`]:
- "When the catalogue lands… The visual design thread starts the card pictures."
- "One style for all of them. They must be small enough to live inside one game file (SVG, or drawn on the canvas), readable at the size of a card in a child's card book on a phone, and original."

The battle thread's catalogue landed today: `docs/battle/cards.json`, with 93 battle cards, 20 ship parts and 5 upgrades. Each has a picture key (`pic`) and a few words on what the picture shows (`picture`).

**See them all:** https://christopherfi-dev.github.io/galaxy_math_quest/lookdemo/cards/. Each card's picture sits beside its name, its words, and what the picture counts.

---

## 1. Code, not Gemini, for the cards [Claude's choice]

- **Exact counts.** The pictures carry the maths: "a rocket with 7 round windows", "two rows of seven bricks", "ten sparks in a row and one more". Code draws them exactly every time. Gemini once gave Elder Thimble a fifth finger.
- **Small.** All 118 pictures are one script of 35 KB. As Gemini pictures they would be over a megabyte, too much for the one game file.
- **One style:** the game's own, as in its six old card pictures (`CARD_ART`) and on the station. A dark navy outline, flat colours, one white shine, on a dark panel tinted by the card's type: attack red, defence blue, repair green, spy purple, guard teal.
- **Ship parts:** five shapes (reactor, navigation dish, shield generator, turret, battery) in the four kinds' colours from the catalogue. Grey and plain; blue and thick-walled; red and sharp; gold and shining.
- **Upgrades:** the part, and three green arrows up.

---

## 2. The rule for numbers in a picture [Proposal]

**Rule 1: when a card's picture words name a number, the picture draws exactly that many.** 40 cards. For example, Odd Rocket has 7 windows, Two-Dozen Blast has two rows of 12 stars, and Eleven Sparks has 10 in a row and 1 more.

**Rule 2: when the words name no number, but the picture shows a group that can be counted, the group is one of the card's own numbers.** 10 more cards. This follows the battle thread's own pattern: Helper Drones (+3) has three drones; Robot Crew (+4) has four robots.
- Moon Rock Wall blocks 11: 11 rocks.
- Ice Crystal Wall blocks 13: 13 crystals.
- Rally Cry adds 5: 5 hearts.
- Pebble Popper adds 4: 4 pebbles.
- Patrol Pop adds 2 for each part: 2 ships.
- Fleet Flash adds 4 for each part: 4 ships.
- Fix-It Fleet repairs 5 on every part: 5 ships.
- Card Wall, Card Fence and Card Castle: 4, 3 and 5 cards.
- Star Dome adds 30: 30 tiny stars.
- Hold and Heal repairs 2 on every part: 2 hearts.

**Rule 3: anything else is one thing, or too many and too small to count** (the dust, the Nano Shield's dots).

**Why:**
- A child who counts what they see must never get a number that is not on the card. CLAUDE.md asks: "Does anything give the answer away?" and "Can any question be read two ways?"
- My first drawings broke this rule in 14 places: 12 rocks for a card that blocks 11, 3 pebbles on a +4 card, 7 cards on a card wall. The check found the rocks and crystals. Looking at the pictures as a child would found the rest.

**The check** (`checks/card_art_check.js`) holds all three rules:
- every counted thing is marked in the drawing, and the check counts the marks;
- 50 numbers are checked;
- it fails when a card has no picture, when a picture is not a well-formed SVG, and when a picture has words its card does not name. Only "100" on the Hundred Cannon, "STOP" on the guard's sign, and "10" on the Rounding Rover are allowed.

---

## 3. For the battle thread, through Marc: one risk in the words

**"Count your working parts" cards show a fixed count.**
- **All Hands Fire:** "Count your working parts. Add 5 for each one." The picture words say "five small lasers".
- **Five-Part Swarm:** "4 damage to every enemy part", with "five tiny drones".
- **The risk:** five equals the parts only at full health. A child with 4 working parts still sees 5.
- **What I drew:** five, as the words say, because 5 is also each card's own number. So rule 2 holds.
- **For you to decide** [Proposal]: keep it, or change these words to name no count (for example, "lasers firing at once"). Then I would draw one laser and a burst.

---

## 4. Tests

- **`checks/card_art_check.js` passes:** 118 pictures, one for each card. 50 numbers checked. 35 KB of code. Every picture opens in a browser.
- **Looked at:** every picture at 84 pixels, about a picture's size in a phone's card book (the sheet in the check's `--sheet` folder). On the demo page, at iPad sideways and phone sizes: 118 cards, the type filters work, nothing runs off the screen, no errors.
- **Not done:**
  - **The pictures are not yet in the class game, the card book or the pop-up.** That is the cards thread's and the main thread's job (section 5).
  - **No child has seen them.**

---

## 5. How the other threads put them in

**Files:**
- `prototypes/card_art.js`: the pictures (`GMQArt`), between `/* ===== GMQ CARD ART: start =====` and `end`. No `?.` and no `??`.
- `checks/card_art_check.js`: the check.
- `prototypes/card_art_gallery_build.js`: makes the page.

**For the cards thread** (the pop-up and the card book):
- `GMQArt.svg(card.pic)` gives the picture as an SVG string, square (viewBox 0 0 100 100). Put it in the picture area at any size.
- `GMQArt.has(pic)` says whether there is one.
- It is cached: the second call for the same card is free.

**For the main thread** (the game file): paste `card_art.js` once. Then the MY CARDS list can use `GMQArt.svg(...)` in place of `CARD_ART` for the new cards. The old six names have no picture key; keep `CARD_ART` for them until the old cards are moved to the new list.

**When the catalogue changes:**
- **A new card with no picture:** the check fails and names it. I add the picture.
- **A card's picture words change their number:** the check fails until the picture agrees.

---

## 6. Decisions for Marc

1. **The style:** one look for all cards, in the game's own drawing. Does it look right in your card book's size? The demo page shows them.
2. **The rule for numbers** (section 2): keep it?
3. **The "count your working parts" pictures** (section 3).
