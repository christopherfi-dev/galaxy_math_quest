# Painted rooms: the style guide

**Date:** 28 November 2026. **From:** the painted rooms thread. **For:** Marc, and every thread that makes or uses a painted room.
Everything is **[Proposal]** unless it says [Source]. "Measured" means measured on Marc's Gemini pictures or on the test page (`docs/rooms/`).

---

## 1. The rule in one line

**Gemini paints the room. The game draws everything that moves, changes, or holds a number or a word.** [Source: the brief, from Marc's "Go" of 28 November]

| Who draws it | What |
|---|---|
| **Painted by Gemini (by Marc)** | walls, floor, doors, fixed furniture; a dark and a lit copy of each room |
| **Painted on magenta, cut out by the game** | the cadet (four views), people, the robot, every thing a child can take, use or give, and anything that changes (a dry plant and a healthy one) |
| **Drawn by the game, always** | every number and word; every reading a child uses for maths (thermometers, gauges, charts, dials, tally marks); every task picture; anything whose look depends on what the child did |

**Never** a word or a number painted into a room. Every screen, board, chart, sign, dial and label is painted blank.

---

## 2. The look, in words (from Marc's pictures) [Source: pictures 1, 3 and 4]

- **A hand-drawn cartoon,** like a good picture book. Clean dark outlines of even thickness. Soft painted shading, not flat colour.
- **Friendly, worn machinery.** Rounded shapes. Rivets, panel seams, scuffs, a little rust. Cables run along the bottom of the walls.
- **Calm, not busy.** Big plain areas of floor and wall. Small detail is kept for the edges.
- **Never scary.** Even dark rooms have warm lamps, and everything can be seen. (The Stardust story note: "No room is black.")
- **Wide pictures,** 16 by 9.

## 3. The view: a stage with its front wall taken away [Measured]

- **Seen from the front and a little above.** The back wall runs straight across. The two side walls slant in. The floor is a wide trapezoid.
- **The back wall meets the floor about 40% of the way down the picture.** Measured: 38% in the Docking Bay, 42% in the Greenhouse. Keep every room between 36% and 44%, or the cadet's size will jump between rooms.
- **The floor runs to the bottom edge.** The bottom 11% is covered by the game's bar (the main thread designs it). Nothing that matters is painted there.
- **Ways out, by direction:**
  - **East and west:** a doorway in the right or left wall. Marc's Docking Bay does this well.
  - **North:** a door in the back wall.
  - **South:** a picture never shows its near wall. So a way south is a walkway on the floor, edged with stripes, running from the middle of the floor down off the bottom edge. The cadet walks to its end, just above the bar, and the picture slides down.
  - **Up and down:** a ladder to a hatch in the ceiling (at the back) or in the floor (near the front).
- **The middle of the floor stays open.** The game cannot draw the cadet behind painted furniture, because the furniture is part of the flat picture. Tall things stand against the walls. Anything in the middle of the floor is low (knee height or less), or the space behind it is blocked off. Measured: the test page blocks the space behind the Docking Bay's little ship.
- **Leave bare floor where the game puts things.** About three clear patches the size of a crate.

## 4. The lamps: dark and lit [Measured on pictures 1 and 3]

| | Dark (the power is off) | Lit (the power is back) |
|---|---|---|
| Lamps | amber lamps in oval cages, soft warm cones of light | white strips on the ceiling; the wall lamps white |
| Walls | cool blue-grey shadow, warm glow near each lamp, floating dust | cyan light lines on the walls, door frames glowing |
| Panels | small amber screens | blue and green screens |
| Things and the cadet | **darkened by the game to match**: brightness 60%, less colour, a little warm (test page: `brightness(.6) saturate(.75) sepia(.18)`) | full colour |

- **The lit copy must line up exactly with the dark one,** so the game can fade between them. Marc's pair does (measured by the main thread: best match at a shift of 0 pixels). The fade takes about 1.4 seconds.
- **Ask for the lit copy straight after the dark one, in the same chat.** That is how Marc's pair was made.
- **A lit copy can also open a sealed door,** because the power opens it in the story. Check that nothing else moved.
- **A room with only one state** (the test Greenhouse) is treated as dim, and its things are darkened a little (brightness 72%).

## 5. Each world's colours

**Stardust (Tally Station), first.**
- **The whole station:** blue-grey steel, dark outlines, amber lamps when dark, cyan and white when lit, yellow-and-black stripes on heavy doors. [Source: Marc's pictures]
- **Each room adds one colour of its own,** so a child knows where they are at a glance: [Proposal; the floors marked [Source] come from `GMQ_Stardust_Look_v1_2026-11-26.md`]

| Room | Its own colour or floor |
|---|---|
| Observatory | deep navy and brass, a glass dome of stars |
| Listening Room | dark teal, small green lights |
| Control Room | blue wall panels [Source] |
| Power Room | copper, hazard stripes |
| Greenhouse | green grating [Source], glass roof |
| Living Quarters | purple carpet [Source] |
| Common Room | warm orange and brown |
| Engine Room | diamond-plate floor [Source], red and orange |
| Water Room | aqua and white |
| Galley | cream and red |
| Entry Hall | dark panels [Source], grey with stripes |
| Fuel Store | orange and black |
| Sick Bay | white and mint green |
| Food Storage | painted lines on the floor [Source], frosty pale blue |
| Docking Bay | grey and hazard stripes [Source] (Marc's picture) |
| Hangar | grey, very tall, the white *Stardust* |

**The other worlds, one line each** (for later; each needs Marc's choice first):
- **KIS Station:** the same steel and lamps as Tally Station, but brighter and busier: it is home. (If repainted at all: the station is built and works.)
- **Galaxy Numerix, Voltara:** the rainbow-striped sky the game already has; warm gold and electric blue for the power plant.
- **Galaxy Metrica, Chronosia:** brass clockwork and deep blue; Xylophora: soft greens and folded paper. **Warning:** on Xylophora the squares on the ground are the maths, so its tasks stay drawn by the game. A painted room can only be the place around them.
- **Galaxy Geometrica, Zephyron:** sandy orange and pale stone, sharp clean shapes.
- **Galaxy Databa** (Stardust's galaxy): the blue-grey station above; deep space purple outside its windows.

## 6. The cadet's size [Measured on the test page]

- **Size depends only on how far back the feet are.** The game works it out from the feet's height in the picture.
- **At the back wall** (feet about 38% down): the cadet is 16% of the picture's height (175 of 1125 units), a little over half the height of the back door.
- **At the front** (feet about 88% down, just above the bar): 27% (300 of 1125 units).
- **In between:** in a straight line.
- **The things scale the same way.** The robot at the front is half the cadet's height; the battery a quarter.
- **The four views are the same height** to within 3 pixels, with the feet on one line [measured by the main thread]. So the cadet does not jump when it turns.
- **Walking:** a small bob (7 units up and down) while walking, and a soft shadow under the feet. The cadet faces left or right when walking across, the back when walking up the picture, the front when walking down.

## 7. Sizes, formats and names

**What Gemini gives:** PNG, 2730 × 1536, about 5 MB each. [Measured]

**What the game uses** (made by `checks/rooms_make_images.py`):

| Picture | Sizes | Format | File size (measured) |
|---|---|---|---|
| Room, each state | 1180 wide (iPads at 1× and phones) and 2360 wide (iPads at 2×) | **WebP** (quality 80) | 61–101 KB at 1180; 150–260 KB at 2360 |
| The same, for iPads older than iOS 14 | the same | **JPEG** (quality 78) | 96–134 KB; 278–426 KB |
| Cut-outs | cadet 440 tall; things 260 on the longest side | **WebP**, with **PNG** for old iPads (PNG keeps the see-through edge) | 12–31 KB WebP; 61–157 KB PNG |

- **The game picks the size** from the screen: 2360 when the picture covers more than about 1240 device pixels across (every iPad at 2×), else 1180. It picks JPEG and PNG only when the browser cannot show WebP.
- **One room, both states, at 2×:** about 370 KB to load. **Decoded, each picture holds about 12.5 MB of memory.** Keep only the current room and its neighbours loaded.
- **Names:** `<world>/<room code>_<room name>_<state>_<width>.<ext>`, lower case, no spaces. For example `stardust/r11_entry_hall_lit_2360.webp`. Cut-outs: `stardust/things/battery.webp`, `cadets/cadet3_left.webp`.
- **Marc's originals are kept** as they came, renamed by code (for example `R11_dark.png`), in a folder beside the game's pictures, so a picture can be made again at a new size.

## 8. Things a child can tap, without giving secrets away

[Source for the aim: Marc, 28 November: the children enjoyed "finding the secrets". Rule: nothing gives the answer away.]

- **Everything in a room answers a tap,** painted or not: a door, the crates, the window, a plant. So "it answers" never means "this is the secret". The test page does this: 20 things answer a tap, and most give just a sentence.
- **No glow, sparkle, outline or hand** on things that matter. Those would point straight at the secret.
- **Cut-out things are allowed to look like things,** because a child should see a battery and want it. But a secret thing is **small, dim or half-hidden**, painted or placed where a child must look: behind a plant bed, under a bunk, behind the drums.
- **A secret that is a place** (the Greenhouse vent) is painted in plain sight, looking ordinary. Only tapping it tells you more.
- **Fingers are bigger than mice.** The game gives every cut-out a tap area larger than its picture (30 units all round on the test page). Painted things get a box.
- **Tap, then the cadet walks there, then the words appear in the side panel,** with buttons for what can be done ("Take the battery", "Give it the battery", "Open the book"). Words never appear in the picture.
- **Reading a number or a page:** the picture becomes a close-up drawn by the game (the book, the wall screen), filling the picture above the bar. A painted screen is far too small to read: measured, the Docking Bay's wall screen is 27 × 33 units of 2000, about 12 pixels on an iPad.

## 9. What to check in every painted room

1. The ways out are where the map says, on the right walls.
2. The back wall meets the floor between 36% and 44% down.
3. The middle of the floor is open; tall things are against walls.
4. No words, letters or numbers anywhere, even on a crate or a sign. (Gemini sometimes adds them. Look closely.)
5. Screens, boards, dials and charts are blank. Where the game will put a number, the screen is large and faces the front.
6. Nothing in the bottom 11% that matters.
7. It looks clearly different from the other rooms, in the same style. (The test Hangar did not: it copied the Docking Bay. [Source: the main thread's analysis])
8. Lit copy: lay it over the dark one and flick between them. Nothing moved, except a sealed door that the story opens.
9. No people, no characters, no things to take: those come on magenta.

## 10. What could prove this wrong

- **An iPad has not run the test page.** Chrome on an iPad uses Apple's engine. The fade, the filters and the memory of three large pictures need a real iPad, ideally the oldest in the class.
- **Gemini may not keep the camera height** across 15 rooms. Check rule 2 on each picture; if it drifts, the game can scale a room's cadet, but it will look odd beside the next room.
- **Gemini may not keep the same doorway shape** for doors that join two rooms. The slide shows both sides at once, so a mismatch shows (see the test page's slide picture: a seam where two side walls meet, which is fine; a different door shape would not be).
- **The cut-out shadows are drawn by the game.** On a strongly lit painted floor they may look too soft. Look at the lit rooms.
