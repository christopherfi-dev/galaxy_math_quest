# A better look for the worlds seen from above

**Date:** 24 November 2026. **For:** Marc. **Nothing in the game, the class link or the big world's own page was changed.**

**Marc's words** [Source: Marc, 24 November, after reading `GMQ_Art_Upgrade_Options_v1_2026-11-24.md`]: "The space station looks ok. But the bigger worlds not as..well designed? You can decide"

**How I read them:**
- "The bigger worlds": the maps a child walks around from above. That is the big world (Planet Algora), Chronosia, Xylophora and the mission ship. All four are drawn the same plain way: flat squares in a checkerboard, square steps where land meets water, and one tree stamp in rows.
- "You can decide": you gave me the choice of what to do first, and how.

**Pictures, old on the left, new on the right:**
- `proposals/GMQ_World_Look_Meadow_v1_2026-11-24.jpg`: by your ship, and the orchard
- `proposals/GMQ_World_Look_Reach_v1_2026-11-24.jpg`: the Reach's river and harbour, and the old wall below the Pattern Woods

---

## 1. What I decided, and why

1. **Redraw the maps in code, not with AI pictures.**
   - You said the station looks OK. The station is drawn in code. So code can reach a look you accept, when it is done with care.
   - A painted picture cannot line up with the walking squares. It cannot change as the story moves (a bridge comes down, stones rise). Code can.
   - No new files, no slower start on school wifi, no question of who owns the pictures.
2. **Start with the big world.** It is the plainest of the four, it is the newest, and it is the one meant to grow to 20 to 50 things to find.
3. **Make a sample first, beside the real page.** You and the children can compare before anything changes.
4. **AI pictures for characters stay open,** as option A of the art note. They are a separate step.

---

## 2. What changed in the sample

All of it is paint. **The squares underneath are the same.**

- **No checkerboard.** The grass has soft lighter and darker patches, and small tufts.
- **Rounded edges.** Land, sand, water and paths meet in curves, not square steps. A river that steps sideways still flows as one river.
- **Land stands above the water.** An earth bank shows on its south side, the way the station's walls show their faces. White foam runs along every shore.
- **Shallow and deep water.** Lighter near the shore, darker in the middle of the sea and the lake.
- **Paths** have a worn edge and a few marks.
- **Where two lands meet** (the Meadow and the Pattern Woods, the Meadow and the Reach), the colour changes softly over one square, not along a ruler line.
- **Trees:** each one a little different in size, shape and colour, with one outline round the whole tree and a highlight from the suns. Orchard trees stay in their rows, because an orchard is planted in rows.
- **"Look: new" / "Look: old" on the Ship panel** (beside Sound and Music) switches between the two at the same spot. It is for comparing, and in the sample only. (It was first on the top bar. On a phone that made the bar taller, and the play test's tap on the ground hit it. A child's tap would too. So it moved.)

**What did not change:**
- where a child can walk, what is solid, what can be tapped
- every word, every task, every number
- the cadet, the Menders, the Rillfolk, the machines, signposts, labels and "!" marks
- rocks, houses, walls, reeds, mountains, dunes and the big old tree (they are drawn as before)
- the big map (the Map button) and the side views (the village, the harbour)
- Chronosia, Xylophora and the mission ship. They come next, if you like this.

**Nothing new to tap.** I added no flowers, stones or pebbles where the map has none. Grey pebbles would look like the machines' test pebbles, and a child would try to take them.

---

## 3. How to try it

- **The sample, to play:** https://claude.ai/artifact/SbDUmiUkCQAcX2ZXG5gPx1 (private). It is the whole big world, with the new look.
- **In this folder:** `prototypes/world_look_sample.html`.
- **It has its own save.** It never touches a child's big world game.
- **Tap Ship, then "Look: new"** to see the old look at the same spot. Tap again to come back.

---

## 4. Speed

Measured in a test browser on a server, not on an iPad. [Proposal: these numbers are a first guide only.]

| | Old look | New look |
|---|---|---|
| Standing still, one frame | 3.5 ms | 4.0 ms |
| Walking, one frame (middle) | 4.6 ms | 6.0 ms |
| Walking, worst frame | 8.3 ms | 42 ms |
| Walking, computer slowed 4 times, worst frame | 77 ms | 228 ms |

