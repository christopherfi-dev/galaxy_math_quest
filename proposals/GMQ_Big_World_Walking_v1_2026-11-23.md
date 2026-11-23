# Algora: seeing far enough to explore (step 1)

**For:** Marc. **From:** the big world thread. **Date:** 23 November 2026.
**Page:** `prototypes/big_world.html` = `docs/bigworld/index.html` ("big world 6").

---

## 1. What you said [Source: `INFO_FROM_MARC.md`, 23 November]

- "I felt frustrated while walking around... I couldn't see very far. I didn't know where to go."
- "Why do we need a black mist? Is there any point in this game?"
- "I just also wanted them to experience the world and they just walk around and explore it."
- To the main thread's step 1: "we can try this and see what happens."
- To this thread, with the same photo: "Basically feels way too small [read from "smart"]. Compare the size of our character to the character in this Dragon Warrior II... I just wandered aimlessly around, trying to find things in the meadow."
- Going to bed: "You have a few hours to do work. Other than music, expanding the current world and making it more clear for students to walk around."

## 2. Our cadet against the game in your photo

Measured in pixels, from your photo and from pictures of Algora at iPad sideways (1180 × 745).
In your photo the game's picture is 1,145 pixels wide and 16 squares across, so one square is about 72 pixels.

| | The game in your photo | Algora before | Algora now |
|---|---|---|---|
| Squares across × down | 16 × 15 (the photo cuts off the bottom: 12.8 rows show) | 12.5 × 11.4 | **16 × 14.6** |
| Squares you could see at the start | 240 | about 137; the rest of the 169 on screen were under mist | **234** |
| How far you see from the hero | 8 squares sideways, 7 up and down | 6 (the mist) | **8 sideways, 7 up and down** |
| The hero | 64 × 72 px: one square | 42 × 71 px | **33 × 54 px** |
| The hero's height, as a share of the picture's height | 6.7% | 9.5% | **7.2%** |
| A tap at the edge of the picture | (the game has no taps) | walked 6 squares, then stopped at the mist | **walks there** |

