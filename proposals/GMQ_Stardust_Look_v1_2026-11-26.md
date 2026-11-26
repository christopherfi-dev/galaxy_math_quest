# Operation Stardust's ship: a new look

**Update, 26 November, night:** the copy now also has Chronosia's map in a new look, so it and its build were renamed: `prototypes/worlds_look_sample.html`, `prototypes/worlds_look_build.js`. See `GMQ_Worlds_Look_v1_2026-11-26.md`. The game's own `stardust_test.js` passes on it.

**Date:** 26 November 2026. **For:** Marc, and the main thread (the wiring is in section 5). **The class game is not changed:** this is a copy, `prototypes/worlds_look_sample.html`, and a demo link.

**Marc's asks** [Source: Marc, 26 November]:
- "Look at the Stardust? One of them is like a space station in space. It's a pretty bland station at the moment."
- "Would it be better to have [Gemini] and I make images or is code good enough? You decide and then you begin."

**Old and new:** `GMQ_Stardust_Old_New_v1_2026-11-26.jpg` (top left old, top right new, the same place; below, the new airlock on arrival).

**Where to see it:** https://christopherfi-dev.github.io/galaxy_math_quest/lookdemo/worlds/ (the old link, `lookdemo/stardust/`, forwards there). Open the Teacher row, tap "Go to Stardust", then walk. "World look: new/old" in the Teacher row switches between the two. It keeps its own saved game.

---

## 1. The choice: code for the rooms, Gemini for what is in them

**The rooms are drawn in code** [Claude's decision, as Marc asked]:
- floors, walls, doors, windows and lights;
- the cadet walks them square by square, the fog lifts room by room, and the doors open as the cadet comes near;
- a Gemini picture cannot line up exactly with the squares, so a child could walk through a drawn wall or miss a drawn door. Code lines up exactly.

**The things in the rooms come from Gemini** (section 4):
- the consoles, the bunks, the plants, the locker, the pump, and the Supply Chief;
- each stands on its own square, so it cannot be out of line;
- for the Menders and the Rillfolk, Gemini gave good pictures in one try.

---

## 2. What is built (the rooms, in code)

- **Like the station** [Source: Marc, "The space station looks ok"]:
  - floor panels with rivets;
  - walls with a lit face and a shadow on the floor below;
  - windows in the outer hull with twinkling stars;
  - the station's amber sliding doors, which part as the cadet comes near.
- **Each room its own floor,** so a child knows where they are:

| Room | Floor |
|---|---|
| Control Room | blue panels |
| Living Quarters | purple carpet |
| Greenhouse | green grating |
| Food Storage | panels, with a painted line in from each wall |
| Engine Room | diamond plate |
| Airlock | grey panels, hazard stripes at the door, a docking ring round your ship |
| Corridor | dark panels, with a strip of guide lights down the middle |

- **The fog is as before:** a room not seen yet stays dark. The room you are in is a little brighter than the others.
- **The things are still the game's own drawings** until the Gemini pictures come.

**Nothing in the new look gives an answer away** (checked against every task):
- **Any room can be the wrong temperature** ("It is not always the Engine Room"). So there is no steam, no frost and no glow by temperature, and every floor is the same at every seed. The Engine Room keeps the game's brown; only the texture is new.
- **No readings, bar heights or fill levels** are drawn on the map. The safe ranges are not on the map either: walking back to the signs is "the hard part, and it stays".
- **Nothing countable is added.** The guide lights and windows count nothing that any task asks.

---

## 3. Tests

- **The game's own `checks/stardust_test.js` passes on the copy,** on three screens, with all four quests and both side jobs played. It reaches all 324 squares, taps the map, and reports no console errors. (It was run from a copy of the test that opens the sample instead of the game; the test itself is the main thread's.)
- **Speed:** the ship takes 0.5 ms a frame to draw, against 0.4 ms before, on an iPad-sized screen.
- **Looked at** as pictures at iPad sideways, iPad upright and phone sizes: on arrival, with every room seen, with a door open, and old against new.
- **Not run:** the station's, Voltara's and the other worlds' tests. Only the Stardust drawing, one Teacher button, the save key, the title and the version line differ from the game.

---

## 4. The Gemini pictures (for Marc)

**What stays in code, and why:**
- the thermometers, the tank gauges and the glass tank, because a drawn level or reading could give an answer away;
- the radio's moving wave, because it moves.

**What Gemini draws:** everything else.

**Choices in the prompts** [Proposal]:
- **The screens are blank, glowing in their colour.** Today's map screens show 4 bars, but the charts have 5 or 6. A blank screen cannot disagree.
- **The bunks have four beds,** because the game says "a crew of four". Today's map draws 2.
- **A magenta background, not green,** because the plants are green.
- **The Supply Chief** is the game's own: "she", "a pencil behind each ear". She works inside the ship, so she has no helmet.

Use the **same Gemini chat as the Menders and the Rillfolk**, so the style stays the same. Paste one prompt at a time.

### Prompt 19 (the ship's things, part 1)