- A frame must take under 16 ms for smooth movement.
- **How it stays fast:** the still ground is painted once into blocks of 8 × 8 squares and kept. While nothing new is needed, the next block towards the edge of the screen is painted ahead of the cadet. Only the water's glints and the tall grass move.
- **The worst frame** is when a new block must be painted at once. On a slow iPad that could be a short stutter, about once every 8 squares walked.
- **Taken out:** a soft darkening at the edges of the picture. It looked good, but cost 10 ms every frame in the test browser.
- **Must be checked on the older iPad** (the one bought used from the school). Walk from the ship to the Reach and watch for stutters.

---

## 5. Tests

Run on the sample, 24 November. **All pass.**
- `checks/bigworld_play_test.js prototypes/world_look_sample.html`: the whole big world played by taps and typing, on three screens. **Passes** (18 minutes). The first run failed on the phone: the "New look" button on the top bar took a tap meant for the ground. Fixed by moving it to the Ship panel.
- `checks/bigworld_signs_test.js`: **passes** (48 walks). `bigworld_reading_test.js`: **passes**. `bigworld_boxes_test.js`: **passes**. `bigworld_wander_check.js`: a measure, not a pass or fail; it ran.
- `checks/world_look_check.js` (new): all 12,288 squares painted and read; water looks like water, and nothing else does; the look switch leaves walking alone; the top bar is the big world's own. **Passes.** Its first run found a bridge square in the Reach drawn as plain water, with the pier post standing in the river. Fixed.

Not run: the game's own tests. The game was not touched.

I looked at the sample myself as pictures, at iPad sideways (1180 × 745), iPad upright (820 × 1180) and a phone (390 × 760), by the ship, the orchard, the river, the Reach, the old wall and the lake.

---

## 6. How it goes into the real big world

The big world thread owns `prototypes/big_world.html` and its link. I changed neither. Everything new is in three files of mine:

| File | What it is |
|---|---|
| `prototypes/world_look_kit.js` | The new look: one block of code between `WORLD-LOOK-BEGIN` and `WORLD-LOOK-END` |
| `prototypes/world_look_build.js` | Makes the sample: takes the big world page, puts the kit in, writes `world_look_sample.html`. It stops if the big world page has changed in a way it does not expect. |
| `prototypes/world_look_sample.html` | The sample. Made by the build script; do not edit it by hand. |

**To put it in the real page** (the big world thread's job, if you say yes), three changes, the same ones the build script makes:
1. Rename the page's `tall` function to `tallOld`.
2. Paste the kit just before `/* things on the map */`, without the "Old look" button.
3. In `drawMap`, call `WL.ground(...)` in place of the loop that draws each square's ground.

Then run the big world's tests again.

---

## 7. Decisions for you

1. **Do you like the new look?** If yes: should the big world thread put it into the real big world? [Proposal: yes, after you walk it on the older iPad.]
2. **Next:** the same kit for Chronosia, Xylophora and the mission ship, each with its own colours. [Proposal: Chronosia first. It has the most to do, and children reach it from the class link.]
   - Each planet stores its map its own way, so each needs a small adapter. About one session for each planet.
   - Xylophora keeps a light grid: there, the squares are the maths.
   - Chronosia's landing is still four fifths dark mist. New paint will not fix that (the art review said so on 20 November).
   - This is the main thread's file, so the main thread would do it.
3. **Characters** (option A of the art note): after the worlds, or now, in parallel?

---

## 8. What could prove this wrong

- **The children may find their way less easily.** Squares showed them where they could step. Without a grid, a child might not know a square is walkable. Watch whether they tap water or trees more often.
- **The earth bank sits on the water square below the land.** A child might think that brown strip is land and tap it. The cadet would not walk there.
- **A stutter on the older iPad.** See section 4.
- **The coast is still a little stepped,** in rounded waves, where the map's coast runs diagonally. Making it smooth would need a different way of drawing edges.
- **The children may like the old look.** Ask which they prefer, and why.

---

## 9. What I did not check

**Not checked:**
- a real iPad, or Safari. All pictures and times come from Chromium on a server.
- every corner of the map. I looked at six places.
- the Terrace Hills, the Canyon, Gate Mountain, the Dunes and the Prime Isles up close. They are not built yet; their ground uses the same kit.