**What this says:**
- The cadet's size was never the main cause. Before, it was about one square, like the hero in your photo, only a little taller on the screen.
- The causes were the mist (6 squares), the walk that stopped at the mist, and nothing to aim for.
- Now the cadet is about the hero's height on the screen, and you see about as many squares as in your photo.
- **One difference remains** [Source: the main thread's measurement]: in that game a whole town fits in one square. In Algora one square holds one tree. So each square of Algora shows less of the world. Step 3 is for that, if it matters.

## 3. What changed

You said "we can try this and see what happens," so step 1 is built. Each part can be undone on its own.

**Step 1, as planned**
1. **No black mist on the walking screen.** The Map still fills in, with every square that has been on your screen.
2. **16 squares across on an iPad, held either way.** About 51 pixels a square: about 1 cm under a finger. The rows follow the picture's shape: 14.6 sideways, 13.9 upright. So it is 16 × 15, as in your photo. Phones are not changed (see section 6).
3. **Paths.** New paths to the orchard keeper, the fisher and the old Mender. Paths are now worn earth, a darker brown. Before, they were the colour of the beach, so the beach looked like a wide road.
4. **Landmarks.** Every person in the Meadow stands at something you can pick out from across the screen:

| Person | Where they stand | What changed |
|---|---|---|
| Elder Rivet | Mender Village, with its "!" when he has news [the game calls him "he"] | nothing |
| the gardener | the first bend of the path from the ship, in sight of the ship | nothing |
| the fisher | the pond | a path to the fisher |
| the reed cutter | the reed bed by the old stones | nothing |
| the orchard keeper | the side of the orchard ("Four rows of six trees. I count them every day.") | a path to the keeper |
| the Mender with big ears | **the broken bridge**, listening across the river | moved from open grass (square 38,72) to the bridge (44,75) |
| the old Mender | **a big old tree** in the middle of the meadow | the tree is new, with a path |

In the Reach every person already stood on a road, at a town, the harbour or the gate.

**Added tonight, to make walking clearer** (you asked for this before bed)
5. **Three signposts at forks.** Arrow boards point along each path, with a short label: "← Old wall · Hill →", "↓ Orchard · Bridge →", "↑ Old stones · Bridge →". Tap one to read it in full. They use the elder's own words: "The machines are by the pond, on the hill, by the old wall and in the orchard."
6. **The sign by the ship tells the truth now.** It said "MENDER VILLAGE, north". North of it is the path to the pond. It now says "MENDER VILLAGE, east, then north." (Section 4 shows what the old sign did.)
7. **"go north" follows the path** to the next fork, and stops beside anyone on the way. Before, it went 4 squares in a straight line and often ended on the grass. Off a path it now walks up to 8 squares.

**Fixed after an independent review of the pictures** (section 8)
8. New places came into view under the Map, Needs and Ship buttons. The cadet now sits in the middle of the part of the picture the buttons leave clear.
9. A tap on something that cannot be reached (across water, behind a shut gate) walked to the bank and then talked to it anyway. Now it says "You cannot get there yet."
10. A tap anywhere walks there by any way, seen or not. There is no mist left to hide anything.
11. The cadet could walk under the big tree's leaves and vanish. Those squares are blocked now.
12. The old Mender and the listener stood on the cadet's helmet. Now one stands beside the cadet, the other in front.
13. The old Mender's button said "old". It says "old Mender".
14. "look" near the big tree names it.
15. **The Map:** machine dots were the grey of rocks (now dark grey and larger). A region's name sat on a dot (names keep off the dots now). Flowers looked like pink markers (now pale green). Lands not built yet are no longer named when you see them over a wall. "Brown dot: the village", because paths are brown too.

## 4. A check that can get lost

The play test never gets lost: it knows where everything is. So I wrote `checks/bigworld_wander_check.js`.
- Its made-up children know only the name of what they look for. They see only what is on the screen.
- They tap the thing once it is on screen. They follow paths. They read a signpost that names it. Otherwise they tap somewhere new.
- Each starts at the ship. 1,000 children for each thing. After 40 taps, a child gives up.

Taps for the middle child, and how many gave up:

| Looking for | Old page | New page |
|---|---|---|
| Mender Village | 12 taps, 11% gave up | **3, 0%** |
| Pond Machine | 3, 12% | **2, 1%** |
| Wall Machine | 9, 14% | **4, 1%** |
| Hill Machine | 18, 17% | **6, 0%** |
| Orchard Machine | 8, 10% | **6, 0%** |
| the orchard keeper | 21, 52% | **7, 0%** |
| the old Mender | 5, 3% | **3, 0%** |
| the fisher | 6, 21% | **3, 2%** |
| the reed cutter | 12, 8% | **10, 1%** |
| the bridge | 7, 0% | **6, 0%** |
| the old stones | 13, 13% | **9, 0%** |

**What it showed:**
- **Most of the gain is the mist.** With the old mist put back, the new paths, landmarks and signs alone help less: the keeper 12 taps and 11% gave up, the Wall Machine 10 and 16%. The village is 4 taps even with the mist: that is the corrected sign.
- **The old sign by the ship made things worse.** On the old page, a child who never read it found the village in 3 taps (2% gave up). A child who read "north" and went north took 12 (11% gave up). The new sign gives 3 taps either way.
- The signs help a little elsewhere: the bridge, the old stones, the Wall Machine.
- **The reed cutter is still the hardest** (10 taps). No sign or landmark names the reeds.

**What it cannot tell you:** it is a model, not a child. It never misreads a sign. It does not spot a landmark before the person at it. Use it to compare two versions of the page, not to promise how long your class takes. Only children can say that (section 7).

## 5. What I chose. Each is yours to change [Proposal]

1. **What counts as seen:** every square that has been on the screen. With 6 squares round the cadet, the Map would stay dark where the child clearly saw land.
2. **The big old tree.** It is new, and it is not in the story. It has no word to type: a word like "tree" would make the cadet cross the meadow whenever a child typed "look tree" near any tree. The story thread may want to name it.
3. **Moving the listener** to the bridge. The listener's own lines are about hearing the Rillfolk across the river.
4. **The three signposts,** what they say, and the new words on the ship's sign.
5. **The path colour.**
6. **"go" follows a path** to the next fork.
7. **The cadet sits a little below the middle** of the picture, so the buttons hide less of what is ahead.
8. **The cadet is drawn as before** (1.3 squares tall), so it shrank with the squares.

## 6. Not done. Some are yours to decide

- **Phones.** Squares stay at 36 pixels (about 6 mm), so a phone still shows 10.8 × 11 squares, and the buttons still cover the village when you walk north. Smaller squares would be too small for fingers. Which device did you play on?
- **"go to [name]"** works for anyone who has been on the screen, even someone never met. Limiting it to people met is your call (the main thread's option 6).
- **Upright iPad:** about 250 pixels of the desk below the picture are empty. The picture could be taller. It is a layout change, so I left it.
- **Step 3, one screen at a time:** only if children still get lost.
- **People on the Map:** not built.
- **Hidden things.** The rubble, the hollow log and the bottle can now be seen from about 8 squares away, not 6. They are still off the paths.
- **From the bridge you can see the far bank's path to the old stones.** It is a second way across, not a secret.
- **A child who met the listener at the old place will find the listener moved.** Low harm.
- **Most people still stand straight above the square the cadet stands on,** as they always have, so the cadet's helmet covers their feet. I fixed only the two I moved. Changing everyone is a bigger change.

## 7. Step 2: what to watch when two or three children play [Source: the main thread's plan]

- How long from landing to finding Elder Rivet.
- Taps that lead nowhere.
- Whether they leave the path to explore.
- Whether they read the signposts. Do they tap them?
- Whether they find the hidden things too easily now.

**What could prove step 1 wrong:**
- Children still wander and do not know where to go.
- At 51 pixels, children's taps land on the wrong square.
- Children never leave the paths, because the paths are too strong.

## 8. What ran

- **The page's own checks:** numbers (20,000 children), the Reach's numbers (20,000), music, the map (the builder, the world check, 15 broken copies caught). All pass.
- **The play test, version with step 1 only:** every part, by taps and typing, at iPad sideways, iPad upright and phone. **Passes, no faults.**
- **The play test, version with the signs and the review's fixes:** **passes, no faults**, at all three sizes. (Its first run stopped on iPad upright. That was a fault in the test, not the page: a tap meant to walk was pushed to the screen's edge and landed on the red spinner, which picked it up, as a child's tap would. The test now taps the ground beside things.)
- **`checks/bigworld_wander_check.js`:** section 4. About 40 seconds for each run.
- **Pictures:** I looked at 15 places at three sizes, and at the Map.
- **An independent review of 20 pictures and the change.** It found 6 faults that matter and several small ones. Section 3, items 8 to 15, are its findings that I fixed. Section 6 lists the rest.
- **Not run:** a real iPad, a real child. The size test (`checks/bigworld_size_test.js`) checks an older test page that this change does not touch.
- **Shortcut:** most pictures were taken by placing the cadet on a square, not by walking there. The play test does walk.