```
NEW PICTURES, SAME STYLE. Keep exactly the same drawing style as all the characters above: a clean, flat 2D cartoon, a bold dark navy outline of even thickness (about #0E1626), flat colours with one darker shade and one small white shine on the upper left, light from the upper left. These are objects inside a friendly spaceship for a children's game: rounded, simple, a little chunky, like toys. Seen from the front and a little from above.

FOR THESE PICTURES:
- a plain, flat, bright MAGENTA background (#FF00FF), the same everywhere: no floor, no shadow, no frame
- no magenta, pink or purple anywhere on the objects
- no words, no letters, no numbers, no labels, no symbols and no signature anywhere, and nothing written on any screen
- each object on its own, with plenty of space between them; nothing touching

PICTURE 19: EIGHT SHIP OBJECTS, IN TWO ROWS OF FOUR, IN THIS ORDER.
Row 1, left to right:
1. a computer console: a chunky desk with a big screen that glows plain amber; the screen is blank
2. a computer console like number 1, but its screen glows soft green and shows a friendly person's head and shoulders wearing a headset (no words)
3. a computer console like number 1, but its screen glows plain light blue; the screen is blank
4. a bunk unit with FOUR beds: two beds stacked on the left and two stacked on the right, each with a small pillow and a blanket
Row 2, left to right:
5. a radio set: a sturdy box with a round speaker grille, two knobs, and a small dark green screen that is blank
6. a long planter box of brown wood, full of DRY soil, with droopy pale yellow-green leafy plants
7. the same planter box, but the soil is dark and wet and the plants are standing up, fresh and bright green
8. a blue watering can with a long spout
```

### Prompt 20 (the ship's things, part 2)

```
PICTURE 20: THREE MORE SHIP OBJECTS, IN ONE ROW, IN THIS ORDER.
The same style, the same plain flat bright MAGENTA background (#FF00FF), no magenta, pink or purple on the objects, no words, letters, numbers, symbols or dials with marks anywhere. Each object on its own, with plenty of space between them; nothing touching.
1. a tall metal supply locker with two closed doors and a handle on each door
2. a short section of thick copper pipes along a wall: three fat pipes side by side with round joints and bolts (no steam, no smoke, nothing glowing)
3. a pump machine: a sturdy orange box with a crank handle on one side and three round buttons on the front (no gauge, no dial, no screen)
```

### Prompt 21 (the Supply Chief)

```
NEW CHARACTER: THE SUPPLY CHIEF. She runs the food stores on a spaceship. A grown-up woman, warm, busy and a little stern, with a pencil tucked behind EACH ear. She wears a practical one-piece ship's work suit in navy blue with rolled-up sleeves and many pockets, and sturdy boots. No helmet (she is inside the ship). Keep exactly the same drawing style and outline as all the characters above. This must be an original character, not like anyone from a game, a film, a show or a book.

Her hands: five fingers on each hand (four fingers and a thumb), always.

One wide picture (16:9), plain flat bright green background (#00FF00), no green anywhere on her, no shadow, no words, letters or numbers. Show her four times in a row, all the same size, whole body, standing turned three-quarters to her right:
1. CALM: a small, kind smile, hands resting at her sides
2. HAPPY: a big smile, one thumb up
3. WORRIED: eyebrows raised in the middle, a small frown, holding a clipboard to her chest (nothing written on it)
4. THINKING: eyes looking up and to one side, tapping one of her pencils against her chin
```

**What I will do with them:**
- cut each object out, and stand it on its square in place of the game's own drawing;
- the planter shows dry or watered, as the game does now;
- the Supply Chief gets the same breathing, blinking and faces by her words as the Menders;
- check again that nothing gives an answer away, then put it on the demo link.

---

## 5. For the main thread: how to put it into the game

When Marc says so. It is a piece, as the conductor's plan asks.

1. **Paste `prototypes/star_look_kit.js` just before `function drawStar(dt) {`.** It uses the ship's own `SRM`, `SDOOR`, `sRoomAt`, `sSeen`, `SM` and `SD`, and the game's `shade`, `rr`, `ol` and `circ`.
2. **In `drawStar`,** wrap the background fill and the floor-and-wall loop:
   - before: `cx.fillStyle = '#05070f'; cx.fillRect(0, 0, w, h);` followed by the `for (let y = y0; …)` loop;
   - after: `if (SLK.on) SLK.ship(x0, x1, y0, y1, Xs, Ys, ts, w, h, c); else { …the same two as before… }`.
   - `prototypes/worlds_look_build.js` shows the exact text.
3. **Optional:** the Teacher button `t_slk` ("World look: new/old"). Without it, the new look is always on.

**Nothing else changes:** no save data, no task, no number.

---

## 6. What could prove this wrong

- **The Engine Room is brown,** as it was before. If a child reads brown as "warm", that is not new. Still, watch whether children go straight to the Engine Room when looking for the bad room.
- **On arrival, most of the picture is dark** (rooms not seen yet), as before. If children say "there is nothing here", the first view could show more.
- **The look has been seen only in a browser on a computer.** Open the demo link on the oldest class iPad.
