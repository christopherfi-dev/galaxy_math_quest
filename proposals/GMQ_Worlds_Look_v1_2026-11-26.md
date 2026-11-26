# The worlds of the class game: a new look for Chronosia (and why not Xylophora)

**Date:** 26 November 2026, while Marc slept. **For:** Marc and the main thread. **The class game is not changed:** this is a copy, `prototypes/worlds_look_sample.html`, on the demo link.

**Marc's asks** [Source: Marc, 26 November]:
- "Can you look at the other worlds? Should we start updating the characters on those? Or filling them in or looking at the visual design?"
- "Push what you can."

**Where to see it:** https://christopherfi-dev.github.io/galaxy_math_quest/lookdemo/worlds/. It holds both worlds in their new look: Stardust's ship (`GMQ_Stardust_Look_v1_2026-11-26.md`) and Chronosia's map.
- In the Teacher row, tap "Go to Chronosia" or "Go to Stardust".
- "World look: new/old" switches both.
- It keeps its own saved game.

**Old and new:** `GMQ_Chronosia_Old_New_v1_2026-11-26.jpg`.

---

## 1. Chronosia: drawn like the big world's new look

Chronosia's map is scenery: its tasks are about time and happen in close-up pictures. So its ground can change, as the big world's did:
- soft grass with tufts, in place of the checkerboard;
- the sand path with rounded corners where it turns or ends;
- the river with a bank and a light edge;
- a plank bridge with rails;
- mountains with a lit side, a shadow side and snow;
- round trees with a trunk and a shadow.

**Kept exactly:**
- which square is what;
- the river's ripples, fast on the left and slow on the right, as the game has them;
- the fire-trees' glowing fruit;
- the sundial stones, and the sundial once it is found;
- the fog;
- every place's own picture and name, which the game draws on top.

---

## 2. Why Xylophora keeps its squares

The game says: "The ground is a patchwork of squares." Xylophora's tasks are about area:
- the herder's field;
- the shape painted on the ground;
- the factory's ledge.

Children count the squares. Smoothing the ground, as I did for Algora and Chronosia, would remove the squares they count. So Xylophora's ground stays as it is [Claude's decision; Marc can overrule it].

**What could still change there** without touching a square anyone counts [Proposal, not built]:
- the trees and rocks, as on Chronosia;
- the water;
- the edges of the map.

---

## 3. Tests

The game's own tests, run on this copy (a copy of each test that opens the copy in place of the game; the tests themselves are the main thread's):

| Test | Result |
|---|---|
| `chronosia_test.js` | **PASS** (the clocks, quakes, timetable and map; 20,000 seeds; no console errors) |
| `chronosia_story_test.js` | **PASS** on three screens (153 lines read) |
| `chronosia_links_test.js` | **PASS** on three screens |
| `stardust_test.js` | **PASS** on three screens (section 5) |

- **Looked at** as pictures at iPad sideways, iPad upright and phone sizes: on landing, with every square seen, and old against new.
- **Not run:** the station's, Voltara's, Xylophora's and the small worlds' tests. Only Chronosia's map drawing and Stardust's ship drawing differ from the game, plus one Teacher button, the save key, the title and the version line.

---

## 4. For the main thread: how to put it into the game

When Marc says so.

1. **Paste `prototypes/chrono_look_kit.js` (`CHLK`) just before `function drawCMap(dt) {`.**
2. **In `drawCMap`,** wrap the ground loop (`for (let y = 0; y < CH; y++) … if (!cSeen(x, y)) continue; …`):
   - with `if (CHLK.on) CHLK.ground(X, Y, ts, c); else { … }`;
   - the `else` holds the old loop, unchanged;
   - the `}` goes just before `fDraw('chrono', X, Y, ts);`.
3. **Stardust:** as in `GMQ_Stardust_Look_v1_2026-11-26.md`, section 5.
4. **Optional:** the Teacher button `t_slk` ("World look: new/old"). It switches both. Without it, the new look is always on.

`prototypes/worlds_look_build.js` shows the exact text of every change. It stops if the game has changed under it.

---

## 5. The Stardust test on this copy

**PASS** on this copy (Stardust's ship and Chronosia's map both in their new look), on three screens: all four quests and both side jobs played, no console errors.

---

## 6. What could prove this wrong

- **The new Chronosia look is quieter than the old checkerboard.** If children lose the path, its edges can be darker.
- **Seen only in a browser on a computer.** Open the link on the oldest class iPad.
